
import {
    Scenario,
    AnnualData,
    MonthlyBreakdown
} from '../types';
import {
    BASE_SALARIES,
    GEPI_POINTS,
    GEPI_POINT_VALUE,
    VI_DAILY_VALUE,
    PENSION_BRACKETS,
    IR_BRACKETS,
    DEDUCTION_PER_DEPENDENT,
    CAREER_POSITIONS,
    YEARS_PER_GRADE,
    ADE_START_YEARS,
    ADE_CYCLE_YEARS,
    ADE_PERCENTAGE_PER_CYCLE,
    ADE_MAX_CYCLES,
} from '../constants';

const calculatePension = (baseSalary: number): number => {
    let totalContribution = 0;
    let remainingSalary = baseSalary;
    let previousLimit = 0;

    for (const bracket of PENSION_BRACKETS) {
        if (remainingSalary > 0) {
            const taxableAmountInBracket = Math.min(remainingSalary, bracket.limit - previousLimit);
            totalContribution += taxableAmountInBracket * bracket.rate;
            remainingSalary -= taxableAmountInBracket;
            previousLimit = bracket.limit;
        } else {
            break;
        }
    }
    return totalContribution;
};

const calculateIR = (baseSalary: number): number => {
    for (const bracket of IR_BRACKETS) {
        if (baseSalary <= bracket.limit) {
            return baseSalary * bracket.rate - bracket.deduction;
        }
    }
    return 0; // Should not be reached
};

const getEffectivePosition = (initialPosition: string, yearsInService: number): string => {
    const initialIndex = CAREER_POSITIONS.indexOf(initialPosition);
    if (initialIndex === -1) return initialPosition;

    const progressionSteps = Math.floor(yearsInService / YEARS_PER_GRADE);
    const newIndex = Math.min(initialIndex + progressionSteps, CAREER_POSITIONS.length - 1);
    return CAREER_POSITIONS[newIndex];
};


const getAdePercentage = (yearsInService: number): number => {
    // No ADE during the first 3 years of service (years 0, 1, 2)
    if (yearsInService < ADE_START_YEARS) {
        return 0;
    }
    const yearsSinceAdeStart = yearsInService - ADE_START_YEARS; // 0 for year 3, 1 for year 4...
    const adeCycles = Math.floor(yearsSinceAdeStart / ADE_CYCLE_YEARS) + 1; // +1 for the initial grant
    const effectiveCycles = Math.min(adeCycles, ADE_MAX_CYCLES);
    return effectiveCycles * ADE_PERCENTAGE_PER_CYCLE;
};

export const calculateBreakdownForYear = (scenario: Scenario, yearsInService: number): MonthlyBreakdown => {
    const {
        dependents,
        workingDays,
        salaryAdjustment,
        gepiAdjustment,
        viAdjustment
    } = scenario.parameters;

    // Determine dynamic values for the given year
    const effectivePosition = getEffectivePosition(scenario.parameters.level, yearsInService);
    const adePercentage = getAdePercentage(yearsInService);

    // Calculate components
    const baseSalaryForPosition = BASE_SALARIES[effectivePosition] || 0;
    const baseSalary = baseSalaryForPosition * (1 + salaryAdjustment / 100);
    const ade = baseSalary * adePercentage;
    const gepi = GEPI_POINTS * (GEPI_POINT_VALUE + (gepiAdjustment / 100));
    const vi = workingDays * (VI_DAILY_VALUE + viAdjustment);

    const taxableIncome = baseSalary + gepi + ade;
    const grossSalary = taxableIncome + vi;

    const pensionDiscount = calculatePension(taxableIncome);
    const dependentsDeduction = dependents * DEDUCTION_PER_DEPENDENT;
    const irCalculationBase = taxableIncome - pensionDiscount - dependentsDeduction;

    const irDiscount = calculateIR(Math.max(0, irCalculationBase));

    const netSalary = grossSalary - pensionDiscount - irDiscount;

    return {
        grossSalary,
        netSalary,
        baseSalary,
        gepi,
        vi,
        ade,
        pensionDiscount,
        irDiscount,
        level: effectivePosition,
    };
};


export const calculateAnnualProjection = (scenario: Scenario, years: number): AnnualData[] => {
    const projection: AnnualData[] = [];
    const currentYear = new Date().getFullYear();

    for (let i = 0; i < years; i++) {
        const yearlyBreakdown = calculateBreakdownForYear(scenario, i);
        projection.push({
            year: currentYear + i,
            ...yearlyBreakdown,
        });
    }

    return projection;
};
