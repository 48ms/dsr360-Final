import { Skeleton } from "@/components/ui/skeleton";

export default function FollowUpsLoading() {
  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-5 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1.5">
          <Skeleton className="h-6 w-40 rounded-xl" />
          <Skeleton className="h-3.5 w-48 rounded-md" />
        </div>
        <Skeleton className="h-8 w-28 rounded-xl" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        <Skeleton className="h-7 w-20 rounded-xl shrink-0" />
        <Skeleton className="h-7 w-24 rounded-xl shrink-0" />
        <Skeleton className="h-7 w-20 rounded-xl shrink-0" />
        <Skeleton className="h-7 w-24 rounded-xl shrink-0" />
      </div>

      {/* Search */}
      <Skeleton className="h-10 w-full rounded-xl" />

      {/* Task Cards */}
      <div className="space-y-3 pt-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border border-neutral-200 bg-white p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-24 rounded-md" />
              <Skeleton className="h-4 w-20 rounded-md" />
            </div>
            <Skeleton className="h-4 w-52 rounded-md" />
            <Skeleton className="h-3.5 w-36 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}
