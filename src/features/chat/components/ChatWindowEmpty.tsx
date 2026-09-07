import { User, Users, Zap, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

const points = [
  { icon: User, title: "Chat with anyone", desc: "Start a one-to-one conversation" },
  { icon: Users, title: "Create groups", desc: "Bring your team together" },
  { icon: Zap, title: "Stay productive", desc: "Share ideas, files and more" },
];

interface ChatWindowEmptyProps {
  onNewConversation: () => void;
  onCreateGroup: () => void;
}

export function ChatWindowEmpty({
  onNewConversation,
  onCreateGroup,
}: ChatWindowEmptyProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 py-10 text-center">
      <div className="flex size-28 items-center justify-center rounded-full bg-tint-coral/50">
        <Users className="size-12 text-accent" />
      </div>

      <h2 className="mt-6 text-2xl font-bold text-ink sm:text-3xl">
        Your conversations start here
      </h2>
      <p className="mt-2 max-w-sm text-sm text-ink-muted sm:text-base">
        Send a message, share ideas, and stay connected with your team or friends.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={onNewConversation}>
          <Plus className="size-4" />
          New conversation
        </Button>
        <Button variant="secondary" onClick={onCreateGroup}>
          <Users className="size-4" />
          Create group
        </Button>
      </div>

      <div className="mt-10 grid w-full max-w-lg grid-cols-1 gap-4 sm:grid-cols-3">
        {points.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex flex-col items-center gap-2">
            <span className="flex size-11 items-center justify-center rounded-xl bg-surface-muted text-ink-muted">
              <Icon className="size-5" />
            </span>
            <p className="text-sm font-semibold text-ink">{title}</p>
            <p className="text-xs text-ink-muted">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
