import { listCustomers } from "@/actions/customers";
import { CustomerListClient } from "@/components/customers/customer-list-client";
import type { Priority } from "@/constants/enums";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; priority?: string }>;
}) {
  const params = await searchParams;
  const customers = await listCustomers({
    search: params.search,
    priority: params.priority as Priority | undefined,
  });

  return <CustomerListClient customers={customers} />;
}
