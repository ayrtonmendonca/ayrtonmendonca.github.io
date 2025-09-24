
import React, { useState } from 'react';
import type { SalaryInput } from '../types';

interface SalaryFormProps {
  onCalculate: (inputs: SalaryInput) => void;
  isLoading: boolean;
}

export const SalaryForm: React.FC<SalaryFormProps> = ({ onCalculate, isLoading }) => {
  const currentYear = new Date().getFullYear();
  const [startYear, setStartYear] = useState<number>(currentYear);
  const [startMonth, setStartMonth] = useState<number>(1);
  const [hasDependents, setHasDependents] = useState<boolean>(false);
  const [dependentsCount, setDependentsCount] = useState<number>(0);
  const [costAllowanceDays, setCostAllowanceDays] = useState<number>(0);

  const handleDependentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setHasDependents(checked);
    if (!checked) {
      setDependentsCount(0);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate({
      startYear,
      startMonth,
      hasDependents,
      dependentsCount: hasDependents ? dependentsCount : 0,
      costAllowanceDays,
    });
  };

  const yearOptions = Array.from({ length: 40 }, (_, i) => currentYear - i);
  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md sticky top-8">
      <h2 className="text-2xl font-bold text-slate-700 mb-6">Parâmetros da Simulação</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">Data de Ingresso</label>
          <div className="grid grid-cols-2 gap-4">
            <select
              value={startMonth}
              onChange={(e) => setStartMonth(parseInt(e.target.value))}
              className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              {monthOptions.map(month => <option key={month} value={month}>{String(month).padStart(2, '0')}</option>)}
            </select>
            <select
              value={startYear}
              onChange={(e) => setStartYear(parseInt(e.target.value))}
              className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              {yearOptions.map(year => <option key={year} value={year}>{year}</option>)}
            </select>
          </div>
        </div>
        
        <div className="space-y-4">
            <div className="flex items-center">
              <input
                id="hasDependents"
                type="checkbox"
                checked={hasDependents}
                onChange={handleDependentsChange}
                className="h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor="hasDependents" className="ml-3 block text-sm font-medium text-slate-600">
                Possui dependentes de IR?
              </label>
            </div>
            
            {hasDependents && (
                <div>
                    <label htmlFor="dependentsCount" className="block text-sm font-medium text-slate-600 mb-2">Nº de Dependentes</label>
                    <input
                    id="dependentsCount"
                    type="number"
                    min="0"
                    value={dependentsCount}
                    onChange={(e) => setDependentsCount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
            )}
        </div>

        <div>
          <label htmlFor="costAllowanceDays" className="block text-sm font-medium text-slate-600 mb-2">Dias de Ajuda de Custo no Mês</label>
          <input
            id="costAllowanceDays"
            type="number"
            min="0"
            value={costAllowanceDays}
            onChange={(e) => setCostAllowanceDays(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Calculando...' : 'Calcular Remuneração'}
        </button>
      </form>
    </div>
  );
};
