# AK Golf Academy — Icon & Badge System Specification

**Version:** 1.0
**Date:** December 2024
**Author:** Design Systems Lead

---

## Executive Summary

This document defines a production-ready icon and gamification badge system for AK Golf Academy. The system is designed to be premium, restrained, and modern—suitable for a high-end golf training application targeting ambitious junior players and elite academies.

---

# PART 1: DIAGNOSIS

## 1.1 Why Icon/Badge Systems Fail in Premium Apps

### Issue Tree: Root Causes of Failure

```
ICON/BADGE SYSTEM FAILURES
├── VISUAL INCONSISTENCY
│   ├── Mixed stroke weights (1px here, 2px there)
│   ├── Inconsistent corner radii (some rounded, some sharp)
│   ├── Variable optical weights (some icons feel heavier)
│   └── Different metaphor styles (realistic + abstract mixed)
│
├── DETAIL OVERLOAD
│   ├── Too many elements per icon (>6 distinct shapes)
│   ├── Detail that breaks at small sizes (<20px)
│   ├── Decorative noise that adds no meaning
│   └── Gradients/shadows that flatten poorly
│
├── WRONG METAPHORS
│   ├── Unclear meaning (user must guess)
│   ├── Culture-specific symbols that don't translate
│   ├── Too literal (clipart feeling)
│   └── Too abstract (no clear meaning)
│
├── GAMIFICATION "GAME-IFICATION"
│   ├── Childish aesthetic (cartoon, neon, sparkles)
│   ├── Visual clutter (too many badge types)
│   ├── Inconsistent tier treatment
│   └── Rewards that feel meaningless
│
└── TECHNICAL FAILURES
    ├── SVG bloat (paths instead of primitives)
    ├── Non-integer coordinates (fuzzy rendering)
    ├── Strokes that scale unpredictably
    └── Missing size-specific optimizations
```

### 1.2 Mapping Failures to Current AK Assets

| Issue | Current State | Severity |
|-------|---------------|----------|
| **Stroke weight variance** | Icons range from 0.5px to 2.5px within same icon | HIGH |
| **Detail overload** | GolfBall has 19 dimples, GolfSwing has 15+ elements | HIGH |
| **Complex paths at small sizes** | MentalIcon, TeknikIcon break below 32px | HIGH |
| **Emoji badges** | Using 🔥⚡⏱️ for achievements—not premium | CRITICAL |
| **Mixed metaphor styles** | Some icons realistic (GolfBall), others abstract (ChartIcon) | MEDIUM |
| **Inconsistent optical weight** | GolfFlag feels heavier than CalendarIcon | MEDIUM |
| **Non-integer coordinates** | Many paths use decimal coordinates (e.g., 12.5, 7.44) | MEDIUM |

### 1.3 Specific Issues with Current Icons

**GolfBall** (Too detailed)
- 19 individual dimple circles
- At 24px, dimples become visual noise
- Recommendation: Simplify to 5-7 suggestive dimples or use a different approach

**GolfSwing** (Too complex)
- 15+ path elements for one figure
- Rotation indicator adds clutter
- At 20px, figure becomes unreadable

**MentalIcon** (Conceptually weak)
- Head profile + target + waves = 3 competing metaphors
- "Focus target on forehead" is visually confusing
- Better: single strong metaphor (brain outline, meditation pose, or focus symbol)

**Current Emoji Badges**
- Using emoji (🔥⚡🏆) violates "one system" rule
- Can't be styled, colored, or animated consistently
- Looks unprofessional in premium context

---

# PART 2: ICON SYSTEM SPECIFICATION

## 2.1 Grid & Keylines

### Base Grid: 24px

```
┌─────────────────────────────┐
│ ┌─────────────────────────┐ │  ← 2px padding (safe zone)
│ │                         │ │
│ │      ┌───────────┐      │ │  ← 16px core area
│ │      │           │      │ │
│ │      │  CONTENT  │      │ │
│ │      │           │      │ │
│ │      └───────────┘      │ │
│ │                         │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
         24 × 24 px
```

### Keyline Shapes (for optical consistency)

| Shape | Dimensions | Use Case |
|-------|------------|----------|
| Circle | 20px diameter | Round icons (user, clock, target) |
| Square | 18×18px | Container icons (folder, card) |
| Portrait Rectangle | 16×20px | Vertical icons (person, flag) |
| Landscape Rectangle | 20×16px | Horizontal icons (menu, stats) |

### Padding Rules

| Icon Size | Safe Zone | Content Area |
|-----------|-----------|--------------|
| 24px | 2px | 20px |
| 20px | 1.5px (round to 2px) | 16px |
| 16px | 1px | 14px |

### Optical Alignment Rules

1. **Circles extend 0.5px beyond square bounds** (optical correction)
2. **Triangles/arrows point 1px beyond center** (perceived balance)
3. **Vertical strokes align to pixel grid** (sharpness)
4. **Horizontal strokes center on half-pixel** (anti-alias consistency)

---

## 2.2 Stroke Specification

### Primary Stroke Weights

| Icon Size | Stroke Weight | Ratio |
|-----------|--------------|-------|
| 24px | 1.5px | 6.25% |
| 20px | 1.25px → **round to 1.5px** | 6.25% |
| 16px | 1px | 6.25% |
| 32px | 2px | 6.25% |
| 48px | 3px | 6.25% |

**Rule:** Maintain 6.25% stroke-to-size ratio (1.5/24 = 0.0625)

