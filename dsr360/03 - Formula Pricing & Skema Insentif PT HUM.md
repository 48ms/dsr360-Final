# 03 - Formula Pricing & Skema Insentif PT HUM

#pricing #sph #formulas #pt-hum #incentives

---

## 💰 Filosofi & Aturan Pricing PT Harapan Utama Motor

PT Harapan Utama Motor menerapkan sistem kalkulasi harga berbasis **Floor Price** dan kepatuhan margin distributor untuk setiap transaksi pelumas industri Shell (Drum 209L & Pail 20L).

---

## 📐 Formula Matematika Resmi

### 1. Skema Floor Price & Fee Pihak Ketiga
Ketika ada fee komisi yang dialokasikan ke perantara/pihak ketiga, harga penawaran minimum (*Floor Price*) dihitung dengan rumus:

$$\text{Floor Price} = \text{ROUNDUP}\left( \text{MSP} + \frac{\text{Fee Satuan}}{0.52}, 0 \right)$$

* **$\text{MSP}$ (Minimum Selling Price):** Harga dasar modal produk Shell resmi distributor.
* **$\text{Fee Satuan}$:** Nominal komisi pihak ketiga per unit drum/pail (IDR).
* **$0.52$ (Divisor Markup):** Faktor pembagi margin distributor PT HUM untuk menutup beban operasional & pajak selisih.

### 2. Pajak PPh Selisih 25%
Selisih antara harga jual penawaran dan dasar modal dikenakan estimasi pajak:

$$\text{PPh Selisih} = (\text{Harga Penawaran} - \text{MSP}) \times 25\%$$

$$\text{Net Margin Perusahaan} = (\text{Harga Penawaran} - \text{MSP}) - \text{Fee Pihak Ketiga} - \text{PPh Selisih}$$

### 3. PPN 11% (Pajak Pertambahan Nilai)
* Jika penawaran berstatus **Include PPN**: $\text{Total Invoice} = \text{Subtotal DPP} \times 1.11$
* Jika penawaran **Exclude PPN**: $\text{DPP} = \text{Subtotal Penawaran}$, PPN 11% ditambahkan terpisah pada tagihan akhir.

---

## 🎖️ Tabel Insentif Standar DSR (TER Golongan 1–7)

Jika transaksi tidak menggunakan fee pihak ketiga, pencapaian margin DSR dinilai berdasarkan tabel **Tarif Efektif Rata-rata (TER)**:

| Golongan | Persentase Margin Kotor | Insentif DSR (IDR / Liter) | Deskripsi Tingkat Margin |
|---|---|---|---|
| **Golongan 1** | $\ge 25\%$ | Rp 1.500 / L | Margin Sangat Tinggi (Premium Specialty) |
| **Golongan 2** | $20.0\% - 24.9\%$ | Rp 1.200 / L | Margin Tinggi (Synthetic / Special Greases) |
| **Golongan 3** | $15.0\% - 19.9\%$ | Rp 900 / L | Margin Menengah-Tinggi |
| **Golongan 4** | $10.0\% - 14.9\%$ | Rp 600 / L | Margin Standar (Omala, Tellus, Rimula) |
| **Golongan 5** | $7.0\% - 9.9\%$ | Rp 350 / L | Margin Tipis (Competitive Bid) |
| **Golongan 6** | $4.0\% - 6.9\%$ | Rp 150 / L | Margin Sangat Tipis (Volume Defense) |
| **Golongan 7** | $< 4.0\%$ | Rp 0 / L | Margin Minimum / Break-Even |

---

## 📄 Engine Dokumen SPH A4 Resmi PT HUM

Modul SPH Generator menghasilkan dokumen penawaran harga 1 halaman A4 dengan spesifikasi:
* **Header:** Kop Surat Resmi PT Harapan Utama Motor (`/images/sph/official_header_complete.png`).
* **Format Nomor Surat:** `SPH/DSR/HUM/YYYY/MM/XXXX`.
* **Tabel Penawaran 6 Kolom:** No, Nama Produk Shell, Kemasan (Drum/Pail), Volume, Harga Satuan (IDR), Total Harga.
* **Klausul Syarat & Ketentuan:**
  1. *Franco:* Lokasi pabrik pembeli.
  2. *Term of Payment (TOP):* 14/30/45 hari atau CBD/COD.
  3. *Masa Berlaku Harga:* 14 hari sejak tanggal surat diterbitkan.
  4. *Kualitas Produk:* 100% Original Shell Lubricants bersertifikasi CoA (*Certificate of Analysis*).
* **Footer & Stempel:** Stempel resmi PT Harapan Utama Motor Solo & Tanda Tangan DSR Bima Maulana Saputra (`/images/sph/bima_signature_stamp.png`).

---
[[Welcome]] | [[02 - Database Schema & Supabase RLS]] | [[04 - Hermes AI Agent & Operational Workflow]]
