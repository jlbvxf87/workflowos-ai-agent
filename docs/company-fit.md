# Company-fit framework

Each per-company doc in this folder answers the same six questions. This page explains the framework; the individual files apply it.

## Why per-company docs

A generic AI-workflow prototype is unmemorable. A prototype that names a specific company's real operational problem — one visible from the outside via public product docs, engineering blog posts, S-1s, or job descriptions — and shows exactly how the prototype would apply is memorable, because it proves the author has done the reading.

## The six questions

For each target company:

1. **Company fit** — 1-2 sentences on why this company is a fit for a WorkflowOS-style implementation. What role I'm targeting there and why the fit is natural.
2. **Problem this mode solves** — the specific operational problem the company is publicly known to have (or that its product implies it faces internally). Cite the source when possible (a product doc, a blog post, a job description).
3. **Workflow inputs** — the messy inputs a WorkflowOS deployment at this company would ingest — team topology, tool stack, KPIs, known friction points.
4. **AI output** — what the diagnosis would surface for this specific input. Sample health-score band, sample leaks, sample next-best actions. Named tools, named roles.
5. **Business impact** — what a working implementation is worth in the company's own terms — GRR, cycle time, hires per quarter, MLR turn.
6. **How I would implement in production** — a phased blueprint. Phase 1 lands in weeks, Phase 2 in a quarter, Phase 3 is the year-out state.

## Rules of engagement

- **Public information only.** Nothing scraped, nothing from confidential channels.
- **No name-drops without content.** If I can't answer the six questions concretely, the company doesn't get a file.
- **Phase labels, never calendar labels.** Same rule the schema enforces — real implementation plans never fit calendar weeks.
- **Diagnosis first, implementation second.** The point isn't "here's what I'd build." The point is "here's what's actually broken, then here's what I'd build to fix it."

## Files in this folder

Each file below applies the framework to a specific target company. Files are lightweight by design — enough to signal I've done the reading, not so much that they read like a consultant deck.

- `churnzero.md` — Customer Success workflow, health-score composition
- `reejig.md` — Workforce Planning, skills inventory + internal mobility
- `revpal.md` — RevOps, forecast hygiene + pipeline data quality
- `neogov.md` — Public-sector HR ops, workflow standardization
- `elanden.md` — Insurance Ops (commercial lines), quote-to-bind cycle
- `sunlife.md` — Insurance Ops (life & benefits), claims triage + underwriting
- `realchemistry.md` — Healthcare Marketing Ops, MLR review + omnichannel
- `franklinfitch.md` — Recruiting, funnel diagnostics + candidate experience
