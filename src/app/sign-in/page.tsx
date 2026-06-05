'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="w-full max-w-sm"
      >
        <Card>
          <CardContent className="pt-6">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="mt-1 text-sm text-[var(--text-muted)]">Sign in to your workspace.</p>
            <form
              className="mt-6 space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                // Demo flow: wire NextAuth provider here. For now, enter the app.
                router.push('/dashboard');
              }}
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
              <Button type="submit" className="w-full">Continue</Button>
            </form>
            <p className="mt-4 text-center text-xs text-[var(--text-muted)]">
              No account? <Link href="/dashboard" className="text-[var(--accent)]">Just start — it's open source</Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
