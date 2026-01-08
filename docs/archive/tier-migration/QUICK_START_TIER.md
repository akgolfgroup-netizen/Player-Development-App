# TIER Golf Design System - Quick Start Guide

## 🚀 Kom i gang på 15 minutter

Denne guiden hjelper deg med å implementere TIER Golf Design System i eksisterende komponenter.

---

## 1. Installer avhengigheter (1 min)

```bash
# Installer Google Fonts (optional - kan også bruke CDN)
npm install @fontsource/inter @fontsource/dm-sans
```

---

## 2. Kopier logo-filer (1 min)

```bash
# Fra prosjektrot
mkdir -p apps/web/public/assets/tier-golf
cp ~/Downloads/tier-golf-logo.svg apps/web/public/assets/tier-golf/
cp ~/Downloads/tier-golf-logo-white.svg apps/web/public/assets/tier-golf/
cp ~/Downloads/tier-golf-icon.svg apps/web/public/assets/tier-golf/
```

---

## 3. Opprett TIER tokens fil (2 min)

**Fil:** `apps/web/src/styles/tier-tokens.css`

```css
/* TIER Golf Design Tokens */
:root {
  /* === CORE COLORS (RGB format for Tailwind alpha) === */
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

  /* === TEXT === */
  --text-primary: var(--tier-navy);
  --text-secondary: 71 85 105;
  --text-tertiary: 100 116 139;
  --text-muted: 148 163 184;

  /* === STATUS === */
  --status-success: 22 163 74;
  --status-warning: 217 119 6;
  --status-error: 220 38 38;
  --status-info: 37 99 235;

  /* === CATEGORY COLORS (A-K) === */
  --category-a: 201 162 39;   /* Gold - Elite */
  --category-b: 184 150 15;
  --category-c: 166 138 0;
  --category-d: 100 116 139;  /* Silver - Nasjonalt */
  --category-e: 71 85 105;
  --category-f: 37 99 235;    /* Blue - Regionalt */
  --category-g: 59 130 246;
  --category-h: 22 163 74;    /* Green - Klubb */
  --category-i: 34 197 94;
  --category-j: 124 58 237;   /* Purple - Utvikling */
  --category-k: 139 92 246;

  /* === BADGE TIERS === */
  --tier-bronze: 176 141 87;
  --tier-silver: 138 155 168;
  --tier-platinum: 229 228 226;
}
```

**Import** i `apps/web/src/index.css`:
```css
@import './styles/tier-tokens.css';
```

---

## 4. Oppdater Tailwind Config (3 min)

**Fil:** `apps/web/tailwind.config.js`

**Legg til** i `extend.colors`:

```javascript
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
  c: 'rgb(var(--category-c) / <alpha-value>)',
  d: 'rgb(var(--category-d) / <alpha-value>)',
  e: 'rgb(var(--category-e) / <alpha-value>)',
  f: 'rgb(var(--category-f) / <alpha-value>)',
  g: 'rgb(var(--category-g) / <alpha-value>)',
  h: 'rgb(var(--category-h) / <alpha-value>)',
  i: 'rgb(var(--category-i) / <alpha-value>)',
  j: 'rgb(var(--category-j) / <alpha-value>)',
  k: 'rgb(var(--category-k) / <alpha-value>)',
},
'badge-tier': {
  bronze: 'rgb(var(--tier-bronze) / <alpha-value>)',
  silver: 'rgb(var(--tier-silver) / <alpha-value>)',
  gold: 'rgb(var(--tier-gold) / <alpha-value>)',
  platinum: 'rgb(var(--tier-platinum) / <alpha-value>)',
},
```

---

## 5. Opprett din første TIER komponent (5 min)

**Fil:** `apps/web/src/components/tier/TierButton.jsx`

```jsx
import React from 'react';
import { cn } from '@/lib/utils'; // Tailwind merge utility

const variants = {
  primary: 'bg-tier-navy text-tier-white hover:bg-tier-navy-light active:bg-tier-navy-dark',
  secondary: 'bg-tier-gold text-tier-navy hover:bg-tier-gold-light active:bg-tier-gold-dark',
  outline: 'border-2 border-tier-navy text-tier-navy hover:bg-tier-navy hover:text-tier-white',
  ghost: 'text-tier-navy hover:bg-gray-100',
};

const sizes = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};

export function TierButton({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2',
        'font-semibold tracking-wide rounded-lg',
        'transition-all duration-150 ease-in-out',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-tier-navy focus-visible:outline-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
```

**Test den:**

```jsx
import { TierButton } from '@/components/tier/TierButton';

function Demo() {
  return (
    <div className="flex gap-4">
      <TierButton variant="primary">Primary</TierButton>
      <TierButton variant="secondary">Secondary</TierButton>
      <TierButton variant="outline">Outline</TierButton>
      <TierButton variant="ghost">Ghost</TierButton>
    </div>
  );
}
```

---

## 6. Bruk TIER farger i eksisterende komponenter (3 min)

### Før:
```jsx
<div className="bg-green-600 text-white">
  <h1 className="text-2xl font-bold">Dashboard</h1>
</div>
```

