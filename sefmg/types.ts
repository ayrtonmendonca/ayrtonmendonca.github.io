export interface parametrosDeCenario {
    posicaoCarreira: string;
    dependentes: number;
    diasTrabalhados: number;
    ajusteDeSalario: number;
    valorVIDiaria: number;
    salarioBaseSobreposto: number;
    pontosGEPI: number;
    valorPontoGEPI: number;
    filiadoAoSindicato: boolean;
    prevcom: boolean;
    percentualDeContribuicaoDaPrevcom: number;
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
}

export interface dadosAnuais extends detalhamentoMensal {
    ano: number;
    salarioLiquido: number;
}

export interface dadosGrafico {
    ano: number;
    [key: string]: number; // Cenario IDs map to their net salary
}