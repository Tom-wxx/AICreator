import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="p-6 lg:p-8">
      {/* Hero skeleton */}
      <div className="mb-8">
        <Skeleton className="mb-3 h-8 w-48" />
        <Skeleton className="h-5 w-80" />
      </div>

      {/* Quick actions skeleton */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-4"
          >
            <Skeleton className="mb-3 size-10 rounded-lg" />
            <Skeleton className="mb-2 h-5 w-24" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>

      {/* Template grid skeleton */}
      <div className="mb-4 flex items-center gap-3">
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-8 w-64" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="mb-3 flex items-center gap-2">
              <Skeleton className="size-8 rounded-lg" />
              <Skeleton className="h-5 w-24" />
            </div>
            <Skeleton className="mb-2 h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}
