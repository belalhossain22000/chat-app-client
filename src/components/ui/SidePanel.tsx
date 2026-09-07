"use client";

import { useEffect, type ReactNode } from "react";
import { cn } from "@/utils/cn";

interface SidePanelProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Panel content width on lg+ screens. */
  width?: number;
}

/**
 * Right-side panel:
 *  - lg+: collapsible column that animates its width between 0 and `width`
 *  - below lg: overlay drawer sliding in from the right, with a backdrop
 * `children` renders once; the inner box keeps a fixed width so content
 * doesn't reflow while the outer width animates.
 */
export function SidePanel({ open, onClose, children, width = 340 }: SidePanelProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 bg-ink/30 transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <div
        className={cn(
          "z-50 h-full shrink-0 overflow-hidden border-l border-line bg-surface",
          "max-lg:fixed max-lg:inset-y-0 max-lg:right-0 max-lg:w-[min(340px,85vw)] max-lg:shadow-xl",
          "max-lg:transition-transform max-lg:duration-300 max-lg:ease-out",
          open ? "max-lg:translate-x-0" : "max-lg:translate-x-full",
          "lg:transition-[width] lg:duration-300 lg:ease-out",
        )}
        style={{ ["--panel-w" as string]: `min(${width}px, 40vw)` }}
        data-open={open}
      >
        <div
          className="h-full max-lg:!w-[min(340px,85vw)]"
          style={{ width: open ? "var(--panel-w)" : 0 }}
        >
          <div
            className="h-full overflow-y-auto max-lg:!w-[min(340px,85vw)]"
            style={{ width: "var(--panel-w)" }}
          >
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
