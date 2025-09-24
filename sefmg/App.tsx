
import React, { useState } from 'react';
import type { SalaryInput, CalculationResult } from './types';
import { SalaryForm } from './components/SalaryForm';
import { SalaryResult } from './components/SalaryResult';
import { SalaryChart } from './components/SalaryChart';
import { calculateCompleteSalary } from './services/salaryCalculator';
import { Logo } from './components/Logo';

const App: React.FC = () => {
  const [results, setResults] = useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCalculate = (inputs: SalaryInput) => {
    setIsLoading(true);
    // Simulate a brief calculation delay for better UX
    setTimeout(() => {
      const calculatedResults = calculateCompleteSalary(inputs);
      setResults(calculatedResults);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex justify-center items-center gap-4 mb-2">
            <Logo />
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-700">
              Simulador de Remuneração
            </h1>
          </div>
          <p className="text-lg text-slate-500">Auditor Fiscal da Receita Estadual - MG</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <SalaryForm onCalculate={handleCalculate} isLoading={isLoading} />
          </div>

          <div className="lg:col-span-2 flex flex-col gap-8">
            {isLoading && (
              <div className="flex justify-center items-center h-96 bg-white rounded-xl shadow-md">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500"></div>
              </div>
            )}

            {!isLoading && results && (
              <>
                <SalaryResult currentSalary={results.current} />
                <SalaryChart projectionData={results.projection} />
              </>
            )}
            
            {!isLoading && !results && (
              <div className="flex flex-col justify-center items-center h-96 bg-white rounded-xl shadow-md p-8 text-center">
                 <h2 className="text-2xl font-semibold text-slate-600 mb-2">Bem-vindo!</h2>
                 <p className="text-slate-500">Preencha os campos ao lado para simular a remuneração e visualizar a projeção de carreira.</p>
              </div>
            )}
          </div>
        </main>
        <footer className="text-center mt-12 text-sm text-slate-400">
          <p>
            Disclaimer: Esta é uma ferramenta de simulação. Os valores são baseados em dados públicos e podem não refletir
            exatamente a remuneração real. Consulte a legislação vigente para informações oficiais.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
