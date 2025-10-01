
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  prefix?: string; // 👈 novo
}

const Input: React.FC<InputProps> = ({ label, prefix, ...props }) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-sm">
            {prefix}
          </span>
        )}
        <input
          {...props}
          className={`block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm
            ${prefix ? "pl-9" : "pl-3"}`} // 👈 espaço pro prefixo
        />
      </div>
    </div>
  );
};

export default Input;