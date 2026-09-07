import type { ChatMessage } from "@/features/chat/types/message.types";
import { formatDayLabel } from "./formatTime";

export interface DayGroup {
  label: string;
  key: string;
  messages: ChatMessage[];
}

// Group by calendar day, keeping order (oldest -> newest).
export function groupMessagesByDay(messages: ChatMessage[]): DayGroup[] {
  const groups: DayGroup[] = [];
  for (const m of messages) {
    const key = new Date(m.createdAt).toDateString();
    const last = groups[groups.length - 1];
    if (last && last.key === key) {
      last.messages.push(m);
    } else {
      groups.push({ key, label: formatDayLabel(m.createdAt), messages: [m] });
    }
  }
  return groups;
}

// Whether a message should show the sender avatar/name:
// true when it's the first in a run from that sender.
export function startsSenderRun(
  messages: ChatMessage[],
  index: number,
): boolean {
  if (index === 0) return true;
  return messages[index - 1].senderId !== messages[index].senderId;
}
