import { cn } from "@/utils/cn";
import type { SocketStatus } from "@/features/chat/types/chat.types";

const config: Record<SocketStatus, { dot: string; label: string; text: string }> = {
  connected: { dot: "bg-success-ink", label: "Connected", text: "text-success-ink" },
  connecting: { dot: "bg-tint-amber-ink", label: "Connecting…", text: "text-ink-muted" },
  disconnected: { dot: "bg-ink-muted/50", label: "Reconnecting…", text: "text-ink-muted" },
};

export function SocketStatusDot({ status }: { status: SocketStatus }) {
  const c = config[status];
  return (
    <span className={cn("flex items-center gap-1.5 text-xs", c.text)}>
      <span
        className={cn(
          "size-1.5 rounded-full",
          c.dot,
          status === "connecting" && "animate-pulse",
        )}
      />
      {c.label}
    </span>
  );
}
