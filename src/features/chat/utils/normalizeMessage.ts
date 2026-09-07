import type { ChatMessage, MessageDto } from "@/features/chat/types/message.types";

export function normalizeMessage(dto: MessageDto): ChatMessage {
  return {
    id: dto.id,
    conversationId: dto.conversation,
    senderId: dto.sender,
    text: dto.text,
    status: "sent",
    createdAt: dto.createdAt,
  };
}

// `message:new` payload: `conversation` (not `conversationId`), `createdAt`
// may be epoch ms.
export function socketMessageToChat(evt: {
  id: string;
  conversation: string;
  sender: string;
  text: string;
  createdAt: number | string;
}): ChatMessage {
  return {
    id: evt.id,
    conversationId: evt.conversation,
    senderId: evt.sender,
    text: evt.text,
    status: "sent",
    createdAt:
      typeof evt.createdAt === "number"
        ? new Date(evt.createdAt).toISOString()
        : evt.createdAt,
  };
}

// Insert/replace by id; reconcile an optimistic message via tempId.
export function upsertMessage(
  list: ChatMessage[],
  incoming: ChatMessage,
): ChatMessage[] {
  const idx = list.findIndex(
    (m) =>
      m.id === incoming.id ||
      (incoming.tempId != null && m.tempId === incoming.tempId),
  );
  if (idx !== -1) {
    const next = list.slice();
    next[idx] = { ...incoming, tempId: next[idx].tempId ?? incoming.tempId };
    return next;
  }
  return [...list, incoming].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
}