### Secondary Stroke (for detail)

| Icon Size | Secondary Stroke | Use Case |
|-----------|-----------------|----------|
| 24px | 1px | Inner details, secondary elements |
| 20px | 0.75px → **round to 1px** | Inner details |
| 16px | 0.5px (use sparingly) | Minimal detail only |

### Stroke Rules

1. **Maximum 2 stroke weights per icon** (primary + secondary)
2. **Never use strokes < 0.5px** (will anti-alias poorly)
3. **All strokes must be vector strokes, not outlined paths**
4. **Export with `stroke-width` attribute, not path outlines**

---

## 2.3 Corner Radii

### System Corner Radii

| Token | Value | Use Case |
|-------|-------|----------|
| `radius-none` | 0px | Sharp corners (arrows, precise shapes) |
| `radius-xs` | 1px | Subtle softening (UI rectangles) |
| `radius-sm` | 2px | Standard corners (most shapes) |
| `radius-md` | 4px | Rounded corners (cards, buttons) |
| `radius-lg` | 6px | Very rounded (pills, large containers) |
| `radius-full` | 50% | Perfect circles |

### When to Use Each

- **0px:** Directional indicators, arrows, chevrons
- **1px:** Letter forms, technical shapes
- **2px:** Default for all icon rectangles
- **4px:** Container icons (folder, document)
- **Full:** Circles, avatar indicators, dots

**Rule:** One radius per icon. Don't mix 2px and 4px corners.

---

## 2.4 Caps & Joins

### Stroke Caps

| Type | Token | Use Case |
|------|-------|----------|
| Round | `round` | **Default for all strokes** |
| Square | `butt` | Technical/precise shapes only |

### Stroke Joins

| Type | Token | Use Case |
|------|-------|----------|
| Round | `round` | **Default for all joins** |
| Bevel | `bevel` | Never use |
| Miter | `miter` | Sharp corners (arrows only) |

**Why Round Default:**
- Friendlier, more approachable
- Consistent with Apple HIG
- Scales better at small sizes

---

## 2.5 Angle Language

### Allowed Angles

| Angle | Use Case |
|-------|----------|
| 0° | Horizontal lines |
| 45° | Diagonal emphasis (arrows, check) |
| 90° | Vertical lines |
| 135° | Reverse diagonal |
| 30°/60° | Rare, for specific shapes (hexagons) |

**Forbidden:**
- Arbitrary angles (37°, 52°, etc.)
- Angles that don't relate to 45° grid
- Curved paths that don't follow arc rules

### Arc Rules

1. All curves must be **quarter arcs** (90° sweep) or **half arcs** (180° sweep)
2. Use **circular arcs**, not bezier curves where possible
3. Control points on beziers must be **axis-aligned**

---

## 2.6 Filled vs Outline Strategy

### State Definitions

| State | Style | Opacity |
|-------|-------|---------|
| **Default** | Outline (stroke only) | 100% |
| **Active/Selected** | Filled | 100% |
| **Hover** | Outline + color change | 100% |
| **Disabled** | Outline | 40% |
| **Inactive** | Outline | 60% |

### Fill Rules

1. **Fill replaces stroke on active state** (not in addition to)
2. **Same silhouette for filled and outline versions**
3. **Filled icons use `fill` attribute, remove `stroke`**
4. **Never use gradients in icons**

### Implementation

```jsx
// Outline (default)
<path stroke={color} fill="none" strokeWidth="1.5" />

// Filled (active)
<path fill={color} stroke="none" />
```

---

## 2.7 Export Rules

### SVG Requirements

```xml
<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  width="24"
  height="24"
  fill="none"
  stroke="currentColor"
  stroke-width="1.5"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <!-- paths here -->
</svg>
```

### Naming Convention

```
{category}-{name}-{variant}.svg

Examples:
nav-home-outline.svg
nav-home-filled.svg
golf-ball-outline.svg
golf-swing-outline.svg
status-check-outline.svg
action-edit-outline.svg
```

### Folder Structure

```
/assets/icons/
├── /navigation/
│   ├── home-outline.svg
│   ├── home-filled.svg
│   └── ...
├── /actions/
│   ├── edit-outline.svg
│   └── ...
├── /status/
│   └── ...
├── /golf/
│   └── ...
├── /training/
│   └── ...
└── /misc/
    └── ...
```

### Platform Delivery

| Platform | Format | Notes |
|----------|--------|-------|
| Web | SVG (inline or sprite) | Use `currentColor` |
| iOS | SF Symbols or PDF | Single weight, scalable |
| Android | Vector Drawable (XML) | Convert from SVG |

---

# PART 3: ICON SET SPECIFICATION

## 3.1 Complete Icon Inventory

### Navigation Icons (8)

| Icon | Metaphor | Priority |
|------|----------|----------|
| Home | House outline | P1 |
| Calendar | Grid with header | P1 |
| Profile | Person bust | P1 |
| Settings | Gear | P1 |
| Menu | 3 horizontal lines | P1 |
| Bell | Bell shape | P2 |
| Search | Magnifying glass | P2 |
| Back | Left chevron | P1 |

### Action Icons (10)

| Icon | Metaphor | Priority |
|------|----------|----------|
| Play | Right-pointing triangle | P1 |
| Pause | Two vertical bars | P1 |
| Stop | Square | P2 |
| Plus | Cross/plus sign | P1 |
| Edit | Pencil | P1 |
| Delete | Trash can | P1 |
| Share | Arrow out of box | P2 |
| Download | Arrow down to line | P2 |
| Upload | Arrow up from line | P2 |
| Scan | QR code outline | P2 |

