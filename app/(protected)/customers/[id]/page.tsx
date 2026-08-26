import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getCustomerDetail } from "@/actions/customers";
import { StatusBadge, PriorityBadge } from "@/components/customers/status-badge";
import { CustomerDetailTabs } from "@/components/customers/customer-detail-tabs";
import { CustomerHeaderActions } from "@/components/customers/customer-header-actions";
import { CustomerPrintButton } from "@/components/customers/customer-print-button";
import { formatVolume } from "@/lib/utils/format";

import { CustomerLocationCard } from "@/components/customers/customer-location-card";

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getCustomerDetail(id);

  if (!result) notFound();
  const { customer, contacts, equipment, products, recentVisits } = result;

  return (
    <div className="max-w-3xl mx-auto pb-24">
      {/* Print-Only Executive Header */}
      <div className="hidden print:block p-6 border-b border-neutral-300">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-black text-neutral-900 tracking-tight">
              PT HARAPAN UTAMA MOTOR
            </h1>
            <p className="text-xs text-neutral-600">
              Distributor Resmi Shell Lubricants &bull; Profil Akun Pelanggan B2B
            </p>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold text-neutral-800">DSR360 CRM</span>
            <p className="text-[10px] text-neutral-500">
              Dicetak: {new Date().toLocaleDateString("id-ID", { dateStyle: "long" })}
            </p>
          </div>
        </div>
      </div>

      <div className="border-b border-neutral-200 p-4 sm:p-6 bg-white">
        <div className="flex items-center justify-between no-print">
          <Link href="/customers" className="flex items-center gap-1 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition">
            <ChevronLeft size={16} /> Kembali ke Customers
          </Link>
          <CustomerPrintButton />
        </div>

        <div className="mt-3 flex items-start justify-between">
          <div>
            <h1 className="text-xl font-black text-neutral-900 tracking-tight">{customer.customer_name}</h1>
            <p className="text-xs font-semibold text-neutral-400 mt-0.5">{customer.customer_code}</p>
          </div>
        </div>

        <div className="mt-2.5 flex flex-wrap gap-2">
          <StatusBadge status={customer.status} />
          <PriorityBadge priority={customer.priority} />
        </div>

        <p className="mt-2 text-xs font-medium text-neutral-600">
          {customer.segment}
          {customer.industry ? ` · ${customer.industry}` : ""}
          {customer.city ? ` · ${customer.city}` : ""}
        </p>

        <p className="mt-1.5 text-xs text-neutral-700">
          Potensi:{" "}
          <strong className="text-neutral-900">
            {customer.potential_monthly_volume
              ? `${formatVolume(customer.potential_monthly_volume)}/bulan`
              : "belum diisi"}
          </strong>
        </p>

        {/* 📍 Interactive Customer Location & Maps Pin Card */}
        <CustomerLocationCard
          customerId={customer.id}
          customerName={customer.customer_name}
          city={customer.city}
          address={customer.address}
          latitude={customer.latitude}
          longitude={customer.longitude}
        />

        <CustomerHeaderActions
          customerId={customer.id}
          customerName={customer.customer_name}
          defaultPhone={contacts?.find((c) => c.is_primary)?.phone ?? contacts?.[0]?.phone ?? null}
          contacts={contacts}
        />
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
