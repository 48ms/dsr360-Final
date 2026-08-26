import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Jalankan proxy di semua route KECUALI:
     * - static file (_next/static, _next/image, favicon, dll)
     * - asset gambar, logos, icons, manifest
     */
    "/((?!_next/static|_next/image|favicon.ico|favicon.svg|manifest.json|manifest.webmanifest|logos|icons|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
