"use client";

import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

type Status = "idle" | "recording";

function pickMimeType(): string {
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg;codecs=opus",
  ];
  for (const t of candidates) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(t)) {
      return t;
    }
  }
  return "";
}

export function useVoiceRecorder() {
  const [status, setStatus] = useState<Status>("idle");
  const [seconds, setSeconds] = useState(0);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAtRef = useRef(0);
  const resolveRef = useRef<
    ((r: { blob: Blob; mime: string; duration: number } | null) => void) | null
  >(null);

  const cleanup = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    recorderRef.current = null;
    chunksRef.current = [];
    setStatus("idle");
    setSeconds(0);
  }, []);

  const start = useCallback(async () => {
    if (status === "recording") return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mime = pickMimeType();
      const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      recorderRef.current = rec;
      chunksRef.current = [];

      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      rec.onstop = () => {
        const duration = Math.max(
          1,
          Math.round((Date.now() - startedAtRef.current) / 1000),
        );
        const type = rec.mimeType || "audio/webm";
        const blob = new Blob(chunksRef.current, { type });
        const resolve = resolveRef.current;
        resolveRef.current = null;
        cleanup();
        resolve?.(blob.size > 0 ? { blob, mime: type, duration } : null);
      };

      rec.start();
      startedAtRef.current = Date.now();
      setStatus("recording");
      setSeconds(0);
      timerRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s >= 300) {
            // hard cap at 5 min
            rec.stop();
            return s;
          }
          return s + 1;
        });
      }, 1000);
    } catch {
      toast.error("Microphone access denied.");
      cleanup();
    }
  }, [status, cleanup]);

  // stop and return the recording (or null if empty / cancelled)
  const stop = useCallback((): Promise<{
    blob: Blob;
    mime: string;
    duration: number;
  } | null> => {
    return new Promise((resolve) => {
      const rec = recorderRef.current;
      if (!rec || rec.state === "inactive") {
        cleanup();
        resolve(null);
        return;
      }
      resolveRef.current = resolve;
      rec.stop();
    });
  }, [cleanup]);

  const cancel = useCallback(() => {
    const rec = recorderRef.current;
    resolveRef.current = null;
    if (rec && rec.state !== "inactive") {
      rec.onstop = null;
      rec.stop();
    }
    cleanup();
  }, [cleanup]);

  return { status, seconds, start, stop, cancel };
}
