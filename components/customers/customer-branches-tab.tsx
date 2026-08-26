"use client";

import { useState } from "react";
import {
  Building2,
  MapPin,
  Navigation,
  Compass,
  Plus,
  Trash2,
  Edit2,
  Check,
  Star,
  ExternalLink,
  Phone,
  MessageSquare,
  Loader2,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { useToast } from "@/components/ui/toast-context";
import { saveCustomerBranchesAction } from "@/actions/customers";
import { INDONESIA_INDUSTRIAL_HUBS } from "@/lib/utils/geo-route";
import type { CustomerBranch } from "@/lib/utils/branches";
import { cn } from "@/lib/utils/cn";
import { randomUUID } from "crypto";

export function CustomerBranchesTab({
  customerId,
  customerName,
  initialBranches,
}: {
  customerId: string;
  customerName: string;
  initialBranches: CustomerBranch[];
}) {
  const { success, error } = useToast();
  const [branches, setBranches] = useState<CustomerBranch[]>(initialBranches);
  const [isSaving, setIsSaving] = useState(false);

  // Modal / Form State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);

  // Form Fields
  const [formName, setFormName] = useState("");
  const [formAddress, setFormAddress] = useState("");
  const [formCity, setFormCity] = useState("");
  const [formLat, setFormLat] = useState("");
  const [formLng, setFormLng] = useState("");
  const [formPicName, setFormPicName] = useState("");
  const [formPicPhone, setFormPicPhone] = useState("");
  const [formIsPrimary, setFormIsPrimary] = useState(false);
  const [isLocatingGPS, setIsLocatingGPS] = useState(false);

  function openAddModal() {
    setEditingBranchId(null);
    setFormName("");
    setFormAddress("");
    setFormCity("");
    setFormLat("");
    setFormLng("");
    setFormPicName("");
    setFormPicPhone("");
    setFormIsPrimary(branches.length === 0);
    setIsModalOpen(true);
  }

  function openEditModal(branch: CustomerBranch) {
    setEditingBranchId(branch.id);
    setFormName(branch.branchName);
    setFormAddress(branch.address || "");
    setFormCity(branch.city || "");
    setFormLat(branch.latitude !== null && branch.latitude !== undefined ? String(branch.latitude) : "");
    setFormLng(branch.longitude !== null && branch.longitude !== undefined ? String(branch.longitude) : "");
    setFormPicName(branch.picName || "");
    setFormPicPhone(branch.picPhone || "");
    setFormIsPrimary(branch.isPrimary);
    setIsModalOpen(true);
  }

  // 1-Tap GPS Acquisition for branch
  function handleGetLiveGPS() {
    if (!navigator.geolocation) {
      error("Browser tidak mendukung deteksi GPS.");
      return;
    }

    setIsLocatingGPS(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormLat(pos.coords.latitude.toFixed(6));
        setFormLng(pos.coords.longitude.toFixed(6));
        setIsLocatingGPS(false);
        success("Koordinat GPS cabang berhasil dikunci!");
      },
      (err) => {
        console.warn("GPS error:", err);
        setIsLocatingGPS(false);
        error("Gagal mengambil GPS. Pastikan izin lokasi aktif.");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  function handleSelectPresetHub(hubId: string) {
    const hub = INDONESIA_INDUSTRIAL_HUBS.find((h) => h.id === hubId);
    if (hub) {
      setFormLat(hub.coordinates.latitude.toFixed(6));
      setFormLng(hub.coordinates.longitude.toFixed(6));
      if (!formCity) setFormCity(hub.region);
    }
  }

  // Save Branch list to backend
  async function persistBranches(updated: CustomerBranch[]) {
    setIsSaving(true);
    try {
      const res = await saveCustomerBranchesAction({
        customerId,
        branches: updated,
      });

      if (res.success) {
        setBranches(updated);
        success(res.message);
        setIsModalOpen(false);
      } else {
        error(res.message);
      }
    } catch {
      error("Gagal menyimpan cabang.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleSubmitBranchForm(e: React.FormEvent) {
    e.preventDefault();
    if (!formName.trim()) {
      error("Nama cabang/pabrik wajib diisi.");
      return;
    }

    const parsedLat = formLat.trim() ? parseFloat(formLat) : null;
    const parsedLng = formLng.trim() ? parseFloat(formLng) : null;

    let updatedList = [...branches];

    if (editingBranchId) {
      // Update existing
      updatedList = updatedList.map((b) => {
        if (b.id === editingBranchId) {
          return {
            ...b,
            branchName: formName.trim(),
            address: formAddress.trim() || "Belum ada detail alamat",
            city: formCity.trim() || "Kota",
            latitude: parsedLat,
            longitude: parsedLng,
            picName: formPicName.trim() || null,
            picPhone: formPicPhone.trim() || null,
            isPrimary: formIsPrimary,
          };
        }
        return formIsPrimary ? { ...b, isPrimary: false } : b;
      });
    } else {
      // Create new branch
      const newBranch: CustomerBranch = {
        id: `branch-${Date.now()}`,
        branchName: formName.trim(),
        address: formAddress.trim() || "Belum ada detail alamat",
        city: formCity.trim() || "Kota",
        latitude: parsedLat,
        longitude: parsedLng,
        picName: formPicName.trim() || null,
        picPhone: formPicPhone.trim() || null,
        isPrimary: formIsPrimary || branches.length === 0,
      };

      if (formIsPrimary) {
        updatedList = updatedList.map((b) => ({ ...b, isPrimary: false }));
      }
      updatedList.push(newBranch);
    }

    persistBranches(updatedList);
  }

  function handleDeleteBranch(branchId: string) {
    if (branches.length <= 1) {
      error("Setidaknya harus ada 1 cabang / lokasi pabrik.");
      return;
    }

    const target = branches.find((b) => b.id === branchId);
    if (!confirm(`Hapus lokasi cabang "${target?.branchName}"?`)) return;

    let updatedList = branches.filter((b) => b.id !== branchId);
    if (target?.isPrimary && updatedList.length > 0) {
      updatedList[0].isPrimary = true;
    }

    persistBranches(updatedList);
  }

  function handleSetPrimary(branchId: string) {
    const updatedList = branches.map((b) => ({
      ...b,
      isPrimary: b.id === branchId,
    }));
    persistBranches(updatedList);
  }

  return (
    <div className="space-y-4">
      {/* Header & Add Button */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-sm font-extrabold text-neutral-900 flex items-center gap-1.5">
            <Building2 className="h-4 w-4 text-amber-600" />
            <span>Daftar Cabang, Pabrik &amp; Site ({branches.length})</span>
          </h2>
          <p className="text-[11px] text-neutral-500">
            Kelola multi-plant dan titik GPS presisi untuk perutean cerdas AI Hermes.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-1.5 min-h-[40px] rounded-xl bg-neutral-900 px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-neutral-800 active:scale-95 transition cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Cabang / Plant</span>
        </button>
      </div>

      {/* Branches List */}
      <div className="space-y-3">
        {branches.map((b) => {
          const hasCoords =
            b.latitude !== null &&
            b.longitude !== null &&
            b.latitude !== undefined &&
            b.longitude !== undefined &&
            !isNaN(b.latitude) &&
            !isNaN(b.longitude);

          const navUrl = hasCoords
            ? `https://www.google.com/maps/dir/?api=1&destination=${b.latitude},${b.longitude}&travelmode=driving`
            : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${customerName} ${b.branchName} ${b.address} ${b.city}`
              )}`;

          return (
            <div
              key={b.id}
              className={cn(
                "rounded-2xl border p-4 space-y-3 transition shadow-2xs",
                b.isPrimary
                  ? "border-amber-400 bg-amber-50/40"
                  : "border-neutral-200 bg-white hover:border-neutral-300"
              )}
            >
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-extrabold text-sm text-neutral-900 flex items-center gap-1.5">
                      <Building2 className="h-4 w-4 text-neutral-700" />
                      <span>{b.branchName}</span>
                    </h3>
                    {b.isPrimary && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 text-white text-[10px] font-extrabold px-2.5 py-0.5 shadow-2xs">
                        <Star className="h-3 w-3 fill-current" />
                        <span>Pabrik Utama</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-700 font-medium">
                    📍 {b.address} &bull; <strong className="text-neutral-900">{b.city}</strong>
                  </p>
                </div>

                {/* Right Quick Nav CTA */}
                <div className="flex items-center gap-1.5">
                  <a
                    href={navUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 min-h-[38px] rounded-xl bg-neutral-900 px-3 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-neutral-800 active:scale-95 transition cursor-pointer"
                  >
                    <Navigation className="h-3 w-3 text-amber-400" />
                    <span>Navigasi</span>
                    <ExternalLink className="h-2.5 w-2.5 text-neutral-400" />
                  </a>
                </div>
              </div>

              {/* Coordinates & PIC Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-neutral-200/80 text-xs">
                {/* GPS Status */}
                <div className="flex items-center gap-1.5 text-[11px]">
                  <MapPin className="h-3.5 w-3.5 text-neutral-500 shrink-0" />
                  {hasCoords ? (
                    <span className="font-mono text-neutral-700 font-bold bg-white px-2 py-0.5 rounded-md border border-neutral-200">
                      Lat: {b.latitude?.toFixed(5)}, Lon: {b.longitude?.toFixed(5)}
                    </span>
                  ) : (
                    <span className="text-amber-800 font-medium italic">
                      ⚠️ Belum ada titik GPS gerbang pabrik
                    </span>
                  )}
                </div>

                {/* PIC Info */}
                <div className="flex items-center gap-2 text-[11px] text-neutral-700 sm:justify-end">
                  {b.picName ? (
                    <span className="font-medium">
                      PIC: <strong className="text-neutral-900">{b.picName}</strong>
                      {b.picPhone && ` (${b.picPhone})`}
                    </span>
                  ) : (
                    <span className="text-neutral-400 italic">Belum ada PIC Plant</span>
                  )}

                  {b.picPhone && (
                    <a
                      href={`https://wa.me/${b.picPhone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200"
                    >
                      <MessageSquare className="h-3 w-3" />
                      <span>WA</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-xs flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  {!b.isPrimary && (
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(b.id)}
                      disabled={isSaving}
                      className="text-[11px] font-bold text-neutral-600 hover:text-amber-700 flex items-center gap-1 min-h-[36px] py-1 cursor-pointer"
                    >
                      <Star className="h-3 w-3" />
                      <span>Set Jadi Utama</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(b)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-neutral-700 hover:text-neutral-900 min-h-[36px] px-2.5 py-1 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 active:scale-95 transition cursor-pointer"
                  >
                    <Edit2 className="h-3 w-3 text-neutral-500" />
                    <span>Ubah Info &amp; GPS</span>
                  </button>

                  {!b.isPrimary && (
                    <button
                      type="button"
                      onClick={() => handleDeleteBranch(b.id)}
                      disabled={isSaving}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 hover:text-red-700 min-h-[36px] px-2 py-1 rounded-lg border border-red-200 bg-white hover:bg-red-50 active:scale-95 transition cursor-pointer"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Hapus</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: ADD / EDIT BRANCH */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white p-5 sm:p-6 shadow-2xl border border-neutral-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-base font-extrabold text-neutral-900 flex items-center gap-1.5">
                <Building2 className="h-5 w-5 text-amber-600" />
                <span>{editingBranchId ? "Ubah Lokasi Cabang/Pabrik" : "Tambah Cabang/Pabrik Baru"}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitBranchForm} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-neutral-800">
                  Nama Cabang / Plant / Pabrik <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Contoh: Plant 2 Rancaekek / Gudang Cikarang"
                  className="w-full min-h-[42px] rounded-xl border border-neutral-300 bg-white px-3.5 py-2 text-xs font-semibold text-neutral-900 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-200"
                />
              </div>

              {/* GPS Live Picker Box */}
              <div className="rounded-2xl bg-amber-50/80 border border-amber-300 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-950 flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                    <span>Titik GPS Gerbang Cabang Ini</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleGetLiveGPS}
                    disabled={isLocatingGPS}
                    className="min-h-[36px] px-3 py-1 rounded-xl bg-amber-500 text-white font-bold text-xs hover:bg-amber-600 active:scale-95 transition flex items-center gap-1 cursor-pointer shadow-2xs disabled:opacity-50"
                  >
                    {isLocatingGPS ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Compass className="h-3.5 w-3.5" />}
                    <span>1-Tap GPS Saat Ini</span>
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-600">Pilih Cepat Klaster Kawasan Industri:</label>
                  <select
                    onChange={(e) => {
                      if (e.target.value) handleSelectPresetHub(e.target.value);
                    }}
                    defaultValue=""
                    className="w-full min-h-[38px] rounded-xl border border-neutral-300 bg-white px-3 py-1.5 text-xs text-neutral-800 outline-none focus:border-amber-500"
                  >
                    <option value="" disabled>
                      -- Pilih Kawasan Industri --
                    </option>
                    {INDONESIA_INDUSTRIAL_HUBS.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="text-[10px] font-bold text-neutral-600">Latitude</label>
                    <input
                      type="text"
                      value={formLat}
                      onChange={(e) => setFormLat(e.target.value)}
                      placeholder="-6.953100"
                      className="w-full min-h-[38px] rounded-xl border border-neutral-300 bg-white px-2.5 py-1 text-xs font-mono outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-neutral-600">Longitude</label>
                    <input
                      type="text"
                      value={formLng}
                      onChange={(e) => setFormLng(e.target.value)}
                      placeholder="107.768200"
                      className="w-full min-h-[38px] rounded-xl border border-neutral-300 bg-white px-2.5 py-1 text-xs font-mono outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Address & City */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[11px] font-bold text-neutral-800">Alamat Lengkap Cabang</label>
                  <input
                    type="text"
                    value={formAddress}
                    onChange={(e) => setFormAddress(e.target.value)}
                    placeholder="Jl. Raya Rancaekek KM 24.5"
                    className="w-full min-h-[42px] rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-800">Kota / Wilayah</label>
                  <input
                    type="text"
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    placeholder="Kab. Sumedang / Bandung"
                    className="w-full min-h-[42px] rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* PIC Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-800">Nama PIC di Plant Ini</label>
                  <input
                    type="text"
                    value={formPicName}
                    onChange={(e) => setFormPicName(e.target.value)}
                    placeholder="Pak Budi (Kepala Pabrik)"
                    className="w-full min-h-[42px] rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-800">No. WhatsApp PIC</label>
                  <input
                    type="tel"
                    value={formPicPhone}
                    onChange={(e) => setFormPicPhone(e.target.value)}
                    placeholder="08123456789"
                    className="w-full min-h-[42px] rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Primary Checkbox */}
              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formIsPrimary}
                  onChange={(e) => setFormIsPrimary(e.target.checked)}
                  className="h-4 w-4 rounded accent-amber-500"
                />
                <span className="text-xs font-bold text-neutral-800">
                  Jadikan sebagai Pabrik / Kantor Utama (Primary Site)
                </span>
              </label>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="min-h-[44px] px-4 rounded-xl border border-neutral-200 bg-white text-xs font-bold text-neutral-600 hover:bg-neutral-100 active:scale-95 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="min-h-[44px] px-5 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 active:scale-95 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-2xs"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  <span>{editingBranchId ? "Simpan Perubahan" : "Tambahkan Cabang"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
