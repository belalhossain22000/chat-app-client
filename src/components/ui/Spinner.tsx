import { Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";

export function Spinner({ className }: { className?: string }) {
  return (
    <Loader2
      className={cn("size-6 animate-spin text-ink-muted", className)}
      aria-label="Loading"
    />
  );
}
