import type { Metadata } from "next";
import { ChatScreen } from "@/features/chat/components/ChatScreen";

export const metadata: Metadata = {
  title: "Chat",
};

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = await params;
  return <ChatScreen conversationId={conversationId} />;
}
