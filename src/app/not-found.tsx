import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Home } from "lucide-react";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col bg-background text-ink">
      <header className="flex items-center justify-between px-6 py-5 sm:px-10">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.webp" alt="ChatFlow" width={132} height={44} priority />
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
        >
          <Home className="size-4" />
          Back to Home
        </Link>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
        <div className="relative w-full max-w-2xl">
          <span className="pointer-events-none absolute -left-2 top-10 hidden max-w-[9rem] -rotate-6 font-mono text-xs leading-relaxed text-ink-muted lg:block">
            Looks like this page took a wrong turn!
          </span>
          <span className="pointer-events-none absolute -right-2 top-8 hidden max-w-[10rem] rotate-6 font-mono text-xs leading-relaxed text-ink-muted lg:block">
            But don&rsquo;t worry, there are still plenty of conversations to be had!
          </span>

          <Image
            src="/404.webp"
            alt="A confused panda sitting next to a large 404"
            width={880}
            height={440}
            priority
            className="mx-auto h-auto w-full max-w-xl"
          />
        </div>

        <h1 className="mt-6 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Oops! Page not found
        </h1>
        <p className="mt-3 max-w-md text-sm text-ink-muted sm:text-base">
          The page you&rsquo;re looking for doesn&rsquo;t exist or may have been moved.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-accent-contrast shadow-sm transition-colors hover:bg-accent-hover"
        >
          <Home className="size-4" />
          Go back home
        </Link>
      </div>
    </main>
  );
}
