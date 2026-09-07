"use client";

import { useEffect, useState } from "react";
import { SidebarPanel, ConversationPanel } from "@/components/layout/AppShell";
import { ChatSidebar } from "./ChatSidebar";
import { ChatWindowEmpty } from "./ChatWindowEmpty";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setActiveConversation } from "@/features/chat/slice/chat.slice";

// Modals (new conversation / create group) land in a later phase.
export function ChatScreen({ conversationId }: { conversationId?: string }) {
  const dispatch = useAppDispatch();
  const activeId = useAppSelector((s) => s.chat.activeConversationId);
  const [, setModal] = useState<null | "new" | "group">(null);

  // keep slice in sync with the route
  useEffect(() => {
    dispatch(setActiveConversation(conversationId ?? null));
  }, [conversationId, dispatch]);

  const openNew = () => setModal("new");
  const openGroup = () => setModal("group");

  const showConversation = Boolean(conversationId ?? activeId);

  return (
    <>
      <SidebarPanel className={showConversation ? "max-md:hidden" : undefined}>
        <ChatSidebar onNewConversation={openNew} onCreateGroup={openGroup} />
      </SidebarPanel>

      <ConversationPanel className={showConversation ? undefined : "max-md:hidden"}>
        {showConversation ? (
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
