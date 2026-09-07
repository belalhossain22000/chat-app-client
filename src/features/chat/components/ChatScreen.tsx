"use client";

import { useEffect, useState } from "react";
import { SidebarPanel, ConversationPanel } from "@/components/layout/AppShell";
import { ChatSidebar } from "./ChatSidebar";
import { ChatWindow } from "./ChatWindow";
import { ChatWindowEmpty } from "./ChatWindowEmpty";
import { NewChatModal } from "./NewChatModal";
import { CreateGroupModal } from "./CreateGroupModal";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setActiveConversation } from "@/features/chat/slice/chat.slice";

type ModalKind = null | "new" | "group";

export function ChatScreen({ conversationId }: { conversationId?: string }) {
  const dispatch = useAppDispatch();
  const activeId = useAppSelector((s) => s.chat.activeConversationId);
  const [modal, setModal] = useState<ModalKind>(null);

  useEffect(() => {
    dispatch(setActiveConversation(conversationId ?? null));
  }, [conversationId, dispatch]);

  const openNew = () => setModal("new");
  const openGroup = () => setModal("group");
  const closeModal = () => setModal(null);

  const showConversation = Boolean(conversationId ?? activeId);

  return (
    <>
      <SidebarPanel className={showConversation ? "max-md:hidden" : undefined}>
        <ChatSidebar onNewConversation={openNew} onCreateGroup={openGroup} />
      </SidebarPanel>

      <ConversationPanel className={showConversation ? undefined : "max-md:hidden"}>
        {conversationId ? (
          <ChatWindow conversationId={conversationId} />
        ) : (
          <ChatWindowEmpty onNewConversation={openNew} onCreateGroup={openGroup} />
        )}
      </ConversationPanel>

      <NewChatModal open={modal === "new"} onClose={closeModal} />
      <CreateGroupModal open={modal === "group"} onClose={closeModal} />
    </>
  );
}