### Status Icons (8)

| Icon | Metaphor | Priority |
|------|----------|----------|
| Check | Checkmark | P1 |
| X/Close | X shape | P1 |
| Warning | Triangle with ! | P1 |
| Info | Circle with i | P2 |
| Lock | Padlock | P1 |
| Unlock | Open padlock | P2 |
| Star | 5-point star | P1 |
| New | Dot/badge | P2 |

### Training-Specific Icons (12)

| Icon | Metaphor | Priority |
|------|----------|----------|
| Session | Clock + play | P1 |
| Drill | Target rings | P1 |
| Swing | Simplified golfer | P1 |
| Progress | Rising bars | P1 |
| Streak | Flame | P1 |
| Level | Tier badge | P1 |
| Technique | Alignment symbol | P1 |
| Physical | Dumbbell/strength | P1 |
| Mental | Brain/focus | P1 |
| Game | Flag on green | P1 |
| Rest | Moon/sleep | P2 |
| Tournament | Trophy | P1 |

---

## 3.2 Priority 15 Icons — Detailed Specifications

### 1. Home Icon

```
Shape: House outline with door
Grid: 20×20 content area
Strokes:
  - Outer house: 1.5px
  - Door: 1.5px
Composition:
  - Roof: Two 45° lines meeting at center-top (12,3)
  - Walls: Vertical lines from roof ends to base
  - Base: Horizontal line at y=19
  - Door: 6×8px rectangle, center-bottom, 2px radius
Keypoints: (3,10) (12,3) (21,10) (21,19) (3,19)
```

### 2. Calendar Icon

```
Shape: Rectangle with header row and grid dots
Grid: 18×18 content area
Strokes: 1.5px all
Composition:
  - Container: 18×18 rect, 2px radius
  - Header line: y=7, full width
  - Hanging tabs: Two 3px vertical lines at x=6, x=18, from y=1 to y=4
  - Grid: 9 dots (3×3) at 4px intervals, starting y=10
Keypoints: Container (3,3) to (21,21)
```

### 3. Profile/User Icon

```
Shape: Bust (head + shoulders)
Grid: 20×20 content area
Strokes: 1.5px all
Composition:
  - Head: 8px diameter circle, center at (12,7)
  - Shoulders: Arc from (4,20) through (12,15) to (20,20)
  - Cut off at y=20 (no legs)
```

### 4. Settings/Gear Icon

```
Shape: 6-tooth gear with center hole
Grid: 20×20 content area
Strokes: 1.5px all
Composition:
  - Outer ring: 20px diameter, interrupted by 6 teeth
  - Teeth: 4×3px rectangles at 60° intervals
  - Center: 8px diameter circle
Note: Use path, not individual shapes
```

### 5. Play Icon

```
Shape: Right-pointing triangle
Grid: 16×18 content area (narrower for optical balance)
Strokes: None (filled shape)
Composition:
  - Triangle: Points at (6,3) (6,21) (20,12)
  - Right vertex extends 1px beyond center (optical)
Fill: Solid
```

### 6. Check Icon

```
Shape: Checkmark
Grid: 18×14 content area
Strokes: 1.5px, round cap
Composition:
  - Short leg: (4,12) to (9,17), 45° down-right
  - Long leg: (9,17) to (20,6), ~50° up-right
  - Vertex at (9,17)
```

### 7. Plus Icon

```
Shape: Plus/cross
Grid: 18×18 content area
Strokes: 1.5px, round cap
Composition:
  - Vertical: (12,3) to (12,21)
  - Horizontal: (3,12) to (21,12)
  - Intersection at center (12,12)
```

### 8. Edit/Pencil Icon

```
Shape: Pencil at 45°
Grid: 20×20 content area
Strokes: 1.5px all
Composition:
  - Body: 14px line at 45°, from (5,19) toward (19,5)
  - Tip: Triangle point at (5,19)
  - Eraser: 2px line perpendicular at (19,5)
  - Edit line: Small curved line at bottom-left
```

### 9. Flame/Streak Icon

```
Shape: Stylized flame
Grid: 16×20 content area
Strokes: 1.5px outline (not filled by default)
Composition:
  - Outer flame: Teardrop curve, wider at bottom
  - Inner flame: Smaller teardrop, offset down
  - Peak at (12,2), base at (12,22)
  - Width: 6px at base, 12px at widest point
```

### 10. Star Icon

```
Shape: 5-point star
Grid: 20×20 content area
Strokes: 1.5px outline
Composition:
  - Center at (12,12)
  - Outer points at 20px diameter circle
  - Inner points at 8px diameter circle
  - Rotation: Top point vertical (0°)
```

### 11. Lock Icon

```
Shape: Padlock
Grid: 16×20 content area
Strokes: 1.5px all
Composition:
  - Body: 12×10px rounded rect (2px radius), bottom half
  - Shackle: U-shape, 8px wide, 6px tall, 2px stroke
  - Keyhole: 2px circle + 3px vertical line
```

### 12. Trophy Icon

```
Shape: Winner's cup
Grid: 18×20 content area
Strokes: 1.5px all
Composition:
  - Cup: Trapezoid, wider at top (14px) than bottom (8px)
  - Handles: Two curved arcs on sides
  - Stem: 2×4px rectangle
  - Base: 10×2px rectangle
```

