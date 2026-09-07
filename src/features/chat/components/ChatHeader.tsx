"use client";

import { ArrowLeft, PanelRightOpen, PanelRightClose } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { IconButton } from "@/components/ui/IconButton";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { toggleDetailsPanel } from "@/features/chat/slice/chat.slice";
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

  return (
    <header className="flex items-center gap-3 border-b border-line bg-surface px-3 py-3 sm:px-4">
      <IconButton
        label="Back to conversations"
        size="sm"
        className="md:hidden"
        onClick={() => router.push("/chat")}
      >
        <ArrowLeft className="size-5" />
      </IconButton>

      <Avatar name={title} isGroup={isGroup} size="md" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ink">{title}</p>
        {subtitle && (
          <p className="truncate text-xs text-ink-muted">{subtitle}</p>
        )}
      </div>

      <IconButton
        label={detailsOpen ? "Hide details" : "Show details"}
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
