# Groww Steady: Eval-Gated Point-of-Doubt Companion & Flexible SIP Controls

> **Independent Student Capstone Prototype • Product Manager Fellowship Graduation MVP**  
> *Built with Next.js 14, TypeScript, Tailwind CSS, Zustand, Vitest, and Groq SDK.*  
> *Uses synthetic sample data and original visual assets. Not affiliated with or endorsed by Groww.*

---

## 1. Executive Summary & Problem Context

First-time systematic investment plan (SIP) investors in India frequently abandon their investments within the first 3 to 6 months:
1. **The Month 3 Dip Panic:** When market pullbacks cause early portfolio valuations to dip into the red with a negative annualized XIRR, anxious beginners assume their capital has been wiped out.
2. **The Month 6 Cash Squeeze:** When unplanned personal expenses arise, rigid all-or-nothing banking mandates force users into total cancellation because temporary pause controls are buried or unavailable.
3. **The Unregulated Advice Dilemma:** Anxious users turn to customer care or chat requesting explicit advice (*"Should I stop my SIP?"*), but fintech platforms cannot legally provide investment recommendations without SEBI registration.

**Groww Steady** solves this with a two-part intervention:
- **Point-of-Doubt Companion:** Reassures users at the exact moment of doubt by explaining rupee-cost averaging mechanics, units accumulated, and short-tenure XIRR skews. Powered by an eval-gated LLM pipeline with a **strictly zero-advice, zero-hallucination guarantee**.
- **Steady Flex Controls:** Lightens mandate pressure during tight months through guilt-free 1-month skips or temporary step-downs (down to ₹500), paired with an educational, non-coercive cancellation flow.

---

## 2. Core Architectural Principles

```
  ┌─────────────────────────────────────────────────────────────┐
  │                 Investor Query / Dip Screen                 │
  └──────────────────────────────┬──────────────────────────────┘
                                 │
                     1. PII Regex Sanitizer
                     (Phones, PANs, Emails masked)
                                 │
                    2. Fast Intent Classifier
            ┌────────────────────┴────────────────────┐
            ▼                                         ▼
   [Advice / Prediction]                     [Factual Explanation]
   Short-circuited in <10ms                 (Explain Dip / Jargon)
   Zero LLM calls made                                │
   Static SEBI decline copy                           ▼
                                            Deterministic Math Engine
                                          (XIRR, units, total invested)
                                                      │
                                                      ▼
                                           Facts Payload Serializer
                                          (Exact numeric whitelist)
                                                      │
                                                      ▼
                                            Groq LLM Generation
                                           (openai/gpt-oss-120b)
                                                      │
                                                      ▼
                                       ┌─────────────────────────────┐
                                       │ 6-POINT RUNTIME EVAL GATE   │
                                       │ 1. Numeric Faithfulness     │
                                       │ 2. Advisory Blocklist       │
                                       │ 3. Urgency / FOMO Blocklist │
                                       │ 4. Readability / Sentences  │
                                       │ 5. Domain Grounding         │
                                       │ 6. SEBI Statutory Notice    │
                                       └──────────────┬──────────────┘
                                                      │
                                    ┌─────────────────┴─────────────────┐
                                    ▼                                   ▼
                             [Gate PASSED]                       [Gate FAILED]
                            Verified Plain Copy               Static Pre-Authored Copy
                         "Checked against numbers"             "Uncertainty Notice" Chip
```

