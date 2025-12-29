# UI Design: SESSION Screen

**Responsibility:** Support execution of the current training session without distraction.
**Platform:** iPhone-first (375pt width)
**Context:** Outdoor use, one-handed operation, high focus / low cognition

---

## 1. Screen Layout Structure

Four regions. Vertically stacked. No scrolling during active state.

```
┌─────────────────────────────────────┐
│                                     │
│           TIME DISPLAY              │  ← Region 1 (20%)
│                                     │
├─────────────────────────────────────┤
│                                     │
│           WHAT TO DO                │  ← Region 2 (25%)
│                                     │
├─────────────────────────────────────┤
│                                     │
│                                     │
│           REP COUNTER               │  ← Region 3 (40%)
│                                     │
│                                     │
├─────────────────────────────────────┤
│          BLOCK POSITION             │  ← Region 4 (15%)
└─────────────────────────────────────┘
```

### Region 1: TIME DISPLAY (Top 20%)

**Contains:**
- Session elapsed time (large): `01:23:45`
- Block remaining time (small): `4:32 igjen`

**Design rationale:**
- Glanceable from arm's length
- High contrast for outdoor visibility
- No interpretation needed

**Background:** `--ak-primary`
**Text:** `--ak-white`

---

### Region 2: WHAT TO DO (25%)

**Contains:**
- Training area label: `PUTTING`
- Exercise name: `Lag-kontroll`
- Target reps: `40 reps`
- Instructions toggle (collapsed default)

**Design rationale:**
- Answers "what am I doing?" in under 1 second
- Area label provides category context
- Instructions available but not forced

**Background:** `--ak-white`
**Text:** `--ak-charcoal` (primary), `--ak-steel` (secondary)

---

### Region 3: REP COUNTER (Center 40%)

**Contains:**
- Current rep count (oversized): `23`
- Decrement zone (left third of screen)
- Increment zone (right third of screen)
- Quick-add row: `+5` `+10`

**Layout:**
```
┌───────────┬───────────┬───────────┐
│           │           │           │
│    TAP    │    23     │    TAP    │
│    −1     │           │    +1     │
│           │           │           │
├───────────┴───────────┴───────────┤
│         +5          +10           │
└─────────────────────────────────────┘
```

**Design rationale:**
- Largest touch targets on screen (full-width zones)
- One-handed: thumb reaches entire width
- Outdoor: works with gloves, wet hands
- No precision needed—tap left = minus, tap right = plus

**Background:** `--ak-surface`
**Count text:** 72pt, `--ak-charcoal`, tabular figures
**Touch zones:** Full height of region, no visible button borders

---

### Region 4: BLOCK POSITION (Bottom 15%)

**Contains:**
- Position indicator: `Blokk 3 av 8`
- Pause button (right)
- Previous/Next navigation (when paused only)

**Design rationale:**
- Peripheral awareness of sequence
- Not visually dominant
- Pause accessible but not prominent

**Background:** `--ak-snow`
**Text:** `--text-footnote`, `--ak-steel`

---

## 2. Visual Hierarchy

```
1st  ████████████████████████  REP COUNT (72pt, center)
2nd  ████████████             SESSION TIME (34pt, top)
3rd  ████████                 EXERCISE NAME (22pt)
4th  ████                     BLOCK POSITION (13pt, bottom)
```

**Hierarchy logic:**

| Priority | Element | Why |
|----------|---------|-----|
| 1st | Rep count | Primary interaction. User looks here 80% of time. |
| 2nd | Session time | Orientation. "How long have I been training?" |
| 3rd | Exercise name | Context. "What am I doing?" |
| 4th | Block position | Peripheral. "Where am I in sequence?" |

**Outdoor visibility:**
- Rep count readable at 1.5m distance
- High contrast ratios throughout (>7:1)
- No thin fonts, no light grays on white

---

## 3. Interaction States

### State A: ACTIVE

Default state during training.

