import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

type Size = "sm" | "md";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  size?: Size;
}

// Visual box stays compact; a centred pseudo-element pads the hit area out to
// the 44px touch minimum on coarse pointers without shifting any layout.
const sizes: Record<Size, string> = {
  sm: "size-8",
  md: "size-10",
};

const touchTarget =
  "relative before:absolute before:left-1/2 before:top-1/2 before:size-11 " +
  "before:-translate-x-1/2 before:-translate-y-1/2 before:content-[''] " +
  "pointer-fine:before:hidden";

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ label, size = "md", className, children, ...props }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        aria-label={label}
        title={label}
        className={cn(
          "inline-flex items-center justify-center rounded-lg text-ink-muted transition-colors",
          "hover:bg-surface-muted hover:text-ink",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
          "disabled:cursor-not-allowed disabled:opacity-50",
          sizes[size],
          touchTarget,
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);
