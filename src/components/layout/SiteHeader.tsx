"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/utils/cn";

const NAV = [
  { label: "Product", href: "#product" },
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how" },
  { label: "About", href: "#about" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;

    // lock page scroll (native + Lenis smooth scroll) while the menu is open
    const { overflow } = document.documentElement.style;
    document.documentElement.style.overflow = "hidden";
    window.dispatchEvent(new Event("lenis:lock"));

    const onPointer = (e: MouseEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);

    return () => {
      document.documentElement.style.overflow = overflow;
      window.dispatchEvent(new Event("lenis:unlock"));
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 border-b border-line/60 bg-background/80 backdrop-blur"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-2 sm:px-8">
        <Link href="/" aria-label="ChatFlow home">
          <Image
            src="/logo.webp"
            alt="ChatFlow"
            width={280}
            height={94}
            priority
            className="h-14 w-auto sm:h-16"
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-ink-muted transition-colors hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-accent-contrast transition-colors hover:bg-accent-hover sm:inline-flex"
          >
            Open Chat
            <ArrowRight className="size-4" />
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-9 items-center justify-center rounded-lg text-ink-muted hover:bg-surface-muted md:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* backdrop (mobile) */}
      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 top-[var(--header-h,3.75rem)] z-30 bg-ink/20 transition-opacity md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <div
        className={cn(
          "relative z-40 overflow-hidden border-t border-line bg-background transition-[max-height] duration-300 md:hidden",
          open ? "max-h-80" : "max-h-0",
        )}
      >
        <nav className="flex flex-col px-5 py-2">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="py-2.5 text-sm font-medium text-ink-muted"
            >
              {item.label}
            </a>
          ))}
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="my-2 inline-flex items-center justify-center gap-1.5 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-contrast"
          >
            Open Chat
            <ArrowRight className="size-4" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
