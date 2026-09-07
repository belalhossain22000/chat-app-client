import type { ReactNode } from "react";

/**
 * 3-panel chat frame:
 *   [ conversation sidebar | chat window | details panel ]
 * - sidebar: hidden on mobile when a conversation is open (handled by the pages)
 * - details panel: slides in from the right (SidePanel), rendered by the chat page
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background text-ink">
      {children}
    </div>
  );
}

export function SidebarPanel({ children }: { children: ReactNode }) {
  return (
    <aside className="flex w-full shrink-0 flex-col border-r border-line bg-surface md:w-80 lg:w-96">
      {children}
    </aside>
  );
}

export function ConversationPanel({ children }: { children: ReactNode }) {
  return <section className="flex min-w-0 flex-1 flex-col">{children}</section>;
}
