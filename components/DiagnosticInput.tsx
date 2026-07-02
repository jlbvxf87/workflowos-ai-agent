"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function DiagnosticInput({
  value,
  onChange,
  onLoadSample,
  onSubmit,
  isLoading,
}: {
  value: string;
  onChange: (v: string) => void;
  onLoadSample: () => void;
  onSubmit: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="context">Paste workflow context</Label>
        <button
          type="button"
          onClick={onLoadSample}
          className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          Load sample
        </button>
      </div>
      <Textarea
        id="context"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste a messy description of your workflow. Team size, tools, KPIs, what's broken. Don't sanitize it — the messier, the better."
        rows={8}
        className="resize-y font-mono text-sm"
      />
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {value.length > 0 ? `${value.length} chars` : "20+ chars minimum"}
        </p>
        <Button onClick={onSubmit} disabled={isLoading || value.trim().length < 20}>
          {isLoading ? "Analyzing…" : "Analyze Workflow"}
        </Button>
      </div>
    </div>
  );
}
