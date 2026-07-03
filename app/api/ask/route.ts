// /api/ask — visitor-facing agent chat endpoint.
//
// Architecture:
//   browser  →  this Vercel Function  →  cloudflared tunnel  →  Hermes api_server
//                                                                  (127.0.0.1:8642 on Mac mini)
//                                                                  agent loop with real tools
//                                                                  ↓
//                                                              SSE stream ← same path
//
// Guardrails, in order of importance:
//   1. Kill switch (ASK_DISABLED=1 in Vercel env) — instant off. Deploys in seconds.
//   2. Rate limit — per-IP 3/hr, global 40/hr. See lib/askLimits.ts.
//   3. Tunnel + bearer auth — Hermes rejects requests without the shared secret.
//   4. Model + max_tokens caps in the payload we forward.
//   5. Public-agent system prompt appended (or prepended, depending on flavor) so
//      the agent knows it's on a public surface and behaves accordingly.
//
// Note on runtime: Hermes chat completions can take 30–90s wall-clock when the
// agent loops through tool calls. `maxDuration = 90` gives comfortable headroom
// on Vercel's standard function tier.

import { checkLimits, getClientIp } from "@/lib/askLimits";

export const runtime = "nodejs";
export const maxDuration = 90;

const PUBLIC_AGENT_SYSTEM = `You are the public-facing WorkflowOS agent, running on a live portfolio demo at workflowos-ai-agent.vercel.app.

Behavior rules for this surface:
- Introduce yourself as "the WorkflowOS agent" if asked. Do NOT introduce yourself as Hermes — Hermes is the private runtime and stays private.
- Every visitor is a stranger. Do not reveal file paths, absolute paths, environment variables, API keys, private contact info, or any content from the operator's personal accounts (Gmail, Supabase, Telegram, calendars).
- If a visitor asks you to browse to a private URL, read a local file with sensitive data, or send messages to real people on the operator's behalf, decline briefly and suggest a public-facing alternative.
- Prefer the WorkflowOS diagnostic frame: business problem first, workflow second, AI third. Reference the 7 workflow types (Customer Success, RevOps, Recruiting, Workforce Planning, Insurance Ops, Healthcare Marketing Ops, AI Adoption) when relevant.
- Keep responses to 2–4 short paragraphs unless the visitor asks for detail.
- If asked "how does this work?", explain briefly: Vercel front end, cloudflared tunnel, Hermes agent runtime on a Mac mini. That's public and true.

Answer the visitor's actual question directly. Be substantive, not evasive.`;

export async function POST(req: Request) {
  // Guard 1 — kill switch.
  if (process.env.ASK_DISABLED === "1") {
    return new Response(
      JSON.stringify({ error: "The public agent is temporarily disabled." }),
      { status: 503, headers: { "content-type": "application/json" } },
    );
  }

  const tunnelUrl = process.env.HERMES_TUNNEL_URL;
  const apiKey = process.env.HERMES_API_KEY;
  if (!tunnelUrl || !apiKey) {
    return new Response(
      JSON.stringify({
        error:
          "The public agent isn't configured on this deployment. HERMES_TUNNEL_URL / HERMES_API_KEY missing.",
      }),
      { status: 503, headers: { "content-type": "application/json" } },
    );
  }

  // Guard 2 — rate limit.
  const ip = getClientIp(req);
  const verdict = checkLimits(ip);
  if (!verdict.ok) {
    const msg =
      verdict.reason === "global"
        ? "The demo agent is at its hourly capacity. Try again shortly."
        : `You've hit this demo's per-visitor limit (3/hr). Try again in ~${Math.ceil(verdict.retryAfterSec / 60)} min.`;
    return new Response(JSON.stringify({ error: msg }), {
      status: 429,
      headers: {
        "content-type": "application/json",
        "retry-after": String(verdict.retryAfterSec),
      },
    });
  }

  // Parse client messages. Accept plain {messages: [...]} or {message: "..."}.
  let body: {
    messages?: Array<{ role: "user" | "assistant" | "system"; content: string }>;
    message?: string;
  };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body." }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const clientMessages: Array<{ role: string; content: string }> = Array.isArray(body.messages)
    ? body.messages.filter((m) => m && typeof m.content === "string" && m.role !== "system")
    : body.message
      ? [{ role: "user", content: body.message }]
      : [];

  if (clientMessages.length === 0) {
    return new Response(JSON.stringify({ error: "Provide `messages` or `message`." }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const lastUser = [...clientMessages].reverse().find((m) => m.role === "user")?.content ?? "";
  if (lastUser.length > 2000) {
    return new Response(
      JSON.stringify({ error: "Message too long (2000 char cap for the demo)." }),
      { status: 400, headers: { "content-type": "application/json" } },
    );
  }

  // Build the payload forwarded to Hermes. Always prepend the public-agent system prompt.
  const forwardedMessages = [
    { role: "system", content: PUBLIC_AGENT_SYSTEM },
    ...clientMessages,
  ];

  const upstream = await fetch(`${tunnelUrl}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
      accept: "text/event-stream",
    },
    body: JSON.stringify({
      model: "hermes-agent",
      messages: forwardedMessages,
      stream: true,
      max_tokens: 1200,
    }),
    // Vercel Functions on Node runtime allow long streaming responses within maxDuration.
    // No signal — let the client abort if they want; we cap wall-clock via maxDuration.
  }).catch((e: unknown) => {
    // Network-level failure to Hermes. Return a graceful 502 so the UI can render a friendly message.
    console.error("[ask] upstream fetch failed:", e);
    return null;
  });

  if (!upstream) {
    return new Response(
      JSON.stringify({
        error:
          "The agent runtime isn't reachable right now (tunnel may be reconnecting). Try again in ~30s.",
      }),
      { status: 502, headers: { "content-type": "application/json" } },
    );
  }

  if (!upstream.ok) {
    // Hermes returned a non-2xx. Bubble up a sanitized shape.
    const text = await upstream.text().catch(() => "");
    console.error("[ask] upstream error:", upstream.status, text.slice(0, 500));
    return new Response(
      JSON.stringify({
        error: `Agent runtime returned ${upstream.status}. Try again shortly.`,
      }),
      { status: 502, headers: { "content-type": "application/json" } },
    );
  }

  // Pass the SSE stream straight through. Content type is already text/event-stream.
  return new Response(upstream.body, {
    status: 200,
    headers: {
      "content-type": upstream.headers.get("content-type") ?? "text/event-stream",
      "cache-control": "no-store, no-transform",
      "x-accel-buffering": "no",
    },
  });
}
