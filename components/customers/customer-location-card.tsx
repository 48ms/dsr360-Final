"use client";

import { useState } from "react";
import {
  MapPin,
  Navigation,
  Compass,
  Edit2,
  Check,
  X,
  Loader2,
  ExternalLink,
  Sparkles,
  AlertTriangle,
  Building2,
} from "lucide-react";
import { useToast } from "@/components/ui/toast-context";
import { updateCustomerLocationAction } from "@/actions/customers";
import { INDONESIA_INDUSTRIAL_HUBS } from "@/lib/utils/geo-route";
import { cn } from "@/lib/utils/cn";

export type CustomerLocationProps = {
  customerId: string;
  customerName: string;
  city: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
};

export function CustomerLocationCard({
  customerId,
  customerName,
  city,
  address,
  latitude,
  longitude,
}: CustomerLocationProps) {
  const { success, error } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLocatingGPS, setIsLocatingGPS] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formLat, setFormLat] = useState<string>(
    latitude !== null && latitude !== undefined ? String(latitude) : ""
  );
  const [formLng, setFormLng] = useState<string>(
    longitude !== null && longitude !== undefined ? String(longitude) : ""
  );
  const [formCity, setFormCity] = useState<string>(city || "");
  const [formAddress, setFormAddress] = useState<string>(address || "");

  const hasCoords =
    latitude !== null &&
    longitude !== null &&
    latitude !== undefined &&
    longitude !== undefined &&
    !isNaN(latitude) &&
    !isNaN(longitude);

  // 1-Tap GPS Acquisition
  function handleGetLiveGPS() {
    if (!navigator.geolocation) {
      error("Browser tidak mendukung fitur GPS Geolocation.");
      return;
    }

    setIsLocatingGPS(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormLat(pos.coords.latitude.toFixed(6));
        setFormLng(pos.coords.longitude.toFixed(6));
        setIsLocatingGPS(false);
        success("Koordinat GPS berhasil dikunci!");
      },
      (err) => {
        console.warn("Geolocation error:", err);
        setIsLocatingGPS(false);
        error("Gagal mengambil titik GPS. Pastikan izin lokasi aktif.");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  // Handle Industrial Hub Preset Pick
  function handleSelectPresetHub(hubId: string) {
    const hub = INDONESIA_INDUSTRIAL_HUBS.find((h) => h.id === hubId);
    if (hub) {
      setFormLat(hub.coordinates.latitude.toFixed(6));
      setFormLng(hub.coordinates.longitude.toFixed(6));
      if (!formCity) setFormCity(hub.region);
    }
  }

  // Save Location to Database
  async function handleSaveLocation() {
    setIsSaving(true);
    try {
      const parsedLat = formLat.trim() ? parseFloat(formLat) : null;
      const parsedLng = formLng.trim() ? parseFloat(formLng) : null;

      const res = await updateCustomerLocationAction({
        customerId,
        latitude: parsedLat,
        longitude: parsedLng,
        city: formCity.trim() || undefined,
        address: formAddress.trim() || undefined,
      });

      if (res.success) {
        success(res.message);
        setIsEditing(false);
      } else {
        error(res.message);
      }
    } catch {
      error("Gagal menyimpan titik lokasi customer.");
    } finally {
      setIsSaving(false);
    }
  }

  const googleMapsNavUrl = hasCoords
    ? `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${customerName} ${address || ""} ${city || ""}`
      )}`;

  return (
    <div className="mt-3 rounded-2xl border border-neutral-200 bg-neutral-50/70 p-3.5 space-y-2.5 shadow-2xs">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-500/20 text-amber-900 border border-amber-500/30">
            <MapPin className="h-4 w-4" />
          </div>
          <div>
            <span className="text-xs font-extrabold text-neutral-900 flex items-center gap-1.5">
              <span>Titik Lokasi &amp; Koordinat Maps Pabrik</span>
              {hasCoords ? (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.2 border border-emerald-300">
                  GPS Terkunci ✓
                </span>
              ) : (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.2 border border-amber-300">
                  Perlu Di-pin
                </span>
              )}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center gap-1 min-h-[36px] rounded-xl border border-neutral-200 bg-white px-2.5 py-1 text-xs font-bold text-neutral-700 hover:bg-neutral-100 active:scale-95 transition cursor-pointer shadow-2xs"
          >
            <Edit2 className="h-3 w-3 text-neutral-500" />
            <span>{isEditing ? "Batal" : hasCoords ? "Ubah Titik" : "+ Pin GPS"}</span>
          </button>

          <a
            href={googleMapsNavUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 min-h-[36px] rounded-xl bg-neutral-900 px-3 py-1 text-xs font-bold text-white shadow-2xs hover:bg-neutral-800 active:scale-95 transition cursor-pointer"
          >
            <Navigation className="h-3 w-3 text-amber-400" />
            <span>Navigasi</span>
            <ExternalLink className="h-2.5 w-2.5 text-neutral-400" />
          </a>
        </div>
      </div>

      {/* Info View (When Not Editing) */}
      {!isEditing && (
        <div className="space-y-1 text-xs text-neutral-700">
          <p className="font-medium text-neutral-900 flex items-start gap-1">
            <span className="text-neutral-500 shrink-0">📍 Alamat:</span>
            <span>{address || "Belum ada detail alamat pabrik."}</span>
          </p>
          <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1 border-t border-neutral-200/60 flex-wrap gap-2">
            <span>Kota/Kawasan: <strong className="text-neutral-800">{city || "Belum diisi"}</strong></span>
            {hasCoords ? (
              <span className="font-mono text-neutral-700 font-semibold bg-white px-2 py-0.5 rounded-md border border-neutral-200">
                Lat: {latitude?.toFixed(5)}, Lon: {longitude?.toFixed(5)}
              </span>
            ) : (
              <span className="text-amber-800 text-[10px] italic">
                💡 Pin titik GPS saat tiba di lokasi pabrik agar AI Hermes dapat menghitung rute presisi.
              </span>
            )}
          </div>
        </div>
      )}

      {/* Editing Form (Pin Location) */}
      {isEditing && (
        <div className="space-y-3 pt-2 border-t border-neutral-200 text-xs animate-fade-in-up">
          <div className="rounded-xl bg-amber-500/10 border border-amber-300/80 p-3 text-xs text-amber-950 space-y-1.5">
            <span className="font-bold flex items-center gap-1 text-amber-900">
              <Sparkles className="h-3.5 w-3.5 text-amber-600" />
              <span>Kunci Titik GPS Akurat untuk AI Route Optimizer</span>
            </span>
            <p className="text-[11px] text-neutral-700 leading-relaxed">
              Jika Anda sedang berada di depan gerbang pabrik, tap tombol <strong>&ldquo;1-Tap GPS Saat Ini&rdquo;</strong> di bawah.
            </p>
            <div className="pt-1 flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleGetLiveGPS}
                disabled={isLocatingGPS}
                className="min-h-[40px] px-3 py-1.5 rounded-xl bg-amber-500 text-white font-bold text-xs hover:bg-amber-600 active:scale-95 transition flex items-center gap-1.5 cursor-pointer shadow-2xs disabled:opacity-50"
              >
                {isLocatingGPS ? <Loader2 className="h-4 w-4 animate-spin" /> : <Compass className="h-4 w-4" />}
                <span>1-Tap GPS Saat Ini</span>
              </button>

              <select
                onChange={(e) => {
                  if (e.target.value) handleSelectPresetHub(e.target.value);
                }}
                defaultValue=""
                className="min-h-[40px] px-2.5 py-1.5 rounded-xl border border-neutral-300 bg-white text-xs font-semibold text-neutral-800 outline-none focus:border-amber-500 shadow-2xs"
              >
                <option value="" disabled>
                  -- Atau Pilih Preset Kawasan Industri --
                </option>
                {INDONESIA_INDUSTRIAL_HUBS.map((hub) => (
                  <option key={hub.id} value={hub.id}>
                    {hub.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Coordinate Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-neutral-700">Latitude (Garis Lintang)</label>
              <input
                type="text"
                value={formLat}
                onChange={(e) => setFormLat(e.target.value)}
                placeholder="-6.324200"
                className="w-full min-h-[40px] rounded-xl border border-neutral-300 bg-white px-3 py-1.5 text-xs text-neutral-900 font-mono outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-200"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-neutral-700">Longitude (Garis Bujur)</label>
              <input
                type="text"
                value={formLng}
                onChange={(e) => setFormLng(e.target.value)}
                placeholder="107.152400"
                className="w-full min-h-[40px] rounded-xl border border-neutral-300 bg-white px-3 py-1.5 text-xs text-neutral-900 font-mono outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-200"
              />
            </div>
          </div>

          {/* Address & City Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-[11px] font-bold text-neutral-700">Alamat Lengkap / Blok Pabrik</label>
              <input
                type="text"
                value={formAddress}
                onChange={(e) => setFormAddress(e.target.value)}
                placeholder="Kawasan Industri GIIC Blok AA No. 1"
                className="w-full min-h-[40px] rounded-xl border border-neutral-300 bg-white px-3 py-1.5 text-xs text-neutral-900 outline-none focus:border-amber-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-neutral-700">Kota / Wilayah</label>
              <input
                type="text"
                value={formCity}
                onChange={(e) => setFormCity(e.target.value)}
                placeholder="Cikarang Pusat"
                className="w-full min-h-[40px] rounded-xl border border-neutral-300 bg-white px-3 py-1.5 text-xs text-neutral-900 outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="min-h-[40px] px-3 py-1.5 rounded-xl border border-neutral-200 bg-white text-xs font-bold text-neutral-600 hover:bg-neutral-100 active:scale-95 transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSaveLocation}
              disabled={isSaving}
              className="min-h-[40px] px-4 py-1.5 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 active:scale-95 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-2xs"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              <span>Simpan Titik Maps</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
