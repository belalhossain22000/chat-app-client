import {
  isToday,
  isYesterday,
  isThisWeek,
  isThisYear,
  format,
} from "date-fns";

// Compact timestamp for conversation rows (WhatsApp-style).
export function formatlistTime(iso: string): string {
  const date = new Date(iso);
  if (isToday(date)) return format(date, "h:mm a");
  if (isYesterday(date)) return "Yesterday";
  if (isThisWeek(date)) return format(date, "EEE");
  if (isThisYear(date)) return format(date, "MMM d");
  return format(date, "MMM d, yyyy");
}

// Day separator label inside the message list.
export function formatDayLabel(iso: string): string {
  const date = new Date(iso);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  if (isThisYear(date)) return format(date, "EEEE, MMM d");
  return format(date, "MMM d, yyyy");
}

// Time under a message bubble.
export function formatMessageTime(iso: string): string {
  return format(new Date(iso), "h:mm a");
}
