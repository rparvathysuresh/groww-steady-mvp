/**
 * Pre-authored static educational fallback templates and decline copy for Groww Steady.
 * Strictly non-advisory. Never generated on the fly.
 */

import { APP_CONFIG } from '../config';
import { ComputedMetrics, PortfolioState } from '../calc/types';
import { formatINR } from '../utils/format';

export const STATIC_FALLBACKS = {
  // Decline for Advice Seeking (SEBI educational references verified)
  ADVICE_DECLINE: APP_CONFIG.ADVICE_DECLINE_COPY,

  // Decline for Predictions
  PREDICTION_DECLINE:
    'Short-term market movements cannot be reliably predicted. Mutual funds move day to day with market indices. Mutual funds are designed for long-term investing horizons rather than short-term market timing. For guidance, consult a SEBI-registered investment advisor.',

  // Cash Squeeze guidance routing to Steady Flex
  CASH_SQUEEZE_GUIDANCE:
    'If you are facing tight finances or an unexpected expense this month, you don’t need to cancel your SIP. Steady Flex allows you to either Skip this month or Step Down your monthly amount temporarily (down to ₹500) from the SIP details screen.',

  // Uncertainty notice rendered whenever gate fails or fallback is displayed
  UNCERTAINTY_NOTICE: APP_CONFIG.GATE_FALLBACK_NOTICE,

  // Jargon Glossary Fallbacks
  JARGON_DEFINITIONS: {
    XIRR:
      'XIRR (Extended Internal Rate of Return) calculates your annualized rate of return across multiple dated cash flows. Over short investment periods (under 90 days), annualizing standard market movements can make the number appear unusually large or negative.',
    NAV:
      'NAV (Net Asset Value) is the price of one unit of the mutual fund scheme on a given day. When NAV decreases, your fixed monthly SIP instalment purchases more units for the same money.',
    Units:
      'Units represent your ownership share in the mutual fund scheme. Even if market value fluctuates daily, the total number of units you own remains permanently in your account until you choose to redeem them.',
    ExpenseRatio:
      'The expense ratio is the annual percentage of fund assets deducted by the Asset Management Company (AMC) to cover operational and fund management expenses.',
    Autopay:
      'Autopay (or bank mandate) is an automated standing instruction that debits your monthly SIP amount from your verified bank account on your chosen date.',
  },

  // Deterministic Template for Dip Explanation (when gate rejects AI output)
  getDipFallback(metrics: ComputedMetrics, state: PortfolioState): string {
    const latestInst = state.instalments[state.instalments.length - 1];
    return `Your portfolio value is currently ${formatINR(
      metrics.currentValue
    )}, which is ${formatINR(
      Math.abs(metrics.absoluteReturn)
    )} below your total deposits of ${formatINR(
      metrics.totalInvested
    )}. Your last instalment bought ${latestInst?.unitsPurchased.toFixed(
      4
    )} units at NAV ₹${latestInst?.nav.toFixed(
      2
    )}. In early months, portfolio balances primarily reflect deposits made, while units remain owned in your account.`;
  },

  // Deterministic Template for Progress Explanation
  getProgressFallback(metrics: ComputedMetrics, state: PortfolioState): string {
    return `You have completed ${state.instalments.length} monthly instalments totaling ${formatINR(
      metrics.totalInvested
    )}, accumulating ${metrics.totalUnits.toFixed(
      4
    )} units. The current portfolio valuation is ${formatINR(
      metrics.currentValue
    )}.`;
  },
};

