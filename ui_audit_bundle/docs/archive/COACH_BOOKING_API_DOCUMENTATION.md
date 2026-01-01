# AK Golf Academy - Coach Booking API

## Oversikt

API-endepunkter for trenerens bookingsystem i Coach Portal.

---

## Kalender og tilgjengelighe

### Hent booking-kalender

#### GET /api/v1/coach/bookings/schedule

Henter trenerens booking-kalender for en gitt periode.

**Query Parameters:**
- `start` (required): Startdato (YYYY-MM-DD)
- `end` (required): Sluttdato (YYYY-MM-DD)

**Response:**
```json
{
  "schedule": [
    {
      "date": "2025-12-23",
      "slots": [
        {
          "id": "slot-uuid",
          "date": "2025-12-23",
          "startTime": "09:00",
          "endTime": "10:00",
          "status": "booked",
          "booking": {
            "id": "booking-uuid",
            "playerName": "Anders Hansen",
            "playerInitials": "AH",
            "sessionType": "Individuell økt",
            "notes": "Ønsker fokus på putting"
          }
        },
        {
          "id": "slot-uuid-2",
          "date": "2025-12-23",
          "startTime": "10:00",
          "endTime": "11:00",
          "status": "available"
        },
        {
          "id": "slot-uuid-3",
          "date": "2025-12-23",
          "startTime": "11:00",
          "endTime": "12:00",
          "status": "pending",
          "booking": {
            "id": "booking-uuid-2",
            "playerName": "Lars Olsen",
            "playerInitials": "LO",
            "sessionType": "Videoanalyse",
            "notes": "Forberedelse til turnering"
          }
        }
      ]
    }
  ]
}
```

**Status-typer:**
- `available` - Ledig tidsluke
- `booked` - Bekreftet booking
- `pending` - Venter på godkjenning
- `blocked` - Blokkert av trener

---

## Forespørsler

### Liste bookingforespørsler

#### GET /api/v1/coach/bookings/requests

Henter alle bookingforespørsler for treneren.

**Query Parameters:**
- `status` (optional): Filter etter status (`pending`, `approved`, `declined`, `all`)

**Response:**
```json
{
  "requests": [
    {
      "id": "req-uuid",
      "playerId": "player-uuid",
      "playerName": "Anders Hansen",
      "playerInitials": "AH",
      "playerCategory": "A",
      "sessionType": "Individuell økt",
      "date": "2025-12-24",
      "time": "10:00",
      "duration": 60,
      "notes": "Ønsker fokus på driving",
      "status": "pending",
      "createdAt": "2025-12-21T14:30:00Z",
      "respondedAt": null
    }
  ],
  "total": 5
}
```

---

### Godkjenn booking

#### PUT /api/v1/coach/bookings/:bookingId/approve

Godkjenner en ventende bookingforespørsel.

**Response:**
```json
{
  "success": true,
  "booking": {
    "id": "booking-uuid",
    "status": "approved",
    "respondedAt": "2025-12-21T15:00:00Z"
  },
  "notificationSent": true
}
```

---

### Avslå booking

#### PUT /api/v1/coach/bookings/:bookingId/decline

Avslår en ventende bookingforespørsel.

**Request (optional):**
```json
{
  "reason": "Opptatt med turnering denne dagen"
}
```

**Response:**
```json
{
  "success": true,
  "booking": {
    "id": "booking-uuid",
    "status": "declined",
    "respondedAt": "2025-12-21T15:00:00Z"
  },
  "notificationSent": true
}
```

---

### Kanseller booking

#### DELETE /api/v1/coach/bookings/:bookingId

Kansellerer en eksisterende booking.

**Request (optional):**
```json
{
  "reason": "Syk",
  "notifyPlayer": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking kansellert",
  "notificationSent": true
}
```

---

## Innstillinger

### Hent booking-innstillinger

#### GET /api/v1/coach/bookings/settings

Henter trenerens booking-innstillinger.

**Response:**
```json
{
  "settings": {
    "weeklySchedule": {
      "monday": {
        "enabled": true,
        "slots": [
          { "start": "09:00", "end": "12:00" },
          { "start": "13:00", "end": "17:00" }
        ]
      },
      "tuesday": {
        "enabled": true,
        "slots": [
          { "start": "09:00", "end": "12:00" },
          { "start": "13:00", "end": "17:00" }
        ]
      },
      "wednesday": {
        "enabled": true,
        "slots": [
          { "start": "09:00", "end": "12:00" },
          { "start": "13:00", "end": "17:00" }
        ]
      },
      "thursday": {
        "enabled": true,
        "slots": [
          { "start": "09:00", "end": "12:00" },
          { "start": "13:00", "end": "17:00" }
        ]
      },
      "friday": {
        "enabled": true,
        "slots": [
          { "start": "09:00", "end": "12:00" },
          { "start": "13:00", "end": "17:00" }
        ]
      },
      "saturday": {
        "enabled": true,
        "slots": [
          { "start": "10:00", "end": "14:00" }
        ]
      },
      "sunday": {
        "enabled": false,
        "slots": []
      }
    },
    "sessionTypes": [
      {
        "id": "1",
        "name": "Individuell økt",
        "duration": 60,
        "description": "En-til-en trening",
        "enabled": true
      },
      {
        "id": "2",
        "name": "Videoanalyse",
        "duration": 45,
        "description": "Analyse av svingteknikk",
        "enabled": true
      },
      {
        "id": "3",
        "name": "På banen",
        "duration": 90,
        "description": "Trening på banen",
        "enabled": true
      }
    ],
    "blockedDates": [
      {
        "id": "1",
        "date": "2025-12-24",
        "reason": "Julaften"
      },
      {
        "id": "2",
        "date": "2025-12-25",
        "reason": "1. juledag"
      }
    ],
    "advanceBookingDays": 14,
    "minNoticeHours": 24,
    "autoApprove": false,
    "notifyOnRequest": true,
    "bufferMinutes": 15
  }
}
```

