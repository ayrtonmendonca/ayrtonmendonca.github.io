import React, { useState, useMemo, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { dadosGrafico, Cenario, dadosAnuais, parametrosDeCenario } from '../types';
import { ANOS_DE_PROJECAO, PALETA_DE_CORES, POSICAO_CARREIRA, VENCIMENTO_BASICO, PONTOS_GEPI, VALOR_PONTO_GEPI, VALOR_DIARIO_VI, PERCENTUAL_PREVCOM_PADRAO, 
    ANO_INGRESSO_PADRAO, ULTIMA_PROGRESSAO_PADRAO, ULTIMA_PROMOCAO_PADRAO, NIVEL_PADRAO } from '../constants';
import { calcularProjecaoAnual } from '../services/remunerationCalculator';
import useLocalStorage from '../hooks/useLocalStorage';
import ControleCenario from './ScenarioControls';
import GraficoRemuneracao from './RemunerationChart';
import CalculationDetails from './CalculationDetails';
import DetailsSelector from './DetailsSelector';
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
                // FIX: Explicitly type `parametrosAtuais` to handle cases where `s.parametros` might be missing from old localStorage data,
                // and handle migration from old data structure with `gepiAdjustment`.
                const parametrosAtuais: Partial<parametrosDeCenario> & { gepiAdjustment?: number } = s.parametros || {};

                const ajusteDeSalarioValue = parametrosAtuais.ajusteDeSalario ?? parametrosAtuais.gepiAdjustment ?? 0;

                const parametrosMigrados: parametrosDeCenario = {
                    posicaoCarreira: parametrosAtuais.posicaoCarreira ?? NIVEL_PADRAO,
                    dependentes: parametrosAtuais.dependentes ?? 0,
                    diasTrabalhados: parametrosAtuais.diasTrabalhados ?? 20,
                    ajusteDeSalario: ajusteDeSalarioValue,
                    valorVIDiaria: parametrosAtuais.valorVIDiaria ?? VALOR_DIARIO_VI,
                    pontosGEPI: parametrosAtuais.pontosGEPI ?? PONTOS_GEPI,
                    valorPontoGEPI: parametrosAtuais.valorPontoGEPI ?? VALOR_PONTO_GEPI,
                    filiadoAoSindicato: parametrosAtuais.filiadoAoSindicato ?? true,
                    prevcom: parametrosAtuais.prevcom ?? true,
                    percentualDeContribuicaoDaPrevcom: parametrosAtuais.percentualDeContribuicaoDaPrevcom ?? PERCENTUAL_PREVCOM_PADRAO,
                    anoIngresso: parametrosAtuais.anoIngresso,
                    ultimaPromocao: parametrosAtuais.ultimaPromocao || null,
                    ultimaProgressao: parametrosAtuais.ultimaProgressao || null,
                    salarioBaseSobreposto: parametrosAtuais.salarioBaseSobreposto ?? VENCIMENTO_BASICO.calcularVB(parametrosAtuais.posicaoCarreira ?? NIVEL_PADRAO)
                };
                
                if(JSON.stringify(s.parametros) !== JSON.stringify(parametrosMigrados)) {
                    precisaAtualizar = true;
                }

                console.log(parametrosMigrados);

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
                    ajusteDeSalario: 0,
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
    
    const handleDataPointClick = (year: number) => {
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
    const anoSelecionadoData = anoSelecionado && cenarioSelecionadoID && projecoes[cenarioSelecionadoID] ? projecoes[cenarioSelecionadoID].find(d => d.year === anoSelecionado) : null;


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

            <Card>
                 <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Projeção da Remuneração Líquida Mensal</h2>
                {cenarios.length > 0 && dadosGrafico.length > 0 ? (
                    <GraficoRemuneracao data={dadosGrafico} cenarios={cenarios} onDataPointClick={handleDataPointClick} />
                ) : (
                    <div className="h-96 flex items-center justify-center text-gray-500">
                        Adicione um cenário para visualizar o gráfico.
                    </div>
                )}
            </Card>

            <DetailsSelector
                cenarios={cenarios}
                anosProjecao={anosProjecao}
                cenarioSelecionadoID={cenarioSelecionadoID}
                defineCenarioSelecionadoID={defineCenarioSelecionadoID}
                anoSelecionado={anoSelecionado}
                defineAnoSelecionado={defineAnoSelecionado}
            />

            <CalculationDetails cenario={cenarioSelecionado || null} dadosAnuais={anoSelecionadoData || null} year={anoSelecionado} />
        </div>
    );
};

export default simuladorCenario;