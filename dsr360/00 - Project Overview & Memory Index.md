# 00 - Project Overview & Memory Index

#b2b #sales #dsr360 #shell-lubricants #architecture

---

## 🎯 Identitas Produk
* **Nama Aplikasi:** **Nyales24/7** (DSR360 Industrial Sales Super-App)
* **Distributor Resmi:** **PT Harapan Utama Motor (PT HUM)** — Authorized Distributor Shell Lubricants (Jawa Barat & Jawa Tengah).
* **Profil Pengguna Utama:** Distributor Sales Representative (DSR) & Area Sales Managers (ASM) yang mengelola akun manufaktur, pabrik tekstil, F&B, semen, pertambangan, dan armada komersial di koridor industri (Cikarang, Karawang, Cimahi, Bandung, Subang, Sukabumi, Solo).

---

## 💡 Masalah & Solusi Bisnis

### Masalah Lapangan (The Friction):
1. **Kalkulasi Harga Lambat:** DSR harus menunggu tim admin kantor untuk menghitung margin, potongan fee pihak ketiga, dan PPN 11% saat berhadapan dengan Purchasing Manager.
2. **Keterlambatan SPH:** Pembuatan Surat Penawaran Harga (SPH) resmi makan waktu berjam-jam/berhari-hari di kantor.
3. **Data Kunjungan Berserakan:** Catatan teknis mesin, jam operasional oli (*drain interval*), dan follow-up terserak di chat WhatsApp atau buku catatan fisik.
4. **Rute Kunjungan Tidak Efisien:** Perjalanan antar pabrik sering kali bolak-balik tanpa prioritas pipeline dan kuota bulanan.

### Solusi Nyales24/7:
* **Kalkulator Harga & Fee Instan:** 223+ SKU Shell resmi dengan formula Floor Price 52% PT HUM dan perhitungan insentif TER Golongan 1–7.
* **1-Click Official SPH Generator:** Cetak dokumen A4 resmi ber-kop surat PT HUM lengkap dengan tanda tangan & stempel sah (`/images/sph/bima_signature_stamp.png`) langsung dikirim via WhatsApp.
* **POPSA Field Framework:** Panduan persiapan meeting terstruktur (*Purpose, Objective, Premises, Strategy, Anticipate*) dengan sparring simulasi AI.
* **Hermes Route & Quota Optimizer:** Penjadwalan rute keliling kawasan industri berbasis TSP (*Traveling Salesperson Problem*) dengan GPS live tracking dan bobot nilai deal.
* **5 Pilar Otomasi Terintegrasi:** Setiap aksi di satu modul langsung memperbarui status di seluruh aplikasi tanpa input ganda.

---

## 🛡️ Prinsip Desain & Kualitas
1. **Zero Field Friction:** Input minimal, respons instan (<1 detik), mobile-first responsive.
2. **Mathematical Rigor:** Perhitungan harga patuh 100% pada aturan audit margin distributor dan perpajakan (PPh Selisih 25%, PPN 11%).
3. **Privacy & Security First:** Tidak ada data PII atau target kuota personal yang di-hardcode di kode publik. Seluruh data sensitif berada di Supabase PostgreSQL dengan proteksi Row Level Security (RLS).
4. **Code Quality Excellence:** Zero ESLint errors/warnings (`npm run lint`), strict TypeScript typing, dan build Next.js 16 yang selalu stabil.

---
[[Welcome]] | [[01 - Arsitektur & 5 Pilar Otomasi]] | [[02 - Database Schema & Supabase RLS]]
