"use client";

import { useEffect } from "react";

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
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-base font-semibold text-ink">Couldn&rsquo;t load chat</h1>
      <p className="max-w-sm text-sm text-ink-muted">
        Something went wrong while loading this view.
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-contrast transition-colors hover:bg-accent-hover"
      >
        Try again
      </button>
    </div>
  );
}
