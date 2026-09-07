import type { CurrentUser } from "@/features/chat/types/user.types";

// POST /auth/login
export interface LoginRequest {
  phone: string;
  name: string;
}

export interface LoginResponse {
  token: string;
  user: CurrentUser;
}

// GET /auth/me
export type MeResponse = CurrentUser;

export interface AuthState {
  token: string | null;
  user: CurrentUser | null;
  isInitialized: boolean;
}
