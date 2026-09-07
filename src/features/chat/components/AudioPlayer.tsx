"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, Mic } from "lucide-react";
import { cn } from "@/utils/cn";

function fmt(s: number) {
  if (!isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${r.toString().padStart(2, "0")}`;
}

interface AudioPlayerProps {
  url: string;
  duration?: number;
  mine: boolean;
}

export function AudioPlayer({ url, duration, mine }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [total, setTotal] = useState(duration ?? 0);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => setCurrent(a.currentTime);
    const onMeta = () => {
      if (isFinite(a.duration) && a.duration > 0) setTotal(a.duration);
    };
    const onEnd = () => {
      setPlaying(false);
      setCurrent(0);
    };
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("durationchange", onMeta);
    a.addEventListener("ended", onEnd);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("durationchange", onMeta);
      a.removeEventListener("ended", onEnd);
    };
  }, []);

  function toggle() {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.play();
      setPlaying(true);
    }
  }

  function seek(e: React.MouseEvent<HTMLDivElement>) {
    const a = audioRef.current;
    if (!a || !total) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    a.currentTime = Math.max(0, Math.min(1, ratio)) * total;
    setCurrent(a.currentTime);
  }

  const pct = useMemo(
    () => (total > 0 ? Math.min(100, (current / total) * 100) : 0),
    [current, total],
  );

  return (
    <div
      className={cn(
        "flex w-[min(280px,78vw)] items-center gap-3 rounded-xl border p-2.5",
        mine
          ? "border-accent-hover bg-accent text-accent-contrast"
          : "border-line bg-surface text-ink",
      )}
    >
      <audio ref={audioRef} src={url} preload="metadata" className="hidden" />

      <button
        type="button"
        aria-label={playing ? "Pause" : "Play"}
        onClick={toggle}
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-full transition-colors",
          mine
            ? "bg-accent-contrast/20 text-accent-contrast hover:bg-accent-contrast/30"
            : "bg-tint-coral/50 text-accent hover:bg-tint-coral/70",
        )}
      >
        {playing ? (
          <Pause className="size-4" />
        ) : (
          <Play className="size-4 translate-x-px" />
        )}
      </button>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div
          onClick={seek}
          className={cn(
            "h-1.5 cursor-pointer rounded-full",
            mine ? "bg-accent-contrast/25" : "bg-line",
          )}
        >
          <div
            className={cn(
              "h-full rounded-full",
              mine ? "bg-accent-contrast" : "bg-accent",
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div
          className={cn(
            "flex items-center justify-between text-[11px]",
            mine ? "text-accent-contrast/75" : "text-ink-muted",
          )}
        >
          <span className="inline-flex items-center gap-1">
            <Mic className="size-3" />
            Voice
          </span>
          <span>{fmt(playing || current > 0 ? current : total)}</span>
        </div>
      </div>
    </div>
  );
}
