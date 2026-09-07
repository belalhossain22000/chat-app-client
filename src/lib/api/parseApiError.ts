import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";
import type { ApiError } from "@/types/common.types";

function isFetchBaseQueryError(err: unknown): err is FetchBaseQueryError {
  return typeof err === "object" && err != null && "status" in err;
}

function isSerializedError(err: unknown): err is SerializedError {
  return typeof err === "object" && err != null && "message" in err;
}

function messageFromData(data: unknown): string | null {
  if (typeof data === "string" && data.trim()) return data;
  if (typeof data === "object" && data != null) {
    const record = data as Record<string, unknown>;
    for (const key of ["message", "error", "detail"] as const) {
      if (typeof record[key] === "string" && record[key]) return record[key] as string;
    }
  }
  return null;
}

export function parseApiError(err: unknown): ApiError {
  if (isFetchBaseQueryError(err)) {
    if (typeof err.status === "number") {
      return {
        status: err.status,
        message: messageFromData(err.data) ?? httpFallback(err.status),
      };
    }
    if (err.status === "FETCH_ERROR") {
      return { status: err.status, message: "Network error. Check your connection." };
    }
    if (err.status === "TIMEOUT_ERROR") {
      return { status: err.status, message: "The request timed out. Try again." };
    }
    return { status: err.status, message: "Something went wrong. Try again." };
  }

  if (isSerializedError(err)) {
    return {
      status: "CUSTOM_ERROR",
      message: err.message ?? "Something went wrong. Try again.",
    };
  }

  return { status: "CUSTOM_ERROR", message: "Something went wrong. Try again." };
}

function httpFallback(status: number): string {
  if (status === 401) return "Your session has expired. Please log in again.";
  if (status === 403) return "You don't have access to that.";
  if (status === 404) return "Not found.";
  if (status >= 500) return "The server had a problem. Try again shortly.";
  return "Something went wrong. Try again.";
}
