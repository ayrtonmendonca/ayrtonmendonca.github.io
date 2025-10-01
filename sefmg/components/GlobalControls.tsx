import React, { useState } from 'react';
import { Cenario, parametrosGlobais } from '../types';
import { POSICAO_CARREIRA, VENCIMENTO_BASICO, PONTOS_GEPI, VALOR_PONTO_GEPI, VALOR_DIARIO_VI, PERCENTUAL_PREVCOM_PADRAO, NIVEL_PADRAO, TETO_GEPI, TETO_SERVIDOR_PUBLICO, ANO_INGRESSO_PADRAO } from '../constants';
import Card from './ui/Card';
import Input from './ui/Input';
import Select from './ui/Select';

interface propriedadesControleGlobal {
    cenarios: Cenario[];
    adicionarCenario: (cenario: Cenario) => void;
    atualizarCenario: (cenario: Cenario) => void;
    removeCenario: (id: string) => void;
    anosProjecao: number;
    defineAnosProjecao: (years: number) => void;
}

const formatarNomePosicao = (position: string) => {
    const [nivel, grau] = position.split('-');
    return `Nível ${nivel} - Grau ${grau}`;
};

const ControleGlobal: React.FC<propriedadesControleGlobal> = ({ cenarios, adicionarCenario, atualizarCenario, removeCenario, anosProjecao, defineAnosProjecao }) => {

    const [parametrosGlobaisAtuais, defineParametrosGlobaisAtuais] = useState<parametrosGlobais>({
        posicaoCarreira: NIVEL_PADRAO,
        anoIngresso: ANO_INGRESSO_PADRAO,
        dependentes: 0,
        diasTrabalhados: 20,
        RGAMedio: 0,
        crescimentoGEPIMedio: 0,
        tetoGEPI: TETO_GEPI,
        tetoServidorPublico: TETO_SERVIDOR_PUBLICO,
        filiadoAoSindicato: true,
        prevcom: true,
        percentualDeContribuicaoDaPrevcom: PERCENTUAL_PREVCOM_PADRAO,
    });

    return (
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            <Card className="lg:col-span-1">
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Parâmetros Globais</h3>

                {/* Grid de inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Select
                        label="Nível na Carreira"
                        id="posicaoCarreira"
                        value={parametrosGlobaisAtuais.posicaoCarreira}
                        onChange={(e) => {
                            const novaPosicaoCarreira = e.target.value;
                            defineParametrosGlobaisAtuais(p => ({
                                ...p,
                                posicaoCarreira: novaPosicaoCarreira,
                                salarioBaseSobreposto: VENCIMENTO_BASICO.calcularVB(novaPosicaoCarreira) || 0
                            }));
                        }}
                    >
                        {POSICAO_CARREIRA.map(position => (
                            <option key={position} value={position}>{formatarNomePosicao(position)}</option>
                        ))}
                    </Select>

                    <Input
                        label="Ano de Ingresso"
                        id="anoIngresso"
                        type="number"
                        min="0"
                        value={parametrosGlobaisAtuais.anoIngresso}
                        onChange={(e) => defineParametrosGlobaisAtuais(p => ({ ...p, anoIngresso: parseInt(e.target.value) || 0 }))}
                    />

                    <Input
                        label="Valor do Ponto GEPI (R$)"
                        id="valorPontoGEPI"
                        type="number"
                        step="0.01"
                        prefix="R$"
                        value={parametrosGlobaisAtuais.valorPontoGEPI}
                        onChange={(e) => defineParametrosGlobaisAtuais(p => ({ ...p, valorPontoGEPI: parseFloat(e.target.value) || 0 }))}
                    />

                    <Input
                        label="Reajuste Geral Anual Médio (%)"
                        id="RGAMedio"
                        type="number"
                        value={parametrosGlobaisAtuais.RGAMedio}
                        onChange={(e) => defineParametrosGlobaisAtuais(p => ({ ...p, RGAMedio: parseFloat(e.target.value) || 0 }))}
                    />

                    <Input
                        label="Crescimento da GEPI Médio (%)"
                        id="crescimentoGEPIMedio"
                        type="number"
                        value={parametrosGlobaisAtuais.crescimentoGEPIMedio}
                        onChange={(e) => defineParametrosGlobaisAtuais(p => ({ ...p, crescimentoGEPIMedio: parseFloat(e.target.value) || 0 }))}
                    />

                    <Input
                        label="Teto da GEPI (× VB II-J)"
                        id="tetoGEPI"
                        type="number"
                        value={parametrosGlobaisAtuais.tetoGEPI}
                        onChange={(e) => defineParametrosGlobaisAtuais(p => ({ ...p, tetoGEPI: parseFloat(e.target.value) || 0 }))}
                    />

                    <Input
                        label="Teto do Servidor Público"
                        id="tetoServidorPublico"
                        type="number"
                        step="0.01"
                        prefix="R$"
                        value={parametrosGlobaisAtuais.tetoServidorPublico}
                        onChange={(e) => defineParametrosGlobaisAtuais(p => ({ ...p, tetoServidorPublico: parseFloat(e.target.value) || 0 }))}
                    />

                    <Input
                        label="Dependentes de IR"
                        id="dependentes"
                        type="number"
                        min="0"
                        value={parametrosGlobaisAtuais.dependentes}
                        onChange={(e) => defineParametrosGlobaisAtuais(p => ({ ...p, dependentes: parseInt(e.target.value) || 0 }))}
                    />

                    <Input
                        label="Dias Trabalhados (Ajuda de Custo)"
                        id="diasTrabalhados"
                        type="number"
                        min="0"
                        value={parametrosGlobaisAtuais.diasTrabalhados}
                        onChange={(e) => defineParametrosGlobaisAtuais(p => ({ ...p, diasTrabalhados: parseInt(e.target.value) || 0 }))}
                    />


                    {/* Caixas especiais continuam full width */}
                    <div className="space-y-2 rounded-md border border-gray-200 dark:border-gray-700 p-3">
                        <div className="flex items-center space-x-2">
                            {/* Primeiro terço: PREVCOM + % de contribuição */}

                            <input
                                type="checkbox"
                                id="prevcom"
                                checked={parametrosGlobaisAtuais.prevcom}
                                onChange={(e) => defineParametrosGlobaisAtuais(p => ({ ...p, prevcom: e.target.checked }))}
                                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <label htmlFor="prevcom" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Associado à PREVCOM-MG
                            </label>
                        </div>
                        {parametrosGlobaisAtuais.prevcom && (
                            <Input
                                label="Participação PREVCOM (%)"
                                id="prevcomPercentage"
                                type="number"
                                step="0.01"
                                value={parametrosGlobaisAtuais.percentualDeContribuicaoDaPrevcom}
                                onChange={(e) => defineParametrosGlobaisAtuais(p => ({
                                    ...p,
                                    percentualDeContribuicaoDaPrevcom: parseFloat(e.target.value) || 0
                                }))}
                                className="w-24"
                            />
                        )}
                    </div>

                    {/* Segundo terço: SINDIFISCO */}
                    <div className="flex-1 flex items-center justify-center">
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="filiadoAoSindicato"
                                checked={parametrosGlobaisAtuais.filiadoAoSindicato}
                                onChange={(e) => defineParametrosGlobaisAtuais(p => ({ ...p, filiadoAoSindicato: e.target.checked }))}
                                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <label htmlFor="filiadoAoSindicato" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Filiado ao SINDIFISCO
                            </label>
                        </div>
                    </div>

                    {/* Terceiro terço: Anos de Projeção */}
                    <Input
                        label="Anos de Projeção"
                        id="anosProjecao"
                        type="number"
                        min="1"
                        value={anosProjecao}
                        onChange={(e) => defineAnosProjecao(parseInt(e.target.value) || 0)}
                        className="w-24"
                    />
                </div>
            </Card >
        </div >
    );
};

export default ControleGlobal;