```
┌─────────────────────────────────────┐
│                                     │
│            01:23:45                 │
│            4:32 igjen               │
│                                     │
├─────────────────────────────────────┤
│           PUTTING                   │
│         Lag-kontroll                │
│            40 reps                  │
├─────────────────────────────────────┤
│                                     │
│    [  −  ]      23      [  +  ]     │
│                                     │
│           +5        +10             │
│                                     │
├─────────────────────────────────────┤
│  Blokk 3 av 8                   ⏸  │
└─────────────────────────────────────┘
```

**Interactions:**
- Tap left zone → decrement rep
- Tap right zone → increment rep
- Tap +5/+10 → quick add
- Tap ⏸ → enter paused state

**Feedback:**
- Rep count updates immediately
- Subtle haptic on tap (if available)
- No animation, no celebration

---

### State B: PAUSED

Overlay on active state. Session time frozen, pause timer running.

```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│              PAUSE                  │
│                                     │
│         Økt: 01:23:45               │
│        Pause: 00:01:34              │
│                                     │
│     ┌───────────────────────┐       │
│     │       Fortsett        │       │
│     └───────────────────────┘       │
│                                     │
│          Avslutt økt                │
│                                     │
│                                     │
└─────────────────────────────────────┘
```

**Background:** `--ak-charcoal` at 95% opacity
**Text:** `--ak-white`
**Button:** `--ak-primary` background, full width, 56pt height

**Interactions:**
- Tap "Fortsett" → return to active
- Tap "Avslutt økt" → end session confirmation

**Microcopy:**
- "PAUSE" — title
- "Økt: 01:23:45" — session time (frozen)
- "Pause: 00:01:34" — pause duration (counting)
- "Fortsett" — primary action
- "Avslutt økt" — secondary action (text link)

---

### State C: BLOCK COMPLETE

Transition between blocks. Auto-advances in 3 seconds or on tap.

```
┌─────────────────────────────────────┐
│                                     │
│            01:23:45                 │
│                                     │
├─────────────────────────────────────┤
│                                     │
│               ✓                     │
│                                     │
│         Blokk 3 fullført            │
│         23 repetisjoner             │
│                                     │
├─────────────────────────────────────┤
│                                     │
│     ┌───────────────────────┐       │
│     │      Neste blokk      │       │
│     └───────────────────────┘       │
│                                     │
├─────────────────────────────────────┤
│  ✓  ✓  ✓  ○  ○  ○  ○  ○            │
└─────────────────────────────────────┘
```

**Checkmark:** `--ak-success`, 48pt icon
**Auto-advance:** 3-second countdown, subtle indicator

**Microcopy:**
- "Blokk 3 fullført" — factual completion
- "23 repetisjoner" — actual count logged
- "Neste blokk" — action button

---

### State D: SESSION COMPLETE

Final state after last block.

```
┌─────────────────────────────────────┐
│                                     │
│            01:47:22                 │
│                                     │
├─────────────────────────────────────┤
│                                     │
│               ✓                     │
│                                     │
│          Økt fullført               │
│                                     │
│          8 blokker                  │
│       187 repetisjoner              │
│          1t 47min                   │
│                                     │
├─────────────────────────────────────┤
│                                     │
│     ┌───────────────────────┐       │
│     │        Fullfør        │       │
│     └───────────────────────┘       │
│                                     │
├─────────────────────────────────────┤
│  ✓  ✓  ✓  ✓  ✓  ✓  ✓  ✓            │
└─────────────────────────────────────┘
```

**Microcopy:**
- "Økt fullført" — factual completion
- "8 blokker" — count
- "187 repetisjoner" — total reps
- "1t 47min" — duration
- "Fullfør" — proceed to reflection

---

## 4. Microcopy Reference

### Allowed (Neutral, Factual)

