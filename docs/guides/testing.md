# Testing Guide

> Testing strategy and practices for IUP Golf Platform

## Test Pyramid

```
         ┌─────────┐
         │   E2E   │  Few, slow, high confidence
         ├─────────┤
         │ Integr. │  Some, medium speed
         ├─────────┤
         │  Unit   │  Many, fast, low confidence
         └─────────┘
```

## Running Tests

```bash
# All tests
pnpm test

# Watch mode
pnpm test -- --watch

# Coverage report
pnpm test -- --coverage

# Specific file
pnpm test -- auth.test.ts

# Specific pattern
pnpm test -- --testNamePattern="login"
```

## Test Structure

```
apps/api/tests/
├── setup.ts              # Global test setup
├── helpers/
│   ├── testUtils.ts      # Test utilities
│   └── testFixtures.ts   # Data factories
├── unit/                 # Unit tests
│   ├── gamification/
│   └── notifications/
├── integration/          # Integration tests
│   ├── auth.test.ts
│   ├── players.test.ts
│   └── ...
└── security/             # Security tests
    ├── rbac.test.ts
    ├── sql-injection.test.ts
    └── xss.test.ts
```

## Unit Tests

Test individual functions and classes in isolation.

```typescript
// apps/api/tests/unit/gamification/badge-evaluator.test.ts
describe('BadgeEvaluator', () => {
  describe('evaluatePlayerBadges', () => {
    it('should unlock badge when requirements met', async () => {
      const metrics = createTestMetrics({ sessionsCompleted: 10 });
      const result = await evaluator.evaluate(metrics);
      expect(result.unlockedBadges).toContain('first_10_sessions');
    });
  });
});
```

## Integration Tests

Test API endpoints with real database.

```typescript
// apps/api/tests/integration/auth.test.ts
describe('POST /api/v1/auth/login', () => {
  it('should return tokens for valid credentials', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: {
        email: 'test@example.com',
        password: 'password123',
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toHaveProperty('accessToken');
  });

  it('should reject invalid credentials', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: {
        email: 'test@example.com',
        password: 'wrong',
      },
    });

    expect(response.statusCode).toBe(401);
  });
});
```

## Security Tests

Test for common vulnerabilities.

```typescript
// apps/api/tests/security/sql-injection.test.ts
describe('SQL Injection Prevention', () => {
  const maliciousInputs = [
    "'; DROP TABLE users; --",
    "1 OR 1=1",
    "1; DELETE FROM players",
  ];

  maliciousInputs.forEach((input) => {
    it(`should handle malicious input: ${input}`, async () => {
      const response = await app.inject({
        method: 'GET',
        url: `/api/v1/players?search=${encodeURIComponent(input)}`,
        headers: { Authorization: `Bearer ${validToken}` },
      });

      // Should not error, Prisma parameterizes
      expect(response.statusCode).not.toBe(500);
    });
  });
});
```

## Test Utilities

### Test Fixtures

```typescript
// apps/api/tests/helpers/testFixtures.ts
export function createTestPlayer(overrides = {}) {
  return {
    id: randomUUID(),
    email: `test-${randomUUID()}@example.com`,
    firstName: 'Test',
    lastName: 'Player',
    ...overrides,
  };
}

export async function seedTestData(prisma) {
  const tenant = await prisma.tenant.create({...});
  const coach = await prisma.user.create({...});
  const player = await prisma.player.create({...});
  return { tenant, coach, player };
}
```

### Authentication Helper

```typescript
// apps/api/tests/helpers/testUtils.ts
export function getAuthToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role, tenantId: user.tenantId },
    process.env.JWT_SECRET
  );
}
```

## E2E Tests (Playwright)

```typescript
// apps/web/tests/e2e/login.spec.ts
import { test, expect } from '@playwright/test';

test('player can log in', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name="email"]', 'player@demo.com');
  await page.fill('[name="password"]', 'demo123');
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('h1')).toContainText('Dashboard');
});
```

## Coverage

Target: **40%+** overall coverage (currently at 45%)

```bash
# Generate coverage report
pnpm test -- --coverage

# View HTML report
open coverage/lcov-report/index.html
```

## Best Practices

### Do

- Write tests before fixing bugs
- Use descriptive test names
- Test edge cases
- Clean up test data after tests
- Use factories for test data

### Don't

- Test implementation details
- Rely on test order
- Use production data
- Skip flaky tests indefinitely
- Mock too much

## CI/CD Integration

Tests run automatically on:
- Pull request creation
- Push to main branch

```yaml
# .github/workflows/ci.yml
- name: Run tests
  run: pnpm test -- --coverage

- name: Upload coverage
  uses: codecov/codecov-action@v3
```

---

See also:
- [Development Guide](./development.md)
- [Contributing Guide](./contributing.md)
