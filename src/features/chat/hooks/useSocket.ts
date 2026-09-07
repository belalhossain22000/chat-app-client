"use client";

import { useEffect } from "react";
import { getSocket, disconnectSocket } from "@/features/chat/socket/socket.client";
import {
  SOCKET_EVENTS,
  type NewMessageEvent,
} from "@/features/chat/socket/socket.events";
import { socketMessageToChat, upsertMessage } from "@/features/chat/utils/normalizeMessage";
import { messagesApi } from "@/features/chat/api/messages.api";
import { conversationsApi } from "@/features/chat/api/conversations.api";
import { useAppDispatch } from "@/lib/redux/hooks";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  setSocketStatus,
  incrementUnread,
} from "@/features/chat/slice/chat.slice";
import type { Conversation } from "@/features/chat/types/conversation.types";

// Mounted once inside the chat area. Owns the socket lifecycle and routes
// real-time events into the RTK Query cache.
export function useSocket() {
  const dispatch = useAppDispatch();
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;
    const socket = getSocket(token);

    const onConnect = () => dispatch(setSocketStatus("connected"));
    const onConnecting = () => dispatch(setSocketStatus("connecting"));
    const onDisconnect = () => dispatch(setSocketStatus("disconnected"));

    const onNewMessage = (evt: NewMessageEvent) => {
      const msg = socketMessageToChat(evt);

      // add to the open thread's cache (dedupe by id / reconcile tempId)
      dispatch(
        messagesApi.util.updateQueryData(
          "getMessages",
          { conversationId: msg.conversationId },
          (draft) => {
            draft.messages = upsertMessage(draft.messages, msg);
          },
        ),
      );

      // bump unread + refresh the conversation preview/order
      dispatch(incrementUnread(msg.conversationId));
      dispatch(
        conversationsApi.util.updateQueryData(
          "getConversations",
          undefined,
          (draft) => {
            const c = draft.find((x) => x.id === msg.conversationId);
            if (c) {
              c.lastMessage = {
                text: msg.text,
                sender: msg.senderId,
                createdAt: msg.createdAt,
              };
              c.updatedAt = msg.createdAt;
              draft.sort(
                (a, b) =>
                  new Date(b.updatedAt).getTime() -
                  new Date(a.updatedAt).getTime(),
              );
            } else {
              // conversation we don't have yet — pull a fresh list
              dispatch(
                conversationsApi.util.invalidateTags([
                  { type: "Conversation", id: "LIST" },
                ]),
              );
            }
          },
        ),
      );
    };

    const onConversationUpdated = (conversation: Conversation) => {
      dispatch(
        conversationsApi.util.invalidateTags([
          { type: "Conversation", id: "LIST" },
        ]),
      );
      void conversation;
    };

    dispatch(setSocketStatus(socket.connected ? "connected" : "connecting"));
    socket.on("connect", onConnect);
    socket.io.on("reconnect_attempt", onConnecting);
    socket.on("disconnect", onDisconnect);
    socket.on(SOCKET_EVENTS.NEW_MESSAGE, onNewMessage);
    socket.on(SOCKET_EVENTS.CONVERSATION_UPDATED, onConversationUpdated);

    return () => {
      socket.off("connect", onConnect);
      socket.io.off("reconnect_attempt", onConnecting);
      socket.off("disconnect", onDisconnect);
      socket.off(SOCKET_EVENTS.NEW_MESSAGE, onNewMessage);
      socket.off(SOCKET_EVENTS.CONVERSATION_UPDATED, onConversationUpdated);
    };
  }, [token, dispatch]);

  useEffect(() => {
    return () => {
      // full teardown only when auth is gone (handled in logout too)
    };
  }, []);
}

export { disconnectSocket };
