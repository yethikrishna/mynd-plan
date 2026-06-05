import { Tool } from "./types";
import { githubSearchTool } from "./tools/github";
import { fetchUrlTool } from "./tools/fetch-url";
import { timeTool } from "./tools/time";

export class ToolRegistry {
  private tools = new Map<string, Tool>();

  register(tool: Tool) {
    this.tools.set(tool.name, tool);
    return this;
  }
  get(name: string) {
    return this.tools.get(name);
  }
  all() {
    return [...this.tools.values()];
  }
  toAnthropicTools() {
    return this.all().map((t) => ({
      name: t.name,
      description: t.description,
      input_schema: t.jsonSchema,
    }));
  }
}

export function defaultRegistry() {
  return new ToolRegistry()
    .register(githubSearchTool)
    .register(fetchUrlTool)
    .register(timeTool);
}
