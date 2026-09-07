import { baseApi } from "@/lib/api/baseApi";
import type {
  LoginRequest,
  LoginResponse,
  MeResponse,
} from "@/features/auth/types/auth.types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
    }),
    getMe: build.query<MeResponse, void>({
      query: () => ({ url: "/auth/me" }),
    }),
  }),
});

export const { useLoginMutation, useGetMeQuery, useLazyGetMeQuery } = authApi;
