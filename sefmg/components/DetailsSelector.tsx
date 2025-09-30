import React from 'react';
import { Cenario } from '../types';
import Card from './ui/Card';
import Select from './ui/Select';

interface SelecionadorDetalhesPropriedades {
    cenarios: Cenario[];
    anosProjecao: number;
    cenarioSelecionadoID: string | null;
    defineCenarioSelecionadoID: (id: string) => void;
    anoSelecionado: number;
    defineAnoSelecionado: (year: number) => void;
}

const SelecionadorDetalhes: React.FC<SelecionadorDetalhesPropriedades> = ({
    cenarios,
    anosProjecao,
    cenarioSelecionadoID,
    defineCenarioSelecionadoID,
    anoSelecionado,
    defineAnoSelecionado,
}) => {
    const anoInicio = new Date().getFullYear();
    const anosDisponiveis = Array.from({ length: anosProjecao }, (_, i) => anoInicio + i);

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
                            {s.nome}
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
                    {anosDisponiveis.map((ano) => (
                        <option key={ano} value={ano}>
                            {ano}
                        </option>
                    ))}
                </Select>
            </div>
        </Card>
    );
};

export default SelecionadorDetalhes;
