import { Suspense } from "react";
import {
  getCustomersForSphAction,
  generateSphNumberAction,
} from "@/actions/sph-calculator";
import { PriceFeeCalculatorClient } from "@/components/calculator/price-fee-calculator-client";

export const metadata = {
  title: "Kalkulator Harga, Fee & SPH | DSR360",
  description: "Autonomous SPH Generator & Live Sales Commission Matrix PT Harapan Utama Motor",
};

export default async function CalculatorPage({
  searchParams,
}: {
  searchParams: Promise<{ customerId?: string }>;
}) {
  const params = await searchParams;
  const initialCustomerId = params?.customerId || null;

  const [{ customers, contacts }, defaultSphNumber] = await Promise.all([
    getCustomersForSphAction(),
    generateSphNumberAction(),
  ]);

  return (
    <main className="container mx-auto px-4 py-6 max-w-5xl">
      <Suspense fallback={<div className="p-8 text-center text-xs text-neutral-500">Memuat database harga Shell PT HUM...</div>}>
        <PriceFeeCalculatorClient
          customers={customers}
          contacts={contacts}
          defaultSphNumber={defaultSphNumber}
          initialCustomerId={initialCustomerId}
        />
      </Suspense>
    </main>
  );
}
