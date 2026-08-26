import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-6 pb-24">
      {/* Header Skeleton */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48 rounded-xl" />
          <Skeleton className="h-4 w-36 rounded-lg" />
        </div>
        <Skeleton className="h-9 w-9 rounded-xl" />
      </div>

      {/* Today Counters */}
      <div className="space-y-2">
        <Skeleton className="h-3.5 w-28 rounded-md" />
        <div className="grid grid-cols-3 gap-2.5">
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
        </div>
      </div>

      {/* Priority Card Skeleton */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
          <Skeleton className="h-4 w-32 rounded-md" />
          <Skeleton className="h-3 w-16 rounded-md" />
        </div>
        <div className="space-y-3 pt-1">
          <Skeleton className="h-12 rounded-xl" />
          <Skeleton className="h-12 rounded-xl" />
        </div>
      </div>

      {/* Pipeline Dark Card Skeleton */}
      <div className="rounded-2xl bg-neutral-900 p-5 space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-28 rounded-md bg-neutral-700" />
          <Skeleton className="h-4 w-20 rounded-md bg-neutral-700" />
        </div>
        <Skeleton className="h-9 w-44 rounded-xl bg-neutral-700" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-neutral-800">
          <Skeleton className="h-12 rounded-xl bg-neutral-800" />
          <Skeleton className="h-12 rounded-xl bg-neutral-800" />
          <Skeleton className="h-12 rounded-xl bg-neutral-800" />
          <Skeleton className="h-12 rounded-xl bg-neutral-800" />
        </div>
      </div>

      {/* KPI Skeleton */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 space-y-3">
        <Skeleton className="h-3.5 w-32 rounded-md" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
