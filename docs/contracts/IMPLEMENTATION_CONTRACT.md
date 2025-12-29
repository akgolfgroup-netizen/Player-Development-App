# Implementation Contract: Design to Code Translation

**Status:** BINDING
**Version:** 1.0
**Date:** 2025-12-18

This document is a contract between design and development. All criteria are testable. No interpretation required.

---

# PART 1 — Screen-Level Acceptance Criteria

---

## Screen: SESSION

**Responsibility:** Support execution of the current training session without distraction.

### The screen MUST:

| ID | Criterion | Verification |
|----|-----------|--------------|
| S-01 | Display current rep count in center of screen, minimum 56pt font | Visual inspection |
| S-02 | Display session elapsed time in HH:MM:SS format | Verify format matches pattern |
| S-03 | Display block remaining time in MM:SS format | Verify format matches pattern |
| S-04 | Display current block position as "Blokk X av Y" | Verify text format |
| S-05 | Display exercise name | Verify text present |
| S-06 | Display training area label | Verify text present |
| S-07 | Display target rep count | Verify number present |
| S-08 | Provide tap zone for incrementing rep count (minimum 50% screen width) | Measure touch target |
| S-09 | Provide tap zone for decrementing rep count (minimum 50% screen width) | Measure touch target |
| S-10 | Provide pause functionality accessible via single tap | Verify interaction |
| S-11 | Show pause overlay with session time and pause duration when paused | Verify overlay appears |
| S-12 | Provide "Fortsett" action to resume from pause | Verify button present and functional |
| S-13 | Provide "Avslutt økt" action to end session | Verify link present and functional |
| S-14 | Show "Blokk X fullført" with rep count when block completes | Verify transition state |
| S-15 | Show "Økt fullført" with total blocks, reps, and duration when session ends | Verify completion state |
| S-16 | Update rep count immediately on tap (no delay) | Verify < 100ms response |
| S-17 | Provide haptic feedback on rep count change (if device supports) | Verify on physical device |

### The screen MUST NOT:

| ID | Criterion | Verification |
|----|-----------|--------------|
| S-50 | Display any text containing "progress", "fremgang", "improvement", or "forbedring" | Text search |
| S-51 | Display any text containing "great", "flott", "bra", "well done", or "good job" | Text search |
| S-52 | Display any text containing "keep going", "fortsett sånn", or "keep it up" | Text search |
| S-53 | Display XP, points, badges, or level indicators | Visual inspection |
| S-54 | Display streak counter or streak-related text | Visual inspection + text search |
| S-55 | Display goal references or goal progress | Visual inspection |
| S-56 | Display benchmark countdown or benchmark references | Visual inspection + text search |
| S-57 | Display comparison to past sessions | Visual inspection |
| S-58 | Display session "score" or "grade" | Visual inspection |
| S-59 | Display percentage completion (e.g., "75% complete") | Text search for "%" in progress context |
| S-60 | Display notifications unrelated to current session | Visual inspection |
| S-61 | Display emoji in feedback messages (completion, pause) | Visual inspection |
| S-62 | Use green color to indicate positive rep count changes | Color inspection |
| S-63 | Use red color to indicate negative rep count changes | Color inspection |

### Edge cases:

| ID | Case | Required Behavior |
|----|------|-------------------|
| S-E1 | Zero reps logged | Display "0" in rep counter. Allow negative decrement to 0. |
| S-E2 | Block timer reaches zero | Transition to block complete state. Do not auto-advance without showing completion. |
| S-E3 | Last block completed | Show session complete state, not block complete state. |
| S-E4 | Session resumed from background | Restore exact state including rep count, block position, and elapsed time. |
| S-E5 | Network unavailable | Session continues locally. Data syncs when connection restored. |
| S-E6 | Device rotated | Remain in portrait mode. Do not rotate. |

---

## Screen: REFLECTION

**Responsibility:** Capture post-session facts and subjective input without evaluating progress.

### The screen MUST:

