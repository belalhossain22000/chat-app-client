"use client";

import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import {
  Send,
  Paperclip,
  Smile,
  X,
  Film,
  FileText,
  Mic,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { EmojiPicker } from "@/components/ui/EmojiPicker";
import { useFileUpload } from "@/features/chat/hooks/useFileUpload";
import { useVoiceRecorder } from "@/features/chat/hooks/useVoiceRecorder";
import { encodeAttachment } from "@/features/chat/utils/attachment";

function fmtTime(s: number) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

export interface MessageInputHandle {
  setText: (text: string) => void;
  focus: () => void;
}

interface MessageInputProps {
  conversationId: string;
  onSend?: (text: string) => void;
  disabled?: boolean;
}

const IMAGE_ACCEPT = "image/*";
const VIDEO_ACCEPT = "video/mp4,video/webm,video/quicktime";
const FILE_ACCEPT =
  ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip,.json";

export const MessageInput = forwardRef<MessageInputHandle, MessageInputProps>(
  function MessageInput({ onSend, disabled }, ref) {
    const [text, setText] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const areaRef = useRef<HTMLTextAreaElement>(null);
    const fileRef = useRef<HTMLInputElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const acceptRef = useRef<string>(IMAGE_ACCEPT);
    const { uploading, preview, attachment, select, upload, clear } =
      useFileUpload();
    const recorder = useVoiceRecorder();

    const trimmed = text.trim();
    const canSend =
      (trimmed.length > 0 || Boolean(attachment)) && !uploading && !disabled;
    const showMic =
      trimmed.length === 0 && !attachment && !preview && !uploading;

    function grow() {
      const el = areaRef.current;
      if (!el) return;
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
    }

    useImperativeHandle(ref, () => ({
      setText: (value: string) => {
        setText(value);
        requestAnimationFrame(() => {
          grow();
          areaRef.current?.focus();
        });
      },
      focus: () => areaRef.current?.focus(),
    }));

    function submit() {
      if (!canSend) return;
      if (attachment) {
        const token = encodeAttachment(attachment);
        onSend?.(trimmed ? `${token}\n${trimmed}` : token);
        clear();
      } else {
        onSend?.(trimmed);
      }
      setText("");
      if (areaRef.current) areaRef.current.style.height = "auto";
    }

    function pick(kind: "image" | "video" | "file") {
      setMenuOpen(false);
      acceptRef.current =
        kind === "image"
          ? IMAGE_ACCEPT
          : kind === "video"
            ? VIDEO_ACCEPT
            : FILE_ACCEPT;
      if (fileRef.current) fileRef.current.accept = acceptRef.current;
      requestAnimationFrame(() => fileRef.current?.click());
    }

    function handleSubmit(e: FormEvent) {
      e.preventDefault();
      submit();
    }

    async function stopAndSendVoice() {
      const rec = await recorder.stop();
      if (!rec) return;
      const ext = rec.mime.includes("mp4")
        ? "m4a"
        : rec.mime.includes("ogg")
          ? "ogg"
          : "webm";
      const file = new File([rec.blob], `voice-${Date.now()}.${ext}`, {
        type: rec.mime,
      });
      const att = await upload(file, {
        previewKind: "audio",
        duration: rec.duration,
      });
      if (att) {
        onSend?.(encodeAttachment(att));
        clear();
      }
    }

    function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        submit();
      }
    }

    function insertEmoji(emoji: string) {
      const el = areaRef.current;
      if (!el) {
        setText((t) => t + emoji);
        return;
      }
      const start = el.selectionStart ?? text.length;
      const end = el.selectionEnd ?? text.length;
      const next = text.slice(0, start) + emoji + text.slice(end);
      setText(next);
      requestAnimationFrame(() => {
        grow();
        el.focus();
        const caret = start + emoji.length;
        el.setSelectionRange(caret, caret);
      });
    }

    return (
      <form
        onSubmit={handleSubmit}
        className="relative border-t border-line bg-surface px-3 py-3 sm:px-4"
        /* clears the iOS home bar: the tab bar is hidden while a thread is open */
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      >
        <input
          ref={fileRef}
          type="file"
          accept={IMAGE_ACCEPT}
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            e.target.value = "";
            if (f) select(f);
          }}
        />

        {preview && (
          <div className="mx-auto mb-2 flex max-w-3xl items-center gap-3 rounded-xl border border-line bg-surface-muted p-2">
            {preview.kind === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview.url}
                alt=""
                className="size-16 rounded-lg object-cover"
              />
            ) : (
              <span className="flex size-16 items-center justify-center rounded-lg bg-ink/5 text-ink-muted">
                {preview.kind === "video" ? (
                  <Film className="size-6" />
                ) : (
                  <FileText className="size-6" />
                )}
              </span>
            )}
            <div className="min-w-0 flex-1 text-sm">
              <p className="truncate font-medium text-ink">
                {preview.kind === "image"
                  ? "Image"
                  : preview.kind === "video"
                    ? "Video"
                    : preview.name}
              </p>
              <p
                className={cn(
                  "text-xs",
                  uploading ? "text-ink-muted" : "text-success-ink",
                )}
              >
                {uploading ? "Uploading…" : "Ready to send"}
              </p>
            </div>
            <button
              type="button"
              aria-label="Remove attachment"
              onClick={clear}
              className="text-ink-muted hover:text-ink"
            >
              <X className="size-4" />
            </button>
          </div>
        )}

        {recorder.status === "recording" ? (
          <div className="mx-auto flex max-w-3xl items-center gap-3 rounded-2xl border border-accent/40 bg-tint-coral/30 px-3 py-2.5">
            <button
              type="button"
              aria-label="Cancel recording"
              onClick={recorder.cancel}
              className="text-ink-muted hover:text-accent"
            >
              <Trash2 className="size-5" />
            </button>
            <span className="flex items-center gap-2 text-sm text-ink">
              <span className="size-2 animate-pulse rounded-full bg-accent" />
              {fmtTime(recorder.seconds)}
            </span>
            <span className="flex-1 text-xs text-ink-muted">Recording…</span>
            <button
              type="button"
              aria-label="Send voice message"
              onClick={stopAndSendVoice}
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-contrast hover:bg-accent-hover"
            >
              <Send className="size-4" />
            </button>
          </div>
        ) : (
        <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-2xl border border-line bg-surface-muted px-3 py-2 focus-within:ring-2 focus-within:ring-accent">
          <div className="relative">
            <button
              type="button"
              aria-label="Attach"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              disabled={uploading || disabled}
              className={cn(
                "pb-1.5 transition-colors hover:text-ink disabled:opacity-50",
                menuOpen ? "text-accent" : "text-ink-muted",
              )}
            >
              <Paperclip className="size-5" />
            </button>

            {menuOpen && (
              <div
                ref={menuRef}
                className="absolute bottom-full left-0 z-50 mb-2 w-40 overflow-hidden rounded-xl border border-line bg-surface shadow-xl"
                onMouseLeave={() => setMenuOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => pick("image")}
                  className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-ink hover:bg-surface-muted"
                >
                  <ImageIcon className="size-4 text-ink-muted" />
                  Image
                </button>
                <button
                  type="button"
                  onClick={() => pick("video")}
                  className="flex w-full items-center gap-2.5 border-t border-line px-3 py-2.5 text-sm text-ink hover:bg-surface-muted"
                >
                  <Film className="size-4 text-ink-muted" />
                  Video
                </button>
                <button
                  type="button"
                  onClick={() => pick("file")}
                  className="flex w-full items-center gap-2.5 border-t border-line px-3 py-2.5 text-sm text-ink hover:bg-surface-muted"
                >
                  <FileText className="size-4 text-ink-muted" />
                  File
                </button>
              </div>
            )}
          </div>

          <textarea
            ref={areaRef}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              grow();
            }}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder={preview ? "Add a caption…" : "Type a message..."}
            className="max-h-40 flex-1 resize-none bg-transparent py-1.5 text-sm text-ink outline-none placeholder:text-ink-muted"
          />

          <EmojiPicker
            onPick={insertEmoji}
            triggerClassName={(open) =>
              cn(
                "pb-1.5 transition-colors hover:text-ink",
                open ? "text-accent" : "text-ink-muted",
              )
            }
          >
            {() => <Smile className="size-5" />}
          </EmojiPicker>

          {showMic ? (
            <button
              type="button"
              aria-label="Record voice message"
              onClick={recorder.start}
              disabled={disabled}
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-contrast transition-colors hover:bg-accent-hover disabled:opacity-50"
            >
              <Mic className="size-4" />
            </button>
          ) : (
            <button
              type="submit"
              aria-label="Send message"
              disabled={!canSend}
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-full transition-colors",
                canSend
                  ? "bg-accent text-accent-contrast hover:bg-accent-hover"
                  : "bg-line text-ink-muted",
              )}
            >
              <Send className="size-4" />
            </button>
          )}
        </div>
        )}
      </form>
    );
  },
);
