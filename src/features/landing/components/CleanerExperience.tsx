import Image from "next/image";
import { Check } from "lucide-react";

const points = [
  "Clean and intuitive interface",
  "Message history with auto-scroll",
  "Real-time updates via WebSocket",
  "Thoughtful details, not clutter",
];

export function CleanerExperience() {
  return (
    <section id="about" className="overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-4 px-5 py-7 sm:px-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.1fr)] lg:gap-0 lg:py-10 lg:pr-0">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
            Built around you
          </p>
          <h2 className="mt-3 text-2xl font-bold leading-[1.15] text-ink sm:text-[1.9rem]">
            A closer, cleaner
            <br />
            chat experience.
          </h2>
          <p className="mt-3 text-sm text-ink-muted">
            Designed to help you focus on what matters — people.
          </p>
          <ul className="mt-5 flex flex-col gap-2.5">
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

        <div className="lg:-ml-28 lg:mr-4 xl:-ml-44 xl:mr-8">
          <Image
            src="/cleaner-visual.png"
            alt="A group chat thread with a shared file and a group info card"
            width={1980}
            height={840}
            sizes="(min-width: 1024px) 64vw, 100vw"
            className="h-auto w-full"
          />
        </div>
      </div>
    </section>
  );
}
