"use client";

import { useState } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { diagnosisSchema } from "@/lib/schema";
import { type WorkflowId } from "@/lib/workflows";
import { SAMPLE_WORKFLOWS } from "@/lib/sampleWorkflows";
import { WorkflowSelector } from "@/components/WorkflowSelector";
import { DiagnosticInput } from "@/components/DiagnosticInput";
import { DiagnosisOutput } from "@/components/DiagnosisOutput";
import { AskAgentPanel } from "@/components/AskAgentPanel";

export default function Home() {
  const [workflowId, setWorkflowId] = useState<WorkflowId>("customer-success");
  const [context, setContext] = useState("");

  const { object, submit, isLoading, error } = useObject({
    api: "/api/analyze",
    schema: diagnosisSchema,
  });

  const analyze = () => {
    if (context.trim().length < 20) return;
    submit({ workflowId, context });
  };

  const loadSample = () => setContext(SAMPLE_WORKFLOWS[workflowId]);

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-10 md:py-16">
      <header className="mb-10">
        <div className="flex flex-wrap items-baseline gap-3">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            WorkflowOS
          </h1>
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            AI implementation diagnostic
          </span>
        </div>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Paste a messy workflow. Get a health score, the real leaks, next-best
          actions, an automation plan, and an implementation blueprint. Business
          problem first, workflow second, AI third.
        </p>
      </header>

      <section className="space-y-6">
        <WorkflowSelector
          value={workflowId}
          onChange={(v) => {
            setWorkflowId(v);
            setContext("");
          }}
        />
        <DiagnosticInput
          value={context}
          onChange={setContext}
          onLoadSample={loadSample}
          onSubmit={analyze}
          isLoading={isLoading}
        />
      </section>

      {error && (
        <p className="mt-6 rounded-md border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-400">
          {error.message}
        </p>
      )}

      {object && <DiagnosisOutput diagnosis={object} isStreaming={isLoading} />}

      <AskAgentPanel />

      <footer className="mt-16 border-t pt-6 text-xs text-muted-foreground">
        <p>
          Public demo of the WorkflowOS diagnostic layer. The local operator
          layer (Hermes) is a private companion runtime.
        </p>
        <p className="mt-1 italic">
          Business problem first. Workflow second. AI third.
        </p>
      </footer>
    </main>
  );
}