### 13. Target/Drill Icon

```
Shape: Concentric circles with center dot
Grid: 20×20 content area
Strokes: 1.5px all
Composition:
  - Outer ring: 20px diameter
  - Middle ring: 12px diameter
  - Inner ring: 6px diameter
  - Bullseye: 2px filled circle
```

### 14. Swing/Golfer Icon (Simplified)

```
Shape: Abstracted golfer mid-swing
Grid: 18×20 content area
Strokes: 1.5px all
Composition:
  - Head: 4px circle at (10,4)
  - Body: Curved line from (10,6) to (10,14)
  - Club: 45° line from (6,8) to (18,3), crossing body
  - Legs: Triangular stance, simplified
Element count: MAX 6 strokes
```

### 15. Progress/Chart Icon

```
Shape: Rising bar chart
Grid: 18×18 content area
Strokes: 2px (thicker for bars)
Composition:
  - 3 vertical bars at x=5, x=12, x=19
  - Heights: 8px, 12px, 16px (ascending)
  - Bars have round caps
  - Base line optional (1px if included)
```

---

# PART 4: BADGE SYSTEM ARCHITECTURE

## 4.0 CRITICAL: Monochrome-First Design Process

### Mandatory Design Workflow

**Design badges in monochrome on dark background FIRST, then add color LAST.**

```
PHASE 1: MONOCHROME VALIDATION
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│   Dark Background (#02060D / Ink)                            │
│                                                              │
│      ○         ○              ○                              │
│     24px      48px           96px                            │
│                                                              │
│   Single color: #EDF0F2 (Snow) or #FFFFFF                    │
│   NO fills, NO gradients, stroke only                        │
│                                                              │
└──────────────────────────────────────────────────────────────┘

VALIDATION CHECKLIST:
☐ Silhouette is instantly recognizable at 24px
☐ Hierarchy is clear (primary symbol > secondary elements)
☐ Sufficient negative space (min 30%)
☐ No detail loss at small sizes
☐ Works at 100% and 50% opacity
```

### Phase 2: Color Introduction (Restrained)

Only after monochrome passes ALL checks:

```
COLOR APPLICATION RULES:
1. Color on RIM ONLY (tier indication)
2. Color on ACCENT ELEMENTS ONLY (max 20% of badge area)
3. Symbol remains monochrome (primary or inverse)
4. Background field can have subtle tint (max 15% opacity)

FORBIDDEN:
✗ Full-color symbol fills
✗ Gradient backgrounds
✗ Multiple competing colors
✗ Color as structural element
```

### Visual Process Example

```
STEP 1: Monochrome       STEP 2: Add Rim Color   STEP 3: Final (subtle)
on Dark

   ╭─────╮                  ╭─────╮                 ╭─────╮
   │     │                  │     │ ← Gold rim      │     │
   │  ⚡ │ White             │  ⚡ │ White symbol    │  ⚡ │
   │     │ symbol only      │     │                 │     │ Subtle tint
   ╰─────╯                  ╰─────╯                 ╰─────╯

   #02060D bg              Same structure          Gold rim
   #FFFFFF stroke          + #C9A227 rim           + 10% gold field tint
```

### Why This Matters

1. **Forces clarity:** If badge doesn't work in mono, it's too complex
2. **Ensures legibility:** Silhouette must carry meaning, not color
3. **Prevents cheap aesthetics:** Color becomes accent, not crutch
4. **Dark mode ready:** Mono-first = naturally works on dark UI
5. **Print/export safe:** Works in any context without color dependency

---

## 4.1 Badge Layers

### Layer A: Achievement Badges (Milestones)

**Purpose:** Recognize significant accomplishments
**Unlock frequency:** Rare (monthly/quarterly)
**Examples:** First 100 sessions, 1-year streak, Tournament qualifier

### Layer B: Skill Badges (Competency)

**Purpose:** Track mastery in specific areas
**Unlock frequency:** Progressive (levels within each)
**Examples:** Putting Precision I-V, Power Driving I-III

### Layer C: Seasonal/Event Badges (Limited)

**Purpose:** Time-limited engagement, FOMO
**Unlock frequency:** Event-based
**Examples:** Summer Camp 2024, Nordic Championship Participant

---

## 4.2 Badge Shape Language

### Base Container (All Badges)

```
┌────────────────────────────────┐
│                                │
│    ╭──────────────────────╮    │  ← 2px rim (tier color)
│    │                      │    │
│    │     ┌──────────┐     │    │  ← Inner field (content area)
│    │     │  SYMBOL  │     │    │
│    │     └──────────┘     │    │
│    │                      │    │
│    ╰──────────────────────╯    │
│                                │
└────────────────────────────────┘
         64 × 64 px base
```

### Shape Variants by Layer

| Layer | Shape | Corners | Rationale |
|-------|-------|---------|-----------|
| Achievement | Circle | N/A | Classic medal, timeless |
| Skill | Rounded Square | 8px radius | Modern, approachable |
| Seasonal | Shield/Crest | Custom | Special, memorable |

### Size Specifications

| Context | Size | Detail Level |
|---------|------|--------------|
| List view | 32px | Silhouette only |
| Card view | 48px | Basic detail |
| Profile/showcase | 64px | Full detail |
| Modal/celebration | 128px | Maximum detail |

---

## 4.3 Detail Budget

### Maximum Elements per Badge

