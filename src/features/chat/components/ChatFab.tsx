"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, PenSquare, Users, X } from "lucide-react";
import { cn } from "@/utils/cn";

interface ChatFabProps {
  onNewConversation: () => void;
  onCreateGroup: () => void;
}

// Floating action button (mobile only) — expands to New conversation / New group.
export function ChatFab({ onNewConversation, onCreateGroup }: ChatFabProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [open]);

  function pick(fn: () => void) {
    setOpen(false);
    fn();
  }

  return (
    <div
      ref={ref}
      className="fixed right-4 z-30 flex flex-col items-end gap-2 md:hidden"
      style={{ bottom: "calc(env(safe-area-inset-bottom) + 4.5rem)" }}
    >
      {open && (
        <>
          <button
            type="button"
            onClick={() => pick(onCreateGroup)}
            className="flex items-center gap-2 rounded-full bg-surface px-4 py-2.5 text-sm font-medium text-ink shadow-lg ring-1 ring-line"
          >
            <Users className="size-4 text-accent" />
            New group
          </button>
          <button
            type="button"
            onClick={() => pick(onNewConversation)}
            className="flex items-center gap-2 rounded-full bg-surface px-4 py-2.5 text-sm font-medium text-ink shadow-lg ring-1 ring-line"
          >
            <PenSquare className="size-4 text-accent" />
            New conversation
          </button>
        </>
      )}

      <button
        type="button"
        aria-label={open ? "Close" : "New"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex size-12 items-center justify-center rounded-full bg-accent text-accent-contrast shadow-xl transition-transform",
          open && "rotate-45",
        )}
      >
        {open ? <X className="size-5" /> : <Plus className="size-5" />}
      </button>
    </div>
  );
}
