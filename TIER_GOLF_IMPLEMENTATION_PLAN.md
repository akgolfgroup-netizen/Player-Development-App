# TIER Golf Design System - Implementasjonsplan
## IUP Master V1 Frontend Migration

**Versjon:** 1.0
**Dato:** Januar 2025
**Status:** Planlegging

---

## 📋 Innholdsfortegnelse

1. [Prosjektoversikt](#prosjektoversikt)
2. [Nåværende Tilstand](#nåværende-tilstand)
3. [Implementasjonsfaser](#implementasjonsfaser)
4. [Detaljert Arbeidsplan](#detaljert-arbeidsplan)
5. [Teknisk Arkitektur](#teknisk-arkitektur)
6. [Migrerings-strategi](#migrerings-strategi)
7. [Testing & Kvalitetssikring](#testing--kvalitetssikring)
8. [Risiko & Tiltak](#risiko--tiltak)

---

## 🎯 Prosjektoversikt

### Formål
Implementere TIER Golf Design System i IUP Master V1 frontend for å:
- Etablere konsistent merkevareidentitet
- Forbedre brukeropplevelse med moderne, profesjonelt design
- Bygge et skalerbart og vedlikeholdbart designsystem
- Integrere gamification-elementer (badges, streaks, kategori A-K system)

### Målgrupper
- **Spillere** (12-25 år): Motivasjon, fremgang, gamification
- **Trenere**: Oversikt, effektivitet, dashboards
- **Administratorer**: Kontroll, rapporter, analytics

### Design Prinsipper
1. **Clarity First** – Informasjon skal være umiddelbart forståelig
2. **Progress Visible** – Fremgang skal alltid være synlig og motiverende
3. **Premium Feel** – Kvalitetsfølelse i hver interaksjon
4. **Data-Driven** – Visualiser data på en meningsfull måte
5. **Accessible** – Fungerer for alle brukernivåer (WCAG 2.1 AA)

---

## 📊 Nåværende Tilstand

### Eksisterende Design System (v3.0)
```
Fargepalett: Stone × Midnight Blue × Emerald × Soft Gold
Typografi: Inter (primær), DM Sans (logo)
CSS Tokens: RGB triplets i :root
Tailwind: v3.4.19 med custom config
UI Library: Radix UI + shadcn/ui patterns
```

### Utfordringer
- Eksisterende fargepalett er Stone/Emerald-basert
- TIER systemet krever Navy/Gold merkevarefarger
- Kategori A-K farger mangler (11 nye fargevarianter)
- Badge tier system (Bronze/Silver/Gold/Platinum) mangler
- Gamification komponenter ikke implementert

### Avhengigheter som finnes
✅ React 18.2
✅ Tailwind CSS 3.4.19
✅ Radix UI komponenter
✅ Lucide React (ikoner)
✅ Recharts (data visualisering)
✅ Motion (animasjoner)

### Avhengigheter som må legges til
- Google Fonts: DM Sans (700 weight for headers)
- Eventuelt: JetBrains Mono (monospace for kode/tall)

---

## 🚀 Implementasjonsfaser

### Fase 1: Grunnlag (Uke 1)
**Mål:** Etablere TIER design tokens og fundament

#### 1.1 Design Tokens Setup
- [ ] Erstatt `src/styles/tokens.css` med TIER farger
- [ ] Oppdater `tailwind.config.js` med TIER palett
- [ ] Bevare backwards-kompatibilitet (alias gamle tokens)

#### 1.2 Typografi
- [ ] Installer Google Fonts (DM Sans 400-800, Inter 300-700)
- [ ] Oppdater font-family referanser
- [ ] Teste typografi på ulike skjermstørrelser

#### 1.3 Assets
- [ ] Kopier TIER Golf logos til `apps/web/public/assets/`
- [ ] Generer favicon set (16px, 32px, 192px, 512px)
- [ ] Oppdater app manifest

**Leveranse:**
- Nye CSS tokens file
- Oppdatert Tailwind config
- Logo assets implementert

---

### Fase 2: Komponentbibliotek (Uke 2-3)

#### 2.1 Base Components
Opprett `apps/web/src/components/tier/` med:

**Buttons** (`TierButton.jsx`)
```javascript
Variants:
- primary (navy)
- secondary (gold)
- outline
- ghost
Sizes: sm, md, lg
```

**Cards** (`TierCard.jsx`)
```javascript
Variants:
- base
- elevated
- category (med farget top border)
- tier (med tier-border: bronze/silver/gold/platinum)
```

**Badges** (`TierBadge.jsx`)
```javascript
Variants:
- primary
- gold
- success/warning/error/info
Sizes: sm, md, lg
```

**Input Fields** (`TierInput.jsx`)
```javascript
States: default, focus, error, disabled
Sizes: md, lg
With label support
```

**Progress Bars** (`TierProgress.jsx`)
```javascript
Types:
- default (navy)
- category (A-K farger)
- animated
```

**Tooltips** (`TierTooltip.jsx`)
```javascript
Positions: top, bottom, left, right
Themes: dark (navy), light
```

#### 2.2 Gamification Components

**Achievement Badge** (`AchievementBadge.jsx`)
```javascript
Props:
- tier: bronze | silver | gold | platinum
- icon: Lucide icon component
- label: string
- locked: boolean
- size: sm | md | lg | xl

Features:
- Animated unlock (badgeUnlock animation)
- Grayscale when locked
- Glow effect for gold/platinum
```

**Streak Indicator** (`StreakIndicator.jsx`)
```javascript
Props:
- count: number
- label: string
- animated: boolean

Features:
- Fire icon with flicker animation
- Warning-light background
- Prominent display for motivation
```

**XP Bar** (`XPBar.jsx`)
```javascript
Props:
- current: number
- required: number
- level: number
- showAnimation: boolean

Features:
- Gold gradient fill
- Level circle indicator
- Progress animation
- XP labels (current/required)
```

**Category Ring** (`CategoryRing.jsx`)
```javascript
Props:
- category: 'A' | 'B' | 'C' | ... | 'K'
- progress: number (0-100)
- size: md | lg

Features:
- SVG-based circular progress
- Category letter centered
- Color-coded per category
- Animated stroke
```

**Level Indicator** (`LevelIndicator.jsx`)
```javascript
Props:
- level: number
- size: sm | md | lg

Features:
- Navy background
- Gold border
- Display font (DM Sans)
```

#### 2.3 Data Visualization Components

**Stat Card** (`StatCard.jsx`)
```javascript
Props:
- value: number | string
- label: string
- trend: 'positive' | 'negative' | 'neutral'
- trendValue: string (e.g., "+12%")
- icon?: Lucide icon

Features:
- Large value display
- Trend indicator with color
- Icon support
```

**Category Progress Card** (`CategoryProgressCard.jsx`)
```javascript
Props:
- category: 'A' | 'B' | ... | 'K'
- currentProgress: number
- required: number
- tests: array

Features:
- Category color header
- Progress bar
- Test breakdown list
- Pass/fail indicators
```

**Deliverables:**
- 15+ reusable TIER components
- Storybook dokumentasjon (valgfritt)
- Component API documentation

---

### Fase 3: Feature Integration (Uke 4-5)

#### 3.1 Dashboard Redesign
Fil: `apps/web/src/features/dashboard/AKGolfDashboard.jsx`

**Endringer:**
- Replace old cards med `TierCard`
- Integrer `CategoryRing` for A-K fremgang
- Legg til `StreakIndicator` for treningsstreak
- Bruk `StatCard` for key metrics
- Implementer `XPBar` for overall progress

**Layout:**
```
+----------------------------------+
|  Player Header (navn + level)   |
+----------------------------------+
| CategoryRing | XPBar | Streak   |
+----------------------------------+
| Stat Cards (4 columns)          |
+----------------------------------+
| Recent Activity                  |
+----------------------------------+
```

#### 3.2 Badge System
Fil: `apps/web/src/features/badges/`

**Komponenter:**
- `BadgeGallery.jsx` - Grid av alle badges
- `BadgeDetail.jsx` - Modal med badge info
- `BadgeUnlockToast.jsx` - Notification ved unlock

**Integrasjon:**
- API: `/api/v1/players/:id/badges`
- Bruk `AchievementBadge` component
- Implementer unlock animation
- Toast notifications ved nye badges

#### 3.3 Category System
Nytt: `apps/web/src/features/categories/`

**Komponenter:**
- `CategoryOverview.jsx` - Grid av alle A-K kategorier
- `CategoryDetail.jsx` - Detaljert view per kategori
- `CategoryTestList.jsx` - Tester for kategori
- `CategoryProgress.jsx` - Progress tracking

**Features:**
- Visuelt hierarki (Elite: A-C, Nasjonalt: D-E, etc.)
- Fargekodet per kategori
- Krav/tester per kategori
- Progress bars og completion status

#### 3.4 Navigation & Layout
Filer:
- `apps/web/src/components/navigation/SideNavigationDesktop.jsx`
- `apps/web/src/components/navigation/SideNavigationMobile.jsx`

**Endringer:**
- Navy bakgrunn (--tier-navy)
- Gold accent for active items
- TIER Golf logo i header
- Player level indicator i sidebar

**Deliverables:**
- Dashboard fullstendig redesignet
- Badge system implementert
- Category A-K system live
- Navigation oppdatert med TIER farger

---

### Fase 4: Styling Migration (Uke 6)

#### 4.1 Global Styles
**Prosess:**
1. Audit alle CSS filer i `apps/web/src/`
2. Identifiser hardkodede farger (`#XXXXXX`)
3. Erstatt med TIER tokens
4. Test visuelt på alle sider

**Verktøy:**
```bash
# Find hardcoded colors
grep -r "#[0-9A-Fa-f]\{6\}" apps/web/src --include="*.css"
grep -r "rgb(" apps/web/src --include="*.css"
```

**Prioritet:**
1. Navigation (høy synlighet)
2. Dashboard (mest brukt)
3. Forms & inputs
4. Modals & dialogs
5. Badges & achievements

#### 4.2 Component Updates
**Prosess:**
1. Erstatt gamle komponenter med TIER komponenter
2. Oppdater props til ny API
3. Test funksjonalitet

**Komponenter som må oppdateres:**
- Buttons: Erstatt med `TierButton`
- Cards: Erstatt med `TierCard`
- Inputs: Erstatt med `TierInput`
- Progress bars: Erstatt med `TierProgress`

#### 4.3 Dark Mode Support
**Implementer:**
- CSS variables for dark mode (fra design doc)
- `[data-theme="dark"]` selector
- Toggle i user settings
- Persist preference i localStorage

**Deliverables:**
- Alle hardkodede farger erstattet
- Komponenter migrert til TIER
- Dark mode support (valgfritt)

---

### Fase 5: Animations & Polish (Uke 7)

#### 5.1 Keyframe Animations
Implementer i `apps/web/src/styles/animations.css`:

```css
@keyframes badgeUnlock { ... }
@keyframes fireFlicker { ... }
@keyframes tierUp { ... }
@keyframes progressFill { ... }
```

**Bruk cases:**
- Badge unlock: Når spiller låser opp nytt badge
- Fire flicker: Streak indicator
- Tier up: Når spiller går opp i kategori
- Progress fill: Loading states, XP bar

#### 5.2 Transitions
**Standardiser:**
- Hover states: 150ms ease-in-out
- Modal open: 200ms ease-out
- Page transitions: 300ms ease-out

**Accessibility:**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

#### 5.3 Micro-interactions
**Implementer:**
- Button click: scale(0.98) på active
- Card hover: Subtle shadow elevation
- Badge hover: Gentle glow/scale
- Progress bar: Animated fill on mount

**Deliverables:**
- Animations implementert
- Micro-interactions polished
- Reduced motion support

---

### Fase 6: Testing & QA (Uke 8)

#### 6.1 Visual Regression Testing
**Verktøy:** Playwright / Chromatic

**Test:**
- Screenshot alle hovedsider
- Sammenlign før/etter
- Verifiser farger, spacing, typografi

#### 6.2 Accessibility Testing
**Sjekkliste:**
- [ ] Fargekontrast: WCAG AA (4.5:1)
- [ ] Keyboard navigation: Tab/Enter/Space
- [ ] Focus states: Tydelig outline
- [ ] Screen reader: ARIA labels
- [ ] Reduced motion: Respektert

**Verktøy:**
- Lighthouse audit
- axe DevTools
- Manual keyboard testing

#### 6.3 Cross-browser Testing
**Browsere:**
- Chrome (latest)
- Safari (latest)
- Firefox (latest)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

**Test:**
- Layout consistency
- Animation performance
- Font rendering
- Color accuracy

#### 6.4 Performance Testing
**Metrics:**
- First Contentful Paint < 1.5s
- Time to Interactive < 3.5s
- Total Bundle Size < 250kb (JS)
- Lighthouse Score > 90

**Deliverables:**
- Test rapport
- Bug fixes
- Performance optimalisering

---

## 🛠 Teknisk Arkitektur

### Filstruktur

```
apps/web/
├── public/
│   └── assets/
│       └── tier-golf/
│           ├── tier-golf-logo.svg
│           ├── tier-golf-logo-white.svg
│           └── tier-golf-icon.svg
├── src/
│   ├── components/
│   │   └── tier/              # TIER komponentbibliotek
│   │       ├── TierButton.jsx
│   │       ├── TierCard.jsx
│   │       ├── TierBadge.jsx
│   │       ├── TierInput.jsx
│   │       ├── TierProgress.jsx
│   │       ├── TierTooltip.jsx
│   │       ├── AchievementBadge.jsx
│   │       ├── StreakIndicator.jsx
│   │       ├── XPBar.jsx
│   │       ├── CategoryRing.jsx
│   │       ├── LevelIndicator.jsx
│   │       └── StatCard.jsx
│   ├── features/
│   │   ├── categories/        # Nytt: Kategori A-K
│   │   │   ├── CategoryOverview.jsx
│   │   │   ├── CategoryDetail.jsx
│   │   │   └── CategoryProgress.jsx
│   │   ├── badges/            # Oppdatert med TIER design
│   │   │   ├── BadgeGallery.jsx
│   │   │   ├── BadgeDetail.jsx
│   │   │   └── BadgeUnlockToast.jsx
│   │   └── dashboard/
│   │       └── AKGolfDashboard.jsx  # Redesignet
│   └── styles/
│       ├── tier-tokens.css    # Nytt: TIER design tokens
│       ├── tier-animations.css  # Nytt: Animations
│       └── index.css          # Oppdatert: Global styles
└── tailwind.config.js         # Oppdatert: TIER colors

```

### CSS Tokens Arkitektur

**Nytt: `src/styles/tier-tokens.css`**

```css
:root {
  /* === TIER GOLF CORE COLORS === */
  --tier-navy: 10 37 64;           /* #0A2540 */
  --tier-navy-light: 13 48 80;     /* #0D3050 */
  --tier-navy-dark: 6 24 41;       /* #061829 */
  --tier-gold: 201 162 39;         /* #C9A227 */
  --tier-gold-light: 212 181 69;   /* #D4B545 */
  --tier-gold-dark: 168 135 31;    /* #A8871F */
  --tier-white: 255 255 255;       /* #FFFFFF */

  /* === SURFACES === */
  --surface-primary: 255 255 255;
  --surface-secondary: 248 250 252;
  --surface-tertiary: 237 240 242;
  --surface-elevated: 255 255 255;

  /* === TEXT === */
  --text-primary: var(--tier-navy);
  --text-secondary: 71 85 105;     /* #475569 */
  --text-tertiary: 100 116 139;    /* #64748B */
  --text-muted: 148 163 184;       /* #94A3B8 */
  --text-inverse: var(--tier-white);

  /* === STATUS === */
  --status-success: 22 163 74;     /* #16A34A */
  --status-warning: 217 119 6;     /* #D97706 */
  --status-error: 220 38 38;       /* #DC2626 */
  --status-info: 37 99 235;        /* #2563EB */

  /* === CATEGORY COLORS (A-K) === */
  --category-a: 201 162 39;        /* Gold - Tour/Elite */
  --category-b: 184 150 15;
  --category-c: 166 138 0;
  --category-d: 100 116 139;       /* Silver - Nasjonalt */
  --category-e: 71 85 105;
  --category-f: 37 99 235;         /* Blue - Regionalt */
  --category-g: 59 130 246;
  --category-h: 22 163 74;         /* Green - Klubb */
  --category-i: 34 197 94;
  --category-j: 124 58 237;        /* Purple - Utvikling */
  --category-k: 139 92 246;

  /* === BADGE TIERS === */
  --tier-bronze: 176 141 87;       /* #B08D57 */
  --tier-silver: 138 155 168;      /* #8A9BA8 */
  --tier-gold-badge: var(--tier-gold);
  --tier-platinum: 229 228 226;    /* #E5E4E2 */
}
```

### Tailwind Config Snippet

```javascript
// tailwind.config.js
colors: {
  tier: {
    navy: {
      DEFAULT: 'rgb(var(--tier-navy) / <alpha-value>)',
      light: 'rgb(var(--tier-navy-light) / <alpha-value>)',
      dark: 'rgb(var(--tier-navy-dark) / <alpha-value>)',
    },
    gold: {
      DEFAULT: 'rgb(var(--tier-gold) / <alpha-value>)',
      light: 'rgb(var(--tier-gold-light) / <alpha-value>)',
      dark: 'rgb(var(--tier-gold-dark) / <alpha-value>)',
    },
    white: 'rgb(var(--tier-white) / <alpha-value>)',
  },
  category: {
    a: 'rgb(var(--category-a) / <alpha-value>)',
    b: 'rgb(var(--category-b) / <alpha-value>)',
    // ... c-k
  },
  'badge-tier': {
    bronze: 'rgb(var(--tier-bronze) / <alpha-value>)',
    silver: 'rgb(var(--tier-silver) / <alpha-value>)',
    gold: 'rgb(var(--tier-gold-badge) / <alpha-value>)',
    platinum: 'rgb(var(--tier-platinum) / <alpha-value>)',
  },
}
```

---

## 🔄 Migrerings-strategi

### Backwards Compatibility

**Approach:** Gradvis overgang med aliasing

```css
/* Bevare gamle tokens mens TIER introduseres */
:root {
  /* TIER tokens */
  --tier-navy: 10 37 64;
  --tier-gold: 201 162 39;

  /* Backwards compatibility aliases */
  --ak-primary: var(--tier-navy);
  --ak-gold: var(--tier-gold);
  --ak-forest: var(--tier-navy);  /* map old green to navy */
}
```

**Benefit:** Eksisterende komponenter fungerer fortsatt mens nye bruker TIER

### Feature Flags

**Implementer:** Environment variable for controlled rollout

```javascript
// .env
REACT_APP_TIER_DESIGN_ENABLED=true
```

```javascript
// src/config/features.js
export const FEATURES = {
  tierDesign: process.env.REACT_APP_TIER_DESIGN_ENABLED === 'true',
};
```

**Bruk:**
```javascript
import { FEATURES } from '@/config/features';

function Dashboard() {
  return FEATURES.tierDesign ? (
    <TierDashboard />
  ) : (
    <LegacyDashboard />
  );
}
```

### Incremental Rollout

**Steg:**
1. **Week 1-2:** Tokens + Foundations (ingen UI endring ennå)
2. **Week 3:** Komponenter (develop only)
3. **Week 4:** Dashboard (staging)
4. **Week 5-6:** Feature pages (staging)
5. **Week 7:** Polish + testing
6. **Week 8:** Production rollout (gradvis per route)

**Routes prioritering:**
1. `/dashboard` (mest synlig)
2. `/badges` (ny feature)
3. `/categories` (ny feature)
4. `/profile`
5. `/training`
6. `/tests`

---

## ✅ Testing & Kvalitetssikring

### Unit Tests
**Verktøy:** Jest + React Testing Library

**Test coverage:**
- TIER komponenter: 80%+
- Button interactions
- Form validation
- Progress calculations
- Badge unlock logic

```javascript
// Example: TierButton.test.jsx
describe('TierButton', () => {
  it('renders primary variant correctly', () => {
    render(<TierButton variant="primary">Click me</TierButton>);
    expect(screen.getByRole('button')).toHaveClass('bg-tier-navy');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<TierButton onClick={handleClick}>Click</TierButton>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Integration Tests
**Verktøy:** Playwright

**Test scenarios:**
- Badge unlock flow (API → Component → Animation)
- Category progress update
- XP bar animation on level up
- Streak counter increment

### E2E Tests
**Verktøy:** Playwright

**Critical paths:**
1. Login → Dashboard → Se badges
2. Complete test → Badge unlock notification
3. Navigate categories → View progress
4. Update profile → See level change

### Visual Regression Tests
**Verktøy:** Playwright screenshots / Percy

**Components:**
- All TIER components (36+ variants)
- Dashboard in 3 viewport sizes
- Light/dark mode (if implemented)

---

## ⚠️ Risiko & Tiltak

### Risiko 1: Fargekontrast problemer
**Sannsynlighet:** Medium
**Impact:** Høy (accessibility)

**Mitigering:**
- Kjør contrast checker på alle fargepar
- Test med axe DevTools
- Manual testing med screen reader

**Contingency:** Ha backup farger klare hvis kontrast feiler

---

### Risiko 2: Performance degradering
**Sannsynlighet:** Lav
**Impact:** Medium

**Mitigering:**
- Lazy load animasjoner
- Use CSS transforms (GPU-accelerated)
- Monitor bundle size

**Contingency:** Disable animations for low-end devices

---

### Risiko 3: Browser compatibility issues
**Sannsynlighet:** Medium
**Impact:** Medium

**Mitigering:**
- Test i alle major browsers
- Use PostCSS autoprefixer
- Polyfills for older browsers

**Contingency:** Graceful degradation på eldre browsere

---

### Risiko 4: Breaking changes i eksisterende features
**Sannsynlighet:** Høy
**Impact:** Høy

**Mitigering:**
- Comprehensive regression testing
- Backwards compatibility layer
- Feature flags for rollback

**Contingency:** Instant rollback via feature flag

---

## 📦 Leveranser

### Fase 1: Foundation
- ✅ `tier-tokens.css` - TIER design tokens
- ✅ `tailwind.config.js` - Updated config
- ✅ Logo assets in `/public`
- ✅ Typography setup (Google Fonts)
- ✅ Migration guide (denne filen)

### Fase 2: Components
- ✅ 12+ TIER base components
- ✅ 5+ Gamification components
- ✅ Component documentation
- ✅ Storybook stories (optional)

### Fase 3: Features
- ✅ Dashboard redesigned
- ✅ Badge system implemented
- ✅ Category A-K pages
- ✅ Navigation updated

### Fase 4: Migration
- ✅ All CSS migrated to TIER tokens
- ✅ All components using TIER styles
- ✅ Dark mode support (optional)

### Fase 5: Polish
- ✅ Animations implemented
- ✅ Micro-interactions
- ✅ Accessibility compliant

### Fase 6: QA
- ✅ Test suite passing
- ✅ Performance benchmarks met
- ✅ Cross-browser tested
- ✅ Production ready

---

## 📚 Referanser

### Design System Dokumentasjon
- [TIER_GOLF_DESIGN_SYSTEM.md](/Users/anderskristiansen/Downloads/TIER_GOLF_DESIGN_SYSTEM.md)

### Logo Assets
- `tier-golf-logo.svg`
- `tier-golf-logo-white.svg`
- `tier-golf-icon.svg`

### Eksterne Resurser
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Radix UI](https://radix-ui.com)
- [Lucide Icons](https://lucide.dev)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

## 🎉 Neste Steg

1. **Review** denne planen med team
2. **Godkjenn** design system approach
3. **Start** med Fase 1 (Foundation)
4. **Daily** check-ins for progress tracking
5. **Weekly** demo av nye komponenter

**Estimert ferdigstillelse:** 8 uker fra start

---

**Laget av:** Claude Code
**Versjon:** 1.0
**Sist oppdatert:** Januar 2025
