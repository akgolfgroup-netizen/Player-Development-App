# AK GOLF ACADEMY — DESIGN SYSTEM v3.0
## Blue Palette 01 (Production Ready)

**Status**: ✅ Production Ready  
**Last Updated**: December 18, 2025  
**Source**: Merged from AK Golf Design Tokens v2.1 + Untitled UI v2.0 + Blue Palette Migration

---

## QUICK REFERENCE

| Role | Token | Hex | Preview |
|------|-------|-----|---------|
| **Primary** | `brand.primary` | `#10456A` | 🔵 |
| **Ink/Text** | `brand.ink` | `#02060D` | ⬛ |
| **Background** | `brand.background` | `#EDF0F2` | ⬜ |
| **Surface** | `brand.surface` | `#EBE5DA` | 🟫 |
| **Accent** | `brand.accent` | `#C9A227` | 🟡 |

---

## 1. BRAND COLORS

### Primary Palette

| Token | Name | Value | Role | Contrast |
|-------|------|-------|------|----------|
| `brand.ink` | Jet Black | `#02060D` | Primary text | — |
| `brand.primary` | Current Blue | `#10456A` | Main brand color | 7.36:1 on white |
| `brand.primaryLight` | Light Blue | `#2C5F7F` | Hover states | — |
| `brand.background` | Snow | `#EDF0F2` | Page background | — |
| `brand.surface` | Light Khaki | `#EBE5DA` | Card surfaces | — |
| `brand.accent` | Gold | `#C9A227` | Highlights, badges | — |
| `brand.white` | White | `#FFFFFF` | Inverse text | — |

### Legacy Aliases (Backwards Compatible)

| Old Token | Maps To | Value |
|-----------|---------|-------|
| `forest` | `primary` | `#10456A` |
| `foam` | `snow` | `#EDF0F2` |
| `ivory` | `surface` | `#EBE5DA` |

---

## 2. GRAY SCALE

| Token | Value | Usage |
|-------|-------|-------|
| `gray.50` | `#F9FAFB` | Lightest backgrounds |
| `gray.100` | `#F2F4F7` | Light backgrounds |
| `gray.300` | `#D5D7DA` | Borders, dividers |
| `gray.500` | `#8E8E93` | Secondary text (iOS) |
| `gray.600` | `#535862` | Tertiary text |
| `gray.700` | `#414651` | Secondary text |
| `gray.900` | `#1C1C1E` | Dark text (iOS) |

---

## 3. STATUS COLORS

| Token | Value | Usage |
|-------|-------|-------|
| `status.success` | `#4A7C59` | Fullført, Positiv |
| `status.warning` | `#D4A84B` | Advarsel, Pågår |
| `status.error` | `#C45B4E` | Feil, Negativ |

---

## 4. TYPOGRAPHY

### Font Stack

```
Primary: Inter, -apple-system, sans-serif
Logo: DM Sans Light
```

### Type Scale (Apple HIG)

| Style | Size | Line Height | Weight |
|-------|------|-------------|--------|
| Large Title | 34px | 41px | Bold (700) |
| Title 1 | 28px | 34px | Bold (700) |
| Title 2 | 22px | 28px | Bold (700) |
| Title 3 | 20px | 25px | Semibold (600) |
| Headline | 17px | 22px | Semibold (600) |
| **Body** | **17px** | **22px** | **Regular (400)** |
| Subheadline | 15px | 20px | Regular (400) |
| Footnote | 13px | 18px | Regular (400) |
| Caption 1 | 12px | 16px | Regular (400) |
| Caption 2 | 11px | 13px | Regular (400) |

---

## 5. SPACING

**Base unit**: 4px (alle verdier er multiplum av 4)

| Token | Value | Rem | Usage |
|-------|-------|-----|-------|
| `spacing.1` | 4px | 0.25rem | Micro gaps |
| `spacing.2` | 8px | 0.5rem | Tight spacing |
| `spacing.3` | 12px | 0.75rem | Small gaps |
| `spacing.4` | 16px | 1rem | Default padding |
| `spacing.5` | 20px | 1.25rem | Medium gaps |
| `spacing.6` | 24px | 1.5rem | Section spacing |
| `spacing.8` | 32px | 2rem | Large gaps |
| `spacing.10` | 40px | 2.5rem | XL spacing |
| `spacing.12` | 48px | 3rem | Section breaks |
| `spacing.16` | 64px | 4rem | Page margins |
| `spacing.20` | 80px | 5rem | Hero sections |

---

## 6. BORDER RADIUS

| Token | Value | Usage |
|-------|-------|-------|
| `radius.sm` | 8px | Buttons, inputs |
| `radius.md` | 12px | Cards, modals |
| `radius.lg` | 16px | Large cards |
| `radius.full` | 999px | Pills, avatars |

---

## 7. SHADOWS

| Token | Value | Usage |
|-------|-------|-------|
| `shadow.card` | `0 2px 4px rgba(0,0,0,0.06)` | Card elevation |
| `shadow.sm` | Multi-layer soft | Subtle depth |

---

## 8. ICONS

| Property | Value |
|----------|-------|
| Size | 24px |
| Stroke | 1.5px |
| Caps | Round |

---

## 9. SEMANTIC TOKENS

### Backgrounds
```
background.default  → #EDF0F2 (Snow)
background.surface  → #EBE5DA (Light Khaki)
background.inverse  → #02060D (Jet Black)
background.accent   → #10456A (Current Blue)
background.white    → #FFFFFF
```

### Text
```
text.primary   → #02060D (Jet Black)
text.secondary → #8E8E93 (iOS Gray)
text.tertiary  → #535862 (Untitled Gray)
text.brand     → #10456A (Current Blue)
text.inverse   → #FFFFFF
text.accent    → #C9A227 (Gold)
```