| Badge Size | Max Shapes | Max Strokes | Min Negative Space |
|------------|------------|-------------|-------------------|
| 32px | 3 | 4 | 40% |
| 48px | 5 | 6 | 35% |
| 64px | 7 | 8 | 30% |
| 128px | 12 | 15 | 25% |

### Composition Rules

1. **Central symbol:** 1 primary shape (40% of badge area)
2. **Supporting elements:** Max 2 secondary shapes
3. **Decorative details:** Only at 64px+ sizes
4. **Text:** Never inside badge (use labels below)

---

## 4.4 Tier System (Premium Treatment)

### Tier Definitions

| Tier | Name | Unlock Difficulty | Rarity |
|------|------|------------------|--------|
| 1 | Standard | Easy | Common (60%) |
| 2 | Bronze | Medium | Uncommon (25%) |
| 3 | Silver | Hard | Rare (10%) |
| 4 | Gold | Very Hard | Epic (4%) |
| 5 | Platinum | Exceptional | Legendary (1%) |

### Visual Differentiation (NOT Tacky)

```
STANDARD    BRONZE      SILVER      GOLD        PLATINUM
┌─────┐     ┌─────┐     ┌─────┐     ┌─────┐     ┌─────┐
│     │     │ ─ ─ │     │ ═══ │     │ ▓▓▓ │     │ ✦✦✦ │
│  ○  │     │  ○  │     │  ○  │     │  ○  │     │  ○  │
│     │     │     │     │     │     │     │     │     │
└─────┘     └─────┘     └─────┘     └─────┘     └─────┘
No rim      1px rim     2px rim     2px rim     2px rim +
            dashed      solid       solid       inner glow
```

### Tier Treatments

| Tier | Rim | Inner Field | Symbol |
|------|-----|-------------|--------|
| Standard | None | --surface | --primary |
| Bronze | 1px dashed, Bronze color | Warm tint | --primary |
| Silver | 2px solid, Silver color | Cool tint | --primary |
| Gold | 2px solid, Gold color | Warm glow | --ink |
| Platinum | 2px solid + 1px inner glow | Gradient subtle | --ink |

### Color Palette for Tiers

```css
--tier-standard:  transparent;
--tier-bronze:    #B08D57;  /* Warm bronze, not orange */
--tier-silver:    #8A9BA8;  /* Cool silver-blue */
--tier-gold:      #C9A227;  /* AK brand gold */
--tier-platinum:  #E5E4E2;  /* Platinum grey with subtle shimmer */

/* Inner field tints (15% opacity overlay) */
--tier-bronze-tint:    rgba(176, 141, 87, 0.15);
--tier-silver-tint:    rgba(138, 155, 168, 0.15);
--tier-gold-tint:      rgba(201, 162, 39, 0.15);
--tier-platinum-tint:  rgba(229, 228, 226, 0.20);
```

---

## 4.5 Rarity Signals (Subtle)

### Earned vs Locked States

| State | Treatment |
|-------|-----------|
| **Locked** | Greyscale, 40% opacity, dashed outline |
| **In Progress** | Greyscale, 70% opacity, progress ring overlay |
| **Earned** | Full color, solid outline |
| **Newly Earned** | Full color + subtle pulse animation (1x) |

### Rarity Indicators (64px+ only)

| Rarity | Indicator | Position |
|--------|-----------|----------|
| Common | None | — |
| Uncommon | Single dot | Bottom center |
| Rare | Two dots | Bottom left/right |
| Epic | Small star | Top center |
| Legendary | Diamond | Top center + shimmer |

---

## 4.6 Animation Guidelines

### Unlock Celebration (Modal)

```
1. Badge scales from 0.8 → 1.1 → 1.0 (bounce)
2. Duration: 600ms, ease-out-back
3. Particles: 8 small circles, radiate outward
4. Particle duration: 400ms, fade out
5. Sound: Subtle "ding" (optional, user preference)
```

### Hover State (Interactive contexts)

```
1. Scale: 1.0 → 1.05
2. Shadow: elevation increases subtly
3. Duration: 200ms, ease-out
4. No rotation, no color shift
```

### Progress Animation

```
1. Ring fills clockwise
2. Fill color: --tier-color
3. Duration: proportional to progress (max 1s)
4. Ease: linear for progress, ease-out for completion
```

---

# PART 5: BADGE TAXONOMY

## 5.1 Onboarding Progression Badges

| Badge | Unlock Condition | Tier |
|-------|-----------------|------|
| **First Steps** | Complete profile setup | Standard |
| **Ready to Train** | Complete first session | Standard |
| **Week One** | Log 7 days of activity | Bronze |
| **Month Strong** | 30 consecutive days active | Silver |
| **Committed** | 100 total sessions | Gold |
| **Lifer** | 365 days active | Platinum |

## 5.2 Streak Badges

| Badge | Unlock Condition | Symbol |
|-------|-----------------|--------|
| **Hot Start** | 3-day streak | Small flame |
| **On Fire** | 7-day streak | Medium flame |
| **Blazing** | 14-day streak | Large flame |
| **Unstoppable** | 30-day streak | Flame + "30" |
| **Legendary Streak** | 60-day streak | Platinum flame |

## 5.3 Skill Mastery Badges

### Putting Mastery (5 levels)

| Level | Name | Requirement |
|-------|------|-------------|
| I | Putter | 10 putting drills completed |
| II | Green Reader | 50 drills, 70% accuracy |
| III | Distance Control | 100 drills, 80% accuracy |
| IV | Clutch Putter | 200 drills under pressure |
| V | Putting Master | 500 drills, 90% accuracy |

