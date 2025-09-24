
import React from 'react';
import type { SalaryDetails } from '../types';

interface SalaryResultProps {
  currentSalary: SalaryDetails;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const ResultRow: React.FC<{ label: string; value: string; className?: string; isTotal?: boolean }> = ({ label, value, className = '', isTotal = false }) => (
  <div className={`flex justify-between py-3 px-4 ${isTotal ? 'font-bold' : ''} ${className}`}>
    <span className="text-slate-600">{label}</span>
    <span>{value}</span>
  </div>
);

export const SalaryResult: React.FC<SalaryResultProps> = ({ currentSalary }) => {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-slate-700 mb-4">Remuneração Mensal Estimada</h2>
      <div className="space-y-2">
        <div className="bg-green-50 rounded-lg p-4 text-center">
            <p className="text-sm font-medium text-green-700">REMUNERAÇÃO BRUTA</p>
            <p className="text-3xl font-bold text-green-800">{formatCurrency(currentSalary.grossSalary)}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 text-center">
            <p className="text-sm font-medium text-blue-700">REMUNERAÇÃO LÍQUIDA</p>
            <p className="text-3xl font-bold text-blue-800">{formatCurrency(currentSalary.netSalary)}</p>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-slate-600 mb-2">Detalhamento</h3>
        <div className="border border-slate-200 rounded-lg divide-y divide-slate-200">
            <ResultRow label="Vencimento Básico" value={formatCurrency(currentSalary.baseSalary)} className="bg-slate-50/50" />
            <ResultRow label="GEPI" value={formatCurrency(currentSalary.gepi)} className="bg-slate-50/50" />
            <ResultRow label="Ajuda de Custo" value={formatCurrency(currentSalary.costAllowance)} className="bg-slate-50/50" />
            <ResultRow label="(-) Previdência" value={formatCurrency(currentSalary.pensionDeduction)} className="text-red-600" />
            <ResultRow label="(-) Imposto de Renda (IRRF)" value={formatCurrency(currentSalary.irrfDeduction)} className="text-red-600" />
            <ResultRow label="Total de Descontos" value={formatCurrency(currentSalary.totalDeductions)} className="font-semibold bg-red-50 text-red-700" isTotal={true}/>
        </div>
      </div>
    </div>
  );
};
