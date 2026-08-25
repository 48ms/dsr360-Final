"use client";

import { useState, useTransition, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { customerSchema, type CustomerInput } from "@/lib/validations/customer";
import { createCustomer, checkDuplicateCustomers } from "@/actions/customers";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SEGMENTS, PRIORITIES, CUSTOMER_STATUSES } from "@/constants/enums";

const DRAFT_KEY = "dsr360:draft:new-customer";

type DuplicateMatch = {
  id: string;
  customer_name: string;
  city: string | null;
  owner_name: string;
  similarity_score: number;
};

export function CustomerForm() {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [duplicates, setDuplicates] = useState<DuplicateMatch[]>([]);
  const [dismissedDuplicateWarning, setDismissedDuplicateWarning] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CustomerInput>({
    resolver: zodResolver(customerSchema),
    defaultValues: { priority: "C", status: "PROSPECT" },
  });

  const nameValue = watch("customer_name");
  const latitude = watch("latitude");
  const longitude = watch("longitude");

  // Local draft autosave — kesepakatan working principle Phase 5, tapi diterapkan
  // dari sekarang juga di form yang panjang ini biar data ga hilang kalau sinyal
  // putus atau tab browser ke-close ga sengaja pas ngisi form di lapangan.
  useEffect(() => {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) {
      try {
        reset(JSON.parse(saved));
      } catch {
        // draft korup, abaikan
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/incompatible-library -- react-hook-form's watch() diketahui tidak compatible dengan React Compiler memoization, ini aman.
    const subscription = watch((values) => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(values));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Debounce duplicate check biar ga nembak request tiap ketikan huruf.
  useEffect(() => {
    if (!nameValue || nameValue.trim().length < 3) {
      setDuplicates([]);
      return;
    }
    setDismissedDuplicateWarning(false);
    const timeout = setTimeout(async () => {
      const matches = await checkDuplicateCustomers(nameValue);
      setDuplicates(matches);
    }, 500);
    return () => clearTimeout(timeout);
  }, [nameValue]);

  const getCurrentLocation = useCallback(() => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setServerError("Browser tidak mendukung fitur GPS/geolokasi.");
      return;
    }
    setGeoLoading(true);
    setServerError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setValue("latitude", pos.coords.latitude, { shouldDirty: true });
        setValue("longitude", pos.coords.longitude, { shouldDirty: true });
        setGeoLoading(false);
      },
      (err) => {
        setGeoLoading(false);
        setServerError(
          err.code === 1
            ? "Izin lokasi ditolak. Silakan izinkan akses lokasi pada browser Anda."
            : "Gagal mengambil titik koordinat GPS. Pastikan GPS aktif."
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [setValue]);

  function onSubmit(data: CustomerInput) {
    setServerError(null);
    startTransition(async () => {
      const result = await createCustomer(data);
      if (result?.error) {
        setServerError(result.error);
      } else {
        localStorage.removeItem(DRAFT_KEY);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 p-4 pb-24">
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-neutral-500">Informasi Dasar</h2>

        <Input
          label="Nama Customer *"
          placeholder="PT Contoh Jaya"
          error={errors.customer_name?.message}
          {...register("customer_name")}
        />

        {duplicates.length > 0 && !dismissedDuplicateWarning && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
            <div className="flex gap-2">
              <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-600" />
              <div className="flex-1">
                <p className="text-xs font-medium text-amber-800">
                  Ada customer mirip, coba cek dulu sebelum lanjut:
                </p>
                <ul className="mt-1.5 flex flex-col gap-1">
                  {duplicates.map((d) => (
                    <li key={d.id} className="text-xs text-amber-700">
                      <span className="font-medium">{d.customer_name}</span>
                      {d.city ? ` · ${d.city}` : ""} · dipegang {d.owner_name}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => setDismissedDuplicateWarning(true)}
                  className="mt-2 text-xs font-medium text-amber-800 underline"
                >
                  Ini customer berbeda, lanjutkan
                </button>
              </div>
            </div>
          </div>
        )}

        <Input label="Kode Customer" placeholder="Kosongkan untuk auto-generate" {...register("customer_code")} />

        <Select label="Segment *" error={errors.segment?.message} {...register("segment")}>
          <option value="">Pilih segment</option>
          {SEGMENTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>

        <Input label="Industri" placeholder="Tekstil, Manufaktur, dll" {...register("industry")} />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-neutral-500">Lokasi & GPS</h2>
        <Input label="Alamat" {...register("address")} />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Kota" {...register("city")} />
          <Input label="Provinsi" {...register("province")} />
        </div>

        <div className="flex flex-col gap-2 pt-1">
          <Button
            type="button"
            variant="secondary"
            onClick={getCurrentLocation}
            disabled={geoLoading}
            className="flex items-center justify-center gap-2 cursor-pointer"
          >
            {geoLoading ? (
              <Loader2 size={16} className="animate-spin text-neutral-500" />
            ) : (
              <MapPin size={16} className="text-amber-600" />
            )}
            <span>{geoLoading ? "Mengambil Koordinat GPS..." : "Ambil Lokasi Saat Ini"}</span>
          </Button>

          {latitude && longitude ? (
            <div className="flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs text-emerald-900">
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                <span>
                  GPS Tersimpan: {Number(latitude).toFixed(6)}, {Number(longitude).toFixed(6)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setValue("latitude", null, { shouldDirty: true });
                  setValue("longitude", null, { shouldDirty: true });
                }}
                className="text-[11px] text-neutral-500 hover:text-red-600 underline cursor-pointer"
              >
                Hapus
              </button>
            </div>
          ) : null}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-neutral-500">Informasi Sales</h2>
        <div className="grid grid-cols-2 gap-3">
          <Select label="Priority" {...register("priority")}>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>
          <Select label="Status" {...register("status")}>
            {CUSTOMER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Est. Volume/bulan (L)"
            type="number"
            step="any"
            error={errors.estimated_monthly_volume?.message}
            {...register("estimated_monthly_volume", {
              setValueAs: (v) => (v === "" ? undefined : Number(v)),
            })}
          />
          <Input
            label="Potensi Volume/bulan (L)"
            type="number"
            step="any"
            error={errors.potential_monthly_volume?.message}
            {...register("potential_monthly_volume", {
              setValueAs: (v) => (v === "" ? undefined : Number(v)),
            })}
          />
        </div>
        <Input
          label="Termin Pembayaran (hari)"
          type="number"
          error={errors.payment_term_days?.message}
          {...register("payment_term_days", {
            setValueAs: (v) => (v === "" ? undefined : Number(v)),
          })}
        />
        <Textarea label="Catatan" {...register("notes")} />
      </section>

      {serverError && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{serverError}</p>
      )}

      <div className="fixed bottom-16 left-0 right-0 border-t border-neutral-200 bg-white p-4">
        <Button type="submit" isLoading={isPending}>
          Simpan Customer
        </Button>
      </div>
    </form>
  );
}
