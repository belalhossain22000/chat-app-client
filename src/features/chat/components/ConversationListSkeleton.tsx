import { Skeleton } from "@/components/ui/Skeleton";

function Row() {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Skeleton rounded="full" className="size-11" />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <Skeleton className="h-3 w-2/5" />
        <Skeleton className="h-3 w-3/4" />
      </div>
      <Skeleton className="h-2.5 w-8" />
    </div>
  );
}

export function ConversationListSkeleton({ rows = 9 }: { rows?: number }) {
  return (
    <div className="flex flex-col">
      {Array.from({ length: rows }, (_, i) => (
        <Row key={i} />
      ))}
    </div>
  );
}
