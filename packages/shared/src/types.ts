export type ArrivalProbability = {
  readonly hour: number;
  readonly probability: number;
};

export type ChargingDemand = {
  readonly probability: number;
  readonly distanceKm: number;
};

