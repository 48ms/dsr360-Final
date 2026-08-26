import { getVisitDetail } from "@/actions/visits";
import { formatDate } from "@/lib/utils/format";
import { StatusBadge, PriorityBadge } from "@/components/customers/status-badge";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Play,
  FileText,
  CheckCircle2,
  Sparkles,
  Flame,
  Camera,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { VisitWhatsAppShareButton } from "@/components/visits/visit-whatsapp-share-button";

export const dynamic = "force-dynamic";

export default async function VisitDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const visitDetail = await getVisitDetail(id);

  if (!visitDetail || !visitDetail.visit) {
    notFound();
  }

  const { visit, customer, contacts, popsa, photos, opportunities, followUps } = visitDetail;
  const isPlanned = visit.visit_status === "PLANNED";
  const isInProgress = visit.visit_status === "IN_PROGRESS";
  const isCompleted = visit.visit_status === "COMPLETED";

  const primaryContactPhone = contacts?.find((c) => c.is_primary)?.phone ?? contacts?.[0]?.phone ?? null;
  const formattedContacts = (contacts || [])
    .filter((c) => Boolean(c.phone))
    .map((c) => ({
      name: c.name,
      phone: c.phone as string,
      role: c.position || c.contact_type,
    }));

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-5">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/visits"
            className="rounded-xl border border-neutral-200 bg-white p-2 text-neutral-600 hover:bg-neutral-50 transition"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-bold text-neutral-900">Detail Kunjungan</h1>
              <StatusBadge status={visit.visit_status} />
            </div>
            <p className="text-xs text-neutral-500">
              {formatDate(visit.visit_date)} &bull; {visit.visit_type}
            </p>
          </div>
        </div>

        {/* Primary CTA depending on status */}
        {isPlanned && (
          <Link
            href={`/visits/${visit.id}/start`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-amber-600 transition"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Mulai Visit</span>
          </Link>
        )}

        {isInProgress && (
          <Link
            href={`/visits/${visit.id}/log`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition animate-pulse"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Isi Log Visit</span>
          </Link>
        )}
      </div>

      {/* Customer Header Card */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              Customer
            </span>
            <Link
              href={`/customers/${customer?.id}`}
              className="text-base font-bold text-neutral-900 hover:text-amber-600 transition block"
            >
              {customer?.customer_name}
            </Link>
            <p className="text-xs text-neutral-500 mt-0.5">
              {customer?.customer_code} &bull; {customer?.segment} &bull; {customer?.city}
            </p>
          </div>
          {customer?.priority && <PriorityBadge priority={customer.priority} />}
        </div>

        {customer?.address && (
          <div className="flex items-center gap-1.5 text-xs text-neutral-600 pt-2 border-t border-neutral-100">
            <MapPin className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
            <span>{customer.address}, {customer.city}</span>
          </div>
        )}
      </div>

      {/* Execution Summary Card (If Completed) */}
      {isCompleted && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/30 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
            <div className="flex items-center gap-2 text-emerald-950 font-bold text-xs uppercase tracking-wider">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Ringkasan Hasil Visit</span>
            </div>
            <span className="text-xs font-semibold text-neutral-600 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {visit.duration_minutes ?? 30} menit
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="font-bold text-neutral-500 text-[11px] block">RESPON CUSTOMER:</span>
              <span className="inline-block mt-1 font-semibold text-neutral-900 bg-white px-2.5 py-1 rounded-md border border-neutral-200">
                {visit.customer_response ?? "Belum dicatat"}
              </span>
            </div>

            <div>
              <span className="font-bold text-neutral-500 text-[11px] block">CATATAN DISKUSI:</span>
              <p className="text-neutral-900 mt-1 bg-white p-3 rounded-xl border border-neutral-200 leading-relaxed">
                {visit.discussion || "Tidak ada catatan."}
              </p>
            </div>

            {visit.technical_issue && (
              <div>
                <span className="font-bold text-neutral-500 text-[11px] block">ISU TEKNIKAL MESIN:</span>
                <p className="text-neutral-800 mt-0.5">{visit.technical_issue}</p>
              </div>
            )}

            <div className="pt-2 border-t border-emerald-200/70">
              <VisitWhatsAppShareButton
                customerName={customer?.customer_name || "Customer"}
                customerId={visit.customer_id}
                defaultPhone={primaryContactPhone}
                contacts={formattedContacts}
                visitDate={formatDate(visit.visit_date)}
                visitDiscussion={visit.discussion}
                opportunityProduct={opportunities[0]?.opportunity_name}
                nextAction={followUps[0]?.description}
              />
            </div>
          </div>
        </div>
      )}

      {/* Next Action Follow-Up Created */}
      {followUps.length > 0 && (
        <div className="rounded-2xl border-2 border-amber-400 bg-amber-50/40 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-amber-200 text-amber-950 font-bold text-xs uppercase tracking-wider">
            <Flame className="h-4 w-4 text-amber-600" />
            <span>Follow-Up Terjadwal dari Visit Ini</span>
          </div>
          {followUps.map((f) => (
            <div key={f.id} className="rounded-xl bg-white p-3.5 border border-amber-200 text-xs space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-neutral-900">{f.activity_type}</span>
                <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                  Due: {formatDate(f.due_date)}
                </span>
              </div>
              <p className="text-neutral-700">{f.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Opportunity Found */}
      {opportunities.length > 0 && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 text-neutral-900 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span>Peluang Penjualan (Pipeline Deal)</span>
          </div>
          {opportunities.map((opp) => (
            <div key={opp.id} className="rounded-xl bg-neutral-50 p-3.5 border border-neutral-200 text-xs space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-neutral-900">{opp.opportunity_name}</span>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                  {opp.stage}
                </span>
              </div>
              {opp.potential_volume && (
                <p className="text-neutral-600">
                  Potensi Volume: <strong>{opp.potential_volume} Liter</strong>
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* POPSA Strategy Detail */}
      {popsa && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 text-neutral-900 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span>Strategi POPSA</span>
          </div>

          <div className="space-y-3 text-xs text-neutral-700">
            <div>
              <span className="font-bold text-neutral-900 block text-[11px]">PURPOSE:</span>
              <p>{popsa.purpose || "-"}</p>
            </div>
            <div>
              <span className="font-bold text-neutral-900 block text-[11px]">OBJECTIVE:</span>
              <p>{popsa.objective || "-"}</p>
            </div>
            <div>
              <span className="font-bold text-neutral-900 block text-[11px]">PREMISES:</span>
              <p>{popsa.premises || "-"}</p>
            </div>
            <div>
              <span className="font-bold text-neutral-900 block text-[11px]">STRATEGY:</span>
              <p>{popsa.strategy || "-"}</p>
            </div>
            <div>
              <span className="font-bold text-neutral-900 block text-[11px]">ANTICIPATE:</span>
              <p>{popsa.anticipate || "-"}</p>
            </div>
          </div>
        </div>
      )}

      {/* Photos Grid */}
      {photos.length > 0 && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
            <div className="flex items-center gap-2 text-neutral-900 font-bold text-xs uppercase tracking-wider">
              <Camera className="h-4 w-4 text-amber-600" />
              <span>Foto Bukti Lapangan ({photos.length})</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {photos.map((ph) => (
              <div
                key={ph.id}
                className="rounded-2xl border border-neutral-200 bg-neutral-50 overflow-hidden shadow-2xs group"
              >
                <div className="relative aspect-video w-full bg-neutral-900 overflow-hidden">
                  <img
                    src={ph.photo_url}
                    alt={ph.caption || ph.photo_type}
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="font-mono font-black text-[10px] uppercase text-white bg-neutral-950/80 backdrop-blur-xs px-2 py-0.5 rounded-md border border-white/20">
                      {ph.photo_type}
                    </span>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs font-semibold text-neutral-900 line-clamp-2">
                    {ph.caption || "Foto dokumentasi lapangan"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
