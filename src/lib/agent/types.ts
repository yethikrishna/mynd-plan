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