### Driving Power (4 levels)

| Level | Name | Requirement |
|-------|------|-------------|
| I | Driver | 10 driving sessions |
| II | Long Hitter | +5 mph from baseline |
| III | Bomber | +10 mph from baseline |
| IV | Speed Demon | +15 mph from baseline |

### Short Game (4 levels)

| Level | Name | Requirement |
|-------|------|-------------|
| I | Chipper | 20 short game sessions |
| II | Bunker Escape | 80% up-and-down rate |
| III | Touch Artist | 90% up-and-down rate |
| IV | Short Game Wizard | Master all distances |

### Iron Precision (4 levels)

| Level | Name | Requirement |
|-------|------|-------------|
| I | Iron Player | 30 iron sessions |
| II | Pin Seeker | 70% GIR |
| III | Precision | 80% GIR |
| IV | Tour Caliber | 85%+ GIR |

### Mental Game (3 levels)

| Level | Name | Requirement |
|-------|------|-------------|
| I | Focused | 10 mental training sessions |
| II | Calm Under Pressure | Consistent tournament performance |
| III | Mental Champion | Top 10% mental metrics |

## 5.4 Consistency Badges

| Badge | Unlock Condition |
|-------|-----------------|
| **Perfect Week** | Complete all planned sessions (1 week) |
| **Perfect Month** | Complete all planned sessions (30 days) |
| **Early Bird** | 20 sessions before 9 AM |
| **Night Owl** | 20 sessions after 7 PM |
| **Reliable** | 90%+ completion rate (50+ sessions) |
| **Machine** | 95%+ completion rate (100+ sessions) |

## 5.5 Challenge Badges

| Badge | Unlock Condition |
|-------|-----------------|
| **Weakness Crusher** | Resolve 3 breaking points |
| **Perfectionist** | Resolve 10 breaking points |
| **Tournament Ready** | Complete pre-tournament prep |
| **Battle Tested** | 5 tournaments completed |
| **Champion** | Win a tournament |

## 5.6 Community/Social Badges (Optional)

| Badge | Unlock Condition |
|-------|-----------------|
| **Team Player** | Join a training group |
| **Mentor** | Help 3 junior players |
| **Academy Pride** | Complete academy challenge |

---

# PART 6: VISUAL DIRECTIONS

## Direction A: "Nordic Minimal Medal"

**Concept:** Clean Scandinavian design, maximum restraint, relies on negative space

### Characteristics

- Circular shape only
- Single 1.5px rim
- Minimal symbol (3-4 strokes max)
- Heavy use of negative space
- Monochrome by default
- Tier color only on rim

### Pros

- Extremely refined
- Timeless
- Works at all sizes
- Easy to implement

### Cons

- May feel "too simple" for gamification
- Limited differentiation between badges
- Less exciting unlock moments

### Best Fit

Junior players, minimalist brand positioning, B2B contexts

### Example

```
    ╭─────────────────╮
    │                 │
    │       ╱╲        │
    │      ╱  ╲       │
    │     ╱    ╲      │
    │     ──────      │
    │                 │
    ╰─────────────────╯
     (Flame as 4 strokes)
```

---

## Direction B: "Precision Monoline Emblems"

**Concept:** Single-weight line work, technical precision, blueprint aesthetic

### Characteristics

- Rounded square (achievement) or hexagon (skill)
- Consistent 1.5px strokes throughout
- Technical/engineering feel
- Subtle geometric patterns
- Very controlled tier treatment

### Pros

- Unique, ownable aesthetic
- Technical feel matches golf precision
- Good differentiation
- Scalable

### Cons

- May feel cold
- Hexagons less familiar
- More complex to draw

### Best Fit

Elite academy programs, data-driven players, tech-savvy audience

### Example

```
    ┌───────────────────┐
    │   ╭─╮       ╭─╮   │
    │   │ │  ╱╲   │ │   │
    │   ╰─┼─╱  ╲──┼─╯   │
    │     │ ────  │     │
    │     ╰───────╯     │
    └───────────────────┘
     (Trophy as connected lines)
```

---

## Direction C: "Modern Crest / Seal" (Recommended)

**Concept:** Contemporary take on traditional medals/crests, elegant but not old-fashioned

### Characteristics

- Circle base with subtle inner structure
- 2-layer depth (rim + inner field)
- Refined symbol in center
- Tasteful tier treatments
- Slight dimensionality (not flat, not skeuomorphic)

### Pros

- Aspirational and prestigious
- Familiar medal metaphor
- Clear tier progression
- Celebratory unlock moments
- Balances restraint with richness

### Cons

- Slightly more complex to produce
- Risk of over-decoration if not careful

### Best Fit

**All contexts** — works for junior, elite, and app brand

### Example

```
      ╭───────────────────╮
    ╭─│                   │─╮
    │ │   ╭───────────╮   │ │
    │ │   │           │   │ │  ← Inner field
    │ │   │    🔥     │   │ │  ← Symbol
    │ │   │           │   │ │
    │ │   ╰───────────╯   │ │
    ╰─│                   │─╯
      ╰───────────────────╯
         ↑ Outer rim (tier color)
```

---

## Recommendation: Direction C

**Justification:**

