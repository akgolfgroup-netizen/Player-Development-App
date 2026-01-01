# Coach Portal - Utviklingsoversikt

> AK Golf Academy - Coach Funksjonalitet
> Basert på kravspesifikasjon fra Coach:Admin.md

---

## Sammendrag

| Kategori | Finnes | Må utvikles | Prioritet |
|----------|--------|-------------|-----------|
| Dashboard | Delvis | Ja | Høy |
| Mine Spillere | Delvis | Ja | Høy |
| Mine Grupper | Nei | Ja | Høy |
| Bookingsystem | Nei | Ja | Medium |
| Stats Verktøy | Delvis | Ja | Medium |
| Treningsplanlegger | Delvis | Ja | Høy |
| Turneringskalender | Delvis | Ja | Medium |
| Beskjed/Chat | Nei | Ja | Høy |
| Øvelsesbank | Ja | Forbedring | Lav |

---

## 1. DASHBOARD (Oversikt)

### Eksisterende komponenter
- `CoachDashboard.tsx` - Grunnleggende dashboard

### Må utvikles

#### 1.1 Dashboard Widgets
| Widget | Status | Beskrivelse |
|--------|--------|-------------|
| `CoachPlayerAlerts.tsx` | **NY** | Røde flagg fra spillere (søvn, mat, etc.) |
| `CoachWeeklyTournaments.tsx` | **NY** | Ukens turneringer med spilleroversikt |
| `CoachInjuryTracker.tsx` | **NY** | Sykdom/skade-oversikt |
| `CoachQuickStats.tsx` | **NY** | Antall spillere, økter, varsler |

#### 1.2 API Endepunkter
```
GET /api/v1/coach/dashboard/alerts      - Røde flagg
GET /api/v1/coach/dashboard/tournaments - Ukens turneringer
GET /api/v1/coach/dashboard/injuries    - Sykdom/skader
GET /api/v1/coach/dashboard/stats       - Quick stats
```

---

## 2. MINE SPILLERE

### Eksisterende komponenter
- `CoachAthleteList.tsx` - Liste over spillere
- `CoachAthleteDetail.tsx` - Spillerdetaljer

### Må utvikles

#### 2.1 Spilleroversikt forbedringer
| Funksjon | Status | Beskrivelse |
|----------|--------|-------------|
| Kategorifilter | **NY** | Filtrer etter A-K kategori |
| Gruppevisning | **NY** | Vis spillere per gruppe |
| Statusikoner | **NY** | Sykdom/skade/flagg-indikatorer |
| Turneringsdeltakelse | **NY** | Hvem spiller hvor denne uken |

#### 2.2 Nye komponenter
```
/features/coach-players/
├── CoachPlayerGrid.tsx        - Grid-visning med statuskort
├── CoachPlayerFilters.tsx     - Filter/søk-komponent
├── CoachPlayerStatusCard.tsx  - Spillerkort med status
└── CoachPlayerTournaments.tsx - Turneringsoversikt per spiller
```

---

## 3. MINE GRUPPER

### Eksisterende komponenter
- Ingen

### Må utvikles

#### 3.1 Gruppeadministrasjon
| Komponent | Status | Beskrivelse |
|-----------|--------|-------------|
| `CoachGroupList.tsx` | **NY** | Oversikt over alle grupper |
| `CoachGroupDetail.tsx` | **NY** | Gruppedetaljer med medlemmer |
| `CoachGroupCreate.tsx` | **NY** | Opprett ny gruppe |
| `CoachGroupPlan.tsx` | **NY** | Felles treningsplan for gruppe |

#### 3.2 Gruppetyper
- WANG Toppidrett
- Team Norway
- Egendefinerte grupper

#### 3.3 API Endepunkter
```
GET    /api/v1/coach/groups              - Liste grupper
POST   /api/v1/coach/groups              - Opprett gruppe
GET    /api/v1/coach/groups/:id          - Gruppedetaljer
PUT    /api/v1/coach/groups/:id          - Oppdater gruppe
DELETE /api/v1/coach/groups/:id          - Slett gruppe
GET    /api/v1/coach/groups/:id/members  - Gruppemedlemmer
POST   /api/v1/coach/groups/:id/plan     - Oppdater gruppeplan
```

