import { describe, it, expect } from 'vitest';
import { classifyIntent } from '@/lib/intent/classifier';

describe('Phase 3: Intent Classification & Safety Short-Circuiting', () => {
  it('identifies advice-seeking queries and flags for immediate decline', () => {
    const q1 = classifyIntent('Should I stop my SIP since the market is down?');
    expect(q1.intent).toBe('advice_seeking');
    expect(q1.isDeclined).toBe(true);

    const q2 = classifyIntent('Which fund is better to invest in right now?');
    expect(q2.intent).toBe('advice_seeking');
    expect(q2.isDeclined).toBe(true);

    const q3 = classifyIntent('Is it good to continue or sell?');
    expect(q3.intent).toBe('advice_seeking');
    expect(q3.isDeclined).toBe(true);
  });

  it('identifies prediction-seeking queries and flags for immediate decline', () => {
    const q1 = classifyIntent('Will the market recover by December?');
    expect(q1.intent).toBe('prediction_seeking');
    expect(q1.isDeclined).toBe(true);

    const q2 = classifyIntent('When will my portfolio get positive returns?');
    expect(q2.intent).toBe('prediction_seeking');
    expect(q2.isDeclined).toBe(true);
  });

  it('identifies cash-squeeze queries and flags for Steady Flex routing', () => {
    const q1 = classifyIntent('I have an emergency medical expense and cannot afford this debit.');
    expect(q1.intent).toBe('cash_squeeze');
    expect(q1.routeToFlex).toBe(true);

    const q2 = classifyIntent('Can I skip my SIP instalment this month?');
    expect(q2.intent).toBe('cash_squeeze');
    expect(q2.routeToFlex).toBe(true);
  });

  it('classifies explain_dip and explain_term queries correctly', () => {
    const dip = classifyIntent('Why is my current balance less than what I deposited?');
    expect(dip.intent).toBe('explain_dip');
    expect(dip.isDeclined).toBe(false);

    const term = classifyIntent('What does annualized XIRR mean?');
    expect(term.intent).toBe('explain_term');
    expect(term.isDeclined).toBe(false);
  });

  it('handles Hinglish queries accurately (EDGE-CONV-004)', () => {
    const hinglishAdvice = classifyIntent('Kya mujhe apni SIP band kar deni chahiye?');
    expect(hinglishAdvice.intent).toBe('advice_seeking');
    expect(hinglishAdvice.isDeclined).toBe(true);

    const hinglishDip = classifyIntent('Bhai market gir gaya, paise doob gaye kya?');
    expect(hinglishDip.intent).toBe('explain_dip');
    expect(hinglishDip.isDeclined).toBe(false);

    const hinglishCash = classifyIntent('Salary late ho gayi hai, iss mahine paise nahi hai.');
    expect(hinglishCash.intent).toBe('cash_squeeze');
    expect(hinglishCash.routeToFlex).toBe(true);
  });

  it('prioritizes safety on dual-intent queries (EDGE-CONV-002)', () => {
    // Blends cash squeeze + advice query
    const dual = classifyIntent('I have an unexpected bill, should I stop my SIP?');
    expect(dual.intent).toBe('advice_seeking');
    expect(dual.isDeclined).toBe(true);
  });
});

