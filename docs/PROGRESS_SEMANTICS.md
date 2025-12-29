# Progress Semantics Design

**Purpose:** Define how progress is communicated and understood over time.
**Scope:** Semantic meaning only. No UI. No charts. No new metrics.

---

## A. Progress State Definitions

Four mutually exclusive states. A user is always in exactly one state per outcome signal.

---

### State 1: IMPROVING

**Definition:**
Outcome signals show measurable positive change that can be attributed to training.

**What the system knows:**
- Test score(s) increased since last benchmark
- Training hours exist in the relevant area
- Attribution is possible (training → outcome link)

**What the user should understand:**
"Your training is working. Specific capability has increased. Continue."

**Confidence level:** HIGH

**Conditions:**
- At least one benchmark comparison exists
- Delta is positive and exceeds noise threshold (>5% change)
- Training hours in related area > 0

**What this state does NOT mean:**
- All areas are improving
- Improvement will continue automatically
- No further work needed

---

### State 2: STAGNATING

**Definition:**
Training effort exists, but outcome signals show no meaningful change.

**What the system knows:**
- Training hours have been logged
- Test scores have not meaningfully changed (±5%)
- Time has passed (benchmark interval complete)

**What the user should understand:**
"You are training, but this specific capability is not changing. Something may need adjustment."

**Confidence level:** MEDIUM

**Conditions:**
- At least one benchmark comparison exists
- Delta is within noise threshold (-5% to +5%)
- Training hours in related area > minimum threshold

**What this state does NOT mean:**
- Training is useless
- The user is failing
- Improvement is impossible

**What it DOES mean:**
- Current approach is not producing change in this area
- Continued identical effort will likely produce identical results

---

### State 3: REGRESSING

**Definition:**
Outcome signals show measurable negative change despite training effort.

**What the system knows:**
- Test score(s) decreased since last benchmark
- Training may or may not have occurred
- Delta is negative and exceeds noise threshold (>5% decline)

**What the user should understand:**
"This capability has declined. Attention is needed."

**Confidence level:** HIGH (for the decline itself), MEDIUM (for cause)

**Conditions:**
- At least one benchmark comparison exists
- Delta is negative and exceeds noise threshold
- Decline is real, not measurement error

**What this state does NOT mean:**
- The user is bad at golf
- All progress is lost
- The system failed

**What it DOES mean:**
- Something changed negatively
- Investigation is warranted
- May indicate overtraining, injury, technique drift, or misaligned focus

---

### State 4: INCONCLUSIVE

**Definition:**
Insufficient data exists to determine progress state.

**What the system knows:**
- Either: No previous benchmark exists (new user)
- Or: Not enough training data to attribute outcomes
- Or: Benchmark interval not yet complete

**What the user should understand:**
"We cannot yet determine if you are improving. More time or data is needed."

**Confidence level:** LOW (by definition)

**Conditions:**
- Zero or one benchmark exists
- Training hours below minimum threshold for attribution
- Time since last benchmark < minimum interval

**What this state does NOT mean:**
- User is failing
- System is broken
- Progress is unlikely

**What it DOES mean:**
- Patience required
- Continue training
- Assessment will come at next benchmark

---

## B. Time-Based Interpretation Rules

Progress meaning changes based on where the user is in the benchmark cycle.

---

### Period 1: BEFORE FIRST BENCHMARK (Week 0–4)

**System knowledge:**
- Training activity exists (hours, sessions, completion rate)
- No outcome data yet (no benchmark comparison possible)
- Baseline established during onboarding

**Interpretation rule:**
All progress communication must be PROSPECTIVE, not RETROSPECTIVE.

**What the system CAN say:**
- "You have completed X sessions."
- "You have trained Y hours in [area]."
- "Your first benchmark will measure whether this training improved [capability]."
- "At your current pace, you will have trained Z hours by benchmark."

**What the system CANNOT say:**
- "You are improving." (No proof yet)
- "Your training is working." (No outcome data)
- "Great progress!" (Progress not yet measurable)

**Semantic frame:**
EFFORT EXISTS → PROOF PENDING

**User understanding:**
"I am building toward my first proof moment. I cannot yet know if it's working, but I am doing the work."

---

### Period 2: BETWEEN BENCHMARKS (Week 4–8, 8–12, etc.)

**System knowledge:**
- Previous benchmark exists (outcome data available)
- New training activity exists since last benchmark
- Next benchmark not yet occurred

**Interpretation rule:**
Progress communication is RETROSPECTIVE for past benchmark, PROSPECTIVE for next.