### The Three Invariants
1. **The AI Never Computes:** All monetary calculations, NAV averages, and XIRR rates originate deterministically from the standalone calculation engine (`src/lib/calc/`). The LLM is strictly restricted to contextual phrasing using an immutable facts whitelist.
2. **Strict Zero Advice Policy:** The platform strictly prohibits recommendations to buy, sell, hold, continue, stop, switch, or redeem. Queries seeking advice are short-circuited instantly.
3. **Dual Audience Isolation:**
   - **Consumers** see an intuitive, reassuring mobile app showing only verified context and a `"Checked against your numbers"` chip.
   - **Evaluators & Mentors** access the standalone [`/evaluators`](file:///c:/Users/rparv/.antigravity-ide/Groww%20Steady/src/app/evaluators/page.tsx) benchmark dashboard and CLI evaluation runner (`npm run eval:run`).

---

## 3. Project Structure

```
├── docs/                     # Specifications, architecture, evals, and edge cases
│   ├── problemstatement.txt  # Fellowship capstone prompt
│   ├── context.md            # Comprehensive project context & data models
│   ├── architecture.md       # Engineering blueprint & system diagrams
│   ├── edge-case.md          # 25 cataloged boundary conditions
│   ├── eval.md               # Acceptance test specifications
│   └── implementation-plan.md # 7-phase build tracker
├── evals/                    # Offline Evaluation Harness
│   ├── golden_set.jsonl      # 42 curated test cases (20 discovery, 16 adversarial, 6 synthetic)
│   ├── runner.ts             # Automated evaluation execution engine
│   └── results/              # Output JSON evaluation benchmarks
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── page.tsx          # Landing page & persona selector
│   │   ├── app/page.tsx      # Dashboard view (SIP summary, portfolio cards)
│   │   ├── sip/[id]/page.tsx # Detailed SIP view (DipCard, JargonSheet, Flex controls)
│   │   ├── evaluators/       # Dedicated Evaluator Benchmark Dashboard
│   │   └── api/
│   │       ├── explain/      # Groq generation + 6-point evaluation gate route
│   │       └── evals/        # Test runner trigger & results retrieval route
│   ├── components/
│   │   ├── shell/            # MobileFrame, PrototypeBanner, Navbars, ResetControl
│   │   ├── context/          # DipCard, JargonSheet, ChatDrawer, CheckedChip
│   │   ├── flex/             # FlexModal, SkipStepSheet, StepDownSheet, AuditTimeline
│   │   ├── cancellation/     # Non-coercive educational CancelSheet
│   │   ├── sip/              # SIPHeader, MetricGrid, InstalmentList, ActionFooter
│   │   └── shared/           # AccessibleBadge (sign + icon + text)
│   └── lib/
│       ├── ai/               # Groq SDK client, prompts, facts payload builders
│       ├── calc/             # Deterministic XIRR & portfolio return engine
│       ├── flex/             # Steady Flex mandate state machine & 72h lockout
│       ├── gate/             # 6-Point Runtime Evaluation Gate
│       ├── intent/           # PII sanitizer & deterministic classifier
│       ├── scenarios/        # Scenarios A (Aarav), B (Priya), C (Rohan)
│       └── store/            # Reactive session state & audit log
└── tests/                    # Vitest automated test suite (19 test files, 69 tests)
```

---

## 4. Setup & Running Locally

### Prerequisites
- Node.js 18+ (tested on Node 20 & 24)
- npm 9+

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd "Groww Steady"
npm install
```

### 2. Environment Secrets
Copy the environment template and provide your Groq API key:
```bash
cp .env.example .env.local
```
Edit `.env.local`:
```env
GROQ_API_KEY=gsk_your_actual_groq_api_key_here
GROQ_MODEL=openai/gpt-oss-120b
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. Testing & Verification

### Unit & Integration Test Suite (Vitest)
Runs 19 test files covering mathematical calculations, 72h lockouts, PII masking, runtime gate checks, and state resets:
```bash
npm test
```

### Offline Evaluation Harness (Golden Set Benchmark)
Runs all 42 Golden Set test cases against the intent classifier, Groq engine, and runtime evaluation gate:
```bash
npm run eval:run
```

**Benchmark Results:**
- **Intent Agreement Rate:** `100.0%` (Target: $\ge 90.0\%$)
- **Behaviour Match Rate:** `100.0%` (Answer vs. Decline vs. Route)
- **Advisory Language Violations:** `0` (Target: Strictly 0)
- **Numeric Faithfulness:** `100.0%` (Target: 100%)
- **Average Query Latency:** `< 10ms` for short-circuited advice; `< 1.2s` for generative completions

### Production Build
```bash
npm run build
```

---

## 6. Evaluator & Mentor Guide

For evaluators reviewing this prototype:
1. **Entry Landing Page (`/`):**
   - Review the problem overview and scenario personas.
   - Choose **Scenario A (Aarav)** to test Month 3 dip psychology.
   - Choose **Scenario B (Priya)** to test Month 6 cash squeeze navigation.
2. **The Point-of-Doubt Experience (`/sip/[id]`):**
   - Inspect the **DipCard**: notice the clear breakdown of accumulated units, latest NAV, and the `"Checked against your numbers"` chip.
   - Tap on **XIRR** or **NAV** in the metrics grid to open the 1-tap plain-English glossary sheet.
   - Tap **"Ask Steady"**:
     - Type *"Should I stop my SIP?"* $\rightarrow$ observe instant educational decline without advice.
     - Type *"I don't have enough money this month"* $\rightarrow$ observe instant guidance routing to Steady Flex.
3. **Steady Flex Mandate Adjustments:**
   - Tap **"Skip or Edit Amount (Steady Flex)"** to test 1-month skip or step-down.
   - Tap **"Cancel SIP"** to inspect the non-coercive informational sheet (zero countdown clocks, zero guilt streak warnings, equal-weight lighter alternatives).
4. **Evaluation Dashboard (`/evaluators`):**
   - Click the footer link on the landing page to open the live evaluation dashboard.
   - Inspect the KPI summary cards, gate breakdown, and documented real gate interventions.
   - Use the interactive table to filter and inspect test case executions.
5. **State Reset:**
   - Tap the floating **"Reset Demo"** pill anytime to clear all session state back to the scenario baseline.

---

## 7. License & Disclaimers

- **Academic Prototype:** This software was developed solely as an educational graduation project.
- **Statutory Notice:** Mutual fund investments are subject to market risks, read all scheme related documents carefully. Past performance is not indicative of future returns.

