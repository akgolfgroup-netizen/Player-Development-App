# AK Golf Academy - Web Frontend

Golf coaching and training management application built with React.

## Prerequisites

- Node.js 18+
- npm 9+

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The app will be available at `http://localhost:3001`

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server |
| `npm run build` | Build for production |
| `npm test` | Run unit tests |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint with auto-fix |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run test:e2e:headed` | Run E2E tests with browser UI |
| `npm run test:e2e:ui` | Open Playwright UI mode |

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── branding/      # Logo and brand components
│   ├── layout/        # Layout components (PageHeader, etc.)
│   └── ui/            # UI primitives (LoadingState, ErrorState, etc.)
├── contexts/          # React contexts (Auth, etc.)
├── features/          # Feature modules
│   ├── dashboard/     # Main dashboard
│   ├── calendar/      # Calendar and scheduling
│   ├── annual-plan/   # Annual planning (Årsplan)
│   ├── sessions/      # Training sessions
│   ├── tests/         # Test protocols and results
│   ├── goals/         # Goal tracking
│   ├── profile/       # User profile
│   └── coach/         # Coach-specific features
├── services/          # API clients and services
└── design-tokens.js   # Design system tokens
```

## Design System

The app uses **Blue Palette 01** design system. Key files:

- `src/design-tokens.js` - JavaScript design tokens
- `src/index.css` - CSS variables and global styles

### Usage

```jsx
import { tokens } from './design-tokens';

// Use tokens in components
const style = {
  color: tokens.colors.primary,
  padding: tokens.spacing[4],
};
```

## Testing

### Unit Tests

```bash
npm test
```

Tests are located in `__tests__` folders next to their components.

### E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run with browser visible
npm run test:e2e:headed

# Open Playwright UI
npm run test:e2e:ui
```

E2E tests are in the `tests/` folder using Playwright.

## Pre-commit Hooks

The project uses Husky + lint-staged for pre-commit checks:

- ESLint runs on staged `.js`, `.jsx`, `.ts`, `.tsx` files
- Commits are blocked if there are linting errors

## Demo Accounts

For development/testing, use these demo accounts:

| Role | Email | Password |
|------|-------|----------|
| Player | player@demo.com | player123 |
| Coach | coach@demo.com | coach123 |
| Admin | admin@demo.com | admin123 |

## Environment Variables

Create a `.env.local` file:

```env
REACT_APP_API_BASE_URL=http://localhost:3000/api/v1
```

## Contributing

1. Create a feature branch
2. Make changes
3. Ensure tests pass: `npm test`
4. Ensure no lint errors: `npm run lint`
5. Submit a pull request

## Tech Stack

- **React 18** - UI framework
- **React Router 7** - Routing
- **Axios** - HTTP client
- **Lucide React** - Icons
- **Tailwind CSS** - Styling
- **Jest** - Unit testing
- **Playwright** - E2E testing
