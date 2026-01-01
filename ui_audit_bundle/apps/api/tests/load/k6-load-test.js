/**
 * K6 Load Testing Script
 *
 * Tests API performance under load:
 * - 100 concurrent users
 * - 5 minute duration
 * - Mixed workload (read/write operations)
 *
 * Run with: k6 run tests/load/k6-load-test.js
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const loginDuration = new Trend('login_duration');
const apiDuration = new Trend('api_duration');
const failedRequests = new Counter('failed_requests');

// Test configuration
export const options = {
  stages: [
    { duration: '1m', target: 20 },  // Ramp up to 20 users
    { duration: '2m', target: 50 },  // Ramp up to 50 users
    { duration: '3m', target: 100 }, // Ramp up to 100 users
    { duration: '3m', target: 100 }, // Stay at 100 users
    { duration: '1m', target: 0 },   // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    http_req_failed: ['rate<0.1'],    // Less than 10% of requests should fail
    errors: ['rate<0.1'],             // Less than 10% error rate
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:4000';

// Test data
const DEMO_USERS = [
  { email: 'admin@demo.com', password: 'admin123', role: 'admin' },
  { email: 'coach@demo.com', password: 'coach123', role: 'coach' },
  { email: 'player@demo.com', password: 'player123', role: 'player' },
];

/**
 * Login and get access token
 */
function login(user) {
  const loginStart = Date.now();

  const loginRes = http.post(
    `${BASE_URL}/api/v1/auth/login`,
    JSON.stringify({
      email: user.email,
      password: user.password,
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );

  const loginSuccess = check(loginRes, {
    'login status is 200': (r) => r.status === 200,
    'login has access token': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.data && body.data.accessToken;
      } catch {
        return false;
      }
    },
  });

  if (!loginSuccess) {
    errorRate.add(1);
    failedRequests.add(1);
    return null;
  }

  loginDuration.add(Date.now() - loginStart);

  const body = JSON.parse(loginRes.body);
  return body.data.accessToken;
}

/**
 * Make authenticated GET request
 */
