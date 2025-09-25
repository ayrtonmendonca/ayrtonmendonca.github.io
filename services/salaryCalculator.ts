
import { SimulationInput, SalaryDetails, SalaryProjection, SimulationResult } from '../types';
import {
  BASE_SALARY_TABLE,
  CAREER_PROGRESSION,
  GEPI_VALUE,
  MEAL_ALLOWANCE_PER_DAY,
  WORKING_DAYS_PER_MONTH,
  COST_ALLOWANCE_PER_DAY,
  PENSION_CONTRIBUTION_RATE,
  DEDUCTION_PER_DEPENDENT_IR,
  IRRF_TABLE
} from '../constants';

const getCareerLevel = (yearsOfService: number): string => {
  let level = CAREER_PROGRESSION[0].level;
  for (const progress of CAREER_PROGRESSION) {
    if (yearsOfService >= progress.years) {
      level = progress.level;
    } else {
      break;
    }
  }
  return level;
};

const calculateMonthlySalary = (yearsOfService: number, dependents: number, allowanceDays: number): SalaryDetails => {
  const careerLevel = getCareerLevel(yearsOfService);
  const baseSalary = BASE_SALARY_TABLE[careerLevel] || 0;
  const gepi = GEPI_VALUE;
  const mealAllowance = MEAL_ALLOWANCE_PER_DAY * WORKING_DAYS_PER_MONTH;
  const costAllowance = COST_ALLOWANCE_PER_DAY * allowanceDays;

  const grossSalary = baseSalary + gepi + mealAllowance + costAllowance;

  // Cálculo da Previdência
  const pension = grossSalary * PENSION_CONTRIBUTION_RATE;

  // Cálculo do Imposto de Renda
  const taxableBase = grossSalary - pension - (dependents * DEDUCTION_PER_DEPENDENT_IR);
  
  let incomeTax = 0;
  for (const tier of IRRF_TABLE) {
    if (taxableBase <= tier.limit) {
      incomeTax = (taxableBase * tier.rate) - tier.deduction;
      break;
    }
  }
  incomeTax = Math.max(0, incomeTax);

  const totalDeductions = pension + incomeTax;
  const netSalary = grossSalary - totalDeductions;

  return {
    grossSalary,
    netSalary,
    deductions: {
      pension,
      incomeTax,
      total: totalDeductions,
    },
    details: {
      baseSalary,
      gepi,
      mealAllowance,
      costAllowance,
      careerLevel,
      yearsOfService,
    },
  };
};

export const calculateSalaryProjection = (inputs: SimulationInput): SimulationResult => {
  const today = new Date();
  const start = new Date(inputs.startYear, inputs.startMonth - 1, 1);
  const diffTime = Math.abs(today.getTime() - start.getTime());
  const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
  const initialYearsOfService = Math.floor(diffYears);

  const currentSalary = calculateMonthlySalary(initialYearsOfService, inputs.dependents, inputs.allowanceDays);
  
  const projection: SalaryProjection[] = [];
  for (let i = 0; i < 31; i++) {
    const yearsOfService = initialYearsOfService + i;
    const careerLevel = getCareerLevel(yearsOfService);
    const baseSalary = BASE_SALARY_TABLE[careerLevel] || 0;
    
    // Simplificação: Auxílios não contam para o 13º
    const annualBaseRemuneration = (baseSalary + GEPI_VALUE) * 13;
    const annualAllowances = (MEAL_ALLOWANCE_PER_DAY * WORKING_DAYS_PER_MONTH) * 12;
    // Ajuda de custo considerada apenas no primeiro ano para a projeção
    const annualCostAllowance = i === 0 ? (COST_ALLOWANCE_PER_DAY * inputs.allowanceDays * 12) : 0;
    
    const annualGross = annualBaseRemuneration + annualAllowances + annualCostAllowance;
    
    // Projeção simplificada de deduções anuais
    const annualPension = annualGross * PENSION_CONTRIBUTION_RATE;
    const annualTaxableBase = annualGross - annualPension - (inputs.dependents * DEDUCTION_PER_DEPENDENT_IR * 12);
    
    // Simplificando o cálculo anual do IR
    const monthlyEquivalentTaxable = annualTaxableBase / 12;
    let monthlyIR = 0;
    for (const tier of IRRF_TABLE) {
        if (monthlyEquivalentTaxable <= tier.limit) {
            monthlyIR = (monthlyEquivalentTaxable * tier.rate) - tier.deduction;
            break;
        }
    }
    monthlyIR = Math.max(0, monthlyIR);
    const annualIncomeTax = monthlyIR * 12;

    const annualNet = annualGross - annualPension - annualIncomeTax;
    
    projection.push({
      year: today.getFullYear() + i,
      annualGross,
      annualNet,
      careerLevel,
    });
  }
  
  return {
    currentSalary,
    projection,
  };
};
