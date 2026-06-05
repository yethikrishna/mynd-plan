import type { ReactNode } from 'react';
import { Sidebar } from '@/components/app/Sidebar';
import { ToastProvider } from '@/components/ui/Toast';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1">{children}</div>
      </div>
    </ToastProvider>
  );
}
