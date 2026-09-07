"use client";

import { memo } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/utils/cn";
import { Avatar } from "@/components/ui/Avatar";
import { AttachmentView } from "./AttachmentView";
import { formatMessageTime } from "@/features/chat/utils/formatTime";
import { parseMessageText } from "@/features/chat/utils/attachment";
import type { ChatMessage } from "@/features/chat/types/message.types";

interface MessageBubbleProps {
  message: ChatMessage;
  mine: boolean;
  isGroup: boolean;
  senderName?: string;
  showAvatar: boolean;
  showName: boolean;
  onRetry?: (message: ChatMessage) => void;
}

function MessageBubbleBase({
  message,
  mine,
  isGroup,
  senderName,
  showAvatar,
  showName,
  onRetry,
}: MessageBubbleProps) {
  const failed = message.status === "failed";
  const { attachment, text } = parseMessageText(message.text);
  const hasCaption = text.trim().length > 0;

  return (
    <div className={cn("flex gap-2", mine ? "justify-end" : "justify-start")}>
      {!mine && (
        <div className="w-8 shrink-0">
          {showAvatar && <Avatar name={senderName} size="sm" />}
        </div>
      )}

      <div
        className={cn("flex max-w-[80%] flex-col", mine ? "items-end" : "items-start")}
      >
        {!mine && isGroup && showName && senderName && (
          <span className="mb-1 px-1 text-xs font-medium text-ink-muted">
            {senderName}
          </span>
        )}

        {attachment ? (
          <div
            className={cn(
              "overflow-hidden rounded-2xl",
              mine ? "rounded-br-md" : "rounded-bl-md",
              failed && "opacity-60 ring-1 ring-accent",
              message.status === "sending" && "opacity-70",
            )}
          >
            <AttachmentView attachment={attachment} mine={mine} />
            {hasCaption && (
              <p
                className={cn(
                  "whitespace-pre-wrap break-words px-4 py-2 text-sm",
                  mine
                    ? "bg-accent text-accent-contrast"
                    : "bg-surface-muted text-ink",
                )}
              >
                {text}
              </p>
            )}
          </div>
        ) : (
          <div
            className={cn(
              "rounded-2xl px-4 py-2.5 text-sm",
              failed
                ? "rounded-br-md bg-tint-coral/60 text-ink"
                : mine
                  ? "rounded-br-md bg-accent text-accent-contrast"
                  : "rounded-bl-md bg-surface-muted text-ink",
              message.status === "sending" && "opacity-70",
            )}
          >
            <p className="whitespace-pre-wrap break-words">{text}</p>
          </div>
        )}

        {failed ? (
          <div className="mt-1 flex items-center gap-2 rounded-lg bg-tint-coral/50 px-3 py-2 text-xs">
            <AlertCircle className="size-4 shrink-0 text-accent" />
            <div className="flex-1">
              <p className="font-medium text-accent">Message failed to send</p>
              <p className="text-ink-muted">Check your connection and try again.</p>
            </div>
            {onRetry && (
              <button
                type="button"
                onClick={() => onRetry(message)}
                className="font-semibold text-accent hover:underline"
              >
                Retry
              </button>
            )}
          </div>
        ) : (
          <span className="mt-1 px-1 text-xs text-ink-muted">
            {message.status === "sending"
              ? "Sending…"
              : formatMessageTime(message.createdAt)}
          </span>
        )}
      </div>
    </div>
  );
}

export const MessageBubble = memo(MessageBubbleBase);
