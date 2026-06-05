import { z } from "zod";
import { Tool } from "../types";

export const githubSearchTool: Tool = {
  name: "github_search_repos",
  description:
    "Search public GitHub repositories by keyword. Returns top results with name, stars, description, and URL.",
  inputSchema: z.object({ query: z.string() }),
  jsonSchema: {
    type: "object",
    properties: { query: { type: "string", description: "Search keywords" } },
    required: ["query"],
  },
  execute: async ({ query }) => {
    const res = await fetch(
      `https://api.github.com/search/repositories?q=${encodeURIComponent(
        query
      )}&per_page=5&sort=stars`,
      { headers: { Accept: "application/vnd.github+json" } }
    );
    if (!res.ok) return `GitHub search failed: ${res.status}`;
    const data = await res.json();
    const items = (data.items || []).slice(0, 5).map(
      (r: any) =>
        `- ${r.full_name} (\u2605${r.stargazers_count}): ${
          r.description || "no description"
        } \u2014 ${r.html_url}`
    );
    return items.length ? items.join("\n") : "No repositories found.";
  },
};
