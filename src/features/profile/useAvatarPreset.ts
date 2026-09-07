"use client";

import { useSyncExternalStore } from "react";
import { getAvatarPreset, type AvatarPreset } from "./avatarStorage";

function subscribe(cb: () => void) {
  window.addEventListener("chatflow:avatar-changed", cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener("chatflow:avatar-changed", cb);
    window.removeEventListener("storage", cb);
  };
}

export function useAvatarPreset(): AvatarPreset | null {
  return useSyncExternalStore(subscribe, getAvatarPreset, () => null);
}