| ID | Criterion | Verification |
|----|-----------|--------------|
| R-01 | Display session summary: training area, block count, duration | Verify text present |
| R-02 | Provide body state input (5-point scale) | Verify 5 options present |
| R-03 | Provide mind state input (5-point scale) | Verify 5 options present |
| R-04 | Provide sleep hours input (segmented: 5, 6, 7, 8, 9+) | Verify 5 options present |
| R-05 | Provide sleep quality input (3-point scale) | Verify 3 options present |
| R-06 | Provide free-text notes input | Verify text field present |
| R-07 | Provide free-text "next session" input | Verify text field present |
| R-08 | All inputs must be optional | Submit with no selections → success |
| R-09 | Provide "Lagre" primary action | Verify button present |
| R-10 | Provide "Hopp over" secondary action | Verify link present |
| R-11 | "Hopp over" shows confirmation before discarding | Verify confirmation dialog |
| R-12 | Display emoji for scale options (body: 😫😕😐🙂💪, mind: 😤😔😐😊😌) | Verify exact emoji |
| R-13 | Display scale anchors as text labels | Verify "Sliten/Nøytral/Energisk" present |

### The screen MUST NOT:

| ID | Criterion | Verification |
|----|-----------|--------------|
| R-50 | Display any text containing "great session", "bra økt", or equivalent | Text search |
| R-51 | Display session "score", "rating", or "grade" assigned by system | Visual inspection |
| R-52 | Display comparison to previous sessions | Visual inspection |
| R-53 | Display goal progress | Visual inspection |
| R-54 | Display benchmark references | Visual inspection |
| R-55 | Display XP, points, or badges for completing reflection | Visual inspection |
| R-56 | Display "improvement" or "forbedring" language | Text search |
| R-57 | Display recommendations or suggestions | Visual inspection |
| R-58 | Pre-select any default values | Verify all inputs start unselected |
| R-59 | Display "ideal" or "target" values for comparison | Visual inspection |

### Edge cases:

| ID | Case | Required Behavior |
|----|------|-------------------|
| R-E1 | User submits with no input | Save empty reflection. Navigate to HOME. |
| R-E2 | User taps "Hopp over" | Show confirmation. On confirm, navigate to HOME without saving. |
| R-E3 | User partially completes, app backgrounds | Preserve state. On return, show same screen with preserved input. |
| R-E4 | Network unavailable | Queue save locally. Sync when connection restored. |
| R-E5 | Text input exceeds 1000 characters | Allow input. No truncation. |

---

## Screen: HOME

**Responsibility:** Orient the user to the next action without evaluating progress.

### The screen MUST:

| ID | Criterion | Verification |
|----|-----------|--------------|
| H-01 | Display user first name | Verify text matches user record |
| H-02 | Display current date in format "Ons 18 des" | Verify format |
| H-03 | Display next session card with: training area, session name, time, location, duration | Verify all fields present |
| H-04 | Display "Start" button when session is scheduled for today | Verify button present |
| H-05 | Display days until next benchmark as "X dager til test" | Verify format |
| H-06 | Display days until next event (if scheduled) | Verify format |
| H-07 | Display total hours trained since last benchmark | Verify number present |
| H-08 | Display total sessions since last benchmark | Verify number present |
| H-09 | Display breakdown by training area (hours per area) | Verify list present |
| H-10 | Display "Se all historikk →" link | Verify link present and navigates |
| H-11 | Label effort section as "SIDEN SISTE TEST" | Verify exact text |
| H-12 | When no session today, display "Ingen økt planlagt" | Verify text when condition met |
| H-13 | When no session today, display next session date | Verify date shown |
| H-14 | When session in progress, display "PÅGÅR" label and "Fortsett" button | Verify state change |

### The screen MUST NOT:

