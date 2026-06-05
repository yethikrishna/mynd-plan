import { Tool } from './types';

/**
 * Pluggable tool registry. Register tools at boot; the agent loop
 * resolves them by name. Mirrors Brief's pattern where capabilities
 * are activated dynamically rather than hard-wired.
 */
export class ToolRegistry {
  private tools = new Map<string, Tool>();

  register(tool: Tool) { this.tools.set(tool.name, tool); return this; }
  get(name: string) { return this.tools.get(name); }
  list() { return [...this.tools.values()]; }
  describe() {
    return this.list()
      .map((t) => `- ${t.name}: ${t.description} | params: ${JSON.stringify(t.params)}`)
      .join('\n');
  }
}
