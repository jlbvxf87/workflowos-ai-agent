# Franklin Fitch — Recruiting workflow

## Company fit

Franklin Fitch is an IT infrastructure and cyber recruiting firm operating across the UK, DACH, and US markets. WorkflowOS's Recruiting workflow maps directly to the operational surface a Franklin Fitch Ops, Talent Tech, or AI Implementation role would work in — sourcing efficiency, screen-to-onsite conversion, offer-accept dynamics, and consultant productivity. Fit is natural.

## Problem this mode solves

The single hardest problem inside an IT contract-and-perm recruiting firm is **consultant productivity gated by the wrong scarce resource**. The firm's consultants are the constraint, and any minute they spend on non-value activity (reformatting CVs, chasing candidate updates, re-keying data between Bullhorn and LinkedIn Recruiter, generating client submission packs) is revenue not earned. The workflow diagnostic isn't "hire more consultants" — it's "identify the 40-60% of consultant time not spent on client or candidate conversation and shrink it."

## Workflow inputs

- 40-150 consultants across UK, DACH, US offices
- Bullhorn ATS + LinkedIn Recruiter + PitchMe or similar sourcing tools
- Contract + perm workflows differ meaningfully (contract has higher velocity, different candidate quality bar)
- Client submission packs generated manually
- Candidate re-engagement cadence inconsistent across consultants
- Placement fee cycle vs contract margin cycle drive different urgency signals

## AI output (what a WorkflowOS diagnosis would surface here)

- **Score band:** Watch (typical 55-68) for a maturing IT recruiting firm
- **Leaks:**
  - CV reformatting for client submission consumes 15-25% of consultant time on active roles
  - Candidate update follow-ups run on consultant memory, not workflow
  - Sourcing tool switching (LinkedIn ↔ Bullhorn ↔ email) breaks context
  - Client feedback capture on rejected candidates is anecdotal, not structured
- **Next-best actions:**
  - Automated client-submission pack generation from Bullhorn candidate record
  - Consultant-owned but automated candidate re-engagement cadence at defined intervals
  - Chrome extension consolidating sourcing signals into Bullhorn context
  - Structured client feedback capture at every candidate rejection with 6-8 canonical tags
- **Suggested automation:**
  - LLM-based CV-to-submission-pack generator with consultant sign-off
  - Bullhorn workflow automations for candidate re-engagement (1w / 2w / 4w touches)
  - Slack integration for real-time candidate status changes visible to the consultant + coverage manager
- **Human-review gates:**
  - Submission decisions to clients stay consultant-owned (relationship + judgment)
  - Rejection call to a candidate stays a human conversation
  - Fee negotiation stays consultant + manager owned

## Business impact

- Consultant time on non-value activity: from 45-55% → 25-30%
- Client submission pack generation: 25 min → 4 min per pack
- Candidate re-engagement rate: 20% → 45% of dormant candidates touched on schedule
- Placement/consultant/month: 15-25% uplift within 2 quarters

## How I would implement in production

**Phase 1** — _shrink the reformatting tax_
- Automated client-submission pack generation from Bullhorn record
- Structured client feedback capture on every rejection
- Owner: Ops + a consultant champion + IT

**Phase 2** — _instrument the re-engagement workflow_
- Bullhorn workflow-driven candidate re-engagement cadence
- Slack real-time status updates for consultant + coverage manager
- Owner: Ops + Head of Delivery

**Phase 3** — _compound the placement engine_
- Client-feedback structured tags feed back into candidate scoring
- Signal-driven "hot candidate" alerts to consultants during active client req windows
- Owner: Ops + Head of Delivery + Analytics

## What this signals to a Franklin Fitch hiring manager

- I understand recruiting-firm ops is a consultant-productivity problem, not a sourcing problem
- I default to consultant-owned decisions on client submissions and rejection calls
- I can name the specific reformatting-tax leak most firms tolerate
- I know the phased sequence that ships productivity gains without displacing the consultant relationship
