# IUP GOLF ACADEMY - DESIGN SYSTEM v3.0

## Komplett oversikt for ChatGPT-utvikling

---

## FRAMEWORK & TECH STACK

| Teknologi | Versjon |
|-----------|---------|
| UI Framework | Tailwind CSS 3.4.19 |
| Frontend | React 18.2.0 |
| Språk | TypeScript/JSX |
| Arkitektur | Monorepo (pnpm workspaces) |

---

## FARGEPALETT

### Primærfarger (Brand)
```
Primary Blue:        #10456A  (ak-primary)
Primary Light Blue:  #2C5F7F  (ak-primary-light)
Deep Navy (ink):     #02060D  (ak-ink)
Light Snow:          #EDF0F2  (ak-snow)
Warm Surface:        #EBE5DA  (ak-surface)
Gold Accent:         #C9A227  (ak-gold)
```

### Statusfarger
```
Success (Green):     #4A7C59
Warning (Amber):     #D4A84B
Error (Red):         #C45B4E
```

### Gråskala
```
Gray 50:   #F9FAFB
Gray 100:  #F2F4F7
Gray 300:  #D5D7DA
Gray 500:  #8E8E93  (steel)
Gray 600:  #535862
Gray 700:  #414651
Gray 900:  #1C1C1E  (charcoal)
```

### Økttype-farger
```
Teknikk:      #8B6E9D  (lilla)
Golfslag:     #2C5F7F  (primær lys blå)
Spill:        #10456A  (primær blå)
Kompetanse:   #C45B4E  (rød)
Fysisk:       #D97644  (oransje)
Funksjonell:  #5FA696  (turkis)
Hjemme:       #8E8E93  (grå)
Test:         #C9A227  (gull)
```

### Trener-rolle farger
```
Hovedtrener:  #10456A  (Primary Blue)
Teknisk:      #2C5F7F  (Primary Light)
Fysisk:       #4A7C59  (Success Green)
Mental:       #C9A227  (Gold)
Strategi:     #D4A84B  (Warning)
```

---

## TYPOGRAFI

### Fonter
```
Primær:   Inter (weights: 400, 500, 600, 700)
Logo:     DM Sans (weights: 300, 400, 500)
Fallback: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
```

### Typografiskala (Apple HIG-inspirert)
```
Large Title:   34px / 41px line-height / 700 weight / -0.4px letter-spacing
Title 1:       28px / 34px / 700 / 0.36px
Title 2:       22px / 28px / 700 / -0.26px
Title 3:       20px / 25px / 600 / -0.45px

Headline:      17px / 22px / 600 / -0.43px
Body:          17px / 22px / 400 / -0.43px
Callout:       16px / 21px / 400 / -0.31px
Subhead:       15px / 20px / 400 / -0.23px

Footnote:      13px / 18px / 400 / -0.08px
Caption 1:     12px / 16px / 400 / 0px
Caption 2:     11px / 13px / 400 / 0.06px

Stat Number:   48px / 1 / 700 / -0.5px
Stat Label:    11px / 13px / 500 / 0.5px / UPPERCASE
```

---

## SPACING

Base unit: 4px

```
xs (spacing-1):    4px
sm (spacing-2):    8px
md (spacing-3):    12px
base (spacing-4):  16px
spacing-5:         20px
lg (spacing-6):    24px
xl (spacing-8):    32px
spacing-10:        40px
xxl (spacing-12):  48px
spacing-16:        64px
spacing-20:        80px
```

---

## BORDER RADIUS

```
sm (ak-sm):   8px
md (ak-md):   12px
lg (ak-lg):   16px
full:         9999px
```

---

## SHADOWS

```
Card:      0 2px 4px rgba(0, 0, 0, 0.06)
Elevated:  0 4px 12px rgba(0, 0, 0, 0.08)

Dark Mode:
  Card:      0 2px 8px rgba(0, 0, 0, 0.3)
  Elevated:  0 4px 16px rgba(0, 0, 0, 0.4)
```

