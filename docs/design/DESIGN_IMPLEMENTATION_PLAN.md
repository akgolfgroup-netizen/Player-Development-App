# TIER Golf Design System - Implementation Plan

**Version:** 1.0
**Date:** December 29, 2025
**Status:** Active

---

## 1. Current Visual Architecture

### Overview

The app uses a **layered component architecture** with two parallel systems:

```
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                        │
│  App.jsx (Router) → Features (36 modules) → Pages           │
├─────────────────────────────────────────────────────────────┤
│                    LAYOUT LAYER                             │
│  Catalyst Sidebar/Navbar → ApplicationLayout.jsx            │
├─────────────────────────────────────────────────────────────┤
│                    COMPONENT LAYERS                         │
│  ┌──────────────┐    ┌──────────────────────────────────┐  │
│  │   CATALYST   │    │         UI SYSTEM                │  │
│  │  (Tailwind)  │    │    (CSS Variables + React)       │  │
│  │              │    │                                  │  │
│  │ 27 components│    │ primitives/ → composites/        │  │
│  │ sidebar      │    │ raw-blocks/ → templates/         │  │
│  │ button       │    │                                  │  │
│  │ dropdown     │    │ AppShellTemplate                 │  │
│  │ input        │    │ ListTemplate                     │  │
│  │ table        │    │ StatsGridTemplate                │  │
│  │ etc.         │    │ etc.                             │  │
│  └──────────────┘    └──────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                    DESIGN TOKEN LAYER                       │
│  index.css (CSS Variables) ← tailwind.config.js             │
└─────────────────────────────────────────────────────────────┘
```

### Key Files

| File | Purpose |
|------|---------|
| `src/index.css` | **Single source of truth** for all design tokens |
| `tailwind.config.js` | Maps CSS variables to Tailwind classes |
| `components/catalyst/` | 27 Tailwind Catalyst UI components |
| `ui/primitives/` | Base React components (Button, Input, Badge) |
| `ui/composites/` | Complex components (DataTable, Modal, Tabs) |
| `ui/raw-blocks/` | Foundational blocks (AppShell, PageHeader) |
| `ui/templates/` | Page layouts (Dashboard, List, Profile) |
| `components/layout/` | Main app layout (ApplicationLayout.jsx) |

---

## 2. Current Design Tokens

### Color Palette (Blue Palette 01)

```css
/* Primary Brand */
--ak-primary: #10456A      /* Deep Blue - primary actions */
--ak-primary-light: #2C5F7F /* Lighter blue - hover states */
--ak-snow: #EDF0F2         /* Cool gray - page background */
--ak-surface: #EBE5DA      /* Warm beige - card backgrounds */
--ak-gold: #C9A227         /* Gold - accents, highlights */
--ak-white: #FFFFFF        /* Pure white - content areas */
--ak-ink: #02060D          /* Near-black - primary text */
```

### Typography (Apple HIG Scale)

```css
/* Font Family */
--font-family: 'Inter', -apple-system, sans-serif

/* Size Scale */
--font-size-large-title: 34px    /* Main headlines */
--font-size-title1: 28px         /* Page titles */
--font-size-title2: 22px         /* Section headers */
--font-size-title3: 20px         /* Card headers */
--font-size-headline: 17px       /* Bold text */
--font-size-body: 17px           /* Body text */
--font-size-subheadline: 15px    /* Secondary text */
--font-size-footnote: 13px       /* Small text */
--font-size-caption1: 12px       /* Labels */
--font-size-caption2: 11px       /* Tiny labels */
```

### Spacing (4px Grid)

```css
--spacing-1: 4px    /* Tight */
--spacing-2: 8px    /* Compact */
--spacing-3: 12px   /* Standard */
--spacing-4: 16px   /* Comfortable */
--spacing-6: 24px   /* Spacious */
--spacing-8: 32px   /* Section gaps */
```

### Border Radius

```css
--radius-sm: 4px    /* Buttons, inputs */
--radius-md: 8px    /* Cards */
--radius-lg: 12px   /* Modals */
--radius-full: 9999px /* Pills, avatars */
```

### Shadows

```css
--shadow-card: 0 2px 4px rgba(0, 0, 0, 0.06)
--shadow-elevated: 0 4px 12px rgba(0, 0, 0, 0.08)
--shadow-float: 0 8px 24px rgba(0, 0, 0, 0.12)
```

---

## 3. Two Systems Problem

Currently the app has **two parallel component systems**:

### System A: Catalyst (Tailwind)
- Location: `components/catalyst/`
- Usage: Main layout (Sidebar, Navbar), forms
- Styling: Tailwind utility classes
- Pros: Consistent, well-tested, handles accessibility
- Cons: Hardcoded colors in some components

### System B: UI System (CSS Variables)
- Location: `ui/primitives/`, `ui/composites/`, `ui/templates/`
- Usage: Page content, data display
- Styling: CSS variables inline
- Pros: Design token-driven, themeable
- Cons: Less mature, some inconsistencies

---

## 4. Implementation Strategy

### Goal
Unify both systems under **one design token source** while keeping Catalyst for complex interactions and UI System for content.

### Phase 1: Token Synchronization (Foundation)
**Objective:** Ensure all Catalyst components use CSS variables

**Tasks:**
1. Audit Catalyst components for hardcoded colors
2. Replace hardcoded values with CSS variable references
3. Add missing CSS variables to index.css if needed
4. Test all Catalyst components with design tokens

