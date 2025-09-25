import React from 'react';
import { Scenario } from '../types';
import Card from './ui/Card';
import Select from './ui/Select';

interface DetailsSelectorProps {
    scenarios: Scenario[];
    projectionYears: number;
    selectedScenarioId: string | null;
    setSelectedScenarioId: (id: string) => void;
    selectedYear: number;
    setSelectedYear: (year: number) => void;
}

const DetailsSelector: React.FC<DetailsSelectorProps> = ({
    scenarios,
    projectionYears,
    selectedScenarioId,
    setSelectedScenarioId,
    selectedYear,
    setSelectedYear,
}) => {
    const startYear = new Date().getFullYear();
    const availableYears = Array.from({ length: projectionYears }, (_, i) => startYear + i);

    return (
        <Card>
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Ver Detalhes do Cálculo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                    label="Cenário"
                    id="details-scenario"
                    value={selectedScenarioId || ''}
                    onChange={(e) => setSelectedScenarioId(e.target.value)}
                    disabled={scenarios.length === 0}
                    aria-label="Selecionar cenário para detalhes"
                >
                    {scenarios.map((s) => (
                        <option key={s.id} value={s.id}>
                            {s.name}
                        </option>
                    ))}
                </Select>
                <Select
                    label="Ano"
                    id="details-year"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    aria-label="Selecionar ano para detalhes"
                >
                    {availableYears.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </Select>
            </div>
        </Card>
    );
};

export default DetailsSelector;
