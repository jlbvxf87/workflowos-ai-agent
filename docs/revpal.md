# RevPal — RevOps workflow

> **Note:** RevPal-specific product surface details in this doc are working hypothesis based on RevOps-tooling category patterns. Update the specifics to match RevPal's actual product positioning before sending to a hiring manager.

## Company fit

RevPal sits in the RevOps tooling category — pipeline analytics, forecast intelligence, or rev-intelligence, depending on the specific product. WorkflowOS's RevOps workflow maps directly to what a RevPal buyer works in every day: pipeline hygiene, forecast rollup, deal-desk cycle time. Fit is natural for a RevOps Solutions, RevOps Implementation, or Sales Ops role.

## Problem this mode solves

The single hardest problem inside any RevOps team is **the gap between what Salesforce says and what's actually happening in the deal**. Reps update stage histories after the fact. Forecast rollups depend on a weekly manual spreadsheet rebuild. Deal-desk requests pile up because the intake form doesn't capture what pricing actually needs. A rev-intelligence platform can only be as good as the pipeline hygiene workflow upstream of it — which is precisely the workflow WorkflowOS is designed to diagnose.

## Workflow inputs

- 50-300 reps across 2-4 segments (SMB / MM / ENT / STR)
- Salesforce as system of record, with typical closed-won record incompleteness of 25-40%
- Marketo or HubSpot on the marketing side, with intermittent sync issues
- Forecast rollup in a spreadsheet an analyst rebuilds weekly
- Deal desk on a Google Form or Salesforce case queue, no SLA enforcement
- Revenue miss between 5-15% per quarter, with uncertainty about whether it's coverage, conversion, or forecast noise

## AI output (what a WorkflowOS diagnosis would surface here)

- **Score band:** At-Risk (typical 45-58) for a Series C-D RevOps org before their first serious hygiene program
- **Leaks:**
  - Stage histories updated post-close, making forecast confidence baseless
  - Marketing-to-sales lead sync silently drops leads at scale
  - Deal desk turnaround exceeds SLA because intake doesn't route by pricing complexity
  - Forecast rollup is fragile, rebuilt by one person weekly
- **Next-best actions:**
  - Add stage-history required-fields validation in Salesforce, block save without completion
  - Rebuild Marketo → Salesforce sync with a monitored connector + daily reconciliation report
  - Split deal desk intake into simple / complex lanes with different SLAs
  - Automate forecast rollup via a Salesforce report → warehouse pipeline
- **Suggested automation:**
  - Salesforce validation rules for pipeline hygiene fields
  - Fivetran or native connector for Marketo sync, with a nightly reconciliation dashboard
  - Deal-desk intake automation with rule-based routing (Slack workflow or n8n)
- **Human-review gates:**
  - Deal desk override decisions stay human — pricing exceptions are relationship decisions
  - Forecast commit still stays with the rep and manager, even when the rollup is automated

## Business impact

- Forecast accuracy: from ±15% to ±7% within 2 quarters
- Deal desk cycle: 6-day median to <48 hours
- Pipeline hygiene: closed-won opps with complete stage histories from ~65% to >90%

## How I would implement in production

**Phase 1** — _fix the hygiene floor_
- Salesforce required-field validation for stage transitions
- Marketo → SFDC sync rebuild + monitoring
- Owner: RevOps + Sales Ops + Marketing Ops

**Phase 2** — _automate the routine_
- Forecast rollup pipeline (SFDC → warehouse → BI)
- Deal desk intake automation with SLA tracking
- Owner: RevOps + Data Engineering

**Phase 3** — _layer the intelligence_
- Rev-intelligence signal ingestion (call recording, email engagement) into the pipeline hygiene score
- Automated forecast-risk flagging with rep + manager confirmation loop
- Owner: RevOps + AI Implementation

## What this signals to a RevPal hiring manager

- I understand rev-intelligence products live and die on the workflow upstream of them
- I lead with hygiene before intelligence — the standard RevOps sequence
- I keep human judgment on deal exceptions and forecast commit — the two spots where automation misjudges relationships
- I can name the phased sequence that ships value in Phase 1, not Phase 3
