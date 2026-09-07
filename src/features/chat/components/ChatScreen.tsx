"use client";

import { useState } from "react";
import { SidebarPanel, ConversationPanel } from "@/components/layout/AppShell";
import { ChatSidebar } from "./ChatSidebar";
import { ChatWindowEmpty } from "./ChatWindowEmpty";
import { useAppSelector } from "@/lib/redux/hooks";

// Modals (new conversation / create group) land in a later phase.
export function ChatScreen() {
  const activeId = useAppSelector((s) => s.chat.activeConversationId);
  const [, setModal] = useState<null | "new" | "group">(null);

  const openNew = () => setModal("new");
  const openGroup = () => setModal("group");

  return (
    <>
      <SidebarPanel>
        <ChatSidebar onNewConversation={openNew} onCreateGroup={openGroup} />
      </SidebarPanel>

      <ConversationPanel>
        {activeId ? (
          <div className="flex h-full items-center justify-center text-ink-muted">
            ChatWindow
          </div>
        ) : (
          <ChatWindowEmpty onNewConversation={openNew} onCreateGroup={openGroup} />
        )}
      </ConversationPanel>
    </>
  );
}
