# Experience Placement Design

**Purpose:** Determine where and when progress semantics appear in the journey.
**Scope:** Orchestration of meaning across time and touchpoints. No UI. No layout.

---

## A. Journey → Meaning Placement Map

Seven touchpoints. Each has specific semantic permissions and prohibitions.

---

### Touchpoint 1: FIRST LOGIN / ONBOARDING

**When:** Day 0. User's first interaction with the system.

**User's mental state:**
- Hopeful but skeptical
- Looking for orientation
- No investment yet, easy to abandon

**What the system IS ALLOWED to say:**
- "Welcome. Let's establish your baseline."
- "Your baseline determines training intensity and goals."
- "This is your starting point. Improvement is measured from here."
- "Your first benchmark in [X weeks] will show if training is working."

**What the system MUST NOT say:**
- "Let's start improving!" (No improvement possible yet)
- "You'll see results soon!" (Unsubstantiated promise)
- "Great choice joining!" (Empty validation)
- Any reference to progress states (none exist yet)

**Semantic states visible:** NONE. User is pre-progress.

**Information intentionally hidden:**
- Progress dashboards (nothing to show)
- Comparison data (no prior self to compare)
- Achievement/gamification (not earned, would feel hollow)

**Primary function of this touchpoint:**
SET EXPECTATIONS. Define when proof will come. Do not promise outcomes.

---

### Touchpoint 2: DAILY TRAINING (Active Session)

**When:** During a training session. User is actively working.

**User's mental state:**
- Focused on execution
- Wants clarity on what to do
- May feel effort is hard
- Vulnerable to "is this worth it?" doubts mid-session

**What the system IS ALLOWED to say:**
- "Block 3 of 8. Putting drills. 40 reps remaining."
- "Session time: 47:22. Block time: 8:15."
- "You have completed 120 reps in this session."
- After session: "Session complete. 90 minutes. 6 blocks. 180 reps."

**What the system MUST NOT say:**
- "Great progress!" (No outcome data from one session)
- "You're getting better!" (Cannot know this)
- "This will improve your putting!" (Unproven claim)
- "Keep it up, you're doing amazing!" (Empty encouragement)

**Semantic states visible:** NONE. Session-level data only.

**Information intentionally hidden:**
- Progress toward goals (not relevant during execution)
- Comparison to past sessions (distracting)
- Any outcome predictions

**Primary function of this touchpoint:**
SUPPORT EXECUTION. Help user complete the work. Do not distract with outcome speculation.

---

### Touchpoint 3: POST-SESSION REFLECTION

**When:** Immediately after session ends. User has just finished training.

**User's mental state:**
- Physically tired
- Potentially satisfied (completed work) or frustrated (struggled)
- Brief window for reflection before moving on
- Seeking acknowledgment of effort

**What the system IS ALLOWED to say:**
- "Session complete. You trained putting for 90 minutes."
- "You rated this session: Quality 7/10, Focus 8/10, Intensity 6/10."
- "Notes captured. This data contributes to your next benchmark."
- "Since your last benchmark, you have now trained putting for [X] hours total."

**What the system MUST NOT say:**
- "Great session! You improved!" (One session ≠ improvement)
- "You're on track!" (Cannot know this yet)
- "This brought you closer to your goal!" (Unproven)

**Semantic states visible:** INCONCLUSIVE (implicitly—effort logged, proof pending)

**Information intentionally hidden:**
- Progress states (not determinable from one session)
- Goal progress percentages (misleading precision)
- Comparisons to "ideal" sessions

**Primary function of this touchpoint:**
ACKNOWLEDGE EFFORT. Confirm data captured. Connect effort to upcoming proof moment.

---

### Touchpoint 4: BETWEEN SESSIONS

**When:** User returns to app but is not training. Checking in. Planning. Browsing.

**User's mental state:**
- May be checking if training is "working"
- Looking for validation or direction
- Vulnerable to false confidence (if shown flattering stats)
- Vulnerable to false discouragement (if shown nothing)

**What the system IS ALLOWED to say:**
- "Since your last benchmark, you have trained [X] hours."
- "Your next benchmark is in [Y] days."
- "Training this period: [breakdown by area]."
- "At your next benchmark, we will measure whether this training produced change."

If previous benchmark exists:
- "Your last benchmark showed: [specific results with attribution]."
- "You are now [IMPROVING/STAGNATING/REGRESSING] in [area] based on last benchmark."

