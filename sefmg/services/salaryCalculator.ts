
import type { SalaryInput, CalculationResult, SalaryDetails, YearlyData } from '../types';
import { CAREER_PROGRESSION, GEPI_VALUE, COST_ALLOWANCE_DAILY_RATE, IRRF_TABLE, DEPENDENT_DEDUCTION, PENSION_RATE, ANNUAL_FACTOR } from '../constants';

/**
 * Encontra o nível e salário base correspondente aos anos de serviço.
 */
const getCareerLevel = (yearsOfService: number) => {
  let currentLevel = CAREER_PROGRESSION[0];
  for (const level of CAREER_PROGRESSION) {
    if (yearsOfService >= level.years) {
      currentLevel = level;
    } else {
      break;
    }
  }
  return currentLevel;
};

/**
 * Calcula a dedução do Imposto de Renda (IRRF).
 */
const calculateIrrf = (taxableIncome: number): number => {
  for (const range of IRRF_TABLE) {
    if (taxableIncome <= range.maxIncome) {
      return (taxableIncome * range.rate) - range.deduction;
    }
  }
  return 0;
};

/**
 * Calcula os detalhes da remuneração para um determinado número de anos de serviço.
 */
const calculateSalaryForYearsOfService = (years: number, inputs: SalaryInput): SalaryDetails => {
  const { dependentsCount, costAllowanceDays } = inputs;
  
  const careerLevel = getCareerLevel(years);
  const baseSalary = careerLevel.baseSalary;
  const gepi = GEPI_VALUE;
  
  // A ajuda de custo é verba indenizatória, não entra na base de cálculo de impostos.
  const costAllowance = costAllowanceDays * COST_ALLOWANCE_DAILY_RATE;
  
  const taxableBase = baseSalary + gepi;
  
  // Cálculo da Previdência
  const pensionDeduction = taxableBase * PENSION_RATE;
  
  // Base de cálculo para o IRRF
  const irrfBase = taxableBase - pensionDeduction - (dependentsCount * DEPENDENT_DEDUCTION);
  
  // Cálculo do IRRF
  const irrfDeduction = calculateIrrf(irrfBase);
  
  const totalDeductions = pensionDeduction + irrfDeduction;
  const grossSalary = taxableBase + costAllowance;
  const netSalary = grossSalary - totalDeductions;

  return {
    grossSalary: Math.max(0, grossSalary),
    netSalary: Math.max(0, netSalary),
    baseSalary,
    gepi,
    costAllowance,
    pensionDeduction: Math.max(0, pensionDeduction),
    irrfDeduction: Math.max(0, irrfDeduction),
    totalDeductions: Math.max(0, totalDeductions),
  };
};

/**
 * Função principal que calcula a remuneração atual e a projeção para 30 anos.
 */
export const calculateCompleteSalary = (inputs: SalaryInput): CalculationResult => {
  // Calcula anos de serviço atuais
  const today = new Date();
  const startDate = new Date(inputs.startYear, inputs.startMonth - 1, 1);
  const diffTime = Math.abs(today.getTime() - startDate.getTime());
  const currentYearsOfService = diffTime / (1000 * 60 * 60 * 24 * 365.25);

  // Calcula remuneração atual
  const current = calculateSalaryForYearsOfService(currentYearsOfService, inputs);

  // Calcula projeção para os próximos 30 anos
  const projection: YearlyData[] = [];
  const initialYear = today.getFullYear();

  for (let i = 0; i <= 30; i++) {
    const projectedYearsOfService = currentYearsOfService + i;
    const careerLevel = getCareerLevel(projectedYearsOfService);
    
    // Calcula remuneração mensal para a projeção (sem ajuda de custo diária)
    const monthlyProjectionInputs = { ...inputs, costAllowanceDays: 0 };
    const monthlyDetails = calculateSalaryForYearsOfService(projectedYearsOfService, monthlyProjectionInputs);

    const grossAnnual = (monthlyDetails.baseSalary + monthlyDetails.gepi) * ANNUAL_FACTOR;
    const netAnnual = (grossAnnual - (monthlyDetails.pensionDeduction + monthlyDetails.irrfDeduction) * 12);
    
    projection.push({
      year: initialYear + i,
      yearsOfService: Math.floor(projectedYearsOfService),
      level: careerLevel.level,
      grossAnnual: grossAnnual,
      netAnnual: netAnnual,
    });
  }

  return { current, projection };
};
