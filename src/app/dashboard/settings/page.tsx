'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

export default function SettingsPage() {
  const { toast } = useToast();
  const [name, setName] = useState('My Workspace');

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <p className="mt-1 text-sm text-[var(--text-muted)]">Manage your workspace and model preferences.</p>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Workspace</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="block text-sm">
            <span className="text-[var(--text-muted)]">Workspace name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </label>
          <Button onClick={() => toast({ title: 'Saved', description: 'Workspace updated.' })}>
            Save changes
          </Button>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Model</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[var(--text-muted)]">
            The agent uses your <code className="rounded bg-[var(--surface-3)] px-1">ANTHROPIC_API_KEY</code>{' '}
            from environment variables. Set it in your deployment provider to enable live responses.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
