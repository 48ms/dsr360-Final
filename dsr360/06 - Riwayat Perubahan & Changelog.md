# 06 - Riwayat Perubahan & Changelog

#changelog #history #audit #fixes #releases

---

## 📈 Log Riwayat Pembaruan & Keputusan Arsitektur

### 🚀 Phase 13 (Latest): Sanitasi Database Quota & Audit Quality Cleanup
* **Refactoring Quota ke Supabase Database:**
  - Menghapus file `lib/constants/quotas.ts` yang berisi hardcode target penjualan dan data nama sales.
  - Menambahkan kolom `annual_quota_liter` dan `monthly_quota_liter` pada tabel `profiles` di Supabase.
  - Memperbarui Server Actions ([`actions/dashboard.ts`](file:///c:/Users/bimam/Downloads/dsr360-phase4-fix2/dsr360/actions/dashboard.ts), [`actions/manager.ts`](file:///c:/Users/bimam/Downloads/dsr360-phase4-fix2/dsr360/actions/manager.ts), [`actions/route-optimizer.ts`](file:///c:/Users/bimam/Downloads/dsr360-phase4-fix2/dsr360/actions/route-optimizer.ts)) untuk mengambil data target langsung dari profil user yang terproteksi RLS.
* **Audit Presisi Teknis Shell (TDS / MSDS):**
  - Mengoreksi penulisan approval pump test resmi: *Denison T6H20C, Denison T6C, Vickers 35VQ25*.
  - Menyematkan Safety & Legal Field Guide banner terhubung ke portal resmi Shell EPC (`epc.shell.com`).
* **Pemulihan Kualitas Kode (0 ESLint Error & Warning):**
  - Mengeliminasi seluruh tipe `any` dan memperbaiki reaktivitas React 19 Compiler.
  - Memastikan `npm run lint` dan `npm run build` lolos 100% tanpa kompromi.

---

### 📦 Phase 12: Manajemen Customer & Quick Edit Potensi
* **Fitur Hapus Customer Aman:**
  - Menambahkan modal konfirmasi hapus customer dan server action `deleteCustomer` dengan pembersihan berjenjang (*cascade cleanup*).
* **Badge Quick Edit Potensi (Monthly Volume):**
  - Live dual-converter Drum $\leftrightarrow$ Liter dengan estimasi nilai omzet Rupiah dan penentuan otomatis tier prioritas (`A`, `B`, `C`).

---

### 🗺️ Phase 11: Hermes Geospatial TSP Route Optimizer
* **Rute Keliling Multi-Stop Kawasan Industri:**
  - Optimasi rute berbasis algoritma TSP dengan pembobotan prioritas akun, deal stage, dan task overdue.
  - Opsi titik keberangkatan real-time via GPS Geolocation perangkat atau kawasan industri terdekat.
  - Integrasi 1-klik navigasi ke Google Maps & Waze.

---

### 📄 Phase 10: Official SPH Engine & Kalkulator Harga PT HUM
* **Generator Penawaran SPH A4 Resmi:**
  - Format 1 lembar A4 dengan kop surat resmi PT HUM, stempel Solo, tanda tangan resmi DSR, dan integrasi WhatsApp.
  - Formula perhitungan Floor Price (Markup Divisor 52%), PPh Selisih 25%, dan Tabel TER Golongan 1–7.

---

### ⚡ Phase 1–9: Fondasi Inti CRM & AI Sparring
* Setup database Supabase PostgreSQL dengan RLS, pipeline kanban, modul POPSA visit log, photo uploader terkompresi, dan sparring partner Google Gemini.

---
[[Welcome]] | [[00 - Project Overview & Memory Index]] | [[01 - Arsitektur & 5 Pilar Otomasi]]
