import Image from "next/image";
import Link from "next/link";
import { Globe, Mail, MessageCircle } from "lucide-react";

const links = [
  { label: "Product", href: "#product" },
  { label: "Features", href: "#features" },
  { label: "About", href: "#about" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="ChatFlow"
            width={180}
            height={60}
            className="h-10 w-auto"
          />
          <span className="text-sm text-ink-muted">People. Messages. Progress.</span>
        </div>

        <nav className="flex flex-wrap items-center gap-6">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-ink-muted transition-colors hover:text-ink"
            >
              {l.label}
            </a>
          ))}
          <Link
            href="/login"
            className="text-sm font-semibold text-accent hover:underline"
          >
            Open Chat
          </Link>
        </nav>

        <div className="flex items-center gap-4 text-ink-muted">
          <a href="#" aria-label="Website" className="hover:text-ink">
            <Globe className="size-4" />
          </a>
          <a href="#" aria-label="Email" className="hover:text-ink">
            <Mail className="size-4" />
          </a>
          <a href="#" aria-label="Community" className="hover:text-ink">
            <MessageCircle className="size-4" />
          </a>
        </div>
      </div>

      <div className="border-t border-line/60">
        <p className="mx-auto max-w-6xl px-5 py-4 text-center text-xs text-ink-muted sm:px-8">
          © 2026 ChatFlow. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
