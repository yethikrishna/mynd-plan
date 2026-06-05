"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { parseAgentEvent } from "@/lib/agent/types";

const ease = [0.16, 1, 0.3, 1] as const;

interface ToolEvent {
  name: string;
  input?: unknown;
  result?: string;
}
interface Msg {
  role: "user" | "assistant";
  text: string;
  tools: ToolEvent[];
}

export default function Chat() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function updateLast(fn: (m: Msg) => Msg) {
    setMessages((prev) => {
      const c = [...prev];
      c[c.length - 1] = fn(c[c.length - 1]);
      return c;
    });
  }

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    const history = [...messages, { role: "user" as const, text, tools: [] }];
    setMessages([...history, { role: "assistant", text: "", tools: [] }]);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.map((m) => ({ role: m.role, content: m.text })),
        }),
      });
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        const data = await res.json();
        updateLast((m) => ({ ...m, text: data.error || "No response." }));
        return;
      }
      const reader = res.body!.getReader();
      const dec = new TextDecoder();
      let buf = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const parts = buf.split("\n\n");
        buf = parts.pop() || "";
        for (const p of parts) {
          const line = p.replace(/^data: /, "").trim();
          if (!line) continue;
          let raw: unknown;
          try {
            raw = JSON.parse(line);
          } catch {
            continue;
          }
          const evt = parseAgentEvent(raw);
          if (!evt) continue;
          switch (evt.type) {
            case "text":
              updateLast((m) => ({ ...m, text: m.text + evt.delta }));
              break;
            case "tool_start":
              updateLast((m) => ({
                ...m,
                tools: [...m.tools, { name: evt.name, input: evt.input }],
              }));
              break;
            case "tool_result":
              updateLast((m) => {
                const tools = [...m.tools];
                const i = tools.findIndex(
                  (t) => t.name === evt.name && t.result === undefined
                );
                if (i >= 0) tools[i] = { ...tools[i], result: evt.result };
                return { ...m, tools };
              });
              break;
            case "error":
              updateLast((m) => ({
                ...m,
                text: m.text || "Error: " + evt.message,
              }));
              break;
            case "conversation":
            case "done":
              break;
          }
        }
      }
    } catch (e: any) {
      updateLast((m) => ({ ...m, text: "Error: " + (e?.message || "request failed") }));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="max-w-2xl mx-auto px-4 pb-32">
      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease }}
              className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
            >
              <div
                className={`max-w-[85%] rounded-3xl px-5 py-3 ${
                  m.role === "user" ? "bg-blue-500 text-white" : "glass"
                }`}
              >
                {m.tools.length > 0 && (
                  <div className="mb-2 space-y-1">
                    {m.tools.map((t, j) => (
                      <motion.div
                        key={j}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.25, ease }}
                        className="text-xs rounded-xl bg-black/5 dark:bg-white/10 px-3 py-1.5 font-mono"
                      >
                        <span className="opacity-60">
                          {t.result === undefined ? "calling " : "done "}
                        </span>
                        {t.name}
                      </motion.div>
                    ))}
                  </div>
                )}
                <p className="whitespace-pre-wrap leading-relaxed">
                  {m.text || (busy && m.role === "assistant" ? "..." : "")}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={endRef} />
      </div>

      <div className="fixed bottom-6 left-0 right-0 px-4">
        <div className="max-w-2xl mx-auto glass rounded-full flex items-center gap-2 p-2 shadow-lg">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask mynd anything..."
            className="flex-1 bg-transparent px-4 py-2 outline-none"
          />
          <button
            onClick={send}
            disabled={busy}
            aria-label="Send"
            className="rounded-full bg-blue-500 text-white w-10 h-10 flex items-center justify-center disabled:opacity-40 transition hover:scale-105 active:scale-95"
          >
            &uarr;
          </button>
        </div>
      </div>
    </section>
  );
}
