import { Tool } from '../types';

/** Demonstration tools. Swap implementations for real data sources. */
export const searchTool: Tool = {
  name: 'search',
  description: 'Search the knowledge base for relevant documents.',
  params: { query: 'string' },
  run: async ({ query }) => ({ ok: true, output: `No index wired yet. Query was: "${query}".` }),
};

export const readTool: Tool = {
  name: 'read',
  description: 'Read the full content of a document by id.',
  params: { id: 'string' },
  run: async ({ id }) => ({ ok: true, output: `Stub document body for ${id}.` }),
};

export const writeDocTool: Tool = {
  name: 'write_doc',
  description: 'Persist a generated document.',
  params: { title: 'string', content: 'string' },
  run: async ({ title }) => ({ ok: true, output: `Saved document: ${title}.` }),
};
