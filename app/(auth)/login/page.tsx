import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-4 py-12 sm:px-6">
      <div className="mx-auto w-full max-w-sm">
        {/* Brand Card Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-900 shadow-md ring-1 ring-neutral-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 192 192"
              className="h-12 w-12"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="dsrGradLogin" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#D97706" />
                </linearGradient>
              </defs>
              <circle
                cx="96"
                cy="96"
                r="68"
                fill="none"
                stroke="url(#dsrGradLogin)"
                strokeWidth="8"
                strokeDasharray="300 70"
                strokeLinecap="round"
              />
              <path
                d="M96 45 C96 45, 60 95, 60 120 C60 140, 76 156, 96 156 C116 156, 132 140, 132 120 C132 95, 96 45, 96 45 Z"
                fill="url(#dsrGradLogin)"
              />
              <text
                x="96"
                y="126"
                fontFamily="system-ui, -apple-system, sans-serif"
                fontSize="22"
                fontWeight="900"
                fill="#FFFFFF"
                textAnchor="middle"
              >
                DSR
              </text>
              <text
                x="96"
                y="140"
                fontFamily="system-ui, -apple-system, sans-serif"
                fontSize="11"
                fontWeight="800"
                fill="#FEF3C7"
                textAnchor="middle"
                letterSpacing="1"
              >
                360
              </text>
            </svg>
          </div>
          <h1 className="text-2xl font-black text-neutral-900 tracking-tight">DSR360</h1>
          <p className="mt-1 text-xs font-medium text-neutral-500">
            Sales Visit & Pipeline Management
          </p>
        </div>

        {/* Card Form */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <LoginForm />
        </div>

        {/* Brand Footer */}
        <div className="mt-8 text-center space-y-1">
          <p className="text-xs font-semibold text-neutral-600">
            PT Harapan Utama Motor
          </p>
          <p className="text-[11px] text-neutral-400">
            Distributor Resmi Shell Lubricants &bull; v1.0
          </p>
        </div>
      </div>
    </div>
  );
}
