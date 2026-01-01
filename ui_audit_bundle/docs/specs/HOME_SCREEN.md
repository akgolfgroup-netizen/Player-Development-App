# UI Design: HOME Screen

**Responsibility:** Orient the user in the training journey and point to the next correct action.
**Platform:** iPhone-first (375pt width)
**Context:** Daily return visits, calm authority, clarity in < 3 seconds

---

## 1. Screen Layout Structure

Four regions. No scroll required for primary information. Secondary content below fold.

```
┌─────────────────────────────────────┐
│           IDENTITY BAR              │  ← Region 1 (56pt)
├─────────────────────────────────────┤
│                                     │
│           NEXT ACTION               │  ← Region 2 (200pt)
│                                     │
├─────────────────────────────────────┤
│           TIME CONTEXT              │  ← Region 3 (120pt)
├─────────────────────────────────────┤
│                                     │
│        EFFORT ACCUMULATION          │  ← Region 4 (scrollable)
│                                     │
└─────────────────────────────────────┘
```

---

### Region 1: IDENTITY BAR (Fixed, 56pt)

**Contains:**
- User first name (left)
- Current date (right)
- No avatar, no level, no badges

**Layout:**
```
┌─────────────────────────────────────┐
│  Anders                  Ons 18 des │
└─────────────────────────────────────┘
```

**Typography:**
- Name: `--text-headline` (17pt), `--ak-charcoal`
- Date: `--text-subhead` (15pt), `--ak-steel`

**Background:** `--ak-white`

**Purpose:** Confirm identity. Establish today. Nothing more.

---

### Region 2: NEXT ACTION (200pt)

**Contains:**
- What to do next (primary)
- When (secondary)
- Where (tertiary)
- Single tappable card

**Layout:**
```
┌─────────────────────────────────────┐
│                                     │
│  NESTE                              │
│                                     │
│  Putting                            │
│  Lag-kontroll drill                 │
│                                     │
│  14:00 · Innendørshall · 90 min     │
│                                     │
│           [ Start ]                 │
│                                     │
└─────────────────────────────────────┘
```

**Typography:**
- Label: `--text-footnote` (13pt), `--ak-steel`, uppercase
- Training area: `--text-title-2` (22pt), `--ak-charcoal`
- Session name: `--text-body` (17pt), `--ak-charcoal`
- Details: `--text-subhead` (15pt), `--ak-steel`
- Button: `--text-headline` (17pt), `--ak-white` on `--ak-primary`

**Background:** `--ak-white` card on `--ak-snow` page
**Border radius:** `--radius-lg` (16pt)
**Shadow:** `--shadow-elevated`

**Purpose:** Answer "What do I do next?" in one glance.

**Empty state (no session today):**
```
┌─────────────────────────────────────┐
│                                     │
│  I DAG                              │
│                                     │
│  Ingen økt planlagt                 │
│                                     │
│  Neste økt: Fredag 20 des           │
│                                     │
└─────────────────────────────────────┘
```

---

### Region 3: TIME CONTEXT (120pt)

**Contains:**
- Days until next benchmark
- Days until next event (if applicable)
- Simple countdown, no evaluation

