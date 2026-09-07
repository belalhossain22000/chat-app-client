"use client";

import { useEffect, type ReactNode } from "react";

// Soft, eased wheel/touch scrolling for the marketing pages only.
// Lenis is loaded lazily after first paint so it doesn't block LCP.
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    const start = () => {
      if (cancelled) return;
      import("lenis").then(({ default: Lenis }) => {
        if (cancelled) return;
        const lenis = new Lenis({
          duration: 1.1,
          easing: (t) => 1 - Math.pow(1 - t, 3),
          smoothWheel: true,
        });

        let raf = 0;
        const loop = (time: number) => {
          lenis.raf(time);
          raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);

        const onAnchorClick = (e: MouseEvent) => {
          const link = (e.target as HTMLElement).closest('a[href^="#"]');
          if (!link) return;
          const id = link.getAttribute("href")!.slice(1);
          const el = id ? document.getElementById(id) : null;
          if (!el) return;
          e.preventDefault();
          lenis.scrollTo(el, { offset: -72 });
        };
        document.addEventListener("click", onAnchorClick);

        // let other components pause/resume scrolling (e.g. an open mobile menu)
        const onLock = () => lenis.stop();
        const onUnlock = () => lenis.start();
        window.addEventListener("lenis:lock", onLock);
        window.addEventListener("lenis:unlock", onUnlock);

        cleanup = () => {
          document.removeEventListener("click", onAnchorClick);
          window.removeEventListener("lenis:lock", onLock);
          window.removeEventListener("lenis:unlock", onUnlock);
          cancelAnimationFrame(raf);
          lenis.destroy();
        };
      });
    };

    // wait for the browser to be idle (or a short fallback)
    const ric = (
      window as Window & {
        requestIdleCallback?: (cb: () => void) => number;
      }
    ).requestIdleCallback;
    const id =
      typeof ric === "function" ? ric(start) : window.setTimeout(start, 200);

    return () => {
      cancelled = true;
      const cic = (
        window as Window & { cancelIdleCallback?: (h: number) => void }
      ).cancelIdleCallback;
      if (typeof ric === "function" && typeof cic === "function") {
        cic(id);
      } else {
        clearTimeout(id);
      }
      cleanup?.();
    };
  }, []);

  return <>{children}</>;
}
