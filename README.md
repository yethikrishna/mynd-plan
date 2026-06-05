<div align="center">

# mynd-plan

### A golden-standard, one-click-deployable AI SaaS foundation.

Immersive WebGL UI \u00b7 real multi-hop agent core \u00b7 unified relational data graph \u00b7 streaming \u00b7 auth \u00b7 Postgres. Built so a **developer or a layman** can click one button, paste one key, and ship a professional-grade app they can build anything on.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyethikrishna%2Fmynd-plan&env=ANTHROPIC_API_KEY&envDescription=Your%20Anthropic%20API%20key%20enables%20the%20agent&project-name=mynd-plan&repository-name=mynd-plan)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/yethikrishna/mynd-plan)
&nbsp;
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/yethikrishna/mynd-plan)

**MIT licensed \u00b7 self-host free forever**

</div>

---

![mynd-plan UI](docs/screenshot.png)

> _Add a real screenshot/GIF at `docs/screenshot.png` after your first deploy \u2014 recruiters and users skim, and the immersive hero is the selling point._

---

## One-click, zero-knowledge deploy

1. Click **Deploy with Vercel** above.
2. When prompted, paste your `ANTHROPIC_API_KEY` ([get one here](https://console.anthropic.com/)).
3. Done. Your app is live on the web.

The UI and full SaaS surface run **without** any key. Add the key to switch the agent on. Add a `DATABASE_URL` (free Postgres from [Neon](https://neon.tech) or Vercel Postgres) to turn on persistence \u2014 the app degrades gracefully to no-DB mode if it's absent.

## What's inside

**Immersive frontend (Igloo-direction)**
- Custom GLSL fragment-shader hero via Three.js \u2014 domain-warped noise, pointer-reactive, with `prefers-reduced-motion` + no-WebGL fallbacks.
- Apple-grade design system: SF font stack, frosted glass, multi-layer shadows, framer-motion spring physics, light/dark.
- Full SaaS surface: landing, pricing, docs, dashboard, settings, auth.

**Real agent core**
- Multi-hop tool loop (`src/lib/agent/loop.ts`) \u2014 reasons, calls real tools, reads results, loops up to 6 hops.
- SSE streaming \u2014 tokens and live tool-call chips render as they happen.
- Three real tools: GitHub repo search, URL fetch/read, current time. Add your own in `src/lib/agent/registry.ts`.

**Unified data graph (Lark-direction)**
- One normalized relational core (`src/lib/db/schema.ts`): workspaces \u2192 projects \u2192 items, with first-class cross-references (`item_links`), events, and editable `doc_blocks`. The schema is what makes the app feel like one connected system, not isolated CRUD pages.

**Robustness, wired in (not just present)**
- Per-IP rate limiting on `/api/chat` (429 + `Retry-After`).
- Retry with exponential backoff + jitter, and a hard timeout on every model call.
- TTL cache with in-flight de-duplication on tool results (no thundering herd).
- `error.tsx`, `not-found.tsx`, `loading.tsx`, skeletons throughout.

## Stack \u2014 and why it's one language

**100% TypeScript on Next.js 14 (App Router).** Backend, frontend, and API live in one deployable. This is a deliberate product decision: for "any user deploys in one click," every extra runtime (a separate Python/Java service, a proxy, a self-managed DB host) is one more thing that breaks. One app = one button.

| Layer | Tech |
|---|---|
| UI | Next.js, React, Tailwind, framer-motion, Three.js |
| Agent | Anthropic SDK, custom multi-hop loop |
| Data | Postgres + Drizzle ORM |
| Auth | NextAuth (GitHub OAuth + email) |
| Deploy | Vercel / Render / Railway / Docker |

## Local development

```bash
git clone https://github.com/yethikrishna/mynd-plan && cd mynd-plan
cp .env.example .env.local   # add ANTHROPIC_API_KEY (DATABASE_URL optional)
npm install
npm run dev
```

## Honest scope

This is an original, MIT-licensed foundation \u2014 not a copy of any company's private backend. It demonstrates the real architecture patterns (agent loop, tool registry, unified data graph, robustness) with working code. The "new industry standard" is what **you** build on top by iterating in the browser. The code gets you a genuinely strong, deployable start.

## License

MIT \u2014 see [LICENSE](LICENSE). Use it, fork it, ship it, sell it.
