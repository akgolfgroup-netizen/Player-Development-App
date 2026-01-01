# Option D: Testing & Quality Assurance

**Status:** Documented - Ready for Implementation
**Estimated Effort:** 1-2 weeks

## Overview

Comprehensive testing strategy covering unit tests, integration tests, E2E tests, visual regression, accessibility, and performance testing.

## Current Status

✅ **Completed:**
- 14 Playwright E2E tests for mobile screens
- Test infrastructure setup
- Playwright configuration

🔸 **To Implement:**
- Unit tests (Jest)
- Integration tests
- Visual regression tests
- Accessibility tests
- Performance tests
- Load testing

## Test Strategy

### 1. Unit Tests (Jest + React Testing Library)

**Target:** 80% code coverage for business logic

**Setup:**
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

**Configuration:**
```javascript
// apps/web/jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.spec.{js,jsx}',
    '!src/index.js',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 80,
      statements: 80,
    },
  },
};
```

**Example Tests:**
```javascript
// src/components/ui/ErrorState.spec.js
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorState from './ErrorState';

describe('ErrorState', () => {
  it('renders error message', () => {
    render(<ErrorState message="Test error" />);
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('calls onRetry when button clicked', () => {
    const onRetry = jest.fn();
    render(<ErrorState message="Error" onRetry={onRetry} />);

    fireEvent.click(screen.getByText(/prøv igjen/i));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('shows correct error type message', () => {
    render(<ErrorState errorType="validation_error" />);
    expect(screen.getByText(/ugyldig input/i)).toBeInTheDocument();
  });
});
```

**Priority Areas:**
1. UI Components (LoadingState, ErrorState, etc.)
2. Utility functions (design tokens, helpers)
3. Custom hooks (useAuth, usePullToRefresh)
4. API client error handling
5. Form validation logic

### 2. Integration Tests

**Target:** Test component interactions and data flow

**Example:**
```javascript
// src/mobile/MobileQuickLog.integration.spec.js
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider } from '../../contexts/AuthContext';
import MobileQuickLog from './MobileQuickLog';
import apiClient from '../../services/apiClient';

jest.mock('../../services/apiClient');

describe('MobileQuickLog Integration', () => {
  it('submits training log successfully', async () => {
    apiClient.post.mockResolvedValueOnce({ data: { id: 'session_123' } });

    render(
      <AuthProvider>
        <MobileQuickLog />
      </AuthProvider>
    );

    await userEvent.selectOptions(screen.getByLabelText(/type/i), 'golf');
    await userEvent.type(screen.getByLabelText(/varighet/i), '60');
    await userEvent.click(screen.getByText('Lagre'));

    await waitFor(() => {
      expect(screen.getByText('Trening lagret!')).toBeInTheDocument();
    });

    expect(apiClient.post).toHaveBeenCalledWith(
      '/training/sessions',
      expect.objectContaining({ type: 'golf', duration: 60 }),
      expect.any(Object)
    );
  });
});
```

### 3. E2E Tests (Playwright) - Expansion

**Current:** 14 mobile tests
**Target:** 50+ tests covering all user journeys

**Additional Test Suites:**

a) **Desktop Dashboard Tests**
```javascript
// tests/desktop/dashboard.spec.js
test.describe('Desktop Dashboard', () => {
  test('coach sees all players', async ({ page }) => {
    // Mock coach user
    // Navigate to dashboard
    // Verify player list
  });

  test('filters players by category', async ({ page }) => {
    // Test filter functionality
  });
});
```

b) **Form Validation Tests**
```javascript
test('shows validation errors for invalid input', async ({ page }) => {
  await page.goto('/m/log');
  await page.fill('input[type="number"]', '-10'); // Invalid duration
  await page.click('button[type="submit"]');
  await expect(page.getByText(/ugyldig/i)).toBeVisible();
});
```

c) **Authentication Flow Tests**
```javascript
test('redirects to login when unauthorized', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveURL('/login');
});
```

d) **Multi-User Journey Tests**
```javascript
test('complete training workflow', async ({ page }) => {
  // Login
  // View plan
  // Log training
  // Check calendar update
  // Verify in dashboard
});
```

### 4. Visual Regression Tests (Percy or Chromatic)

**Target:** Catch unintended UI changes

**Setup:**
```bash
npm install --save-dev @percy/cli @percy/playwright
```

**Configuration:**
```javascript
// tests/visual/visual.spec.js
import percySnapshot from '@percy/playwright';

test('mobile home visual test', async ({ page }) => {
  await page.goto('/m/home');
  await percySnapshot(page, 'Mobile Home');
});

test('dashboard visual test', async ({ page }) => {
  await page.goto('/dashboard');
  await percySnapshot(page, 'Desktop Dashboard');
});
```

**Benefits:**
- Automatic screenshot comparison
- Detect CSS regressions
- Review changes visually before merge

