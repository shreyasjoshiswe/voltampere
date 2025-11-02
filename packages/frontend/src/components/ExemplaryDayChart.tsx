import { SLOTS_PER_HOUR } from '@voltampere/shared';

type ExemplaryDayChartProps = {
    powerProfile: number[];
    theoreticalMaxKw: number;
};

export const ExemplaryDayChart = ({ powerProfile, theoreticalMaxKw }: ExemplaryDayChartProps) => {
    const dayIndex = 180;
    const slotsPerDay = 24 * SLOTS_PER_HOUR;
    const dayStart = dayIndex * slotsPerDay;
    const dayData = powerProfile.slice(dayStart, dayStart + slotsPerDay);

    const hourlyData: number[] = [];
    for (let hour = 0; hour < 24; hour++) {
        const startIdx = hour * SLOTS_PER_HOUR;
        const hourSlots = dayData.slice(startIdx, startIdx + SLOTS_PER_HOUR);
        const avgPower = hourSlots.reduce((sum, p) => sum + p, 0) / SLOTS_PER_HOUR;
        hourlyData.push(avgPower);
    }

    const maxValue = Math.max(theoreticalMaxKw, ...hourlyData);
    const chartHeight = 200;

    return (
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Exemplary Day Power Demand
            </h3>

            <div className="relative" style={{ height: chartHeight }}>
                <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-gray-500">
                    <span>{maxValue.toFixed(0)} kW</span>
                    <span>{(maxValue * 0.5).toFixed(0)} kW</span>
                    <span>0 kW</span>
                </div>

                <div className="ml-12 h-full border-l border-b border-gray-300 relative">
                    <div
                        className="absolute w-full border-t-2 border-red-300 border-dashed"
                        style={{ bottom: `${(theoreticalMaxKw / maxValue) * 100}%` }}
                    >
                        <span className="absolute right-0 -top-4 text-xs text-red-600">
                            Theoretical Max
                        </span>
                    </div>

                    <div className="flex items-end h-full gap-0.5">
                        {hourlyData.map((power, hour) => {
                            const heightPercent = (power / maxValue) * 100;
                            const isHighDemand = hour >= 8 && hour <= 18;

                            return (
                                <div
                                    key={hour}
                                    className="flex-1 relative group cursor-pointer"
                                    style={{ height: '100%' }}
                                >
                                    <div
                                        className={`absolute bottom-0 w-full rounded-t transition-all ${isHighDemand
                                                ? 'bg-blue-600 hover:bg-blue-700'
                                                : 'bg-blue-400 hover:bg-blue-500'
                                            }`}
                                        style={{ height: `${heightPercent}%` }}
                                    >
                                        <div className="invisible group-hover:visible absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-10">
                                            {hour.toString().padStart(2, '0')}:00 - {power.toFixed(1)} kW
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="ml-12 mt-2 flex justify-between text-xs text-gray-500">
                    {[0, 3, 6, 9, 12, 15, 18, 21].map((hour) => (
                        <span key={hour}>{hour.toString().padStart(2, '0')}:00</span>
                    ))}
                </div>
            </div>
        </div>
    );
};
