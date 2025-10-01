import React, { useState, useMemo, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { dadosGrafico, Cenario, dadosAnuais, parametrosDeCenario, parametrosGlobais } from '../types';
import {
    REPIQUE_PADRAO, PALETA_DE_CORES, VENCIMENTO_BASICO, PONTOS_GEPI, VALOR_PONTO_GEPI, VALOR_DIARIO_VI, PERCENTUAL_PREVCOM_PADRAO,
    ANO_INGRESSO_PADRAO, ULTIMA_PROGRESSAO_PADRAO, ULTIMA_PROMOCAO_PADRAO, POSICAO_CARREIRA_PADRAO,
    TETO_SERVIDOR_PUBLICO, TETO_GEPI, PARAMETROS_GLOBAIS_PADRAO
} from '../constants';
import { calcularProjecaoAnual } from '../services/remunerationCalculator';
import useLocalStorage from '../hooks/useLocalStorage';
import ControleGlobal from './GlobalControls';
import ControleCenario from './ScenarioControls';
import GraficoRemuneracao from './RemunerationChart';
import DetalhesCalculo from './CalculationDetails';
import SelecionadorDetalhes from './DetailsSelector';
import Card from './ui/Card';
import Select from './ui/Select';

const simuladorCenario: React.FC = () => {
    const [cenarios, defineCenarios] = useLocalStorage<Cenario[]>('sef-mg-cenarios', []);
    const [parametrosGlobais, defineParametrosGlobais] = useLocalStorage<parametrosGlobais>('sef-mg-parametros-globais', PARAMETROS_GLOBAIS_PADRAO);
    const [anoSelecionado, defineAnoSelecionado] = useState<number>(new Date().getFullYear());
    const [cenarioSelecionadoID, defineCenarioSelecionadoID] = useState<string | null>(null);
    // console.log(parametrosGlobais);
    const [tipoRemuneracao, setTipoRemuneracao] = useState<'liquida' | 'bruta' | 'tributavel'>('liquida');
    // This effect runs ONCE on mount to sanitize data from localStorage, ensuring compatibility with the current app version.
    useEffect(() => {
        if (cenarios.length > 0) {
            let precisaAtualizar = false;
            const cenariosHigienizados = cenarios.map(s => {
                // FIX: Explicitly type `parametrosCenarioAtuais` to handle cases where `s.parametros` might be missing from old localStorage data,
                // and handle migration from old data structure with `gepiAdjustment`.
                const parametrosCenarioAtuais = s.parametros;

                const parametrosMigrados: parametrosDeCenario = {
                    valorVIDiaria: parametrosCenarioAtuais.valorVIDiaria ?? VALOR_DIARIO_VI,
                    pontosGEPI: parametrosCenarioAtuais.pontosGEPI ?? PONTOS_GEPI,
                    salarioBaseInicial: parametrosCenarioAtuais.salarioBaseInicial ?? VENCIMENTO_BASICO.calcularVB('I-A'),
                    repique: parametrosCenarioAtuais.repique ?? REPIQUE_PADRAO
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
            const cenariosPadrao: Cenario[] = [
                {
                    id: uuidv4(),
                    nome: 'Cenário Atual',
                    cor: PALETA_DE_CORES[0],
                    parametros: {
                        salarioBaseInicial: 5975.21,
                        pontosGEPI: 11000,
                        valorVIDiaria: 179.58,
                        repique: true
                    }
                },
                {
                    id: uuidv4(),
                    nome: 'Migração de 6.000 pts. Com Repique',
                    cor: PALETA_DE_CORES[1],
                    parametros: {
                        salarioBaseInicial: 18035.21,
                        pontosGEPI: 5000,
                        valorVIDiaria: 179.58,
                        repique: true
                    }
                },
                {
                    id: uuidv4(),
                    nome: 'Migração de 6.000 pts. Sem Repique',
                    cor: PALETA_DE_CORES[2],
                    parametros: {
                        salarioBaseInicial: 18035.21,
                        pontosGEPI: 5000,
                        valorVIDiaria: 179.58,
                        repique: false
                    }
                },
                {
                    id: uuidv4(),
                    nome: 'Migração de 11.000 pts. Com Repique',
                    cor: PALETA_DE_CORES[3],
                    parametros: {
                        salarioBaseInicial: 28085.21,
                        pontosGEPI: 0,
                        valorVIDiaria: 179.58,
                        repique: true
                    }
                },
                {
                    id: uuidv4(),
                    nome: 'Migração de 11.000 pts. Sem Repique',
                    cor: PALETA_DE_CORES[4],
                    parametros: {
                        salarioBaseInicial: 28085.21,
                        pontosGEPI: 0,
                        valorVIDiaria: 179.58,
                        repique: false
                    }
                }
            ];
            defineCenarios(cenariosPadrao);
            defineCenarioSelecionadoID(cenariosPadrao[0].id);
        } else if (!cenarioSelecionadoID && cenarios.length > 0) {
            defineCenarioSelecionadoID(cenarios[0].id);
        }
    }, [cenarios, cenarioSelecionadoID]);

    const projecoes = useMemo(() => {
        const resultados: { [key: string]: dadosAnuais[] } = {};
        cenarios.forEach(s => {
            resultados[s.id] = calcularProjecaoAnual(parametrosGlobais, s);
        });
        return resultados;
    }, [cenarios, parametrosGlobais]);


    const dadosGrafico: dadosGrafico[] = useMemo(() => {
        if (cenarios.length === 0 || !projecoes[cenarios[0].id]) return [];

        const anos = projecoes[cenarios[0].id].map(p => p.ano);
        return anos.map((ano, index) => {
            const dataPoint: dadosGrafico = { ano };
            cenarios.forEach(s => {
                if (projecoes[s.id] && projecoes[s.id][index]) {
                    let valor = 0;
                    if (tipoRemuneracao === 'liquida') valor = projecoes[s.id][index].salarioLiquido;
                    else if (tipoRemuneracao === 'bruta') valor = projecoes[s.id][index].salarioBruto;
                    else if (tipoRemuneracao === 'tributavel') valor = projecoes[s.id][index].rendaTributavel;
                    dataPoint[s.id] = valor;
                }
            });
            return dataPoint;
        });
    }, [projecoes, cenarios, tipoRemuneracao]);

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
            />

            <ControleGlobal
                parametrosGlobais={parametrosGlobais}
                defineParametrosGlobais={defineParametrosGlobais}
            />

            <Card>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Projeção da Remuneração Mensal</h2>
                    <div className="w-full md:w-64">
                        <Select
                            label="Tipo de Remuneração"
                            id="tipoRemuneracao"
                            value={tipoRemuneracao}
                            onChange={e => setTipoRemuneracao(e.target.value as 'liquida' | 'bruta' | 'tributavel')}
                        >
                            <option value="liquida">Remuneração Líquida</option>
                            <option value="bruta">Remuneração Bruta</option>
                            <option value="tributavel">Remuneração Tributável</option>
                        </Select>
                    </div>
                </div>
                {cenarios.length > 0 && dadosGrafico.length > 0 ? (
                    <GraficoRemuneracao
                        data={dadosGrafico}
                        cenarios={cenarios}
                        onDataPointClick={gerenciarCliqueGrafico}
                        projecoes={projecoes}
                        tipoRemuneracao={tipoRemuneracao}
                    />
                ) : (
                    <div className="h-96 flex items-center justify-center text-gray-500">
                        Adicione um cenário para visualizar o gráfico.
                    </div>
                )}
            </Card>

            <SelecionadorDetalhes
                cenarios={cenarios}
                parametrosGlobais={parametrosGlobais}
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