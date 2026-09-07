import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

/**
 * 3-panel chat frame:
 *   [ conversation sidebar | chat window | details panel ]
 * On mobile only one of sidebar / chat window is shown at a time
 * (the chat page toggles via `className`).
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background text-ink">
      {children}
    </div>
  );
}

export function SidebarPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "flex w-full shrink-0 flex-col border-r border-line bg-surface md:w-80 lg:w-96",
        className,
      )}
    >
      {children}
    </aside>
  );
}

export function ConversationPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("flex min-w-0 flex-1 flex-col", className)}>
      {children}
    </section>
  );
}
