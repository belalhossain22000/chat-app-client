import { AuthGate } from "@/features/auth/components/AuthGate";
import { SocketProvider } from "@/features/chat/components/SocketProvider";
import { AppShell } from "@/components/layout/AppShell";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate>
      <SocketProvider>
        <AppShell>{children}</AppShell>
      </SocketProvider>
    </AuthGate>
  );
}
