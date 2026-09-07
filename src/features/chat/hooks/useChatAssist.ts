"use client";

import { useCallback, useState } from "react";

export type AssistMode = "summarize" | "draft" | "ask";

interface TranscriptLine {
  sender: string;
  text: string;
}

interface RunArgs {
  mode: AssistMode;
  transcript: TranscriptLine[];
  question?: string;
}

export function useChatAssist() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<AssistMode | null>(null);

  const run = useCallback(async ({ mode, transcript, question }: RunArgs) => {
    setLoading(true);
    setActiveMode(mode);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/chat-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, transcript, question }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
      } else {
        setResult(data.result as string);
      }
    } catch {
      setError("Couldn't reach the assistant.");
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setActiveMode(null);
  }, []);

  return { run, reset, loading, result, error, activeMode };
}
