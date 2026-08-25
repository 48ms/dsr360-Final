import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12">
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">
            <span className="text-xl">🛢️</span>
          </div>
          <h1 className="text-lg font-medium text-neutral-900">DSR360</h1>
          <p className="mt-1 text-xs text-neutral-500">B2B lubricant sales</p>
        </div>

        <LoginForm />

        <p className="mt-8 text-center text-xs text-neutral-400">
          v1.0 &middot; PT Harapan Utama Motor
        </p>
      </div>
    </div>
  );
}
