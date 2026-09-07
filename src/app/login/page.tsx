import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { Shield, Heart, Users, ArrowLeft } from "lucide-react";
import { LoginForm } from "@/features/auth/components/LoginForm";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to ChatFlow with your phone number.",
};

const trustPoints = [
  { icon: Shield, label: "Secure", wrap: "bg-tint-mint text-success-ink" },
  { icon: Heart, label: "Simple", wrap: "bg-tint-coral text-accent" },
  { icon: Users, label: "For everyone", wrap: "bg-tint-amber text-tint-amber-ink" },
];

export default function LoginPage() {
  return (
    <div className="relative min-h-dvh lg:grid lg:grid-cols-2">
      <Link
        href="/"
        aria-label="ChatFlow home"
        className="absolute left-6 top-6 z-10 sm:left-10 sm:top-8"
      >
        <Image
          src="/logo.png"
          alt="ChatFlow"
          width={180}
          height={60}
          priority
          className="h-auto w-[150px] sm:w-[168px]"
        />
      </Link>

      <div className="relative hidden lg:block">
        <Image
          src="/login-side-image.png"
          alt="People connecting on ChatFlow"
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-col justify-center px-6 py-24 sm:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <div className="flex justify-end">
            <span className="text-sm text-ink-muted">New here?</span>
          </div>

          <h1 className="mt-2 text-4xl font-bold leading-[1.1] tracking-tight text-ink sm:text-5xl">
            Welcome to <span className="text-accent">ChatFlow</span>
          </h1>
          <p className="mt-4 text-base text-ink-muted">
            Start a conversation and be part of a more connected world.
          </p>

          <div className="mt-8">
            <Suspense fallback={null}>
              <LoginForm />
            </Suspense>
            <div className="mt-4 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
              >
                <ArrowLeft className="size-4" />
                Back to home
              </Link>
            </div>
          </div>

          <div className="mt-10">
            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-line" />
              <span className="text-xs text-ink-muted">A better way to chat</span>
              <span className="h-px flex-1 bg-line" />
            </div>
            <ul className="mt-5 flex justify-center gap-10">
              {trustPoints.map(({ icon: Icon, label, wrap }) => (
                <li key={label} className="flex flex-col items-center gap-2">
                  <span
                    className={`flex size-10 items-center justify-center rounded-full ${wrap}`}
                  >
                    <Icon className="size-4" />
                  </span>
                  <span className="text-xs text-ink-muted">{label}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-10 text-center text-xs text-ink-muted">
            © 2026 ChatFlow. Conversations for a better tomorrow.
          </p>
        </div>
      </div>
    </div>
  );
}
