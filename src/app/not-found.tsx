import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-7xl font-bold tracking-tighter text-[var(--text-muted)]">404</p>
      <h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
      <Link href="/">
        <Button>Back home</Button>
      </Link>
    </div>
  );
}
