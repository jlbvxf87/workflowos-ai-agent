# NeoGov — AI Adoption workflow

## Company fit

NeoGov is the dominant HR software vendor for US state and local government — hiring, onboarding, performance, policy, and training modules. WorkflowOS's AI Adoption workflow maps to the specific problem NeoGov's customers face right now: introducing AI into a heavily regulated, risk-averse public-sector HR operation without triggering a governance shutdown. Fit is natural for a Solutions Engineer, Customer AI Implementation, or Product Ops role at NeoGov itself, or at a state/local agency deploying NeoGov's stack.

## Problem this mode solves

The single hardest problem in public-sector AI adoption is **the pilot-to-production gap where governance is the bottleneck, not the technology**. A state agency can run 8 AI pilots (résumé screening, policy Q&A, applicant status chatbots) and graduate zero to production because the joint IT + HR + Legal + Union governance board meets monthly and blocks anything with ambiguous accountability. The workflow to fix is the graduation pipeline, not the pilots themselves.

## Workflow inputs

- 500-5,000 employee agency, one or more collective bargaining agreements
- NeoGov Insight (hiring), Perform, Learn, and Policy modules deployed at varying levels
- 5-12 approved AI pilots across HR, records requests, citizen service, IT ops
- Governance sits with a joint committee that meets monthly, biweekly at best
- No shared measurement framework — pilots report anecdotal wins to leadership decks
- Shadow AI usage estimated at 40-60% among knowledge workers

## AI output (what a WorkflowOS diagnosis would surface here)

- **Score band:** At-Risk (typical 40-55) for a public-sector agency 6-12 months into AI adoption
- **Leaks:**
  - Governance bottleneck — pilots wait 3-6 months for prod graduation review
  - No shared measurement framework — leadership can't tell what's working
  - Shadow AI usage creates unmeasured risk exposure
  - No accountable owner for the AI portfolio across HR / IT / Legal
- **Next-best actions:**
  - Establish a lightweight pilot-graduation checklist covering the 6-8 governance concerns (bias audit, retention policy, records-request implications, union notification, accessibility, appeal path, audit trail, sunset criteria)
  - Move governance from monthly to a rolling review with a 15-business-day SLA
  - Stand up a sanctioned Copilot or Claude-for-workforce channel to reduce shadow-AI risk
  - Define 3 portfolio-level metrics (pilot cycle time, incident rate, time-saved-per-role) reported quarterly
- **Suggested automation:**
  - Pilot-status dashboard fed by a NeoGov + Jira integration
  - Automated notification to union reps on any pilot affecting bargained work, generated from a structured impact form
  - Scoped LLM assistance for policy Q&A, deployed inside NeoGov Policy with citation-required responses
- **Human-review gates:**
  - Any decision affecting hiring, discipline, promotion, or termination stays human — mandatory
  - Union notification is a human-owned trigger, not an automation

## Business impact

- Pilot-to-prod cycle: 5-8 months → <60 days
- Shadow AI usage: 60% → <25% within a year of a sanctioned channel launch
- Incident rate: measurable, with a defined denominator, from month one

## How I would implement in production

**Phase 1** — _establish the graduation lane_
- Ship a pilot-graduation checklist with 15-BD SLA
- Stand up sanctioned AI channel with usage measurement
- Owner: HR Ops + IT + Legal + Union liaison

**Phase 2** — _measure the portfolio_
- Instrument the 3 portfolio metrics
- Publish a quarterly AI adoption report to agency leadership
- Owner: HR Ops + People Analytics

**Phase 3** — _productize the wins_
- Move the two highest-performing pilots to production with full audit trail
- Extend the graduation lane to a second agency as a shared-services model
- Owner: Chief Data Officer + HR Ops + Solutions

## What this signals to a NeoGov hiring manager

- I understand public-sector AI adoption is a governance workflow problem, not a technology problem
- I default to human-owned decisions for anything hiring-adjacent
- I can name the specific graduation-lane failure that stalls most public-sector pilots
- I know the phased sequence that lets an agency ship AI in production without a union grievance
