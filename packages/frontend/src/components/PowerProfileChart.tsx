import { SLOTS_PER_HOUR } from '@voltampere/shared';

type PowerProfileChartProps = {
    powerProfile: number[];
    theoreticalMaxKw: number;
};

export const PowerProfileChart = ({ powerProfile, theoreticalMaxKw }: PowerProfileChartProps) => {
    const hourlyData: number[] = [];
    for (let hour = 0; hour < powerProfile.length / SLOTS_PER_HOUR; hour++) {
        const startIdx = hour * SLOTS_PER_HOUR;
        const hourSlots = powerProfile.slice(startIdx, startIdx + SLOTS_PER_HOUR);
        const avgPower = hourSlots.reduce((sum, p) => sum + p, 0) / SLOTS_PER_HOUR;
        hourlyData.push(avgPower);
    }

    const dailyPeaks: number[] = [];
    for (let day = 0; day < 365; day++) {
        const dayStart = day * 24;
        const dayData = hourlyData.slice(dayStart, dayStart + 24);
        const peakPower = Math.max(...dayData);
        dailyPeaks.push(peakPower);
    }

    const maxValue = Math.max(...dailyPeaks);
    const chartHeight = 200;

    return (
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Annual Power Profile (Daily Peaks)
            </h3>

            <div className="relative" style={{ height: chartHeight }}>
                <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-gray-500">
                    <span>{maxValue.toFixed(0)} kW</span>
                    <span>{(maxValue * 0.5).toFixed(0)} kW</span>
                    <span>0 kW</span>
                </div>

                <div className="ml-12 h-full border-l border-b border-gray-300 relative">
                    <svg className="w-full h-full" viewBox={`0 0 ${dailyPeaks.length} ${chartHeight}`} preserveAspectRatio="none">
                        <line
                            x1="0"
                            y1={chartHeight * (1 - theoreticalMaxKw / maxValue)}
                            x2={dailyPeaks.length}
                            y2={chartHeight * (1 - theoreticalMaxKw / maxValue)}
                            stroke="#ef4444"
                            strokeWidth="0.5"
                            strokeDasharray="2,2"
                        />

                        <polyline
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="0.5"
                            points={dailyPeaks
                                .map((power, idx) => {
                                    const x = idx;
                                    const y = chartHeight * (1 - power / maxValue);
                                    return `${x},${y}`;
                                })
                                .join(' ')}
                        />

                        <polygon
                            fill="url(#gradient)"
                            opacity="0.3"
                            points={`
                                0,${chartHeight}
                                ${dailyPeaks
                                    .map((power, idx) => {
                                        const x = idx;
                                        const y = chartHeight * (1 - power / maxValue);
                                        return `${x},${y}`;
                                    })
                                    .join(' ')}
                                ${dailyPeaks.length},${chartHeight}
                            `}
                        />

                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#3b82f6" />
                                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                    </svg>

                    <div className="absolute top-2 right-2 text-xs space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-0.5 bg-blue-600"></div>
                            <span className="text-gray-600">Actual Peak</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-0.5 bg-red-500 border-dashed"></div>
                            <span className="text-gray-600">Theoretical Max</span>
                        </div>
                    </div>
                </div>

                <div className="ml-12 mt-2 flex justify-between text-xs text-gray-500">
                    <span>Jan</span>
                    <span>Mar</span>
                    <span>May</span>
                    <span>Jul</span>
                    <span>Sep</span>
                    <span>Nov</span>
                </div>
            </div>
        </div>
    );
};
