import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        secure: false, // Critical: Allows auth cookies over local LAN HTTP (192.168.x.x) on mobile devices
        sameSite: "lax",
        path: "/",
      },
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, {
                ...options,
                secure: false,
                sameSite: "lax",
                path: "/",
              })
            );
          } catch {
            // Dilempar kalau dipanggil dari Server Component (bukan Action/Route Handler).
            // Aman diabaikan selama ada middleware/proxy yang refresh session.
          }
        },
      },
    }
  );
}
