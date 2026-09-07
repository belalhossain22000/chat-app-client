"use client";

import { useEffect, type ReactNode } from "react";

interface SidePanelProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

const WIDTH = 340; // px

// Desktop-only collapsible right column that animates its width open/closed.
// (On mobile the chat window shows a full-screen details page instead.)
export function SidePanel({ open, onClose, children }: SidePanelProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <aside
      className="h-full shrink-0 overflow-hidden border-l border-line bg-surface transition-[width] duration-300 ease-out"
      style={{ width: open ? WIDTH : 0 }}
    >
      <div className="h-full overflow-y-auto" style={{ width: WIDTH }}>
        {children}
      </div>
    </aside>
  );
}
