
import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Scenario, ScenarioParameters } from '../types';
import { SCENARIO_COLORS, CAREER_POSITIONS } from '../constants';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';

interface ScenarioControlsProps {
    scenarios: Scenario[];
    addScenario: (scenario: Scenario) => void;
    updateScenario: (scenario: Scenario) => void;
    removeScenario: (id: string) => void;
    projectionYears: number;
    setProjectionYears: (years: number) => void;
}

const formatPositionName = (position: string) => {
    const [level, grade] = position.split('-');
    return `Nível ${level} - Grau ${grade}`;
};

const ScenarioControls: React.FC<ScenarioControlsProps> = ({ scenarios, addScenario, updateScenario, removeScenario, projectionYears, setProjectionYears }) => {
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [currentParams, setCurrentParams] = useState<ScenarioParameters>({
        level: CAREER_POSITIONS[0],
        dependents: 0,
        workingDays: 20,
        salaryAdjustment: 0,
        gepiAdjustment: 0,
        viAdjustment: 0,
    });
    const [scenarioName, setScenarioName] = useState('Novo Cenário');
    
    const getNextColor = useCallback(() => {
        return SCENARIO_COLORS[scenarios.length % SCENARIO_COLORS.length];
    }, [scenarios.length]);

    useEffect(() => {
        if (!isEditing) {
             setScenarioName(`Cenário ${scenarios.length + 1}`);
        }
    }, [scenarios.length, isEditing]);


    const handleSave = () => {
        if (isEditing) {
            const scenarioToUpdate = scenarios.find(s => s.id === isEditing);
            if(scenarioToUpdate) {
                updateScenario({ ...scenarioToUpdate, name: scenarioName, parameters: currentParams });
            }
        } else {
            addScenario({
                id: uuidv4(),
                name: scenarioName,
                color: getNextColor(),
                parameters: currentParams,
            });
        }
        resetForm();
    };

    const resetForm = () => {
        setIsEditing(null);
        setScenarioName('');
        setCurrentParams({
            level: CAREER_POSITIONS[0],
            dependents: 0,
            workingDays: 20,
            salaryAdjustment: 0,
            gepiAdjustment: 0,
            viAdjustment: 0,
        });
    };

    const handleEdit = (scenario: Scenario) => {
        setIsEditing(scenario.id);
        setScenarioName(scenario.name);
        setCurrentParams(scenario.parameters);
    };

    const handleCancelEdit = () => {
        resetForm();
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">{isEditing ? 'Editar Cenário' : 'Adicionar Cenário'}</h3>
                <div className="space-y-4">
                    <Input label="Nome do Cenário" id="scenarioName" value={scenarioName} onChange={(e) => setScenarioName(e.target.value)} />
                    <Select label="Nível na Carreira" id="level" value={currentParams.level} onChange={(e) => setCurrentParams(p => ({ ...p, level: e.target.value }))}>
                        {CAREER_POSITIONS.map(position => <option key={position} value={position}>{formatPositionName(position)}</option>)}
                    </Select>
                    <Input label="Dependentes de IR" id="dependents" type="number" min="0" value={currentParams.dependents} onChange={(e) => setCurrentParams(p => ({ ...p, dependents: parseInt(e.target.value) || 0 }))} />
                    <Input label="Dias Trabalhados (Ajuda de Custo)" id="workingDays" type="number" min="0" value={currentParams.workingDays} onChange={(e) => setCurrentParams(p => ({ ...p, workingDays: parseInt(e.target.value) || 0 }))} />
                    <Input label="Reajuste Vencimento (%)" id="salaryAdjustment" type="number" value={currentParams.salaryAdjustment} onChange={(e) => setCurrentParams(p => ({ ...p, salaryAdjustment: parseFloat(e.target.value) || 0 }))} />
                    <Input label="Reajuste Ponto GEPI (centavos)" id="gepiAdjustment" type="number" value={currentParams.gepiAdjustment} onChange={(e) => setCurrentParams(p => ({ ...p, gepiAdjustment: parseFloat(e.target.value) || 0 }))} />
                    <Input label="Reajuste VI (R$)" id="viAdjustment" type="number" value={currentParams.viAdjustment} onChange={(e) => setCurrentParams(p => ({ ...p, viAdjustment: parseFloat(e.target.value) || 0 }))} />
                    <div className="flex space-x-2">
                        <Button onClick={handleSave}>{isEditing ? 'Salvar Alterações' : 'Adicionar Cenário'}</Button>
                        {isEditing && <Button variant="secondary" onClick={handleCancelEdit}>Cancelar</Button>}
                    </div>
                </div>
            </Card>
            <Card className="lg:col-span-2">
                <div className="flex justify-between items-center mb-4">
                     <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Cenários Ativos</h3>
                     <div className='flex items-center space-x-2'>
                        <label htmlFor="projectionYears" className="text-sm font-medium">Anos de Projeção:</label>
                        <Input id="projectionYears" type="number" min="1" max="50" value={projectionYears} onChange={(e) => setProjectionYears(parseInt(e.target.value))} className="w-20" label=''/>
                     </div>
                </div>
                <ul className="space-y-3">
                    {scenarios.map(s => (
                        <li key={s.id} className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <div className="flex items-center">
                                <span className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: s.color }}></span>
                                <span className="font-semibold">{s.name}</span>
                            </div>
                            <div className="space-x-2">
                                <Button onClick={() => handleEdit(s)} className="px-2 py-1 text-xs">Editar</Button>
                                {scenarios.length > 1 && <Button variant="danger" onClick={() => removeScenario(s.id)} className="px-2 py-1 text-xs">Remover</Button>}
                            </div>
                        </li>
                    ))}
                </ul>
            </Card>
        </div>
    );
};

export default ScenarioControls;
