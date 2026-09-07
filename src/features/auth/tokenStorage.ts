const KEY = "chatflow.token";

export const tokenStorage = {
  get(): string | null {
    if (typeof window === "undefined") return null;
    try {
      return window.localStorage.getItem(KEY);
    } catch {
      return null;
    }
  },
  set(token: string): void {
    try {
      window.localStorage.setItem(KEY, token);
    } catch {
      // ignore (private mode / storage disabled)
    }
  },
  clear(): void {
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      // ignore
    }
  },
};
