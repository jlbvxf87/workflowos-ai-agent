"use client";

// The visitor-facing agent chat panel — collapsed by default, expands to a
// full chat with streaming tokens.
//
// Transport shape: POST /api/ask returns an OpenAI-compatible SSE stream
// (Hermes api_server platform). Each event line is `data: {json}` where json
// has `choices[0].delta.content` — text tokens to append. `data: [DONE]` closes.
//
// We don't use the AI SDK's `useChat` here because Hermes emits OpenAI SSE, not
// the AI SDK's own data-stream shape. Rolling the parser inline is ~30 lines
// and keeps the dependency surface honest for a portfolio demo.

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Message = { role: "user" | "assistant"; content: string };

export function AskAgentPanel() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const send = async () => {
    const text = input.trim();
    if (!text || isStreaming) return;
    if (text.length > 2000) {
      setError("Message too long (2000 char cap for the demo).");
      return;
    }

    setError(null);
    const nextMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setIsStreaming(true);

    // Placeholder assistant message that we'll stream into.
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!res.ok || !res.body) {
        let msg = `Request failed (${res.status}).`;
        try {
          const j = await res.json();
          if (j?.error) msg = j.error;
        } catch {}
        setError(msg);
        // Drop the empty assistant placeholder.
        setMessages((prev) => prev.slice(0, -1));
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        // Parse SSE events split by blank line.
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const evt of events) {
          const line = evt
            .split("\n")
            .map((l) => l.trim())
            .find((l) => l.startsWith("data:"));
          if (!line) continue;
          const payload = line.slice(5).trim();
          if (!payload || payload === "[DONE]") continue;
          try {
            const parsed = JSON.parse(payload);
            const delta = parsed?.choices?.[0]?.delta?.content;
            if (typeof delta === "string" && delta) {
              setMessages((prev) => {
                const copy = prev.slice();
                const last = copy[copy.length - 1];
                if (last?.role === "assistant") {
                  copy[copy.length - 1] = { ...last, content: last.content + delta };
                }
                return copy;
              });
            }
          } catch {
            // Non-JSON keepalive or comment line. Ignore.
          }
        }
      }
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      console.error(e);
      setError("Stream interrupted. Try again.");
      setMessages((prev) => (prev[prev.length - 1]?.content ? prev : prev.slice(0, -1)));
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  };

  const stop = () => {
    abortRef.current?.abort();
    setIsStreaming(false);
  };

  if (!open) {
    return (
      <section className="mt-10">
        <Card
          className="cursor-pointer border-dashed transition-colors hover:border-solid hover:border-foreground/40"
          onClick={() => setOpen(true)}
        >
          <CardContent className="flex flex-wrap items-center justify-between gap-3 py-5">
            <div className="flex-1 min-w-[240px]">
              <div className="mb-1 flex items-center gap-2">
                <Badge variant="secondary">Live agent</Badge>
                <span className="text-xs uppercase tracking-widest text-muted-foreground">
                  Ask WorkflowOS anything
                </span>
              </div>
              <p className="text-sm">
                This site is agent-backed. Ask a workflow question and watch the runtime think in real time.
              </p>
            </div>
            <Button variant="outline">Open chat →</Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="mt-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div>
            <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground">
              Ask WorkflowOS Agent
            </CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              Public agent surface. Routed through a local runtime. Rate-limited.
            </p>
          </div>
          <button
            type="button"
            className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
            onClick={() => setOpen(false)}
          >
            Close
          </button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-h-[420px] space-y-4 overflow-y-auto rounded-md border border-border/60 bg-muted/20 p-4">
            {messages.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Try: <em>&quot;How would you diagnose a Customer Success workflow with an 87% GRR
                and no leading indicators in the health score?&quot;</em>
              </p>
            )}
            {messages.map((m, i) => (
              <div key={i} className="text-sm">
                <div className="mb-1 flex items-center gap-2">
                  <Badge
                    variant={m.role === "user" ? "outline" : "secondary"}
                    className="text-[10px] uppercase tracking-widest"
                  >
                    {m.role === "user" ? "You" : "Agent"}
                  </Badge>
                  {m.role === "assistant" && isStreaming && i === messages.length - 1 && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                      <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
                      streaming
                    </span>
                  )}
                </div>
                <div className="whitespace-pre-wrap leading-relaxed">
                  {m.content ||
                    (m.role === "assistant" && isStreaming
                      ? "Thinking…"
                      : "")}
                </div>
              </div>
            ))}
          </div>

          {error && (
            <p className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a workflow question…"
              rows={3}
              className="resize-y font-mono text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  send();
                }
              }}
              disabled={isStreaming}
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {input.length}/2000 · ⌘/Ctrl+Enter to send · 3 questions per visitor per hour
              </p>
              {isStreaming ? (
                <Button variant="outline" onClick={stop}>
                  Stop
                </Button>
              ) : (
                <Button onClick={send} disabled={!input.trim()}>
                  Send
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
