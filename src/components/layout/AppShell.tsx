export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full">
      <aside className="w-80 border-r border-line p-4 text-ink-muted">
        ConversationSidebar
      </aside>
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
