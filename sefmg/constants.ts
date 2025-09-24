
// Níveis da carreira, com progressão estimada a cada 2 anos.
// Os valores são representativos para a simulação.
export const CAREER_PROGRESSION = [
  { years: 0, level: 'I-A', baseSalary: 6155.78 },
  { years: 2, level: 'I-B', baseSalary: 6771.36 },
  { years: 4, level: 'I-C', baseSalary: 7448.49 },
  { years: 6, level: 'I-D', baseSalary: 8193.34 },
  { years: 8, level: 'II-A', baseSalary: 9012.67 },
  { years: 10, level: 'II-B', baseSalary: 9913.94 },
  { years: 12, level: 'II-C', baseSalary: 10905.33 },
  { years: 14, level: 'II-D', baseSalary: 11995.87 },
  { years: 16, level: 'III-A', baseSalary: 13195.45 },
  { years: 18, level: 'III-B', baseSalary: 14515.00 },
  { years: 20, level: 'III-C', baseSalary: 15966.50 },
  { years: 22, level: 'III-D', baseSalary: 17563.15 },
  { years: 24, level: 'IV-A', baseSalary: 19319.46 },
  { years: 26, level: 'IV-B', baseSalary: 21251.41 },
  { years: 28, level: 'IV-C', baseSalary: 23376.55 },
  { years: 30, level: 'IV-D', baseSalary: 25714.21 },
];

// Gratificação de Estímulo à Produção Individual (valor fixo estimado)
export const GEPI_VALUE = 19500.00;

// Valor diário da ajuda de custo (estimado)
export const COST_ALLOWANCE_DAILY_RATE = 179.00;

// Tabela do Imposto de Renda Retido na Fonte (Vigente a partir de Fev/2024)
export const IRRF_TABLE = [
  { maxIncome: 2259.20, rate: 0, deduction: 0 },
  { maxIncome: 2826.65, rate: 0.075, deduction: 169.44 },
  { maxIncome: 3751.05, rate: 0.15, deduction: 381.44 },
  { maxIncome: 4664.68, rate: 0.225, deduction: 662.77 },
  { maxIncome: Infinity, rate: 0.275, deduction: 896.00 },
];

// Valor da dedução por dependente para IRRF
export const DEPENDENT_DEDUCTION = 189.59;

// Alíquota de contribuição previdenciária (simplificada)
export const PENSION_RATE = 0.14;

// Fator para cálculo de remuneração anual (12 salários + 13º + 1/3 de férias)
export const ANNUAL_FACTOR = (12 + 1 + 1/3);
