
export interface SimulationInput {
  startYear: number;
  startMonth: number;
  dependents: number;
  allowanceDays: number;
}

export interface SalaryDetails {
  grossSalary: number;
  netSalary: number;
  deductions: {
    pension: number;
    incomeTax: number;
    total: number;
  };
  details: {
    baseSalary: number;
    gepi: number;
    mealAllowance: number;
    costAllowance: number;
    careerLevel: string;
    yearsOfService: number;
  };
}

export interface SalaryProjection {
  year: number;
  annualGross: number;
  annualNet: number;
  careerLevel: string;
}

export interface SimulationResult {
  currentSalary: SalaryDetails;
  projection: SalaryProjection[];
}
