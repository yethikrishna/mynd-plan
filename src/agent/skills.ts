import { Skill } from './types';

/** Intent-based skill activation — the get_skills pattern. */
export const SKILLS: Skill[] = [
  {
    name: 'research',
    triggers: ['research', 'analyze', 'investigate', 'look up', 'find out'],
    tools: ['search', 'read', 'spawn_subagent'],
    guidance: 'Decompose the question, fan out read-only sub-agents for independent threads, then synthesize.',
  },
  {
    name: 'writing',
    triggers: ['write', 'draft', 'document', 'prd', 'spec', 'summary'],
    tools: ['read', 'write_doc'],
    guidance: 'Lead with the recommendation. Be concise. Ground claims in retrieved context.',
  },
];

export function activateSkills(userText: string): Skill[] {
  const t = userText.toLowerCase();
  return SKILLS.filter((s) => s.triggers.some((k) => t.includes(k)));
}
