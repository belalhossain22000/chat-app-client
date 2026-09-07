"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Phone, CalendarDays, LogOut, Check } from "lucide-react";
import { format } from "date-fns";
import { Avatar } from "@/components/ui/Avatar";
import { IconButton } from "@/components/ui/IconButton";
import { cn } from "@/utils/cn";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useAppDispatch } from "@/lib/redux/hooks";
import { performLogout } from "@/features/auth/logout";
import { useAvatarPreset } from "@/features/profile/useAvatarPreset";
import {
  AVATAR_PRESETS,
  AVATAR_SWATCH,
  setAvatarPreset,
} from "@/features/profile/avatarStorage";

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-ink-muted">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-ink-muted">{label}</p>
        <p className="truncate text-sm font-medium text-ink">{value}</p>
      </div>
    </div>
  );
}

// Full-screen profile view used on mobile (the desktop dropdown opens ProfileModal).
export function ProfileView({ onBack }: { onBack?: () => void }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const preset = useAvatarPreset();

  const memberSince = user?.createdAt
    ? format(new Date(user.createdAt), "MMM d, yyyy")
    : "—";

  function handleLogout() {
    performLogout(dispatch);
    router.replace("/login");
  }

  return (
    <div
      className="h-full overflow-y-auto bg-background"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 5rem)" }}
    >
      <header className="flex items-center gap-2 border-b border-line bg-surface px-3 py-3 sm:px-5">
        {onBack && (
          <IconButton label="Back" size="sm" onClick={onBack}>
            <ArrowLeft className="size-5" />
          </IconButton>
        )}
        <h1 className="text-base font-semibold text-ink">Profile</h1>
      </header>

      {/* hero */}
      <div className="relative flex flex-col items-center px-5 pb-6 pt-10">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-tint-coral/50 to-transparent" />
        <div className="relative rounded-full ring-4 ring-surface">
          <Avatar
            name={user?.name}
            size="xl"
            online
            color={preset ? AVATAR_SWATCH[preset] : undefined}
          />
        </div>
        <p className="mt-3 text-xl font-bold text-ink">{user?.name ?? "—"}</p>
        <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-tint-mint px-3 py-1 text-xs font-medium text-success-ink">
          <span className="size-1.5 rounded-full bg-success-ink" />
          Online
        </span>
      </div>

      {/* avatar colour */}
      <div className="px-5">
        <div className="rounded-2xl border border-line bg-surface p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-ink">Avatar colour</p>
            <p className="text-[11px] text-ink-muted">This device only</p>
          </div>
          <div className="mt-3 flex flex-wrap gap-3">
            {AVATAR_PRESETS.map((p) => {
              const selected = preset === p;
              return (
                <button
                  key={p}
                  type="button"
                  aria-label={`Use ${p} avatar`}
                  aria-pressed={selected}
                  onClick={() => setAvatarPreset(p)}
                  style={{ backgroundColor: AVATAR_SWATCH[p] }}
                  className={cn(
                    "flex size-9 items-center justify-center rounded-full text-white transition-transform hover:scale-110",
                    selected && "ring-2 ring-ink ring-offset-2 ring-offset-surface",
                  )}
                >
                  {selected && <Check className="size-4" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* contact */}
      <div className="px-5 pt-5">
        <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-ink-muted">
          Contact information
        </p>
        <div className="flex flex-col gap-2">
          <InfoRow
            icon={<Phone className="size-4" />}
            label="Phone number"
            value={user?.phone ?? "—"}
          />
          <InfoRow
            icon={<CalendarDays className="size-4" />}
            label="Member since"
            value={memberSince}
          />
        </div>
      </div>

      {/* logout */}
      <div className="px-5 pt-6">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-tint-coral/60 px-4 py-3 text-sm font-semibold text-accent transition-colors hover:bg-tint-coral"
        >
          <LogOut className="size-4" />
          Log out
        </button>
      </div>
    </div>
  );
}
