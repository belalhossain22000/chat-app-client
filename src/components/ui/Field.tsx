import { useId, type ReactNode } from "react";

export interface FieldProps {
  label: string;
  error?: string;
  hint?: string;
  children: (props: { id: string; invalid: boolean }) => ReactNode;
}

export function Field({ label, error, hint, children }: FieldProps) {
  const id = useId();
  const invalid = Boolean(error);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      {children({ id, invalid })}
      {error ? (
        <p className="text-xs text-accent">{error}</p>
      ) : hint ? (
        <p className="text-xs text-ink-muted">{hint}</p>
      ) : null}
    </div>
  );
}
