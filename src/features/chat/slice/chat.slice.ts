import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ChatUiState, SocketStatus } from "@/features/chat/types/chat.types";

const initialState: ChatUiState = {
  activeConversationId: null,
  socketStatus: "disconnected",
  unreadByConversationId: {},
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveConversation(state, action: PayloadAction<string | null>) {
      state.activeConversationId = action.payload;
      if (action.payload) delete state.unreadByConversationId[action.payload];
    },
    setSocketStatus(state, action: PayloadAction<SocketStatus>) {
      state.socketStatus = action.payload;
    },
    incrementUnread(state, action: PayloadAction<string>) {
      const id = action.payload;
      if (id === state.activeConversationId) return;
      state.unreadByConversationId[id] = (state.unreadByConversationId[id] ?? 0) + 1;
    },
    clearUnread(state, action: PayloadAction<string>) {
      delete state.unreadByConversationId[action.payload];
    },
  },
});

export const { setActiveConversation, setSocketStatus, incrementUnread, clearUnread } =
  chatSlice.actions;
export const chatReducer = chatSlice.reducer;
