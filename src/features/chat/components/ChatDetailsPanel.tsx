"use client";

import { useMemo } from "react";
import { Phone, UserPlus, Pencil, LogOut } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { GroupMembersList } from "./GroupMembersList";
import { conversationTitle } from "@/features/chat/utils/normalizeConversation";
import { canManageGroup } from "@/features/chat/utils/permissions";
import type { Conversation } from "@/features/chat/types/conversation.types";
import type { User } from "@/features/chat/types/user.types";

interface ChatDetailsPanelProps {
  conversation: Conversation;
  currentUserId?: string;
  onAddMembers?: () => void;
  onRename?: () => void;
  onLeave?: () => void;
  onRemoveMember?: (user: User) => void;
  onPromoteMember?: (user: User) => void;
}

function ActionRow({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
        danger
          ? "text-accent hover:bg-tint-coral/50"
          : "text-ink hover:bg-surface-muted"
      }`}
    >
      <span className={danger ? "text-accent" : "text-ink-muted"}>{icon}</span>
      {label}
    </button>
  );
}

export function ChatDetailsPanel({
  conversation,
  currentUserId,
  onAddMembers,
  onRename,
  onLeave,
  onRemoveMember,
  onPromoteMember,
}: ChatDetailsPanelProps) {
  const isGroup = conversation.type === "group";
  const title = conversationTitle(conversation, currentUserId);
  const canManage = canManageGroup(conversation, currentUserId);

  const peer = useMemo(
    () =>
      isGroup
        ? undefined
        : conversation.participants.find((p) => p.id !== currentUserId) ??
          conversation.participants[0],
    [isGroup, conversation.participants, currentUserId],
  );

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="flex flex-col items-center gap-3 border-b border-line px-5 py-6 text-center">
        <Avatar name={title} isGroup={isGroup} size="xl" />
        <div>
          <p className="text-lg font-semibold text-ink">{title}</p>
          <p className="text-sm text-ink-muted">
            {isGroup
              ? `${conversation.participants.length} members`
              : peer?.phone}
          </p>
        </div>
      </div>

      {!isGroup && peer && (
        <div className="border-b border-line px-5 py-4">
          <p className="mb-1 text-sm font-semibold text-ink">
            Contact information
          </p>
          <div className="flex items-center gap-3 py-2 text-sm">
            <Phone className="size-4 text-ink-muted" />
            <span className="text-ink">{peer.phone}</span>
          </div>
        </div>
      )}

      {isGroup && (
        <>
          <div className="flex flex-col gap-0.5 border-b border-line px-3 py-3">
            {canManage && (
              <>
                <ActionRow
                  icon={<UserPlus className="size-4" />}
                  label="Add members"
                  onClick={onAddMembers}
                />
                <ActionRow
                  icon={<Pencil className="size-4" />}
                  label="Rename group"
                  onClick={onRename}
                />
              </>
            )}
            <ActionRow
              icon={<LogOut className="size-4" />}
              label="Leave group"
              onClick={onLeave}
              danger
            />
          </div>

          <div className="px-5 py-4">
            <p className="mb-2 text-sm font-semibold text-ink">
              Members ({conversation.participants.length})
            </p>
            <GroupMembersList
              conversation={conversation}
              currentUserId={currentUserId}
              canManage={canManage}
              onRemove={onRemoveMember}
              onPromote={onPromoteMember}
            />
          </div>
        </>
      )}
    </div>
  );
}