#### 3.4 Database (Prisma)
```prisma
model CoachGroup {
  id          String   @id @default(cuid())
  name        String
  description String?
  coachId     String
  coach       User     @relation(fields: [coachId], references: [id])
  members     GroupMember[]
  trainingPlan TrainingPlan?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model GroupMember {
  id        String     @id @default(cuid())
  groupId   String
  group     CoachGroup @relation(fields: [groupId], references: [id])
  athleteId String
  athlete   User       @relation(fields: [athleteId], references: [id])
  joinedAt  DateTime   @default(now())
}
```

---

## 4. BOOKINGSYSTEM

### Eksisterende komponenter
- Modul nevnt som "ferdig i mappen" - må verifiseres

### Må utvikles/integreres

#### 4.1 Booking-komponenter
| Komponent | Status | Beskrivelse |
|-----------|--------|-------------|
| `CoachBookingCalendar.tsx` | **NY** | Kalendervisning for booking |
| `CoachBookingSlots.tsx` | **NY** | Tilgjengelige tidspunkter |
| `CoachBookingRequests.tsx` | **NY** | Innkommende forespørsler |
| `CoachBookingSettings.tsx` | **NY** | Tilgjengelighetsinnstillinger |

#### 4.2 API Endepunkter
```
GET  /api/v1/coach/bookings              - Mine bookinger
POST /api/v1/coach/bookings              - Godkjenn booking
GET  /api/v1/coach/bookings/requests     - Ventende forespørsler
PUT  /api/v1/coach/bookings/:id/approve  - Godkjenn
PUT  /api/v1/coach/bookings/:id/decline  - Avslå
GET  /api/v1/coach/availability          - Min tilgjengelighet
PUT  /api/v1/coach/availability          - Oppdater tilgjengelighet
```

---

## 5. STATS VERKTØY

### Eksisterende komponenter
- `StatsPage.tsx` - Grunnleggende stats
- `CoachTrajectoryViewer.tsx` - Utviklingsbane

### Må utvikles

#### 5.1 Stats-komponenter
| Komponent | Status | Beskrivelse |
|-----------|--------|-------------|
| `CoachStatsOverview.tsx` | **NY** | Samlet spilleroversikt |
| `CoachStatsProgress.tsx` | **NY** | Fremgangsmåling |
| `CoachStatsRegression.tsx` | **NY** | Tilbakegangsvarsler |
| `CoachDataGolfIntegration.tsx` | **NY** | Data Golf modul |

#### 5.2 Nøkkeltall
- Spillere med fremgang
- Spillere med tilbakegang
- Gjennomsnittlig fremgang per kategori
- Test-fullføringsrate
- Turneringsprestasjoner

#### 5.3 Data Golf Integrasjon
```
GET /api/v1/external/datagolf/stats     - Hent Data Golf stats
GET /api/v1/external/datagolf/player/:id - Spillerdata
```

---

## 6. TRENINGSPLANLEGGER

### Eksisterende komponenter
- `CoachTrainingPlan.tsx` - Vis treningsplan
- `CoachTrainingPlanEditor.tsx` - Rediger plan

### Må utvikles

#### 6.1 Planhierarki
| Plannivå | Status | Beskrivelse |
|----------|--------|-------------|
| Årsplan | **NY** | Helårsoversikt |
| Periodeplan | **NY** | Periodisering (4-6 uker) |
| Månedplan | **NY** | Månedlig fokus |
| Ukeplan | DELVIS | Ukentlig øktplan |
| Øktplan | FINNES | Enkeltøkter |

#### 6.2 Nye komponenter
```
/features/coach-planning/
├── CoachAnnualPlan.tsx        - Årsplan
├── CoachPeriodPlan.tsx        - Periodeplan
├── CoachMonthPlan.tsx         - Månedplan
├── CoachWeekPlan.tsx          - Ukeplan
├── CoachSessionPlan.tsx       - Øktplan
├── CoachPlanSelector.tsx      - Spiller/gruppe-velger
└── CoachPlanNotification.tsx  - Varsle spillere om endringer
```

#### 6.3 Gruppeplan-funksjonalitet
- Velg gruppe
- Rediger felles treningsplan
- Automatisk synkronisering til alle gruppemedlemmer
- Push-varsling ved endringer

#### 6.4 API Endepunkter
```
GET  /api/v1/coach/plans/:athleteId/annual   - Årsplan
GET  /api/v1/coach/plans/:athleteId/period   - Periodeplan
GET  /api/v1/coach/plans/:athleteId/month    - Månedplan
GET  /api/v1/coach/plans/:athleteId/week     - Ukeplan
PUT  /api/v1/coach/plans/:athleteId/:type    - Oppdater plan
POST /api/v1/coach/plans/group/:groupId      - Oppdater gruppeplan
POST /api/v1/coach/plans/notify              - Varsle om endring
```

