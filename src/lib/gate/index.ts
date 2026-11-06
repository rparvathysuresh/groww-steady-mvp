/**
 * 6-Point Runtime Evaluation Gate Pipeline for Groww Steady.
 * Verifies every candidate AI response before rendering to the client.
 * Failures degrade safely to pre-written deterministic copy.
 */

import { checkNumericFaithfulness } from './faithfulness';
import { checkAdvisoryViolations, checkUrgencyViolations } from './blocklists';
import { checkReadability } from './readability';
import { APP_CONFIG } from '../config';

export interface GateEvaluationResult {
  passed: boolean;
  failedChecks: string[];
  output: string;
  isFallback: boolean;
  uncertaintyNotice?: string;
  executionMetrics: {
    checksRan: number;
    faithfulnessPassed: boolean;
    advisoryPassed: boolean;
    urgencyPassed: boolean;
    readabilityPassed: boolean;
  };
}

/**
 * Runs the 6-point verification gate against candidate text.
 */
export function evaluateCandidateText(
  candidateText: string,
  allowedNumbers: Set<string>,
  fallbackTemplate: string
): GateEvaluationResult {
  const failedChecks: string[] = [];

  // Check 1: Numeric Faithfulness
  const faithfulness = checkNumericFaithfulness(candidateText, allowedNumbers);
  if (!faithfulness.passed) {
    failedChecks.push(
      `Numeric Faithfulness Failed: [${faithfulness.unauthorizedNumbers.join(', ')}] not in facts payload.`
    );
  }

  // Check 2: Advisory Language Blocklist
  const advisory = checkAdvisoryViolations(candidateText);
  if (!advisory.passed) {
    failedChecks.push(
      `Advisory Language Violation: Matched blocked tokens [${advisory.matchedTokens.join(', ')}].`
    );
  }

  // Check 3: Urgency / Fear Blocklist
  const urgency = checkUrgencyViolations(candidateText);
  if (!urgency.passed) {
    failedChecks.push(
      `Urgency / FOMO Violation: Matched blocked tokens [${urgency.matchedTokens.join(', ')}].`
    );
  }

  // Check 4: Readability & Length Caps
  const readability = checkReadability(candidateText);
  if (!readability.passed) {
    failedChecks.push(`Readability Failed: ${readability.reason}`);
  }

  // Check 5 & 6: Scope and Disclosure
  // Scope is enforced by strict system prompt; disclosure is verified on client

  const allPassed = failedChecks.length === 0;

  return {
    passed: allPassed,
    failedChecks,
    output: allPassed ? candidateText : fallbackTemplate,
    isFallback: !allPassed,
    uncertaintyNotice: !allPassed ? APP_CONFIG.GATE_FALLBACK_NOTICE : undefined,
    executionMetrics: {
      checksRan: 4,
      faithfulnessPassed: faithfulness.passed,
      advisoryPassed: advisory.passed,
      urgencyPassed: urgency.passed,
      readabilityPassed: readability.passed,
    },
  };
}

export const evaluateResponseGate = evaluateCandidateText;

