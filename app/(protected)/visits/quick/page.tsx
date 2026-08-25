import { listCustomers } from "@/actions/customers";
import { getMasterProducts } from "@/actions/visits";
import { QuickVisitForm } from "@/components/visits/quick-visit-form";

export const dynamic = "force-dynamic";

export default async function QuickVisitPage() {
  const [customers, masterProducts] = await Promise.all([
    listCustomers(),
    getMasterProducts(),
  ]);

  const customerOptions = (customers ?? []).map((c) => ({
    id: c.id,
    customer_name: c.customer_name,
    customer_code: c.customer_code,
    city: c.city,
    segment: c.segment,
    priority: c.priority,
  }));

  return (
    <QuickVisitForm
      customers={customerOptions}
      masterProducts={masterProducts ?? []}
    />
  );
}
