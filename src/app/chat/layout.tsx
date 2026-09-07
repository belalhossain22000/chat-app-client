import { AuthGate } from "@/features/auth/components/AuthGate";
import { AppShell } from "@/components/layout/AppShell";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate>
      <AppShell>{children}</AppShell>
    </AuthGate>
  );
}
