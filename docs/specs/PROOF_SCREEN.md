# UI Design: PROOF Screen

**Responsibility:** Present indisputable evidence of change by comparing current measured state to baseline.
**Platform:** iPhone-first (375pt width)
**Context:** Serious, factual, high-stakes moment. This is where trust is earned or lost.

---

## 1. Screen Layout Structure

Three regions. No scroll required. Full focus on the comparison.

```
┌─────────────────────────────────────┐
│           HEADER                    │  ← Region 1 (64pt)
├─────────────────────────────────────┤
│                                     │
│                                     │
│           COMPARISON                │  ← Region 2 (400pt)
│                                     │
│                                     │
├─────────────────────────────────────┤
│           DISMISS                   │  ← Region 3 (80pt)
└─────────────────────────────────────┘
```

---

### Region 1: HEADER (64pt)

**Contains:**
- Test name
- Test date
- Nothing else

**Layout:**
```
┌─────────────────────────────────────┐
│                                     │
│  Lag-kontroll putting               │
│  18. desember 2025                  │
│                                     │
└─────────────────────────────────────┘
```

**Typography:**
- Test name: `--text-headline` (17pt), `--ak-charcoal`
- Date: `--text-subhead` (15pt), `--ak-steel`

**Background:** `--ak-white`

**Purpose:** Identify what was measured and when. Nothing more.

---

### Region 2: COMPARISON (400pt)

**Contains:**
- Current result (primary)
- Baseline (reference)
- Delta (change)
- State indicator

**Layout:**
```
┌─────────────────────────────────────┐
│                                     │
│              NÅ                     │
│                                     │
│            74.2%                    │  ← Current value (largest)
│                                     │
│  ─────────────────────────────────  │
│                                     │
│         BASELINE                    │
│           68.5%                     │  ← Reference value
│                                     │
│  ─────────────────────────────────  │
│                                     │
│          ENDRING                    │
│                                     │
│           +5.7                      │  ← Delta (change)
│                                     │
│                                     │
└─────────────────────────────────────┘
```

**Typography:**
- "NÅ" label: `--text-footnote` (13pt), `--ak-steel`, uppercase
- Current value: 56pt, `--ak-charcoal`, tabular figures
- "BASELINE" label: `--text-footnote` (13pt), `--ak-steel`, uppercase
- Baseline value: `--text-title-2` (22pt), `--ak-steel`
- "ENDRING" label: `--text-footnote` (13pt), `--ak-steel`, uppercase
- Delta value: `--text-title-1` (28pt), color varies (see below)

**Delta coloring:**
- Positive change (improvement): `--ak-charcoal` (neutral, not green)
- Negative change (decline): `--ak-charcoal` (neutral, not red)
- No change: `--ak-charcoal`

**Why neutral colors:** Color-coding implies judgment. The number speaks for itself.

---

### Region 3: DISMISS (80pt)

**Contains:**
- Single action to leave screen
- No recommendations, no "next steps"

**Layout:**
```
┌─────────────────────────────────────┐
│                                     │
│     ┌───────────────────────┐       │
│     │       Forstått        │       │
│     └───────────────────────┘       │
│                                     │
└─────────────────────────────────────┘
```

**Typography:**
- Button: `--text-headline` (17pt), `--ak-charcoal` on `--ak-mist`

**Button styling:** Subdued. Not primary color. This is acknowledgment, not action.

**Purpose:** User confirms they have seen the result. Nothing else.

---

## 2. Visual Hierarchy

```
1st  ████████████████████████  CURRENT VALUE (56pt, dominant)
2nd  ████████████             DELTA (28pt, the change)
3rd  ████████                 BASELINE (22pt, reference)
4th  ████                     LABELS + DISMISS
```

**Hierarchy logic:**

| Priority | Element | Why |
|----------|---------|-----|
| 1st | Current value | "What is my result?" — the primary question |
| 2nd | Delta | "How does it compare?" — the proof |
| 3rd | Baseline | Reference point for context |
| 4th | Labels, dismiss | Structural, not primary focus |

**The user's eye path:**
1. See the current number (large, center)
2. See the change (+5.7 or -2.3)
3. Reference the baseline to understand the comparison
4. Acknowledge and leave

---

## 3. Comparison Logic

### What Is Compared

| Element | Definition |
|---------|------------|
| **Current (NÅ)** | The result from this benchmark test |
| **Baseline** | The reference value established at BASELINE screen |
| **Delta (ENDRING)** | Current minus Baseline |

### Calculation

```
Delta = Current - Baseline

If test measures "higher is better" (e.g., accuracy %):
  +5.7 means improvement
  -2.3 means decline

If test measures "lower is better" (e.g., golf score):
  -3 means improvement
  +2 means decline
```

### Display Format

