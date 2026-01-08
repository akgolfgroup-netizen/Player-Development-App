# TIER Golf Logo

## Primary Logo

The TIER Golf logo is a stylized monogram combining the letters "A" and "K" in a dynamic golf-inspired form.

```
┌─────────────────────────────────────┐
│                                     │
│           ╱█████╲                   │
│          ╱███████╲                  │
│         ╱█████████╲                 │
│        ╱███████████╲                │
│       ╱█████╱╲█████╲                │
│      ╱█████╱  ╲█████╲               │
│     ╱█████╱    ╲█████╲              │
│    ╱█████╱      ╲█████╲             │
│   ████████████████████              │
│        █████  █████                 │
│        █████  █████                 │
│        █████  █████                 │
│                                     │
└─────────────────────────────────────┘
```

## Logo Specifications

| Property | Value |
|----------|-------|
| Aspect Ratio | 196.41 : 204.13 (≈ 0.962:1) |
| Minimum Size | 24px height |
| Preferred Size | 44px height (default) |
| Maximum Size | No limit |

## Color Variations

### Primary (Dark on Light)
- Fill: `#1A3D2E` (Brand Primary)
- Background: Light surfaces

### Inverted (Light on Dark)
- Fill: `#FAFAF9` (Surface)
- Background: Dark surfaces, Brand Primary

### Monochrome
- Fill: `#1C1917` (Text Primary)
- Use when color is not available

## Clearspace

Minimum clearspace around the logo equals 1x the logo height.

```
┌───────────────────────────────┐
│                               │
│   ┌─────┐                     │
│   │     │ ← 1x height         │
│   │ AK  │                     │
│   │     │                     │
│   └─────┘                     │
│     ↑                         │
│   1x height                   │
│                               │
└───────────────────────────────┘
```

## File Locations

```
apps/web/src/components/branding/
├── AKLogo.tsx          # React component
├── LogoBadge.jsx       # Badge variant
└── __tests__/          # Component tests

apps/web/public/
├── favicon.svg         # Browser favicon
├── favicon.ico         # Legacy favicon
├── logo192.webp        # PWA icon (192x192)
├── logo512.webp        # PWA icon (512x512)
└── logo.svg            # Full logo
```

## Usage Examples

### React Component
```tsx
import { AKLogo } from '@/components/branding/AKLogo';

// Default size (44px)
<AKLogo />

// Custom size
<AKLogo size={64} />

// Custom color
<AKLogo color="#C9A227" />

// With className
<AKLogo className="logo-header" />
```

### CSS Background
```css
.logo-container {
  background-image: url('/logo.svg');
  background-size: contain;
  background-repeat: no-repeat;
}
```
