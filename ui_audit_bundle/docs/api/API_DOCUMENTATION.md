# IUP Golf Academy API Documentation

**Version:** 1.0.0
**Base URL (Development):** `http://localhost:3000`
**Base URL (Production):** `https://api.iup-golf.com`
**Interactive Docs:** `/docs` (Swagger UI)

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Authentication](#authentication)
3. [Authorization & Roles](#authorization--roles)
4. [Request/Response Format](#requestresponse-format)
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)
7. [CSRF Protection](#csrf-protection)
8. [Pagination](#pagination)
9. [Common Workflows](#common-workflows)
10. [API Endpoints](#api-endpoints)
11. [WebSocket Events](#websocket-events)
12. [Testing](#testing)

---

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL 15+ database
- Redis (optional, for caching)
- API access credentials

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/your-org/iup-golf-api.git

# 2. Install dependencies
cd iup-golf-api/apps/api
pnpm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# 4. Run database migrations
pnpm prisma migrate dev

# 5. Seed the database
pnpm prisma db seed

# 6. Start the development server
pnpm dev

# API is now running at http://localhost:3000
# Swagger docs available at http://localhost:3000/docs
```

---

## Authentication

The API uses **JWT (JSON Web Token)** based authentication with access and refresh tokens.

### Authentication Flow

```
┌─────────┐                           ┌─────────┐
│         │  1. POST /api/v1/auth/login │         │
│ Client  │ ─────────────────────────> │   API   │
│         │                           │         │
│         │  2. Access + Refresh Token  │         │
│         │ <───────────────────────── │         │
└─────────┘                           └─────────┘
     │                                     │
     │  3. Requests with Bearer token      │
     │ ─────────────────────────────────> │
     │                                     │
     │  4. Token expires after 15min       │
     │ ─────────────────────────────────> │
     │  401 Unauthorized                   │
     │ <───────────────────────────────── │
     │                                     │
     │  5. POST /api/v1/auth/refresh       │
     │ ─────────────────────────────────> │
     │  6. New Access Token                │
     │ <───────────────────────────────── │
```

### Registration

**Endpoint:** `POST /api/v1/auth/register`

**Request:**
```json
{
  "email": "coach@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "role": "coach",
  "organizationName": "AK Golf Academy",
  "organizationSlug": "ak-golf"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 900,
    "user": {
      "id": "uuid-here",
      "email": "coach@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "coach",
      "tenantId": "org-uuid"
    }
  }
}
```

### Login

**Endpoint:** `POST /api/v1/auth/login`

**Request:**
```json
{
  "email": "coach@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 900,
    "user": {
      "id": "uuid-here",
      "email": "coach@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "coach",
      "tenantId": "org-uuid"
    }
  }
}
```

### Using Access Tokens

Include the access token in the `Authorization` header for all authenticated requests:

```http
GET /api/v1/players
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Example with cURL:**
```bash
curl -X GET http://localhost:3000/api/v1/players \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Example with JavaScript (fetch):**
```javascript
const response = await fetch('http://localhost:3000/api/v1/players', {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
});
```

### Refreshing Tokens

When the access token expires (after 15 minutes), use the refresh token to get a new one:

**Endpoint:** `POST /api/v1/auth/refresh`

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 900,
    "user": { ... }
  }
}
```

### Token Lifetimes

- **Access Token:** 15 minutes
- **Refresh Token:** 7 days

### Logout

**Endpoint:** `POST /api/v1/auth/logout`

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Authorization & Roles

The API implements **Role-Based Access Control (RBAC)** with three roles:

| Role | Description | Permissions |
|------|-------------|-------------|
| `admin` | System administrator | Full access to all resources |
| `coach` | Golf coach/trainer | Manage assigned players, view analytics, create training plans |
| `player` | Golf player/student | View own data, update profile, log training |

### Permission Matrix

| Resource | Admin | Coach | Player |
|----------|-------|-------|--------|
| Create Players | ✅ | ✅ | ❌ |
| View All Players | ✅ | ✅ (assigned only) | ❌ |
| View Own Profile | ✅ | ✅ | ✅ |
| Create Training Plans | ✅ | ✅ | ❌ |
| Update Training Plans | ✅ | ✅ (own only) | ❌ |
| View Analytics | ✅ | ✅ (assigned players) | ✅ (own only) |
| Manage Users | ✅ | ❌ | ❌ |
| Delete Resources | ✅ | ❌ | ❌ |

### Authorization Examples

**Admin-only endpoint:**
```http
DELETE /api/v1/players/:id
Authorization: Bearer <admin-token>
```

**Coach or Admin:**
```http
POST /api/v1/players
Authorization: Bearer <coach-or-admin-token>
```

**Any authenticated user:**
```http
GET /api/v1/auth/me
Authorization: Bearer <any-valid-token>
```

---

## Request/Response Format

### Standard Response Structure

All API responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "data": {
    // Response data here
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      // Optional additional error details
    }
  }
}
```

### Content Type

All requests and responses use `application/json`:

```http
Content-Type: application/json
Accept: application/json
```

### Date/Time Format

All timestamps use **ISO 8601** format:

```json
{
  "createdAt": "2024-12-25T10:30:00.000Z",
  "updatedAt": "2024-12-25T14:45:30.000Z"
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Meaning | When to Expect |
|------|---------|----------------|
| `200` | OK | Successful GET, PATCH, PUT requests |
| `201` | Created | Successful POST request creating a resource |
| `204` | No Content | Successful DELETE request |
| `400` | Bad Request | Invalid request body or parameters |
| `401` | Unauthorized | Missing or invalid authentication token |
| `403` | Forbidden | Authenticated but not authorized for action |
| `404` | Not Found | Resource doesn't exist |
| `409` | Conflict | Resource already exists (e.g., duplicate email) |
| `422` | Unprocessable Entity | Validation failed |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Internal Server Error | Server error (logged automatically) |

### Error Codes

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `UNAUTHORIZED` | 401 | No valid authentication token provided |
| `FORBIDDEN` | 403 | User doesn't have permission |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `DUPLICATE_EMAIL` | 409 | Email already registered |
| `INVALID_CREDENTIALS` | 401 | Wrong email or password |
| `TOKEN_EXPIRED` | 401 | Access token expired, use refresh token |
| `TOKEN_INVALID` | 401 | Token is malformed or invalid |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `CSRF_TOKEN_MISSING` | 403 | CSRF token not provided |
| `CSRF_TOKEN_INVALID` | 403 | CSRF token is invalid |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

### Error Response Examples

**Validation Error:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "fields": {
        "email": "Invalid email format",
        "password": "Password must be at least 8 characters"
      }
    }
  }
}
```

**Not Found:**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Player not found"
  }
}
```

**Unauthorized:**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication token is required"
  }
}
```

---

## Rate Limiting

The API implements rate limiting to prevent abuse and ensure fair usage.

### Rate Limit Tiers

| Tier | Requests/Minute | Applicable To |
|------|----------------|---------------|
| **Auth** | 5 | `/api/v1/auth/login`, `/api/v1/auth/register` |
| **Heavy** | 10 | Report generation, bulk exports |
| **Write** | 30 | POST, PUT, PATCH, DELETE requests |
| **Search** | 50 | Search and filter queries |
| **Default** | 100 | All other requests |

### Rate Limit Headers

Every response includes rate limit information:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

- `X-RateLimit-Limit`: Maximum requests allowed per window
- `X-RateLimit-Remaining`: Requests remaining in current window
- `X-RateLimit-Reset`: Unix timestamp when the limit resets

### Rate Limit Exceeded Response

**Status:** `429 Too Many Requests`

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again in 30 seconds.",
    "details": {
      "retryAfter": 30
    }
  }
}
```

