"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, X } from "lucide-react";
import type { ChatMessage } from "@/features/chat/types/message.types";
import type { Conversation } from "@/features/chat/types/conversation.types";
import { attachmentSummary } from "@/features/chat/utils/attachment";

interface SmartReplyBarProps {
  conversation: Conversation;
  messages: ChatMessage[];
  currentUserId?: string;
  onSend: (text: string) => void;
}

// Gmail-style quick replies: when the latest message is from someone else,
// auto-fetch up to 3 short suggested replies above the input. Tapping a chip
// sends it immediately. Fetches once per incoming message; errors hide silently.
export function SmartReplyBar({
  conversation,
  messages,
  currentUserId,
  onSend,
}: SmartReplyBarProps) {
  const [replies, setReplies] = useState<string[]>([]);
  const [dismissedFor, setDismissedFor] = useState<string | null>(null);
  const fetchedFor = useRef<string | null>(null);

  const last = messages.filter((m) => m.status !== "failed").at(-1);
  const trigger =
    last && last.senderId !== currentUserId ? last.id || last.tempId || null : null;

  useEffect(() => {
    if (!trigger || trigger === fetchedFor.current || trigger === dismissedFor) {
      if (!trigger) setReplies([]);
      return;
    }
    fetchedFor.current = trigger;
    setReplies([]);

    const names = new Map(conversation.participants.map((p) => [p.id, p.name]));
    const transcript = messages
      .filter((m) => m.status !== "failed")
      .slice(-10)
      .map((m) => ({
        sender:
          m.senderId === currentUserId ? "You" : names.get(m.senderId) ?? "Member",
        text: attachmentSummary(m.text),
      }));

    const controller = new AbortController();
    fetch("/api/chat-assist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "smart-replies", transcript }),
      signal: controller.signal,
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.replies?.length) setReplies(data.replies);
      })
      .catch(() => {});

    return () => controller.abort();
  }, [trigger, dismissedFor, messages, conversation.participants, currentUserId]);

  if (!trigger || trigger === dismissedFor || replies.length === 0) return null;

  return (
    <div className="border-t border-line bg-surface px-3 pt-2 sm:px-4">
      <div className="mx-auto flex max-w-3xl items-center gap-2 overflow-x-auto pb-1">
        <Sparkles className="size-3.5 shrink-0 text-accent" />
        {replies.map((r, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              setDismissedFor(trigger);
              onSend(r);
            }}
            className="shrink-0 rounded-full border border-line bg-surface-muted px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:border-accent hover:bg-tint-coral/30 hover:text-accent"
          >
            {r}
          </button>
        ))}
        <button
          type="button"
          aria-label="Dismiss suggestions"
          onClick={() => setDismissedFor(trigger)}
          className="ml-auto shrink-0 text-ink-muted hover:text-ink"
        >
          <X className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