---

## IKONER

- **Bibliotek**: Custom SVG + Lucide React fallback
- **Størrelse**: 24x24px
- **Stroke**: 1.5px, round caps/joins
- **Farge**: currentColor

### Tilgjengelige ikoner:
**Golf**: GolfBall, GolfClub, GolfFlag, GolfTee, GolfTarget, GolfSwing, GolfPutt
**Treningstyper**: TeknikIcon, GolfslagIcon, SpillIcon, FysiskIcon, MentalIcon
**Status**: CheckIcon, ClockIcon, XIcon, TrophyIcon, StarIcon, LockIcon
**Navigasjon**: HomeIcon, CalendarIcon, UserIcon, SettingsIcon, BellIcon

---

## KOMPONENTER

### Button
**Variants**: primary, secondary, ghost, danger, success
**Sizes**: sm (8px/16px), md (12px/24px), lg (16px/32px)

### Badge
**Variants**: primary, secondary, success, warning, error, gold, neutral
**Level Badges (L1-L5)**:
- L1: #F2F2F7 bg / #8E8E93 text
- L2: #E5E5EA bg / #8E8E93 text
- L3: #D4E1EB bg / #10456A text
- L4: #2C5F7F bg / #FFFFFF text
- L5: #10456A bg / #FFFFFF text

### Card
**Variants**: default, elevated, outlined, highlight
**Padding**: none, sm (12px), md (16px), lg (24px)

### Avatar
**Sizes**: xs (24px), sm (32px), md (40px), lg (56px), xl (80px)

---

## DARK MODE

**Aktivering**:
- CSS class: `html.dark` eller `[data-theme="dark"]`
- System preference: `@media (prefers-color-scheme: dark)`
- localStorage: `ak-golf-theme`

### Dark Mode farger:
```
Primary:       #2C5F7F
Primary Light: #3D7A9E
Ink/Text:      #F2F2F7
Snow/BG:       #1C1C1E
Surface:       #2C2C2E
Gold:          #D4A84B
Success:       #5FA87A
Warning:       #E5C062
Error:         #D47367
```

---

## ROLLE-SPESIFIKKE VIEWS

### Spiller
- Calendar (planlegging av økter)
- Progress Dashboard (personlig utvikling)
- Achievements/Badges
- Training Archives
- Goals Management
- Annual Planning

### Coach
- Athlete List & Details
- Training Plan Management
- Session Evaluations
- Performance Statistics
- Athlete Messaging
- Notes

### Admin
- Coach Management
- Tier Management
- Feature Flags
- System Overview

---

## ANIMASJONER

### Timing
```
--duration-instant:  100ms
--duration-fast:     150ms
--duration-normal:   250ms
--duration-slow:     350ms
--duration-slower:   500ms
```

### Easing
```
--easing-default:  cubic-bezier(0.4, 0, 0.2, 1)
--easing-in:       cubic-bezier(0.4, 0, 1, 1)
--easing-out:      cubic-bezier(0, 0, 0.2, 1)
--easing-bounce:   cubic-bezier(0.68, -0.55, 0.265, 1.55)
--easing-spring:   cubic-bezier(0.175, 0.885, 0.32, 1.275)
```

---

## BREAKPOINTS

```
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
```

---

## FILER I DENNE MAPPEN

1. `00-DESIGN-OVERSIKT.md` - Denne filen
2. `design-tokens.js` - JavaScript design tokens
3. `tailwind.config.js` - Tailwind konfigurasjon
4. `tokens.css` - CSS variabler
5. `index.css` - Globale stiler med dark mode
6. `icons.jsx` - Custom ikon-bibliotek
7. `Button.tsx` - Button-komponent
8. `Card.tsx` - Card-komponent
9. `Badge.tsx` - Badge-komponent
10. `Avatar.tsx` - Avatar-komponent
