import { MessageSquareDot, BellRing, Circle, CheckCheck } from "lucide-react";

const details = [
  {
    icon: MessageSquareDot,
    title: "Typing indicators",
    body: "See when someone is typing.",
    tint: "bg-surface-muted text-ink-muted",
  },
  {
    icon: BellRing,
    title: "New message alerts",
    body: "Stay in control while reading.",
    tint: "bg-tint-coral/50 text-accent",
  },
  {
    icon: Circle,
    title: "Online status",
    body: "Know when people are available.",
    tint: "bg-tint-mint text-success-ink",
  },
  {
    icon: CheckCheck,
    title: "Instant delivery",
    body: "Messages arrive in real time.",
    tint: "bg-[#dbeafe] text-[#2563eb]",
  },
];

export function SmartDetails() {
  return (
    <section className="bg-tint-coral/25">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,240px)_minmax(0,1fr)] lg:items-center lg:gap-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
              Smart interactions
            </p>
            <h2 className="mt-3 text-2xl font-bold leading-tight text-ink sm:text-[1.75rem]">
              Little details,
              <br />
              big differences.
            </h2>
            <p className="mt-3 text-sm text-ink-muted">
              Thoughtful moments that make conversations feel alive.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {details.map(({ icon: Icon, title, body, tint }) => (
              <div
                key={title}
                className="flex flex-col rounded-2xl bg-surface p-5 shadow-sm"
              >
                <span
                  className={`flex size-12 items-center justify-center rounded-xl ${tint}`}
                >
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-5 text-sm font-semibold text-ink">{title}</h3>
                <p className="mt-1.5 text-xs leading-snug text-ink-muted">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
