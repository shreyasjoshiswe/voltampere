#!/usr/bin/env node
import { DEFAULT_CONFIG, formatEnergy, formatPower, formatPercentage } from '@voltampere/shared';
import { runConcurrencyAnalysis } from './simulator';
import { runSimulation } from './simulator';

const printResults = (results: ReturnType<typeof runSimulation>, config: typeof DEFAULT_CONFIG) => {
    console.log('\nEV Charging Simulation Results\n');
    console.log('Configuration:');
    console.log(`Chargepoints: ${config.numChargepoints}`);
    console.log(`Charging Power: ${formatPower(config.chargingPower)}`);
    console.log(`Car Consumption: ${config.carConsumption} kWh/100km`);
    console.log(`Arrival Multiplier: ${config.arrivalMultiplier}x\n`);

    console.log('Results:');
    console.log(`Total Energy Consumed: ${formatEnergy(results.totalEnergyKwh)}`);
    console.log(`Theoretical Max Power: ${formatPower(results.theoreticalMaxKw)}`);
    console.log(`Actual Max Power: ${formatPower(results.actualMaxKw)}`);
    console.log(`Concurrency Factor: ${formatPercentage(results.concurrencyFactor)}`);
    console.log(`Charging Events: ${results.chargingEvents}`);
    console.log('\n');
};

const printConcurrencyAnalysis = (
    results: ReturnType<typeof runConcurrencyAnalysis>
) => {
    console.log('\nConcurrency Factor Analysis\n');
    console.log('Chargepoints | Concurrency Factor');
    console.log('-------------|-------------------');
    results.forEach(({ chargepoints, concurrencyFactor }) => {
        console.log(
            `${chargepoints.toString().padStart(12)} | ${formatPercentage(concurrencyFactor)}`
        );
    });
    console.log('\n');
};

const main = () => {
    console.log('Starting EV Charging Simulation...\n');

    const config = DEFAULT_CONFIG;
    const results = runSimulation(config);
    printResults(results, config);

    console.log('Running concurrency analysis...');
    const concurrencyResults = runConcurrencyAnalysis(config, 1, 30);
    printConcurrencyAnalysis(concurrencyResults);

    console.log('Simulation complete!');
};

main();
