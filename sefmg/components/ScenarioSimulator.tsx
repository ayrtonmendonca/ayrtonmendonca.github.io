import React, { useState, useMemo, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChartData, Scenario, AnnualData, ScenarioParameters } from '../types';
import { PROJECTION_YEARS_DEFAULT, SCENARIO_COLORS, CAREER_POSITIONS, BASE_SALARIES, GEPI_POINTS, GEPI_POINT_VALUE, VI_DAILY_VALUE, DEFAULT_PREVCOM_PERCENTAGE } from '../constants';
import { calculateAnnualProjection } from '../services/remunerationCalculator';
import useLocalStorage from '../hooks/useLocalStorage';
import ScenarioControls from './ScenarioControls';
import RemunerationChart from './RemunerationChart';
import CalculationDetails from './CalculationDetails';
import DetailsSelector from './DetailsSelector';
import Card from './ui/Card';

const ScenarioSimulator: React.FC = () => {
    const [scenarios, setScenarios] = useLocalStorage<Scenario[]>('sef-mg-scenarios', []);
    const [projectionYears, setProjectionYears] = useLocalStorage<number>('sef-mg-projection-years', PROJECTION_YEARS_DEFAULT);
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);

    // This effect runs ONCE on mount to sanitize data from localStorage, ensuring compatibility with the current app version.
    useEffect(() => {
        if (scenarios.length > 0) {
            let needsUpdate = false;
            const sanitizedScenarios = scenarios.map(s => {
                // FIX: Explicitly type `currentParams` to handle cases where `s.parameters` might be missing from old localStorage data,
                // and handle migration from old data structure with `gepiAdjustment`.
                const currentParams: Partial<ScenarioParameters> & { gepiAdjustment?: number } = s.parameters || {};

                const salaryAdjustmentValue = currentParams.salaryAdjustment ?? currentParams.gepiAdjustment ?? 0;

                const migratedParams: ScenarioParameters = {
                    level: currentParams.level ?? CAREER_POSITIONS[0],
                    dependents: currentParams.dependents ?? 0,
                    workingDays: currentParams.workingDays ?? 20,
                    salaryAdjustment: salaryAdjustmentValue,
                    viDailyValue: currentParams.viDailyValue ?? VI_DAILY_VALUE,
                    gepiPoints: currentParams.gepiPoints ?? GEPI_POINTS,
                    gepiPointValue: currentParams.gepiPointValue ?? GEPI_POINT_VALUE,
                    isSindifiscoMember: currentParams.isSindifiscoMember ?? true,
                    isPrevcomMember: currentParams.isPrevcomMember ?? true,
                    prevcomContributionPercentage: currentParams.prevcomContributionPercentage ?? DEFAULT_PREVCOM_PERCENTAGE,
                    baseSalaryOverride: currentParams.baseSalaryOverride ?? BASE_SALARIES[currentParams.level || CAREER_POSITIONS[0]],
                };
                
                if(JSON.stringify(s.parameters) !== JSON.stringify(migratedParams)) {
                    needsUpdate = true;
                }

                return { ...s, parameters: migratedParams };
            });

            if (needsUpdate) {
                setScenarios(sanitizedScenarios);
            }
        }
    }, []); // <-- IMPORTANT: Empty array means it runs only once on mount.


    useEffect(() => {
        if (scenarios.length === 0) {
            const defaultScenario: Scenario = {
                id: uuidv4(),
                name: 'Cenário Atual',
                color: SCENARIO_COLORS[0],
                parameters: {
                    level: CAREER_POSITIONS[0],
                    dependents: 0,
                    workingDays: 20,
                    salaryAdjustment: 0,
                    viDailyValue: VI_DAILY_VALUE,
                    baseSalaryOverride: BASE_SALARIES[CAREER_POSITIONS[0]],
                    gepiPoints: GEPI_POINTS,
                    gepiPointValue: GEPI_POINT_VALUE,
                    isSindifiscoMember: true,
                    isPrevcomMember: true,
                    prevcomContributionPercentage: DEFAULT_PREVCOM_PERCENTAGE,
                },
            };
            setScenarios([defaultScenario]);
            setSelectedScenarioId(defaultScenario.id);
        } else if (!selectedScenarioId && scenarios.length > 0) {
             setSelectedScenarioId(scenarios[0].id);
        }
    }, [scenarios, selectedScenarioId]);
    
    const projections = useMemo(() => {
        const result: { [key: string]: AnnualData[] } = {};
        scenarios.forEach(s => {
            result[s.id] = calculateAnnualProjection(s, projectionYears);
        });
        return result;
    }, [scenarios, projectionYears]);

    const chartData: ChartData[] = useMemo(() => {
        if (scenarios.length === 0 || !projections[scenarios[0].id]) return [];

        const years = projections[scenarios[0].id].map(p => p.year);
        return years.map((year, index) => {
            const dataPoint: ChartData = { year };
            scenarios.forEach(s => {
                if (projections[s.id] && projections[s.id][index]) {
                    dataPoint[s.id] = projections[s.id][index].netSalary;
                }
            });
            return dataPoint;
        });
    }, [projections, scenarios]);

    const addScenario = (scenario: Scenario) => {
        setScenarios(prev => [...prev, scenario]);
    };

    const updateScenario = (updatedScenario: Scenario) => {
        setScenarios(prev => prev.map(s => (s.id === updatedScenario.id ? updatedScenario : s)));
    };

    const removeScenario = (id: string) => {
        setScenarios(prev => {
            const newScenarios = prev.filter(s => s.id !== id);
             if (selectedScenarioId === id) {
                setSelectedScenarioId(newScenarios.length > 0 ? newScenarios[0].id : null);
            }
            return newScenarios;
        });
    };
    
    const handleDataPointClick = (year: number) => {
        setSelectedYear(year);
        if (chartData.length > 0) {
            const yearData = chartData.find(d => d.year === year);
            if (yearData) {
                let maxSalary = -1;
                let bestScenarioId = scenarios[0]?.id;
                scenarios.forEach(s => {
                    if (yearData[s.id] > maxSalary) {
                        maxSalary = yearData[s.id];
                        bestScenarioId = s.id;
                    }
                });
                if (bestScenarioId) {
                    setSelectedScenarioId(bestScenarioId);
                }
            }
        }
    };

    const selectedScenario = scenarios.find(s => s.id === selectedScenarioId);
    const selectedYearData = selectedYear && selectedScenarioId && projections[selectedScenarioId] ? projections[selectedScenarioId].find(d => d.year === selectedYear) : null;


    return (
        <div className="space-y-8">
             <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100">
                Simulador de Cenários
                <span className="block text-xl font-normal text-primary-600 dark:text-primary-400">Auditor Fiscal SEF/MG</span>
            </h1>

            <ScenarioControls
                scenarios={scenarios}
                addScenario={addScenario}
                updateScenario={updateScenario}
                removeScenario={removeScenario}
                projectionYears={projectionYears}
                setProjectionYears={setProjectionYears}
            />

            <Card>
                 <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Projeção da Remuneração Líquida Mensal</h2>
                {scenarios.length > 0 && chartData.length > 0 ? (
                    <RemunerationChart data={chartData} scenarios={scenarios} onDataPointClick={handleDataPointClick} />
                ) : (
                    <div className="h-96 flex items-center justify-center text-gray-500">
                        Adicione um cenário para visualizar o gráfico.
                    </div>
                )}
            </Card>

            <DetailsSelector
                scenarios={scenarios}
                projectionYears={projectionYears}
                selectedScenarioId={selectedScenarioId}
                setSelectedScenarioId={setSelectedScenarioId}
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
            />

            <CalculationDetails scenario={selectedScenario || null} yearData={selectedYearData || null} year={selectedYear} />
        </div>
    );
};

export default ScenarioSimulator;