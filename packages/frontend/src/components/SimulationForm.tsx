import { useState } from 'react';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { DEFAULT_CONFIG, type SimulationConfig } from '@voltampere/shared';

type FormValues = {
    numChargepoints: number;
    arrivalMultiplier: number;
    carConsumption: number;
    chargingPower: number;
};

type SimulationFormProps = {
    onSubmit: (config: SimulationConfig) => void;
    isLoading: boolean;
};

const validateConfig = (values: FormValues): O.Option<SimulationConfig> => {
    if (values.numChargepoints < 1 || values.numChargepoints > 30) {
        return O.none;
    }
    if (values.arrivalMultiplier < 0.2 || values.arrivalMultiplier > 2.0) {
        return O.none;
    }
    if (values.carConsumption <= 0 || values.carConsumption > 100) {
        return O.none;
    }
    if (values.chargingPower <= 0 || values.chargingPower > 350) {
        return O.none;
    }

    return O.some(values);
};

export const SimulationForm = ({ onSubmit, isLoading }: SimulationFormProps) => {
    const [values, setValues] = useState<FormValues>(DEFAULT_CONFIG);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        pipe(
            validateConfig(values),
            O.match(
                () => alert('Invalid configuration values'),
                (config) => onSubmit(config)
            )
        );
    };

    const updateValue = (field: keyof FormValues) => (value: number) => {
        setValues((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Configuration
            </h2>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Chargepoints (1 to 30)
                </label>
                <input
                    type="number"
                    min="1"
                    max="30"
                    step="1"
                    value={values.numChargepoints}
                    onChange={(e) => updateValue('numChargepoints')(Number(e.target.value))}
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-1.5">
                    Current: {values.numChargepoints}
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Arrival Multiplier (0.2 to 2.0)
                </label>
                <input
                    type="range"
                    min="0.2"
                    max="2.0"
                    step="0.1"
                    value={values.arrivalMultiplier}
                    onChange={(e) => updateValue('arrivalMultiplier')(Number(e.target.value))}
                    className="w-full accent-blue-600"
                    disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-1.5">
                    Current: {values.arrivalMultiplier}x ({(values.arrivalMultiplier * 100).toFixed(0)}%)
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Car Consumption (kWh/100km)
                </label>
                <input
                    type="number"
                    min="1"
                    max="100"
                    step="0.5"
                    value={values.carConsumption}
                    onChange={(e) => updateValue('carConsumption')(Number(e.target.value))}
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-1.5">
                    Default: 18 kWh/100km
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Charging Power (kW)
                </label>
                <select
                    value={values.chargingPower}
                    onChange={(e) => updateValue('chargingPower')(Number(e.target.value))}
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isLoading}
                >
                    <option value="3.7">3.7 kW (Slow)</option>
                    <option value="7.4">7.4 kW (Standard)</option>
                    <option value="11">11 kW (Fast)</option>
                    <option value="22">22 kW (Rapid)</option>
                    <option value="50">50 kW (DC Fast)</option>
                </select>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
                {isLoading ? 'Running Simulation...' : 'Run Simulation'}
            </button>
        </form>
    );
};
