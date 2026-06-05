<div align="center">

# mynd-plan

**An AI product navigator that reasons, calls tools, and ships.**

Built on the Brief architecture pattern — by the Brief team.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yethikrishna/mynd-plan&env=ANTHROPIC_API_KEY&envDescription=Anthropic%20API%20key%20for%20agent%20reasoning&envLink=https://console.anthropic.com)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/yethikrishna/mynd-plan)
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/yethikrishna/mynd-plan)

</div>

---

## What this is

`mynd-plan` is an **original, working** AI agent that demonstrates the architecture pattern behind Brief:

- **Reason→tool loop** — the model decides whether to act before answering
- **Pluggable tool registry** — capabilities resolved by name, not hard-wired
- **Intent-based skill activation** — skills load by keyword match (the `get_skills` pattern)
- **Read-only sub-agent fan-out** — spawn N concurrent workers, aggregate findings
- **Apple-inspired UI** — SF font stack, frosted glass, spring-physics motion, light/dark

> **Honest framing:** This is an original demonstration of the *pattern*, written from scratch. It is not a copy of Brief's production backend. It runs on real Claude calls when you supply a key.

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind · Framer Motion · Anthropic SDK

## Run locally

```bash
git clone https://github.com/yethikrishna/mynd-plan.git
cd mynd-plan
npm install
cp .env.example .env.local   # add your ANTHROPIC_API_KEY
npm run dev
```

Open http://localhost:3000.

## Deploy

Use any button above. Each will prompt for `ANTHROPIC_API_KEY`. Without a key, the UI runs and the agent returns a friendly setup message instead of live reasoning.

## Architecture

```
src/
  agent/
    types.ts        # Message, Tool, Skill contracts
    registry.ts     # Pluggable tool registry
    skills.ts       # Intent-based skill activation
    subagent.ts     # Read-only sub-agent fan-out
    loop.ts         # Core reason→tool loop
    tools/builtin.ts# Demo tools (swap for real sources)
  app/
    api/agent/route.ts  # Edge between UI and agent
    page.tsx            # Hero + Chat
  components/       # Apple-grade UI
```

## Extending

- **Add a tool:** implement the `Tool` interface, register it in `buildRegistry()`.
- **Add a skill:** push a `Skill` into `SKILLS` with triggers + guidance.
- **Multi-hop tool use:** loop on `stop_reason === 'tool_use'` in `loop.ts`.

## License

MIT · Brief team
