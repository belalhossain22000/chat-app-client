"use client";

import { MessagesSquare, Users, UserRound } from "lucide-react";
import { cn } from "@/utils/cn";
import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useAppSelector } from "@/lib/redux/hooks";
import { useAvatarPreset } from "@/features/profile/useAvatarPreset";
import { AVATAR_SWATCH } from "@/features/profile/avatarStorage";

export type MobileTab = "chats" | "groups" | "profile";

const statusColor = {
  connected: "bg-success-ink",
  connecting: "bg-tint-amber-ink animate-pulse",
  disconnected: "bg-ink-muted/50",
} as const;

interface MobileTabBarProps {
  active: MobileTab;
  onChange: (tab: MobileTab) => void;
}

export function MobileTabBar({ active, onChange }: MobileTabBarProps) {
  const { user } = useAuth();
  const preset = useAvatarPreset();
  const socketStatus = useAppSelector((s) => s.chat.socketStatus);

  const tabs: { key: MobileTab; label: string; icon: typeof MessagesSquare }[] = [
    { key: "chats", label: "Chats", icon: MessagesSquare },
    { key: "groups", label: "Groups", icon: Users },
    { key: "profile", label: "Profile", icon: UserRound },
  ];

  return (
    <nav
      className="flex items-stretch border-t border-line bg-surface md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {tabs.map(({ key, label, icon: Icon }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
              isActive ? "text-accent" : "text-ink-muted hover:text-ink",
            )}
          >
            {key === "profile" ? (
              <span className="relative">
                <Avatar
                  name={user?.name}
                  size="xs"
                  color={preset ? AVATAR_SWATCH[preset] : undefined}
                />
                <span
                  className={cn(
                    "absolute -right-0.5 -top-0.5 size-2 rounded-full ring-2 ring-surface",
                    statusColor[socketStatus],
                  )}
                />
              </span>
            ) : (
              <Icon className="size-5" />
            )}
            {label}
          </button>
        );
      })}
    </nav>
  );
}
