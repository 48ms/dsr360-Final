"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDate, getTodayWIB } from "@/lib/utils/format";
import type { FollowUpItem } from "@/actions/follow-ups";
import { CompleteTaskModal } from "@/components/follow-ups/complete-task-modal";
import {
  Phone,
  MessageCircle,
  Mail,
  Calendar,
  Send,
  FlaskConical,
  Wrench,
  CheckCircle2,
  Flame,
  Clock,
  AlertCircle,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const ACTIVITY_ICONS: Record<string, LucideIcon> = {
  CALL: Phone,
  WHATSAPP: MessageCircle,
  EMAIL: Mail,
  VISIT: Calendar,
  SEND_QUOTATION: Send,
  SEND_SAMPLE: FlaskConical,
  TRIAL_FOLLOWUP: FlaskConical,
  TECHNICAL_FOLLOWUP: Wrench,
  COLLECTION: AlertCircle,
  OTHER: Clock,
};

export function FollowUpCard({
  item,
  onCompleted,
}: {
  item: FollowUpItem;
  onCompleted: () => void;
}) {
  const [showModal, setShowModal] = useState(false);

  const isCompleted = item.status === "COMPLETED";
  const todayStr = getTodayWIB();
  const isOverdue = !isCompleted && item.due_date < todayStr;
  const isToday = !isCompleted && item.due_date === todayStr;

  const IconComponent = ACTIVITY_ICONS[item.activity_type] || Clock;

  // Format clean phone for WA
  const cleanPhone = item.customer?.primary_phone?.replace(/[^0-9]/g, "");
  const waUrl = cleanPhone
    ? `https://wa.me/${cleanPhone.startsWith("0") ? "62" + cleanPhone.slice(1) : cleanPhone}`
    : null;

  return (
    <>
      <div
        className={cn(
          "rounded-2xl border bg-white p-4 shadow-xs transition-all duration-200 hover:shadow-md space-y-3",
          isOverdue
            ? "border-red-300 bg-red-50/15 hover:border-red-400"
            : isCompleted
            ? "border-neutral-200 bg-neutral-50/50 opacity-80"
            : "border-neutral-200 hover:border-neutral-300"
        )}
      >
        {/* Top Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold uppercase",
                item.activity_type === "WHATSAPP"
                  ? "bg-emerald-100 text-emerald-800"
                  : item.activity_type === "CALL"
                  ? "bg-blue-100 text-blue-800"
                  : item.activity_type === "SEND_QUOTATION"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-neutral-100 text-neutral-800"
              )}
            >
              <IconComponent className="h-3 w-3" />
              {item.activity_type}
            </span>

            {isOverdue && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-extrabold text-red-700 border border-red-200">
                <Flame className="h-3 w-3" />
                OVERDUE ({formatDate(item.due_date)})
              </span>
            )}

            {isToday && (
              <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-extrabold text-amber-800">
                HARI INI
              </span>
            )}

            {isCompleted && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                <CheckCircle2 className="h-3 w-3" />
                Selesai
              </span>
            )}
          </div>

          <span className="text-[11px] font-medium text-neutral-500">
            {formatDate(item.due_date)}
          </span>
        </div>

        {/* Customer & Task Description */}
        <div>
          <Link
            href={`/customers/${item.customer?.id}`}
            className="text-sm font-bold text-neutral-900 hover:text-amber-600 line-clamp-1"
          >
            {item.customer?.customer_name ?? "Customer"}
          </Link>
          <p className="text-xs text-neutral-700 mt-1 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Primary Contact with Quick Call / WA buttons */}
        {item.customer?.primary_pic && (
          <div className="flex items-center justify-between rounded-xl bg-neutral-50 p-2.5 text-xs border border-neutral-100">
            <span className="text-neutral-600 truncate">
              👤 PIC: <strong>{item.customer.primary_pic}</strong>
            </span>

            <div className="flex items-center gap-1.5 shrink-0">
              {waUrl && (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Kirim pesan WhatsApp ke ${item.customer.primary_pic || "PIC"}`}
                  className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-2xs hover:bg-emerald-700 transition focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none"
                >
                  <MessageCircle className="h-3 w-3" aria-hidden="true" />
                  WA
                </a>
              )}
              {item.customer.primary_phone && (
                <a
                  href={`tel:${item.customer.primary_phone}`}
                  aria-label={`Telepon nomor ${item.customer.primary_phone}`}
                  className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-2xs hover:bg-blue-700 transition focus-visible:ring-2 focus-visible:ring-blue-500 outline-none"
                >
                  <Phone className="h-3 w-3" aria-hidden="true" />
                  Call
                </a>
              )}
            </div>
          </div>
        )}

        {/* Completed Result Box */}
        {isCompleted && item.result && (
          <div className="rounded-xl bg-emerald-50/50 p-2.5 text-xs border border-emerald-100 text-emerald-950">
            <span className="font-bold text-[11px] block">Hasil Tindak Lanjut:</span>
            <p className="mt-0.5 text-neutral-700 italic">&ldquo;{item.result}&rdquo;</p>
          </div>
        )}

        {/* Action Button */}
        {!isCompleted && (
          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-neutral-800 transition cursor-pointer"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Tandai Selesai</span>
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <CompleteTaskModal
          followUpId={item.id}
          customerName={item.customer?.customer_name ?? "Customer"}
          taskDescription={item.description ?? "Tindak lanjut"}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            onCompleted();
          }}
        />
      )}
    </>
  );
}
