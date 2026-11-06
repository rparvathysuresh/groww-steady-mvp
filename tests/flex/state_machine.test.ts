import { describe, it, expect } from 'vitest';
import { applySkipMonth, applyStepDown, applyCancellation } from '@/lib/flex/engine';
import { PortfolioState } from '@/lib/calc/types';
import { SCENARIO_A } from '@/lib/scenarios/scenarioA';

describe('Phase 4: Mandate State Machine Engine (EDGE-FLEX-002, EDGE-FLEX-003)', () => {
  // Reference date well outside the 72h window for nextDebitDate (2026-04-10)
  const safeReferenceDate = new Date('2026-04-01T10:00:00.000Z');

  const baseState: PortfolioState = {
    ...SCENARIO_A,
    mandateStatus: 'ACTIVE',
    nextDebitDate: '2026-04-10',
    monthlyAmount: 2500,
  };

  describe('applySkipMonth', () => {
    it('transitions status ACTIVE -> SKIPPED and advances next debit date by 1 month', () => {
      const { updatedState, auditEvent } = applySkipMonth(baseState, safeReferenceDate);

      expect(updatedState.mandateStatus).toBe('SKIPPED');
      expect(updatedState.nextDebitDate).toBe('2026-05-10');
      expect(auditEvent.action).toBe('MANDATE_SKIPPED');
      expect(auditEvent.details).toContain('1-month skip confirmed');
    });

    it('rejects consecutive skip attempts (EDGE-FLEX-002)', () => {
      const skippedState: PortfolioState = {
        ...baseState,
        mandateStatus: 'SKIPPED',
        nextDebitDate: '2026-05-10',
      };

      expect(() => applySkipMonth(skippedState, safeReferenceDate)).toThrow(
        /already skipped for this cycle/i
      );
    });

    it('rejects skip attempt on cancelled mandate', () => {
      const cancelledState: PortfolioState = {
        ...baseState,
        mandateStatus: 'CANCELLED',
      };

      expect(() => applySkipMonth(cancelledState, safeReferenceDate)).toThrow(
        /Cannot skip a cancelled mandate/i
      );
    });

    it('enforces 72h lockout check when debit is within 72h', () => {
      const nearDebitState: PortfolioState = {
        ...baseState,
        nextDebitDate: '2026-04-10T09:00:00.000Z',
      };
      // Reference date 24 hours prior to debit: inside 72h window
      const lockedReferenceDate = new Date('2026-04-09T09:00:00.000Z');

      expect(() => applySkipMonth(nearDebitState, lockedReferenceDate)).toThrow(
        /Mandate modifications lock 72 hours/i
      );
    });
  });

  describe('applyStepDown (EDGE-FLEX-003)', () => {
    it('transitions status ACTIVE -> STEPPED_DOWN with valid amount and duration', () => {
      const { updatedState, auditEvent } = applyStepDown(baseState, 500, 2, safeReferenceDate);

      expect(updatedState.mandateStatus).toBe('STEPPED_DOWN');
      expect(updatedState.stepDownConfig).toBeDefined();
      expect(updatedState.stepDownConfig?.reducedAmount).toBe(500);
      expect(updatedState.stepDownConfig?.originalAmount).toBe(2500);
      expect(updatedState.stepDownConfig?.remainingCycles).toBe(2);
      expect(updatedState.stepDownConfig?.resumptionDate).toBe('2026-06-10');
      expect(auditEvent.action).toBe('MANDATE_STEPPED_DOWN');
      expect(auditEvent.details).toContain('500');
      expect(auditEvent.details).toContain('for 2 cycles');
    });

    it('rejects amounts below the ₹500 minimum (EDGE-FLEX-003)', () => {
      expect(() => applyStepDown(baseState, 400, 2, safeReferenceDate)).toThrow(
        /Minimum step-down amount is ₹500/i
      );
    });

    it('rejects amounts equal to or greater than original monthly amount (EDGE-FLEX-003)', () => {
      expect(() => applyStepDown(baseState, 2500, 2, safeReferenceDate)).toThrow(
        /must be lower than your current SIP amount/i
      );
      expect(() => applyStepDown(baseState, 3000, 2, safeReferenceDate)).toThrow(
        /must be lower than your current SIP amount/i
      );
    });

    it('rejects cycle durations outside [1, 3] range', () => {
      expect(() => applyStepDown(baseState, 1000, 0, safeReferenceDate)).toThrow(
        /between 1 and 3 cycles/i
      );
      expect(() => applyStepDown(baseState, 1000, 4, safeReferenceDate)).toThrow(
        /between 1 and 3 cycles/i
      );
    });
  });

  describe('applyCancellation (EDGE-CANCEL-001)', () => {
    it('transitions status to CANCELLED and clears stepDownConfig', () => {
      const steppedDownState: PortfolioState = {
        ...baseState,
        mandateStatus: 'STEPPED_DOWN',
        stepDownConfig: {
          originalAmount: 2500,
          reducedAmount: 1000,
          remainingCycles: 2,
          resumptionDate: '2026-06-10',
        },
      };

      const { updatedState, auditEvent } = applyCancellation(steppedDownState);

      expect(updatedState.mandateStatus).toBe('CANCELLED');
      expect(updatedState.stepDownConfig).toBeUndefined();
      expect(auditEvent.action).toBe('MANDATE_CANCELLED');
      expect(auditEvent.details).toContain('All future debits stopped');
      expect(auditEvent.details).toContain('units remain permanently');
    });
  });
});
