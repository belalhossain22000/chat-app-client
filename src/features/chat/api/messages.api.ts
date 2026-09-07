import { baseApi } from "@/lib/api/baseApi";
import { mapId } from "@/lib/api/mapId";
import { normalizeMessage, upsertMessage } from "@/features/chat/utils/normalizeMessage";
import type {
  ChatMessage,
  MessageDto,
  MessagesPage,
} from "@/features/chat/types/message.types";

const PAGE_SIZE = 25;

interface HistoryArg {
  conversationId: string;
  before?: string;
}

interface SendArg {
  conversationId: string;
  text: string;
  senderId: string;
  tempId: string;
}

export const messagesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMessages: build.query<MessagesPage, HistoryArg>({
      query: ({ conversationId, before }) => ({
        url: `/conversations/${conversationId}/messages`,
        params: { limit: PAGE_SIZE, ...(before ? { before } : {}) },
      }),
      transformResponse: (
        res: { messages: unknown[]; hasMore: boolean },
      ): MessagesPage => {
        // API returns newest-first; UI wants oldest -> newest
        const ordered = (mapId(res.messages) as MessageDto[])
          .map(normalizeMessage)
          .sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          );
        return {
          messages: ordered,
          hasMore: res.hasMore,
          // `before` cursor is the oldest message's id (not a timestamp)
          nextCursor: ordered.length ? ordered[0].id : null,
        };
      },
      // one cache entry per conversation; pages are merged in
      serializeQueryArgs: ({ queryArgs }) => queryArgs.conversationId,
      merge: (current, incoming, { arg }) => {
        if (!arg.before) {
          current.messages = incoming.messages;
          current.hasMore = incoming.hasMore;
          current.nextCursor = incoming.nextCursor;
          return;
        }
        const seen = new Set(current.messages.map((m) => m.id));
        const older = incoming.messages.filter((m) => !seen.has(m.id));
        current.messages = [...older, ...current.messages];
        // `before` is inclusive; if the page added nothing new, we're at the start
        current.hasMore = older.length > 0 && incoming.hasMore;
        current.nextCursor = older.length ? older[0].id : current.nextCursor;
      },
      forceRefetch: ({ currentArg, previousArg }) =>
        currentArg?.before !== previousArg?.before ||
        currentArg?.conversationId !== previousArg?.conversationId,
      providesTags: (_r, _e, arg) => [
        { type: "Message", id: arg.conversationId },
      ],
    }),

    sendMessage: build.mutation<ChatMessage, SendArg>({
      query: ({ conversationId, text }) => ({
        url: "/messages",
        method: "POST",
        body: { conversationId, text },
      }),
      transformResponse: (res: unknown) =>
        normalizeMessage(mapId(res) as MessageDto),

      async onQueryStarted(
        { conversationId, text, senderId, tempId },
        { dispatch, queryFulfilled },
      ) {
        const optimistic: ChatMessage = {
          id: "",
          tempId,
          conversationId,
          senderId,
          text,
          status: "sending",
          createdAt: new Date().toISOString(),
        };

        dispatch(
          messagesApi.util.updateQueryData(
            "getMessages",
            { conversationId },
            (draft) => {
              draft.messages = upsertMessage(draft.messages, optimistic);
            },
          ),
        );

        try {
          const { data: saved } = await queryFulfilled;
          dispatch(
            messagesApi.util.updateQueryData(
              "getMessages",
              { conversationId },
              (draft) => {
                draft.messages = upsertMessage(draft.messages, {
                  ...saved,
                  tempId,
                });
              },
            ),
          );
        } catch {
          dispatch(
            messagesApi.util.updateQueryData(
              "getMessages",
              { conversationId },
              (draft) => {
                const idx = draft.messages.findIndex((m) => m.tempId === tempId);
                if (idx !== -1) draft.messages[idx].status = "failed";
              },
            ),
          );
        }
      },
    }),
  }),
});

export const { useGetMessagesQuery, useLazyGetMessagesQuery, useSendMessageMutation } =
  messagesApi;
