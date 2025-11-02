export type ArrivalProbability = {
  readonly hour: number;
  readonly probability: number;
};

export type ChargingDemand = {
  readonly probability: number;
  readonly distanceKm: number;
};

// Really wish we'd have a Rust like unit struct,
// something like `struct ChargePointID(u8)`,
// instead of using branded types
// but this works as well.
export type ChargePointId = number & { readonly __brand: 'ChargepointId' };
export type TimeSlot = number & { readonly __brand: 'TimeSlot' };
export type Energy = number & { readonly __brand: 'Energy' };
export type Power = number & { readonly __brand: 'Power' };

export type ChargepointState =
  | { tag: 'available' }
  | { tag: 'charging'; remainingSlots: number; powerDraw: Power };

export type SimulationConfig = {
  readonly numChargepoints: number;
  readonly arrivalMultiplier: number;
  readonly carConsumption: number;
  readonly chargingPower: number;
};

