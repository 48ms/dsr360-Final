/**
 * Hermes Geospatial Route & Quota Optimizer Engine
 * Calculates Haversine distance, centroid coordinates for Indonesian industrial zones,
 * optimizes multi-stop travel routes weighted by deal potential & urgency,
 * and generates official Google Maps multi-stop navigation URLs.
 */

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type IndustrialHub = {
  id: string;
  name: string;
  region: string;
  coordinates: Coordinates;
};

/**
 * Common Industrial Estate Centroids in Indonesia
 */
export const INDONESIA_INDUSTRIAL_HUBS: IndustrialHub[] = [
  {
    id: "cikarang",
    name: "Cikarang (GIIC / Delta Silicon / Jababeka)",
    region: "Jawa Barat",
    coordinates: { latitude: -6.3242, longitude: 107.1524 },
  },
  {
    id: "karawang",
    name: "Karawang (KIIC / Suryacipta / KIM)",
    region: "Jawa Barat",
    coordinates: { latitude: -6.3688, longitude: 107.2892 },
  },
  {
    id: "bekasi",
    name: "Bekasi & Pulogadung Industrial Estate",
    region: "Jabodetabek",
    coordinates: { latitude: -6.2088, longitude: 106.9056 },
  },
  {
    id: "tangerang",
    name: "Tangerang & Cikande Modern Industrial",
    region: "Banten",
    coordinates: { latitude: -6.1783, longitude: 106.6319 },
  },
  {
    id: "surabaya",
    name: "Surabaya (SIER / Rungkut Industrial)",
    region: "Jawa Timur",
    coordinates: { latitude: -7.3246, longitude: 112.7563 },
  },
  {
    id: "gresik",
    name: "Gresik (JIIPE / Maspion Industrial)",
    region: "Jawa Timur",
    coordinates: { latitude: -7.1566, longitude: 112.6555 },
  },
  {
    id: "medan",
    name: "Medan (KIM 1-5 & Belawan Port)",
    region: "Sumatera Utara",
    coordinates: { latitude: 3.6698, longitude: 98.6753 },
  },
  {
    id: "pekanbaru",
    name: "Pekanbaru / Dumai (PKS Sawit & Migas)",
    region: "Riau",
    coordinates: { latitude: 0.5071, longitude: 101.4478 },
  },
  {
    id: "palembang",
    name: "Palembang (Sungai Lais / Gandus)",
    region: "Sumatera Selatan",
    coordinates: { latitude: -2.9761, longitude: 104.7754 },
  },
  {
    id: "balikpapan",
    name: "Balikpapan (Kariangau Industrial Area)",
    region: "Kalimantan Timur",
    coordinates: { latitude: -1.1866, longitude: 116.8522 },
  },
  {
    id: "samarinda",
    name: "Samarinda / Kutai Kartanegara (Mining)",
    region: "Kalimantan Timur",
    coordinates: { latitude: -0.5021, longitude: 117.1537 },
  },
];

/**
 * Calculates Haversine distance between two latitude/longitude points in kilometers.
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export type RouteCandidateCustomer = {
  id: string;
  name: string;
  priority: string;
  city: string | null;
  address: string | null;
  coordinates: Coordinates;
  potentialMonthlyVolume: number;
  openDealCount: number;
  highestDealStage: string | null;
  highestDealValue: number;
  highestDealVolume: number;
  daysSinceLastVisit: number;
  popsaBrief: {
    purpose: string;
    objective: string;
    talkingPoint: string;
  };
};

export type OptimizedRouteStep = {
  stopNumber: number;
  customer: RouteCandidateCustomer;
  distanceFromPreviousKm: number;
  estimatedDriveTimeMinutes: number;
  score: number;
};

export type TerritoryRouteResult = {
  origin: {
    label: string;
    coordinates: Coordinates;
  };
  totalDistanceKm: number;
  totalEstimatedDriveMinutes: number;
  totalPotentialVolume: number;
  totalPotentialValue: number;
  runRateContributionPct: number;
  steps: OptimizedRouteStep[];
  googleMapsUrl: string;
};

/**
 * Calculates priority weight score for a customer candidate
 */
function scoreCustomerForRoute(
  c: RouteCandidateCustomer,
  distanceKm: number
): number {
  let score = 0;

  // 1. Priority P1/A / P2/B / P3/C
  const p = (c.priority || "").toUpperCase();
  if (p === "P1" || p === "A") score += 30;
  else if (p === "P2" || p === "B") score += 18;
  else score += 8;

  // 2. High Probability Deal Stages
  const stage = (c.highestDealStage || "").toUpperCase();
  if (stage === "NEGOTIATION") score += 45;
  else if (stage === "QUOTATION" || stage === "PROPOSAL_SENT") score += 35;
  else if (stage === "TRIAL") score += 25;
  else if (stage === "QUALIFIED" || stage === "PRESENTATION") score += 15;

  // 3. Deal Value Weight
  if (c.highestDealValue > 100_000_000) score += 25;
  else if (c.highestDealValue > 30_000_000) score += 15;
  else if (c.highestDealValue > 0) score += 8;

  // 4. Inactivity & Churn Risk Penalty/Urgency
  if (c.daysSinceLastVisit >= 28) score += 25;
  else if (c.daysSinceLastVisit >= 14) score += 12;

  // 5. Distance Factor (Penalize distance > 25km)
  const distancePenalty = Math.min(distanceKm * 1.2, 40);
  score = Math.max(score - distancePenalty, 5);

  return Math.round(score);
}

