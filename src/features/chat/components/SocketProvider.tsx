"use client";

import type { ReactNode } from "react";
import { useSocket } from "@/features/chat/hooks/useSocket";

export function SocketProvider({ children }: { children: ReactNode }) {
  useSocket();
  return <>{children}</>;
}
