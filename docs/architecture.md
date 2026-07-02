# Architecture

## Design principles

**1. The schema is the product.**
A generative UI without a structured contract collapses into freeform text. WorkflowOS pins the diagnosis to a strict Zod schema — every rendered card is a schema field. The model earns the right to say something only if it fits the shape.

**2. Streamed structured output, not chat.**
The demo uses `streamObject` from the Vercel AI SDK, which streams a JSON object as it's built. Users see the summary render, then the health score, then leaks fill in one-by-one. There is no chat loop, no "regenerate" button, no wait-and-blank state.

**3. One prompt per workflow domain.**
Rather than a single "generic diagnostic" prompt, `lib/prompts.ts` composes a shared base system prompt with a workflow-specific overlay. The overlays name the leading indicators, distinguishable failure modes, and non-negotiable human-review gates that domain practitioners actually care about — e.g. MLR for healthcare marketing, underwriter judgment for insurance, moving hiring bars for recruiting.

**4. Human-in-the-loop as a first-class field.**
The schema requires at least one `humanReview` entry per diagnosis. A model that wants to say "automate everything" cannot — the shape forbids it. This is deliberate: the demo signals to a recruiter that the author thinks about where automation *shouldn't* go.

**5. Phase labels, never calendar labels.**
The schema description tells the model to label the blueprint as "Phase 1 / Phase 2 / Phase 3" — never "Week 1" or "Day 1". Real implementations never fit calendar weeks, and calendar-labeled plans age badly the moment reality intrudes.

## Stack decisions

| Choice | Why | Alternative considered |
| --- | --- | --- |
| Next.js 16 App Router | Streaming route handlers, native `maxDuration` config, deploys cleanly to Vercel Functions | Remix — good, but AI SDK ergonomics are best on Next |
| Vercel AI SDK v7 | `streamObject` + `useObject` is the shortest path to streamed structured output with real type inference | Direct Anthropic SDK — works, but the client-side JSON assembly is manual |
| Claude Sonnet 4.6 | Best structured-output-following ratio to cost at Sonnet tier; adheres to complex Zod schemas reliably | Haiku 4.5 — cheaper but softer on schema fidelity; Opus 4.7 — overkill for this workload |
| Zod schema | Runtime + build-time contract, plays natively with `streamObject` | JSON Schema hand-written — more boilerplate, weaker types |
| shadcn/ui | Copy-in components you own, recruiters recognize the look, Tailwind-native | Hand-rolled Tailwind — slower, less polished; MUI/Chakra — heavier, less current |
| Streamed JSON, not tokens | Users see field-by-field progress, which reads as "the model is thinking about the leaks" — better UX than a chat completion stream | Chat token stream — feels chatty, doesn't map to a diagnostic |

## Data flow

```
Client (page.tsx)
  │
  │  useObject({ api: "/api/analyze", schema: diagnosisSchema })
  │  submit({ workflowId, context })
  ▼
POST /api/analyze  ──►  buildAnalyzePrompt(workflowId, context)
  │                          │
  │                          ├─► BASE_SYSTEM (rules, principles)
  │                          └─► WORKFLOW_PROMPTS[workflowId] (domain overlay)
  │
  ▼
streamObject({ model: claude-sonnet-4-6, schema, system, prompt })
  │
  ▼
toTextStreamResponse()  ──►  useObject.object  ──►  DiagnosisOutput
                                                      ├─ WorkflowSummary
                                                      ├─ HealthScoreCard
                                                      ├─ LeaksList
                                                      ├─ NextActionsList
                                                      ├─ AutomationList
                                                      ├─ HumanReviewList
                                                      └─ BlueprintMap
```

Each output card is guarded by an existence check on its schema slot, so partial objects render progressively instead of flickering.

## Non-goals

- **No auth, no accounts, no persistence.** This is a public demo. Adding those would signal "unfinished SaaS wannabe", not "focused prototype".
- **No stored history of diagnoses.** Each analysis is stateless. A production version would persist diagnoses to Supabase or Postgres and let users compare workflow health over time.
- **No editable output.** A "regenerate section" or "edit the blueprint" affordance would be genuinely useful in production but doubles the surface area and hides the structured-output pattern behind chat noise.

## What a production version would add

1. **Auth + workspace** — Clerk on the Vercel Marketplace, Supabase for org state
2. **Diagnosis history + versioning** — every workflow gets a running log; changes tracked over time
3. **Operator layer integration** — the diagnostic is upstream of an execution runtime (Hermes-style local-first agent) that runs the next-best actions, tracks outcomes, and updates the score
4. **Multi-tenant company-fit templating** — the `docs/<company>.md` framework productized as customer-specific playbooks
5. **Evaluation harness** — a golden set of workflow contexts + expected diagnoses, run on every prompt change

## Deploy target

Vercel Functions (Node.js runtime, `maxDuration = 60`). Sonnet 4.6 typically returns a complete diagnosis in 25-45 seconds; the 60-second ceiling is comfortable headroom.

If cold-start latency became a real issue in front of recruiters, the next step would be moving to Vercel AI Gateway with provider failover and warming the target region — but for a portfolio demo that's premature.
