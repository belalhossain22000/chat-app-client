"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/utils/cn";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Fade + slide-up on scroll into view.
 * SEO-safe: server HTML renders fully visible; the hidden start state is only
 * applied (before paint) to elements still below the fold.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // arm only what's clearly below the fold
    if (el.getBoundingClientRect().top < window.innerHeight - 40) return;
    setArmed(true);
  }, []);

  useEffect(() => {
    if (!armed) return;
    const el = ref.current;
    if (!el) return;

    // wait one frame so the hidden state paints before we allow the reveal
    const id = requestAnimationFrame(() => {
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        },
        { threshold: 0.1 },
      );
      io.observe(el);
    });

    return () => cancelAnimationFrame(id);
  }, [armed]);

  const hidden = armed && !shown;

  return (
    <div
      ref={ref}
      style={{ transitionDelay: shown ? `${delay}ms` : "0ms" }}
      className={cn(
        "transition-all duration-[800ms] ease-out will-change-[opacity,transform]",
        hidden ? "translate-y-12 opacity-0" : "translate-y-0 opacity-100",
        className,
      )}
    >
      {children}
    </div>
  );
}
