"use client";

import { useState } from "react";
import { Phone, Plus } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatVolume, formatDate } from "@/lib/utils/format";
import { AddContactForm } from "@/components/customers/add-contact-form";
import { AddEquipmentForm } from "@/components/customers/add-equipment-form";
import { AddProductForm } from "@/components/customers/add-product-form";
import { CustomerBranchesTab } from "@/components/customers/customer-branches-tab";
import type { CustomerBranch } from "@/lib/utils/branches";
import type { Tables } from "@/types/database";

type Props = {
  customerId: string;
  customerName: string;
  initialBranches: CustomerBranch[];
  contacts: Tables<"customer_contacts">[];
  equipment: Tables<"customer_equipment">[];
  products: Tables<"customer_products">[];
  recentVisits: Pick<Tables<"visits">, "id" | "visit_date" | "visit_type" | "purpose" | "visit_status">[];
};

const TABS = ["Contacts", "Cabang & Pabrik", "Equipment", "Products", "Riwayat Visit"] as const;
type Tab = (typeof TABS)[number];

export function CustomerDetailTabs({
  customerId,
  customerName,
  initialBranches,
  contacts,
  equipment,
  products,
  recentVisits,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("Contacts");
  const [showAddForm, setShowAddForm] = useState(false);

  function switchTab(tab: Tab) {
    setActiveTab(tab);
    setShowAddForm(false);
  }

  return (
    <div className="mt-4">
      <div className="flex border-b border-neutral-200 bg-neutral-50/50 rounded-xl p-1 gap-1 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => switchTab(tab)}
            className={cn(
              "flex-1 min-h-[44px] py-2.5 px-3 text-xs font-semibold rounded-lg transition-all duration-150 active:scale-95 cursor-pointer whitespace-nowrap",
              activeTab === tab
                ? "bg-white text-amber-700 shadow-xs border border-amber-200/60 font-bold"
                : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100/60"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-4">
        {activeTab === "Cabang & Pabrik" && (
          <CustomerBranchesTab
            customerId={customerId}
            customerName={customerName}
            initialBranches={initialBranches}
          />
        )}
        {activeTab === "Contacts" && (
          <div className="flex flex-col gap-3">
            {contacts.length === 0 && !showAddForm && (
              <p className="py-6 text-center text-sm text-neutral-400">Belum ada PIC tercatat.</p>
            )}
            {contacts.map((c) => (
              <div key={c.id} className="rounded-xl border border-neutral-200 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-neutral-900">
                    {c.name} {c.is_primary && <span className="text-amber-600">★</span>}
                  </p>
                  <span className="text-xs text-neutral-400">{c.contact_type}</span>
                </div>
                <p className="text-xs text-neutral-500">{c.position}</p>
                {c.phone && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-neutral-600">
                    <Phone size={12} /> {c.phone}
                  </p>
                )}
              </div>
            ))}
            {showAddForm ? (
              <AddContactForm customerId={customerId} onDone={() => setShowAddForm(false)} />
            ) : (
              <AddButton label="Tambah PIC" onClick={() => setShowAddForm(true)} />
            )}
          </div>
        )}

        {activeTab === "Equipment" && (
          <div className="flex flex-col gap-3">
            {equipment.length === 0 && !showAddForm && (
              <p className="py-6 text-center text-sm text-neutral-400">Belum ada equipment tercatat.</p>
            )}
            {equipment.map((e) => (
              <div key={e.id} className="rounded-xl border border-neutral-200 p-3">
                <p className="text-sm font-medium text-neutral-900">
                  {e.equipment_type} {e.brand ? `- ${e.brand}` : ""} {e.quantity ? `(${e.quantity} unit)` : ""}
                </p>
                <p className="mt-0.5 text-xs text-neutral-500">
                  {e.current_brand ? `Existing: ${e.current_brand}` : ""}
                  {e.current_viscosity ? ` · ${e.current_viscosity}` : ""}
                </p>
                {e.drain_interval && (
                  <p className="text-xs text-neutral-400">Drain interval: {e.drain_interval}</p>
                )}
              </div>
            ))}
            {showAddForm ? (
              <AddEquipmentForm customerId={customerId} onDone={() => setShowAddForm(false)} />
            ) : (
              <AddButton label="Tambah Equipment" onClick={() => setShowAddForm(true)} />
            )}
          </div>
        )}

        {activeTab === "Products" && (
          <div className="flex flex-col gap-3">
            {products.length === 0 && !showAddForm && (
              <p className="py-6 text-center text-sm text-neutral-400">Belum ada produk tercatat.</p>
            )}
            {products.map((p) => (
              <div key={p.id} className="rounded-xl border border-neutral-200 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-neutral-900">
                    {p.brand} {p.product_name}
                  </p>
                  <span className="text-xs text-neutral-400">{p.status}</span>
                </div>
                <p className="text-xs text-neutral-500">
                  {p.viscosity ? `${p.viscosity} · ` : ""}
                  {p.monthly_volume ? `~${formatVolume(p.monthly_volume)}/bulan` : ""}
                </p>
              </div>
            ))}
            {showAddForm ? (
              <AddProductForm customerId={customerId} onDone={() => setShowAddForm(false)} />
            ) : (
              <AddButton label="Tambah Produk" onClick={() => setShowAddForm(true)} />
            )}
          </div>
        )}

        {activeTab === "Riwayat Visit" && (
          <div className="flex flex-col gap-2">
            {recentVisits.length === 0 ? (
              <p className="py-6 text-center text-sm text-neutral-400">Belum ada riwayat visit.</p>
            ) : (
              recentVisits.map((v) => (
                <div key={v.id} className="rounded-xl border border-neutral-200 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-neutral-900">{formatDate(v.visit_date)}</p>
                    <span className="text-xs text-neutral-400">{v.visit_status}</span>
                  </div>
                  <p className="text-xs text-neutral-500">
                    {v.visit_type} {v.purpose ? `· ${v.purpose}` : ""}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-dashed border-neutral-300 py-2.5 px-4 text-sm font-semibold text-neutral-700 hover:border-neutral-400 hover:text-neutral-900 hover:bg-neutral-100/70 active:scale-[0.98] transition-all cursor-pointer"
    >
      <Plus size={16} /> {label}
    </button>
  );
}
