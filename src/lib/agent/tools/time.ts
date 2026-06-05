import { z } from "zod";
import { Tool } from "../types";

export const timeTool: Tool = {
  name: "current_time",
  description: "Get the current UTC date and time in ISO 8601 format.",
  inputSchema: z.object({}),
  jsonSchema: { type: "object", properties: {}, required: [] },
  execute: async () => new Date().toISOString(),
};