### Etter:
```jsx
<div className="bg-tier-navy text-tier-white">
  <h1 className="text-2xl font-bold">Dashboard</h1>
</div>
```

### Med opacity:
```jsx
<div className="bg-tier-gold/10 border border-tier-gold/30">
  <p className="text-tier-navy">Gold accent card</p>
</div>
```

---

## 7. Kategori A-K farger (eksempel)

```jsx
const categoryColors = {
  A: 'bg-category-a',
  B: 'bg-category-b',
  C: 'bg-category-c',
  D: 'bg-category-d',
  E: 'bg-category-e',
  F: 'bg-category-f',
  G: 'bg-category-g',
  H: 'bg-category-h',
  I: 'bg-category-i',
  J: 'bg-category-j',
  K: 'bg-category-k',
};

function CategoryBadge({ category }) {
  return (
    <div className={cn(
      'w-12 h-12 rounded-full flex items-center justify-center',
      'text-white font-bold text-xl',
      categoryColors[category]
    )}>
      {category}
    </div>
  );
}
```

---

## 8. TIER Card komponent (bonus)

```jsx
export function TierCard({ children, className, elevated = false, ...props }) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-gray-200 p-4',
        'transition-shadow duration-200',
        elevated && 'shadow-md hover:shadow-lg',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Med kategori accent
export function CategoryCard({ category, children, className, ...props }) {
  const categoryColors = {
    A: 'border-t-category-a',
    B: 'border-t-category-b',
    // ... etc
  };

  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-gray-200',
        'border-t-4', // Tjukkere top border
        categoryColors[category],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
```

---

## 9. Typografi Quick Reference

```jsx
// Headers (DM Sans - bold)
<h1 className="font-logo text-5xl font-bold text-tier-navy">TIER Golf</h1>
<h2 className="font-logo text-4xl font-bold text-tier-navy">Dashboard</h2>

// Body (Inter - regular)
<p className="text-base text-text-secondary leading-relaxed">
  Dette er brødtekst med Inter font
</p>

// Labels (Inter - medium)
<label className="text-sm font-medium text-tier-navy tracking-wide">
  Navn
</label>

// Caption (Inter - regular, small)
<span className="text-xs text-text-muted">
  Valgfri hjelpetekst
</span>
```

---

## 10. Sjekkliste før commit

- [ ] Alle farger bruker TIER tokens (ikke hardkodede hex)
- [ ] Komponenten er responsiv (mobile-first)
- [ ] Focus states er synlige (keyboard navigation)
- [ ] Hover states er definert
- [ ] Disabled states håndteres
- [ ] TypeScript types er definert (hvis TS)
- [ ] Component er testet visuelt
- [ ] Accessibility: ARIA labels hvor nødvendig

---

## 🎨 Fargepalett Cheat Sheet

### Primære farger
- **Navy:** `bg-tier-navy` / `text-tier-navy`
- **Gold:** `bg-tier-gold` / `text-tier-gold`
- **White:** `bg-tier-white` / `text-tier-white`

### Status farger
- **Success:** `bg-status-success` / `text-status-success` (grønn)
- **Warning:** `bg-status-warning` / `text-status-warning` (oransje)
- **Error:** `bg-status-error` / `text-status-error` (rød)
- **Info:** `bg-status-info` / `text-status-info` (blå)

### Kategori A-K
- **A-C (Elite):** Gull-toner (`bg-category-a`)
- **D-E (Nasjonalt):** Sølv-toner (`bg-category-d`)
- **F-G (Regionalt):** Blå-toner (`bg-category-f`)
- **H-I (Klubb):** Grønn-toner (`bg-category-h`)
- **J-K (Utvikling):** Lilla-toner (`bg-category-j`)

### Badge Tiers
- **Bronze:** `bg-badge-tier-bronze`
- **Silver:** `bg-badge-tier-silver`
- **Gold:** `bg-badge-tier-gold`
- **Platinum:** `bg-badge-tier-platinum`

---

## 📦 Komponenter å lage først

### Prioritet 1 (Critical)
1. `TierButton` - Buttons (primary, secondary, outline, ghost)
2. `TierCard` - Cards med variants
3. `TierInput` - Form inputs

### Prioritet 2 (High)
4. `TierBadge` - Status badges
5. `TierProgress` - Progress bars
6. `CategoryRing` - Circular category progress

### Prioritet 3 (Medium)
7. `AchievementBadge` - Unlockable badges
8. `StreakIndicator` - Training streak
9. `XPBar` - Experience/level bar
10. `LevelIndicator` - Player level circle

---

## 🔗 Neste steg

1. Les full dokumentasjon: [TIER_GOLF_IMPLEMENTATION_PLAN.md](./TIER_GOLF_IMPLEMENTATION_PLAN.md)
2. Design system referanse: [TIER_GOLF_DESIGN_SYSTEM.md](/Users/anderskristiansen/Downloads/TIER_GOLF_DESIGN_SYSTEM.md)
3. Start med Fase 1 (Foundation) fra implementasjonsplanen

---

## ❓ Spørsmål?

- Sjekk design system dokumentasjonen
- Se eksempler i `/apps/web/src/components/tier/`
- Test i browser med developer tools (inspiser CSS variables)

---

**Happy coding! ⛳️**
