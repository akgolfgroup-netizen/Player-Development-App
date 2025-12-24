# Coach API Documentation

> AK Golf Academy - Backend API for Coach Functions
> Last Updated: December 2025

---

## Overview

The Coach API provides endpoints for coach-specific functionality including athlete management, training plans, notes, alerts, and analytics.

**Base URL:** `/api/v1`

**Authentication:** All endpoints require a valid JWT token with coach role.

---

## Endpoints

### 1. Coach Dashboard

#### GET `/coach/dashboard`

Returns dashboard summary for the authenticated coach.

**Response:**
```json
{
  "coach": {
    "id": "string",
    "name": "string"
  },
  "stats": {
    "totalPlayers": 12,
    "activePlayersLast30Days": 10,
    "totalTestsCompleted": 145,
    "pendingItems": 3
  },
  "recentActivity": [
    {
      "type": "proof_uploaded",
      "athleteId": "string",
      "athleteName": "string",
      "timestamp": "2025-12-21T10:30:00Z"
    }
  ]
}
```

---

### 2. Athletes

#### GET `/coach/athletes`

Returns all athletes assigned to the coach.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Filter by name |
| `category` | string | Filter by category (A-K) |

**Response:**
```json
{
  "athletes": [
    {
      "id": "string",
      "firstName": "string",
      "lastName": "string",
      "category": "A",
      "gender": "male",
      "lastSession": "2025-12-18"
    }
  ],
  "total": 12
}
```

#### GET `/coach/athletes/:athleteId`

Returns detailed information about a specific athlete.

**Response:**
```json
{
  "athlete": {
    "id": "string",
    "firstName": "string",
    "lastName": "string",
    "category": "A",
    "gender": "male",
    "dateOfBirth": "2010-05-15",
    "handicap": 12.5
  }
}
```

---

### 3. Player Analytics

#### GET `/coach/athletes/:athleteId/overview`

Returns player overview with test summaries.

**Response:**
```json
{
  "playerId": "string",
  "playerName": "string",
  "category": "A",
  "testsCompleted": 15,
  "totalTests": 20,
  "completionPercentage": 75,
  "testsPassed": 12,
  "testsFailed": 3,
  "passRate": 80,
  "testSummaries": [
    {
      "testNumber": 1,
      "testName": "Driver Distance",
      "latestResult": {
        "value": 245,
        "passed": true,
        "date": "2025-12-15",
        "percentile": 72
      },
      "previousResult": {
        "value": 238,
        "date": "2025-11-20"
      },
      "trend": "improving",
      "percentChange": 2.9
    }
  ],
  "overallPercentile": 68,
  "strengthAreas": [1, 5, 12],
  "weaknessAreas": [8, 17]
}
```

#### GET `/coach/athletes/:athleteId/progression`

Returns category progression analysis.

**Response:**
```json
{
  "playerId": "string",
  "currentCategory": "B",
  "nextCategory": "A",
  "requirements": [
    {
      "testNumber": 1,
      "testName": "Driver Distance",
      "requirement": 250,
      "currentValue": 245,
      "passed": false,
      "gap": 5,
      "gapPercentage": 2
    }
  ],
  "testsPassedForNext": 15,
  "totalRequiredTests": 20,
  "overallReadiness": 75,
  "recentTrend": "on_track"
}
```

---

### 4. Training Plans

#### GET `/coach/athletes/:athleteId/training-plan`

Returns training plan for an athlete.

**Response:**
```json
{
  "athleteId": "string",
  "blocks": [
    {
      "id": "string",
      "name": "Putting fokus",
      "description": "Lag putts fra 1-3 meter",
      "date": "2025-12-28",
      "durationMinutes": 60,
      "completed": false
    }
  ]
}
```

#### POST `/coach/athletes/:athleteId/training-plan/blocks`

Add a new training block.

**Request:**
```json
{
  "name": "Driver trening",
  "description": "Fokus på tempo",
  "date": "2025-12-30",
  "durationMinutes": 90
}
```

**Response:**
```json
{
  "block": {
    "id": "string",
    "name": "Driver trening",
    "date": "2025-12-30",
    "completed": false
  }
}
```

#### DELETE `/coach/athletes/:athleteId/training-plan/blocks/:blockId`

Remove a training block (future only).

**Response:**
```json
{
  "success": true
}
```

---

### 5. Coach Notes

#### GET `/coach/athletes/:athleteId/notes`

Returns all notes for an athlete.

**Response:**
```json
{
  "notes": [
    {
      "id": "string",
      "content": "Fokuser på albuen i nedsvinget",
      "createdAt": "2025-12-18T14:30:00Z",
      "delivered": true
    }
  ]
}
```

#### POST `/coach/athletes/:athleteId/notes`

Add a new note.

**Request:**
```json
{
  "content": "Gode fremskritt på putting"
}
```

**Response:**
```json
{
  "note": {
    "id": "string",
    "content": "Gode fremskritt på putting",
    "createdAt": "2025-12-21T10:00:00Z",
    "delivered": false
  }
}
```

---

### 6. Alerts

#### GET `/coach/alerts`

Returns alerts for the coach.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `unread` | boolean | Filter unread only |

**Response:**
```json
{
  "alerts": [
    {
      "id": "string",
      "athleteId": "string",
      "athleteName": "Anders Hansen",
      "type": "proof_uploaded",
      "message": "Ny video lastet opp",
      "createdAt": "2025-12-21T10:30:00Z",
      "read": false
    }
  ]
}
```

#### PUT `/coach/alerts/:alertId/read`

Mark alert as read.

**Response:**
```json
{
  "success": true
}
```

---

### 7. Team Analytics

#### GET `/coach/team/analytics`

Returns team-wide analytics.

**Response:**
```json
{
  "coachId": "string",
  "totalPlayers": 12,
  "playersByCategory": {
    "A": 2,
    "B": 4,
    "C": 6
  },
  "overallCompletionRate": 68,
  "testsCompletedTotal": 180,
  "testsPossibleTotal": 240,
  "testStatistics": [
    {
      "testNumber": 1,
      "testName": "Driver Distance",
      "playersCompleted": 10,
      "totalPlayers": 12,
      "passRate": 70,
      "averageValue": 235.5,
      "medianValue": 238,
      "bestPerformer": {
        "playerId": "string",
        "playerName": "Lars Olsen",
        "value": 268
      },
      "needsImprovement": ["id1", "id2", "id3"]
    }
  ],
  "recentActivityCount": 45,
  "monthlyTrend": "stable"
}
```

#### GET `/coach/team/comparison`

Compare multiple players.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `players` | string[] | Player IDs to compare |
| `tests` | number[] | Test numbers to include |

**Response:**
```json
{
  "testNumbers": [1, 5, 8],
  "players": [
    {
      "playerId": "string",
      "playerName": "Anders Hansen",
      "category": "A",
      "testResults": {
        "1": { "value": 245, "passed": true, "percentile": 72 },
        "5": { "value": 15.2, "passed": true, "percentile": 65 }
      },
      "overallScore": 68,
      "rank": 1
    }
  ]
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Player not found",
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
| `UPGRADE_REQUIRED` | 403 | Feature requires higher tier |

---

## Rate Limits

- **Standard:** 100 requests/minute
- **Analytics endpoints:** 20 requests/minute

---

## Webhook Events

Coaches can subscribe to these events:

| Event | Description |
|-------|-------------|
| `proof.uploaded` | Player uploaded new proof |
| `test.completed` | Player completed a test |
| `note.requested` | Player requested feedback |
| `milestone.achieved` | Player reached a milestone |

---

*AK Golf Academy - Coach API v1.0*
