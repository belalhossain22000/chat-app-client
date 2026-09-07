import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/utils/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leadingIcon?: ReactNode;
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { leadingIcon, invalid, className, ...props },
  ref,
) {
  return (
    <div
      className={cn(
        "flex h-13 items-center gap-2.5 rounded-xl border bg-surface px-3.5 transition-colors",
        "focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2 focus-within:ring-offset-background",
        invalid ? "border-accent" : "border-line",
        className,
      )}
    >
      {leadingIcon && <span className="shrink-0 text-ink-muted">{leadingIcon}</span>}
      <input
        ref={ref}
        className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted"
        {...props}
      />
    </div>
  );
});
