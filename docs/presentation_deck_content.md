# Groww Steady: Capstone Presentation Slide Deck Content

> **Product Manager Fellowship Graduation Presentation**  
> **Topic:** Point-of-Doubt Companion & Flexible SIP Mandate Controls for First-Time Mutual Fund Investors  
> **Format Guidelines:** 10 Slides • Clear takeaway titles • Colorblind-safe palette • Anonymized (zero personal names)  
> **Design Theme:** Groww Dark Slate & Teal (`#00D09C` Accent, `#1E222B` Surface, `#FFFFFF` Text, `#38BDF8` Secondary)

---

## Slide 1: Title & Executive Summary

### Title:
# Groww Steady: Halting First-Time SIP Drop-Off with Eval-Gated Context and Flexible Autopay Controls

### Subtitle / Metadata:
*An Eval-Gated Point-of-Doubt Companion and Steady Flex Mandate Engine for Early-Career Retail Investors*  
**Graduation Capstone MVP • Independent Student Prototype**

### Key Content Blocks:
- **The Core Problem:** 48% of first-time mutual fund SIP investors stop their autopay within 6 months due to Month 3 dip panic and Month 6 cash crunches.
- **The Regulatory Trap:** Fintechs cannot legally advise users to continue investing without violating SEBI regulations.
- **The Solution:** A deterministic point-of-doubt context companion governed by a 6-Point Runtime Evaluation Gate, paired with guilt-free mandate flexibility (Skip & Step-Down).
- **Key Headline Result:** 100% of tested users avoided cancellation, confidence increased by +109%, and 0 advisory violations occurred across 42 Golden Set test cases.

---

## Slide 2: The User Problem

### Title:
# First-Time Investors Cancel SIPs Due to Month 3 Market Dips and Month 6 Cash Squeezes

### Visual Layout:
*Two-column comparative problem breakdown with investor journey milestones.*

### Column 1: Month 3 "Point of Doubt" (Panic Selling)
- **What happens:** First-time salaried investors (ages 21–28) start with ₹2,500/month. At Month 3, a mild market correction drops portfolio value from ₹7,500 to ₹7,258.
- **The Distortion:** Annualizing a 3-month dip produces a frightening negative XIRR of `-16.8%`.
- **The Mental Model Failure:** Beginners believe their hard-earned money has been permanently lost. With zero plain context on rupee-cost averaging, they cancel their SIP or redeem.

### Column 2: Month 6 "Cash Squeeze" (Rigid Autopay)
- **What happens:** An unplanned festival, rent deposit, or medical bill arises.
- **The Mandate Wall:** The existing autopay mandate is all-or-nothing. Lighter pause or step-down options are hidden or require 10-day physical forms.
- **The Forced Cancellation:** To protect their bank account from a ₹450 insufficient-funds bounce penalty, users hit "Cancel SIP" and permanently exit the mutual fund ecosystem.

---

## Slide 3: The Regulatory Double-Bind & AI Discovery Engine

### Title:
# Anxious Investors Ask for Advice, But Unregulated AI Advice Violates SEBI Guidelines

### Visual Layout:
*Diagram illustrating user anxiety vs. regulatory constraints.*

### Key Points:
1. **The Chat Prompt Reality:** When market dips occur, users type direct advice questions into support:
   - *"Should I stop my SIP right now?"*
   - *"Will this fund recover by next month?"*
2. **The Compliance Wall:** Under SEBI (Investment Advisers) Regulations (2013), execution-only platforms cannot advise retail users to *"buy the dip"*, *"hold"*, or *"continue investing"*.
3. **The Danger of Standard LLMs:** Standard conversational models hallucinate future recovery promises (*"Don't worry, markets always rebound!"*) or use subtle advisory framing (*"It is prudent to stay invested"*).
4. **Our Solution:** A deterministic classifier that short-circuits all advice/prediction queries in **under 10 milliseconds**, delivering objective statutory educational disclaimers with **zero LLM tokens burned**.

---

## Slide 4: System Architecture & The 6-Point Runtime Gate

### Title:
# Decoupling Fluent AI Explanations from Deterministic Calculations Guarantees Zero Hallucinations

### Architecture Flow:
`User Query` $\rightarrow$ `PII Sanitizer` $\rightarrow$ `Deterministic Classifier` $\rightarrow$ `Math Engine Whitelist` $\rightarrow$ `Groq LLM Generation` $\rightarrow$ `6-Point Runtime Gate` $\rightarrow$ `Verified Output`

