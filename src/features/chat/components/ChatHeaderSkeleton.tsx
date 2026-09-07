import { Skeleton } from "@/components/ui/Skeleton";

export function ChatHeaderSkeleton() {
  return (
    <div className="flex items-center gap-3 border-b border-line px-4 py-3 sm:px-6">
      <Skeleton rounded="full" className="size-10" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-2.5 w-20" />
      </div>
      <div className="ml-auto flex gap-2">
        <Skeleton rounded="lg" className="size-9" />
        <Skeleton rounded="lg" className="size-9" />
        <Skeleton rounded="lg" className="size-9" />
      </div>
    </div>
  );
}