| Test Type | Current | Baseline | Delta Display |
|-----------|---------|----------|---------------|
| Percentage (higher=better) | 74.2% | 68.5% | +5.7 |
| Percentage (higher=better) | 65.1% | 68.5% | −3.4 |
| Distance (higher=better) | 258m | 245m | +13 |
| Score (lower=better) | 73 | 76 | −3 |
| Score (lower=better) | 78 | 76 | +2 |

**Note:** The system knows test polarity. Delta sign always reflects actual direction of change, but interpretation (good/bad) is left to the user.

---

## 4. Language

### Allowed Language

| Element | Language |
|---------|----------|
| Section label | "NÅ" |
| Section label | "BASELINE" |
| Section label | "ENDRING" |
| Dismiss button | "Forstått" |
| Insufficient data | "Ikke nok data" |
| No baseline | "Baseline ikke satt" |

### Forbidden Language

| Forbidden | Category |
|-----------|----------|
| "Great improvement!" | Celebration |
| "Well done!" | Encouragement |
| "You improved!" | Interpretation |
| "Unfortunately..." | Softening |
| "Don't worry" | Consolation |
| "This is because..." | Causality explanation |
| "You trained X hours" | Effort reference |
| "Next, you should..." | Recommendation |
| "Keep it up!" | Motivation |
| "Room for improvement" | Softening |
| "Almost there!" | Encouragement |
| "Try harder next time" | Judgment |
| "+5.7 🎉" | Celebration (emoji) |
| "−3.4 😔" | Consolation (emoji) |

### The Language Principle

The screen shows:
- A number (current)
- A number (baseline)
- A number (delta)

That's it. No adjectives. No adverbs. No emotional framing.

---

## 5. Handling Uncertainty / Insufficient Data

### Scenario A: First Benchmark (No Previous Data)

```
┌─────────────────────────────────────┐
│                                     │
│  Lag-kontroll putting               │
│  18. desember 2025                  │
│                                     │
├─────────────────────────────────────┤
│                                     │
│              NÅ                     │
│                                     │
│            74.2%                    │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│         BASELINE                    │
│         Første test                 │  ← Text instead of number
│                                     │
│  ─────────────────────────────────  │
│                                     │
│          ENDRING                    │
│                                     │
│            —                        │  ← Em dash, no value
│                                     │
│                                     │
├─────────────────────────────────────┤
│     ┌───────────────────────┐       │
│     │       Forstått        │       │
│     └───────────────────────┘       │
└─────────────────────────────────────┘
```

**Language:**
- Baseline shows: "Første test"
- Delta shows: "—" (em dash)

**No additional explanation.** The user sees this is their first test. No comparison is possible.

---

### Scenario B: Test Not Completed

```
┌─────────────────────────────────────┐
│                                     │
│  Lag-kontroll putting               │
│  Ikke gjennomført                   │  ← Status instead of date
│                                     │
├─────────────────────────────────────┤
│                                     │
│              NÅ                     │
│                                     │
│              —                      │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│         BASELINE                    │
│           68.5%                     │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│          ENDRING                    │
│                                     │
│            —                        │
│                                     │
│                                     │
├─────────────────────────────────────┤
│     ┌───────────────────────┐       │
│     │       Forstått        │       │
│     └───────────────────────┘       │
└─────────────────────────────────────┘
```

**Language:**
- Date shows: "Ikke gjennomført"
- Current shows: "—"
- Delta shows: "—"

---

### Scenario C: Baseline Not Set

```
┌─────────────────────────────────────┐
│                                     │
│  Lag-kontroll putting               │
│  18. desember 2025                  │
│                                     │
├─────────────────────────────────────┤
│                                     │
│              NÅ                     │
│                                     │
│            74.2%                    │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│         BASELINE                    │
│         Ikke satt                   │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│          ENDRING                    │
│                                     │
│            —                        │
│                                     │
│                                     │
├─────────────────────────────────────┤
│     ┌───────────────────────┐       │
│     │       Forstått        │       │
│     └───────────────────────┘       │
└─────────────────────────────────────┘
```

---

## 6. What This Screen Does NOT Show

### Explicit Exclusions

| Excluded | Reason |
|----------|--------|
| Training hours | Effort is not proof |
| Session count | Effort is not proof |
| "Because you trained X..." | Causality is interpretation |
| Trend over time | Belongs to TRAJECTORY |
| Other test results | One test per screen |
| Comparison to other users | Social excluded |
| Goal progress | Goals are separate |
| "Next steps" | Recommendations excluded |
| Coach comments | Separate concern |
| Celebration graphics | Emotion excluded |
| Consolation graphics | Emotion excluded |
| Color-coded judgment | Green/red implies good/bad |
| Badges or achievements | Gamification excluded |
| Historical chart | Belongs to TRAJECTORY |
| "Why this happened" | Speculation excluded |

### Why These Exclusions

The PROOF screen has ONE job:

> **"What changed?"**

Not "why did it change?" — that's interpretation.
Not "what should I do?" — that's recommendation.
Not "how do I feel about it?" — that's emotion.

Just: **What is the number? What was the baseline? What is the difference?**