### The 6 Gate Verification Checks:
1. **Numeric Faithfulness:** All numerals in model output must match the calculation engine's pre-computed whitelist. Rejects any invented return figure.
2. **Advisory Language Blocklist:** Regex filter strictly suppressing direct or subtle advice tokens (*buy, sell, hold, continue, prudent, recommend*).
3. **Urgency & FOMO Blocklist:** Blocks alarmist terminology (*panic, market crash, hurry, act now*).
4. **Readability & Length Validator:** Caps answers at 2–4 sentences (&le;85 words) targeted for Grade 8 reading comprehension.
5. **Domain & Folio Grounding:** Explains only the user's active fund folio; blocks macro speculations.
6. **Statutory SEBI Risk Notice:** Enforces mandatory risk disclosure banner on every view.

### Fail-Safe Guarantee:
Any runtime failure or gate rejection immediately renders pre-written deterministic copy with an **Uncertainty Notice** chip.

---

## Slide 5: The Golden Set & Offline Evaluation Harness

### Title:
# The 42-Case Golden Set Achieved 100% Intent Agreement and Zero Advisory Violations

### Visual Layout:
*KPI cards and category breakdown table from the automated evaluation runner.*

### Benchmark Results Table:
| Evaluation Metric | Benchmark Threshold | Prototype Result | Status |
|---|---|---|---|
| **Golden Set Suite Size** | &ge; 40 cases | **42 test cases** | **PASSED** |
| **Intent Agreement Rate** | &ge; 90.0% | **100.0%** | **PASSED** |
| **Behaviour Agreement Rate** | &ge; 90.0% | **100.0%** | **PASSED** |
| **Advisory Violations in Shipped Copy** | Strictly 0 | **0 Violations** | **PASSED (Zero Tolerance)** |
| **Numeric Faithfulness in Shipped Copy** | Strictly 100% | **100.0%** | **PASSED** |
| **Latency for Direct Advice / Predictions** | < 50ms | **< 10ms (0 LLM calls)** | **PASSED** |

### Evaluator Dashboard (`/evaluators`):
- Standalone portal isolated from the consumer app shell.
- Includes audit logs of **3 real intercepted AI outputs** (hallucinated returns, advisory phrases, and urgency vocabulary) detailing why the gate intervened.

---

## Slide 6: Product Feature 1: The Point-of-Doubt Companion

### Title:
# Reassuring Beginners with Rupee-Cost Averaging Context at the Moment of Dip Anxiety

### Visual Walkthrough:
*Mobile mockup of Scenario A: Aarav (Month 3 Index Fund Pullback).*

### Core Screen Elements:
1. **The DipCard ("What your last instalment bought"):**
   - Shows total invested: **₹7,500.00** vs. Current value: **₹7,258.04**.
   - Highlights that Month 3 purchase bought **14.8017 units** at NAV ₹168.90 compared to **14.1723 units** at NAV ₹176.40 in Month 1.
   - Replaces the mental model of *"I lost ₹242"* with *"I bought extra ownership units at a lower price"*.
2. **"Checked Against Your Numbers" Chip:**
   - Gives users instant transparency that the figures shown are computed deterministically from their folio, not created by generative AI.
3. **1-Tap Jargon Sheet:**
   - Tapping on XIRR, NAV, or Units opens a plain-English popup explaining why 3-month annualized numbers appear extreme.
4. **Accessible Color-Blind Indicators:**
   - Triple redundancy: Minus sign `-`, directional arrow `▼`, and explicit text tag `LOSS` guarantee clarity under color-vision deficiency.

---

## Slide 7: Product Feature 2: Steady Flex Mandate Controls

### Title:
# Guilt-Free Autopay Adjustments: Skip 1 Month or Step Down Temporarily to ₹500

### Visual Walkthrough:
*Mobile mockup of Steady Flex Modal and Informational Cancellation Sheet.*

### Core Controls:
1. **Skip Upcoming Instalment:**
   - Pauses the upcoming debit for 1 month with ₹0 debited; automatically resumes next cycle.
   - Enforces strict **72-hour banking freeze lockout** (`EDGE-FLEX-001`) to prevent bounce penalties.
   - Blocks consecutive skips (`EDGE-FLEX-002`) to ensure mandate compliance.
2. **Temporary Step-Down:**
   - Allows users to reduce monthly commitment to ₹500, ₹1,000, or ₹1,500 for 1 to 3 cycles.
   - Shows an explicit restoration schedule: *"Automatically restores to ₹2,500 on Jan 10"*.
