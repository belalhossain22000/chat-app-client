"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/utils/cn";

const GROUPS: { label: string; emojis: string[] }[] = [
  {
    label: "Smileys",
    emojis: [
      "😀", "😁", "😂", "🤣", "😊", "😍", "😘", "😎", "🤔", "😅",
      "😉", "🙂", "😇", "🥳", "😴", "😢", "😭", "😤", "😳", "🤯",
    ],
  },
  {
    label: "Gestures",
    emojis: ["👍", "👎", "👏", "🙌", "🙏", "👌", "🤝", "💪", "👋", "🤙"],
  },
  {
    label: "Hearts & symbols",
    emojis: ["❤️", "🔥", "✨", "⭐", "🎉", "🚀", "💯", "✅", "❌", "⚡"],
  },
  {
    label: "Objects",
    emojis: ["📌", "📎", "📝", "📷", "🎁", "☕", "🍕", "🎯", "💡", "📅"],
  },
];

interface EmojiPickerProps {
  onPick: (emoji: string) => void;
  trigger: (props: {
    open: boolean;
    toggle: () => void;
    ref: (el: HTMLButtonElement | null) => void;
  }) => ReactNode;
}

export function EmojiPicker({ onPick, trigger }: EmojiPickerProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (
        !rootRef.current?.contains(e.target as Node) &&
        !triggerRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative">
      {trigger({
        open,
        toggle: () => setOpen((v) => !v),
        ref: (el) => {
          triggerRef.current = el;
        },
      })}

      {open && (
        <div
          ref={rootRef}
          role="dialog"
          aria-label="Emoji picker"
          className="absolute bottom-full right-0 z-50 mb-2 max-h-64 w-64 overflow-y-auto rounded-xl border border-line bg-surface p-2 shadow-xl"
        >
          {GROUPS.map((group) => (
            <div key={group.label} className="mb-1.5 last:mb-0">
              <p className="px-1 pb-1 text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
                {group.label}
              </p>
              <div className="grid grid-cols-8 gap-0.5">
                {group.emojis.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => onPick(e)}
                    className={cn(
                      "flex size-7 items-center justify-center rounded-md text-lg",
                      "transition-colors hover:bg-surface-muted",
                    )}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
