# AK Golf Motion Guidelines

## Principles

1. **Purposeful** - Motion should guide attention and provide feedback
2. **Subtle** - Animations should enhance, not distract
3. **Responsive** - Quick, snappy interactions feel professional
4. **Consistent** - Same actions = same animations throughout

## Timing

### Duration Scale

| Token | Duration | Usage |
|-------|----------|-------|
| `--duration-instant` | 50ms | Micro-interactions (hover states) |
| `--duration-fast` | 150ms | Buttons, toggles, small elements |
| `--duration-normal` | 250ms | Cards, modals appearing |
| `--duration-slow` | 350ms | Page transitions, large elements |
| `--duration-slower` | 500ms | Complex animations, celebrations |

### When to Use

| Interaction | Duration | Easing |
|-------------|----------|--------|
| Button hover | 150ms | ease-out |
| Button press | 100ms | ease-in |
| Card expand | 250ms | ease-out |
| Modal open | 300ms | ease-out |
| Modal close | 200ms | ease-in |
| Page transition | 350ms | ease-in-out |
| Toast appear | 200ms | ease-out |
| Toast dismiss | 150ms | ease-in |

## Easing Functions

### Standard Easings

```css
:root {
  /* Standard */
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

  /* Expressive */
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-smooth: cubic-bezier(0.45, 0, 0.55, 1);

  /* Spring-like */
  --ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
```

### Usage Guide

| Easing | When to Use |
|--------|-------------|
| `ease-out` | Elements appearing, expanding |
| `ease-in` | Elements disappearing, collapsing |
| `ease-in-out` | Elements moving position |
| `ease-bounce` | Achievements, celebrations |
| `ease-spring` | Interactive elements (buttons, cards) |

## Common Animations

### Fade In
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fade-in {
  animation: fadeIn 250ms ease-out forwards;
}
```

### Slide Up
```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-up {
  animation: slideUp 300ms ease-out forwards;
}
```

### Scale In
```css
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.scale-in {
  animation: scaleIn 200ms ease-out forwards;
}
```

### Achievement Pop
```css
@keyframes achievementPop {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.achievement-pop {
  animation: achievementPop 500ms var(--ease-bounce) forwards;
}
```

## Loading States

### Skeleton Pulse
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.skeleton {
  background: var(--ak-surface-elevated);
  animation: pulse 2s ease-in-out infinite;
}
```

### Spinner
```css
@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner {
  animation: spin 1s linear infinite;
}
```

## Reduced Motion

Always respect user preferences for reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Framer Motion Presets

```typescript
export const motionPresets = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.25 }
  },
  slideUp: {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: { duration: 0.3, ease: [0, 0, 0.2, 1] }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.2 }
  }
};
```
