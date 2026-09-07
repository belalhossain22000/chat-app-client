import { AppShell } from "@/components/layout/AppShell";

// TODO: auth guard (redirect to /login when no token) + socket connect
export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
