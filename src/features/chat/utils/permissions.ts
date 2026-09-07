import type { Conversation } from "@/features/chat/types/conversation.types";

export function isAdmin(conversation: Conversation, userId?: string): boolean {
  return userId ? conversation.admins.includes(userId) : false;
}

// Frontend gate only — the backend is the final authority.
export function canManageGroup(
  conversation: Conversation,
  userId?: string,
): boolean {
  return conversation.type === "group" && isAdmin(conversation, userId);
}
