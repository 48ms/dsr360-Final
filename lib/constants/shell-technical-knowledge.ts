/**
 * Shell Industrial & Commercial Lubricants Technical Knowledge Base (TDS & MSDS)
 * Grounded in authentic Shell Global Product TDS, OEM Specifications, and Material Safety Standards.
 * Specially curated for PT Harapan Utama Motor (Official Shell Commercial Lubricants Distributor).
 */

export type PhysicalSpec = {
  property: string;
  unit: string;
  method?: string;
  value: string;
};

export type ShellFamilyTDS = {
  familyName: string;
  category: string;
  tagline: string;
  baseOilTech: string;
  typicalApplications: string[];
  keyHighlights: {
    title: string;
    desc: string;
  }[];
  oemApprovals: string[];
  industryStandards: string[];
  typicalPhysicalProps: PhysicalSpec[];
  displacementGuidance: string;
  msdsSummary: {
    flashPoint: string;
    fireHazard: string;
    healthHazard: string;
    firstAidSkin: string;
    firstAidEye: string;
    recommendedPPE: string;
    storageHandling: string;
    spillDisposal: string;
  };
};

export const SHELL_PRODUCT_FAMILIES: Record<string, ShellFamilyTDS> = {
  TELLUS: {
    familyName: "Shell Tellus (Hydraulic Fluids)",
    category: "Industrial Hydraulic Oils",
    tagline: "Perlindungan Anti-Wear Superior & Ketahanan Oksidasi Industri Ekstrim",
    baseOilTech: "Group II Hydrotreated Base Oils (Tellus S2 MX/VX) / Full Synthetic GTL (Tellus S4 ME)",
    typicalApplications: [
      "Sistem hidrolik manufaktur (Injection Molding, Mesin Press, CNC)",
      "Alat berat pertambangan & konstruksi (Excavator, Bulldozer, Crane)",
      "Unit hidrolik pabrik kelapa sawit (PKS) & pulp/paper",
    ],
    keyHighlights: [
      {
        title: "TOST Oxidation Life > 5.000 Jam",
        desc: "Daya tahan terhadap degradasi termal 2x lebih lama dari standar industri, mencegah terbentuknya lumpur varnish pada servo valves.",
      },
      {
        title: "Perlindungan Anti-Wear Zinc-Based & Ashless",
        desc: "Lolos uji beban pompa hidrolik ekstrem Denison T6H20C dan Eaton 35VQ25 tanpa keausan kritis pada vane/piston.",
      },
      {
        title: "Filterability & Air Release Cepat",
        desc: "Karakteristik demulsibilitas tinggi (pemisahan air < 15 menit) dan pencegahan kavitasi mikro berkat pelepasan gelembung udara kilat.",
      },
    ],
    oemApprovals: [
      "Bosch Rexroth Fluid Rating RDE 90245",
      "Parker Denison HF-0 / HF-1 / HF-2",
      "Eaton Vickers E-FDGN-TB002-E (Brochure 03-401-2010)",
      "Fives Cincinnati P-68 (ISO 32), P-70 (ISO 46), P-69 (ISO 68)",
      "Arburg (Injection Moulding)",
    ],
    industryStandards: [
      "ISO 11158 (HM / HV Fluids)",
      "DIN 51524 Part 2 (HLP) & Part 3 (HVLP)",
      "ASTM D6158 (HM / HV)",
      "JCMAS HK (Japanese Construction Machinery)",
    ],
    typicalPhysicalProps: [
      { property: "Kinematic Viscosity @ 40°C", unit: "cSt", method: "ASTM D445", value: "46.0 / 68.0" },
      { property: "Kinematic Viscosity @ 100°C", unit: "cSt", method: "ASTM D445", value: "6.9 / 8.9" },
      { property: "Viscosity Index (VI)", unit: "-", method: "ASTM D2270", value: "105 (S2 MX) / 145 (S2 VX)" },
      { property: "Flash Point (COC)", unit: "°C", method: "ASTM D92", value: "230" },
      { property: "Pour Point", unit: "°C", method: "ASTM D97", value: "-30 (S2 MX) / -39 (S2 VX)" },
      { property: "Density @ 15°C", unit: "kg/m³", method: "ASTM D4052", value: "872" },
      { property: "Copper Corrosion (3h/100°C)", unit: "rating", method: "ASTM D130", value: "1a" },
    ],
    displacementGuidance:
      "Pengganti langsung Pertamina Turalik 43/48/52/69, Mobil DTE 24/25/26, Mobil DTE 10 Excel, Total Azolla ZS, Castrol Hyspin AWH-M.",
    msdsSummary: {
      flashPoint: "> 220°C (Tidak mudah menyala pada suhu ruang normal)",
      fireHazard: "Gunakan busa (foam), dry chemical powder, atau CO2. Jangan gunakan semprotan air bertekanan tinggi.",
      healthHazard: "Kontak berulang dapat menyebabkan iritasi kulit ringan. Tidak diklasifikasikan karsinogenik.",
      firstAidSkin: "Cuci dengan air mengalir dan sabun. Lepaskan pakaian yang terkontaminasi.",
      firstAidEye: "Bilas mata segera dengan air bersih minimal 15 menit, hubungi dokter jika iritasi berlanjut.",
      recommendedPPE: "Sarung tangan Nitril / Neoprene, safety glasses, safety boots anti-slip.",
      storageHandling: "Simpan pada suhu 0–50°C di tempat tertutup, hindari paparan sinar matahari langsung dan air hujan.",
      spillDisposal: "Serap dengan pasir/absorbent pad. Dilarang membuang ke saluran air publik. Serahkan ke pengolah limbah B3 berizin.",
    },
  },

  OMALA: {
    familyName: "Shell Omala (Industrial Gear Oils)",
    category: "Industrial Gearbox Lubricants",
    tagline: "Perlindungan Micro-Pitting Ekstrem & Ketahanan Beban Kejut Gearbox Pabrik",
    baseOilTech: "High Viscosity Index Mineral with Sulphur-Phosphorus Additives (S2 GX) / Synthetic PAO (S4 GXV) / PAG (S4 WE)",
    typicalApplications: [
      "Gearbox industri tertutup (Spur, Helical, Bevel, Planetary Gear)",
      "Crusher, Mill, Conveyor drive, dan Kiln pada pabrik semen & tambang",
      "Pabrik kelapa sawit (Gearbox Thresher, Digester, Screw Press, Sterilizer)",
    ],
    keyHighlights: [
      {
        title: "FZG Scuffing Load Stage > 12",
        desc: "Kekuatan lapisan film oli ekstrem mencegah keausan parut (scuffing) pada gigi gear di bawah torsi awal yang sangat tinggi.",
      },
      {
        title: "Ketahanan Micro-Pitting Flender Approved",
        desc: "Teruji tahan terhadap micro-pitting fatigue pada temperatur operasi tinggi hingga 120°C (S4 GXV hingga 140°C).",
      },
      {
        title: "Kompatibilitas Seal Fluroelastomer & Paint",
        desc: "Tidak merusak seal NBR/FKM dan tidak menyebabkan gelembung cat pada interior gearbox.",
      },
    ],
    oemApprovals: [
      "Siemens Flender AG (Flender Gear Units, Rev. 16/T 7300)",
      "David Brown S1.53.101, 102, 103, 104",
      "Hansen Transmissions",
      "SEW Eurodrive",
      "Rexnord Gear Drives",
    ],
    industryStandards: [
      "ISO 12925-1 Type CKD / CKE",
      "DIN 51517 Part 3 (CLP)",
      "ANSI/AGMA 9005-F16",
      "AIST (US Steel) 224",
    ],
    typicalPhysicalProps: [
      { property: "Kinematic Viscosity @ 40°C", unit: "cSt", method: "ASTM D445", value: "150 / 220 / 320 / 460" },
      { property: "Kinematic Viscosity @ 100°C", unit: "cSt", method: "ASTM D445", value: "15.0 / 19.4 / 25.0 / 30.8" },
      { property: "Viscosity Index (VI)", unit: "-", method: "ASTM D2270", value: "98 (S2 GX) / >160 (S4 GXV)" },
      { property: "Flash Point (COC)", unit: "°C", method: "ASTM D92", value: "240" },
      { property: "Pour Point", unit: "°C", method: "ASTM D97", value: "-18 (S2 GX) / -42 (S4 GXV)" },
      { property: "Timken OK Load", unit: "lbs", method: "ASTM D2782", value: "> 60" },
      { property: "Four Ball Weld Load", unit: "kg", method: "ASTM D2783", value: "> 250" },
    ],
    displacementGuidance:
      "Pengganti langsung Pertamina Masri FLG/RG 150/220/320/460, Mobilgear 600 XP series, Total Carter EP, Castrol Alpha SP.",
    msdsSummary: {
      flashPoint: "> 230°C",
      fireHazard: "Busa pemadam, serbuk kimia kering, CO2. Karbon monoksida dapat terbentuk jika terbakar tidak sempurna.",
      healthHazard: "Mengandung aditif sulfur-fosfor. Hindari paparan uap oli panas dalam ruang tertutup tanpa ventilasi.",
      firstAidSkin: "Cuci dengan sabun dan air. Ganti pakaian kerja yang basah oleh oli.",
      firstAidEye: "Bilas mata selama 15 menit dengan air bersih.",
      recommendedPPE: "Sarung tangan Nitril tahan minyak, kacamata pelindung percikan, celemek kerja.",
      storageHandling: "Simpan drum dalam posisi horizontal atau tertutup rapat di bawah atap.",
      spillDisposal: "Bendung tumpahan dengan pasir/tanah. Buang sisa sesuai regulasi limbah B3 Nasional.",
    },
  },

  RIMULA: {
    familyName: "Shell Rimula (Heavy Duty Engine Oils)",
    category: "Heavy Duty Diesel Engine Oils",
    tagline: "Dynamic Protection Plus & Ketahanan Jelaga (Soot) Mesin Diesel Komersial",
    baseOilTech: "Dynamic Protection Plus (GTL Synthetic + Performance Additives) / Hydrotreated Group II",
    typicalApplications: [
      "Truk logistik & armada bus (Hino, Fuso, Scania, Volvo, Mercedes-Benz)",
      "Genset diesel industri pabrik & mining (Cummins, Perkins, Caterpillar, MTU)",
      "Excavator, Dump Truck, Wheel Loader (Komatsu, Cat, Hitachi, Kobelco)",
    ],
    keyHighlights: [
      {
        title: "Total Base Number (TBN) 10–16 mg KOH/g",
        desc: "Kapasitas cadangan alkali tinggi untuk menetralkan asam pembakaran solar B35/B40 Indonesia, melindungi liner dan ring piston dari korosi asam.",
      },
      {
        title: "Soot & Deposit Control Canggih",
        desc: "Aditif dispersan khusus mengikat partikel jelaga agar tidak menggumpal, mencegah pengentalan oli dan keausan valve train.",
      },
      {
        title: "Extended Drain Interval (Hingga 500+ Jam)",
        desc: "Didukung program uji lab Shell LubeAnalyst untuk memperpanjang waktu operasional unit tanpa risiko kegagalan mesin.",
      },
    ],
    oemApprovals: [
      "Cummins CES 20086 / CES 20081 / CES 20078",
      "Caterpillar ECF-3 / ECF-2",
      "MB-Approval 228.31 / 228.3 / 228.5",
      "Volvo VDS-4.5 / VDS-4 / VDS-3",
      "MAN M 3275-1 / M 3575",
      "Detroit Fluids Specification (DFS) 93K222",
      "Mack EOS-4.5 / EO-N",
    ],
    industryStandards: [
      "API CK-4 / CJ-4 / CI-4 Plus / CI-4 / CH-4",
      "ACEA E9 / E7 / E4",
      "JASO DH-2 (Mesin Diesel Jepang DPF)",
    ],
    typicalPhysicalProps: [
      { property: "Kinematic Viscosity @ 100°C", unit: "cSt", method: "ASTM D445", value: "14.5 (15W-40) / 11.8 (10W-40)" },
      { property: "Viscosity Index (VI)", unit: "-", method: "ASTM D2270", value: "135 (R4 X) / 150 (R5 E) / 160 (R6 LM)" },
      { property: "Total Base Number (TBN)", unit: "mg KOH/g", method: "ASTM D2896", value: "10.5 (R4 X) / 12.0 (R4 Plus)" },
      { property: "Sulfated Ash", unit: "% wt", method: "ASTM D874", value: "1.3 (R4 X) / 0.99 (R5 LE Low-SAPS)" },
      { property: "Flash Point (COC)", unit: "°C", method: "ASTM D92", value: "228" },
      { property: "Pour Point", unit: "°C", method: "ASTM D97", value: "-36" },
      { property: "HTHS Viscosity @ 150°C", unit: "mPa.s", method: "ASTM D4683", value: "4.1" },
    ],
    displacementGuidance:
      "Pengganti langsung Pertamina Meditran SX / S / SX Plus 15W-40, Mobil Delvac MX / Delvac Modern, Total Rubia Tir 7400, Castrol Vecton.",
    msdsSummary: {
      flashPoint: "> 220°C",
      fireHazard: "Gunakan dry powder atau foam. Hindari inhalasi asap pekat.",
      healthHazard: "Oli mesin bekas mengandung produk pembakaran yang berpotensi menyebabkan iritasi. Hindari kontak kulit langsung yang lama.",
      firstAidSkin: "Cuci segera dengan air dan sabun pembersih tangan industri.",
      firstAidEye: "Bilas dengan air bersih selama minimal 15 menit.",
      recommendedPPE: "Sarung tangan karet/nitril, safety shoes anti-slip, apron bengkel.",
      storageHandling: "Pastikan tutup drum kencang agar tidak terkontaminasi air kondensasi.",
      spillDisposal: "Serap dengan serbuk gergaji/pasir absorbent. Daur ulang atau serahkan ke penampung oli bekas berizin KLHK.",
    },
  },

  GADUS: {
    familyName: "Shell Gadus (Industrial Greases)",
    category: "Industrial Bearing & Multipurpose Greases",
    tagline: "Proteksi Beban Berat (EP), Tahan Suhu Tinggi & Anti-Washout Air",
    baseOilTech: "Mineral / Synthetic with Lithium (S2 V220), Lithium Complex (S3 V220C), Polyurea (S5 V100), Moly (S2 V220AD)",
    typicalApplications: [
      "Bearing putaran tinggi & beban berat motor listrik, fan, pump, conveyor",
      "Pin & Bushing alat berat tambang, wheel loader, backhoe (Gadus S2 V220AD with Moly)",
      "Pabrik baja, pabrik semen, kiln, thresher & digester PKS",
    ],
    keyHighlights: [
      {
        title: "Dropping Point Tinggi (> 180°C s/d > 260°C)",
        desc: "Stabilitas struktur thickener Lithium Complex tidak meleleh atau bocor saat bearing beroperasi pada temperatur tinggi terus-menerus.",
      },
      {
        title: "Extreme Pressure 4-Ball Weld Load > 315 kg",
        desc: "Mencegah kontak logam-ke-logam pada beban kejut ekstrem, memperpanjang masa pakai bearing hingga 3x lipat.",
      },
      {
        title: "Ketahanan Water Washout & Proteksi Karat",
        desc: "Tetap melekat kuat pada bearing meskipun terpapar siraman air dan uap lembab lingkungan tropis.",
      },
    ],
    oemApprovals: [
      "SKF Bearing Compatibility Certified",
      "Timken Heavy Duty Mill Approval",
      "Komatsu KES 07.881 (Gadus S2 V220AD)",
      "Caterpillar Grease Multi-Purpose Specification",
    ],
    industryStandards: [
      "NLGI Grade 0, 1, 2, 3",
      "DIN 51825 KP2K-20 / KP2N-30",
      "ASTM D4950 GC-LB (Wheel Bearing & Chassis)",
    ],
    typicalPhysicalProps: [
      { property: "NLGI Consistency", unit: "-", method: "ASTM D217", value: "Grade 2 (tersedia 1 & 3)" },
      { property: "Thickener Type", unit: "-", method: "-", value: "Lithium Hydroxystearate / Complex" },
      { property: "Base Oil Viscosity @ 40°C", unit: "cSt", method: "ASTM D445", value: "220 (tersedia 100 & 460)" },
      { property: "Dropping Point", unit: "°C", method: "IP 396", value: "180 (S2) / 260 (S3 Complex)" },
      { property: "Four Ball Weld Load", unit: "kg", method: "ASTM D2509", value: "> 315" },
      { property: "Water Washout @ 79°C", unit: "% loss", method: "ASTM D1264", value: "< 5%" },
    ],
    displacementGuidance:
      "Pengganti langsung Pertamina Super Grease EP-2 / Li-EP 2, Mobilgrease XHP 222, Total Ceran / Multis EP 2, Castrol Spheerol EPL 2.",
    msdsSummary: {
      flashPoint: "Base oil > 200°C",
      fireHazard: "Busa, bubuk kering, CO2. Grease terbakar menghasilkan residu pekat.",
      healthHazard: "Injeksi grease bertekanan tinggi (dari grease gun) ke bawah kulit adalah keadaan darurat medis bedah!",
      firstAidSkin: "Cuci dengan sabun. JIKA TERJADI INJEKSI TEKANAN TINGGI, SEGERA BAWA KE DOKTER BEDAH.",
      firstAidEye: "Bilas dengan air mengalir selama 15 menit.",
      recommendedPPE: "Sarung tangan kerja mekanik tahan kimia, kacamata pelindung.",
      storageHandling: "Simpan pail/drum tertutup rapat di tempat sejuk. Hindari kontaminasi debu pada permukaan grease.",
      spillDisposal: "Keruk dengan sekop ke dalam wadah limbah tertutup. Bersihkan residu dengan absorbent.",
    },
  },

  CORENA: {
    familyName: "Shell Corena (Air Compressor Oils)",
    category: "Compressor Lubricants",
    tagline: "Interval Penggantian Panjang & Bebas Endapan Karbon Katup Kompresor",
    baseOilTech: "Hydrotreated Mineral (S2 P / S3 R) / Synthetic PAO & Ester (S4 R / S4 P)",
    typicalApplications: [
      "Kompresor udara ulir putar (Rotary Screw Compressors - Atlas Copco, Ingersoll Rand, Sullair, Kaeser)",
      "Kompresor torak/piston tekanan tinggi (Reciprocating Piston - Corena S2 P)",
      "Sistem kompresi udara pabrik manufaktur 24/7",
    ],
    keyHighlights: [
      {
        title: "Oil Life 4.000 s/d 10.000 Jam Kerja",
        desc: "Corena S3 R bertahan hingga 4.000 jam dan Corena S4 R hingga 10.000 jam pada temperatur pembuangan udara hingga 100°C.",
      },
      {
        title: "Mencegah Pembentukan Karbon & Varnish",
        desc: "Menjaga kebersihan elemen rotor dan separator filter, memastikan efisiensi volumetrik kompresor tetap prima.",
      },
      {
        title: "Demulsibilitas & Pelepasan Udara Cepat",
        desc: "Memisahkan air kondensat secara instan dan mencegah pembusaan di dalam tangki separator udara-oli.",
      },
    ],
    oemApprovals: [
      "Atlas Copco Equivalent Specs",
      "Ingersoll Rand Rotary Screw Standard",
      "Kaeser Compressors Standard",
      "Sullair Standard Life",
    ],
    industryStandards: [
      "ISO 6743-3A-DAH (S3 R) / DAJ (S4 R) / DVA (S2 P)",
      "DIN 51506 VBL / VCL / VDL",
    ],
    typicalPhysicalProps: [
      { property: "Kinematic Viscosity @ 40°C", unit: "cSt", method: "ASTM D445", value: "32.0 / 46.0 / 68.0" },
      { property: "Kinematic Viscosity @ 100°C", unit: "cSt", method: "ASTM D445", value: "5.4 / 6.9 / 8.9" },
      { property: "Viscosity Index (VI)", unit: "-", method: "ASTM D2270", value: "105 (S3 R) / 135 (S4 R)" },
      { property: "Flash Point (COC)", unit: "°C", method: "ASTM D92", value: "230 (S3 R) / 248 (S4 R)" },
      { property: "Pour Point", unit: "°C", method: "ASTM D97", value: "-30 (S3 R) / -45 (S4 R)" },
      { property: "Air Release @ 50°C", unit: "menit", method: "ASTM D3427", value: "< 3 menit" },
    ],
    displacementGuidance:
      "Pengganti langsung Atlas Copco Roto Inject Fluid / Roto Xtend, Ingersoll Rand Ultra Coolant, Pertamina Salyx / Kompresyn, Mobil Rarus 425/827/SHC 1025.",
    msdsSummary: {
      flashPoint: "> 230°C",
      fireHazard: "Busa, serbuk kimia kering, CO2.",
      healthHazard: "Hindari menghirup mist/uap oli bertekanan.",
      firstAidSkin: "Cuci dengan sabun dan air.",
      firstAidEye: "Bilas dengan air bersih.",
      recommendedPPE: "Kacamata pelindung, sarung tangan nitril.",
      storageHandling: "Simpan tertutup rapat, hindari kontaminasi uap air.",
      spillDisposal: "Serap dengan bahan penyerap, buang sebagai limbah B3.",
    },
  },

  SPIRAX: {
    familyName: "Shell Spirax (Axle & Transmission Oils)",
    category: "Automotive & Industrial Gear/Axle",
    tagline: "Proteksi Gigi Gardan Hypoid & Transmisi Manual Beban Berat",
    baseOilTech: "High Performance Mineral (S2 A / S2 G) / Synthetic Base Fluids (S4 AX / S6 AXME)",
    typicalApplications: [
      "Gardan (Differential / Axle) truk, bus, alat berat berbeban geser tinggi (API GL-5)",
      "Transmisi manual komersial (API GL-4)",
      "Final drive dan gearbox transfer case",
    ],
    keyHighlights: [
      {
        title: "Perlindungan Extreme Pressure (EP) Khusus Hypoid",
        desc: "Aditif sulfur-fosfor seimbang melindungi permukaan kontak gigi gardan dari pitting dan spalling.",
      },
      {
        title: "Stabilitas Oksidasi Tinggi & Kontrol Suhu Gardan",
        desc: "Mengurangi gesekan hidrodinamik pada gardan sehingga temperatur operasi gardan tetap stabil di bawah 90°C.",
      },
    ],
    oemApprovals: [
      "Mercedes-Benz Sheet 235.0 / 235.6",
      "MAN 342 Type M1 / M2",
      "ZF TE-ML 05A, 07A, 12E, 16B, 17B, 19B",
      "Mack GO-J",
    ],
    industryStandards: [
      "API GL-5 (Spirax S2 A / S4 AX)",
      "API GL-4 (Spirax S2 G)",
      "MIL-L-2105D / PRF-2105E",
    ],
    typicalPhysicalProps: [
      { property: "Kinematic Viscosity @ 40°C", unit: "cSt", method: "ASTM D445", value: "146 (80W-90) / 358 (85W-140)" },
      { property: "Kinematic Viscosity @ 100°C", unit: "cSt", method: "ASTM D445", value: "14.6 (80W-90) / 25.6 (85W-140)" },
      { property: "Viscosity Index (VI)", unit: "-", method: "ASTM D2270", value: "98 (80W-90) / 95 (85W-140)" },
      { property: "Flash Point (COC)", unit: "°C", method: "ASTM D92", value: "222" },
      { property: "Pour Point", unit: "°C", method: "ASTM D97", value: "-27" },
    ],
    displacementGuidance:
      "Pengganti langsung Pertamina Rored HDA 90 / 140 / 80W-90 / 85W-140, Mobilube HD Plus, Total Transmission Axle.",
    msdsSummary: {
      flashPoint: "> 215°C",
      fireHazard: "Busa pemadam, serbuk kimia kering, CO2.",
      healthHazard: "Aditif sulfur mengeluarkan bau khas minyak gardan. Gunakan ventilasi yang cukup.",
      firstAidSkin: "Cuci dengan air dan sabun.",
      firstAidEye: "Bilas minimal 15 menit.",
      recommendedPPE: "Sarung tangan tahan minyak, safety glasses.",
      storageHandling: "Simpan tertutup rapat di bawah atap.",
      spillDisposal: "Serap dengan pasir, serahkan ke pengolah limbah B3 resmi.",
    },
  },

  CASSIDA: {
    familyName: "Shell Cassida (Food Grade Lubricants)",
    category: "Food Grade Fluids & Greases (NSF H1)",
    tagline: "Pelumas Khusus Industri Makanan, Minuman & Farmasi Bersertifikat Halal",
    baseOilTech: "Fully Synthetic PAO / Ester / Polyurea / Aluminium Complex Food Grade Chemistry",
    typicalApplications: [
      "Pabrik makanan & biskuit (Oven chain, conveyor, packaging line)",
      "Pabrik minuman, brewery & pengalengan (Seamer, filling machine)",
      "Industri pakan ternak, farmasi, dan pengolahan susu",
    ],
    keyHighlights: [
      {
        title: "NSF H1 Registered (Insidental Kontak Makanan)",
        desc: "Aman digunakan pada titik pelumasan di mana kontak insidental dengan makanan mungkin terjadi secara teknis.",
      },
      {
        title: "Bersertifikat Halal & Kosher Resmi",
        desc: "Memenuhi regulasi BPOM dan sertifikasi Halal MUI untuk industri makanan dan minuman Indonesia.",
      },
      {
        title: "Bebas Bau, Rasa, dan Warna",
        desc: "Tidak akan merusak cita rasa, aroma, atau tekstur produk makanan olahan customer.",
      },
    ],
    oemApprovals: [
      "Krones Filling Equipment",
      "Tetra Pak Packaging Machines",
      "FMC FoodTech",
      "Angelus Can Seamers",
    ],
    industryStandards: [
      "NSF H1, HT1, 3H Registered",
      "ISO 21469 Hygiene Certification",
      "Halal MUI / Kosher Certified",
    ],
    typicalPhysicalProps: [
      { property: "Kinematic Viscosity @ 40°C", unit: "cSt", method: "ASTM D445", value: "32 / 46 / 68 / 100 / 220" },
      { property: "Flash Point (COC)", unit: "°C", method: "ASTM D92", value: "> 240" },
      { property: "Pour Point", unit: "°C", method: "ASTM D97", value: "-45" },
      { property: "NSF Registration Number", unit: "-", method: "-", value: "Listed on NSF White Book" },
    ],
    displacementGuidance:
      "Pengganti langsung Mobil SHC Cibus series, Total Nevastane, Kluberfood, Fuchs Cassida.",
    msdsSummary: {
      flashPoint: "> 240°C",
      fireHazard: "Busa, serbuk kimia kering, CO2.",
      healthHazard: "Formula non-toxic, namun tidak dimaksudkan untuk konsumsi langsung secara sengaja.",
      firstAidSkin: "Cuci dengan sabun dan air biasa.",
      firstAidEye: "Bilas dengan air bersih.",
      recommendedPPE: "Standar sanitasi pabrik makanan (sarung tangan food grade, hair net).",
      storageHandling: "Simpan terpisah dari pelumas non-food grade untuk mencegah kontaminasi silang!",
      spillDisposal: "Bersihkan area dengan pembersih food-safe sanitizer.",
    },
  },

  AEROSHELL: {
    familyName: "AeroShell (Aviation Lubricants)",
    category: "Aviation Turbine & Piston Oils",
    tagline: "Standar Pelumas Kedirgantaraan Internasional & Turbin Aviasi Militer/Sipil",
    baseOilTech: "Hindered Synthetic Ester with Extreme Thermal-Oxidation Additives (Turbine Oil 500 / 560)",
    typicalApplications: [
      "Turbin gas pesawat sipil & helikopter komersial",
      "Turbin gas stasioner pembangkit listrik aero-derivative (GE LM2500/LM6000, Rolls-Royce)",
      "Mesin piston pesawat baling-baling (AeroShell W100 / 15W-50)",
    ],
    keyHighlights: [
      {
        title: "Ketahanan Termal Hingga 200°C+ Kontinu",
        desc: "Stabilitas ester sintetis mencegah terbentuknya endapan karbon coking pada bearing turbin putaran 15.000+ RPM.",
      },
      {
        title: "Spesifikasi Militer AS & Inggris (MIL-PRF-23699 / DEF STAN 91-101)",
        desc: "Telah melewati pengujian laboratorium ketat penerbangan sipil dan militer NATO.",
      },
    ],
    oemApprovals: [
      "General Electric (GE Aviation & GE Energy)",
      "Pratt & Whitney (PW4000, PT6)",
      "Rolls-Royce (Trent, RB211, Allison 250)",
      "Safran Helicopter Engines",
    ],
    industryStandards: [
      "MIL-PRF-23699 Class STD / HTS (High Thermal Stability)",
      "DEF STAN 91-101 (British Military)",
      "SAE AS5780 Standard Class",
    ],
    typicalPhysicalProps: [
      { property: "Kinematic Viscosity @ 100°C", unit: "cSt", method: "ASTM D445", value: "5.1" },
      { property: "Kinematic Viscosity @ 40°C", unit: "cSt", method: "ASTM D445", value: "25.0" },
      { property: "Kinematic Viscosity @ -40°C", unit: "cSt", method: "ASTM D445", value: "< 13.000" },
      { property: "Flash Point (COC)", unit: "°C", method: "ASTM D92", value: "> 256" },
      { property: "Pour Point", unit: "°C", method: "ASTM D97", value: "< -54" },
      { property: "Total Acid Number (TAN)", unit: "mg KOH/g", method: "ASTM D664", value: "< 0.3" },
    ],
    displacementGuidance:
      "Pengganti langsung Mobil Jet Oil II / Mobil Jet Oil 254, BP Turbo Oil 2380, Eastman Turbo Oil 2380/2197.",
    msdsSummary: {
      flashPoint: "> 255°C",
      fireHazard: "Busa, bubuk kering, CO2.",
      healthHazard: "Mengandung ester sintetis dan aditif fosfat. Hindari kontak kulit berkepanjangan dan uap panas.",
      firstAidSkin: "Cuci segera dengan air dan sabun.",
      firstAidEye: "Bilas minimal 15 menit dengan air mengalir.",
      recommendedPPE: "Sarung tangan karet butil / nitril khusus ester, safety goggles penerbangan.",
      storageHandling: "Simpan kaleng can tertutup segel resmi. Hindari kontaminasi uap air udara.",
      spillDisposal: "Serap dengan media inert, buang sesuai regulasi limbah aviasi.",
    },
  },

  HELIX: {
    familyName: "Shell Helix (Passenger Car Motor Oils)",
    category: "Passenger Car Engine Oils",
    tagline: "PurePlus Technology dari Gas Alam untuk Mobil Penumpang & Operasional DSR",
    baseOilTech: "PurePlus GTL (Gas-to-Liquid) 99.5% Pure Base Oil (Helix Ultra / HX8) / Synthetic Blend (HX7 / HX5)",
    typicalApplications: [
      "Mobil penumpang bensin & diesel ringan",
      "Armada operasional kendaraan sales & operasional PT HUM",
      "Mesin turbo modern (TGDI) dengan perlindungan dari Low-Speed Pre-Ignition (LSPI)",
    ],
    keyHighlights: [
      {
        title: "Shell PurePlus Technology",
        desc: "Base oil murni bening hasil konversi gas alam dengan penguapan oli sangat rendah dan viskositas stabil di suhu ekstrem.",
      },
      {
        title: "Active Cleansing Technology",
        desc: "Mencegah penumpukan kotoran kerak mesin hingga 65% lebih bersih dari standar industri.",
      },
    ],
    oemApprovals: [
      "Ferrari Approved (Shell Helix Ultra)",
      "Mercedes-Benz MB 229.5 / 229.51",
      "BMW Longlife-01 / LL-04",
      "VW 502.00 / 505.00",
      "Porsche A40",
    ],
    industryStandards: [
      "API SP / SN Plus / SN / CF",
      "ACEA A3/B4 / C3",
      "ILSAC GF-6A",
    ],
    typicalPhysicalProps: [
      { property: "Kinematic Viscosity @ 100°C", unit: "cSt", method: "ASTM D445", value: "9.8 (0W-20) / 13.8 (5W-40)" },
      { property: "Flash Point (COC)", unit: "°C", method: "ASTM D92", value: "235" },
      { property: "Pour Point", unit: "°C", method: "ASTM D97", value: "-45" },
    ],
    displacementGuidance:
      "Pengganti langsung Pertamina Fastron series, Mobil 1 / Mobil Super, Castrol Magnatec / Edge, Total Quartz.",
    msdsSummary: {
      flashPoint: "> 220°C",
      fireHazard: "Busa, serbuk kimia kering, CO2.",
      healthHazard: "Tidak ada bahaya signifikan jika digunakan secara wajar.",
      firstAidSkin: "Cuci dengan sabun dan air.",
      firstAidEye: "Bilas air mengalir selama 15 menit.",
      recommendedPPE: "Sarung tangan mekanik, safety shoes.",
      storageHandling: "Simpan tertutup rapat di tempat terlindung.",
      spillDisposal: "Serap dengan pasir, jangan buang ke selokan umum.",
    },
  },

  ADVANCE: {
    familyName: "Shell Advance (Motorcycle Oils)",
    category: "2-Wheeler / 4T & Scooter Lubricants",
    tagline: "RCE Technology untuk Akselerasi Halus & Perlindungan Kopling Basah",
    baseOilTech: "PurePlus Synthetic (Ultra) / Hydrotreated Base Oils (AX7 / AX5)",
    typicalApplications: ["Sepeda motor 4-tak manual & matic / scooter"],
    keyHighlights: [
      {
        title: "RCE (Reliability, Control, Enjoyment)",
        desc: "Menjaga kebersihan piston, perpindahan gigi mulus tanpa selip kopling, dan peredaman getaran mesin motor.",
      },
    ],
    oemApprovals: ["Honda, Yamaha, Suzuki, Kawasaki Motorcycle Approvals"],
    industryStandards: ["API SN / SL / SM", "JASO MA2 (Manual) / JASO MB (Matic Scooter)"],
    typicalPhysicalProps: [
      { property: "Kinematic Viscosity @ 100°C", unit: "cSt", method: "ASTM D445", value: "14.5 (10W-40)" },
      { property: "Flash Point (COC)", unit: "°C", method: "ASTM D92", value: "230" },
      { property: "Pour Point", unit: "°C", method: "ASTM D97", value: "-33" },
    ],
    displacementGuidance: "Pengganti langsung Pertamina Enduro 4T, Castrol Power 1, Yamalube, AHM Oil.",
    msdsSummary: {
      flashPoint: "> 220°C",
      fireHazard: "Dry chemical, foam, CO2.",
      healthHazard: "Iritasi ringan pada kontak lama.",
      firstAidSkin: "Cuci dengan sabun.",
      firstAidEye: "Bilas air bersih.",
      recommendedPPE: "Sarung tangan mekanik.",
      storageHandling: "Simpan di rak tertutup.",
      spillDisposal: "Serap dengan serbuk gergaji/pasir.",
    },
  },
};

