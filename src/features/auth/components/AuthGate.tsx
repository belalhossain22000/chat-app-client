"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ChatShellSkeleton } from "@/features/chat/components/ChatShellSkeleton";
import { useGetMeQuery } from "@/features/auth/api/auth.api";
import { useAppDispatch } from "@/lib/redux/hooks";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { setUser, sessionRestored, logout } from "@/features/auth/slice/auth.slice";

export function AuthGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { token, isInitialized } = useAuth();

  const { data, isError, isSuccess } = useGetMeQuery(undefined, { skip: !token });

  useEffect(() => {
    if (!token) {
      dispatch(sessionRestored());
      router.replace("/login");
    }
  }, [token, dispatch, router]);

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setUser(data));
      dispatch(sessionRestored());
    }
  }, [isSuccess, data, dispatch]);

  useEffect(() => {
    if (isError) dispatch(logout());
  }, [isError, dispatch]);

  if (!isInitialized || !token) {
    return <ChatShellSkeleton />;
  }

  return <>{children}</>;
}
