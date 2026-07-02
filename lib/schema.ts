import { z } from "zod";

const level = z.enum(["low", "medium", "high"]);

export const diagnosisSchema = z.object({
  summary: z
    .string()
    .describe(
      "2-3 sentence plain-English summary of what the workflow does today, in operator language. Not marketing prose."
    ),
  healthScore: z
    .number()
    .min(0)
    .max(100)
    .describe("Overall workflow health from 0-100. Anchor: 90+ world-class, 70-89 solid, 50-69 leaking value, <50 broken."),
  scoreRationale: z
    .string()
    .describe("One-sentence rationale for the score."),
  leaks: z
    .array(
      z.object({
        title: z.string().describe("Short leak name — the failure mode, not the symptom."),
        severity: level,
        impact: z
          .string()
          .describe("Business impact if left unfixed. Quantify with a plausible range where possible."),
      })
    )
    .describe("2-6 main leaks in the workflow, ordered by severity."),
  nextActions: z
    .array(
      z.object({
        action: z.string().describe("Concrete action a real operator can start this week."),
        effort: level,
        payoff: level,
      })
    )
    .describe("3-6 next best actions, ordered by payoff-to-effort ratio."),
  automation: z
    .array(
      z.object({
        step: z.string().describe("The workflow step to automate."),
        tool: z
          .string()
          .describe(
            "Specific tool or pattern — 'Zapier + Airtable', 'n8n webhook to Salesforce', 'scoped LLM enrichment', not 'AI'."
          ),
        rationale: z.string().describe("Why this step is a good automation candidate now."),
      })
    )
    .describe("2-5 automation candidates. Prefer boring, proven, well-scoped over 'agentic'."),
  humanReview: z
    .array(
      z.object({
        step: z.string().describe("The step where a human must stay in the loop."),
        why: z.string().describe("Why removing the human here would cause real business, legal, or trust damage."),
      })
    )
    .describe("1-4 steps where human review is non-negotiable."),
  blueprint: z
    .array(
      z.object({
        phase: z
          .string()
          .describe("Phase label: 'Phase 1', 'Phase 2', 'Phase 3'. Never 'Week 1' or 'Day 1'."),
        title: z.string().describe("Phase title — what ships in this phase."),
        tasks: z.array(z.string()).describe("2-5 concrete tasks in this phase."),
        owner: z
          .string()
          .describe("Role or team accountable — e.g. 'RevOps + Sales Ops', 'CS Lead + Data Eng'."),
      })
    )
    .describe("3-5 phase implementation blueprint. Sequenced by dependency, not by wishlist."),
});

export type Diagnosis = z.infer<typeof diagnosisSchema>;
