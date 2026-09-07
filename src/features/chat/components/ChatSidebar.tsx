"use client";

import { useMemo, useState } from "react";
import { SidebarHeader } from "./SidebarHeader";
import { ConversationFilters } from "./ConversationFilters";
import { SidebarUserFooter } from "./SidebarUserFooter";
import { ConversationList } from "./ConversationList";
import { useAppSelector } from "@/lib/redux/hooks";

interface ChatSidebarProps {
  onNewConversation: () => void;
  onCreateGroup: () => void;
}

export function ChatSidebar({ onNewConversation, onCreateGroup }: ChatSidebarProps) {
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
        <ConversationList search={search} onNewConversation={onNewConversation} />
      </div>

      <SidebarUserFooter />
    </div>
  );
}
