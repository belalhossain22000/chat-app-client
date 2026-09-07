"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { SidebarPanel, ConversationPanel } from "@/components/layout/AppShell";
import { ChatSidebar } from "./ChatSidebar";
import { ChatWindow } from "./ChatWindow";
import { ChatWindowEmpty } from "./ChatWindowEmpty";
import { ChatFab } from "./ChatFab";
import { MobileTabBar, type MobileTab } from "./MobileTabBar";
import { NewChatModal } from "./NewChatModal";
import { CreateGroupModal } from "./CreateGroupModal";
import { ProfileView } from "@/features/profile/components/ProfileView";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  setActiveConversation,
  hydrateDetailsPanel,
  setConversationFilter,
} from "@/features/chat/slice/chat.slice";

type ModalKind = null | "new" | "group";

// Rendered once by chat/layout.tsx so it survives navigation between
// /chat and /chat/[id] — only the conversation column swaps, no full-screen flash.
export function ChatScreen() {
  const params = useParams<{ conversationId?: string }>();
  const conversationId = params?.conversationId;
  const dispatch = useAppDispatch();
  const filter = useAppSelector((s) => s.chat.conversationFilter);

  const [modal, setModal] = useState<ModalKind>(null);
  const [mobileTab, setMobileTab] = useState<MobileTab>("chats");

  const prevIdRef = useRef<string | undefined>(conversationId);

  useEffect(() => {
    dispatch(setActiveConversation(conversationId ?? null));
    if (prevIdRef.current !== undefined && prevIdRef.current !== conversationId) {
      dispatch(hydrateDetailsPanel(false));
    }
    prevIdRef.current = conversationId;
  }, [conversationId, dispatch]);

  // Chats / Groups tabs drive the conversation filter on mobile.
  function handleTabChange(tab: MobileTab) {
    setMobileTab(tab);
    if (tab === "chats" && filter === "groups") dispatch(setConversationFilter("all"));
    if (tab === "groups") dispatch(setConversationFilter("groups"));
  }

  const openNew = () => setModal("new");
  const openGroup = () => setModal("group");
  const closeModal = () => setModal(null);

  const showConversation = Boolean(conversationId);
  // on mobile, a chosen conversation takes over the whole screen
  const mobileListVisible = !showConversation && mobileTab !== "profile";
  const mobileProfileVisible = !showConversation && mobileTab === "profile";

  return (
    <>
      <SidebarPanel
        className={showConversation || mobileTab === "profile" ? "max-md:hidden" : undefined}
      >
        <ChatSidebar onNewConversation={openNew} onCreateGroup={openGroup} />
      </SidebarPanel>

      {mobileListVisible && (
        <ChatFab onNewConversation={openNew} onCreateGroup={openGroup} />
      )}

      {/* mobile-only profile page */}
      {mobileProfileVisible && (
        <section className="flex min-w-0 flex-1 flex-col md:hidden">
          <ProfileView onBack={() => setMobileTab("chats")} />
        </section>
      )}

      <ConversationPanel
        className={showConversation ? undefined : "max-md:hidden"}
      >
        {conversationId ? (
          <ChatWindow key={conversationId} conversationId={conversationId} />
        ) : (
          <ChatWindowEmpty onNewConversation={openNew} onCreateGroup={openGroup} />
        )}
      </ConversationPanel>

      {!showConversation && (
        <div className="fixed inset-x-0 bottom-0 z-20 md:hidden">
          <MobileTabBar active={mobileTab} onChange={handleTabChange} />
        </div>
      )}

      <NewChatModal open={modal === "new"} onClose={closeModal} />
      <CreateGroupModal open={modal === "group"} onClose={closeModal} />
    </>
  );
}
