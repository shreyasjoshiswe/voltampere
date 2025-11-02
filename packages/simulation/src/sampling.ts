import {
  ARRIVAL_PROBABILITIES,
  type TimeSlot,
  slotToHour,
} from '@voltampere/shared';

export const sampleArrivalProbability = (slot: TimeSlot, multiplier: number): boolean => {
  const hour = slotToHour(slot);
  const baseProbability = ARRIVAL_PROBABILITIES[hour].probability;
  const adjustedProbability = baseProbability * multiplier;
  return Math.random() < adjustedProbability;
};
