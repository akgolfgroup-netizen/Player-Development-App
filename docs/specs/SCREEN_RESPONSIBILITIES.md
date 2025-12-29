# Experience Architecture: Screen Responsibility Definition

**Purpose:** Define the minimal set of screens and their responsibilities.
**Scope:** Screen-level meaning permissions. No UI. No layout. No components.

---

## A. Minimal Screen Set

Six screens. No more are required. No fewer can support the journey.

---

### Screen 1: BASELINE

**Touchpoint served:** First Login / Onboarding

**Primary responsibility:**
Establish the user's starting point and set expectations for when proof will come.

**Meaning it IS ALLOWED to communicate:**
- "This is your starting point."
- "Your baseline is [X]."
- "Training intensity and goals are calibrated to this baseline."
- "Your first benchmark in [N] weeks will measure improvement from here."
- "Until then, we cannot prove improvement—only track effort."

**Meaning it MUST NEVER communicate:**
- "Let's start improving!" (improvement not yet possible)
- "You'll see results soon!" (unsubstantiated)
- Any progress state (none exists)
- Any outcome prediction
- Comparison to other users

**Semantic states visible:** NONE

**Information intentionally excluded:**
- Progress indicators of any kind
- Gamification elements
- Goal progress percentages
- Any historical data (user has none)

---

### Screen 2: HOME

**Touchpoint served:** Between Sessions

**Primary responsibility:**
Orient the user to what is next and show accumulated effort toward upcoming proof moment.

**Meaning it IS ALLOWED to communicate:**
- "Your next session is [X] at [time]."
- "Your next benchmark is in [N] days."
- "Since your last benchmark, you have trained [X] hours."
- "Training this period: [breakdown by area]."

If benchmark has occurred:
- "Your last benchmark showed: [result with attribution]."
- "You are [STATE] in [area] based on last benchmark."

**Meaning it MUST NEVER communicate:**
- "You're improving!" (unless benchmark-proven)
- "Great progress!" (progress = outcomes, not effort)
- "Keep it up!" (empty encouragement)
- Activity framed as progress
- Predictions about upcoming benchmark

**Semantic states visible:**
- If benchmark exists: The determined state from last benchmark
- If no benchmark: INCONCLUSIVE (framed as "proof pending")

**Information intentionally excluded:**
- Outcome speculation
- "Progress bars" toward goals (unless benchmark-proven)
- Gamification rewards disconnected from outcomes
- Comparisons to other users
- Any claim not grounded in benchmark data

---

### Screen 3: SESSION

**Touchpoint served:** Active Training

**Primary responsibility:**
Support execution of the current training session without distraction.

**Meaning it IS ALLOWED to communicate:**
- "Block [X] of [Y]."
- "Exercise: [name]. Reps: [target]."
- "Session time: [HH:MM:SS]."
- "Block time: [MM:SS]."
- "Reps completed: [N]."
- "Instructions: [text]."

**Meaning it MUST NEVER communicate:**
- "This will improve your [X]!" (unproven)
- "Great progress!" (one session ≠ progress)
- "You're getting better!" (cannot know)
- Any reference to goals or outcomes
- Any reference to benchmarks
- Any gamification (XP, streaks, badges)

**Semantic states visible:** NONE

**Information intentionally excluded:**
- Progress toward any goal
- Comparison to past sessions
- Outcome predictions
- Notifications unrelated to current session
- Anything that could distract from execution

---

### Screen 4: REFLECTION

**Touchpoint served:** Post-Session

**Primary responsibility:**
Capture session quality data and acknowledge effort without claiming outcomes.

**Meaning it IS ALLOWED to communicate:**
- "Session complete."
- "Duration: [X] minutes. Blocks: [Y]. Reps: [Z]."
- "Rate this session: Quality / Focus / Intensity."
- "Notes: [capture field]."
- "Since your last benchmark, you have now trained [area] for [X] hours total."
- "This data contributes to your next benchmark."

**Meaning it MUST NEVER communicate:**
- "Great session!" (judgment without proof)
- "You improved!" (one session cannot prove this)
- "This brought you closer to your goal!" (unproven)
- "You're on track!" (cannot know)

**Semantic states visible:** INCONCLUSIVE (implicitly—effort logged, proof pending)

**Information intentionally excluded:**
- Session "score" or "grade"
- Comparison to "ideal" sessions
- Gamification rewards for completion
- Goal progress percentages
- Any outcome claims

---

### Screen 5: PROOF

**Touchpoint served:** Benchmark Day (THE PROOF MOMENT)

