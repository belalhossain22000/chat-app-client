const KEY = "chatflow.detailsPanel";

// Per-viewer convenience: remember whether the details panel was left open.
export function getDetailsPanelOpen(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function setDetailsPanelOpenStored(open: boolean): void {
  try {
    window.localStorage.setItem(KEY, open ? "1" : "0");
  } catch {
    // ignore
  }
}
