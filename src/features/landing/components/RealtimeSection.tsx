import Image from "next/image";
import { Check } from "lucide-react";

const points = [
  "Instant message delivery",
  "Live updates over WebSocket",
  "Optimistic sending with retry",
  "Unread message alerts",
];

export function RealtimeSection() {
  return (
    <section className="overflow-hidden bg-surface">
      <div className="mx-auto grid max-w-7xl items-center gap-6 px-5 pb-0 pt-4 sm:px-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.55fr)] lg:gap-2 lg:pt-6 lg:pr-0">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
            See it in action
          </p>
          <h2 className="mt-3 text-3xl font-bold leading-[1.1] text-ink sm:text-4xl">
            Real conversations.
            <br />
            In real time.
          </h2>
          <p className="mt-4 max-w-sm text-base text-ink-muted">
            Messages are delivered the moment they&rsquo;re sent, with a smooth,
            natural feel — no refresh, no waiting.
          </p>
          <ul className="mt-6 flex flex-col gap-3">
            {points.map((p) => (
              <li key={p} className="flex items-center gap-2.5 text-sm text-ink">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-tint-mint text-success-ink">
                  <Check className="size-3" />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative lg:-mr-16 xl:-mr-40">
          <Image
            src="/realtime-visual.webp"
            alt="A chat thread with a typing indicator, next to a phone lock-screen notification"
            width={1800}
            height={900}
            sizes="(min-width: 1024px) 62vw, 100vw"
            className="h-auto w-full"
          />
        </div>
      </div>
    </section>
  );
}
