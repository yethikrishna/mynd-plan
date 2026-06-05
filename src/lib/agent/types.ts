import { z } from "zod";

export interface Tool {
  name: string;
  description: string;
  inputSchema: z.ZodType<any>;
  jsonSchema: Record<string, any>;
  execute: (input: any) => Promise<string>;
}

export type AgentEvent =
  | { type: "text"; delta: string }
  | { type: "tool_start"; name: string; input: unknown }
  | { type: "tool_result"; name: string; result: string }
  | { type: "conversation"; id: string }
  | { type: "done" }
  | { type: "error"; message: string };

/**
 * Runtime guard for the SSE contract between the agent loop (producer) and
 * Chat.tsx (consumer). Returns a typed AgentEvent or null for anything that
 * does not match the union. Both ends MUST route parsed SSE frames through
 * this so a drift in shape is caught at the type level (the `type` switch in
 * Chat becomes exhaustive) instead of silently dropping events.
 */
export function parseAgentEvent(value: unknown): AgentEvent | null {
  if (typeof value !== "object" || value === null) return null;
  const e = value as Record<string, unknown>;
  switch (e.type) {
    case "text":
      return typeof e.delta === "string" ? { type: "text", delta: e.delta } : null;
    case "tool_start":
      return typeof e.name === "string"
        ? { type: "tool_start", name: e.name, input: e.input }
        : null;
    case "tool_result":
      return typeof e.name === "string" && typeof e.result === "string"
        ? { type: "tool_result", name: e.name, result: e.result }
        : null;
    case "conversation":
      return typeof e.id === "string" ? { type: "conversation", id: e.id } : null;
    case "done":
      return { type: "done" };
    case "error":
      return typeof e.message === "string" ? { type: "error", message: e.message } : null;
    default:
      return null;
  }
}