---

### Oppdater booking-innstillinger

#### PUT /api/v1/coach/bookings/settings

Oppdaterer trenerens booking-innstillinger.

**Request:**
```json
{
  "settings": {
    "weeklySchedule": { ... },
    "sessionTypes": [ ... ],
    "blockedDates": [ ... ],
    "advanceBookingDays": 14,
    "minNoticeHours": 24,
    "autoApprove": false,
    "notifyOnRequest": true,
    "bufferMinutes": 15
  }
}
```

**Response:**
```json
{
  "success": true,
  "settings": { ... }
}
```

---

### Blokker dato

#### POST /api/v1/coach/bookings/blocked-dates

Legger til en blokkert dato.

**Request:**
```json
{
  "date": "2025-12-31",
  "reason": "Nyttårsaften"
}
```

**Response:**
```json
{
  "success": true,
  "blockedDate": {
    "id": "uuid",
    "date": "2025-12-31",
    "reason": "Nyttårsaften"
  }
}
```

---

### Fjern blokkert dato

#### DELETE /api/v1/coach/bookings/blocked-dates/:dateId

Fjerner en blokkert dato.

**Response:**
```json
{
  "success": true,
  "message": "Blokkert dato fjernet"
}
```

---

## Database-modeller (Prisma)

```prisma
model CoachBooking {
  id            String        @id @default(cuid())
  coachId       String
  coach         User          @relation("CoachBookings", fields: [coachId], references: [id])
  playerId      String
  player        Player        @relation(fields: [playerId], references: [id])
  date          DateTime
  startTime     String
  endTime       String
  duration      Int
  sessionType   String
  notes         String?
  status        BookingStatus @default(PENDING)
  declineReason String?
  createdAt     DateTime      @default(now())
  respondedAt   DateTime?
  cancelledAt   DateTime?
  cancelReason  String?

  @@index([coachId, date])
  @@index([playerId])
}

enum BookingStatus {
  PENDING
  APPROVED
  DECLINED
  CANCELLED
  COMPLETED
  NO_SHOW
}

model CoachAvailability {
  id              String   @id @default(cuid())
  coachId         String   @unique
  coach           User     @relation("CoachAvailability", fields: [coachId], references: [id])
  weeklySchedule  Json     // { monday: { enabled, slots: [] }, ... }
  sessionTypes    Json     // [{ id, name, duration, enabled }, ...]
  advanceBookingDays Int   @default(14)
  minNoticeHours  Int      @default(24)
  bufferMinutes   Int      @default(15)
  autoApprove     Boolean  @default(false)
  notifyOnRequest Boolean  @default(true)
  updatedAt       DateTime @updatedAt
}

model CoachBlockedDate {
  id        String   @id @default(cuid())
  coachId   String
  coach     User     @relation("CoachBlockedDates", fields: [coachId], references: [id])
  date      DateTime
  reason    String?
  createdAt DateTime @default(now())

  @@unique([coachId, date])
  @@index([coachId])
}
```

---

## Implementasjonsstatus

| Endepunkt | Status | Prioritet |
|-----------|--------|-----------|
| GET /api/v1/coach/bookings/schedule | Planlagt | Høy |
| GET /api/v1/coach/bookings/requests | Planlagt | Høy |
| PUT /api/v1/coach/bookings/:id/approve | Planlagt | Høy |
| PUT /api/v1/coach/bookings/:id/decline | Planlagt | Høy |
| DELETE /api/v1/coach/bookings/:id | Planlagt | Medium |
| GET /api/v1/coach/bookings/settings | Planlagt | Høy |
| PUT /api/v1/coach/bookings/settings | Planlagt | Høy |
| POST /api/v1/coach/bookings/blocked-dates | Planlagt | Medium |
| DELETE /api/v1/coach/bookings/blocked-dates/:id | Planlagt | Medium |

---

## Frontend-komponenter

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| CoachBookingCalendar | `coach-booking/CoachBookingCalendar.tsx` | Kalendervisning med ukesoversikt |
| CoachBookingRequests | `coach-booking/CoachBookingRequests.tsx` | Liste over bookingforespørsler |
| CoachBookingSettings | `coach-booking/CoachBookingSettings.tsx` | Innstillinger for tilgjengelighet |

---

## Ruter

| Rute | Komponent | Beskrivelse |
|------|-----------|-------------|
| `/coach/booking` | CoachBookingCalendar | Hovedkalender |
| `/coach/booking/requests` | CoachBookingRequests | Forespørselsliste |
| `/coach/booking/settings` | CoachBookingSettings | Tilgjengelighetsinnstillinger |

---

*Dokumentasjon generert: Desember 2025*
