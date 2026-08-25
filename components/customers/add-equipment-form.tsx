"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { equipmentSchema, type EquipmentInput } from "@/lib/validations/customer-detail";
import { addEquipment } from "@/actions/customer-detail";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function AddEquipmentForm({ customerId, onDone }: { customerId: string; onDone: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EquipmentInput>({ resolver: zodResolver(equipmentSchema) });

  function onSubmit(data: EquipmentInput) {
    setError(null);
    startTransition(async () => {
      const result = await addEquipment(customerId, data);
      if (result?.error) setError(result.error);
      else onDone();
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 rounded-xl border border-neutral-200 p-3">
      <Input
        label="Tipe Equipment *"
        placeholder="Bus, Genset, Forklift, dll"
        error={errors.equipment_type?.message}
        {...register("equipment_type")}
      />
      <div className="grid grid-cols-2 gap-2">
        <Input label="Brand" placeholder="Mercedes-Benz" {...register("brand")} />
        <Input
          label="Jumlah Unit"
          type="number"
          error={errors.quantity?.message}
          {...register("quantity", { setValueAs: (v) => (v === "" ? undefined : Number(v)) })}
        />
      </div>
      <Input label="Aplikasi" placeholder="Passenger transport" {...register("application")} />
      <div className="grid grid-cols-2 gap-2">
        <Input label="Brand Oli Existing" placeholder="Pertamina" {...register("current_brand")} />
        <Input label="Viscosity" placeholder="15W-40" {...register("current_viscosity")} />
      </div>
      <Input label="Drain Interval" placeholder="10.000 km" {...register("drain_interval")} />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex gap-2">
        <Button type="button" variant="ghost" onClick={onDone} className="flex-1">Batal</Button>
        <Button type="submit" isLoading={isPending} className="flex-1">Simpan</Button>
      </div>
    </form>
  );
}
