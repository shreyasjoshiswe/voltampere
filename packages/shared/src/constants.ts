export const HOURS_PER_DAY = 24;
export const DAYS_PER_YEAR = 365;

// Just how many 15 mins intervals there are in an hour.
export const SLOTS_PER_HOUR = 4;

// This is just 365 × 24 × 4 = 35,040,
// but better to keep things in const to make it more readable,
// but mainly easier to understand what's going on.
export const TOTAL_SLOTS = DAYS_PER_YEAR * HOURS_PER_DAY * SLOTS_PER_HOUR;

export const MINUTES_PER_SLOT = 15;

export const ARRIVAL_PROBABILITIES = [
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

