import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getCustomerDetail } from "@/actions/customers";
import { StatusBadge, PriorityBadge } from "@/components/customers/status-badge";
import { CustomerDetailTabs } from "@/components/customers/customer-detail-tabs";
import { CustomerHeaderActions } from "@/components/customers/customer-header-actions";
import { formatVolume } from "@/lib/utils/format";

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getCustomerDetail(id);

  if (!result) notFound();
  const { customer, contacts, equipment, products, recentVisits } = result;

  return (
    <div>
      <div className="border-b border-neutral-200 p-4">
        <Link href="/customers" className="flex items-center gap-1 text-sm text-neutral-500">
          <ChevronLeft size={16} /> Customers
        </Link>

        <div className="mt-2 flex items-start justify-between">
          <div>
            <h1 className="text-lg font-medium text-neutral-900">{customer.customer_name}</h1>
            <p className="text-xs text-neutral-400">{customer.customer_code}</p>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap gap-2">
          <StatusBadge status={customer.status} />
          <PriorityBadge priority={customer.priority} />
        </div>

        <p className="mt-2 text-sm text-neutral-600">
          {customer.segment}
          {customer.industry ? ` · ${customer.industry}` : ""}
          {customer.city ? ` · ${customer.city}` : ""}
        </p>

        <p className="mt-1 text-sm text-neutral-500">
          Potensi:{" "}
          {customer.potential_monthly_volume
            ? `${formatVolume(customer.potential_monthly_volume)}/bulan`
            : "belum diisi"}
        </p>

        <CustomerHeaderActions customerId={customer.id} />
      </div>

      <CustomerDetailTabs
        customerId={customer.id}
        contacts={contacts}
        equipment={equipment}
        products={products}
        recentVisits={recentVisits}
      />
    </div>
  );
}
