# AK Golf Academy - Coach Groups API

## Oversikt

API-endepunkter for gruppehåndtering i Coach Portal.

---

## Grupper (Groups)

### Liste alle grupper

#### GET /api/v1/coach/groups

Henter alle grupper for innlogget trener.

**Query Parameters:**
- `type` (optional): Filter etter type (`wang`, `team_norway`, `custom`)

**Response:**
```json
{
  "groups": [
    {
      "id": "uuid",
      "name": "WANG Toppidrett 2025",
      "description": "Hovedgruppe for WANG Toppidrett elever",
      "type": "wang",
      "avatarColor": "#10456A",
      "avatarInitials": "WT",
      "memberCount": 8,
      "members": [
        {
          "id": "uuid",
          "name": "Anders Hansen",
          "avatarInitials": "AH",
          "category": "A"
        }
      ],
      "hasTrainingPlan": true,
      "nextSession": "2025-12-23T09:00:00Z",
      "createdAt": "2025-01-15T10:00:00Z"
    }
  ],
  "total": 4
}
```

---

### Opprett gruppe

#### POST /api/v1/coach/groups

Oppretter en ny gruppe.

**Request:**
```json
{
  "name": "Putting Fokus",
  "description": "Spillere som fokuserer på putting-forbedring",
  "type": "custom",
  "avatarColor": "#C9A227",
  "avatarInitials": "PF",
  "memberIds": ["uuid1", "uuid2", "uuid3"]
}
```

**Response:**
```json
{
  "group": {
    "id": "uuid",
    "name": "Putting Fokus",
    "description": "Spillere som fokuserer på putting-forbedring",
    "type": "custom",
    "avatarColor": "#C9A227",
    "avatarInitials": "PF",
    "memberCount": 3,
    "members": [...],
    "hasTrainingPlan": false,
    "createdAt": "2025-12-21T10:00:00Z"
  }
}
```

---

### Hent gruppedetaljer

#### GET /api/v1/coach/groups/:groupId

Henter detaljert informasjon om en gruppe.

**Response:**
```json
{
  "group": {
    "id": "uuid",
    "name": "WANG Toppidrett 2025",
    "description": "Hovedgruppe for WANG Toppidrett elever",
    "type": "wang",
    "avatarColor": "#10456A",
    "avatarInitials": "WT",
    "members": [
      {
        "id": "uuid",
        "name": "Anders Hansen",
        "avatarInitials": "AH",
        "avatarColor": "#10456A",
        "category": "A",
        "lastActive": "2025-12-21",
        "sessionsThisWeek": 4,
        "trend": "up"
      }
    ],
    "upcomingSessions": [
      {
        "id": "uuid",
        "title": "Teknikktrening",
        "date": "2025-12-23",
        "time": "09:00",
        "duration": 120,
        "attendees": 5,
        "totalMembers": 5
      }
    ],
    "recentSessions": [...],
    "stats": {
      "totalSessions": 48,
      "avgAttendance": 87,
      "avgSessionsPerWeek": 3.2,
      "topPerformer": "Emma Berg"
    },
    "hasTrainingPlan": true,
    "createdAt": "2025-01-15T10:00:00Z"
  }
}
```

---

### Oppdater gruppe

#### PUT /api/v1/coach/groups/:groupId

Oppdaterer en eksisterende gruppe.

**Request:**
```json
{
  "name": "WANG Toppidrett 2025 - Oppdatert",
  "description": "Ny beskrivelse",
  "avatarColor": "#2563EB"
}
```

**Response:**
```json
{
  "group": {
    "id": "uuid",
    "name": "WANG Toppidrett 2025 - Oppdatert",
    ...
  }
}
```

---

### Slett gruppe

#### DELETE /api/v1/coach/groups/:groupId

Sletter en gruppe. Medlemmer blir ikke slettet.

**Response:**
```json
{
  "success": true,
  "message": "Gruppe slettet"
}
```

---

## Gruppemedlemmer

### Hent medlemmer

#### GET /api/v1/coach/groups/:groupId/members

Henter alle medlemmer i en gruppe.

**Response:**
```json
{
  "members": [
    {
      "id": "uuid",
      "name": "Anders Hansen",
      "avatarInitials": "AH",
      "avatarColor": "#10456A",
      "category": "A",
      "joinedAt": "2025-01-15T10:00:00Z",
      "lastActive": "2025-12-21T14:30:00Z",
      "sessionsThisWeek": 4,
      "trend": "up"
    }
  ],
  "total": 8
}
```

---

### Legg til medlemmer

#### POST /api/v1/coach/groups/:groupId/members

Legger til nye medlemmer i gruppen.

**Request:**
```json
{
  "memberIds": ["uuid1", "uuid2"]
}
```

**Response:**
```json
{
  "success": true,
  "addedCount": 2,
  "members": [...]
}
```

---

### Fjern medlem

#### DELETE /api/v1/coach/groups/:groupId/members/:memberId

Fjerner et medlem fra gruppen.

**Response:**
```json
{
  "success": true,
  "message": "Medlem fjernet fra gruppe"
}
```

---

## Gruppeplan (Treningsplan)

### Hent gruppeplan

#### GET /api/v1/coach/groups/:groupId/plan

