import { redirect } from "next/navigation";

export default async function VisitsPlanRedirectPage({
  searchParams,
}: {
  searchParams: Promise<{ customerId?: string }>;
}) {
  const params = await searchParams;
  if (params.customerId) {
    redirect(`/visits/new?customerId=${params.customerId}`);
  }
  redirect("/visits/new");
}
