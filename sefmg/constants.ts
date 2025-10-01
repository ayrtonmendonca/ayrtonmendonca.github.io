export const ANOS_DE_PROJECAO = 30;
export const PALETA_DE_CORES = ['#3b82f6', '#ef4444', '#22c55e', '#f97316', '#8b5cf6', '#ec4899'];

export const NIVEL = ['I', 'II'];
export const GRAU = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
export const POSICAO_CARREIRA: string[] = NIVEL.flatMap(nivel => GRAU.map(grau => `${nivel}-${grau}`));


export const VENCIMENTO_BASICO = {
  data: [
    { nivel: 'I', grau: 'A', vb: 5975.21 },
    { nivel: 'I', grau: 'B', vb: 6154.48 },
    { nivel: 'I', grau: 'C', vb: 6339.11 },
    { nivel: 'I', grau: 'D', vb: 6529.28 },
    { nivel: 'I', grau: 'E', vb: 6725.17 },
    { nivel: 'I', grau: 'F', vb: 6926.91 },
    { nivel: 'I', grau: 'G', vb: 7134.72 },
    { nivel: 'I', grau: 'H', vb: 7348.76 },
    { nivel: 'I', grau: 'I', vb: 7569.23 },
    { nivel: 'I', grau: 'J', vb: 7796.30 },
    { nivel: 'II', grau: 'A', vb: 7469.03 },
    { nivel: 'II', grau: 'B', vb: 7767.78 },
    { nivel: 'II', grau: 'C', vb: 8078.48 },
    { nivel: 'II', grau: 'D', vb: 8401.63 },
    { nivel: 'II', grau: 'E', vb: 8737.70 },
    { nivel: 'II', grau: 'F', vb: 9087.20 },
    { nivel: 'II', grau: 'G', vb: 9450.69 },
    { nivel: 'II', grau: 'H', vb: 9828.72 },
    { nivel: 'II', grau: 'I', vb: 10221.88 },
    { nivel: 'II', grau: 'J', vb: 10630.75 }
  ],

  calcularVB(posicaoCarreira: string) {
    const [nivel, grau] = posicaoCarreira.split("-");
    return this.data.find((item) => item.nivel === nivel && item.grau === grau).vb ?? null;
  }
};

// Career Progression Logic
export const PRIMEIRA_PROGRESSAO = 3; // Progress to the next grade every 2 years
export const ANOS_PARA_PROGRESSAO = 2; // Progress to the next grade every 2 years
export const ANOS_PARA_PROMOCAO = 5; // Promote to the next level every 5 years

// Adicional de Desempenho (ADE) Logic
export const ADE = [
  { ano: 3, valor: 0.06 },
  { ano: 5, valor: 0.1 },
  { ano: 10, valor: 0.2 },
  { ano: 15, valor: 0.3 },
  { ano: 20, valor: 0.4 },
  { ano: 25, valor: 0.5 },
  { ano: 30, valor: 0.6 },
  { ano: 35, valor: 0.7 }
];

export const PONTOS_GEPI = 11000;
export const VALOR_PONTO_GEPI = 2.01; // in R$
export const VALOR_DIARIO_VI = 179.58; // Verba Indenizatória / Ajuda de Custo
export const TETO_GEPI = 4;

// RGPS Ceiling for PREVCOM calculation
export const TETO_RGPS = 8157.41; // As of 2024
export const PERCENTUAL_PREVCOM_PADRAO = 7.5;

// Teto serviço público
export const TETO_SERVIDOR_PUBLICO = 41845.49

// Simplified pension contribution faixas (MGPREV - RPPS)
export const FAIXAS_PENSAO = [
  { limite: 2005.58, taxa: 0.11, deducao: 0 },
  { limite: 3342.61, taxa: 0.12, deducao: 20.06 },
  { limite: 4679.67, taxa: 0.13, deducao: 53.48 },
  { limite: 6016.72, taxa: 0.14, deducao: 100.28 },
  { limite: 7353.76, taxa: 0.15, deducao: 160.45 },
  { limite: 8157.41, taxa: 0.155, deducao: 197.21 },
  { limite: Infinity, taxa: 0.16, deducao: 238 },
];

// IRRF faixas (monthly)
export const FAIXAS_IR = [
  { limite: 2428.8, taxa: 0, deducao: 0 },
  { limite: 2826.65, taxa: 0.075, deducao: 182.16 },
  { limite: 3751.05, taxa: 0.15, deducao: 394.16 },
  { limite: 4664.68, taxa: 0.225, deducao: 675.49 },
  { limite: Infinity, taxa: 0.275, deducao: 908.73 },
];

export const DEDUCAO_POR_DEPENDENTE = 189.59;

export const ANO_INGRESSO_PADRAO = 2024;
export const ULTIMA_PROGRESSAO_PADRAO = null;
export const ULTIMA_PROMOCAO_PADRAO = null;
export const POSICAO_CARREIRA_PADRAO = 'I-A';
export const REPIQUE_PADRAO = true;
export const CRESCIMENTO_GEPI_MEDIO_PADRAO = 4;

export const PARAMETROS_GLOBAIS_PADRAO = {
  posicaoCarreira: POSICAO_CARREIRA_PADRAO,
  anoIngresso: ANO_INGRESSO_PADRAO,
  valorPontoGEPI: VALOR_PONTO_GEPI,
  RGAMedio: 0,
  crescimentoGEPIMedio: CRESCIMENTO_GEPI_MEDIO_PADRAO,
  tetoGEPI: TETO_GEPI,
  tetoServidorPublico: TETO_SERVIDOR_PUBLICO,
  dependentes: 0,
  diasTrabalhados: 20,
  prevcom: true,
  percentualDeContribuicaoDaPrevcom: PERCENTUAL_PREVCOM_PADRAO,
  filiadoAoSindicato: false,
  anosProjecao: 35,
  ultimaPromocao: null,
  ultimaProgressao: null
};