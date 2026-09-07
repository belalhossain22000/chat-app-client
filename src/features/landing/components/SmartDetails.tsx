import { ArrowDownToLine, BellRing, WifiOff, CheckCheck } from "lucide-react";

const details = [
  {
    icon: ArrowDownToLine,
    title: "Smart auto-scroll",
    body: "Follows new messages, but never yanks you down while you read.",
  },
  {
    icon: BellRing,
    title: "New message alerts",
    body: "A subtle pill shows how many messages arrived while you scrolled up.",
  },
  {
    icon: WifiOff,
    title: "Offline-aware",
    body: "Failed sends stay put with a one-tap retry — nothing is lost.",
  },
  {
    icon: CheckCheck,
    title: "Instant delivery",
    body: "Messages appear the moment they're sent, reconciled by id.",
  },
];

export function SmartDetails() {
  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
          Smart interactions
        </p>
        <h2 className="mt-3 max-w-sm text-3xl font-bold leading-tight text-ink sm:text-4xl">
          Little details, big differences.
        </h2>
        <p className="mt-4 max-w-md text-base text-ink-muted">
          Thoughtful moments that make conversations feel alive.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {details.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="flex flex-col rounded-2xl border border-line bg-background p-5"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-tint-coral/60 text-accent">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-4 text-sm font-semibold text-ink">{title}</h3>
              <p className="mt-1.5 text-xs text-ink-muted">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
