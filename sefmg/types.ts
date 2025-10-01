export interface parametrosDeCenario {
    valorVIDiaria: number;
    salarioBaseInicial: number;
    repique: boolean;
    pontosGEPI: number;
}

export interface parametrosGlobais {
    posicaoCarreira: string;
    dependentes: number;
    diasTrabalhados: number;
    valorPontoGEPI: number;
    RGAMedio: number;
    crescimentoGEPIMedio: number;
    tetoGEPI: number;
    tetoServidorPublico: number;
    filiadoAoSindicato: boolean;
    prevcom: boolean;
    percentualDeContribuicaoDaPrevcom: number;
    anosProjecao: number;
    anoIngresso: number;
    ultimaPromocao: number;
    ultimaProgressao: number;
}

export interface Cenario {
    id: string;
    nome: string;
    cor: string;
    parametros: parametrosDeCenario;
}

export interface detalhamentoMensal {
    salarioBruto: number;
    salarioLiquido: number;
    salarioBase: number;
    gepi: number;
    valorPontoGEPI: number;
    vi: number;
    ade: number;
    descontoRPPS: number; // RPPS
    descontoPrevcom: number; // Complementary
    descontoIR: number;
    descontoSindifisco: number;
    abateTetoGepi: number;
    abateTeto: number;
    posicaoCarreira: string;
    percentualADE: number;
}

export interface dadosAnuais extends detalhamentoMensal {
    ano: number;
    salarioLiquido: number;
}

export interface dadosGrafico {
    ano: number;
    [key: string]: number; // Cenario IDs map to their net salary
}