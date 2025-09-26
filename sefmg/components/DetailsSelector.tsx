import React from 'react';
import { Cenario } from '../types';
import Card from './ui/Card';
import Select from './ui/Select';

interface DetailsSelectorProps {
    cenarios: Cenario[];
    anosProjecao: number;
    cenarioSelecionadoID: string | null;
    defineCenarioSelecionadoID: (id: string) => void;
    anoSelecionado: number;
    defineAnoSelecionado: (year: number) => void;
}

const DetailsSelector: React.FC<DetailsSelectorProps> = ({
    cenarios,
    anosProjecao,
    cenarioSelecionadoID,
    defineCenarioSelecionadoID,
    anoSelecionado,
    defineAnoSelecionado,
}) => {
    const startYear = new Date().getFullYear();
    const availableYears = Array.from({ length: anosProjecao }, (_, i) => startYear + i);

    return (
        <Card>
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Ver Detalhes do Cálculo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                    label="Cenário"
                    id="details-cenario"
                    value={cenarioSelecionadoID || ''}
                    onChange={(e) => defineCenarioSelecionadoID(e.target.value)}
                    disabled={cenarios.length === 0}
                    aria-label="Selecionar cenário para detalhes"
                >
                    {cenarios.map((s) => (
                        <option key={s.id} value={s.id}>
                            {s.name}
                        </option>
                    ))}
                </Select>
                <Select
                    label="Ano"
                    id="details-year"
                    value={anoSelecionado}
                    onChange={(e) => defineAnoSelecionado(parseInt(e.target.value))}
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
