"use client";

import { useMemo, useState } from "react";
import {
  Sparkles,
  X,
  FileText,
  PenLine,
  MessageCircleQuestion,
  Copy,
  Check,
  Send,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { MiniMarkdown } from "@/components/ui/MiniMarkdown";
import { useChatAssist, type AssistMode } from "@/features/chat/hooks/useChatAssist";
import type { ChatMessage } from "@/features/chat/types/message.types";
import type { Conversation } from "@/features/chat/types/conversation.types";

interface ChatAssistPanelProps {
  open: boolean;
  onClose: () => void;
  conversation: Conversation;
  messages: ChatMessage[];
  currentUserId?: string;
  onUseDraft: (text: string) => void;
}

const modes: { key: AssistMode; label: string; icon: typeof FileText }[] = [
  { key: "summarize", label: "Summarize", icon: FileText },
  { key: "draft", label: "Draft a reply", icon: PenLine },
  { key: "ask", label: "Ask about chat", icon: MessageCircleQuestion },
];

export function ChatAssistPanel({
  open,
  onClose,
  conversation,
  messages,
  currentUserId,
  onUseDraft,
}: ChatAssistPanelProps) {
  const { run, reset, loading, result, error, activeMode } = useChatAssist();
  const [question, setQuestion] = useState("");
  const [copied, setCopied] = useState(false);

  const transcript = useMemo(() => {
    const names = new Map(conversation.participants.map((p) => [p.id, p.name]));
    return messages
      .filter((m) => m.status !== "failed")
      .map((m) => ({
        sender: m.senderId === currentUserId ? "You" : names.get(m.senderId) ?? "Member",
        text: m.text,
      }));
  }, [messages, conversation.participants, currentUserId]);

  const hasMessages = transcript.length > 0;

  function trigger(mode: AssistMode) {
    if (!hasMessages) return;
    if (mode === "ask") {
      if (!question.trim()) return;
      run({ mode, transcript, question });
    } else {
      run({ mode, transcript });
    }
  }

  async function copyResult() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  return (
    <div
      className={cn(
        "absolute inset-x-0 bottom-0 z-30 rounded-t-2xl border-t border-line bg-surface shadow-2xl transition-transform duration-300",
        open ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-accent text-accent-contrast">
            <Sparkles className="size-4" />
          </span>
          <span className="text-sm font-semibold text-ink">Chat assistant</span>
        </div>
        <button
          type="button"
          aria-label="Close assistant"
          onClick={() => {
            reset();
            onClose();
          }}
          className="text-ink-muted hover:text-ink"
        >
          <X className="size-5" />
        </button>
      </div>

      <div className="max-h-[55dvh] overflow-y-auto p-4">
        <div className="flex flex-wrap gap-2">
          {modes.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => trigger(key)}
              disabled={loading || !hasMessages}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50",
                activeMode === key
                  ? "border-accent bg-tint-coral/40 text-accent"
                  : "border-line text-ink-muted hover:text-ink",
              )}
            >
              <Icon className="size-3.5" />
              {label}
            </button>
          ))}
        </div>

        <div className="mt-3 flex gap-2">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") trigger("ask");
            }}
            placeholder="Ask something about this conversation…"
            className="flex-1 rounded-lg border border-line bg-surface-muted px-3 py-2 text-sm text-ink outline-none placeholder:text-ink-muted"
          />
          <button
            type="button"
            aria-label="Ask"
            onClick={() => trigger("ask")}
            disabled={loading || !question.trim()}
            className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-contrast disabled:opacity-50"
          >
            <Send className="size-4" />
          </button>
        </div>

        {!hasMessages && (
          <p className="mt-4 text-sm text-ink-muted">
            Send a few messages first — then I can summarize or draft a reply.
          </p>
        )}

        {loading && (
          <div className="mt-4 flex items-center gap-2 text-sm text-ink-muted">
            <span className="flex gap-1">
              <span className="size-1.5 animate-pulse rounded-full bg-ink-muted [animation-delay:-0.3s]" />
              <span className="size-1.5 animate-pulse rounded-full bg-ink-muted [animation-delay:-0.15s]" />
              <span className="size-1.5 animate-pulse rounded-full bg-ink-muted" />
            </span>
            Thinking…
          </div>
        )}

        {error && !loading && (
          <p className="mt-4 rounded-lg bg-tint-coral/40 px-3 py-2 text-sm text-accent">
            {error}
          </p>
        )}

        {result && !loading && (
          <div className="mt-4 rounded-xl border border-line bg-surface-muted p-3">
            <div className="text-sm text-ink">
              <MiniMarkdown text={result} />
            </div>
            <div className="mt-3 flex gap-2">
              {activeMode === "draft" && (
                <button
                  type="button"
                  onClick={() => {
                    onUseDraft(result);
                    reset();
                    onClose();
                  }}
                  className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-accent-contrast hover:bg-accent-hover"
                >
                  Use this reply
                </button>
              )}
              <button
                type="button"
                onClick={copyResult}
                className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink-muted hover:text-ink"
              >
                {copied ? (
                  <Check className="size-3.5 text-success-ink" />
                ) : (
                  <Copy className="size-3.5" />
                )}
                Copy
              </button>
            </div>
          </div>
        )}

        <p className="mt-4 text-[11px] text-ink-muted">
          Messages from this conversation are sent to Google&rsquo;s Gemini to
          generate the response.
        </p>
      </div>
    </div>
  );
}
