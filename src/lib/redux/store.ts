import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "@/lib/api/baseApi";
import { authReducer } from "@/features/auth/slice/auth.slice";
import { chatReducer } from "@/features/chat/slice/chat.slice";

export const makeStore = () =>
  configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      auth: authReducer,
      chat: chatReducer,
    },
    middleware: (getDefault) => getDefault().concat(baseApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
