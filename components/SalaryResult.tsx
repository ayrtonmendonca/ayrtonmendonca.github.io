
import React from 'react';
import { SalaryDetails } from '../types';

interface SalaryResultProps {
  currentSalary: SalaryDetails;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const InfoRow: React.FC<{ label: string; value: string | number; className?: string }> = ({ label, value, className = '' }) => (
  <div className="flex justify-between items-center py-3 border-b border-gray-200">
    <span className="text-sm text-gray-600">{label}</span>
    <span className={`text-sm font-medium text-gray-800 ${className}`}>{typeof value === 'number' ? formatCurrency(value) : value}</span>
  </div>
);

export const SalaryResult: React.FC<SalaryResultProps> = ({ currentSalary }) => {
  const { grossSalary, netSalary, deductions, details } = currentSalary;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Resultado da Simulação (Remuneração Mensal)</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-green-50 p-4 rounded-lg text-center">
            <h4 className="text-sm font-semibold text-green-800 uppercase">Remuneração Líquida</h4>
            <p className="text-3xl font-bold text-green-700 mt-1">{formatCurrency(netSalary)}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg text-center">
            <h4 className="text-sm font-semibold text-blue-800 uppercase">Remuneração Bruta</h4>
            <p className="text-3xl font-bold text-blue-700 mt-1">{formatCurrency(grossSalary)}</p>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-md font-semibold text-gray-700 mt-4 mb-2">Detalhes da Remuneração</h4>
        <InfoRow label="Nível na Carreira" value={details.careerLevel} />
        <InfoRow label="Anos de Serviço" value={`${details.yearsOfService} anos`} />
        <InfoRow label="Vencimento Básico" value={details.baseSalary} />
        <InfoRow label="GEPI (Gratificação)" value={details.gepi} />
        <InfoRow label="Auxílio Alimentação" value={details.mealAllowance} />
        <InfoRow label="Ajuda de Custo" value={details.costAllowance} />

        <h4 className="text-md font-semibold text-gray-700 mt-6 mb-2">Descontos</h4>
        <InfoRow label="Previdência" value={deductions.pension} className="text-red-600" />
        <InfoRow label="Imposto de Renda (IRRF)" value={deductions.incomeTax} className="text-red-600" />
        <InfoRow label="Total de Descontos" value={deductions.total} className="text-red-700 font-bold" />
      </div>
    </div>
  );
};
