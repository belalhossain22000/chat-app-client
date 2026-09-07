import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-tint-coral/40">
      <div className="mx-auto flex max-w-4xl flex-col items-center px-5 py-20 text-center sm:px-8">
        <div className="mb-6 flex -space-x-2">
          {["Ada", "Ben", "Cara", "Dan", "Eve"].map((n) => (
            <Avatar key={n} name={n} size="md" className="ring-2 ring-tint-coral/40" />
          ))}
        </div>

        <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Ready to start talking?
        </h2>
        <p className="mt-3 max-w-md text-base text-ink-muted">
          Join ChatFlow and experience a better way to connect.
        </p>

        <Link
          href="/login"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-accent px-7 py-3.5 text-sm font-semibold text-accent-contrast shadow-sm transition-colors hover:bg-accent-hover"
        >
          Open Chat
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
