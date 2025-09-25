export interface ScenarioParameters {
    level: string;
    dependents: number;
    workingDays: number;
    salaryAdjustment: number;
    viDailyValue: number;
    baseSalaryOverride: number;
    gepiPoints: number;
    gepiPointValue: number;
    gepiAdjustment: number;
    isSindifiscoMember: boolean;
    isPrevcomMember: boolean;
    prevcomContributionPercentage: number;
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
    gepiPointValue: number;
    vi: number;
    ade: number;
    pensionDiscount: number; // RPPS
    prevcomDiscount: number; // Complementary
    irDiscount: number;
    sindifiscoDiscount: number;
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