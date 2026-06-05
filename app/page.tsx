import Chat from '@/components/Chat';

export default function Home() {
  return (
    <main className="relative mx-auto flex min-h-screen max-w-3xl flex-col px-5">
      <header className="animate-rise sticky top-0 z-10 -mx-5 mb-2 px-5">
        <div className="glass mt-4 flex items-center justify-between rounded-2xl px-5 py-3 shadow-glass">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-full bg-accent shadow-lift" />
            <div>
              <div className="text-[15px] font-semibold tracking-tight font-display">mynd-plan</div>
              <div className="text-[11px] text-subtle">product navigator</div>
            </div>
          </div>
          <a href="https://github.com/yethikrishna/mynd-plan" className="text-[12px] text-subtle transition-colors hover:text-ink">source</a>
        </div>
      </header>
      <Chat />
    </main>
  );
}