### 5. Accessibility Tests (axe-core)

**Target:** WCAG 2.1 AA compliance

**Setup:**
```bash
npm install --save-dev @axe-core/playwright
```

**Implementation:**
```javascript
// tests/accessibility/a11y.spec.js
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/m/home');
    await injectAxe(page);
  });

  test('mobile home has no accessibility violations', async ({ page }) => {
    await checkA11y(page);
  });

  test('forms are keyboard navigable', async ({ page }) => {
    await page.goto('/m/log');
    await page.keyboard.press('Tab');
    await expect(page.locator('select')).toBeFocused();
  });
});
```

**Checks:**
- Color contrast
- ARIA labels
- Keyboard navigation
- Screen reader compatibility
- Focus indicators

### 6. Performance Tests (Lighthouse CI)

**Target:** Performance budget enforcement

**Setup:**
```bash
npm install --save-dev @lhci/cli
```

**Configuration:**
```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000/', 'http://localhost:3000/m/home'],
      numberOfRuns: 3,
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'interactive': ['error', { maxNumericValue: 3500 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
```

**Metrics Tracked:**
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)
- Total Blocking Time (TBT)
- Cumulative Layout Shift (CLS)

### 7. Load Testing (Artillery or k6)

**Target:** Verify API can handle load

**Setup:**
```bash
npm install --save-dev artillery
```

**Configuration:**
```yaml
# load-test.yml
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 10
      name: Warm up
    - duration: 120
      arrivalRate: 50
      name: Sustained load
scenarios:
  - name: 'Dashboard load test'
    flow:
      - get:
          url: '/api/v1/dashboard/player'
          headers:
            Authorization: 'Bearer {{token}}'
      - think: 2
      - get:
          url: '/api/v1/plan/current'
```

**Run:** `npx artillery run load-test.yml`

### 8. Backend API Tests (Supertest)

**Target:** Test API endpoints independently

**Setup:**
```bash
cd apps/api
npm install --save-dev supertest
```

**Example:**
```typescript
// apps/api/src/api/v1/plan/plan.test.ts
import request from 'supertest';
import { buildApp } from '../../../app';

describe('Plan API', () => {
  let app;

  beforeAll(async () => {
    app = await buildApp({ logger: false });
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/v1/plan/current returns current plan', async () => {
    const response = await request(app.server)
      .get('/api/v1/plan/current')
      .set('Authorization', 'Bearer test-token')
      .expect(200);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name');
  });

  it('GET /api/v1/plan/current returns 401 without auth', async () => {
    await request(app.server)
      .get('/api/v1/plan/current')
      .expect(401);
  });
});
```

### 9. Contract Testing (Pact)

**Target:** Ensure frontend-backend API contract agreement

**Use Case:** When frontend and backend teams work independently

**Deferred for MVP**

### 10. Security Testing

**Tools:**
- OWASP ZAP
- npm audit
- Snyk

**Checks:**
- SQL injection
- XSS vulnerabilities
- CSRF protection
- Dependency vulnerabilities
- Authentication bypass

**Implementation:**
```bash
# Dependency audit
npm audit --audit-level=high

# Fix vulnerabilities
npm audit fix

# Snyk monitoring
npx snyk test
npx snyk monitor
```

## Test Coverage Goals

| Test Type | Current | Target |
|-----------|---------|--------|
| Unit Tests | 0% | 80% |
| Integration Tests | 0% | 60% |
| E2E Tests | Mobile only (14 tests) | 50+ tests |
| Visual Regression | 0% | Key screens |
| Accessibility | 0% | 100% (automated) |
| Performance | Manual | Automated CI |
| Load Testing | 0% | Critical endpoints |

## CI/CD Integration

**GitHub Actions Workflow:**
```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v3

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npx playwright install
      - run: npm run test:e2e

  accessibility:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: npm run test:a11y

  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: npm run build
      - run: npx lhci autorun
```

## Implementation Timeline

**Week 1:**
- Unit tests for UI components
- Integration tests for critical flows
- Expand E2E tests to desktop

**Week 2:**
- Visual regression setup
- Accessibility tests
- Performance benchmarks
- Load testing setup

## Success Criteria

✅ **Code Coverage:** >80% for critical paths
✅ **E2E Tests:** All user journeys covered
✅ **Performance:** Lighthouse score >90
✅ **Accessibility:** No critical violations
✅ **Load:** API handles 100 req/sec
✅ **CI/CD:** All tests run automatically

## Benefits

- Catch bugs early
- Prevent regressions
- Confidence in deployments
- Better code quality
- Documentation via tests
- Faster debugging

## Documentation

Maintain test documentation in `TESTING_GUIDE.md` with:
- How to run tests
- How to write new tests
- Coverage reports
- CI/CD integration
- Troubleshooting
