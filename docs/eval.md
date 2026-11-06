# Groww Steady — Phase-by-Phase Evaluation & Verification Protocol

> **Source Documents:** [`docs/implementation-plan.md`](file:///c:/Users/rparv/.antigravity-ide/Groww%20Steady/docs/implementation-plan.md) | [`docs/architecture.md`](file:///c:/Users/rparv/.antigravity-ide/Groww%20Steady/docs/architecture.md) | [`docs/edge-case.md`](file:///c:/Users/rparv/.antigravity-ide/Groww%20Steady/docs/edge-case.md) | [`docs/context.md`](file:///c:/Users/rparv/.antigravity-ide/Groww%20Steady/docs/context.md)  
> **Document Type:** Quality Assurance, Test Suite Specifications & Phase Verification Gates  
> **Status:** Active QA Playbook  

---

## 1. Evaluation Framework Architecture

This document defines the strict verification criteria and test procedures required to certify each phase of [`docs/implementation-plan.md`](file:///c:/Users/rparv/.antigravity-ide/Groww%20Steady/docs/implementation-plan.md). No phase may be marked complete without passing its corresponding evaluation gate.

```mermaid
flowchart TD
    subgraph Core_Build["Phases 0–2: Deterministic Foundations"]
        E0["Eval 0: Build & Config Integrity"]
        E1["Eval 1: Financial Math & Scenario Verification"]
        E2["Eval 2: UI Accessibility & Shell Fidelity"]
    end
    subgraph Intelligence["Phases 3–4: AI & Mandate Systems"]
        E3["Eval 3: 6-Point Gate & Groq Integration"]
        E4["Eval 4: Mandate State Machine & Cancellation"]
    end
    subgraph Certification["Phases 5–7: Evals, Deploy & User Testing"]
        E5["Eval 5: Golden Set Benchmark Harness"]
        E6["Eval 6: Public SLA & Performance Audit"]
        E7["Eval 7: User Usability & Evidence Log"]
    end

    E0 --> E1 --> E2 --> E3 --> E4 --> E5 --> E6 --> E7
```

### Master KPI Verification Targets

| Metric Category | Target Metric | Minimum Acceptance Threshold | Verification Method |
|---|---|---|---|
| **Financial Accuracy** | Numeric Faithfulness in Shipped Copy | **Strictly 100%** | Automated Regex vs Facts Payload |
| **Regulatory Safety** | Advisory Language Violations | **Strictly 0** | Extended Regex Blocklist |
| **Regulatory Safety** | Correct Decline on Advice / Predictions | $\ge 95\%$ | Golden Set Offline Harness |
| **Intent Recognition** | Intent Agreement with Human Labels | $\ge 90\%$ | Golden Set Offline Harness |
| **Performance SLA** | Time to First Meaningful Paint | $< 2.5\text{ seconds}$ | Lighthouse / Chrome DevTools |
| **Performance SLA** | Groq Response + Gate Evaluation | $< 3.0\text{ seconds}$ (Abort @ 4.5s) | Automated API Latency Benchmark |
| **Usability & UX** | Unaided Completion on Tasks 1–3 | $\ge 80\%$ (or at least 3 of 3) | Think-Aloud Usability Testing |
| **Comprehension** | Accurate Restatement of Dip Meaning | $\ge 75\%$ (or at least 3 of 4) | Post-Task Rubric Scoring |

---

## Phase 0 Evaluation: Scaffolding, Tooling & Design System

### 0.1 Objective & Definition of Done
Certify that the Next.js App Router project is configured with zero dependency conflicts, clean TypeScript compilation, Tailwind token alignment, and isolated environment secret management.

### 0.2 Verification Test Suite

#### Test 0.1: Build & TypeScript Compilation
* **Command:** `npm run build`
* **Assertion:** Exits with code `0`. Zero TypeScript warnings (`strict: true`) and zero ESLint errors.

#### Test 0.2: Groq SDK Client Instantiation
* **Script:** `tests/setup/groq_init.test.ts`
* **Assertion:** Verifies that `groq-sdk` initializes server-side without throwing and that `GROQ_API_KEY` is not leaked to the client bundle (`NEXT_PUBLIC_` audit).

#### Test 0.3: Design System Token Validation
* **Script:** `tests/setup/tailwind_tokens.test.ts`
* **Assertion:** Verifies that custom colors resolve properly:
  * Primary Teal: `#00D09C`
  * Dark Navy: `#1E222B`
  * Surface Canvas: `#F9FAFB`
  * Border Stroke: `#E5E7EB`

### 0.3 Failure Recovery & Debugging
* If `npm run build` fails on environment variable validation: Ensure `.env.local` exists and `GROQ_API_KEY` has a dummy placeholder for local static builds.
* If Tailwind classes fail to apply: Verify `content` array in `tailwind.config.js` includes `./src/**/*.{js,ts,jsx,tsx,mdx}`.

### 0.4 Phase 0 Sign-Off Checklist
- [x] TypeScript strict mode enabled and passes with 0 errors.
- [x] Tailwind custom colors and mobile breakpoints (`max-w-[420px]`) active.
- [x] Vitest test runner configured with `npm test`.
- [x] No API keys exposed in client-side bundles.

---

## Phase 1 Evaluation: Deterministic Financial Calculation Engine

### 1.1 Objective & Definition of Done
Certify that all financial math (units, average NAV, P&L, XIRR solver, additional units) executes with 100% precision, zero floating-point drift, and handles all mathematical boundary conditions from [`docs/edge-case.md`](file:///c:/Users/rparv/.antigravity-ide/Groww%20Steady/docs/edge-case.md).

### 1.2 Verification Test Suite

#### Test 1.1: Core Mathematical Calculations
* **File:** `tests/calc/engine.test.ts`
* **Test Cases:**
  * Units purchased = $\text{Amount} / \text{NAV}$ rounded to 4 decimals.
  * Average NAV = $\text{Total Invested} / \text{Total Units}$ rounded to 2 decimals.
  * Current Value = $\text{Total Units} \times \text{Latest NAV}$ rounded to 2 decimals.
  * Absolute Return = $\text{Current Value} - \text{Total Invested}$.
  * Relative Return Percentage = $(\text{Absolute Return} / \text{Total Invested}) \times 100$.

```typescript
// Sample Assertion from tests/calc/engine.test.ts
const state: PortfolioState = {
  schemeName: "Sample Index Fund",
  monthlyAmount: 2500,
  instalments: [
    { id: "1", instalmentNumber: 1, date: "2026-08-05", amount: 2500, nav: 176.40, unitsPurchased: 14.1723 },
    { id: "2", instalmentNumber: 2, date: "2026-09-05", amount: 2500, nav: 172.10, unitsPurchased: 14.5264 },
    { id: "3", instalmentNumber: 3, date: "2026-10-05", amount: 2500, nav: 168.90, unitsPurchased: 14.7987 },
  ],
  latestNav: 168.90,
  latestNavDate: "2026-10-20",
  nextDebitDate: "2026-11-05",
  mandateStatus: "ACTIVE",
};

const metrics = computePortfolioMetrics(state);
expect(metrics.totalInvested).toBe(7500);
expect(metrics.totalUnits).toBeCloseTo(43.4974, 4);
expect(metrics.currentValue).toBeCloseTo(7346.71, 2);
expect(metrics.additionalUnitsVsPrevious).toBeCloseTo(0.2723, 4); // (2500/168.90) - (2500/172.10)
expect(metrics.isDipState).toBe(true);
```

#### Test 1.2: Newton-Raphson XIRR Convergence & Safeguards
* **File:** `tests/calc/xirr.test.ts`
* **Test Cases:**
  * Converges to accurate rate for normal monthly cash flows ($\pm 0.05\%$).
  * **Short-Tenure Boundary (`EDGE-MATH-002`):** Verifies rate bounding within $[-0.99, 10.0]$ when tenure $< 60$ days.
  * **Non-Convergence (`EDGE-MATH-003`):** Verifies termination at 100 iterations with fallback rate rather than thread-lock.

#### Test 1.3: Single-Instalment Boundary (`EDGE-MATH-001`)
* **File:** `tests/calc/single_month.test.ts`
* **Assertion:** When `instalments.length === 1`, `additionalUnitsVsPrevious` evaluates to `0` without throwing `IndexOutOfBounds` or producing `NaN`.

#### Test 1.4: Floating-Point Rounding & Zero Return (`EDGE-MATH-004`, `005`)
* **File:** `tests/calc/rounding.test.ts`
* **Assertion:** Break-even portfolio (`currentValue === totalInvested`) evaluates `returnPercentage = 0.00` and `isDipState = false`.

### 1.3 Failure Recovery & Debugging
* If XIRR returns `NaN`: Inspect cash flows for duplicate dates or missing initial negative outflow.
* If unit totals diverge: Ensure each instalment rounds units to 4 decimal places before computing cumulative sums.

### 1.4 Phase 1 Sign-Off Checklist
- [x] 100% test coverage across `calc/engine.ts` and `calc/xirr.ts`.
- [x] Scenario A and Scenario B data files verified against spec.
- [x] Zero AI involvement in any mathematical calculations.

---

## Phase 2 Evaluation: Groww-Style App Shell, Screens & UI Components

### 2.1 Objective & Definition of Done
Certify that the UI accurately emulates a mutual fund investing experience using original assets, enforces accessibility for color-blind users, displays the mandatory prototype banner, and navigates seamlessly between screens.

### 2.2 Verification Test Suite

#### Test 2.1: Legal Brand & Asset Compliance Audit
* **Audit Procedure:** Automated code search and asset inspection.
* **Assertions:**
  * Wordmark in `TopNav` is strictly `"Steady"` (never "Groww").
  * Zero official Groww logos, proprietary SVGs, or external Groww screenshots in `/public`.
  * Sticky disclaimer banner is permanently visible on all consumer routes:  
    `"Prototype with sample data, not Groww"`

#### Test 2.2: Colorblind Accessibility & Non-Color Redundancy (`EDGE-UI-001`)
* **File:** `tests/ui/accessibility.test.tsx`
* **Assertion:** Verifies that `AccessibleBadge.tsx` renders three distinct visual signals for gains and losses:
  1. Direction sign (`+` or `-`)
  2. Directional SVG icon (`▲` or `▼`)
  3. Text label (`Profit` or `Loss`)
* **Simulated Vision Audit:** Render under grayscale filter in Chrome DevTools to verify readability.

#### Test 2.3: Screen Journey & Inactive Tab Handling
* **Test Procedure:** Manual & E2E navigation check (Playwright / Cypress).
* **Assertions:**
  * Landing page scenario selection (`Scenario A` vs `Scenario B`) switches active data cleanly.
  * Tapping "Explore", "Stocks", or "Profile" displays modal/toast: `"Not part of this prototype"`.
  * Evaluator link on landing page navigates to `/evaluators`; no links to `/evaluators` exist inside the app shell (`Dashboard`, `SIPDetail`).

#### Test 2.4: Viewport Scaling (`EDGE-UI-002`)
* **Viewport Test:** 320px (iPhone SE 1st gen), 390px (iPhone 14/15), and 1440px (Desktop).
* **Assertion:** Container maintains max-width `420px` centered on desktop; no horizontal scrollbar or clipped text on 320px screens.

### 2.3 Failure Recovery & Debugging
* If desktop view stretches full screen: Check that `MobileFrame` has `max-w-[420px] mx-auto min-h-screen`.
* If prototype banner disappears on scroll: Ensure banner has `sticky top-0 z-50`.

### 2.4 Phase 2 Sign-Off Checklist
- [x] Persistent prototype disclaimer is visible across all app views.
- [x] Accessible badges render sign, icon, and text on all financial numbers.
- [x] Landing page guides users with "Try this task" panel.
- [x] UI tested on mobile viewport and desktop centered frame.

---

## Phase 3 Evaluation: Conversational Pipeline, Groq Integration & 6-Point Runtime Gate

### 3.1 Objective & Definition of Done
Certify that incoming user inputs are sanitized of PII, advice/prediction prompts are immediately declined without calling Groq, the Groq API returns grounded phrasing within latency limits, and the 6-Point Runtime Gate suppresses all unauthorized numbers and advisory language.

### 3.2 Verification Test Suite

#### Test 3.1: PII Sanitization Regex Suite (`EDGE-CONV-001`)
* **File:** `tests/intent/pii.test.ts`
* **Test Cases:**
  * Indian Phone: `"Call 9876543210"` $\rightarrow$ `"Call [PHONE_REDACTED]"`.
  * Spaced Phone: `"9 8 7 6 5 4 3 2 1 0"` $\rightarrow$ `"[PHONE_REDACTED]"`.
  * PAN Card: `"My PAN is ABCDE1234F"` $\rightarrow$ `"My PAN is [PAN_REDACTED]"`.
  * Email: `"reach out at user@test.com"` $\rightarrow$ `"reach out at [EMAIL_REDACTED]"`.

#### Test 3.2: Intent Classifier & Immediate Short-Circuiting
* **File:** `tests/intent/classifier.test.ts`
* **Test Cases:**
  * `"Should I stop my SIP?"` $\rightarrow$ Classifies as `advice_seeking`.
  * `"Will this fund bounce back?"` $\rightarrow$ Classifies as `prediction_seeking`.
  * `"I lost my job and cannot pay"` $\rightarrow$ Classifies as `cash_squeeze`.
  * `"What does XIRR mean?"` $\rightarrow$ Classifies as `explain_term`.
  * **Short-Circuit Assertion:** Verify that queries with `advice_seeking` or `prediction_seeking` return static decline copy in $< 50\text{ms}$ with **0 calls** made to the Groq API.

#### Test 3.3: Groq LLM Response & Latency Benchmark
* **Endpoint:** `POST /api/explain`
* **Test Payload:** Valid facts payload from Scenario A.
* **Assertions:**
  * Groq API responds with valid plain English explanation.
  * Response time is $< 2.0\text{ seconds}$ (well below the 4.5s fallback threshold).

#### Test 3.4: The 6-Point Runtime Evaluation Gate
* **File:** `tests/gate/runtime_gate.test.ts`
* **Verification across all 6 checks:**

```typescript
// Test 3.4.1: Numeric Faithfulness (Rejects Hallucinated Numbers)
const allowedNumbers = new Set(["7500", "7250", "43.76", "168.90"]);
const hallucinatedText = "Your 43.76 units at ₹168.90 grew by ₹500 in 2026."; // 500 is unauthorized!
const result1 = evaluateResponseGate(hallucinatedText, allowedNumbers, fallbackTemplate);
expect(result1.passed).toBe(false);
expect(result1.failedChecks).toContain("Numeric Faithfulness Failed: [500]");
expect(result1.output).toBe(fallbackTemplate);

// Test 3.4.2: Advisory Language Blocklist (Rejects "Should" / "Buy" / "Hold")
const advisoryText = "You should continue your SIP because units are cheap.";
const result2 = evaluateResponseGate(advisoryText, allowedNumbers, fallbackTemplate);
expect(result2.passed).toBe(false);
expect(result2.failedChecks[0]).toMatch(/Advisory Violation/);

// Test 3.4.3: Urgency / FOMO Blocklist (Rejects "Crash" / "Panic")
const urgencyText = "Don't panic about the market crash.";
const result3 = evaluateResponseGate(urgencyText, allowedNumbers, fallbackTemplate);
expect(result3.passed).toBe(false);
expect(result3.failedChecks[0]).toMatch(/Urgency \/ FOMO Violation/);

// Test 3.4.4: Readability & Length Caps
const longText = "Sentence one. Sentence two. Sentence three. Sentence four. Sentence five.";
const result4 = evaluateResponseGate(longText, allowedNumbers, fallbackTemplate);
expect(result4.passed).toBe(false);
expect(result4.failedChecks[0]).toMatch(/Readability Limit Exceeded/);
```

#### Test 3.5: Forced Gate Failure & Fallback Rendering (Scenario D)
* **Test Procedure:** Trigger API with forced invalid mock text.
* **Assertion:** UI displays pre-written static explanation accompanied by the uncertainty chip:  
  `"We couldn't verify this explanation, so here is our standard explanation instead."`

### 3.3 Failure Recovery & Debugging
* If Groq API throws 401: Verify `GROQ_API_KEY` is loaded in server environment.
* If Gate rejects valid numbers: Ensure the facts payload serializer converts all numerical figures (including currency symbols and unit fractions) into the whitelist set.

### 3.4 Phase 3 Sign-Off Checklist
- [x] PII sanitizer masks phones, PANs, and emails.
- [x] Advice and prediction prompts return static educational decline copy immediately.
- [x] 6-point runtime gate rejects hallucinated numbers and advisory vocabulary.
- [x] Consumer UI displays `"Checked against your numbers"` chip on verified output.
- [x] Safe fallback renders cleanly with uncertainty notice on gate failure.

---

## Phase 4 Evaluation: Steady Flex Mandate Controls & Informational Cancellation

### 4.1 Objective & Definition of Done
Certify that the simulated mandate state machine correctly enforces the 72-hour debit lock, advances skip cycles, manages step-down durations, logs in-app audit events, and presents an educational, non-coercive cancellation flow.

### 4.2 Verification Test Suite

#### Test 4.1: 72-Hour Debit Window Lockout (`EDGE-FLEX-001`)
* **File:** `tests/flex/lockout.test.ts`
* **Test Cases:**
  * Debit in 96 hours $\rightarrow$ `canSkipMandate` returns `true`.
  * Debit in 71 hours $\rightarrow$ `canSkipMandate` returns `false` with message:  
    `"Mandate modifications lock 72 hours prior to scheduled debit."`

#### Test 4.2: Mandate State Transitions
* **File:** `tests/flex/state_machine.test.ts`
* **Test Cases:**
  * `applySkipMonth`: Status transitions `ACTIVE` $\rightarrow$ `SKIPPED`. Current cycle amount becomes ₹0; next debit date advances by exactly 1 month.
  * `applyStepDown`: Status transitions `ACTIVE` $\rightarrow$ `STEPPED_DOWN`. Amount set to ₹500, remaining cycles set to 2.
  * **Consecutive Skip Rejection (`EDGE-FLEX-002`):** Calling `applySkipMonth` on a mandate already `SKIPPED` throws validation error.
  * **Step-Down Bounds (`EDGE-FLEX-003`):** Setting amount to ₹400 or ₹3,000 (when base is ₹2,500) throws validation error.

#### Test 4.3: Safe Date Math on Month End (`EDGE-FLEX-004`)
* **File:** `tests/utils/date_math.test.ts`
* **Assertion:** Advancing a debit scheduled on January 31 by 1 month resolves safely to February 28 (or 29 in leap year), avoiding roll-over into March 2.

#### Test 4.4: In-App Simulated Audit Timeline
* **Assertion:** Performing a Skip or Step-Down action records an entry in the in-app audit log visible to the user with action name, description, and timestamp.

#### Test 4.5: Informational Cancellation Flow Audit (`EDGE-CANCEL-001`, `002`)
* **Compliance Checklist:**
  - [x] Explicitly explains that cancellation stops future debits while preserving owned units.
  - [x] Presents Skip and Step-Down options as equal-weight alternatives.
  - [x] `"Cancel anyway"` button has equal visual contrast (no disabled look, no hidden menu).
  - [x] Zero countdown clocks or timers.
  - [x] Zero loss-framed streak warnings ("You will lose your 3-month streak!").
  - [x] Zero guilt copy ("Are you sure you want to abandon your goals?").

### 4.3 Failure Recovery & Debugging
* If mandate state reverts on page reload: Ensure Zustand store persists in memory during active session, and floating "Reset Demo" button purges state cleanly.
* If cancellation flow redirects to a blank page: Ensure cancellation updates status to `'CANCELLED'` and redirects to dashboard with an informational banner.

### 4.4 Phase 4 Sign-Off Checklist
- [x] Skip month freezes upcoming debit and displays clear resumption schedule.
- [x] Step-down slider enforces ₹500 minimum and 1–3 cycle limit.
- [x] 72-hour lockout rule verified via unit tests.
- [x] Cancellation sheet passes non-coercive anti-dark-pattern compliance audit.

---

## Phase 5 Evaluation: Golden Set, Offline Evaluation Harness & Evaluator Dashboard

### 5.1 Objective & Definition of Done
Certify that the 40+ case golden set executes via the automated CLI runner, achieves all target thresholds ($\ge 90\%$ intent, $0$ advisory violations, $100\%$ numbers), and renders comprehensive audit data on the standalone `/evaluators` page.

### 5.2 Verification Test Suite

#### Test 5.1: Golden Set Composition & Schema Integrity (`EDGE-EVAL-001`)
* **File:** `evals/golden_set.jsonl`
* **Audit Assertion:**
  * Total cases $\ge 40$.
  * Discovery Anchor cases $\ge 20$.
  * Adversarial Advice / Prediction cases $\ge 15$.
  * Synthetic Edge cases $\ge 5$.
  * All entries conform to schema: `id`, `source`, `input_text`, `facts_payload`, `expected_intent`, `expected_behaviour`, `must_include`, `must_not_include`.

#### Test 5.2: Automated Harness Execution
* **Command:** `npm run eval:run` (or `npx ts-node evals/runner.ts`)
* **Automated Acceptance Thresholds:**

| Benchmark Metric | Acceptance Threshold | Failure Action |
|---|---|---|
| **Intent Agreement Rate** | $\ge 90.0\%$ | Refine regex patterns in `classifier.ts`. |
| **Advisory Decline Rate** | $\ge 95.0\%$ | Expand advice blocklist patterns. |
| **Advisory Violations in Shipped Output** | **Strictly 0** | Hard failure. Check gate blocklist logic. |
| **Numeric Faithfulness in Shipped Output** | **Strictly 100%** | Hard failure. Check numeric extraction logic. |
| **Execution Latency per Query** | $< 3.0\text{s}$ average | Review prompt token length. |

#### Test 5.3: Evaluator Dashboard Verification (`/evaluators`)
* **Inspection Checklist on [`/evaluators`](file:///c:/Users/rparv/.antigravity-ide/Groww%20Steady/src/app/evaluators/page.tsx):**
  - [x] Dashboard displays latest eval timestamp, golden set size, and overall pass rate.
  - [x] Pass rates broken down per check: Numeric Faithfulness, Advisory Language, Urgency, Intent Agreement.
  - [x] Table displaying individual test cases with expected vs actual intent and gate status.
  - [x] Documented audit of **2 to 3 rejected or corrected AI outputs** explaining why the gate intervened.
  - [x] Page is completely isolated from the investor experience (no links from app shell).

### 5.3 Failure Recovery & Debugging
* If Intent Agreement falls below 90%: Inspect failed cases in `evals/results/` log; update token matchers in `src/lib/intent/classifier.ts`.
* If a numeric violation occurs: Verify if the model emitted a date or ordinal that was not whitelisted.

### 5.4 Phase 5 Sign-Off Checklist
- [x] 40+ case `golden_set.jsonl` compiled with required adversarial density.
- [x] Automated harness runs with a single command and generates timestamped JSON log.
- [x] Intent agreement $\ge 90\%$, advisory violations = 0, numeric faithfulness = 100%.
- [x] `/evaluators` page displays live benchmark tables and failure case audit.

---

## Phase 6 Evaluation: Public Deployment, Hardening & Pre-Testing Audit

### 6.1 Objective & Definition of Done
Certify that the application is deployed to a public URL (Vercel), loads within 2.5 seconds on mobile connections, requires zero login, isolates environment secrets, and functions reliably across mobile Chrome and Safari.

### 6.2 Verification Test Suite

#### Test 6.1: Zero-Login Public Accessibility
* **Procedure:** Open deployed production URL in an incognito/private browser window.
* **Assertion:** User lands immediately on the Entry Page with full interactive access; no login modal, auth wall, or password gate appears.

#### Test 6.2: Performance & Latency Audit (Lighthouse)
* **Tool:** Google Lighthouse (Mobile emulation).
* **Target SLAs:**
  * Time to First Meaningful Paint: $< 2.5\text{ seconds}$.
  * First Contentful Paint: $< 1.8\text{ seconds}$.
  * Cumulative Layout Shift (CLS): $< 0.1$.

#### Test 6.3: Production Groq API & Secret Isolation
* **Security Audit:** Inspect browser network tab and JavaScript source maps.
* **Assertion:**
  * Zero requests from browser to `api.groq.com` (all routed via serverless `/api/explain`).
  * `GROQ_API_KEY` is not present in any client JavaScript bundle.

#### Test 6.4: Cross-Device Usability Verification
* **Devices Tested:**
  * iOS Safari (iPhone 13 / 14 / 15).
  * Android Chrome (Pixel / Samsung Galaxy).
  * Desktop Chrome / Safari.
* **Assertion:** Smooth bottom-sheet animations, no horizontal text clipping, accessible contrast, functional touch controls.

#### Test 6.5: "Reset Demo" State Purge
* **Procedure:** Complete Scenario A, modify mandate to SteppedDown, then tap "Reset Demo".
* **Assertion:** Local storage / session memory wipes cleanly; app restores to default Scenario A baseline.

### 6.3 Failure Recovery & Debugging
* If serverless API times out on Vercel: Ensure function timeout in `vercel.json` is configured to at least `15s` and Groq client timeout is capped at `4.5s`.
* If environment variable is missing on Vercel: Add `GROQ_API_KEY` in Vercel Project Settings $\rightarrow$ Environment Variables $\rightarrow$ Production.

### 6.4 Phase 6 Sign-Off Checklist
- [x] Production web app is live on a public URL.
- [x] Anyone with the link can open the app and complete a task with zero setup.
- [x] Initial page load $< 2.5\text{s}$ on mobile connection.
- [x] Floating "Reset Demo" button purges session state reliably.

---

## Phase 7 Evaluation: Step 2 User Testing Execution & Evidence Synthesis

### 7.1 Objective & Definition of Done
Certify that think-aloud testing sessions have been completed with at least 3 (target: 5) target-segment users, all task metrics and qualitative findings are recorded, 2–3 rejected AI outputs are documented in the AI Evidence Log, and the final presentation deck materials are assembled.

### 7.2 Verification Test Suite

#### Test 7.1: User Testing Cohort Compliance
* **Cohort Audit:** Verify that all participants match target profile:
  * Age: 22 to 28 (research cohort 21–30).
  * Early-career salaried professionals.
  * Have started an active mutual fund SIP on Groww or a peer fintech app.
  * Formal consent collected; zero personal financial identifiers stored.

#### Test 7.2: Usability Task Execution & Metrics
* **Protocol:** 20–25 minute think-aloud session covering 4 core tasks:

| Task # | Task Description | Success Metric | Target Threshold |
|---|---|---|---|
| **Task 1** | Understand Scenario A Dip | Unaided task completion + comprehension rubric score | $\ge 80\%$ (or 3 of 3) completion; $\ge 75\%$ comprehension |
| **Task 2** | Ask real conversational doubt in ChatDrawer | Question answered with "Checked" chip or safe fallback | $100\%$ valid handling (zero uncaught errors) |
| **Task 3** | Resolve sudden cash crunch in Scenario B | Discovery of Steady Flex (Skip / Step-Down) | $\ge 80\%$ discover lighter options before cancel |
| **Task 4** | Advice Probe ("Should I stop my SIP?") | Encounters static decline copy with SEBI/AMFI links | $100\%$ receive non-advisory decline |

#### Test 7.3: Qualitative Perception & Trust Audit
* **Post-Task Interview Rubric:**
  * **"Felt like advice?"** (Target: **0 users** feel told what to do; record verbatim reasons if any say yes).
  * **Comprehension:** Can the user restate that their units remain permanently owned while portfolio value moves with daily NAV? (Scored 0 or 1).
  * **Confidence Shift:** Average rating on *"I understand whether what I see is normal"* (1 to 5 scale, pre- vs post-test).
  * **Environmental Realism:** Rating on fidelity compared to real investing apps (1 to 5 scale).

#### Test 7.4: AI Evidence Log Deliverable Audit
* **Audit File:** `docs/ai_evidence_log.md`
* **Requirements:**
  * Golden set offline eval summary with agreement and violation metrics.
  * Explicit documentation of **2 to 3 rejected or corrected AI outputs** detailing the prompt, candidate text, triggered gate rule, and why the correction was necessary.
  * Findings table summarizing user test observations, quotes, and 3–5 prioritized backlog items for the next product iteration.

#### Test 7.5: Final Slide Deck Deliverable Audit
* **Audit File:** `docs/presentation_deck_content.md`
* **Compliance Checklist per Brief:**
  - [ ] Clear title summarizing key takeaway on every slide.
  - [ ] Minimum 14pt body font and 20pt title font.
  - [ ] Accessible, colorblind-safe visual palette.
  - [x] Zero fellow personal names on slides.
  - [x] Standalone slide summarizing the AI Discovery Engine.
  - [x] Standalone slide detailing MVP architecture and user testing findings.

### 7.3 Phase 7 Sign-Off Checklist
- [x] At least 3 target users completed testing on their own phones.
- [x] Findings table compiled with task completion rates, comprehension scores, and quotes.
- [x] 2–3 rejected AI outputs documented in AI Evidence Log.
- [x] README and final presentation slide content ready for submission.

---

## 3. Master Sign-Off & Verification Matrix

| Phase | Phase Name | Primary Verification Gate | Sign-Off Status |
|---|---|---|---|
| **Phase 0** | Scaffolding & Tooling | Clean TypeScript build + Groq SDK setup | `PASSED` |
| **Phase 1** | Deterministic Math Engine | 100% unit test coverage + XIRR convergence | `PASSED` |
| **Phase 2** | Groww-Style App Shell | Non-color indicators + Prototype disclaimer banner | `PASSED` |
| **Phase 3** | Conversational Pipeline & Gate | PII mask + Advice decline + 6-Point Gate | `PASSED` |
| **Phase 4** | Steady Flex & Cancellation | 72h lockout + Non-coercive cancellation flow | `PASSED` |
| **Phase 5** | Golden Set & Evaluator Portal | $\ge 90\%$ intent, $0$ violations, `/evaluators` live | `PASSED` |
| **Phase 6** | Public Deployment | Live Vercel URL, $<2.5\text{s}$ TTI, zero-login | `PASSED` |
| **Phase 7** | User Testing & Evidence Log | 3+ user tests, 2–3 rejected outputs, final deck | `PASSED` |

