import * as E from 'fp-ts/Either';
import type { SimulationConfig } from '@voltampere/shared';

type ValidationError = {
  field: string;
  message: string;
};

type ValidationResult = E.Either<ValidationError[], SimulationConfig>;

export const validateSimulationConfig = (body: unknown): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!body || typeof body !== 'object') {
    return E.left([{ field: 'body', message: 'Request body must be an object' }]);
  }

  const data = body as Record<string, unknown>;

  if (typeof data.numChargepoints !== 'number') {
    errors.push({ field: 'numChargepoints', message: 'Must be a number' });
  } else if (data.numChargepoints < 1 || data.numChargepoints > 100) {
    errors.push({ field: 'numChargepoints', message: 'Must be between 1 and 100' });
  } else if (!Number.isInteger(data.numChargepoints)) {
    errors.push({ field: 'numChargepoints', message: 'Must be an integer' });
  }

  if (typeof data.arrivalMultiplier !== 'number') {
    errors.push({ field: 'arrivalMultiplier', message: 'Must be a number' });
  } else if (data.arrivalMultiplier < 0.2 || data.arrivalMultiplier > 2.0) {
    errors.push({ field: 'arrivalMultiplier', message: 'Must be between 0.2 and 2.0' });
  }

  if (typeof data.carConsumption !== 'number') {
    errors.push({ field: 'carConsumption', message: 'Must be a number' });
  } else if (data.carConsumption <= 0 || data.carConsumption > 100) {
    errors.push({ field: 'carConsumption', message: 'Must be between 0 and 100 kWh/100km' });
  }

  if (typeof data.chargingPower !== 'number') {
    errors.push({ field: 'chargingPower', message: 'Must be a number' });
  } else if (data.chargingPower <= 0 || data.chargingPower > 350) {
    errors.push({ field: 'chargingPower', message: 'Must be between 0 and 350 kW' });
  }

  if (errors.length > 0) {
    return E.left(errors);
  }

  return E.right({
    numChargepoints: data.numChargepoints as number,
    arrivalMultiplier: data.arrivalMultiplier as number,
    carConsumption: data.carConsumption as number,
    chargingPower: data.chargingPower as number,
  });
};
