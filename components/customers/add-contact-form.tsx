"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactInput } from "@/lib/validations/customer-detail";
import { addContact } from "@/actions/customer-detail";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CONTACT_TYPES, INFLUENCE_LEVELS, DECISION_POWERS } from "@/constants/enums";

export function AddContactForm({ customerId, onDone }: { customerId: string; onDone: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      contact_type: "OTHER",
      influence_level: "MEDIUM",
      decision_power: "NONE",
      is_primary: false,
    },
  });

  function onSubmit(data: ContactInput) {
    setError(null);
    startTransition(async () => {
      const result = await addContact(customerId, data);
      if (result?.error) setError(result.error);
      else onDone();
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 rounded-xl border border-neutral-200 p-3">
      <Input label="Nama *" error={errors.name?.message} {...register("name")} />
      <div className="grid grid-cols-2 gap-2">
        <Input label="Jabatan" {...register("position")} />
        <Input label="Telepon" {...register("phone")} />
      </div>
      <Select label="Tipe Kontak" {...register("contact_type")}>
        {CONTACT_TYPES.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </Select>
      <div className="grid grid-cols-2 gap-2">
        <Select label="Pengaruh" {...register("influence_level")}>
          {INFLUENCE_LEVELS.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </Select>
        <Select label="Peran Keputusan" {...register("decision_power")}>
          {DECISION_POWERS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </Select>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex gap-2">
        <Button type="button" variant="ghost" onClick={onDone} className="flex-1">Batal</Button>
        <Button type="submit" isLoading={isPending} className="flex-1">Simpan</Button>
      </div>
    </form>
  );
}
