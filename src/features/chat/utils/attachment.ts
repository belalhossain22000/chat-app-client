// The backend message only has a `text` field, so attachments are encoded as a
// single-line token inside the text and parsed back out for rendering.
//
//   [[att:image|<url>|<name>|<size>|<w>x<h>]]
//   [[att:video|<url>|<name>|<size>|<mime>]]
//
// A message can be an attachment plus an optional caption on the next line.

export type AttachmentKind = "image" | "video" | "file" | "audio";

export interface Attachment {
  kind: AttachmentKind;
  url: string;
  name: string;
  size: number;
  width?: number;
  height?: number;
  mime?: string;
  duration?: number; // seconds, for audio
}

const TOKEN_RE =
  /^\[\[att:(image|video|file|audio)\|([^|]+)\|([^|]*)\|(\d+)\|([^\]]*)\]\]/;

export function encodeAttachment(a: Attachment): string {
  let meta: string;
  if (a.kind === "image") meta = `${a.width ?? 0}x${a.height ?? 0}`;
  else if (a.kind === "audio") meta = `${a.mime ?? "audio/webm"}@${a.duration ?? 0}`;
  else if (a.kind === "video") meta = a.mime ?? "video/mp4";
  else meta = a.mime ?? "application/octet-stream";
  return `[[att:${a.kind}|${a.url}|${a.name}|${a.size}|${meta}]]`;
}

export interface ParsedMessage {
  attachment: Attachment | null;
  text: string; // caption / plain text
}

export function parseMessageText(raw: string): ParsedMessage {
  const match = raw.match(TOKEN_RE);
  if (!match) return { attachment: null, text: raw };

  const [full, kind, url, name, size, meta] = match;
  const rest = raw.slice(full.length).replace(/^\n/, "");

  const attachment: Attachment = {
    kind: kind as AttachmentKind,
    url,
    name: name || "file",
    size: Number(size) || 0,
  };
  if (kind === "image") {
    const [w, h] = meta.split("x").map((n) => Number(n) || undefined);
    attachment.width = w;
    attachment.height = h;
  } else if (kind === "audio") {
    const [mime, dur] = meta.split("@");
    attachment.mime = mime || "audio/webm";
    attachment.duration = Number(dur) || 0;
  } else {
    attachment.mime = meta || "application/octet-stream";
  }

  return { attachment, text: rest };
}

// Human-readable stand-in for the raw token — used in previews and AI transcripts.
export function attachmentSummary(raw: string): string {
  const { attachment, text } = parseMessageText(raw);
  if (!attachment) return raw;
  const label =
    attachment.kind === "image"
      ? "[photo]"
      : attachment.kind === "video"
        ? "[video]"
        : attachment.kind === "audio"
          ? "[voice message]"
          : `[file: ${attachment.name}]`;
  return text.trim() ? `${label} ${text.trim()}` : label;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
