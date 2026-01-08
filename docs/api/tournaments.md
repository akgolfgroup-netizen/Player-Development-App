# TIER Golf - Coach Tournaments API

## Oversikt

API-endepunkter for trenerens turneringssystem i Coach Portal.

---

## Turneringer

### Hent alle turneringer

#### GET /api/v1/coach/tournaments

Henter alle turneringer med spillerdeltakelse.

**Query Parameters:**
- `category` (optional): Filter etter kategori (`junior`, `elite`, `open`, `senior`)
- `status` (optional): Filter etter status (`registration_open`, `upcoming`, `completed`)
- `hasPlayers` (optional): `true` for å kun vise turneringer med påmeldte spillere

**Response:**
```json
{
  "tournaments": [
    {
      "id": "uuid",
      "name": "NM Junior 2025",
      "type": "championship",
      "category": "junior",
      "startDate": "2025-06-15",
      "endDate": "2025-06-17",
      "location": "Mørj Golfklubb",
      "city": "Oslo",
      "registrationDeadline": "2025-05-30",
      "maxParticipants": 120,
      "currentParticipants": 87,
      "status": "registration_open",
      "description": "Norgesmesterskap for juniorer",
      "format": "54 hull slagspill",
      "fee": 850,
      "myPlayers": [
        {
          "id": "player-uuid",
          "name": "Anders Hansen",
          "initials": "AH",
          "category": "A",
          "status": "registered"
        }
      ]
    }
  ],
  "total": 15
}
```

**Status-typer for spillere:**
- `registered` - Bekreftet påmelding
- `pending` - Venter på godkjenning
- `interested` - Spiller har vist interesse
- `declined` - Avslått/kansellert

---

### Hent turneringsdetaljer

#### GET /api/v1/coach/tournaments/:tournamentId

Henter detaljert informasjon om en turnering.

**Response:**
```json
{
  "tournament": {
    "id": "uuid",
    "name": "NM Junior 2025",
    "type": "championship",
    "category": "junior",
    "startDate": "2025-06-15",
    "endDate": "2025-06-17",
    "location": "Mørj Golfklubb",
    "city": "Oslo",
    "address": "Bogstadveien 1, 0355 Oslo",
    "registrationDeadline": "2025-05-30",
    "maxParticipants": 120,
    "currentParticipants": 87,
    "status": "registration_open",
    "description": "Norgesmesterskap for juniorer. Kvalifisering til Nordisk Mesterskap.",
    "format": "54 hull slagspill",
    "fee": 850,
    "courseInfo": {
      "name": "Mørj Golfklubb - Mesterbanen",
      "par": 72,
      "length": 6450,
      "rating": 73.2,
      "slope": 135
    },
    "schedule": [
      { "date": "2025-06-15", "description": "Runde 1 - Slagspill" },
      { "date": "2025-06-16", "description": "Runde 2 - Slagspill" },
      { "date": "2025-06-17", "description": "Runde 3 - Slagspill (cut)" }
    ],
    "myPlayers": [...]
  }
}
```

---

## Spillerdeltakelse

### Hent spilleroversikt

#### GET /api/v1/coach/tournaments/players

Henter alle spillere med deres turneringsdeltakelse.

**Response:**
```json
{
  "players": [
    {
      "id": "player-uuid",
      "name": "Anders Hansen",
      "initials": "AH",
      "avatarColor": "#10456A",
      "category": "A",
      "upcomingTournaments": [
        {
          "id": "entry-uuid",
          "tournamentId": "tournament-uuid",
          "tournamentName": "NM Junior 2025",
          "date": "2025-06-15",
          "location": "Oslo GK",
          "status": "registered",
          "category": "junior"
        }
      ],
      "totalThisYear": 8,
      "lastTournament": "2025-03-15"
    }
  ],
  "total": 5
}
```

---

### Meld på spiller

#### POST /api/v1/coach/tournaments/:tournamentId/register

Melder på en spiller til en turnering.

**Request:**
```json
{
  "playerId": "player-uuid",
  "notes": "Valgfritt notat"
}
```

**Response:**
```json
{
  "success": true,
  "registration": {
    "id": "registration-uuid",
    "playerId": "player-uuid",
    "tournamentId": "tournament-uuid",
    "status": "pending",
    "createdAt": "2025-12-21T10:00:00Z"
  },
  "message": "Påmelding sendt til godkjenning"
}
```

---

### Kanseller påmelding

#### DELETE /api/v1/coach/tournaments/:tournamentId/register/:playerId

Kansellerer en spillers påmelding.

**Response:**
```json
{
  "success": true,
  "message": "Påmelding kansellert"
}
```

---

## Resultater

### Hent resultater

#### GET /api/v1/coach/tournaments/results

Henter turneringsresultater for trenerens spillere.

**Query Parameters:**
- `playerId` (optional): Filter etter spiller
- `period` (optional): `month`, `quarter`, `year`, `all`
- `category` (optional): Filter etter turneringskategori

