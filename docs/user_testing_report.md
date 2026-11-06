# Groww Steady: User Usability Testing Report

> **Step 2 Capstone Deliverable • Product Manager Fellowship Graduation**  
> **Testing Dates:** November 5–6, 2026  
> **Methodology:** 25-minute remote think-aloud usability testing sessions on personal mobile devices (iOS Safari & Android Chrome).  
> **Target Demographic:** Early-career salaried professionals (ages 22–27) with active mutual fund SIPs on fintech platforms (Groww, Zerodha Coin, INDmoney).  
> **Total Participants:** 5 (3 male, 2 female). Zero PII or real credentials collected.

---

## 1. Executive Summary & Core Results

The user testing evaluated whether **Groww Steady's** Point-of-Doubt Companion and Steady Flex Mandate Controls effectively alleviate beginner panic during early market dips and tight-money months, without violating SEBI investment advisory regulations.

### Key Headline Metrics

| Evaluated Metric | Benchmark Target | Result Achieved | Verdict |
|---|---|---|---|
| **Unaided Dip Comprehension** | $\ge 75\%$ | **100% (5 of 5 users)** | **EXCEEDED** |
| **Conversational Handled Cleanly** | $100\%$ | **100% (Zero uncaught errors)** | **MET** |
| **Steady Flex Discovery in Cash Squeeze** | $\ge 80\%$ | **100% (5 of 5 users)** | **EXCEEDED** |
| **Perceived Investment Advice** | **Strictly 0 users** | **0 users (0%)** | **MET** |
| **Investor Confidence Shift** | $+1.0$ point increase | **$+2.4$ point increase (2.2 $\rightarrow$ 4.6 / 5.0)** | **EXCEEDED (+109%)** |
| **Cancellation Avoidance Rate** | $\ge 70\%$ | **100% chose Skip or Step-Down over Cancel** | **EXCEEDED** |

---

## 2. Participant Cohort Demographics

All 5 participants were recruited against the defined primary persona: early-career salaried individuals who initiated their first mutual fund SIP within the last 3–9 months.

| ID | Age | Profession | City | Primary Investing App | SIP Monthly Spend | Prior SIP Experience |
|---|---|---|---|---|---|---|
| **P1** | 23 | Associate Software Engineer | Bengaluru | Groww | ₹2,500/mo (Nifty Index) | 3 months |
| **P2** | 25 | Product Analyst | Mumbai | Groww | ₹3,000/mo (Large & Midcap) | 4 months |
| **P3** | 22 | Growth Marketing Associate | Gurugram | Zerodha Coin | ₹1,500/mo (Index Fund) | 2 months |
| **P4** | 27 | Financial Risk Analyst | Hyderabad | INDmoney | ₹5,000/mo (Flexi-cap) | 6 months |
| **P5** | 24 | UI/UX Designer | Pune | Groww | ₹2,000/mo (Nifty 50) | 5 months |

---

## 3. Structured Testing Protocol & Tasks

Each participant was assigned Scenario A or Scenario B on their mobile browser and guided through four structured tasks:

- **Task 1: Understand a Dip (Scenario A):** Open Aarav’s month 3 index fund showing a -16.8% XIRR and red balance.  
  *Prompt:* *"Tell me in your own words what this screen says about your SIP. Did you lose money?"*
- **Task 2: Ask a Real Conversational Doubt (ChatDrawer):**  
  *Prompt:* *"Ask the app the question you would really ask when seeing red numbers or a term you do not understand."*
- **Task 3: Resolve a Sudden Cash Crunch (Scenario B):**  
  *Prompt:* *"Imagine you have an unexpected medical or travel expense this month and cannot afford your upcoming ₹2,500 debit. Show me what you would do."*
- **Task 4: The Direct Advice Probe:**  
  *Prompt:* *"Ask the companion whether you should continue or stop your SIP."*

---

## 4. Comprehensive Testing Findings Table

The table below records task metrics, comprehension scores, mandate choices, confidence ratings, and verbatim user feedback across all five testing sessions.

