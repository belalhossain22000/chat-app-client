"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { RefreshCw, Wifi, ArrowLeft } from "lucide-react";
import { ChatHeader } from "./ChatHeader";
import { ChatHeaderSkeleton } from "./ChatHeaderSkeleton";
import { MessageList } from "./MessageList";
import { MessageInput, type MessageInputHandle } from "./MessageInput";
import { ChatDetailsPanel } from "./ChatDetailsPanel";
import { GroupManagement } from "./GroupManagement";
import { ChatAssistPanel } from "./ChatAssistPanel";
import { SmartReplyBar } from "./SmartReplyBar";
import { SidePanel } from "@/components/ui/SidePanel";
import { ErrorState } from "@/components/ui/ErrorState";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { useGetConversationsQuery } from "@/features/chat/api/conversations.api";
import {
  useGetMessagesQuery,
  useLazyGetMessagesQuery,
  useSendMessageMutation,
} from "@/features/chat/api/messages.api";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setDetailsPanelOpen } from "@/features/chat/slice/chat.slice";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { ChatMessage } from "@/features/chat/types/message.types";

const EMPTY_MESSAGES: ChatMessage[] = [];

export function ChatWindow({ conversationId }: { conversationId: string }) {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const detailsOpen = useAppSelector((s) => s.chat.isDetailsPanelOpen);
  const closeDetails = () => dispatch(setDetailsPanelOpen(false));

  const [assistOpen, setAssistOpen] = useState(false);
  const inputRef = useRef<MessageInputHandle>(null);

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
  const nextCursor = data?.nextCursor;
  const messages = data?.messages ?? EMPTY_MESSAGES;
  const userId = user?.id;

  const loadOlder = useCallback(() => {
    if (!nextCursor || isLoadingMore || !hasMore) return;
    fetchOlder({ conversationId, before: nextCursor });
  }, [conversationId, nextCursor, isLoadingMore, hasMore, fetchOlder]);

  const send = useCallback(
    (text: string) => {
      if (!userId) return;
      sendMessage({
        conversationId,
        text,
        senderId: userId,
        tempId: crypto.randomUUID(),
      });
    },
    [conversationId, userId, sendMessage],
  );

  const retry = useCallback(
    (message: ChatMessage) => {
      if (!userId) return;
      sendMessage({
        conversationId,
        text: message.text,
        senderId: userId,
        tempId: message.tempId ?? crypto.randomUUID(),
      });
    },
    [conversationId, userId, sendMessage],
  );

  if (!conversation) {
    return (
      <div className="flex h-full flex-col">
        <ChatHeaderSkeleton />
        <div className="flex-1" />
      </div>
    );
  }

  const detailsContent =
    conversation.type === "group" ? (
      <GroupManagement conversation={conversation} currentUserId={userId} />
    ) : (
      <ChatDetailsPanel conversation={conversation} currentUserId={userId} />
    );

  return (
    <div className="relative flex h-full min-w-0">
      <div className="flex min-w-0 flex-1 flex-col bg-background">
        <ChatHeader
          conversation={conversation}
          currentUserId={userId}
          onOpenAssistant={() => setAssistOpen(true)}
        />

        <div className="min-h-0 flex-1">
          {isError ? (
            <ErrorState
              className="h-full"
              title="Couldn't load messages"
              description="Something went wrong while loading the conversation. Please check your internet connection and try again."
              primaryAction={
                <Button onClick={() => refetch()}>
                  <RefreshCw className="size-4" />
                  Try again
                </Button>
              }
              secondaryAction={
                <Button
                  variant="secondary"
                  onClick={() => window.location.reload()}
                >
                  <Wifi className="size-4" />
                  Refresh page
                </Button>
              }
            />
          ) : (
            <MessageList
              messages={messages}
              conversation={conversation}
              currentUserId={userId}
              isLoading={isLoading}
              hasMore={hasMore}
              isLoadingMore={isLoadingMore}
              onLoadOlder={loadOlder}
              onRetry={retry}
            />
          )}
        </div>

        <SmartReplyBar
          conversation={conversation}
          messages={messages}
          currentUserId={userId}
          onSend={send}
        />

        <MessageInput
          ref={inputRef}
          conversationId={conversationId}
          onSend={send}
        />

        <ChatAssistPanel
          open={assistOpen}
          onClose={() => setAssistOpen(false)}
          conversation={conversation}
          messages={messages}
          currentUserId={userId}
          onUseDraft={(text) => inputRef.current?.setText(text)}
        />
      </div>

      {/* desktop: sliding side column */}
      <div className="hidden lg:flex">
        <SidePanel open={detailsOpen} onClose={closeDetails}>
          {detailsContent}
        </SidePanel>
      </div>

      {/* mobile: full-screen details page over the chat */}
      {detailsOpen && (
        <div className="absolute inset-0 z-40 flex flex-col bg-surface lg:hidden">
          <div className="flex items-center gap-2 border-b border-line px-3 py-3">
            <IconButton label="Back to chat" size="sm" onClick={closeDetails}>
              <ArrowLeft className="size-5" />
            </IconButton>
            <span className="text-base font-semibold text-ink">
              {conversation.type === "group" ? "Group info" : "Contact info"}
            </span>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">{detailsContent}</div>
        </div>
      )}
    </div>
  );
}
