# Value Proof & Causal Chain Design

**Purpose:** Define how the product proves training causes improvement.
**Scope:** Outcome logic and meaning design only. No UI. No new features.

---

## A. Definition of Improvement

Improvement for a golfer in this system means:

**A measurable change in capability that brings the golfer closer to their competitive goal.**

This is NOT:
- Hours trained
- Sessions completed
- Exercises performed
- Badges earned
- Streaks maintained

This IS:
- Hitting the ball farther with control
- Hitting the ball more accurately
- Performing better under pressure
- Scoring lower in competition
- Passing tests that were previously failed

**The core distinction:**
- Activity = what you did
- Improvement = what you can now do that you couldn't before

**Operational definition:**
Improvement exists when a test score increases, a tournament score decreases, or a capability threshold is crossed - AND that change can be attributed to specific training.

---

## B. Outcome Signals

Five signals that prove improvement. All derivable from existing data.

### Signal 1: Test Score Delta
**What it is:** The difference between your current test result and your previous test result.
**Why it's believable:** Tests are objective measurements. A golfer cannot argue with "Driver distance: 245 yards → 258 yards."
**Data source:** Testresultater (benchmark results over time)
**Plain language:** "Your driver distance increased 13 yards since your last benchmark."

### Signal 2: Tests Passed Count Change
**What it is:** The number of tests you now pass that you previously failed.
**Why it's believable:** Pass/fail is binary. Either you meet the requirement or you don't.
**Data source:** Testresultater (pass/fail per test, compared across benchmarks)
**Plain language:** "You now pass 14 of 20 tests. Last quarter you passed 11."

### Signal 3: Training-to-Test Correlation
**What it is:** A direct link between hours spent on a training area and improvement in the related test.
**Why it's believable:** Golfers intuitively understand "practice makes better."
**Data source:** Training sessions (hours per area) + Test results (by category)
**Plain language:** "You trained putting for 18 hours. Your lag-control putting test improved from 62% to 78%."

### Signal 4: Tournament Score Trend
**What it is:** Your average tournament score over the last 3 events compared to your baseline.
**Why it's believable:** Tournament scores are the ultimate proof. This is what golfers care about.
**Data source:** Turneringsresultater (archive)
**Plain language:** "Your last 3 tournament scores averaged 73. Your baseline was 76."

### Signal 5: Requirement Gap Closure
**What it is:** How close you are to meeting all test requirements, compared to when you started.
**Why it's believable:** Shows trajectory toward a known standard.
**Data source:** Testresultater (progress-to-requirement percentage)
**Plain language:** "You're now at 82% of requirements. You started at 61%."

---

## C. Causal Chain

The user must be able to say: **"Because I trained X, Y improved."**

### Chain Structure

```
TRAINING INPUT          →    INTERMEDIATE SIGNAL    →    OUTCOME
(what you did)               (proof it worked)           (what you can now do)
```

### Chain 1: Volume → Test Improvement
```
Training blocks in area  →   Hours accumulated      →   Test score increased
"Putting drills x 12 sessions"  "18 hours on putting"   "Lag-control: 62% → 78%"
```
**Causal statement:** "You trained putting for 18 hours across 12 sessions. Your lag-control putting test improved from 62% to 78%."

### Chain 2: Consistency → Tests Passed
```
Training streak          →   Completion rate        →   More tests passed
"Trained 6 of 7 days/week"  "89% session completion"   "11 → 14 tests passed"
```
**Causal statement:** "You completed 89% of your scheduled sessions over 8 weeks. You now pass 3 more tests than when you started."

### Chain 3: Focus Area → Specific Capability
```
L-phase progression      →   Exercise mastery       →   Capability threshold crossed
"L3 → L4 in iron accuracy"  "Completed 40 reps at L4"  "Iron 7 accuracy test: PASSED"
```
**Causal statement:** "You progressed from L3 to L4 in iron accuracy drills, completing 40 reps at the higher level. You now pass the Iron 7 accuracy test."

