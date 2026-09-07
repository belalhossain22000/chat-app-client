import { baseApi } from "@/lib/api/baseApi";
import { mapId } from "@/lib/api/mapId";
import { normalizeConversation } from "@/features/chat/utils/normalizeConversation";
import type {
  Conversation,
  ConversationListItemDto,
  CreateConversationRequest,
  CreateGroupRequest,
} from "@/features/chat/types/conversation.types";

export const conversationsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getConversations: build.query<Conversation[], void>({
      query: () => ({ url: "/conversations" }),
      transformResponse: (res: { data: unknown[] }) =>
        (mapId(res.data) as ConversationListItemDto[])
          .map(normalizeConversation)
          .sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
          ),
      providesTags: (result) =>
        result
          ? [
              ...result.map((c) => ({ type: "Conversation" as const, id: c.id })),
              { type: "Conversation" as const, id: "LIST" },
            ]
          : [{ type: "Conversation" as const, id: "LIST" }],
    }),

    createConversation: build.mutation<{ id: string }, CreateConversationRequest>({
      query: (body) => ({ url: "/conversations", method: "POST", body }),
      transformResponse: (res: unknown) => mapId(res) as { id: string },
      invalidatesTags: [{ type: "Conversation", id: "LIST" }],
    }),

    createGroup: build.mutation<Conversation, CreateGroupRequest>({
      query: (body) => ({ url: "/conversations/group", method: "POST", body }),
      transformResponse: (res: unknown) =>
        normalizeConversation(mapId(res) as ConversationListItemDto),
      invalidatesTags: [{ type: "Conversation", id: "LIST" }],
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useCreateConversationMutation,
  useCreateGroupMutation,
} = conversationsApi;
