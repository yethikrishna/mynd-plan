'use client';

import { useState, useRef, useEffect } from 'react';
import Message, { ChatMessage } from './Message';

const GREETING: ChatMessage = {
  id: 'seed',
  role: 'assistant',
  content: "I'm mynd — your product navigator. Ask me what to build next, and I'll reason over your context before you ship."
};

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, busy]);

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setBusy(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: next.map(({ role, content }) => ({ role, content })) })
      });
      const data = await res.json();
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: 'assistant', content: data.reply ?? data.error ?? '…' }]);
    } catch (e) {
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: 'assistant', content: 'Something broke reaching the agent. Check your ANTHROPIC_API_KEY.' }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="scroll-thin flex-1 space-y-3 overflow-y-auto py-6">
        {messages.map((m) => <Message key={m.id} message={m} />)}
        {busy && (
          <div className="flex justify-start">
            <div className="glass rounded-3xl rounded-bl-lg px-4 py-3 shadow-glass">
              <span className="inline-flex gap-1">
                <span className="h-1.5 w-1.5 animate-breathe rounded-full bg-subtle" />
                <span className="h-1.5 w-1.5 animate-breathe rounded-full bg-subtle" style={{ animationDelay: '0.2s' }} />
                <span className="h-1.5 w-1.5 animate-breathe rounded-full bg-subtle" style={{ animationDelay: '0.4s' }} />
              </span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>
      <div className="glass sticky bottom-4 mb-4 flex items-end gap-2 rounded-2xl p-2 shadow-glass">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
          rows={1}
          placeholder="What should we build next?"
          className="max-h-40 flex-1 resize-none bg-transparent px-3 py-2 text-[15px] outline-none placeholder:text-subtle"
        />
        <button
          onClick={send}
          disabled={busy || !input.trim()}
          className="h-9 w-9 shrink-0 rounded-full bg-accent text-white transition-all duration-200 ease-spring hover:scale-105 active:scale-95 disabled:opacity-40"
          aria-label="Send"
        >↑</button>
      </div>
    </div>
  );
}
