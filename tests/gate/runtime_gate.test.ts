import { describe, it, expect } from 'vitest';
import { evaluateCandidateText } from '@/lib/gate';
import { checkNumericFaithfulness } from '@/lib/gate/faithfulness';
import { checkAdvisoryViolations, checkUrgencyViolations } from '@/lib/gate/blocklists';
import { checkReadability } from '@/lib/gate/readability';

describe('Phase 3: The 6-Point Runtime Evaluation Gate', () => {
  const allowedNumbers = new Set(['7500', '7257.54', '43.4974', '168.90', '172.10', '2500', '3']);
  const fallbackCopy = 'Your portfolio value moves daily with market prices. Units owned remain permanently in your account.';

  it('Check 1 (Numeric Faithfulness): Rejects unprovided/hallucinated numbers (EDGE-GATE-001)', () => {
    // 500 is unauthorized!
    const badCandidate = 'Your 43.4974 units are worth ₹7,257.54, but will increase by ₹500 soon.';
    const result = evaluateCandidateText(badCandidate, allowedNumbers, fallbackCopy);

    expect(result.passed).toBe(false);
    expect(result.isFallback).toBe(true);
    expect(result.output).toBe(fallbackCopy);
    expect(result.failedChecks.some((c) => c.includes('Numeric Faithfulness Failed'))).toBe(true);
  });

  it('Check 1 (Numeric Faithfulness): Accepts authorized numbers in any standard format', () => {
    const validCandidate = 'You deposited ₹7,500 over 3 months to accumulate 43.4974 units at ₹168.90.';
    const check = checkNumericFaithfulness(validCandidate, allowedNumbers);
    expect(check.passed).toBe(true);
    expect(check.unauthorizedNumbers).toEqual([]);
  });

  it('Check 2 (Advisory Blocklist): Rejects buy/sell/hold/should and subtle evasions (EDGE-GATE-002)', () => {
    const directAdvice = 'You should continue your SIP because prices are lower.';
    expect(checkAdvisoryViolations(directAdvice).passed).toBe(false);

    const subtleAdvice = 'It is prudent to stay the course during this temporary volatility.';
    expect(checkAdvisoryViolations(subtleAdvice).passed).toBe(false);

    const neutralText = 'Portfolio value reflects current NAV prices while total units remain unchanged.';
    expect(checkAdvisoryViolations(neutralText).passed).toBe(true);
  });

  it('Check 3 (Urgency/FOMO Blocklist): Rejects panic and alarmist vocabulary', () => {
    const panicText = 'Do not panic about the market crash and act now.';
    expect(checkUrgencyViolations(panicText).passed).toBe(false);

    const neutralText = 'Prices fluctuate daily in response to market conditions.';
    expect(checkUrgencyViolations(neutralText).passed).toBe(true);
  });

  it('Check 4 (Readability): Rejects excessive length or sentence counts', () => {
    const tooManySentences = 'One. Two. Three. Four. Five.';
    expect(checkReadability(tooManySentences).passed).toBe(false);

    const validReadability = 'Your investment bought 14.80 units at NAV ₹168.90. In early months, balances mostly reflect deposits made.';
    expect(checkReadability(validReadability).passed).toBe(true);
  });

  it('passes all 6 checks for a grounded, compliant response', () => {
    const compliantText = 'Your 3 instalments totaling ₹7,500 have bought 43.4974 units. Market prices fluctuate daily, while your units remain owned in your account.';
    const result = evaluateCandidateText(compliantText, allowedNumbers, fallbackCopy);

    expect(result.passed).toBe(true);
    expect(result.isFallback).toBe(false);
    expect(result.output).toBe(compliantText);
    expect(result.failedChecks).toEqual([]);
  });
});