1. **Premium without pretense:** Crest/seal metaphor is universally understood as "achievement" without being childish
2. **Tier clarity:** The 2-layer structure (rim + field) provides natural places for tier differentiation
3. **Celebration-worthy:** Has enough visual richness for satisfying unlock moments
4. **Scalable:** Works from 32px list view to 128px modal
5. **Brand-aligned:** Matches AK's position as premium academy

---

# PART 7: THEME & COLOR RULES

## 7.1 Shared Neutral Base

All badges share the same base structure regardless of sub-brand:

```css
/* Base badge colors */
--badge-rim-default:     var(--ak-primary);      /* #10456A */
--badge-field-default:   var(--ak-surface);      /* #EBE5DA */
--badge-symbol-default:  var(--ak-primary);      /* #10456A */
--badge-locked-bg:       var(--ak-gray-100);     /* #F2F4F7 */
--badge-locked-stroke:   var(--ak-gray-300);     /* #D5D7DA */
```

## 7.2 Sub-Brand Accent Application

| Sub-Brand | Accent Color | Application |
|-----------|--------------|-------------|
| AK Golf Academy | `#10456A` (Primary) | Rim highlight, symbol |
| AK Junior | `#4A7C59` (Success/Green) | Rim highlight only |
| QR/App | `#10456A` (Primary) | Standard |
| Mono/Print | `#02060D` (Ink) | All elements |

### Rule: Accent on Rim Only

```css
/* AK Junior badge example */
.badge--junior {
  --badge-rim-default: var(--ak-success); /* Green rim */
  --badge-field-default: var(--ak-surface); /* Same field */
  --badge-symbol-default: var(--ak-primary); /* Blue symbol */
}
```

**Why:** Keeps badges recognizable across sub-brands while allowing brand expression

## 7.3 Tier Colors with Hex Codes

```css
/* Tier rim colors */
--tier-standard:    transparent;
--tier-bronze:      #B08D57;
--tier-silver:      #8A9BA8;
--tier-gold:        #C9A227;
--tier-platinum:    #E5E4E2;

/* Tier field tints (background overlay) */
--tier-bronze-tint:     rgba(176, 141, 87, 0.12);
--tier-silver-tint:     rgba(138, 155, 168, 0.12);
--tier-gold-tint:       rgba(201, 162, 39, 0.15);
--tier-platinum-tint:   rgba(229, 228, 226, 0.18);

/* Tier text/symbol colors (for Gold/Platinum) */
--tier-gold-symbol:     #02060D;  /* Ink for contrast */
--tier-platinum-symbol: #02060D;  /* Ink for contrast */
```

## 7.4 Dark Mode Rules

```css
/* Dark mode overrides */
@media (prefers-color-scheme: dark) {
  :root {
    --badge-field-default:   #1C1C1E;  /* Dark surface */
    --badge-symbol-default:  #EDF0F2;  /* Light symbol */
    --badge-rim-default:     #2C5F7F;  /* Lighter primary */
    --badge-locked-bg:       #2C2C2E;
    --badge-locked-stroke:   #3A3A3C;

    /* Tier adjustments for dark mode */
    --tier-bronze:      #D4A574;  /* Lighter bronze */
    --tier-silver:      #A8B8C8;  /* Lighter silver */
    --tier-gold:        #E5C04E;  /* Brighter gold */
    --tier-platinum:    #F0EFE8;  /* Brighter platinum */
  }
}
```

---

# PART 8: DELIVERABLE FORMAT

## 8.1 CSS Token Table

```css
/* ===========================================
   AK GOLF ACADEMY - ICON & BADGE TOKENS
   =========================================== */

:root {
  /* ─────────────────────────────────────────
     ICON TOKENS
     ───────────────────────────────────────── */

  /* Sizes */
  --icon-size-sm: 16px;
  --icon-size-md: 20px;
  --icon-size-lg: 24px;
  --icon-size-xl: 32px;

  /* Strokes */
  --icon-stroke-sm: 1px;
  --icon-stroke-md: 1.5px;
  --icon-stroke-lg: 2px;

  /* Colors */
  --icon-color-default: var(--ak-primary);
  --icon-color-secondary: var(--ak-gray-500);
  --icon-color-inverse: var(--ak-white);
  --icon-color-disabled: var(--ak-gray-300);
  --icon-color-success: var(--ak-success);
  --icon-color-warning: var(--ak-warning);
  --icon-color-error: var(--ak-error);

  /* ─────────────────────────────────────────
     BADGE TOKENS
     ───────────────────────────────────────── */

  /* Sizes */
  --badge-size-sm: 32px;
  --badge-size-md: 48px;
  --badge-size-lg: 64px;
  --badge-size-xl: 96px;
  --badge-size-xxl: 128px;

  /* Structure */
  --badge-rim-width: 2px;
  --badge-rim-radius: 50%;
  --badge-field-inset: 4px;

  /* Base Colors */
  --badge-rim-default: var(--ak-primary);
  --badge-field-default: var(--ak-surface);
  --badge-symbol-default: var(--ak-primary);

  /* Tier Colors */
  --tier-standard: transparent;
  --tier-bronze: #B08D57;
  --tier-silver: #8A9BA8;
  --tier-gold: #C9A227;
  --tier-platinum: #E5E4E2;

  /* Tier Tints */
  --tier-bronze-tint: rgba(176, 141, 87, 0.12);
  --tier-silver-tint: rgba(138, 155, 168, 0.12);
  --tier-gold-tint: rgba(201, 162, 39, 0.15);
  --tier-platinum-tint: rgba(229, 228, 226, 0.18);

  /* States */
  --badge-locked-opacity: 0.4;
  --badge-progress-opacity: 0.7;
  --badge-locked-bg: var(--ak-gray-100);
  --badge-locked-stroke: var(--ak-gray-300);

  /* Animation */
  --badge-unlock-duration: 600ms;
  --badge-hover-duration: 200ms;
  --badge-unlock-scale: 1.1;
  --badge-hover-scale: 1.05;
}
```

