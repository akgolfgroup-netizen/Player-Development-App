# UI Design: REFLECTION Screen

**Responsibility:** Capture post-session facts and subjective input without evaluating progress or improvement.
**Platform:** iPhone-first (375pt width)
**Context:** Calm mental state after training, low cognitive load, honest self-reporting

---

## 1. Screen Layout Structure

Three regions. Vertically scrollable. No time pressure.

```
┌─────────────────────────────────────┐
│           SESSION HEADER            │  ← Region 1 (fixed, 80pt)
├─────────────────────────────────────┤
│                                     │
│                                     │
│           INPUT SECTIONS            │  ← Region 2 (scrollable)
│                                     │
│                                     │
│                                     │
├─────────────────────────────────────┤
│           SUBMIT BAR                │  ← Region 3 (fixed, 88pt)
└─────────────────────────────────────┘
```

---

### Region 1: SESSION HEADER (Fixed, 80pt)

**Contains:**
- Session title (what was trained)
- Factual summary: blocks, reps, duration
- No evaluation, no score

**Layout:**
```
┌─────────────────────────────────────┐
│  ←  Refleksjon                      │
│                                     │
│     Putting · 8 blokker · 1t 47min  │
└─────────────────────────────────────┘
```

**Typography:**
- Title: `--text-headline` (17pt), `--ak-charcoal`
- Summary: `--text-subhead` (15pt), `--ak-steel`

**Background:** `--ak-white`

**Purpose:** Remind user what they just did. No judgment.

---

### Region 2: INPUT SECTIONS (Scrollable)

Five input sections, vertically stacked. Each section is optional.

```
┌─────────────────────────────────────┐
│  A. BODY STATE                      │
│     [Physical input]                │
├─────────────────────────────────────┤
│  B. MIND STATE                      │
│     [Mental input]                  │
├─────────────────────────────────────┤
│  C. SLEEP                           │
│     [Sleep data]                    │
├─────────────────────────────────────┤
│  D. SESSION NOTES                   │
│     [Free text]                     │
├─────────────────────────────────────┤
│  E. TOMORROW                        │
│     [Free text]                     │
└─────────────────────────────────────┘
```

**Section spacing:** `--spacing-lg` (24pt) between sections
**Section background:** `--ak-white` cards on `--ak-snow` page background

---

### Region 3: SUBMIT BAR (Fixed, 88pt)

**Contains:**
- Primary: "Lagre" button (full width)
- Secondary: "Hopp over" text link

**Layout:**
```
┌─────────────────────────────────────┐
│     ┌───────────────────────┐       │
│     │        Lagre          │       │
│     └───────────────────────┘       │
│            Hopp over                │
└─────────────────────────────────────┘
```

**Background:** `--ak-white` with subtle top border
**Button:** `--ak-primary`, 56pt height
**Skip link:** `--ak-steel`, centered below

---

## 2. Visual Hierarchy

```
1st  ████████████████████████  INPUT FIELDS (interactive focus)
2nd  ████████████             SECTION LABELS (orientation)
3rd  ████████                 SESSION HEADER (context)
4th  ████                     SUBMIT BAR (completion)
```

**Hierarchy logic:**

| Priority | Element | Why |
|----------|---------|-----|
| 1st | Input fields | User's task is to provide input |
| 2nd | Section labels | Tell user what kind of input is expected |
| 3rd | Session header | Minimal context—what was trained |
| 4th | Submit bar | Available but not dominant |

**Design principle:** The screen is a form. Forms are filled top-to-bottom. Nothing competes for attention.

---

## 3. Input Elements

### Section A: BODY STATE

**Purpose:** Capture physical state after training.

**Input type:** 5-point scale (emoji-based, no numbers)

```
Hvordan føles kroppen?

😫    😕    😐    🙂    💪
Sliten      Nøytral      Energisk
```

**Implementation:**
- 5 tappable options
- Single select
- No default selection
- Optional (can skip)

**Microcopy:**
- Label: "Hvordan føles kroppen?"
- Scale anchors: "Sliten" (left), "Nøytral" (center), "Energisk" (right)

---

### Section B: MIND STATE

**Purpose:** Capture mental state after training.

**Input type:** 5-point scale (emoji-based)

```
Hvordan føles hodet?

😤    😔    😐    😊    😌
Frustrert   Nøytral      Fokusert
```

**Implementation:**
- 5 tappable options
- Single select
- No default selection
- Optional

