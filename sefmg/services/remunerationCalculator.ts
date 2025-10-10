import {
    Cenario,
    parametrosGlobais,
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

const calcularRPPS = (baseDeCalculo: number, fatorInflacao: number = 1): number => {
    for (const faixa of FAIXAS_PENSAO) {
        const limiteCorrigido = faixa.limite * fatorInflacao;
        const deducaoCorrigida = faixa.deducao * fatorInflacao;
        if (baseDeCalculo <= limiteCorrigido) {
            return baseDeCalculo * faixa.taxa - deducaoCorrigida;
        }
    }
    return 0; // Should not be reached
};

const calcularIR = (vencimentoBasico: number, fatorInflacao: number = 1): number => {
    for (const faixa of FAIXAS_IR) {
        const limiteCorrigido = faixa.limite * fatorInflacao;
        const deducaoCorrigida = faixa.deducao * fatorInflacao;
        if (vencimentoBasico <= limiteCorrigido) {
            return vencimentoBasico * faixa.taxa - deducaoCorrigida;
        }
    }
    return 0; // Should not be reached
};

// Novo tipo para ano/mês
type AnoMes = { ano: number, mes: number };

function diffMeses(inicio: AnoMes, fim: AnoMes): number {
    return (fim.ano - inicio.ano) * 12 + (fim.mes - inicio.mes);
}

function somarMeses(mes: AnoMes, mesesSomar: number): AnoMes {
    const totalMeses = mes.ano * 12 + (mes.mes - 1) + mesesSomar;
    const novoAno = Math.floor(totalMeses / 12);
    const novoMes = (totalMeses % 12) + 1;
    return { ano: novoAno, mes: novoMes };
}

const calcularPosicao = (posicaoAtual: string, anoMesIngresso: AnoMes, ultimaPromocao: AnoMes, ultimaProgressao: AnoMes, anoMesFuturo: AnoMes): string => {
    let [nivel, grau] = posicaoAtual.split("-");
    let idxNivel = NIVEL.indexOf(nivel);
    let idxGrau = GRAU.indexOf(grau);
    let anoMesAtual = { ano: new Date().getFullYear(), mes: new Date().getMonth() + 1 };

    // Se não vier, assume ingresso
    ultimaPromocao = ultimaPromocao ?? anoMesIngresso;
    ultimaProgressao = ultimaProgressao ?? anoMesIngresso;

    // Meses de serviço desde ingresso até futuro
    let mesesNoServico = diffMeses(anoMesIngresso, anoMesAtual);
    let mesesNoServicoFuturo = diffMeses(anoMesAtual, anoMesFuturo);

    //console.log(anoMesFuturo, mesesNoServico, mesesDesdePromocao, mesesDesdeProgressao);

    // Simula ano a ano (mês a mês, mas só avança se passou o tempo)
    for (let i = mesesNoServico; i <= mesesNoServico + mesesNoServicoFuturo; i++) {
        // Só considera progressão/promoção após 36 meses de serviço

        if (i < 36) continue;

        // Promoção: a cada ANOS_PARA_PROMOCAO anos + 3 anos de carência
        if (diffMeses(ultimaPromocao, somarMeses(anoMesIngresso, i)) >= (ANOS_PARA_PROMOCAO + 3) * 12) {

            if (idxNivel < NIVEL.length - 1) {
                idxNivel++;
                idxGrau = 0;
                // Atualiza datas
                ultimaPromocao = {
                    ano: anoMesIngresso.ano + Math.floor(i / 12),
                    mes: ((anoMesIngresso.mes + i - 1) % 12) + 1
                };
                ultimaProgressao = ultimaPromocao;
                nivel = NIVEL[idxNivel];
                grau = GRAU[idxGrau];
                ultimaPromocao = somarMeses(anoMesIngresso, i);
                ultimaProgressao = somarMeses(anoMesIngresso, i);
                continue;
            }
        }

        // Progressão: a cada ANOS_PARA_PROGRESSAO anos
        // if(anoMesFuturo.ano == 2027) console.log(ultimaProgressao, anoMesAtual, i, somarMeses(anoMesAtual, i));

        if (diffMeses(ultimaProgressao, somarMeses(anoMesIngresso, i)) >= (ANOS_PARA_PROGRESSAO) * 12) {

            if (idxGrau < GRAU.length - 1) {
                idxGrau++;
                ultimaProgressao = {
                    ano: anoMesIngresso.ano + Math.floor(i / 12),
                    mes: ((anoMesIngresso.mes + i - 1) % 12) + 1
                };
                nivel = NIVEL[idxNivel];
                grau = GRAU[idxGrau];
                ultimaProgressao = somarMeses(anoMesIngresso, i);
            }
        }
    }

    //console.log(posicaoAtual, anoMesIngresso, ultimaPromocao, ultimaProgressao, anoMesFuturo);
    return `${NIVEL[idxNivel]}-${GRAU[idxGrau]}`;
}

const calcularADE = (anosNoServico: number, mes: number): number => {
    console.log(anosNoServico, mes);
    if (mes < 10) anosNoServico -= 1;

    if (anosNoServico < ADE[0].ano) {
        return 0;
    }

    // Procura o maior ano que seja <= anosNoServico
    const adeEncontrado = [...ADE].reverse().find(item => anosNoServico >= item.ano);
    return adeEncontrado ? adeEncontrado.valor : 0;
};

export const calcularPorMes = (
    parametrosGlobais: parametrosGlobais, cenario: Cenario, anoMesFuturo: { ano: number, mes: number }): detalhamentoMensal => {

    // Inflação acumulada até o ano
    let inflacaoAcumulada = null;
    if (typeof parametrosGlobais.inflacaoMedia === 'number') {
        inflacaoAcumulada = ((1 + parametrosGlobais.inflacaoMedia / 100) ** anoMesFuturo.ano - 1) * 100;
    }

    const {
        valorVIDiaria,
        vencimentoBasicoInicial,
        repique,
        pontosGEPI,
    } = cenario.parametros;


    const {
        posicaoCarreira,
        anoIngresso,
        mesIngresso,
        ultimaPromocao,
        mesUltimaPromocao,
        ultimaProgressao,
        mesUltimaProgressao,
        RGAMedio,
        crescimentoGEPIMedio,
        valorPontoGEPI,
        diasTrabalhados,
        tetoGEPI,
        tetoServidorPublico,
        filiadoAoSindicato,
        prevcom,
        percentualDeContribuicaoDaPrevcom,
        dependentes,
        inflacaoMedia
    } = parametrosGlobais;

    // Inputs do calendário
    const anoMesIngresso = { ano: anoIngresso, mes: mesIngresso ?? 1 };
    const anoMesUltimaPromocao = { ano: ultimaPromocao ?? anoIngresso, mes: mesUltimaPromocao ?? mesIngresso ?? 1 };
    const anoMesUltimaProgressao = { ano: ultimaProgressao ?? anoIngresso, mes: mesUltimaProgressao ?? mesIngresso ?? 1 };

    // console.log(anoMesIngresso, anoMesUltimaPromocao, anoMesUltimaProgressao, anoMesFuturo);
    // Calcula diferença de anos para reajustes e ADE
    const diffAnos = anoMesFuturo.ano - anoMesIngresso.ano;

    const posicaoEfetiva = calcularPosicao(
        posicaoCarreira,
        anoMesIngresso,
        anoMesUltimaPromocao,
        anoMesUltimaProgressao,
        anoMesFuturo
    );

    // Usa o ano do anoMesFuturo para cálculo do ADE
    const percentualADE = calcularADE(diffMeses(anoMesIngresso, anoMesFuturo) / 12, anoMesFuturo.mes);

    const reajusteRGA = (1 + (RGAMedio / 100)) ** diffAnos;
    const reajusteGEPI = (1 + (crescimentoGEPIMedio / 100)) ** diffAnos;
    const fatorInflacao = (1 + (inflacaoMedia / 100)) ** diffAnos;

    const tetoServidorPublicoCorrigido = tetoServidorPublico * fatorInflacao;

    // Calculate components
    const vencimentoBasicoParaPosicaoEfetiva = (VENCIMENTO_BASICO.calcularVB(posicaoEfetiva) || 0);

    const fatorMultiplicacao = vencimentoBasicoInicial / VENCIMENTO_BASICO.calcularVB('I-A');
    const fatorSoma = vencimentoBasicoInicial - VENCIMENTO_BASICO.calcularVB('I-A');

    const vencimentoBasicoParaPosicaoEfetivaCorrigido = repique ? vencimentoBasicoParaPosicaoEfetiva * fatorMultiplicacao : vencimentoBasicoParaPosicaoEfetiva + fatorSoma;
    const vencimentoBasicoFinalCorrigido = (repique ? VENCIMENTO_BASICO.calcularVB('II-J') * fatorMultiplicacao : VENCIMENTO_BASICO.calcularVB('II-J') + fatorSoma) * reajusteRGA;
    const vencimentoBasicoInicialCorrigido = vencimentoBasicoInicial * reajusteRGA;

    const pontoGEPIAjustado = valorPontoGEPI * reajusteRGA * reajusteGEPI;
    const vencimentoBasico = vencimentoBasicoParaPosicaoEfetivaCorrigido * reajusteRGA;
    const ade = vencimentoBasico * percentualADE;
    const gepi = pontosGEPI * pontoGEPIAjustado;
    const vi = diasTrabalhados * valorVIDiaria;
    const abateTetoGepi = Math.max(gepi - tetoGEPI * vencimentoBasicoFinalCorrigido, 0);
    const gepiEfetiva = gepi - abateTetoGepi;
    const abateTetoServidorPublico = Math.max((vencimentoBasico + gepiEfetiva + ade) - tetoServidorPublicoCorrigido, 0);

    const remuneracaoBruta = vencimentoBasico + gepi + ade + vi;
    const remuneracaoTributavel = vencimentoBasico + gepi + ade - abateTetoGepi - abateTetoServidorPublico;

    const descontoSindifisco = filiadoAoSindicato ? (VENCIMENTO_BASICO.calcularVB('I-A') + Math.min(gepi, tetoGEPI * VENCIMENTO_BASICO.calcularVB('II-J'))) * 0.01 : 0;

    // Pension Calculations
    let descontoRPPS = 0;
    let descontoPrevcom = 0;

    if (prevcom) {
        const baseRPPS = Math.min(remuneracaoTributavel, TETO_RGPS * fatorInflacao);
        descontoRPPS = calcularRPPS(baseRPPS, fatorInflacao);

        const prevcomBase = Math.max(0, remuneracaoTributavel - TETO_RGPS * fatorInflacao);
        descontoPrevcom = prevcomBase * (percentualDeContribuicaoDaPrevcom / 100);
    } else {
        descontoRPPS = calcularRPPS(remuneracaoTributavel, fatorInflacao);
    }

    const deducaoDependentes = dependentes * DEDUCAO_POR_DEPENDENTE;
    const irBaseDeCalculo = remuneracaoTributavel - descontoRPPS - deducaoDependentes;
    const descontoIR = calcularIR(Math.max(0, irBaseDeCalculo), fatorInflacao);

    const remuneracaoLiquida = remuneracaoBruta - descontoRPPS - descontoPrevcom - descontoIR - descontoSindifisco - abateTetoGepi - abateTetoServidorPublico;

    return {
        remuneracaoBruta,
        remuneracaoLiquida,
        vencimentoBasico,
        remuneracaoTributavel,
        gepi,
        valorPontoGEPI: pontoGEPIAjustado,
        vi,
        percentualADE,
        diasTrabalhados,
        ade,
        descontoRPPS,
        descontoPrevcom,
        descontoIR,
        descontoSindifisco,
        abateTetoGepi,
        abateTeto: abateTetoServidorPublico,
        posicaoCarreira: posicaoEfetiva,
        tetoGEPICorrigido: tetoGEPI * vencimentoBasicoFinalCorrigido,
        tetoServidorPublicoCorrigido,
        vencimentoBasicoFinalCorrigido,
        vencimentoBasicoInicialCorrigido,
        inflacaoAcumulada: (fatorInflacao - 1)
    };
};


export const calcularProjecaoAnual = (parametrosGlobais: parametrosGlobais, cenario: Cenario): dadosAnuais[] => {
    const projecao: dadosAnuais[] = [];
    const anoAtual = new Date().getFullYear();
    const mesAtual = new Date().getMonth() + 1;

    for (let i = 0; i < parametrosGlobais.anosProjecao * 12; i++) {
        // Calcula ano/mês futuro para cada projeção
        const anoMesFuturo = { ano: anoAtual + ~~((mesAtual + i) / 12) - 1, mes: (mesAtual + i) % 12 + 1 };
        const resultadosMensais = calcularPorMes(parametrosGlobais, cenario, anoMesFuturo);
        projecao.push({
            ano: anoMesFuturo.ano,
            mes: anoMesFuturo.mes,
            ...resultadosMensais
        });
    }

    return projecao;
};