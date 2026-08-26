"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Building2, MapPin, Target, CheckCircle2 } from "lucide-react";
import { BOTTOM_NAV } from "@/constants/nav";
import { cn } from "@/lib/utils/cn";

const ICONS = {
  home: Home,
  building: Building2,
  "map-pin": MapPin,
  target: Target,
  "check-circle": CheckCircle2,
} as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-neutral-200/80 bg-white/90 backdrop-blur-lg pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1 shadow-xs">
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
                "group relative flex flex-1 flex-col items-center justify-center gap-0.5 py-1.5 text-[10px] transition-all duration-150 active:scale-95",
                isActive
                  ? "text-amber-600 font-bold"
                  : "text-neutral-400 hover:text-neutral-700"
              )}
            >
              <div
                className={cn(
                  "flex h-7 w-10 items-center justify-center rounded-full transition-all duration-200",
                  isActive ? "bg-amber-100/70" : "group-hover:bg-neutral-100/70"
                )}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              </div>
              <span className="tracking-tight leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
