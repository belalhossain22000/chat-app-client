import { baseApi } from "@/lib/api/baseApi";
import { mapId } from "@/lib/api/mapId";
import { conversationsApi } from "@/features/chat/api/conversations.api";
import { normalizeConversation } from "@/features/chat/utils/normalizeConversation";
import type {
  AddParticipantsRequest,
  Conversation,
  ConversationListItemDto,
  PromoteAdminRequest,
  RenameGroupRequest,
} from "@/features/chat/types/conversation.types";

// Every group mutation returns the full updated conversation (rich shape).
const toConversation = (res: unknown): Conversation =>
  normalizeConversation(mapId(res) as ConversationListItemDto);

interface GroupArg {
  conversationId: string;
}

// Merge the updated conversation into the list cache after the mutation lands.
function patchList(id: string) {
  return async (
    _arg: GroupArg,
    {
      dispatch,
      queryFulfilled,
    }: {
      dispatch: (a: unknown) => unknown;
      queryFulfilled: Promise<{ data: Conversation }>;
    },
  ) => {
    try {
      const { data } = await queryFulfilled;
      dispatch(
        conversationsApi.util.updateQueryData(
          "getConversations",
          undefined,
          (draft) => {
            const idx = draft.findIndex((c) => c.id === id);
            if (idx !== -1) draft[idx] = data;
          },
        ),
      );
    } catch {
      /* error middleware shows the toast */
    }
  };
}

export const groupsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addParticipants: build.mutation<
      Conversation,
      GroupArg & AddParticipantsRequest
    >({
      query: ({ conversationId, userIds }) => ({
        url: `/conversations/${conversationId}/participants`,
        method: "POST",
        body: { userIds },
      }),
      transformResponse: toConversation,
      onQueryStarted: (arg, api) => patchList(arg.conversationId)(arg, api),
    }),

    removeParticipant: build.mutation<
      Conversation,
      GroupArg & { userId: string }
    >({
      query: ({ conversationId, userId }) => ({
        url: `/conversations/${conversationId}/participants/${userId}`,
        method: "DELETE",
      }),
      transformResponse: toConversation,
      onQueryStarted: (arg, api) => patchList(arg.conversationId)(arg, api),
    }),

    promoteAdmin: build.mutation<Conversation, GroupArg & PromoteAdminRequest>({
      query: ({ conversationId, userId }) => ({
        url: `/conversations/${conversationId}/admins`,
        method: "POST",
        body: { userId },
      }),
      transformResponse: toConversation,
      onQueryStarted: (arg, api) => patchList(arg.conversationId)(arg, api),
    }),

    renameGroup: build.mutation<Conversation, GroupArg & RenameGroupRequest>({
      query: ({ conversationId, name }) => ({
        url: `/conversations/${conversationId}`,
        method: "PATCH",
        body: { name },
      }),
      transformResponse: toConversation,
      onQueryStarted: (arg, api) => patchList(arg.conversationId)(arg, api),
    }),

    leaveGroup: build.mutation<Conversation, GroupArg & { userId: string }>({
      query: ({ conversationId, userId }) => ({
        url: `/conversations/${conversationId}/participants/${userId}`,
        method: "DELETE",
      }),
      transformResponse: toConversation,
      invalidatesTags: [{ type: "Conversation", id: "LIST" }],
    }),
  }),
});

export const {
  useAddParticipantsMutation,
  useRemoveParticipantMutation,
  usePromoteAdminMutation,
  useRenameGroupMutation,
  useLeaveGroupMutation,
} = groupsApi;
