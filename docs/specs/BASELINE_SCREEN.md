# UI Design: BASELINE Screen

**Responsibility:** Establish a neutral, trustworthy reference point for future evaluation.
**Platform:** iPhone-first (375pt width)
**Context:** Serious tone, trust, precision. First meaningful interaction with the system.

---

## 1. Screen Layout Structure

Three-step flow. Each step is a full screen. No skip option.

```
STEP 1: CONTEXT           STEP 2: SELECTION         STEP 3: CONFIRMATION
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│                 │       │                 │       │                 │
│  Why baseline   │  →    │  Choose your    │  →    │  Confirm and    │
│  matters        │       │  baseline       │       │  understand     │
│                 │       │                 │       │                 │
└─────────────────┘       └─────────────────┘       └─────────────────┘
```

---

### Step 1: CONTEXT (Why Baseline Matters)

**Purpose:** Explain what a baseline is and why it matters, without promising outcomes.

**Layout:**
```
┌─────────────────────────────────────┐
│                                     │
│              ◎                      │  ← Simple icon (target/reference)
│                                     │
│         Ditt utgangspunkt           │
│                                     │
│  En baseline er referansepunktet    │
│  vi måler fra. Den sier ikke noe    │
│  om hvor du skal — bare hvor du     │
│  starter.                           │
│                                     │
│  Alt vi måler fremover blir         │
│  sammenlignet med dette punktet.    │
│                                     │
│                                     │
│                                     │
│     ┌───────────────────────┐       │
│     │       Fortsett        │       │
│     └───────────────────────┘       │
│                                     │
└─────────────────────────────────────┘
```

**Typography:**
- Icon: 48pt, `--ak-primary`
- Title: `--text-title-1` (28pt), `--ak-charcoal`
- Body: `--text-body` (17pt), `--ak-charcoal`, centered
- Button: `--text-headline` (17pt), `--ak-white` on `--ak-primary`

**Background:** `--ak-white`

---

### Step 2: SELECTION (Choose Baseline)

**Purpose:** Present baseline options with factual descriptions. No recommendation framing.

**Layout:**
```
┌─────────────────────────────────────┐
│  ←                        Steg 2/3  │
├─────────────────────────────────────┤
│                                     │
│         Velg utgangspunkt           │
│                                     │
│  Velg hvilken verdi som skal være   │
│  ditt referansepunkt.               │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐    │
│  │  Sesonggjennomsnitt         │    │
│  │                             │    │
│  │  78.4                       │    │
│  │                             │    │
│  │  Basert på 32 runder        │    │
│  │  fra hele sesongen          │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │  Siste 8 runder             │    │
│  │                             │    │
│  │  76.2                       │    │
│  │                             │    │
│  │  Basert på dine 8 siste     │    │
│  │  registrerte runder         │    │
│  └─────────────────────────────┘    │
│                                     │
│     ┌───────────────────────┐       │
│     │    Velg og fortsett   │       │
│     └───────────────────────┘       │
│                                     │
└─────────────────────────────────────┘
```

**Selection cards:**
- Unselected: `--ak-white` background, `--ak-mist` border
- Selected: `--ak-white` background, `--ak-primary` border (2pt), subtle `--ak-primary` tint

**Typography:**
- Option title: `--text-headline` (17pt), `--ak-charcoal`
- Value: `--text-large-title` (34pt), `--ak-charcoal`
- Description: `--text-subhead` (15pt), `--ak-steel`

---

### Step 3: CONFIRMATION (Understand Implications)

**Purpose:** Confirm selection and explain what baseline means for measurement — without promising improvement.

**Layout:**
```
┌─────────────────────────────────────┐
│  ←                        Steg 3/3  │
├─────────────────────────────────────┤
│                                     │
│         Bekreft utgangspunkt        │
│                                     │
│  ┌─────────────────────────────┐    │
│  │                             │    │
│  │  Din baseline               │    │
│  │                             │    │
│  │        76.2                 │    │
│  │                             │    │
│  │  Siste 8 runder             │    │
│  │                             │    │
│  └─────────────────────────────┘    │
│                                     │
│  Dette betyr:                       │
│                                     │
│  • Alle fremtidige målinger         │
│    sammenlignes med 76.2            │
│                                     │
│  • Hvis scoren din endres,          │
│    ser du endringen herfra          │
│                                     │
│  • Baseline kan ikke endres         │
│    etter at trening starter         │
│                                     │
│     ┌───────────────────────┐       │
│     │       Bekreft         │       │
│     └───────────────────────┘       │
│                                     │
│          Gå tilbake                 │
│                                     │
└─────────────────────────────────────┘
```

**Confirmation card:**
- Background: `--ak-surface`
- Border radius: `--radius-lg` (16pt)
- Value: `--text-large-title` (34pt), `--ak-primary`

**Bullet points:**
- Icon: Small dot, `--ak-charcoal`
- Text: `--text-body` (17pt), `--ak-charcoal`

---

## 2. Visual Hierarchy

