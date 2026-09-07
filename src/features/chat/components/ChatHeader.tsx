"use client";

import { ArrowLeft, PanelRightOpen, PanelRightClose } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { IconButton } from "@/components/ui/IconButton";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  toggleDetailsPanel,
  setDetailsPanelOpen,
  setActiveConversation,
} from "@/features/chat/slice/chat.slice";
import type { Conversation } from "@/features/chat/types/conversation.types";
import { conversationTitle } from "@/features/chat/utils/normalizeConversation";

interface ChatHeaderProps {
  conversation: Conversation;
  currentUserId?: string;
}

export function ChatHeader({ conversation, currentUserId }: ChatHeaderProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const detailsOpen = useAppSelector((s) => s.chat.isDetailsPanelOpen);

  const isGroup = conversation.type === "group";
  const title = conversationTitle(conversation, currentUserId);
  const subtitle = isGroup
    ? `${conversation.participants.length} members`
    : conversation.participants.find((p) => p.id !== currentUserId)?.phone ?? "";

  function close() {
    dispatch(setActiveConversation(null));
    router.push("/chat");
  }

  return (
    <header className="flex items-center gap-3 border-b border-line bg-surface px-3 py-3 sm:px-4">
      <IconButton label="Back to conversations" size="sm" onClick={close}>
        <ArrowLeft className="size-5" />
      </IconButton>

      {/* tapping the identity opens details (a full-screen page on mobile,
          the side column on desktop) */}
      <button
        type="button"
        onClick={() => dispatch(setDetailsPanelOpen(true))}
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
      >
        <Avatar name={title} isGroup={isGroup} size="md" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-ink">
            {title}
          </span>
          {subtitle && (
            <span className="block truncate text-xs text-ink-muted">
              {subtitle}
            </span>
          )}
        </span>
      </button>

      {/* desktop-only collapse toggle */}
      <IconButton
        label={detailsOpen ? "Hide details" : "Show details"}
        className="hidden lg:inline-flex"
        onClick={() => dispatch(toggleDetailsPanel())}
      >
        {detailsOpen ? (
          <PanelRightClose className="size-5" />
        ) : (
          <PanelRightOpen className="size-5" />
        )}
      </IconButton>
    </header>
  );
}
