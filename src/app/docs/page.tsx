import { Navbar } from '@/components/marketing/Navbar';
import { Footer } from '@/components/marketing/Footer';

const sections = [
  {
    title: 'Quick start',
    body: 'Click any deploy button in the README. Add your ANTHROPIC_API_KEY when prompted. That\u2019s it \u2014 your agent SaaS is live.',
  },
  {
    title: 'Architecture',
    body: 'One Next.js app serves both the UI and the agent backend. The agent runs a reason\u2192tool loop with a pluggable tool registry, intent-based skill loader, and read-only sub-agent fan-out.',
  },
  {
    title: 'Adding a tool',
    body: 'Create a file in src/lib/agent/tools, export a Tool object with name, description, schema, and run(). Register it in the tool registry. The agent can now call it.',
  },
  {
    title: 'Database',
    body: 'Set DATABASE_URL to a Postgres connection string to persist conversations. Leave it blank and the app runs in stateless mode \u2014 nothing breaks.',
  },
];

export default function DocsPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 pb-24 pt-36">
        <h1 className="text-4xl font-bold tracking-tight">Documentation</h1>
        <p className="mt-4 text-lg text-[var(--text-muted)]">
          Everything you need to deploy and extend mynd\u00B7plan.
        </p>
        <div className="mt-12 space-y-10">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="text-xl font-semibold tracking-tight">{s.title}</h2>
              <p className="mt-2 leading-relaxed text-[var(--text-muted)]">{s.body}</p>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
