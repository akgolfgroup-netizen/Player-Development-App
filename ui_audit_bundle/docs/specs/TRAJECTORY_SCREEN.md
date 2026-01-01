# UI Design: TRAJECTORY Screen

**Responsibility:** Provide a historical, retrospective view of test results over time.
**Platform:** iPhone-first (375pt width)
**Context:** Reflective, archival, retrospective. Looking back at what was measured.

---

## 1. Screen Layout Structure

Three regions. Scrollable. Data-dense but structured.

```
┌─────────────────────────────────────┐
│           HEADER                    │  ← Region 1 (64pt, fixed)
├─────────────────────────────────────┤
│                                     │
│           TEST SELECTOR             │  ← Region 2 (56pt)
│                                     │
├─────────────────────────────────────┤
│                                     │
│                                     │
│           HISTORY                   │  ← Region 3 (scrollable)
│                                     │
│                                     │
└─────────────────────────────────────┘
```

---

### Region 1: HEADER (64pt, Fixed)

**Contains:**
- Screen title
- Time range (passive statement)

**Layout:**
```
┌─────────────────────────────────────┐
│  ←         Historikk                │
│            6 tester registrert      │
└─────────────────────────────────────┘
```

**Typography:**
- Title: `--text-headline` (17pt), `--ak-charcoal`
- Count: `--text-subhead` (15pt), `--ak-steel`

**Background:** `--ak-white`

**Purpose:** Identify the screen. State what exists. No interpretation.

---

### Region 2: TEST SELECTOR (56pt)

**Contains:**
- Horizontal scroll of test categories
- "Alle" selected by default

**Layout:**
```
┌─────────────────────────────────────┐
│                                     │
│  [ Alle ] [ Putting ] [ Langspill ] │
│  [ Kortspill ] [ Fysisk ] [ Mental ]│
│                                     │
└─────────────────────────────────────┘
```

**Chip styling:**
- Selected: `--ak-primary` background, `--ak-white` text
- Unselected: `--ak-mist` background, `--ak-charcoal` text

**Purpose:** Filter the history list. No judgment about which category matters.

---

### Region 3: HISTORY (Scrollable)

**Contains:**
- Chronological list of test results
- Grouped by benchmark date
- Each result shows: value, baseline reference, delta

**Layout:**
```
┌─────────────────────────────────────┐
│                                     │
│  18. DESEMBER 2025                  │  ← Benchmark date
│                                     │
│  ┌─────────────────────────────┐    │
│  │  Lag-kontroll putting       │    │
│  │                             │    │
│  │  74.2%                      │    │  ← Current value
│  │  Baseline: 68.5%  (+5.7)    │    │  ← Reference + delta
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │  Driver distanse            │    │
│  │                             │    │
│  │  258m                       │    │
│  │  Baseline: 245m  (+13)      │    │
│  └─────────────────────────────┘    │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  4. NOVEMBER 2025                   │  ← Previous benchmark
│                                     │
│  ┌─────────────────────────────┐    │
│  │  Lag-kontroll putting       │    │
│  │                             │    │
│  │  71.8%                      │    │
│  │  Baseline: 68.5%  (+3.3)    │    │
│  └─────────────────────────────┘    │
│                                     │
│  ...                                │
│                                     │
└─────────────────────────────────────┘
```

**Typography:**
- Date header: `--text-footnote` (13pt), `--ak-steel`, uppercase
- Test name: `--text-headline` (17pt), `--ak-charcoal`
- Value: `--text-title-2` (22pt), `--ak-charcoal`
- Baseline + delta: `--text-subhead` (15pt), `--ak-steel`

**Card styling:**
- Background: `--ak-white`
- Border radius: `--radius-md` (12pt)
- Shadow: `--shadow-card`
- Padding: `--spacing-md` (16pt)

---

## 2. Visual Hierarchy

```
1st  ████████████████████████  TEST VALUES (22pt, per card)
2nd  ████████████             TEST NAMES (17pt)
3rd  ████████                 BASELINE + DELTA (15pt)
4th  ████                     DATE HEADERS (13pt)
```

**Hierarchy logic:**

| Priority | Element | Why |
|----------|---------|-----|
| 1st | Test values | "What were my results?" |
| 2nd | Test names | "Which test?" |
| 3rd | Baseline reference | "Compared to what?" |
| 4th | Dates | Temporal organization |

**User task:** Scan history, see what was measured, when.

---

## 3. Data Display Rules

### What Is Shown