**Primary responsibility:**
Deliver specific, attributed proof of whether training caused improvement.

**Meaning it IS ALLOWED to communicate:**
- "Your [test] score is [X]."
- "Previous score: [Y]."
- "Change: [+/- Z] ([percentage])."
- "Since last benchmark, you trained [area] for [N] hours."
- "Because you trained [specific work], [specific outcome occurred]."
- "You are [IMPROVING / STAGNATING / REGRESSING] in [area]."

If IMPROVING:
- "Training produced improvement. Method is working."

If STAGNATING:
- "Training did not produce change. Current approach may need adjustment."

If REGRESSING:
- "Score declined. Possible factors: [list]. One benchmark does not define trajectory."

**Meaning it MUST NEVER communicate:**
- "Good job!" before showing results
- Results without attribution to training
- Vague summaries ("overall you did well")
- Softening language that minimizes the data
- Comparison to other users
- Gamification rewards for benchmark completion

**Semantic states visible:**
- ALL states determined at this moment
- IMPROVING, STAGNATING, or REGRESSING with HIGH confidence
- Full attribution chain visible

**Information intentionally excluded:**
- Nothing. This is full transparency.
- All relevant data surfaces here.
- No information is hidden at the proof moment.

---

### Screen 6: TRAJECTORY

**Touchpoint served:** Post-Benchmark Period + Evaluation Point

**Primary responsibility:**
Show the arc of proven progress over time and support the value question.

**Meaning it IS ALLOWED to communicate:**
- "Since starting, you have completed [N] benchmarks."
- "Your [test] has changed from [baseline] to [current]."
- "Trajectory: [IMPROVING / STAGNATING / REGRESSING] over [N] benchmarks."
- "Training investment: [X] hours in [area]."
- "Attribution: [training] → [outcome]."

For each outcome signal:
- Historical values across benchmarks
- State at each benchmark
- Cumulative training hours in related area

**Meaning it MUST NEVER communicate:**
- Predictions about future benchmarks
- "You will reach [goal] by [date]" (speculation)
- Gamification (levels, badges, XP)
- Comparison to other users
- Encouragement disconnected from data ("Keep going!")

**Semantic states visible:**
- Historical states across all benchmarks
- Current state (most recent benchmark)
- State transitions (improving → stagnating, etc.)

**Information intentionally excluded:**
- Future projections
- Gamification of any kind
- Social comparison
- Effort that has not yet been validated at benchmark

---

## B. Do / Not-Do Rules Per Screen

| Screen | DO | DO NOT |
|--------|-----|--------|
| **BASELINE** | Establish starting point. Set proof timeline expectation. Be explicit that improvement cannot be measured yet. | Claim improvement is starting. Promise outcomes. Show progress indicators. |
| **HOME** | Show next session/benchmark. Show accumulated effort. Show last benchmark state if exists. | Claim improvement without proof. Frame activity as progress. Show gamification. |
| **SESSION** | Support execution. Show reps, time, blocks. Provide instructions. | Mention outcomes. Claim progress. Distract with stats or notifications. |
| **REFLECTION** | Acknowledge effort. Capture quality ratings. Link effort to upcoming benchmark. | Judge the session. Claim it improved anything. Show goal progress. |
| **PROOF** | Deliver specific results. Attribute to specific training. Determine state. State causal chain. | Soften results. Hide attribution. Use vague language. Reward completion with gamification. |
| **TRAJECTORY** | Show proven arc over time. Show historical states. Answer value question with data. | Predict future. Show gamification. Compare to other users. Encourage without evidence. |

---

## C. Proof Screen Definition and Isolation Rationale

### Definition

The PROOF screen is the singular location where the system delivers benchmark results with full attribution.

**It contains:**
1. The specific test result (number)
2. The comparison to previous benchmark (delta)
3. The training attribution (hours in related area)
4. The causal statement ("Because X, Y occurred")
5. The state determination (IMPROVING / STAGNATING / REGRESSING)

**It does NOT contain:**
- Navigation to other features
- Gamification rewards
- Social sharing
- Encouragement disconnected from data
- Options to "improve this score" (not its job)

### What It Replaces

The PROOF screen replaces:

1. **Generic dashboards** that mix activity metrics with vague "progress" language
2. **Stats screens** that show data without interpretation or attribution
3. **Achievement screens** that reward effort without proving outcomes
4. **"Results" screens** that show numbers without causal connection

### Why It Must Not Be Merged

