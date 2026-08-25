import { getVisitDetail } from "@/actions/visits";
import { StartVisitClient, type StartVisitData } from "@/components/visits/start-visit-client";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function StartVisitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const visitDetail = await getVisitDetail(id);

  if (!visitDetail || !visitDetail.visit) {
    notFound();
  }

  const startVisitData: StartVisitData = {
    id: visitDetail.visit.id,
    visit_date: visitDetail.visit.visit_date,
    visit_type: visitDetail.visit.visit_type,
    visit_status: visitDetail.visit.visit_status,
    purpose: visitDetail.visit.purpose,
    start_time: visitDetail.visit.start_time,
    customer: visitDetail.customer,
    popsa: visitDetail.popsa,
  };

  return <StartVisitClient visitData={startVisitData} />;
}
