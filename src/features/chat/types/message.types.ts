import type { ISODateString } from "@/types/common.types";
import type { User } from "./user.types";

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

// message:new socket event
export interface MessageSocketDto {
  id: string;
  conversationId: string;
  sender: string;
  text: string;
  createdAt: ISODateString;
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

// message:send socket event
export interface SendMessageSocketPayload {
  conversationId: string;
  text: string;
}

export interface MessagesPage {
  messages: ChatMessage[]; // oldest -> newest
  hasMore: boolean;
  // cursor for the next (older) page = oldest message's createdAt
  nextCursor: string | null;
}

// Sender details resolved from the conversation participants.
export type SenderLookup = (senderId: string) => User | undefined;
