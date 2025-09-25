
export const PROJECTION_YEARS_DEFAULT = 30;
export const SCENARIO_COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#f97316', '#8b5cf6', '#ec4899'];

const levels = ['I', 'II'];
const grades = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
export const CAREER_POSITIONS: string[] = levels.flatMap(level => grades.map(grade => `${level}-${grade}`));


export const BASE_SALARIES: { [key: string]: number } = {
  'I-A': 5975.21, 'I-B': 6154.48, 'I-C': 6339.11, 'I-D': 6529.28, 'I-E': 6725.17,'I-F': 6926.91, 'I-G': 7134.72, 'I-H': 7348.76, 'I-I': 7569.23, 'I-J': 7796.30,
  'II-A': 7469.03, 'II-B': 7767.78, 'II-C': 8078.48, 'II-D': 8401.63, 'II-E': 8737.70,'II-F': 9087.20, 'II-G': 9450.69, 'II-H': 9828.72, 'II-I': 10221.88, 'II-J': 10630.75
};



// Career Progression Logic
export const YEARS_PER_GRADE = 2; // Progress to the next grade every 2 years

// Adicional de Desempenho (ADE) Logic
export const ADE_START_YEARS = 3; // ADE starts after the 3rd year of service
export const ADE_CYCLE_YEARS = 2; // A new ADE percentage is granted every 2 years after it starts
export const ADE_PERCENTAGE_PER_CYCLE = 0.05; // 5% of base salary per cycle
export const ADE_MAX_CYCLES = 10; // Capped at 10 cycles (50%)

export const GEPI_POINTS = 11000;
export const GEPI_POINT_VALUE = 1.88; // in R$
export const VI_DAILY_VALUE = 179.36; // Verba Indenizatória / Ajuda de Custo

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
