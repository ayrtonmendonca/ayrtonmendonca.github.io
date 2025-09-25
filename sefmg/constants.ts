
export const PROJECTION_YEARS_DEFAULT = 30;
export const SCENARIO_COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#f97316', '#8b5cf6', '#ec4899'];

const levels = ['I', 'II', 'III', 'IV'];
const grades = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
export const CAREER_POSITIONS: string[] = levels.flatMap(level => grades.map(grade => `${level}-${grade}`));

export const BASE_SALARIES: { [key: string]: number } = {
    'I-A': 6368.82, 'I-B': 6687.26, 'I-C': 7021.62, 'I-D': 7372.70, 'I-E': 7741.34, 'I-F': 8128.41, 'I-G': 8534.83, 'I-H': 8961.57, 'I-I': 9409.65, 'I-J': 9880.13,
    'II-A': 10614.70, 'II-B': 11145.44, 'II-C': 11702.71, 'II-D': 12287.85, 'II-E': 12902.24, 'II-F': 13547.35, 'II-G': 14224.72, 'II-H': 14935.96, 'II-I': 15682.76, 'II-J': 16466.90,
    'III-A': 17691.17, 'III-B': 18575.73, 'III-C': 19504.52, 'III-D': 20479.75, 'III-E': 21503.74, 'III-F': 22578.93, 'III-G': 23707.88, 'III-H': 24893.27, 'III-I': 26137.93, 'III-J': 27444.83,
    'IV-A': 28817.07, 'IV-B': 29537.50, 'IV-C': 30275.94, 'IV-D': 31032.84, 'IV-E': 31808.66, 'IV-F': 32603.88, 'IV-G': 33419.48, 'IV-H': 34255.46, 'IV-I': 35112.85, 'IV-J': 35990.67
};


// Career Progression Logic
export const YEARS_PER_GRADE = 2; // Progress to the next grade every 2 years

// Adicional de Desempenho (ADE) Logic
export const ADE_START_YEARS = 3; // ADE starts after the 3rd year of service
export const ADE_CYCLE_YEARS = 2; // A new ADE percentage is granted every 2 years after it starts
export const ADE_PERCENTAGE_PER_CYCLE = 0.05; // 5% of base salary per cycle
export const ADE_MAX_CYCLES = 10; // Capped at 10 cycles (50%)

export const GEPI_POINTS = 5500;
export const GEPI_POINT_VALUE = 4.15; // in R$
export const VI_DAILY_VALUE = 100.00; // Verba Indenizatória / Ajuda de Custo

// Simplified pension contribution brackets (MGPREV)
export const PENSION_BRACKETS = [
    { limit: 1412.00, rate: 0.11 },
    { limit: 3000.00, rate: 0.12 },
    { limit: 7000.00, rate: 0.14 },
    { limit: Infinity, rate: 0.16 },
];

// IRRF brackets (monthly)
export const IR_BRACKETS = [
    { limit: 2259.20, rate: 0, deduction: 0 },
    { limit: 2826.65, rate: 0.075, deduction: 169.44 },
    { limit: 3751.05, rate: 0.15, deduction: 381.44 },
    { limit: 4664.68, rate: 0.225, deduction: 662.77 },
    { limit: Infinity, rate: 0.275, deduction: 896.00 },
];

export const DEDUCTION_PER_DEPENDENT = 189.59;
