import { baseApi } from "@/lib/api/baseApi";
import { mapId } from "@/lib/api/mapId";
import type { User } from "@/features/chat/types/user.types";

export const usersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    searchUsers: build.query<User[], string>({
      query: (q) => ({ url: "/users/search", params: { q } }),
      transformResponse: (res: unknown) => mapId(res) as User[],
    }),
  }),
});

export const { useSearchUsersQuery, useLazySearchUsersQuery } = usersApi;
