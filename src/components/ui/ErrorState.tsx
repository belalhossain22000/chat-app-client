import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

interface ErrorStateProps {
  title: string;
  description?: string;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
  className?: string;
}

// A friendly "something broke" panel with a small SVG mascot.
export function ErrorState({
  title,
  description,
  primaryAction,
  secondaryAction,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-6 text-center",
        className,
      )}
    >
      <ErrorMascot />
      <h3 className="mt-6 text-lg font-bold text-ink">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-ink-muted">{description}</p>
      )}
      {(primaryAction || secondaryAction) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {primaryAction}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}

function ErrorMascot() {
  return (
    <svg
      viewBox="0 0 160 120"
      className="h-24 w-auto"
      role="img"
      aria-label="A sad robot next to a broken connection icon"
    >
      <ellipse cx="70" cy="98" rx="52" ry="8" className="fill-tint-coral/40" />
      {/* head */}
      <rect
        x="34"
        y="34"
        width="60"
        height="52"
        rx="14"
        className="fill-surface stroke-line"
        strokeWidth="2.5"
      />
      <line
        x1="64"
        y1="34"
        x2="64"
        y2="22"
        className="stroke-ink-muted"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="64" cy="19" r="3.5" className="fill-accent" />
      {/* eyes */}
      <circle cx="54" cy="56" r="4.5" className="fill-ink" />
      <circle cx="76" cy="56" r="4.5" className="fill-ink" />
      {/* frown */}
      <path
        d="M52 74 q12 -10 24 0"
        className="stroke-ink-muted"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* broken wifi */}
      <g transform="translate(112 40)">
        <circle cx="14" cy="18" r="20" className="fill-tint-coral/60" />
        <path
          d="M4 16 a14 14 0 0 1 20 0 M8 21 a8 8 0 0 1 12 0"
          className="stroke-accent"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="14" cy="26" r="2.5" className="fill-accent" />
        <line
          x1="2"
          y1="30"
          x2="26"
          y2="6"
          className="stroke-accent"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
