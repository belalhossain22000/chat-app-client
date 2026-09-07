"use client";

import { useState } from "react";
import { Download, Film, X, FileText } from "lucide-react";
import { cn } from "@/utils/cn";
import { AudioPlayer } from "./AudioPlayer";
import { formatBytes, type Attachment } from "@/features/chat/utils/attachment";

interface AttachmentViewProps {
  attachment: Attachment;
  mine: boolean;
}

function downloadFile(url: string, name: string) {
  // Route through our server so the response carries
  // Content-Disposition: attachment — download happens in place, no navigation.
  const href = `/api/download?url=${encodeURIComponent(url)}&name=${encodeURIComponent(
    name || "download",
  )}`;
  const a = document.createElement("a");
  a.href = href;
  a.download = name || "download";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function AttachmentView({ attachment, mine }: AttachmentViewProps) {
  const [lightbox, setLightbox] = useState(false);

  const ratio =
    attachment.width && attachment.height
      ? attachment.width / attachment.height
      : undefined;

  const meta = (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-2 text-xs",
        mine ? "text-accent-contrast/80" : "text-ink-muted",
      )}
    >
      <Film className="size-3.5 shrink-0" />
      <span>Video</span>
      <span className="ml-auto shrink-0">{formatBytes(attachment.size)}</span>
      <button
        type="button"
        aria-label="Download video"
        onClick={() => downloadFile(attachment.url, attachment.name)}
        className="shrink-0 transition-opacity hover:opacity-70"
      >
        <Download className="size-3.5" />
      </button>
    </div>
  );

  if (attachment.kind === "audio") {
    return (
      <div
        className={cn(
          "flex w-[min(280px,78vw)] items-center gap-3 rounded-xl border p-2.5",
          mine
            ? "border-accent-hover bg-accent text-accent-contrast"
            : "border-line bg-surface text-ink",
        )}
      >
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-full",
            mine ? "bg-accent-contrast/20" : "bg-tint-coral/50 text-accent",
          )}
        >
          <Mic className="size-4" />
        </span>
        <audio
          src={attachment.url}
          controls
          preload="metadata"
          className="h-9 min-w-0 flex-1"
        />
        {attachment.duration ? (
          <span
            className={cn(
              "shrink-0 text-xs",
              mine ? "text-accent-contrast/75" : "text-ink-muted",
            )}
          >
            {fmtDuration(attachment.duration)}
          </span>
        ) : null}
      </div>
    );
  }

  if (attachment.kind === "file") {
    return (
      <button
        type="button"
        onClick={() => downloadFile(attachment.url, attachment.name)}
        className={cn(
          "flex w-[min(280px,78vw)] items-center gap-3 rounded-xl border p-3 text-left transition-colors",
          mine
            ? "border-accent-hover bg-accent text-accent-contrast hover:bg-accent-hover"
            : "border-line bg-surface text-ink hover:bg-surface-muted",
        )}
      >
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-lg",
            mine ? "bg-accent-contrast/20" : "bg-tint-coral/50 text-accent",
          )}
        >
          <FileText className="size-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium">
            {attachment.name}
          </span>
          <span
            className={cn(
              "block text-xs",
              mine ? "text-accent-contrast/75" : "text-ink-muted",
            )}
          >
            {formatBytes(attachment.size)}
          </span>
        </span>
        <Download
          className={cn(
            "size-4 shrink-0",
            mine ? "text-accent-contrast/75" : "text-ink-muted",
          )}
        />
      </button>
    );
  }

  if (attachment.kind === "image") {
    return (
      <>
        <div className="relative">
          <button
            type="button"
            onClick={() => setLightbox(true)}
            className="block overflow-hidden rounded-xl"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={attachment.url}
              alt={attachment.name}
              loading="lazy"
              style={ratio ? { aspectRatio: String(ratio) } : undefined}
              className="max-h-72 w-full max-w-[260px] object-cover sm:max-w-[300px]"
            />
          </button>
          <button
            type="button"
            aria-label="Download image"
            onClick={() => downloadFile(attachment.url, attachment.name)}
            className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-ink/50 text-background backdrop-blur transition-colors hover:bg-ink/70"
          >
            <Download className="size-4" />
          </button>
        </div>

        {lightbox && (
          <div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/80 p-4"
            onClick={() => setLightbox(false)}
          >
            <button
              type="button"
              aria-label="Close"
              className="absolute right-4 top-4 text-background"
            >
              <X className="size-6" />
            </button>
            <button
              type="button"
              aria-label="Download image"
              onClick={(e) => {
                e.stopPropagation();
                downloadFile(attachment.url, attachment.name);
              }}
              className="absolute right-16 top-4 text-background"
            >
              <Download className="size-6" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={attachment.url}
              alt={attachment.name}
              className="max-h-full max-w-full rounded-lg object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </>
    );
  }

  // video — size the box to the video's own aspect ratio so it doesn't
  // sit off-centre inside an over-wide bubble
  const vidRatio = ratio ?? 16 / 9;
  return (
    <div
      className="overflow-hidden rounded-xl bg-black"
      style={{ width: "min(320px, 78vw)" }}
    >
      <div className="relative w-full" style={{ aspectRatio: String(vidRatio) }}>
        <video
          src={attachment.url}
          controls
          preload="metadata"
          className="absolute inset-0 h-full w-full bg-black object-contain"
        />
      </div>
      {meta}
    </div>
  );
}
