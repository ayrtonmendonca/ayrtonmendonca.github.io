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

const calcularPosicao = (posicaoAtual: string, anoIngresso: number, ultimaPromocao: number, ultimaProgressao: number, anoFuturo: number): string => {
    let [nivel, grau] = posicaoAtual.split("-");
    let idxNivel = NIVEL.indexOf(nivel);
    let idxGrau = GRAU.indexOf(grau);
    let anoAtual = new Date().getFullYear();
    ultimaPromocao = ultimaPromocao ?? anoIngresso;
    ultimaProgressao = ultimaProgressao ?? anoIngresso;

    let anosNoServico = anoAtual - anoIngresso;
    anoFuturo = anoAtual + anoFuturo;

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
    // console.log(anoFuturo);
    // console.log(`${NIVEL[idxNivel]}-${GRAU[idxGrau]}`);
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
    console.log(cenario.parametros);
    const {
        posicaoCarreira,
        dependentes,
        diasTrabalhados,
        RGAMedio,
        crescimentoGEPIMedio,
        tetoGEPI,
        tetoServidorPublico,
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

    const posicaoEfetiva = calcularPosicao(posicaoCarreira, anoIngresso, ultimaPromocao, ultimaProgressao, anoFuturo);
    let anoAtual = new Date().getFullYear();

    const percentualADE = calcularADE(anoAtual + anoFuturo - anoIngresso);

    // Calculate components
    const salarioBaseParaPosicaoEfetiva = (VENCIMENTO_BASICO.calcularVB(posicaoEfetiva) || 0);
    const fatorMultiplicacao = salarioBaseSobreposto / VENCIMENTO_BASICO.calcularVB(posicaoCarreira);
    const salarioBaseParaPosicaoEfetivaCorrigido = salarioBaseParaPosicaoEfetiva * fatorMultiplicacao;

    const reajusteRGA = (1 + (RGAMedio / 100)) ** anoFuturo;
    const reajusteGEPI = (1 + (crescimentoGEPIMedio / 100)) ** anoFuturo;

    const pontoGEPIAjustado = valorPontoGEPI * reajusteRGA * reajusteGEPI;

    const salarioBase = salarioBaseParaPosicaoEfetivaCorrigido * reajusteRGA;
    const ade = salarioBase * percentualADE;
    const gepi = pontosGEPI * pontoGEPIAjustado;
    const vi = diasTrabalhados * valorVIDiaria;
    const abateTetoGepi = Math.max(gepi - tetoGEPI * VENCIMENTO_BASICO.calcularVB('II-J'), 0);
    const gepiEfetiva = gepi - abateTetoGepi;
    const abateTetoServidorPublico = Math.max((salarioBase + gepiEfetiva + ade) - tetoServidorPublico, 0);

    const salarioBruto = salarioBase + gepi + ade + vi;
    const rendaTributavel = salarioBase + gepi + ade - abateTetoGepi - abateTetoServidorPublico;

    const descontoSindifisco = filiadoAoSindicato ? (VENCIMENTO_BASICO.calcularVB('I-A') + Math.min(gepi, tetoGEPI * VENCIMENTO_BASICO.calcularVB('II-J'))) * 0.01 : 0;
    
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

    const deducaoDependentes = dependentes * DEDUCAO_POR_DEPENDENTE;
    const irBaseDeCalculo = rendaTributavel - descontoRPPS - descontoPrevcom - deducaoDependentes;

    const descontoIR = calcularIR(Math.max(0, irBaseDeCalculo));

    const salarioLiquido = salarioBruto - descontoRPPS - descontoPrevcom - descontoIR - descontoSindifisco - abateTetoGepi - abateTetoServidorPublico;

    
    console.log([
        {posicaoEfetiva},
        {percentualADE},
        {salarioBaseParaPosicaoEfetiva},
        {fatorMultiplicacao},
        {salarioBaseParaPosicaoEfetivaCorrigido},
        {reajusteRGA},
        {pontoGEPIAjustado},
        {salarioBase},
        {ade},
        {gepi},
        {vi},
        {abateTetoGepi},
        {abateTetoServidorPublico},
        {rendaTributavel},
        {salarioBruto},
        {descontoSindifisco},
        {descontoRPPS},
        {deducaoDependentes},
        {irBaseDeCalculo},
        {descontoIR},
        {salarioLiquido}
    ]);

    console.log({
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
    });

    return {
        salarioBruto,
        salarioLiquido,
        salarioBase,
        gepi,
        valorPontoGEPI: pontoGEPIAjustado,
        vi,
        percentualADE,
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


export const calcularProjecaoAnual = (cenario: Cenario, anos: number): dadosAnuais[] => {
    const projecao: dadosAnuais[] = [];
    const anoAtual = new Date().getFullYear();

    for (let i = 0; i < anos; i++) {
        const resultadosAnuais = calcularPorAno(cenario, i);
        projecao.push({
            ano: anoAtual + i,
            ...resultadosAnuais,
        });
    }

    return projecao;
};