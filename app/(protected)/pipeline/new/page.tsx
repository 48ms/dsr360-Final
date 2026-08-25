import { listCustomers } from "@/actions/customers";
import { getMasterProducts, getCompetitors } from "@/actions/visits";
import { OpportunityForm } from "@/components/pipeline/opportunity-form";

export const dynamic = "force-dynamic";

export default async function NewOpportunityPage({
  searchParams,
}: {
  searchParams: Promise<{ customerId?: string }>;
}) {
  const params = await searchParams;
  const [customers, masterProducts, competitors] = await Promise.all([
    listCustomers(),
    getMasterProducts(),
    getCompetitors(),
  ]);

  const customerOptions = (customers ?? []).map((c) => ({
    id: c.id,
    customer_name: c.customer_name,
    customer_code: c.customer_code,
    city: c.city,
    segment: c.segment,
  }));

  return (
    <OpportunityForm
      customers={customerOptions}
      masterProducts={masterProducts ?? []}
      competitors={competitors ?? []}
      defaultCustomerId={params.customerId}
    />
  );
}
