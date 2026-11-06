import { describe, it, expect } from 'vitest';
import { APP_CONFIG } from '@/lib/config';
import { useSessionStore } from '@/lib/store/sessionStore';
import { ALL_SCENARIOS, DEFAULT_SCENARIO_ID } from '@/lib/scenarios';

describe('Phase 2: Shell Compliance & Legal Guardrails', () => {
  it('enforces wordmark is strictly "Steady"', () => {
    expect(APP_CONFIG.WORDMARK).toBe('Steady');
  });

  it('mandates persistent non-Groww prototype disclaimer copy', () => {
    expect(APP_CONFIG.PROTOTYPE_DISCLAIMER).toContain('Prototype with sample data, not Groww');
    expect(APP_CONFIG.PROTOTYPE_DISCLAIMER).toContain('No real money or advice');
  });

  it('verifies session store defaults to Scenario A', () => {
    const store = useSessionStore.getState();
    expect(store.scenarioId).toBe(DEFAULT_SCENARIO_ID);
    expect(store.portfolio.id).toBe('scenario-a');
    expect(store.portfolio.personaName).toBe('Aarav');
  });

  it('supports seamless scenario switching and session reset', () => {
    const store = useSessionStore.getState();

    // Switch to Scenario B
    store.selectScenario('scenario-b');
    expect(useSessionStore.getState().portfolio.id).toBe('scenario-b');
    expect(useSessionStore.getState().portfolio.personaName).toBe('Priya');

    // Reset demo
    store.resetDemo();
    expect(useSessionStore.getState().portfolio.id).toBe('scenario-b');
    expect(useSessionStore.getState().auditLog).toEqual([]);

    // Restore to Scenario A
    store.selectScenario('scenario-a');
  });

  it('verifies inactive tab trigger sets educational prototype notice', () => {
    const store = useSessionStore.getState();
    store.showInactiveNotice('Stocks');

    expect(useSessionStore.getState().inactiveNotice).toContain('The "Stocks" section is not part of this prototype');

    store.clearInactiveNotice();
    expect(useSessionStore.getState().inactiveNotice).toBeNull();
  });
});

