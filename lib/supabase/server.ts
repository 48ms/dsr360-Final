import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

// Dipakai di Server Component & Server Action.
// Next.js App Router butuh instance terpisah dari client.ts (browser)
// karena cara baca/tulis cookie session-nya beda.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Dilempar kalau dipanggil dari Server Component (bukan Action/Route Handler).
            // Aman diabaikan selama ada middleware yang refresh session.
          }
        },
      },
    }
  );
}
