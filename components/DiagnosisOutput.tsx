"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { scoreToColor, severityColor, effortPayoffColor } from "@/lib/scoring";
import { BlueprintMap } from "./BlueprintMap";
import type { Diagnosis } from "@/lib/schema";
import type { DeepPartial } from "ai";

type PartialDiagnosis = DeepPartial<Diagnosis>;

export function DiagnosisOutput({
  diagnosis,
  isStreaming,
}: {
  diagnosis: PartialDiagnosis;
  isStreaming: boolean;
}) {
  return (
    <section className="mt-10 space-y-6" aria-live="polite">
      {diagnosis.summary && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground">
              Workflow Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base leading-relaxed">{diagnosis.summary}</p>
          </CardContent>
        </Card>
      )}

      {typeof diagnosis.healthScore === "number" && (
        <HealthScoreCard
          score={diagnosis.healthScore}
          rationale={diagnosis.scoreRationale ?? ""}
        />
      )}

      {Array.isArray(diagnosis.leaks) && diagnosis.leaks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground">
              Main Leaks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {diagnosis.leaks.map(
              (leak, i) =>
                leak && (
                  <div key={i} className="rounded-md border border-border/60 p-4">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      {leak.title && <h3 className="font-medium">{leak.title}</h3>}
                      {leak.severity && (
                        <Badge variant="outline" className={severityColor(leak.severity)}>
                          {leak.severity}
                        </Badge>
                      )}
                    </div>
                    {leak.impact && (
                      <p className="text-sm text-muted-foreground">{leak.impact}</p>
                    )}
                  </div>
                )
            )}
          </CardContent>
        </Card>
      )}

      {Array.isArray(diagnosis.nextActions) && diagnosis.nextActions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground">
              Next Best Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {diagnosis.nextActions.map(
              (a, i) =>
                a && (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-md border border-border/60 p-3"
                  >
                    <span className="mt-0.5 font-mono text-xs text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1">
                      {a.action && <p className="text-sm">{a.action}</p>}
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {a.effort && (
                          <Badge variant="outline" className={effortPayoffColor(a.effort)}>
                            effort: {a.effort}
                          </Badge>
                        )}
                        {a.payoff && (
                          <Badge variant="outline" className={effortPayoffColor(a.payoff)}>
                            payoff: {a.payoff}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                )
            )}
          </CardContent>
        </Card>
      )}

      {Array.isArray(diagnosis.automation) && diagnosis.automation.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground">
              Suggested Automation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {diagnosis.automation.map(
              (auto, i) =>
                auto && (
                  <div key={i} className="rounded-md border border-border/60 p-3">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      {auto.step && <p className="text-sm font-medium">{auto.step}</p>}
                      {auto.tool && (
                        <Badge variant="secondary" className="whitespace-nowrap">
                          {auto.tool}
                        </Badge>
                      )}
                    </div>
                    {auto.rationale && (
                      <p className="mt-1 text-xs text-muted-foreground">{auto.rationale}</p>
                    )}
                  </div>
                )
            )}
          </CardContent>
        </Card>
      )}

      {Array.isArray(diagnosis.humanReview) && diagnosis.humanReview.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground">
              Human Review Steps
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {diagnosis.humanReview.map(
              (h, i) =>
                h && (
                  <div
                    key={i}
                    className="flex gap-3 rounded-md border border-amber-500/40 bg-amber-500/5 p-3"
                  >
                    <span aria-hidden className="text-amber-600 dark:text-amber-400">
                      ◆
                    </span>
                    <div>
                      {h.step && <p className="text-sm font-medium">{h.step}</p>}
                      {h.why && (
                        <p className="mt-0.5 text-xs text-muted-foreground">{h.why}</p>
                      )}
                    </div>
                  </div>
                )
            )}
          </CardContent>
        </Card>
      )}

      {Array.isArray(diagnosis.blueprint) && diagnosis.blueprint.length > 0 && (
        <BlueprintMap phases={diagnosis.blueprint} />
      )}

      {isStreaming && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-current" />
          Streaming…
        </div>
      )}
    </section>
  );
}

function HealthScoreCard({ score, rationale }: { score: number; rationale: string }) {
  const { bg, text, label } = scoreToColor(score);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground">
          Health Score
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-baseline gap-4">
          <div className={`rounded-lg px-6 py-3 ${bg}`}>
            <span className={`text-4xl font-semibold tabular-nums ${text}`}>
              {Math.round(score)}
            </span>
            <span className={`ml-1 text-sm ${text}`}>/100</span>
          </div>
          <div>
            <p className={`text-sm font-medium ${text}`}>{label}</p>
            {rationale && (
              <p className="mt-1 text-xs text-muted-foreground">{rationale}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