**What the system CAN say:**
- About last benchmark: "Your [test] improved from X to Y because you trained Z hours."
- About current period: "Since your last benchmark, you have trained W hours in [area]."
- About trajectory: "If this pattern continues, your next benchmark may show [likely outcome]."

**What the system CANNOT say:**
- "You are definitely improving right now." (Next benchmark not complete)
- "This training is working." (Proof only comes at benchmark)

**Semantic frame:**
PAST PROOF EXISTS → CURRENT EFFORT ACCUMULATING → FUTURE PROOF PENDING

**User understanding:**
"I know my last benchmark showed [result]. I am now building toward my next benchmark. I expect to see [outcome] based on my training."

---

### Period 3: IMMEDIATELY AFTER PROOF MOMENT (Benchmark Day)

**System knowledge:**
- New benchmark complete
- Comparison to previous benchmark possible
- Attribution possible (training hours → outcome delta)

**Interpretation rule:**
This is the ONLY moment where definitive progress statements are valid.

**What the system MUST say:**
- The specific outcome: "Your [test] score is now X."
- The change: "This is [higher/lower/same] than your previous score of Y."
- The attribution: "You trained [area] for Z hours since your last benchmark."
- The causal statement: "Because you [trained X], [Y improved/stayed flat/declined]."

**Semantic frame:**
PROOF DELIVERED → STATE DETERMINED → ATTRIBUTION COMPLETE

**User understanding:**
"I now know whether my training worked. I have proof, not hope."

---

### Period 4: EXTENDED PLATEAU (3+ Benchmarks with Stagnation)

**System knowledge:**
- Multiple benchmark comparisons show no meaningful change
- Training effort has been consistent
- Time invested is significant

**Interpretation rule:**
Escalate semantic urgency without catastrophizing.

**What the system SHOULD say:**
- "Your [test] score has remained at X for three consecutive benchmarks."
- "You have trained Y hours in [area] during this period."
- "This suggests current training approach may not be producing change in this area."
- "Consider: adjusting intensity, changing focus, or consulting with coach."

**Semantic frame:**
EFFORT SUSTAINED → OUTCOME FLAT → ADJUSTMENT WARRANTED

**User understanding:**
"What I'm doing isn't changing this outcome. I need to do something different, not more of the same."

---

## C. Language Examples

Plain words for each scenario. No jargon. No metrics. No UI references.

---

### Scenario 1: Improvement Likely But Not Yet Proven

**Context:** User has trained 20 hours in putting since last benchmark. Next benchmark is in 2 weeks.

**Wrong language:**
- "Great job! Your putting is improving!" (No proof yet)
- "You're making progress!" (Cannot know this)
- "Keep it up, you're getting better!" (Unsubstantiated)

**Correct language:**
- "You have trained putting for 20 hours since your last benchmark."
- "Your next benchmark will measure whether this training improved your putting scores."
- "If your putting improved, this is why. If not, we will know that too."

**Semantic meaning:**
Effort is real. Proof is pending. No false confidence. No false doubt.

---

### Scenario 2: Effort is High But Outcomes Are Flat

**Context:** User trained 40 hours over 8 weeks. Benchmark shows 0% change in test score.

**Wrong language:**
- "Don't worry, keep trying!" (Dismissive)
- "You failed to improve." (Harsh, unhelpful)
- "Maybe you need to train more." (Likely wrong prescription)

**Correct language:**
- "You trained 40 hours in [area]. Your [test] score remained at X."
- "High effort did not produce change in this outcome."
- "This is not failure. This is information."
- "Possible interpretations: training intensity may need adjustment, focus may need to shift, or this capability may require different stimulus."

**Semantic meaning:**
Effort is acknowledged. Outcome is stated factually. Cause is not assumed. Options are presented.

---

### Scenario 3: Training is Misaligned with Goals

**Context:** User's goal is to pass the Iron 7 accuracy test. They have trained 30 hours, but 25 hours were in putting.

**Wrong language:**
- "You're off track!" (Alarming)
- "Wrong training!" (Judgmental)
- "You should have done iron drills." (Prescriptive without context)

**Correct language:**
- "Your goal is to pass the Iron 7 accuracy test."
- "Since your last benchmark, you trained 30 hours total: 25 hours in putting, 5 hours in iron accuracy."
- "Your putting may improve. Your iron accuracy has less training investment."
- "Training distribution does not match stated goal focus."

**Semantic meaning:**
Observation, not judgment. The system shows the mismatch. The user decides if it matters.

