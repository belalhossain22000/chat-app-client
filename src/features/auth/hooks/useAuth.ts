import { useAppSelector } from "@/lib/redux/hooks";

export function useAuth() {
  const { token, user, isInitialized } = useAppSelector((s) => s.auth);
  return { token, user, isInitialized, isAuthenticated: Boolean(token) };
}
