import { forwardRef, type CSSProperties, type HTMLAttributes } from "react";
import { Users } from "lucide-react";
import { cn } from "@/utils/cn";

type Size = "sm" | "md" | "lg" | "xl";

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  name?: string;
  size?: Size;
  isGroup?: boolean;
  online?: boolean;
  /** Solid background colour (from the local avatar preset). */
  color?: string;
}

const sizes: Record<Size, string> = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-12 text-base",
  xl: "size-24 text-2xl",
};

const dotSizes: Record<Size, string> = {
  sm: "size-2 ring-2",
  md: "size-2.5 ring-2",
  lg: "size-3 ring-2",
  xl: "size-5 ring-4",
};

function initials(name?: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { name, size = "md", isGroup = false, online, color, className, ...props },
  ref,
) {
  const style: CSSProperties = color
    ? { backgroundColor: color, color: "#fff" }
    : {};

  return (
    <span ref={ref} className={cn("relative inline-flex shrink-0", className)} {...props}>
      <span
        style={style}
        className={cn(
          "inline-flex items-center justify-center rounded-full font-semibold",
          !color && "bg-surface-muted text-ink-muted",
          sizes[size],
        )}
      >
        {isGroup ? <Users className="size-1/2" /> : initials(name)}
      </span>
      {online !== undefined && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full ring-surface",
            dotSizes[size],
            online ? "bg-success-ink" : "bg-ink-muted/40",
          )}
        />
      )}
    </span>
  );
});
