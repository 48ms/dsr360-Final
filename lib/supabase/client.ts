import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        secure: false, // Critical: Allows auth cookies over local LAN HTTP (192.168.x.x) on mobile devices
        sameSite: "lax",
        path: "/",
      },
    }
  );
}
