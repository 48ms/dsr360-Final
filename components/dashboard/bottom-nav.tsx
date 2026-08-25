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
    <nav className="fixed bottom-0 left-0 right-0 z-10 border-t border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-md items-stretch justify-around">
        {BOTTOM_NAV.map((item) => {
          const Icon = ICONS[item.icon];
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] transition",
                isActive ? "text-amber-500 font-bold" : "text-neutral-400 hover:text-neutral-600"
              )}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