## 8.2 Implementation Checklist

### For Designers

- [ ] Create 24px grid template in Figma
- [ ] Set up keyline shapes (circle, square, rectangles)
- [ ] Define stroke styles (1.5px primary, 1px secondary)
- [ ] Create icon component set with variants (outline/filled)
- [ ] Build badge component with tier variants
- [ ] Document all symbols at 64px with detail notes
- [ ] Create size-specific variants (32px, 48px, 64px, 128px)
- [ ] Test all icons at 16px for legibility
- [ ] Verify dark mode contrast ratios
- [ ] Export SVGs with correct settings

### For Developers

- [ ] Implement icon component with size/color props
- [ ] Create badge component with tier/state props
- [ ] Add CSS custom properties to design system
- [ ] Implement locked/progress/earned states
- [ ] Build unlock animation sequence
- [ ] Add hover/focus interactions
- [ ] Test icon rendering at all sizes
- [ ] Verify SVG accessibility (aria-labels)
- [ ] Implement dark mode token switching
- [ ] Set up asset pipeline for exports

---

## 8.3 Do / Don't Examples

### Icons

#### DO ✓

```svg
<!-- Correct: Simple, clean, consistent stroke -->
<svg viewBox="0 0 24 24" stroke-width="1.5">
  <circle cx="12" cy="12" r="9"/>
  <polyline points="12 6 12 12 16 14"/>
</svg>
```

#### DON'T ✗

```svg
<!-- Wrong: Too detailed, mixed strokes, decimal coords -->
<svg viewBox="0 0 24 24">
  <circle cx="12" cy="12" r="9" stroke-width="1.5"/>
  <circle cx="12" cy="12" r="7.5" stroke-width="0.8"/>
  <circle cx="12" cy="12" r="5.3" stroke-width="0.5"/>
  <path d="M12 6.2 L12 11.8 L16.1 14.2" stroke-width="2"/>
</svg>
```

### Badges

#### DO ✓

```
┌─────────────────┐
│   ╭─────────╮   │  ← Clean rim
│   │         │   │
│   │   ⚡    │   │  ← Single symbol
│   │         │   │
│   ╰─────────╯   │
└─────────────────┘
     Tier rim only
```

#### DON'T ✗

```
┌─────────────────┐
│ ✨  LEVEL UP ✨ │  ← Text inside
│   ╭─────────╮   │
│   │ ⚡🔥⭐  │   │  ← Multiple symbols
│   │ BRONZE  │   │  ← Text label
│   ╰─────────╯   │
└─────────────────┘
     Too many elements
```

---

## 8.4 Asset Folder Structure

```
/design-system/
├── /tokens/
│   ├── icons.css
│   ├── badges.css
│   └── index.css
│
├── /icons/
│   ├── /svg/
│   │   ├── /navigation/
│   │   │   ├── home-outline.svg
│   │   │   ├── home-filled.svg
│   │   │   └── ...
│   │   ├── /actions/
│   │   ├── /status/
│   │   ├── /golf/
│   │   ├── /training/
│   │   └── /misc/
│   │
│   ├── /react/
│   │   ├── index.tsx
│   │   ├── IconWrapper.tsx
│   │   └── icons/
│   │       ├── Home.tsx
│   │       └── ...
│   │
│   └── /sprite/
│       └── icons.svg
│
├── /badges/
│   ├── /svg/
│   │   ├── /achievement/
│   │   ├── /skill/
│   │   └── /seasonal/
│   │
│   ├── /react/
│   │   ├── Badge.tsx
│   │   ├── BadgeSymbols.tsx
│   │   └── types.ts
│   │
│   └── /animations/
│       └── unlock.css
│
└── /docs/
    ├── icon-usage.md
    ├── badge-usage.md
    └── examples/
```

---

# APPENDIX: Quick Reference Card

## Icon Specs at a Glance

| Property | Value |
|----------|-------|
| Base size | 24×24px |
| ViewBox | `0 0 24 24` |
| Stroke weight | 1.5px |
| Secondary stroke | 1px |
| Corner radius | 2px (default) |
| Caps | Round |
| Joins | Round |
| Content area | 20×20px |
| Safe zone | 2px |

## Badge Specs at a Glance

| Property | Value |
|----------|-------|
| Base size | 64×64px |
| Shape | Circle (Achievement), RoundedRect (Skill) |
| Rim width | 2px |
| Symbol area | 60% of badge |
| Max elements | 7 (at 64px) |
| Tier on rim | Color only, no gradient |

## Color Quick Reference

| Token | Light | Dark |
|-------|-------|------|
| Primary | #10456A | #2C5F7F |
| Surface | #EBE5DA | #1C1C1E |
| Gold | #C9A227 | #E5C04E |
| Success | #4A7C59 | #5A9C69 |
| Error | #C45B4E | #E47B6E |

---

**End of Specification**

*This document is the single source of truth for the AK Golf Academy icon and badge system. All implementations must conform to these specifications.*
