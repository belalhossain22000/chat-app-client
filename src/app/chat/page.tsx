import type { Metadata } from "next";
import { ChatScreen } from "@/features/chat/components/ChatScreen";

export const metadata: Metadata = {
  title: "Chat",
};

export default function ChatPage() {
  return <ChatScreen />;
}