Henter treningsplanen for gruppen.

**Response:**
```json
{
  "plan": {
    "id": "uuid",
    "groupId": "uuid",
    "weeklySchedule": [
      {
        "dayOfWeek": 1,
        "sessions": [
          {
            "time": "09:00",
            "duration": 120,
            "title": "Teknikktrening",
            "focus": ["driving", "iron_play"]
          }
        ]
      }
    ],
    "goals": [
      {
        "id": "uuid",
        "description": "Forbedre putting-snitt",
        "targetDate": "2025-03-01",
        "status": "in_progress"
      }
    ],
    "updatedAt": "2025-12-20T16:00:00Z"
  }
}
```

---

### Oppdater gruppeplan

#### PUT /api/v1/coach/groups/:groupId/plan

Oppdaterer treningsplanen for gruppen.

**Request:**
```json
{
  "weeklySchedule": [...],
  "goals": [...],
  "notifyMembers": true
}
```

**Response:**
```json
{
  "plan": {...},
  "notificationsSent": 5
}
```

---

## Gruppeøkter

### Planlegg økt

#### POST /api/v1/coach/groups/:groupId/sessions

Oppretter en ny økt for gruppen.

**Request:**
```json
{
  "title": "Putting workshop",
  "date": "2025-12-24",
  "time": "14:00",
  "duration": 90,
  "location": "Putting green",
  "notes": "Ta med ekstra baller",
  "notifyMembers": true
}
```

**Response:**
```json
{
  "session": {
    "id": "uuid",
    "title": "Putting workshop",
    "date": "2025-12-24",
    "time": "14:00",
    "duration": 90,
    "attendees": [],
    "totalMembers": 5
  },
  "notificationsSent": 5
}
```

---

## Gruppemeldinger

### Send melding til gruppe

#### POST /api/v1/coach/groups/:groupId/message

Sender melding til alle medlemmer i gruppen.

**Request:**
```json
{
  "content": "Husk trening i morgen kl 09:00!",
  "priority": "normal"
}
```

**Response:**
```json
{
  "success": true,
  "recipientCount": 5,
  "messageId": "uuid"
}
```

---

## Database-modeller (Prisma)

```prisma
model CoachGroup {
  id            String          @id @default(cuid())
  name          String
  description   String?
  type          GroupType       @default(CUSTOM)
  avatarColor   String          @default("#10456A")
  avatarInitials String
  coachId       String
  coach         User            @relation(fields: [coachId], references: [id])
  members       GroupMember[]
  sessions      GroupSession[]
  plan          GroupPlan?
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt
}

enum GroupType {
  WANG
  TEAM_NORWAY
  CUSTOM
}

model GroupMember {
  id        String      @id @default(cuid())
  groupId   String
  group     CoachGroup  @relation(fields: [groupId], references: [id], onDelete: Cascade)
  playerId  String
  player    Player      @relation(fields: [playerId], references: [id])
  joinedAt  DateTime    @default(now())

  @@unique([groupId, playerId])
}

model GroupSession {
  id          String      @id @default(cuid())
  groupId     String
  group       CoachGroup  @relation(fields: [groupId], references: [id], onDelete: Cascade)
  title       String
  date        DateTime
  duration    Int
  location    String?
  notes       String?
  attendees   GroupSessionAttendee[]
  createdAt   DateTime    @default(now())
}

model GroupSessionAttendee {
  id          String        @id @default(cuid())
  sessionId   String
  session     GroupSession  @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  playerId    String
  player      Player        @relation(fields: [playerId], references: [id])
  status      AttendanceStatus @default(PENDING)

  @@unique([sessionId, playerId])
}

enum AttendanceStatus {
  PENDING
  CONFIRMED
  DECLINED
  ATTENDED
  NO_SHOW
}

model GroupPlan {
  id              String      @id @default(cuid())
  groupId         String      @unique
  group           CoachGroup  @relation(fields: [groupId], references: [id], onDelete: Cascade)
  weeklySchedule  Json
  goals           Json?
  notes           String?
  updatedAt       DateTime    @updatedAt
}
```

---

## Implementasjonsstatus

| Endepunkt | Status | Prioritet |
|-----------|--------|-----------|
| GET /api/v1/coach/groups | Planlagt | Høy |
| POST /api/v1/coach/groups | Planlagt | Høy |
| GET /api/v1/coach/groups/:id | Planlagt | Høy |
| PUT /api/v1/coach/groups/:id | Planlagt | Medium |
| DELETE /api/v1/coach/groups/:id | Planlagt | Medium |
| GET /api/v1/coach/groups/:id/members | Planlagt | Høy |
| POST /api/v1/coach/groups/:id/members | Planlagt | Høy |
| DELETE /api/v1/coach/groups/:id/members/:memberId | Planlagt | Medium |
| GET /api/v1/coach/groups/:id/plan | Planlagt | Medium |
| PUT /api/v1/coach/groups/:id/plan | Planlagt | Medium |
| POST /api/v1/coach/groups/:id/sessions | Planlagt | Medium |
| POST /api/v1/coach/groups/:id/message | Planlagt | Medium |

---

*Dokumentasjon generert: Desember 2025*
