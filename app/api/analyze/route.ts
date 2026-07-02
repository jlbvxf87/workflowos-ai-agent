import { anthropic } from "@ai-sdk/anthropic";
import { streamObject } from "ai";
import { diagnosisSchema } from "@/lib/schema";
import { buildAnalyzePrompt } from "@/lib/prompts";
import { WORKFLOW_TYPES, type WorkflowId } from "@/lib/workflows";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  let body: { workflowId?: string; context?: string };
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const { workflowId, context } = body;

  const isKnown = WORKFLOW_TYPES.some((w) => w.id === workflowId);
  if (!isKnown) return new Response("Unknown workflow", { status: 400 });
  if (!context || typeof context !== "string" || context.trim().length < 20) {
    return new Response("Workflow context too short (20+ chars)", { status: 400 });
  }

  const { system, prompt } = buildAnalyzePrompt(workflowId as WorkflowId, context);

  const result = streamObject({
    model: anthropic("claude-sonnet-4-6"),
    schema: diagnosisSchema,
    system,
    prompt,
    temperature: 0.4,
  });

  return result.toTextStreamResponse();
}
