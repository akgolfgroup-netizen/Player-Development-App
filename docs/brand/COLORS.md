# TIER Golf Color System

## Brand Colors

### Primary Palette

| Name | Hex | RGB | CSS Variable |
|------|-----|-----|--------------|
| Brand Primary | `#1A3D2E` | 26, 61, 46 | `--color-brand-primary` |
| Brand Gold | `#C9A227` | 201, 162, 39 | `--color-brand-gold` |
| Brand Light | `#4A7C59` | 74, 124, 89 | `--color-brand-light` |

### Semantic Colors

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--ak-surface-page` | `#FAFAF9` | `#0C0A09` | Page background |
| `--ak-surface-card` | `#FFFFFF` | `#1C1917` | Card background |
| `--ak-surface-elevated` | `#FFFFFF` | `#292524` | Elevated surfaces |
| `--ak-text-primary` | `#1C1917` | `#FAFAF5` | Primary text |
| `--ak-text-secondary` | `#57534E` | `#A8A29E` | Secondary text |
| `--ak-text-muted` | `#A8A29E` | `#78716C` | Muted text |
| `--ak-border-default` | `#E7E5E4` | `#44403C` | Default borders |

### Status Colors

| Status | Color | Hex | Usage |
|--------|-------|-----|-------|
| Success | Emerald | `#059669` | Positive actions, completion |
| Warning | Amber | `#D97706` | Warnings, attention needed |
| Error | Red | `#DC2626` | Errors, destructive actions |
| Info | Blue | `#2563EB` | Information, links |

### Session Type Colors

| Type | Color | Hex | Norwegian |
|------|-------|-----|-----------|
| Teknikk | Blue | `#2C5F7F` | Teknisk trening |
| Golfslag | Green | `#4A7C59` | Langspill/kortspill |
| Spill | Dark Blue | `#10456A` | Spilltrening |
| Konkurranse | Gold | `#C9A227` | Turneringer |
| Fysisk | Orange | `#D4A84B` | Fysisk trening |
| Mental | Gray | `#8E8E93` | Mental trening |

### Learning Phase Colors (L1-L5)

| Phase | Name | Color | Hex |
|-------|------|-------|-----|
| L1 | Ball | Red | `#EF4444` |
| L2 | Teknikk | Orange | `#F97316` |
| L3 | Overføring | Yellow | `#EAB308` |
| L4 | Variasjon | Green | `#22C55E` |
| L5 | Spill | Blue | `#3B82F6` |

### Category Colors (A-K)

| Category | Color | Hex |
|----------|-------|-----|
| A | Emerald | `#059669` |
| B | Teal | `#0D9488` |
| C | Cyan | `#0891B2` |
| D | Sky | `#0284C7` |
| E | Blue | `#2563EB` |
| F | Indigo | `#4F46E5` |
| G | Violet | `#7C3AED` |
| H | Purple | `#9333EA` |
| I | Fuchsia | `#C026D3` |
| J | Pink | `#DB2777` |
| K | Rose | `#E11D48` |

## Color Contrast

All color combinations must meet WCAG 2.1 AA standards:
- **Normal text:** 4.5:1 minimum contrast ratio
- **Large text:** 3:1 minimum contrast ratio
- **UI components:** 3:1 minimum contrast ratio

### Verified Combinations

| Background | Text | Ratio | Pass |
|------------|------|-------|------|
| `#FAFAF9` | `#1C1917` | 16.5:1 | AAA |
| `#1A3D2E` | `#FAFAF9` | 10.2:1 | AAA |
| `#FFFFFF` | `#57534E` | 7.1:1 | AAA |
| `#1A3D2E` | `#C9A227` | 5.8:1 | AA |

## Usage in Code

### CSS Variables
```css
.card {
  background: var(--ak-surface-card);
  color: var(--ak-text-primary);
  border: 1px solid var(--ak-border-default);
}
```

### Tailwind Classes
```html
<div class="bg-surface-card text-primary border-default">
  Content
</div>
```
