"use client";

import { useState, type ReactNode } from "react";
import { Provider } from "react-redux";
import { makeStore, type AppStore } from "@/lib/redux/store";
import { hydrateToken } from "@/features/auth/slice/auth.slice";

export function ReduxProvider({ children }: { children: ReactNode }) {
  // one store per client (created lazily on first render)
  const [store] = useState<AppStore>(() => {
    const s = makeStore();
    s.dispatch(hydrateToken());
    return s;
  });

  return <Provider store={store}>{children}</Provider>;
}
