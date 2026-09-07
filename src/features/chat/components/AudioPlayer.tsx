"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";
import { cn } from "@/utils/cn";

const BAR_COUNT = 40;

function fmt(s: number) {
  if (!isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${r.toString().padStart(2, "0")}`;
}

// Downsample the decoded audio into BAR_COUNT amplitude peaks (0..1).
function extractPeaks(buffer: AudioBuffer, count: number): number[] {
  const data = buffer.getChannelData(0);
  const block = Math.floor(data.length / count) || 1;
  const peaks: number[] = [];
  let max = 0;
  for (let i = 0; i < count; i++) {
    let sum = 0;
    for (let j = 0; j < block; j++) {
      const v = data[i * block + j];
      if (v != null) sum += v * v;
    }
    const rms = Math.sqrt(sum / block);
    peaks.push(rms);
    if (rms > max) max = rms;
  }
  return peaks.map((p) => (max > 0 ? p / max : 0));
}

// deterministic fallback bars from the URL (used while decoding / on failure)
function fakePeaks(seed: string, count: number): number[] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  const rand = () => {
    h = (h * 1103515245 + 12345) & 0x7fffffff;
    return h / 0x7fffffff;
  };
  return Array.from({ length: count }, () => 0.25 + rand() * 0.75);
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
  const [peaks, setPeaks] = useState<number[]>(() => fakePeaks(url, BAR_COUNT));

  // decode for the real waveform
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(url);
        const arr = await res.arrayBuffer();
        const Ctx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        const ctx = new Ctx();
        const buf = await ctx.decodeAudioData(arr);
        if (!cancelled) {
          setPeaks(extractPeaks(buf, BAR_COUNT));
          if (!total && isFinite(buf.duration)) setTotal(buf.duration);
        }
        ctx.close();
      } catch {
        /* keep fallback bars */
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

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
      void a.play();
      setPlaying(true);
    }
  }

  function seekTo(ratio: number) {
    const a = audioRef.current;
    if (!a || !total) return;
    const t = Math.max(0, Math.min(1, ratio)) * total;
    a.currentTime = t;
    setCurrent(t);
  }

  const progress = useMemo(
    () => (total > 0 ? Math.min(1, current / total) : 0),
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
          role="slider"
          aria-label="Seek"
          aria-valuenow={Math.round(progress * 100)}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            seekTo((e.clientX - rect.left) / rect.width);
          }}
          className="flex h-8 cursor-pointer items-center gap-[2px]"
        >
          {peaks.map((p, i) => {
            const filled = i / peaks.length < progress;
            return (
              <span
                key={i}
                className={cn(
                  "w-full rounded-full transition-colors",
                  filled
                    ? mine
                      ? "bg-accent-contrast"
                      : "bg-accent"
                    : mine
                      ? "bg-accent-contrast/30"
                      : "bg-line",
                )}
                style={{ height: `${Math.max(12, p * 100)}%` }}
              />
            );
          })}
        </div>

        <span
          className={cn(
            "text-[11px]",
            mine ? "text-accent-contrast/75" : "text-ink-muted",
          )}
        >
          {fmt(playing || current > 0 ? current : total)}
        </span>
      </div>
    </div>
  );
}
