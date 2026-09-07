"use client";

import { useEffect } from "react";

export default function GlobalError({
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
    <html lang="en">
      <body
        style={{
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          padding: "2rem",
          textAlign: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#f7f5f0",
          color: "#171717",
        }}
      >
        <h1 style={{ fontSize: "1.125rem", fontWeight: 600 }}>Something went wrong</h1>
        <p style={{ maxWidth: "24rem", fontSize: "0.875rem", color: "#6b6b66" }}>
          The app hit an unexpected error. Please try again.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            borderRadius: "0.5rem",
            background: "#ff5a4f",
            color: "#fff",
            padding: "0.5rem 1rem",
            fontSize: "0.875rem",
            fontWeight: 500,
            border: "none",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
