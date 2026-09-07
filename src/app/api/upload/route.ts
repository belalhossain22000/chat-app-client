import { NextResponse } from "next/server";
import sharp from "sharp";
import { randomUUID } from "node:crypto";
import { isSpacesConfigured, uploadToSpaces } from "@/lib/spaces";
import { checkRateLimit } from "../assistant/rateLimit";
import {
  checkUploadSize,
  type UploadKind,
} from "@/features/chat/utils/uploadLimits";

export const runtime = "nodejs";
export const maxDuration = 60;

const IMAGE_MAX_DIM = 1600;

const VIDEO_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/ogg",
]);

const AUDIO_TYPES = new Set([
  "audio/webm",
  "audio/ogg",
  "audio/mp4",
  "audio/mpeg",
  "audio/wav",
  "audio/x-m4a",
]);

// generic files we accept (documents, archives, text)
const FILE_TYPES = new Set([
  "application/pdf",
  "application/zip",
  "application/x-zip-compressed",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
  "text/csv",
  "application/json",
]);

function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

function safeName(name: string): string {
  return name.replace(/[^\w.\- ]+/g, "_").slice(0, 80) || "file";
}

export async function POST(request: Request) {
  if (!isSpacesConfigured()) {
    return NextResponse.json(
      { error: "File uploads are not configured." },
      { status: 503 },
    );
  }

  const rate = checkRateLimit(clientIp(request));
  if (!rate.ok) {
    return NextResponse.json(
      { error: "Too many uploads. Try again shortly." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfter) } },
    );
  }

  let file: File | null = null;
  try {
    const form = await request.formData();
    const f = form.get("file");
    if (f instanceof File) file = f;
  } catch {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }
  if (!file) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  const type = file.type || "application/octet-stream";
  const baseType = type.split(";")[0].trim();
  const isImage = baseType.startsWith("image/");
  const isVideo = VIDEO_TYPES.has(baseType) || baseType.startsWith("video/");
  const isAudio = AUDIO_TYPES.has(baseType) || baseType.startsWith("audio/");
  const isFile =
    !isImage &&
    !isVideo &&
    !isAudio &&
    (FILE_TYPES.has(baseType) || baseType === "application/octet-stream");

  if (!isImage && !isVideo && !isAudio && !isFile) {
    return NextResponse.json(
      { error: "That file type isn't supported." },
      { status: 415 },
    );
  }
  const kind: UploadKind = isImage
    ? "image"
    : isVideo
      ? "video"
      : isAudio
        ? "audio"
        : "file";

  const tooLarge = checkUploadSize(kind, file.size);
  if (tooLarge) {
    return NextResponse.json({ error: tooLarge }, { status: 413 });
  }

  const input = Buffer.from(await file.arrayBuffer());
  const id = randomUUID();
  const original = safeName(file.name);

  try {
    if (isImage) {
      // optimise: strip metadata, cap dimensions, re-encode as WebP
      const img = sharp(input, { failOn: "none" }).rotate();
      const meta = await img.metadata();
      const pipeline = img
        .resize({
          width: Math.min(meta.width ?? IMAGE_MAX_DIM, IMAGE_MAX_DIM),
          height: Math.min(meta.height ?? IMAGE_MAX_DIM, IMAGE_MAX_DIM),
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: 80 });
      const out = await pipeline.toBuffer();
      const final = await sharp(out).metadata();

      const url = await uploadToSpaces({
        key: `chat/images/${id}.webp`,
        body: out,
        contentType: "image/webp",
      });

      return NextResponse.json({
        kind: "image",
        url,
        name: original,
        size: out.length,
        width: final.width ?? null,
        height: final.height ?? null,
      });
    }

    if (isVideo) {
      // video — store as-is (no server-side transcoding)
      const ext = (original.split(".").pop() || "mp4").toLowerCase();
      const url = await uploadToSpaces({
        key: `chat/videos/${id}.${ext}`,
        body: input,
        contentType: baseType,
      });
      return NextResponse.json({
        kind: "video",
        url,
        name: original,
        size: input.length,
        mime: baseType,
      });
    }

    if (isAudio) {
      const extMap: Record<string, string> = {
        "audio/webm": "webm",
        "audio/ogg": "ogg",
        "audio/mp4": "m4a",
        "audio/x-m4a": "m4a",
        "audio/mpeg": "mp3",
        "audio/wav": "wav",
      };
      const ext = extMap[baseType] ?? "webm";
      const durationRaw = new URL(request.url).searchParams.get("duration");
      const duration = durationRaw ? Math.round(Number(durationRaw)) || 0 : 0;
      const url = await uploadToSpaces({
        key: `chat/audio/${id}.${ext}`,
        body: input,
        contentType: baseType,
      });
      return NextResponse.json({
        kind: "audio",
        url,
        name: original || "Voice message",
        size: input.length,
        mime: baseType,
        duration,
      });
    }

    // generic file — store as-is
    const ext = (original.split(".").pop() || "bin").toLowerCase();
    const url = await uploadToSpaces({
      key: `chat/files/${id}.${ext}`,
      body: input,
      contentType: type,
    });
    return NextResponse.json({
      kind: "file",
      url,
      name: original,
      size: input.length,
      mime: type,
    });
  } catch (err) {
    console.error("upload failed", err);
    return NextResponse.json(
      { error: "Upload failed. Please try again." },
      { status: 502 },
    );
  }
}
