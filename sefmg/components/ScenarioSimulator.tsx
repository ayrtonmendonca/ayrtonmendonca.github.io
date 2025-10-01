import React, { useState, useMemo, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { dadosGrafico, Cenario, dadosAnuais, parametrosDeCenario } from '../types';
import {
    ANOS_DE_PROJECAO, PALETA_DE_CORES, POSICAO_CARREIRA, VENCIMENTO_BASICO, PONTOS_GEPI, VALOR_PONTO_GEPI, VALOR_DIARIO_VI, PERCENTUAL_PREVCOM_PADRAO,
    ANO_INGRESSO_PADRAO, ULTIMA_PROGRESSAO_PADRAO, ULTIMA_PROMOCAO_PADRAO, NIVEL_PADRAO,
    TETO_SERVIDOR_PUBLICO,
    TETO_GEPI
} from '../constants';
import { calcularProjecaoAnual } from '../services/remunerationCalculator';
import useLocalStorage from '../hooks/useLocalStorage';
import ControleGlobal from './GlobalControls';
import ControleCenario from './ScenarioControls';
import GraficoRemuneracao from './RemunerationChart';
import DetalhesCalculo from './CalculationDetails';
import SelecionadorDetalhes from './DetailsSelector';
import Card from './ui/Card';

const simuladorCenario: React.FC = () => {
    const [cenarios, defineCenarios] = useLocalStorage<Cenario[]>('sef-mg-cenarios', []);
    const [anosProjecao, defineAnosProjecao] = useLocalStorage<number>('sef-mg-anos-projecao', ANOS_DE_PROJECAO);
    const [anoSelecionado, defineAnoSelecionado] = useState<number>(new Date().getFullYear());
    const [cenarioSelecionadoID, defineCenarioSelecionadoID] = useState<string | null>(null);

    // This effect runs ONCE on mount to sanitize data from localStorage, ensuring compatibility with the current app version.
    useEffect(() => {
        if (cenarios.length > 0) {
            let precisaAtualizar = false;
            const cenariosHigienizados = cenarios.map(s => {
                // FIX: Explicitly type `parametrosCenarioAtuais` to handle cases where `s.parametros` might be missing from old localStorage data,
                // and handle migration from old data structure with `gepiAdjustment`.
                const parametrosCenarioAtuais: Partial<parametrosDeCenario> & { gepiAdjustment?: number } = s.parametros || {};


                const parametrosMigrados: parametrosDeCenario = {
                    posicaoCarreira: parametrosCenarioAtuais.posicaoCarreira ?? NIVEL_PADRAO,
                    dependentes: parametrosCenarioAtuais.dependentes ?? 0,
                    diasTrabalhados: parametrosCenarioAtuais.diasTrabalhados ?? 20,
                    RGAMedio: parametrosCenarioAtuais.RGAMedio ?? 0,
                    crescimentoGEPIMedio: parametrosCenarioAtuais.crescimentoGEPIMedio ?? 0,
                    tetoGEPI: parametrosCenarioAtuais.tetoGEPI ?? TETO_GEPI,
                    tetoServidorPublico: parametrosCenarioAtuais.tetoServidorPublico ?? TETO_SERVIDOR_PUBLICO,
                    valorVIDiaria: parametrosCenarioAtuais.valorVIDiaria ?? VALOR_DIARIO_VI,
                    pontosGEPI: parametrosCenarioAtuais.pontosGEPI ?? PONTOS_GEPI,
                    valorPontoGEPI: parametrosCenarioAtuais.valorPontoGEPI ?? VALOR_PONTO_GEPI,
                    filiadoAoSindicato: parametrosCenarioAtuais.filiadoAoSindicato ?? true,
                    prevcom: parametrosCenarioAtuais.prevcom ?? true,
                    percentualDeContribuicaoDaPrevcom: parametrosCenarioAtuais.percentualDeContribuicaoDaPrevcom ?? PERCENTUAL_PREVCOM_PADRAO,
                    anoIngresso: parametrosCenarioAtuais.anoIngresso ?? ANO_INGRESSO_PADRAO,
                    ultimaPromocao: parametrosCenarioAtuais.ultimaPromocao || null,
                    ultimaProgressao: parametrosCenarioAtuais.ultimaProgressao || null,
                    salarioBaseSobreposto: parametrosCenarioAtuais.salarioBaseSobreposto ?? VENCIMENTO_BASICO.calcularVB(parametrosCenarioAtuais.posicaoCarreira ?? NIVEL_PADRAO)
                };

                if (JSON.stringify(s.parametros) !== JSON.stringify(parametrosMigrados)) {
                    precisaAtualizar = true;
                }

                // console.log(parametrosMigrados);

                return { ...s, parametros: parametrosMigrados };
            });

            if (precisaAtualizar) {
                defineCenarios(cenariosHigienizados);
            }
        }
    }, []); // <-- IMPORTANT: Empty array means it runs only once on mount.


    useEffect(() => {
        if (cenarios.length === 0) {
            const cenarioPadrao: Cenario = {
                id: uuidv4(),
                nome: 'Cenário Atual',
                cor: PALETA_DE_CORES[0],
                parametros: {
                    posicaoCarreira: NIVEL_PADRAO,
                    dependentes: 0,
                    diasTrabalhados: 20,
                    RGAMedio: 0,
                    crescimentoGEPIMedio: 0,
                    tetoGEPI: TETO_GEPI,
                    tetoServidorPublico: TETO_SERVIDOR_PUBLICO,
                    valorVIDiaria: VALOR_DIARIO_VI,
                    pontosGEPI: PONTOS_GEPI,
                    valorPontoGEPI: VALOR_PONTO_GEPI,
                    salarioBaseSobreposto: VENCIMENTO_BASICO.calcularVB(NIVEL_PADRAO),
                    filiadoAoSindicato: true,
                    prevcom: true,
                    percentualDeContribuicaoDaPrevcom: PERCENTUAL_PREVCOM_PADRAO,
                    anoIngresso: ANO_INGRESSO_PADRAO,
                    ultimaProgressao: ULTIMA_PROGRESSAO_PADRAO,
                    ultimaPromocao: ULTIMA_PROMOCAO_PADRAO
                },
            };
            defineCenarios([cenarioPadrao]);
            defineCenarioSelecionadoID(cenarioPadrao.id);
        } else if (!cenarioSelecionadoID && cenarios.length > 0) {
            defineCenarioSelecionadoID(cenarios[0].id);
        }
    }, [cenarios, cenarioSelecionadoID]);

    const projecoes = useMemo(() => {
        const resultados: { [key: string]: dadosAnuais[] } = {};
        cenarios.forEach(s => {
            resultados[s.id] = calcularProjecaoAnual(s, anosProjecao);
        });
        return resultados;
    }, [cenarios, anosProjecao]);


    const dadosGrafico: dadosGrafico[] = useMemo(() => {
        if (cenarios.length === 0 || !projecoes[cenarios[0].id]) return [];

        const anos = projecoes[cenarios[0].id].map(p => p.ano);
        return anos.map((ano, index) => {
            const dataPoint: dadosGrafico = { ano };
            cenarios.forEach(s => {
                if (projecoes[s.id] && projecoes[s.id][index]) {
                    dataPoint[s.id] = projecoes[s.id][index].salarioLiquido;
                }
            });
            return dataPoint;
        });
    }, [projecoes, cenarios]);

    const adicionarCenario = (cenario: Cenario) => {
        defineCenarios(prev => [...prev, cenario]);
    };

    const atualizarCenario = (cenarioAtualizado: Cenario) => {
        defineCenarios(prev => prev.map(s => (s.id === cenarioAtualizado.id ? cenarioAtualizado : s)));
    };

    const removeCenario = (id: string) => {
        defineCenarios(prev => {
            const newCenarios = prev.filter(s => s.id !== id);
            if (cenarioSelecionadoID === id) {
                defineCenarioSelecionadoID(newCenarios.length > 0 ? newCenarios[0].id : null);
            }
            return newCenarios;
        });
    };

    const gerenciarCliqueGrafico = (year: number) => {
        defineAnoSelecionado(year);
        if (dadosGrafico.length > 0) {
            const dadosAnuais = dadosGrafico.find(d => d.year === year);
            if (dadosAnuais) {
                let maxSalary = -1;
                let bestCenarioId = cenarios[0]?.id;
                cenarios.forEach(s => {
                    if (dadosAnuais[s.id] > maxSalary) {
                        maxSalary = dadosAnuais[s.id];
                        bestCenarioId = s.id;
                    }
                });
                if (bestCenarioId) {
                    defineCenarioSelecionadoID(bestCenarioId);
                }
            }
        }
    };

    const cenarioSelecionado = cenarios.find(s => s.id === cenarioSelecionadoID);
    const anoSelecionadoData = anoSelecionado && cenarioSelecionadoID && projecoes[cenarioSelecionadoID] ? projecoes[cenarioSelecionadoID].find(d => d.ano === anoSelecionado) : null;

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100">
                Simulador de Cenários
                <span className="block text-xl font-normal text-primary-600 dark:text-primary-400">Auditor Fiscal SEF/MG</span>
            </h1>



            <ControleCenario
                cenarios={cenarios}
                adicionarCenario={adicionarCenario}
                atualizarCenario={atualizarCenario}
                removeCenario={removeCenario}
                anosProjecao={anosProjecao}
                defineAnosProjecao={defineAnosProjecao}
            />

            <ControleGlobal 
            
            />
            
            <Card>
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Projeção da Remuneração Líquida Mensal</h2>
                {cenarios.length > 0 && dadosGrafico.length > 0 ? (
                    <GraficoRemuneracao data={dadosGrafico} cenarios={cenarios} onDataPointClick={gerenciarCliqueGrafico} />
                ) : (
                    <div className="h-96 flex items-center justify-center text-gray-500">
                        Adicione um cenário para visualizar o gráfico.
                    </div>
                )}
            </Card>

            <SelecionadorDetalhes
                cenarios={cenarios}
                anosProjecao={anosProjecao}
                cenarioSelecionadoID={cenarioSelecionadoID}
                defineCenarioSelecionadoID={defineCenarioSelecionadoID}
                anoSelecionado={anoSelecionado}
                defineAnoSelecionado={defineAnoSelecionado}
            />

            <DetalhesCalculo cenario={cenarioSelecionado || null} dadosAnuais={anoSelecionadoData || null} year={anoSelecionado} />
        </div>
    );
};

export default simuladorCenario;