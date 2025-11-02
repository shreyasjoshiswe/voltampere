import type { SimulationResults } from '@voltampere/shared';
import { formatEnergy, formatPower, formatPercentage } from '@voltampere/shared';
import { PowerProfileChart } from './PowerProfileChart';
import { ExemplaryDayChart } from './ExemplaryDayChart';

type ResultsDisplayProps = {
    results: SimulationResults;
};

const MetricCard = ({
    title,
    value,
    subtitle
}: {
    title: string;
    value: string;
    subtitle?: string;
}) => (
    <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
        <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
        <p className="text-3xl font-semibold text-gray-900">{value}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
);

export const ResultsDisplay = ({ results }: ResultsDisplayProps) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Simulation Results
            </h2>

            <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <MetricCard
                        title="Total Energy Consumed"
                        value={formatEnergy(results.totalEnergyKwh)}
                        subtitle="Over one year"
                    />

                    <MetricCard
                        title="Charging Events"
                        value={results.chargingEvents.toLocaleString()}
                        subtitle="Total sessions"
                    />

                    <MetricCard
                        title="Theoretical Max Power"
                        value={formatPower(results.theoreticalMaxKw)}
                        subtitle="All chargers at full capacity"
                    />

                    <MetricCard
                        title="Actual Max Power"
                        value={formatPower(results.actualMaxKw)}
                        subtitle="Peak demand observed"
                    />
                </div>

                {/* Power visualizations */}
                {results.powerProfile && results.powerProfile.length > 0 && (
                    <>
                        <ExemplaryDayChart
                            powerProfile={results.powerProfile}
                            theoreticalMaxKw={results.theoreticalMaxKw}
                        />
                        
                        <PowerProfileChart
                            powerProfile={results.powerProfile}
                            theoreticalMaxKw={results.theoreticalMaxKw}
                        />
                    </>
                )}

                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Concurrency Factor
                    </h3>

                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Ratio</span>
                            <span className="text-blue-600 font-semibold">
                                {formatPercentage(results.concurrencyFactor)}
                            </span>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
                                style={{ width: `${results.concurrencyFactor * 100}%` }}
                            />
                        </div>

                        <p className="text-xs text-gray-600 mt-2">
                            Actual peak demand is {formatPercentage(results.concurrencyFactor)} of theoretical maximum
                        </p>
                    </div>
                </div>

                <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                    <h4 className="text-sm font-medium text-green-900 mb-2">
                        Power Savings
                    </h4>
                    <p className="text-3xl font-semibold text-green-700">
                        {formatPower(results.theoreticalMaxKw - results.actualMaxKw)}
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                        Grid connection can be {formatPercentage(1 - results.concurrencyFactor)} smaller than theoretical maximum
                    </p>
                </div>
            </div>
        </div>
    );
};
