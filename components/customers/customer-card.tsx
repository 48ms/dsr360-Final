import Link from "next/link";
import { StatusBadge, PriorityBadge } from "@/components/customers/status-badge";
import { formatVolume } from "@/lib/utils/format";
import type { Tables } from "@/types/database";

type CustomerCardData = Pick<
  Tables<"customers">,
  "id" | "customer_name" | "segment" | "city" | "status" | "priority" | "potential_monthly_volume"
>;

export function CustomerCard({ customer }: { customer: CustomerCardData }) {
  return (
    <Link
      href={`/customers/${customer.id}`}
      className="group block rounded-2xl border border-neutral-200 bg-white p-4 shadow-xs transition-all duration-200 hover:border-neutral-300 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99] active:bg-neutral-50 cursor-pointer"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-bold text-neutral-900 group-hover:text-amber-600 transition-colors">
            {customer.customer_name}
          </p>
          <p className="mt-0.5 text-xs text-neutral-500">
            {customer.segment}
            {customer.city ? ` · ${customer.city}` : ""}
          </p>
        </div>
        <PriorityBadge priority={customer.priority} />
      </div>

      <div className="mt-3 flex items-center justify-between pt-2 border-t border-neutral-100">
        <p className="text-xs font-medium text-neutral-600">
          {customer.potential_monthly_volume
            ? `Potensi ${formatVolume(customer.potential_monthly_volume)}/bulan`
            : "Potensi belum diisi"}
        </p>
        <StatusBadge status={customer.status} />
      </div>
    </Link>
  );
}
