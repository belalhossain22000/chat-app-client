import { isRejectedWithValue, type Middleware } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { parseApiError } from "@/lib/api/parseApiError";
import { logout } from "@/features/auth/slice/auth.slice";
import { baseApi } from "@/lib/api/baseApi";
import { disconnectSocket } from "@/features/chat/socket/socket.client";

// Endpoints whose failures the calling component shows inline instead of a toast.
const SILENT_ENDPOINTS = new Set(["getMe"]);

export const apiErrorMiddleware: Middleware = (store) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const error = parseApiError(action.payload);
    const endpoint = (action.meta as { arg?: { endpointName?: string } } | undefined)?.arg
      ?.endpointName;

    if (error.status === 401) {
      disconnectSocket();
      store.dispatch(logout());
      store.dispatch(baseApi.util.resetApiState());
      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    } else if (!endpoint || !SILENT_ENDPOINTS.has(endpoint)) {
      toast.error(error.message);
    }
  }

  return next(action);
};
