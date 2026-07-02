import type { Severity, Effort, Payoff } from "./workflows";

export function scoreToColor(score: number): { bg: string; text: string; label: string } {
  if (score >= 80) return { bg: "bg-emerald-500/15", text: "text-emerald-600 dark:text-emerald-400", label: "Healthy" };
  if (score >= 60) return { bg: "bg-yellow-500/15", text: "text-yellow-600 dark:text-yellow-400", label: "Watch" };
  if (score >= 40) return { bg: "bg-orange-500/15", text: "text-orange-600 dark:text-orange-400", label: "At risk" };
  return { bg: "bg-red-500/15", text: "text-red-600 dark:text-red-400", label: "Critical" };
}

export function severityColor(sev: Severity): string {
  if (sev === "high") return "border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400";
  if (sev === "medium") return "border-yellow-500/40 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400";
  return "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
}

export function effortPayoffColor(level: Effort | Payoff): string {
  if (level === "high") return "border-purple-500/40 bg-purple-500/10 text-purple-600 dark:text-purple-400";
  if (level === "medium") return "border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-400";
  return "border-slate-500/40 bg-slate-500/10 text-slate-600 dark:text-slate-400";
}