| ID | Criterion | Verification |
|----|-----------|--------------|
| H-50 | Display text containing "progress", "fremgang", or "improvement" | Text search |
| H-51 | Display text containing "great", "bra", "keep it up", or encouragement | Text search |
| H-52 | Display text containing "on track" or "på sporet" | Text search |
| H-53 | Display XP, level, badges, or gamification elements | Visual inspection |
| H-54 | Display streak counter | Visual inspection |
| H-55 | Display goal progress percentage | Visual inspection |
| H-56 | Display benchmark results or scores | Visual inspection |
| H-57 | Display progress bars toward goals | Visual inspection |
| H-58 | Display comparison to other users | Visual inspection |
| H-59 | Display predictions about future performance | Text search |
| H-60 | Frame effort hours as "progress" (must be factual: "24 timer") | Text inspection |
| H-61 | Display "recommended" training or suggestions | Visual inspection |
| H-62 | Display motivational quotes | Visual inspection |
| H-63 | Display weather information | Visual inspection |

### Edge cases:

| ID | Case | Required Behavior |
|----|------|-------------------|
| H-E1 | No sessions scheduled (none today, none future) | Show "Ingen økter planlagt" in next action area. |
| H-E2 | No benchmark scheduled | Hide benchmark countdown card entirely. |
| H-E3 | First use (no baseline set) | Redirect to BASELINE screen before showing HOME. |
| H-E4 | Before first benchmark | Label effort section "SIDEN START" instead of "SIDEN SISTE TEST". |
| H-E5 | Zero training hours logged | Display "0 timer · 0 økter". Do not hide section. |
| H-E6 | Session in progress | Show "PÅGÅR" state with "Fortsett" button. |

---

## Screen: BASELINE

**Responsibility:** Establish a neutral reference point for future measurement.

### The screen MUST:

| ID | Criterion | Verification |
|----|-----------|--------------|
| B-01 | Display step indicator (1/3, 2/3, 3/3) | Verify indicator present |
| B-02 | Step 1: Display explanation of what a baseline is | Verify text present |
| B-03 | Step 1: Display text stating "referansepunkt" or "utgangspunkt" | Text search |
| B-04 | Step 2: Display season average option with value and round count | Verify both numbers |
| B-05 | Step 2: Display last 8 rounds option with value | Verify number |
| B-06 | Step 2: Require selection before proceeding | Verify button disabled until selection |
| B-07 | Step 3: Display selected baseline value prominently | Verify large text (34pt+) |
| B-08 | Step 3: Display bullet points explaining implications | Verify 3 bullet points |
| B-09 | Step 3: Display "Baseline kan ikke endres" text | Verify exact text |
| B-10 | Step 3: Provide "Bekreft" primary action | Verify button |
| B-11 | Step 3: Provide "Gå tilbake" secondary action | Verify link |
| B-12 | After confirmation, baseline is locked | Verify no edit path exists |

### The screen MUST NOT:

| ID | Criterion | Verification |
|----|-----------|--------------|
| B-50 | Display text containing "improvement", "forbedring", or "improve" | Text search |
| B-51 | Display text containing "goal", "mål", or "target" | Text search |
| B-52 | Display text containing "ambitious", "ambitiøs", "conservative", or "konservativ" | Text search |
| B-53 | Display text containing "recommended" or "anbefalt" | Text search |
| B-54 | Display AI recommendation or "we suggest" language | Text search |
| B-55 | Display text containing "journey", "reise", or "path" | Text search |
| B-56 | Display predictions about future improvement | Text search |
| B-57 | Display comparison to other users | Visual inspection |
| B-58 | Label options as "better" or "worse" | Text search |
| B-59 | Display motivational imagery or text | Visual inspection |
| B-60 | Allow skipping baseline setup | Verify no skip option |

### Edge cases:

| ID | Case | Required Behavior |
|----|------|-------------------|
| B-E1 | No historical data available | Display "Ingen historiske data" and manual entry option. |
| B-E2 | Only season average available (< 8 rounds) | Display only season average option. Hide last 8 option. |
| B-E3 | User navigates back from Step 3 | Return to Step 2 with selection preserved. |
| B-E4 | User navigates back from Step 2 | Return to Step 1. |
| B-E5 | App closes during setup | On reopen, resume at same step with state preserved. |
| B-E6 | Network error during confirm | Retry locally. Show error only after 3 retries. |

