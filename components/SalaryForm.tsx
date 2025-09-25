
import React, { useState } from 'react';
import { SimulationInput } from '../types';

interface SalaryFormProps {
  onCalculate: (inputs: SimulationInput) => void;
}

export const SalaryForm: React.FC<SalaryFormProps> = ({ onCalculate }) => {
  const currentYear = new Date().getFullYear();
  const [startYear, setStartYear] = useState<number>(currentYear - 5);
  const [startMonth, setStartMonth] = useState<number>(6);
  const [dependents, setDependents] = useState<number>(0);
  const [allowanceDays, setAllowanceDays] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate({ startYear, startMonth, dependents, allowanceDays });
  };

  const years = Array.from({ length: 40 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md sticky top-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Simulador de Remuneração</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">Data de Ingresso</label>
          <div className="flex space-x-2">
            <select
              id="startMonth"
              value={startMonth}
              onChange={(e) => setStartMonth(Number(e.target.value))}
              className="w-full mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              {months.map(month => <option key={month} value={month}>{month.toString().padStart(2, '0')}</option>)}
            </select>
            <select
              id="startYear"
              value={startYear}
              onChange={(e) => setStartYear(Number(e.target.value))}
              className="w-full mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              {years.map(year => <option key={year} value={year}>{year}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="dependents" className="block text-sm font-medium text-gray-700 mb-1">Dependentes (para IR)</label>
          <input
            type="number"
            id="dependents"
            value={dependents}
            onChange={(e) => setDependents(Math.max(0, Number(e.target.value)))}
            min="0"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="allowanceDays" className="block text-sm font-medium text-gray-700 mb-1">Dias de Ajuda de Custo (mês)</label>
          <input
            type="number"
            id="allowanceDays"
            value={allowanceDays}
            onChange={(e) => setAllowanceDays(Math.max(0, Number(e.target.value)))}
            min="0"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Simular
        </button>
      </form>
    </div>
  );
};