**What the system MUST NOT say:**
- "You're improving!" (unless proven at last benchmark)
- "Keep going, you're almost there!" (almost where?)
- "Great progress this week!" (progress = outcomes, not effort)
- Activity metrics framed as progress (hours ≠ improvement)

**Semantic states visible:**
- If benchmark exists: The determined state from last benchmark (IMPROVING, STAGNATING, REGRESSING)
- If no benchmark: INCONCLUSIVE (explicitly stated)

**Information intentionally hidden:**
- Predicted outcomes (speculation)
- Gamified "progress bars" disconnected from real outcomes
- Comparisons to other users

**Primary function of this touchpoint:**
MAINTAIN HONEST CONTEXT. Show effort accumulation. Point toward proof moment. Never claim unproven outcomes.

---

### Touchpoint 5: BENCHMARK DAY

**When:** The day of a scheduled benchmark test. This is THE proof moment.

**User's mental state:**
- Anticipation mixed with anxiety
- Wants to know: "Did it work?"
- High emotional stakes
- Will remember this moment and what the system said

**What the system IS ALLOWED to say:**

BEFORE completing benchmark:
- "Today is your benchmark."
- "This will measure whether your training produced improvement."
- "Since your last benchmark, you trained [X] hours in [Y] areas."

AFTER completing benchmark (THE PROOF MOMENT):
- "Your [test] score is [X]."
- "Previous score: [Y]. Change: [+/-Z]."
- "You trained [area] for [N] hours since last benchmark."
- "Because you trained [specific work], [specific outcome occurred]."
- State determination: "You are IMPROVING / STAGNATING / REGRESSING in [area]."

**What the system MUST NOT say:**
- "Good job!" before showing results (premature)
- "Don't worry about the score!" (dismissive of what matters)
- Results without attribution (breaks causal chain)
- Vague summaries without specific numbers

**Semantic states visible:**
- ALL states become visible/updated at this moment
- IMPROVING, STAGNATING, or REGRESSING—determined with HIGH confidence
- Clear attribution to training

**Information intentionally hidden:**
- Nothing. This is full transparency moment.
- All relevant data surfaces here.

**Primary function of this touchpoint:**
DELIVER PROOF. This is the singular moment where the system earns or loses trust. Specificity and attribution are mandatory.

---

### Touchpoint 6: POST-BENCHMARK PERIOD

**When:** Days 1–7 after a benchmark. User has received proof.

**User's mental state:**
- Processing results
- If improved: validated, motivated
- If stagnated: questioning approach
- If regressed: concerned, possibly defensive
- Looking for "what now?"

**What the system IS ALLOWED to say:**

If IMPROVING:
- "Your [test] improved [X]% because you trained [Y] hours in [Z]."
- "To continue improving, maintain or increase training in [area]."
- "Your next benchmark in [N] weeks will show if this trajectory continues."

If STAGNATING:
- "Your [test] remained at [X] despite [Y] hours of training."
- "This is information, not failure. Current approach is not producing change."
- "Options: adjust intensity, shift focus, or consult with coach."
- "Your next benchmark will show if changes produce different results."

If REGRESSING:
- "Your [test] declined from [X] to [Y]."
- "Possible factors: [list 2-3 plausible causes]."
- "One benchmark does not define trajectory. Next benchmark will clarify."
- "Consider: [specific adjustment based on data]."

**What the system MUST NOT say:**
- "Don't worry!" (dismissive)
- "You'll do better next time!" (unsubstantiated)
- "It's just a number!" (invalidates the proof the system just provided)

**Semantic states visible:**
- The newly determined state, prominently
- Historical states for comparison
- Attribution data

**Information intentionally hidden:**
- Predictions about next benchmark
- Comparisons to other users
- Gamification rewards for benchmark completion (proof ≠ achievement)

**Primary function of this touchpoint:**
SUPPORT INTERPRETATION. Help user understand what proof means and what to do with it.

---

### Touchpoint 7: EVALUATION POINT (Week 2–4)

**When:** User implicitly decides whether to continue. May coincide with first benchmark.

**User's mental state:**
- Accumulated effort invested
- Patience tested
- Asking: "Is this worth my time?"
- Decision point: continue, adjust, or abandon

**What the system IS ALLOWED to say:**

If PROOF MOMENT has occurred:
- "Since starting, you have trained [X] hours."
- "Your benchmark showed: [specific results]."
- "Because you [trained specifically], [outcome occurred]."
- The causal statement that proves value.

