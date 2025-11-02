import * as O from 'fp-ts/Option';
import {
  ARRIVAL_PROBABILITIES,
  CHARGING_DEMAND_DISTRIBUTION,
  type ChargepointState,
  type Power,
  type TimeSlot,
  slotToHour,
  calculateChargingSlots,
} from '@voltampere/shared';

export const sampleArrivalProbability = (slot: TimeSlot, multiplier: number): boolean => {
  const hour = slotToHour(slot);
  const baseProbability = ARRIVAL_PROBABILITIES[hour].probability;
  const adjustedProbability = baseProbability * multiplier;
  return Math.random() < adjustedProbability;
};

export const sampleChargingDemand = (): number => {
  const rand = Math.random();
  let cumulative = 0;

  for (const { probability, distanceKm } of CHARGING_DEMAND_DISTRIBUTION) {
    cumulative += probability;
    if (rand <= cumulative) {
      return distanceKm;
    }
  }

  return 0;
};


// See NOTE in `constants.ts` around DDD.
export const findAvailableChargepoint = (
  states: readonly ChargepointState[]
): O.Option<number> => {
  const index = states.findIndex(s => s.tag === 'available');
  return index >= 0 ? O.some(index) : O.none;
};

export const updateChargepointState = (state: ChargepointState): ChargepointState => {
  if (state.tag === 'charging') {
    const newRemaining = state.remainingSlots - 1;
    return newRemaining <= 0 ? { tag: 'available' } : { ...state, remainingSlots: newRemaining };
  }
  return state;
};

export const calculateTotalPower = (states: readonly ChargepointState[]): number =>
  states.reduce((sum, s) => sum + (s.tag === 'charging' ? s.powerDraw : 0), 0);

// Just a helper function, maybe better to show `charging` tag
// on the call site but the function name does convey that.
export const createChargingState = (
  energyKwh: number,
  chargingPowerKw: number
): ChargepointState => ({
  tag: 'charging',
  remainingSlots: calculateChargingSlots(energyKwh, chargingPowerKw),
  powerDraw: chargingPowerKw as Power,
});
