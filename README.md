# DSR360 — Final

B2B Sales Visit & Customer Management System untuk DSR (Distributor Sales
Representative) Shell Lubricants — PT Harapan Utama Motor.

## Tech stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Backend:** Supabase (PostgreSQL, Auth, Storage, RLS)
- **Form & validation:** react-hook-form + zod
- **Deployment:** Vercel

## Struktur project

```
app/
  (auth)/login/          → halaman login, tidak butuh session
  (protected)/           → semua halaman butuh login (dijaga oleh proxy.ts)
    dashboard/
    customers/
    visits/
    pipeline/
    follow-ups/
components/               → UI components, dikelompokkan per module
actions/                  → server actions (create/update/delete)
lib/
  supabase/                → client.ts (browser), server.ts (RSC/action), middleware.ts
  utils/                    → format.ts (currency/volume/tanggal), cn.ts
  validations/              → zod schema per form
constants/
  enums.ts                  → semua enum sesuai database spec V1
  nav.ts                     → konfigurasi bottom navigation
types/                       → type per entity + database.ts (generated Supabase CLI)
```

## Setup

1. Copy `.env.example` ke `.env.local`, isi dengan kredensial Supabase.
   **Pakai project Supabase terpisah untuk development dan production.**
2. `npm install`
3. `npm run dev`

## Roadmap

| Phase | Scope | Status |
|---|---|---|
| 1 | Foundation (Next.js, TS, Tailwind, struktur project) | ✅ Selesai |
| 2 | Database (Supabase, tabel, RLS, seed data) | ✅ Selesai |
| 3 | Authentication (login, profile, role) | ✅ Selesai |
| 4 | Customer CRM (list, detail, PIC, equipment, produk) | ✅ Selesai |
| 5 | Visit Management (planner, POPSA, log, GPS, timer, photo) | ✅ Selesai |
| 6 | Sales Pipeline & Follow-up Task Engine | ✅ Selesai |
| 7 | Dashboard (KPI, Priority Today alerts, Pipeline Value) | ✅ Selesai |
| 8 | PWA (installable, mobile UI, offline foundation) | ✅ Selesai |
| 9 | Intelligence / V2 (AI Assistant, Note Extractor, Battlecards) | ✅ Selesai |

## Working principles

- POPSA di V1 diisi manual — AI generator baru masuk Phase 9.
- Format Rupiah/liter/tanggal selalu lewat `lib/utils/format.ts`, jangan manual.
- Timezone konsisten `Asia/Jakarta` (WIB).
- Data lama di Google Sheets (1,390 customer) tidak dimigrasi — DSR360 mulai
  fresh, Sheets tetap jadi arsip.
- Duplicate detection wajib ada di form Add Customer.
- Loading/error/empty state didesain barengan tiap fitur, bukan ditambah belakangan.
