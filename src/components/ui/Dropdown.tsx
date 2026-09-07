"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/utils/cn";

type Align = "start" | "end";
type Side = "top" | "bottom";

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: Align;
  side?: Side;
  className?: string;
  triggerClassName?: string;
  "aria-label"?: string;
}

export function Dropdown({
  trigger,
  children,
  align = "start",
  side = "bottom",
  className,
  triggerClassName,
  "aria-label": ariaLabel,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
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
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center outline-none focus-visible:ring-2 focus-visible:ring-accent",
          triggerClassName ?? "w-full",
        )}
      >
        {trigger}
      </button>

      {open && (
        <div
          role="menu"
          onClick={() => setOpen(false)}
          className={cn(
            "absolute z-50 min-w-56 rounded-xl border border-line bg-surface p-1.5 shadow-lg",
            side === "bottom" ? "top-full mt-2" : "bottom-full mb-2",
            align === "end" ? "right-0" : "left-0",
            className,
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

interface DropdownItemProps {
  icon?: ReactNode;
  onSelect?: () => void;
  danger?: boolean;
  children: ReactNode;
}

export function DropdownItem({
  icon,
  onSelect,
  danger = false,
  children,
}: DropdownItemProps) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
        danger
          ? "text-accent hover:bg-tint-coral/60"
          : "text-ink hover:bg-surface-muted",
      )}
    >
      {icon && <span className="shrink-0 text-ink-muted">{icon}</span>}
      {children}
    </button>
  );
}

export function DropdownSeparator() {
  return <div className="my-1 h-px bg-line" />;
}
