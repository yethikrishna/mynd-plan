export interface Skill {
  id: string;
  triggers: string[];
  systemAddon: string;
}

const SKILLS: Skill[] = [
  {
    id: "research",
    triggers: ["research", "find", "search", "look up", "competitor", "repo"],
    systemAddon:
      "When researching, prefer github_search_repos and fetch_url. Always cite sources with their URLs.",
  },
  {
    id: "summarize",
    triggers: ["summarize", "tl;dr", "summary", "explain", "brief"],
    systemAddon:
      "When summarizing, lead with the answer in one sentence, then at most three supporting bullets.",
  },
];

export function activateSkills(input: string): Skill[] {
  const lower = input.toLowerCase();
  return SKILLS.filter((s) => s.triggers.some((t) => lower.includes(t)));
}
