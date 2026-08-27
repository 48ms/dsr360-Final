/**
 * Shell Industrial & Commercial Lubricants Technical Knowledge Base (TDS & MSDS)
 * Grounded in authentic Shell Global Product TDS, OEM Specifications, and Material Safety Standards.
 * Source: Shell Electronic Product Catalogue (Shell EPC - https://www.epc.shell.com) & PT Harapan Utama Motor Catalog.
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
  epcSearchQuery?: string;
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
    tagline: "Perlindungan Anti-Wear Superior & Ketahanan Oksidasi Industri Ekstrim (TOST > 5.000 Jam)",
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
      "Arburg, Engel, KraussMaffei (Injection Moulding)",
    ],
    industryStandards: [
      "ISO 11158 (HM / HV Fluids)",
      "DIN 51524 Part 2 (HLP) & Part 3 (HVLP)",
      "ASTM D6158 (HM / HV)",
      "JCMAS HK (Japanese Construction Machinery)",
    ],
    typicalPhysicalProps: [
      { property: "Kinematic Viscosity @ 40°C", unit: "cSt", method: "ASTM D445", value: "32.0 / 46.0 / 68.0 / 100" },
      { property: "Kinematic Viscosity @ 100°C", unit: "cSt", method: "ASTM D445", value: "5.4 / 6.9 / 8.9 / 11.5" },
      { property: "Viscosity Index (VI)", unit: "-", method: "ASTM D2270", value: "105 (S2 MX) / 145 (S2 VX)" },
      { property: "Flash Point (COC)", unit: "°C", method: "ASTM D92", value: "220–238" },
      { property: "Pour Point", unit: "°C", method: "ASTM D97", value: "-30 (S2 MX) / -39 (S2 VX)" },
      { property: "Density @ 15°C", unit: "kg/m³", method: "ASTM D4052", value: "872" },
      { property: "Copper Corrosion (3h/100°C)", unit: "rating", method: "ASTM D130", value: "1a" },
    ],
    displacementGuidance:
      "Pengganti langsung Pertamina Turalik 43/48/52/69, Mobil DTE 24/25/26, Mobil DTE 10 Excel, Total Azolla ZS, Castrol Hyspin AWH-M.",
    epcSearchQuery: "Tellus",
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
    tagline: "Perlindungan Micro-Pitting Ekstrem & Ketahanan Beban Kejut Gearbox Pabrik (FZG Load > 12)",
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
      "Rexnord Gear Drives, Sumitomo Drive Technologies",
    ],
    industryStandards: [
      "ISO 12925-1 Type CKD / CKE",
      "DIN 51517 Part 3 (CLP)",
      "ANSI/AGMA 9005-F16",
      "AIST (US Steel) 224",
    ],
    typicalPhysicalProps: [
      { property: "Kinematic Viscosity @ 40°C", unit: "cSt", method: "ASTM D445", value: "68 / 100 / 150 / 220 / 320 / 460 / 680" },
      { property: "Kinematic Viscosity @ 100°C", unit: "cSt", method: "ASTM D445", value: "8.7 / 11.4 / 15.0 / 19.4 / 25.0 / 30.8 / 38.0" },
      { property: "Viscosity Index (VI)", unit: "-", method: "ASTM D2270", value: "98 (S2 GX) / >160 (S4 GXV)" },
      { property: "Flash Point (COC)", unit: "°C", method: "ASTM D92", value: "240–255" },
      { property: "Pour Point", unit: "°C", method: "ASTM D97", value: "-18 (S2 GX) / -42 (S4 GXV)" },
      { property: "Timken OK Load", unit: "lbs", method: "ASTM D2782", value: "> 60" },
      { property: "Four Ball Weld Load", unit: "kg", method: "ASTM D2783", value: "> 250" },
    ],
    displacementGuidance:
      "Pengganti langsung Pertamina Masri FLG/RG 150/220/320/460, Mobilgear 600 XP series, Total Carter EP, Castrol Alpha SP.",
    epcSearchQuery: "Omala",
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
    tagline: "Dynamic Protection Plus & Ketahanan Jelaga (Soot) Mesin Diesel Komersial (TBN 10–16)",
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
    epcSearchQuery: "Rimula",
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
    tagline: "Proteksi Beban Berat (EP), Tahan Suhu Tinggi & Anti-Washout Air (Dropping Point > 180–260°C)",
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
      "NLGI 0, 1, 2, 3 (Consistency Grades)",
      "DIN 51825 KP2K-20 (S2 V220 2) / KP2N-30 (S3 V220C 2)",
      "ISO 6743-9 L-XBCIB 2",
    ],
    typicalPhysicalProps: [
      { property: "NLGI Consistency", unit: "grade", method: "ASTM D217", value: "0 / 1 / 2 / 3" },
      { property: "Thickener Type", unit: "-", method: "Shell Method", value: "Lithium (S2) / Li-Complex (S3)" },
      { property: "Base Oil Viscosity @ 40°C", unit: "cSt", method: "ASTM D445", value: "220 (V220) / 100 (V100) / 460 (V460)" },
      { property: "Dropping Point", unit: "°C", method: "IP 396", value: "180 (S2) / 260 (S3)" },
      { property: "Four Ball Weld Load", unit: "kg", method: "ASTM D2596", value: "315 (S2 V220) / 380 (S2 V220AD)" },
      { property: "Water Washout @ 79°C", unit: "% loss", method: "ASTM D1264", value: "< 5%" },
    ],
    displacementGuidance:
      "Pengganti langsung Pertamina Super Grease EP / Multipurpose, Mobilgrease XHP 222, Total Multis Complex EP2, Castrol Spheerol EPL2.",
    epcSearchQuery: "Gadus",
    msdsSummary: {
      flashPoint: "> 200°C (Base oil flash point)",
      fireHazard: "Busa, serbuk kimia kering, CO2.",
      healthHazard: "Penggunaan grease gun bertekanan tinggi: injeksi grease ke bawah kulit adalah DARURAT MEDIS BEDAH SEGERA.",
      firstAidSkin: "Cuci dengan sabun. Jika terjadi injeksi bertekanan tinggi, bawa segera ke IGD rumah sakit.",
      firstAidEye: "Bilas air bersih selama 15 menit.",
      recommendedPPE: "Sarung tangan Nitril tebal, kacamata safety, safety shoes.",
      storageHandling: "Simpan pail/drum tegak, tutup rapat untuk mencegah debu/pasir masuk.",
      spillDisposal: "Sekop dan masukkan ke wadah limbah B3 berlabel.",
    },
  },

  CORENA: {
    familyName: "Shell Corena (Air Compressor Oils)",
    category: "Compressor Lubricants",
    tagline: "Perlindungan Vane & Screw Compressor (Masa Pakai 4.000–10.000 Jam)",
    baseOilTech: "Selected Hydrotreated Mineral (S2 P / S3 R) / Synthetic PAO-Ester (S4 R / S4 P)",
    typicalApplications: [
      "Kompresor udara ulir putar (Rotary Screw Compressor - Atlas Copco, Sullair, Ingersoll Rand, Kaeser)",
      "Kompresor torak bolak-balik (Reciprocating Compressor - Corena S2 P / S4 P)",
      "Pabrik tekstil, elektronik, makanan, dan perakitan otomotif",
    ],
    keyHighlights: [
      {
        title: "Interval Penggantian 4.000 s/d 10.000 Jam",
        desc: "Corena S3 R tahan hingga 4.000 jam, Corena S4 R Synthetic tahan hingga 10.000 jam operasi tanpa pembentukan deposit karbon.",
      },
      {
        title: "Pemisahan Udara Kilat & Anti-Foaming",
        desc: "Pelepasan udara cepat (< 3 menit) menjaga efisiensi kompresi dan mencegah kavitasi rotor.",
      },
      {
        title: "Demulsibilitas Air Unggul",
        desc: "Memisahkan air kondensasi kompresi dengan cepat sehingga mudah didrainase dari separator.",
      },
    ],
    oemApprovals: [
      "Atlas Copco Rotary Screw Compressor Requirements",
      "Ingersoll-Rand Screw Compressors",
      "Kaeser Kompressoren",
      "Sullair Air Compressors",
    ],
    industryStandards: [
      "ISO 6743-3A-DAH / DAJ (Corena S3 R / S4 R)",
      "DIN 51506 VDL (Corena S2 P / S4 P)",
    ],
    typicalPhysicalProps: [
      { property: "Kinematic Viscosity @ 40°C", unit: "cSt", method: "ASTM D445", value: "32.0 / 46.0 / 68.0 / 100" },
      { property: "Kinematic Viscosity @ 100°C", unit: "cSt", method: "ASTM D445", value: "5.4 / 6.9 / 8.9 / 12.1" },
      { property: "Flash Point (COC)", unit: "°C", method: "ASTM D92", value: "230 (S3 R) / 248 (S4 R)" },
      { property: "Air Release @ 50°C", unit: "minutes", method: "ASTM D3427", value: "< 3" },
      { property: "Water Separability @ 54°C", unit: "minutes", method: "ASTM D1401", value: "10" },
    ],
    displacementGuidance:
      "Pengganti langsung Atlas Copco Roto Inject Fluid / HD Roto Fluid, Sullube 32, Mobil Rarus 425/427, Mobil Rarus SHC 1025.",
    epcSearchQuery: "Corena",
    msdsSummary: {
      flashPoint: "> 225°C",
      fireHazard: "Busa kimia, dry powder, CO2.",
      healthHazard: "Hindari menghirup mist oli dari knalpot pembuangan kompresor.",
      firstAidSkin: "Cuci dengan sabun.",
      firstAidEye: "Bilas air mengalir.",
      recommendedPPE: "Sarung tangan Nitril, kacamata pelindung.",
      storageHandling: "Simpan di tempat kering.",
      spillDisposal: "Serap dengan pad absorbent.",
    },
  },

  SPIRAX: {
    familyName: "Shell Spirax (Axle, Gear & Transmission Fluids)",
    category: "Automotive & Industrial Drivetrain Fluids",
    tagline: "Perlindungan Gardan, Manual Transmission, dan Traktor UTTO (GL-4 / GL-5 / TO-4)",
    baseOilTech: "High Performance Mineral (S2 G / S2 A) / Synthetic (S4 CX / S6 AXME / S4 TXM)",
    typicalApplications: [
      "Gardan (Differential/Axle) heavy duty truk & bus (Spirax S2 A 80W-90 / 85W-140 GL-5)",
      "Transmisi manual (Spirax S2 G 80W-90 GL-4)",
      "Sistem powershift & wet brake alat berat Caterpillar & Komatsu (Spirax S4 CX 10W / 30 / 50 TO-4)",
      "Traktor pertanian UTTO (Spirax S4 TXM)",
    ],
    keyHighlights: [
      {
        title: "Perlindungan Roda Gigi Hypoid Ekstrem (API GL-5)",
        desc: "Aditif Extreme Pressure melindungi kontak gesek gigi miring gardan dari spalling dan pitting.",
      },
      {
        title: "Kendali Gesekan Wet Brake & Powershift (TO-4)",
        desc: "Spirax S4 CX menghilangkan getaran chatter rem basah dan mengoptimalkan respon kopling transmisi.",
      },
    ],
    oemApprovals: [
      "Caterpillar TO-4 (Spirax S4 CX)",
      "Komatsu Micro-Clutch KES 07.868.1",
      "ZF TE-ML 05A, 07A, 08, 12E, 16B, 16C, 17B, 19B, 21A",
      "Mercedes-Benz MB 235.0 / 235.1",
      "Volvo 97305 / 97307",
    ],
    industryStandards: [
      "API GL-5 (Gardan) / API GL-4 (Transmisi)",
      "Caterpillar TO-4 & TO-4M",
      "John Deere JDM J20C (Spirax S4 TXM)",
    ],
    typicalPhysicalProps: [
      { property: "Kinematic Viscosity @ 100°C", unit: "cSt", method: "ASTM D445", value: "14.6 (80W-90) / 25.6 (85W-140) / 10.8 (SAE 30)" },
      { property: "Flash Point (COC)", unit: "°C", method: "ASTM D92", value: "215–230" },
      { property: "Pour Point", unit: "°C", method: "ASTM D97", value: "-27 s/d -36" },
    ],
    displacementGuidance:
      "Pengganti Pertamina Rored HDA / EPA, Mobilube HD / GX, Mobil Delvac 1 Gear Oil, Total Transmission.",
    epcSearchQuery: "Spirax",
    msdsSummary: {
      flashPoint: "> 200°C",
      fireHazard: "Busa pemadam, serbuk kimia kering, CO2.",
      healthHazard: "Mengandung aditif sulfur-fosfor gardan.",
      firstAidSkin: "Cuci dengan sabun.",
      firstAidEye: "Bilas air mengalir.",
      recommendedPPE: "Sarung tangan Nitril, kacamata pelindung.",
      storageHandling: "Simpan tertutup rapat.",
      spillDisposal: "Serap dengan pasir absorbent.",
    },
  },

  ARGINA: {
    familyName: "Shell Argina & Gadinia (Medium Speed Diesel & Marine Power Engine Oils)",
    category: "Power Generation & Marine Engine Oils",
    tagline: "Proteksi Genset Pembangkit Listrik Skala Besar (PLTD) & Mesin Kapal 4-Tak (TBN 12–55)",
    baseOilTech: "Heavy Duty Hydrotreated Group II + High Alkali Detergent Overbased Chemistry",
    typicalApplications: [
      "Genset PLTD pembangkit listrik industri (Wärtsilä, MAN Energy Solutions, Caterpillar MaK)",
      "Mesin diesel 4-tak putaran menengah kapal laut & tugboat (Yanmar, Daihatsu, Niigata, Bergen)",
      "Mesin diesel berbahan bakar Residual Fuel (HFO), Marine Gas Oil (MDO), dan Biosolar B35",
    ],
    keyHighlights: [
      {
        title: "TBN Tinggi (Argina S3: 30, S4: 40, S5: 55 mg KOH/g)",
        desc: "Kapasitas cadangan basa ekstra masif untuk menetralkan asam sulfur pekat dari bahan bakar minyak bakar (HFO) dan biosolar kadar asam tinggi.",
      },
      {
        title: "Stabilitas Oksidasi & Kebersihan Under-Crown Piston",
        desc: "Mencegah deposit kerak hitam (black sludge) pada mahkota bawah piston dan alur ring piston di bawah beban kontinyu 24/7.",
      },
    ],
    oemApprovals: [
      "Wärtsilä 20, 26, 32, 34DF, 38, 46, 50",
      "MAN Energy Solutions (Medium Speed 4-Stroke Engines)",
      "Caterpillar MaK M20, M25, M32C",
      "Daihatsu Diesel & Yanmar Marine Engines",
      "Rolls-Royce / Bergen Marine Engines",
    ],
    industryStandards: [
      "API CF",
      "CIMAC DDC / DE / DF Categories",
    ],
    typicalPhysicalProps: [
      { property: "SAE Viscosity Grade", unit: "-", method: "SAE J300", value: "30 / 40" },
      { property: "Kinematic Viscosity @ 100°C", unit: "cSt", method: "ASTM D445", value: "14.0 (SAE 40) / 11.5 (SAE 30)" },
      { property: "Total Base Number (TBN)", unit: "mg KOH/g", method: "ASTM D2896", value: "12 (Gadinia) / 30 (Argina S3) / 40 (Argina S4) / 55 (Argina S5)" },
      { property: "Sulfated Ash", unit: "% wt", method: "ASTM D874", value: "1.5–4.5" },
      { property: "Flash Point (COC)", unit: "°C", method: "ASTM D92", value: "> 230" },
      { property: "Pour Point", unit: "°C", method: "ASTM D97", value: "-18" },
    ],
    displacementGuidance:
      "Pengganti langsung Pertamina Meditran P / Disrom / Salvir, Mobilgard 412 / 300 / 430 / 450, Castrol TLX Plus, Total Aurelia TI.",
    epcSearchQuery: "Argina",
    msdsSummary: {
      flashPoint: "> 220°C",
      fireHazard: "Busa, dry chemical, CO2.",
      healthHazard: "Kandungan deterjen kalsium tinggi. Hindari kontak kulit berkepanjangan.",
      firstAidSkin: "Cuci dengan air dan sabun industri.",
      firstAidEye: "Bilas air mengalir selama 15 menit.",
      recommendedPPE: "Sarung tangan Nitril tahan minyak, kacamata safety, safety shoes.",
      storageHandling: "Simpan drum di area beratap dengan ventilasi baik.",
      spillDisposal: "Serap dengan pasir/absorbent pad, serahkan ke pengolah limbah B3.",
    },
  },

  MYSELLA: {
    familyName: "Shell Mysella (Stationary Gas Engine Oils)",
    category: "Stationary Gas Engine Lubricants",
    tagline: "Oli Mesin Gas Stasioner Berkinerja Ekstrem & Kontrol Deposit Abu Rendah (Low Ash)",
    baseOilTech: "Group II Hydrotreated Base Oils + Advanced Low-Ash / Medium-Ash Additive Chemistry",
    typicalApplications: [
      "Pembangkit listrik gas alam stasioner (Natural Gas Cogeneration / Combined Heat & Power)",
      "Pembangkit listrik Biogas PKS (Palm Oil Mill Effluent - POME) & Landfill Gas",
      "Kompresor gas pipa transmisi gas alam (PGN, Pertagas)",
    ],
    keyHighlights: [
      {
        title: "Kendali Kerak Busi & Katup Mesin Gas (Low Ash < 0.5%)",
        desc: "Mencegah pre-ignition, knocking, dan keausan klep (valve seat recession) akibat pembentukan kerak abu berlebih.",
      },
      {
        title: "Ketahanan Asam Biogas H2S (Mysella S5 S)",
        desc: "Diformulasikan khusus menetralkan gas asam sulfur dan siloksan dari biogas limbah sawit/sampah.",
      },
    ],
    oemApprovals: [
      "INNIO Jenbacher Type 2, 3, 4, 6 (Fuel Class A, B, C)",
      "Caterpillar Gas Engines (G3600, G3500, G3400, G3300)",
      "Waukesha (VGF & ATGL Engines)",
      "MWM (Deutz Power Systems) TR 0199-99-2105",
      "MAN Gas Engines (M 3271-2 / M 3271-4)",
    ],
    industryStandards: [
      "API CF",
      "Low Ash (< 0.5% wt) / Medium Ash (< 1.0% wt)",
    ],
    typicalPhysicalProps: [
      { property: "SAE Grade", unit: "-", method: "SAE J300", value: "40" },
      { property: "Kinematic Viscosity @ 100°C", unit: "cSt", method: "ASTM D445", value: "13.5 (SAE 40)" },
      { property: "Total Base Number (TBN)", unit: "mg KOH/g", method: "ASTM D2896", value: "5.0 (S5 N) / 8.5 (S5 S)" },
      { property: "Sulfated Ash", unit: "% wt", method: "ASTM D874", value: "0.45% (Low Ash S5 N) / 0.90% (S5 S)" },
      { property: "Flash Point (COC)", unit: "°C", method: "ASTM D92", value: "245" },
      { property: "Pour Point", unit: "°C", method: "ASTM D97", value: "-18" },
    ],
    displacementGuidance:
      "Pengganti langsung Mobil Pegasus 705 / 805 / 1005, Pertamina Gasoil S40, Castrol Duratec, Total Geortia.",
    epcSearchQuery: "Mysella",
    msdsSummary: {
      flashPoint: "> 230°C",
      fireHazard: "Busa kimia, dry powder, CO2.",
      healthHazard: "Iritasi ringan pada kontak berulang.",
      firstAidSkin: "Cuci dengan air dan sabun.",
      firstAidEye: "Bilas air mengalir.",
      recommendedPPE: "Sarung tangan Nitril, kacamata safety.",
      storageHandling: "Simpan tertutup rapat.",
      spillDisposal: "Serap dengan serbuk gergaji/pasir absorbent.",
    },
  },

  TURBO: {
    familyName: "Shell Turbo (Gas, Steam & Combined Cycle Turbine Oils)",
    category: "Power Generation Turbine Oils",
    tagline: "Stabilitas Oksidasi Termal Ekstrem & Pelepasan Udara Cepat Turbin Uap & Gas (TOST > 10.000 Jam)",
    baseOilTech: "High Purity Group II / GTL Synthetic Base Oils (Turbo T / Turbo CC / Turbo S4 GX)",
    typicalApplications: [
      "Turbin uap pembangkit listrik (Steam Turbines - Siemens, Alstom, GE, Mitsubishi Hitachi)",
      "Turbin gas industri & combined cycle (Gas Turbines - GE Frame 6/7/9, Solar Turbines)",
      "Turbo-kompresor industri petrokimia & pupuk",
    ],
    keyHighlights: [
      {
        title: "TOST Oxidation Life > 10.000 Jam",
        desc: "Ketahanan oksidasi tak tertandingi, bebas pembentukan lumpur varnish pada bearing dan governor control valve.",
      },
      {
        title: "Demulsibilitas Pemisahan Air Cepat (< 10 Menit)",
        desc: "Air kondensasi uap turbin langsung terpisah sempurna tanpa membentuk emulsi putih yang merusak bearing.",
      },
    ],
    oemApprovals: [
      "Siemens Power Generation TLV 9013 04 & TLV 9013 05",
      "General Electric GEK 32568K, GEK 28143B, GEK 107395A, GEK 46506E",
      "Mitsubishi Power MS04-MA-CL001 / CL002",
      "Solar Turbines ES 9-224Y Class II",
      "Alstom HTGD 90 117",
    ],
    industryStandards: [
      "ISO 8068 (L-TGA & L-TGSB)",
      "DIN 51515 Part 1 (L-TD) & Part 2 (L-TG)",
      "ASTM D4304 Type I & Type II",
      "JIS K 2213:2006 Type 2",
    ],
    typicalPhysicalProps: [
      { property: "ISO Viscosity Grade", unit: "-", method: "ISO 3448", value: "32 / 46 / 68" },
      { property: "Kinematic Viscosity @ 40°C", unit: "cSt", method: "ASTM D445", value: "32.0 / 46.0 / 68.0" },
      { property: "Kinematic Viscosity @ 100°C", unit: "cSt", method: "ASTM D445", value: "5.4 / 6.8 / 8.8" },
      { property: "Viscosity Index (VI)", unit: "-", method: "ASTM D2270", value: "> 105" },
      { property: "Flash Point (COC)", unit: "°C", method: "ASTM D92", value: "220–240" },
      { property: "Air Release @ 50°C", unit: "minutes", method: "ASTM D3427", value: "< 2" },
    ],
    displacementGuidance:
      "Pengganti langsung Pertamina Turbolube 32/46/68, Mobil DTE 700 / DTE 800 series, Total Preslia, Castrol Perfecto T.",
    epcSearchQuery: "Turbo",
    msdsSummary: {
      flashPoint: "> 220°C",
      fireHazard: "Busa, dry powder, CO2.",
      healthHazard: "Iritasi ringan pada kontak langsung.",
      firstAidSkin: "Cuci dengan sabun.",
      firstAidEye: "Bilas air bersih.",
      recommendedPPE: "Sarung tangan Nitril, kacamata safety.",
      storageHandling: "Simpan tertutup rapat.",
      spillDisposal: "Serap dengan pasir.",
    },
  },

  MORLINA: {
    familyName: "Shell Morlina (Bearing & Industrial Circulating Oils)",
    category: "Circulating & Spindle Lubricants",
    tagline: "Perlindungan Bearing Roll Neck Pabrik Baja & Spindle Kecepatan Tinggi CNC (Morlina S2 B / S2 BL)",
    baseOilTech: "Solvent-Refined Mineral / Synthetic PAO with Anti-Rust & Anti-Oxidation Chemistry",
    typicalApplications: [
      "Sistem sirkulasi bearing pabrik baja & pabrik kertas (Morgan No-Twist Mill, Danieli)",
      "Spindle bearing putaran super tinggi mesin CNC & tekstil (Morlina S2 BL 10 cSt)",
      "Pelumasan gear ringan dan sistem pompa tertutup",
    ],
    keyHighlights: [
      {
        title: "Pemisahan Air Ekstra Cepat & Anti-Karat",
        desc: "Karakteristik demulsibilitas super cepat mencegah korosi pada bearing roll neck mill baja yang disiram air pendingin masif.",
      },
      {
        title: "Viskositas Ringan untuk Spindle Kecepatan Tinggi (S2 BL 10)",
        desc: "Mengurangi gesekan internal cairan pada putaran > 10.000 RPM tanpa peningkatan temperatur bearing.",
      },
    ],
    oemApprovals: [
      "Morgan Construction Company (No-Twist Mill Lubricant Specs)",
      "Danieli Standard 0.000.001",
      "Fives Cincinnati P-62 (ISO 10) / P-55 (ISO 46)",
    ],
    industryStandards: [
      "ISO 12925-1 Type CKB / CKS",
      "DIN 51517 Part 1 (C) & Part 2 (CL)",
    ],
    typicalPhysicalProps: [
      { property: "ISO Grade", unit: "-", method: "ISO 3448", value: "10 (BL) / 32 / 46 / 68 / 100 / 150 / 220 / 320 / 460" },
      { property: "Kinematic Viscosity @ 40°C", unit: "cSt", method: "ASTM D445", value: "10.0 / 32.0 / 46.0 / 100 / 150 / 220 / 460" },
      { property: "Flash Point (COC)", unit: "°C", method: "ASTM D92", value: "150 (BL10) / 220–260" },
      { property: "Pour Point", unit: "°C", method: "ASTM D97", value: "-30 s/d -12" },
    ],
    displacementGuidance:
      "Pengganti langsung Mobil DTE Oil Named series (Heavy, Extra Heavy, BB, AA), Pertamina Cirkan, Castrol Magna.",
    epcSearchQuery: "Morlina",
    msdsSummary: {
      flashPoint: "> 150°C (S2 BL 10) / > 220°C (S2 B)",
      fireHazard: "Busa, dry chemical, CO2.",
      healthHazard: "Hindari kontak kulit.",
      firstAidSkin: "Cuci dengan sabun.",
      firstAidEye: "Bilas air mengalir.",
      recommendedPPE: "Sarung tangan Nitril, kacamata safety.",
      storageHandling: "Simpan di rak tertutup.",
      spillDisposal: "Serap dengan serbuk gergaji/pasir.",
    },
  },

  DIALA: {
    familyName: "Shell Diala & Midel (Electrical Insulating & Transformer Oils)",
    category: "Transformer & Switchgear Oils",
    tagline: "Minyak Trafo Isolasi Listrik Tegangan Tinggi Berbasis GTL Murni Bebas Sulfur (Diala S4 ZX-I)",
    baseOilTech: "Gas-to-Liquid (GTL) Ultra-Pure Hydrocarbon (Diala S4 ZX-I) / Naphthenic Mineral (Diala S2 ZX-A) / Synthetic Ester (Midel 7131)",
    typicalApplications: [
      "Trafo tenaga listrik tegangan tinggi PLN & gardu induk industri (Power Transformers)",
      "Trafo distribusi pabrik, generator transformer, dan switchgear tegangan tinggi",
      "Trafo dalam ruangan & area rentan bahaya kebakaran (Midel 7131 Fire Safe Ester)",
    ],
    keyHighlights: [
      {
        title: "Breakdown Voltage Sangat Tinggi (> 70 kV)",
        desc: "Kekuatan dielektrik tinggi mencegah loncatan busur listrik internal dan mengoptimalkan disipasi panas trafo.",
      },
      {
        title: "Bebas Sulfur Korosif 100% (ASTM D1275B & IEC 62535)",
        desc: "Dibuat dari gas alam murni bebas sulfur korosif yang dapat merusak lilitan tembaga transformator.",
      },
    ],
    oemApprovals: [
      "PLN (Perusahaan Listrik Negara) Specification Compliant",
      "ABB, Siemens Energy, Schneider Electric Transformer Specs",
      "Hitachi Energy Power Transformers",
    ],
    industryStandards: [
      "IEC 60296 (Higher Oxidation Stability & Low Sulphur)",
      "ASTM D3487 Type I & Type II",
      "Doble TOP (Testing of Transformer Oils)",
    ],
    typicalPhysicalProps: [
      { property: "Dielectric Breakdown Voltage", unit: "kV", method: "IEC 60156", value: "> 70 kV (setelah treatment)" },
      { property: "Kinematic Viscosity @ 40°C", unit: "cSt", method: "ISO 3104", value: "9.6 (S4 ZX-I) / 10.5" },
      { property: "Density @ 20°C", unit: "kg/m³", method: "ISO 3675", value: "805 (GTL Ultra Light)" },
      { property: "Flash Point (PMCC)", unit: "°C", method: "ISO 2719", value: "> 140" },
      { property: "Pour Point", unit: "°C", method: "ISO 3016", value: "< -40" },
      { property: "Corrosive Sulphur", unit: "-", method: "IEC 62535", value: "Not Corrosive (Pass)" },
    ],
    displacementGuidance:
      "Pengganti langsung Nynas Nytro series, Ergon HyVolt, Mobil Electrex, Pertamina Perta Trafo.",
    epcSearchQuery: "Diala",
    msdsSummary: {
      flashPoint: "> 140°C",
      fireHazard: "Busa, dry powder, CO2.",
      healthHazard: "Hindari kontak kulit.",
      firstAidSkin: "Cuci dengan sabun.",
      firstAidEye: "Bilas air mengalir.",
      recommendedPPE: "Sarung tangan Nitril, kacamata safety.",
      storageHandling: "PENTING: Jaga drum selalu tertutup kedap udara dan bebas kelembaban air.",
      spillDisposal: "Serap dengan pad absorbent khusus minyak.",
    },
  },

  TONNA: {
    familyName: "Shell Tonna (Machine Tool Slideway Oils)",
    category: "Slideway & Guide Lubricants",
    tagline: "Presisi Gerak Mesin Perkakas CNC Tanpa Stick-Slip (Tonna S2 M / S3 M)",
    baseOilTech: "Highly Refined Mineral + Friction Modifier & Extreme Tackiness Additives",
    typicalApplications: [
      "Slideway, bedways, dan rel pemandu mesin bubut, milling, dan CNC machining center",
      "Sistem hidrolik dan rel kombinasi mesin perkakas (Tonna S2 M 32 / 68)",
      "Slideway vertikal beban berat (Tonna S2 M 220)",
    ],
    keyHighlights: [
      {
        title: "Eliminasi Stick-Slip & Getaran Halus",
        desc: "Aditif friksi khusus menjamin pergerakan meja CNC presisi tinggi dengan toleransi mikron tanpa hentakan gerak awal.",
      },
      {
        title: "Pemisahan Sempurna dari Metalworking Coolant",
        desc: "Tidak larut dalam cairan pendingin pemotongan (coolant water-soluble), memudahkan pembersihan tramp oil dari tangki mesin.",
      },
    ],
    oemApprovals: [
      "Fives Cincinnati P-47 (ISO 68), P-50 (ISO 220), P-53 (ISO 32)",
      "Mori Seiki, Mazak, Makino Machine Tools",
    ],
    industryStandards: [
      "ISO 19378 / ISO 6743-13 GA and GB",
      "DIN 51502 CGLP",
    ],
    typicalPhysicalProps: [
      { property: "ISO Grade", unit: "-", method: "ISO 3448", value: "32 / 68 / 220" },
      { property: "Kinematic Viscosity @ 40°C", unit: "cSt", method: "ASTM D445", value: "32.0 / 68.0 / 220.0" },
      { property: "Flash Point (COC)", unit: "°C", method: "ASTM D92", value: "215–240" },
      { property: "Stick-Slip Ratio", unit: "-", method: "Cincinnati Machine", value: "0.75 (Excellent)" },
    ],
    displacementGuidance:
      "Pengganti langsung Mobil Vactra Oil No. 1 / No. 2 / No. 4, Castrol Magna BD / CF, Total Drosera MS.",
    epcSearchQuery: "Tonna",
    msdsSummary: {
      flashPoint: "> 210°C",
      fireHazard: "Busa, dry powder, CO2.",
      healthHazard: "Iritasi ringan pada kontak lama.",
      firstAidSkin: "Cuci dengan sabun.",
      firstAidEye: "Bilas air bersih.",
      recommendedPPE: "Sarung tangan Nitril, kacamata safety.",
      storageHandling: "Simpan tertutup rapat.",
      spillDisposal: "Serap dengan serbuk gergaji/pasir.",
    },
  },

  REFRIGERATION: {
    familyName: "Shell Refrigeration Oil (Refrigeration Compressor Oils)",
    category: "Refrigeration & Chiller Lubricants",
    tagline: "Pelumas Kompresor Pendingin Amonia (R717) & Freon HFC Sintetik (S2 FR-A / S4 FR-F)",
    baseOilTech: "Naphthenic Mineral (S2 FR-A for Ammonia) / Synthetic Polyol Ester POE (S4 FR-F for HFC)",
    typicalApplications: [
      "Kompresor pendingin Amonia (R717) pabrik es, cold storage, dan pengolahan ikan (S2 FR-A 46/68)",
      "Kompresor pendingin gas HFC R134a, R404a, R507, R410A (S4 FR-F 32/68)",
      "Chiller industri HVAC & supermarket refrigeration",
    ],
    keyHighlights: [
      {
        title: "Kelarutan Rendah dalam Amonia (S2 FR-A)",
        desc: "Stabilitas termal tinggi dan titik beku sangat rendah mencegah penyumbatan evaporator oleh kerak lilin.",
      },
      {
        title: "Miscibility Luar Biasa dengan Refrigerant HFC (S4 FR-F)",
        desc: "Base oil POE sintetik menjamin sirkulasi oli kembali ke kompresor tanpa tertahan di evaporator.",
      },
    ],
    oemApprovals: [
      "Sabroe Refrigeration Compressors",
      "Bitzer Kühlmaschinenbau",
      "Danfoss Industrial Refrigeration",
      "Mayekawa (Mycom) Compressors",
      "Grasso, Carrier, Trane",
    ],
    industryStandards: [
      "DIN 51503 KAA (Ammonia) / KD / KE",
      "ISO 6743-3 DRA / DRF",
    ],
    typicalPhysicalProps: [
      { property: "ISO Grade", unit: "-", method: "ISO 3448", value: "46 / 68" },
      { property: "Kinematic Viscosity @ 40°C", unit: "cSt", method: "ASTM D445", value: "46.0 / 68.0" },
      { property: "Flash Point (COC)", unit: "°C", method: "ASTM D92", value: "> 200" },
      { property: "Pour Point", unit: "°C", method: "ASTM D97", value: "-39 (S2 FR-A) / -45 (S4 FR-F)" },
      { property: "Floc Point (R12/Ammonia)", unit: "°C", method: "DIN 51351", value: "< -45" },
    ],
    displacementGuidance:
      "Pengganti langsung Suniso 3GS / 4GS, Mobil Gargoyle Arctic series, Emkarate RL 32H / 68H, Total Lunaria.",
    epcSearchQuery: "Refrigeration",
    msdsSummary: {
      flashPoint: "> 200°C",
      fireHazard: "Busa kimia, dry powder, CO2.",
      healthHazard: "PENTING: Hindari kontak dengan gas refrigerant terlarut bertekanan.",
      firstAidSkin: "Cuci dengan air dan sabun.",
      firstAidEye: "Bilas air mengalir.",
      recommendedPPE: "Sarung tangan pelindung, kacamata safety anti-splash.",
      storageHandling: "Kemasan POE wajib selalu tertutup kedap (higroskopis menyerap air).",
      spillDisposal: "Serap dengan pad absorbent.",
    },
  },

  HEAT_TRANSFER: {
    familyName: "Shell Heat Transfer Oil (Industrial Thermal Fluids)",
    category: "Heat Transfer Fluids",
    tagline: "Minyak Pemanas Termal Suhu Tinggi Hingga 320°C Tanpa Pembentukan Kerak Kokas (Heat Transfer Oil S2)",
    baseOilTech: "Selected Highly Refined Mineral Oils with High Thermal Cracking Resistance",
    typicalApplications: [
      "Sistem pemanas sirkulasi oli tertutup industri tekstil, plastik, karet, dan kimia",
      "Asphalt mixing plant (AMP) & unit pemanas tangki aspal curah",
      "Pemanas tangki CPO pabrik kelapa sawit & boiler transfer panas",
    ],
    keyHighlights: [
      {
        title: "Temperatur Operasi Film Hingga 340°C (Bulk 320°C)",
        desc: "Ketahanan thermal cracking ekstrem mencegah degradasi molekul oli menjadi gas ringan dan kerak kokas keras pada dinding pipa boiler.",
      },
      {
        title: "Koefisien Transfer Panas Tinggi",
        desc: "Viskositas rendah pada suhu operasi menjamin aliran turbulen dan efisiensi perpindahan panas optimal dengan konsumsi energi minimal.",
      },
    ],
    oemApprovals: [
      "Babcock Wanson Thermal Fluid Heaters",
      "Konus-Kessel, Max Weishaupt Heaters",
    ],
    industryStandards: [
      "ISO 6743-12 Family Q",
      "DIN 51522 (Heat Transfer Fluids)",
    ],
    typicalPhysicalProps: [
      { property: "Density @ 15°C", unit: "kg/m³", method: "ASTM D4052", value: "868" },
      { property: "Kinematic Viscosity @ 40°C", unit: "cSt", method: "ASTM D445", value: "25.0" },
      { property: "Kinematic Viscosity @ 100°C", unit: "cSt", method: "ASTM D445", value: "4.7" },
      { property: "Flash Point (PMCC)", unit: "°C", method: "ASTM D93", value: "210" },
      { property: "Max Film Temperature", unit: "°C", method: "Shell Standard", value: "340" },
      { property: "Max Bulk Temperature", unit: "°C", method: "Shell Standard", value: "320" },
      { property: "Auto-Ignition Temperature", unit: "°C", method: "DIN 51794", value: "> 350" },
    ],
    displacementGuidance:
      "Pengganti langsung Mobiltherm 605, Pertamina Terma 32, Total Seriola 1510, Castrol Perfecto HT.",
    epcSearchQuery: "Heat Transfer",
    msdsSummary: {
      flashPoint: "> 210°C",
      fireHazard: "Busa kimia, dry powder, CO2. Karbon monoksida dapat timbul jika terbakar.",
      healthHazard: "BAHAYA LUKA BAKAR SUHU TINGGI (> 300°C pada sistem aktif).",
      firstAidSkin: "Jika terkena oli panas, dinginkan segera dengan air es mengalir minimal 20 menit dan bawa ke RS.",
      firstAidEye: "Bilas air mengalir selama 15 menit.",
      recommendedPPE: "Sarung tangan tahan panas, face shield pelindung wajah, pakaian kerja tebal.",
      storageHandling: "Pastikan sistem sirkulasi bebas udara (inert gas nitrogen blanketing jika tersedia).",
      spillDisposal: "Tunggu dingin, bendung dengan pasir/absorbent pad.",
    },
  },

  CASSIDA: {
    familyName: "Shell Cassida / FUCHS Cassida (Food Grade Lubricants)",
    category: "Food Grade Lubricants & Greases",
    tagline: "Pelumas Food Grade Bersertifikat Halal, Kosher & NSF H1 untuk Industri Makanan & Minuman",
    baseOilTech: "Full Synthetic PAO / Synthetic Ester + Non-Toxic Food Grade Additives",
    typicalApplications: [
      "Mesin pengolahan makanan, minuman, dan farmasi dengan risiko kontak langsung (Incidental Contact)",
      "Pabrik roti, biskuit, pengalengan, susu, bir, dan air minum dalam kemasan (AMDK)",
      "Conveyor, gearbox, hydraulic, dan bearing mesin pengemas steril",
    ],
    keyHighlights: [
      {
        title: "Sertifikasi NSF H1 Registered & Halal MUI",
        desc: "Aman dan memenuhi standar audit BPOM, HACCP, ISO 22000, serta FSSC 22000 untuk keamanan pangan internasional.",
      },
      {
        title: "Performa Full Sintetik Tahan Suhu Ekstrem (-45°C s/d +180°C)",
        desc: "Melindungi bearing di ruang pembekuan (freezer) hingga oven pemanggang makanan tanpa degradasi.",
      },
    ],
    oemApprovals: [
      "NSF International H1 Registered (Direct Food Contact Safety)",
      "Halal MUI Certified",
      "Kosher Certified",
      "Tetra Pak, Krones, Sidel Beverage Processing",
    ],
    industryStandards: [
      "ISO 21469 (Safety of Machinery - Lubricants with incidental product contact)",
      "DIN 51524 (HLP / HVLP Food Grade)",
    ],
    typicalPhysicalProps: [
      { property: "NLGI Grade (Grease RL/EPS)", unit: "-", method: "ASTM D217", value: "00 / 1 / 2" },
      { property: "Dropping Point", unit: "°C", method: "IP 396", value: "> 250" },
      { property: "Operating Temperature", unit: "°C", method: "Standard", value: "-45 s/d +170" },
      { property: "NSF Registration Category", unit: "-", method: "NSF", value: "H1 (Incidental Contact)" },
    ],
    displacementGuidance:
      "Pengganti langsung Mobil SHC Cibus series, Total Nevastane, Klüber Food Grade, Petro-Canada Purity FG.",
    epcSearchQuery: "Cassida",
    msdsSummary: {
      flashPoint: "> 230°C",
      fireHazard: "Busa, dry powder, CO2.",
      healthHazard: "Non-toksik, namun bukan untuk dikonsumsi langsung.",
      firstAidSkin: "Cuci dengan air dan sabun.",
      firstAidEye: "Bilas air mengalir.",
      recommendedPPE: "Sarung tangan food-grade, kacamata safety.",
      storageHandling: "Simpan terpisah dari pelumas non-food grade untuk mencegah kontaminasi silang.",
      spillDisposal: "Bersihkan sesuai prosedur higienitas pabrik makanan.",
    },
  },

  AEROSHELL: {
    familyName: "AeroShell (Aviation Turbine & Piston Engine Oils)",
    category: "Aviation Lubricants & Specialty Fluids",
    tagline: "Standar Pelumas Kedirgantaraan Internasional & Turbin Aviasi Militer/Sipil (AeroShell Turbine Oil 500)",
    baseOilTech: "Hindered Synthetic Neopentylpolyol Ester with Extreme Thermal-Oxidation Additives",
    typicalApplications: [
      "Turbin gas pesawat terbang militer & sipil (Pratt & Whitney, Rolls-Royce, GE Aviation, Honeywell)",
      "Turbin industri pembangkit tenaga aeroderivative (GE LM2500, LM6000, Solar Turbines)",
      "Sistem hidrolik pesawat terbang & helikopter (AeroShell Fluid 41)",
    ],
    keyHighlights: [
      {
        title: "Standar Militer AS & NATO (MIL-PRF-23699F Class STD / DEF STAN 91-101)",
        desc: "Kestabilan oksidasi termal pada suhu ruang bakar hingga > 200°C tanpa pembentukan deposit kokas pada bearing turbin putaran tinggi (> 20.000 RPM).",
      },
      {
        title: "Kompatibilitas Logam Paduan Dirgantara",
        desc: "Aman dan tidak korosif terhadap titanium, magnesium alloy, tembaga, dan baja berkekuatan tinggi.",
      },
    ],
    oemApprovals: [
      "Pratt & Whitney (521C Type II)",
      "Rolls-Royce (Turbomeca, Allison 250)",
      "General Electric Aviation (D-50 TF 1)",
      "Honeywell (AlliedSignal / Lycoming)",
      "Safran Helicopter Engines",
    ],
    industryStandards: [
      "MIL-PRF-23699F Grade STD (US Military Specification)",
      "DEF STAN 91-101 (British Ministry of Defence)",
      "NATO Code O-156",
    ],
    typicalPhysicalProps: [
      { property: "Kinematic Viscosity @ 100°C", unit: "cSt", method: "ASTM D445", value: "5.1" },
      { property: "Kinematic Viscosity @ 40°C", unit: "cSt", method: "ASTM D445", value: "25.0" },
      { property: "Kinematic Viscosity @ -40°C", unit: "cSt", method: "ASTM D445", value: "< 13.000" },
      { property: "Flash Point (COC)", unit: "°C", method: "ASTM D92", value: "> 256" },
      { property: "Pour Point", unit: "°C", method: "ASTM D97", value: "< -54" },
      { property: "Total Acid Number (TAN)", unit: "mg KOH/g", method: "ASTM D664", value: "< 0.3" },
      { property: "Evaporation Loss (6.5h/204°C)", unit: "% wt", method: "ASTM D972", value: "< 3.0" },
    ],
    displacementGuidance:
      "Pengganti langsung Mobil Jet Oil II, Castrol Turbonycoil 600, BP Turbo Oil 2380, Royco 500.",
    epcSearchQuery: "AeroShell",
    msdsSummary: {
      flashPoint: "> 250°C",
      fireHazard: "Busa alkohol tahan ester, dry chemical powder, CO2.",
      healthHazard: "Mengandung ester sintetik dan inhibitor fenolik. Hindari inhalasi uap panas.",
      firstAidSkin: "Cuci dengan sabun dan air.",
      firstAidEye: "Bilas air mengalir selama 15 menit.",
      recommendedPPE: "Sarung tangan Nitril tebal / Butyl rubber, kacamata safety.",
      storageHandling: "Simpan dalam botol kaleng asli bersegel kedap di tempat sejuk.",
      spillDisposal: "Serap dengan absorbent pad khusus ester, buang ke pengolah limbah B3.",
    },
  },

  COOLANT_SPECIALTY: {
    familyName: "Shell Coolant & HD Fluids (Heavy Duty Coolants & Brake Fluids)",
    category: "Heavy Duty Coolants & Glycol Fluids",
    tagline: "Perlindungan Korosi & Kavitasi Liner Silinder Heavy Duty Radiator (Shell HD Coolant Prediluted)",
    baseOilTech: "Ethylene Glycol + Organic Acid Technology (OAT) / Hybrid Nitrite-Free Inhibitors",
    typicalApplications: [
      "Radiator pendingin mesin alat berat tambang & genset industri (Komatsu, Caterpillar, Perkins, Cummins)",
      "Truk logistik jarak jauh & armada bus",
      "Sistem rem hidrolik kendaraan operasional (Shell DOT 4 Brake Fluid)",
    ],
    keyHighlights: [
      {
        title: "Perlindungan Kavitasi Liner Silinder Basah (Wet Liner Pitting)",
        desc: "Aditif OAT canggih membentuk lapisan pasivasi kuat pada liner silinder, mencegah kebocoran air radiator ke ruang oli.",
      },
      {
        title: "Masa Pakai Ekstra Panjang (Hingga 6.000 Jam / 600.000 km)",
        desc: "Bebas silikat dan borat, tidak membentuk endapan gel pada saluran inti radiator.",
      },
    ],
    oemApprovals: [
      "Caterpillar EC-1",
      "Cummins CES 14603 / CES 14439",
      "Komatsu KES 07.892",
      "Detroit Diesel 93K217",
      "Mercedes-Benz MB 325.3 / 326.3",
    ],
    industryStandards: [
      "ASTM D6210 (Fully Formulated Heavy-Duty Coolant)",
      "ASTM D3306 (Automotive Coolant)",
      "JIS K 2234",
    ],
    typicalPhysicalProps: [
      { property: "Specific Gravity @ 20°C", unit: "-", method: "ASTM D1122", value: "1.07 (50/50 Prediluted) / 1.12 (Concentrate)" },
      { property: "Freezing Point", unit: "°C", method: "ASTM D1177", value: "-37°C (50/50 Prediluted)" },
      { property: "Boiling Point (15 psi cap)", unit: "°C", method: "ASTM D1120", value: "> 129" },
      { property: "pH Value", unit: "-", method: "ASTM D1287", value: "8.0–8.6" },
    ],
    displacementGuidance:
      "Pengganti langsung Caterpillar ELC, Komatsu Supercoolant AF-NAC, Pertamina Coolant, Mobil Delvac Extended Life Coolant.",
    epcSearchQuery: "Coolant",
    msdsSummary: {
      flashPoint: "> 115°C (Concentrate)",
      fireHazard: "Busa, dry powder, water spray.",
      healthHazard: "BERBAHAYA JIKA TERTELAN (Mengandung Ethylene Glycol). Jauhkan dari jangkauan anak/hewan.",
      firstAidSkin: "Cuci dengan air mengalir dan sabun.",
      firstAidEye: "Bilas air mengalir minimal 15 menit.",
      recommendedPPE: "Sarung tangan karet, safety glasses.",
      storageHandling: "Simpan tertutup rapat dalam wadah aslinya.",
      spillDisposal: "Bilas dengan air banyak atau serap dengan pasir, serahkan ke pengolah limbah B3.",
    },
  },

  HELIX: {
    familyName: "Shell Helix (Passenger Car Motor Oils)",
    category: "Passenger Car Motor Oils",
    tagline: "Shell PurePlus Technology dari Gas Alam untuk Performa & Kebersihan Mesin Bensin/Diesel Modern",
    baseOilTech: "PurePlus Full Synthetic (GTL) / Active Cleansing Technology",
    typicalApplications: [
      "Mobil bensin & diesel penumpang (Toyota, Honda, Mitsubishi, Suzuki, Hyundai, BMW, Mercedes-Benz)",
      "Mesin turbo modern (TGDI) dengan proteksi Low-Speed Pre-Ignition (LSPI)",
      "Armada kendaraan operasional & sales company PT HUM",
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
      { property: "Kinematic Viscosity @ 100°C", unit: "cSt", method: "ASTM D445", value: "8.5 (0W-20) / 10.2 (5W-30) / 14.5 (10W-40) / 18.5 (20W-50)" },
      { property: "Viscosity Index (VI)", unit: "-", method: "ASTM D2270", value: "> 155" },
      { property: "Flash Point (COC)", unit: "°C", method: "ASTM D92", value: "235" },
      { property: "Pour Point", unit: "°C", method: "ASTM D97", value: "-45 (Ultra) / -36 (HX7)" },
    ],
    displacementGuidance:
      "Pengganti langsung Pertamina Fastron series, Mobil 1 / Mobil Super, Castrol Magnatec / Edge, Total Quartz.",
    epcSearchQuery: "Helix",
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
    familyName: "Shell Advance (Motorcycle & 2-Wheeler Oils)",
    category: "Motorcycle & Scooter Lubricants",
    tagline: "RCE Technology untuk Akselerasi Halus & Perlindungan Kopling Basah (Advance Ultra / AX7 / AX5 / SX2)",
    baseOilTech: "PurePlus Synthetic (Ultra) / Hydrotreated Base Oils (AX7 / AX5 / SX2)",
    typicalApplications: [
      "Sepeda motor 4-tak manual & matic / scooter (Honda, Yamaha, Suzuki, Kawasaki)",
      "Sepeda motor 2-tak & mesin pemotong rumput (Shell Advance SX2)",
    ],
    keyHighlights: [
      {
        title: "RCE (Reliability, Control, Enjoyment)",
        desc: "Menjaga kebersihan piston, perpindahan gigi mulus tanpa selip kopling, dan peredaman getaran mesin motor.",
      },
    ],
    oemApprovals: ["Honda, Yamaha, Suzuki, Kawasaki Motorcycle Approvals", "Ducati Official Technical Partner"],
    industryStandards: ["API SN / SL / SM", "JASO MA2 (Manual) / JASO MB (Matic Scooter)", "JASO FB (Advance SX2 2T)"],
    typicalPhysicalProps: [
      { property: "Kinematic Viscosity @ 100°C", unit: "cSt", method: "ASTM D445", value: "14.5 (10W-40) / 10.2 (10W-30 Scooter)" },
      { property: "Flash Point (COC)", unit: "°C", method: "ASTM D92", value: "230" },
      { property: "Pour Point", unit: "°C", method: "ASTM D97", value: "-33" },
    ],
    displacementGuidance: "Pengganti langsung Pertamina Enduro 4T, Castrol Power 1, Yamalube, AHM Oil.",
    epcSearchQuery: "Advance",
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
 * Intelligent matcher to resolve authentic Shell TDS & MSDS knowledge for any of the 443 SKUs in PT HUM catalog
 */
