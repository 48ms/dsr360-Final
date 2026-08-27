"use client";

import { useState, useRef } from "react";
import { Camera, Image as ImageIcon, Trash2, UploadCloud } from "lucide-react";
import { PHOTO_TYPES, type PhotoType } from "@/constants/enums";

export type CapturedPhoto = {
  photo_url: string;
  photo_type: PhotoType;
  caption: string;
};

/**
 * Compresses an image client-side to max 1280px dimension and ~75% JPEG quality
 * Returns a compact Base64 data URL ready to store without server upload lag
 */
async function compressImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        const maxDimension = 1200;

        if (width > height && width > maxDimension) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else if (height > maxDimension) {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.75);
        resolve(compressedBase64);
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function VisitPhotoUploader({
  photos,
  onChange,
}: {
  photos: CapturedPhoto[];
  onChange: (photos: CapturedPhoto[]) => void;
}) {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState("");
  const [manualType, setManualType] = useState<PhotoType>("WORKSHOP");
  const [manualCaption, setManualCaption] = useState("");

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>, defaultType: PhotoType = "WORKSHOP") {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    try {
      const newPhotos: CapturedPhoto[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const compressedBase64 = await compressImageFile(file);
        newPhotos.push({
          photo_url: compressedBase64,
          photo_type: defaultType,
          caption: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
        });
      }

      onChange([...photos, ...newPhotos]);
    } catch (err) {
      console.error("Error processing camera/gallery photo:", err);
    } finally {
      setIsProcessing(false);
      // Reset input value so same photo can be re-selected if needed
      if (e.target) e.target.value = "";
    }
  }

  function handleRemovePhoto(index: number) {
    onChange(photos.filter((_, i) => i !== index));
  }

  function handleUpdatePhotoType(index: number, type: PhotoType) {
    const updated = [...photos];
    updated[index].photo_type = type;
    onChange(updated);
  }

  function handleUpdateCaption(index: number, caption: string) {
    const updated = [...photos];
    updated[index].caption = caption;
    onChange(updated);
  }

  function handleAddManualUrl() {
    if (!manualUrl.trim()) return;
    onChange([
      ...photos,
      {
        photo_url: manualUrl.trim(),
        photo_type: manualType,
        caption: manualCaption.trim(),
      },
    ]);
    setManualUrl("");
    setManualCaption("");
    setShowUrlInput(false);
  }

  return (
    <div className="space-y-4">
      {/* Hidden Native File Inputs for Direct Camera & Gallery */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={cameraInputRef}
        className="hidden"
        onChange={(e) => handleFileSelect(e, "WORKSHOP")}
      />
      <input
        type="file"
        accept="image/*"
        multiple
        ref={galleryInputRef}
        className="hidden"
        onChange={(e) => handleFileSelect(e, "EQUIPMENT")}
      />

      {/* Action Buttons for Mobile / Desktop */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => cameraInputRef.current?.click()}
          disabled={isProcessing}
          className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white p-3 text-xs font-black shadow-sm active:scale-95 transition cursor-pointer disabled:opacity-50"
        >
          <Camera className="h-4 w-4" />
          <span>{isProcessing ? "Memproses..." : "📸 Buka Kamera HP"}</span>
        </button>

        <button
          type="button"
          onClick={() => galleryInputRef.current?.click()}
          disabled={isProcessing}
          className="flex items-center justify-center gap-2 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white p-3 text-xs font-black shadow-sm active:scale-95 transition cursor-pointer disabled:opacity-50"
        >
          <ImageIcon className="h-4 w-4 text-amber-400" />
          <span>🖼️ Pilih dari Galeri</span>
        </button>
      </div>

      {/* Toggle Manual URL Option if needed */}
      <div className="text-right">
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-neutral-400 hover:text-amber-700 font-medium underline"
        >
          {showUrlInput ? "Tutup input URL" : "+ Input URL gambar manual"}
        </button>
      </div>

      {showUrlInput && (
        <div className="rounded-2xl border border-neutral-200 p-3 bg-neutral-50/70 space-y-2 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              value={manualUrl}
              onChange={(e) => setManualUrl(e.target.value)}
              placeholder="Paste URL foto https://..."
              className="sm:col-span-2 rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs outline-none focus:border-amber-500"
            />
            <select
              value={manualType}
              onChange={(e) => setManualType(e.target.value as PhotoType)}
              className="rounded-xl border border-neutral-300 bg-white px-2 py-2 text-xs"
            >
              {PHOTO_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={manualCaption}
              onChange={(e) => setManualCaption(e.target.value)}
              placeholder="Keterangan foto..."
              className="flex-1 rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs outline-none focus:border-amber-500"
            />
            <button
              type="button"
              onClick={handleAddManualUrl}
              disabled={!manualUrl.trim()}
              className="rounded-xl bg-neutral-900 text-white px-4 py-2 font-bold disabled:opacity-40"
            >
              Simpan
            </button>
          </div>
        </div>
      )}

      {/* Captured Photos Grid with Live Thumbnails */}
      {photos.length > 0 ? (
        <div className="space-y-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block">
            Foto Terlampir ({photos.length} Foto):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {photos.map((p, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-neutral-200 bg-white p-3 shadow-xs space-y-2.5"
              >
                <div className="relative aspect-video w-full rounded-xl bg-neutral-950 overflow-hidden border border-neutral-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.photo_url}
                    alt={p.caption || `Foto #${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="p-1.5 rounded-lg bg-red-600/90 text-white hover:bg-red-700 transition active:scale-95 shadow-md"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase">
                      Jenis Foto:
                    </span>
                    <select
                      value={p.photo_type}
                      onChange={(e) => handleUpdatePhotoType(idx, e.target.value as PhotoType)}
                      className="rounded-lg border border-neutral-300 bg-neutral-50 px-2 py-1 text-[11px] font-bold text-neutral-800"
                    >
                      {PHOTO_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <input
                    type="text"
                    value={p.caption}
                    onChange={(e) => handleUpdateCaption(idx, e.target.value)}
                    placeholder="Tulis keterangan foto (misal: Nameplate genset)..."
                    className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-900 outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50/50 p-6 text-center space-y-1">
          <UploadCloud className="h-8 w-8 text-neutral-400 mx-auto" />
          <p className="text-xs font-bold text-neutral-700">Belum ada foto bukti lapangan</p>
          <p className="text-[11px] text-neutral-400">
            Tap tombol &quot;Buka Kamera HP&quot; di atas untuk foto nameplate / drum oli secara instan.
          </p>
        </div>
      )}
    </div>
  );
}
