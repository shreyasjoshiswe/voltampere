import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import {
  type SimulationConfig,
  type SimulationResults,
  type ChargepointState,
  type TimeSlot,
  TOTAL_SLOTS,
  kmToKwh,
} from '@voltampere/shared';
import {
  sampleArrivalProbability,
  sampleChargingDemand,
  findAvailableChargepoint,
  updateChargepointState,
  calculateTotalPower,
  createChargingState,
  initializeChargepoints,
} from './sampling';

export const runSimulation = (config: SimulationConfig): SimulationResults => {
  const states: ChargepointState[] = initializeChargepoints(config.numChargepoints);

  let totalEnergy = 0;
  let maxPower = 0;
  let chargingEvents = 0;

  for (let slot = 0; slot < TOTAL_SLOTS; slot++) {
    for (let idx = 0; idx < states.length; idx++) {
      states[idx] = updateChargepointState(states[idx]);
    }

    for (let idx = 0; idx < states.length; idx++) {
      if (states[idx].tag === 'available' &&
        sampleArrivalProbability(slot as TimeSlot, config.arrivalMultiplier)) {
        const distanceKm = sampleChargingDemand();

        // Only charge if distance > 0 (34.31% arrive but don't charge)
        if (distanceKm > 0) {
          const energyKwh = kmToKwh(distanceKm, config.carConsumption);
          states[idx] = createChargingState(energyKwh, config.chargingPower);
          totalEnergy += energyKwh;
          chargingEvents++;
        }
      }
    }

    const currentPower = calculateTotalPower(states);
    maxPower = Math.max(maxPower, currentPower);
  }

  const theoreticalMax = config.numChargepoints * config.chargingPower;

  return {
    totalEnergyKwh: totalEnergy,
    theoreticalMaxKw: theoreticalMax,
    actualMaxKw: maxPower,
    concurrencyFactor: maxPower / theoreticalMax,
    chargingEvents,
  };
};

export const runConcurrencyAnalysis = (
  baseConfig: SimulationConfig,
  minChargepoints: number = 1,
  maxChargepoints: number = 30
): Array<{ chargepoints: number; concurrencyFactor: number }> => {
  const results: Array<{ chargepoints: number; concurrencyFactor: number }> = [];

  for (let n = minChargepoints; n <= maxChargepoints; n++) {
    const config: SimulationConfig = {
      ...baseConfig,
      numChargepoints: n,
    };
    const result = runSimulation(config);
    results.push({
      chargepoints: n,
      concurrencyFactor: result.concurrencyFactor,
    });
  }

  return results;
};
