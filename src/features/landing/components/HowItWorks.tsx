import { Search, MessageSquarePlus, Send, Users, Sparkles, ArrowRight } from "lucide-react";

const steps = [
  { n: "01", icon: Search, title: "Find a person", body: "Search by name or phone number.", tint: "bg-tint-coral/60 text-accent" },
  { n: "02", icon: MessageSquarePlus, title: "Start a conversation", body: "Select a user and create a chat.", tint: "bg-tint-mint text-success-ink" },
  { n: "03", icon: Send, title: "Send messages", body: "Chat in real time instantly.", tint: "bg-tint-mint text-success-ink" },
  { n: "04", icon: Users, title: "Create groups", body: "Bring people together for better collaboration.", tint: "bg-tint-amber text-tint-amber-ink" },
  { n: "05", icon: Sparkles, title: "Stay connected", body: "Keep the conversation going anywhere.", tint: "bg-[#ece7fb] text-[#6c53d4]" },
];

export function HowItWorks() {
  return (
    <section id="how" className="bg-background">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,220px)_minmax(0,1fr)] lg:items-center lg:gap-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
              How it works
            </p>
            <h2 className="mt-3 text-2xl font-bold leading-tight text-ink sm:text-[1.75rem]">
              Start chatting
              <br />
              in seconds.
            </h2>
            <p className="mt-3 text-sm text-ink-muted">
              A simple flow to get you connected.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2 lg:flex lg:flex-row lg:items-stretch">
            {steps.map(({ n, icon: Icon, title, body, tint }, i) => (
              <div key={n} className="flex flex-1 items-center gap-2">
                <div className="flex flex-1 flex-col items-center rounded-2xl border border-line bg-surface px-3 py-4 text-center shadow-sm">
                  <span className={`flex size-10 items-center justify-center rounded-full ${tint}`}>
                    <Icon className="size-5" />
                  </span>
                  <span className="mt-2 text-xs font-bold text-ink-muted">{n}</span>
                  <h3 className="mt-1 text-[13px] font-semibold text-ink">{title}</h3>
                  <p className="mt-1 text-[11px] leading-snug text-ink-muted">{body}</p>
                </div>
                {i < steps.length - 1 && (
                  <ArrowRight className="hidden size-4 shrink-0 self-center text-ink-muted lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
