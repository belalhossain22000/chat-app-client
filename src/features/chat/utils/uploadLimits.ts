// Shared between the client guard and the /api/upload route so both reject at
// the same threshold.
//
// Vercel's Hobby plan caps a serverless request body at 4.5 MB. Anything above
// that never reaches the route — the platform rejects it and the browser gets
// an HTML error page, not our JSON. So the client checks first and the ceiling
// is configurable: raise NEXT_PUBLIC_MAX_UPLOAD_MB on a plan with a higher cap.

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 40 * 1024 * 1024;
export const MAX_FILE_BYTES = 20 * 1024 * 1024;
export const MAX_AUDIO_BYTES = 15 * 1024 * 1024;

export type UploadKind = "image" | "video" | "file" | "audio";

const BY_KIND: Record<UploadKind, number> = {
  image: MAX_IMAGE_BYTES,
  video: MAX_VIDEO_BYTES,
  file: MAX_FILE_BYTES,
  audio: MAX_AUDIO_BYTES,
};

const LABEL: Record<UploadKind, string> = {
  image: "Image",
  video: "Video",
  file: "File",
  audio: "Voice message",
};

// 4.5 MB unless the deployment sets a higher ceiling.
function platformCap(): number {
  const mb = Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_MB);
  return (Number.isFinite(mb) && mb > 0 ? mb : 4.5) * 1024 * 1024;
}

export function maxBytesFor(kind: UploadKind): number {
  return Math.min(BY_KIND[kind], platformCap());
}

function formatMb(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  return `${Number.isInteger(mb) ? mb : mb.toFixed(1)} MB`;
}

// Returns an error message, or null when the file is within limits.
export function checkUploadSize(kind: UploadKind, bytes: number): string | null {
  const max = maxBytesFor(kind);
  if (bytes <= max) return null;
  return `${LABEL[kind]} is too large (max ${formatMb(max)}).`;
}