### Chain 4: Structured Training → Tournament Performance
```
Training hours (total)   →   Tests passed (%)       →   Tournament score dropped
"142 hours this season"     "70% → 85% pass rate"      "76 avg → 73 avg"
```
**Causal statement:** "You've trained 142 hours this season. Your test pass rate went from 70% to 85%. Your tournament average dropped from 76 to 73."

### Chain 5: Targeted Work → Weakness Elimination
```
Focus on failing tests   →   Specific test improved  →   Weakness becomes strength
"12 hours on wedge PEI"     "PEI: 45 → 68"             "Wedge test: FAIL → PASS"
```
**Causal statement:** "You spent 12 hours specifically on wedge proximity. Your Wedge PEI score went from 45 to 68. You now pass the wedge test."

---

## D. The Proof Moment

### Definition
The proof moment is the first time the user sees undeniable evidence that their training caused a specific improvement.

### When It Must Occur
**Before the first benchmark after starting structured training.**

Typically: Week 4–6.

If the user reaches week 4 without a proof moment, they evaluate value based on effort alone. Effort without proof = churn risk.

### What Triggers It
The proof moment occurs when:
1. User completes a benchmark test
2. At least one test score has improved since the previous benchmark
3. The system can attribute that improvement to specific training

### What It Contains
The proof moment must answer three questions:
1. **What improved?** (specific test or capability)
2. **By how much?** (measurable delta)
3. **Because of what?** (specific training attribution)

### Example Proof Moment (in words)

> "Your putting improved."
>
> "Your lag-control putting score went from 62% to 78% — that's 16 points higher than your last benchmark."
>
> "This happened because you completed 12 putting sessions totaling 18 hours, focusing on distance control drills at L3 and L4 intensity."
>
> "You now pass a test you previously failed."

### What Makes This Moment Work
- **Specific:** Not "you're doing great" but "lag-control putting: 62% → 78%"
- **Attributed:** Not "your scores improved" but "because of 18 hours of putting drills"
- **Credible:** Uses objective test data, not self-reported feelings
- **Timely:** Appears at the benchmark, not buried in stats

---

## E. Why This Would Reduce Churn

### Current State: Effort Without Proof
The user trains for weeks. They see:
- Hours logged ✓
- Sessions completed ✓
- Streaks maintained ✓

They do not see:
- What actually improved
- Why it improved
- Whether training caused improvement

At week 2–4, they ask: "Is this worth it?"
The system provides no answer.
They must trust on faith or manually connect dots across 4 screens.
Many churn.

### Future State: Proof at the Right Moment
The user trains for weeks. At their first benchmark, they see:

> "Your putting improved from 62% to 78% because you trained putting for 18 hours."

This answers:
- **Is it working?** Yes, test scores improved.
- **Is the training relevant?** Yes, specific drills caused specific improvement.
- **Should I continue?** Yes, the method is producing results.

### Churn Reduction Mechanism

| Evaluation Question | Without Proof | With Proof |
|---------------------|---------------|------------|
| "Am I improving?" | Unknown - must guess | Yes - test scores show it |
| "Is training causing it?" | Unknown - no attribution | Yes - hours linked to results |
| "Should I continue?" | Uncertain - leap of faith | Clear - method is working |

### The Psychological Shift

**Before:** "I trained hard. I hope it worked."
**After:** "I trained putting for 18 hours. My lag-control improved 16 points. I now pass a test I used to fail."

The first is hope.
The second is proof.

Proof retains users. Hope does not.

---

## Summary

| Element | Definition |
|---------|------------|
| **Improvement** | A measurable change in capability that brings the golfer closer to their competitive goal |
| **Outcome Signals** | Test score delta, tests passed count, training-to-test correlation, tournament trend, requirement gap closure |
| **Causal Chain** | Training input → intermediate signal → outcome, with explicit attribution |
| **Proof Moment** | First benchmark after structured training where improvement is attributed to specific work |
| **Churn Reduction** | Transforms "I hope it worked" into "I see that it worked" |

---

*Logic design complete. No UI. No features. Outcome meaning defined.*