If PROOF MOMENT has NOT occurred (benchmark pending):
- "You have trained [X] hours over [Y] weeks."
- "Your first benchmark in [Z] days will show whether this training worked."
- "Until then, we cannot prove improvement—only effort."
- "Patience required. Proof is coming."

**What the system MUST NOT say:**
- "You're making great progress!" (if unproven)
- "Trust the process!" (asks for faith, not evidence)
- "Keep going, results will come!" (unsubstantiated promise)
- Nothing (silence is interpreted as failure)

**Semantic states visible:**
- Whatever state has been determined (or INCONCLUSIVE if pre-benchmark)
- Clear timeline to next proof moment
- Accumulated effort with honest framing

**Information intentionally hidden:**
- Vanity metrics that could create false confidence
- Comparisons that could create false discouragement
- Predictions that could prove wrong

**Primary function of this touchpoint:**
ANSWER THE VALUE QUESTION. If proof exists, show it clearly. If proof is pending, be honest about timeline and maintain trust through transparency.

---

## B. Do / Not-Do Rules Per Touchpoint

| Touchpoint | DO | DO NOT |
|------------|-----|--------|
| **Onboarding** | Set expectations. Define when proof comes. Establish baseline. | Promise outcomes. Claim improvement is coming. Use empty encouragement. |
| **Active Session** | Support execution. Show reps, time, blocks. Acknowledge completion. | Claim progress. Speculate about outcomes. Distract with stats. |
| **Post-Session** | Acknowledge effort. Confirm data captured. Link to benchmark. | Claim session "improved" anything. Use "great job" language. |
| **Between Sessions** | Show effort accumulation. State last benchmark results. Point to next benchmark. | Claim current improvement without proof. Show misleading progress bars. |
| **Benchmark Day** | Deliver specific results. Attribute to specific training. Determine state. | Soften results. Hide attribution. Use vague language. |
| **Post-Benchmark** | Support interpretation. Explain what state means. Suggest adjustments. | Dismiss results. Promise future improvement. Over-explain away stagnation. |
| **Evaluation Point** | Answer value question directly. Show proof if it exists. Be honest if pending. | Create false confidence. Create false discouragement. Stay silent. |

---

## C. Proof Moment Placement Rationale

### Where the Proof Moment Lives

**Location:** Benchmark Day (Touchpoint 5)
**Timing:** Immediately after benchmark test completion
**Trigger:** User completes a scheduled benchmark test

### Why This Placement

1. **Natural pause point:** User has just completed an assessment. They are mentally prepared to receive results.

2. **Data is fresh:** Attribution is clearest when benchmark immediately follows training period.

3. **Emotional readiness:** User has anticipated this moment. Delivering proof here matches expectation.

4. **Before evaluation point:** For most users, first benchmark occurs in week 4-6, which is at or slightly after the evaluation point. Placement ensures proof exists when users decide whether to continue.

### What the Proof Moment Replaces

The proof moment REPLACES:
- Generic "progress dashboards" that show activity without outcomes
- Gamification summaries (XP, badges, streaks) that reward effort without proving value
- "Keep it up!" messaging that asks for faith
- Stat dumps that show data without interpretation

The proof moment IS:
- A specific causal statement
- Delivered at a specific time
- With specific numbers and specific attribution
- That answers: "Did my training work?"

### What Happens Immediately After Proof

**If IMPROVING:**
- User sees: result, change, attribution
- System says: "Because you trained X, Y improved."
- User understands: Method is working. Continue.
- Next action: Return to training with confidence.

**If STAGNATING:**
- User sees: result, no change, training hours
- System says: "X hours did not change Y. This is information."
- User understands: Approach needs adjustment, not more volume.
- Next action: Consider changes before next benchmark.

**If REGRESSING:**
- User sees: result, decline, possible factors
- System says: "Y declined. Possible causes: Z. One point, not a trend."
- User understands: Attention needed, but not catastrophe.
- Next action: Investigate cause, adjust, await next benchmark.

---

## D. Dangerous Moments and How Placement Prevents Harm

### Most Dangerous Moment for FALSE CONFIDENCE

**When:** Between Sessions (Touchpoint 4), Week 1-3

**Why it's dangerous:**
- User has invested effort but no benchmark has occurred
- System could show flattering activity stats (hours, sessions, streaks)
- User could interpret activity as progress
- When first benchmark shows flat results, trust collapses: "But it said I was doing well!"

