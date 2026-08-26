import { getTerritoryOptimizationDataAction } from "@/actions/route-optimizer";
import { SmartRoutePlannerClient } from "@/components/visits/smart-route-planner-client";

export const metadata = {
  title: "Hermes Smart Territory Route & Quota Optimizer - DSR360",
  description: "Optimasi rute kunjungan sales multi-stop berdasarkan kedekatan geografis dan bobot pencapaian kuota bulanan.",
};

export default async function VisitsPlanPage() {
  const data = await getTerritoryOptimizationDataAction();

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <SmartRoutePlannerClient initialData={data} />
    </div>
  );
}
