"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Diagnosis } from "@/lib/schema";
import type { DeepPartial } from "ai";

type PhaseRaw = DeepPartial<Diagnosis>["blueprint"] extends
  | Array<infer P>
  | undefined
  ? P
  : never;
type Phase = NonNullable<PhaseRaw>;

export function BlueprintMap({ phases }: { phases: Array<PhaseRaw> }) {
  const clean = phases.filter((p): p is Phase => Boolean(p));
  if (clean.length === 0) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground">
          Implementation Blueprint
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="relative space-y-6 border-l border-border/60 pl-6">
          {clean.map((p, i) => (
            <li key={i} className="relative">
              <span className="absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background font-mono text-xs">
                {i + 1}
              </span>
              <div className="flex flex-wrap items-baseline gap-2">
                {p.phase && <Badge variant="secondary">{p.phase}</Badge>}
                {p.title && <h4 className="font-medium">{p.title}</h4>}
              </div>
              {Array.isArray(p.tasks) && p.tasks.length > 0 && (
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {p.tasks.map(
                    (t, j) =>
                      t && (
                        <li key={j} className="flex gap-2">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/60" />
                          <span>{t}</span>
                        </li>
                      )
                  )}
                </ul>
              )}
              {p.owner && <p className="mt-2 text-xs text-muted-foreground">Owner: {p.owner}</p>}
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
