import { Skeleton } from "@/components/ui/Skeleton";

function IncomingRow({ lines = 2 }: { lines?: number }) {
  return (
    <div className="flex items-end gap-2">
      <Skeleton rounded="full" className="size-9" />
      <div className="flex flex-col gap-1.5 rounded-2xl rounded-bl-md bg-surface-muted px-4 py-3">
        <Skeleton className="h-3 w-48" />
        {lines > 1 && <Skeleton className="h-3 w-32" />}
      </div>
    </div>
  );
}

function OutgoingRow({ lines = 2 }: { lines?: number }) {
  return (
    <div className="flex justify-end">
      <div className="flex flex-col items-end gap-1.5 rounded-2xl rounded-br-md bg-surface-muted px-4 py-3">
        <Skeleton className="h-3 w-52" />
        {lines > 1 && <Skeleton className="h-3 w-40" />}
      </div>
    </div>
  );
}

export function MessageListSkeleton() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex justify-center py-4">
        <Skeleton rounded="full" className="h-7 w-40" />
      </div>

      <div className="flex flex-1 flex-col gap-5 px-4 py-2 sm:px-8">
        <IncomingRow />
        <OutgoingRow lines={1} />
        <IncomingRow lines={1} />
        <OutgoingRow />
        <IncomingRow lines={1} />
        <OutgoingRow lines={1} />
        <IncomingRow />
      </div>
    </div>
  );
}
