# IUP Golf Academy - API Reference

**Version:** 1.0
**Last Updated:** 2025-12-20
**Base URL:** `/api/v1`

---

## Table of Contents

1. [Authentication](#authentication)
2. [Players](#players)
3. [Coaches](#coaches)
4. [Tests](#tests)
5. [Training Sessions](#training-sessions)
6. [Goals](#goals)
7. [Notes](#notes)
8. [Exercises](#exercises)
9. [Bookings](#bookings)
10. [Calendar](#calendar)
11. [Dashboard](#dashboard)
12. [Achievements](#achievements)
13. [Archive](#archive)
14. [Skoleplan](#skoleplan)

---

## Authentication

### Headers

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

### POST /auth/register

Create a new user account and organization.

**Request:**
```typescript
{
  email: string;              // Valid email
  password: string;           // Min 8 chars
  firstName: string;
  lastName: string;
  organizationName: string;
  role?: 'admin' | 'coach';   // Default: 'admin'
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "accessToken": "...",
    "refreshToken": "...",
    "expiresIn": 900,
    "user": { "id": "uuid", "email": "...", "role": "admin" }
  }
}
```

---

### POST /auth/login

Authenticate with email and password.

**Request:**
```typescript
{
  email: string;
  password: string;
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "accessToken": "...",
    "refreshToken": "...",
    "expiresIn": 900,
    "user": { "id": "uuid", "email": "...", "role": "coach" }
  }
}
```

---

### POST /auth/refresh

Obtain new access token using refresh token.

**Request:**
```typescript
{
  refreshToken: string;
}
```

---

### POST /auth/logout

Revoke refresh token.

**Request:**
```typescript
{
  refreshToken: string;
}
```

---

### GET /auth/me

Get current authenticated user.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "coach",
    "tenantId": "uuid"
  }
}
```

---

## Players

### POST /players

Create a new player.

**Request:**
```typescript
{
  firstName: string;                    // Required
  lastName: string;                     // Required
  email?: string;
  dateOfBirth: string;                  // ISO date
  gender: 'male' | 'female' | 'other';
  category: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K';
  handicap?: number;                    // -10 to 54
  currentPeriod?: 'E' | 'G' | 'S' | 'T'; // Default: 'G'
  weeklyTrainingHours?: number;         // 0-168
  coachId?: string;
  status?: 'active' | 'inactive' | 'suspended';
}
```

---

### GET /players

List players with optional filters.

**Query Parameters:**
```typescript
{
  page?: number;       // Default: 1
  limit?: number;      // Default: 20
  search?: string;
  category?: string;
  status?: string;
  coachId?: string;
  sortBy?: 'firstName' | 'lastName' | 'category' | 'handicap';
  sortOrder?: 'asc' | 'desc';
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "players": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3
    }
  }
}
```

---

### GET /players/:id

Get player details.

---

### PATCH /players/:id

Update player.

---

### DELETE /players/:id

Delete player.

---

### GET /players/:id/weekly-summary

Get player's weekly summary.

**Query:** `weekStart?: string` (ISO date)

**Response:**
```json
{
  "success": true,
  "data": {
    "training": { "totalHours": 12.5, "sessionsCompleted": 8 },
    "tests": { "completed": 3, "improvements": 2 },
    "breakingPoints": { "total": 5, "completed": 2 }
  }
}
```

---

## Coaches

### POST /coaches

Create a new coach.

**Request:**
```typescript
{
  firstName: string;
  lastName: string;
  email: string;
  specializations?: string[];
  workingHours?: object;
  maxPlayersPerSession?: number;  // 1-20
  status?: 'active' | 'inactive' | 'on_leave';
}
```

---

### GET /coaches

List coaches.

---

### GET /coaches/:id

Get coach details.

---

### PATCH /coaches/:id

Update coach.

---

### DELETE /coaches/:id

Delete coach.

---

### GET /coaches/:id/availability

Get coach availability.

**Query:** `startDate`, `endDate` (ISO dates)

---

### GET /coaches/:id/statistics

Get coach statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "players": { "total": 25, "active": 22, "byCategory": {...} },
    "sessions": { "thisWeek": 18, "thisMonth": 72 }
  }
}
```

---

## Tests

### POST /tests

Create test definition.

**Request:**
```typescript
{
  name: string;
  testNumber: number;           // 1-20
  category: string;
  testType: string;
  protocolName: string;
  description: string;
  testDetails: {
    equipment?: string[];
    instructions?: string;
    warmupRequired?: boolean;
    repetitions?: number;
  };
  benchmarkWeek?: boolean;
  isActive?: boolean;
}
```

---

### GET /tests

List test definitions.

---

### GET /tests/:id

Get test definition.

---

### PATCH /tests/:id

Update test definition.

---

### DELETE /tests/:id

Delete test definition.

---

### POST /tests/results

Record a test result.

**Request:**
```typescript
{
  testId: string;
  playerId: string;
  testDate: string;           // ISO date
  value: number;              // Main test value
  pei?: number;               // 0-10
  results: object;            // Detailed results
  coachFeedback?: string;
  playerFeedback?: string;
  videoUrl?: string;
}
```

---

### GET /tests/results

List test results.

**Query:** `playerId`, `testId`, `startDate`, `endDate`

---

### GET /tests/results/:id

Get test result details.

---

### GET /tests/progress

Get player progress across tests.

**Query:** `playerId` (required), `testId`, `startDate`, `endDate`

---

## Training Sessions

### POST /training/sessions

Log a training session.

**Headers:** `Idempotency-Key: unique-request-id` (optional)

**Request:**
```typescript
{
  type: 'gym' | 'golf' | 'cardio' | 'flexibility' | 'other';
  duration: number;           // Minutes
  intensity?: 'low' | 'medium' | 'high';
  date: string;               // ISO date
  notes?: string;
}
```

---

## Goals

### GET /goals

List goals.

**Query:** `status`, `goalType`

---

### GET /goals/active

Get active goals.

---

### GET /goals/completed

Get completed goals.

---

### GET /goals/:id

Get goal details.

---

### POST /goals

Create goal.

**Request:**
```typescript
{
  title: string;
  description?: string;
  goalType: 'score' | 'technique' | 'physical' | 'mental' | 'competition' | 'other';
  timeframe: 'short' | 'medium' | 'long';
  targetValue?: number;
  currentValue?: number;
  startDate: string;
  targetDate: string;
  milestones?: Array<{ title: string; value: number; completed: boolean }>;
}
```

---

### PUT /goals/:id

Update goal.

---

### PATCH /goals/:id/progress

Update goal progress.

**Request:**
```typescript
{
  currentValue: number;
}
```

---

### DELETE /goals/:id

Delete goal.

---

## Notes

### GET /notes

List notes.

**Query:** `category`, `search`

---

### GET /notes/:id

Get note details.

---

### POST /notes

Create note.

**Request:**
```typescript
{
  title: string;
  content: string;
  category?: string;
  tags?: string[];          // Max 10 tags
  isPinned?: boolean;
  linkedEntityType?: string;
  linkedEntityId?: string;
}
```

---

### PUT /notes/:id

Update note.

---

### DELETE /notes/:id

Delete note.

---

## Exercises

### POST /exercises

Create exercise.

**Request:**
```typescript
{
  name: string;
  description: string;
  exerciseType: string;
  learningPhases?: string[];
  clubSpeedLevels?: string[];
  periods?: ('E' | 'G' | 'S' | 'T')[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'elite';
  location?: 'indoor' | 'outdoor' | 'both';
  processCategory: string;
  equipment?: string[];
  videoUrl?: string;
  isActive?: boolean;
}
```

---

### GET /exercises

List exercises with filters.

**Query:** `exerciseType`, `category`, `period`, `learningPhase`, `difficulty`, `location`

---

### GET /exercises/:id

Get exercise details.

---

### PATCH /exercises/:id

Update exercise.

---

### DELETE /exercises/:id

Delete exercise.

---

## Bookings

### POST /bookings

Create booking with conflict detection.

**Request:**
```typescript
{
  playerId: string;
  coachId: string;
  startTime: string;          // ISO datetime
  endTime: string;            // ISO datetime
  sessionType: string;
  title?: string;
  location?: string;
  notes?: string;
}
```

---

### GET /bookings

List bookings.

**Query:** `playerId`, `coachId`, `status`, `startDate`, `endDate`

---

### GET /bookings/:id

Get booking details.

---

### PATCH /bookings/:id

Update booking.

---

### POST /bookings/:id/confirm

Confirm pending booking.

---

### POST /bookings/:id/cancel

Cancel booking.

**Request:**
```typescript
{
  reason: string;
}
```

---

### POST /bookings/check-conflicts

Check for scheduling conflicts.

**Request:**
```typescript
{
  coachId: string;
  playerId: string;
  startTime: string;
  endTime: string;
  excludeBookingId?: string;
}
```

---

## Calendar

### GET /calendar/events

Get calendar events.

---

### GET /calendar/event/:id

Get single calendar event.

---

## Dashboard

### GET /dashboard

Get player dashboard.

**Query:** `date` (YYYY-MM-DD)

**Response:**
```json
{
  "player": {...},
  "period": {...},
  "todaySessions": [...],
  "badges": [...],
  "goals": [...],
  "weeklyStats": {...},
  "messages": [...],
  "unreadCount": 3
}
```

---

### GET /dashboard/:playerId

Get player dashboard (coach view).

---

### GET /dashboard/weekly-stats

Get weekly training stats.

---

### GET /dashboard/badges

Get player badges.

---

### GET /dashboard/goals

Get player goals.

---

## Achievements

### GET /achievements

List achievements.

**Query:** `category` ('streak' | 'milestone' | 'skill' | 'special' | 'other')

---

### GET /achievements/new

Get unviewed achievements.

---

### GET /achievements/stats

Get achievement statistics.

**Response:**
```json
{
  "total": 25,
  "newCount": 3,
  "totalPoints": 5500,
  "byCategory": [...],
  "byTier": [...]
}
```

---

### GET /achievements/recent

Get recent achievements.

**Query:** `limit` (1-50)

---

### GET /achievements/:id

Get achievement details.

---

### POST /achievements

Unlock achievement.

**Request:**
```typescript
{
  code: string;
  title: string;
  description: string;
  category: 'streak' | 'milestone' | 'skill' | 'special' | 'other';
  tier?: 'bronze' | 'silver' | 'gold' | 'platinum';
  icon: string;
  pointsValue?: number;
}
```

---

### PATCH /achievements/:id/viewed

Mark achievement as viewed.

---

### POST /achievements/mark-all-viewed

Mark all achievements as viewed.

---

### DELETE /achievements/:id

Delete achievement.

---

## Archive

### GET /archive

List archived items.

**Query:** `entityType` ('note' | 'goal' | 'session' | 'test' | 'exercise' | 'other')

---

### GET /archive/count

Get archive count by type.

---

### GET /archive/:id

Get archived item.

---

### POST /archive

Archive an item.

**Request:**
```typescript
{
  entityType: string;
  entityId: string;
  entityData: object;
  reason?: string;
}
```

---

### POST /archive/:id/restore

Restore archived item.

---

### POST /archive/bulk-delete

Bulk delete archived items.

**Request:**
```typescript
{
  archiveIds: string[];  // 1-100 items
}
```

---

### DELETE /archive/:id

Delete archived item.

---

## Skoleplan

School schedule management for student-athletes.

### GET /skoleplan

Get full school plan (fag, timer, oppgaver).

---

### GET /skoleplan/fag

List subjects.

---

### GET /skoleplan/fag/:id

Get subject details.

---

### POST /skoleplan/fag

Create subject.

**Request:**
```typescript
{
  navn: string;
  larer?: string;
  rom?: string;
  farge?: string;  // Hex color
}
```

---

### PUT /skoleplan/fag/:id

Update subject.

---

### DELETE /skoleplan/fag/:id

Delete subject.

---

### GET /skoleplan/timer

List class periods.

---

### POST /skoleplan/timer

Create class period.

**Request:**
```typescript
{
  fagId: string;
  ukedag: 'mandag' | 'tirsdag' | 'onsdag' | 'torsdag' | 'fredag';
  startTid: string;  // HH:MM
  sluttTid: string;  // HH:MM
}
```

---

### PUT /skoleplan/timer/:id

Update class period.

---

### DELETE /skoleplan/timer/:id

Delete class period.

---

### GET /skoleplan/oppgaver

List assignments.

**Query:** `fagId`, `status` ('pending' | 'completed')

---

### POST /skoleplan/oppgaver

Create assignment.

**Request:**
```typescript
{
  fagId: string;
  tittel: string;
  beskrivelse?: string;
  frist: string;              // ISO date
  prioritet?: 'low' | 'medium' | 'high';
}
```

---

### PUT /skoleplan/oppgaver/:id

Update assignment.

---

### PATCH /skoleplan/oppgaver/:id/status

Update assignment status.

**Request:**
```typescript
{
  status: 'pending' | 'completed';
}
```

---

### DELETE /skoleplan/oppgaver/:id

Delete assignment.

---

## Common Response Formats

### Success Response

```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [{ "field": "email", "message": "Invalid email" }]
  }
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Server Error |

---

## Rate Limiting

- **Authenticated:** 1000 requests/hour/user
- **Auth endpoints:** 10 requests/minute/IP

**Headers:**
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 995
X-RateLimit-Reset: 1703091600
```

---

## Pagination

**Query Parameters:**
```typescript
{
  page?: number;   // Default: 1
  limit?: number;  // Default varies
}
```

**Response:**
```json
{
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

---

## Date Formats

- **Date only:** `YYYY-MM-DD`
- **DateTime:** `YYYY-MM-DDTHH:mm:ssZ`
- **Time only:** `HH:MM`

---

**Document Status**: Complete
**Last Updated**: 2025-12-20
