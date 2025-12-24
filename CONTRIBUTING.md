# Contributing to AK Golf Academy IUP Platform

## Development Setup

### Prerequisites
- Node.js 20+
- Docker Desktop
- pnpm (optional, can use npm)

### Getting Started
See the [README.md](./README.md) for quick start instructions.

---

## ⚠️ Important: Browser Extensions & DOM Injection

### Disable AI/Chat Extensions During Development

**Problem**: Many AI assistant browser extensions (ChatGPT, Blaze, etc.) inject DOM elements into **all web pages**, including your local development environment.

**Symptoms you might see**:
- Unexpected elements like "Open AI Blaze" buttons
- Icons like `icon_128.png` in the DOM
- "Restore your last chat" messages
- Random UI elements that don't exist in your code

**Why this matters**:
1. **False bug reports** - You might waste time debugging "bugs" that don't exist in production
2. **Test failures** - E2E tests may fail due to unexpected DOM elements
3. **Performance** - Extensions can slow down development and cause re-renders
4. **Security confusion** - Hard to distinguish between legitimate code and injection

### Solution: Use a Clean Development Profile

**Option 1: Incognito/Private Window** (Quick)
```bash
# Most extensions are disabled by default in incognito
# Chrome: Cmd+Shift+N (Mac) / Ctrl+Shift+N (Windows)
# Firefox: Cmd+Shift+P (Mac) / Ctrl+Shift+P (Windows)
```

**Option 2: Dedicated Development Browser Profile** (Recommended)
```bash
# Chrome - Create new profile
1. Chrome → Settings → Add Person → "Development"
2. Only install essential dev tools (React DevTools, etc.)
3. Never install AI assistants in this profile

# Firefox - Create new profile
1. about:profiles
2. Create Profile → "Development"
3. Launch in separate browser
```

**Option 3: Disable Extensions Temporarily**
```bash
# Chrome: chrome://extensions
# Firefox: about:addons
# Disable AI assistants: ChatGPT, Blaze, Anthropic, etc.
```

### Known Problematic Extensions
- **Blaze AI** - Injects chat UI and "icon_128.png"
- **ChatGPT** - Adds floating buttons
- **Grammarly** - Heavy DOM mutations
- **AI Assistants** - Various DOM injections

### How to Verify Clean Environment
```bash
# 1. Open DevTools Console
# 2. Run this check:
const injected = document.querySelectorAll('[class*="extension"], [id*="extension"], [src*="icon_128"]');
console.log('Injected elements:', injected.length);
// Should be 0 in clean profile
```

---

## Code Style & Standards

### React/JSX
- Use functional components with hooks
- Follow existing patterns in `src/components/`
- Use the design tokens from `design-tokens.js`

### File Naming
- Components: PascalCase (e.g., `UserProfile.jsx`)
- Utilities: camelCase (e.g., `apiClient.js`)
- Containers: Append "Container" (e.g., `DashboardContainer.jsx`)

### Testing
- Run tests before committing: `npm test`
- E2E tests should run in clean browser context
- See [Testing](#testing) section below

---

## Testing

### Unit Tests
```bash
cd apps/web
npm test
```

### E2E Tests (Playwright)
```bash
cd apps/web
npm run test:e2e
```

**Important**: E2E tests run in a clean browser context without extensions.

---

## Commit Guidelines

- Use descriptive commit messages
- Reference issue numbers when applicable
- Keep commits focused and atomic

### Example
```bash
git commit -m "fix(auth): resolve token refresh race condition (#123)"
```

---

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Run tests and linting
4. Submit PR with description of changes
5. Wait for review

---

## Questions?

Open an issue or contact the maintainers.