---

## Screen: PROOF

**Responsibility:** Present indisputable evidence of change without interpretation.

### The screen MUST:

| ID | Criterion | Verification |
|----|-----------|--------------|
| P-01 | Display test name | Verify text present |
| P-02 | Display test date in "18. desember 2025" format | Verify format |
| P-03 | Display current value as primary element (minimum 48pt) | Verify size |
| P-04 | Display "NÅ" label above current value | Verify exact text |
| P-05 | Display baseline value | Verify number present |
| P-06 | Display "BASELINE" label above baseline value | Verify exact text |
| P-07 | Display delta (change) with sign (+5.7 or −3.4) | Verify format includes sign |
| P-08 | Display "ENDRING" label above delta | Verify exact text |
| P-09 | Use em dash (—) for missing delta | Verify character is — not - |
| P-10 | Provide "Forstått" dismiss action | Verify exact text |
| P-11 | All values displayed in same neutral color | Verify no green/red |
| P-12 | Format identical for positive and negative results | Compare layouts |

### The screen MUST NOT:

| ID | Criterion | Verification |
|----|-----------|--------------|
| P-50 | Display text containing "great", "bra", "well done", "good" | Text search |
| P-51 | Display text containing "unfortunately", "dessverre", "sorry" | Text search |
| P-52 | Display text containing "improvement" or "forbedring" | Text search |
| P-53 | Display text containing "decline", "nedgang", "worse" | Text search |
| P-54 | Display training hours or effort data | Visual inspection |
| P-55 | Display "because you trained X" or causality language | Text search |
| P-56 | Display recommendations or "next steps" | Visual inspection |
| P-57 | Display celebration graphics (confetti, stars, etc.) | Visual inspection |
| P-58 | Display consolation graphics or sad imagery | Visual inspection |
| P-59 | Use green color for positive delta | Color inspection |
| P-60 | Use red color for negative delta | Color inspection |
| P-61 | Display emoji anywhere on screen | Visual inspection |
| P-62 | Display "OK" as dismiss text (must be "Forstått") | Text verification |
| P-63 | Display other test results on same screen | Visual inspection |

### Edge cases:

| ID | Case | Required Behavior |
|----|------|-------------------|
| P-E1 | First test (no baseline for this test) | Display "Første test" as baseline, em dash for delta. |
| P-E2 | Test not completed | Display "Ikke gjennomført" as date, em dash for current and delta. |
| P-E3 | Baseline not set for user | Display "Ikke satt" as baseline, em dash for delta. |
| P-E4 | Multiple tests in benchmark | Show separate PROOF screen for each test sequentially. |
| P-E5 | Delta is exactly zero | Display "(0)" not "(+0)" or "(−0)". |
| P-E6 | User dismisses without reading | Allow dismiss. Do not require scroll or timer. |

---

## Screen: TRAJECTORY

**Responsibility:** Provide historical view of test results without interpretation.

### The screen MUST:

| ID | Criterion | Verification |
|----|-----------|--------------|
| T-01 | Display "Historikk" as screen title | Verify exact text |
| T-02 | Display total test count "X tester registrert" | Verify format |
| T-03 | Display category filter chips (Alle, Putting, Langspill, etc.) | Verify chips present |
| T-04 | "Alle" filter selected by default | Verify default state |
| T-05 | Display tests grouped by benchmark date | Verify grouping |
| T-06 | Display date headers in "18. DESEMBER 2025" format (uppercase) | Verify format |
| T-07 | Display test name for each result | Verify text present |
| T-08 | Display test value for each result | Verify number present |
| T-09 | Display baseline reference for each result "Baseline: X" | Verify format |
| T-10 | Display delta for each result "(+X)" or "(−X)" | Verify format |
| T-11 | Order chronologically, most recent first | Verify order |
| T-12 | Tap on test card navigates to PROOF view for that test | Verify navigation |
| T-13 | Filter selection filters list immediately | Verify filtering works |

