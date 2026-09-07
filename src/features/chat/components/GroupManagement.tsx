"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChatDetailsPanel } from "./ChatDetailsPanel";
import { RenameGroupModal } from "./RenameGroupModal";
import { AddMembersModal } from "./AddMembersModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  useRemoveParticipantMutation,
  usePromoteAdminMutation,
  useLeaveGroupMutation,
} from "@/features/chat/api/groups.api";
import { setActiveConversation } from "@/features/chat/slice/chat.slice";
import { useAppDispatch } from "@/lib/redux/hooks";
import { parseApiError } from "@/lib/api/parseApiError";
import type { Conversation } from "@/features/chat/types/conversation.types";
import type { User } from "@/features/chat/types/user.types";

interface GroupManagementProps {
  conversation: Conversation;
  currentUserId?: string;
}

export function GroupManagement({
  conversation,
  currentUserId,
}: GroupManagementProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [renameOpen, setRenameOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<User | null>(null);

  const [removeParticipant, { isLoading: removing }] =
    useRemoveParticipantMutation();
  const [promoteAdmin] = usePromoteAdminMutation();
  const [leaveGroup, { isLoading: leaving }] = useLeaveGroupMutation();

  const onPromote = useCallback(
    async (user: User) => {
      try {
        await promoteAdmin({
          conversationId: conversation.id,
          userId: user.id,
        }).unwrap();
        toast.success(`${user.name} is now an admin`);
      } catch (err) {
        toast.error(parseApiError(err).message);
      }
    },
    [conversation.id, promoteAdmin],
  );

  const confirmRemove = useCallback(async () => {
    if (!removeTarget) return;
    try {
      await removeParticipant({
        conversationId: conversation.id,
        userId: removeTarget.id,
      }).unwrap();
      toast.success(`${removeTarget.name} removed`);
      setRemoveTarget(null);
    } catch (err) {
      toast.error(parseApiError(err).message);
    }
  }, [removeTarget, conversation.id, removeParticipant]);

  const confirmLeave = useCallback(async () => {
    if (!currentUserId) return;
    try {
      await leaveGroup({
        conversationId: conversation.id,
        userId: currentUserId,
      }).unwrap();
      setLeaveOpen(false);
      dispatch(setActiveConversation(null));
      router.push("/chat");
    } catch (err) {
      toast.error(parseApiError(err).message);
    }
  }, [currentUserId, conversation.id, leaveGroup, dispatch, router]);

  return (
    <>
      <ChatDetailsPanel
        conversation={conversation}
        currentUserId={currentUserId}
        onAddMembers={() => setAddOpen(true)}
        onRename={() => setRenameOpen(true)}
        onLeave={() => setLeaveOpen(true)}
        onRemoveMember={setRemoveTarget}
        onPromoteMember={onPromote}
      />

      <RenameGroupModal
        open={renameOpen}
        conversationId={conversation.id}
        currentName={conversation.name ?? ""}
        onClose={() => setRenameOpen(false)}
      />

      <AddMembersModal
        open={addOpen}
        conversation={conversation}
        onClose={() => setAddOpen(false)}
      />

      <ConfirmDialog
        open={Boolean(removeTarget)}
        title="Remove member"
        description={
          removeTarget
            ? `Remove ${removeTarget.name} from ${conversation.name ?? "this group"}?`
            : ""
        }
        confirmLabel="Remove"
        danger
        loading={removing}
        onConfirm={confirmRemove}
        onClose={() => setRemoveTarget(null)}
      />

      <ConfirmDialog
        open={leaveOpen}
        title="Leave group"
        description={`You'll stop receiving messages from ${
          conversation.name ?? "this group"
        }. You can be added back by an admin.`}
        confirmLabel="Leave"
        danger
        loading={leaving}
        onConfirm={confirmLeave}
        onClose={() => setLeaveOpen(false)}
      />
    </>
  );
}
