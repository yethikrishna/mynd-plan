import Anthropic from "@anthropic-ai/sdk";
import { ToolRegistry } from "./registry";
import { activateSkills } from "./skills";
import { AgentEvent } from "./types";

const BASE_SYSTEM = `You are mynd, an AI product navigator agent.
You reason step by step and use tools when they help answer the user.
Be concise, opinionated, and cite sources when you use a tool.`;

const MAX_HOPS = 6;
const MODEL = "claude-3-5-sonnet-20241022";

/**
 * Multi-hop reason -> tool loop with streaming. Yields AgentEvents:
 * text deltas, tool_start, tool_result, and done.
 */
export async function* runAgent(
  messages: Anthropic.MessageParam[],
  registry: ToolRegistry,
  apiKey: string
): AsyncGenerator<AgentEvent> {
  const client = new Anthropic({ apiKey });

  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const lastText = typeof lastUser?.content === "string" ? lastUser.content : "";
  const skills = activateSkills(lastText);
  const system =
    BASE_SYSTEM +
    (skills.length
      ? "\n\nActive skills:\n" + skills.map((s) => "- " + s.systemAddon).join("\n")
      : "");

  const convo: Anthropic.MessageParam[] = [...messages];

  for (let hop = 0; hop < MAX_HOPS; hop++) {
    const stream = client.messages.stream({
      model: MODEL,
      max_tokens: 1024,
      system,
      tools: registry.toAnthropicTools(),
      messages: convo,
    });

    for await (const event of stream) {
      if (
        event.type === "content_block_delta" &&
        event.delta.type === "text_delta"
      ) {
        yield { type: "text", delta: event.delta.text };
      }
    }

    const finalMsg = await stream.finalMessage();
    convo.push({ role: "assistant", content: finalMsg.content });

    const toolUses = finalMsg.content.filter(
      (b): b is Anthropic.ToolUseBlock => b.type === "tool_use"
    );

    if (toolUses.length === 0) {
      yield { type: "done" };
      return;
    }

    const toolResults: Anthropic.ToolResultBlockParam[] = [];
    for (const tu of toolUses) {
      yield { type: "tool_start", name: tu.name, input: tu.input };
      const tool = registry.get(tu.name);
      let result: string;
      try {
        result = tool ? await tool.execute(tu.input) : `Unknown tool: ${tu.name}`;
      } catch (err: any) {
        result = `Tool error: ${err?.message || String(err)}`;
      }
      yield { type: "tool_result", name: tu.name, result };
      toolResults.push({
        type: "tool_result",
        tool_use_id: tu.id,
        content: result,
      });
    }

    convo.push({ role: "user", content: toolResults });
  }

  yield { type: "done" };
}
