# mynd-plan

**An AI product navigator that reasons, calls tools, and ships.** Original, MIT-licensed code built by the Brief team to demonstrate a production agent architecture — with an Apple-grade UI.

> Honest framing: this is an original project that demonstrates the *architecture pattern* (agent loop, tool registry, skill activation, sub-agent fan-out). It is not a copy of any proprietary backend.

---

## Deploy in one click

No coding knowledge required. Click a button, paste your Anthropic API key, done.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yethikrishna/mynd-plan&env=ANTHROPIC_API_KEY&envDescription=Anthropic%20API%20key%20to%20activate%20the%20agent)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/yethikrishna/mynd-plan)

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/yethikrishna/mynd-plan)

### What you need
1. An **Anthropic API key** — get one at https://console.anthropic.com (required).
2. *(Optional)* A **Postgres URL** for conversation history — free at https://neon.tech. Leave blank to run without a database.

That is the entire setup. The UI deploys and runs even before you add a key.

---

## What is inside

| Layer | Tech | Notes |
| --- | --- | --- |
| Frontend | Next.js 14 + React + Tailwind + Framer Motion | Apple-inspired: SF font stack, frosted glass, spring physics, light/dark |
| Backend | Next.js API routes (Node runtime) | Single deployable — no separate server or proxy |
| Agent core | Anthropic SDK | Multi-hop reason -> tool loop (up to 6 hops), SSE token streaming |
| Tools | TypeScript | `github_search_repos`, `fetch_url`, `current_time` — all real |
| Database | Postgres + Drizzle ORM | Conversation persistence; degrades gracefully if absent |

### Architecture

```
UI (Chat.tsx)
   |  POST /api/chat  (Server-Sent Events)
   v
Agent loop (src/lib/agent/loop.ts)
   |-- skill activation (intent -> system prompt)
   |-- Anthropic stream  --> text deltas
   |-- tool_use? --> registry.execute() --> feed result back --> loop
   v
Postgres (optional) persists conversation + messages
```

---

## Run locally

```bash
npm install
cp .env.example .env.local   # add your ANTHROPIC_API_KEY
npm run dev                  # http://localhost:3000
```

With a database:
```bash
# set DATABASE_URL in .env.local first
npm run db:push              # creates tables
```

---

## How the agent works

1. User message hits `/api/chat`.
2. Relevant **skills** activate based on intent and extend the system prompt.
3. The model streams a response. If it requests a **tool**, the registry executes it and feeds the result back — repeating up to 6 hops.
4. Final answer streams to the UI token-by-token; tool calls render as live chips.
5. If `DATABASE_URL` is set, the conversation is persisted.

Add a tool in three steps: create it in `src/lib/agent/tools/`, register it in `registry.ts`, done.

---

## License

MIT — Brief team.
