/**
 * Numeric Faithfulness Validator for Groww Steady.
 * Verifies that EVERY numeric token in the AI response matches an authorized value
 * in the deterministic facts payload (EDGE-GATE-001).
 * The AI is strictly prohibited from inventing new numbers, amounts, or returns.
 */

export interface FaithfulnessCheckResult {
  passed: boolean;
  unauthorizedNumbers: string[];
  extractedNumbers: string[];
}

export function checkNumericFaithfulness(
  candidateText: string,
  allowedNumbers: Set<string>
): FaithfulnessCheckResult {
  if (!candidateText) {
    return { passed: true, unauthorizedNumbers: [], extractedNumbers: [] };
  }

  // Regex to extract numbers: currency amounts, decimals, integers, percentages
  // Handles: ₹7,500, 7500, 43.4974, -3.23%, 168.90
  const numberTokenRegex = /(?:₹)?([0-9]+(?:,[0-9]+)*(?:\.[0-9]+)?)(?:%)?/g;

  const extractedNumbers: string[] = [];
  const unauthorizedNumbers: string[] = [];

  let match: RegExpExecArray | null;
  while ((match = numberTokenRegex.exec(candidateText)) !== null) {
    const rawMatch = match[1];
    if (!rawMatch) continue;

    // Normalize: remove internal commas
    const cleanNum = rawMatch.replace(/,/g, '');
    extractedNumbers.push(cleanNum);

    // Check if the number or rounded variant is in the allowed set
    const numVal = parseFloat(cleanNum);
    const isAllowed =
      allowedNumbers.has(cleanNum) ||
      allowedNumbers.has(rawMatch) ||
      allowedNumbers.has(numVal.toString()) ||
      allowedNumbers.has(numVal.toFixed(0)) ||
      allowedNumbers.has(numVal.toFixed(1)) ||
      allowedNumbers.has(numVal.toFixed(2)) ||
      allowedNumbers.has(numVal.toFixed(4));

    if (!isAllowed) {
      unauthorizedNumbers.push(rawMatch);
    }
  }

  return {
    passed: unauthorizedNumbers.length === 0,
    unauthorizedNumbers,
    extractedNumbers,
  };
}

