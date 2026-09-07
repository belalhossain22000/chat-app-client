import type { ISODateString } from "@/types/common.types";
import type { User } from "./user.types";

// Live API type is "direct" | "group" (docs say "one-to-one").
export type ConversationType = "direct" | "group";

export interface ConversationLastMessage {
  text: string;
  sender: string;
  createdAt: ISODateString;
}

// Raw list item from GET /conversations (after _id -> id).
// direct: { participant } (the OTHER user). group: { participants, name, admins, createdBy }.
export interface ConversationListItemDto {
  id: string;
  type: ConversationType;
  updatedAt: ISODateString;
  lastMessage?: ConversationLastMessage | Record<string, never>;
  participant?: User;
  participants?: User[];
  name?: string;
  createdBy?: string;
  admins?: string[];
}

// Raw from POST /conversations (1:1 create): participants as id strings, no type.
export interface CreatedDirectDto {
  id: string;
  participants: string[];
  createdAt: ISODateString;
}

// Normalised shape the UI renders.
export interface Conversation {
  id: string;
  type: ConversationType;
  name?: string; // group only
  lastMessage?: ConversationLastMessage;
  updatedAt: ISODateString;
  createdBy?: string;
  admins: string[];
  // direct: [the other user]. group: everyone.
  participants: User[];
}

// POST /conversations
export interface CreateConversationRequest {
  userId: string;
}

// POST /conversations/group
export interface CreateGroupRequest {
  name: string;
  participantIds: string[];
}

// POST /conversations/:id/participants
export interface AddParticipantsRequest {
  userIds: string[];
}

// POST /conversations/:id/admins
export interface PromoteAdminRequest {
  userId: string;
}

// PATCH /conversations/:id
export interface RenameGroupRequest {
  name: string;
}