---

### Scenario 4: First-Time User, No Data Yet

**Context:** User just started. No benchmark exists. One week of training completed.

**Wrong language:**
- "Welcome! You're already improving!" (Impossible to know)
- "Great start, keep going!" (Empty encouragement)
- "You're on your way to success!" (Meaningless)

**Correct language:**
- "You have completed your first week of training."
- "You logged X sessions totaling Y hours."
- "Your first benchmark in [Z weeks] will measure your baseline capabilities."
- "Until then, we cannot determine improvement—only effort."

**Semantic meaning:**
Honest about what is known. No false promises. Clear expectation of when proof will come.

---

### Scenario 5: Regression Detected

**Context:** User's test score dropped from 78% to 71% despite training.

**Wrong language:**
- "You got worse." (Demoralizing)
- "Your training failed." (Blaming)
- "Don't give up!" (Hollow)

**Correct language:**
- "Your [test] score declined from 78% to 71%."
- "You trained X hours in [area] during this period."
- "Possible factors: overtraining, fatigue, technique change, or measurement variance."
- "This is a signal, not a verdict. One data point does not define trajectory."

**Semantic meaning:**
The fact is stated. Context is provided. Interpretation is offered. Catastrophe is avoided.

---

## D. Preventing False Confidence and False Discouragement

The semantic system must avoid two failure modes.

---

### Failure Mode 1: FALSE CONFIDENCE

**What it looks like:**
- "You're doing great!" when no proof exists
- "Keep it up!" when outcomes are flat
- Gamification rewards (streaks, badges) substituting for real improvement

**Why it's harmful:**
- User believes they are improving when they are not
- User is surprised at benchmark when outcomes are flat
- Trust in system collapses: "It told me I was doing well"

**How semantics prevent it:**
- NEVER claim improvement without benchmark proof
- Distinguish EFFORT from OUTCOME in all communication
- Use confidence levels: "likely" vs "proven" vs "unknown"
- Acknowledge when data is insufficient

**Rule:**
If outcome data does not exist, do not make outcome claims.

---

### Failure Mode 2: FALSE DISCOURAGEMENT

**What it looks like:**
- "You're not improving" when proof is simply pending
- "Training isn't working" after one flat benchmark
- Silence that user interprets as failure

**Why it's harmful:**
- User feels demoralized when patience is needed
- User quits before proof moment arrives
- User blames self for system's lack of clarity

**How semantics prevent it:**
- ALWAYS distinguish "not yet proven" from "disproven"
- Provide time context: "Proof comes at benchmark in X weeks"
- Acknowledge effort even when outcomes are unknown
- Explain stagnation as information, not failure

**Rule:**
If the user is doing the work, acknowledge the work—while being honest that proof requires time.

---

### The Semantic Balance

| Situation | False Confidence Says | False Discouragement Says | Correct Semantics Says |
|-----------|----------------------|---------------------------|------------------------|
| Week 2, no benchmark yet | "You're improving!" | (silence) | "You've trained 15 hours. Proof comes at benchmark." |
| Benchmark shows +12% | "Amazing! Keep going!" | — | "Your score increased 12%. This is attributed to X training." |
| Benchmark shows 0% change | "Good effort!" | "Training failed." | "Score unchanged despite Y hours. Current approach not producing change." |
| Benchmark shows -8% | — | "You got worse." | "Score declined 8%. Possible factors: Z. One point, not a trend." |

---

### The Core Principle

**Semantic honesty creates trust.**

A system that says "you're improving" when it doesn't know loses credibility when it matters.

A system that says "proof is pending" and then delivers proof at the benchmark earns trust.

Trust is what keeps users through the evaluation point.

---

## Summary

| Element | Definition |
|---------|------------|
| **IMPROVING** | Outcome increased, attributed to training. High confidence. |
| **STAGNATING** | Effort exists, outcome flat. Medium confidence. Adjustment warranted. |
| **REGRESSING** | Outcome declined. High confidence on fact, medium on cause. |
| **INCONCLUSIVE** | Insufficient data. Low confidence. Patience required. |
| **Before benchmark** | Effort language only. No outcome claims. |
| **Between benchmarks** | Past proof stated, future proof pending. |
| **At benchmark** | Definitive proof moment. State determined. |
| **False confidence** | Prevented by never claiming unproven outcomes. |
| **False discouragement** | Prevented by distinguishing "not yet proven" from "disproven." |

---

*Semantics defined. No UI. No charts. Meaning over time established.*