```
STEP 1 (Context)
1st  ████████████████████████  TITLE ("Ditt utgangspunkt")
2nd  ████████████             EXPLANATION
3rd  ████████                 BUTTON

STEP 2 (Selection)
1st  ████████████████████████  OPTION VALUES (78.4, 76.2)
2nd  ████████████             OPTION TITLES
3rd  ████████                 DESCRIPTIONS
4th  ████                     BUTTON

STEP 3 (Confirmation)
1st  ████████████████████████  CONFIRMED VALUE (76.2)
2nd  ████████████             IMPLICATIONS LIST
3rd  ████████                 BUTTON
```

**Hierarchy logic:**

| Priority | Element | Why |
|----------|---------|-----|
| 1st | The number | Baseline is a number. The number is the point. |
| 2nd | What it means | User must understand the measurement frame |
| 3rd | Action | Proceed when ready |

---

## 3. Data Captured or Shown

### Data Shown to User

| Data | Source | Format |
|------|--------|--------|
| Season average score | Historical rounds | Single decimal (78.4) |
| Number of rounds (season) | Historical data | Integer (32 runder) |
| Last 8 rounds average | Recent rounds | Single decimal (76.2) |
| Selected baseline | User choice | Displayed in confirmation |

### Data Captured from User

| Data | Type | Required |
|------|------|----------|
| Baseline selection | Choice (season avg OR last 8) | Yes |
| Confirmation | Boolean (tap confirm) | Yes |

### Data NOT Shown

| Data | Why Excluded |
|------|--------------|
| Handicap | Different measurement system |
| Trend direction | Implies prediction |
| "Improvement potential" | Outcome speculation |
| Comparison to other players | Social excluded |
| AI recommendation | Would bias neutral choice |
| "Good" or "bad" framing | Judgment excluded |

---

## 4. Language Framing

### Allowed Language

| Context | Language |
|---------|----------|
| Screen title | "Ditt utgangspunkt" |
| Explanation | "En baseline er referansepunktet vi måler fra" |
| Neutral framing | "Den sier ikke noe om hvor du skal — bare hvor du starter" |
| Option label | "Sesonggjennomsnitt" / "Siste 8 runder" |
| Data description | "Basert på 32 runder fra hele sesongen" |
| Implication | "Alle fremtidige målinger sammenlignes med 76.2" |
| Implication | "Hvis scoren din endres, ser du endringen herfra" |
| Permanence | "Baseline kan ikke endres etter at trening starter" |
| Actions | "Fortsett" / "Velg og fortsett" / "Bekreft" / "Gå tilbake" |

### Forbidden Language

| Forbidden | Category |
|-----------|----------|
| "Start your journey!" | Motivation |
| "Your improvement starts here" | Outcome implication |
| "This is where you'll grow from" | Progress framing |
| "Reach your potential" | Outcome prediction |
| "We recommend..." | Bias introduction |
| "Better choice" / "Conservative choice" | Judgment |
| "Ambitious" / "Safe" | Evaluation |
| "You can do it!" | Encouragement |
| "Ready to improve?" | Outcome implication |
| "Set your goal" | Goal framing (baseline ≠ goal) |
| "Your starting point for success" | Outcome promise |

### Key Semantic Distinctions

| Say This | Not This |
|----------|----------|
| "Utgangspunkt" (starting point) | "Mål" (goal) |
| "Referansepunkt" (reference point) | "Ambisjon" (ambition) |
| "Måles fra" (measured from) | "Forbedres fra" (improved from) |
| "Endring" (change) | "Fremgang" (progress) |
| "Sammenlignes med" (compared to) | "Evalueres mot" (evaluated against) |

---

## 5. What This Screen Does NOT Show

### Explicit Exclusions

| Excluded | Reason |
|----------|--------|
| Goal setting | Baseline ≠ goal. Different concept. |
| Target score | Would imply expected outcome |
| "Where you could be" | Prediction excluded |
| Improvement trajectory | Speculation excluded |
| Success probability | Prediction excluded |
| Comparison to peers | Social excluded |
| Handicap index | Different system, potential confusion |
| AI recommendation | Would bias neutral selection |
| "Best choice" indicator | Judgment excluded |
| Motivational imagery | Encouragement excluded |
| Countdown to first benchmark | Belongs elsewhere |
| Training plan preview | Belongs elsewhere |
| Coach assignment | Belongs elsewhere |

### Why These Exclusions

The BASELINE screen has ONE job:

> **"What is the reference point?"**

If the screen shows goals, predictions, or motivation, it contaminates the neutrality of the baseline.

A baseline is not a promise. It is a fact.

---

## 6. Protecting PROOF Credibility

### The Trust Chain

```
BASELINE (establishes "what was")
    ↓
TRAINING (effort accumulates)
    ↓
PROOF (compares "what is" to "what was")
```

### How BASELINE Protects PROOF

| BASELINE Design Choice | How It Protects PROOF |
|------------------------|----------------------|
| No outcome promises | PROOF can show any result without contradicting BASELINE |
| No "improvement" language | If user doesn't improve, BASELINE didn't lie |
| Neutral number presentation | Number has no emotional loading to contradict |
| User selects baseline | User owns the reference point, can't blame system |
| Permanence stated clearly | User understands this is locked, measurement is fair |
| No AI recommendation | User can't claim system biased the comparison |

