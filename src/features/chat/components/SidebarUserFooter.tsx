"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, UserRound, LogOut } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import {
  Dropdown,
  DropdownItem,
  DropdownSeparator,
} from "@/components/ui/Dropdown";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useAppDispatch } from "@/lib/redux/hooks";
import { logout } from "@/features/auth/slice/auth.slice";
import { useAvatarPreset } from "@/features/profile/useAvatarPreset";
import { AVATAR_SWATCH } from "@/features/profile/avatarStorage";
import { ProfileModal } from "@/features/profile/components/ProfileModal";

export function SidebarUserFooter() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const preset = useAvatarPreset();
  const [profileOpen, setProfileOpen] = useState(false);

  const avatarColor = preset ? AVATAR_SWATCH[preset] : undefined;

  function handleLogout() {
    dispatch(logout());
    router.replace("/login");
  }

  return (
    <>
      <div className="flex items-center gap-2 border-t border-line px-3 py-2.5">
        <Avatar name={user?.name} size="md" online color={avatarColor} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink">
            {user?.name ?? "—"}
          </p>
          <p className="truncate text-xs text-success-ink">Online</p>
        </div>

        <Dropdown
          side="top"
          align="end"
          aria-label="Account menu"
          triggerClassName="inline-flex size-8 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
          trigger={<MoreHorizontal className="size-4" />}
        >
          <div className="flex items-center gap-3 px-3 py-2.5">
            <Avatar name={user?.name} size="md" online color={avatarColor} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">
                {user?.name ?? "—"}
              </p>
              <p className="truncate text-xs text-ink-muted">
                {user?.phone ?? ""}
              </p>
            </div>
          </div>

          <DropdownSeparator />

          <DropdownItem
            icon={<UserRound className="size-4" />}
            onSelect={() => setProfileOpen(true)}
          >
            View profile
          </DropdownItem>

          <DropdownSeparator />

          <DropdownItem
            icon={<LogOut className="size-4" />}
            danger
            onSelect={handleLogout}
          >
            Log out
          </DropdownItem>
        </Dropdown>
      </div>

      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  );
}
