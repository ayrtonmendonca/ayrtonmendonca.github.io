import React from 'react';
import { dadosAnuais, Cenario } from '../types';
import Card from './ui/Card';

interface DetalhesCalculoPropriedades {
    cenario: Cenario | null;
    dadosAnuais: dadosAnuais | null;
    ano: number;
}

const DetailRow: React.FC<{ label: string; value: number; isTotal?: boolean; isNegative?: boolean }> = ({ label, value, isTotal = false, isNegative = false }) => (
    <div className={`flex justify-between py-2 border-b border-gray-200 dark:border-gray-700 ${isTotal ? 'font-bold' : ''}`}>
        <span>{label}</span>
        <span className={isNegative ? 'text-red-500' : 'text-green-500'}>
            {isNegative && '- '}{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
        </span>
    </div>
);

const formatarNomePosicao = (position: string) => {
    if (!position || !position.includes('-')) return position;
    const [nivel, grau] = position.split('-');
    return `Nível ${nivel} - Grau ${grau}`;
};


const DetalhesCalculo: React.FC<DetalhesCalculoPropriedades> = ({ cenario, dadosAnuais, ano }) => {
    // Inflação acumulada até o ano (agora vem do cálculo)
    const inflacaoAcumulada = typeof dadosAnuais?.inflacaoAcumulada === 'number' ? dadosAnuais.inflacaoAcumulada : null;
    // console.log(cenario, dadosAnuais, ano);


    if (!cenario || !dadosAnuais) {
        return (
            <Card className="text-center">
                <p className="text-gray-500 dark:text-gray-400">Selecione um cenário e um ano para ver o detalhamento do cálculo.</p>
            </Card>
        );
    }


    // Parameters are now guaranteed to exist due to sanitization on app load.
    const {
        pontosGEPI,
        valorVIDiaria,
    } = cenario.parametros;

    const rotuloGEPI = `GEPI (${pontosGEPI.toLocaleString('pt-BR')} pts x ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(dadosAnuais.valorPontoGEPI)})`;
    const rotuloVI = `Verba Indenizatória (VI) (${dadosAnuais.diasTrabalhados} dias x ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorVIDiaria)})`;

    // Novos valores de teto corrigidos pela inflação
    const rotuloInflacao = `Inflação Acumulada: ${inflacaoAcumulada.toLocaleString('pt-BR', { style: 'percent', minimumFractionDigits: 2 })}`;
    const rotuloVencimentoBasicoInicial = `Vencimento Básico Inicial: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(dadosAnuais.vencimentoBasicoInicialCorrigido)}`;
    const rotuloVencimentoBasicoFinal = `Vencimento Básico Final: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(dadosAnuais.vencimentoBasicoFinalCorrigido)}`;
    const rotuloTetoGEPI = `Teto GEPI: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(dadosAnuais.tetoGEPICorrigido)}`;
    const rotuloTetoServidor = `Teto Servidor Público: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(dadosAnuais.tetoServidorPublicoCorrigido)}`;

    return (
        <Card>
            <h3 className="text-xl font-bold mb-4">
                Detalhamento do Cálculo: <span style={{ color: cenario.cor }}>{cenario.nome}</span> - Ano {ano}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <div>
                        <h4 className="font-semibold text-lg mb-2 text-gray-700 dark:text-gray-300">Remuneração Mensal</h4>
                        <DetailRow label={`Vencimento Básico (${formatarNomePosicao(dadosAnuais.posicaoCarreira)})`} value={dadosAnuais.vencimentoBasico} />
                        {dadosAnuais.ade > 0 && <DetailRow label={`Adicional de Desempenho - ADE (${dadosAnuais.percentualADE.toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 0 })})`} value={dadosAnuais.ade} />}
                        <DetailRow label={rotuloGEPI} value={dadosAnuais.gepi} />
                        <DetailRow label={rotuloVI} value={dadosAnuais.vi} />
                        <DetailRow label="Remuneração Bruta" value={dadosAnuais.remuneracaoBruta} isTotal={true} />
                        <DetailRow label="Previdência (RPPS)" value={dadosAnuais.descontoRPPS} isNegative={true} />
                        {dadosAnuais.descontoPrevcom > 0 && <DetailRow label="Previdência Complementar (PREVCOM)" value={dadosAnuais.descontoPrevcom} isNegative={true} />}
                        {dadosAnuais.abateTetoGepi > 0 && <DetailRow label="Abate Teto (GEPI)" value={dadosAnuais.abateTetoGepi} isNegative={true} />}
                        {dadosAnuais.abateTeto > 0 && <DetailRow label="Abate Teto" value={dadosAnuais.abateTeto} isNegative={true} />}
                        <DetailRow label="Imposto de Renda (IRRF)" value={dadosAnuais.descontoIR} isNegative={true} />
                        {dadosAnuais.descontoSindifisco > 0 && <DetailRow label="Contribuição SINDIFISCO" value={dadosAnuais.descontoSindifisco} isNegative={true} />}
                        <DetailRow label="Remuneração Líquida Mensal" value={dadosAnuais.remuneracaoLiquida} isTotal={true} />
                    </div>
                </div>
                <div>
                    <div>
                        <div className="mb-4">
                            <h4 className="font-semibold text-lg mb-2 text-gray-700 dark:text-gray-300">Informações gerais</h4>
                            <span className="block text-sm text-gray-500 dark:text-gray-400">{rotuloInflacao}</span>
                            <span className="block text-sm text-gray-500 dark:text-gray-400">{rotuloVencimentoBasicoInicial}</span>
                            <span className="block text-sm text-gray-500 dark:text-gray-400">{rotuloVencimentoBasicoFinal}</span>
                            <span className="block text-sm text-gray-500 dark:text-gray-400">{rotuloTetoGEPI}</span>
                            <span className="block text-sm text-gray-500 dark:text-gray-400">{rotuloTetoServidor}</span>
                        </div>
                        <div>
                            <h4 className="font-semibold text-lg mb-2 text-gray-700 dark:text-gray-300">Projeção Anual (aproximada)</h4>
                            <DetailRow label="Bruto Anual" value={(dadosAnuais.remuneracaoBruta * 12) + (4 * (dadosAnuais.remuneracaoBruta - dadosAnuais.vi) / 3) - (25 * valorVIDiaria)} />
                            <DetailRow label="Líquido Anual (c/ 13º e Férias)" value={(dadosAnuais.remuneracaoLiquida * 12) + (4 * (dadosAnuais.remuneracaoBruta - dadosAnuais.vi - dadosAnuais.descontoRPPS - dadosAnuais.descontoIR) / 3) - (25 * valorVIDiaria)} isTotal={true} />
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default DetalhesCalculo;