**Retry-After Header:**
```http
Retry-After: 30
```

### Best Practices

1. **Check rate limit headers** in responses
2. **Implement exponential backoff** when rate limited
3. **Cache responses** when possible
4. **Batch requests** instead of making many individual calls
5. **Use webhooks** instead of polling for updates

---

## CSRF Protection

The API implements **CSRF (Cross-Site Request Forgery)** protection for state-changing operations.

### When CSRF is Required

CSRF tokens are required for:
- `POST`, `PUT`, `PATCH`, `DELETE` requests
- Requests from browser environments (SPA, web apps)

### Getting a CSRF Token

**Endpoint:** `GET /csrf-token`

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "abc123...xyz789",
    "headerName": "x-csrf-token"
  }
}
```

The token is also set as a cookie: `XSRF-TOKEN`

### Using CSRF Tokens

Include the token in the request header:

```http
POST /api/v1/players
Authorization: Bearer <access-token>
x-csrf-token: abc123...xyz789
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe"
}
```

**Example with JavaScript:**
```javascript
// 1. Get CSRF token
const csrfResponse = await fetch('/csrf-token');
const { data } = await csrfResponse.json();
const csrfToken = data.token;

// 2. Use in subsequent requests
const response = await fetch('/api/v1/players', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'x-csrf-token': csrfToken,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    firstName: 'John',
    lastName: 'Doe'
  })
});
```

### CSRF Exemptions

CSRF protection is **NOT** required for:
- `GET`, `HEAD`, `OPTIONS` requests (safe methods)
- `/api/v1/auth/login` and `/api/v1/auth/register` (no token yet)
- Test environment (`NODE_ENV=test`)

---

## Pagination

List endpoints support pagination for efficient data retrieval.

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `limit` | integer | 50 | Items per page (max: 100) |
| `sortBy` | string | `createdAt` | Field to sort by |
| `sortOrder` | string | `desc` | Sort direction (`asc` or `desc`) |

### Example Request

```http
GET /api/v1/players?page=2&limit=20&sortBy=lastName&sortOrder=asc
Authorization: Bearer <token>
```

### Paginated Response

```json
{
  "success": true,
  "data": {
    "players": [
      { "id": "1", "firstName": "Alice", "lastName": "Anderson" },
      { "id": "2", "firstName": "Bob", "lastName": "Brown" }
    ],
    "pagination": {
      "page": 2,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

---

## Common Workflows

### 1. Complete Authentication Flow

```javascript
// Step 1: Register new user
const registerResponse = await fetch('/api/v1/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'coach@example.com',
    password: 'SecurePass123!',
    firstName: 'John',
    lastName: 'Doe',
    role: 'coach',
    organizationName: 'My Golf Academy',
    organizationSlug: 'my-academy'
  })
});

const { data } = await registerResponse.json();
const { accessToken, refreshToken } = data;

// Step 2: Make authenticated requests
const playersResponse = await fetch('/api/v1/players', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

// Step 3: Refresh token when expired
const refreshResponse = await fetch('/api/v1/auth/refresh', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ refreshToken })
});

const { data: newTokens } = await refreshResponse.json();
// Use newTokens.accessToken for subsequent requests

// Step 4: Logout
await fetch('/api/v1/auth/logout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ refreshToken })
});
```

### 2. Player Management Workflow

```javascript
// Create a new player
const createResponse = await fetch('/api/v1/players', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    'x-csrf-token': csrfToken
  },
  body: JSON.stringify({
    firstName: 'Emma',
    lastName: 'Wilson',
    email: 'emma@example.com',
    dateOfBirth: '2005-03-15',
    category: 'B',
    handicap: 15.4
  })
});

const { data: player } = await createResponse.json();

// Get player details
const playerResponse = await fetch(`/api/v1/players/${player.id}`, {
  headers: { 'Authorization': `Bearer ${accessToken}` }
});

// Update player
const updateResponse = await fetch(`/api/v1/players/${player.id}`, {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    'x-csrf-token': csrfToken
  },
  body: JSON.stringify({
    handicap: 14.2,
    category: 'A'
  })
});

// List all players with filters
const listResponse = await fetch(
  '/api/v1/players?category=A&status=active&page=1&limit=20',
  { headers: { 'Authorization': `Bearer ${accessToken}` } }
);
```

### 3. Training Plan Workflow

```javascript
// Get training plan for player
const planResponse = await fetch(
  `/api/v1/training-plan/${playerId}/full`,
  { headers: { 'Authorization': `Bearer ${accessToken}` } }
);

// Get today's training
const todayResponse = await fetch(
  `/api/v1/training-plan/${playerId}/today`,
  { headers: { 'Authorization': `Bearer ${accessToken}` } }
);

// Get weekly calendar view
const calendarResponse = await fetch(
  `/api/v1/training-plan/${playerId}/calendar?weekStart=2024-12-23`,
  { headers: { 'Authorization': `Bearer ${accessToken}` } }
);
```

---

## API Endpoints

### Authentication (`/api/v1/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user and organization | ❌ |
| POST | `/login` | Login with email and password | ❌ |
| POST | `/refresh` | Refresh access token | ❌ |
| POST | `/logout` | Logout and revoke refresh token | ❌ |
| GET | `/me` | Get current user info | ✅ |
| POST | `/change-password` | Change password | ✅ |
| POST | `/forgot-password` | Request password reset email | ❌ |
| GET | `/verify-reset-token` | Verify password reset token | ❌ |
| POST | `/reset-password` | Reset password with token | ❌ |
| POST | `/2fa/setup` | Setup 2FA | ✅ |
| POST | `/2fa/verify` | Verify and enable 2FA | ✅ |
| POST | `/2fa/disable` | Disable 2FA | ✅ |
| GET | `/2fa/status` | Check 2FA status | ✅ |

### Players (`/api/v1/players`)

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/` | Create new player | ✅ | Admin, Coach |
| GET | `/` | List players (paginated, filtered) | ✅ | All |
| GET | `/:id` | Get player by ID | ✅ | All |
| PATCH | `/:id` | Update player | ✅ | Admin, Coach |
| DELETE | `/:id` | Delete player | ✅ | Admin |
| GET | `/:id/weekly-summary` | Get player weekly summary | ✅ | All |

### Coaches (`/api/v1/coaches`)

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/` | Create new coach | ✅ | Admin |
| GET | `/` | List coaches | ✅ | All |
| GET | `/:id` | Get coach by ID | ✅ | All |
| PATCH | `/:id` | Update coach | ✅ | Admin, Self |
| DELETE | `/:id` | Delete coach | ✅ | Admin |
| GET | `/:id/players` | Get coach's assigned players | ✅ | Admin, Self |

### Exercises (`/api/v1/exercises`)

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/` | Create exercise | ✅ | Admin, Coach |
| GET | `/` | List exercises | ✅ | All |
| GET | `/:id` | Get exercise by ID | ✅ | All |
| PATCH | `/:id` | Update exercise | ✅ | Admin, Coach |
| DELETE | `/:id` | Delete exercise | ✅ | Admin |

### Training Plans (`/api/v1/training-plan`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/:playerId/full` | Get full training plan | ✅ |
| GET | `/:playerId/today` | Get today's training | ✅ |
| GET | `/:playerId/calendar` | Get calendar view | ✅ |
| GET | `/:playerId/analytics` | Get plan analytics | ✅ |
| POST | `/:playerId/modification-request` | Request plan modification | ✅ |

### Tests (`/api/v1/tests`)

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/` | Create test | ✅ | Admin, Coach |
| GET | `/` | List tests | ✅ | All |
| GET | `/:id` | Get test by ID | ✅ | All |
| PATCH | `/:id` | Update test | ✅ | Admin, Coach |
| DELETE | `/:id` | Delete test | ✅ | Admin |
| POST | `/:id/results` | Submit test results | ✅ | All |
| GET | `/:id/results` | Get test results | ✅ | All |

### Dashboard (`/api/v1/dashboard`)

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/player/:id` | Get player dashboard | ✅ | All |
| GET | `/coach/:id` | Get coach dashboard | ✅ | Admin, Self |
| GET | `/overview` | Get system overview | ✅ | Admin |

### Analytics (`/api/v1/analytics`)

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/player/:id/progress` | Player progress analytics | ✅ | All |
| GET | `/player/:id/performance` | Performance metrics | ✅ | All |
| GET | `/coach/:id/summary` | Coach analytics summary | ✅ | Admin, Self |
| GET | `/benchmarks` | System benchmarks | ✅ | Admin |

---

## WebSocket Events

The API supports real-time updates via WebSocket connections.

### Connection

```javascript
const ws = new WebSocket('ws://localhost:3000/ws');

// Authenticate WebSocket
ws.onopen = () => {
  ws.send(JSON.stringify({
    type: 'auth',
    token: accessToken
  }));
};
```

### Event Types

| Event | Description | Payload |
|-------|-------------|---------|
| `player.updated` | Player data changed | `{ playerId, changes }` |
| `training.completed` | Training session completed | `{ playerId, sessionId }` |
| `test.submitted` | Test results submitted | `{ playerId, testId, results }` |
| `notification.new` | New notification | `{ userId, message, type }` |

---

## Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run integration tests
pnpm test:integration

# Run specific test file
pnpm test tests/integration/auth.test.ts

# Run with coverage
pnpm test:coverage
```

### Test Database

Tests use a separate database: `iup_golf_test`

Reset test database:
```bash
DATABASE_URL="postgresql://iup_golf:dev_password@localhost:5432/iup_golf_test" \
  npx prisma migrate reset --force
```

---

## Support

For questions, issues, or feature requests:

- **Email:** anders@akgolf.no
- **Documentation:** `/docs` (Swagger UI)
- **GitHub Issues:** [Report an issue](https://github.com/your-org/iup-golf-api/issues)

---

**Last Updated:** December 25, 2024
