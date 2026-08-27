/**
 * DSR Annual & Monthly Quota Calibration Engine
 * Configures exact volume targets, nominal revenue targets, and drum estimations for each sales representative.
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

export const REPS_QUOTA_CONFIG: Record<
  string,
  { annualLiter: number; monthlyLiter: number; monthlyValue: number }
> = {
  // Angga Permadi (Sukabumi) - Target: 78.000 Liter / Tahun (~373.2 Drum) -> 6.500 L / Bulan (~31.1 Drum)
  "47561f60-b5ed-4881-bdc4-550c3f14ec19": {
    annualLiter: 78000,
    monthlyLiter: 6500, // 78,000 / 12 = 6,500 L
    monthlyValue: 325000000, // ~Rp 325 Juta/bln (asumsi Rp 50.000/L)
  },
  "angga.permadi59@gmail.com": {
    annualLiter: 78000,
    monthlyLiter: 6500,
    monthlyValue: 325000000,
  },

  // Bima Maulana Saputra (Bandung) - Target: 50.000 Liter / Tahun (~239.2 Drum) -> 4.521 L / Bulan Agustus
  "59eecb3a-d3c3-4dab-a804-32e82ae994f8": {
    annualLiter: 50000,
    monthlyLiter: 4521,
    monthlyValue: 226050000,
  },
  "bimasaputra.hum@gmail.com": {
    annualLiter: 50000,
    monthlyLiter: 4521,
    monthlyValue: 226050000,
  },

  // Fendi (Subang) - Target: 50.000 Liter / Tahun
  "fendi@gmail.com": {
    annualLiter: 50000,
    monthlyLiter: 4521,
    monthlyValue: 226050000,
  },
};

/**
 * Resolves individual DSR target based on User ID, Email, or Full Name.
 * Default fallback is 50,000 L / Year (4,521 L / Month).
 */
export function getRepQuotaTarget(
  userIdOrEmail?: string | null,
  fullName?: string | null
): RepQuotaTarget {
  if (userIdOrEmail && REPS_QUOTA_CONFIG[userIdOrEmail]) {
    const cfg = REPS_QUOTA_CONFIG[userIdOrEmail];
    return {
      annualVolumeLiter: cfg.annualLiter,
      monthlyVolumeLiter: cfg.monthlyLiter,
      monthlyValueIdr: cfg.monthlyValue,
      annualDrums: Math.round((cfg.annualLiter / LITERS_PER_DRUM) * 10) / 10,
      monthlyDrums: Math.round((cfg.monthlyLiter / LITERS_PER_DRUM) * 10) / 10,
    };
  }

  const lowerName = (fullName || "").toLowerCase();
  if (lowerName.includes("angga")) {
    const cfg = REPS_QUOTA_CONFIG["47561f60-b5ed-4881-bdc4-550c3f14ec19"];
    return {
      annualVolumeLiter: cfg.annualLiter,
      monthlyVolumeLiter: cfg.monthlyLiter,
      monthlyValueIdr: cfg.monthlyValue,
      annualDrums: Math.round((cfg.annualLiter / LITERS_PER_DRUM) * 10) / 10,
      monthlyDrums: Math.round((cfg.monthlyLiter / LITERS_PER_DRUM) * 10) / 10,
    };
  }

  // Default standard DSR target: 50,000 L / Year -> 4,521 L / Month
  const defaultAnnual = 50000;
  const defaultMonthly = 4521;
  const defaultValue = 226050000;

  return {
    annualVolumeLiter: defaultAnnual,
    monthlyVolumeLiter: defaultMonthly,
    monthlyValueIdr: defaultValue,
    annualDrums: Math.round((defaultAnnual / LITERS_PER_DRUM) * 10) / 10,
    monthlyDrums: Math.round((defaultMonthly / LITERS_PER_DRUM) * 10) / 10,
  };
}
