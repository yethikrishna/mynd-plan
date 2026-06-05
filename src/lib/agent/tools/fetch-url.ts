import { z } from "zod";
import { Tool } from "../types";

export const fetchUrlTool: Tool = {
  name: "fetch_url",
  description: "Fetch and return the readable text content of a public web page.",
  inputSchema: z.object({ url: z.string().url() }),
  jsonSchema: {
    type: "object",
    properties: { url: { type: "string", description: "Absolute http(s) URL" } },
    required: ["url"],
  },
  execute: async ({ url }) => {
    const res = await fetch(url, { headers: { "User-Agent": "mynd-plan-agent" } });
    if (!res.ok) return `Fetch failed: ${res.status}`;
    const html = await res.text();
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return text.slice(0, 2000);
  },
};
