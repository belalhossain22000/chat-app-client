"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { UserSearchList } from "./UserSearchList";
import { useAddParticipantsMutation } from "@/features/chat/api/groups.api";
import { parseApiError } from "@/lib/api/parseApiError";
import type { Conversation } from "@/features/chat/types/conversation.types";
import type { User } from "@/features/chat/types/user.types";

interface AddMembersModalProps {
  open: boolean;
  conversation: Conversation;
  onClose: () => void;
}

export function AddMembersModal({
  open,
  conversation,
  onClose,
}: AddMembersModalProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<User[]>([]);
  const [addParticipants, { isLoading }] = useAddParticipantsMutation();

  const existingIds = useMemo(
    () => new Set(conversation.participants.map((p) => p.id)),
    [conversation.participants],
  );
  const selectedIds = useMemo(
    () => new Set(selected.map((u) => u.id)),
    [selected],
  );

  function reset() {
    setQuery("");
    setSelected([]);
  }

  function handleClose() {
    reset();
    onClose();
  }

  function toggle(user: User) {
    setSelected((cur) =>
      cur.some((u) => u.id === user.id)
        ? cur.filter((u) => u.id !== user.id)
        : [...cur, user],
    );
  }

  async function handleAdd() {
    if (selected.length === 0) return;
    try {
      await addParticipants({
        conversationId: conversation.id,
        userIds: selected.map((u) => u.id),
      }).unwrap();
      toast.success(
        selected.length === 1
          ? `${selected[0].name} added`
          : `${selected.length} members added`,
      );
      handleClose();
    } catch (err) {
      toast.error(parseApiError(err).message);
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Add members"
      size="md"
      footer={
        <>
          <span className="mr-auto text-xs text-ink-muted">
            {selected.length} selected
          </span>
          <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            loading={isLoading}
            disabled={selected.length === 0}
          >
            Add
          </Button>
        </>
      }
    >
      <div className="px-5 pb-2 pt-4">
        <div className="flex h-11 items-center gap-2.5 rounded-xl border border-line bg-surface-muted px-3.5 focus-within:ring-2 focus-within:ring-accent">
          <Search className="size-4 shrink-0 text-ink-muted" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search people..."
            className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted"
          />
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto px-3 pb-4">
        <UserSearchList
          query={query}
          multi
          selectedIds={selectedIds}
          excludeIds={existingIds}
          onToggle={toggle}
        />
      </div>
    </Modal>
  );
}
