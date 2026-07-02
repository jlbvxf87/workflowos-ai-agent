# Real Chemistry — Healthcare Marketing Ops workflow

## Company fit

Real Chemistry (formerly W2O) is an AI-enabled health innovation company serving pharma, biotech, and health-tech clients across marketing, medical, and commercial operations. WorkflowOS's Healthcare Marketing Ops workflow maps directly to the operational surface a Real Chemistry AI Implementation, MarTech, or Solutions role would work in — MLR review as the hard constraint, omnichannel orchestration as the ambition, cross-channel measurement as the promise. Fit is natural.

## Problem this mode solves

The single hardest problem in pharma marketing ops is **shrinking the MLR cycle without touching the MLR gate**. Medical, Legal, and Regulatory review is non-negotiable — you cannot automate the reviewer's judgment, you cannot skip a cycle, and you cannot make an unreviewed asset go live. The only workflow lever available is shrinking every non-MLR step around the gate: brief generation, asset routing, revision tracking, submission-ready formatting. That's the specific WorkflowOS diagnosis a Real Chemistry client would ship first.

## Workflow inputs

- Pharma client with 3-6 launched products + 1-3 in-flight launches
- HCP campaigns across email, field-rep triggers, publisher buys
- DTC campaigns across social, search, connected TV, and consented digital
- MLR cycle 10-16 days, target 5-7
- 30-45% of assets go through 2+ revision cycles
- Omnichannel orchestration is calendar-driven, not signal-driven
- Consent and PHI split across HCP and patient systems with no unified view
- Cross-channel measurement lives in Marketo (email), Veeva (rep), Snowflake (digital), and an external agency (script lift)

## AI output (what a WorkflowOS diagnosis would surface here)

- **Score band:** At-Risk (typical 45-58) for a pharma client 2-3 quarters into an omnichannel program
- **Leaks:**
  - MLR cycle dominated by non-review time (routing, revision tracking, briefing)
  - Revision cycles driven by preventable errors (out-of-brand claims, missing safety info, wrong reference)
  - Omnichannel is calendar-driven with no next-best-action engine
  - Cross-channel measurement produces the wrong denominator, so attribution is unreliable
- **Next-best actions:**
  - Pre-MLR compliance-linter to catch 60-70% of preventable revision-cycle triggers before submission
  - Structured brief-to-asset pipeline that carries claims, references, and safety copy through revision cycles
  - Signal-driven next-best-channel recommendation (rep vs email vs digital) at HCP level
  - Unified consent + suppression view across HCP and patient channels
- **Suggested automation:**
  - LLM-based pre-MLR linter fine-tuned against approved reference materials
  - Veeva/Aprimo asset routing with revision-cycle instrumentation
  - Next-best-channel engine consuming Marketo + Veeva + Snowflake signals
- **Human-review gates:**
  - MLR review itself is a hard gate — no automation touches the reviewer's judgment
  - Consent status changes stay in the sanctioned consent system with audit trail
  - Any asset revision addressing safety copy stays MLR-owned

## Business impact

- MLR cycle: 14 days → 7 days
- Revision cycle rate: 40% → 20% of assets require 2+ cycles
- Omnichannel engagement lift: 15-25% relative on HCP audiences moved to signal-driven cadence
- Measurement: from annual attribution to quarterly, with a defined denominator

## How I would implement in production

**Phase 1** — _shrink the MLR non-review time_
- Pre-MLR compliance linter for top 3 preventable revision triggers
- Structured brief-to-asset pipeline with claims + reference threading
- Owner: MarTech + MLR liaison + Content Ops

**Phase 2** — _instrument the channel signal_
- Unified consent + suppression view across HCP + patient
- Signal-driven next-best-channel prototype on one product cohort
- Owner: MarTech + MedComms + Analytics

**Phase 3** — _scale and measure_
- Roll signal-driven cadence across launched products
- Quarterly attribution model replacing the annual external-agency report
- Owner: Commercial Ops + Analytics + MarTech

## What this signals to a Real Chemistry hiring manager

- I understand MLR is the gate, and the workflow is everything around it
- I default to compliance-owned decisions on anything reviewer-adjacent
- I can name the pre-MLR linter as the highest-leverage first move
- I know the phased sequence that ships a signal-driven omnichannel program without a regulatory letter