**Files to Update:**
- `components/catalyst/button.jsx` - already uses tokens
- `components/catalyst/sidebar.jsx` - uses #10456A, #2C5F7F directly ✓
- `components/catalyst/sidebar-layout.jsx` - uses #EDF0F2 directly ✓
- `components/catalyst/navbar.jsx` - needs audit
- `components/catalyst/dropdown.jsx` - needs audit

### Phase 2: Template Standardization
**Objective:** All pages use consistent templates

**Current Templates:**
- `AppShellTemplate` - Main app container
- `ListTemplate` - List views
- `StatsGridTemplate` - Statistics dashboards
- `CalendarTemplate` - Calendar views
- `ProfileTemplate` - User profiles
- `SettingsTemplate` - Settings pages
- `DetailTemplate` - Detail views
- `DashboardTemplate` - Dashboard layouts

**Tasks:**
1. Map all 36 features to appropriate templates
2. Create missing templates if needed
3. Standardize template props (header, sidebar, footer)

### Phase 3: Component Consistency
**Objective:** All interactive elements use same patterns

**Button Variants:**
```
Primary: bg-ak-primary, text-white, hover:bg-ak-primary-light
Secondary: bg-ak-snow, text-ak-primary, border-ak-primary
Ghost: bg-transparent, text-ak-primary
Danger: bg-ak-error, text-white
```

**Input Patterns:**
```
Default: border-gray-300, focus:border-ak-primary, focus:ring-ak-primary
Error: border-ak-error, focus:border-ak-error
```

**Card Patterns:**
```
Default: bg-white, shadow-card, rounded-radius-md
Elevated: bg-white, shadow-elevated, rounded-radius-lg
```

### Phase 4: Feature Migration
**Objective:** Update features to use standardized components

**Features by Priority:**
1. **High Use:** dashboard, profile, auth, calendar
2. **Coach Features:** coach-dashboard, coach-athlete-list, coach-stats
3. **Player Features:** sessions, tests, stats, badges
4. **Admin Features:** admin-* modules

---

## 5. Implementation Checklist

### Immediate Actions
- [ ] Create component variants documentation
- [ ] Audit Catalyst components for hardcoded values
- [ ] Add `--shadow-float` to Tailwind config
- [ ] Create Button variant component

### Short-term
- [ ] Standardize all page headers
- [ ] Implement consistent card styles
- [ ] Create form field wrapper component
- [ ] Add loading state patterns

### Medium-term
- [ ] Migrate dashboard to templates
- [ ] Migrate profile pages
- [ ] Migrate coach features
- [ ] Add dark mode support (tokens exist)

---

## 6. Design Decision Guidelines

### When to Use Catalyst
- Complex interactions (dropdowns, comboboxes)
- Navigation (sidebar, navbar)
- Forms (input, select, checkbox)
- Layout structure (dialog, stacked-layout)

### When to Use UI System
- Page layouts (templates)
- Data display (StatsGrid, DataTable)
- Content cards (CardSimple, CardHeader)
- Status displays (badges, alerts)

### Color Usage Rules

| Context | Color | Variable |
|---------|-------|----------|
| Primary actions | Deep Blue | `--ak-primary` |
| Primary hover | Light Blue | `--ak-primary-light` |
| Page background | Snow | `--ak-snow` |
| Card/surface | Beige or White | `--ak-surface`, `--ak-white` |
| Accents | Gold | `--ak-gold` |
| Text primary | Ink | `--ak-ink` |
| Text secondary | Gray | `--gray-600` |
| Success | Green | `--ak-success` |
| Warning | Amber | `--ak-warning` |
| Error | Red | `--ak-error` |

---

## 7. Quick Reference

### Tailwind Classes (from tailwind.config.js)

```jsx
// Colors
className="bg-ak-primary text-white"
className="bg-ak-snow"
className="bg-ak-surface"
className="text-ak-ink"
className="text-ak-gold"

// Typography
className="text-title1"
className="text-body"
className="text-caption1"

// Spacing
className="p-ak-4"
className="gap-ak-3"
className="mt-ak-6"

// Radius
className="rounded-ak-md"
className="rounded-ak-lg"

// Shadows
className="shadow-ak-card"
className="shadow-ak-elevated"
```

### CSS Variable Usage

```jsx
// Inline styles
style={{ backgroundColor: 'var(--ak-primary)' }}
style={{ color: 'var(--text-primary)' }}
style={{ padding: 'var(--spacing-4)' }}
```

---

## 8. Next Steps

1. **Review this plan** - Approve the strategy
2. **Start Phase 1** - Audit and fix Catalyst hardcoded values
3. **Create component library page** - Visual reference at `/ui-lab`
4. **Implement systematically** - One feature at a time

---

## Appendix: Feature List (36 modules)

| Feature | Template | Priority |
|---------|----------|----------|
| dashboard | DashboardTemplate | High |
| profile | ProfileTemplate | High |
| auth | AuthLayout | High |
| calendar | CalendarTemplate | High |
| sessions | ListTemplate | Medium |
| tests | ListTemplate | Medium |
| stats | StatsGridTemplate | Medium |
| badges | ListTemplate | Medium |
| goals | ListTemplate | Medium |
| coach-dashboard | DashboardTemplate | High |
| coach-athlete-list | ListTemplate | High |
| coach-athlete-detail | DetailTemplate | Medium |
| coach-stats | StatsGridTemplate | Medium |
| admin-* | SettingsTemplate | Low |
| ... | ... | ... |
