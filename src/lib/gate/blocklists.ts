/**
 * Blocklist verification for Advisory Language and Urgency/FOMO (EDGE-GATE-002).
 * Hard constraints: Zero tolerance for advice or panic nudging.
 */

export interface BlocklistCheckResult {
  passed: boolean;
  matchedTokens: string[];
}

export function checkAdvisoryViolations(text: string): BlocklistCheckResult {
  if (!text) return { passed: true, matchedTokens: [] };

  // Explicit and subtle advisory patterns
  const advisoryPatterns = [
    /\b(buy|sell|hold|continue|stop|switch|redeem|stay invested)\b/i,
    /\b(you should|you must|we recommend|our advice|advisable to)\b/i,
    /\b(will recover|likely to rise|guaranteed|safe bet|market will bounce)\b/i,
    /\b(accumulate more|average down|bargain|discounted units)\b/i,
    // Subtle evasions (EDGE-GATE-002)
    /\b(stay the course|wise to|smart move|good idea to|prudent to|best to wait|hang in there|don't give up|remain committed)\b/i,
  ];

  const matchedTokens: string[] = [];
  for (const pattern of advisoryPatterns) {
    const match = text.match(pattern);
    if (match) {
      matchedTokens.push(match[0]);
    }
  }

  return {
    passed: matchedTokens.length === 0,
    matchedTokens,
  };
}

export function checkUrgencyViolations(text: string): BlocklistCheckResult {
  if (!text) return { passed: true, matchedTokens: [] };

  const urgencyPatterns = [
    /\b(hurry|rush|don't miss out|last chance|act now|limited time)\b/i,
    /\b(crash|collapse|panic|bloodbath|catastrophe|disaster|danger)\b/i,
    /\b(lose your streak|streak reset|punishment|lose out)\b/i,
  ];

  const matchedTokens: string[] = [];
  for (const pattern of urgencyPatterns) {
    const match = text.match(pattern);
    if (match) {
      matchedTokens.push(match[0]);
    }
  }

  return {
    passed: matchedTokens.length === 0,
    matchedTokens,
  };
}

