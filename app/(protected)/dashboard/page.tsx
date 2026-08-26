import { getDashboardData } from "@/actions/dashboard";
import { getMasterProducts } from "@/actions/visits";
import { getManagerCommandCenterData } from "@/actions/manager";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [dashboardData, products, managerData] = await Promise.all([
    getDashboardData(),
    getMasterProducts(),
    getManagerCommandCenterData(),
  ]);

  return (
    <DashboardClient
      data={dashboardData}
      products={products}
      managerData={managerData}
    />
  );
}