export function lookupProductTDS(
  productName: string = "",
  category?: string | null,
  viscosity?: string | null
): ShellFamilyTDS {
  const name = productName.toUpperCase();
  const cat = (category || "").toUpperCase();

  if (name.includes("TELLUS") || cat.includes("HYDRAULIC") || name.includes("WATER-GLYCOL") || name.includes("ROHS01")) {
    return SHELL_PRODUCT_FAMILIES.TELLUS;
  }
  if (name.includes("OMALA") || cat.includes("GEAR") || cat.includes("GARDAN") || name.includes("MALLEUS")) {
    return SHELL_PRODUCT_FAMILIES.OMALA;
  }
  if (name.includes("RIMULA") || name.includes("DIESEL") || cat.includes("DIESEL") || name.includes("TACTIC")) {
    return SHELL_PRODUCT_FAMILIES.RIMULA;
  }
  if (name.includes("GADUS") || name.includes("GREASE") || cat.includes("GREASE") || name.includes("ROGS02")) {
    return SHELL_PRODUCT_FAMILIES.GADUS;
  }
  if (name.includes("CORENA") || name.includes("COMPRESSOR") || cat.includes("COMPRESSOR")) {
    return SHELL_PRODUCT_FAMILIES.CORENA;
  }
  if (name.includes("SPIRAX") || name.includes("TRANSMISSION") || name.includes("AXLE") || name.includes("TEGULA")) {
    return SHELL_PRODUCT_FAMILIES.SPIRAX;
  }
  if (name.includes("ARGINA") || name.includes("GADINIA") || name.includes("MELINA") || cat.includes("MARINE")) {
    return SHELL_PRODUCT_FAMILIES.ARGINA;
  }
  if (name.includes("MYSELLA") || name.includes("GAS ENGINE") || cat.includes("GAS ENGINE")) {
    return SHELL_PRODUCT_FAMILIES.MYSELLA;
  }
  if (name.includes("TURBO") || name.includes("TURBINE") && !name.includes("AEROSHELL")) {
    return SHELL_PRODUCT_FAMILIES.TURBO;
  }
  if (name.includes("MORLINA") || name.includes("CIRCULATING") || name.includes("SPINDLE")) {
    return SHELL_PRODUCT_FAMILIES.MORLINA;
  }
  if (name.includes("DIALA") || name.includes("MIDEL") || name.includes("TRANSFORMER")) {
    return SHELL_PRODUCT_FAMILIES.DIALA;
  }
  if (name.includes("TONNA") || name.includes("SLIDEWAY")) {
    return SHELL_PRODUCT_FAMILIES.TONNA;
  }
  if (name.includes("REFRIGERATION") || name.includes("CHILLER") || name.includes("FREEZER")) {
    return SHELL_PRODUCT_FAMILIES.REFRIGERATION;
  }
  if (name.includes("HEAT TRANSFER") || name.includes("HOT OIL") || name.includes("THERMAL")) {
    return SHELL_PRODUCT_FAMILIES.HEAT_TRANSFER;
  }
  if (name.includes("CASSIDA") || name.includes("FOOD GRADE") || cat.includes("FOOD")) {
    return SHELL_PRODUCT_FAMILIES.CASSIDA;
  }
  if (name.includes("AEROSHELL") || name.includes("TURBINE OIL 500") || name.includes("AVIATION") || cat.includes("AVIATION")) {
    return SHELL_PRODUCT_FAMILIES.AEROSHELL;
  }
  if (name.includes("COOLANT") || name.includes("RECO COOL") || name.includes("ANTIFREEZE") || name.includes("BRAKE")) {
    return SHELL_PRODUCT_FAMILIES.COOLANT_SPECIALTY;
  }
  if (name.includes("HELIX") || cat.includes("PASSENGER")) {
    return SHELL_PRODUCT_FAMILIES.HELIX;
  }
  if (name.includes("ADVANCE") || name.includes("NAUTILUS") || cat.includes("MOTORCYCLE")) {
    return SHELL_PRODUCT_FAMILIES.ADVANCE;
  }

  // Fallback to Tellus Industrial Baseline with customized product title
  return {
    ...SHELL_PRODUCT_FAMILIES.TELLUS,
    familyName: productName || "Shell Industrial Lubricant",
    category: category || "Industrial Specialty Fluid",
    tagline: `Spesifikasi Pelumas Resmi Shell PT Harapan Utama Motor (${viscosity || "Specialty Grade"})`,
    epcSearchQuery: productName.split(" ")[0] || "Shell",
  };
}
