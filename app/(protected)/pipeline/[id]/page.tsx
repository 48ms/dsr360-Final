import { getOpportunityDetail } from "@/actions/opportunities";
import { getMasterProducts, getCompetitors } from "@/actions/visits";
import { listCustomers } from "@/actions/customers";
import { OpportunityDetailClient } from "@/components/pipeline/opportunity-detail-client";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [detail, masterProducts, competitors, customers] = await Promise.all([
    getOpportunityDetail(id),
    getMasterProducts(),
    getCompetitors(),
    listCustomers(),
  ]);

  if (!detail || !detail.opportunity) {
    notFound();
  }

  const customerOptions = (customers ?? []).map((c) => ({
    id: c.id,
    customer_name: c.customer_name,
    customer_code: c.customer_code,
    city: c.city,
    segment: c.segment,
  }));

  return (
    <OpportunityDetailClient
      data={detail}
      masterProducts={masterProducts ?? []}
      competitors={competitors ?? []}
      customers={customerOptions}
    />
  );
}
