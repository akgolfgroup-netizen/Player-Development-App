# Testing Guide

## E2E Tests with Playwright

### Setup Complete ✅

- ✅ Playwright installed (`@playwright/test@1.57.0`)
- ✅ Chromium browser installed
- ✅ 14 test cases implemented covering all mobile screens
- ✅ Authentication configured (demo user auto-login)
- ✅ API mocking configured for all endpoints

### Test Coverage (14 Tests)

**Mobile Home (TC-MH)** - 3 tests
- TC-MH-01: Renders focus + next event
- TC-MH-02: Empty state when no events/plan
- TC-MH-03: 500 error shows retry button

**Mobile Calibration (TC-CAL-M)** - 4 tests
- TC-CAL-M-01: Start session successfully
- TC-CAL-M-02: Submit success with 5 samples
- TC-CAL-M-03: 422 validation error for insufficient samples
- TC-CAL-M-04: 500 retry preserves sample state

**Mobile Plan (TC-PLAN-M)** - 2 tests
- TC-PLAN-M-01: Current plan displays correctly
- TC-PLAN-M-02: 404 no plan shows empty state

**Mobile Quick Log (TC-LOG-M)** - 3 tests
- TC-LOG-M-01: Save success with idempotency-key header
- TC-LOG-M-02: 400 validation shows inline error
- TC-LOG-M-03: Idempotency prevents duplicates

**Mobile Calendar (TC-CALN-M)** - 2 tests
- TC-CALN-M-01: Event list displays correctly
- TC-CALN-M-02: Empty state for no events

### Running Tests

#### Option 1: Manual Server + Tests (Recommended)

```bash
# Terminal 1 - Start dev server
cd apps/web
npm start
# Wait for "Compiled successfully!" message

# Terminal 2 - Run tests
cd apps/web
npm run test:e2e
```

#### Option 2: Automatic Server Startup

```bash
cd apps/web
npm run test:e2e
# Playwright will start the dev server automatically
# Note: First run takes 2-3 minutes for compilation
```

#### Option 3: Headed Mode (See Browser)

```bash
cd apps/web
npm run test:e2e:headed
```

#### Option 4: UI Mode (Interactive)

```bash
cd apps/web
npm run test:e2e:ui
```

### Test Configuration

**File:** `apps/web/playwright.config.js`

```javascript
{
  testDir: './tests',
  baseURL: 'http://localhost:3001',
  webServer: {
    command: 'npm start',
    url: 'http://localhost:3001',
    reuseExistingServer: true,
    timeout: 180000,
  }
}
```

**Test File:** `apps/web/tests/mobile.spec.js`

- All tests use mocked API responses
- Authentication set up automatically via `test.beforeEach()`
- No backend API required for tests to run

### Authentication in Tests

Tests automatically set up a demo user in localStorage:

```javascript
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('accessToken', 'demo-token');
    localStorage.setItem('userData', JSON.stringify({
      id: 'demo-player-1',
      email: 'player@demo.com',
      firstName: 'Anders',
      lastName: 'Kristiansen',
      role: 'player',
    }));
  });
});
```

### API Mocking

All API calls are mocked using `page.route()`:

```javascript
// Example: Mock /api/v1/plan/current
await page.route('**/api/v1/plan/current', async (route) => {
  await route.fulfill({
    status: 200,
    body: JSON.stringify({
      id: 'plan_123',
      name: 'Vinter Treningsplan 2025',
      currentWeek: 3,
      totalWeeks: 12,
    }),
  });
});
```

### Test Results

After running tests, view the HTML report:

```bash
npx playwright show-report
```

### CI/CD Integration

Add to your CI pipeline:

```yaml
- name: Install Playwright
  run: npx playwright install --with-deps

- name: Run E2E Tests
  run: npm run test:e2e
  working-directory: apps/web

- name: Upload Test Results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: apps/web/playwright-report/
```

### Troubleshooting

**Issue: "Timed out waiting for webServer"**
- Solution: Start dev server manually first, or increase timeout in config

**Issue: "Navigation timeout"**
- Solution: Check if routes are protected and authentication is set up

**Issue: "Element not found"**
- Solution: Check if text/selectors match Norwegian UI text

**Issue: Port conflicts**
- Solution: Kill existing processes: `lsof -ti:3001 | xargs kill -9`

### Manual Testing Checklist

Since automated tests may require setup, here's a manual testing checklist:

**Mobile Home (/m/home)**
- [ ] Greeting displays user's first name
- [ ] Focus area shows current training focus
- [ ] Next event displays correctly
- [ ] Empty state shows when no plan
- [ ] Error state with retry button on API failure

**Mobile Calibration (/m/calibration)**
- [ ] "Start Kalibrering" button starts session
- [ ] Can add samples (button enabled)
- [ ] Submit button disabled until 5 samples
- [ ] Submit button enabled at 5+ samples
- [ ] Success message on completion
- [ ] Sample count persists through errors

**Mobile Plan (/m/plan)**
- [ ] Current plan displays name and weeks
- [ ] Focus area shows correctly
- [ ] Empty state when no active plan
- [ ] Loading state during fetch

**Mobile Quick Log (/m/log)**
- [ ] Form allows type selection
- [ ] Duration input accepts numbers
- [ ] Submit sends idempotency-key header
- [ ] Success message on save
- [ ] Form resets after success
- [ ] Validation errors display inline

**Mobile Calendar (/m/calendar)**
- [ ] Events list displays all events
- [ ] Each event shows title, date, duration
- [ ] Empty state when no events
- [ ] Loading state during fetch

### Next Steps

1. **Run Tests Locally**
   - Verify all 14 tests pass
   - Check for any flaky tests
   - Review test coverage

2. **Add More Tests**
   - Error boundary tests
   - Navigation tests
   - Accessibility tests
   - Mobile viewport tests

3. **Visual Regression**
   - Add screenshot tests
   - Compare against baseline
   - Detect unintended UI changes

4. **Performance Tests**
   - Measure page load times
   - Check bundle sizes
   - Lighthouse scores

5. **Integration with Backend**
   - Test with real API (not mocked)
   - Test authentication flows
   - Test error scenarios
