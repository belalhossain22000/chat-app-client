import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-tint-coral/40">
      <Image
        src="/cta-visual.png"
        alt=""
        fill
        sizes="100vw"
        className="pointer-events-none select-none object-cover opacity-90"
      />

      <div className="relative mx-auto flex max-w-2xl flex-col items-center px-5 py-16 text-center sm:px-8 lg:py-20">
        <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-[2.25rem]">
          Ready to start talking?
        </h2>
        <p className="mt-3 text-base text-ink-muted">
          Join ChatFlow and experience a better way to connect.
        </p>

        <Link
          href="/login"
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-accent px-7 py-3.5 text-sm font-semibold text-accent-contrast shadow-sm transition-colors hover:bg-accent-hover"
        >
          Open Chat
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
