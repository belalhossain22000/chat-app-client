import type { ISODateString } from "@/types/common.types";
import type { Conversation } from "./conversation.types";

export type SocketStatus = "connecting" | "connected" | "disconnected";

export type ConversationFilter = "all" | "unread" | "groups";

// Client-side chat state only; server data lives in RTK Query
export interface ChatUiState {
  activeConversationId: string | null;
  socketStatus: SocketStatus;
  unreadByConversationId: Record<string, number>;
  isDetailsPanelOpen: boolean;
  conversationFilter: ConversationFilter;
}

// conversation:updated socket event
export type ConversationUpdatedEvent = Conversation;

export interface DayGroupKey {
  date: ISODateString;
  label: string;
}
