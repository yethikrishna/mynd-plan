import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] py-12">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 text-center text-sm text-[var(--text-muted)] md:flex-row md:justify-between md:text-left">
        <p>mynd·plan — open-source agent SaaS foundation. MIT licensed.</p>
        <div className="flex gap-6">
          <Link href="/pricing" className="hover:text-[var(--text)]">Pricing</Link>
          <Link href="/docs" className="hover:text-[var(--text)]">Docs</Link>
          <a href="https://github.com/yethikrishna/mynd-plan" className="hover:text-[var(--text)]">GitHub</a>
        </div>
      </div>
    </footer>
  );
}