/**
 * Intelligent matcher to resolve authentic Shell TDS & MSDS knowledge for any SKU
 */
export function lookupProductTDS(
  productName: string = "",
  category?: string | null,
  viscosity?: string | null
): ShellFamilyTDS {
  const name = productName.toUpperCase();
  const cat = (category || "").toUpperCase();

  if (name.includes("TELLUS") || cat.includes("HYDRAULIC")) {
    return SHELL_PRODUCT_FAMILIES.TELLUS;
  }
  if (name.includes("OMALA") || cat.includes("GEAR") || cat.includes("GARDAN")) {
    return SHELL_PRODUCT_FAMILIES.OMALA;
  }
  if (name.includes("RIMULA") || name.includes("DIESEL") || cat.includes("DIESEL")) {
    return SHELL_PRODUCT_FAMILIES.RIMULA;
  }
  if (name.includes("GADUS") || name.includes("GREASE") || cat.includes("GREASE")) {
    return SHELL_PRODUCT_FAMILIES.GADUS;
  }
  if (name.includes("CORENA") || name.includes("COMPRESSOR") || cat.includes("COMPRESSOR")) {
    return SHELL_PRODUCT_FAMILIES.CORENA;
  }
  if (name.includes("SPIRAX") || name.includes("TRANSMISSION") || name.includes("AXLE")) {
    return SHELL_PRODUCT_FAMILIES.SPIRAX;
  }
  if (name.includes("CASSIDA") || name.includes("FOOD") || cat.includes("FOOD")) {
    return SHELL_PRODUCT_FAMILIES.CASSIDA;
  }
  if (name.includes("AEROSHELL") || name.includes("TURBINE OIL 500") || name.includes("AVIATION") || cat.includes("AVIATION")) {
    return SHELL_PRODUCT_FAMILIES.AEROSHELL;
  }
  if (name.includes("HELIX") || cat.includes("PASSENGER")) {
    return SHELL_PRODUCT_FAMILIES.HELIX;
  }
  if (name.includes("ADVANCE") || cat.includes("MOTORCYCLE")) {
    return SHELL_PRODUCT_FAMILIES.ADVANCE;
  }

  // Fallback to Tellus Industrial Baseline with customized category
  return {
    ...SHELL_PRODUCT_FAMILIES.TELLUS,
    familyName: productName || "Shell Industrial Lubricant",
    category: category || "Industrial Specialty Fluid",
    tagline: `Spesifikasi Pelumas Resmi Shell PT Harapan Utama Motor (${viscosity || "Specialty Grade"})`,
  };
}
