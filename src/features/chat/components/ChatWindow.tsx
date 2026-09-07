"use client";

import { useCallback, useMemo } from "react";
import { ChatHeader } from "./ChatHeader";
import { ChatHeaderSkeleton } from "./ChatHeaderSkeleton";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { useGetConversationsQuery } from "@/features/chat/api/conversations.api";
import {
  useGetMessagesQuery,
  useLazyGetMessagesQuery,
  useSendMessageMutation,
} from "@/features/chat/api/messages.api";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { ChatMessage } from "@/features/chat/types/message.types";

export function ChatWindow({ conversationId }: { conversationId: string }) {
  const { user } = useAuth();
  const { data: conversations } = useGetConversationsQuery();
  const conversation = useMemo(
    () => conversations?.find((c) => c.id === conversationId),
    [conversations, conversationId],
  );

  const { data, isLoading, isError, refetch } = useGetMessagesQuery({
    conversationId,
  });
  const [fetchOlder, { isFetching: isLoadingMore }] = useLazyGetMessagesQuery();
  const [sendMessage] = useSendMessageMutation();

  const hasMore = Boolean(data?.hasMore);

  const loadOlder = useCallback(() => {
    if (!data?.nextCursor || isLoadingMore || !hasMore) return;
    fetchOlder({ conversationId, before: data.nextCursor });
  }, [conversationId, data?.nextCursor, isLoadingMore, hasMore, fetchOlder]);

  const send = useCallback(
    (text: string) => {
      if (!user?.id) return;
      sendMessage({
        conversationId,
        text,
        senderId: user.id,
        tempId: crypto.randomUUID(),
      });
    },
    [conversationId, user?.id, sendMessage],
  );

  const retry = useCallback(
    (message: ChatMessage) => {
      if (!user?.id) return;
      sendMessage({
        conversationId,
        text: message.text,
        senderId: user.id,
        tempId: message.tempId ?? crypto.randomUUID(),
      });
    },
    [conversationId, user?.id, sendMessage],
  );

  if (!conversation) {
    return (
      <div className="flex h-full flex-col">
        <ChatHeaderSkeleton />
        <div className="flex-1" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-background">
      <ChatHeader conversation={conversation} currentUserId={user?.id} />

      <div className="min-h-0 flex-1">
        {isError ? (
          <EmptyState
            className="h-full"
            title="Couldn't load messages"
            description="Something went wrong while loading this conversation."
            action={
              <Button variant="secondary" onClick={() => refetch()}>
                Try again
              </Button>
            }
          />
        ) : (
          <MessageList
            messages={data?.messages ?? []}
            conversation={conversation}
            currentUserId={user?.id}
            isLoading={isLoading}
            hasMore={hasMore}
            isLoadingMore={isLoadingMore}
            onLoadOlder={loadOlder}
            onRetry={retry}
          />
        )}
      </div>

      <MessageInput conversationId={conversationId} onSend={send} />
    </div>
  );
}
