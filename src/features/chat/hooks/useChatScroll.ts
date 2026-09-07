"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/features/chat/types/message.types";

interface UseChatScrollArgs {
  messages: ChatMessage[];
  currentUserId?: string;
  /** Called when the user scrolls near the top (load older page). */
  onReachTop?: () => void;
  hasMore?: boolean;
}

const NEAR_BOTTOM_PX = 120;
const NEAR_TOP_PX = 80;

export function useChatScroll({
  messages,
  currentUserId,
  onReachTop,
  hasMore,
}: UseChatScrollArgs) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [atBottom, setAtBottom] = useState(true);
  const [newCount, setNewCount] = useState(0);

  const prevLenRef = useRef(messages.length);
  const prevFirstIdRef = useRef(messages[0]?.id);
  const prevScrollHeightRef = useRef(0);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    bottomRef.current?.scrollIntoView({ behavior, block: "end" });
    setNewCount(0);
  }, []);

  const onScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const distanceFromBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight;
    const nowAtBottom = distanceFromBottom <= NEAR_BOTTOM_PX;
    setAtBottom(nowAtBottom);
    if (nowAtBottom) setNewCount(0);

    if (el.scrollTop <= NEAR_TOP_PX && hasMore) {
      prevScrollHeightRef.current = el.scrollHeight;
      onReachTop?.();
    }
  }, [hasMore, onReachTop]);

  // React to message list changes
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prevLen = prevLenRef.current;
    const prevFirstId = prevFirstIdRef.current;
    const grew = messages.length > prevLen;
    const prependedOlder =
      grew && messages[0]?.id !== prevFirstId && prevFirstId != null;

    if (prependedOlder) {
      // keep the viewport anchored where the user was
      const delta = el.scrollHeight - prevScrollHeightRef.current;
      el.scrollTop += delta;
    } else if (grew) {
      const last = messages[messages.length - 1];
      const mine = last?.senderId === currentUserId;
      if (atBottom || mine) {
        scrollToBottom(prevLen === 0 ? "auto" : "smooth");
      } else {
        setNewCount((c) => c + (messages.length - prevLen));
      }
    }

    prevLenRef.current = messages.length;
    prevFirstIdRef.current = messages[0]?.id;
  }, [messages, atBottom, currentUserId, scrollToBottom]);

  return {
    containerRef,
    bottomRef,
    onScroll,
    atBottom,
    newCount,
    scrollToBottom,
  };
}
