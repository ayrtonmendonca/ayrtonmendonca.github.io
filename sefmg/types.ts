
export interface SalaryInput {
  startYear: number;
  startMonth: number;
  hasDependents: boolean;
  dependentsCount: number;
  costAllowanceDays: number;
}

export interface SalaryDetails {
  grossSalary: number;
  netSalary: number;
  baseSalary: number;
  gepi: number;
  costAllowance: number;
  pensionDeduction: number;
  irrfDeduction: number;
  totalDeductions: number;
}

export interface CalculationResult {
  current: SalaryDetails;
  projection: YearlyData[];
}

export interface YearlyData {
  year: number;
  yearsOfService: number;
  level: string;
  grossAnnual: number;
  netAnnual: number;
}
