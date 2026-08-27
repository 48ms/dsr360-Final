import { LoginForm } from "@/components/auth/login-form";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-4 py-10 sm:px-6 bg-[#FDFBF7]">
      <div className="mx-auto w-full max-w-sm">
        {/* Brand Card Header */}
        <div className="mb-6 text-center space-y-3">
          {/* Official Concept 4 Logo Mark */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#09090B] border-2 border-amber-500/80 shadow-md shadow-amber-950/20 relative overflow-hidden group">
            <Image
              src="/icons/nyales247-mark.svg"
              alt="Nyales24/7 Official Logo"
              width={56}
              height={56}
              className="h-14 w-14 object-contain drop-shadow-sm group-hover:scale-105 transition duration-300"
              priority
            />
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
