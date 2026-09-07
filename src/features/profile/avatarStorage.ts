// Backend has no avatar upload; users pick a preset colour, stored locally.

export const AVATAR_PRESETS = [
  "coral",
  "mint",
  "amber",
  "sky",
  "violet",
  "slate",
] as const;

export type AvatarPreset = (typeof AVATAR_PRESETS)[number];

export const AVATAR_SWATCH: Record<AvatarPreset, string> = {
  coral: "#ff5a4f",
  mint: "#3fae87",
  amber: "#d99a1f",
  sky: "#3f8fd9",
  violet: "#7c5cff",
  slate: "#6b6b66",
};

const KEY = "chatflow.avatar";

export function getAvatarPreset(): AvatarPreset | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(KEY);
    return AVATAR_PRESETS.includes(value as AvatarPreset)
      ? (value as AvatarPreset)
      : null;
  } catch {
    return null;
  }
}

export function setAvatarPreset(preset: AvatarPreset): void {
  try {
    window.localStorage.setItem(KEY, preset);
    window.dispatchEvent(new Event("chatflow:avatar-changed"));
  } catch {
    // ignore
  }
}
