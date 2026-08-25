import { listCustomers } from "@/actions/customers";
import { PlanVisitForm } from "@/components/visits/plan-visit-form";

export const dynamic = "force-dynamic";

export default async function NewVisitPage({
  searchParams,
}: {
  searchParams: Promise<{ customerId?: string }>;
}) {
  const params = await searchParams;
  const customers = await listCustomers();

  const customerOptions = (customers ?? []).map((c) => ({
    id: c.id,
    customer_name: c.customer_name,
    customer_code: c.customer_code,
    city: c.city,
    segment: c.segment,
    priority: c.priority,
  }));

  return (
    <PlanVisitForm
      customers={customerOptions}
      defaultCustomerId={params.customerId}
    />
  );
}
