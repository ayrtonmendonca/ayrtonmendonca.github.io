
export interface ScenarioParameters {
    level: string;
    dependents: number;
    workingDays: number;
    salaryAdjustment: number;
    gepiAdjustment: number;
    viAdjustment: number;
}

export interface Scenario {
    id: string;
    name: string;
    color: string;
    parameters: ScenarioParameters;
}

export interface MonthlyBreakdown {
    grossSalary: number;
    netSalary: number;

    baseSalary: number;
    gepi: number;
    vi: number;
    ade: number;
    pensionDiscount: number;
    irDiscount: number;
    level: string;
}

export interface AnnualData extends MonthlyBreakdown {
    year: number;
    netSalary: number;
}

export interface ChartData {
    year: number;
    [key: string]: number; // Scenario IDs map to their net salary
}
