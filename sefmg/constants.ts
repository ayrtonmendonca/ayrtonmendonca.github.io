
// Tabela de Vencimento Básico - Auditor Fiscal da Receita Estadual MG (AFRE)
// Valores simulados baseados em progressão de carreira.
// A estrutura real pode ser mais complexa.
export const BASE_SALARY_TABLE: { [level: string]: number } = {
  'I-A': 10000, 'I-B': 10300, 'I-C': 10609, 'I-D': 10927,
  'II-A': 12000, 'II-B': 12360, 'II-C': 12731, 'II-D': 13113,
  'III-A': 14500, 'III-B': 14935, 'III-C': 15383, 'III-D': 15845,
  'IV-A': 17000, 'IV-B': 17510, 'IV-C': 18035, 'IV-D': 18576, 'IV-E': 19133, 'IV-F': 19707
};

// Mapeia anos de serviço para um nível de carreira.
// Simplificação: uma progressão a cada 2 anos.
export const CAREER_PROGRESSION: { years: number, level: string }[] = [
  { years: 0, level: 'I-A' }, { years: 2, level: 'I-B' }, { years: 4, level: 'I-C' }, { years: 6, level: 'I-D' },
  { years: 8, level: 'II-A' }, { years: 10, level: 'II-B' }, { years: 12, level: 'II-C' }, { years: 14, level: 'II-D' },
  { years: 16, level: 'III-A' }, { years: 18, level: 'III-B' }, { years: 20, level: 'III-C' }, { years: 22, level: 'III-D' },
  { years: 24, level: 'IV-A' }, { years: 26, level: 'IV-B' }, { years: 28, level: 'IV-C' }, { years: 30, level: 'IV-D' },
  { years: 32, level: 'IV-E' }, { years: 34, level: 'IV-F' }
];

// Gratificação de Estímulo à Produção Individual (GEPI)
// Valor fixo para simplificação, mas é uma parte crucial da remuneração.
export const GEPI_VALUE = 20000.00;

// Auxílios e Ajudas
export const MEAL_ALLOWANCE_PER_DAY = 75.00;
export const WORKING_DAYS_PER_MONTH = 22;
export const COST_ALLOWANCE_PER_DAY = 150.00;

// Deduções
export const PENSION_CONTRIBUTION_RATE = 0.14; // Contribuição Previdenciária (simplificado)
export const DEDUCTION_PER_DEPENDENT_IR = 189.59; // Dedução por dependente para IRRF

// Tabela de Imposto de Renda Retido na Fonte (IRRF) - Valores Mensais
export const IRRF_TABLE = [
  { limit: 2259.20, rate: 0, deduction: 0 },
  { limit: 2826.65, rate: 0.075, deduction: 169.44 },
  { limit: 3751.05, rate: 0.15, deduction: 381.44 },
  { limit: 4664.68, rate: 0.225, deduction: 662.77 },
  { limit: Infinity, rate: 0.275, deduction: 896.00 }
];
