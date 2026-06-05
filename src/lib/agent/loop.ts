import Anthropic from "@anthropic-ai/sdk";
import { defaultRegistry } from "./registry";
import type { AgentEvent } from "./types";
import { withRetry, withTimeout } from "@/lib/with-retry";
import { cached } from "@/lib/cache";

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514";
const MAX_HOPS = 6;
const LLM_TIMEOUT_MS = 60_000;

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

// Re-export the canonical event type so consumers can import from one place.
export type { AgentEvent } from "./types";

function getClient(): Anthropic | null {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  return new Anthropic({ apiKey: key });
}

const SYSTEM_PROMPT = `You are mynd-plan, an AI agent embedded in a deployable SaaS app.
You have access to real tools. When a user asks something a tool can answer,
call the tool, read the result, and continue until you can give a complete
answer. Be concise, direct, and helpful. Never invent tool results.`;

/**
 * The real multi-hop agent loop.
 *
 * - Wraps every model call in withRetry (exponential backoff + jitter) and
 *   withTimeout so a hung upstream never hangs the request.
 * - Caches identical tool inputs (TTL + in-flight dedupe) via the cache layer.
 * - Loops on stop_reason === "tool_use" up to MAX_HOPS, executing tools and
 *   feeding results back to the model.
 *
 * Yields AgentEvents (the canonical contract in ./types) which the API route
 * serializes as SSE and Chat.tsx consumes directly.
 */
export async function* runAgent(
  history: ChatMessage[]
): AsyncGenerator<AgentEvent> {
  const client = getClient();
  if (!client) {
    yield {
      type: "text",
      delta: "\u26a0\ufe0f No ANTHROPIC_API_KEY set. Add it in your deployment\u2019s environment variables to enable the agent. The UI and the rest of the app work without it.",
    };
    yield { type: "done" };
    return;
  }

  const messages: Anthropic.MessageParam[] = history.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const registry = defaultRegistry();
  const tools = registry.toAnthropicTools();

  for (let hop = 0; hop < MAX_HOPS; hop++) {
    let response: Anthropic.Message;
    try {
      response = await withRetry(
        () =>
          withTimeout(
            client.messages.create({
              model: MODEL,
              max_tokens: 2048,
              system: SYSTEM_PROMPT,
              tools,
              messages,
            }),
            LLM_TIMEOUT_MS
          ),
        { retries: 2 }
      );
    } catch (err) {
      yield {
        type: "error",
        message: err instanceof Error ? err.message : "Model request failed",
      };
      yield { type: "done" };
      return;
    }

    // Surface any text the model produced this hop.
    for (const block of response.content) {
      if (block.type === "text" && block.text) {
        yield { type: "text", delta: block.text };
      }
    }

    if (response.stop_reason !== "tool_use") {
      yield { type: "done" };
      return;
    }

    // Record the assistant turn (with tool_use blocks) before answering them.
    messages.push({ role: "assistant", content: response.content });

    const toolResults: Anthropic.ToolResultBlockParam[] = [];
    for (const block of response.content) {
      if (block.type !== "tool_use") continue;
      yield { type: "tool_start", name: block.name, input: block.input };

      try {
        const tool = registry.get(block.name);
        if (!tool) {
          throw new Error(`Unknown tool: ${block.name}`);
        }
        const cacheKey = `tool:${block.name}:${JSON.stringify(block.input)}`;
        const result = await cached(cacheKey, 30_000, () =>
          tool.execute(block.input)
        );
        toolResults.push({
          type: "tool_result",
          tool_use_id: block.id,
          content: result,
        });
        yield { type: "tool_result", name: block.name, result };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Tool failed";
        toolResults.push({
          type: "tool_result",
          tool_use_id: block.id,
          is_error: true,
          content: message,
        });
        yield { type: "tool_result", name: block.name, result: `error: ${message}` };
      }
    }

    messages.push({ role: "user", content: toolResults });
  }

  yield {
    type: "text",
    delta: "\n\n(Reached max tool hops \u2014 stopping to avoid a loop.)",
  };
  yield { type: "done" };
}
