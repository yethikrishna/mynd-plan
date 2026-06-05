import Link from 'next/link';
import { Navbar } from '@/components/marketing/Navbar';
import { Footer } from '@/components/marketing/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const tiers = [
  {
    name: 'Hobby',
    price: '$0',
    period: 'forever',
    desc: 'For tinkering and side projects.',
    features: ['1 workspace', 'Bring your own API key', 'Community support', 'Self-host anywhere'],
    cta: 'Deploy free',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$19',
    period: 'per month',
    desc: 'For builders shipping real products.',
    features: ['Unlimited workspaces', 'Conversation history', 'Priority model routing', 'Email support'],
    cta: 'Start Pro',
    highlight: true,
  },
  {
    name: 'Team',
    price: '$49',
    period: 'per seat / month',
    desc: 'For teams building together.',
    features: ['Everything in Pro', 'Shared workspaces', 'SSO + audit log', 'Dedicated support'],
    cta: 'Contact us',
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 pb-24 pt-36">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Simple, honest pricing</h1>
          <p className="mt-4 text-lg text-[var(--text-muted)]">
            Self-host for free, forever. Upgrade only when you want managed hosting and history.
          </p>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {tiers.map((t) => (
            <Card key={t.name} className={t.highlight ? 'ring-2 ring-[var(--accent)]' : ''}>
              <CardHeader>
                {t.highlight && (
                  <span className="mb-2 inline-block rounded-full bg-[var(--accent)]/10 px-3 py-1 text-xs font-medium text-[var(--accent)]">
                    Most popular
                  </span>
                )}
                <CardTitle>{t.name}</CardTitle>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight">{t.price}</span>
                  <span className="text-sm text-[var(--text-muted)]">/{t.period}</span>
                </div>
                <p className="mt-2 text-sm text-[var(--text-muted)]">{t.desc}</p>
              </CardHeader>
              <CardContent>
                <ul className="mb-6 space-y-2 text-sm">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="text-[var(--accent)]">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/dashboard">
                  <Button variant={t.highlight ? 'primary' : 'secondary'} className="w-full">
                    {t.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