**Microcopy:**
- Label: "Hvordan føles hodet?"
- Scale anchors: "Frustrert" (left), "Nøytral" (center), "Fokusert" (right)

---

### Section C: SLEEP (Context Data)

**Purpose:** Capture sleep as context for session quality.

**Input type:** Two inputs

```
Søvn i natt

Timer:  [ 5 ] [ 6 ] [ 7 ] [ 8 ] [ 9+ ]

Kvalitet:
😴    😐    😊
Dårlig  Ok   God
```

**Implementation:**
- Hours: Segmented control (5, 6, 7, 8, 9+)
- Quality: 3-point scale
- Both optional

**Microcopy:**
- Label: "Søvn i natt"
- Hours label: "Timer"
- Quality label: "Kvalitet"
- Quality anchors: "Dårlig", "Ok", "God"

---

### Section D: SESSION NOTES

**Purpose:** Capture observations about the session.

**Input type:** Free text, multi-line

```
Notater fra økten

┌─────────────────────────────────────┐
│                                     │
│  Placeholder: Hva la du merke til?  │
│                                     │
│                                     │
└─────────────────────────────────────┘
```

**Implementation:**
- Text area, 4 lines minimum height
- Expandable as user types
- No character limit displayed
- Optional

**Microcopy:**
- Label: "Notater fra økten"
- Placeholder: "Hva la du merke til?"

---

### Section E: TOMORROW

**Purpose:** Capture intention for next session.

**Input type:** Free text, single line

```
Til neste økt

┌─────────────────────────────────────┐
│  Placeholder: Hva vil du fokusere   │
│  på neste gang?                     │
└─────────────────────────────────────┘
```

**Implementation:**
- Text input, 2 lines
- Optional

**Microcopy:**
- Label: "Til neste økt"
- Placeholder: "Hva vil du fokusere på neste gang?"

---

## 4. Microcopy Reference

### Allowed (Neutral, Descriptive)

| Element | Microcopy |
|---------|-----------|
| Screen title | "Refleksjon" |
| Session summary | "Putting · 8 blokker · 1t 47min" |
| Body state label | "Hvordan føles kroppen?" |
| Body anchors | "Sliten" / "Nøytral" / "Energisk" |
| Mind state label | "Hvordan føles hodet?" |
| Mind anchors | "Frustrert" / "Nøytral" / "Fokusert" |
| Sleep label | "Søvn i natt" |
| Sleep hours | "Timer" |
| Sleep quality | "Kvalitet" |
| Sleep anchors | "Dårlig" / "Ok" / "God" |
| Notes label | "Notater fra økten" |
| Notes placeholder | "Hva la du merke til?" |
| Tomorrow label | "Til neste økt" |
| Tomorrow placeholder | "Hva vil du fokusere på neste gang?" |
| Submit button | "Lagre" |
| Skip link | "Hopp over" |

### Forbidden (Breaks Screen Responsibility)

| Forbidden | Category |
|-----------|----------|
| "Great session!" | Encouragement |
| "How did you improve?" | Improvement framing |
| "Better than last time?" | Comparison |
| "Rate your progress" | Progress framing |
| "You're getting stronger!" | Evaluation |
| "Achievement unlocked!" | Gamification |
| "Streak continued!" | Gamification |
| "Session score: 8/10" | Judgment |
| "You trained 20% more than average" | Comparison |
| "Goal progress: 75%" | Goal reference |
| "Next benchmark in 5 days" | Benchmark reference |
| "This will improve your putting" | Outcome claim |
| "Well done!" | Encouragement |
| "Keep it up!" | Motivation |

---

## 5. What This Screen Does NOT Show

### Explicit Exclusions

| Excluded Element | Reason |
|------------------|--------|
| Session "score" or "grade" | Reflection is input, not judgment |
| Progress toward goals | Goals belong to PROOF/TRAJECTORY |
| Benchmark countdown | Benchmarks belong elsewhere |
| Comparison to past sessions | Would bias honest reporting |
| Comparison to other users | Social excluded |
| "Improvement" language | Cannot prove improvement from one session |
| XP / points / badges | Gamification excluded |
| Streak information | Gamification excluded |
| Coach feedback | Separate concern |
| Recommendations | Would frame as judgment |
| "You should..." suggestions | Prescriptive language excluded |
| Performance metrics | Belongs to PROOF |
| Charts or graphs | Visual comparison excluded |
| Rep totals compared to target | Would imply success/failure |
| Time efficiency analysis | Would imply judgment |