---

## 7. Preserving Trust When Results Are Negative

### The Trust Problem

When results are negative, users may:
- Blame the system
- Claim measurement error
- Feel the system "failed them"
- Distrust future measurements

### How This Design Preserves Trust

| Design Choice | Trust Mechanism |
|---------------|-----------------|
| **No softening** | System doesn't apologize. Apologies imply fault. |
| **No explanation** | System doesn't guess why. Guesses can be wrong. |
| **No recommendation** | System doesn't prescribe. Prescription implies it knows better. |
| **Neutral colors** | Red would say "bad". The system doesn't judge. |
| **Same format always** | Good or bad, the screen looks identical. |
| **User-owned baseline** | User chose baseline. System just measured. |
| **"Forstått" not "OK"** | "OK" might feel like approval. "Forstått" is acknowledgment. |

### The Credibility Equation

**Positive result:**
- User sees: "74.2% → Baseline 68.5% → +5.7"
- User thinks: "I improved. The system measured it."

**Negative result:**
- User sees: "65.1% → Baseline 68.5% → −3.4"
- User thinks: "I declined. The system measured it."

In both cases, the system did the same thing: measure and compare.

**If the system celebrated positive results:**
- User might think: "The system is biased toward good news"
- Negative results feel like punishment by contrast

**If the system consoled negative results:**
- User might think: "The system knows this is bad"
- System becomes judge, not measurer

**By being neutral in both cases:**
- System is credible
- System is consistent
- User owns the interpretation

---

## 8. Multiple Tests in Single Benchmark

If a benchmark includes multiple tests, each test gets its own PROOF screen.

### Flow for Multiple Tests

```
Test 1: PROOF → [Forstått] →
Test 2: PROOF → [Forstått] →
Test 3: PROOF → [Forstått] →
Summary: Navigate to TRAJECTORY or HOME
```

Each test is shown individually. User processes one result at a time.

**Why not show all at once:**
- Cognitive overload
- Users skip to "overall" and miss details
- Each test deserves full attention

---

## 9. Visual Design Details

### Divider Lines

- 1pt height
- Color: `--ak-mist`
- Full width minus padding
- Creates clear separation between sections

### Value Display

```
CURRENT VALUE
┌─────────────────────────────────────┐
│                                     │
│            74.2%                    │  56pt, --ak-charcoal
│                                     │
└─────────────────────────────────────┘

BASELINE VALUE
┌─────────────────────────────────────┐
│                                     │
│            68.5%                    │  22pt, --ak-steel
│                                     │
└─────────────────────────────────────┘

DELTA VALUE
┌─────────────────────────────────────┐
│                                     │
│            +5.7                     │  28pt, --ak-charcoal
│                                     │
└─────────────────────────────────────┘
```

### Label Styling

- All uppercase
- `--text-footnote` (13pt)
- `--ak-steel`
- Letter-spacing: 0.5pt (slight tracking)
- Margin below: `--spacing-xs` (4pt)

---

## 10. Design Tokens

```
Colors:
--ak-charcoal      All values (current, delta)
--ak-steel         Labels, baseline value
--ak-white         Background
--ak-mist          Dividers, dismiss button background

Typography:
56pt               Current value (custom, tabular figures)
--text-title-1     Delta (28pt)
--text-title-2     Baseline (22pt)
--text-headline    Test name, button (17pt)
--text-subhead     Date (15pt)
--text-footnote    Labels (13pt)

Spacing:
--spacing-lg       24pt (section padding)
--spacing-xl       32pt (between major sections)

No shadows. No radius on main container.
Clean, clinical, factual.
```

---

## 11. Summary

| Aspect | Design Decision |
|--------|-----------------|
| **Primary element** | Current value (56pt, center) |
| **Secondary element** | Delta (28pt) |
| **Tertiary element** | Baseline reference (22pt) |
| **Color coding** | None. All values in neutral --ak-charcoal |
| **Positive result** | Same layout, same tone |
| **Negative result** | Same layout, same tone |
| **Insufficient data** | Em dash (—), no explanation |
| **Dismiss action** | "Forstått" — acknowledgment, not approval |
| **Excluded** | Effort, causality, recommendation, celebration, consolation |
| **Trust mechanism** | Neutral measurement. User owns interpretation. |

---

## 12. Component Mapping (Existing Codebase)

| Element | Existing Component | File |
|---------|-------------------|------|
| Test results view | `Testresultater` | `/features/tests/Testresultater.jsx` |

**Current implementation note:** Existing component shows multiple tests in a grid, includes radar charts, trend indicators, and pass/fail badges. This design proposes a focused single-test PROOF view that should appear at benchmark moment, separate from the historical results dashboard.

**Recommendation:** Create new `ProofScreen` component that shows one test result in isolation, accessed immediately after benchmark completion. `Testresultater` becomes part of TRAJECTORY for historical view.

---

*Design complete. Measurement without judgment. Trust preserved.*
