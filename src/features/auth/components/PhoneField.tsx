import { forwardRef, type InputHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";

// Small fixed list is enough for this task; BD is the design default.
const COUNTRIES = [
  { code: "BD", dial: "+880", flag: "🇧🇩" },
  { code: "US", dial: "+1", flag: "🇺🇸" },
  { code: "GB", dial: "+44", flag: "🇬🇧" },
  { code: "IN", dial: "+91", flag: "🇮🇳" },
  { code: "AU", dial: "+61", flag: "🇦🇺" },
] as const;

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
    const selected =
      COUNTRIES.find((c) => c.dial === dialCode) ?? COUNTRIES[0];

    return (
      <div
        className={cn(
          "flex h-13 items-center rounded-xl border bg-surface transition-colors",
          "focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2 focus-within:ring-offset-background",
          invalid ? "border-accent" : "border-line",
          className,
        )}
      >
        <div className="relative flex h-full items-center gap-1.5 pl-3.5 pr-2 text-sm text-ink">
          <span className="text-lg leading-none" aria-hidden>
            {selected.flag}
          </span>
          <span>{selected.dial}</span>
          <ChevronDown className="size-4 text-ink-muted" aria-hidden />
          <select
            aria-label="Country dialing code"
            value={dialCode}
            onChange={(e) => onDialCodeChange(e.target.value)}
            className="absolute inset-0 cursor-pointer opacity-0"
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.dial}>
                {c.flag} {c.code} ({c.dial})
              </option>
            ))}
          </select>
        </div>

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