---

## 7. TURNERINGSKALENDER

### Eksisterende komponenter
- `TurneringskalenderContainer.jsx` - Grunnleggende kalender
- `MineTurneringerContainer.jsx` - Mine turneringer

### Må utvikles

#### 7.1 Coach-spesifikke funksjoner
| Funksjon | Status | Beskrivelse |
|----------|--------|-------------|
| Spillerdeltakelse | **NY** | Hvem spiller hvilken turnering |
| Turneringsvarsel | **NY** | Varsle spillere om turneringer |
| Resultatoversikt | **NY** | Samlet resultatvisning |

#### 7.2 Nye komponenter
```
/features/coach-tournaments/
├── CoachTournamentCalendar.tsx   - Full kalender
├── CoachTournamentPlayers.tsx    - Spillerdeltakelse per turnering
├── CoachTournamentResults.tsx    - Resultater fra turneringer
└── CoachTournamentNotify.tsx     - Varsle om turneringer
```

---

## 8. BESKJED / CHAT

### Eksisterende komponenter
- Ingen dedikert chat-modul

### Må utvikles

#### 8.1 Meldingskomponenter
| Komponent | Status | Beskrivelse |
|-----------|--------|-------------|
| `CoachMessageCenter.tsx` | **NY** | Meldingssentral |
| `CoachMessageCompose.tsx` | **NY** | Skriv ny beskjed |
| `CoachMessageScheduler.tsx` | **NY** | Planlegg sending |
| `CoachMessageHistory.tsx` | **NY** | Sendte beskjeder |

#### 8.2 Funksjoner
- Velg mottakere (spillere/grupper)
- Legg ved vedlegg
- Planlegg dato/tidspunkt
- Automatisk sending

#### 8.3 Nye komponenter
```
/features/coach-messaging/
├── CoachMessageCenter.tsx       - Oversikt
├── CoachMessageCompose.tsx      - Skriv beskjed
├── CoachMessageScheduler.tsx    - Planlegg sending
├── CoachMessageRecipients.tsx   - Velg mottakere
├── CoachMessageAttachments.tsx  - Vedlegg
└── CoachMessageHistory.tsx      - Historikk
```

#### 8.4 API Endepunkter
```
GET  /api/v1/coach/messages              - Alle beskjeder
POST /api/v1/coach/messages              - Send beskjed
GET  /api/v1/coach/messages/scheduled    - Planlagte
PUT  /api/v1/coach/messages/:id          - Oppdater
DELETE /api/v1/coach/messages/:id        - Slett
POST /api/v1/coach/messages/:id/send     - Send nå
```

#### 8.5 Database (Prisma)
```prisma
model CoachMessage {
  id           String   @id @default(cuid())
  coachId      String
  coach        User     @relation(fields: [coachId], references: [id])
  subject      String?
  content      String
  scheduledAt  DateTime?
  sentAt       DateTime?
  status       MessageStatus @default(DRAFT)
  recipients   MessageRecipient[]
  attachments  MessageAttachment[]
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

enum MessageStatus {
  DRAFT
  SCHEDULED
  SENT
  FAILED
}

model MessageRecipient {
  id        String       @id @default(cuid())
  messageId String
  message   CoachMessage @relation(fields: [messageId], references: [id])
  userId    String?
  user      User?        @relation(fields: [userId], references: [id])
  groupId   String?
  group     CoachGroup?  @relation(fields: [groupId], references: [id])
  readAt    DateTime?
}

model MessageAttachment {
  id        String       @id @default(cuid())
  messageId String
  message   CoachMessage @relation(fields: [messageId], references: [id])
  fileName  String
  fileUrl   String
  fileSize  Int
  mimeType  String
}
```

---

## 9. ØVELSESBANK

### Eksisterende komponenter
- `ExerciseLibrary.jsx` - Øvelsesbibliotek
- `OevelserContainer.jsx` - Øvelser

### Må forbedres

#### 9.1 Coach-spesifikke funksjoner
| Funksjon | Status | Beskrivelse |
|----------|--------|-------------|
| Egne øvelser | **NY** | Legg til egne øvelser |
| Øvelsesfavoritter | **NY** | Marker favoritter |
| Del med spillere | **NY** | Tildel øvelser til spiller |
| Treningsplanmaler | **NY** | Lagre som mal |

