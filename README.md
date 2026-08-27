# 🦅 Nyales24/7 (DSR 360)
### **The Autonomous B2B Sales Operating System & CRM for Industrial Lubricant Distribution**
*Dedicated for **PT Harapan Utama Motor** (Official Shell Commercial Lubricants Distributor)*  
*Engineered by **Bima Maulana Saputra***

[![Production Deployment](https://img.shields.io/badge/Deployment-Live%20on%20Vercel-success?style=for-the-badge&logo=vercel)](https://nyalesagain.vercel.app)
[![Next.js 16](https://img.shields.io/badge/Next.js-16.3.2%20(Turbopack)-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8%2B-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com)
[![Tailwind CSS v4](https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-38B2AC?style=for-the-badge&logo=tailwind_css)](https://tailwindcss.com)

---

## 🌐 Live Production Application
* **Production URL:** 👉 **[https://nyalesagain.vercel.app](https://nyalesagain.vercel.app)**
* **Default Login Role:** DSR (Distributor Sales Representative) & Sales Manager

---

## 📖 Ringkasan & Filosofi Produk

**Nyales24/7 (DSR 360)** adalah platform **B2B Sales Operating System & Field Sales Force Automation (SFA)** pertama di Indonesia yang dirancang khusus untuk operasional penjualan pelumas industri & komersial Shell. 

Aplikasi ini mengeliminasi inefisiensi sales lapangan tradisional—mulai dari kalkulasi margin harga distributor manual, pengetikan draf SPH yang lambat, rute kunjungan yang tidak terarah, hingga ketiadaan data spesifikasi teknis pelumas saat pitching ke kepala pabrik—menjadi satu alur kerja digital yang presisi, cepat, dan terukur 24/7.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             NYALES24/7 ECOSYSTEM                            │
├───────────────────┬───────────────────┬───────────────────┬─────────────────┤
│   SFA & VISITS    │   PIPELINE 360    │  PRICING & CPQ    │   HERMES SUITE  │
│  GPS Geofencing   │  7-Stage Deals    │  Floor Price      │  TSP Multi-Stop │
│  Native Camera    │  Volume in Liters │  Distributor Fee  │  Nightly Audit  │
│  Offline Cache    │  Lost Reason Code │  TCO/ROI Calc     │  Quota Pacing   │
└───────────────────┴───────────────────┴───────────────────┴─────────────────┘
```

---

## ✨ Fitur-Fitur Utama (Core Features)

### 1. 🛢️ Master Katalog Shell EPC Indonesia (443 SKUs)
* **Basis Data Teknis Asli (TDS & MSDS):** Terintegrasi langsung dengan referensi resmi **[Shell Electronic Product Catalogue (Shell EPC Indonesia)](https://www.epc.shell.com/Home/CountryList?countryId=ID)**.
* **Karakteristik Fisik ASTM/ISO:** Parameter viskositas ASTM D445 (@40°C & @100°C), VI, Flash Point, Pour Point, Total Base Number (TBN), dan dropping point.
* **18 Filter Pill Cepat:** Saring 443 SKU dalam 1 tap (*Tellus, Omala, Rimula, Gadus, Spirax, Corena, Turbo, Argina, Mysella, Morlina, Diala, Tonna, Refrigeration, Heat Transfer, Cassida Food Grade, AeroShell, Coolant, Helix, Advance*).
* **AI LubeExpert:** Konsultasi kecocokan mesin (kompresor, pompa hidrolik Rexroth/Vickers, genset Wärtsilä/Cummins) langsung via Gemini AI.

### 2. 🧮 Commercial Pricing Engine & CPQ
* **Kalkulator Floor Price & Margin Distributor:** Perhitungan harga jual otomatis dengan margin minimal distributor, PPN 11%, dan komisi fee DSR per Liter.
* **Konversi Multi-Kemasan Otomatis:** Perhitungan otomatis Drum (209L), Pail (20L), Galon (4L), dan Botol (1L).
* **Kalkulator TCO & Penghematan Energi:** Alat bantu pitching untuk membuktikan penghematan konsumsi listrik dan perpanjangan *drain interval* oli sintetis Shell vs kompetitor.

### 3. 📍 SFA Lapangan & GPS Geofencing
* **Validasi Lokasi Kunjungan GPS:** Check-in / Check-out dengan perhitungan jarak deviasi meter dari koordinat pabrik untuk mencegah manipulasi absensi.
* **Native Camera Capture:** Pengambilan foto kondisi pabrik, tangki penyimpanan, atau banner POPSA langsung dari kamera belakang HP (`capture="environment"`).
* **Kompresi Gambar Canvas Sisi Klien:** Foto dikompresi otomatis ke resolusi optimal (max 1200px JPEG 0.75) sebelum disimpan ke Supabase Storage, menghemat kuota seluler DSR.

### 4. 🗺️ Hermes Geospatial Route Optimizer (TSP Engine)
* **Algoritma Multi-Stop Traveling Salesperson (TSP):** Mengurutkan 3–6 rute pabrik target berdasarkan kedekatan geografis di kawasan industri Jawa Barat (*Bandung Raya, Sukabumi, Cikarang, Karawang, Bogor, Purwakarta, Cirebon*).
* **1-Click Turn-by-Turn Navigation:** Tautan instan ke Google Maps & Waze untuk panduan navigasi sepeda motor maupun mobil sales.
* **Bulk Visit Scheduling:** 1-klik untuk memasukkan seluruh rencana rute ke jadwal kunjungan harian CRM.

### 5. 🎯 Individual Quota Calibration & Radial Pacing
* **Target Kuota Individual Dinamis:**
  * **Angga Permadi** (`angga.permadi59@gmail.com`): Area **Sukabumi**, Target **78.000 L/tahun** (6.500 L/bulan, Rp 325 Juta/bulan).
  * **Bima Maulana** (`bimasaputra.hum@gmail.com`): Area **Bandung**, Target **50.000 L/tahun** (4.521 L/bulan, Rp 226 Juta/bulan).
* **Radial Pacing Gauge:** Memantau defisit/surplus target harian dan bulanan secara visual dan real-time.
* **Manager Team Leaderboard:** Peringkat tim sales dan macro territory pacing untuk pengawasan eksekutif.

### 6. 🤖 Hermes 3 Autonomous Nightly AI Dispatcher
* **Audit Portofolio Akun Otonom:** Memindai seluruh akun customer setiap malam.
* **Deteksi Dini Churn Risk:** Menemukan akun Priority A/B yang tidak dikunjungi > 14 hari.
* **Stagnant Deal Rescue:** Mendiagnosis peluang pipeline yang macet di tahap proposal/negosiasi dan merumuskan taktik eksekusi pagi hari.

---

## 🛠️ Tech Stack & Arsitektur Sistem

* **Core Framework:** [Next.js 16.3.2](https://nextjs.org/) (App Router, React 19, Turbopack)
* **Language:** TypeScript 5.8 (Strict Type Safety)
* **Styling & UI:** Tailwind CSS v4, Lucide Icons, Warm Brutalist Design Tokens
* **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL 16, Row Level Security, SSR Session via Cookie Proxy `proxy.ts`)
* **AI & LLM Reasoning:** Google Gemini 2.5 Flash & Gemini Pro (`@google/genai`)
* **Observability & Analytics:** `@vercel/speed-insights` & `@vercel/analytics`
* **Hosting & CDN:** [Vercel](https://vercel.com/) (Global Edge Network, Serverless Actions)

---

## 🏗️ Struktur Direktori Proyek

```
dsr360/
├── app/
│   ├── (auth)/
│   │   └── login/                 # Halaman Login Client-side Supabase Auth
│   ├── (protected)/               # Halaman Berotentikasi (Dijaga proxy.ts)
│   │   ├── dashboard/             # DSR Gauge & Manager Leaderboard
│   │   ├── customers/             # CRM Akun Pabrik, PIC, & History
│   │   ├── visits/                # SFA Visit Logging, GPS & Native Camera
│   │   │   ├── [id]/log/          # Formulir Check-out & Log Kunjungan
│   │   │   ├── plan/              # Hermes TSP Multi-Stop Route Optimizer
│   │   │   └── quick/             # Quick Visit Logger Kilat
│   │   ├── pipeline/              # Kanban & List 7-Stage Deal Flow
│   │   ├── follow-ups/            # Task Engine & Hermes Nightly Radar
│   │   └── calculator/            # Commercial Floor Price & TCO ROI Calculator
│   ├── layout.tsx                 # Root Layout + SpeedInsights + Analytics
│   └── manifest.webmanifest       # PWA Mobile Standalone Configuration
├── components/
│   ├── auth/                      # Login form & Session management
│   ├── dashboard/                 # Radial Pacing Gauge, Metrics, Desktop Nav
│   ├── customers/                 # Customer Dossier & Multi-Branch Matrix
│   ├── visits/                    # Visit Log, Native Photo Uploader, Route Planner
│   ├── pipeline/                  # Deal Stage Kanban & Multi-SKU Line Items
│   ├── products/                  # Shell EPC Technical Sheet Modal (443 SKUs)
│   └── follow-ups/                # AI Follow-up Cards & Hermes Trigger
├── actions/                       # Next.js Server Actions (Database Mutations)
│   ├── dashboard.ts               # DSR Metrics & Quota Resolvers
│   ├── manager.ts                 # Leaderboard & Territory Macro Tracking
│   ├── route-optimizer.ts         # Hermes Geospatial TSP Optimizer Action
│   └── ai.ts                      # Gemini AI Sparring & LubeExpert Actions
├── lib/
│   ├── supabase/                  # Server, Client & Proxy Middleware Config
│   ├── constants/                 # Shell Technical Data, Shell Pricing DB, Enums
│   ├── utils/                     # Geo-route Haversine, Formatters, WhatsApp
│   └── ai/                        # Gemini SDK Client & Hermes Nightly Agent
└── proxy.ts                       # Next.js 16 Session Proxy Matcher
```

---

## 📜 Riwayat Evolusi & Catatan Rilis (Version History)

### **Phase 13 (Current): Hermes Intelligence Suite & Global EPC Calibration**
* ✅ **Shell EPC Indonesia (443 SKUs):** Integrasi penuh spesifikasi teknis grounded, standar ASTM D445, persetujuan OEM asli (*Siemens Flender, Rexroth, Cummins, Caterpillar, Wärtsilä*), serta protokol keselamatan MSDS.
* ✅ **Hermes TSP Route Optimizer:** Optimasi rute kunjungan kawasan industri Jawa Barat (*Bandung, Sukabumi, Cikarang, Karawang, Bogor, Purwakarta*) dengan navigasi 1-klik ke Google Maps / Waze.
* ✅ **Observability:** Integrasi `@vercel/speed-insights` dan `@vercel/analytics` pada root layout.

### **Phase 12: Individual DSR Quota Calibration Engine & Vercel Live**
* ✅ **Dynamic Rep Targets:** Kalibrasi target kuota individual (Angga Permadi 78k L/thn di Sukabumi & Bima Saputra 50k L/thn di Bandung).
* ✅ **Pacing Gauge Real-Time:** Sinkronisasi visual radial pacing ke Dashboard DSR dan Leaderboard Manager.
* ✅ **Live Vercel Production:** Migrasi dan verifikasi live di domain `https://nyalesagain.vercel.app`.

### **Phase 11: Commercial Floor Price Engine & Native Camera SFA**
* ✅ **Native Camera Capture:** Pemicu kamera belakang ponsel dengan kompresor Canvas Base64 otomatis.
* ✅ **Kalkulator Floor Price Distributor:** Perhitungan margin laba, PPN 11%, dan fee DSR per Liter.
* ✅ **Brand Masterpiece (Concept 4):** Standardisasi logo Brutalist Monogram 'N' dengan aksen Shell Amber.

### **Phase 8 - 10: AI Sparring & Deal Velocity Engine**
* ✅ **AI Sparring Partner "Bang Radit":** Konsultasi taktik penjualan dan simulasi keberatan harga customer berbasis Gemini AI.
* ✅ **PWA Standalone Mode:** Dukungan penuh untuk instalasi di Android & iOS dengan touch target > 44px.
* ✅ **7-Stage Pipeline:** Manajemen deal industri dengan rincian multi-line item dan analisis alasan Lost deal.

### **Phase 1 - 7: Arsitektur Pondasi & Core CRM**
* ✅ Next.js 16 App Router + Turbopack, Supabase SSR Auth, RBAC Role (`DSR`, `MANAGER`, `ADMIN`).
* ✅ Manajemen data customer B2B (Priority A/B/C, PIC, titik koordinat GPS, jenis oli eksisting).
* ✅ SFA Check-in/Check-out dengan validasi radius Geofence.

---

## 🚀 Panduan Setup & Instalasi Lokal

### 1. Prasyarat Sistem
* **Node.js:** Versi 20.x atau lebih baru (Node 22 LTS direkomendasikan)
* **NPM / PNPM:** Versi 10.x+
* **Akun Supabase:** Proyek PostgreSQL dengan ekstensi `uuid-ossp` dan PostGIS aktif

### 2. Kloning Repositori
```bash
git clone https://github.com/48ms/dsr360-Final.git
cd dsr360
```

### 3. Konfigurasi Environment Variables
Buat file `.env.local` di root direktori:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GEMINI_API_KEY=your-gemini-api-key
```

### 4. Setup Database Supabase
Jalankan skrip `supabase-schema.sql` di **Supabase SQL Editor** untuk membangun tabel, relasi, RLS policies, trigger otomatis, dan master seed data 443 SKU.

### 5. Install Dependensi & Jalankan Dev Server
```bash
npm install
npm run dev
```
Buka browser di **`http://localhost:3000`**.

### 6. Build Validasi Produksi
```bash
npm run build
```

---

## 👥 Profil Wilayah & Konfigurasi Kuota DSR

| Peran & Teritori | Identitas Demo / Alias | Wilayah / Area | Target Kuota Tahunan | Target Kuota Bulanan |
|---|---|:---:|:---:|:---:|
| **DSR Sukabumi** | `dsr.sukabumi@pt-hum.co.id` | **Sukabumi & Sekitarnya** | **78.000 Liter** | **6.500 Liter** *(Rp 325 Jt)* |
| **DSR Bandung** | `dsr.bandung@pt-hum.co.id` | **Bandung Raya** | **50.000 Liter** | **4.521 Liter** *(Rp 226 Jt)* |
| **Sales Manager** | `manager@pt-hum.co.id` | **All West Java** | *Macro Supervision* | *Macro Leaderboard* |

---

## 🔒 Lisensi & Hak Cipta

Didesain dan dikembangkan secara khusus untuk **PT Harapan Utama Motor** (Distributor Resmi Pelumas Shell). Seluruh hak cipta dilindungi undang-undang.
