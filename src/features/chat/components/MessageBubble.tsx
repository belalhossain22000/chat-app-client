"use client";

import { memo } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/utils/cn";
import { Avatar } from "@/components/ui/Avatar";
import { formatMessageTime } from "@/features/chat/utils/formatTime";
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

  return (
    <div className={cn("flex gap-2", mine ? "justify-end" : "justify-start")}>
      {!mine && (
        <div className="w-8 shrink-0">
          {showAvatar && <Avatar name={senderName} size="sm" />}
        </div>
      )}

      <div className={cn("flex max-w-[75%] flex-col", mine ? "items-end" : "items-start")}>
        {!mine && isGroup && showName && senderName && (
          <span className="mb-1 px-1 text-xs font-medium text-ink-muted">
            {senderName}
          </span>
        )}

        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-sm",
            mine
              ? "rounded-br-md bg-accent text-accent-contrast"
              : "rounded-bl-md bg-surface-muted text-ink",
            message.status === "sending" && "opacity-70",
          )}
        >
          <p className="whitespace-pre-wrap break-words">{message.text}</p>
        </div>

        <div
          className={cn(
            "mt-1 flex items-center gap-1.5 px-1 text-xs",
            failed ? "text-accent" : "text-ink-muted",
          )}
        >
          {failed ? (
            <>
              <AlertCircle className="size-3.5" />
              <span>Not sent</span>
              {onRetry && (
                <button
                  type="button"
                  onClick={() => onRetry(message)}
                  className="font-medium underline"
                >
                  Retry
                </button>
              )}
            </>
          ) : (
            <span>
              {message.status === "sending"
                ? "Sending…"
                : formatMessageTime(message.createdAt)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export const MessageBubble = memo(MessageBubbleBase);
