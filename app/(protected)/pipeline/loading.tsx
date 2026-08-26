import { Skeleton } from "@/components/ui/skeleton";

export default function PipelineLoading() {
  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-5 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1.5">
          <Skeleton className="h-6 w-36 rounded-xl" />
          <Skeleton className="h-3.5 w-52 rounded-md" />
        </div>
        <Skeleton className="h-8 w-28 rounded-xl" />
      </div>

      {/* Hero Pipeline Value Bar */}
      <div className="rounded-2xl bg-neutral-900 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-36 rounded-md bg-neutral-700" />
          <Skeleton className="h-4 w-20 rounded-md bg-neutral-700" />
        </div>
        <Skeleton className="h-9 w-48 rounded-xl bg-neutral-700" />
        <Skeleton className="h-2 w-full rounded-full bg-neutral-800" />
      </div>

      {/* Search */}
      <Skeleton className="h-10 w-full rounded-xl" />

      {/* Opportunity Cards */}
      <div className="space-y-3 pt-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl border border-neutral-200 bg-white p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1.5">
                <Skeleton className="h-3.5 w-28 rounded-md" />
                <Skeleton className="h-4 w-44 rounded-md" />
              </div>
              <Skeleton className="h-6 w-24 rounded-xl" />
            </div>
            <Skeleton className="h-14 rounded-xl bg-neutral-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