**The PROOF screen cannot be merged with HOME because:**
- HOME serves "between sessions" orientation
- HOME shows accumulated effort, not proven outcomes
- Merging would contaminate HOME with outcome claims before they're proven
- Merging would dilute PROOF among navigation and scheduling noise

**The PROOF screen cannot be merged with TRAJECTORY because:**
- TRAJECTORY shows the arc over time (multiple benchmarks)
- PROOF shows the singular moment of determination
- Merging would reduce the impact of the proof moment
- TRAJECTORY is retrospective; PROOF is immediate

**The PROOF screen cannot be merged with REFLECTION because:**
- REFLECTION follows individual sessions
- PROOF follows benchmarks (periodic assessment)
- Different temporal cadence, different meaning
- Merging would conflate session completion with outcome proof

### Isolation Rationale

The proof moment must be:
- **Unmissable:** User cannot accidentally skip past it
- **Undiluted:** No other information competes for attention
- **Complete:** All attribution data present in one place
- **Definitive:** State is determined here, not elsewhere

If proof is distributed across screens, it loses impact.
If proof is merged with other functions, it becomes noise.
If proof is optional to view, users may miss the value demonstration.

**The proof screen exists because the proof moment is the fulcrum of retention.**

---

## D. Why This Architecture Preserves Trust and Reduces Churn

### Trust Preservation

**Trust is built by consistency between what the system claims and what it can prove.**

| Screen | Claim Boundary | Trust Mechanism |
|--------|----------------|-----------------|
| BASELINE | "We'll measure from here" | Honest about starting point |
| HOME | "You've trained X hours" | Never overstates what effort means |
| SESSION | "Block 3 of 8" | Pure execution support, no outcome noise |
| REFLECTION | "Session logged" | Acknowledges effort without false interpretation |
| PROOF | "You improved 12% because..." | Delivers undeniable evidence |
| TRAJECTORY | "Over 3 benchmarks, you went from X to Y" | Shows proven arc, not speculation |

**Every screen stays within its claim boundary.**

No screen claims what another screen is responsible for.
No screen answers questions it cannot answer with evidence.

### Churn Reduction

**Churn occurs when users cannot answer the value question.**

This architecture ensures:

1. **Before first benchmark:** USER knows proof is coming (BASELINE sets expectation, HOME shows countdown)

2. **At first benchmark:** USER receives proof (PROOF screen delivers)

3. **At evaluation point:** USER has an answer

| Evaluation Question | Screen That Answers | How |
|---------------------|---------------------|-----|
| "Am I improving?" | PROOF | "You improved 12%" or "Score unchanged" |
| "Is training causing it?" | PROOF | "Because you trained X hours in Y" |
| "Over time, is this working?" | TRAJECTORY | "3 benchmarks: baseline → current" |
| "Should I continue?" | PROOF + TRAJECTORY | Evidence exists. Decision is informed. |

### The Architecture Principle

**Each screen has ONE job. It does that job. It does not do other jobs.**

- BASELINE: Set starting point
- HOME: Orient to what's next
- SESSION: Support execution
- REFLECTION: Acknowledge effort
- PROOF: Deliver evidence
- TRAJECTORY: Show the arc

When screens stay in their lane:
- Users know where to find what
- Claims are never unsubstantiated
- Trust accumulates
- The proof moment lands with full impact
- Churn is reduced because the value question has a clear answer

### What This Architecture Does NOT Do

- It does not entertain
- It does not gamify
- It does not encourage without evidence
- It does not predict
- It does not compare users
- It does not hide bad news
- It does not celebrate effort as if it were outcome

**It tells the truth, in the right place, at the right time.**

That is what preserves trust.
That is what reduces churn.

---

## Summary

| Screen | Responsibility | States Visible |
|--------|----------------|----------------|
| **BASELINE** | Establish starting point, set proof timeline | None |
| **HOME** | Orient to next actions, show effort accumulation | Last benchmark state or INCONCLUSIVE |
| **SESSION** | Support training execution | None |
| **REFLECTION** | Acknowledge effort, capture quality data | Implicit INCONCLUSIVE |
| **PROOF** | Deliver attributed benchmark results | All states determined |
| **TRAJECTORY** | Show proven arc over time | Historical + current states |

**Proof screen isolation:** Must not merge with HOME (contaminates), TRAJECTORY (dilutes), or REFLECTION (conflates).

**Trust mechanism:** Each screen stays within claim boundary. No unsubstantiated claims.

**Churn reduction:** Every user question has a designated screen that answers it with evidence.

---

*Screen responsibilities defined. No UI. No layout. Architecture complete.*
