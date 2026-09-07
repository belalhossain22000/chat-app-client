"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, X } from "lucide-react";
import { toast } from "sonner";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { UserSearchList } from "./UserSearchList";
import { useCreateGroupMutation } from "@/features/chat/api/conversations.api";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setActiveConversation } from "@/features/chat/slice/chat.slice";
import { parseApiError } from "@/lib/api/parseApiError";
import type { User } from "@/features/chat/types/user.types";

export function CreateGroupModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [createGroup, { isLoading }] = useCreateGroupMutation();

  const [name, setName] = useState("");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<User[]>([]);

  const selectedIds = useMemo(
    () => new Set(selected.map((u) => u.id)),
    [selected],
  );
  const canCreate = name.trim().length >= 2 && selected.length >= 1 && !isLoading;

  function reset() {
    setName("");
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

  async function handleCreate() {
    if (!canCreate) return;
    try {
      const group = await createGroup({
        name: name.trim(),
        participantIds: selected.map((u) => u.id),
      }).unwrap();
      dispatch(setActiveConversation(group.id));
      handleClose();
      router.push(`/chat/${group.id}`);
    } catch (err) {
      toast.error(parseApiError(err).message);
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Create a group"
      size="lg"
      footer={
        <>
          <span className="mr-auto text-xs text-ink-muted">
            {selected.length} member{selected.length === 1 ? "" : "s"} selected
          </span>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleCreate} loading={isLoading} disabled={!canCreate}>
            Create group
            {!isLoading && <ArrowRight className="size-4" />}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4 px-5 py-4">
        <p className="text-sm text-ink-muted">
          Bring people together for better conversations.
        </p>

        <div className="flex flex-col gap-2">
          <label htmlFor="group-name" className="text-sm font-medium text-ink">
            Group name <span className="text-accent">*</span>
          </label>
          <input
            id="group-name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={50}
            placeholder="e.g. Project Team"
            className="h-11 rounded-xl border border-line bg-surface px-3.5 text-sm text-ink outline-none placeholder:text-ink-muted focus:ring-2 focus:ring-accent"
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-ink">
            Add members <span className="text-accent">*</span>
          </span>

          {selected.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selected.map((u) => (
                <span
                  key={u.id}
                  className="inline-flex items-center gap-1.5 rounded-full bg-surface-muted py-1 pl-1 pr-2 text-xs text-ink"
                >
                  <Avatar name={u.name} size="sm" className="!size-5" />
                  {u.name}
                  <button
                    type="button"
                    aria-label={`Remove ${u.name}`}
                    onClick={() => toggle(u)}
                    className="text-ink-muted hover:text-ink"
                  >
                    <X className="size-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="flex h-11 items-center gap-2.5 rounded-xl border border-line bg-surface-muted px-3.5 focus-within:ring-2 focus-within:ring-accent">
            <Search className="size-4 shrink-0 text-ink-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or phone number..."
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted"
            />
          </div>

          <div className="max-h-64 overflow-y-auto">
            <UserSearchList
              query={query}
              multi
              selectedIds={selectedIds}
              onToggle={toggle}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
