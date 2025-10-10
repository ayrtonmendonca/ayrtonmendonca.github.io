import React from 'react';
import { Cenario, parametrosGlobais } from '../types';
import Card from './ui/Card';
import Select from './ui/Select';

interface SelecionadorDetalhesPropriedades {
    cenarios: Cenario[];
    parametrosGlobais: parametrosGlobais;
    cenarioSelecionadoID: string | null;
    defineCenarioSelecionadoID: (id: string) => void;
    anoSelecionado: { ano: number, mes: number };
    defineAnoSelecionado: (anoMes: { ano: number, mes: number }) => void;
}

const SelecionadorDetalhes: React.FC<SelecionadorDetalhesPropriedades> = ({
    cenarios,
    parametrosGlobais,
    cenarioSelecionadoID,
    defineCenarioSelecionadoID,
    anoSelecionado,
    defineAnoSelecionado,
}) => {
    // console.log(parametrosGlobais);
    // Novo: selecionador de ano/mês
    const anoAtual = new Date().getFullYear();
    const mesAtual = (new Date().getMonth() + 1).toString().padStart(2, '0');
    // Estado para ano/mês selecionado
    const valorMes = `${anoSelecionado.ano.toString().padStart(4, '0')}-${anoSelecionado.mes.toString().padStart(2, '0')}`;

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
                <input
                    type="month"
                    id="details-month"
                    value={valorMes}
                    min="1950-01"
                    max={`${anoAtual + parametrosGlobais.anosProjecao - 1}-12`}
                    onChange={e => {
                        const [ano, mes] = e.target.value.split('-');
                        defineAnoSelecionado({ ano: parseInt(ano), mes: parseInt(mes) });
                    }}
                    className="border rounded px-2 py-1"
                    aria-label="Selecionar ano e mês para detalhes"
                />
            </div>
        </Card>
    );
};

export default SelecionadorDetalhes;
