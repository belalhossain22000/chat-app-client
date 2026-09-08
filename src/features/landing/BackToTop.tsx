"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/utils/cn";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      style={{ bottom: "calc(env(safe-area-inset-bottom) + 1.5rem + 3.5rem + 1.25rem)" }}
      className={cn(
        // sits directly above the assistant trigger, sharing its right edge
        "fixed right-6 z-50 flex size-10 items-center justify-center rounded-full",
        "bg-ink text-background shadow-lg transition-all duration-300 hover:bg-ink/90",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <ArrowUp className="size-5" />
    </button>
  );
}
