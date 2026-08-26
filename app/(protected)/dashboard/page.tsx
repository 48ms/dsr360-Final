import { getDashboardData } from "@/actions/dashboard";
import { getMasterProducts } from "@/actions/visits";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [dashboardData, products] = await Promise.all([
    getDashboardData(),
    getMasterProducts(),
  ]);

  return <DashboardClient data={dashboardData} products={products} />;
}
