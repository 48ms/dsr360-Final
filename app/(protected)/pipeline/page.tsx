import { listOpportunities } from "@/actions/opportunities";
import { PipelineListClient } from "@/components/pipeline/pipeline-list-client";
import type { OpportunityItem } from "@/components/pipeline/opportunity-card";

import type { OpportunityStage } from "@/constants/enums";

export const dynamic = "force-dynamic";

export default async function PipelinePage({
  searchParams,
}: {
  searchParams: Promise<{ stage?: string; search?: string }>;
}) {
  const params = await searchParams;
  const { opportunities, totalValue, stageStats } = await listOpportunities({
    stage: params.stage as OpportunityStage | undefined,
    search: params.search,
  });

  const oppItems: OpportunityItem[] = opportunities.map((o) => ({
    id: o.id,
    opportunity_name: o.opportunity_name,
    stage: o.stage,
    status: o.status,
    potential_volume: o.potential_volume,
    potential_value: o.potential_value,
    probability: o.probability,
    expected_close_date: o.expected_close_date,
    next_action: o.next_action,
    next_action_date: o.next_action_date,
    customer: o.customer ? {
      id: o.customer.id,
      customer_name: o.customer.customer_name,
      customer_code: o.customer.customer_code,
      city: o.customer.city,
      segment: o.customer.segment,
      priority: o.customer.priority,
    } : null,
    product: o.product ? {
      id: o.product.id,
      brand: o.product.brand,
      product_name: o.product.product_name,
      viscosity: o.product.viscosity,
    } : null,
    competitor: o.competitor ? {
      id: o.competitor.id,
      brand: o.competitor.brand,
      product_name: o.competitor.product_name,
    } : null,
  }));

  return (
    <PipelineListClient
      initialOpportunities={oppItems}
      totalValue={totalValue}
      stageStats={stageStats}
    />
  );
}
