import { test } from "node:test";
import assert from "node:assert/strict";
import { parseAgentEvent, type AgentEvent } from "./types";

/**
 * Smoke test for the loop <-> Chat SSE contract.
 *
 * The agent loop yields AgentEvent objects; route.ts serializes each as
 * `data: ${JSON.stringify(event)}\n\n`; Chat.tsx parses the JSON and routes
 * it through parseAgentEvent(). This test asserts every variant survives that
 * round-trip and that malformed frames are rejected (returned as null) rather
 * than silently mis-handled.
 *
 * Run with `npm test` (node --test). Not part of the Vercel build.
 */

const SAMPLES: AgentEvent[] = [
  { type: "text", delta: "hello" },
  { type: "tool_start", name: "github", input: { q: "x" } },
  { type: "tool_result", name: "github", result: "ok" },
  { type: "conversation", id: "c_123" },
  { type: "done" },
  { type: "error", message: "boom" },
];

function roundTripSSE(evt: AgentEvent): unknown {
  const frame = `data: ${JSON.stringify(evt)}\n\n`;
  const line = frame.replace(/^data: /, "").trim();
  return JSON.parse(line);
}

test("every AgentEvent variant round-trips through SSE", () => {
  for (const evt of SAMPLES) {
    const parsed = parseAgentEvent(roundTripSSE(evt));
    assert.deepEqual(parsed, evt, `variant '${evt.type}' did not round-trip`);
  }
});

test("the union covers exactly the emitted variants", () => {
  // If the loop adds a new event type, add a sample above. This guards against
  // emitting a variant Chat.tsx has no handler for.
  const covered = new Set(SAMPLES.map((e) => e.type));
  const expected = [
    "text",
    "tool_start",
    "tool_result",
    "conversation",
    "done",
    "error",
  ];
  for (const t of expected) {
    assert.ok(covered.has(t as AgentEvent["type"]), `missing sample for '${t}'`);
  }
});

test("malformed frames are rejected, not mis-parsed", () => {
  const bad: unknown[] = [
    null,
    undefined,
    42,
    "text",
    {},
    { type: "text" }, // missing delta
    { type: "tool_result", name: "x" }, // missing result
    { type: "unknown_type", foo: 1 },
  ];
  for (const b of bad) {
    assert.equal(parseAgentEvent(b), null, `should reject: ${JSON.stringify(b)}`);
  }
});
