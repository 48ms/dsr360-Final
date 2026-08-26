"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Building2,
  MapPin,
  Calculator,
  Target,
  CheckCircle2,
  LogOut,
  Compass,
  Zap,
} from "lucide-react";
import { BOTTOM_NAV } from "@/constants/nav";
import { cn } from "@/lib/utils/cn";
import { logout } from "@/actions/auth";

const ICONS = {
  home: Home,
  building: Building2,
  "map-pin": MapPin,
  calculator: Calculator,
  target: Target,
  "check-circle": CheckCircle2,
} as const;

export function DesktopNav({
  profile,
}: {
  profile?: {
    full_name?: string | null;
    role?: string;
    sales_area?: string | null;
  } | null;
}) {
  const pathname = usePathname();

  return (
    <header className="hidden md:block sticky top-0 z-40 border-b border-[#EAE4D9] bg-white/95 backdrop-blur-md shadow-2xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 xl:px-6 py-2.5 gap-4">
        {/* Left: Brand & Distributor Badge */}
        <div className="flex items-center gap-4 xl:gap-6 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2.5 shrink-0 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#09090B] border border-amber-500/60 shadow-xs group-hover:scale-105 transition overflow-hidden">
              <img src="/icons/nyales247-mark.svg" alt="Nyales24/7" className="h-7 w-7 object-contain" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-black text-sm tracking-tight text-neutral-900">
                  Nyales24/7
                </span>
                <span className="inline-flex items-center rounded-md bg-amber-50 px-1.5 py-0.5 text-[9px] font-extrabold text-amber-900 border border-amber-200/80 tracking-tight">
                  by Bima Maulana Saputra
                </span>
              </div>
              <span className="text-[10px] font-medium text-neutral-400 tracking-tight leading-none mt-1 whitespace-nowrap">
                B2B Sales Operating System
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="flex items-center gap-1 lg:gap-1.5 shrink-0">
            {BOTTOM_NAV.map((item) => {
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all duration-150 shrink-0",
                    isActive
                      ? "bg-amber-500/15 text-amber-950 font-black border border-amber-500/30 shadow-2xs"
                      : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 font-semibold"
                  )}
                >
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Quick Action & User Profile */}
        <div className="flex items-center gap-2 lg:gap-3 shrink-0">
          <Link
            href="/visits/quick"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold hover:from-amber-600 hover:to-amber-700 active:scale-95 transition shadow-2xs cursor-pointer whitespace-nowrap shrink-0"
          >
            <Zap className="h-3.5 w-3.5" />
            <span>Quick Visit</span>
          </Link>

          <Link
            href="/visits/plan"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 text-neutral-800 text-xs font-bold hover:bg-neutral-200 active:scale-95 transition cursor-pointer whitespace-nowrap shrink-0"
          >
            <Compass className="h-3.5 w-3.5 text-amber-600" />
            <span>Hermes Rute</span>
          </Link>

          {/* Profile Pill & Logout */}
          <div className="flex items-center gap-2 pl-2 border-l border-neutral-200 shrink-0">
            <div className="text-right text-xs">
              <span className="font-extrabold text-neutral-900 block leading-tight truncate max-w-[120px]">
                {profile?.full_name ?? "Sales Rep"}
              </span>
              <span className="text-[10px] text-neutral-400 font-medium block truncate max-w-[120px]">
                {profile?.role ?? "DSR"} {profile?.sales_area ? `(${profile.sales_area})` : ""}
              </span>
            </div>

            <form action={logout}>
              <button
                type="submit"
                aria-label="Logout"
                title="Keluar / Logout"
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-500 hover:text-red-700 hover:bg-red-50 hover:border-red-200 active:scale-95 transition cursor-pointer shrink-0" /* impeccable-disable-line gray-on-color */
              >
                <LogOut size={14} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
}