| Data | Format | Source |
|------|--------|--------|
| Benchmark date | "18. DESEMBER 2025" | Test timestamp |
| Test name | "Lag-kontroll putting" | Test definition |
| Current value | "74.2%" | Test result |
| Baseline | "Baseline: 68.5%" | User's baseline |
| Delta | "(+5.7)" | Calculated |

### Display Rules

**Delta formatting:**
- Positive: `(+5.7)` — parentheses, plus sign
- Negative: `(−3.4)` — parentheses, minus sign (actual minus, not hyphen)
- Zero: `(0)` — just zero
- No baseline: `(—)` — em dash

**All deltas in same color:** `--ak-steel`. No green/red.

**Chronological order:** Most recent first.

---

## 4. What This Screen Does NOT Show

### Explicit Exclusions

| Excluded | Reason |
|----------|--------|
| Trend lines | Implies trajectory prediction |
| Trend arrows (↑↓) | Implies judgment |
| "Improving" / "Declining" labels | Interpretation |
| "On track" indicators | Prediction |
| Goal progress | Goals are separate concept |
| Effort hours | TRAJECTORY shows outcomes only |
| Training correlation | Causality is interpretation |
| Predictions | "At this rate, you'll reach..." |
| Recommendations | "Focus on X" |
| Comparison to others | Social excluded |
| Color-coded results | Green/red implies judgment |
| Averages | Summarization implies interpretation |
| Best/worst markers | Judgment |
| Streak indicators | Gamification |
| Achievement badges | Gamification |

### Why No Charts

Charts imply:
- Trend (slope of line)
- Pattern (visual continuity)
- Prediction (where line is going)

This screen shows **discrete points**, not continuous trajectories.

Each benchmark is its own moment. The screen does not connect them into a narrative.

---

## 5. Handling Edge Cases

### First Test (No History)

```
┌─────────────────────────────────────┐
│  ←         Historikk                │
│            1 test registrert        │
├─────────────────────────────────────┤
│  [ Alle ] ...                       │
├─────────────────────────────────────┤
│                                     │
│  18. DESEMBER 2025                  │
│                                     │
│  ┌─────────────────────────────┐    │
│  │  Lag-kontroll putting       │    │
│  │                             │    │
│  │  74.2%                      │    │
│  │  Baseline: 68.5%  (+5.7)    │    │
│  └─────────────────────────────┘    │
│                                     │
│  Første registrerte test            │  ← Factual note
│                                     │
└─────────────────────────────────────┘
```

**Language:** "Første registrerte test" — factual, not "Great start!"

### No Tests Yet

```
┌─────────────────────────────────────┐
│  ←         Historikk                │
│            0 tester registrert      │
├─────────────────────────────────────┤
│  [ Alle ] ...                       │
├─────────────────────────────────────┤
│                                     │
│                                     │
│                                     │
│       Ingen tester registrert       │
│                                     │
│                                     │
│                                     │
└─────────────────────────────────────┘
```

**Language:** "Ingen tester registrert" — factual statement, not "Complete your first test!"

### Filtered Category Empty

```
┌─────────────────────────────────────┐
│  ←         Historikk                │
│            6 tester registrert      │
├─────────────────────────────────────┤
│  [ Alle ] [ Putting ] [*Mental*]    │
├─────────────────────────────────────┤
│                                     │
│                                     │
│                                     │
│     Ingen tester i denne            │
│     kategorien                      │
│                                     │
│                                     │
└─────────────────────────────────────┘
```

---

## 6. Interaction

### Tap on Test Card

Opens PROOF screen for that specific test result.

**Why:** User can review full comparison details if needed.

### Filter Selection

- Tap category → filters list
- "Alle" always available
- Single selection only (not multi-select)

### Scroll

