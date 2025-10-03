import React from 'react';

interface ToggleSwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    labelOn?: string;
    labelOff?: string;
    className?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, labelOn = '', labelOff = '', className = '' }) => {
    return (
        <label className={`flex items-center cursor-pointer select-none ${className}`}>
            <span className="mr-2 text-xs font-medium text-gray-600 dark:text-gray-300">{checked ? labelOn : labelOff}</span>
            <div className="relative">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={e => onChange(e.target.checked)}
                    className="sr-only"
                />
                <div className={`w-10 h-6 bg-gray-300 dark:bg-gray-700 rounded-full shadow-inner transition-colors duration-200 ${checked ? 'bg-primary-500' : ''}`}></div>
                <div className={`dot absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition transform duration-200 ${checked ? 'translate-x-4' : ''}`}></div>
            </div>
        </label>
    );
};

export default ToggleSwitch;
