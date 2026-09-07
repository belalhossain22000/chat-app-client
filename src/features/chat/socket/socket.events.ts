// The client only listens; messages are sent over REST (POST /messages),
// which the backend fans out as `message:new` to everyone.
export const SOCKET_EVENTS = {
  NEW_MESSAGE: "message:new",
  CONVERSATION_UPDATED: "conversation:updated",
} as const;

// `message:new` payload (already has `id`, not `_id`; `createdAt` is epoch ms).
export interface NewMessageEvent {
  id: string;
  conversation: string;
  sender: string;
  text: string;
  createdAt: number | string;
}
