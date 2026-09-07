"use client";

import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import type { Attachment } from "@/features/chat/utils/attachment";
import { checkUploadSize } from "@/features/chat/utils/uploadLimits";

interface Preview {
  url: string;
  kind: "image" | "video" | "file" | "audio";
  name: string;
}

export function useFileUpload() {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  const clear = useCallback(() => {
    abortRef.current?.abort();
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setUploading(false);
    setPreview(null);
    setAttachment(null);
  }, []);

  const send = useCallback(
    async (
      file: File,
      opts?: { previewKind?: Preview["kind"]; duration?: number },
    ) => {
      const kind: Preview["kind"] =
        opts?.previewKind ??
        (file.type.startsWith("image/")
          ? "image"
          : file.type.startsWith("video/")
            ? "video"
            : file.type.startsWith("audio/")
              ? "audio"
              : "file");

      // Reject before uploading: past the platform body cap the request never
      // reaches our route, so the response wouldn't be our JSON error.
      const tooLarge = checkUploadSize(kind, file.size);
      if (tooLarge) {
        toast.error(tooLarge);
        return null;
      }

      clear();
      const url = URL.createObjectURL(file);
      previewUrlRef.current = url;
      setPreview({ url, kind, name: file.name });
      setUploading(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const form = new FormData();
        form.append("file", file);
        const qs = opts?.duration ? `?duration=${opts.duration}` : "";
        const res = await fetch(`/api/upload${qs}`, {
          method: "POST",
          body: form,
          signal: controller.signal,
        });
        const data = await res.json().catch(() => null);
        if (!res.ok || !data) {
          toast.error(
            data?.error ??
              (res.status === 413
                ? "That file is too large to upload."
                : "Upload failed."),
          );
          clear();
          return null;
        }
        const att: Attachment = {
          kind: data.kind,
          url: data.url,
          name: data.name,
          size: data.size,
          width: data.width ?? undefined,
          height: data.height ?? undefined,
          mime: data.mime ?? undefined,
          duration: data.duration ?? undefined,
        };
        setAttachment(att);
        setUploading(false);
        return att;
      } catch (err) {
        if ((err as Error).name !== "AbortError") toast.error("Upload failed.");
        clear();
        return null;
      }
    },
    [clear],
  );

  return { uploading, preview, attachment, select: send, upload: send, clear };
}
