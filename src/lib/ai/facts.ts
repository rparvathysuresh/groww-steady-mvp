import { ComputedMetrics, PortfolioState } from '../calc/types';
import { formatINR } from '../utils/format';
import { APP_CONFIG } from '../config';

export interface FactsPayload {
  invested_amount_inr: string;
  current_value_inr: string;
  absolute_pnl_inr: string;
  return_percentage: string;
  total_units: string;
  latest_nav: string;
  latest_instalment_amount: string;
  latest_instalment_units: string;
  latest_instalment_date: string;
  previous_instalment_nav?: string;
  additional_units_vs_last_month?: string;
  xirr_percent: string;
  is_short_tenure: boolean;
  months_invested: number;
  scheme_name: string;
}

export interface ExtractedFactsData {
  payload: FactsPayload;
  allowedNumbers: Set<string>;
}

export function buildFactsPayload(metrics: ComputedMetrics, state: PortfolioState): ExtractedFactsData {
  const latestInst = state.instalments[state.instalments.length - 1];
  const prevInst = state.instalments.length >= 2 ? state.instalments[state.instalments.length - 2] : undefined;

  const payload: FactsPayload = {
    invested_amount_inr: `₹${metrics.totalInvested.toLocaleString('en-IN')}`,
    current_value_inr: `₹${metrics.currentValue.toLocaleString('en-IN')}`,
    absolute_pnl_inr: formatINR(metrics.absoluteReturn, { sign: true }),
    return_percentage: `${metrics.returnPercentage.toFixed(2)}%`,
    total_units: metrics.totalUnits.toFixed(4),
    latest_nav: `₹${latestInst ? latestInst.nav.toFixed(2) : state.latestNav.toFixed(2)}`,
    latest_instalment_amount: `₹${latestInst ? latestInst.amount.toLocaleString('en-IN') : state.monthlyAmount}`,
    latest_instalment_units: latestInst ? latestInst.unitsPurchased.toFixed(4) : '0.0000',
    latest_instalment_date: latestInst ? latestInst.date : '',
    previous_instalment_nav: prevInst ? `₹${prevInst.nav.toFixed(2)}` : undefined,
    additional_units_vs_last_month: metrics.additionalUnitsVsPrevious
      ? metrics.additionalUnitsVsPrevious.toFixed(4)
      : undefined,
    xirr_percent: `${metrics.xirr}%`,
    is_short_tenure: metrics.isShortTenure,
    months_invested: state.instalments.length,
    scheme_name: state.schemeName,
  };

  // Build whitelist of allowed numbers for the numeric faithfulness check (EDGE-GATE-001)
  const allowedNumbers = new Set<string>();

  // Add all raw and formatted numeric tokens
  const addNumberVariants = (num: number) => {
    allowedNumbers.add(num.toString());
    allowedNumbers.add(num.toFixed(0));
    allowedNumbers.add(num.toFixed(1));
    allowedNumbers.add(num.toFixed(2));
    allowedNumbers.add(num.toFixed(4));
    allowedNumbers.add(Math.abs(num).toString());
    allowedNumbers.add(Math.abs(num).toFixed(2));
    allowedNumbers.add(Math.abs(num).toLocaleString('en-IN'));
  };

  addNumberVariants(metrics.totalInvested);
  addNumberVariants(metrics.currentValue);
  addNumberVariants(metrics.absoluteReturn);
  addNumberVariants(metrics.returnPercentage);
  addNumberVariants(metrics.totalUnits);
  addNumberVariants(state.latestNav);
  addNumberVariants(state.monthlyAmount);
  addNumberVariants(metrics.xirr);
  addNumberVariants(state.instalments.length);

  for (const inst of state.instalments) {
    addNumberVariants(inst.amount);
    addNumberVariants(inst.nav);
    addNumberVariants(inst.unitsPurchased);
    addNumberVariants(inst.instalmentNumber);
  }

  if (metrics.additionalUnitsVsPrevious) {
    addNumberVariants(metrics.additionalUnitsVsPrevious);
  }

  // Safe calendar & conversational numbers (EDGE-GATE-001)
  // Calendar years: 2024, 2025, 2026, 2027
  ['2024', '2025', '2026', '2027'].forEach((y) => allowedNumbers.add(y));
  // Month numbers & ordinals 1st, 2nd, 3rd, etc.
  for (let i = 1; i <= 31; i++) {
    allowedNumbers.add(i.toString());
  }

  // System mandate constants (EDGE-GATE-001, Steady Flex)
  addNumberVariants(APP_CONFIG.MIN_STEP_DOWN_AMOUNT); // 500
  addNumberVariants(APP_CONFIG.MANDATE_LOCKOUT_HOURS); // 72

  return { payload, allowedNumbers };
}