### The screen MUST NOT:

| ID | Criterion | Verification |
|----|-----------|--------------|
| T-50 | Display trend lines or charts | Visual inspection |
| T-51 | Display trend arrows (↑ ↓) | Visual inspection |
| T-52 | Display text containing "improving", "declining", or "trend" | Text search |
| T-53 | Display text containing "on track" or "på sporet" | Text search |
| T-54 | Display predictions or "at this rate" language | Text search |
| T-55 | Display averages or "gjennomsnitt" | Text search |
| T-56 | Display "best" or "worst" markers | Visual inspection |
| T-57 | Display effort hours or training data | Visual inspection |
| T-58 | Display goal progress | Visual inspection |
| T-59 | Display comparison to other users | Visual inspection |
| T-60 | Use green color for positive deltas | Color inspection |
| T-61 | Use red color for negative deltas | Color inspection |
| T-62 | Display gamification elements | Visual inspection |

### Edge cases:

| ID | Case | Required Behavior |
|----|------|-------------------|
| T-E1 | No tests registered | Display "Ingen tester registrert" centered. |
| T-E2 | Category filter has no results | Display "Ingen tester i denne kategorien". |
| T-E3 | Single test registered | Display normally with "Første registrerte test" note. |
| T-E4 | Baseline not set for specific test | Display "Baseline: Ikke satt" and "(—)" for delta. |
| T-E5 | Very long history (50+ tests) | Paginate or lazy-load. Maintain performance. |

---

# PART 2 — Global Design Invariants

These rules apply to ALL screens. Violations on any screen fail the contract.

---

## Language Invariants

| ID | Invariant | Verification |
|----|-----------|--------------|
| G-L1 | No screen may contain the word "progress" or "fremgang" | Global text search |
| G-L2 | No screen may contain the word "improvement" or "forbedring" | Global text search |
| G-L3 | No screen may contain "keep it up", "fortsett sånn", "keep going" | Global text search |
| G-L4 | No screen may contain "great", "flott", "awesome", "amazing" as feedback | Global text search |
| G-L5 | No screen may contain "unfortunately", "dessverre", "sorry" as feedback | Global text search |
| G-L6 | No screen may contain "goal" or "mål" except in user-defined goal contexts | Global text search |
| G-L7 | No screen may contain predictions about future performance | Manual review |
| G-L8 | No screen may contain recommendations unless explicitly requested by user | Manual review |

---

## Visual Invariants

