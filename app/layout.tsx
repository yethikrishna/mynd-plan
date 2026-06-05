import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'mynd-plan — your product navigator',
  description: 'An AI product-navigator agent. AI ships the code; mynd makes sure it ships the right thing.',
  themeColor: '#0c0c0e'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
