import type { ISODateString } from "@/types/common.types";
import type { User } from "./user.types";

export type MessageStatus = "sending" | "sent" | "delivered" | "read" | "failed";

// REST shape: POST /messages, message history
export interface MessageRestDto {
  id: string;
  conversationId: string;
  senderId: string;
  sender: User;
  content: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

// message:new socket event
export interface MessageSocketDto {
  id: string;
  conversationId: string;
  sender: string;
  text: string;
  createdAt: ISODateString;
}

// Normalised shape the UI renders
export interface ChatMessage {
  id: string;
  tempId?: string;
  conversationId: string;
  senderId: string;
  sender?: User;
  text: string;
  status: MessageStatus;
  createdAt: ISODateString;
}

// POST /messages
export interface SendMessageRequest {
  conversationId: string;
  content: string;
}

// message:send socket event
export interface SendMessageSocketPayload {
  conversationId: string;
  text: string;
}
