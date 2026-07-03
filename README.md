# WorkflowOS AI Agent

WorkflowOS is an AI workflow diagnostic and implementation prototype that turns messy business process notes into workflow health scores, next-best actions, suggested automations, human-review checkpoints, and phased implementation blueprints.

It was built to demonstrate practical AI implementation thinking across customer success, RevOps, recruiting, workforce planning, insurance operations, healthcare marketing ops, and enterprise AI adoption — the workflow families that anchor most real AI-implementation, RevOps, and CS roles.

> **Business problem first. Workflow second. AI third.**

**Live demo:** https://workflowos-ai-agent.vercel.app
**Repo:** https://github.com/jlbvxf87/workflowos-ai-agent

## What it demonstrates

- **AI workflow design** — structured diagnostic output over freeform generation, streamed for real-time UX
- **Business process mapping** — 7 workflow families with domain-specific prompting, not one generic prompt
- **Human-in-the-loop by default** — the schema forces every diagnosis to name where a human must stay in the loop
- **RevOps and CRM systems thinking** — real language: pipeline hygiene, stage histories, forecast rollups, deal-desk cycle
- **Customer success risk scoring** — leading vs lagging indicators, onboarding time-to-value, churn early-warning
- **Recruiting pipeline diagnostics** — funnel-stage conversion, interviewer load balance, offer-accept regressions
- **Revenue signal prioritization** — every recommendation is scored by effort and payoff
- **Rapid product prototyping** — Next.js 16 + Vercel AI SDK + Claude, deployed to Vercel in a day

## How it works

1. Pick one of 7 workflow types
2. Paste a messy workflow description (or load a sample)
3. The `/api/analyze` route streams a structured JSON diagnosis via [`streamObject`](https://ai-sdk.dev/) against Claude Sonnet 4.6
4. The client renders each section (summary, health score, leaks, next actions, automation, human-review steps, blueprint) as the object fills in — no post-hoc parsing, no spinners

The schema (`lib/schema.ts`) is the contract. It enforces:
- Score anchored 0-100 with an explicit rationale
- Leaks tagged by severity
- Next-best actions ranked by effort × payoff
- Automation suggestions named with specific tools (not "AI")
- At least one non-negotiable human-review gate
- Phased implementation blueprint (Phase 1 / Phase 2 / Phase 3 — never calendar weeks)

## Local development

Requires Node 20+.

```bash
git clone <repo-url>
cd workflowos-ai-agent
npm install
cp .env.local.example .env.local   # then fill in ANTHROPIC_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable            | Purpose                                          |
| ------------------- | ------------------------------------------------ |
| `ANTHROPIC_API_KEY` | Claude API key. Any workspace key with Sonnet access works. |

Never commit `.env.local`. `.gitignore` already blocks `.env*`.

## Deploy to Vercel

1. Push this repo to GitHub
2. Import into Vercel — auto-detects Next.js
3. Add `ANTHROPIC_API_KEY` as a Production environment variable
4. Deploy

The `/api/analyze` route is annotated with `maxDuration = 60` — sufficient for Sonnet 4.6 on the standard Vercel Functions timeout tier.

## Architecture at a glance

```
app/
  page.tsx                     # client — orchestrates state, streams diagnosis via useObject
  api/analyze/route.ts         # server — streamObject → toTextStreamResponse
  layout.tsx                   # fonts, metadata, dark-mode-aware shell
components/
  WorkflowSelector.tsx         # 7 workflow types (shadcn/ui Select)
  DiagnosticInput.tsx          # textarea + load-sample + submit
  DiagnosisOutput.tsx          # renders summary, score, leaks, actions, automation, human-review
  BlueprintMap.tsx             # phased vertical step-map of the implementation blueprint
lib/
  workflows.ts                 # 7 workflow types + shared enums
  schema.ts                    # zod diagnosis contract
  prompts.ts                   # base + per-workflow system prompts
  sampleWorkflows.ts           # realistic sample contexts for each workflow
  scoring.ts                   # score → color/label helpers
docs/
  architecture.md              # design decisions and trade-offs
  company-fit.md               # framework for per-company fit analysis
  <company>.md                 # one file per target company
```

## Company-fit deep dives

Under `docs/`, one file per target company: how a specific WorkflowOS workflow maps to that company's real operational problem, and how I would implement it in production.

## The optional operator layer

WorkflowOS is the public diagnostic layer. In production, it's designed to pair with a private local-first agent runtime (an operator-style Hermes layer) that handles multi-turn workflow execution, tool-use, contact and pipeline state, and human-in-the-loop task orchestration. The private layer is intentionally out of scope for this public demo — the diagnostic contract is the interesting part.

## License

MIT — see `LICENSE`.
