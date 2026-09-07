"use client";

import { useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { ErrorState } from "@/components/ui/ErrorState";
import { Button } from "@/components/ui/Button";

export default function ChatError({
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
    <ErrorState
      className="h-full flex-1"
      title="Couldn't load chat"
      description="Something went wrong while loading this view. Please try again."
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
  );
}
