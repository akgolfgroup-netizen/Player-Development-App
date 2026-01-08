# TIER Golf - UI Canon

> **Version:** 3.0
> **Last Updated:** 2026-01-01
> **Source of Truth:** This document + `src/index.css` + `tailwind.config.js`

This document defines the official design specifications for all UI components in the TIER Golf application. All new components MUST follow these guidelines.

---

## Table of Contents

1. [Brand Identity](#brand-identity)
2. [Color System](#color-system)
   - [Primary Brand Palette](#primary-brand-palette)
   - [Gold/Bronze Scale](#goldbronze-scale)
   - [Warm Gray Scale](#warm-gray-scale)
   - [Status Colors](#status-colors)
3. [Layout System](#layout-system)
   - [Full-Width Design](#full-width-design)
   - [Card Grid System](#card-grid-system)
   - [Page Typography Classes](#page-typography-classes)
4. [Typography](#typography)
5. [Spacing](#spacing)
6. [Components](#components)
   - [Button](#button)
   - [Card](#card)
   - [Badge](#badge)
   - [ProgressBar](#progressbar)
   - [TrendIndicator](#trendindicator)
   - [Sparkline](#sparkline)
   - [KPICard](#kpicard)
7. [Accessibility](#accessibility)

---

## Brand Identity

### Primary Brand Colors

| Name | Hex | CSS Variable | Tailwind | Usage | Contrast |
|------|-----|--------------|----------|-------|----------|
| **Brand Forest** | `#1B4D3E` | `--brand-forest` | `bg-brand-forest` | Primary buttons, logo circle, main CTAs | 8.2:1 ✓ WCAG AA |
| **Brand Pine** | `#0F3329` | `--brand-pine` | `bg-brand-pine` | Logo text, headings, premium features | 13.1:1 ✓ WCAG AAA |
| **Brand Sage** | `#059669` | `--brand-sage` | `bg-brand-sage` | Accents, hover states, success indicators | 4.7:1 (UI only) |
| **Brand Cream** | `#FAF9F5` | `--brand-cream` | `bg-brand-cream` | Card backgrounds, premium surfaces | - |

### Color Psychology

- **Forest Green**: Golf course, nature, growth, stability
- **Pine Green**: Exclusivity, depth, sophistication
- **Sage Green**: Fresh, active, positive growth
- **Cream**: Sophistication, warmth, premium paper quality

---

## Color System

### Primary Brand Palette

#### Green Scale

The complete green scale for the TIER Golf brand identity.

| Token | Hex | CSS Variable | Tailwind | Usage |
|-------|-----|--------------|----------|-------|
| green-950 | `#0A231C` | `--green-950` | `bg-green-950` | Darkest - almost black with green tint |
| **green-900** | `#0F3329` | `--green-900` | `bg-green-900` | **Brand Pine** (logo text) |
| green-800 | `#144033` | `--green-800` | `bg-green-800` | Dark hover state |
| **green-700** | `#1B4D3E` | `--green-700` | `bg-green-700` | **Brand Forest** (primary) |
| **green-600** | `#059669` | `--green-600` | `bg-green-600` | **Brand Sage** (accent) |
| green-500 | `#10B981` | `--green-500` | `bg-green-500` | Bright green |
| green-400 | `#34D399` | `--green-400` | `bg-green-400` | Light accent |
| green-300 | `#6EE7B7` | `--green-300` | `bg-green-300` | Subtle highlights |
| green-200 | `#A7F3D0` | `--green-200` | `bg-green-200` | Background tints |
| green-100 | `#D1FAE5` | `--green-100` | `bg-green-100` | Lightest backgrounds |
| green-50 | `#ECFDF5` | `--green-50` | `bg-green-50` | Nearly white |

### Gold/Bronze Scale

For achievements, premium features, and special occasions.

| Token | Hex | CSS Variable | Tailwind | Usage |
|-------|-----|--------------|----------|-------|
| **gold-800** | `#92400E` | `--gold-800` | `bg-gold-800` | **Rich bronze** - dark premium |
| gold-700 | `#B45309` | `--gold-700` | `bg-gold-700` | Deep gold |
| **gold-600** | `#D97706` | `--gold-600` | `bg-gold` | **Warm gold** - primary gold |
| gold-500 | `#F59E0B` | `--gold-500` | `bg-gold-500` | Bright gold |
| **gold-400** | `#FBBF24` | `--gold-400` | `bg-gold-400` | **Light gold** - highlights |
| gold-300 | `#FCD34D` | `--gold-300` | `bg-gold-300` | Pale gold |
| gold-200 | `#FDE68A` | `--gold-200` | `bg-gold-200` | Very light gold |
| gold-100 | `#FEF3C7` | `--gold-100` | `bg-gold-100` | Gold background |
| gold-50 | `#FFFBEB` | `--gold-50` | `bg-gold-50` | Near-white gold |

**Use cases:**
- Streak indicators (🔥)
- Achievement badges
- Premium/VIP features
- Tournament highlights
- Calendar events

### Teal Scale - Statistics & Analytics

| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| teal-700 | `#0F766E` | `bg-teal-700` | Dark teal |
| **teal-500** | `#14B8A6` | `bg-teal` | **Primary teal** |
| teal-200 | `#99F6E4` | `bg-teal-200` | Light backgrounds |
| teal-50 | `#F0FDFA` | `bg-teal-50` | Subtle backgrounds |

### Status Colors - Complete Semantic System

Each status color has a full palette for different use cases.

#### Success (Green)
| Variant | Hex | Tailwind | Usage |
|---------|-----|----------|-------|
| success-dark | `#144033` | `text-success-dark` | Text on light bg |
| **success** | `#059669` | `bg-success` | **Primary success** |
| success-light | `#10B981` | `bg-success-light` | Highlights |
| success-bg | `#ECFDF5` | `bg-success-bg` | Badge backgrounds |
| success-border | `#A7F3D0` | `border-success-border` | Borders |

#### Warning (Orange)
| Variant | Hex | Tailwind | Usage |
|---------|-----|----------|-------|
| warning-dark | `#B45309` | `text-warning-dark` | Text on light bg |
| **warning** | `#D97706` | `bg-warning` | **Primary warning** |
| warning-light | `#FB923C` | `bg-warning-light` | Highlights |
| warning-bg | `#FFFBEB` | `bg-warning-bg` | Badge backgrounds |
| warning-border | `#FDBA74` | `border-warning-border` | Borders |

#### Danger (Red)
| Variant | Hex | Tailwind | Usage |
|---------|-----|----------|-------|
| danger-dark | `#B91C1C` | `text-danger-dark` | Text on light bg |
| **danger** | `#EF4444` | `bg-danger` | **Primary danger** |
| danger-light | `#F87171` | `bg-danger-light` | Highlights |
| danger-bg | `#FEF2F2` | `bg-danger-bg` | Badge backgrounds |
| danger-border | `#FCA5A5` | `border-danger-border` | Borders |

#### Info (Blue)
| Variant | Hex | Tailwind | Usage |
|---------|-----|----------|-------|
| info-dark | `#1D4ED8` | `text-info-dark` | Text on light bg |
| **info** | `#3B82F6` | `bg-info` | **Primary info** |
| info-light | `#60A5FA` | `bg-info-light` | Highlights |
| info-bg | `#EFF6FF` | `bg-info-bg` | Badge backgrounds |
| info-border | `#93C5FD` | `border-info-border` | Borders |

### Warm Gray Scale

Premium cream aesthetic for sophisticated surfaces. Use warm grays for card backgrounds and neutral UI elements.

| Token | Hex | CSS Variable | Tailwind | Usage |
|-------|-----|--------------|----------|-------|
| warm-950 | `#1C1917` | `--warm-950` | `bg-warm-950` | Near black with warmth |
| warm-900 | `#292524` | `--warm-900` | `bg-warm-900` | Deep charcoal |
| warm-800 | `#44403C` | `--warm-800` | `bg-warm-800` | Dark gray |
| warm-700 | `#57534E` | `--warm-700` | `text-warm-700` | Medium-dark gray (KPI labels) |
| warm-600 | `#78716C` | `--warm-600` | `text-warm-600` | Medium gray |
| warm-500 | `#A8A29E` | `--warm-500` | `text-warm-500` | Mid-tone gray |
| warm-400 | `#D6D3D1` | `--warm-400` | `border-warm-400` | Light gray borders |
| warm-300 | `#E7E5E4` | `--warm-300` | `border-warm-300` | Card borders |
| warm-200 | `#F5F5F4` | `--warm-200` | `bg-warm-200` | Nearly white gray |
| warm-100 | `#FAFAF9` | `--warm-100` | `bg-warm-100` | Off-white |
| **warm-50** | `#FAF9F5` | `--warm-50` | `bg-warm` | **Brand Cream** - premium surfaces |

### Cool Gray Scale

For digital screens and contrast.

| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| gray-950 | `#030712` | `bg-gray-950` | Deepest black |
| gray-900 | `#111827` | `text-gray-900` | **Primary text** |
| gray-800 | `#1F2937` | `text-gray-800` | Bold text |
| gray-700 | `#374151` | `text-gray-700` | Medium emphasis |
| gray-600 | `#4B5563` | `text-gray-600` | Body text alt |
| gray-500 | `#6B7280` | `text-gray-500` | Secondary text |
| gray-400 | `#9CA3AF` | `text-gray-400` | **Tertiary text** |
| gray-300 | `#D1D5DB` | `border-gray-300` | Borders |
| gray-200 | `#E5E7EB` | `border-gray-200` | Dividers |
| gray-100 | `#F3F4F6` | `bg-gray-100` | Backgrounds |
| gray-50 | `#F9FAFB` | `bg-gray-50` | Light backgrounds |

---

## Layout System

### Full-Width Design

All pages use **100% viewport width** with no max-width constraints. Padding scales responsively.

| Breakpoint | Width | Padding | CSS Variable |
|------------|-------|---------|--------------|
| Mobile (<640px) | 100% | 16px | `--layout-padding-mobile` |
| Tablet (640-1023px) | 100% | 24px | `--layout-padding-tablet` |
| Desktop (≥1024px) | 100% | 32px | `--layout-padding-desktop` |

### Layout Classes

```tsx
// Full-width page container
<div className="page-full">...</div>

// Or use Tailwind container (configured for 100% width)
<div className="container">...</div>

// Remove any max-width constraints
<div className="max-w-none">...</div>
```

### Card Grid System

Responsive grids that adapt to viewport width.

```tsx
// Auto-fit grid (cards minimum 300px)
<div className="card-grid">
  <Card>...</Card>
  <Card>...</Card>
</div>

// Fixed column grids (responsive)
<div className="card-grid-2">...</div>  // 1 → 2 cols
<div className="card-grid-3">...</div>  // 1 → 2 → 3 cols
<div className="card-grid-4">...</div>  // 1 → 2 → 3 → 4 cols

// Tailwind equivalent
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

### Page Typography Classes

| Class | Mobile | Desktop | Weight | Usage |
|-------|--------|---------|--------|-------|
| `.page-title` | 36px | 48px | 700 | Main page headings |
| `.section-title` | 24px | 30px | 600 | Section headings |
| `.card-title` | 20px | 20px | 600 | Card headings |
| `.subsection-title` | 18px | 18px | 500 | Subsection headings |

```tsx
<h1 className="page-title">Dashboard</h1>
<h2 className="section-title">Recent Activity</h2>
<h3 className="card-title">Training Summary</h3>
```

### Section Spacing

```tsx
// Standard section spacing (32px)
<section className="section-spacing">...</section>

// Smaller spacing (24px)
<section className="section-spacing-sm">...</section>
```

---

## Typography

All typography uses the **Inter** font family. Sizes follow a consistent scale.

### Text Styles

| Token | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| `text-hero` | 32px | 40px | 700 | Smart insights, hero sections |
| `text-h1` | 24px | 32px | 700 | Section headings |
| `text-h2` | 20px | 28px | 600 | Card titles |
| `text-body` | 16px | 24px | 400 | Body text |
| `text-small` | 14px | 20px | 400 | Secondary info |
| `text-xs` | 12px | 16px | 400 | Labels, metadata |

### KPI Typography

| Token | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| `text-kpi-value` | 36px | 44px | 700 | Large numbers |
| `text-kpi-label` | 14px | 20px | 500 | KPI labels |

### Tailwind Mapping

```tsx
// Use these Tailwind classes
className="text-large-title"  // 34px - Large titles
className="text-title1"       // 28px - Main headings
className="text-title2"       // 22px - Section headings
className="text-title3"       // 20px - Subsections
className="text-headline"     // 17px - Headlines
className="text-body"         // 17px - Body text
className="text-subheadline"  // 15px - Subheadlines
className="text-footnote"     // 13px - Footnotes
className="text-caption1"     // 12px - Captions
className="text-caption2"     // 11px - Small captions
```

---

## Spacing

Based on a 4px/8px grid system.

| Token | Value | CSS Variable | Usage |
|-------|-------|--------------|-------|
| `space-xs` | 4px | `--spacing-1` | Tight spacing |
| `space-sm` | 8px | `--spacing-2` | Small gaps |
| `space-md` | 16px | `--spacing-4` | Medium spacing |
| `space-lg` | 24px | `--spacing-6` | Card padding |
| `space-xl` | 32px | `--spacing-8` | Component gaps |
| `space-2xl` | 48px | `--spacing-12` | Major sections |

### Standard Usage

```tsx
// Card padding
className="p-6"  // 24px - Standard card padding

// Component gaps
className="gap-8"  // 32px - Between major sections

// Section spacing
className="space-y-12"  // 48px - Between page sections
```

---

## Components

### Button

Location: `src/components/shadcn/button.tsx`

#### Sizes

| Size | Height | Padding (H/V) | Tailwind |
|------|--------|---------------|----------|
| `small` | 32px | 12px / 24px | `size="sm"` |
| `medium` | 40px | 16px / 32px | `size="default"` |
| `large` | 48px | 20px / 40px | `size="lg"` |

#### Variants

```tsx
<Button variant="default">Primary Action</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>
<Button variant="success">Confirm</Button>
<Button variant="warning">Warning</Button>
<Button variant="link">Link Style</Button>
```

---

### Card

Location: `src/components/shadcn/card.tsx`

#### Variants

| Variant | Description | Usage |
|---------|-------------|-------|
| `default` | Standard elevation, white bg | General content |
| `elevated` | Higher shadow for prominence | Featured content |
| `outline` | Border instead of shadow | Subtle containers |
| `interactive` | Hover effects, clickable | Clickable cards |

```tsx
<Card variant="default">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Description text</CardDescription>
  </CardHeader>
  <CardContent>Content here</CardContent>
  <CardFooter>Footer actions</CardFooter>
</Card>
```

---

### Badge

Location: `src/components/shadcn/badge.tsx`

#### Status Variants

| Variant | Color | Usage |
|---------|-------|-------|
| `success` | Green | Completed, on track |
| `warning` | Orange | Attention needed |
| `destructive` | Red | Error, behind |
| `default` | Primary | Default state |
| `secondary` | Gray | Neutral info |
| `outline` | Border only | Subtle labels |

```tsx
<Badge variant="success">Completed</Badge>
<Badge variant="warning">In Progress</Badge>
<Badge variant="destructive">Overdue</Badge>
```

#### Training Category Variants

```tsx
<Badge variant="fysisk">Fysisk</Badge>
<Badge variant="teknikk">Teknikk</Badge>
<Badge variant="slag">Slag</Badge>
<Badge variant="spill">Spill</Badge>
<Badge variant="turnering">Turnering</Badge>
```

---

### ProgressBar

Location: `src/components/ui/ProgressBar.tsx`

A rich progress component with milestones, labels, and animations.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | number | required | Current value |
| `max` | number | 100 | Maximum value |
| `thickness` | `"thin"` \| `"default"` \| `"thick"` | `"default"` | Bar height |
| `color` | `"success"` \| `"warning"` \| `"danger"` \| `"primary"` | `"primary"` | Bar color |
| `showPercentage` | boolean | false | Show % text |
| `animated` | boolean | false | Animate on load |
| `label` | string | - | Text label |
| `milestones` | Milestone[] | - | Milestone markers |

#### Usage

```tsx
<ProgressBar
  value={8}
  max={12}
  thickness="thick"
  color="success"
  showPercentage
  animated
  label="8 av 12 okter"
  milestones={[
    { value: 6, label: "Minimum", color: "gray" },
    { value: 12, label: "Mal", color: "green" }
  ]}
/>
```

---

### TrendIndicator

Location: `src/components/ui/TrendIndicator.tsx`

Shows directional change with value and context.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `direction` | `"up"` \| `"down"` \| `"flat"` | required | Trend direction |
| `value` | string | required | Change value (e.g., "+3.5") |
| `label` | string | - | Context label |
| `positive` | boolean | true | Is upward trend good? |

#### Usage

```tsx
<TrendIndicator
  direction="up"
  value="+3.5"
  label="vs. forrige uke"
  positive
/>
```

---

### Sparkline

Location: `src/components/ui/Sparkline.tsx`

Compact trend visualization for KPI cards.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | number[] | required | Data points |
| `width` | number | 80 | Chart width |
| `height` | number | 24 | Chart height |
| `color` | string | `"primary"` | Line color |
| `showDot` | boolean | false | Highlight current value |

#### Usage

```tsx
<Sparkline
  data={[12, 14, 11, 16, 18, 15, 14]}
  width={80}
  height={24}
  color="green"
  showDot
/>
```

---

### KPICard

Location: `src/components/ui/KPICard.tsx`

Composite component for displaying key performance indicators.

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `value` | string \| number | The main KPI value |
| `label` | string | Description of the metric |
| `trend` | TrendIndicatorProps | Optional trend data |
| `sparkline` | SparklineProps | Optional sparkline data |
| `icon` | ReactNode | Optional icon |

#### Usage

```tsx
<KPICard
  value="14.5"
  label="Timer denne uka"
  trend={{ direction: "up", value: "+3.5", label: "vs. forrige uke" }}
  sparkline={{ data: weeklyHours, showDot: true }}
/>
```

---

## File Structure

```
src/components/
├── shadcn/           # Base primitives (Button, Card, Badge, etc.)
├── ui/               # Application components
│   ├── ProgressBar.tsx
│   ├── TrendIndicator.tsx
│   ├── Sparkline.tsx
│   ├── KPICard.tsx
│   └── index.ts
└── primitives/       # Legacy primitives
```

---

## Best Practices

1. **Always use design tokens** - Never hardcode colors, spacing, or font sizes
2. **Use semantic colors** - Use `success`, `warning`, `danger` not raw hex values
3. **Consistent spacing** - Use the spacing scale (4px, 8px, 16px, 24px, 32px, 48px)
4. **Typography hierarchy** - Use the defined text styles for consistency
5. **Component composition** - Build complex UIs from these base components

---

## Accessibility

### Color Contrast Guidelines (WCAG AA - 4.5:1 minimum)

#### Safe Pairings (Use freely)

| Foreground | Background | Ratio | Status |
|------------|------------|-------|--------|
| `green-700` | white | 8.2:1 | Excellent |
| `green-800` | white | 10.5:1 | Excellent |
| `green-900` | white | 13.1:1 | Excellent |
| white | `green-700` | 8.2:1 | Excellent |
| `gray-900` | white | 16.1:1 | Excellent |
| `gray-700` | white | 9.2:1 | Excellent |

#### Use With Caution

| Foreground | Background | Ratio | Notes |
|------------|------------|-------|-------|
| `green-600` | white | 4.7:1 | Borderline - OK for large text |
| `teal-500` | white | 3.9:1 | Fails AA for text - use for icons/UI only |
| `warning` | white | 2.8:1 | Fails - use for large UI elements only |

#### Never Use for Text

| Foreground | Background | Ratio | Status |
|------------|------------|-------|--------|
| `gray-400` | white | 2.9:1 | Fails |
| `green-400` | white | 1.9:1 | Fails badly |
| `green-300` | white | 1.5:1 | Fails badly |

### Badge Accessibility Pattern

For status badges, always use the dark variant for text:

```tsx
// Correct - high contrast
<Badge className="bg-success-bg text-success-dark border border-success-border">
  Completed
</Badge>

// Wrong - poor contrast
<Badge className="bg-success-bg text-success">
  Completed
</Badge>
```

---

## Migration Notes

When updating existing components:

1. Replace hardcoded colors with CSS variables or Tailwind classes
2. Replace arbitrary spacing with spacing tokens
3. Use the defined Button/Card/Badge variants
4. Wrap KPI displays in KPICard components
5. Verify color contrast meets WCAG AA (4.5:1 for text)

---

*This document is maintained alongside the codebase. Update when design tokens change.*
