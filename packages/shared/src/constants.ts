import type { ArrivalProbability, ChargingDemand, SimulationConfig } from './types';

export const HOURS_PER_DAY = 24;
export const DAYS_PER_YEAR = 365;

// Just how many 15 mins intervals there are in an hour.
export const SLOTS_PER_HOUR = 4;

// This is just 365 × 24 × 4 = 35,040,
// but better to keep things in const to make it more readable,
// but mainly easier to understand what's going on.
export const TOTAL_SLOTS = DAYS_PER_YEAR * HOURS_PER_DAY * SLOTS_PER_HOUR;

export const MINUTES_PER_SLOT = 15;

export const ARRIVAL_PROBABILITIES: readonly ArrivalProbability[] = [
  { hour: 0, probability: 0.0094 },
  { hour: 1, probability: 0.0094 },
  { hour: 2, probability: 0.0094 },
  { hour: 3, probability: 0.0094 },
  { hour: 4, probability: 0.0094 },
  { hour: 5, probability: 0.0094 },
  { hour: 6, probability: 0.0094 },
  { hour: 7, probability: 0.0094 },
  { hour: 8, probability: 0.0283 },
  { hour: 9, probability: 0.0283 },
  { hour: 10, probability: 0.0566 },
  { hour: 11, probability: 0.0566 },
  { hour: 12, probability: 0.0566 },
  { hour: 13, probability: 0.0755 },
  { hour: 14, probability: 0.0755 },
  { hour: 15, probability: 0.0755 },
  { hour: 16, probability: 0.1038 },
  { hour: 17, probability: 0.1038 },
  { hour: 18, probability: 0.1038 },
  { hour: 19, probability: 0.0472 },
  { hour: 20, probability: 0.0472 },
  { hour: 21, probability: 0.0472 },
  { hour: 22, probability: 0.0094 },
  { hour: 23, probability: 0.0094 },
] as const;

export const CHARGING_DEMAND_DISTRIBUTION: readonly ChargingDemand[] = [
  // 34.31% don't charge.
  // NOTE: Could use O.Some and O.None to be more DDD,
  // but `0` works fine for now.
  { probability: 0.3431, distanceKm: 0 },
  { probability: 0.049, distanceKm: 5 },
  { probability: 0.098, distanceKm: 10 },
  { probability: 0.1176, distanceKm: 20 },
  { probability: 0.0882, distanceKm: 30 },
  { probability: 0.1176, distanceKm: 50 },
  { probability: 0.1078, distanceKm: 100 },
  { probability: 0.049, distanceKm: 200 },
  { probability: 0.0294, distanceKm: 300 },
] as const;

export const DEFAULT_CONFIG: SimulationConfig = {
  numChargepoints: 20,
  // Required by 2a and 2b so here just in case.
  arrivalMultiplier: 1.0,
  carConsumption: 18,
  chargingPower: 11,
} as const;
