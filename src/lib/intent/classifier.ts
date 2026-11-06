/**
 * Deterministic Intent Classification Taxonomy for Groww Steady.
 * Classifies user queries into 8 distinct intents.
 * Enforces immediate decline of advice/predictions (0 LLM calls) and routes cash-squeeze queries.
 * Supports English and colloquial Hinglish (EDGE-CONV-002, EDGE-CONV-004).
 */

export type UserIntent =
  | 'explain_dip'
  | 'explain_term'
  | 'explain_progress'
  | 'compare_instalment'
  | 'cash_squeeze'
  | 'advice_seeking'
  | 'prediction_seeking'
  | 'general_faq'
  | 'out_of_scope'
  | 'other';

export interface ClassificationResult {
  intent: UserIntent;
  confidence: number;
  matchedPattern?: string;
  isDeclined: boolean;
  routeToFlex: boolean;
}

export function classifyIntent(text: string): ClassificationResult {
  if (!text || typeof text !== 'string') {
    return {
      intent: 'other',
      confidence: 1.0,
      isDeclined: false,
      routeToFlex: false,
    };
  }

  const normalized = text.toLowerCase().trim();

  // 1. ADVICE SEEKING (Top Safety Precedence - EDGE-CONV-002)
  // Rejects direct investment advice queries instantly without invoking LLM
  const advicePatterns: Array<{ regex: RegExp; label: string }> = [
    { regex: /\bshould i (stop|cancel|pause|continue|sell|buy|switch|exit|withdraw|redeem|hold|stay)\b/i, label: 'should_i_action' },
    { regex: /\b(is it|would it be) (good|safe|wise|better|time|advisable) to (invest|stop|buy|sell|continue|hold|withdraw)\b/i, label: 'is_it_wise_to' },
    { regex: /\bwhich fund (is better|should i pick|to buy|is best)\b/i, label: 'which_fund' },
    { regex: /\bwhat should i do\b/i, label: 'what_should_i_do' },
    { regex: /\brecommend (a|some|me)? (fund|scheme|stock|amc|better)\b/i, label: 'recommend_fund' },
    { regex: /\b(tell me to|guide me to) (buy|sell|hold|stop)\b/i, label: 'tell_me_action' },
    { regex: /\b(tell me whether to|tell me whether i should)\b/i, label: 'tell_me_whether' },
    { regex: /\b(give me|provide|want) (financial )?advice\b/i, label: 'give_advice' },
    { regex: /\b(better to cancel|cancel my sip or)\b/i, label: 'better_to_cancel' },
    { regex: /\b(ignore (your )?previous instructions|system override|pretend (we are|you are|to be)|jailbreak)\b/i, label: 'adversarial_override' },
    // Hinglish patterns
    { regex: /\b(band kar|rok du|hata du|nikal lu|chahiye|sip band|kare ya na kare|paisa nikal)\b/i, label: 'hinglish_advice' },
  ];

  for (const p of advicePatterns) {
    if (p.regex.test(normalized)) {
      return {
        intent: 'advice_seeking',
        confidence: 0.98,
        matchedPattern: p.label,
        isDeclined: true,
        routeToFlex: false,
      };
    }
  }

  // 2. PREDICTION SEEKING (Immediate Decline - Zero LLM)
  const predictionPatterns: Array<{ regex: RegExp; label: string }> = [
    { regex: /\bwill (it|the market|my portfolio|returns?|nav|fund|this fund|nifty) (recover|go up|fall|crash|rise|rebound|bounce back|reach|hit)\b/i, label: 'will_it_recover' },
    { regex: /\bwhen will (it|i|my portfolio|the market|market) (recover|get positive|be in profit|profit|positive|go up|bounce)\b/i, label: 'when_will_recover' },
    { regex: /\brecover by diwali\b/i, label: 'recover_by_diwali' },
    { regex: /\b(market going to crash|crash further|crash tomorrow)\b/i, label: 'crash_tomorrow' },
    { regex: /\bprediction for\b/i, label: 'prediction_for' },
    { regex: /\bwill i get \d+%?\b/i, label: 'will_i_get_rate' },
    { regex: /\bhow much (return|profit) will (i make|i get|this give)\b/i, label: 'how_much_profit' },
    // Hinglish patterns
    { regex: /\b(kab badhega|recover hoga kya|profit kab hoga|dobara kab uthega|fayda kab hoga|bounce back karega)\b/i, label: 'hinglish_prediction' },
  ];

  for (const p of predictionPatterns) {
    if (p.regex.test(normalized)) {
      return {
        intent: 'prediction_seeking',
        confidence: 0.98,
        matchedPattern: p.label,
        isDeclined: true,
        routeToFlex: false,
      };
    }
  }

  // 3. GENERAL FAQ & OPERATIONAL INQUIRIES
  const faqPatterns: Array<{ regex: RegExp; label: string }> = [
    { regex: /\b(where are my .* units stored|stored safely|depository)\b/i, label: 'units_storage' },
    { regex: /\b(bank charge a penalty|penalty if i pause|charges? for pause)\b/i, label: 'bank_penalty' },
    { regex: /\bwhat happens if the market stays flat\b/i, label: 'market_flat' },
  ];

  for (const p of faqPatterns) {
    if (p.regex.test(normalized)) {
      return {
        intent: 'general_faq',
        confidence: 0.92,
        matchedPattern: p.label,
        isDeclined: false,
        routeToFlex: false,
      };
    }
  }

  // 4. CASH SQUEEZE (Route directly to Steady Flex - Phase 4 integration)
  const cashSqueezePatterns: Array<{ regex: RegExp; label: string }> = [
    { regex: /\b(tight on cash|no money|cannot afford|expense came up|emergency expense|medical emergency|salary delayed|cut expenses|low salary|tight month|financial crunch|low balance|money is tight)\b/i, label: 'cash_crunch' },
    { regex: /\b(skip|pause|reduce|lower|step down) (my|this)? ?(payment|sip|instalment|installment|debit|amount)\b/i, label: 'skip_or_lower' },
    { regex: /\b(can i skip just this month|skip just this month|skip upcoming|skip this cycle)\b/i, label: 'skip_month_query' },
    { regex: /\bdon't have (enough|sufficient|the) (money|funds|balance)\b/i, label: 'dont_have_money' },
    { regex: /\bcannot pay\b/i, label: 'cannot_pay' },
    { regex: /\bcan't pay\b/i, label: 'cant_pay' },
    // Hinglish patterns
    { regex: /\b(paisa nahi hai|salary late|kist nahi de sakta|iss mahine paise nahi|paise ki tangi|paise ki dikkat)\b/i, label: 'hinglish_cash_squeeze' },
  ];

  for (const p of cashSqueezePatterns) {
    if (p.regex.test(normalized)) {
      return {
        intent: 'cash_squeeze',
        confidence: 0.95,
        matchedPattern: p.label,
        isDeclined: false,
        routeToFlex: true,
      };
    }
  }

  // 4. COMPARE INSTALMENT (Rupee cost averaging, more/less units on dip)
  const comparePatterns: Array<{ regex: RegExp; label: string }> = [
    { regex: /\b(more units|fewer units|less units|extra units)\b/i, label: 'more_units' },
    { regex: /\b(rupee cost averaging|cost averaging|averaging effect)\b/i, label: 'rupee_cost_averaging' },
    { regex: /\bwhy did (i get|my latest|my previous) .* (units|nav)\b/i, label: 'why_did_get_units' },
    { regex: /\b(bought|got) \d+(\.\d+)? units while\b/i, label: 'bought_units_while' },
    { regex: /\bhow do lower nav .* more units\b/i, label: 'lower_nav_more_units' },
  ];

  for (const p of comparePatterns) {
    if (p.regex.test(normalized)) {
      return {
        intent: 'compare_instalment',
        confidence: 0.95,
        matchedPattern: p.label,
        isDeclined: false,
        routeToFlex: false,
      };
    }
  }

  // 5. EXPLAIN DIP
  const dipPatterns: Array<{ regex: RegExp; label: string }> = [
    { regex: /\bwhy (is it|is my|am i) (red|negative|down|losing|loss)\b/i, label: 'why_red' },
    { regex: /\bwhy is (my|the)? ?(annualized )?xirr (negative|red|down|so low)\b/i, label: 'why_xirr_negative_dip' },
    { regex: /\bdid i lose (my )?money\b/i, label: 'did_i_lose_money' },
    { regex: /\bdid i lose (my )?₹?\d+/i, label: 'did_i_lose_amount' },
    { regex: /\bwhat happened to my (sip|money|investment|capital)\b/i, label: 'what_happened' },
    { regex: /\bwhy (is )?(my )?(current )?(value|balance) less than (invested|deposited|what i put|what i deposited)\b/i, label: 'value_less_than_invested' },
    { regex: /\b(balance|value) (is )?less than (invested|deposited|what i put)\b/i, label: 'balance_less' },
    { regex: /\bmarket dip\b/i, label: 'market_dip' },
    { regex: /\bis red normal\b/i, label: 'is_red_normal' },
    { regex: /\bwhy does the app show red\b/i, label: 'app_show_red' },
    { regex: /\b(too early to judge|early to judge xirr)\b/i, label: 'early_to_judge' },
    { regex: /\b(deep market pullback|flat zero-growth|single instalment|large instalment)\b/i, label: 'synthetic_states' },
    // Hinglish patterns
    { regex: /\b(paise doob gaye kya|paisa doob gaya|market gir gaya|loss kyu hua|red kyu hai|darr lag raha hai|paisa dub gaya)\b/i, label: 'hinglish_dip' },
  ];

  for (const p of dipPatterns) {
    if (p.regex.test(normalized)) {
      return {
        intent: 'explain_dip',
        confidence: 0.95,
        matchedPattern: p.label,
        isDeclined: false,
        routeToFlex: false,
      };
    }
  }

  // 6. EXPLAIN TERM
  const termPatterns: Array<{ regex: RegExp; label: string }> = [
    { regex: /\bwhat is (a )?(annualized )?(nav|xirr|expense ratio|units?|cagr|absolute returns?|folio)\b/i, label: 'what_is_term' },
    { regex: /\bmeaning of (a )?(annualized )?(nav|xirr|units?|expense ratio)\b/i, label: 'meaning_of_term' },
    { regex: /\bwhy is (the )?(annualized )?xirr (so high|so low|negative|large|extreme)\b/i, label: 'why_xirr_negative' },
    { regex: /\bwhat does (the )?(annualized )?(nav|xirr|units?|cagr) mean\b/i, label: 'what_does_term_mean' },
    { regex: /\bexplain (the )?(annualized )?(nav|xirr|units?|expense ratio)\b/i, label: 'explain_term' },
    { regex: /\b(can you explain what units purchased means|what units purchased means)\b/i, label: 'units_purchased_mean' },
    { regex: /\bdifference between total returns and xirr\b/i, label: 'diff_returns_xirr' },
    { regex: /\bhow is my total invested amount calculated\b/i, label: 'how_invested_calculated' },
  ];

  for (const p of termPatterns) {
    if (p.regex.test(normalized)) {
      return {
        intent: 'explain_term',
        confidence: 0.95,
        matchedPattern: p.label,
        isDeclined: false,
        routeToFlex: false,
      };
    }
  }

  // 7. EXPLAIN PROGRESS
  const progressPatterns: Array<{ regex: RegExp; label: string }> = [
    { regex: /\bhow is my sip doing\b/i, label: 'how_is_sip_doing' },
    { regex: /\bhow many units (do i have|bought|owned)\b/i, label: 'how_many_units' },
    { regex: /\bhow much (have i|money) invested\b/i, label: 'how_much_invested' },
    { regex: /\bam i on track\b/i, label: 'am_i_on_track' },
    { regex: /\bmy total investment\b/i, label: 'total_investment' },
  ];

  for (const p of progressPatterns) {
    if (p.regex.test(normalized)) {
      return {
        intent: 'explain_progress',
        confidence: 0.92,
        matchedPattern: p.label,
        isDeclined: false,
        routeToFlex: false,
      };
    }
  }

  // Default to other if no specific rule matched
  return {
    intent: 'other',
    confidence: 0.5,
    isDeclined: false,
    routeToFlex: false,
  };
}
