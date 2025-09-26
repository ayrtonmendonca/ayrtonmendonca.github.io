import {
    Cenario,
    dadosAnuais,
    detalhamentoMensal
} from '../types';
import {
    VENCIMENTO_BASICO,
    FAIXAS_PENSAO,
    FAIXAS_IR,
    DEDUCAO_POR_DEPENDENTE,
    NIVEL,
    GRAU,
    ANOS_PARA_PROGRESSAO,
    ANOS_PARA_PROMOCAO,
    ADE,
    TETO_RGPS,
    TETO_GEPI,
    TETO_SERVIDOR_PUBLICO
} from '../constants';

const calcularRPPS = (baseDeCalculo: number): number => {

    for (const faixa of FAIXAS_PENSAO) {
        if (baseDeCalculo <= faixa.limite) {
            return baseDeCalculo * faixa.taxa - faixa.deducao;
        }
    }
    return 0; // Should not be reached
};

const calcularIR = (salarioBase: number): number => {
    for (const faixa of FAIXAS_IR) {
        if (salarioBase <= faixa.limite) {
            return salarioBase * faixa.taxa - faixa.deducao;
        }
    }
    return 0; // Should not be reached
};

const calcularPosicao = (posicaoAtual: string, anosNoServico: number, ultimaPromocao: number, ultimaProgressao: number, anoFuturo: number): string => {
    let [nivel, grau] = posicaoAtual.split("-");
    let idxNivel = NIVEL.indexOf(nivel);
    let idxGrau = GRAU.indexOf(grau);
    let anoAtual = new Date().getFullYear();

    for (let ano = anoAtual + 1; ano <= anoFuturo; ano++) {
        anosNoServico++;
        if (anosNoServico < 3) {
            continue;
        }

        if (ano - ultimaPromocao >= ANOS_PARA_PROMOCAO + 3) {
            if (idxNivel < NIVEL.length - 1) {
                idxNivel++;
                idxGrau = 0; // volta pro grau A
                ultimaPromocao = ano;
                ultimaProgressao = ano; // reseta junto
                nivel = NIVEL[idxNivel];
                grau = GRAU[idxGrau];
                continue; // se promoveu, não progride no mesmo ano
            }
        }

        if (ano - ultimaProgressao >= ANOS_PARA_PROGRESSAO) {
            if (idxGrau < GRAU.length - 1) {
                idxGrau++;
                ultimaProgressao = ano;
                nivel = NIVEL[idxNivel];
                grau = GRAU[idxGrau];
            }
        }
    }
    return `${NIVEL[idxNivel]}-${GRAU[idxGrau]}`;
}

const calcularADE = (anosNoServico: number): number => {
    if (anosNoServico < ADE[0].ano) {
        return 0;
    }

    // Procura o maior ano que seja <= anosNoServico
    const adeEncontrado = [...ADE].reverse().find(item => anosNoServico >= item.ano);
    return adeEncontrado ? adeEncontrado.valor : 0;
};

export const calcularPorAno = (cenario: Cenario, anoFuturo: number): detalhamentoMensal => {
    const {
        posicaoCarreira,
        dependentes,
        diasTrabalhados,
        ajusteDeSalario,
        valorVIDiaria,
        pontosGEPI,
        salarioBaseSobreposto,
        valorPontoGEPI,
        filiadoAoSindicato,
        prevcom,
        percentualDeContribuicaoDaPrevcom,
        anoIngresso,
        ultimaPromocao,
        ultimaProgressao
    } = cenario.parametros;


    // Determine dynamic values for the given year
    //posicaoAtual: string, anosNoServico: number, ultimaPromocao: number, ultimaProgressao: number, anoFuturo: number
    console.log(cenario.parametros);
    const posicaoEfetiva = calcularPosicao(posicaoCarreira, anoIngresso, ultimaPromocao, ultimaProgressao, anoFuturo);
    const percentualADE = calcularADE(anoFuturo - anoIngresso);

    // Calculate components
    const salarioBaseParaPosicaoEfetiva = (VENCIMENTO_BASICO[posicaoEfetiva] || 0);
    const fatorMultiplicacao = salarioBaseSobreposto / VENCIMENTO_BASICO[posicaoCarreira];
    const salarioBaseParaPosicaoEfetivaCorrigido = salarioBaseParaPosicaoEfetiva * fatorMultiplicacao;

    const reajusteImediato = 1 + (ajusteDeSalario / 100);
    const pontoGEPIAjustado = valorPontoGEPI * reajusteImediato;

    const salarioBase = salarioBaseParaPosicaoEfetivaCorrigido * reajusteImediato;
    const ade = salarioBase * percentualADE;
    const gepi = pontosGEPI * pontoGEPIAjustado;
    const vi = diasTrabalhados * valorVIDiaria;
    const abateTetoGepi = Math.min(TETO_GEPI * VENCIMENTO_BASICO['II-J'] - gepi, 0);
    const abateTetoServidorPublico = Math.min(salarioBase + gepi + ade - abateTetoGepi - TETO_SERVIDOR_PUBLICO, 0);

    const rendaTributavel = salarioBase + gepi + ade - abateTetoGepi - abateTetoServidorPublico;
    const salarioBruto = rendaTributavel + vi;

    const descontoSindifisco = filiadoAoSindicato ? (VENCIMENTO_BASICO['I-A'] + Math.min(gepi, TETO_GEPI * VENCIMENTO_BASICO['II-J'])) * 0.01 : 0;

    // Pension Calculations
    let descontoRPPS = 0;
    let descontoPrevcom = 0;

    if (prevcom) {
        const baseRPPS = Math.min(rendaTributavel, TETO_RGPS);
        descontoRPPS = calcularRPPS(baseRPPS);

        const prevcomBase = Math.max(0, rendaTributavel - TETO_RGPS);
        descontoPrevcom = prevcomBase * (percentualDeContribuicaoDaPrevcom / 100);
    } else {
        descontoRPPS = calcularRPPS(rendaTributavel);
    }

    const dependentesDeduction = dependentes * DEDUCAO_POR_DEPENDENTE;
    const irbaseDeCalculo = rendaTributavel - descontoRPPS - descontoPrevcom - dependentesDeduction;

    const descontoIR = calcularIR(Math.max(0, irbaseDeCalculo));

    const salarioLiquido = salarioBruto - descontoRPPS - descontoPrevcom - descontoIR - descontoSindifisco;

    return {
        salarioBruto,
        salarioLiquido,
        salarioBase,
        gepi,
        valorPontoGEPI: pontoGEPIAjustado,
        vi,
        ade,
        descontoRPPS,
        descontoPrevcom,
        descontoIR,
        descontoSindifisco,
        abateTetoGepi,
        abateTeto: abateTetoServidorPublico,
        posicaoCarreira: posicaoEfetiva    
    };
};


export const calcularProjecaoAnual = (cenario: Cenario, years: number): dadosAnuais[] => {
    const projecao: dadosAnuais[] = [];
    const anoAtual = new Date().getFullYear();

    for (let i = 0; i < years; i++) {
        const resultadosAnuais = calcularPorAno(cenario, i);
        projecao.push({
            ano: anoAtual + i,
            ...resultadosAnuais,
        });
    }

    return projecao;
};