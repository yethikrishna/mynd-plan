'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

type Msg = { role: 'user' | 'assistant'; content: string };

export function Chat() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!input.trim()) return;
    const next = [...messages, { role: 'user' as const, content: input }];
    setMessages(next);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages([...next, { role: 'assistant', content: data.reply ?? 'No response.' }]);
    } catch {
      setMessages([...next, { role: 'assistant', content: 'Error reaching agent.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-2xl px-6 pb-24">
      <div className="glass rounded-2xl shadow-glass p-4">
        <div className="space-y-3 min-h-[120px]">
          {messages.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className={m.role === 'user' ? 'text-right' : 'text-left'}>
              <span className={`inline-block rounded-xl px-4 py-2 text-sm ${m.role === 'user' ? 'bg-accent text-white' : 'bg-black/5 text-ink'}`}>{m.content}</span>
            </motion.div>
          ))}
          {loading && <div className="text-sm text-ink-soft">thinking…</div>}
        </div>
        <div className="mt-4 flex gap-2">
          <input value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Ask the navigator…"
            className="flex-1 rounded-xl border border-black/10 bg-white/60 px-4 py-2 text-sm outline-none focus:border-accent" />
          <button onClick={send} className="rounded-xl bg-accent px-5 py-2 text-sm font-medium text-white transition hover:bg-accent-hover">Send</button>
        </div>
      </div>
    </section>
  );
}