### Why These Exclusions

The REFLECTION screen answers ONE question:

> **"How do I feel and what did I notice?"**

This is self-reporting, not self-evaluation.

The user should feel safe to report honestly:
- "I felt tired" (not "I underperformed")
- "I was frustrated" (not "I failed")
- "I slept poorly" (not "that's why I was bad")

**Honest data requires judgment-free input.**

If the screen showed "you did better than last time," users would start performing for the metric instead of reporting truthfully.

---

## 6. Interaction Flow

### Flow: Complete Reflection

```
1. User arrives from SESSION COMPLETE
2. Screen shows session header (context)
3. User scrolls through input sections
4. User optionally fills each section
5. User taps "Lagre"
6. Data saved → navigate to HOME
```

### Flow: Skip Reflection

```
1. User arrives from SESSION COMPLETE
2. User taps "Hopp over"
3. Confirmation: "Hopp over refleksjon?"
   - "Ja, hopp over" → navigate to HOME
   - "Nei, gå tilbake" → return to form
4. No data saved
```

### Input Behavior

| Input | Behavior |
|-------|----------|
| Emoji scales | Tap to select, tap again to deselect |
| Segmented control | Tap to select, always one selected once chosen |
| Text fields | Tap to focus, keyboard appears |
| Submit | Saves all filled fields, ignores empty |

---

## 7. Visual Design Details

### Card Style

Each input section is a card:
- Background: `--ak-white`
- Border radius: `--radius-md` (12pt)
- Shadow: `--shadow-card`
- Padding: `--spacing-md` (16pt)

### Emoji Scale Style

```
┌─────────────────────────────────────┐
│                                     │
│   😫    😕    😐    🙂    💪        │
│                                     │
│   ○     ○     ○     ○     ●        │  ← selection indicator
│                                     │
│ Sliten       Nøytral      Energisk │
│                                     │
└─────────────────────────────────────┘
```

- Emoji size: 32pt
- Tap target: 64pt × 64pt per emoji
- Selected state: Dot indicator below, subtle scale animation
- Unselected: No indicator

### Text Input Style

- Border: 1px `--ak-mist`
- Border radius: `--radius-sm` (8pt)
- Padding: `--spacing-md` (16pt)
- Placeholder: `--ak-steel`
- Input text: `--ak-charcoal`
- Focus state: Border becomes `--ak-primary`

### Page Background

- Background: `--ak-snow`
- Creates visual separation between cards

---

## 8. Accessibility

### Touch Targets

| Element | Size |
|---------|------|
| Emoji options | 64pt × 64pt |
| Segmented control options | 56pt × 44pt |
| Text inputs | Full width × 48pt minimum |
| Submit button | Full width × 56pt |
| Skip link | 44pt tap area |

### Screen Reader

| Element | Announcement |
|---------|--------------|
| Body state | "Hvordan føles kroppen? Velg fra sliten til energisk. 5 valg." |
| Selected emoji | "Energisk, valgt" |
| Text input | "Notater fra økten. Tekstfelt. Hva la du merke til?" |

### Color Independence

- Selection state indicated by both color AND indicator dot
- Emoji meaning not dependent on color
- Text labels provide meaning independent of emoji

---

## 9. Summary

| Aspect | Design Decision |
|--------|-----------------|
| **Primary task** | Provide subjective input about session |
| **Input types** | Emoji scales (5-point), segmented control, free text |
| **All inputs** | Optional — user can submit partial or skip entirely |
| **Tone** | Neutral, descriptive, non-judgmental |
| **Cognitive load** | Low — simple choices, no calculations |
| **Time pressure** | None — user controls pace |
| **Excluded** | Progress, comparison, evaluation, gamification, goals |

---

## 10. Component Mapping (Existing Codebase)

| Element | Existing Component | File |
|---------|-------------------|------|
| Full screen | `SessionReflectionForm` | `/features/sessions/SessionReflectionForm.jsx` |
| Emoji scale | Custom (may need creation) | — |
| Text input | Standard form input | — |

**Current implementation note:** Existing component captures mental/physical state, sleep, and notes. Review for compliance with microcopy rules and exclusion list. May need adjustment to remove any evaluative language.

---

*Design complete. Input-focused. Judgment-free.*
