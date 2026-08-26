/**
 * Shell Products Official Pricelist Database (PT Harapan Utama Motor)
 * Extracted directly from official PT HUM Price & Fee Calculator.
 */

export type ShellPricingItem = {
  sku: string;
  name: string;
  unit: "DRUM" | "PAIL" | "BULK" | "GALON" | "BOTOL" | "PCS" | string;
  pack?: string;
  volumeUnit?: string;
  msp: number; // Minimum Selling Price (Harga Dasar PT HUM)
  category: string;
  description?: string;
  application?: string;
};

export const SHELL_PRICING_DATABASE: ShellPricingItem[] = [
  {
    "sku": "5.5004696E8",
    "name": "SHELL ADVANCE SX 2",
    "unit": "DRUM",
    "msp": 10407651.0,
    "category": "Motorcycle Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "Specialized Industrial Lubricant"
  },
  {
    "sku": "5.50024968E8",
    "name": "SHELL AIR TOOL OIL S2 A100",
    "unit": "DRUM",
    "msp": 12883797.0,
    "category": "Industrial Lubricants",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "Specialized Industrial Lubricant"
  },
  {
    "sku": "5.50046496E8",
    "name": "SHELL ARGINA S3 30",
    "unit": "DRUM",
    "msp": 14100352.0,
    "category": "Gas & Marine Engine Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "Stationary Gas & Marine Engine Lubricant"
  },
  {
    "sku": "5.50046497E8",
    "name": "SHELL ARGINA S3 40",
    "unit": "DRUM",
    "msp": 11046575.0,
    "category": "Gas & Marine Engine Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "Stationary Gas & Marine Engine Lubricant"
  },
  {
    "sku": "5.50046498E8",
    "name": "SHELL ARGINA S4 40",
    "unit": "DRUM",
    "msp": 12336068.0,
    "category": "Gas & Marine Engine Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "Stationary Gas & Marine Engine Lubricant"
  },
  {
    "sku": "5.50046511E8",
    "name": "SHELL ARGINA S5 40",
    "unit": "DRUM",
    "msp": 15992811.0,
    "category": "Gas & Marine Engine Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "Stationary Gas & Marine Engine Lubricant"
  },
  {
    "sku": "5.50075616E8",
    "name": "SHELL COOLANT ELC HD READY TO USE",
    "unit": "DRUM",
    "msp": 8513105.0,
    "category": "Coolant & Radiator",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "Long Life Heavy Duty Radiator Coolant"
  },
  {
    "sku": "5.50075616E8",
    "name": "SHELL COOLANT ELC HD READY TO USE",
    "unit": "PAIL",
    "msp": 1060744.0,
    "category": "Coolant & Radiator",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "Long Life Heavy Duty Radiator Coolant"
  },
  {
    "sku": "5.50060962E8",
    "name": "SHELL COOLANT LONGLIFE PLUS HD",
    "unit": "DRUM",
    "msp": 6990336.0,
    "category": "Coolant & Radiator",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "Long Life Heavy Duty Radiator Coolant"
  },
  {
    "sku": "5.50060962E8",
    "name": "SHELL COOLANT LONGLIFE PLUS HD 19L",
    "unit": "PAIL",
    "msp": 888000.0,
    "category": "Coolant & Radiator",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "Long Life Heavy Duty Radiator Coolant"
  },
  {
    "sku": "5.50024992E8",
    "name": "SHELL CORENA S2 P 100",
    "unit": "DRUM",
    "msp": 15769520.0,
    "category": "Compressor Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "High Performance Rotary & Reciprocating Compressor Oil"
  },
  {
    "sku": "5.50024992E8",
    "name": "SHELL CORENA S2 P 100",
    "unit": "PAIL",
    "msp": 1886306.0,
    "category": "Compressor Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "High Performance Rotary & Reciprocating Compressor Oil"
  },
  {
    "sku": "5.5002499E8",
    "name": "SHELL CORENA S2 P 150",
    "unit": "DRUM",
    "msp": 16605844.0,
    "category": "Compressor Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "High Performance Rotary & Reciprocating Compressor Oil"
  },
  {
    "sku": "5.5002499E8",
    "name": "SHELL CORENA S2 P 150",
    "unit": "PAIL",
    "msp": 2069109.0,
    "category": "Compressor Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "High Performance Rotary & Reciprocating Compressor Oil"
  },
  {
    "sku": "5.50024991E8",
    "name": "SHELL CORENA S3 R 46",
    "unit": "DRUM",
    "msp": 17510605.0,
    "category": "Compressor Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "High Performance Rotary & Reciprocating Compressor Oil"
  },
  {
    "sku": "5.50024991E8",
    "name": "SHELL CORENA S3 R 46",
    "unit": "PAIL",
    "msp": 2094570.0,
    "category": "Compressor Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "High Performance Rotary & Reciprocating Compressor Oil"
  },
  {
    "sku": "5.50024964E8",
    "name": "SHELL CORENA S3 R 68",
    "unit": "DRUM",
    "msp": 16692144.0,
    "category": "Compressor Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "High Performance Rotary & Reciprocating Compressor Oil"
  },
  {
    "sku": "5.50024964E8",
    "name": "SHELL CORENA S3 R 68",
    "unit": "PAIL",
    "msp": 1996668.0,
    "category": "Compressor Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "High Performance Rotary & Reciprocating Compressor Oil"
  },
  {
    "sku": "5.50027265E8",
    "name": "SHELL CORENA S4 P 100",
    "unit": "PAIL",
    "msp": 4842375.0,
    "category": "Compressor Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "High Performance Rotary & Reciprocating Compressor Oil"
  },
  {
    "sku": "5.50024953E8",
    "name": "SHELL CORENA S4 R 68",
    "unit": "DRUM",
    "msp": 34130369.0,
    "category": "Compressor Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "High Performance Rotary & Reciprocating Compressor Oil"
  },
  {
    "sku": "5.50024953E8",
    "name": "SHELL CORENA S4 R 68",
    "unit": "PAIL",
    "msp": 3912473.0,
    "category": "Compressor Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "High Performance Rotary & Reciprocating Compressor Oil"
  },
  {
    "sku": "5.50024955E8",
    "name": "SHELL CORENA S4 R46",
    "unit": "PAIL",
    "msp": 3475521.0,
    "category": "Compressor Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "High Performance Rotary & Reciprocating Compressor Oil"
  },
  {
    "sku": "5.50040071E8",
    "name": "SHELL DIALA S4 ZX-I",
    "unit": "DRUM",
    "msp": 10442450.0,
    "category": "Transformer & Turbine Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "Electrical Insulating & Turbine Oil"
  },
  {
    "sku": "5.50040071E8",
    "name": "SHELL DIALA S4 ZX-I",
    "unit": "PAIL",
    "msp": 1249097.0,
    "category": "Transformer & Turbine Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "Electrical Insulating & Turbine Oil"
  },
  {
    "sku": "5.50046504E8",
    "name": "SHELL GADINIA S3 30",
    "unit": "DRUM",
    "msp": 11495105.0,
    "category": "Gas & Marine Engine Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "Stationary Gas & Marine Engine Lubricant"
  },
  {
    "sku": "5.50046505E8",
    "name": "SHELL GADINIA S3 40",
    "unit": "DRUM",
    "msp": 13081336.0,
    "category": "Gas & Marine Engine Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "Stationary Gas & Marine Engine Lubricant"
  },
  {
    "sku": "5.50075956E8",
    "name": "SHELL GADINIA S4 40",
    "unit": "DRUM",
    "msp": 12234573.0,
    "category": "Gas & Marine Engine Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "Stationary Gas & Marine Engine Lubricant"
  },
  {
    "sku": "5.50026911E8",
    "name": "SHELL GADUS Rail S2 TMB Gr",
    "unit": "PAIL",
    "msp": 9857744.0,
    "category": "Industrial Grease",
    "pack": "PAIL",
    "volumeUnit": "18 KG",
    "description": "Premium Multi-Purpose Industrial Grease"
  },
  {
    "sku": "5.50061116E8",
    "name": "SHELL GADUS S1 A320 3 - 15KG",
    "unit": "PAIL",
    "msp": 1170079.0,
    "category": "Industrial Grease",
    "pack": "PAIL",
    "volumeUnit": "18 KG",
    "description": "Premium Multi-Purpose Industrial Grease"
  },
  {
    "sku": "5.50027036E8",
    "name": "SHELL GADUS S1 OG 200",
    "unit": "DRUM",
    "msp": 11238750.0,
    "category": "Industrial Grease",
    "pack": "DRUM",
    "volumeUnit": "180 KG",
    "description": "Premium Multi-Purpose Industrial Grease"
  },
  {
    "sku": "5.50027036E8",
    "name": "SHELL GADUS S1 OG 200",
    "unit": "PAIL",
    "msp": 1498500.0,
    "category": "Industrial Grease",
    "pack": "PAIL",
    "volumeUnit": "18 KG",
    "description": "Premium Multi-Purpose Industrial Grease"
  },
  {
    "sku": "5.50049708E8",
    "name": "SHELL GADUS S1 V220 2",
    "unit": "DRUM",
    "msp": 12714473.0,
    "category": "Industrial Grease",
    "pack": "DRUM",
    "volumeUnit": "180 KG",
    "description": "Premium Multi-Purpose Industrial Grease"
  },
  {
    "sku": "5.50049708E8",
    "name": "SHELL GADUS S1 V220 2",
    "unit": "PAIL",
    "msp": 1592850.0,
    "category": "Industrial Grease",
    "pack": "PAIL",
    "volumeUnit": "18 KG",
    "description": "Premium Multi-Purpose Industrial Grease"
  },
  {
    "sku": "5.50049881E8",
    "name": "SHELL GADUS S1 V220 2",
    "unit": "PAIL",
    "msp": 1592850.0,
    "category": "Industrial Grease",
    "pack": "PAIL",
    "volumeUnit": "18 KG",
    "description": "Premium Multi-Purpose Industrial Grease"
  },
  {
    "sku": "5.50077451E8",
    "name": "SHELL GADUS S1 V220 3 15KG",
    "unit": "PAIL",
    "msp": 1899099.0,
    "category": "Industrial Grease",
    "pack": "PAIL",
    "volumeUnit": "18 KG",
    "description": "Premium Multi-Purpose Industrial Grease"
  },
  {
    "sku": "5.50028647E8",
    "name": "SHELL GADUS S2 A320",
    "unit": "PAIL",
    "msp": 1599649.0,
    "category": "Industrial Grease",
    "pack": "PAIL",
    "volumeUnit": "18 KG",
    "description": "Premium Multi-Purpose Industrial Grease"
  },
  {
    "sku": "5.5005234E8",
    "name": "SHELL GADUS S2 OG 85 - 190 KG",
    "unit": "DRUM",
    "msp": 62734841.0,
    "category": "Industrial Grease",
    "pack": "DRUM",
    "volumeUnit": "180 KG",
    "description": "Premium Multi-Purpose Industrial Grease"
  },
  {
    "sku": "5.5005234E8",
    "name": "SHELL GADUS S2 OG 85 15KG",
    "unit": "PAIL",
    "msp": 7924401.0,
    "category": "Industrial Grease",
    "pack": "PAIL",
    "volumeUnit": "18 KG",
    "description": "Premium Multi-Purpose Industrial Grease"
  },
  {
    "sku": "5.50074208E8",
    "name": "SHELL GADUS S2 OG CLEAR OIL 6800",
    "unit": "DRUM",
    "msp": 16775708.0,
    "category": "Industrial Grease",
    "pack": "DRUM",
    "volumeUnit": "180 KG",
    "description": "Premium Multi-Purpose Industrial Grease"
  },
  {
    "sku": "5.50072543E8",
    "name": "SHELL GADUS S2 OGT 1",
    "unit": "DRUM",
    "msp": 48701250.0,
    "category": "Industrial Grease",
    "pack": "DRUM",
    "volumeUnit": "180 KG",
    "description": "Premium Multi-Purpose Industrial Grease"
  },
  {
    "sku": "5.50025674E8",
    "name": "SHELL GADUS S2 U460L 2",
    "unit": "DRUM",
    "msp": 16382801.0,
    "category": "Industrial Grease",
    "pack": "DRUM",
    "volumeUnit": "180 KG",
    "description": "Premium Multi-Purpose Industrial Grease"
  },
  {
    "sku": "5.50025674E8",
    "name": "SHELL GADUS S2 U460L 2",
    "unit": "PAIL",
    "msp": 2184373.0,
    "category": "Industrial Grease",
    "pack": "PAIL",
    "volumeUnit": "18 KG",
    "description": "Premium Multi-Purpose Industrial Grease"
  },
  {
    "sku": "5.50027049E8",
    "name": "SHELL GADUS S2 V100 2 / ALVANIA RL2",
    "unit": "PAIL",
    "msp": 1879119.0,
    "category": "Industrial Grease",
    "pack": "PAIL",
    "volumeUnit": "18 KG",
    "description": "Premium Multi-Purpose Industrial Grease"
  },
  {
    "sku": "5.50027051E8",
    "name": "SHELL GADUS S2 V100 2 / ALVANIA RL2",
    "unit": "DRUM",
    "msp": 17636746.0,
    "category": "Industrial Grease",
    "pack": "DRUM",
    "volumeUnit": "180 KG",
    "description": "Premium Multi-Purpose Industrial Grease"
  },
  {
    "sku": "5.50027051E8",
    "name": "SHELL GADUS S2 V100 2 / ALVANIA RL2",
    "unit": "PAIL",
    "msp": 1879119.0,
    "category": "Industrial Grease",
    "pack": "PAIL",
    "volumeUnit": "18 KG",
    "description": "Premium Multi-Purpose Industrial Grease"
  },
  {
    "sku": "5.50027032E8",
    "name": "SHELL GADUS S2 V100 3 / ALVANIA RL3",
    "unit": "PAIL",
    "msp": 2294423.0,
    "category": "Industrial Grease",
    "pack": "PAIL",
    "volumeUnit": "18 KG",
    "description": "Premium Multi-Purpose Industrial Grease"
  },
  {
    "sku": "5.50027048E8",
    "name": "SHELL GADUS S2 V100 3 / ALVANIA RL3",
    "unit": "DRUM",
    "msp": 19437343.0,
    "category": "Industrial Grease",
    "pack": "DRUM",
    "volumeUnit": "180 KG",
    "description": "Premium Multi-Purpose Industrial Grease"
  },
  {
    "sku": "5.50027048E8",
    "name": "SHELL GADUS S2 V100 3 / ALVANIA RL3",
    "unit": "PAIL",
    "msp": 2294423.0,
    "category": "Industrial Grease",
    "pack": "PAIL",
    "volumeUnit": "18 KG",
    "description": "Premium Multi-Purpose Industrial Grease"
  },
  {
    "sku": "5.50048582E8",
    "name": "SHELL GADUS S2 V1000AD 1.5",
    "unit": "DRUM",
    "msp": 27062910.0,
    "category": "Industrial Grease",
    "pack": "DRUM",
    "volumeUnit": "180 KG",
    "description": "Premium Multi-Purpose Industrial Grease"
  },
  {
    "sku": "5.50048514E8",
    "name": "SHELL GADUS S2 V150C 3",
    "unit": "PAIL",
    "msp": 2114736.0,
    "category": "Industrial Grease",
    "pack": "PAIL",
    "volumeUnit": "18 KG",
    "description": "Premium Multi-Purpose Industrial Grease"
  },
  {
    "sku": "5.50027035E8",
    "name": "SHELL GADUS S2 V220 0 / ALVANIA EP(LF)0",
    "unit": "PAIL",
    "msp": 2021350.0,
    "category": "Industrial Grease",
    "pack": "PAIL",
    "volumeUnit": "18 KG",
    "description": "Premium Multi-Purpose Industrial Grease"
  },
  {
    "sku": "5.5002703E8",
    "name": "SHELL GADUS S2 V220 1 / ALVANIA EP(LF)1",
    "unit": "DRUM",
    "msp": 18801180.0,
    "category": "Industrial Grease",
    "pack": "DRUM",
    "volumeUnit": "180 KG",
    "description": "Premium Multi-Purpose Industrial Grease"
  },
  {
    "sku": "5.5002703E8",
    "name": "SHELL GADUS S2 V220 1 / ALVANIA EP(LF)1",
    "unit": "PAIL",
    "msp": 2193471.0,
    "category": "Industrial Grease",
    "pack": "PAIL",
    "volumeUnit": "18 KG",
    "description": "Premium Multi-Purpose Industrial Grease"
  },
  {
    "sku": "5.50027033E8",
    "name": "SHELL GADUS S2 V220 1 / ALVANIA EP(LF)1",
    "unit": "PAIL",
    "msp": 2193471.0,
    "category": "Industrial Grease",
    "pack": "PAIL",
    "volumeUnit": "18 KG",
    "description": "Premium Multi-Purpose Industrial Grease"
  },
  {
    "sku": "5.50025669E8",
    "name": "SHELL GADUS S2 V220 2 / ALVANIA EP(LF)2",
    "unit": "DRUM",
    "msp": 17797385.0,
    "category": "Industrial Grease",
    "pack": "DRUM",
    "volumeUnit": "180 KG",
    "description": "Premium Multi-Purpose Industrial Grease"
  },
  {
    "sku": "5.50025669E8",
    "name": "SHELL GADUS S2 V220 2 / ALVANIA EP(LF)2",
    "unit": "PAIL",
    "msp": 2071526.0,
    "category": "Industrial Grease",
    "pack": "PAIL",
    "volumeUnit": "18 KG",
    "description": "Premium Multi-Purpose Industrial Grease"
  },
  {
    "sku": "5.50027031E8",
    "name": "SHELL GADUS S2 V220 2 / ALVANIA EP(LF)2",
    "unit": "PAIL",
    "msp": 2071526.0,
    "category": "Industrial Grease",
    "pack": "PAIL",
    "volumeUnit": "18 KG",
    "description": "Premium Multi-Purpose Industrial Grease"
  },
  {
    "sku": "5.50027046E8",
    "name": "SHELL GADUS S2 V220 3",
    "unit": "DRUM",
    "msp": 16562621.0,
    "category": "Industrial Grease",
    "pack": "DRUM",
    "volumeUnit": "180 KG",
    "description": "Premium Multi-Purpose Industrial Grease"
  },
  {
    "sku": "5.50025675E8",
    "name": "SHELL GADUS S2 V220AC 2",
    "unit": "DRUM",
    "msp": 19502078.0,
    "category": "Industrial Grease",
    "pack": "DRUM",
    "volumeUnit": "180 KG",
    "description": "Premium Multi-Purpose Industrial Grease"
  },
  {
    "sku": "5.50025675E8",
    "name": "SHELL GADUS S2 V220AC 2",
    "unit": "PAIL",
    "msp": 2482904.0,
    "category": "Industrial Grease",
    "pack": "PAIL",
    "volumeUnit": "18 KG",
    "description": "Premium Multi-Purpose Industrial Grease"
  },
  {
    "sku": "5.50028096E8",
    "name": "SHELL GADUS S3 HS Coup Gr",
    "unit": "PAIL",
    "msp": 7720522.0,
    "category": "Industrial Grease",
    "pack": "PAIL",
    "volumeUnit": "18 KG",
    "description": "Premium Multi-Purpose Industrial Grease"
  },
  {
    "sku": "5.50032214E8",
    "name": "SHELL GADUS S3 T100 2",
    "unit": "PAIL",
    "msp": 4964011.0,
    "category": "Industrial Grease",
    "pack": "PAIL",
    "volumeUnit": "18 KG",
    "description": "Premium Multi-Purpose Industrial Grease"
  },
  {
    "sku": "5.50025673E8",
    "name": "SHELL GADUS S3 V220C 2",
    "unit": "DRUM",
    "msp": 22086691.0,
    "category": "Industrial Grease",
    "pack": "DRUM",
    "volumeUnit": "180 KG",
    "description": "Premium Multi-Purpose Industrial Grease"
  },
  {
    "sku": "5.50025673E8",
    "name": "SHELL GADUS S3 V220C 2",
    "unit": "PAIL",
    "msp": 2609002.0,
    "category": "Industrial Grease",
    "pack": "PAIL",
    "volumeUnit": "18 KG",
    "description": "Premium Multi-Purpose Industrial Grease"
  },
  {
    "sku": "5.50027043E8",
    "name": "SHELL GADUS S3 V220C 2",
    "unit": "PAIL",
    "msp": 2609002.0,
    "category": "Industrial Grease",
    "pack": "PAIL",
    "volumeUnit": "18 KG",
    "description": "Premium Multi-Purpose Industrial Grease"
  },
  {
    "sku": "5.5004428E8",
    "name": "SHELL GADUS S3 V220C 2_12*0.45kg",
    "unit": "PCS",
    "msp": 2461703.0,
    "category": "Industrial Grease",
    "pack": "PCS",
    "volumeUnit": "1 L",
    "description": "Premium Multi-Purpose Industrial Grease"
  },
  {
    "sku": "5.50027041E8",
    "name": "SHELL GADUS S3 V220C 3",
    "unit": "DRUM",
    "msp": 26229744.0,
    "category": "Industrial Grease",
    "pack": "DRUM",
    "volumeUnit": "180 KG",
    "description": "Premium Multi-Purpose Industrial Grease"
  },
  {
    "sku": "5.50027041E8",
    "name": "SHELL GADUS S3 V220C 3",
    "unit": "PAIL",
    "msp": 2768695.0,
    "category": "Industrial Grease",
    "pack": "PAIL",
    "volumeUnit": "18 KG",
    "description": "Premium Multi-Purpose Industrial Grease"
  },
  {
    "sku": "5.50027044E8",
    "name": "SHELL GADUS S3 V220C 3",
    "unit": "PAIL",
    "msp": 2768695.0,
    "category": "Industrial Grease",
    "pack": "PAIL",
    "volumeUnit": "18 KG",
    "description": "Premium Multi-Purpose Industrial Grease"
  },
  {
    "sku": "5.5002567E8",
    "name": "SHELL GADUS S3 V460D 2",
    "unit": "DRUM",
    "msp": 25876598.0,
    "category": "Industrial Grease",
    "pack": "DRUM",
    "volumeUnit": "180 KG",
    "description": "Premium Multi-Purpose Industrial Grease"
  },
  {
    "sku": "5.5002567E8",
    "name": "SHELL GADUS S3 V460D 2",
    "unit": "PAIL",
    "msp": 3162695.0,
    "category": "Industrial Grease",
    "pack": "PAIL",
    "volumeUnit": "18 KG",
    "description": "Premium Multi-Purpose Industrial Grease"
  },
  {
    "sku": "5.5005388E8",
    "name": "SHELL GADUS S4 OG CLEAR OIL 20000",
    "unit": "DRUM",
    "msp": 37817145.0,
    "category": "Industrial Grease",
    "pack": "DRUM",
    "volumeUnit": "180 KG",
    "description": "Premium Multi-Purpose Industrial Grease"
  },
  {
    "sku": "5.50028433E8",
    "name": "SHELL GADUS S5 V100 2",
    "unit": "PAIL",
    "msp": 6717165.0,
    "category": "Industrial Grease",
    "pack": "PAIL",
    "volumeUnit": "18 KG",
    "description": "Premium Multi-Purpose Industrial Grease"
  },
  {
    "sku": "5.50036561E8",
    "name": "SHELL GADUS S5 V220 2",
    "unit": "PAIL",
    "msp": 7524648.0,
    "category": "Industrial Grease",
    "pack": "PAIL",
    "volumeUnit": "18 KG",
    "description": "Premium Multi-Purpose Industrial Grease"
  },
  {
    "sku": "5.50070097E8",
    "name": "SHELL GEAR OIL S1 G 220",
    "unit": "DRUM",
    "msp": 10160496.0,
    "category": "Industrial Gear Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "Specialized Industrial Lubricant"
  },
  {
    "sku": "5.50070098E8",
    "name": "SHELL GEAR OIL S1 G 320",
    "unit": "DRUM",
    "msp": 11500488.0,
    "category": "Industrial Gear Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "Specialized Industrial Lubricant"
  },
  {
    "sku": "5.50075373E8",
    "name": "SHELL GEAR OIL S1 G 460",
    "unit": "DRUM",
    "msp": 12089232.0,
    "category": "Industrial Gear Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "Specialized Industrial Lubricant"
  },
  {
    "sku": "5.00005732E8",
    "name": "SHELL HEAT TRANSFER OIL S2",
    "unit": "BULK",
    "msp": 44249040.0,
    "category": "Heat Transfer Oil",
    "pack": "BULK",
    "volumeUnit": "LITER",
    "description": "High Efficiency Heat Transfer Fluid"
  },
  {
    "sku": "5.50024984E8",
    "name": "SHELL HEAT TRANSFER OIL S2",
    "unit": "DRUM",
    "msp": 9944019.0,
    "category": "Heat Transfer Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "High Efficiency Heat Transfer Fluid"
  },
  {
    "sku": "5.50024984E8",
    "name": "SHELL HEAT TRANSFER OIL S2",
    "unit": "PAIL",
    "msp": 1189476.0,
    "category": "Heat Transfer Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "High Efficiency Heat Transfer Fluid"
  },
  {
    "sku": "5.00005773E8",
    "name": "SHELL HYDRAULIC S1 M 46",
    "unit": "BULK",
    "msp": 42157800.0,
    "category": "Hydraulic Oil",
    "pack": "BULK",
    "volumeUnit": "LITER",
    "description": "Specialized Industrial Lubricant"
  },
  {
    "sku": "5.50025149E8",
    "name": "SHELL HYDRAULIC S1 M 46",
    "unit": "DRUM",
    "msp": 9506950.0,
    "category": "Hydraulic Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "Specialized Industrial Lubricant"
  },
  {
    "sku": "5.50025149E8",
    "name": "SHELL HYDRAULIC S1 M 46",
    "unit": "PAIL",
    "msp": 1137195.0,
    "category": "Hydraulic Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "Specialized Industrial Lubricant"
  },
  {
    "sku": "5.00005776E8",
    "name": "SHELL HYDRAULIC S1 M 68",
    "unit": "BULK",
    "msp": 43130160.0,
    "category": "Hydraulic Oil",
    "pack": "BULK",
    "volumeUnit": "LITER",
    "description": "Specialized Industrial Lubricant"
  },
  {
    "sku": "5.50025148E8",
    "name": "SHELL HYDRAULIC S1 M 68",
    "unit": "DRUM",
    "msp": 9506950.0,
    "category": "Hydraulic Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "Specialized Industrial Lubricant"
  },
  {
    "sku": "5.50025148E8",
    "name": "SHELL HYDRAULIC S1 M 68",
    "unit": "PAIL",
    "msp": 1137195.0,
    "category": "Hydraulic Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "Specialized Industrial Lubricant"
  },
  {
    "sku": "5.50025137E8",
    "name": "SHELL MORLINA S1 B 460",
    "unit": "DRUM",
    "msp": 11937277.0,
    "category": "Bearing & Circulating Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "Industrial Bearing & Circulating Oils"
  },
  {
    "sku": "5.50024947E8",
    "name": "SHELL MORLINA S2 B 150",
    "unit": "DRUM",
    "msp": 11213469.0,
    "category": "Bearing & Circulating Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "Industrial Bearing & Circulating Oils"
  },
  {
    "sku": "5.50024947E8",
    "name": "SHELL MORLINA S2 B 150",
    "unit": "PAIL",
    "msp": 1341324.0,
    "category": "Bearing & Circulating Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "Industrial Bearing & Circulating Oils"
  },
  {
    "sku": "5.50024897E8",
    "name": "SHELL MORLINA S2 B 220",
    "unit": "DRUM",
    "msp": 11898303.0,
    "category": "Bearing & Circulating Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "Industrial Bearing & Circulating Oils"
  },
  {
    "sku": "5.50024897E8",
    "name": "SHELL MORLINA S2 B 220",
    "unit": "PAIL",
    "msp": 1423242.0,
    "category": "Bearing & Circulating Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "Industrial Bearing & Circulating Oils"
  },
  {
    "sku": "5.50024998E8",
    "name": "SHELL MORLINA S2 B 320",
    "unit": "DRUM",
    "msp": 13457276.0,
    "category": "Bearing & Circulating Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "Industrial Bearing & Circulating Oils"
  },
  {
    "sku": "5.50024998E8",
    "name": "SHELL MORLINA S2 B 320",
    "unit": "PAIL",
    "msp": 1609722.0,
    "category": "Bearing & Circulating Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "Industrial Bearing & Circulating Oils"
  },
  {
    "sku": "5.50056014E8",
    "name": "SHELL MORLINA S2 BL 10",
    "unit": "DRUM",
    "msp": 13810829.0,
    "category": "Bearing & Circulating Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "Industrial Bearing & Circulating Oils"
  },
  {
    "sku": "5.50056014E8",
    "name": "SHELL MORLINA S2 BL 10",
    "unit": "PAIL",
    "msp": 1652013.0,
    "category": "Bearing & Circulating Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "Industrial Bearing & Circulating Oils"
  },
  {
    "sku": "5.50042931E8",
    "name": "SHELL MORLINA S4 B 220",
    "unit": "DRUM",
    "msp": 65337664.0,
    "category": "Bearing & Circulating Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "Industrial Bearing & Circulating Oils"
  },
  {
    "sku": "5.50042931E8",
    "name": "SHELL MORLINA S4 B 220",
    "unit": "PAIL",
    "msp": 7502890.0,
    "category": "Bearing & Circulating Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "Industrial Bearing & Circulating Oils"
  },
  {
    "sku": "5.5003611E8",
    "name": "SHELL MYSELLA S3 N 40",
    "unit": "DRUM",
    "msp": 11152223.0,
    "category": "Gas & Marine Engine Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "Stationary Gas & Marine Engine Lubricant"
  },
  {
    "sku": "5.5003611E8",
    "name": "SHELL MYSELLA S3 N 40",
    "unit": "PAIL",
    "msp": 1333998.0,
    "category": "Gas & Marine Engine Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "Stationary Gas & Marine Engine Lubricant"
  },
  {
    "sku": "5.5003603E8",
    "name": "SHELL MYSELLA S3 S 40",
    "unit": "DRUM",
    "msp": 15470021.0,
    "category": "Gas & Marine Engine Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "Stationary Gas & Marine Engine Lubricant"
  },
  {
    "sku": "5.5003603E8",
    "name": "SHELL MYSELLA S3 S 40",
    "unit": "PAIL",
    "msp": 1850481.0,
    "category": "Gas & Marine Engine Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "Stationary Gas & Marine Engine Lubricant"
  },
  {
    "sku": "5.5003605E8",
    "name": "SHELL MYSELLA S5 N 40",
    "unit": "DRUM",
    "msp": 12040281.0,
    "category": "Gas & Marine Engine Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "Stationary Gas & Marine Engine Lubricant"
  },
  {
    "sku": "5.5003605E8",
    "name": "SHELL MYSELLA S5 N 40",
    "unit": "PAIL",
    "msp": 1440225.0,
    "category": "Gas & Marine Engine Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "Stationary Gas & Marine Engine Lubricant"
  },
  {
    "sku": "5.50044656E8",
    "name": "SHELL MYSELLA S5 S 40",
    "unit": "DRUM",
    "msp": 13078436.0,
    "category": "Gas & Marine Engine Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "Stationary Gas & Marine Engine Lubricant"
  },
  {
    "sku": "5.5002498E8",
    "name": "SHELL OMALA S2 G 220",
    "unit": "DRUM",
    "msp": 11475153.0,
    "category": "Industrial Gear Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "High Performing Industrial Gear Oils"
  },
  {
    "sku": "5.5002498E8",
    "name": "SHELL OMALA S2 G 220",
    "unit": "PAIL",
    "msp": 1372626.0,
    "category": "Industrial Gear Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "High Performing Industrial Gear Oils"
  },
  {
    "sku": "5.50024982E8",
    "name": "SHELL OMALA S2 G 320",
    "unit": "DRUM",
    "msp": 13045262.0,
    "category": "Industrial Gear Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "High Performing Industrial Gear Oils"
  },
  {
    "sku": "5.50024982E8",
    "name": "SHELL OMALA S2 G 320",
    "unit": "PAIL",
    "msp": 1560438.0,
    "category": "Industrial Gear Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "High Performing Industrial Gear Oils"
  },
  {
    "sku": "5.5004147E8",
    "name": "SHELL OMALA S2 GX 100",
    "unit": "DRUM",
    "msp": 12510757.0,
    "category": "Industrial Gear Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "High Performing Industrial Gear Oils"
  },
  {
    "sku": "5.5004147E8",
    "name": "SHELL OMALA S2 GX 100",
    "unit": "PAIL",
    "msp": 1496502.0,
    "category": "Industrial Gear Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "High Performing Industrial Gear Oils"
  },
  {
    "sku": "5.50041372E8",
    "name": "SHELL OMALA S2 GX 1000",
    "unit": "DRUM",
    "msp": 18261093.0,
    "category": "Industrial Gear Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "High Performing Industrial Gear Oils"
  },
  {
    "sku": "5.5004149E8",
    "name": "SHELL OMALA S2 GX 150",
    "unit": "DRUM",
    "msp": 11583725.0,
    "category": "Industrial Gear Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "High Performing Industrial Gear Oils"
  },
  {
    "sku": "5.5004149E8",
    "name": "SHELL OMALA S2 GX 150",
    "unit": "PAIL",
    "msp": 1385613.0,
    "category": "Industrial Gear Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "High Performing Industrial Gear Oils"
  },
  {
    "sku": "5.50041492E8",
    "name": "SHELL OMALA S2 GX 220",
    "unit": "DRUM",
    "msp": 11483505.0,
    "category": "Industrial Gear Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "High Performing Industrial Gear Oils"
  },
  {
    "sku": "5.50041492E8",
    "name": "SHELL OMALA S2 GX 220",
    "unit": "PAIL",
    "msp": 1373625.0,
    "category": "Industrial Gear Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "High Performing Industrial Gear Oils"
  },
  {
    "sku": "5.500415E8",
    "name": "SHELL OMALA S2 GX 320",
    "unit": "DRUM",
    "msp": 11948413.0,
    "category": "Industrial Gear Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "High Performing Industrial Gear Oils"
  },
  {
    "sku": "5.500415E8",
    "name": "SHELL OMALA S2 GX 320",
    "unit": "PAIL",
    "msp": 1429236.0,
    "category": "Industrial Gear Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "High Performing Industrial Gear Oils"
  },
  {
    "sku": "5.50041501E8",
    "name": "SHELL OMALA S2 GX 460",
    "unit": "DRUM",
    "msp": 12477350.0,
    "category": "Industrial Gear Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "High Performing Industrial Gear Oils"
  },
  {
    "sku": "5.50041501E8",
    "name": "SHELL OMALA S2 GX 460",
    "unit": "PAIL",
    "msp": 1492506.0,
    "category": "Industrial Gear Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "High Performing Industrial Gear Oils"
  },
  {
    "sku": "5.5004151E8",
    "name": "SHELL OMALA S2 GX 68",
    "unit": "DRUM",
    "msp": 11491857.0,
    "category": "Industrial Gear Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "High Performing Industrial Gear Oils"
  },
  {
    "sku": "5.5004151E8",
    "name": "SHELL OMALA S2 GX 68",
    "unit": "PAIL",
    "msp": 1374624.0,
    "category": "Industrial Gear Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "High Performing Industrial Gear Oils"
  },
  {
    "sku": "5.5004134E8",
    "name": "SHELL OMALA S2 GX 680",
    "unit": "DRUM",
    "msp": 18031191.0,
    "category": "Industrial Gear Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "High Performing Industrial Gear Oils"
  },
  {
    "sku": "5.5004134E8",
    "name": "SHELL OMALA S2 GX 680",
    "unit": "PAIL",
    "msp": 2246709.0,
    "category": "Industrial Gear Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "High Performing Industrial Gear Oils"
  },
  {
    "sku": "5.50056676E8",
    "name": "SHELL OMALA S4 GXV 1000",
    "unit": "DRUM",
    "msp": 44718972.0,
    "category": "Industrial Gear Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "High Performing Industrial Gear Oils"
  },
  {
    "sku": "5.50047459E8",
    "name": "SHELL OMALA S4 GXV 220",
    "unit": "DRUM",
    "msp": 33342531.0,
    "category": "Industrial Gear Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "High Performing Industrial Gear Oils"
  },
  {
    "sku": "5.50047459E8",
    "name": "SHELL OMALA S4 GXV 220",
    "unit": "PAIL",
    "msp": 4154522.0,
    "category": "Industrial Gear Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "High Performing Industrial Gear Oils"
  },
  {
    "sku": "5.50047461E8",
    "name": "SHELL OMALA S4 GXV 320",
    "unit": "DRUM",
    "msp": 38913075.0,
    "category": "Industrial Gear Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "High Performing Industrial Gear Oils"
  },
  {
    "sku": "5.50047461E8",
    "name": "SHELL OMALA S4 GXV 320",
    "unit": "PAIL",
    "msp": 4848619.0,
    "category": "Industrial Gear Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "High Performing Industrial Gear Oils"
  },
  {
    "sku": "5.50047463E8",
    "name": "SHELL OMALA S4 GXV 460",
    "unit": "DRUM",
    "msp": 35600257.0,
    "category": "Industrial Gear Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "High Performing Industrial Gear Oils"
  },
  {
    "sku": "5.50047463E8",
    "name": "SHELL OMALA S4 GXV 460",
    "unit": "PAIL",
    "msp": 4435838.0,
    "category": "Industrial Gear Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "High Performing Industrial Gear Oils"
  },
  {
    "sku": "5.50047464E8",
    "name": "SHELL OMALA S4 GXV 680",
    "unit": "DRUM",
    "msp": 33679380.0,
    "category": "Industrial Gear Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "High Performing Industrial Gear Oils"
  },
  {
    "sku": "5.50047464E8",
    "name": "SHELL OMALA S4 GXV 680",
    "unit": "PAIL",
    "msp": 4196494.0,
    "category": "Industrial Gear Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "High Performing Industrial Gear Oils"
  },
  {
    "sku": "5.50070855E8",
    "name": "SHELL OMALA S4 WE 220",
    "unit": "DRUM",
    "msp": 34706632.0,
    "category": "Industrial Gear Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "High Performing Industrial Gear Oils"
  },
  {
    "sku": "5.50070855E8",
    "name": "SHELL OMALA S4 WE 220",
    "unit": "PAIL",
    "msp": 4324491.0,
    "category": "Industrial Gear Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "High Performing Industrial Gear Oils"
  },
  {
    "sku": "5.5007004E8",
    "name": "SHELL OMALA S4 WE 320",
    "unit": "PAIL",
    "msp": 4363396.0,
    "category": "Industrial Gear Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "High Performing Industrial Gear Oils"
  },
  {
    "sku": "5.50070041E8",
    "name": "SHELL OMALA S4 WE 460",
    "unit": "PAIL",
    "msp": 4994945.0,
    "category": "Industrial Gear Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "High Performing Industrial Gear Oils"
  },
  {
    "sku": "5.50070753E8",
    "name": "SHELL OMALA S4 WE 680",
    "unit": "DRUM",
    "msp": 48330941.0,
    "category": "Industrial Gear Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "High Performing Industrial Gear Oils"
  },
  {
    "sku": "5.50024959E8",
    "name": "SHELL REFRIGERATION S2 FR-A 68",
    "unit": "DRUM",
    "msp": 11205117.0,
    "category": "Industrial Lubricants",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "Specialized Industrial Lubricant"
  },
  {
    "sku": "5.50024959E8",
    "name": "SHELL REFRIGERATION S2 FR-A 68",
    "unit": "PAIL",
    "msp": 1396172.0,
    "category": "Industrial Lubricants",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "Specialized Industrial Lubricant"
  },
  {
    "sku": "5.5002571E8",
    "name": "SHELL REFRIGERATION S4 FR-F 68",
    "unit": "PAIL",
    "msp": 8451152.0,
    "category": "Industrial Lubricants",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "Specialized Industrial Lubricant"
  },
  {
    "sku": "5.50025702E8",
    "name": "SHELL REFRIGERATION S4 FR-V 68",
    "unit": "PAIL",
    "msp": 6142546.0,
    "category": "Industrial Lubricants",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "Specialized Industrial Lubricant"
  },
  {
    "sku": "5.50044623E8",
    "name": "SHELL RIMULA R2 10W CF10TBN",
    "unit": "DRUM",
    "msp": 9799258.0,
    "category": "Heavy Duty Diesel Engine Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "Heavy Duty Diesel Engine Oil"
  },
  {
    "sku": "5.50044623E8",
    "name": "SHELL RIMULA R2 10W CF10TBN",
    "unit": "PAIL",
    "msp": 1172160.0,
    "category": "Heavy Duty Diesel Engine Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "Heavy Duty Diesel Engine Oil"
  },
  {
    "sku": "5.0001004E8",
    "name": "SHELL RIMULA R2 30",
    "unit": "BULK",
    "msp": 45221400.0,
    "category": "Heavy Duty Diesel Engine Oil",
    "pack": "BULK",
    "volumeUnit": "LITER",
    "description": "Heavy Duty Diesel Engine Oil"
  },
  {
    "sku": "5.50025493E8",
    "name": "SHELL RIMULA R2 30 CF10TBN",
    "unit": "PAIL",
    "msp": 1165234.0,
    "category": "Heavy Duty Diesel Engine Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "Heavy Duty Diesel Engine Oil"
  },
  {
    "sku": "5.50044624E8",
    "name": "SHELL RIMULA R2 30 CF10TBN",
    "unit": "DRUM",
    "msp": 10147243.0,
    "category": "Heavy Duty Diesel Engine Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "Heavy Duty Diesel Engine Oil"
  },
  {
    "sku": "5.50044633E8",
    "name": "SHELL RIMULA R2 40 CF10TBN",
    "unit": "DRUM",
    "msp": 10083213.0,
    "category": "Heavy Duty Diesel Engine Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "Heavy Duty Diesel Engine Oil"
  },
  {
    "sku": "5.50044633E8",
    "name": "SHELL RIMULA R2 40 CF10TBN",
    "unit": "PAIL",
    "msp": 1157881.0,
    "category": "Heavy Duty Diesel Engine Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "Heavy Duty Diesel Engine Oil"
  },
  {
    "sku": "5.50072382E8",
    "name": "SHELL RIMULA R3 TURBO 15W-40 200 LITER",
    "unit": "DRUM",
    "msp": 9662328.0,
    "category": "Heavy Duty Diesel Engine Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "Heavy Duty Diesel Engine Oil"
  },
  {
    "sku": "5.00007891E8",
    "name": "SHELL RIMULA R4X 15W-40",
    "unit": "BULK",
    "msp": 49350600.0,
    "category": "Heavy Duty Diesel Engine Oil",
    "pack": "BULK",
    "volumeUnit": "LITER",
    "description": "Heavy Duty Diesel Engine Oil"
  },
  {
    "sku": "5.5004436E8",
    "name": "SHELL RIMULA R4X15W40CI4E7DH1",
    "unit": "DRUM",
    "msp": 10826741.0,
    "category": "Heavy Duty Diesel Engine Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "Heavy Duty Diesel Engine Oil"
  },
  {
    "sku": "5.5004436E8",
    "name": "SHELL RIMULA R4X15W40CI4E7DH1",
    "unit": "PAIL",
    "msp": 1192673.0,
    "category": "Heavy Duty Diesel Engine Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "Heavy Duty Diesel Engine Oil"
  },
  {
    "sku": "5.50044361E8",
    "name": "SHELL RIMULA R4X15W40CI4E7DH1",
    "unit": "PAIL",
    "msp": 1192673.0,
    "category": "Heavy Duty Diesel Engine Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "Heavy Duty Diesel Engine Oil"
  },
  {
    "sku": "5.50049536E8",
    "name": "SHELL RIMULA R6 LM 10W-40",
    "unit": "DRUM",
    "msp": 24712503.0,
    "category": "Heavy Duty Diesel Engine Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "Heavy Duty Diesel Engine Oil"
  },
  {
    "sku": "5.50049536E8",
    "name": "SHELL RIMULA R6 LM 10W-40",
    "unit": "PAIL",
    "msp": 2837799.0,
    "category": "Heavy Duty Diesel Engine Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "Heavy Duty Diesel Engine Oil"
  },
  {
    "sku": "5.50024931E8",
    "name": "SHELL SPIRAX S2 A 140",
    "unit": "DRUM",
    "msp": 11636618.0,
    "category": "Transmission & Axle Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "High Performance Axle & Transmission Fluid"
  },
  {
    "sku": "5.50024931E8",
    "name": "SHELL SPIRAX S2 A 140",
    "unit": "PAIL",
    "msp": 1391940.0,
    "category": "Transmission & Axle Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "High Performance Axle & Transmission Fluid"
  },
  {
    "sku": "5.50025043E8",
    "name": "SHELL SPIRAX S2 A 80W-90",
    "unit": "DRUM",
    "msp": 11853761.0,
    "category": "Transmission & Axle Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "High Performance Axle & Transmission Fluid"
  },
  {
    "sku": "5.50025043E8",
    "name": "SHELL SPIRAX S2 A 80W-90",
    "unit": "PAIL",
    "msp": 1417914.0,
    "category": "Transmission & Axle Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "High Performance Axle & Transmission Fluid"
  },
  {
    "sku": "5.50025044E8",
    "name": "SHELL SPIRAX S2 A 85W-140",
    "unit": "DRUM",
    "msp": 13774638.0,
    "category": "Transmission & Axle Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "High Performance Axle & Transmission Fluid"
  },
  {
    "sku": "5.50025044E8",
    "name": "SHELL SPIRAX S2 A 85W-140",
    "unit": "PAIL",
    "msp": 1647684.0,
    "category": "Transmission & Axle Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "High Performance Axle & Transmission Fluid"
  },
  {
    "sku": "5.50024929E8",
    "name": "SHELL SPIRAX S2 A 90",
    "unit": "DRUM",
    "msp": 10946216.0,
    "category": "Transmission & Axle Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "High Performance Axle & Transmission Fluid"
  },
  {
    "sku": "5.50024929E8",
    "name": "SHELL SPIRAX S2 A 90",
    "unit": "PAIL",
    "msp": 1309356.0,
    "category": "Transmission & Axle Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "High Performance Axle & Transmission Fluid"
  },
  {
    "sku": "5.50070103E8",
    "name": "SHELL SPIRAX S2 ALS 85W140",
    "unit": "DRUM",
    "msp": 13894345.0,
    "category": "Transmission & Axle Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "High Performance Axle & Transmission Fluid"
  },
  {
    "sku": "5.50024921E8",
    "name": "SHELL SPIRAX S2 G 90",
    "unit": "DRUM",
    "msp": 11294201.0,
    "category": "Transmission & Axle Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "High Performance Axle & Transmission Fluid"
  },
  {
    "sku": "5.50024921E8",
    "name": "SHELL SPIRAX S2 G 90",
    "unit": "PAIL",
    "msp": 1350981.0,
    "category": "Transmission & Axle Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "High Performance Axle & Transmission Fluid"
  },
  {
    "sku": "5.50024985E8",
    "name": "SHELL SPIRAX S3 AD 80W-90",
    "unit": "PAIL",
    "msp": 2125539.0,
    "category": "Transmission & Axle Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "High Performance Axle & Transmission Fluid"
  },
  {
    "sku": "5.5002506E8",
    "name": "SHELL SPIRAX S3 G 80W",
    "unit": "DRUM",
    "msp": 16093610.0,
    "category": "Transmission & Axle Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "High Performance Axle & Transmission Fluid"
  },
  {
    "sku": "5.5002506E8",
    "name": "SHELL SPIRAX S3 G 80W",
    "unit": "PAIL",
    "msp": 1925073.0,
    "category": "Transmission & Axle Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "High Performance Axle & Transmission Fluid"
  },
  {
    "sku": "5.50024942E8",
    "name": "SHELL SPIRAX S4 ATF HDX",
    "unit": "DRUM",
    "msp": 13476763.0,
    "category": "Transmission & Axle Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "High Performance Axle & Transmission Fluid"
  },
  {
    "sku": "5.50024942E8",
    "name": "SHELL SPIRAX S4 ATF HDX",
    "unit": "PAIL",
    "msp": 1612053.0,
    "category": "Transmission & Axle Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "High Performance Axle & Transmission Fluid"
  },
  {
    "sku": "5.50024918E8",
    "name": "SHELL SPIRAX S4 CX 10W",
    "unit": "DRUM",
    "msp": 11393609.0,
    "category": "Transmission & Axle Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "High Performance Axle & Transmission Fluid"
  },
  {
    "sku": "5.50024986E8",
    "name": "SHELL SPIRAX S4 CX 30",
    "unit": "DRUM",
    "msp": 12663754.0,
    "category": "Transmission & Axle Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "High Performance Axle & Transmission Fluid"
  },
  {
    "sku": "5.50024919E8",
    "name": "SHELL SPIRAX S4 CX 50",
    "unit": "DRUM",
    "msp": 12260672.0,
    "category": "Transmission & Axle Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "High Performance Axle & Transmission Fluid"
  },
  {
    "sku": "5.50025071E8",
    "name": "SHELL SPIRAX S4 CX 60",
    "unit": "DRUM",
    "msp": 12164976.0,
    "category": "Transmission & Axle Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "High Performance Axle & Transmission Fluid"
  },
  {
    "sku": "5.50025055E8",
    "name": "SHELL SPIRAX S4 TXM",
    "unit": "DRUM",
    "msp": 14726725.0,
    "category": "Transmission & Axle Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "High Performance Axle & Transmission Fluid"
  },
  {
    "sku": "5.50025055E8",
    "name": "SHELL SPIRAX S4 TXM",
    "unit": "PAIL",
    "msp": 1761570.0,
    "category": "Transmission & Axle Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "High Performance Axle & Transmission Fluid"
  },
  {
    "sku": "5.50025057E8",
    "name": "SHELL SPIRAX S5 CFD M 60",
    "unit": "DRUM",
    "msp": 20290425.0,
    "category": "Transmission & Axle Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "High Performance Axle & Transmission Fluid"
  },
  {
    "sku": "5.50052129E8",
    "name": "SHELL SPIRAX S5 CVT X",
    "unit": "BOTOL",
    "msp": 298229.0,
    "category": "Transmission & Axle Oil",
    "pack": "BOTOL",
    "volumeUnit": "1 L",
    "description": "High Performance Axle & Transmission Fluid"
  },
  {
    "sku": "5.50070088E8",
    "name": "SHELL Spirax S6 ATF A668",
    "unit": "DRUM",
    "msp": 35485770.0,
    "category": "Transmission & Axle Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "High Performance Axle & Transmission Fluid"
  },
  {
    "sku": "5.50025084E8",
    "name": "SHELL SPIRAX S6 GXME75W-80",
    "unit": "DRUM",
    "msp": 29343835.0,
    "category": "Transmission & Axle Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "High Performance Axle & Transmission Fluid"
  },
  {
    "sku": "8.00007106E8",
    "name": "SHELL TACTIC EMV DRIVE GEN 3",
    "unit": "PCS",
    "msp": 2385612.0,
    "category": "Industrial Lubricants",
    "pack": "PCS",
    "volumeUnit": "1 L",
    "description": "Specialized Industrial Lubricant"
  },
  {
    "sku": "5.50028259E8",
    "name": "SHELL TACTIC EMV S3V220C 2",
    "unit": "PCS",
    "msp": 489510.0,
    "category": "Industrial Lubricants",
    "pack": "PCS",
    "volumeUnit": "1 L",
    "description": "Specialized Industrial Lubricant"
  },
  {
    "sku": "5.50028122E8",
    "name": "SHELL TACTIC EMV S5V100 2",
    "unit": "PCS",
    "msp": 607392.0,
    "category": "Industrial Lubricants",
    "pack": "PCS",
    "volumeUnit": "1 L",
    "description": "Specialized Industrial Lubricant"
  },
  {
    "sku": "5.50025195E8",
    "name": "SHELL TEGULA V 32",
    "unit": "PAIL",
    "msp": 3030300.0,
    "category": "Industrial Lubricants",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "Specialized Industrial Lubricant"
  },
  {
    "sku": "5.50025195E8",
    "name": "SHELL TEGULA V 32",
    "unit": "DRUM",
    "msp": 22619025.0,
    "category": "Industrial Lubricants",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "Specialized Industrial Lubricant"
  },
  {
    "sku": "5.50045086E8",
    "name": "SHELL TELLUS S2 MX 100",
    "unit": "DRUM",
    "msp": 10818158.0,
    "category": "Hydraulic Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "Premium Industrial Hydraulic Fluids"
  },
  {
    "sku": "5.50045086E8",
    "name": "SHELL TELLUS S2 MX 100",
    "unit": "PAIL",
    "msp": 1345800.0,
    "category": "Hydraulic Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "Premium Industrial Hydraulic Fluids"
  },
  {
    "sku": "5.50045078E8",
    "name": "SHELL TELLUS S2 MX 32",
    "unit": "DRUM",
    "msp": 11104897.0,
    "category": "Hydraulic Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "Premium Industrial Hydraulic Fluids"
  },
  {
    "sku": "5.50045078E8",
    "name": "SHELL TELLUS S2 MX 32",
    "unit": "PAIL",
    "msp": 1328337.0,
    "category": "Hydraulic Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "Premium Industrial Hydraulic Fluids"
  },
  {
    "sku": "5.50045079E8",
    "name": "SHELL TELLUS S2 MX 46",
    "unit": "DRUM",
    "msp": 10523066.0,
    "category": "Hydraulic Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "Premium Industrial Hydraulic Fluids"
  },
  {
    "sku": "5.50045079E8",
    "name": "SHELL TELLUS S2 MX 46",
    "unit": "PAIL",
    "msp": 1258740.0,
    "category": "Hydraulic Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "Premium Industrial Hydraulic Fluids"
  },
  {
    "sku": "5.5004508E8",
    "name": "SHELL TELLUS S2 MX 68",
    "unit": "DRUM",
    "msp": 10211272.0,
    "category": "Hydraulic Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "Premium Industrial Hydraulic Fluids"
  },
  {
    "sku": "5.5004508E8",
    "name": "SHELL TELLUS S2 MX 68",
    "unit": "PAIL",
    "msp": 1221444.0,
    "category": "Hydraulic Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "Premium Industrial Hydraulic Fluids"
  },
  {
    "sku": "5.50045081E8",
    "name": "SHELL TELLUS S2 VX 100",
    "unit": "DRUM",
    "msp": 12115678.0,
    "category": "Hydraulic Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "Premium Industrial Hydraulic Fluids"
  },
  {
    "sku": "5.50045081E8",
    "name": "SHELL TELLUS S2 VX 100",
    "unit": "PAIL",
    "msp": 1623153.0,
    "category": "Hydraulic Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "Premium Industrial Hydraulic Fluids"
  },
  {
    "sku": "5.50045082E8",
    "name": "SHELL TELLUS S2 VX 15",
    "unit": "DRUM",
    "msp": 17178860.0,
    "category": "Hydraulic Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "Premium Industrial Hydraulic Fluids"
  },
  {
    "sku": "5.50045083E8",
    "name": "SHELL TELLUS S2 VX 22",
    "unit": "DRUM",
    "msp": 13070317.0,
    "category": "Hydraulic Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "Premium Industrial Hydraulic Fluids"
  },
  {
    "sku": "5.50045083E8",
    "name": "SHELL TELLUS S2 VX 22",
    "unit": "PAIL",
    "msp": 1824008.0,
    "category": "Hydraulic Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "Premium Industrial Hydraulic Fluids"
  },
  {
    "sku": "5.50045084E8",
    "name": "SHELL TELLUS S2 VX 32",
    "unit": "DRUM",
    "msp": 15734490.0,
    "category": "Hydraulic Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "Premium Industrial Hydraulic Fluids"
  },
  {
    "sku": "5.50045084E8",
    "name": "SHELL TELLUS S2 VX 32",
    "unit": "PAIL",
    "msp": 1957401.0,
    "category": "Hydraulic Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "Premium Industrial Hydraulic Fluids"
  },
  {
    "sku": "5.50045085E8",
    "name": "SHELL TELLUS S2 VX 46",
    "unit": "DRUM",
    "msp": 11647754.0,
    "category": "Hydraulic Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "Premium Industrial Hydraulic Fluids"
  },
  {
    "sku": "5.50045085E8",
    "name": "SHELL TELLUS S2 VX 46",
    "unit": "PAIL",
    "msp": 1449003.0,
    "category": "Hydraulic Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "Premium Industrial Hydraulic Fluids"
  },
  {
    "sku": "5.50045087E8",
    "name": "SHELL TELLUS S2 VX 68",
    "unit": "DRUM",
    "msp": 11335959.0,
    "category": "Hydraulic Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "Premium Industrial Hydraulic Fluids"
  },
  {
    "sku": "5.50045087E8",
    "name": "SHELL TELLUS S2 VX 68",
    "unit": "PAIL",
    "msp": 1410215.0,
    "category": "Hydraulic Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "Premium Industrial Hydraulic Fluids"
  },
  {
    "sku": "5.50025027E8",
    "name": "SHELL TELLUS S3 M 100",
    "unit": "DRUM",
    "msp": 15375369.0,
    "category": "Hydraulic Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "Premium Industrial Hydraulic Fluids"
  },
  {
    "sku": "5.50025024E8",
    "name": "SHELL TELLUS S3 M 46",
    "unit": "DRUM",
    "msp": 11889951.0,
    "category": "Hydraulic Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "Premium Industrial Hydraulic Fluids"
  },
  {
    "sku": "5.50025024E8",
    "name": "SHELL TELLUS S3 M 46",
    "unit": "PAIL",
    "msp": 1706692.0,
    "category": "Hydraulic Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "Premium Industrial Hydraulic Fluids"
  },
  {
    "sku": "5.50025026E8",
    "name": "SHELL TELLUS S3 M 68",
    "unit": "DRUM",
    "msp": 12438376.0,
    "category": "Hydraulic Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "Premium Industrial Hydraulic Fluids"
  },
  {
    "sku": "5.50024856E8",
    "name": "SHELL TONNA S2 M 68",
    "unit": "DRUM",
    "msp": 10890539.0,
    "category": "Industrial Lubricants",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "Specialized Industrial Lubricant"
  },
  {
    "sku": "5.50024856E8",
    "name": "SHELL TONNA S2 M 68",
    "unit": "PAIL",
    "msp": 1519812.0,
    "category": "Industrial Lubricants",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "Specialized Industrial Lubricant"
  },
  {
    "sku": "5.5004925E8",
    "name": "SHELL TURBO J 32",
    "unit": "DRUM",
    "msp": 7664370.0,
    "category": "Transformer & Turbine Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "Electrical Insulating & Turbine Oil"
  },
  {
    "sku": "5.50026647E8",
    "name": "SHELL TURBO J 32",
    "unit": "PAIL",
    "msp": 1100149.0,
    "category": "Transformer & Turbine Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "Electrical Insulating & Turbine Oil"
  },
  {
    "sku": "5.50042862E8",
    "name": "SHELL TURBO S4 GX 32",
    "unit": "DRUM",
    "msp": 12641599.0,
    "category": "Transformer & Turbine Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "Electrical Insulating & Turbine Oil"
  },
  {
    "sku": "5.5004288E8",
    "name": "SHELL TURBO S4 GX 46",
    "unit": "DRUM",
    "msp": 19278369.0,
    "category": "Transformer & Turbine Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "Electrical Insulating & Turbine Oil"
  },
  {
    "sku": "5.5004287E8",
    "name": "SHELL TURBO S4 X 32",
    "unit": "DRUM",
    "msp": 14247898.0,
    "category": "Transformer & Turbine Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "Electrical Insulating & Turbine Oil"
  },
  {
    "sku": "5.5004287E8",
    "name": "SHELL TURBO S4 X 32",
    "unit": "PAIL",
    "msp": 2045153.0,
    "category": "Transformer & Turbine Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "Electrical Insulating & Turbine Oil"
  },
  {
    "sku": "5.50032957E8",
    "name": "SHELL TURBO T 32",
    "unit": "DRUM",
    "msp": 10489660.0,
    "category": "Transformer & Turbine Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "Electrical Insulating & Turbine Oil"
  },
  {
    "sku": "5.50032957E8",
    "name": "SHELL TURBO T 32",
    "unit": "PAIL",
    "msp": 1505693.0,
    "category": "Transformer & Turbine Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "Electrical Insulating & Turbine Oil"
  },
  {
    "sku": "5.50032917E8",
    "name": "SHELL TURBO T 46",
    "unit": "DRUM",
    "msp": 10523066.0,
    "category": "Transformer & Turbine Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "Electrical Insulating & Turbine Oil"
  },
  {
    "sku": "5.50032917E8",
    "name": "SHELL TURBO T 46",
    "unit": "PAIL",
    "msp": 1510488.0,
    "category": "Transformer & Turbine Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "Electrical Insulating & Turbine Oil"
  },
  {
    "sku": "5.50032916E8",
    "name": "SHELL TURBO T 68",
    "unit": "DRUM",
    "msp": 10740209.0,
    "category": "Transformer & Turbine Oil",
    "pack": "DRUM",
    "volumeUnit": "209 L",
    "description": "Electrical Insulating & Turbine Oil"
  },
  {
    "sku": "5.50032916E8",
    "name": "SHELL TURBO T 68",
    "unit": "PAIL",
    "msp": 1541657.0,
    "category": "Transformer & Turbine Oil",
    "pack": "PAIL",
    "volumeUnit": "20 L",
    "description": "Electrical Insulating & Turbine Oil"
  }
];

