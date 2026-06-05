'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

const links = [
  { href: '/#features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/docs', label: 'Docs' },
];

export function Navbar() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed inset-x-0 top-0 z-40 mx-auto mt-4 flex max-w-5xl items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 px-5 py-3 backdrop-blur-xl shadow-lg"
    >
      <Link href="/" className="text-lg font-semibold tracking-tight">
        mynd<span className="text-[var(--accent)]">·plan</span>
      </Link>
      <nav className="hidden items-center gap-6 md:flex">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text)]">
            {l.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-2">
        <Link href="/sign-in">
          <Button variant="ghost" size="sm">Sign in</Button>
        </Link>
        <Link href="/dashboard">
          <Button size="sm">Open app</Button>
        </Link>
      </div>
    </motion.header>
  );
}