**How placement prevents this:**
- Between Sessions touchpoint is RESTRICTED to effort language
- Progress states are NOT visible until benchmark determines them
- The phrase "you are improving" NEVER appears without benchmark proof
- System explicitly says: "Proof comes at benchmark in [X] days"

**The rule:**
Activity stats are shown, but NEVER framed as progress. Improvement claims require benchmark evidence.

---

### Most Dangerous Moment for FALSE DISCOURAGEMENT

**When:** Post-Session (Touchpoint 3) + Between Sessions (Touchpoint 4), Week 2-3

**Why it's dangerous:**
- User has trained for 2-3 weeks with real effort
- No benchmark has occurred yet—proof is genuinely pending
- If system shows nothing, user interprets silence as "it's not working"
- User may quit before proof moment arrives

**How placement prevents this:**
- Post-Session ALWAYS acknowledges effort explicitly
- Between Sessions shows ACCUMULATION: "You have trained X hours toward benchmark"
- The word INCONCLUSIVE is reframed positively: "Proof pending" not "Unknown"
- Timeline to proof is always visible: "Benchmark in [X] days"
- Effort is validated without false outcome claims

**The rule:**
Silence is never the answer. Effort is always acknowledged. But acknowledgment is distinct from outcome claims.

---

### The Placement Principle

**False confidence** is prevented by WITHHOLDING outcome claims until benchmark.

**False discouragement** is prevented by ACTIVELY communicating effort value and proof timeline.

The balance:
- "You have trained 20 hours" (acknowledges effort)
- "Proof comes at benchmark in 12 days" (sets expectation)
- NOT: "You're improving!" (false confidence)
- NOT: silence (false discouragement)

---

## E. How This Placement Reduces Churn at Evaluation Point

### The Problem (Current State)

At week 2-4, users ask: "Is this worth it?"

Current system provides:
- Activity stats (hours, sessions) — user cannot interpret as value
- Gamification (badges, streaks) — disconnected from golf improvement
- No causal statement — user must manually synthesize meaning

Result: User has no answer. Churn occurs.

### The Solution (With This Placement)

At week 2-4, users ask: "Is this worth it?"

New system provides:

**IF benchmark has occurred:**
- Specific proof: "Your putting improved 12% because you trained 18 hours."
- Clear state: "You are IMPROVING in putting."
- Attribution: Training caused outcome.
- Answer to value question: YES, method works.

**IF benchmark has NOT yet occurred:**
- Honest status: "Proof pending. Benchmark in [X] days."
- Effort acknowledgment: "You have trained [Y] hours."
- Expectation setting: "We will know if this worked in [X] days."
- Answer to value question: WAIT. Proof is coming.

### Why This Reduces Churn

| User Question | Without Placement | With Placement |
|---------------|-------------------|----------------|
| "Am I improving?" | "Here's your hours/sessions" (unclear) | "You are IMPROVING in X" or "Proof in Y days" |
| "Is training causing it?" | Not addressed | "Because you trained X, Y improved" |
| "Should I continue?" | User must guess | If proof exists: clear yes/no. If pending: clear timeline. |

### The Mechanism

1. **Pre-benchmark users** stay because proof is explicitly promised and timeline is visible.

2. **Post-benchmark IMPROVING users** stay because they have undeniable evidence of value.

3. **Post-benchmark STAGNATING users** stay (more often) because stagnation is framed as actionable information, not failure.

4. **Post-benchmark REGRESSING users** stay (more often) because regression is framed as one data point requiring investigation, not proof of system failure.

### The Core Insight

Churn at evaluation point happens when users cannot answer the value question.

Placement ensures:
- If proof exists, it is unmissable
- If proof is pending, the timeline is clear
- Effort is acknowledged regardless of outcome
- Outcomes are never claimed without evidence

Users don't churn from honest systems. They churn from systems that leave them guessing.

---

## Summary

| Element | Placement Decision |
|---------|-------------------|
| **Proof moment** | Benchmark Day, immediately after test completion |
| **Proof replaces** | Generic dashboards, gamification, "keep it up" messaging |
| **False confidence prevention** | Outcome claims withheld until benchmark |
| **False discouragement prevention** | Effort acknowledged + proof timeline visible |
| **Evaluation point answer** | Proof shown if exists; timeline shown if pending |
| **Churn reduction mechanism** | User always has an answer to the value question |

---

*Placement defined. No UI. No layout. Orchestration of meaning across journey complete.*
