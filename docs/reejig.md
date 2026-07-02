# Reejig — Workforce Planning workflow

## Company fit

Reejig is a workforce intelligence platform built around a skills graph, internal mobility, and "zero wasted potential" as their operational north star. WorkflowOS's Workforce Planning workflow maps directly to the buyer's operational surface — a HR Ops or Workforce Strategy lead running Reejig inside a large enterprise. Fit is natural for an AI Implementation, Workforce Strategy, or Solutions Consultant role.

## Problem this mode solves

The single hardest problem inside a Reejig customer's account is **making skills data current enough to trust for real staffing decisions**. Skills inventories decay fast — most workforce data is stale within 12 months. Without freshness, internal-mobility recommendations get quietly ignored and the platform becomes shelfware. Every serious deployment lives or dies on the skills-freshness workflow, not the algorithm.

## Workflow inputs

- 2,000-15,000 employee headcount, 4-8 business units
- Workday or SAP SuccessFactors as HRIS system of record
- Skills data currently limited to job-title, self-declared skills, and a stale certifications feed
- Annual strategic priorities set by exec team, headcount plan negotiated in Q3 finance cycle
- Internal transfer rate below 8% (industry benchmark ~15-20% for mature internal mobility programs)
- L&D and Talent Acquisition report to different orgs

## AI output (what a WorkflowOS diagnosis would surface here)

- **Score band:** Watch to At-Risk — most enterprise workforce planning workflows sit here
- **Leaks:**
  - Skills inventory relies on a single "current role" field with no signal from actual work
  - No structured mapping between strategic priorities and skills demand forecast
  - Internal mobility program exists but has no pull mechanism — employees don't hear about openings
  - L&D and TA planning cycles are out of phase
- **Next-best actions:**
  - Inject work-derived skills signals (project assignments, Slack/Teams metadata via consented sources) as freshness inputs
  - Build a strategic-priority-to-skills-demand mapping for each declared priority
  - Automate internal-opportunity alerts to employees flagged as adjacent-skill matches
  - Establish a joint L&D + TA planning cycle
- **Suggested automation:**
  - Reejig skills graph enrichment via HRIS + project assignment + certification-provider webhooks
  - Scoped LLM to extract skills from open-text project descriptions and role changes
  - Automated Slack/Teams DMs for high-match internal openings, with opt-in
- **Human-review gates:**
  - Skills tag corrections stay employee-controlled — a wrong skill tag damages trust more than a missed one
  - Managerial approval on any internal-mobility recommendation before it becomes a formal offer conversation

## Business impact

- Internal transfer rate: 3% → 12% within 18 months for a properly instrumented deployment (matches the internal mobility literature)
- Time-to-fill reduction: 30-40% on roles filled internally vs externally
- Retention: internally-transferred employees show 2x retention over the following 24 months (industry benchmark)

## How I would implement in production

**Phase 1** — _stabilize the skills signal_
- Audit skills data freshness by cohort; identify sources with <90 day decay
- Instrument HRIS + certification-provider webhooks for automatic skills updates
- Owner: HR Ops + People Analytics

**Phase 2** — _tie skills to strategy_
- Build per-priority skills demand forecast; surface gap analysis to the exec team
- Ship internal-opportunity alerts as opt-in DMs on the primary comms tool
- Owner: Workforce Strategy + People Analytics + IT

**Phase 3** — _compound_
- Feed successful internal transfers back into the skills graph as validated skill evidence
- Join L&D content recommendations to identified skill gaps per business unit
- Owner: Workforce Strategy + L&D + HR Ops

## What this signals to a Reejig hiring manager

- I understand the platform is the algorithm, but the workflow is the freshness
- I can name the specific decay problem their customers hit in year 2
- I default to opt-in and human-controlled tagging for anything employee-facing
- I know the phased sequence that gets a Reejig deployment out of pilot and into production
