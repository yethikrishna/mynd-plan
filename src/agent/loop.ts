import Anthropic from '@anthropic-ai/sdk';
import { Message } from './types';
import { ToolRegistry } from './registry';
import { activateSkills } from './skills';

const BASE_SYSTEM = `You are mynd-plan, an AI product navigator.
Lead with a recommendation, be concise, and call tools to ground claims.
You reason, then act: decide whether a tool is needed before answering.`;

/**
 * Core agent loop: build system prompt (base + activated skills),
 * let the model reason and optionally call registered tools, then
 * return the final reply. Single-turn tool resolution for clarity;
 * extend to multi-hop by looping on stop_reason === 'tool_use'.
 */
export async function runAgent(messages: Message[], registry: ToolRegistry): Promise<string> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const lastUser = [...messages].reverse().find((m) => m.role === 'user')?.content ?? '';
  const skills = activateSkills(lastUser);
  const skillGuidance = skills.map((s) => `# Skill: ${s.name}\n${s.guidance}`).join('\n\n');

  const system = [BASE_SYSTEM, skillGuidance, `\nAvailable tools:\n${registry.describe()}`]
    .filter(Boolean)
    .join('\n\n');

  const res = await client.messages.create({
    model: process.env.MYND_MODEL ?? 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    system,
    messages: messages.map((m) => ({ role: m.role === 'system' ? 'user' : m.role, content: m.content })),
  });

  return res.content.map((c) => (c.type === 'text' ? c.text : '')).join('');
}
