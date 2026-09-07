import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play, Zap, Users, Smartphone } from "lucide-react";

const miniFeatures = [
  { icon: Zap, title: "Real-time", sub: "& reliable" },
  { icon: Users, title: "Groups", sub: "& collaboration" },
  { icon: Smartphone, title: "Works on", sub: "all devices" },
];

export function Hero() {
  return (
    <section id="product" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 pb-5 pt-0 sm:px-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)] lg:gap-4 lg:pb-6 lg:pr-0 lg:pt-0">
        <div className="flex flex-col justify-center lg:pr-4">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-tint-mint px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-success-ink">
            Real-time messaging
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-[1.02] tracking-tight text-ink sm:text-5xl lg:text-[3.5rem]">
            Conversations
            <br />
            that move
            <br />
            <span className="text-accent">with you.</span>
          </h1>

          <p className="mt-5 max-w-sm text-base text-ink-muted sm:text-lg">
            A beautifully simple workspace for the conversations that matter.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-semibold text-accent-contrast shadow-sm transition-colors hover:bg-accent-hover"
            >
              Open Chat
              <ArrowRight className="size-4" />
            </Link>
            <a
              href="#how"
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-5 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-surface-muted"
            >
              <span className="flex size-6 items-center justify-center rounded-full bg-tint-coral/60 text-accent">
                <Play className="size-3 fill-current" />
              </span>
              See how it works
            </a>
          </div>

          <div className="mt-9 flex flex-wrap gap-x-7 gap-y-4">
            {miniFeatures.map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex items-center gap-2.5">
                <span className="flex size-9 items-center justify-center rounded-lg bg-tint-mint text-success-ink">
                  <Icon className="size-4" />
                </span>
                <span className="text-xs leading-tight text-ink-muted">
                  <span className="font-semibold text-ink">{title}</span>
                  <br />
                  {sub}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative lg:-mr-8 xl:-mr-20">
          <Image
            src="/hero-visual.png"
            alt="ChatFlow app — conversation list and an open chat thread"
            width={1536}
            height={1024}
            priority
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="h-auto w-full motion-safe:animate-[float_6s_ease-in-out_infinite]"
          />
        </div>
      </div>
    </section>
  );
}
