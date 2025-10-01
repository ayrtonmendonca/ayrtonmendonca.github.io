
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { dadosGrafico, Cenario } from '../types';

interface GraficoRemuneracaoPropriedades {
    data: dadosGrafico[];
    cenarios: Cenario[];
    onDataPointClick: (ano: number) => void;
}

const GraficoRemuneracao: React.FC<GraficoRemuneracaoPropriedades> = ({ data, cenarios, onDataPointClick }) => {

    // console.log(data, cenarios, onDataPointClick);
   
    const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
                    <p className="font-bold">{`Ano: ${label}`}</p>
                    {payload.map((pld: any) => {
                    return (
                        <div key={pld.dataKey} style={{ color: pld.color }}>
                            {`${pld.name}: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pld.value)}`}
                        </div>
                    )})}
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
                <XAxis dataKey="ano" />
                <YAxis tickFormatter={(value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact' }).format(value as number)} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {cenarios.map(cenario => (
                    <Line
                        key={cenario.id}
                        type="monotone"
                        dataKey={cenario.id}
                        name={cenario.nome}
                        stroke={cenario.cor}
                        strokeWidth={2}
                        dot={{ r: 2 }}
                        activeDot={{ r: 6 }}
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
    );
};

export default GraficoRemuneracao;
