"use client";

import { memo } from "react";
import { cn } from "@/utils/cn";
import { Avatar } from "@/components/ui/Avatar";
import type { Conversation } from "@/features/chat/types/conversation.types";
import { conversationTitle } from "@/features/chat/utils/normalizeConversation";
import { formatlistTime } from "@/features/chat/utils/formatTime";

interface ConversationItemProps {
  conversation: Conversation;
  currentUserId?: string;
  active: boolean;
  unread: number;
  onSelect: (id: string) => void;
}

function ConversationItemBase({
  conversation,
  currentUserId,
  active,
  unread,
  onSelect,
}: ConversationItemProps) {
  const title = conversationTitle(conversation, currentUserId);
  const isGroup = conversation.type === "group";
  const last = conversation.lastMessage;

  const preview = last
    ? `${last.sender === currentUserId ? "You: " : ""}${last.text}`
    : isGroup
      ? "No messages yet"
      : "Say hello 👋";

  return (
    <button
      type="button"
      onClick={() => onSelect(conversation.id)}
      className={cn(
        "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors",
        active ? "bg-tint-coral/40" : "hover:bg-surface-muted",
      )}
    >
      <Avatar name={title} isGroup={isGroup} size="lg" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="min-w-0 flex-1 truncate text-sm font-semibold text-ink">
            {title}
          </p>
          {last && (
            <span className="shrink-0 text-xs text-ink-muted">
              {formatlistTime(last.createdAt)}
            </span>
          )}
        </div>
        <div className="mt-0.5 flex items-center gap-2">
          <p className="min-w-0 flex-1 truncate text-sm text-ink-muted">{preview}</p>
          {unread > 0 && (
            <span className="inline-flex min-w-5 shrink-0 items-center justify-center rounded-full bg-accent px-1.5 text-xs font-semibold text-accent-contrast">
              {unread > 99 ? "99+" : unread}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

export const ConversationItem = memo(ConversationItemBase);
