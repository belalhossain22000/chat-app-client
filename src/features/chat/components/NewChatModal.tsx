"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { UserSearchList } from "./UserSearchList";
import { useCreateConversationMutation } from "@/features/chat/api/conversations.api";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setActiveConversation } from "@/features/chat/slice/chat.slice";
import { parseApiError } from "@/lib/api/parseApiError";
import type { User } from "@/features/chat/types/user.types";

export function NewChatModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [createConversation, { isLoading }] = useCreateConversationMutation();

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<User | null>(null);

  function reset() {
    setQuery("");
    setSelected(null);
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleStart() {
    if (!selected) return;
    try {
      const { id } = await createConversation({ userId: selected.id }).unwrap();
      dispatch(setActiveConversation(id));
      handleClose();
      router.push(`/chat/${id}`);
    } catch (err) {
      toast.error(parseApiError(err).message);
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="New conversation"
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleStart} loading={isLoading} disabled={!selected}>
            Start conversation
            {!isLoading && <ArrowRight className="size-4" />}
          </Button>
        </>
      }
    >
      <div className="px-5 pb-2 pt-4">
        <p className="mb-3 text-sm text-ink-muted">
          Find someone by name or phone number.
        </p>
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
          selectedIds={new Set(selected ? [selected.id] : [])}
          onToggle={(user) =>
            setSelected((cur) => (cur?.id === user.id ? null : user))
          }
        />
      </div>
    </Modal>
  );
}
