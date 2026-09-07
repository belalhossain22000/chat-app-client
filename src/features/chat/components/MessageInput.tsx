"use client";

import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { Send, Paperclip, Smile } from "lucide-react";
import { cn } from "@/utils/cn";
import { EmojiPicker } from "@/components/ui/EmojiPicker";

export interface MessageInputHandle {
  setText: (text: string) => void;
  focus: () => void;
}

interface MessageInputProps {
  conversationId: string;
  onSend?: (text: string) => void;
  disabled?: boolean;
}

export const MessageInput = forwardRef<MessageInputHandle, MessageInputProps>(
  function MessageInput({ onSend, disabled }, ref) {
    const [text, setText] = useState("");
    const areaRef = useRef<HTMLTextAreaElement>(null);

    const trimmed = text.trim();
    const canSend = trimmed.length > 0 && !disabled;

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
      onSend?.(trimmed);
      setText("");
      if (areaRef.current) areaRef.current.style.height = "auto";
    }

    function handleSubmit(e: FormEvent) {
      e.preventDefault();
      submit();
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
        className="border-t border-line bg-surface px-3 py-3 sm:px-4"
      >
        <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-2xl border border-line bg-surface-muted px-3 py-2 focus-within:ring-2 focus-within:ring-accent">
          <button
            type="button"
            aria-label="Attach file"
            className="pb-1.5 text-ink-muted transition-colors hover:text-ink"
            disabled
            title="Attachments aren't supported"
          >
            <Paperclip className="size-5" />
          </button>

          <textarea
            ref={areaRef}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              grow();
            }}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Type a message..."
            className="max-h-40 flex-1 resize-none bg-transparent py-1.5 text-sm text-ink outline-none placeholder:text-ink-muted"
          />

          <button
            type="button"
            aria-label="Emoji"
            className="pb-1.5 text-ink-muted transition-colors hover:text-ink"
            disabled
          >
            <Smile className="size-5" />
          </button>

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
        </div>
      </form>
    );
  },
);
