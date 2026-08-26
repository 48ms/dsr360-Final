"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Building2, MapPin, Target, CheckCircle2, Calculator } from "lucide-react";
import { BOTTOM_NAV } from "@/constants/nav";
import { cn } from "@/lib/utils/cn";

const ICONS = {
  home: Home,
  building: Building2,
  "map-pin": MapPin,
  calculator: Calculator,
  target: Target,
  "check-circle": CheckCircle2,
} as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-[#EAE4D9] bg-white/95 backdrop-blur-xl pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1.5 shadow-md">
      <div className="mx-auto flex max-w-md items-stretch justify-around px-1">
        {BOTTOM_NAV.map((item) => {
          const Icon = ICONS[item.icon];
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex flex-1 flex-col items-center justify-center gap-0.5 py-1 text-[10px] transition-all duration-150 active:scale-95",
                isActive
                  ? "text-amber-900 font-extrabold"
                  : "text-neutral-500 hover:text-neutral-800"
              )}
            >
              <div
                className={cn(
                  "flex h-7 w-11 items-center justify-center rounded-full transition-all duration-200",
                  isActive
                    ? "bg-amber-100 border border-amber-300/80 shadow-2xs"
                    : "group-hover:bg-neutral-100"
                )}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} className={isActive ? "text-amber-700" : "text-neutral-500"} />
              </div>
              <span className="tracking-tight leading-none font-semibold truncate max-w-[56px] text-center">
                {item.label === "Kalkulator SPH" ? "SPH" : item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
