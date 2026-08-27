# 04 - Hermes AI Agent & Operational Workflow

#hermes #ai #agent #gemini #sales-sparring #routing

---

## 🤖 Siapa Hermes?

**Hermes** adalah Autonomous AI Co-Pilot & Nightly Dispatcher yang dirancang khusus untuk DSR360. Hermes bertindak sebagai sparring partner negosiasi, asisten strategi POPSA, navigator rute lapangan, dan auditor performa sales.

---

## 🧠 Modul & Kemampuan Hermes

### 1. Hermes Nightly Dispatcher & Morning Briefing
* **Waktu Eksekusi:** Berjalan via cron `app/api/cron/nightly-audit/route.ts` dan dieksekusi saat DSR membuka Dashboard pagi hari.
* **Tugas Otomatis:**
  - Memindai akun dormant (>30 hari tanpa kontak).
  - Mendeteksi tugas follow-up yang terlewat (*overdue*).
  - Menyusun salam personal (*Greeting*), fokus harian (*Focus Text*), dan tips taktis lapangan (*Tactical Tip*).

### 2. Pre-Visit POPSA Briefing & AI Sparring
* **Framework POPSA:**
  - **P (Purpose):** Alasan utama kunjungan.
  - **O (Objective):** Komitmen mikro yang harus dicapai hari ini (misal: izin sample test / terima draft SPH).
  - **P (Premises):** Fakta teknis mesin atau riwayat pemakaian oli sebelumnya.
  - **S (Strategy):** Taktik komunikasi & value proposition (LubeAnalyst gratis, audit oli).
  - **A (Anticipate):** Antisipasi keberatan buyer (*"Harga Shell mahal"*, *"Masih ada stok lama"*, dll).
* **Mode Sparring Negosiasi:** DSR dapat melakukan simulasi chat interaktif melawan AI yang berperan sebagai *Purchasing Manager Skeptis*, *Kepala Mekanik Galak*, atau *Direktur Operasional Hemat Biaya*.

### 3. Competitor Battlecards & Product Cross-Reference
* Hermes menyimpan matriks perbandingan head-to-head terhadap kompetitor utama:
  - **Pertamina:** Meditran, Turalik, Rored, Mesran, Eni.
  - **TotalEnergies / Mobil:** Mobil DTE, Mobil Delvac, Mobilgear.
  - **Castrol / Idemitsu / Gulf:** Hyspin, Alpha, CRB.
* Memberikan argumen teknis keunggulan Shell (cth: Shell Tellus S2 MX dengan ketahanan oksidasi TOST >5000 jam vs oli hidrolik standar 2000 jam).

### 4. Smart WhatsApp Action Modal ("Bales Chat Customer")
* 1-klik membuat draf pesan WhatsApp yang sopan, formal, dan berorientasi solusi:
  - Konfirmasi jadwal kunjungan pabrik.
  - Follow-up SPH yang belum ada kabar.
  - Penawaran promo kuartal / program uji lab oli gratis.

---
[[Welcome]] | [[03 - Formula Pricing & Skema Insentif PT HUM]] | [[05 - Shell EPC & Technical Lubricant Knowledge]]