/**
 * Optimizes a multi-stop route using Nearest-Neighbor with Revenue & Urgency weighting
 */
export function optimizeTerritoryRoute(
  origin: { label: string; coordinates: Coordinates },
  candidates: RouteCandidateCustomer[],
  targetStopsCount: number = 3,
  monthlyQuotaTargetVolume: number = 40
): TerritoryRouteResult {
  if (candidates.length === 0) {
    return {
      origin,
      totalDistanceKm: 0,
      totalEstimatedDriveMinutes: 0,
      totalPotentialVolume: 0,
      totalPotentialValue: 0,
      runRateContributionPct: 0,
      steps: [],
      googleMapsUrl: "",
    };
  }

  const unvisited = [...candidates];
  const routeSteps: OptimizedRouteStep[] = [];
  let currentCoord = origin.coordinates;
  let totalDistance = 0;

  const actualStops = Math.min(targetStopsCount, unvisited.length);

  for (let step = 1; step <= actualStops; step++) {
    // Score all remaining candidates relative to currentCoord
    const scored = unvisited.map((c) => {
      const dist = calculateHaversineDistance(
        currentCoord.latitude,
        currentCoord.longitude,
        c.coordinates.latitude,
        c.coordinates.longitude
      );
      const score = scoreCustomerForRoute(c, dist);
      return { customer: c, distance: dist, score };
    });

    // Pick candidate with highest score
    scored.sort((a, b) => b.score - a.score);
    const best = scored[0];

    if (!best) break;

    // Estimate drive time: average 30 km/h in Indonesian industrial traffic
    const driveMinutes = Math.max(Math.round((best.distance / 30) * 60), 10);

    routeSteps.push({
      stopNumber: step,
      customer: best.customer,
      distanceFromPreviousKm: best.distance,
      estimatedDriveTimeMinutes: driveMinutes,
      score: best.score,
    });

    totalDistance += best.distance;
    currentCoord = best.customer.coordinates;

    // Remove selected from unvisited pool
    const idx = unvisited.findIndex((u) => u.id === best.customer.id);
    if (idx !== -1) unvisited.splice(idx, 1);
  }

  // Calculate totals
  const totalDriveMinutes = routeSteps.reduce((sum, s) => sum + s.estimatedDriveTimeMinutes, 0);
  const totalVolume = routeSteps.reduce(
    (sum, s) => sum + (s.customer.highestDealVolume || s.customer.potentialMonthlyVolume || 0),
    0
  );
  const totalValue = routeSteps.reduce(
    (sum, s) => sum + (s.customer.highestDealValue || 0),
    0
  );

  const quotaRatio = monthlyQuotaTargetVolume > 0
    ? Math.round((totalVolume / monthlyQuotaTargetVolume) * 100)
    : 0;

  // Generate Google Maps Multi-Stop Direction URL
  const googleMapsUrl = generateGoogleMapsMultiStopUrl(
    origin.coordinates,
    routeSteps.map((s) => ({
      name: s.customer.name,
      address: s.customer.address || s.customer.city || "",
      coordinates: s.customer.coordinates,
    }))
  );

  return {
    origin,
    totalDistanceKm: Math.round(totalDistance * 10) / 10,
    totalEstimatedDriveMinutes: totalDriveMinutes,
    totalPotentialVolume: totalVolume,
    totalPotentialValue: totalValue,
    runRateContributionPct: quotaRatio,
    steps: routeSteps,
    googleMapsUrl,
  };
}

/**
 * Builds Google Maps Multi-Stop Universal Navigation URL
 */
export function generateGoogleMapsMultiStopUrl(
  origin: Coordinates,
  stops: { name: string; address: string; coordinates: Coordinates }[]
): string {
  if (stops.length === 0) {
    return `https://www.google.com/maps/search/?api=1&query=${origin.latitude},${origin.longitude}`;
  }

  const originParam = `${origin.latitude},${origin.longitude}`;
  const lastStop = stops[stops.length - 1];
  const destinationParam = `${lastStop.coordinates.latitude},${lastStop.coordinates.longitude}`;

  const waypoints = stops
    .slice(0, stops.length - 1)
    .map((s) => `${s.coordinates.latitude},${s.coordinates.longitude}`)
    .join("|");

  if (waypoints) {
    return `https://www.google.com/maps/dir/?api=1&origin=${originParam}&destination=${destinationParam}&waypoints=${encodeURIComponent(waypoints)}&travelmode=driving`;
  }

  return `https://www.google.com/maps/dir/?api=1&origin=${originParam}&destination=${destinationParam}&travelmode=driving`;
}
