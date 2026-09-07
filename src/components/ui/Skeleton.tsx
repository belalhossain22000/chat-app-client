import type { CSSProperties } from "react";
import { cn } from "@/utils/cn";

interface SkeletonProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  rounded?: "sm" | "md" | "lg" | "full";
}

const radius = {
  sm: "rounded",
  md: "rounded-lg",
  lg: "rounded-xl",
  full: "rounded-full",
} as const;

export function Skeleton({ className, width, height, rounded = "md" }: SkeletonProps) {
  const style: CSSProperties = {};
  if (width !== undefined) style.width = width;
  if (height !== undefined) style.height = height;

  return (
    <span
      aria-hidden
      style={style}
      className={cn("block animate-pulse bg-surface-muted", radius[rounded], className)}
    />
  );
}
