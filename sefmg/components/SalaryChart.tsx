
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { YearlyData } from '../types';

interface SalaryChartProps {
  projectionData: YearlyData[];
}

const formatCurrencyForAxis = (value: number) => {
    if (value >= 1000000) return `R$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `R$${(value / 1000).toFixed(0)}k`;
    return `R$${value}`;
};

export const SalaryChart: React.FC<SalaryChartProps> = ({ projectionData }) => {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-slate-700 mb-6">Projeção de Carreira (Próximos 30 anos)</h2>
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <LineChart
            data={projectionData}
            margin={{
              top: 5,
              right: 20,
              left: 30,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="year" tick={{ fill: '#64748b' }} />
            <YAxis tickFormatter={formatCurrencyForAxis} tick={{ fill: '#64748b' }} />
            <Tooltip
                formatter={(value: number, name: string) => [new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value), name === 'grossAnnual' ? 'Bruto Anual' : 'Líquido Anual']}
                labelStyle={{ color: '#334155', fontWeight: 'bold' }}
                itemStyle={{ fontWeight: 'normal' }}
                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}
            />
            <Legend formatter={(value) => value === 'grossAnnual' ? 'Bruto Anual' : 'Líquido Anual'} />
            <Line type="monotone" dataKey="grossAnnual" stroke="#10b981" strokeWidth={2} activeDot={{ r: 8 }} dot={{r: 2}}/>
            <Line type="monotone" dataKey="netAnnual" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} dot={{r: 2}} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
