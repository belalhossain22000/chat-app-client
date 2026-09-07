"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { MessagesSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { ConversationItem } from "./ConversationItem";
import { ConversationListSkeleton } from "./ConversationListSkeleton";
import { useGetConversationsQuery } from "@/features/chat/api/conversations.api";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setActiveConversation } from "@/features/chat/slice/chat.slice";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { conversationTitle } from "@/features/chat/utils/normalizeConversation";

interface ConversationListProps {
  search: string;
  onNewConversation: () => void;
}

export function ConversationList({ search, onNewConversation }: ConversationListProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAuth();

  const { data, isLoading, isError, refetch } = useGetConversationsQuery();
  const activeId = useAppSelector((s) => s.chat.activeConversationId);
  const filter = useAppSelector((s) => s.chat.conversationFilter);
  const unreadMap = useAppSelector((s) => s.chat.unreadByConversationId);

  const visible = useMemo(() => {
    let list = data ?? [];
    if (filter === "groups") list = list.filter((c) => c.type === "group");
    if (filter === "unread")
      list = list.filter((c) => (unreadMap[c.id] ?? 0) > 0);
    const q = search.trim().toLowerCase();
    if (q)
      list = list.filter((c) =>
        conversationTitle(c, user?.id).toLowerCase().includes(q),
      );
    return list;
  }, [data, filter, unreadMap, search, user?.id]);

  const handleSelect = useCallback(
    (id: string) => {
      dispatch(setActiveConversation(id));
      router.push(`/chat/${id}`);
    },
    [dispatch, router],
  );

  if (isLoading) return <ConversationListSkeleton />;

  if (isError) {
    return (
      <ErrorState
        className="h-full py-10"
        title="Couldn't load conversations"
        description="Something went wrong while loading your conversations."
        primaryAction={
          <Button onClick={() => refetch()}>Try again</Button>
        }
      />
    );
  }

  if ((data ?? []).length === 0) {
    return (
      <EmptyState
        className="h-full"
        icon={<MessagesSquare className="size-12" />}
        title="No conversations yet"
        description="Start chatting with someone and your conversations will appear here."
        action={
          <Button variant="secondary" onClick={onNewConversation}>
            <Plus className="size-4" />
            Start a conversation
          </Button>
        }
      />
    );
  }

  if (visible.length === 0) {
    return (
      <EmptyState
        className="h-full"
        title="No matches"
        description="No conversations match your search or filter."
      />
    );
  }

  return (
    <div className="flex flex-col">
      {visible.map((c) => (
        <ConversationItem
          key={c.id}
          conversation={c}
          currentUserId={user?.id}
          active={c.id === activeId}
          unread={unreadMap[c.id] ?? 0}
          onSelect={handleSelect}
        />
      ))}
    </div>
  );
}
