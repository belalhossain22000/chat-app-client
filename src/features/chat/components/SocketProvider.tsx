"use client";

import { useEffect, type ReactNode } from "react";
import { useSocket } from "@/features/chat/hooks/useSocket";
import { useAppDispatch } from "@/lib/redux/hooks";
import { hydrateDetailsPanel } from "@/features/chat/slice/chat.slice";
import { getDetailsPanelOpen } from "@/features/chat/detailsPanelStorage";

export function SocketProvider({ children }: { children: ReactNode }) {
  useSocket();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(hydrateDetailsPanel(getDetailsPanelOpen()));
  }, [dispatch]);

  return <>{children}</>;
}
