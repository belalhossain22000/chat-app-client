"use client";

import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { ReduxProvider } from "@/lib/redux/provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider>
      {children}
      <Toaster position="top-center" richColors />
    </ReduxProvider>
  );
}
