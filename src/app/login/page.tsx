import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log in",
};

export default function LoginPage() {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="hidden bg-surface-muted lg:block" />
      <div className="flex items-center justify-center p-8 text-ink-muted">
        LoginForm
      </div>
    </div>
  );
}
