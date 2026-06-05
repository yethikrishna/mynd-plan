'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/ui/cn';

const nav = [
  { href: '/dashboard', label: 'Chat', icon: '◈' },
  { href: '/dashboard/history', label: 'History', icon: '◷' },
  { href: '/dashboard/settings', label: 'Settings', icon: '⚙' },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)]/50 p-4 backdrop-blur-xl md:flex">
      <Link href="/" className="mb-6 px-2 text-lg font-semibold tracking-tight">
        mynd<span className="text-[var(--accent)]">·plan</span>
      </Link>
      <nav className="flex flex-col gap-1">
        {nav.map((n) => {
          const active = pathname === n.href;
          return (
            <Link
              key={n.href}
              href={n.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors',
                active
                  ? 'bg-[var(--surface-3)] font-medium text-[var(--text)]'
                  : 'text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]'
              )}
            >
              <span className="opacity-70">{n.icon}</span>
              {n.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3 text-xs text-[var(--text-muted)]">
        Open source · MIT
        <a href="https://github.com/yethikrishna/mynd-plan" className="mt-1 block text-[var(--accent)]">
          Star on GitHub
        </a>
      </div>
    </aside>
  );
}
