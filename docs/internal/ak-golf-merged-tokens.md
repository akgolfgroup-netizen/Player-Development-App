# AK GOLF MERGED DESIGN TOKENS
## Base: TIER Golf v2.1 + Additions from Untitled UI v2.0

---

## MERGE SUMMARY

| Source | Kept | Added | Replaced |
|--------|------|-------|----------|
| **TIER Golf** (base) | ✅ All brand colors | — | — |
| **TIER Golf** | ✅ All semantic colors | — | — |
| **TIER Golf** | ✅ Apple HIG typography | — | — |
| **TIER Golf** | ✅ Icon specs | — | — |
| **Untitled UI** | — | ✅ Gray scale (50-700) | — |
| **Untitled UI** | — | ✅ Spacing system (4px base) | — |
| **Untitled UI** | — | ✅ Shadow definitions | — |
| **Untitled UI** | — | ✅ Border radius options | — |

---

## TOKEN LIST

### 🎨 Brand Colors (TIER Golf - PRESERVED)

| Token | Name | Value | Role |
|-------|------|-------|------|
| `brand.ink` | Jet Black | `#02060D` | Primary ink/text |
| `brand.primary` | Current | `#10456A` | Main brand blue |
| `brand.background` | Snow | `#EDF0F2` | Page background |
| `brand.surface` | Light Khaki | `#EBE5DA` | Card surfaces |
| `brand.accent` | Gold | `#C9A227` | Accent highlights |

### 🔘 Gray Scale (ADDED from Untitled UI)

| Token | Value | Usage |
|-------|-------|-------|
| `gray.50` | `#F9FAFB` | Lightest gray |
| `gray.100` | `#F2F4F7` | Light gray |
| `gray.300` | `#D5D7DA` | Borders |
| `gray.500` | `#8E8E93` | iOS secondary text |
| `gray.600` | `#535862` | Tertiary text |
| `gray.700` | `#414651` | Secondary text |
| `gray.900` | `#1C1C1E` | iOS dark text |

### ✅ Status Colors (TIER Golf - PRESERVED)

| Token | Value | Usage |
|-------|-------|-------|
| `status.success` | `#4A7C59` | Fullført, Positiv |
| `status.warning` | `#D4A84B` | Advarsel, Pågår |
| `status.error` | `#C45B4E` | Feil, Negativ |

---

### 🔤 Typography (TIER Golf Apple HIG - PRESERVED)

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

**Fonts:**
- Primary: Inter
- Logo: DM Sans Light

---

### 📐 Spacing (ADDED from Untitled UI)

| Token | Value | Rem |
|-------|-------|-----|
| `spacing.1` | 4px | 0.25rem |
| `spacing.2` | 8px | 0.5rem |
| `spacing.3` | 12px | 0.75rem |
| `spacing.4` | 16px | 1rem |
| `spacing.5` | 20px | 1.25rem |
| `spacing.6` | 24px | 1.5rem |
| `spacing.8` | 32px | 2rem |
| `spacing.10` | 40px | 2.5rem |
| `spacing.12` | 48px | 3rem |
| `spacing.16` | 64px | 4rem |
| `spacing.20` | 80px | 5rem |

**Base unit:** 4px (alle verdier er multiplum av 4)

---

### 🔲 Border Radius (MERGED)

| Token | Value | Source |
|-------|-------|--------|
| `radius.sm` | 8px | Untitled UI |
| `radius.md` | 12px | Combined |
| `radius.lg` | 16px | TIER Golf icons |
| `radius.full` | 999px | Pills/avatars |

---

### 🌑 Shadows (MERGED)

| Token | Value | Source |
|-------|-------|--------|
| `shadow.card` | `0 2px 4px rgba(0,0,0,0.06)` | TIER Golf |
| `shadow.sm` | Multi-layer soft shadow | Untitled UI |

---

### 🎯 Icon Specs (TIER Golf - PRESERVED)

| Property | Value |
|----------|-------|
| Size | 24px |
| Stroke | 1.5px |
| Caps | Round |

---

## SEMANTIC TOKEN MAPPING

### Background
```
background.default  → Snow (#EDF0F2)
background.surface  → Light Khaki (#EBE5DA)
background.inverse  → Jet Black (#02060D)
background.accent   → Current (#10456A)
background.white    → White (#FFFFFF)
```

### Text
```
text.primary   → Jet Black (#02060D)
text.secondary → iOS Gray (#8E8E93)
text.tertiary  → Untitled Gray (#535862)
text.brand     → Current (#10456A)
text.inverse   → White (#FFFFFF)
text.accent    → Gold (#C9A227)
```

### Border
```
border.default → Untitled Gray (#D5D7DA)
border.subtle  → iOS Light (#E5E5EA)
border.brand   → Current (#10456A)
border.accent  → Gold (#C9A227)
```

### Status
```
status.success.default → #4A7C59
status.warning.default → #D4A84B
status.error.default   → #C45B4E
```

---

## TOTAL TOKEN COUNT

| Category | Count |
|----------|-------|
| Brand Colors | 5 |
| Gray Scale | 7 |
| Status Colors | 3 |
| Typography Sizes | 10 |
| Typography Styles | 10 |
| Spacing | 11 |
| Border Radius | 4 |
| Shadows | 2 |
| Icon Specs | 2 |
| Semantic Colors | 14 |
| **TOTAL** | **68 tokens** |

---

## CSS CUSTOM PROPERTIES

```css
:root {
  /* TIER Golf Brand Colors */
  --ak-jet-black: #02060D;
  --ak-current: #10456A;
  --ak-snow: #EDF0F2;
  --ak-light-khaki: #EBE5DA;
  --ak-gold: #C9A227;
  
  /* Gray Scale (from Untitled UI) */
  --gray-50: #F9FAFB;
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
  --spacing-6: 24px;
  --spacing-8: 32px;
  
  /* Border Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-full: 999px;
  
  /* Icons */
  --icon-size: 24px;
  --icon-stroke: 1.5px;
}
```

---

*Merged: TIER Golf Design System v2.1 + Untitled UI v2.0*
*Date: 2025-12-18*
