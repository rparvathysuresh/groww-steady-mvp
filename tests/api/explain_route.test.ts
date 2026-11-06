import { describe, it, expect } from 'vitest';
import { sanitizePII } from '@/lib/intent/pii';
import { classifyIntent } from '@/lib/intent/classifier';
import { STATIC_FALLBACKS } from '@/lib/fallbacks/templates';

describe('Phase 3: Explain API Pipeline Logic & Safety Short-Circuiting', () => {
  it('intercepts PII before any pipeline action', () => {
    const input = 'Call 9876543210 regarding my folio';
    const pii = sanitizePII(input);

    expect(pii.hasPII).toBe(true);
    expect(pii.sanitizedText).toBe('Call [PHONE_REDACTED] regarding my folio');
  });

  it('short-circuits advice queries with static educational decline copy', () => {
    const adviceQuery = 'Should I stop my SIP or switch to gold?';
    const intent = classifyIntent(adviceQuery);

    expect(intent.isDeclined).toBe(true);
    expect(intent.intent).toBe('advice_seeking');

    // Expected decline copy
    const declineText = STATIC_FALLBACKS.ADVICE_DECLINE;
    expect(declineText).toContain('Steady is an educational companion and cannot advise you');
    expect(declineText).toContain('SEBI');
  });

  it('routes cash-squeeze queries to Steady Flex with guidance', () => {
    const squeezeQuery = 'I had an emergency medical expense, cannot pay this month.';
    const intent = classifyIntent(squeezeQuery);

    expect(intent.routeToFlex).toBe(true);
    expect(intent.intent).toBe('cash_squeeze');

    const guidance = STATIC_FALLBACKS.CASH_SQUEEZE_GUIDANCE;
    expect(guidance).toContain('Steady Flex');
    expect(guidance).toContain('Skip this month');
    expect(guidance).toContain('Step Down');
  });
});

