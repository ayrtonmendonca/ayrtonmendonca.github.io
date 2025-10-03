
import React, { useState } from 'react';
import Header from './components/Header';
import SimuladorCenario from './components/ScenarioSimulator';
import { useTheme } from './hooks/useTheme';

import {
    VENCIMENTO_BASICO,
    ADE,
    PONTOS_GEPI,
    VALOR_PONTO_GEPI,
    FAIXAS_IR,
    FAIXAS_PENSAO
} from './constants';

const About = () => (
    <div className="p-8 text-gray-800 dark:text-gray-200">
        <h2 className="text-3xl font-bold mb-4 text-primary-600 dark:text-primary-400">Sobre o Simulador</h2>
        <p className="mb-4">Este simulador foi desenvolvido para fornecer uma ferramenta interativa e visual para a análise e projeção de cenários de remuneração da carreira de Auditor Fiscal da Receita Estadual de Minas Gerais (SEF/MG).</p>
        <p className="mb-4">O objetivo é permitir que os usuários, sejam eles atuais servidores, aprovados em concursos ou interessados na carreira, possam comparar diferentes trajetórias e premissas de reajuste, entendendo o impacto de cada variável na remuneração líquida ao longo do tempo.</p>
        <p className="font-bold text-red-600 dark:text-red-400">Disclaimer: Os cálculos são baseados em valores e alíquotas de referência, que podem não corresponder exatamente à legislação vigente. Esta é uma ferramenta de simulação e não deve ser utilizada para fins oficiais.</p>
        <p className="italic mt-6 mb-8">Desenvolvido por Ayrton Amaral Mendonça e Rafael Nobre Leite.</p>

        <h3 className="text-2xl font-bold mt-8 mb-2 text-primary-600 dark:text-primary-400">Remuneração Básica Atual</h3>
        <div className="w-full flex flex-row justify-center items-start gap-12 mb-6">
            {["I", "II"].map(nivel => (
                <div key={nivel} className="w-56">
                    <h4 className="text-lg font-semibold mb-2 text-primary-700 dark:text-primary-300 text-center">Nível {nivel}</h4>
                    <table className="w-full text-xs text-left border border-gray-300 dark:border-gray-700">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-800">
                                <th className="px-2 py-1 border-b text-center">Grau</th>
                                <th className="px-2 py-1 border-b text-center">VB (R$)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {VENCIMENTO_BASICO.data.filter(item => item.nivel === nivel).map((item, idx) => (
                                <tr key={item.grau} className={idx % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}>
                                    <td className="px-2 py-1 border-b text-center">{item.grau}</td>
                                    <td className="px-2 py-1 border-b text-center">{item.vb.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>

        <h3 className="text-2xl font-bold mt-8 mb-2 text-primary-600 dark:text-primary-400">Progressões de ADE</h3>
        <div className="overflow-x-auto mb-6 flex justify-center">
            <table className="w-56 text-[11px] text-left border border-gray-300 dark:border-gray-700">
                <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800">
                        <th className="px-2 py-1 border-b text-center">Ano de Serviço</th>
                        <th className="px-2 py-1 border-b text-center">Percentual ADE</th>
                    </tr>
                </thead>
                <tbody>
                    {ADE.map((item, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}>
                            <td className="px-2 py-1 border-b text-center">{item.ano}</td>
                            <td className="px-2 py-1 border-b text-center">{(item.valor * 100).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}%</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <h3 className="text-2xl font-bold mt-8 mb-2 text-primary-600 dark:text-primary-400">GEPI</h3>
        <ul className="mb-6 list-disc list-inside">
            <li><b>Pontos GEPI:</b> {PONTOS_GEPI.toLocaleString('pt-BR')}</li>
            <li><b>Valor do Ponto GEPI:</b> {VALOR_PONTO_GEPI.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</li>
        </ul>

        <h3 className="text-2xl font-bold mt-8 mb-2 text-primary-600 dark:text-primary-400">Tabela de IRRF (Mensal)</h3>
        <div className="overflow-x-auto mb-6 flex justify-center">
            <table className="w-72 text-[11px] text-left border border-gray-300 dark:border-gray-700">
                <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800">
                        <th className="px-2 py-1 border-b text-center">Limite (R$)</th>
                        <th className="px-2 py-1 border-b text-center">Alíquota (%)</th>
                        <th className="px-2 py-1 border-b text-center">Dedução</th>
                    </tr>
                </thead>
                <tbody>
                    {FAIXAS_IR.map((item, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}>
                            <td className="px-2 py-1 border-b text-center">{item.limite === Infinity ? 'Acima' : item.limite.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                            <td className="px-2 py-1 border-b text-center">{(item.taxa * 100).toLocaleString('pt-BR', { minimumFractionDigits: 1 })}%</td>
                            <td className="px-2 py-1 border-b text-center">{item.deducao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <h3 className="text-2xl font-bold mt-8 mb-2 text-primary-600 dark:text-primary-400">Tabela de RPPS</h3>
        <div className="overflow-x-auto mb-6 flex justify-center">
            <table className="w-72 text-[11px] text-left border border-gray-300 dark:border-gray-700">
                <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800">
                        <th className="px-2 py-1 border-b text-center">Limite (R$)</th>
                        <th className="px-2 py-1 border-b text-center">Alíquota (%)</th>
                        <th className="px-2 py-1 border-b text-center">Dedução</th>
                    </tr>
                </thead>
                <tbody>
                    {FAIXAS_PENSAO.map((item, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}>
                            <td className="px-2 py-1 border-b text-center">{item.limite === Infinity ? 'Acima' : item.limite.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                            <td className="px-2 py-1 border-b text-center">{(item.taxa * 100).toLocaleString('pt-BR', { minimumFractionDigits: 1 })}%</td>
                            <td className="px-2 py-1 border-b text-center">{item.deducao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
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
                return <SimuladorCenario />;
            case 'legislation':
                return <Legislation />;
            case 'about':
                return <About />;
            default:
                return <SimuladorCenario />;
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
