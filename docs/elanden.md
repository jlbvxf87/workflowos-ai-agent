# El Anden — Insurance Ops workflow

> **Note:** Company-specific product details in this doc are working hypothesis based on regional commercial-lines carrier / insurtech patterns. Update the specifics to match El Anden's actual product positioning and market before sending to a hiring manager.

## Company fit

El Anden operates in the insurance-adjacent workflow space — carrier, MGA, insurtech, or broker platform, depending on the exact positioning. WorkflowOS's Insurance Ops workflow maps to the operational surface a Solutions, Ops, or AI Implementation hire would work in: quote-to-bind cycle time, underwriter workflow bottlenecks, claims triage, compliance review as the persistent constraint.

## Problem this mode solves

The single hardest problem in commercial-lines insurance ops is **preserving underwriter judgment while shrinking the cycle time around it**. Every underwriter pulls 6-8 external data sources per quote — carrier appetite, loss runs, financial data, industry benchmarks, geographic exposure. Automating the underwriter's judgment is a regulatory grenade. Automating the sub-workflows that consume 60% of the underwriter's day is the entire game.

## Workflow inputs

- $200M-$1B written premium, commercial lines or specialty
- Underwriter team of 10-40, plus a compliance team of 3-6
- Quote turnaround 3-5 days against a 2-day competitive target
- Bind rate on quotes 25-35%, with no structured "reason not bound" field
- FNOL claims triage via scripted call-center flow, with 15-25% re-routes
- Broker portal satisfaction below 3.0/5.0

## AI output (what a WorkflowOS diagnosis would surface here)

- **Score band:** Watch to At-Risk (typical 50-65)
- **Leaks:**
  - Underwriters spend 40-60% of quote time on data collection, not judgment
  - No structured reason-not-bound capture, so bind-rate improvement has no data foundation
  - FNOL triage re-routes reveal structural mismatch between the intake script and actual claim complexity
  - Compliance is the bottleneck on product launches, with no visible queue
- **Next-best actions:**
  - Automate external-data collection into a pre-underwriter briefing pack (loss runs, financial data, appetite check, geographic exposure)
  - Add a structured "reason not bound" field to the quote system with 8-12 canonical options + a free-text
  - Rework FNOL triage script to route by severity + peril, not caller category
  - Ship a compliance queue dashboard with SLA visibility
- **Suggested automation:**
  - LLM-augmented data extraction from broker submission emails into structured quote inputs
  - Third-party data-source orchestration (LexisNexis, ISO, Verisk) into a single underwriter dossier
  - Broker-portal quote-stage transparency (real-time status, no more "where's my quote?" calls)
- **Human-review gates:**
  - Bind/decline decision stays underwriter-owned — non-negotiable regulatory constraint
  - FNOL severity re-designation stays with a licensed adjuster
  - Compliance sign-off on any product change stays human

## Business impact

- Quote turnaround: 4.2 days → 2 days
- Bind rate: 31% → 38% (2 quarters after structured reason-not-bound data starts informing appetite)
- FNOL re-route rate: 18% → 6%
- Compliance cycle: bottleneck relief on 3-4 concurrent product launches

## How I would implement in production

**Phase 1** — _shrink the underwriter's data-collection burden_
- Automate external-data orchestration into a pre-underwriter briefing pack
- Add structured reason-not-bound field to quote system
- Owner: Underwriting Ops + IT + Data

**Phase 2** — _instrument the compliance queue and the claims triage_
- Compliance queue dashboard with SLA + product-launch calendar
- FNOL script rework by severity + peril
- Owner: Compliance + Claims Ops + Contact Center

**Phase 3** — _broker experience and portfolio insight_
- Broker portal real-time quote-stage transparency
- Bind-rate diagnostic driven by reason-not-bound structured data, feeding appetite refinement
- Owner: Broker Experience + Underwriting Leadership + Analytics

## What this signals to an El Anden hiring manager

- I understand insurance automation is about shrinking the cycle around judgment, never replacing it
- I default to underwriter-owned and compliance-owned decisions where the regulatory framework requires it
- I can name the specific bind-rate diagnostic gap most carriers ignore
- I know the phased sequence that gets quote turnaround down without triggering a regulatory review
