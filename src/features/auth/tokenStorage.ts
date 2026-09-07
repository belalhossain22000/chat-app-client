import {
  TOKEN_STORAGE_KEY,
  TOKEN_COOKIE,
  TOKEN_COOKIE_MAX_AGE,
} from "@/features/auth/authConstants";

// Token is mirrored to a cookie so proxy.ts can gate routes at the edge.
// Not httpOnly by design: the client needs the token for the socket handshake.

function writeCookie(token: string): void {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(token)}; Path=/; Max-Age=${TOKEN_COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
}

function deleteCookie(): void {
  document.cookie = `${TOKEN_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export const tokenStorage = {
  get(): string | null {
    if (typeof window === "undefined") return null;
    try {
      return window.localStorage.getItem(TOKEN_STORAGE_KEY);
    } catch {
      return null;
    }
  },
  set(token: string): void {
    try {
      window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
      writeCookie(token);
    } catch {
      // ignore (private mode / storage disabled)
    }
  },
  clear(): void {
    try {
      window.localStorage.removeItem(TOKEN_STORAGE_KEY);
      deleteCookie();
    } catch {
      // ignore
    }
  },
};
