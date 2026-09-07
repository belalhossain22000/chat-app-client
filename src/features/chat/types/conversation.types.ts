import type { ISODateString } from "@/types/common.types";
import type { User } from "./user.types";

export type ConversationType = "one-to-one" | "group";

export interface ConversationLastMessage {
  text: string;
  sender: string;
  createdAt: ISODateString;
}

export interface ConversationRestDto {
  id: string;
  type?: ConversationType;
  name?: string;
  lastMessage?: ConversationLastMessage;
  updatedAt?: ISODateString;
  createdAt?: ISODateString;
  createdBy?: string;
  admins?: string[];
  participants: Array<User | string>;
}

export interface Conversation {
  id: string;
  type: ConversationType;
  name?: string;
  lastMessage?: ConversationLastMessage;
  updatedAt: ISODateString;
  createdBy?: string;
  admins: string[];
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
