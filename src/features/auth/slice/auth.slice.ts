import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CurrentUser } from "@/features/chat/types/user.types";
import type { AuthState } from "@/features/auth/types/auth.types";
import { tokenStorage } from "@/features/auth/tokenStorage";

const initialState: AuthState = {
  token: null,
  user: null,
  isInitialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrateToken(state) {
      state.token = tokenStorage.get();
    },
    setCredentials(state, action: PayloadAction<{ token: string; user: CurrentUser }>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      tokenStorage.set(action.payload.token);
    },
    setUser(state, action: PayloadAction<CurrentUser>) {
      state.user = action.payload;
    },
    sessionRestored(state) {
      state.isInitialized = true;
    },
    logout(state) {
      state.token = null;
      state.user = null;
      state.isInitialized = true;
      tokenStorage.clear();
    },
  },
});

export const { hydrateToken, setCredentials, setUser, sessionRestored, logout } =
  authSlice.actions;
export const authReducer = authSlice.reducer;
