import Image from "next/image";
import Link from "next/link";
import { Globe, Mail, MessageCircle } from "lucide-react";

const columns = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How it works", href: "#how" },
      { label: "Every screen", href: "#about" },
      { label: "Open Chat", href: "/login" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "#about" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Help center", href: "#" },
      { label: "Community", href: "#" },
      { label: "Status", href: "#" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Cookies", href: "#" },
    ],
  },
];

const social = [
  { icon: Globe, label: "Website", href: "#" },
  { icon: Mail, label: "Email", href: "#" },
  { icon: MessageCircle, label: "Community", href: "#" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-background">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,2.6fr)]">
          <div>
            <Image
              src="/logo.png"
              alt="ChatFlow"
              width={200}
              height={68}
              className="h-11 w-auto"
            />
            <p className="mt-4 max-w-xs text-sm text-ink-muted">
              A beautifully simple workspace for the conversations that matter.
              Real-time, reliable, everywhere.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {social.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-lg border border-line text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {columns.map((col) => (
              <div key={col.heading}>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink">
                  {col.heading}
                </p>
                <ul className="mt-3 flex flex-col gap-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="text-sm text-ink-muted transition-colors hover:text-ink"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-line/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-5 text-xs text-ink-muted sm:flex-row sm:px-8">
          <p>© 2026 ChatFlow. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-success-ink" />
            People. Messages. Progress.
          </p>
        </div>
      </div>
    </footer>
  );
}
