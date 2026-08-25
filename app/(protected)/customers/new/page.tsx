import { CustomerForm } from "@/components/customers/customer-form";

export default function NewCustomerPage() {
  return (
    <div>
      <div className="border-b border-neutral-200 p-4">
        <h1 className="text-lg font-medium text-neutral-900">Tambah Customer</h1>
      </div>
      <CustomerForm />
    </div>
  );
}