| ID | Invariant | Verification |
|----|-----------|--------------|
| G-V1 | Green (#4A7C59 or similar) never used to indicate "good" or "positive" change | Global color audit |
| G-V2 | Red (#C45B4E or similar) never used to indicate "bad" or "negative" change | Global color audit |
| G-V3 | No confetti, stars, sparkles, or celebration graphics | Visual inspection |
| G-V4 | No sad faces, frowns, or consolation graphics | Visual inspection |
| G-V5 | No trend arrows (↑ ↓ →) indicating direction | Visual inspection |
| G-V6 | No progress bars toward goals on any screen except explicitly designed goal features | Visual inspection |
| G-V7 | Emoji only used in REFLECTION input scales, never as feedback | Emoji audit |

---

## Gamification Invariants

| ID | Invariant | Verification |
|----|-----------|--------------|
| G-G1 | No XP, experience points, or "erfaring" displayed anywhere | Text search + visual |
| G-G2 | No levels, ranks, or tier indicators displayed | Visual inspection |
| G-G3 | No badges or achievements displayed on core screens | Visual inspection |
| G-G4 | No streak counters or "X days in a row" displayed | Text search |
| G-G5 | No leaderboards or ranking comparisons | Visual inspection |
| G-G6 | No points, coins, or virtual currency | Visual inspection |
| G-G7 | No "unlock" or "achievement unlocked" notifications on core screens | Text search |

---

## Data Invariants

| ID | Invariant | Verification |
|----|-----------|--------------|
| G-D1 | Effort data (hours, sessions) never displayed on PROOF screen | Visual inspection |
| G-D2 | Outcome data (test results) never displayed on SESSION screen | Visual inspection |
| G-D3 | Comparison to other users never displayed on any screen | Visual inspection |
| G-D4 | Baseline value immutable after confirmation | Database/API verification |
| G-D5 | Delta always calculated as (Current - Baseline), never estimated | Calculation verification |
| G-D6 | All times displayed in user's local timezone | Timezone verification |

---

## Trust Invariants

| ID | Invariant | Verification |
|----|-----------|--------------|
| G-T1 | PROOF screen layout identical for positive and negative results | Compare screenshots |
| G-T2 | No screen interprets causality ("because you trained X") | Text search |
| G-T3 | No screen predicts future outcomes | Text search |
| G-T4 | No screen judges user performance as "good" or "bad" | Text search + manual |
| G-T5 | Missing data shown as "—" (em dash), never hidden or estimated | Visual inspection |
| G-T6 | Error states shown factually, never apologetically | Text review |

---

# PART 3 — QA Verification Checklist

For each release, QA must verify:

## Per-Screen Verification

```
[ ] SESSION: All MUST criteria (S-01 to S-17)
[ ] SESSION: All MUST NOT criteria (S-50 to S-63)
[ ] SESSION: All edge cases (S-E1 to S-E6)

[ ] REFLECTION: All MUST criteria (R-01 to R-13)
[ ] REFLECTION: All MUST NOT criteria (R-50 to R-59)
[ ] REFLECTION: All edge cases (R-E1 to R-E5)

[ ] HOME: All MUST criteria (H-01 to H-14)
[ ] HOME: All MUST NOT criteria (H-50 to H-63)
[ ] HOME: All edge cases (H-E1 to H-E6)

[ ] BASELINE: All MUST criteria (B-01 to B-12)
[ ] BASELINE: All MUST NOT criteria (B-50 to B-60)
[ ] BASELINE: All edge cases (B-E1 to B-E6)

[ ] PROOF: All MUST criteria (P-01 to P-12)
[ ] PROOF: All MUST NOT criteria (P-50 to P-63)
[ ] PROOF: All edge cases (P-E1 to P-E6)

[ ] TRAJECTORY: All MUST criteria (T-01 to T-13)
[ ] TRAJECTORY: All MUST NOT criteria (T-50 to T-62)
[ ] TRAJECTORY: All edge cases (T-E1 to T-E5)
```

## Global Verification

```
[ ] Language invariants (G-L1 to G-L8)
[ ] Visual invariants (G-V1 to G-V7)
[ ] Gamification invariants (G-G1 to G-G7)
[ ] Data invariants (G-D1 to G-D6)
[ ] Trust invariants (G-T1 to G-T6)
```

---

# PART 4 — Regression Prevention

## Automated Checks (CI)

The following should be automated in CI pipeline:

```javascript
// Text content checks
const FORBIDDEN_STRINGS = [
  'progress', 'fremgang',
  'improvement', 'forbedring',
  'keep it up', 'fortsett sånn',
  'great job', 'flott',
  'unfortunately', 'dessverre',
  'on track', 'på sporet',
  'streak', 'XP', 'level',
  'achievement unlocked'
];

// Color checks
const FORBIDDEN_FEEDBACK_COLORS = [
  '#4A7C59', // success green
  '#C45B4E', // error red
];

// Component checks
const FORBIDDEN_IN_CORE_SCREENS = [
  'StreakCounter',
  'XPDisplay',
  'BadgeList',
  'ProgressBar', // in goal context
  'TrendArrow',
  'CelebrationAnimation'
];
```

## Manual Review Gates

Before merge to main:
1. Screenshot comparison: PROOF screen with positive vs negative result
2. Language review: New copy checked against forbidden list
3. Color audit: No semantic green/red usage

---

**Contract signed by implementation of this document.**

*Any violation of MUST or MUST NOT criteria constitutes a release blocker.*
*Any violation of Global Invariants constitutes a release blocker.*
