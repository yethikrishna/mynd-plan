import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'mynd-plan',
  description: 'An AI product-navigator agent — Brief architecture pattern.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