| Element | Example |
|---------|---------|
| Session time | `01:23:45` |
| Block time | `4:32 igjen` |
| Training area | `PUTTING` |
| Exercise | `Lag-kontroll` |
| Rep target | `40 reps` |
| Rep count | `23` |
| Block position | `Blokk 3 av 8` |
| Block complete | `Blokk 3 fullført` |
| Rep summary | `23 repetisjoner` |
| Session complete | `Økt fullført` |
| Duration | `1t 47min` |
| Pause title | `PAUSE` |
| Resume | `Fortsett` |
| End session | `Avslutt økt` |
| Next block | `Neste blokk` |
| Finish | `Fullfør` |
| Instructions | `Vis instruksjoner` |

### Forbidden (Breaks Screen Responsibility)

| Forbidden | Category |
|-----------|----------|
| "Great job!" | Encouragement |
| "Keep going!" | Motivation |
| "Almost there!" | Progress framing |
| "You're crushing it!" | Evaluation |
| "Stay focused!" | Motivation |
| "This will improve your putting" | Outcome claim |
| "+10 XP" | Gamification |
| "New personal best!" | Gamification |
| "Streak: 7 days" | Gamification |
| "75% complete" | Progress (use "3 av 8" instead) |
| "Benchmark in 5 days" | Proof reference |
| "Goal: pass putting test" | Goal reference |

---

## 5. What This Screen Does NOT Show

### Explicit Exclusions

| Excluded Element | Reason |
|------------------|--------|
| Progress percentage | Frames session as progress; "3 av 8" is position, not progress |
| Goals | Goals belong to PROOF/TRAJECTORY |
| Benchmarks | Benchmarks belong to PROOF |
| Improvement language | Cannot prove improvement during session |
| Past session comparison | Distracts from current execution |
| XP / points / badges | Gamification excluded |
| Streak counter | Gamification excluded |
| Motivational quotes | SESSION is for execution |
| Coach messages | Show after session |
| Notifications | Distracting |
| Heart rate / biometrics | Separate concern |
| "How do you feel?" prompts | Belongs in REFLECTION |
| Tips or suggestions | Distracting |
| Other users' activity | Social excluded |
| Estimated calories | Out of scope |
| Weather | Out of scope |

### Why These Exclusions

The SESSION screen answers ONE question:

> **"What do I do now?"**

Any element that does not answer this question is excluded.

A user mid-rep should:
1. See the rep count
2. Tap to increment
3. Continue training

Cognitive load: **zero**.

---

## 6. One-Handed / Outdoor Considerations

### Touch Targets

| Element | Size | Rationale |
|---------|------|-----------|
| Rep increment zone | 50% screen width × 40% screen height | Thumb reaches from any grip |
| Rep decrement zone | 50% screen width × 40% screen height | Same |
| +5 / +10 buttons | 88pt × 44pt minimum | Works with gloves |
| Pause button | 44pt × 44pt | Standard minimum |

### Outdoor Visibility

| Element | Contrast Ratio | Notes |
|---------|----------------|-------|
| Rep count | >10:1 | Readable in direct sunlight |
| Session time | >7:1 | Glanceable |
| Exercise name | >7:1 | Quick identification |
| Block position | >4.5:1 | Peripheral, less critical |

### Glove-Friendly

- No swipe gestures required
- No precision taps required
- Full-region tap zones
- Large buttons (88pt minimum height for actions)

### Orientation Lock

- Portrait only
- No rotation during active session
- Prevents accidental landscape during movement

---

## 7. Summary

| Aspect | Design Decision |
|--------|-----------------|
| **Primary element** | Rep counter (72pt, center, full-width tap zones) |
| **Secondary element** | Session time (top, always visible) |
| **Tertiary element** | Exercise name (context) |
| **Peripheral element** | Block position (bottom, low emphasis) |
| **Interaction model** | Tap left = minus, tap right = plus |
| **Outdoor optimization** | High contrast, large type, no precision needed |
| **One-handed** | Thumb reaches all interactive areas |
| **Cognitive load** | Near zero—glance and tap |
| **Excluded** | Progress, goals, gamification, encouragement, outcomes |

---

*Design complete. Execution-focused. Distraction-free.*
