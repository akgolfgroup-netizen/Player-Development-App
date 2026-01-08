# UI Rules & Tailwind Plus Adoption Process

## Overview

This document outlines the standardized process for adding new Tailwind Plus blocks and maintaining UI consistency across the TIER Golf platform.

---

## Tailwind Plus Block Adoption Process

### Directory Structure

```
apps/web/src/ui/
├── raw-blocks/           # Read-only Tailwind Plus blocks (DO NOT MODIFY)
├── templates/            # Customized templates for production use
├── primitives/           # Base design primitives (Button, Input, etc.)
├── composites/           # Composed components (Modal, Card, etc.)
├── lab/                  # DEV-only experimental components
└── skeletons/            # Loading skeleton components
```

### Adding New Tailwind Plus Blocks

1. **Copy block to raw-blocks/**
   - Download the Tailwind Plus block
   - Place in `src/ui/raw-blocks/` directory
   - Mark as read-only (never modify these files)
   - Document source and version

2. **Create Template in templates/**
   - Copy the raw block to `src/ui/templates/`
   - Apply project tokens (colors, spacing, typography)
   - Rename with `Template` suffix (e.g., `CardTemplate.tsx`)
   - Add TypeScript types

3. **Test in Lab (DEV-only)**
   - Create test page in `src/ui/lab/`
   - Verify all states: loading, error, empty, populated
   - Test dark/light/system themes
   - Verify responsive behavior

4. **Integrate in Features**
   - Import template into feature component
   - Wire up data and handlers
   - Never import raw-blocks directly in pages

### DO/DON'T

| DO | DON'T |
|----|-------|
| Import templates in features | Import raw-blocks directly |
| Use token classes (`bg-surface`, `text-text`) | Use hardcoded colors |
| Test all states before shipping | Skip dark mode testing |
| Document customizations | Modify raw-blocks |

---

## UI Checklist

Before merging any UI changes, verify:

- [ ] **Tokens OK** - All colors, spacing use design tokens
- [ ] **Dark/Light/System OK** - Tested in all theme modes
- [ ] **StateCard/Toast OK** - Loading/error/empty states use StateCard; success/error feedback uses Toast
- [ ] **Build OK** - `npm run build` passes with no errors
- [ ] **No inline styles** - All styling via Tailwind classes
- [ ] **No dynamic Tailwind class strings** - No `bg-${color}` patterns

---

## Token Classes Reference

### Colors
```
bg-surface        # Card/container backgrounds
bg-surface-2      # Secondary surfaces
text-text         # Primary text
text-muted        # Secondary/muted text
border-border     # Standard borders
```

### Brand
```
bg-primary        # Primary action backgrounds
text-primary      # Primary action text
bg-ak-primary     # Brand primary
bg-ak-gold        # Accent/highlight
```

### Status
```
text-success / bg-success    # Success states
text-warning / bg-warning    # Warning states
text-danger / bg-danger      # Error/danger states
```

### Spacing
```
p-ak-1 through p-ak-20      # Padding using token scale
m-ak-1 through m-ak-20      # Margin using token scale
gap-ak-1 through gap-ak-20  # Gap using token scale
```

### Border Radius
```
rounded-ak-sm    # Small radius
rounded-ak-md    # Medium radius
rounded-ak-lg    # Large radius
rounded-ak-full  # Fully rounded
```

### Shadows
```
shadow-ak-card      # Card shadow
shadow-ak-elevated  # Elevated/modal shadow
```

---

## State Components

### StateCard
Use for loading, error, and empty states in data-driven views.

```tsx
import { StateCard } from '@/components/ui/StateCard';

// Loading
<StateCard variant="loading" message="Laster data..." />

// Error
<StateCard variant="error" message="Kunne ikke laste data" onRetry={() => refetch()} />

// Empty
<StateCard variant="empty" message="Ingen resultater" />
```

### Toast
Use for transient success/error feedback.

```tsx
import { useToast } from '@/contexts/NotificationContext';

const { showToast } = useToast();

// Success
showToast('Lagret!', 'success');

// Error
showToast('Noe gikk galt', 'error');
```

---

## Shell Requirements

All authenticated routes must be wrapped in the appropriate shell:

| Role | Shell Component |
|------|-----------------|
| Player | `AuthenticatedLayout` → `AppShell` |
| Coach | `CoachLayout` → `CoachAppShell` |
| Admin | `AdminLayout` → `AdminAppShell` |

---

## Dynamic Class Safety

To prevent Tailwind purging issues, avoid dynamic class string construction:

```tsx
// BAD - May be purged in production
<div className={`bg-${color}-500`} />

// GOOD - Use object mapping
const colorMap = {
  success: 'bg-success',
  error: 'bg-danger',
  warning: 'bg-warning',
};
<div className={colorMap[status]} />
```

---

## Version History

| Date | Change |
|------|--------|
| 2025-12-26 | Initial documentation created |
