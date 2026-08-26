import Link from "next/link";
import { formatDate } from "@/lib/utils/format";
import { StatusBadge, PriorityBadge } from "@/components/customers/status-badge";
import type { Priority, VisitStatus, VisitType } from "@/constants/enums";
import { ArrowRight, Clock, MapPin, Play, FileText, CheckCircle2 } from "lucide-react";

export type VisitCardItem = {
  id: string;
  visit_date: string;
  visit_type: VisitType;
  visit_status: VisitStatus;
  purpose: string | null;
  discussion: string | null;
  start_time: string | null;
  end_time: string | null;
  duration_minutes: number | null;
  opportunity_found: boolean;
  customer: {
    id: string;
    customer_name: string;
    customer_code: string;
    city: string | null;
    priority: Priority;
    segment: string;
  } | null;
  popsa?: {
    id: string;
    purpose: string | null;
    objective: string | null;
  } | null;
};

export function VisitCard({ visit }: { visit: VisitCardItem }) {
  const isPlanned = visit.visit_status === "PLANNED";
  const isInProgress = visit.visit_status === "IN_PROGRESS";
  const isCompleted = visit.visit_status === "COMPLETED";

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-xs transition-all duration-200 hover:border-neutral-300 hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
              {formatDate(visit.visit_date)}
            </span>
            <span className="text-neutral-300">&bull;</span>
            <span className="text-xs font-medium text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-sm">
              {visit.visit_type}
            </span>
            <StatusBadge status={visit.visit_status} />
          </div>

          <Link
            href={`/customers/${visit.customer?.id}`}
            className="font-semibold text-neutral-900 hover:text-amber-600 line-clamp-1 text-base"
          >
            {visit.customer?.customer_name ?? "Customer tidak diketahui"}
          </Link>

          <div className="mt-1 flex items-center gap-2 text-xs text-neutral-500">
            {visit.customer?.city && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-neutral-400" />
                {visit.customer.city}
              </span>
            )}
            {visit.customer?.priority && (
              <PriorityBadge priority={visit.customer.priority} />
            )}
          </div>
        </div>
      </div>

      {visit.purpose && (
        <p className="mt-2 text-xs text-neutral-600 line-clamp-2 bg-neutral-50 p-2 rounded-lg border border-neutral-100">
          <span className="font-medium text-neutral-800">Tujuan:</span> {visit.purpose}
        </p>
      )}

      {visit.popsa?.objective && isPlanned && (
        <p className="mt-1.5 text-xs text-amber-800 line-clamp-1 bg-amber-50/70 px-2 py-1 rounded-md border border-amber-100">
          🎯 <span className="font-medium">Target POPSA:</span> {visit.popsa.objective}
        </p>
      )}

      {isCompleted && visit.discussion && (
        <p className="mt-2 text-xs text-neutral-600 line-clamp-2 italic">
          &ldquo;{visit.discussion}&rdquo;
        </p>
      )}

      <div className="mt-3.5 flex items-center justify-between border-t border-neutral-100 pt-3 text-xs">
        <div className="flex items-center gap-1.5 text-neutral-500">
          {visit.duration_minutes ? (
            <>
              <Clock className="h-3.5 w-3.5 text-neutral-400" />
              <span>{visit.duration_minutes} menit</span>
            </>
          ) : (
            <span className="text-neutral-400">Belum dimulai</span>
          )}
          {visit.opportunity_found && (
            <span className="ml-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
              🔥 Ada Peluang
            </span>
          )}
        </div>

        <div>
          {isPlanned && (
            <Link
              href={`/visits/${visit.id}/start`}
              className="inline-flex items-center gap-1.5 min-h-[42px] rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-bold text-white shadow-2xs hover:bg-amber-600 active:scale-95 transition"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Mulai Visit</span>
            </Link>
          )}

          {isInProgress && (
            <Link
              href={`/visits/${visit.id}/log`}
              className="inline-flex items-center gap-1.5 min-h-[42px] rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-2xs hover:bg-emerald-700 active:scale-95 transition animate-pulse"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Isi Log Visit</span>
            </Link>
          )}

          {isCompleted && (
            <Link
              href={`/visits/${visit.id}`}
              className="inline-flex items-center gap-1.5 min-h-[42px] px-2.5 py-1 text-xs text-neutral-600 hover:text-neutral-900 font-bold"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>Lihat Detail</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
