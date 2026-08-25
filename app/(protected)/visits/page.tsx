import { listVisits } from "@/actions/visits";
import { VisitListClient } from "@/components/visits/visit-list-client";
import type { VisitCardItem } from "@/components/visits/visit-card";

export const dynamic = "force-dynamic";

export default async function VisitsPage() {
  const rawVisits = await listVisits();
  
  // Transform to VisitCardItem
  const visits: VisitCardItem[] = rawVisits.map((v) => ({
    id: v.id,
    visit_date: v.visit_date,
    visit_type: v.visit_type,
    visit_status: v.visit_status,
    purpose: v.purpose,
    discussion: v.discussion,
    start_time: v.start_time,
    end_time: v.end_time,
    duration_minutes: v.duration_minutes,
    opportunity_found: v.opportunity_found ?? false,
    customer: v.customer ? {
      id: v.customer.id,
      customer_name: v.customer.customer_name,
      customer_code: v.customer.customer_code,
      city: v.customer.city,
      priority: v.customer.priority,
      segment: v.customer.segment,
    } : null,
    popsa: Array.isArray(v.popsa) ? v.popsa[0] : v.popsa,
  }));

  return <VisitListClient initialVisits={visits} />;
}