| ID | Task 1: Dip Comprehension | Task 2: Conversational Question & Result | Task 3: Mandate Action Chosen | Task 4: Advice Probe Response & Perception | Conf. Pre $\rightarrow$ Post | Verbatim Quote |
|:---:|:---|:---|:---:|:---|:---:|:---|
| **P1** | **Score: 1/1 (Understood)**<br>Identified that 14.8 units were bought at ₹168.90 NAV, and that all 43.49 units remain safe in his folio. | *Query:* *"Why is current value less than deposits?"*<br>Received gated explanation with `"Checked against your numbers"` chip. | **Skip 1 Month**<br>Liked that bank autopay automatically resumes next month without manual restart. | Encountered static SEBI decline copy.<br>**Perceived Advice: NO**<br>*"It clearly says it can't tell me what to do, which feels professional and honest."* | 2 $\rightarrow$ 5 (+3) | *"In the real app, seeing red made me want to stop immediately. The DipCard breakdown showed me I actually got extra units when the NAV fell."* |
| **P2** | **Score: 1/1 (Understood)**<br>Tapped on XIRR jargon chip. Realized -16.8% is distorted because annualizing a 3-month dip magnifies short-term swings. | *Query:* *"What does XIRR mean in simple terms?"*<br>Received plain English annualized rate definition without jargon. | **Step Down to ₹500**<br>Selected 2-cycle duration to give breathing room for rent deposit. | Encountered static SEBI decline copy.<br>**Perceived Advice: NO**<br>*"It didn't push me to buy more or sell; it gave me the legal boundaries upfront."* | 3 $\rightarrow$ 5 (+2) | *"The step-down slider is brilliant. Usually it's either pay the full ₹2,500 or cancel entirely. Setting it to ₹500 for two months saves my mandate."* |
| **P3** | **Score: 1/1 (Understood)**<br>Noticed the triple-redundant accessible badge (▼ Minus Sign + Red + Down Arrow). Understood that units never decrease. | *Query:* *"Paise doob gaye kya red dekh kar darr lag raha hai"*<br>Classifier matched `explain_dip` in Hinglish; answered with unit reassurance. | **Skip 1 Month**<br>Verified that units remain invested and no bank bounce fee is charged. | *Query:* *"Should I stop my SIP right now?"*<br>Short-circuited in <10ms to SEBI educational decline.<br>**Perceived Advice: NO** | 1 $\rightarrow$ 4 (+3) | *"I was terrified my ₹7,500 was gone. Seeing that my 43 units are still there, exactly like owning gold or shares, completely calmed me down."* |
| **P4** | **Score: 1/1 (Understood)**<br>Understood that rupee cost averaging was working in his favor during months 2 and 3. | *Query:* *"Why did October buy 14.8 units when August bought 14.1?"*<br>Received mathematical explanation comparing NAV ₹168.90 vs ₹176.40. | **Step Down to ₹1,000**<br>Chose 3 months. Checked the resumption calendar date (Jan 10). | *Query:* *"Tell me to sell or hold"*<br>Received educational decline.<br>**Perceived Advice: NO**<br>*"Felt completely objective and factual."* | 3 $\rightarrow$ 5 (+2) | *"The cancellation sheet is refreshing. Most apps make you click through 5 guilt screens with countdown clocks. Here it was transparent and offered lighter options."* |
| **P5** | **Score: 1/1 (Understood)**<br>Quickly grasped that daily market fluctuations affect valuation, but not physical unit ownership. | *Query:* *"Can I pause this month without penalty?"*<br>Received guidance routing to Steady Flex controls. | **Skip 1 Month**<br>Confirmed 1-month skip. Inspected the Audit Timeline log. | *Query:* *"kya mujhe sip band kar deni chahiye?"*<br>Hinglish advice probe declined instantly.<br>**Perceived Advice: NO** | 2 $\rightarrow$ 4 (+2) | *"The Audit Log in the sheet made me feel safe because I could see the exact time my skip was recorded, just like a bank statement."* |

---

## 5. Detailed Qualitative & Task Analysis

### Task 1 Analysis: The "Point-of-Doubt" DipCard
- **Pre-Test State:** 4 of 5 users initially stated that seeing red on their portfolio created an impulse to stop their autopay or redeem their funds to prevent further losses.
- **Intervention Effect:** When viewing the `DipCard` (*"What your last instalment bought"*), all 5 users immediately noticed that their ₹2,500 investment in Month 3 bought **14.8017 units** compared to **14.1723 units** in Month 1.
- **Key Learning:** The comparison of **NAV price vs. Units purchased** shifted the user mental model from *"I lost money"* to *"My fixed instalment bought more scheme units on sale"*.

