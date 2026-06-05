export type Role = 'user' | 'assistant' | 'system';
export interface Message { role: Role; content: string; }

export interface ToolResult { ok: boolean; output: string; }
export interface Tool {
  name: string;
  description: string;
  /** JSON-schema-ish param hints for the model */
  params: Record<string, string>;
  run: (args: Record<string, any>) => Promise<ToolResult>;
}

export interface Skill {
  name: string;
  /** trigger keywords — intent match */
  triggers: string[];
  /** tool names this skill activates */
  tools: string[];
  /** procedural guidance injected into the system prompt */
  guidance: string;
}
