
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartData, Scenario } from '../types';

interface RemunerationChartProps {
    data: ChartData[];
    scenarios: Scenario[];
    onDataPointClick: (year: number) => void;
}

const RemunerationChart: React.FC<RemunerationChartProps> = ({ data, scenarios, onDataPointClick }) => {
    
    const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
                    <p className="font-bold">{`Ano: ${label}`}</p>
                    {payload.map((pld: any) => (
                        <div key={pld.dataKey} style={{ color: pld.color }}>
                            {`${pld.name}: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pld.value)}`}
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart 
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                onClick={(e) => e && e.activeLabel && onDataPointClick(Number(e.activeLabel))}
            >
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="year" />
                <YAxis tickFormatter={(value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact' }).format(value as number)} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {scenarios.map(scenario => (
                    <Line
                        key={scenario.id}
                        type="monotone"
                        dataKey={scenario.id}
                        name={scenario.name}
                        stroke={scenario.color}
                        strokeWidth={2}
                        dot={{ r: 2 }}
                        activeDot={{ r: 6 }}
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
    );
};

export default RemunerationChart;
