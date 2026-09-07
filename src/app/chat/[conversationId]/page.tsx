import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat",
};

// UI is rendered by chat/layout.tsx (ChatScreen reads the id from the route).
export default function ConversationPage() {
  return null;
}
