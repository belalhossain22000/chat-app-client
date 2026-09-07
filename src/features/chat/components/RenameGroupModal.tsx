"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useRenameGroupMutation } from "@/features/chat/api/groups.api";
import { parseApiError } from "@/lib/api/parseApiError";

interface RenameGroupModalProps {
  open: boolean;
  conversationId: string;
  currentName: string;
  onClose: () => void;
}

export function RenameGroupModal({
  open,
  conversationId,
  currentName,
  onClose,
}: RenameGroupModalProps) {
  const [name, setName] = useState(currentName);
  const [rename, { isLoading }] = useRenameGroupMutation();

  useEffect(() => {
    if (open) setName(currentName);
  }, [open, currentName]);

  const trimmed = name.trim();
  const canSave = trimmed.length >= 2 && trimmed !== currentName && !isLoading;

  async function handleSave() {
    if (!canSave) return;
    try {
      await rename({ conversationId, name: trimmed }).unwrap();
      onClose();
    } catch (err) {
      toast.error(parseApiError(err).message);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Rename group"
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} loading={isLoading} disabled={!canSave}>
            Save
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-2 px-5 py-4">
        <label htmlFor="rename-group" className="text-sm font-medium text-ink">
          Group name
        </label>
        <input
          id="rename-group"
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={50}
          className="h-11 rounded-xl border border-line bg-surface px-3.5 text-sm text-ink outline-none focus:ring-2 focus:ring-accent"
        />
      </div>
    </Modal>
  );
}
