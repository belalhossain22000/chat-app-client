"use client";

import { useMemo } from "react";
import { ArrowDown, MessagesSquare } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { MessageListSkeleton } from "./MessageListSkeleton";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { useChatScroll } from "@/features/chat/hooks/useChatScroll";
import {
  groupMessagesByDay,
  startsSenderRun,
} from "@/features/chat/utils/groupMessages";
import type { ChatMessage } from "@/features/chat/types/message.types";
import type { Conversation } from "@/features/chat/types/conversation.types";

interface MessageListProps {
  messages: ChatMessage[];
  conversation: Conversation;
  currentUserId?: string;
  isLoading: boolean;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  onLoadOlder?: () => void;
  onRetry?: (message: ChatMessage) => void;
}

export function MessageList({
  messages,
  conversation,
  currentUserId,
  isLoading,
  hasMore,
  isLoadingMore,
  onLoadOlder,
  onRetry,
}: MessageListProps) {
  const isGroup = conversation.type === "group";

  const senderName = useMemo(() => {
    const map = new Map(conversation.participants.map((p) => [p.id, p.name]));
    return (id: string) => map.get(id);
  }, [conversation.participants]);

  const days = useMemo(() => groupMessagesByDay(messages), [messages]);

  const { containerRef, bottomRef, onScroll, newCount, scrollToBottom } =
    useChatScroll({
      messages,
      currentUserId,
      hasMore,
      onReachTop: onLoadOlder,
    });

  if (isLoading) return <MessageListSkeleton />;

  if (messages.length === 0) {
    return (
      <EmptyState
        className="h-full"
        icon={<MessagesSquare className="size-12" />}
        title="No messages yet"
        description={
          isGroup
            ? "Be the first to post in this group."
            : "Send a message to start the conversation."
        }
      />
    );
  }

  return (
    <div className="relative h-full">
      <div
        ref={containerRef}
        onScroll={onScroll}
        className="h-full overflow-y-auto px-3 py-4 sm:px-6"
      >
        <div className="mx-auto flex max-w-3xl flex-col gap-4">
        {isLoadingMore && (
          <div className="flex justify-center pb-3">
            <Skeleton rounded="full" className="h-6 w-28" />
          </div>
        )}
        {hasMore && !isLoadingMore && (
          <div className="pb-2 text-center text-xs text-ink-muted">
            Scroll up for older messages
          </div>
        )}

          {days.map((day) => (
            <div key={day.key} className="flex flex-col gap-2">
              <div className="my-2 flex justify-center">
                <span className="rounded-full bg-surface-muted px-3 py-1 text-xs text-ink-muted">
                  {day.label}
                </span>
              </div>
              {day.messages.map((m, i) => {
                const runStart = startsSenderRun(day.messages, i);
                return (
                  <MessageBubble
                    key={m.id || m.tempId}
                    message={m}
                    mine={m.senderId === currentUserId}
                    isGroup={isGroup}
                    senderName={senderName(m.senderId)}
                    showAvatar={runStart}
                    showName={runStart}
                    onRetry={onRetry}
                  />
                );
              })}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {newCount > 0 && (
        <button
          type="button"
          onClick={() => scrollToBottom()}
          className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-accent px-3.5 py-1.5 text-xs font-semibold text-accent-contrast shadow-lg transition-colors hover:bg-accent-hover"
        >
          <ArrowDown className="size-3.5" />
          {newCount} new message{newCount === 1 ? "" : "s"}
        </button>
      )}
    </div>
  );
}
