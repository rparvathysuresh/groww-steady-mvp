/**
 * Newton-Raphson XIRR (Extended Internal Rate of Return) Solver.
 * Solves for rate r such that: sum( C_i / (1 + r)^((d_i - d_0)/365) ) = 0
 * Includes safety bounds and non-convergence guards (EDGE-MATH-002, EDGE-MATH-003).
 */

export interface CashFlow {
  date: Date;
  amount: number; // Negative for investments, positive for valuation
}

export interface XIRROptions {
  guess?: number;
  maxIterations?: number;
  tolerance?: number;
  minRate?: number; // Clamping lower bound (default -0.99 = -99%)
  maxRate?: number; // Clamping upper bound (default 10.0 = 1000%)
}

/**
 * Calculates XIRR for a series of dated cash flows.
 * @param cashFlows Array of { date, amount }
 * @param options Solver tuning options
 * @returns Annualized rate as a decimal (e.g., 0.125 for 12.5%, -0.142 for -14.2%)
 */
export function solveXIRR(cashFlows: CashFlow[], options: XIRROptions = {}): number {
  const {
    guess = 0.1,
    maxIterations = 100,
    tolerance = 1e-6,
    minRate = -0.99,
    maxRate = 10.0,
  } = options;

  if (!cashFlows || cashFlows.length < 2) {
    return 0.0;
  }

  // Ensure cash flows have both positive and negative amounts
  const hasNegative = cashFlows.some((cf) => cf.amount < 0);
  const hasPositive = cashFlows.some((cf) => cf.amount > 0);
  if (!hasNegative || !hasPositive) {
    return 0.0;
  }

  const d0 = cashFlows[0].date.getTime();
  const dayFractions = cashFlows.map(
    (cf) => (cf.date.getTime() - d0) / (1000 * 60 * 60 * 24 * 365)
  );

  // If all cash flows occur on the same day (0 elapsed days), return 0.0
  if (dayFractions[dayFractions.length - 1] === 0) {
    return 0.0;
  }

  let rate = guess;

  for (let iter = 0; iter < maxIterations; iter++) {
    let fValue = 0;
    let fDerivative = 0;

    for (let i = 0; i < cashFlows.length; i++) {
      const c = cashFlows[i].amount;
      const t = dayFractions[i];

      // Avoid division by zero or NaN with negative base
      const base = 1 + rate;
      if (base <= 0.0001) {
        continue;
      }

      const denom = Math.pow(base, t);
      if (denom === 0) continue;

      fValue += c / denom;
      fDerivative -= (t * c) / (denom * base);
    }

    // EDGE-MATH-003: Derivative too small, avoid division by near-zero
    if (Math.abs(fDerivative) < 1e-12) {
      break;
    }

    const nextRate = rate - fValue / fDerivative;

    // Check convergence
    if (Math.abs(nextRate - rate) < tolerance) {
      // EDGE-MATH-002: Clamp within sensible bounds
      return clampRate(nextRate, minRate, maxRate);
    }

    rate = nextRate;

    // Safeguard intermediate rate divergence
    if (rate <= minRate) {
      rate = minRate;
    } else if (rate >= maxRate) {
      rate = maxRate;
    }
  }

  // If iteration limit reached without strict tolerance, return current bounded rate
  return clampRate(rate, minRate, maxRate);
}

function clampRate(rate: number, min: number, max: number): number {
  if (isNaN(rate) || !isFinite(rate)) return 0.0;
  if (rate < min) return min;
  if (rate > max) return max;
  return rate;
}
