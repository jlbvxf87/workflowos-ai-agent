# The Hermes runtime layer

WorkflowOS is a **two-layer system.**

| Layer | Where it lives | What it does | Public? |
| --- | --- | --- | --- |
| Diagnostic | `app/`, `lib/`, `components/` (this repo) | Zod-schema-enforced diagnosis via streamed `streamObject` against Claude | ✅ |
| Runtime (Hermes) | Local Mac mini, private | Multi-step agent loop, tools (web search, doc read, workflow analysis), sessions, human-in-the-loop, cron | 🔒 |

The public site (`workflowos-ai-agent.vercel.app`) hosts the diagnostic layer. The runtime layer runs privately on my hardware.

## The public agent chat surface

There's one exception to the "runtime is private" rule: the **"Ask WorkflowOS Agent"** panel on the home page. That endpoint (`/api/ask`) is a scoped bridge to Hermes.

```
visitor's browser
   │  POST /api/ask
   ▼
Vercel Function (this repo, app/api/ask/route.ts)
   │  https + bearer token, cloudflared tunnel
   ▼
127.0.0.1:8642 on the Mac mini
   │
   ▼
Hermes api_server platform (OpenAI-compatible chat.completions)
   │
   ▼
Hermes agent loop — Claude Sonnet 4.6 + tool use + session state
   │
   ▲  SSE stream back through every hop
```

## Guardrails on the public bridge

The public bridge doesn't expose "the whole Hermes." Every visitor request passes through:

1. **Kill switch.** `ASK_DISABLED=1` in Vercel env instantly routes all traffic to `503`. Deploys in seconds.
2. **Rate limits.** 3 requests per visitor per hour, 40 requests per hour globally. In-memory (best-effort per Function instance) — good enough for a portfolio surface, not enough for scale.
3. **Bearer auth on the tunnel.** Hermes rejects any request without the shared `HERMES_API_KEY`. Someone who finds the raw tunnel URL still can't drive the agent.
4. **CORS lock.** Hermes's `API_SERVER_CORS_ORIGINS` allows only `workflowos-ai-agent.vercel.app` and `localhost:3000`. Browser-based abuse from other origins is blocked at the runtime layer.
5. **Public-agent system prompt.** Prepended by the Vercel route on every request. Instructs the agent to introduce itself as "the WorkflowOS agent" (not Hermes), refuse to expose paths / keys / private data / personal accounts, and stay on-topic to workflow diagnostics.
6. **Message caps.** 2000-char per user message. Model output capped at 1200 tokens.
7. **No tools reach private services.** The tools available in this context are read-only or synthesizing — no writes to personal Gmail, Supabase, Telegram contacts, or ad accounts. Those live on separate toolsets not enabled on the api_server platform.

## Why not just make Hermes fully public?

Because Hermes is a real agent with real tools connected to real data. Left unlocked, a single prompt-injection payload from a visitor could:

- Send email from a personal Gmail
- Read a Supabase table with someone else's business context
- Post to a private Telegram channel
- Rack up an Anthropic bill unbounded

None of that is worth the "wow" of "the demo runs on my actual system." Splitting the layers keeps the demo demonstrable and the private data private.

## Uptime

The public agent surface has three moving parts, in decreasing order of stability:

1. **Vercel Function** — always on
2. **cloudflared tunnel** — supervised by launchd (`ai.hermes.tunnel`), auto-restarts, auto-syncs a fresh URL to Vercel env on every reconnect
3. **Hermes gateway** — supervised by launchd (`ai.hermes.gateway`), auto-restarts, in-flight sessions persist to SQLite

If the Mac mini reboots, all three come back automatically and the public chat is live within ~60 seconds.

## What Hermes does beyond this endpoint (not visible on this site)

- Ingests messages from Telegram DMs and channels
- Runs cron-scheduled research and drafting tasks
- Coordinates with Supabase-backed operator state (Mercenary 7 and Gus Command Center)
- Handles human-in-the-loop approval flows on destructive tool calls
- Persists sessions across gateway restarts

If you want to see any of it live, that's an interview conversation, not a public URL.
