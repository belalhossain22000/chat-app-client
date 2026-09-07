export type ISODateString = string;

export interface DataEnvelope<T> {
  data: T;
}

export interface CursorPage<T> {
  items: T[];
  hasMore: boolean;
  nextCursor: string | null;
}

export interface ApiError {
  status: number | "FETCH_ERROR" | "PARSING_ERROR" | "TIMEOUT_ERROR" | "CUSTOM_ERROR";
  message: string;
}

export type RequestStatus = "idle" | "pending" | "success" | "error";
