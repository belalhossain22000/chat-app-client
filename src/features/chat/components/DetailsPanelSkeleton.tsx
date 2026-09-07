import { Skeleton } from "@/components/ui/Skeleton";

function MemberRow() {
  return (
    <div className="flex items-center gap-3 py-2">
      <Skeleton rounded="full" className="size-9" />
      <div className="flex flex-1 flex-col gap-1.5">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-2.5 w-16" />
      </div>
      <Skeleton className="h-2.5 w-10" />
    </div>
  );
}

export function DetailsPanelSkeleton() {
  return (
    <div className="flex h-full flex-col gap-6 p-5">
      <div className="flex flex-col items-center gap-3">
        <Skeleton rounded="full" className="size-20" />
        <Skeleton className="h-4 w-32" />
        <div className="flex w-full flex-col items-center gap-2">
          <Skeleton className="h-3 w-4/5" />
          <Skeleton className="h-3 w-3/5" />
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-line p-3">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-44" />
        <Skeleton className="h-4 w-36" />
      </div>

      <div className="flex flex-col gap-1">
        <Skeleton className="mb-2 h-3 w-24" />
        {Array.from({ length: 6 }, (_, i) => (
          <MemberRow key={i} />
        ))}
      </div>
    </div>
  );
}