### Borders
```
border.default → #D5D7DA (Gray 300)
border.subtle  → #E5E5EA (iOS Light)
border.brand   → #10456A (Current Blue)
border.accent  → #C9A227 (Gold)
```

---

## 10. CSS CUSTOM PROPERTIES

```css
:root {
  /* ═══════════════════════════════════════════
     AK GOLF ACADEMY - CSS VARIABLES
     Blue Palette 01 (Production)
     ═══════════════════════════════════════════ */

  /* Brand Colors */
  --ak-ink: #02060D;
  --ak-primary: #10456A;
  --ak-primary-light: #2C5F7F;
  --ak-snow: #EDF0F2;
  --ak-surface: #EBE5DA;
  --ak-gold: #C9A227;

  /* Legacy Aliases (Backwards Compatible) */
  --ak-forest: #10456A;
  --ak-foam: #EDF0F2;
  --ak-ivory: #EBE5DA;

  /* Gray Scale */
  --gray-50: #F9FAFB;
  --gray-100: #F2F4F7;
  --gray-300: #D5D7DA;
  --gray-500: #8E8E93;
  --gray-600: #535862;
  --gray-700: #414651;
  --gray-900: #1C1C1E;

  /* Status Colors */
  --ak-success: #4A7C59;
  --ak-warning: #D4A84B;
  --ak-error: #C45B4E;

  /* Typography */
  --font-family: 'Inter', -apple-system, sans-serif;
  --font-logo: 'DM Sans', sans-serif;

  /* Spacing */
  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 12px;
  --spacing-4: 16px;
  --spacing-5: 20px;
  --spacing-6: 24px;
  --spacing-8: 32px;
  --spacing-10: 40px;
  --spacing-12: 48px;
  --spacing-16: 64px;
  --spacing-20: 80px;

  /* Border Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-full: 999px;

  /* Shadows */
  --shadow-card: 0 2px 4px rgba(0,0,0,0.06);

  /* Icons */
  --icon-size: 24px;
  --icon-stroke: 1.5px;
}
```

---

## 11. JAVASCRIPT TOKENS

```javascript
export const tokens = {
  colors: {
    // Brand
    ink: '#02060D',
    primary: '#10456A',
    primaryLight: '#2C5F7F',
    snow: '#EDF0F2',
    surface: '#EBE5DA',
    gold: '#C9A227',
    white: '#FFFFFF',

    // Legacy aliases
    forest: '#10456A',
    foam: '#EDF0F2',
    ivory: '#EBE5DA',

    // Gray scale
    gray50: '#F9FAFB',
    gray100: '#F2F4F7',
    gray300: '#D5D7DA',
    gray500: '#8E8E93',
    gray600: '#535862',
    gray700: '#414651',
    gray900: '#1C1C1E',

    // Status
    success: '#4A7C59',
    warning: '#D4A84B',
    error: '#C45B4E',
  },

  typography: {
    fontFamily: "'Inter', -apple-system, sans-serif",
    fontLogo: "'DM Sans', sans-serif",
  },

  spacing: {
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
    20: '80px',
  },

  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    full: '999px',
  },

  shadows: {
    card: '0 2px 4px rgba(0,0,0,0.06)',
  },

  icons: {
    size: '24px',
    stroke: '1.5px',
  },
};
```

---

## 12. TOKEN COUNT

| Category | Count |
|----------|-------|
| Brand Colors | 7 |
| Legacy Aliases | 3 |
| Gray Scale | 7 |
| Status Colors | 3 |
| Typography Styles | 10 |
| Spacing Values | 11 |
| Border Radius | 4 |
| Shadows | 2 |
| Icon Specs | 2 |
| Semantic Tokens | 14 |
| **TOTAL** | **63 unique tokens** |

---

## 13. USAGE EXAMPLES

### React Component
```jsx
import { tokens } from './design-tokens';

const Card = ({ children }) => (
  <div style={{
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.md,
    padding: tokens.spacing[4],
    boxShadow: tokens.shadows.card,
  }}>
    {children}
  </div>
);
```

### CSS
```css
.button-primary {
  background-color: var(--ak-primary);
  color: white;
  border-radius: var(--radius-sm);
  padding: var(--spacing-2) var(--spacing-4);
}

.button-primary:hover {
  background-color: var(--ak-primary-light);
}
```

### Tailwind (Custom Config)
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'ak-primary': '#10456A',
        'ak-snow': '#EDF0F2',
        'ak-surface': '#EBE5DA',
        'ak-gold': '#C9A227',
        'ak-ink': '#02060D',
      }
    }
  }
}
```

---

## 14. MIGRATION NOTES

### From Forest Theme → Blue Palette

| Old | New | Action |
|-----|-----|--------|
| `#1A3D2E` | `#10456A` | Auto-migrated |
| `#2D5A45` | `#2C5F7F` | Auto-migrated |
| `#F5F7F6` | `#EDF0F2` | Auto-migrated |
| `#FDFCF8` | `#EBE5DA` | Auto-migrated |

**Backwards compatibility**: All `tokens.colors.forest`, `tokens.colors.foam`, and `tokens.colors.ivory` references continue to work.

---

## 15. ACCESSIBILITY

| Combination | Contrast | WCAG |
|-------------|----------|------|
| Primary on White | 7.36:1 | AAA ✅ |
| Ink on Snow | 17.4:1 | AAA ✅ |
| White on Primary | 7.36:1 | AAA ✅ |
| Gold on Ink | 8.2:1 | AAA ✅ |

---

**AK Golf Academy Design System v3.0**  
*Blue Palette 01 — Production Ready*
