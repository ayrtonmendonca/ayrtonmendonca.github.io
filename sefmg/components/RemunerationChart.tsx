
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { dadosGrafico, Cenario } from '../types';

interface GraficoRemuneracaoPropriedades {
    data: dadosGrafico[];
    cenarios: Cenario[];
    onDataPointClick: (ano: number) => void;
    projecoes: { [key: string]: any[] };
    tipoRemuneracao: 'liquida' | 'bruta' | 'tributavel';
}

const GraficoRemuneracao: React.FC<GraficoRemuneracaoPropriedades> = ({ data, cenarios, onDataPointClick, projecoes, tipoRemuneracao }) => {

    // Gera array com valores do teto do servidor público para cada ano
    const tetoServidorPorAno = data.map((d, idx) => {
        // Pega o primeiro cenário para buscar a projeção do teto (todos compartilham o parâmetro global)
        const proj = projecoes && cenarios.length > 0 && projecoes[cenarios[0].id] ? projecoes[cenarios[0].id][idx] : null;
        return proj ? proj.tetoServidorPublicoCorrigido : null;
    });

    // Adiciona a linha do teto ao data, para uso no Line
    const dataComTeto = data.map((d, idx) => ({ ...d, tetoServidor: tetoServidorPorAno[idx] }));

    // console.log(data, cenarios, onDataPointClick);
   
    const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            // Pega a posição da carreira do primeiro cenário (todos compartilham o parâmetro global)
            let posicao = '';
            if (projecoes && Object.keys(projecoes).length > 0) {
                const primeiraProjecao = projecoes[Object.keys(projecoes)[0]];
                if (primeiraProjecao) {
                    const projAno = primeiraProjecao.find((d: any) => d.ano === label);
                    if (projAno && projAno.posicaoCarreira) {
                        posicao = projAno.posicaoCarreira;
                    }
                }
            }
            let labelRem = 'Remuneração Líquida';
            if (tipoRemuneracao === 'bruta') labelRem = 'Remuneração Bruta';
            if (tipoRemuneracao === 'tributavel') labelRem = 'Remuneração Tributável';
            return (
                <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
                    <p className="font-bold">{`Ano: ${label}`}</p>
                    {posicao && (
                        <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">Posição na carreira: {posicao}</p>
                    )}
                    <p className="text-xs text-gray-700 dark:text-gray-200 mb-2">{labelRem}</p>
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
                data={dataComTeto}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                onClick={(e) => e && e.activeLabel && onDataPointClick(Number(e.activeLabel))}
            >
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="ano" />
                <YAxis tickFormatter={(value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact' }).format(value as number)} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {/* Linha dinâmica do teto do servidor público */}
                <Line
                    type="monotone"
                    dataKey="tetoServidor"
                    stroke="#222"
                    strokeDasharray="6 2"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                    name=""
                    legendType="none"
                    activeDot={false}
                />
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