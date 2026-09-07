"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { SidebarPanel, ConversationPanel } from "@/components/layout/AppShell";
import { ChatSidebar } from "./ChatSidebar";
import { ChatWindow } from "./ChatWindow";
import { ChatWindowEmpty } from "./ChatWindowEmpty";
import { NewChatModal } from "./NewChatModal";
import { CreateGroupModal } from "./CreateGroupModal";
import { useAppDispatch } from "@/lib/redux/hooks";
import {
  setActiveConversation,
  hydrateDetailsPanel,
} from "@/features/chat/slice/chat.slice";

type ModalKind = null | "new" | "group";

// Rendered once by chat/layout.tsx so it survives navigation between
// /chat and /chat/[id] — only the conversation column swaps, no full-screen flash.
export function ChatScreen() {
  const params = useParams<{ conversationId?: string }>();
  const conversationId = params?.conversationId;
  const dispatch = useAppDispatch();
  const [modal, setModal] = useState<ModalKind>(null);

  const prevIdRef = useRef<string | undefined>(conversationId);

  useEffect(() => {
    dispatch(setActiveConversation(conversationId ?? null));
    // close the details panel when the user switches to a different
    // conversation (but keep the restored preference on first load)
    if (prevIdRef.current !== undefined && prevIdRef.current !== conversationId) {
      dispatch(hydrateDetailsPanel(false));
    }
    prevIdRef.current = conversationId;
  }, [conversationId, dispatch]);

  const openNew = () => setModal("new");
  const openGroup = () => setModal("group");
  const closeModal = () => setModal(null);

  const showConversation = Boolean(conversationId);

  return (
    <>
      <SidebarPanel className={showConversation ? "max-md:hidden" : undefined}>
        <ChatSidebar onNewConversation={openNew} onCreateGroup={openGroup} />
      </SidebarPanel>

      <ConversationPanel className={showConversation ? undefined : "max-md:hidden"}>
        {conversationId ? (
          <ChatWindow key={conversationId} conversationId={conversationId} />
        ) : (
          <ChatWindowEmpty onNewConversation={openNew} onCreateGroup={openGroup} />
        )}
      </ConversationPanel>

      <NewChatModal open={modal === "new"} onClose={closeModal} />
      <CreateGroupModal open={modal === "group"} onClose={closeModal} />
    </>
  );
}
