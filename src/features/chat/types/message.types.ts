import type { ISODateString } from "@/types/common.types";

export type MessageStatus = "sending" | "sent" | "failed";

// Live shape from GET /conversations/:id/messages and POST /messages (after _id -> id).
export interface MessageDto {
  id: string;
  conversation: string;
  sender: string; // user id only
  text: string;
  createdAt: ISODateString;
}

// GET /conversations/:id/messages
export interface MessageHistoryResponse {
  messages: MessageDto[]; // newest first
  hasMore: boolean;
}

// Normalised shape the UI renders (oldest -> newest). Dedupe by id.
export interface ChatMessage {
  id: string;
  tempId?: string; // set while optimistic
  conversationId: string;
  senderId: string;
  text: string;
  status: MessageStatus;
  createdAt: ISODateString;
}

// POST /messages
export interface SendMessageRequest {
  conversationId: string;
  text: string;
}

export interface MessagesPage {
  messages: ChatMessage[]; // oldest -> newest
  hasMore: boolean;
  nextCursor: string | null; // oldest message id, for the next `before` page
}
