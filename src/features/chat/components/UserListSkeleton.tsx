import { Skeleton } from "@/components/ui/Skeleton";

function Row() {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5">
      <Skeleton rounded="full" className="size-10" />
      <div className="flex flex-1 flex-col gap-1.5">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-2.5 w-1/2" />
      </div>
      <Skeleton rounded="full" className="size-5" />
    </div>
  );
}

export function UserListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="flex flex-col">
      {Array.from({ length: rows }, (_, i) => (
        <Row key={i} />
      ))}
    </div>
  );
}
