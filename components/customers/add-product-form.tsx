"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerProductSchema, type CustomerProductInput } from "@/lib/validations/customer-detail";
import { addCustomerProduct } from "@/actions/customer-detail";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PRODUCT_STATUSES } from "@/constants/enums";

export function AddProductForm({ customerId, onDone }: { customerId: string; onDone: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerProductInput>({
    resolver: zodResolver(customerProductSchema),
    defaultValues: { status: "CURRENT" },
  });

  function onSubmit(data: CustomerProductInput) {
    setError(null);
    startTransition(async () => {
      const result = await addCustomerProduct(customerId, data);
      if (result?.error) setError(result.error);
      else onDone();
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 rounded-xl border border-neutral-200 p-3">
      <div className="grid grid-cols-2 gap-2">
        <Input label="Brand *" error={errors.brand?.message} {...register("brand")} />
        <Input label="Nama Produk *" error={errors.product_name?.message} {...register("product_name")} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Input label="Viscosity" placeholder="15W-40" {...register("viscosity")} />
        <Input
          label="Volume/bulan (L)"
          type="number"
          step="any"
          error={errors.monthly_volume?.message}
          {...register("monthly_volume", { setValueAs: (v) => (v === "" ? undefined : Number(v)) })}
        />
      </div>
      <Select label="Status" {...register("status")}>
        {PRODUCT_STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </Select>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex gap-2">
        <Button type="button" variant="ghost" onClick={onDone} className="flex-1">Batal</Button>
        <Button type="submit" isLoading={isPending} className="flex-1">Simpan</Button>
      </div>
    </form>
  );
}
