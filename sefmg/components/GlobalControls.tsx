import React, { useState, useEffect } from 'react';
import { parametrosGlobais } from '../types';
import { POSICAO_CARREIRA, POSICAO_CARREIRA_PADRAO, ANO_INGRESSO_PADRAO, VALOR_PONTO_GEPI, TETO_SERVIDOR_PUBLICO, PERCENTUAL_PREVCOM_PADRAO, TETO_GEPI } from '../constants';
import Card from './ui/Card';
import Input from './ui/Input';
import Select from './ui/Select';

interface propriedadesControleGlobal {
    parametrosGlobais: parametrosGlobais;
    defineParametrosGlobais: (p: parametrosGlobais | ((p: parametrosGlobais) => parametrosGlobais)) => void;
}

const formatarNomePosicao = (position: string) => {
    const [nivel, grau] = position.split('-');
    return `Nível ${nivel} - Grau ${grau}`;
};

const parametrosGlobaisPadrao: parametrosGlobais = {
    posicaoCarreira: POSICAO_CARREIRA_PADRAO,
    anoIngresso: ANO_INGRESSO_PADRAO,
    valorPontoGEPI: VALOR_PONTO_GEPI,
    RGAMedio: 0,
    crescimentoGEPIMedio: 0,
    tetoGEPI: TETO_GEPI,
    tetoServidorPublico: TETO_SERVIDOR_PUBLICO,
    dependentes: 0,
    diasTrabalhados: 20,
    prevcom: true,
    percentualDeContribuicaoDaPrevcom: PERCENTUAL_PREVCOM_PADRAO,
    filiadoAoSindicato: false,
    anosProjecao: 35,
    ultimaPromocao: null,
    ultimaProgressao: null
};

const ControleGlobal: React.FC<propriedadesControleGlobal> = ({ parametrosGlobais, defineParametrosGlobais }) => {

    useEffect(() => {
        const salvos = localStorage.getItem("sef-mg-parametros-globais");
        if (salvos) {
            try {
                const obj = JSON.parse(salvos);
                defineParametrosGlobais({ ...parametrosGlobais, ...obj });
            } catch {
                console.warn("Erro ao carregar parametrosGlobais do localStorage");
                defineParametrosGlobais(parametrosGlobaisPadrao);
            }
        } else {
            // se não existe nada no localStorage, aplica os padrões
            defineParametrosGlobais(parametrosGlobaisPadrao);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Salvar no localStorage sempre que mudar
    useEffect(() => {
        localStorage.setItem("sef-mg-parametros-globais", JSON.stringify(parametrosGlobais));
    }, [parametrosGlobais]);

    if (!parametrosGlobais) {
        return <div>Carregando parâmetros globais...</div>;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            <Card className="lg:col-span-1">
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Parâmetros Globais</h3>

                {/* Grid de inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Select
                        label="Nível na Carreira"
                        id="posicaoCarreira"
                        value={parametrosGlobais.posicaoCarreira}
                        onChange={(e) => {
                            const novaPosicaoCarreira = e.target.value;
                            defineParametrosGlobais(p => ({ ...p, posicaoCarreira: novaPosicaoCarreira }));
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
                        value={parametrosGlobais.anoIngresso}
                        onChange={(e) => defineParametrosGlobais(p => ({ ...p, anoIngresso: parseInt(e.target.value) || 0 }))}
                    />

                    <Input
                        label="Valor do Ponto GEPI (R$)"
                        id="valorPontoGEPI"
                        type="number"
                        step="0.01"
                        prefix="R$"
                        value={parametrosGlobais.valorPontoGEPI}
                        onChange={(e) => defineParametrosGlobais(p => ({ ...p, valorPontoGEPI: parseFloat(e.target.value) || 0 }))}
                    />

                    <Input
                        label="Reajuste Geral Anual Médio (%)"
                        id="RGAMedio"
                        type="number"
                        value={parametrosGlobais.RGAMedio}
                        onChange={(e) => defineParametrosGlobais(p => ({ ...p, RGAMedio: parseFloat(e.target.value) || 0 }))}
                    />

                    <Input
                        label="Crescimento da GEPI Médio (%)"
                        id="crescimentoGEPIMedio"
                        type="number"
                        value={parametrosGlobais.crescimentoGEPIMedio}
                        onChange={(e) => defineParametrosGlobais(p => ({ ...p, crescimentoGEPIMedio: parseFloat(e.target.value) || 0 }))}
                    />

                    <Input
                        label="Teto da GEPI (× VB II-J)"
                        id="tetoGEPI"
                        type="number"
                        value={parametrosGlobais.tetoGEPI}
                        onChange={(e) => defineParametrosGlobais(p => ({ ...p, tetoGEPI: parseFloat(e.target.value) || 0 }))}
                    />

                    <Input
                        label="Teto do Servidor Público"
                        id="tetoServidorPublico"
                        type="number"
                        step="0.01"
                        prefix="R$"
                        value={parametrosGlobais.tetoServidorPublico}
                        onChange={(e) => defineParametrosGlobais(p => ({ ...p, tetoServidorPublico: parseFloat(e.target.value) || 0 }))}
                    />

                    <Input
                        label="Dependentes de IR"
                        id="dependentes"
                        type="number"
                        min="0"
                        value={parametrosGlobais.dependentes}
                        onChange={(e) => defineParametrosGlobais(p => ({ ...p, dependentes: parseInt(e.target.value) || 0 }))}
                    />

                    <Input
                        label="Dias Trabalhados (Ajuda de Custo)"
                        id="diasTrabalhados"
                        type="number"
                        min="0"
                        value={parametrosGlobais.diasTrabalhados}
                        onChange={(e) => defineParametrosGlobais(p => ({ ...p, diasTrabalhados: parseInt(e.target.value) || 0 }))}
                    />


                    {/* Caixas especiais continuam full width */}
                    <div className="space-y-2 rounded-md border border-gray-200 dark:border-gray-700 p-3">
                        <div className="flex items-center space-x-2">
                            {/* Primeiro terço: PREVCOM + % de contribuição */}

                            <input
                                type="checkbox"
                                id="prevcom"
                                checked={parametrosGlobais.prevcom}
                                onChange={(e) => defineParametrosGlobais(p => ({ ...p, prevcom: e.target.checked }))}
                                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <label htmlFor="prevcom" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Associado à PREVCOM-MG
                            </label>
                        </div>
                        {parametrosGlobais.prevcom && (
                            <Input
                                label="Participação PREVCOM (%)"
                                id="prevcomPercentage"
                                type="number"
                                step="0.01"
                                value={parametrosGlobais.percentualDeContribuicaoDaPrevcom}
                                onChange={(e) => defineParametrosGlobais(p => ({
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
                                checked={parametrosGlobais.filiadoAoSindicato}
                                onChange={(e) => defineParametrosGlobais(p => ({
                                    ...p, filiadoAoSindicato: e.target.checked || false
                                }))}
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
                        value={parametrosGlobais.anosProjecao}
                        onChange={(e) => defineParametrosGlobais(p => ({
                            ...p,
                            anosProjecao: parseInt(e.target.value) || 0
                        }))}
                        className="w-24"
                    />
                </div>
            </Card >
        </div >
    );
};

export default ControleGlobal;