import { AuthGate } from "@/features/auth/components/AuthGate";
import { SocketProvider } from "@/features/chat/components/SocketProvider";
import { AppShell } from "@/components/layout/AppShell";
import { ChatScreen } from "@/features/chat/components/ChatScreen";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  // `children` is the route page (empty). ChatScreen lives here so navigating
  // between /chat and /chat/[id] doesn't remount the whole screen.
  return (
    <AuthGate>
      <SocketProvider>
        <AppShell>
          <ChatScreen />
        </AppShell>
        {children}
      </SocketProvider>
    </AuthGate>
  );
}
