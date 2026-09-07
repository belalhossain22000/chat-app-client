import type {
  Conversation,
  ConversationLastMessage,
  ConversationListItemDto,
} from "@/features/chat/types/conversation.types";

function cleanLastMessage(
  value: ConversationListItemDto["lastMessage"],
): ConversationLastMessage | undefined {
  if (value && "text" in value && typeof value.text === "string" && value.text) {
    return value as ConversationLastMessage;
  }
  return undefined;
}

export function normalizeConversation(dto: ConversationListItemDto): Conversation {
  const participants = dto.participants ?? (dto.participant ? [dto.participant] : []);

  return {
    id: dto.id,
    type: dto.type,
    name: dto.name,
    lastMessage: cleanLastMessage(dto.lastMessage),
    updatedAt: dto.updatedAt,
    createdBy: dto.createdBy,
    admins: dto.admins ?? [],
    participants,
  };
}

// Title + subtitle for a conversation row / header.
export function conversationTitle(c: Conversation, currentUserId?: string): string {
  if (c.type === "group") return c.name ?? "Group";
  const other = c.participants.find((p) => p.id !== currentUserId) ?? c.participants[0];
  return other?.name ?? "Conversation";
}
