import React from 'react';

interface CalendarAnoMesProps {
  label: string;
  ano: number;
  mes: number;
  onChange: (ano: number, mes: number) => void;
  minAno?: number;
  maxAno?: number;
  id?: string;
}

const CalendarAnoMes: React.FC<CalendarAnoMesProps> = ({ label, ano, mes, onChange, minAno = 1950, maxAno = new Date().getFullYear(), id }) => {
  const value = `${ano.toString().padStart(4, '0')}-${mes.toString().padStart(2, '0')}`;
  const min = `${minAno.toString().padStart(4, '0')}-01`;
  const max = `${maxAno.toString().padStart(4, '0')}-12`;
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <input
        type="month"
        id={id}
        value={value}
        min={min}
        max={max}
        onChange={e => {
          const [anoStr, mesStr] = e.target.value.split('-');
          onChange(parseInt(anoStr), parseInt(mesStr));
        }}
        className="block w-40 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
      />
    </div>
  );
};

