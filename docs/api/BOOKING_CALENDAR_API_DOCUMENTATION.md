# Booking & Calendar System - API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Availability API](#availability-api)
4. [Bookings API](#bookings-api)
5. [Calendar API](#calendar-api)
6. [Data Models](#data-models)
7. [Error Handling](#error-handling)
8. [Code Examples](#code-examples)

---

## Overview

The Booking & Calendar System provides RESTful APIs for managing coach availability, booking sessions, and viewing calendar events.

**Base URL:** `http://localhost:3000/api/v1`

**API Version:** v1

**Documentation:** `http://localhost:3000/docs` (Swagger UI)

### Quick Stats
- **Total Endpoints:** 17
- **Availability Endpoints:** 6
- **Booking Endpoints:** 7
- **Calendar Endpoints:** 4

---

## Authentication

All endpoints require JWT authentication via Bearer token.

### Request Headers
```http
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

### Tenant Context
All requests are scoped to a tenant. The tenant ID is extracted from the authenticated user's JWT token.

---

## Availability API

Manage coach availability slots for booking.

### Endpoints

#### 1. List Availability Slots
Get all availability slots with optional filters.

```http
GET /availability
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| coachId | UUID | No | Filter by coach ID |
| dayOfWeek | Integer | No | Filter by day (0=Sunday, 6=Saturday) |
| startDate | Date | No | Filter by start date |
| endDate | Date | No | Filter by end date |
| isActive | Boolean | No | Filter by active status |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "coachId": "uuid",
      "dayOfWeek": 1,
      "startTime": "09:00",
      "endTime": "17:00",
      "slotDuration": 60,
      "maxBookings": 1,
      "sessionType": "individual_training",
      "isActive": true,
      "validFrom": "2025-01-01T00:00:00Z",
      "validUntil": null,
      "coach": {
        "id": "uuid",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com"
      },
      "_count": {
        "bookings": 0
      }
    }
  ]
}
```

---

#### 2. Get Available Slots
Find available booking slots for a coach within a date range.

```http
GET /availability/slots/available
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| coachId | UUID | Yes | Coach ID |
| startDate | Date | Yes | Start date (YYYY-MM-DD) |
| endDate | Date | Yes | End date (YYYY-MM-DD) |
| sessionType | String | No | Filter by session type |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "date": "2025-12-16",
      "startTime": "09:00",
      "endTime": "10:00",
      "availabilityId": "uuid",
      "remainingCapacity": 1
    },
    {
      "date": "2025-12-16",
      "startTime": "10:00",
      "endTime": "11:00",
      "availabilityId": "uuid",
      "remainingCapacity": 1
    }
  ]
}
```

---

#### 3. Create Availability Slot
Create a new availability slot (coach only).

```http
POST /availability
```

**Request Body:**
```json
{
  "coachId": "uuid",
  "dayOfWeek": 1,
  "startTime": "09:00",
  "endTime": "17:00",
  "slotDuration": 60,
  "maxBookings": 1,
  "sessionType": "individual_training",
  "validFrom": "2025-01-01T00:00:00Z",
  "validUntil": "2025-12-31T23:59:59Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "coachId": "uuid",
    "dayOfWeek": 1,
    "startTime": "09:00",
    "endTime": "17:00",
    "slotDuration": 60,
    "maxBookings": 1,
    "isActive": true,
    "createdAt": "2025-12-15T19:00:00Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid input data
- `409 Conflict` - Overlapping availability slot exists

---

#### 4. Get Availability by ID
Retrieve a specific availability slot.

```http
GET /availability/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "coachId": "uuid",
    "dayOfWeek": 1,
    "startTime": "09:00",
    "endTime": "17:00",
    "coach": { /* coach details */ },
    "_count": {
      "bookings": 3
    }
  }
}
```

---

#### 5. Update Availability
Update an existing availability slot.

```http
PATCH /availability/:id
```

**Request Body (all fields optional):**
```json
{
  "dayOfWeek": 2,
  "startTime": "10:00",
  "endTime": "18:00",
  "slotDuration": 90,
  "maxBookings": 2,
  "isActive": false
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* updated availability */ }
}
```

---

#### 6. Delete Availability
Delete an availability slot.

```http
DELETE /availability/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Availability deleted successfully"
}
```

**Error Responses:**
- `409 Conflict` - Cannot delete slot with future bookings

---

## Bookings API

Create and manage session bookings.

### Endpoints

#### 1. Check Conflicts
Check for scheduling conflicts before creating a booking.

```http
POST /bookings/check-conflicts
```

**Request Body:**
```json
{
  "coachId": "uuid",
  "playerId": "uuid",
  "startTime": "2025-12-16T10:00:00Z",
  "endTime": "2025-12-16T11:00:00Z",
  "excludeBookingId": "uuid"  // Optional, for updates
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "hasConflicts": false,
    "conflicts": []
  }
}
```

**Response (with conflicts):**
```json
{
  "success": true,
  "data": {
    "hasConflicts": true,
    "conflicts": [
      {
        "type": "coach_busy",
        "message": "Coach John Doe has 1 overlapping session(s)",
        "event": { /* event details */ }
      },
      {
        "type": "player_busy",
        "message": "Jane Smith has 1 overlapping session(s)",
        "event": { /* event details */ }
      }
    ]
  }
}
```

---

#### 2. Create Booking
Create a new booking with automatic event creation.

```http
POST /bookings
```

**Request Body:**
```json
{
  "playerId": "uuid",
  "coachId": "uuid",
  "availabilityId": "uuid",  // Optional
  "eventId": "uuid",          // Optional, for existing events
  "startTime": "2025-12-16T10:00:00Z",
  "endTime": "2025-12-16T11:00:00Z",
  "sessionType": "individual_training",
  "title": "Driver Training Session",
  "location": "Driving Range",
  "notes": "Focus on accuracy and distance",
  "paymentAmount": 500.00
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "eventId": "uuid",
    "playerId": "uuid",
    "availabilityId": "uuid",
    "bookedBy": "uuid",
    "bookingType": "player_request",
    "status": "pending",
    "bookedAt": "2025-12-15T19:00:00Z",
    "confirmedAt": null,
    "paymentStatus": "unpaid",
    "paymentAmount": 500.00,
    "notes": "Focus on accuracy and distance",
    "event": {
      "id": "uuid",
      "title": "Driver Training Session",
      "eventType": "individual_training",
      "startTime": "2025-12-16T10:00:00Z",
      "endTime": "2025-12-16T11:00:00Z",
      "location": "Driving Range",
      "status": "scheduled",
      "coach": {
        "id": "uuid",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com"
      }
    },
    "player": {
      "id": "uuid",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane@example.com"
    }
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid input or time validation failed
- `409 Conflict` - Scheduling conflicts detected

**Notes:**
- Automatically creates event and event participant
- Checks for conflicts before creation
- Uses database transaction for atomicity

---

#### 3. List Bookings
Get paginated list of bookings with filters.

```http
GET /bookings
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | Integer | No | Page number (default: 1) |
| limit | Integer | No | Items per page (default: 20) |
| playerId | UUID | No | Filter by player |
| coachId | UUID | No | Filter by coach |
| status | String | No | pending, confirmed, completed, cancelled |
| startDate | Date | No | Filter by start date |
| endDate | Date | No | Filter by end date |
| sessionType | String | No | Filter by session type |
| sortBy | String | No | bookedAt, startTime, status |
| sortOrder | String | No | asc, desc |

**Response:**
```json
{
  "success": true,
  "data": {
    "bookings": [
      {
        "id": "uuid",
        "status": "pending",
        "bookedAt": "2025-12-15T19:00:00Z",
        "event": { /* event details */ },
        "player": { /* player details */ }
      }
    ],
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

#### 4. Get Booking by ID
Retrieve a specific booking.

```http
GET /bookings/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "eventId": "uuid",
    "playerId": "uuid",
    "status": "confirmed",
    "bookedAt": "2025-12-15T19:00:00Z",
    "confirmedAt": "2025-12-15T20:00:00Z",
    "event": { /* full event details */ },
    "player": { /* player details */ },
    "availability": { /* availability details */ }
  }
}
```

---

#### 5. Update Booking
Update booking details.

```http
PATCH /bookings/:id
```

**Request Body (all fields optional):**
```json
{
  "startTime": "2025-12-16T11:00:00Z",
  "endTime": "2025-12-16T12:00:00Z",
  "location": "Indoor Range",
  "notes": "Updated notes",
  "paymentStatus": "paid",
  "paymentAmount": 600.00
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* updated booking */ }
}
```

**Notes:**
- Cannot update cancelled bookings
- Time changes trigger conflict checking
- Updates both booking and event

---

#### 6. Confirm Booking
Confirm a pending booking.

```http
POST /bookings/:id/confirm
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "confirmed",
    "confirmedAt": "2025-12-15T20:00:00Z",
    /* ... other booking details */
  }
}
```

**Error Responses:**
- `400 Bad Request` - Booking already confirmed or cancelled

---

#### 7. Cancel Booking
Cancel a booking with a reason.

```http
POST /bookings/:id/cancel
```

**Request Body:**
```json
{
  "reason": "Player unavailable due to injury"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "cancelled",
    "cancelledAt": "2025-12-15T20:00:00Z",
    "cancellationReason": "Player unavailable due to injury",
    /* ... other booking details */
  }
}
```

---

## Calendar API

Retrieve calendar events for different time periods.

### Endpoints

#### 1. Get Calendar Events
Query events with filters.

```http
GET /calendar/events
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| startDate | DateTime | Yes | Start date (ISO 8601) |
| endDate | DateTime | Yes | End date (ISO 8601) |
| eventTypes | String | No | Comma-separated event types |
| coachId | UUID | No | Filter by coach |
| playerId | UUID | No | Filter by player |
| status | String | No | scheduled, confirmed, completed, cancelled |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Training Session",
      "eventType": "individual_training",
      "startTime": "2025-12-16T10:00:00Z",
      "endTime": "2025-12-16T11:00:00Z",
      "location": "Driving Range",
      "status": "confirmed",
      "maxParticipants": 1,
      "currentCount": 1,
      "coach": {
        "id": "uuid",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com"
      },
      "participants": [
        {
          "id": "uuid",
          "status": "confirmed",
          "player": {
            "id": "uuid",
            "firstName": "Jane",
            "lastName": "Smith",
            "email": "jane@example.com"
          }
        }
      ],
      "bookings": [
        {
          "id": "uuid",
          "status": "confirmed",
          "playerId": "uuid"
        }
      ]
    }
  ]
}
```

---

#### 2. Get Month Events
Get all events for a specific month.

```http
GET /calendar/month/:year/:month
```

**Example:** `GET /calendar/month/2025/12`

**Query Parameters:** Same as `/calendar/events` (optional filters)

**Response:**
```json
{
  "success": true,
  "data": [ /* array of events */ ]
}
```

---

#### 3. Get Week Events
Get all events for a specific ISO week.

```http
GET /calendar/week/:year/:week
```

**Example:** `GET /calendar/week/2025/50`

**Query Parameters:** Same as `/calendar/events` (optional filters)

**Response:**
```json
{
  "success": true,
  "data": [ /* array of events */ ]
}
```

---

#### 4. Get Day Events
Get all events for a specific day.

```http
GET /calendar/day/:date
```

**Example:** `GET /calendar/day/2025-12-16`

**Query Parameters:** Same as `/calendar/events` (optional filters)

**Response:**
```json
{
  "success": true,
  "data": [ /* array of events */ ]
}
```

---

## Data Models

### Availability Model
```typescript
{
  id: string;              // UUID
  coachId: string;         // UUID
  dayOfWeek: number;       // 0-6 (Sunday-Saturday)
  startTime: string;       // HH:MM format
  endTime: string;         // HH:MM format
  slotDuration: number;    // Minutes
  maxBookings: number;     // Max bookings per slot
  sessionType: string;     // Optional session type
  validFrom: Date;         // Start of validity
  validUntil: Date | null; // End of validity
  isActive: boolean;       // Active status
  createdAt: Date;
  updatedAt: Date;
}
```

### Booking Model
```typescript
{
  id: string;                    // UUID
  eventId: string;               // UUID
  playerId: string;              // UUID
  availabilityId: string | null; // UUID
  bookedBy: string;              // UUID (user who created)
  bookingType: string;           // "player_request"
  status: string;                // pending, confirmed, completed, cancelled
  bookedAt: Date;
  confirmedAt: Date | null;
  cancelledAt: Date | null;
  cancellationReason: string | null;
  paymentStatus: string;         // pending, paid, waived
  paymentAmount: number | null;
  reminderSent: boolean;
  notes: string | null;
  metadata: JSON;
  createdAt: Date;
  updatedAt: Date;
}
```

### Event Model
```typescript
{
  id: string;
  tenantId: string;
  title: string;
  eventType: string;        // individual_training, group_training, etc.
  startTime: Date;
  endTime: Date;
  location: string | null;
  coachId: string | null;
  maxParticipants: number | null;
  currentCount: number;
  status: string;           // scheduled, confirmed, completed, cancelled
  metadata: JSON;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Error Handling

### Standard Error Response
```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Validation error details"
}
```

### HTTP Status Codes
| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET/PATCH |
| 201 | Created | Successful POST |
| 400 | Bad Request | Validation error |
| 401 | Unauthorized | Missing/invalid auth token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Scheduling conflict or duplicate |
| 500 | Internal Server Error | Server error |

### Common Errors

**Validation Error:**
```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "End time must be after start time"
}
```

**Conflict Error:**
```json
{
  "statusCode": 409,
  "error": "Conflict",
  "message": "Booking conflicts detected: Coach John Doe has 1 overlapping session(s)"
}
```

**Not Found Error:**
```json
{
  "statusCode": 404,
  "error": "Not Found",
  "message": "Booking not found"
}
```

---

## Code Examples

### JavaScript/TypeScript (Using Fetch)

#### Create Booking
```javascript
const createBooking = async (bookingData, token) => {
  const response = await fetch('http://localhost:3000/api/v1/bookings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      playerId: 'player-uuid',
      coachId: 'coach-uuid',
      startTime: '2025-12-16T10:00:00Z',
      endTime: '2025-12-16T11:00:00Z',
      sessionType: 'individual_training',
      title: 'Driver Training',
      location: 'Driving Range',
      notes: 'Focus on accuracy'
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  const result = await response.json();
  return result.data;
};
```

#### Get Month Events
```javascript
const getMonthEvents = async (year, month, token) => {
  const response = await fetch(
    `http://localhost:3000/api/v1/calendar/month/${year}/${month}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    }
  );

  const result = await response.json();
  return result.data;
};
```

#### Check Conflicts
```javascript
const checkConflicts = async (conflictData, token) => {
  const response = await fetch(
    'http://localhost:3000/api/v1/bookings/check-conflicts',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        coachId: 'coach-uuid',
        playerId: 'player-uuid',
        startTime: '2025-12-16T10:00:00Z',
        endTime: '2025-12-16T11:00:00Z'
      })
    }
  );

  const result = await response.json();
  return result.data; // { hasConflicts: boolean, conflicts: [] }
};
```

### React Example with API Client

```javascript
import { createBooking, checkConflicts } from '../api/bookings';
import { getMonthEvents } from '../api/calendar';

const BookingForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      // Check conflicts first
      const conflicts = await checkConflicts({
        coachId: formData.coachId,
        playerId: formData.playerId,
        startTime: formData.startTime,
        endTime: formData.endTime
      });

      if (conflicts.hasConflicts) {
        setError(`Conflicts detected: ${conflicts.conflicts.map(c => c.message).join(', ')}`);
        return;
      }

      // Create booking
      const booking = await createBooking(formData);
      console.log('Booking created:', booking);

      // Refresh calendar
      const events = await getMonthEvents(2025, 12);
      // Update state...

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Form UI...
  );
};
```

---

## Rate Limiting

Currently no rate limiting implemented. Recommended for production:
- 100 requests per minute per user
- 1000 requests per hour per tenant

---

## Versioning

API version is specified in the URL: `/api/v1/`

Breaking changes will increment the version number.

---

## Support

- **Swagger UI:** http://localhost:3000/docs
- **Health Check:** http://localhost:3000/health
- **Issues:** Report to development team

---

**Last Updated:** 2025-12-15
**API Version:** 1.0
**Maintainer:** IUP Golf Academy Development Team
