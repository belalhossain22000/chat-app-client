import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  ChatUiState,
  ConversationFilter,
  SocketStatus,
} from "@/features/chat/types/chat.types";
import { setDetailsPanelOpenStored } from "@/features/chat/detailsPanelStorage";

const initialState: ChatUiState = {
  activeConversationId: null,
  socketStatus: "disconnected",
  unreadByConversationId: {},
  isDetailsPanelOpen: false,
  conversationFilter: "all",
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
    hydrateDetailsPanel(state, action: PayloadAction<boolean>) {
      state.isDetailsPanelOpen = action.payload;
    },
    setDetailsPanelOpen(state, action: PayloadAction<boolean>) {
      state.isDetailsPanelOpen = action.payload;
      setDetailsPanelOpenStored(action.payload);
    },
    toggleDetailsPanel(state) {
      state.isDetailsPanelOpen = !state.isDetailsPanelOpen;
      setDetailsPanelOpenStored(state.isDetailsPanelOpen);
    },
    setConversationFilter(state, action: PayloadAction<ConversationFilter>) {
      state.conversationFilter = action.payload;
    },
  },
});

export const {
  setActiveConversation,
  setSocketStatus,
  incrementUnread,
  clearUnread,
  hydrateDetailsPanel,
  setDetailsPanelOpen,
  toggleDetailsPanel,
  setConversationFilter,
} = chatSlice.actions;
export const chatReducer = chatSlice.reducer;