### What Could Break Trust

| If BASELINE Did This | PROOF Would Suffer |
|----------------------|-------------------|
| "You'll improve from here!" | If no improvement, system lied |
| "This is your path to 72" | If they hit 80, system failed |
| "Ambitious baseline selected!" | Frames stagnation as failure |
| AI recommends "better" option | User blames AI if results disappoint |

### The Credibility Equation

**At PROOF moment:**
- System shows: "Your score is now 74.8. Baseline was 76.2."
- User thinks: "I chose 76.2. The system measured fairly. This is real."

**If BASELINE had promised improvement:**
- System shows: "Your score is now 77.5. Baseline was 76.2."
- User thinks: "You said I'd improve! The system is broken."

**Neutral baseline → credible proof.**

---

## 7. Interaction Flow

### Happy Path

```
1. User sees CONTEXT screen
2. User taps "Fortsett"
3. User sees SELECTION screen with two options
4. User taps one option (card highlights)
5. User taps "Velg og fortsett"
6. User sees CONFIRMATION with selected value
7. User reads implications
8. User taps "Bekreft"
9. Baseline saved → navigate to HOME
```

### Back Navigation

```
- Step 2 → Step 1: Allowed (back arrow)
- Step 3 → Step 2: Allowed ("Gå tilbake" link)
- After confirmation: Not allowed (baseline is permanent)
```

### Validation

| Validation | Behavior |
|------------|----------|
| No selection made | "Velg og fortsett" button disabled |
| Tap confirm without reading | Allowed (user's choice) |

---

## 8. Visual Design Details

### Option Cards

```
UNSELECTED                      SELECTED
┌─────────────────────────┐     ┌─────────────────────────┐
│                         │     │ ┌─────────────────────┐ │
│  Sesonggjennomsnitt     │     │ │ Siste 8 runder      │ │
│                         │     │ │                     │ │
│       78.4              │     │ │      76.2           │ │
│                         │     │ │                     │ │
│  Basert på 32 runder    │     │ │ Basert på dine 8    │ │
│  fra hele sesongen      │     │ │ siste runder        │ │
│                         │     │ └─────────────────────┘ │
└─────────────────────────┘     └─────────────────────────┘

Border: --ak-mist (1pt)         Border: --ak-primary (2pt)
Background: --ak-white          Background: --ak-white
                                Inner glow: --ak-primary at 5%
```

### Confirmation Card

```
┌─────────────────────────────────────┐
│                                     │
│  Din baseline                       │  ← Label: --ak-steel
│                                     │
│           76.2                      │  ← Value: --ak-primary, 34pt
│                                     │
│  Siste 8 runder                     │  ← Source: --ak-charcoal
│                                     │
└─────────────────────────────────────┘

Background: --ak-surface
Border radius: --radius-lg
```

### Progress Indicator

```
Step 1:  ●  ○  ○
Step 2:  ●  ●  ○
Step 3:  ●  ●  ●

Active: --ak-primary (filled)
Inactive: --ak-mist (outline)
```

---

## 9. Design Tokens

```
Colors:
--ak-primary       Selected state, confirmed value, buttons
--ak-charcoal      Primary text
--ak-steel         Secondary text, labels
--ak-white         Card backgrounds, page background
--ak-surface       Confirmation card background
--ak-mist          Unselected borders, inactive indicators

Typography:
--text-large-title  Baseline values (34pt)
--text-title-1      Screen titles (28pt)
--text-headline     Option titles, buttons (17pt)
--text-body         Explanations, implications (17pt)
--text-subhead      Descriptions (15pt)

Spacing:
--spacing-md        16pt (card padding)
--spacing-lg        24pt (section gaps)
--spacing-xl        32pt (generous breathing room)

Radius:
--radius-lg         16pt (cards)
--radius-md         12pt (buttons)
```

---

## 10. Summary

| Aspect | Design Decision |
|--------|-----------------|
| **Flow** | 3 steps: Context → Selection → Confirmation |
| **Primary element** | The number (baseline value) |
| **Tone** | Serious, neutral, precise |
| **User ownership** | User selects, user confirms, user owns |
| **Permanence** | Clearly stated: cannot change after training starts |
| **Language** | "Reference point", "measured from", "compared to" |
| **Excluded** | Goals, predictions, recommendations, motivation |
| **Trust mechanism** | Neutral baseline → credible proof later |

---

## 11. Component Mapping (Existing Codebase)

| Element | Existing Component | File |
|---------|-------------------|------|
| Full flow | `SeasonOnboarding` | `/components/season/SeasonOnboarding.tsx` |

**Current implementation note:** Existing component includes AI recommendation language ("We recommend based on...") and framing like "conservative" vs "ambitious". These must be removed to protect baseline neutrality. Selection should be presented without judgment.

---

*Design complete. Neutral reference point. Trust preserved.*
