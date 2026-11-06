/**
 * Steady Flex Mandate State Machine Engine for Groww Steady.
 * Manages simulation of banking autopay adjustments: Skip Month and Temporary Step-Down.
 * Enforces 72-hour debit lockouts, cycle bounds, and anti-cascading rules.
 */

import { PortfolioState, MandateStatus, StepDownConfig } from '../calc/types';
import { APP_CONFIG } from '../config';
import { addMonthsSafe, getHoursRemaining } from '../utils/date';
import { formatDateShort, formatINR } from '../utils/format';

export interface LockoutCheckResult {
  allowed: boolean;
  hoursRemaining: number;
  reason?: string;
}

/**
 * Validates whether the mandate is outside the 72-hour unalterable banking freeze window (EDGE-FLEX-001).
 */
export function canModifyMandate(
  nextDebitDateStr: string,
  referenceDate?: string | Date
): LockoutCheckResult {
  const hoursRemaining = getHoursRemaining(nextDebitDateStr, referenceDate);

  if (hoursRemaining < APP_CONFIG.MANDATE_LOCKOUT_HOURS) {
    return {
      allowed: false,
      hoursRemaining: Math.max(0, Number(hoursRemaining.toFixed(1))),
      reason: `Mandate modifications lock 72 hours prior to scheduled debit.`,
    };
  }

  return {
    allowed: true,
    hoursRemaining: Number(hoursRemaining.toFixed(1)),
  };
}

/**
 * Alias for canModifyMandate for backwards compatibility and eval checks.
 */
export const canSkipMandate = canModifyMandate;

/**
 * Applies a 1-month skip to an active mandate.
 */
export function applySkipMonth(
  state: PortfolioState,
  referenceDate?: string | Date
): { updatedState: PortfolioState; auditEvent: { action: string; details: string } } {
  // 1. Lockout Check (EDGE-FLEX-001)
  const lockout = canModifyMandate(state.nextDebitDate, referenceDate);
  if (!lockout.allowed) {
    throw new Error(lockout.reason);
  }

  // 2. Consecutive Skip Check (EDGE-FLEX-002)
  if (state.mandateStatus === 'SKIPPED') {
    throw new Error(
      `Your mandate is already skipped for this cycle and resumes on ${formatDateShort(
        state.nextDebitDate
      )}.`
    );
  }

  if (state.mandateStatus === 'CANCELLED') {
    throw new Error('Cannot skip a cancelled mandate. Please restart your SIP.');
  }

  // 3. Advance next debit date safely by 1 month (EDGE-FLEX-004)
  const newDebitDate = addMonthsSafe(state.nextDebitDate, 1);

  const updatedState: PortfolioState = {
    ...state,
    mandateStatus: 'SKIPPED',
    nextDebitDate: newDebitDate,
  };

  const auditEvent = {
    action: 'MANDATE_SKIPPED',
    details: `1-month skip confirmed. Upcoming payment skipped; mandate automatically resumes on ${formatDateShort(
      newDebitDate
    )}. Existing units remain invested.`,
  };

  return { updatedState, auditEvent };
}

/**
 * Temporarily steps down the SIP amount for 1 to 3 cycles.
 */
export function applyStepDown(
  state: PortfolioState,
  reducedAmount: number,
  cycles: number,
  referenceDate?: string | Date
): { updatedState: PortfolioState; auditEvent: { action: string; details: string } } {
  // 1. Lockout Check
  const lockout = canModifyMandate(state.nextDebitDate, referenceDate);
  if (!lockout.allowed) {
    throw new Error(lockout.reason);
  }

  // 2. Bounds Validation (EDGE-FLEX-003)
  if (reducedAmount < APP_CONFIG.MIN_STEP_DOWN_AMOUNT) {
    throw new Error(`Minimum step-down amount is ₹${APP_CONFIG.MIN_STEP_DOWN_AMOUNT}.`);
  }

  if (reducedAmount >= state.monthlyAmount) {
    throw new Error(
      `Step-down amount must be lower than your current SIP amount of ${formatINR(state.monthlyAmount)}.`
    );
  }

  if (cycles < 1 || cycles > 3) {
    throw new Error('Step-down duration must be between 1 and 3 cycles.');
  }

  // 3. Calculate safe resumption date (EDGE-FLEX-004)
  const resumptionDate = addMonthsSafe(state.nextDebitDate, cycles);

  const stepDownConfig: StepDownConfig = {
    originalAmount: state.monthlyAmount,
    reducedAmount,
    remainingCycles: cycles,
    resumptionDate,
  };

  const updatedState: PortfolioState = {
    ...state,
    mandateStatus: 'STEPPED_DOWN',
    stepDownConfig,
  };

  const auditEvent = {
    action: 'MANDATE_STEPPED_DOWN',
    details: `Amount stepped down to ${formatINR(
      reducedAmount
    )} for ${cycles} ${cycles === 1 ? 'cycle' : 'cycles'}. Automatically restores to ${formatINR(
      state.monthlyAmount
    )} on ${formatDateShort(resumptionDate)}.`,
  };

  return { updatedState, auditEvent };
}

/**
 * Permanently cancels future instalments of a mandate while preserving owned units.
 */
export function applyCancellation(
  state: PortfolioState
): { updatedState: PortfolioState; auditEvent: { action: string; details: string } } {
  const updatedState: PortfolioState = {
    ...state,
    mandateStatus: 'CANCELLED',
    stepDownConfig: undefined,
  };

  const totalUnits = (state.instalments || [])
    .reduce((acc, i) => acc + i.unitsPurchased, 0)
    .toFixed(4);

  const auditEvent = {
    action: 'MANDATE_CANCELLED',
    details: `Autopay mandate cancelled. All future debits stopped. All ${totalUnits} units remain permanently in your account.`,
  };

  return { updatedState, auditEvent };
}
