import React from 'react';
import { AnnualData, Scenario } from '../types';
import Card from './ui/Card';
import { GEPI_POINTS, VI_DAILY_VALUE } from '../constants';

interface CalculationDetailsProps {
    scenario: Scenario | null;
    yearData: AnnualData | null;
    year: number;
}

const DetailRow: React.FC<{ label: string; value: number; isTotal?: boolean; isNegative?: boolean }> = ({ label, value, isTotal = false, isNegative = false }) => (
    <div className={`flex justify-between py-2 border-b border-gray-200 dark:border-gray-700 ${isTotal ? 'font-bold' : ''}`}>
        <span>{label}</span>
        <span className={isNegative ? 'text-red-500' : 'text-green-500'}>
            {isNegative && '- '}{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
        </span>
    </div>
);

const formatPositionName = (position: string) => {
    if (!position || !position.includes('-')) return position;
    const [level, grade] = position.split('-');
    return `Nível ${level} - Grau ${grade}`;
};


const CalculationDetails: React.FC<CalculationDetailsProps> = ({ scenario, yearData, year }) => {
    if (!scenario || !yearData) {
        return (
            <Card className="text-center">
                <p className="text-gray-500 dark:text-gray-400">Selecione um cenário e um ano para ver o detalhamento do cálculo.</p>
            </Card>
        );
    }
    
    // Provide defaults for parameters that may be missing from older scenarios in localStorage
    const {
        gepiPoints = GEPI_POINTS,
        workingDays = 20, // Default based on form initializer
        viDailyValue = VI_DAILY_VALUE,
    } = scenario.parameters;

    const gepiLabel = `GEPI (${gepiPoints.toLocaleString('pt-BR')} pts x ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(yearData.gepiPointValue)})`;
    const viLabel = `Verba Indenizatória (VI) (${workingDays} dias x ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(viDailyValue)})`;
    
    return (
        <Card>
            <h3 className="text-xl font-bold mb-4">
                Detalhamento do Cálculo: <span style={{ color: scenario.color }}>{scenario.name}</span> - Ano {year}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h4 className="font-semibold text-lg mb-2 text-gray-700 dark:text-gray-300">Remuneração Mensal</h4>
                    <DetailRow label={`Vencimento Básico (${formatPositionName(yearData.level)})`} value={yearData.baseSalary} />
                    {yearData.ade > 0 && <DetailRow label="Adicional de Desempenho (ADE)" value={yearData.ade} />}
                    <DetailRow label={gepiLabel} value={yearData.gepi} />
                    <DetailRow label={viLabel} value={yearData.vi} />
                    <DetailRow label="Remuneração Bruta" value={yearData.grossSalary} isTotal={true}/>
                    <DetailRow label="Previdência (RPPS)" value={yearData.pensionDiscount} isNegative={true} />
                    {yearData.prevcomDiscount > 0 && <DetailRow label="Previdência Complementar (PREVCOM)" value={yearData.prevcomDiscount} isNegative={true} />}
                    <DetailRow label="Imposto de Renda (IRRF)" value={yearData.irDiscount} isNegative={true} />
                    {yearData.sindifiscoDiscount > 0 && <DetailRow label="Contribuição SINDIFISCO" value={yearData.sindifiscoDiscount} isNegative={true} />}
                    <DetailRow label="Remuneração Líquida Mensal" value={yearData.netSalary} isTotal={true}/>
                </div>
                 <div>
                    <h4 className="font-semibold text-lg mb-2 text-gray-700 dark:text-gray-300">Projeção Anual (aprox.)</h4>
                    <DetailRow label="Bruto Anual" value={yearData.grossSalary * 12}/>
                    <DetailRow label="Líquido Anual (c/ 13º)" value={yearData.netSalary * 13} isTotal={true}/>
                </div>
            </div>
        </Card>
    );
};

export default CalculationDetails;