function authenticatedGet(endpoint, token) {
  const start = Date.now();

  const res = http.get(`${BASE_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const success = check(res, {
    [`GET ${endpoint} status is 200`]: (r) => r.status === 200,
    [`GET ${endpoint} has data`]: (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.data !== undefined;
      } catch {
        return false;
      }
    },
  });

  apiDuration.add(Date.now() - start);

  if (!success) {
    errorRate.add(1);
    failedRequests.add(1);
  }

  return res;
}

/**
 * Make authenticated POST request
 */
function authenticatedPost(endpoint, token, payload) {
  const start = Date.now();

  const res = http.post(
    `${BASE_URL}${endpoint}`,
    JSON.stringify(payload),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const success = check(res, {
    [`POST ${endpoint} status is OK`]: (r) => r.status >= 200 && r.status < 300,
  });

  apiDuration.add(Date.now() - start);

  if (!success) {
    errorRate.add(1);
    failedRequests.add(1);
  }

  return res;
}

/**
 * Main test scenario
 */
export default function () {
  // Randomly select a user type
  const user = DEMO_USERS[Math.floor(Math.random() * DEMO_USERS.length)];

  // Login
  const token = login(user);

  if (!token) {
    sleep(1);
    return;
  }

  // Simulate realistic user behavior based on role
  if (user.role === 'admin') {
    // Admin workflow
    authenticatedGet('/api/v1/players', token);
    sleep(1);

    authenticatedGet('/api/v1/coaches', token);
    sleep(1);

    authenticatedGet('/api/v1/dashboard/stats', token);
    sleep(2);

  } else if (user.role === 'coach') {
    // Coach workflow
    authenticatedGet('/api/v1/players', token);
    sleep(1);

    authenticatedGet('/api/v1/sessions', token);
    sleep(1);

    // View player details (simulate random player)
    authenticatedGet('/api/v1/players?limit=10', token);
    sleep(2);

    // Check analytics
    authenticatedGet('/api/v1/coach-analytics/overview', token);
    sleep(1);

  } else if (user.role === 'player') {
    // Player workflow
    // View own training plan
    authenticatedGet('/api/v1/training-plan/daily', token);
    sleep(1);

    // View progress
    authenticatedGet('/api/v1/players/me', token);
    sleep(1);

    // View badges/achievements
    authenticatedGet('/api/v1/badges/player', token);
    sleep(2);

    // Log training session
    const sessionPayload = {
      date: new Date().toISOString().split('T')[0],
      duration: 60,
      type: 'practice',
      notes: 'Load test session',
    };

    authenticatedPost('/api/v1/sessions', token, sessionPayload);
    sleep(1);
  }

  // Common actions for all users
  // Check notifications
  authenticatedGet('/api/v1/notifications', token);
  sleep(1);

  // Random think time
  sleep(Math.random() * 3 + 1);
}

/**
 * Setup function - runs once before the test
 */
export function setup() {
  console.log('Starting load test...');
  console.log(`Base URL: ${BASE_URL}`);
  console.log('Target: 100 concurrent users');
  console.log('Duration: ~10 minutes');

  // Verify API is accessible
  const healthCheck = http.get(`${BASE_URL}/health`);

  if (healthCheck.status !== 200) {
    console.error('API health check failed!');
    console.error(`Status: ${healthCheck.status}`);
    console.error(`Body: ${healthCheck.body}`);
  }

  return { startTime: Date.now() };
}

/**
 * Teardown function - runs once after the test
 */
export function teardown(data) {
  const duration = (Date.now() - data.startTime) / 1000;
  console.log(`Test completed in ${duration} seconds`);
}

/**
 * Handle summary statistics
 */
export function handleSummary(data) {
  return {
    'load-test-results.json': JSON.stringify(data, null, 2),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}

function textSummary(data, options = {}) {
  const indent = options.indent || '';
  const colors = options.enableColors !== false;

  let summary = '\n';
  summary += `${indent}Load Test Summary\n`;
  summary += `${indent}================\n\n`;

  // Test duration
  const duration = data.state.testRunDurationMs / 1000;
  summary += `${indent}Duration: ${duration.toFixed(2)}s\n\n`;

  // Requests
  const iterations = data.metrics.iterations.values.count;
  const httpReqs = data.metrics.http_reqs?.values.count || 0;
  const httpReqFailed = data.metrics.http_req_failed?.values.rate || 0;

  summary += `${indent}Requests:\n`;
  summary += `${indent}  Total: ${httpReqs}\n`;
  summary += `${indent}  Failed: ${(httpReqFailed * 100).toFixed(2)}%\n`;
  summary += `${indent}  Iterations: ${iterations}\n\n`;

  // Response times
  const p50 = data.metrics.http_req_duration?.values['p(50)'] || 0;
  const p95 = data.metrics.http_req_duration?.values['p(95)'] || 0;
  const p99 = data.metrics.http_req_duration?.values['p(99)'] || 0;
  const avg = data.metrics.http_req_duration?.values.avg || 0;

  summary += `${indent}Response Times:\n`;
  summary += `${indent}  Average: ${avg.toFixed(2)}ms\n`;
  summary += `${indent}  p50: ${p50.toFixed(2)}ms\n`;
  summary += `${indent}  p95: ${p95.toFixed(2)}ms\n`;
  summary += `${indent}  p99: ${p99.toFixed(2)}ms\n\n`;

  // Virtual users
  const vus = data.metrics.vus?.values.value || 0;
  const vusMax = data.metrics.vus_max?.values.value || 0;

  summary += `${indent}Virtual Users:\n`;
  summary += `${indent}  Current: ${vus}\n`;
  summary += `${indent}  Max: ${vusMax}\n\n`;

  // Custom metrics
  if (data.metrics.errors) {
    const errorRate = data.metrics.errors.values.rate || 0;
    summary += `${indent}Error Rate: ${(errorRate * 100).toFixed(2)}%\n`;
  }

  if (data.metrics.failed_requests) {
    const failedCount = data.metrics.failed_requests.values.count || 0;
    summary += `${indent}Failed Requests: ${failedCount}\n`;
  }

  summary += '\n';

  return summary;
}
