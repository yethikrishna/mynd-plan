import Anthropic from '@anthropic-ai/sdk';
import { ToolRegistry } from './registry';

/**
 * Read-only sub-agent fan-out. Spawn N workers on independent tasks,
 * run concurrently, aggregate. Workers cannot write or spawn further
 * agents — the same guardrail Brief enforces.
 */
export async function fanOut(
  client: Anthropic,
  tasks: string[],
  registry: ToolRegistry,
): Promise<{ task: string; result: string }[]> {
  const readOnly = registry.list().filter((t) => /^(search|read|list|get)/.test(t.name));
  const toolDesc = readOnly.map((t) => `- ${t.name}: ${t.description}`).join('\n');

  return Promise.all(
    tasks.map(async (task) => {
      const res = await client.messages.create({
        model: process.env.MYND_MODEL ?? 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: `You are a read-only research sub-agent. Available tools:\n${toolDesc}\nReturn a concise finding.`,
        messages: [{ role: 'user', content: task }],
      });
      const text = res.content.map((c) => (c.type === 'text' ? c.text : '')).join('');
      return { task, result: text };
    }),
  );
}
