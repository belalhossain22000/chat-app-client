import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

// Small fixed list is enough for this task; +880 is the design default.
const DIAL_CODES = ["+880", "+1", "+44", "+91", "+61"] as const;

export interface PhoneFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  dialCode: string;
  onDialCodeChange: (code: string) => void;
  invalid?: boolean;
}

export const PhoneField = forwardRef<HTMLInputElement, PhoneFieldProps>(
  function PhoneField(
    { dialCode, onDialCodeChange, invalid, className, ...props },
    ref,
  ) {
    return (
      <div
        className={cn(
          "flex h-13 items-center rounded-xl border bg-surface transition-colors",
          "focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2 focus-within:ring-offset-background",
          invalid ? "border-accent" : "border-line",
          className,
        )}
      >
        <select
          aria-label="Country dialing code"
          value={dialCode}
          onChange={(e) => onDialCodeChange(e.target.value)}
          className="h-full rounded-l-xl bg-transparent pl-3.5 pr-2 text-sm text-ink outline-none"
        >
          {DIAL_CODES.map((code) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </select>
        <span className="h-6 w-px bg-line" />
        <input
          ref={ref}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          placeholder="1XXX XXXXXXX"
          className="w-full bg-transparent px-3.5 text-sm text-ink outline-none placeholder:text-ink-muted"
          {...props}
        />
      </div>
    );
  },
);
