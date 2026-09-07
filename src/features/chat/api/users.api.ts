import { baseApi } from "@/lib/api/baseApi";
import { mapId } from "@/lib/api/mapId";
import type { User } from "@/features/chat/types/user.types";

// The backend uses `q` as a raw regex:
//  - unescaped metacharacters (`+`, `(`, `[`, `*`…) crash the request, so escape them
//  - matching is case-sensitive by default, so prefix `(?i)` for insensitivity
function toSearchRegex(value: string): string {
  const escaped = value.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return escaped ? `(?i)${escaped}` : "";
}

export const usersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    searchUsers: build.query<User[], string>({
      query: (q) => ({ url: "/users/search", params: { q: toSearchRegex(q) } }),
      transformResponse: (res: unknown) => mapId(res) as User[],
    }),
  }),
});

export const { useSearchUsersQuery, useLazySearchUsersQuery } = usersApi;
