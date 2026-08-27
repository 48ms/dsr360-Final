/**
 * DSR Annual & Monthly Quota Calibration Engine
 * Configures exact volume targets, nominal revenue targets, and drum estimations for each territory/representative.
 * Data is abstracted to territory/role identifiers to protect PII in open environments.
 */

export type RepQuotaTarget = {
  annualVolumeLiter: number;
  monthlyVolumeLiter: number;
  monthlyValueIdr: number;
  annualDrums: number;
  monthlyDrums: number;
};

// Standard 209 Liter drum conversion
export const LITERS_PER_DRUM = 209;

// Territory Quota Mapping by User ID / Territory Identifier
export const TERRITORY_QUOTA_CONFIG: Record<
  string,
  { annualLiter: number; monthlyLiter: number; monthlyValue: number }
> = {
  // Sukabumi Territory — Target: 78.000 L/Tahun (~373.2 Drum) -> 6.500 L/Bulan
  "sukabumi": {
    annualLiter: 78000,
    monthlyLiter: 6500,
    monthlyValue: 325000000,
  },
  "47561f60-b5ed-4881-bdc4-550c3f14ec19": {
    annualLiter: 78000,
    monthlyLiter: 6500,
    monthlyValue: 325000000,
  },
  "dsr.sukabumi@pt-hum.co.id": {
    annualLiter: 78000,
    monthlyLiter: 6500,
    monthlyValue: 325000000,
  },

  // Bandung Raya Territory — Target: 50.000 L/Tahun (~239.2 Drum) -> 4.521 L/Bulan
  "bandung": {
    annualLiter: 50000,
    monthlyLiter: 4521,
    monthlyValue: 226050000,
  },
  "59eecb3a-d3c3-4dab-a804-32e82ae994f8": {
    annualLiter: 50000,
    monthlyLiter: 4521,
    monthlyValue: 226050000,
  },
  "dsr.bandung@pt-hum.co.id": {
    annualLiter: 50000,
    monthlyLiter: 4521,
    monthlyValue: 226050000,
  },

  // Subang / Purwakarta Territory — Target: 50.000 L/Tahun
  "subang": {
    annualLiter: 50000,
    monthlyLiter: 4521,
    monthlyValue: 226050000,
  },
  "dsr.subang@pt-hum.co.id": {
    annualLiter: 50000,
    monthlyLiter: 4521,
    monthlyValue: 226050000,
  },
};

/**
 * Resolves individual DSR target based on User ID, Territory, or Email.
 * Default fallback is 50,000 L / Year (4,521 L / Month).
 */
export function getRepQuotaTarget(
  userIdOrEmail?: string | null,
  territoryOrName?: string | null
): RepQuotaTarget {
  const normalizedKey = (userIdOrEmail || "").toLowerCase().trim();
  const normalizedTerritory = (territoryOrName || "").toLowerCase().trim();

  // 1. Direct key match (UUID, alias email, territory key)
  if (normalizedKey && TERRITORY_QUOTA_CONFIG[normalizedKey]) {
    const cfg = TERRITORY_QUOTA_CONFIG[normalizedKey];
    return buildQuotaTarget(cfg.annualLiter, cfg.monthlyLiter, cfg.monthlyValue);
  }

  // 2. Check by territory name or role context
  if (normalizedTerritory.includes("sukabumi") || normalizedKey.includes("sukabumi") || normalizedKey.includes("angga")) {
    const cfg = TERRITORY_QUOTA_CONFIG["sukabumi"];
    return buildQuotaTarget(cfg.annualLiter, cfg.monthlyLiter, cfg.monthlyValue);
  }

  if (normalizedTerritory.includes("subang") || normalizedKey.includes("subang")) {
    const cfg = TERRITORY_QUOTA_CONFIG["subang"];
    return buildQuotaTarget(cfg.annualLiter, cfg.monthlyLiter, cfg.monthlyValue);
  }

  // 3. Default standard DSR target: 50,000 L / Year -> 4,521 L / Month (Rp 226.05 Jt)
  const defaultAnnual = 50000;
  const defaultMonthly = 4521;
  const defaultValue = 226050000;

  return buildQuotaTarget(defaultAnnual, defaultMonthly, defaultValue);
}

function buildQuotaTarget(annualLiter: number, monthlyLiter: number, monthlyValue: number): RepQuotaTarget {
  return {
    annualVolumeLiter: annualLiter,
    monthlyVolumeLiter: monthlyLiter,
    monthlyValueIdr: monthlyValue,
    annualDrums: Math.round((annualLiter / LITERS_PER_DRUM) * 10) / 10,
    monthlyDrums: Math.round((monthlyLiter / LITERS_PER_DRUM) * 10) / 10,
  };
}
