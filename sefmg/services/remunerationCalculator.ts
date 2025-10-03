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

export const calcularPorAno = (parametrosGlobais: parametrosGlobais, cenario: Cenario, anoFuturo: number): detalhamentoMensal => {
    // Inflação acumulada até o ano
    let inflacaoAcumulada = null;
    if (typeof parametrosGlobais.inflacaoMedia === 'number') {
        inflacaoAcumulada = ((1 + parametrosGlobais.inflacaoMedia / 100) ** anoFuturo - 1) * 100;
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
        ultimaPromocao,
        ultimaProgressao,
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

    console.log()

    // Calcula inflação acumulada até o ano em questão

    // Determine dynamic values for the given year
    //posicaoAtual: string, anosNoServico: number, ultimaPromocao: number, ultimaProgressao: number, anoFuturo: number

    // Calcula inflação acumulada até o ano em questão

    const posicaoEfetiva = calcularPosicao(posicaoCarreira, anoIngresso, ultimaPromocao, ultimaProgressao, anoFuturo);
    let anoAtual = new Date().getFullYear();

    const percentualADE = calcularADE(anoAtual + anoFuturo - anoIngresso);

    const reajusteRGA = (1 + (RGAMedio / 100)) ** anoFuturo;
    const reajusteGEPI = (1 + (crescimentoGEPIMedio / 100)) ** anoFuturo;
    const fatorInflacao = (1 + (inflacaoMedia / 100)) ** anoFuturo;

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
    console.log()
    const descontoIR = calcularIR(Math.max(0, irBaseDeCalculo), fatorInflacao);

    const remuneracaoLiquida = remuneracaoBruta - descontoRPPS - descontoPrevcom - descontoIR - descontoSindifisco - abateTetoGepi - abateTetoServidorPublico;

    /*
        console.log([
            { posicaoEfetiva },
            { percentualADE },
            { vencimentoBasicoParaPosicaoEfetiva },
            { fatorMultiplicacao },
            { vencimentoBasicoParaPosicaoEfetivaCorrigido },
            { reajusteRGA },
            { pontoGEPIAjustado },
            { vencimentoBasico },
            { ade },
            { gepi },
            { vi },
            { abateTetoGepi },
            { abateTetoServidorPublico },
            { remuneracaoTributavel },
            { remuneracaoBruta },
            { descontoSindifisco },
            { descontoRPPS },
            { deducaoDependentes },
            { irBaseDeCalculo },
            { descontoIR },
            { remuneracaoLiquida }
        ]);
    
        console.log({
            remuneracaoBruta,
            remuneracaoLiquida,
            vencimentoBasico,
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
    */
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

    for (let i = 0; i < parametrosGlobais.anosProjecao; i++) {
        const resultadosAnuais = calcularPorAno(parametrosGlobais, cenario, i);
        projecao.push({
            ano: anoAtual + i,
            ...resultadosAnuais
        });
    }

    return projecao;
};