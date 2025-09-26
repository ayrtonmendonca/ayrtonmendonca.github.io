import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Cenario, parametrosDeCenario } from '../types';
import { PALETA_DE_CORES, POSICAO_CARREIRA, VENCIMENTO_BASICO, PONTOS_GEPI, VALOR_PONTO_GEPI, VALOR_DIARIO_VI, PERCENTUAL_PREVCOM_PADRAO, NIVEL_PADRAO } from '../constants';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';

interface propriedadesControleCenario {
    cenarios: Cenario[];
    addCenario: (cenario: Cenario) => void;
    updateCenario: (cenario: Cenario) => void;
    removeCenario: (id: string) => void;
    anosProjecao: number;
    defineAnosProjecao: (years: number) => void;
}

const formatPositionName = (position: string) => {
    const [nivel, grau] = position.split('-');
    return `Nível ${nivel} - Grau ${grau}`;
};

const ControleCenario : React.FC<propriedadesControleCenario> = ({ cenarios, addCenario, updateCenario, removeCenario, anosProjecao, defineAnosProjecao }) => {
    const [estaEditando, defineEstaEditando] = useState<string | null>(null);
    const [parametrosAtuais, defineParametrosAtuais] = useState<parametrosDeCenario>({
        posicaoCarreira: NIVEL_PADRAO,
        dependentes: 0,
        diasTrabalhados: 20,
        ajusteDeSalario: 0,
        valorVIDiaria: VALOR_DIARIO_VI,
        salarioBaseSobreposto: VENCIMENTO_BASICO[NIVEL_PADRAO],
        pontosGEPI: PONTOS_GEPI,
        valorPontoGEPI: VALOR_PONTO_GEPI,
        filiadoAoSindicato: true,
        prevcom: true,
        percentualDeContribuicaoDaPrevcom: PERCENTUAL_PREVCOM_PADRAO,
    });
    const [nomeCenario, defineNomeCenario] = useState('Novo Cenário');
    
    const calculaProximaCor = useCallback(() => {
        return PALETA_DE_CORES[cenarios.length % PALETA_DE_CORES.length];
    }, [cenarios.length]);

    useEffect(() => {
        if (!estaEditando) {
             defineNomeCenario(`Cenário ${cenarios.length + 1}`);
        }
    }, [cenarios.length, estaEditando]);


    const handleSave = () => {
        if (estaEditando) {
            const cenarioToUpdate = cenarios.find(s => s.id === estaEditando);
            if(cenarioToUpdate) {
                updateCenario({ ...cenarioToUpdate, name: nomeCenario, parametros: parametrosAtuais });
            }
        } else {
            addCenario({
                id: uuidv4(),
                nome: nomeCenario,
                cor: calculaProximaCor(),
                parametros: parametrosAtuais,
            });
        }
        resetForm();
    };

    const resetForm = () => {
        defineEstaEditando(null);
        defineNomeCenario('');
        defineParametrosAtuais({
            posicaoCarreira: NIVEL_PADRAO,
            dependentes: 0,
            diasTrabalhados: 20,
            ajusteDeSalario: 0,
            valorVIDiaria: VALOR_DIARIO_VI,
            salarioBaseSobreposto: VENCIMENTO_BASICO[NIVEL_PADRAO],
            pontosGEPI: PONTOS_GEPI,
            valorPontoGEPI: VALOR_PONTO_GEPI,
            filiadoAoSindicato: true,
            prevcom: true,
            percentualDeContribuicaoDaPrevcom: PERCENTUAL_PREVCOM_PADRAO,
        });
    };

    const handleEdit = (cenario: Cenario) => {
        defineEstaEditando(cenario.id);
        defineNomeCenario(cenario.nome);
        defineParametrosAtuais(cenario.parametros);
    };

    const handleCancelEdit = () => {
        resetForm();
    };

    console.log(parametrosAtuais);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">{estaEditando ? 'Editar Cenário' : 'Adicionar Cenário'}</h3>
                <div className="space-y-4">
                    <Input label="Nome do Cenário" id="nomeCenario" value={nomeCenario} onChange={(e) => defineNomeCenario(e.target.value)} />
                    <Select label="Nível na Carreira" id="posicaoCarreira" value={parametrosAtuais.posicaoCarreira} onChange={(e) => {
                        const novaPosicaoCarreira = e.target.value;
                        defineParametrosAtuais(p => ({
                            ...p,
                            posicaoCarreira: novaPosicaoCarreira,
                            salarioBaseSobreposto: VENCIMENTO_BASICO[novaPosicaoCarreira] || 0
                        }));
                    }}>
                        {POSICAO_CARREIRA.map(position => <option key={position} value={position}>{formatPositionName(position)}</option>)}
                    </Select>
                    <Input label="Vencimento Básico (R$)" id="salarioBaseSobreposto" type="number" step="0.01" value={parametrosAtuais.salarioBaseSobreposto} onChange={(e) => defineParametrosAtuais(p => ({ ...p, salarioBaseSobreposto: parseFloat(e.target.value) || 0 }))} />
                    <Input label="Pontos GEPI" id="pontosGEPI" type="number" value={parametrosAtuais.pontosGEPI} onChange={(e) => defineParametrosAtuais(p => ({ ...p, pontosGEPI: parseFloat(e.target.value) || 0 }))} />
                    <Input label="Valor do Ponto GEPI (R$)" id="valorPontoGEPI" type="number" step="0.01" value={parametrosAtuais.valorPontoGEPI} onChange={(e) => defineParametrosAtuais(p => ({ ...p, valorPontoGEPI: parseFloat(e.target.value) || 0 }))} />
                    <Input label="Reajuste Geral Único (%)" id="ajusteDeSalario" type="number" value={parametrosAtuais.ajusteDeSalario} onChange={(e) => defineParametrosAtuais(p => ({ ...p, ajusteDeSalario: parseFloat(e.target.value) || 0 }))} />
                    <Input label="Dependentes de IR" id="dependentes" type="number" min="0" value={parametrosAtuais.dependentes} onChange={(e) => defineParametrosAtuais(p => ({ ...p, dependentes: parseInt(e.target.value) || 0 }))} />
                    <Input label="Dias Trabalhados (Ajuda de Custo)" id="diasTrabalhados" type="number" min="0" value={parametrosAtuais.diasTrabalhados} onChange={(e) => defineParametrosAtuais(p => ({ ...p, diasTrabalhados: parseInt(e.target.value) || 0 }))} />
                    <Input label="Valor Diário VI (R$)" id="valorVIDiaria" type="number" step="0.01" value={parametrosAtuais.valorVIDiaria} onChange={(e) => defineParametrosAtuais(p => ({ ...p, valorVIDiaria: parseFloat(e.target.value) || 0 }))} />
                     <div className="space-y-2 rounded-md border border-gray-200 dark:border-gray-700 p-3">
                        <div className="flex items-center space-x-2">
                           <input
                                type="checkbox"
                                id="prevcom"
                                checked={parametrosAtuais.prevcom}
                                onChange={(e) => defineParametrosAtuais(p => ({ ...p, prevcom: e.target.checked }))}
                                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <label htmlFor="prevcom" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Associado à PREVCOM-MG
                            </label>
                        </div>
                        {parametrosAtuais.prevcom && (
                            <Input 
                                label="Participação PREVCOM (%)" 
                                id="prevcomPercentage" 
                                type="number" 
                                step="0.01"
                                value={parametrosAtuais.percentualDeContribuicaoDaPrevcom} 
                                onChange={(e) => defineParametrosAtuais(p => ({ ...p, percentualDeContribuicaoDaPrevcom: parseFloat(e.target.value) || 0 }))}
                             />
                        )}
                    </div>
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="filiadoAoSindicato"
                            checked={parametrosAtuais.filiadoAoSindicato}
                            onChange={(e) => defineParametrosAtuais(p => ({ ...p, filiadoAoSindicato: e.target.checked }))}
                            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <label htmlFor="filiadoAoSindicato" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Filiado ao SINDIFISCO (desconto 1%)
                        </label>
                    </div>
                    <div className="flex space-x-2">
                        <Button onClick={handleSave}>{estaEditando ? 'Salvar Alterações' : 'Adicionar Cenário'}</Button>
                        {estaEditando && <Button variant="secondary" onClick={handleCancelEdit}>Cancelar</Button>}
                    </div>
                </div>
            </Card>
            <Card className="lg:col-span-2">
                <div className="flex justify-between items-center mb-4">
                     <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Cenários Ativos</h3>
                     <div className='flex items-center space-x-2'>
                        <label htmlFor="anosProjecao" className="text-sm font-medium">Anos de Projeção:</label>
                        <Input id="anosProjecao" type="number" min="1" max="50" value={anosProjecao} onChange={(e) => defineAnosProjecao(parseInt(e.target.value))} className="w-20" label=''/>
                     </div>
                </div>
                <ul className="space-y-3">
                    {cenarios.map(s => (
                        <li key={s.id} className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <div className="flex items-center">
                                <span className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: s.cor }}></span>
                                <span className="font-semibold">{s.name}</span>
                            </div>
                            <div className="space-x-2">
                                <Button onClick={() => handleEdit(s)} className="px-2 py-1 text-xs">Editar</Button>
                                {cenarios.length > 1 && <Button variant="danger" onClick={() => removeCenario(s.id)} className="px-2 py-1 text-xs">Remover</Button>}
                            </div>
                        </li>
                    ))}
                </ul>
            </Card>
        </div>
    );
};

export default ControleCenario ;