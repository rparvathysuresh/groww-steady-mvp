import { NextRequest, NextResponse } from 'next/server';
import { sanitizePII } from '@/lib/intent/pii';
import { classifyIntent } from '@/lib/intent/classifier';
import { getScenarioById, DEFAULT_SCENARIO_ID } from '@/lib/scenarios';
import { computePortfolioMetrics } from '@/lib/calc/engine';
import { buildFactsPayload } from '@/lib/ai/facts';
import { STEADY_SYSTEM_PROMPT, STEADY_STRICT_RETRY_PROMPT, buildExplanationUserPrompt } from '@/lib/ai/prompts';
import { callGroqCompletion } from '@/lib/ai/groq';
import { evaluateCandidateText } from '@/lib/gate';
import { STATIC_FALLBACKS } from '@/lib/fallbacks/templates';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query = '', scenarioId = DEFAULT_SCENARIO_ID } = body;

    // 1. PII Sanitization (EDGE-CONV-001)
    const piiResult = sanitizePII(query);
    const cleanQuery = piiResult.sanitizedText;

    // 2. Intent Classification
    const intentResult = cleanQuery ? classifyIntent(cleanQuery) : {
      intent: 'explain_dip',
      confidence: 1.0,
      isDeclined: false,
      routeToFlex: false,
    };

    // 3. Short-circuit: Immediate decline for advice or prediction prompts (Zero LLM calls)
    if (intentResult.isDeclined) {
      const declineCopy =
        intentResult.intent === 'prediction_seeking'
          ? STATIC_FALLBACKS.PREDICTION_DECLINE
          : STATIC_FALLBACKS.ADVICE_DECLINE;

      return NextResponse.json({
        output: declineCopy,
        intent: intentResult.intent,
        isFallback: false,
        isDeclined: true,
        routeToFlex: false,
        hasPII: piiResult.hasPII,
        warningMessage: piiResult.warningMessage,
        checkedAgainstNumbers: false,
      });
    }

    // 4. Short-circuit: Route cash-squeeze queries to Steady Flex
    if (intentResult.routeToFlex) {
      return NextResponse.json({
        output: STATIC_FALLBACKS.CASH_SQUEEZE_GUIDANCE,
        intent: 'cash_squeeze',
        isFallback: false,
        isDeclined: false,
        routeToFlex: true,
        hasPII: piiResult.hasPII,
        checkedAgainstNumbers: false,
      });
    }

    // 5. Fetch scenario data and compute deterministic metrics
    const portfolio = getScenarioById(scenarioId);
    const metrics = computePortfolioMetrics(portfolio);
    const { payload, allowedNumbers } = buildFactsPayload(metrics, portfolio);

    const fallbackTemplate =
      intentResult.intent === 'explain_progress'
        ? STATIC_FALLBACKS.getProgressFallback(metrics, portfolio)
        : STATIC_FALLBACKS.getDipFallback(metrics, portfolio);

    // 6. Attempt Groq API Generation with 6-Point Runtime Gate
    let candidateText = '';
    let gateResult;

    try {
      // First attempt
      const userPrompt = buildExplanationUserPrompt(intentResult.intent, cleanQuery || undefined, payload);
      candidateText = await callGroqCompletion({
        systemPrompt: STEADY_SYSTEM_PROMPT,
        userPrompt,
      });

      gateResult = evaluateCandidateText(candidateText, allowedNumbers, fallbackTemplate);

      // If first attempt failed, retry once with stricter prompt (EDGE-GATE-004)
      if (!gateResult.passed) {
        console.warn('Gate check failed on first attempt:', gateResult.failedChecks);
        const retryUserPrompt = `${userPrompt}\n\n${STEADY_STRICT_RETRY_PROMPT}`;
        const retryText = await callGroqCompletion({
          systemPrompt: STEADY_SYSTEM_PROMPT,
          userPrompt: retryUserPrompt,
        });

        gateResult = evaluateCandidateText(retryText, allowedNumbers, fallbackTemplate);
      }
    } catch (llmError: any) {
      console.error('Groq LLM invocation error or timeout:', llmError?.message);
      // Degrade gracefully to deterministic fallback (EDGE-GATE-003)
      gateResult = {
        passed: false,
        failedChecks: [llmError?.message || 'LLM Generation Error'],
        output: fallbackTemplate,
        isFallback: true,
        uncertaintyNotice: STATIC_FALLBACKS.UNCERTAINTY_NOTICE,
        executionMetrics: {
          checksRan: 0,
          faithfulnessPassed: false,
          advisoryPassed: false,
          urgencyPassed: false,
          readabilityPassed: false,
        },
      };
    }

    return NextResponse.json({
      output: gateResult.output,
      intent: intentResult.intent,
      isFallback: gateResult.isFallback,
      isDeclined: false,
      routeToFlex: false,
      hasPII: piiResult.hasPII,
      warningMessage: piiResult.warningMessage,
      uncertaintyNotice: gateResult.uncertaintyNotice,
      checkedAgainstNumbers: !gateResult.isFallback,
      executionMetrics: gateResult.executionMetrics,
    });
  } catch (error: any) {
    console.error('API /api/explain internal error:', error);
    return NextResponse.json(
      {
        output:
          'Your portfolio value moves daily with market movements. Units purchased remain permanently in your account.',
        isFallback: true,
        isDeclined: false,
        routeToFlex: false,
        uncertaintyNotice: STATIC_FALLBACKS.UNCERTAINTY_NOTICE,
        checkedAgainstNumbers: false,
      },
      { status: 200 }
    );
  }
}

