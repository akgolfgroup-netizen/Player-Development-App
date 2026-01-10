# Dashboard Pro UI Refactor

**Date:** January 2026
**Purpose:** Enterprise/Performance Intelligence styling for golf analytics dashboard

---

## Summary

This refactor transforms the dashboard from a consumer-app aesthetic to a professional, enterprise-grade analytics interface. The changes focus on clear information hierarchy, semantic color usage, and precise number presentation.

---

## Before vs After

### Information Hierarchy

| Aspect | Before | After |
|--------|--------|-------|
| KPI Treatment | All cards equally sized | 3-tier hierarchy (Primary > Secondary > Tertiary) |
| Visual Weight | Uniform styling across metrics | Primary KPI dominates, secondary supports, tertiary provides detail |
| Color Usage | Decorative (gold accents everywhere) | Semantic (green=positive, red=negative, gray=neutral) |

### Design Tokens

| Token | Before | After |
|-------|--------|-------|
| Border Radius | 8-12px (rounded) | 4-8px (sharper, more professional) |
| Shadows | Standard shadow-sm/md | Subtle shadow + border emphasis |
| Spacing | Uniform padding | More whitespace between sections, tighter inside cards |
| Typography | Mixed fonts | Tabular numbers for KPIs, consistent label styling |

### Number Formatting

| Format | Before | After |
|--------|--------|-------|
| Strokes Gained | `1.85` or `+1.85` | `+1.85 SG` (consistent sign, suffix) |
| Delta/Trend | `+0.23` | `Δ30d +0.23/round` |
| Percentile | `85%` | `85th percentile` |
| Benchmark | None | `vs Category B +0.60` |

---

## Files Created

### 1. Design Tokens
**`src/styles/dashboard-pro.css`**
- Pro dashboard spacing variables
- Reduced border radius (10-20% smaller)
- Subtle shadows with border emphasis
- KPI hierarchy tokens (primary/secondary/tertiary sizes)
- Semantic color system (positive/negative/neutral)
- Utility classes for KPI values

### 2. Formatting Utilities
**`src/utils/sgFormatting.ts`**
- `formatSG(value, options)` - Format Strokes Gained with sign and decimals
- `formatDelta(value, period, unit)` - Format change values (Δ30d +0.23/round)
- `formatPercentile(value, style)` - Format percentile (85th or Top 15%)
- `formatVsBenchmark(value, benchmark, label)` - Format comparisons
- `getSGSemantic(value)` - Get semantic classification (positive/negative/neutral)
- `getSGColorClass(value)` - Get CSS class for semantic coloring
- `getSGColorStyle(value)` - Get inline style for semantic coloring

### 3. Card Components
**`src/components/dashboard/cards/PrimaryKPICard.tsx`**
- Hero-level KPI display for Total Strokes Gained
- Large value (56px), high contrast
- Built-in trend indicator, delta, percentile support
- Semantic coloring based on value

**`src/components/dashboard/cards/InsightCard.tsx`**
- Secondary metrics (Delta, Percentile, vs Benchmark)
- Moderate size (28px value)
- Clean, focused design with icon support

**`src/components/dashboard/cards/DiagnosticCard.tsx`**
- Tertiary breakdown cards (Tee, Approach, Short, Putting)
- Compact layout (24px value)
- Includes benchmark comparison
- Semantic indicator dot

**`src/components/dashboard/cards/index.ts`**
- Barrel exports for all card components

### 4. Pro Dashboard
**`src/features/strokes-gained/StrokesGainedDashboardPro.tsx`**
- Complete implementation using new card hierarchy
- Clear visual structure:
  1. Primary: Total SG (hero card)
  2. Secondary: 3-card grid (Delta, Percentile, vs Category)
  3. Tertiary: 4-card grid (Tee, Approach, Short, Putting)
  4. List: Recent tests with semantic coloring

---

## Files Modified

### `src/index.css`
- Added import for `dashboard-pro.css`

---

## Design Principles Applied

### 1. Information Hierarchy
```
┌─────────────────────────────────────────┐
│  PRIMARY KPI (56px, dominant)           │
│  Total Strokes Gained: +1.80            │
└─────────────────────────────────────────┘

┌───────────┬───────────┬───────────┐
│ SECONDARY │ SECONDARY │ SECONDARY │
│ Δ30d      │ Percentile│ vs Cat B  │
│ +0.23     │ 85th      │ +0.60     │
└───────────┴───────────┴───────────┘

┌──────┬──────┬──────┬──────┐
│ TEE  │APPRCH│SHORT │PUTT  │  TERTIARY
│-0.15 │+0.80 │+0.45 │+0.70 │  (diagnostic)
└──────┴──────┴──────┴──────┘
```

### 2. Semantic Color System
- **Positive** (green): Above benchmark, gaining strokes
- **Negative** (red): Below benchmark, losing strokes
- **Neutral** (gray): No significant change, informational
- **Info** (blue): Percentiles, informational metrics

### 3. Typography Hierarchy
| Level | Size | Weight | Use |
|-------|------|--------|-----|
| Primary Value | 56px | 700 | Total SG |
| Secondary Value | 28px | 600 | Delta, Percentile |
| Tertiary Value | 24px | 600 | Category breakdown |
| Labels | 11-14px | 500 | Metric names (uppercase) |
| Sublabels | 11-12px | 400 | Supporting text |

### 4. Pro Dashboard Signals
- Reduced border radius (4-8px vs 8-12px)
- Border emphasis over shadow (1px solid vs soft shadow)
- Tabular numbers for alignment (`font-feature-settings: "tnum"`)
- More whitespace between sections (32px)
- Tighter padding inside cards (16-24px)
- Fewer accent colors (semantic only)

---

## Usage

### Using the New Dashboard

```tsx
import { StrokesGainedDashboardPro } from './features/strokes-gained/StrokesGainedDashboardPro';

// In your route/page:
<StrokesGainedDashboardPro
  playerId={playerId}
  onBack={() => navigate(-1)}
/>
```

### Using Card Components

```tsx
import {
  PrimaryKPICard,
  InsightCard,
  DiagnosticCard
} from '../components/dashboard/cards';

// Primary KPI
<PrimaryKPICard
  value={1.8}
  label="Total Strokes Gained"
  delta={0.23}
  percentile={85}
/>

// Secondary metric
<InsightCard
  value="+0.23"
  label="30-Day Trend"
  semantic="positive"
/>

// Diagnostic breakdown
<DiagnosticCard
  title="Approach"
  value={0.8}
  benchmarkLabel="PGA Elite"
  benchmarkValue={0.5}
  testCount={12}
/>
```

### Using Formatters

```tsx
import {
  formatSG,
  formatDelta,
  formatPercentile,
  getSGColorStyle
} from '../utils/sgFormatting';

formatSG(1.85);                     // "+1.85"
formatDelta(0.23, '30d', '/round'); // "Δ30d +0.23/round"
formatPercentile(85);               // "85th"

// Semantic styling
<span style={getSGColorStyle(1.85)}>+1.85</span>
```

---

## Migration Path

The new `StrokesGainedDashboardPro` component can be used alongside the existing `StrokesGainedDashboard`. To migrate:

1. Import the new Pro version
2. Replace the old component in routes
3. The old component remains for reference/fallback

No breaking changes to existing components or APIs.

---

## Build Verification

✅ TypeScript compilation: Pass
✅ Production build: Pass
✅ No new dependencies added
