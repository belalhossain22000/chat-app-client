"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { cn } from "@/utils/cn";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const GREETING: Msg = {
  role: "assistant",
  content: "Hi! I'm the ChatFlow assistant. Ask me anything about the app.",
};

const SUGGESTIONS = [
  "What is ChatFlow?",
  "How does real-time work?",
  "Can I create groups?",
];

export function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, open, loading]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const next = [...messages, { role: "user" as const, content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(1) }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: res.ok
            ? data.reply
            : data.error ?? "Something went wrong. Try again.",
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Couldn't reach the assistant. Try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    send(input);
  }

  return (
    <>
      <div
        className="group fixed right-6 z-50 flex flex-col items-end"
        style={{ bottom: "calc(env(safe-area-inset-bottom) + 1.5rem)" }}
      >
        <span
          className={cn(
            "pointer-events-none absolute right-0 bottom-full mb-2 select-none whitespace-nowrap rounded-full bg-ink px-3 py-1.5 text-xs font-medium text-background shadow-lg transition-all duration-200",
            // never on small screens: it crowds the FAB and the tab bar
            "max-sm:hidden",
            // a real tooltip now — absolutely positioned so it never affects
            // this container's flow/height (the back-to-top arrow is placed
            // relative to that flow); hidden at rest so it doesn't sit on top
            // of the hero mockup behind it, only appears on hover/focus
            "translate-y-2 opacity-0",
            !open && "group-hover:translate-y-0 group-hover:opacity-100",
          )}
        >
          Ask about ChatFlow
        </span>
        <button
          type="button"
          aria-label={open ? "Close assistant" : "Open assistant"}
          title={open ? "Close" : "Ask about ChatFlow"}
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "flex size-14 items-center justify-center rounded-full",
            "bg-accent text-accent-contrast shadow-xl transition-transform hover:bg-accent-hover",
            open && "rotate-90",
          )}
        >
          {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
        </button>
      </div>

      <div
        className={cn(
          "fixed right-6 z-50 flex w-[min(370px,calc(100vw-3rem))] flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl transition-all duration-300",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0",
        )}
        style={{
          bottom: "calc(env(safe-area-inset-bottom) + 6rem)",
          maxHeight: "min(560px, calc(100dvh - 10rem))",
        }}
      >
        <div className="flex items-center gap-2 border-b border-line bg-tint-coral/30 px-4 py-3">
          <span className="flex size-8 items-center justify-center rounded-lg bg-accent text-accent-contrast">
            <Sparkles className="size-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">ChatFlow assistant</p>
            <p className="text-[11px] text-ink-muted">Ask about the app</p>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex flex-1 flex-col gap-3 overflow-y-auto p-4"
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className={cn(
                "max-w-[85%] rounded-2xl px-3.5 py-2 text-sm",
                m.role === "user"
                  ? "self-end rounded-br-md bg-accent text-accent-contrast"
                  : "self-start rounded-bl-md bg-surface-muted text-ink",
              )}
            >
              {m.content}
            </div>
          ))}

          {loading && (
            <div className="self-start rounded-2xl rounded-bl-md bg-surface-muted px-3.5 py-2.5">
              <span className="flex gap-1">
                <span className="size-1.5 animate-pulse rounded-full bg-ink-muted [animation-delay:-0.3s]" />
                <span className="size-1.5 animate-pulse rounded-full bg-ink-muted [animation-delay:-0.15s]" />
                <span className="size-1.5 animate-pulse rounded-full bg-ink-muted" />
              </span>
            </div>
          )}

          {messages.length === 1 && !loading && (
            <div className="mt-1 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-full border border-line px-3 py-1.5 text-xs text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        <form
          onSubmit={onSubmit}
          className="flex items-center gap-2 border-t border-line p-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about ChatFlow…"
            className="flex-1 rounded-full bg-surface-muted px-3.5 py-2 text-sm text-ink outline-none placeholder:text-ink-muted"
          />
          <button
            type="submit"
            aria-label="Send"
            disabled={!input.trim() || loading}
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-contrast transition-colors hover:bg-accent-hover disabled:opacity-50"
          >
            <Send className="size-4" />
          </button>
        </form>
      </div>
    </>
  );
}