**Response:**
```json
{
  "results": [
    {
      "id": "result-uuid",
      "tournamentName": "Vårturneringen 2025",
      "tournamentType": "club",
      "date": "2025-03-15",
      "location": "Holtsmark GK",
      "category": "open",
      "playerId": "player-uuid",
      "playerName": "Anders Hansen",
      "playerInitials": "AH",
      "playerCategory": "A",
      "position": 3,
      "totalParticipants": 42,
      "score": 74,
      "scoreToPar": 2,
      "rounds": [74],
      "highlight": "Bronse"
    }
  ],
  "playerStats": [
    {
      "id": "player-uuid",
      "name": "Anders Hansen",
      "initials": "AH",
      "avatarColor": "#10456A",
      "tournamentsPlayed": 8,
      "wins": 2,
      "topThree": 4,
      "topTen": 7,
      "averagePosition": 5.2,
      "averageScore": 1.5,
      "trend": "up"
    }
  ],
  "total": 25
}
```

---

### Registrer resultat

#### POST /api/v1/coach/tournaments/:tournamentId/results

Registrerer et turneringsresultat for en spiller.

**Request:**
```json
{
  "playerId": "player-uuid",
  "position": 3,
  "totalParticipants": 42,
  "rounds": [74, 72],
  "notes": "Sterk avslutning"
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "id": "result-uuid",
    "playerId": "player-uuid",
    "tournamentId": "tournament-uuid",
    "position": 3,
    "score": 146,
    "scoreToPar": 2,
    "rounds": [74, 72],
    "createdAt": "2025-12-21T16:00:00Z"
  }
}
```

---

## Database-modeller (Prisma)

```prisma
model Tournament {
  id                    String              @id @default(cuid())
  name                  String
  type                  TournamentType
  category              TournamentCategory
  startDate             DateTime
  endDate               DateTime
  location              String
  city                  String
  address               String?
  registrationDeadline  DateTime
  maxParticipants       Int
  currentParticipants   Int                 @default(0)
  status                TournamentStatus    @default(UPCOMING)
  description           String?
  format                String
  fee                   Int                 @default(0)
  externalUrl           String?
  registrations         TournamentRegistration[]
  results               TournamentResult[]
  createdAt             DateTime            @default(now())
  updatedAt             DateTime            @updatedAt

  @@index([startDate])
  @@index([category])
}

enum TournamentType {
  CHAMPIONSHIP
  TOUR
  CLUB
  INTERNATIONAL
}

enum TournamentCategory {
  JUNIOR
  ELITE
  OPEN
  SENIOR
}

enum TournamentStatus {
  UPCOMING
  REGISTRATION_OPEN
  REGISTRATION_CLOSED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

model TournamentRegistration {
  id            String                    @id @default(cuid())
  tournamentId  String
  tournament    Tournament                @relation(fields: [tournamentId], references: [id], onDelete: Cascade)
  playerId      String
  player        Player                    @relation(fields: [playerId], references: [id])
  coachId       String?
  coach         User?                     @relation("CoachRegistrations", fields: [coachId], references: [id])
  status        RegistrationStatus        @default(PENDING)
  notes         String?
  createdAt     DateTime                  @default(now())
  updatedAt     DateTime                  @updatedAt

  @@unique([tournamentId, playerId])
  @@index([playerId])
  @@index([coachId])
}

enum RegistrationStatus {
  PENDING
  REGISTERED
  INTERESTED
  DECLINED
  CANCELLED
}

model TournamentResult {
  id                  String      @id @default(cuid())
  tournamentId        String
  tournament          Tournament  @relation(fields: [tournamentId], references: [id], onDelete: Cascade)
  playerId            String
  player              Player      @relation(fields: [playerId], references: [id])
  position            Int
  totalParticipants   Int
  score               Int
  scoreToPar          Int
  rounds              Json        // Array of round scores
  notes               String?
  highlight           String?
  createdAt           DateTime    @default(now())

  @@unique([tournamentId, playerId])
  @@index([playerId])
}
```

---

## Implementasjonsstatus

| Endepunkt | Status | Prioritet |
|-----------|--------|-----------|
| GET /api/v1/coach/tournaments | Planlagt | Høy |
| GET /api/v1/coach/tournaments/:id | Planlagt | Høy |
| GET /api/v1/coach/tournaments/players | Planlagt | Høy |
| POST /api/v1/coach/tournaments/:id/register | Planlagt | Høy |
| DELETE /api/v1/coach/tournaments/:id/register/:playerId | Planlagt | Medium |
| GET /api/v1/coach/tournaments/results | Planlagt | Høy |
| POST /api/v1/coach/tournaments/:id/results | Planlagt | Medium |

---

## Frontend-komponenter

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| CoachTournamentCalendar | `coach-tournaments/CoachTournamentCalendar.tsx` | Kalender med alle turneringer |
| CoachTournamentPlayers | `coach-tournaments/CoachTournamentPlayers.tsx` | Spilleroversikt og påmeldinger |
| CoachTournamentResults | `coach-tournaments/CoachTournamentResults.tsx` | Resultater og statistikk |

---

## Ruter

| Rute | Komponent | Beskrivelse |
|------|-----------|-------------|
| `/coach/tournaments` | CoachTournamentCalendar | Hovedkalender |
| `/coach/tournaments/players` | CoachTournamentPlayers | Spillerdeltakelse |
| `/coach/tournaments/results` | CoachTournamentResults | Resultater og statistikk |

---

*Dokumentasjon generert: Desember 2025*
