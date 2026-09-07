"use client";

import { useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { ErrorState } from "@/components/ui/ErrorState";
import { Button } from "@/components/ui/Button";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-1 items-center justify-center bg-background">
      <ErrorState
        title="Something went wrong"
        description="An unexpected error occurred. You can try again, and if it keeps happening, refresh the page."
        primaryAction={
          <Button onClick={reset}>
            <RefreshCw className="size-4" />
            Try again
          </Button>
        }
        secondaryAction={
          <Button variant="secondary" onClick={() => window.location.reload()}>
            Refresh page
          </Button>
        }
      />
    </div>
  );
}