**Layout:**
```
┌─────────────────────────────────────┐
│                                     │
│  ┌─────────────┐  ┌─────────────┐   │
│  │  12 dager   │  │  28 dager   │   │
│  │  til test   │  │  til NM     │   │
│  └─────────────┘  └─────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

**Typography:**
- Number: `--text-title-1` (28pt), `--ak-charcoal`
- Label: `--text-caption-1` (12pt), `--ak-steel`

**Background:** Two cards, side by side, `--ak-surface`

**Purpose:** Temporal orientation. "Where am I in the calendar?"

**Not shown:**
- "Are you ready?"
- "Time to prepare!"
- Progress toward benchmark
- Predictions

---

### Region 4: EFFORT ACCUMULATION (Scrollable)

**Contains:**
- Training since last benchmark (hours, sessions)
- Breakdown by area (optional expansion)
- Link to full history

**Layout:**
```
┌─────────────────────────────────────┐
│                                     │
│  SIDEN SISTE TEST                   │
│                                     │
│  24 timer · 18 økter                │
│                                     │
│  Putting      8t                    │
│  Langspill    6t                    │
│  Kortspill    5t                    │
│  Innspill     3t                    │
│  Fysisk       2t                    │
│                                     │
│  Se all historikk →                 │
│                                     │
└─────────────────────────────────────┘
```

**Typography:**
- Section label: `--text-footnote` (13pt), `--ak-steel`, uppercase
- Total: `--text-headline` (17pt), `--ak-charcoal`
- Breakdown: `--text-body` (17pt), `--ak-charcoal` (area), `--ak-steel` (hours)
- Link: `--text-subhead` (15pt), `--ak-primary`

**Background:** `--ak-white` card

**Purpose:** Show accumulated effort without interpreting it.

---

## 2. Visual Hierarchy

```
1st  ████████████████████████  NEXT ACTION (largest, center)
2nd  ████████████             TIME CONTEXT (countdowns)
3rd  ████████                 EFFORT ACCUMULATION (below fold)
4th  ████                     IDENTITY BAR (peripheral)
```

**Hierarchy logic:**

| Priority | Element | Why |
|----------|---------|-----|
| 1st | Next action | Answers the primary question: "What do I do?" |
| 2nd | Time context | Orientation: "Where am I in the schedule?" |
| 3rd | Effort accumulation | Secondary: "What have I done?" |
| 4th | Identity bar | Ambient context, not primary focus |

**3-second rule:** User glances at screen, sees next session, knows what to do. Done.

---

## 3. Allowed Information

| Information | Why Allowed |
|-------------|-------------|
| User first name | Identity confirmation |
| Current date | Temporal context |
| Next session details | Primary action orientation |
| Session time, location, duration | Logistics |
| Days until next benchmark | Calendar orientation (not readiness) |
| Days until next event | Calendar orientation |
| Hours trained since last benchmark | Effort fact (not interpretation) |
| Sessions completed since last benchmark | Effort fact |
| Breakdown by training area | Effort distribution (not balance judgment) |
| Link to history | Navigation |

---

## 4. Forbidden Information

| Information | Why Forbidden |
|-------------|---------------|
| "You're improving!" | Outcome claim without proof |
| "Great progress!" | Progress evaluation |
| "Keep it up!" | Encouragement |
| "On track" / "Behind" | Progress judgment |
| Test scores | Belongs to PROOF screen |
| Benchmark results | Belongs to PROOF screen |
| Goal progress percentage | Goals belong to TRAJECTORY |
| Comparison to last period | Evaluation |
| Comparison to other users | Social excluded |
| XP / level / badges | Gamification excluded |
| Streaks | Gamification excluded |
| "You should train more X" | Prescriptive advice |
| "Recommended for you" | Algorithmic suggestion |
| Coach messages | Separate concern (notifications) |
| Motivational quotes | Encouragement excluded |
| Weather | Irrelevant to responsibility |
| News / updates | Distraction |

---

## 5. Microcopy Reference

### Allowed (Neutral, Directional)

| Element | Microcopy |
|---------|-----------|
| Section label (next) | "NESTE" |
| Section label (today) | "I DAG" |
| Section label (effort) | "SIDEN SISTE TEST" |
| No session | "Ingen økt planlagt" |
| Next session | "Neste økt: Fredag 20 des" |
| Time details | "14:00 · Innendørshall · 90 min" |
| Countdown | "12 dager til test" |
| Countdown | "28 dager til NM" |
| Effort summary | "24 timer · 18 økter" |
| Area breakdown | "Putting 8t" |
| History link | "Se all historikk →" |
| Start button | "Start" |

### Forbidden (Breaks Screen Responsibility)

| Forbidden | Category |
|-----------|----------|
| "Ready for today?" | Encouragement |
| "Let's go!" | Motivation |
| "You've got this!" | Encouragement |
| "Great week so far!" | Evaluation |
| "Almost at your goal!" | Progress judgment |
| "Time to train!" | Motivation |
| "Your progress: 75%" | Progress display |
| "Improvement: +12%" | Outcome display |
| "Better than last week" | Comparison |
| "Recommended: more putting" | Advice |
| "Coach says:" | Separate concern |
| "Achievement unlocked!" | Gamification |
| "Day 7 streak 🔥" | Gamification |

---

## 6. Question Framework

### What This Screen Answers

> **"What do I do next?"**

Primary question. Answered by NEXT ACTION region.

> **"When is my next benchmark?"**

Secondary question. Answered by TIME CONTEXT region.

> **"What have I done since last benchmark?"**

Tertiary question. Answered by EFFORT ACCUMULATION region.

### What This Screen Must NOT Answer

| Question | Why Not | Where It Belongs |
|----------|---------|------------------|
| "Am I improving?" | Requires proof | PROOF screen |
| "Did my training work?" | Requires benchmark | PROOF screen |
| "Am I on track?" | Requires judgment | Not answered anywhere until PROOF |
| "How do I compare?" | Excluded entirely | Nowhere |
| "What should I do differently?" | Requires analysis | Coach conversation |
| "Will I pass my test?" | Speculation | Not answered anywhere |

---

## 7. States

### State A: Session Today (Default)

```
┌─────────────────────────────────────┐
│  Anders                  Ons 18 des │
├─────────────────────────────────────┤
│                                     │
│  NESTE                              │
│                                     │
│  Putting                            │
│  Lag-kontroll drill                 │
│                                     │
│  14:00 · Innendørshall · 90 min     │
│                                     │
│           [ Start ]                 │
│                                     │
├─────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐   │
│  │  12 dager   │  │  28 dager   │   │
│  │  til test   │  │  til NM     │   │
│  └─────────────┘  └─────────────┘   │
├─────────────────────────────────────┤
│  SIDEN SISTE TEST                   │
│  24 timer · 18 økter                │
│  ...                                │
└─────────────────────────────────────┘
```

---

### State B: No Session Today

```
┌─────────────────────────────────────┐
│  Anders                  Ons 18 des │
├─────────────────────────────────────┤
│                                     │
│  I DAG                              │
│                                     │
│  Ingen økt planlagt                 │
│                                     │
│  Neste økt: Fredag 20 des           │
│  Putting · 14:00 · 90 min           │
│                                     │
├─────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐   │
│  │  12 dager   │  │  28 dager   │   │
│  │  til test   │  │  til NM     │   │
│  └─────────────┘  └─────────────┘   │
├─────────────────────────────────────┤
│  SIDEN SISTE TEST                   │
│  24 timer · 18 økter                │
│  ...                                │
└─────────────────────────────────────┘
```

**Key difference:** No "Start" button. Next session shown with future date.

---

### State C: Session In Progress

```
┌─────────────────────────────────────┐
│  Anders                  Ons 18 des │
├─────────────────────────────────────┤
│                                     │
│  PÅGÅR                              │
│                                     │
│  Putting                            │
│  Lag-kontroll drill                 │
│                                     │
│  Startet 14:00 · Blokk 3 av 8       │
│                                     │
│         [ Fortsett ]                │
│                                     │
├─────────────────────────────────────┤
│  ...                                │
└─────────────────────────────────────┘
```

**Key difference:** Label changes to "PÅGÅR", button to "Fortsett", shows current progress position.

---

### State D: Before First Benchmark

```
┌─────────────────────────────────────┐
│  Anders                  Ons 18 des │
├─────────────────────────────────────┤
│  ...next action...                  │
├─────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐   │
│  │  12 dager   │  │     —       │   │
│  │  til test   │  │             │   │
│  └─────────────┘  └─────────────┘   │
├─────────────────────────────────────┤
│  SIDEN START                        │
│  24 timer · 18 økter                │
│                                     │
│  Første test om 12 dager            │
│  ...                                │
└─────────────────────────────────────┘
```

**Key difference:** Effort label changes to "SIDEN START", note about first test.

---

## 8. Design Tokens

```
Colors:
--ak-primary       Buttons, links
--ak-charcoal      Primary text
--ak-steel         Secondary text, labels
--ak-white         Card backgrounds
--ak-snow          Page background
--ak-surface       Countdown cards

