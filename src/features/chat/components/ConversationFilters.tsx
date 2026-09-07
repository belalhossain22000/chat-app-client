"use client";

import { cn } from "@/utils/cn";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setConversationFilter } from "@/features/chat/slice/chat.slice";
import type { ConversationFilter } from "@/features/chat/types/chat.types";

const TABS: { value: ConversationFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "groups", label: "Groups" },
];

export function ConversationFilters({ unreadCount }: { unreadCount: number }) {
  const dispatch = useAppDispatch();
  const active = useAppSelector((s) => s.chat.conversationFilter);

  return (
    <div className="flex gap-2 px-4 pb-3">
      {TABS.map(({ value, label }) => {
        const isActive = active === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => dispatch(setConversationFilter(value))}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-tint-coral text-accent"
                : "bg-surface-muted text-ink-muted hover:text-ink",
            )}
          >
            {label}
            {value === "unread" && unreadCount > 0 && (
              <span className="inline-flex min-w-4 items-center justify-center rounded-full bg-accent px-1 text-xs font-semibold text-accent-contrast">
                {unreadCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
