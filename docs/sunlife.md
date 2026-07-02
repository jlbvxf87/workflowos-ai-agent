# Sun Life — Insurance Ops workflow

## Company fit

Sun Life Financial is a global life insurance, wealth management, and group benefits carrier. WorkflowOS's Insurance Ops workflow maps directly to the operational surface a Sun Life digital transformation, AI enablement, or Ops role would work in — group benefits claims triage, life underwriting workflow, wealth advisor productivity, cross-line compliance review. Fit is natural for AI Implementation, Digital Transformation, or Ops-adjacent roles inside Sun Life or a Sun Life vendor.

## Problem this mode solves

The single hardest problem at a global multi-line carrier like Sun Life is **making automation stick across lines with different regulatory and cultural constraints**. Group benefits, life underwriting, and wealth advisory each have their own compliance regime, their own actuarial constraints, and their own change-management culture. A one-size automation program dies in every line. A workflow diagnostic that separates the line-specific from the shared constraints is what lets a program actually deploy.

## Workflow inputs

- Multiple lines: group benefits, individual life, wealth, retirement
- Actuarial + Compliance + Underwriting workflows differ by line
- Claims triage (group benefits) with high volume and clear severity tiering
- Life underwriting with 3-6 external data sources per policy, actuarial constraints on automation
- Wealth advisor productivity constrained by KYC, suitability review, and multi-jurisdictional compliance
- AI adoption governed by a centralized enterprise AI committee

## AI output (what a WorkflowOS diagnosis would surface here)

- **Score band:** Watch (typical 55-68) for a large multi-line carrier with mature ops
- **Leaks:**
  - Line-specific automation programs re-invent the same triage, routing, and compliance queue plumbing
  - Life underwriting external-data collection consumes 30-50% of underwriter cycle time
  - Claims triage severity re-designation rate reveals a scripted-flow gap between intake and adjuster
  - Wealth advisor KYC/suitability workflow duplicates effort across jurisdictions
- **Next-best actions:**
  - Build shared triage + routing + compliance queue services consumed by every line
  - Automate life underwriting data collection into a pre-underwriter dossier
  - Instrument claims severity re-designation as a first-class metric with root-cause tags
  - Ship a shared KYC/suitability service for wealth advisors, jurisdiction-aware
- **Suggested automation:**
  - Enterprise-shared triage and routing service, consumed as an API by each line
  - LLM-augmented data extraction from broker/adviser submission documents
  - Compliance queue dashboard shared across lines with SLA and product-launch calendar
- **Human-review gates:**
  - Underwriting bind decisions stay underwriter-owned (regulatory)
  - Claims severity re-designation to catastrophic stays adjuster-owned (regulatory + reputational)
  - Suitability review stays advisor-owned with compliance sign-off (regulatory)

## Business impact

- Life underwriting cycle: 3-4 day reduction on standard-issue policies
- Claims triage severity re-designation rate: 15-20% relative reduction
- Shared-services cost avoidance: 2-4 concurrent line-specific programs that no longer need duplicate plumbing
- Advisor productivity: 20-30% more suitability reviews per week on the same headcount

## How I would implement in production

**Phase 1** — _identify what's shared vs line-specific_
- Map the triage, routing, and compliance queue workflows across lines; identify shared primitives
- Build the first shared triage service prototype consumed by group benefits
- Owner: Enterprise AI + Ops Leadership + one line sponsor

**Phase 2** — _extend and instrument_
- Extend shared triage to a second line
- Ship the life underwriting data-collection dossier as a Phase 2 use case
- Instrument claims severity re-designation with root-cause tags
- Owner: Enterprise AI + Underwriting Ops + Claims Ops

**Phase 3** — _compound across lines_
- Move wealth advisor KYC/suitability onto the shared services model
- Build a cross-line AI portfolio dashboard with pilot-to-prod cycle time as the headline metric
- Owner: Enterprise AI + line ops leaders

## What this signals to a Sun Life hiring manager

- I understand multi-line automation lives or dies on the shared-vs-specific distinction
- I default to regulatory-owned decisions in every line where the framework requires it
- I can name the specific shared-services primitives that let a global carrier scale automation
- I know the phased sequence that gets past line-specific pilot silos