Typography:
--text-title-1     Countdown numbers (28pt)
--text-title-2     Session training area (22pt)
--text-headline    Name, totals (17pt)
--text-body        Session details (17pt)
--text-subhead     Date, secondary info (15pt)
--text-footnote    Section labels (13pt)
--text-caption-1   Countdown labels (12pt)

Spacing:
--spacing-md       16pt (card padding)
--spacing-lg       24pt (section gaps)

Radius:
--radius-lg        16pt (main card)
--radius-md        12pt (countdown cards)

Shadows:
--shadow-elevated  Next action card
--shadow-card      Other cards
```

---

## 9. Summary

| Aspect | Design Decision |
|--------|-----------------|
| **Primary element** | Next action card (what to do) |
| **Secondary element** | Time context (when is benchmark) |
| **Tertiary element** | Effort accumulation (what I've done) |
| **3-second test** | Glance → see next session → know what to do |
| **Tone** | Calm, factual, directional |
| **Excluded** | Progress, outcomes, evaluation, encouragement, gamification |
| **Question answered** | "What do I do next?" |
| **Question NOT answered** | "Am I improving?" |

---

## 10. Component Mapping (Existing Codebase)

| Element | Existing Component | File |
|---------|-------------------|------|
| Full screen | `AKGolfDashboard` | `/features/dashboard/AKGolfDashboard.jsx` |
| Mobile variant | `MobileHome` | `/mobile/MobileHome.jsx` |
| Container | `DashboardContainer` | `/features/dashboard/DashboardContainer.jsx` |

**Current implementation note:** Existing dashboard contains gamification (XP, badges, streaks), progress widgets, and motivational elements. These must be removed or relocated to comply with screen responsibility. The NEXT ACTION pattern should become dominant.

---

*Design complete. Orientation-focused. Judgment-free.*
