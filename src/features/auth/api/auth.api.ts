import { baseApi } from "@/lib/api/baseApi";
import { mapId } from "@/lib/api/mapId";
import type {
  LoginRequest,
  LoginResponse,
  MeResponse,
} from "@/features/auth/types/auth.types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
      transformResponse: (res: { token: string; user: unknown }) => ({
        token: res.token,
        user: mapId(res.user) as LoginResponse["user"],
      }),
    }),
    getMe: build.query<MeResponse, void>({
      query: () => ({ url: "/auth/me" }),
      transformResponse: (res: unknown) => mapId(res) as MeResponse,
    }),
  }),
});

export const { useLoginMutation, useGetMeQuery, useLazyGetMeQuery } = authApi;