---

## Oppdatert Navigasjon

Basert på kravene må `coach-navigation.js` oppdateres:

```javascript
export const coachNavigationConfig = [
  {
    label: 'Dashboard',
    icon: 'LayoutDashboard',
    href: '/coach'
  },
  {
    label: 'Mine spillere',
    icon: 'Users',
    submenu: [
      { href: '/coach/athletes', label: 'Alle spillere' },
      { href: '/coach/athletes/status', label: 'Status & varsler' },
      { href: '/coach/athletes/tournaments', label: 'Turneringsdeltakelse' },
    ]
  },
  {
    label: 'Mine grupper',
    icon: 'UsersRound',
    submenu: [
      { href: '/coach/groups', label: 'Alle grupper' },
      { href: '/coach/groups/create', label: 'Ny gruppe' },
    ]
  },
  {
    label: 'Booking',
    icon: 'CalendarCheck',
    submenu: [
      { href: '/coach/booking', label: 'Kalender' },
      { href: '/coach/booking/requests', label: 'Forespørsler' },
      { href: '/coach/booking/settings', label: 'Tilgjengelighet' },
    ]
  },
  {
    label: 'Stats',
    icon: 'BarChart3',
    submenu: [
      { href: '/coach/stats', label: 'Spilleroversikt' },
      { href: '/coach/stats/progress', label: 'Fremgang' },
      { href: '/coach/stats/datagolf', label: 'Data Golf' },
    ]
  },
  {
    label: 'Treningsplanlegger',
    icon: 'ClipboardList',
    submenu: [
      { href: '/coach/planning', label: 'Velg spiller/gruppe' },
      { href: '/coach/planning/templates', label: 'Maler' },
    ]
  },
  {
    label: 'Turneringer',
    icon: 'Trophy',
    submenu: [
      { href: '/coach/tournaments', label: 'Kalender' },
      { href: '/coach/tournaments/players', label: 'Mine spillere' },
      { href: '/coach/tournaments/results', label: 'Resultater' },
    ]
  },
  {
    label: 'Beskjeder',
    icon: 'MessageCircle',
    submenu: [
      { href: '/coach/messages', label: 'Sendt' },
      { href: '/coach/messages/compose', label: 'Ny beskjed' },
      { href: '/coach/messages/scheduled', label: 'Planlagt' },
    ]
  },
  {
    label: 'Øvelsesbank',
    icon: 'Dumbbell',
    submenu: [
      { href: '/coach/exercises', label: 'Alle øvelser' },
      { href: '/coach/exercises/mine', label: 'Mine øvelser' },
      { href: '/coach/exercises/templates', label: 'Treningsplaner' },
    ]
  },
  {
    label: 'Varsler',
    icon: 'Bell',
    href: '/coach/alerts',
    badge: 'unreadCount'
  },
  {
    label: 'Innstillinger',
    icon: 'Settings',
    href: '/coach/settings'
  },
];
```

---

## Prioritert Utviklingsplan

### Fase 1: Grunnleggende (Høy prioritet)
1. Dashboard widgets (varsler, turneringer, status)
2. Spilleroversikt med statusikoner
3. Gruppeadministrasjon
4. Treningsplanlegger (alle nivåer)

### Fase 2: Kommunikasjon (Høy prioritet)
1. Beskjed/Chat-modul
2. Planlagt meldingssending
3. Gruppebeskjeder

### Fase 3: Booking & Stats (Medium prioritet)
1. Bookingsystem
2. Stats-verktøy forbedringer
3. Data Golf integrasjon

### Fase 4: Forbedringer (Lav prioritet)
1. Turneringskalender utvidelser
2. Øvelsesbank forbedringer
3. Avanserte analyser

---

## Estimert Arbeidsmengde

| Modul | Kompleksitet | Estimat |
|-------|--------------|---------|
| Dashboard widgets | Medium | 2-3 dager |
| Mine Grupper | Høy | 4-5 dager |
| Booking | Høy | 4-5 dager |
| Stats verktøy | Medium | 2-3 dager |
| Treningsplanlegger | Høy | 5-7 dager |
| Beskjed/Chat | Høy | 5-6 dager |
| Turneringskalender | Medium | 2-3 dager |
| Øvelsesbank | Lav | 1-2 dager |

**Total estimat: 25-34 dager**

---

*Dokument generert: Desember 2025*
*AK Golf Academy - Coach Portal v2.0*
