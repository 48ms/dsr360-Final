import { LoginForm } from "@/components/auth/login-form";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-4 py-10 sm:px-6 bg-[#FDFBF7]">
      <div className="mx-auto w-full max-w-sm">
        {/* Brand Card Header */}
        <div className="mb-6 text-center space-y-3">
          {/* Logo Mark */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#0F172A] border-2 border-amber-500/80 shadow-md shadow-amber-950/10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-radial from-amber-500/20 to-transparent opacity-60 pointer-events-none" />
            <div className="flex flex-col items-center justify-center leading-none">
              <span className="font-mono font-black text-2xl tracking-tighter bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                24/7
              </span>
              <span className="text-[9px] font-black tracking-widest text-amber-300/80 mt-0.5">
                NYALES
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
                Nyales<span className="text-amber-600">24/7</span>
              </h1>
            </div>
            
            <div className="inline-flex items-center rounded-full bg-amber-100/70 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-950 border border-amber-300/60 tracking-tight">
              by Bima Maulana Saputra
            </div>

            <p className="text-xs text-neutral-500 font-medium max-w-xs mx-auto pt-1">
              24/7 AI-Powered B2B Sales Operating System &amp; Field Intelligence Engine
            </p>
          </div>
        </div>

        {/* Card Form */}
        <div className="rounded-3xl border border-[#EAE4D9] bg-white p-6 sm:p-7 shadow-xs">
          <LoginForm />
        </div>

        {/* Brand Footer */}
        <div className="mt-8 text-center space-y-1">
          <p className="text-[11px] font-semibold text-neutral-600">
            Engineered &amp; Crafted by <span className="text-neutral-900 font-bold">Bima Maulana Saputra</span>
          </p>
          <p className="text-[10px] text-neutral-400">
            Sovereign B2B Sales Engine &bull; v1.0.0
          </p>
        </div>
      </div>
    </div>
  );
}
