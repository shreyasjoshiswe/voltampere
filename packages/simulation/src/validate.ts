import { runSimulation } from './simulator';
import { DEFAULT_CONFIG } from '@voltampere/shared';

const validateSimulation = () => {
  const config = DEFAULT_CONFIG;
  const results = runSimulation(config);

  const tests = [
    {
      name: 'Theoretical max is correct',
      pass: results.theoreticalMaxKw === config.numChargepoints * config.chargingPower,
      expected: 220,
      actual: results.theoreticalMaxKw,
    },
    {
      name: 'Actual max is in expected range',
      pass: results.actualMaxKw >= 77 && results.actualMaxKw <= 121,
      expected: '77-121 kW',
      actual: `${results.actualMaxKw.toFixed(2)} kW`,
    },
    {
      name: 'Concurrency factor is in expected range',
      pass: results.concurrencyFactor >= 0.35 && results.concurrencyFactor <= 0.55,
      expected: '35-55%',
      actual: `${(results.concurrencyFactor * 100).toFixed(1)}%`,
    },
    {
      name: 'Total energy is positive',
      pass: results.totalEnergyKwh > 0,
      expected: '> 0',
      actual: `${results.totalEnergyKwh.toFixed(2)} kWh`,
    },
    {
      name: 'Charging events recorded',
      pass: results.chargingEvents > 0,
      expected: '> 0',
      actual: results.chargingEvents,
    },
  ];

  tests.forEach(({ name, pass, expected, actual }) => {
    console.log(`${pass ? 'Pass' : 'Fail'} ${name}`);
    console.log(`  Expected: ${expected}`);
    console.log(`  Actual: ${actual}\n`);
  });

  const all = tests.every(t => t.pass);

  if (all) {
    console.log('All validation tests passed!\n');
  } else {
    console.log('Some tests failed, outside expected ranges.\n');
    console.log('Note: Some variation is normal.');
  }

  return all;
};

validateSimulation();
