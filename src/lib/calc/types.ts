/**
 * Data models and interfaces for the Deterministic Financial Calculation Engine.
 */

export interface Instalment {
  id: string;
  instalmentNumber: number;
  date: string; // ISO date format "YYYY-MM-DD"
  amount: number; // In Rupees, e.g., 2500
  nav: number; // Net Asset Value on purchase date, e.g., 176.40
  unitsPurchased: number; // Computed: amount / nav rounded to 4 decimal places
}

export type MandateStatus = 'ACTIVE' | 'SKIPPED' | 'STEPPED_DOWN' | 'CANCELLED';

export interface StepDownConfig {
  originalAmount: number;
  reducedAmount: number;
  remainingCycles: number; // 1 to 3 cycles
  resumptionDate: string; // ISO date string when original amount restores
}

export interface PortfolioState {
  id: string;
  scenarioName: string;
  personaName: string; // Fictional persona name
  description: string;
  schemeName: string;
  monthlyAmount: number;
  instalments: Instalment[];
  latestNav: number;
  latestNavDate: string;
  nextDebitDate: string;
  mandateStatus: MandateStatus;
  stepDownConfig?: StepDownConfig;
}

export interface ComputedMetrics {
  totalInvested: number; // Total rupees invested
  totalUnits: number; // Cumulative units owned, 4 decimals
  averageNav: number; // Average purchase NAV, 2 decimals
  currentValue: number; // Portfolio value today, 2 decimals
  absoluteReturn: number; // currentValue - totalInvested
  returnPercentage: number; // ((currentValue - totalInvested) / totalInvested) * 100
  xirr: number; // Extended Internal Rate of Return (percentage)
  isShortTenure: boolean; // True if first investment < 90 days ago
  additionalUnitsVsPrevious: number; // (amount / latestNav) - (amount / prevNav)
  navDeltaVsPrevious: number; // latestNav - prevNav
  isDipState: boolean; // True if currentValue < totalInvested
  isDebitNear: boolean; // True if next debit is within <= 5 days
  returnState: 'PROFIT' | 'LOSS' | 'NEUTRAL'; // Explicit 3-state for accessible rendering
}

