"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { EmojiStyle, Theme } from "emoji-picker-react";

// Lazy-load the picker bundle only when it's first opened.
const Picker = dynamic(() => import("emoji-picker-react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-72 w-full items-center justify-center rounded-xl border border-line bg-surface text-xs text-ink-muted">
      Loading…
    </div>
  ),
});

interface EmojiPickerProps {
  onPick: (emoji: string) => void;
  label?: string;
  // Rendered inside the trigger button; receives the open state for styling.
  children: (open: boolean) => ReactNode;
  triggerClassName?: string | ((open: boolean) => string);
}

export function EmojiPicker({
  onPick,
  label = "Emoji",
  children,
  triggerClassName,
}: EmojiPickerProps) {
  const [open, setOpen] = useState(false);
  const popRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const toggle = useCallback(() => setOpen((v) => !v), []);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (
        !popRef.current?.contains(e.target as Node) &&
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
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={label}
        aria-expanded={open}
        onClick={toggle}
        className={
          typeof triggerClassName === "function"
            ? triggerClassName(open)
            : triggerClassName
        }
      >
        {children(open)}
      </button>

      {open && (
        <>
          {/* mobile: dim backdrop */}
          <div
            aria-hidden
            onClick={close}
            className="fixed inset-0 z-40 bg-ink/20 sm:hidden"
          />

          <div
            ref={popRef}
            role="dialog"
            aria-label="Emoji picker"
            className={[
              "z-50 [&_.EmojiPickerReact]:!border-line [&_.EmojiPickerReact]:!shadow-xl",
              // mobile: fixed sheet pinned above the composer, full-ish width
              "fixed inset-x-2 bottom-20 [&_.EmojiPickerReact]:!w-full",
              // desktop: popover anchored to the trigger
              "sm:absolute sm:inset-x-auto sm:bottom-full sm:right-0 sm:mb-2 sm:w-[320px]",
            ].join(" ")}
          >
            <Picker
              onEmojiClick={(data) => onPick(data.emoji)}
              theme={Theme.LIGHT}
              emojiStyle={EmojiStyle.NATIVE}
              lazyLoadEmojis
              skinTonesDisabled
              searchPlaceholder="Search emoji"
              width="100%"
              height={360}
              previewConfig={{ showPreview: false }}
            />
          </div>
        </>
      )}
    </>
  );
}
