export interface CalculationInput {
  grossSalary: number;
  dependents: number;
  alimony: number;
  socialSecurity: number;
  otherDeductions: number;
  isRetiree65Plus: boolean;
}

export interface TaxBracket {
  limit: number | null; // null for infinity
  rate: number;
  deduction: number;
}

export interface CalculationDetail {
  baseCalculation: number;
  brackets: {
    range: string;
    rate: number;
    allocatedAmount: number;
    taxAmount: number;
  }[];
  grossTax: number;
  reductionValue: number;
  reductionExplanation: string;
  netTax: number;
  effectiveRate: number;
  deductions: number;
  exemption65Value: number;
}

export interface ComparisonResult {
  full: CalculationDetail;
  simplified: CalculationDetail;
  bestMethod: 'full' | 'simplified';
  savings: number;
}

const BRACKETS: TaxBracket[] = [
  { limit: 2428.80, rate: 0, deduction: 0 },
  { limit: 2826.65, rate: 0.075, deduction: 182.16 },
  { limit: 3751.05, rate: 0.15, deduction: 394.16 },
  { limit: 4664.68, rate: 0.225, deduction: 675.48 },
  { limit: null, rate: 0.275, deduction: 908.72 },
];

const DEPENDENT_DEDUCTION = 189.59;
const SIMPLIFIED_DEDUCTION = 607.20;
const EXEMPTION_65_PLUS = 1903.98;

interface ReductionResult {
  value: number;
  explanation: string;
}

function calculateReduction(rt: number, ib: number): ReductionResult {
  if (rt <= 5000.00) {
    return {
      value: ib,
      explanation: `Rendimentos (R$ ${rt.toFixed(2)}) até R$ 5.000,00: Isenção total concedida pelo Redutor.`
    };
  } else if (rt <= 7350.00) {
    const formulaValue = 978.62 - (0.133145 * rt);
    const finalValue = Math.min(Math.max(formulaValue, 0), ib);
    
    let note = "";
    if (formulaValue > ib) note = " (Limitado ao valor do Imposto Bruto)";
    if (formulaValue < 0) note = " (Calculado resultou negativo, assumido zero)";

    return {
      value: finalValue,
      explanation: `Fórmula: 978,62 - (0,133145 x ${rt.toFixed(2)}) = ${formulaValue.toFixed(2)}${note}.`
    };
  }
  
  return {
    value: 0,
    explanation: `Rendimentos (R$ ${rt.toFixed(2)}) acima de R$ 7.350,00: Redutor não aplicável.`
  };
}

function calculateTax(baseCalculation: number, grossSalary: number): CalculationDetail {
  let accumulatedTax = 0;
  const bracketDetails = [];

  let previousLimit = 0;

  for (const bracket of BRACKETS) {
    const limit = bracket.limit;
    
    let allocated = 0;
    const currentCeiling = limit === null ? Infinity : limit;
    const bottom = previousLimit;
    
    if (baseCalculation > bottom) {
        const taxableInThisBracket = Math.min(baseCalculation, currentCeiling) - bottom;
        allocated = Math.max(0, taxableInThisBracket);
    } else {
        allocated = 0;
    }
    
    const taxInBracket = allocated * bracket.rate;
    accumulatedTax += taxInBracket;
    
    bracketDetails.push({
        range: limit === null ? `Acima de R$ ${previousLimit.toFixed(2)}` : `De R$ ${previousLimit.toFixed(2)} a R$ ${limit.toFixed(2)}`,
        rate: bracket.rate,
        allocatedAmount: allocated,
        taxAmount: taxInBracket
    });

    if (limit !== null) previousLimit = limit;
  }
  
  // O Redutor é calculado com base na Remuneração Bruta
  const redutor = calculateReduction(grossSalary, accumulatedTax);
  const netTax = Math.max(0, accumulatedTax - redutor.value);

  return {
    baseCalculation,
    brackets: bracketDetails,
    grossTax: accumulatedTax,
    reductionValue: redutor.value,
    reductionExplanation: redutor.explanation,
    netTax,
    effectiveRate: grossSalary > 0 ? netTax / grossSalary : 0,
    deductions: 0, // to be filled by caller context
    exemption65Value: 0 // to be filled by caller context
  };
}

export function calculateIRRF(input: CalculationInput): ComparisonResult {
  const rtRaw = input.grossSalary - input.socialSecurity - input.otherDeductions;
  const exemption65 = input.isRetiree65Plus ? EXEMPTION_65_PLUS : 0;
  
  // Base applies exemption 65+ for both methods (Isenção 65+ abate do rendimento bruto)
  const grossAfterExemption = Math.max(0, input.grossSalary - exemption65);
  
  // Full Calculation (Gross - Exemption - INSS - Other - Legal Deductions)
  // rtRaw includes INSS and Other Deductions subtraction, so we use it as base
  const baseForFull = Math.max(0, rtRaw - exemption65); 
  const legalDeductions = input.alimony + (input.dependents * DEPENDENT_DEDUCTION);
  const bcFull = Math.max(0, baseForFull - legalDeductions);
  const fullResult = calculateTax(bcFull, input.grossSalary);
  fullResult.deductions = legalDeductions + input.socialSecurity + input.otherDeductions + exemption65;
  fullResult.exemption65Value = exemption65;

  // Simplified Calculation (Gross - Exemption - Simplified Deduction)
  // Replaces INSS, Alimony, Dependents, and Other Deductions
  const bcSimplified = Math.max(0, grossAfterExemption - SIMPLIFIED_DEDUCTION);
  const simplifiedResult = calculateTax(bcSimplified, input.grossSalary);
  simplifiedResult.deductions = SIMPLIFIED_DEDUCTION + exemption65;
  simplifiedResult.exemption65Value = exemption65;

  
  return {
    full: fullResult,
    simplified: simplifiedResult,
    bestMethod: fullResult.netTax <= simplifiedResult.netTax ? 'full' : 'simplified',
    savings: Math.abs(fullResult.netTax - simplifiedResult.netTax)
  };
}
