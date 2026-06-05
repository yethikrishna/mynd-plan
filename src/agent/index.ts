import { ToolRegistry } from './registry';
import { searchTool, readTool, writeDocTool } from './tools/builtin';

export function buildRegistry(): ToolRegistry {
  return new ToolRegistry()
    .register(searchTool)
    .register(readTool)
    .register(writeDocTool);
}

export { runAgent } from './loop';
export { fanOut } from './subagent';
