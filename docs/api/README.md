# TIER Golf - Complete API Reference

> Backend API Documentation v2.0
> Last Updated: December 2025

---

## Overview

The TIER Golf API provides endpoints for managing golf training, player development, and coach-player interactions.

**Base URL:** `/api/v1`

**Authentication:** All endpoints require a valid JWT token unless otherwise specified.

**Content-Type:** `application/json`

---

## Table of Contents

1. [Authentication](#1-authentication)
2. [Coaches](#2-coaches)
3. [Players](#3-players)
4. [Sessions](#4-sessions)
5. [Exercises](#5-exercises)
6. [Dashboard](#6-dashboard)
7. [Training Plans](#7-training-plans)
8. [Real-time & Notifications](#8-real-time--notifications)

---

## 1. Authentication

### POST `/auth/login`

Authenticate user and receive JWT token.

**Request:**
```json
{
  "email": "coach@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "uuid",
      "email": "coach@example.com",
      "role": "coach",
      "firstName": "Anders",
      "lastName": "Hansen"
    }
  }
}
```

### POST `/auth/refresh`

Refresh authentication token.

### POST `/auth/logout`

Invalidate current session.

---

## 2. Coaches

### POST `/coaches`

Create a new coach.

**Request:**
```json
{
  "firstName": "Anders",
  "lastName": "Hansen",
  "email": "anders@akgolf.no",
  "phone": "+47 123 45 678",
  "specializations": ["putting", "driving"],
  "certifications": [
    {
      "name": "PGA Level 2",
      "issuer": "PGA Norge",
      "issuedDate": "2023-06-15"
    }
  ],
  "workingHours": {
    "monday": { "start": "08:00", "end": "17:00" },
    "tuesday": { "start": "08:00", "end": "17:00" }
  },
  "maxPlayersPerSession": 4,
  "hourlyRate": 750,
  "color": "#1E4B33",
  "status": "active"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "firstName": "Anders",
    "lastName": "Hansen",
    "email": "anders@akgolf.no",
    "status": "active"
  }
}
```

### GET `/coaches`

List coaches with filters and pagination.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 20) |
| `search` | string | Search by name/email |
| `status` | string | Filter: `active`, `inactive`, `on_leave` |
| `specialization` | string | Filter by specialization |
| `sortBy` | string | Sort field: `firstName`, `lastName`, `email`, `createdAt` |
| `sortOrder` | string | `asc` or `desc` |

**Response:**
```json
{
  "success": true,
  "data": {
    "coaches": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5,
      "totalPages": 1
    }
  }
}
```

### GET `/coaches/:id`

Get coach by ID.

### PATCH `/coaches/:id`

Update coach.

### DELETE `/coaches/:id`

Delete coach.

### GET `/coaches/:id/availability`

Get coach availability for a date range.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `startDate` | string | Yes | ISO date format |
| `endDate` | string | Yes | ISO date format |

### GET `/coaches/:id/statistics`

Get coach statistics (players, sessions).

**Response:**
```json
{
  "success": true,
  "data": {
    "coach": {
      "id": "uuid",
      "firstName": "Anders",
      "lastName": "Hansen"
    },
    "players": {
      "total": 12,
      "active": 10,
      "byCategory": {
        "A": 2,
        "B": 4,
        "C": 6
      }
    },
    "sessions": {
      "thisWeek": 15,
      "thisMonth": 52,
      "totalHours": 78.5
    }
  }
}
```

---

## 3. Players

### POST `/players`

Create a new player.

### GET `/players`

List players with filters.

### GET `/players/:id`

Get player by ID.

### PATCH `/players/:id`

Update player.

### DELETE `/players/:id`

Delete player.

---

## 4. Sessions

Training session management endpoints.

### POST `/sessions`

Create a new training session.

**Request:**
```json
{
  "playerId": "uuid",
  "sessionType": "individual",
  "scheduledDate": "2025-12-28T10:00:00Z",
  "durationMinutes": 60,
  "focus": "putting",
  "notes": "Focus on lag putts"
}
```

**Response:** `201 Created`

### GET `/sessions`

List sessions with filters (coach/admin only).

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number |
| `limit` | number | Items per page |
| `playerId` | string | Filter by player |
| `status` | string | `planned`, `in_progress`, `completed` |
| `fromDate` | string | Start date filter |
| `toDate` | string | End date filter |

### GET `/sessions/my`

Get authenticated player's sessions.

### GET `/sessions/in-progress`

Get player's in-progress sessions.

### GET `/sessions/technical-cues`

Get list of predefined technical cues.

**Response:**
```json
["Hold armen rett", "Fokuser på tempo", "Slapp skulder"]
```

### GET `/sessions/:id`

Get session by ID.

### PATCH `/sessions/:id`

Update session.

### DELETE `/sessions/:id`

Delete session.

### PATCH `/sessions/:id/evaluation`

Update session evaluation (save progress).

**Request:**
```json
{
  "focusRating": 8,
  "energyLevel": 7,
  "techniqueNotes": "Good progress on putting stroke",
  "preShotRoutineCompleted": true,
  "technicalCues": ["Hold armen rett"]
}
```

### POST `/sessions/:id/complete`

Complete session with final evaluation.

**Request:**
```json
{
  "overallRating": 8,
  "achievements": ["Completed 50 putts"],
  "notes": "Great session"
}
```

### POST `/sessions/:id/auto-complete`

Auto-complete a session (timeout).

### GET `/sessions/stats/evaluation`

Get evaluation statistics for player.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `fromDate` | string | Start date |
| `toDate` | string | End date |
| `playerId` | string | Player ID (for coach/admin) |

**Response:**
```json
{
  "totalSessions": 25,
  "averages": {
    "focusRating": 7.5,
    "energyLevel": 8.2
  },
  "preShotStats": {
    "completionRate": 85
  },
  "topCues": ["Hold armen rett", "Fokuser på tempo"]
}
```

### POST `/sessions/admin/batch-auto-complete`

Batch auto-complete stale sessions (admin/cron).

---

## 5. Exercises

### POST `/exercises`

Create a new exercise.

**Request:**
```json
{
  "name": "Lag Putting",
  "description": "Practice lag putts from 10-15 meters",
  "category": "putting",
  "difficulty": "intermediate",
  "duration": 15,
  "equipment": ["putter", "balls"],
  "instructions": ["Set up at 10m", "Focus on distance control"],
  "videoUrl": "https://..."
}
```

### GET `/exercises`

List exercises with filters and pagination.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number |
| `limit` | number | Items per page |
| `search` | string | Search by name |
| `category` | string | Filter by category |
| `difficulty` | string | Filter by difficulty |

### GET `/exercises/:id`

Get exercise by ID.

### PATCH `/exercises/:id`

Update exercise.

### DELETE `/exercises/:id`

Delete exercise.

---

## 6. Dashboard

### GET `/dashboard`

Get dashboard data for authenticated player.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `date` | string | Date (YYYY-MM-DD), defaults to today |

**Response:**
```json
{
  "player": {
    "id": "uuid",
    "firstName": "Lars",
    "lastName": "Olsen",
    "category": "B",
    "handicap": 12.5
  },
  "period": {
    "current": "E",
    "weekNumber": 51
  },
  "todaySessions": [...],
  "badges": [...],
  "goals": [...],
  "weeklyStats": {
    "sessionsCompleted": 4,
    "totalHours": 6.5,
    "averageFocus": 7.8
  },
  "messages": [...],
  "unreadCount": 3
}
```

### GET `/dashboard/:playerId`

Get dashboard for specific player (coach view).

### GET `/dashboard/weekly-stats`

Get weekly training stats.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `week` | number | Week number |
| `year` | number | Year |

### GET `/dashboard/badges`

Get all player badges.

### GET `/dashboard/goals`

Get player goals.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | `active`, `completed`, `paused`, `cancelled` |

---

## 7. Training Plans

12-month annual training plan management.

### GET `/training-plan`

Get all training plans for authenticated user.

### POST `/training-plan/generate`

Generate a new 12-month training plan.

**Request:**
```json
{
  "playerId": "uuid",
  "startDate": "2025-01-01",
  "baselineAverageScore": 85,
  "baselineHandicap": 12.5,
  "baselineDriverSpeed": 95,
  "planName": "2025 Season Plan",
  "weeklyHoursTarget": 15,
  "tournaments": [
    {
      "name": "NM Amatorer",
      "startDate": "2025-07-15",
      "endDate": "2025-07-18",
      "importance": "A"
    }
  ],
  "preferredTrainingDays": [1, 2, 3, 4, 5],
  "excludeDates": ["2025-07-01"]
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "annualPlan": {...},
    "dailyAssignments": { "created": 365 },
    "tournaments": { "scheduled": 5 }
  }
}
```

### GET `/training-plan/player/:playerId`

Get active training plan for a player.

### GET `/training-plan/:planId/calendar`

Get calendar view of daily assignments.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `startDate` | string | YYYY-MM-DD |
| `endDate` | string | YYYY-MM-DD |
| `weekNumber` | number | Week number |

**Response:**
```json
{
  "success": true,
  "data": {
    "assignments": [...],
    "summary": {
      "totalAssignments": 28,
      "planned": 20,
      "completed": 15,
      "skipped": 2,
      "restDays": 6,
      "totalMinutes": 1200,
      "bySessionType": {
        "putting": 8,
        "driving": 6,
        "short_game": 6
      }
    }
  }
}
```

### PUT `/training-plan/:planId/daily/:date`

Update a daily assignment.

**Request:**
```json
{
  "sessionTemplateId": "uuid",
  "sessionType": "putting",
  "estimatedDuration": 60,
  "isRestDay": false,
  "status": "completed",
  "coachNotes": "Great progress",
  "playerNotes": "Felt good"
}
```

### DELETE `/training-plan/:planId`

Delete a training plan.

### POST `/training-plan/:planId/tournaments`

Add tournament to plan.

### GET `/training-plan/:planId/full`

Get complete training plan with all 365 days and 52 weeks.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `includeSessionDetails` | boolean | Include session template details |
| `includeExercises` | boolean | Include exercise details |

### PUT `/training-plan/:planId/accept`

Accept and activate a draft training plan.

### PUT `/training-plan/:planId/reject`

Reject and archive a training plan.

**Request:**
```json
{
  "reason": "The intensity is too high for my current schedule",
  "willCreateNewIntake": true
}
```

### POST `/training-plan/:planId/modification-request`

Request modifications to a training plan.

**Request:**
```json
{
  "concerns": ["Too many sessions per week", "Need more rest days"],
  "notes": "I have exams in week 12-14",
  "urgency": "medium"
}
```

### GET `/training-plan/:planId/analytics`

Get training plan analytics and progress.

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "completionRate": 78.5,
      "currentStreak": 5,
      "totalSessionsCompleted": 120,
      "totalSessionsPlanned": 153,
      "totalHoursCompleted": 95.5
    },
    "weeklyTrend": [...],
    "periodBreakdown": {
      "E": { "completed": 30, "planned": 35, "completionRate": 85.7 },
      "G": { "completed": 45, "planned": 50, "completionRate": 90.0 }
    },
    "upcomingSessions": [...]
  }
}
```

### GET `/training-plan/:planId/today`

Get today's training assignment.

### POST `/training-plan/:planId/daily/:date/substitute`

Find alternative sessions for a daily assignment.

### PUT `/training-plan/:planId/daily/:date/quick-action`

Quick actions on daily assignments.

**Request:**
```json
{
  "action": "complete",
  "duration": 65,
  "notes": "Great session"
}
```

Actions: `complete`, `skip`, `start`

### GET `/training-plan/:planId/achievements`

Get player achievements and progress.

### GET `/training-plan/modification-requests`

List all modification requests (coach only).

### PUT `/training-plan/modification-requests/:requestId/respond`

Coach responds to modification request.

**Request:**
```json
{
  "response": "I've adjusted the plan to include more rest days",
  "status": "resolved"
}
```

---

## 8. Real-time & Notifications

### GET `/realtime/subscribe`

Subscribe to real-time updates via Server-Sent Events (SSE).

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | string | Yes | User ID |
| `token` | string | Yes | Auth token |

**Event Types:**
| Event | Description |
|-------|-------------|
| `notification` | Generic notification |
| `message` | New message from coach/player |
| `session_reminder` | Upcoming session reminder |
| `achievement` | New achievement unlocked |
| `goal_progress` | Goal progress update |
| `coach_note` | New coach note |

**Example Event:**
```json
{
  "type": "session_reminder",
  "sessionId": "uuid",
  "sessionTitle": "Putting Practice",
  "minutesUntil": 15
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found",
    "details": {}
  }
}
```

**Error Codes:**
| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or missing token |
| `FORBIDDEN` | 403 | Not authorized for this resource |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `CONFLICT` | 409 | Resource already exists |
| `ACTIVE_PLAN_EXISTS` | 409 | Active training plan already exists |
| `PLAN_NOT_FOUND` | 404 | Training plan not found |
| `ASSIGNMENT_NOT_FOUND` | 404 | Daily assignment not found |
| `ACCESS_DENIED` | 403 | Access denied to resource |
| `INVALID_PLAN_STATUS` | 400 | Invalid plan status for operation |
| `NOT_SUBSTITUTABLE` | 400 | Session cannot be substituted |

---

## Rate Limits

| Endpoint Type | Limit |
|---------------|-------|
| Standard | 100 requests/minute |
| Analytics | 20 requests/minute |
| Real-time subscribe | 5 connections/user |

---

## Webhook Events

Available webhook events:

| Event | Description |
|-------|-------------|
| `proof.uploaded` | Player uploaded new proof |
| `test.completed` | Player completed a test |
| `session.completed` | Training session completed |
| `goal.achieved` | Player achieved a goal |
| `badge.earned` | Player earned a badge |
| `plan.accepted` | Player accepted training plan |
| `plan.rejected` | Player rejected training plan |
| `modification.requested` | Player requested plan modification |

---

## Pagination

All list endpoints support pagination:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## Date/Time Formats

- All dates use ISO 8601 format: `YYYY-MM-DD`
- All timestamps use ISO 8601 with timezone: `2025-12-21T10:30:00Z`
- All times use 24-hour format: `HH:MM`

---

*TIER Golf - API Reference v2.0*
*Generated: December 2025*
