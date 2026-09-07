"use client";

import { useMemo } from "react";
import { MoreVertical, ShieldCheck, UserMinus } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";
import type { Conversation } from "@/features/chat/types/conversation.types";
import type { User } from "@/features/chat/types/user.types";

interface GroupMembersListProps {
  conversation: Conversation;
  currentUserId?: string;
  canManage: boolean;
  onRemove?: (user: User) => void;
  onPromote?: (user: User) => void;
}

export function GroupMembersList({
  conversation,
  currentUserId,
  canManage,
  onRemove,
  onPromote,
}: GroupMembersListProps) {
  const members = useMemo(() => {
    const admins = new Set(conversation.admins);
    return [...conversation.participants].sort((a, b) => {
      const aa = admins.has(a.id) ? 0 : 1;
      const bb = admins.has(b.id) ? 0 : 1;
      return aa - bb || a.name.localeCompare(b.name);
    });
  }, [conversation.participants, conversation.admins]);

  return (
    <ul className="flex flex-col">
      {members.map((m) => {
        const isMemberAdmin = conversation.admins.includes(m.id);
        const isSelf = m.id === currentUserId;
        const showMenu = canManage && !isSelf;

        return (
          <li key={m.id} className="flex items-center gap-3 py-2">
            <Avatar name={m.name} size="md" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">
                {m.name}
                {isSelf && <span className="text-ink-muted"> (You)</span>}
              </p>
              <p className="truncate text-xs text-ink-muted">{m.phone}</p>
            </div>

            {isMemberAdmin && (
              <span className="rounded-full bg-tint-coral/50 px-2 py-0.5 text-xs font-medium text-accent">
                Admin
              </span>
            )}

            {showMenu && (
              <Dropdown
                side="bottom"
                align="end"
                aria-label={`Manage ${m.name}`}
                triggerClassName="inline-flex size-8 items-center justify-center rounded-lg text-ink-muted hover:bg-surface-muted hover:text-ink"
                trigger={<MoreVertical className="size-4" />}
              >
                {!isMemberAdmin && (
                  <DropdownItem
                    icon={<ShieldCheck className="size-4" />}
                    onSelect={() => onPromote?.(m)}
                  >
                    Make admin
                  </DropdownItem>
                )}
                <DropdownItem
                  icon={<UserMinus className="size-4" />}
                  danger
                  onSelect={() => onRemove?.(m)}
                >
                  Remove from group
                </DropdownItem>
              </Dropdown>
            )}
          </li>
        );
      })}
    </ul>
  );
}
