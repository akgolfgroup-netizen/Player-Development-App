# Contributing to AK Golf Academy IUP Platform

## Development Setup

### Prerequisites

| Tool | Version | Installation |
|------|---------|--------------|
| Node.js | 20+ | [nodejs.org](https://nodejs.org/) |
| pnpm | 8.12+ | `npm install -g pnpm` |
| Docker | Latest | [docker.com](https://docker.com/) |

### Getting Started

See the [Development Guide](./docs/guides/development.md) for detailed setup instructions.

```bash
# Quick start
pnpm install
cd apps/api && docker-compose up -d
npx prisma generate && npx prisma migrate deploy
pnpm dev
```

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
- Follow existing patterns in `src/components/` and `src/ui/`
- Use the design tokens from `design-tokens.js`

### File Naming

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `UserProfile.jsx` |
| Utilities | camelCase | `apiClient.js` |
| Types | PascalCase | `PlayerTypes.ts` |
| Tests | `*.test.ts` | `auth.test.ts` |

### Code Quality

Run before committing:

```bash
pnpm lint        # ESLint check
pnpm format      # Prettier format
pnpm typecheck   # TypeScript check
pnpm test        # Run tests
```

---

## Testing

### Unit Tests
```bash
pnpm test
```

### E2E Tests (Playwright)
```bash
cd apps/web
pnpm test:e2e
```

See [Testing Guide](./docs/guides/testing.md) for details.

---

## Commit Guidelines

Use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format: type(scope): description

git commit -m "feat(auth): add two-factor authentication"
git commit -m "fix(dashboard): resolve loading state issue"
git commit -m "docs(api): update endpoint documentation"
git commit -m "test(players): add integration tests"
```

### Types
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `test` - Tests
- `refactor` - Code refactoring
- `style` - Formatting
- `chore` - Maintenance

---

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Ensure tests pass: `pnpm test`
4. Ensure linting passes: `pnpm lint`
5. Submit PR with description of changes
6. Wait for review

### PR Checklist

- [ ] Tests pass
- [ ] Linting passes
- [ ] TypeScript compiles
- [ ] Documentation updated (if needed)
- [ ] No console.log statements
- [ ] No hardcoded credentials

---

## Resources

- [Development Guide](./docs/guides/development.md)
- [Testing Guide](./docs/guides/testing.md)
- [Architecture Overview](./docs/architecture/overview.md)
- [API Documentation](./docs/api/README.md)

---

## Questions?

Open an issue or contact the maintainers.
