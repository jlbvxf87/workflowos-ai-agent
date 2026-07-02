export const WORKFLOW_TYPES = [
  {
    id: "customer-success",
    label: "Customer Success",
    description: "Onboarding, health scoring, churn risk, renewal & expansion motion",
  },
  {
    id: "revops",
    label: "RevOps",
    description: "Lead-to-revenue plumbing, forecast hygiene, pipeline data quality",
  },
  {
    id: "recruiting",
    label: "Recruiting",
    description: "Sourcing → screen → interview → offer pipeline and bottlenecks",
  },
  {
    id: "workforce-planning",
    label: "Workforce Planning",
    description: "Headcount, skills gaps, internal mobility, talent supply/demand",
  },
  {
    id: "insurance-ops",
    label: "Insurance Ops",
    description: "Quote/bind/issue, claims triage, underwriting workflows",
  },
  {
    id: "healthcare-marketing-ops",
    label: "Healthcare Marketing Ops",
    description: "HCP/DTC campaign ops, MLR review, omnichannel orchestration",
  },
  {
    id: "ai-adoption",
    label: "AI Adoption",
    description: "Enterprise AI rollout, pilot → prod, change management, measurement",
  },
] as const;

export type WorkflowId = (typeof WORKFLOW_TYPES)[number]["id"];

export type Severity = "low" | "medium" | "high";
export type Effort = "low" | "medium" | "high";
export type Payoff = "low" | "medium" | "high";
