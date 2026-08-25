import { getOpportunityDetail } from "@/actions/opportunities";
import { OpportunityDetailClient, type OpportunityDetailData } from "@/components/pipeline/opportunity-detail-client";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const detail = await getOpportunityDetail(id);

  if (!detail || !detail.opportunity) {
    notFound();
  }

  return <OpportunityDetailClient data={detail as unknown as OpportunityDetailData} />;
}