- Standard momentum scrolling
- Pull-to-refresh disabled (historical data doesn't change)

---

## 7. Relationship to PROOF Screen

### Division of Responsibility

| PROOF | TRAJECTORY |
|-------|------------|
| Single test, single moment | All tests, all moments |
| Appears at benchmark time | Accessed anytime |
| Full-screen focus | List format |
| Acknowledgment required | Browse freely |
| THE moment of truth | Historical reference |

### How They Work Together

```
BENCHMARK MOMENT:
  → PROOF screen (test 1)
  → PROOF screen (test 2)
  → ...
  → HOME

LATER:
  → Navigate to TRAJECTORY
  → See all historical results
  → Tap card → see PROOF view for that test
```

**PROOF is live. TRAJECTORY is archive.**

---

## 8. Language Reference

### Allowed Language

| Context | Language |
|---------|----------|
| Screen title | "Historikk" |
| Count | "6 tester registrert" |
| Date header | "18. DESEMBER 2025" |
| Baseline reference | "Baseline: 68.5%" |
| Delta | "(+5.7)" / "(−3.4)" |
| Empty state | "Ingen tester registrert" |
| Filtered empty | "Ingen tester i denne kategorien" |
| First test | "Første registrerte test" |

### Forbidden Language

| Forbidden | Category |
|-----------|----------|
| "Your progress" | Progress framing |
| "Improvement over time" | Interpretation |
| "You're getting better!" | Encouragement |
| "Trending up" | Prediction |
| "Keep it up!" | Motivation |
| "Best result" | Judgment |
| "Worst result" | Judgment |
| "Average: X" | Summarization |
| "Goal: X" | Goals are separate |
| "Next test in X days" | Future reference |
| "You should focus on..." | Recommendation |

---

## 9. Visual Design Details

### Date Headers

```
18. DESEMBER 2025

Font: --text-footnote (13pt)
Color: --ak-steel
Transform: uppercase
Letter-spacing: 0.5pt
Margin-top: --spacing-lg (24pt)
Margin-bottom: --spacing-sm (8pt)
```

### Test Cards

```
┌─────────────────────────────────────┐
│                                     │
│  Lag-kontroll putting               │  ← 17pt, --ak-charcoal
│                                     │
│  74.2%                              │  ← 22pt, --ak-charcoal
│                                     │
│  Baseline: 68.5%  (+5.7)            │  ← 15pt, --ak-steel
│                                     │
└─────────────────────────────────────┘

Background: --ak-white
Border-radius: --radius-md (12pt)
Shadow: --shadow-card
Padding: --spacing-md (16pt)
Margin-bottom: --spacing-sm (8pt)
```

### Category Chips

```
SELECTED                    UNSELECTED
┌─────────────┐             ┌─────────────┐
│    Alle     │             │   Putting   │
└─────────────┘             └─────────────┘
BG: --ak-primary            BG: --ak-mist
Text: --ak-white            Text: --ak-charcoal

Height: 36pt
Padding: 0 16pt
Border-radius: --radius-full
Font: --text-subhead (15pt)
```

### Page Background

`--ak-snow`

---

## 10. Design Tokens

```
Colors:
--ak-primary       Selected filter chip
--ak-charcoal      Test names, values
--ak-steel         Dates, baseline, delta, secondary text
--ak-white         Card backgrounds, selected chip text
--ak-snow          Page background
--ak-mist          Unselected chip background

Typography:
--text-title-2     Test values (22pt)
--text-headline    Screen title, test names (17pt)
--text-subhead     Count, baseline reference (15pt)
--text-footnote    Date headers (13pt)

Spacing:
--spacing-sm       8pt (between cards)
--spacing-md       16pt (card padding)
--spacing-lg       24pt (before date headers)

Radius:
--radius-md        12pt (cards)
--radius-full      Chips

Shadows:
--shadow-card      Test result cards
```

---

## 11. Summary

| Aspect | Design Decision |
|--------|-----------------|
| **Primary element** | Test values (22pt per card) |
| **Organization** | Chronological, grouped by benchmark date |
| **Filtering** | By test category |
| **Interaction** | Tap card → PROOF view |
| **No charts** | Charts imply trends and predictions |
| **No colors** | Green/red implies judgment |
| **No summaries** | "Average", "best", "trend" are interpretation |
| **Empty states** | Factual: "Ingen tester registrert" |
| **Relationship to PROOF** | TRAJECTORY is archive, PROOF is live moment |

---

## 12. Component Mapping (Existing Codebase)

| Element | Existing Component | File |
|---------|-------------------|------|
| Historical view | `Testresultater` | `/features/tests/Testresultater.jsx` |
| Progress view | `ProgressDashboard` | `/features/progress/ProgressDashboard.jsx` |
| Archive | `Arkiv` | `/features/archive/Arkiv.jsx` |

**Current implementation note:** Existing `Testresultater` includes radar charts, trend indicators, and pass/fail badges. These elements should be removed or the component should be refactored. The TRAJECTORY design proposes a simpler, chronological list format that shows facts without interpretation.

**Existing elements to remove:**
- Radar chart (implies current "shape")
- Trend arrows (implies direction)
- Pass/fail badges (implies judgment)
- Progress bars (implies goal proximity)
- "Tests Improved" count (implies positive framing)

---

*Design complete. Archive of measurements. No interpretation. Looking back, not forward.*
