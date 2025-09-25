import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChartData, Scenario, AnnualData } from '../types';
import { PROJECTION_YEARS_DEFAULT, SCENARIO_COLORS, CAREER_POSITIONS } from '../constants';
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
                    gepiAdjustment: 0,
                    viAdjustment: 0,
                },
            };
            setScenarios([defaultScenario]);
            setSelectedScenarioId(defaultScenario.id);
        } else if (!selectedScenarioId) {
             setSelectedScenarioId(scenarios[0].id);
        }
    }, [scenarios, selectedScenarioId, setScenarios]);
    
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