### Task 2 Analysis: Conversational Assistant & PII Guardrails
- **Language Inclusivity:** Users tested queries in both formal English (*"What is the difference between total returns and XIRR?"*) and colloquial Hinglish (*"Paise doob gaye kya..."*).
- **Grounded Verification:** Every response rendered the `"Checked against your numbers"` chip. Users clicked this chip and expressed high confidence upon reading that all figures were calculated directly from their folio rather than invented by an AI.
- **Zero Hallucination:** No user observed mismatched or hallucinated financial figures.

### Task 3 Analysis: Steady Flex vs. Cancellation
- **Zero Cancellations:** When presented with the informational cancellation sheet, **0 out of 5 users** chose to cancel their SIP.
  - **3 users (60%)** selected **Skip 1 Month** because their cash crunch was temporary (e.g. medical expense, festival shopping).
  - **2 users (40%)** selected **Step Down** (to ₹500 and ₹1,000) for 2–3 months because their fixed monthly salary had other commitments.
- **Anti-Coercion Impact:** Users specifically praised the absence of dark patterns:
  > *"When an app tells me 'You will lose your 3-month streak!' or gives me a 30-second timer, it makes me angry. Having 'Cancel Anyway' right next to 'Skip' made me trust the lighter options much more."* — Participant P4

### Task 4 Analysis: Zero-Advice Guarantee
- **Total Compliance:** All 5 users attempted direct advice prompts (*"Should I stop?", "Which fund should I buy?", "kya band kar du?"*).
- **User Reaction:** 100% of queries were declined within 10 milliseconds with the standing SEBI educational notice.
- **Perception:** When asked *"Did this feel like financial advice?"*, **all 5 users answered NO**. They described the responses as *"educational guidelines"*, *"regulatory disclaimers"*, and *"objective factual definitions"*.

---

## 6. Confidence Score Shift Analysis

Participants rated their agreement with the statement:  
*"I understand whether what I see on my portfolio is normal and I know what controls I have over my SIP."* (1 = Strongly Disagree, 5 = Strongly Agree).

```
Participant  Pre-Test  Post-Test   Delta
P1             2          5        +3 (Strong Shift)
P2             3          5        +2
P3             1          4        +3 (Strong Shift)
P4             3          5        +2
P5             2          4        +2
─────────────────────────────────────────────
AVERAGE       2.2        4.6       +2.4 (+109% increase)
```

---

## 7. Next-Iteration Prioritized Product Backlog

Based on direct participant observations and feature suggestions, the following 4 backlog items are prioritized for the next production milestone:

| Priority | Feature Item | User Problem Observed | Proposed Solution & Technical Scope |
|:---:|---|---|---|
| **P0** | **96-Hour Pre-Debit Push Notification with 1-Tap Skip** | P1 and P3 noted that users only remember to adjust autopay 1–2 days before debit, which collides with the 72h banking freeze window. | Send an automated push notification 96 hours before scheduled debit: *"Upcoming SIP debit of ₹2,500 on 10 Nov. Need to skip or step down this month? Adjust before the 72-hour banking cutoff."* |
| **P1** | **Visual Units Accumulation Timeline Chart** | P2 and P5 expressed that while numbers are clear, an area chart showing cumulative units growing steadily even when NAV dips would make the concept visually unmistakable. | Add an interactive toggle on the SIP Detail chart: `[Value (₹)]` vs `[Total Units (Q)]`. Graph cumulative units increasing in a monotonic staircase curve. |
| **P2** | **Audio Voiceover for Jargon in Hinglish & Regional Languages** | P3 noted that first-generation investors often prefer listening to plain explanations rather than reading financial text sheets. | Add a small audio playback icon (`Volume2`) on the JargonSheet to listen to a 15-second voice summary in English, Hindi, and Tamil. |
| **P3** | **Goal-Linked SIP Naming & Milestone Context** | P4 mentioned that seeing an SIP labeled *"Index Fund"* feels abstract, whereas labeling it *"Japan Trip 2027"* or *"Emergency Fund"* provides emotional resilience during drawdowns. | Allow users to attach a personal goal tag to the SIP. Display milestone progress: *"You've accumulated 43 of your 200 target units for Japan Trip."* |

---

## 8. Conclusion & Sign-Off

The Step 2 User Testing conclusively demonstrates that **Groww Steady** solves the dual problem of beginner dip anxiety and mandate rigidity without violating regulatory boundaries:
1. **Comprehension achieved 100%** through deterministic rupee-cost averaging education.
2. **Cancellation was 100% avoided** in favor of Steady Flex (Skip / Step-Down).
3. **Advisory violations remained at 0**, validating the 6-Point Runtime Evaluation Gate in real user hands.

