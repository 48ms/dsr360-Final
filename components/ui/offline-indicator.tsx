"use client";

import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import { WifiOff, Wifi } from "lucide-react";
import { cn } from "@/lib/utils/cn";

function subscribeOnline(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

function getSnapshot() {
  return navigator.onLine;
}

function getServerSnapshot() {
  return true;
}

export function OfflineIndicator() {
  const isOnline = useSyncExternalStore(subscribeOnline, getSnapshot, getServerSnapshot);
  const prevOnlineRef = useRef(isOnline);
  const [showRestored, setShowRestored] = useState(false);

  useEffect(() => {
    if (!prevOnlineRef.current && isOnline) {
      setShowRestored(true);
      const timer = setTimeout(() => setShowRestored(false), 3500);
      prevOnlineRef.current = isOnline;
      return () => clearTimeout(timer);
    }
    prevOnlineRef.current = isOnline;
  }, [isOnline]);

  const isOffline = !isOnline;

  if (!isOffline && !showRestored) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-50 px-4 py-2 text-center text-xs font-semibold shadow-md transition-all duration-300 animate-in slide-in-from-top",
        isOffline
          ? "bg-neutral-900 text-amber-300 border-b border-amber-500/80"
          : "bg-emerald-600 text-white border-b border-emerald-700"
      )}
    >
      <div className="mx-auto flex max-w-md items-center justify-center gap-2">
        {isOffline ? (
          <div className="flex items-center gap-2">
            <WifiOff className="h-4 w-4 shrink-0 text-amber-400 animate-pulse" />
            <span>📡 Mode Offline (Blank Spot) : Data di layar tetap aman.</span>
          </div>
        ) : (
          <>
            <Wifi className="h-3.5 w-3.5 text-white shrink-0" />
            <span>✅ Koneksi Kembali Tersambung</span>
          </>
        )}
      </div>
    </div>
  );
}
