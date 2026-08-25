import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/actions/auth";
import { BottomNav } from "@/components/dashboard/bottom-nav";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();

  // Defense-in-depth: proxy.ts sudah cek session, ini cek tambahan di layer
  // Server Component kalau-kalau profile belum ke-provision atau nonaktif.
  if (!profile || !profile.is_active) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-full flex-col bg-neutral-50">
      <main className="flex-1 pb-20">{children}</main>
      <BottomNav />
    </div>
  );
}
