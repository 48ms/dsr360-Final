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
      className="block rounded-xl border border-neutral-200 bg-white p-4 active:bg-neutral-50"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-medium text-neutral-900">{customer.customer_name}</p>
          <p className="mt-0.5 text-xs text-neutral-500">
            {customer.segment}
            {customer.city ? ` · ${customer.city}` : ""}
          </p>
        </div>
        <PriorityBadge priority={customer.priority} />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-neutral-500">
          {customer.potential_monthly_volume
            ? `Potensi ${formatVolume(customer.potential_monthly_volume)}/bulan`
            : "Potensi belum diisi"}
        </p>
        <StatusBadge status={customer.status} />
      </div>
    </Link>
  );
}
