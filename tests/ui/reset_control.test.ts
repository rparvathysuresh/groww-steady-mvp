import { describe, it, expect, beforeEach } from 'vitest';
import { useSessionStore } from '@/lib/store/sessionStore';
import { SCENARIO_A } from '@/lib/scenarios/scenarioA';
import { applySkipMonth, applyStepDown, applyCancellation } from '@/lib/flex/engine';

describe('Phase 6: Reset Demo State Purge (Test 6.5)', () => {
  beforeEach(() => {
    useSessionStore.getState().selectScenario('scenario-a');
  });

  it('restores modified mandate state back to original active baseline upon reset', () => {
    const store = useSessionStore.getState();

    // 1. Initially ACTIVE
    expect(store.portfolio.mandateStatus).toBe('ACTIVE');
    expect(store.auditLog.length).toBe(0);

    // 2. Modify mandate (simulate skip)
    const { updatedState, auditEvent } = applySkipMonth(store.portfolio, '2026-04-01');
    store.updatePortfolio(() => updatedState);
    store.logAuditEvent(auditEvent.action, auditEvent.details);

    // Verify modified state
    expect(useSessionStore.getState().portfolio.mandateStatus).toBe('SKIPPED');
    expect(useSessionStore.getState().auditLog.length).toBe(1);

    // 3. Trigger Reset Demo
    useSessionStore.getState().resetDemo();

    // Verify clean state
    const resetStore = useSessionStore.getState();
    expect(resetStore.portfolio.mandateStatus).toBe('ACTIVE');
    expect(resetStore.portfolio.monthlyAmount).toBe(SCENARIO_A.monthlyAmount);
    expect(resetStore.auditLog.length).toBe(0);
  });

  it('purges cancelled mandate and clears all audit events', () => {
    const store = useSessionStore.getState();

    // 1. Cancel mandate
    const { updatedState, auditEvent } = applyCancellation(store.portfolio);
    store.updatePortfolio(() => updatedState);
    store.logAuditEvent(auditEvent.action, auditEvent.details);

    expect(useSessionStore.getState().portfolio.mandateStatus).toBe('CANCELLED');
    expect(useSessionStore.getState().auditLog.length).toBe(1);

    // 2. Reset
    useSessionStore.getState().resetDemo();

    const resetStore = useSessionStore.getState();
    expect(resetStore.portfolio.mandateStatus).toBe('ACTIVE');
    expect(resetStore.auditLog.length).toBe(0);
  });
});

