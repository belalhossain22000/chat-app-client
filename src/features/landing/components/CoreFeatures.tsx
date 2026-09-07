import { Zap, User, Users, Search, Smartphone } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Real-time messaging",
    body: "Instant, reliable, and smooth conversations.",
    tint: "bg-tint-coral/60 text-accent",
  },
  {
    icon: User,
    title: "One-to-one chats",
    body: "Chat privately with anyone.",
    tint: "bg-tint-mint text-success-ink",
  },
  {
    icon: Users,
    title: "Group conversations",
    body: "Create groups, manage members, and collaborate.",
    tint: "bg-tint-coral/60 text-accent",
  },
  {
    icon: Search,
    title: "Find people easily",
    body: "Search by name or phone number.",
    tint: "bg-tint-amber text-tint-amber-ink",
  },
  {
    icon: Smartphone,
    title: "Works everywhere",
    body: "A seamless experience across all devices.",
    tint: "bg-[#ece7fb] text-[#6c53d4]",
  },
];

export function CoreFeatures() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-14">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] lg:items-center lg:gap-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
            Core features
          </p>
          <h2 className="mt-3 text-2xl font-bold leading-tight text-ink sm:text-[1.75rem]">
            Everything you need
            <br />
            in one place.
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {features.map(({ icon: Icon, title, body, tint }) => (
            <div
              key={title}
              className="flex flex-col rounded-2xl border border-line bg-surface p-4 transition-shadow hover:shadow-md"
            >
              <span
                className={`flex size-9 items-center justify-center rounded-xl ${tint}`}
              >
                <Icon className="size-4" />
              </span>
              <h3 className="mt-3 text-[13px] font-semibold text-ink">{title}</h3>
              <p className="mt-1 text-xs leading-snug text-ink-muted">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
