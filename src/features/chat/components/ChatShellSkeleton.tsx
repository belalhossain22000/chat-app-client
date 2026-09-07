import { ConversationListSkeleton } from "./ConversationListSkeleton";
import { ChatHeaderSkeleton } from "./ChatHeaderSkeleton";
import { MessageListSkeleton } from "./MessageListSkeleton";
import { Skeleton } from "@/components/ui/Skeleton";

export function ChatShellSkeleton() {
  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background">
      <aside className="flex w-full shrink-0 flex-col border-r border-line bg-surface md:w-80 lg:w-96">
        <div className="flex flex-col gap-3 border-b border-line px-4 pb-3 pt-4">
          <Skeleton className="h-12 w-40" />
          <div className="flex gap-2">
            <Skeleton rounded="lg" className="h-9 flex-1" />
            <Skeleton rounded="lg" className="h-9 w-28" />
          </div>
          <Skeleton rounded="lg" className="h-11 w-full" />
        </div>
        <div className="flex gap-2 px-4 py-3">
          <Skeleton rounded="full" className="h-8 w-14" />
          <Skeleton rounded="full" className="h-8 w-16" />
          <Skeleton rounded="full" className="h-8 w-16" />
        </div>
        <div className="min-h-0 flex-1 overflow-hidden">
          <ConversationListSkeleton />
        </div>
        <div className="flex items-center gap-2 border-t border-line px-3 py-2.5">
          <Skeleton rounded="full" className="size-10" />
          <div className="flex flex-1 flex-col gap-1.5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-2.5 w-16" />
          </div>
        </div>
      </aside>

      <section className="hidden min-w-0 flex-1 flex-col md:flex">
        <ChatHeaderSkeleton />
        <div className="min-h-0 flex-1">
          <MessageListSkeleton />
        </div>
        <div className="border-t border-line p-4">
          <Skeleton rounded="lg" className="h-12 w-full" />
        </div>
      </section>
    </div>
  );
}
