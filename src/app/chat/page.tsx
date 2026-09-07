import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat",
};

export default function ChatPage() {
  return <div className="flex flex-1 items-center justify-center text-ink-muted">ChatWindow</div>;
}
