"use client";

import { useMemo, useState } from "react";
import { MessagesSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { SidebarHeader } from "./SidebarHeader";
import { ConversationFilters } from "./ConversationFilters";
import { SidebarUserFooter } from "./SidebarUserFooter";
import { ConversationListSkeleton } from "./ConversationListSkeleton";
import { useAppSelector } from "@/lib/redux/hooks";

interface ChatSidebarProps {
  onNewConversation: () => void;
  onCreateGroup: () => void;
  // wired to RTK Query in a later phase
  isLoading?: boolean;
  isError?: boolean;
}

export function ChatSidebar({
  onNewConversation,
  onCreateGroup,
  isLoading = false,
  isError = false,
}: ChatSidebarProps) {
  const [search, setSearch] = useState("");
  const unreadMap = useAppSelector((s) => s.chat.unreadByConversationId);
  const unreadCount = useMemo(
    () => Object.values(unreadMap).reduce((a, b) => a + b, 0),
    [unreadMap],
  );

  return (
    <div className="flex h-full flex-col bg-surface">
      <SidebarHeader
        search={search}
        onSearchChange={setSearch}
        onNewConversation={onNewConversation}
        onCreateGroup={onCreateGroup}
      />
      <div className="pt-3">
        <ConversationFilters unreadCount={unreadCount} />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {isLoading ? (
          <ConversationListSkeleton />
        ) : isError ? (
          <EmptyState
            className="h-full"
            title="Couldn't load conversations"
            description="Something went wrong while loading your conversations."
          />
        ) : (
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
        )}
      </div>

      <SidebarUserFooter />
    </div>
  );
}
