"use client";

import { Phone, CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { Modal } from "@/components/ui/Modal";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/utils/cn";
import { useAuth } from "@/features/auth/hooks/useAuth";
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
    <div className="flex items-start gap-3 py-2.5">
      <span className="mt-0.5 text-ink-muted">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-ink-muted">{label}</p>
        <p className="truncate text-sm font-medium text-ink">{value}</p>
      </div>
    </div>
  );
}

export function ProfileModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { user } = useAuth();
  const preset = useAvatarPreset();

  const memberSince = user?.createdAt
    ? format(new Date(user.createdAt), "MMM d, yyyy")
    : "—";

  return (
    <Modal open={open} onClose={onClose} title="Profile" size="md">
      <div className="flex flex-col items-center gap-3 px-5 py-6">
        <Avatar
          name={user?.name}
          size="xl"
          online
          color={preset ? AVATAR_SWATCH[preset] : undefined}
        />
        <div className="text-center">
          <p className="text-lg font-semibold text-ink">{user?.name ?? "—"}</p>
          <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-tint-mint px-2.5 py-0.5 text-xs font-medium text-success-ink">
            <span className="size-1.5 rounded-full bg-success-ink" />
            Online
          </span>
        </div>

        <div className="mt-2 w-full">
          <p className="mb-2 text-center text-xs text-ink-muted">Avatar colour</p>
          <div className="flex justify-center gap-2.5">
            {AVATAR_PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                aria-label={`Use ${p} avatar`}
                onClick={() => setAvatarPreset(p)}
                style={{ backgroundColor: AVATAR_SWATCH[p] }}
                className={cn(
                  "size-7 rounded-full transition-transform hover:scale-110",
                  preset === p &&
                    "ring-2 ring-ink ring-offset-2 ring-offset-surface",
                )}
              />
            ))}
          </div>
          <p className="mt-2 text-center text-[11px] text-ink-muted">
            Saved on this device only.
          </p>
        </div>
      </div>

      <div className="border-t border-line px-5 py-4">
        <p className="mb-1 text-sm font-semibold text-ink">Contact information</p>
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
    </Modal>
  );
}
