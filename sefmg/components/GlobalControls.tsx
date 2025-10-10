import React, { useState, useEffect } from 'react';
import { parametrosGlobais } from '../types';
import { POSICAO_CARREIRA, POSICAO_CARREIRA_PADRAO, ANO_INGRESSO_PADRAO, VALOR_PONTO_GEPI, TETO_SERVIDOR_PUBLICO, PERCENTUAL_PREVCOM_PADRAO, TETO_GEPI, CRESCIMENTO_GEPI_MEDIO_PADRAO, INFLACAO_MEDIA_PADRAO } from '../constants';
import Card from './ui/Card';
import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';

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
    crescimentoGEPIMedio: CRESCIMENTO_GEPI_MEDIO_PADRAO,
    tetoGEPI: TETO_GEPI,
    tetoServidorPublico: TETO_SERVIDOR_PUBLICO,
    dependentes: 0,
    diasTrabalhados: 20,
    prevcom: true,
    percentualDeContribuicaoDaPrevcom: PERCENTUAL_PREVCOM_PADRAO,
    filiadoAoSindicato: false,
    anosProjecao: 35,
    ultimaPromocao: ANO_INGRESSO_PADRAO,
    ultimaProgressao: ANO_INGRESSO_PADRAO,
    inflacaoMedia: INFLACAO_MEDIA_PADRAO
};

const ControleGlobal: React.FC<propriedadesControleGlobal> = ({ parametrosGlobais, defineParametrosGlobais }) => {

    useEffect(() => {
        const salvos = localStorage.getItem("sef-mg-parametros-globais");
        if (salvos) {
            try {
                const obj = JSON.parse(salvos);
                // Merge profundo: para cada campo, se não existir em obj, usa o padrão
                const merged = { ...parametrosGlobaisPadrao, ...obj };
                defineParametrosGlobais(merged);
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
                <div className="flex flex-col gap-1 mb-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Parâmetros Globais</h3>
                        <Button
                            type="button"
                            variant="secondary"
                            className="text-xs px-3 py-1"
                            onClick={e => {
                                defineParametrosGlobais(parametrosGlobaisPadrao);
                                if (e && e.currentTarget) e.currentTarget.blur();
                            }}
                            title="Reiniciar para os valores padrão"
                        >
                            Reiniciar Parâmetros
                        </Button>
                    </div>
                </div>
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
                        label="Ano/Mês de Ingresso"
                        id="anoMesIngresso"
                        type="month"
                        min="1950-01"
                        max={`${new Date().getFullYear()}-12`}
                        value={`${parametrosGlobais.anoIngresso?.toString().padStart(4, '0')}-${(parametrosGlobais.mesIngresso ?? 1).toString().padStart(2, '0')}`}
                        onChange={e => {
                            const [anoStr, mesStr] = e.target.value.split('-');
                            defineParametrosGlobais(p => ({ ...p, anoIngresso: parseInt(anoStr), mesIngresso: parseInt(mesStr) }));
                        }}
                    />

                    <Input
                        label="Ano/Mês da Última Promoção"
                        id="anoMesUltimaPromocao"
                        type="month"
                        min={`${parametrosGlobais.anoIngresso?.toString().padStart(4, '0')}-01`}
                        max={`${new Date().getFullYear()}-12`}
                        value={`${(parametrosGlobais.ultimaPromocao ?? parametrosGlobais.anoIngresso)?.toString().padStart(4, '0')}-${(parametrosGlobais.mesUltimaPromocao ?? parametrosGlobais.mesIngresso ?? 1).toString().padStart(2, '0')}`}
                        onChange={e => {
                            const [anoStr, mesStr] = e.target.value.split('-');
                            defineParametrosGlobais(p => ({ ...p, ultimaPromocao: parseInt(anoStr), mesUltimaPromocao: parseInt(mesStr) }));
                        }}
                    />

                    <Input
                        label="Ano/Mês da Última Progressão"
                        id="anoMesUltimaProgressao"
                        type="month"
                        min={`${parametrosGlobais.anoIngresso?.toString().padStart(4, '0')}-01`}
                        max={`${new Date().getFullYear()}-12`}
                        value={`${(parametrosGlobais.ultimaProgressao ?? parametrosGlobais.anoIngresso)?.toString().padStart(4, '0')}-${(parametrosGlobais.mesUltimaProgressao ?? parametrosGlobais.mesIngresso ?? 1).toString().padStart(2, '0')}`}
                        onChange={e => {
                            const [anoStr, mesStr] = e.target.value.split('-');
                            defineParametrosGlobais(p => ({ ...p, ultimaProgressao: parseInt(anoStr), mesUltimaProgressao: parseInt(mesStr) }));
                        }}
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
                        label="Inflação Anual Média (%)"
                        id="inflacaoMedia"
                        type="number"
                        step="0.01"
                        min="0"
                        value={parametrosGlobais.inflacaoMedia}
                        onChange={(e) => defineParametrosGlobais(p => ({ ...p, inflacaoMedia: parseFloat(e.target.value) || 0 }))}
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
                <span className="block text-xs text-red-700 dark:text-red-300 mt-1">
                    Obs: Para efeitos de simulação, o Teto de Servidor Público e as faixas de desconto do IR e do RPPS são atualizados anualmente pela inflação.
                </span>
            </Card >
        </div >
    );
};

export default ControleGlobal;