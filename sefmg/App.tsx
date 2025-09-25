
import React, { useState } from 'react';
import Header from './components/Header';
import ScenarioSimulator from './components/ScenarioSimulator';
import { useTheme } from './hooks/useTheme';

const About = () => (
    <div className="p-8 text-gray-800 dark:text-gray-200">
        <h2 className="text-3xl font-bold mb-4 text-primary-600 dark:text-primary-400">Sobre o Simulador</h2>
        <p className="mb-4">Este simulador foi desenvolvido para fornecer uma ferramenta interativa e visual para a análise e projeção de cenários de remuneração da carreira de Auditor Fiscal da Receita Estadual de Minas Gerais (SEF/MG).</p>
        <p className="mb-4">O objetivo é permitir que os usuários, sejam eles atuais servidores, aprovados em concursos ou interessados na carreira, possam comparar diferentes trajetórias e premissas de reajuste, entendendo o impacto de cada variável na remuneração líquida ao longo do tempo.</p>
        <p className="font-bold text-red-600 dark:text-red-400">Disclaimer: Os cálculos são baseados em valores e alíquotas de referência, que podem não corresponder exatamente à legislação vigente. Esta é uma ferramenta de simulação e não deve ser utilizada para fins oficiais.</p>
    </div>
);

const Legislation = () => (
    <div className="p-8 text-gray-800 dark:text-gray-200">
        <h2 className="text-3xl font-bold mb-4 text-primary-600 dark:text-primary-400">Legislação</h2>
        <p className="mb-4">A carreira de Auditor Fiscal da Receita Estadual de Minas Gerais é regida por um conjunto de leis e decretos. Abaixo estão alguns links oficiais para consulta:</p>
        <ul className="list-disc list-inside space-y-2">
            <li><a href="https://www.almg.gov.br/consulte/legislacao/completa/completa.html?tipo=LEI&num=22257&ano=2016" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Lei nº 22.257/2016 - Estrutura a carreira</a></li>
            <li><a href="https://www.fazenda.mg.gov.br/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Portal da Secretaria de Estado de Fazenda de MG</a></li>
            <li><a href="https://www.portaldoservidor.mg.gov.br/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Portal do Servidor de MG</a></li>
        </ul>
    </div>
);


export default function App() {
    const [theme, toggleTheme] = useTheme();
    const [activeTab, setActiveTab] = useState('home');

    const renderContent = () => {
        switch (activeTab) {
            case 'home':
                return <ScenarioSimulator />;
            case 'legislation':
                return <Legislation />;
            case 'about':
                return <About />;
            default:
                return <ScenarioSimulator />;
        }
    };

    return (
        <div className={`min-h-screen font-sans transition-colors duration-300 ${theme}`}>
            <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                <Header activeTab={activeTab} setActiveTab={setActiveTab} theme={theme} toggleTheme={toggleTheme as () => void} />
                <main className="container mx-auto px-4 py-8">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}
