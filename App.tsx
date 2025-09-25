
import React, { useState, useCallback } from 'react';
import { SalaryForm } from './components/SalaryForm';
import { SalaryResult } from './components/SalaryResult';
import { SalaryChart } from './components/SalaryChart';
import { SimulationInput, SimulationResult, SalaryProjection } from './types';
import { calculateSalaryProjection } from './services/salaryCalculator';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

const App: React.FC = () => {
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);

  const handleCalculate = useCallback((inputs: SimulationInput) => {
    const result = calculateSalaryProjection(inputs);
    setSimulationResult(result);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <SalaryForm onCalculate={handleCalculate} />
          </div>
          <div className="lg:col-span-8">
            {simulationResult ? (
              <div className="space-y-8">
                <SalaryResult currentSalary={simulationResult.currentSalary} />
                <SalaryChart projectionData={simulationResult.projection} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full bg-white rounded-xl shadow-md p-8">
                <div className="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9.5C17 11.433 14.761 13 12 13s-5-1.567-5-3.5S9.239 6 12 6s5 1.567 5 3.5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 13v6m0 0H9m3 0h3" />
                  </svg>
                  <h2 className="mt-4 text-xl font-semibold text-gray-700">Aguardando Simulação</h2>
                  <p className="mt-2 text-gray-500">Preencha os dados ao lado e clique em "Simular" para ver os resultados.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
