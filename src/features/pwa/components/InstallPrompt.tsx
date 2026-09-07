"use client";

import { Download, X } from "lucide-react";
import { useInstallPrompt } from "@/features/pwa/useInstallPrompt";
import { cn } from "@/utils/cn";

// Shown only once the browser fires `beforeinstallprompt`, i.e. the app really
// is installable. Dismissal is remembered in localStorage.
export function InstallPrompt({ className }: { className?: string }) {
  const { canInstall, promptInstall, dismiss } = useInstallPrompt();

  if (!canInstall) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-3 border-t border-line bg-tint-coral/30 px-3 py-2.5",
        className,
      )}
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-contrast">
        <Download className="size-4" />
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ink">Install ChatFlow</p>
        <p className="truncate text-xs text-ink-muted">
          Add it to your home screen for quick access.
        </p>
      </div>

      <button
        type="button"
        onClick={promptInstall}
        className="shrink-0 rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-accent-contrast transition-colors hover:bg-accent-hover"
      >
        Install
      </button>

      <button
        type="button"
        aria-label="Dismiss install prompt"
        onClick={dismiss}
        className="shrink-0 text-ink-muted transition-colors hover:text-ink"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
