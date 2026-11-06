/**
 * Global Configuration for Groww Steady
 * Defines business constants, regulatory disclaimers, and guardrails.
 */

export const APP_CONFIG = {
  // Brand & Identity
  WORDMARK: "Steady",
  PROTOTYPE_DISCLAIMER: "Prototype with sample data, not Groww. No real money or advice.",
  DEFAULT_SCHEME_NAME: "Sample Index Fund",

  // Mandate Rules & Thresholds
  MIN_STEP_DOWN_AMOUNT: 500, // Minimum ₹500 for step-down mandate
  MANDATE_LOCKOUT_HOURS: 72, // 72 hours modification freeze prior to debit
  DEBIT_PROXIMITY_DAYS: 5,   // Proximity trigger for Point-of-Doubt card (<= 5 days)

  // LLM Configuration
  GROQ_MODEL: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
  GROQ_FAST_MODEL: process.env.GROQ_FAST_MODEL || "openai/gpt-oss-20b",
  LLM_TEMPERATURE: 0.1,
  LLM_MAX_TOKENS: 150,
  LLM_TIMEOUT_MS: 4500, // Hard abort threshold before falling back to static templates

  // Regulatory & Educational Copy
  STANDING_DISCLOSURE:
    "Educational information only. This is not investment advice and no recommendation to buy, sell, continue or stop. Groww Steady is an independent prototype using sample data and is not affiliated with or endorsed by Groww. Mutual fund investments are subject to market risks. Read all scheme-related documents carefully.",

  ADVICE_DECLINE_COPY:
    "Steady is an educational companion and cannot advise you on whether to continue, pause, stop, or redeem your investments. Market prices fluctuate daily, and short-term movements cannot be reliably predicted. Mutual funds are designed for long-term horizons. For personalized advice, please consult a SEBI-registered investment advisor or review official investor education resources at the SEBI Investor Education website or AMFI India.",

  GATE_FALLBACK_NOTICE:
    "We couldn't verify this explanation against your numbers, so here is our standard explanation instead.",

  // Links to official investor education
  OFFICIAL_SOURCES: {
    SEBI_INVESTOR: "https://investor.sebi.gov.in",
    AMFI_INDIA: "https://www.amfiindia.com",
  },
} as const;

