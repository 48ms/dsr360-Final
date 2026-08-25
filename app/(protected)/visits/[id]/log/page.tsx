import { getVisitDetail, getMasterProducts, getCompetitors } from "@/actions/visits";
import { VisitLogForm } from "@/components/visits/visit-log-form";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function VisitLogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [visitDetail, masterProducts, competitors] = await Promise.all([
    getVisitDetail(id),
    getMasterProducts(),
    getCompetitors(),
  ]);

  if (!visitDetail || !visitDetail.visit) {
    notFound();
  }

  return (
    <VisitLogForm
      visit={{
        id: visitDetail.visit.id,
        customer_id: visitDetail.visit.customer_id,
        start_time: visitDetail.visit.start_time,
        visit_date: visitDetail.visit.visit_date,
        customer: visitDetail.customer,
      }}
      masterProducts={masterProducts ?? []}
      competitors={competitors ?? []}
    />
  );
}
