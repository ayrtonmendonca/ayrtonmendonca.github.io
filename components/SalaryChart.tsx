
import React from 'react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';
import { SalaryProjection } from '../types';

interface SalaryChartProps {
  projectionData: SalaryProjection[];
}

const formatCurrency = (value: number) => `R$ ${(value / 1000).toFixed(0)}k`;

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-bold text-gray-800">{`Ano: ${label}`}</p>
        <p className="text-sm text-gray-600">{`Nível: ${data.careerLevel}`}</p>
        <p className="text-sm text-blue-600">{`Bruto Anual: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(payload[0].value)}`}</p>
        <p className="text-sm text-green-600">{`Líquido Anual: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(payload[1].value)}`}</p>
      </div>
    );
  }
  return null;
};

export const SalaryChart: React.FC<SalaryChartProps> = ({ projectionData }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Projeção da Carreira (Próximos 30 Anos)</h3>
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <BarChart data={projectionData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{fontSize: "14px"}}/>
            <Bar dataKey="annualGross" fill="#3b82f6" name="Bruto Anual" />
            <Bar dataKey="annualNet" fill="#16a34a" name="Líquido Anual" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
