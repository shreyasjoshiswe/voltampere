import { useState } from 'react';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { SimulationForm } from './components/SimulationForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import type { SimulationConfig, SimulationResults } from '@voltampere/shared';

export const App = () => {
    const [results, setResults] = useState<O.Option<SimulationResults>>(O.none);
    const [isLoading, setIsLoading] = useState(false);

    const handleRunSimulation = async (config: SimulationConfig) => {
        setIsLoading(true);

        try {
            const createResponse = await fetch('http://localhost:3000/api/simulations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config),
            });

            if (!createResponse.ok) {
                throw new Error('Failed to create simulation');
            }

            const simulation = await createResponse.json();

            const runResponse = await fetch(`http://localhost:3000/api/simulations/${simulation.id}/run`, {
                method: 'POST',
            });

            if (!runResponse.ok) {
                throw new Error('Failed to run simulation');
            }

            const data = await runResponse.json();
            setResults(O.some(data.results));
        } catch (error) {
            console.error('Simulation error:', error);
            alert('Failed to run simulation');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <header className="mb-12">
                    <h1 className="text-5xl font-bold text-gray-900 mb-3">
                        EV Charging Simulator
                    </h1>
                    <p className="text-xl text-gray-600">
                        Analyze power demand and energy consumption for EV charging infrastructure
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <SimulationForm
                            onSubmit={handleRunSimulation}
                            isLoading={isLoading}
                        />
                    </div>

                    <div>
                        {pipe(
                            results,
                            O.match(
                                () => (
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center text-gray-400">
                                        <p>Configure parameters and run simulation to see results</p>
                                    </div>
                                ),
                                (res) => <ResultsDisplay results={res} />
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
