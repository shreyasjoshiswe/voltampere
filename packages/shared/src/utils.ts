export const slotToHour = (slot: number): number => Math.floor(slot / 4) % 24;

export const kmToKwh = (distanceKm: number, consumptionPer100Km: number): number =>
  (distanceKm * consumptionPer100Km) / 100;

export const calculateChargingSlots = (energyKwh: number, chargingPowerKw: number): number =>
  Math.ceil((energyKwh / chargingPowerKw) * 4);

export const formatEnergy = (kwh: number): string => `${kwh.toFixed(2)} kWh`;

export const formatPower = (kw: number): string => `${kw.toFixed(2)} kW`;

export const formatPercentage = (value: number): string => `${(value * 100).toFixed(1)}%`;
