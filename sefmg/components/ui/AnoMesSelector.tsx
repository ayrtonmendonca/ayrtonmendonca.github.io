import React from 'react';

interface AnoMesProps {
  label: string;
  ano: number;
  mes: number;
  onChange: (ano: number, mes: number) => void;
  minAno?: number;
  maxAno?: number;
  idAno?: string;
  idMes?: string;
}

const meses = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const AnoMesSelector: React.FC<AnoMesProps> = ({ label, ano, mes, onChange, minAno, maxAno, idAno, idMes }) => {
  return (
    <div className="flex flex-col">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <div className="flex gap-2">
        <input
          type="number"
          id={idAno}
          min={minAno}
          max={maxAno}
          value={ano}
          onChange={e => onChange(parseInt(e.target.value) || minAno || 0, mes)}
          className="block w-24 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
        />
        <select
          id={idMes}
          value={mes}
          onChange={e => onChange(ano, parseInt(e.target.value))}
          className="block w-32 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
        >
          {meses.map((m, i) => (
            <option key={i} value={i + 1}>{m}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default AnoMesSelector;
