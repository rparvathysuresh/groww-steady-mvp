import Groq from 'groq-sdk';
import { APP_CONFIG } from '../config';

// Lazy initialize Groq client server-side
let groqClientInstance: Groq | null = null;

function getGroqClient(): Groq {
  if (!groqClientInstance) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error('GROQ_API_KEY is not defined in server environment.');
    }
    groqClientInstance = new Groq({ apiKey });
  }
  return groqClientInstance;
}

export interface GroqCompletionOptions {
  systemPrompt: string;
  userPrompt: string;
  model?: string;
  timeoutMs?: number;
}

/**
 * Executes a completion call against Groq with a strict timeout guard (EDGE-GATE-003).
 */
export async function callGroqCompletion(options: GroqCompletionOptions): Promise<string> {
  const {
    systemPrompt,
    userPrompt,
    model = APP_CONFIG.GROQ_MODEL,
    timeoutMs = APP_CONFIG.LLM_TIMEOUT_MS,
  } = options;

  const client = getGroqClient();

  // Create an AbortController to enforce the SLA deadline
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    const response = await client.chat.completions.create(
      {
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: APP_CONFIG.LLM_TEMPERATURE,
        max_tokens: APP_CONFIG.LLM_MAX_TOKENS,
      },
      { signal: controller.signal }
    );

    clearTimeout(timeoutId);

    const choice = response.choices[0];
    if (choice?.finish_reason === 'length') {
      throw new Error('Groq response was truncated due to token limit.');
    }

    const text = choice?.message?.content?.trim();
    if (!text) {
      throw new Error('Groq returned empty response.');
    }

    return text;
  } catch (error: any) {
    clearTimeout(timeoutId);

    if (error?.name === 'AbortError' || controller.signal.aborted) {
      throw new Error(`Groq request timed out after ${timeoutMs}ms.`);
    }

    throw error;
  }
}

