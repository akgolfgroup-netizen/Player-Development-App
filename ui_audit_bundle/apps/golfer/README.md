# apps/golfer

## Status: Early Development (Prototype Phase)

This is the dedicated mobile app for golfers/players. It's designed as a focused, distraction-free experience optimized for use on the course and during practice sessions.

## Architecture

- **Framework**: React Native with React Native Web
- **Native Bridge**: Capacitor 6.0.0 (for iOS and Android)
- **Design System**: Uses `@iup/design-system` shared tokens
- **Navigation**: React Router DOM 7.x

## Current Screens

```
screens/
├── HOME.tsx          # Next session orientation (no progress/gamification)
├── SESSION.tsx       # Active session execution
├── REFLECTION.tsx    # Post-session reflection capture
├── BASELINE.tsx      # Initial calibration tests
├── TRAJECTORY.tsx    # Progress visualization
├── PROOF.tsx         # Video/image proof capture
└── index.ts          # Screen exports
```

## Design Philosophy

This app follows strict design contracts (see `docs/IMPLEMENTATION_CONTRACT.md`):

- **MUST**: Show next action, time context, effort accumulation
- **MUST NOT**: Show progress during practice, goals, encouragement, gamification
- Focus on "what to do next" rather than "how well you're doing"
- Minimize distractions during practice

## Development

```bash
# Type-check only (no build output)
pnpm --filter ak-golf-golfer-app build

# For full iOS/Android development:
# 1. Open in Xcode (iOS) or Android Studio (Android)
# 2. Or use Capacitor CLI after proper setup
```

## Dependencies on Design System

This app imports tokens from `@iup/design-system`:
```typescript
import { tokens } from '@iup/design-system';
// tokens.colors.snow, tokens.colors.charcoal, etc.
```

Ensure the design system is built before running this app:
```bash
pnpm --filter @iup/design-system build
```

## Future Development

Planned features:
- [ ] Session timer with haptic feedback
- [ ] Offline-first data sync
- [ ] Video recording for swing capture
- [ ] Integration with main web app backend

## Related

- [Web App](../web/) - Full-featured web application
- [Design System](../../packages/design-system/) - Shared design tokens
- [API](../api/) - Backend services