/**
 * Calculates Minimum Selling Price Floor with Fee
 * Formula PT HUM: ROUNDUP(MSP + (Fee / 52%), 0)
 */
export function calculateFloorPrice(msp: number, feePerUnit: number = 0): number {
  if (feePerUnit <= 0) return msp;
  const markup = feePerUnit / 0.52;
  return Math.ceil(msp + markup);
}

/**
 * Calculates PPh Selisih
 * Formula PT HUM: ((Subtotal Jual - Subtotal MSP) / 1.11) * 25%
 */
export function calculatePphSelisih(subtotalJual: number, subtotalMsp: number): number {
  if (subtotalJual <= subtotalMsp) return 0;
  const dpp = (subtotalJual - subtotalMsp) / 1.11;
  return Math.round(dpp * 0.25);
}

export type TerGolonganResult = {
  golongan: number;
  label: string;
  ratePct: number;
  rateLabel: string;
  incentiveAmount: number;
  requiresApproval: boolean;
  statusColor: "emerald" | "amber" | "red";
  description: string;
};

/**
 * Calculates TER Incentive for DSR based on Price Margin above MSP
 */
export function calculateTERIncentive(
  totalHargaJual: number,
  totalMsp: number
): TerGolonganResult {
  if (totalMsp <= 0) {
    return {
      golongan: 1,
      label: "GOLONGAN 1",
      ratePct: 0,
      rateLabel: "0.00%",
      incentiveAmount: 0,
      requiresApproval: false,
      statusColor: "red",
      description: "Belum ada produk terpilih",
    };
  }

  const selisihPct = (totalHargaJual - totalMsp) / totalMsp;

  if (selisihPct < -0.02005) {
    return {
      golongan: 1,
      label: "GOLONGAN 1",
      ratePct: 0,
      rateLabel: "0.00% x Harga Jual",
      incentiveAmount: 0,
      requiresApproval: true,
      statusColor: "red",
      description: "Harga di bawah -2% dari MSP. Wajib Pengajuan Approval DSM/GM!",
    };
  }

  if (selisihPct < -0.01005) {
    const amount = Math.round(totalHargaJual * 0.0025);
    return {
      golongan: 2,
      label: "GOLONGAN 2",
      ratePct: 0.0025,
      rateLabel: "0.25% x Harga Jual",
      incentiveAmount: amount,
      requiresApproval: true,
      statusColor: "amber",
      description: "Diskon -1% s/d -2%. Insentif 0.25% x Harga Jual (Perlu konfirmasi SPV).",
    };
  }

  if (selisihPct < -0.00005) {
    const amount = Math.round(totalHargaJual * 0.005);
    return {
      golongan: 3,
      label: "GOLONGAN 3",
      ratePct: 0.005,
      rateLabel: "0.50% x Harga Jual",
      incentiveAmount: amount,
      requiresApproval: false,
      statusColor: "amber",
      description: "Nego tipis di bawah MSP. Insentif 0.50% x Harga Jual.",
    };
  }

  if (selisihPct <= 0.03005) {
    const amount = Math.round(totalMsp * 0.01);
    return {
      golongan: 4,
      label: "GOLONGAN 4",
      ratePct: 0.01,
      rateLabel: "1.00% x MSP",
      incentiveAmount: amount,
      requiresApproval: false,
      statusColor: "emerald",
      description: "Harga standar MSP (0% - 3%). Insentif 1.00% x MSP.",
    };
  }

  if (selisihPct <= 0.07005) {
    const amount = Math.round(totalMsp * 0.015);
    return {
      golongan: 5,
      label: "GOLONGAN 5",
      ratePct: 0.015,
      rateLabel: "1.50% x MSP",
      incentiveAmount: amount,
      requiresApproval: false,
      statusColor: "emerald",
      description: "Margin bagus (+3% s/d +7%). Insentif 1.50% x MSP.",
    };
  }

  if (selisihPct <= 0.11005) {
    const amount = Math.round(totalMsp * 0.02);
    return {
      golongan: 6,
      label: "GOLONGAN 6",
      ratePct: 0.02,
      rateLabel: "2.00% x MSP",
      incentiveAmount: amount,
      requiresApproval: false,
      statusColor: "emerald",
      description: "Margin sangat sehat (+7% s/d +11%). Insentif 2.00% x MSP.",
    };
  }

  const amount = Math.round(totalMsp * 0.03);
  return {
    golongan: 7,
    label: "GOLONGAN 7",
    ratePct: 0.03,
    rateLabel: "3.00% x MSP (Maksimal)",
    incentiveAmount: amount,
    requiresApproval: false,
    statusColor: "emerald",
    description: "Margin prima (> +11%). Mendapatkan insentif tertinggi 3.00% x MSP!",
  };
}