3. **In-App Mandate Audit Timeline:**
   - Transparently logs every simulated autopay modification with an exact timestamp.
4. **Non-Coercive Cancellation Sheet:**
   - Explains factually: future debits stop, but all existing units remain safely invested.
   - Equal-prominence presentation of lighter alternatives (Skip / Step Down).
   - Zero countdown timers, zero streak-loss guilt copy, zero dark patterns.

---

## Slide 8: Step 2 User Testing Evidence & Metrics

### Title:
# User Testing with 5 Target Investors Proved 100% Comprehension and Zero Perceived Advice

### Visual Layout:
*Participant quotes, metric callouts, and confidence rating delta.*

### Headline Testing Results:
- **100% Comprehension (5/5 users):** Every participant articulated that daily market swings change valuation, but their units owned remain permanently intact.
- **100% Mandate Retention:** 0 of 5 users cancelled their SIP when given a cash squeeze scenario.
  - **60% (3 users)** selected **Skip 1 Month**.
  - **40% (2 users)** selected **Step Down to ₹500**.
- **0% Perceived Advice:** 100% of participants confirmed that companion outputs felt objective, informative, and non-coercive.
- **Confidence Rating Shift:** Increased from **2.2 / 5.0 to 4.6 / 5.0 (+109% increase)** on whether they felt what they saw was normal.

### Participant Quotes:
> *"Usually seeing red made me want to cancel. The DipCard showed me I actually got extra units when the price fell. It completely changed how I think about market dips."* — P1 (Age 23, Software Engineer)

> *"The step-down slider is brilliant. Having 'Cancel Anyway' right next to 'Skip' without countdown timers made me trust the lighter options much more."* — P4 (Age 27, Risk Analyst)

---

## Slide 9: Business Impact & Retention Economics

### Title:
# Preventing Premature SIP Cancellations Drives Long-Term Platform AUM Growth

### Visual Layout:
*Unit economics funnel comparing standard fintech SIP retention vs. Groww Steady.*

### Retention Funnel Impact:
- **The Industry Baseline:** Industry data shows ~48% of SIPs started by first-time investors discontinue within Month 6, creating high Customer Acquisition Cost (CAC) wastage.
- **Projected Drop-Off Reduction:**
  - Month 3 Dip Panic Cancellations: **-45% reduction** through Point-of-Doubt rupee-cost averaging education.
  - Month 6 Cash Crunch Cancellations: **-60% reduction** through Steady Flex (Skip / Step-Down) options.
- **Compounding AUM Economics:**
  - Average SIP size: ₹2,500/month.
  - Retaining 100,000 active SIPs for an additional 18 months generates **₹450 Crore in cumulative retained AUM**.
  - Recurring distributor trail commission / advisory fees scale directly with retained lifetime value (LTV).

---

## Slide 10: Implementation Roadmap & Next Steps

### Title:
# Phased Production Rollout Roadmap: Pre-Debit Alerts, Audio Jargon & Goal-Linked Units

### Visual Layout:
*Quarterly Gantt / Milestone Roadmap across engineering, compliance, and growth.*

### Milestone Roadmap:
1. **Phase 1: Production Pilot (Months 1–2):**
   - Integration with NPCI NACH / e-Mandate APIs for automated 72h pause instructions.
   - Internal dogfooding with 5,000 active retail accounts.
2. **Phase 2: Proactive Nudges & Visual Charts (Months 3–4):**
   - Implement **P0 Backlog Item:** Automated push notifications 96 hours before scheduled debit with 1-tap Skip before the 72h cutoff.
   - Implement **P1 Backlog Item:** Monotonic *"Units Owned Over Time"* staircase graph on SIP Detail page.
3. **Phase 3: Vernacular Accessibility & Goal Tags (Months 5–6):**
   - Implement **P2 Backlog Item:** Audio voice summaries in Hindi, Tamil, and Telugu for jargon tooltips.
   - Implement **P3 Backlog Item:** Goal-linked SIP labels (e.g., *"Emergency Fund"*, *"Japan Trip"*).
4. **Phase 4: Ecosystem Expansion (Months 7+):**
   - Extend Steady Flex mandate state machine to ELSS tax-saving funds and corporate bond SIPs.

### Closing Statement:
**Groww Steady bridges the gap between anxious beginner psychology and regulatory compliance — transforming panic-driven cancellations into resilient, multi-year compounding investors.**

