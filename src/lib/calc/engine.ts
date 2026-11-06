/**
 * Deterministic Financial Calculation Engine for Groww Steady.
 * Pure TypeScript functions. Zero external network calls. Zero LLM dependencies.
 */

import { PortfolioState, ComputedMetrics } from './types';
import { solveXIRR } from './xirr';

/**
 * Computes all portfolio metrics deterministically.
 * @param state Current portfolio state and transaction history
 * @param referenceDate Optional reference date (defaults to state.latestNavDate or current date)
 */
export function computePortfolioMetrics(
  state: PortfolioState,
  referenceDate?: string | Date
): ComputedMetrics {
  const { instalments, latestNav, nextDebitDate, latestNavDate } = state;

  // 1. Total Principal Invested
  const totalInvested = instalments.reduce((sum, inst) => sum + inst.amount, 0);

  // 2. Units Purchased per instalment and Total Cumulative Units
  let runningUnits = 0;
  for (const inst of instalments) {
    if (inst.nav > 0) {
      inst.unitsPurchased = Number((inst.amount / inst.nav).toFixed(4));
    } else {
      inst.unitsPurchased = 0;
    }
    runningUnits += inst.unitsPurchased;
  }
  const totalUnits = Number(runningUnits.toFixed(4));

  // 3. Average NAV (Weighted average cost per unit)
  const averageNav = totalUnits > 0 ? Number((totalInvested / totalUnits).toFixed(2)) : 0;

  // 4. Current Valuation
  const currentValue = Number((totalUnits * latestNav).toFixed(2));

  // 5. Absolute Gain / Loss (P&L) and Percentage Return
  const absoluteReturn = Number((currentValue - totalInvested).toFixed(2));
  const returnPercentage =
    totalInvested > 0 ? Number(((absoluteReturn / totalInvested) * 100).toFixed(2)) : 0;

  // 6. Additional Units vs Previous Month (EDGE-MATH-001)
  let additionalUnitsVsPrevious = 0;
  let navDeltaVsPrevious = 0;
  if (instalments.length >= 2) {
    const currentInst = instalments[instalments.length - 1];
    const prevInst = instalments[instalments.length - 2];

    if (prevInst.nav > 0 && currentInst.nav > 0) {
      // How many units this instalment would have bought at previous NAV
      const unitsAtPrevNav = currentInst.amount / prevInst.nav;
      additionalUnitsVsPrevious = Number(
        (currentInst.unitsPurchased - unitsAtPrevNav).toFixed(4)
      );
      navDeltaVsPrevious = Number((currentInst.nav - prevInst.nav).toFixed(2));
    }
  }

  // 7. Dated Cash Flows & XIRR Calculation
  const cashFlows = instalments.map((inst) => ({
    date: new Date(inst.date),
    amount: -inst.amount, // Investments are negative cash outflows
  }));

  const valDate = new Date(latestNavDate);
  cashFlows.push({
    date: valDate,
    amount: currentValue, // Current value is positive cash inflow
  });

  const rawXirr = solveXIRR(cashFlows);
  const xirr = Number((rawXirr * 100).toFixed(2));

  // 8. Short Tenure Detection (< 90 days from first instalment, EDGE-MATH-002)
  let isShortTenure = false;
  if (instalments.length > 0) {
    const firstDate = new Date(instalments[0].date).getTime();
    const elapsedDays = Math.max(0, Math.floor((valDate.getTime() - firstDate) / (1000 * 60 * 60 * 24)));
    isShortTenure = elapsedDays < 90;
  }

  // 9. Point-of-Doubt Triggers
  const isDipState = currentValue < totalInvested;

  // Debit proximity check
  const refDate = referenceDate ? new Date(referenceDate) : valDate;
  const debitDate = new Date(nextDebitDate);
  const diffDays = Math.ceil((debitDate.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24));
  const isDebitNear = diffDays >= 0 && diffDays <= 5;

  // 10. Return State for Accessible UI Rendering (EDGE-MATH-004)
  let returnState: 'PROFIT' | 'LOSS' | 'NEUTRAL' = 'NEUTRAL';
  if (absoluteReturn > 0.005) {
    returnState = 'PROFIT';
  } else if (absoluteReturn < -0.005) {
    returnState = 'LOSS';
  }

  return {
    totalInvested,
    totalUnits,
    averageNav,
    currentValue,
    absoluteReturn,
    returnPercentage,
    xirr,
    isShortTenure,
    additionalUnitsVsPrevious,
    navDeltaVsPrevious,
    isDipState,
    isDebitNear,
    returnState,
  };
}

