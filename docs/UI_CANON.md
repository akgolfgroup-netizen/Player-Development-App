# AK Golf Academy - UI Canon

> **Version:** 1.0
> **Last Updated:** 2026-01-01
> **Source of Truth:** This document + `src/index.css` + `tailwind.config.js`

This document defines the official design specifications for all UI components in the AK Golf Academy application. All new components MUST follow these guidelines.

---

## Table of Contents

1. [Color System](#color-system)
2. [Typography](#typography)
3. [Spacing](#spacing)
4. [Components](#components)
   - [Button](#button)
   - [Card](#card)
   - [Badge](#badge)
   - [ProgressBar](#progressbar)
   - [TrendIndicator](#trendindicator)
   - [Sparkline](#sparkline)
   - [KPICard](#kpicard)

---

## Color System

### Status Colors
Used for indicating state, feedback, and alerts.

| Token | Hex | Tailwind Class | Usage |
|-------|-----|----------------|-------|
| Success | `#10B981` / `#059669` | `text-ak-success`, `bg-ak-success` | On track, completed |
| Warning | `#F59E0B` / `#D97706` | `text-ak-warning`, `bg-ak-warning` | Attention needed |
| Danger | `#EF4444` / `#DC2626` | `text-ak-error`, `bg-ak-error` | Behind, urgent |
| Info | `#3B82F6` / `#0284C7` | `text-ak-info`, `bg-ak-info` | Informational |

### Primary Brand Colors
Forest Green - the core AK Golf identity.

| Token | Hex | Tailwind Class | Usage |
|-------|-----|----------------|-------|
| Primary | `#1B4D3E` | `bg-ak-primary`, `text-ak-primary` | Primary actions, brand |
| Primary Light | `#2A6B55` | `bg-ak-primary-light` | Hover states |
| Primary Dark | `#133629` | - | Active states |

### Neutral Palette

| Token | Hex | Tailwind Class | Usage |
|-------|-----|----------------|-------|
| Gray 50 | `#FAFBFC` | `bg-gray-50` | Page backgrounds |
| Gray 100 | `#F5F7F9` | `bg-gray-100` | Surface backgrounds |
| Gray 500 | `#6B7280` | `text-gray-500` | Secondary text |
| Gray 900 | `#111827` | `text-gray-900` | Primary text |

### Accent Colors

| Token | Hex | Usage |
|-------|-----|-------|
| Gold | `#B8860B` | Achievements, highlights |
| Teal | `#14B8A6` | Statistics, data viz |
| Orange | `#FB923C` | Calendar, highlights |

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

## Migration Notes

When updating existing components:

1. Replace hardcoded colors with CSS variables or Tailwind classes
2. Replace arbitrary spacing with spacing tokens
3. Use the defined Button/Card/Badge variants
4. Wrap KPI displays in KPICard components

---

*This document is maintained alongside the codebase. Update when design tokens change.*
