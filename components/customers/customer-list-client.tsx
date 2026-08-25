"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Plus } from "lucide-react";
import { CustomerCard } from "@/components/customers/customer-card";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";
import type { Tables } from "@/types/database";
import type { Priority } from "@/constants/enums";

type CustomerListItem = Pick<
  Tables<"customers">,
  "id" | "customer_name" | "segment" | "city" | "status" | "priority" | "potential_monthly_volume"
>;

const PRIORITY_FILTERS: { label: string; value: Priority | "ALL" }[] = [
  { label: "Semua", value: "ALL" },
  { label: "A", value: "A" },
  { label: "B", value: "B" },
  { label: "C", value: "C" },
];

export function CustomerListClient({ customers }: { customers: CustomerListItem[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const activePriority = (searchParams.get("priority") as Priority | null) ?? "ALL";

  // Debounce search supaya ga fetch tiap ketikan huruf.
  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (search) params.set("search", search);
      else params.delete("search");
      startTransition(() => router.replace(`/customers?${params.toString()}`));
    }, 400);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  function setPriorityFilter(value: Priority | "ALL") {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "ALL") params.delete("priority");
    else params.set("priority", value);
    startTransition(() => router.replace(`/customers?${params.toString()}`));
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-medium text-neutral-900">Customers</h1>
        <Link
          href="/customers/new"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-white"
        >
          <Plus size={18} />
        </Link>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari customer..."
          className="w-full rounded-xl border border-neutral-300 py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <div className="flex gap-2">
        {PRIORITY_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setPriorityFilter(f.value)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium",
              activePriority === f.value
                ? "bg-neutral-900 text-white"
                : "bg-neutral-100 text-neutral-600"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className={cn("flex flex-col gap-2.5", isPending && "opacity-50")}>
        {customers.length === 0 ? (
          <p className="py-10 text-center text-sm text-neutral-400">
            Belum ada customer yang cocok. Coba ubah pencarian atau filter.
          </p>
        ) : (
          customers.map((c) => <CustomerCard key={c.id} customer={c} />)
        )}
      </div>
    </div>
  );
}
