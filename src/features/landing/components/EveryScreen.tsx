import Image from "next/image";
import { Monitor, Tablet, Smartphone } from "lucide-react";

const screens = [
  { icon: Monitor, title: "Desktop", sub: "Full experience" },
  { icon: Tablet, title: "Tablet", sub: "Optimized layout" },
  { icon: Smartphone, title: "Mobile", sub: "Always with you" },
];

export function EveryScreen() {
  return (
    <section className="overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-6 px-5 py-10 sm:px-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)] lg:gap-4 lg:py-14 lg:pr-0">
        <div>
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
            Designed for every screen
          </p>
          <h2 className="mt-3 text-3xl font-bold leading-[1.1] text-ink sm:text-4xl lg:text-[2.75rem]">
            Same experience.
            <br />
            Everywhere.
          </h2>
          <p className="mt-4 max-w-sm text-base text-ink-muted">
            ChatFlow looks and feels great on mobile, tablet, and desktop.
          </p>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-4">
            {screens.map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex items-center gap-2.5">
                <span className="text-ink-muted">
                  <Icon className="size-5" />
                </span>
                <span className="text-xs leading-tight">
                  <span className="block font-semibold text-ink">{title}</span>
                  <span className="text-ink-muted">{sub}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative lg:-mr-16 xl:-mr-32">
          <Image
            src="/everyscreen-visual.png"
            alt="ChatFlow running on desktop, tablet, and mobile"
            width={1774}
            height={887}
            sizes="(min-width: 1024px) 62vw, 100vw"
            className="h-auto w-full"
          />
        </div>
      </div>
    </section>
  );
}
