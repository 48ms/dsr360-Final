import { listFollowUps } from "@/actions/follow-ups";
import { listCustomers } from "@/actions/customers";
import { FollowUpListClient } from "@/components/follow-ups/follow-up-list-client";

export const dynamic = "force-dynamic";

export default async function FollowUpsPage() {
  const [followUps, customers] = await Promise.all([
    listFollowUps(),
    listCustomers(),
  ]);

  const customerOptions = (customers ?? []).map((c) => ({
    id: c.id,
    customer_name: c.customer_name,
    city: c.city,
  }));

  return (
    <FollowUpListClient
      initialFollowUps={followUps}
      customers={customerOptions}
    />
  );
}
