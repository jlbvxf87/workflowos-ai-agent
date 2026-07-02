"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { WORKFLOW_TYPES, type WorkflowId } from "@/lib/workflows";

export function WorkflowSelector({
  value,
  onChange,
}: {
  value: WorkflowId;
  onChange: (v: WorkflowId) => void;
}) {
  const current = WORKFLOW_TYPES.find((w) => w.id === value);
  return (
    <div className="space-y-2">
      <Label htmlFor="workflow">Choose workflow</Label>
      <Select value={value} onValueChange={(v) => onChange(v as WorkflowId)}>
        <SelectTrigger id="workflow" className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {WORKFLOW_TYPES.map((w) => (
            <SelectItem key={w.id} value={w.id}>
              {w.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {current && <p className="text-xs text-muted-foreground">{current.description}</p>}
    </div>
  );
}
