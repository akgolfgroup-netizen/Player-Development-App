# Nåværende Status - Brukerroller og Moduler

> Analyse av eksisterende implementering

---

## 1. Autentisering og roller

### Roller i systemet

Tre roller er definert i `auth/schema.ts`:

```typescript
role: z.enum(['admin', 'coach', 'player']).default('admin')
```

### Registreringsflyt

Ved registrering (`auth/service.ts`):

1. **Alltid opprettet:**
   - `Tenant` (organisasjon)
   - `User` (autentisering)

2. **Rollebasert:**
   - Hvis `player` → Oppretter `Player` entity
   - Hvis `coach` → Oppretter `Coach` entity
   - Hvis `admin` → Kun User (ingen ekstra entity)

### Login-respons

Ved login returneres:
```typescript
{
  accessToken,
  refreshToken,
  user: {
    id, email, firstName, lastName,
    role,           // 'admin' | 'coach' | 'player'
    tenantId,
    onboardingComplete  // Kun for player
  }
}
```

Token inneholder også:
- `playerId` (hvis player)
- `coachId` (hvis coach)

---

## 2. Database-modeller

### User (autentisering)
```prisma
model User {
  id            String
  tenantId      String
  email         String    @unique
  passwordHash  String
  firstName     String
  lastName      String
  role          String    // 'admin' | 'coach' | 'player'
  isActive      Boolean
  lastLoginAt   DateTime?
}
```

### Player (utøver-data)
```prisma
model Player {
  id                  String
  tenantId            String
  userId              String?   // Optional kobling til User
  firstName           String
  lastName            String
  email               String
  dateOfBirth         DateTime
  gender              String
  category            String    // 'A', 'B', 'C', etc.
  handicap            Float?
  onboardingComplete  Boolean   @default(false)

  // Relasjoner
  trainingSessions    TrainingSession[]
  events              Event[]
  tests               Test[]
  goals               Goal[]
  // ... mange flere
}
```

### Coach (trener-data)
```prisma
model Coach {
  id               String
  tenantId         String
  userId           String?   // Optional kobling til User
  firstName        String
  lastName         String
  email            String
  specializations  String[]

  // Relasjoner
  players          CoachPlayerAssignment[]  // Tildelte spillere
  sessions         TrainingSession[]        // Sessions de har laget
}
```

### Coach-Player tilordning
```prisma
model CoachPlayerAssignment {
  id        String
  coachId   String
  playerId  String
  role      String    // 'primary' | 'secondary'
  startDate DateTime
  endDate   DateTime?

  coach     Coach
  player    Player
}
```

---

## 3. Frontend-arkitektur

### AppShells per rolle

| Rolle | AppShell | Navigasjon |
|-------|----------|------------|
| Player | `PlayerAppShell.tsx` | 5 hovedpunkter |
| Coach | `CoachAppShell.tsx` | Coach-spesifikk |
| Admin | `AdminAppShell.tsx` | Admin-spesifikk |

### PlayerAppShell navigasjon
```
Dashboard → /dashboard
Trening   → /trening
Utvikling → /utvikling
Plan      → /plan
Mer       → /mer (innstillinger, profil, etc.)
```

### CoachAppShell navigasjon
```
Dashboard → /coach/dashboard
Spillere  → /coach/athletes
Analyse   → /coach/analyse
Plan      → /coach/plan
Mer       → /coach/settings
```

---

## 4. Eksisterende Features

### Player-features (mange!)

| Kategori | Features |
|----------|----------|
| Dashboard | DashboardContainer, DashboardHub, DashboardV5 |
| Trening | LoggTrening, Treningsdagbok, SessionDetail |
| Tester | TestprotokollContainer, RegistrerTest |
| Mål | MaalsetningerContainer, GoalsPage |
| Kalender | CalendarPage, DailyTrainingCalendar |
| Turneringer | TurneringskalenderContainer |
| Analyse | AnalyseHub, AnalyseStatistikkHub |
| Video | VideoLibraryPage, VideoAnalysisPage |
| Profil | BrukerprofilContainer |
| Årsplan | AarsplanContainer, PlayerAnnualPlanWizard |

### Coach-features (omfattende!)

| Kategori | Features |
|----------|----------|
| Dashboard | CoachDashboard |
| Spillere | CoachAthleteHub, CoachAthleteList, CoachAthleteDetail |
| Grupper | CoachGroupList, CoachGroupDetail, CoachGroupCreate |
| Statistikk | CoachStatsOverview, CoachStatsProgress, TeamAnalytics |
| Planlegging | CoachPlanningHub, CoachTrainingPlan, CoachAnnualPlan |
| Meldinger | CoachMessageList, CoachMessageCompose |
| Øvelser | CoachExerciseLibrary, CoachSessionTemplateEditor |
| Booking | CoachBookingCalendar, CoachBookingRequests |
| Turneringer | CoachTournamentCalendar, CoachTournamentResults |
| Video | CoachVideosDashboard, ReferenceLibrary |
| Samlinger | SamlingList, SamlingDetail, SamlingCreate |
| Innstillinger | CoachSettings |

### Admin-features

| Kategori | Features |
|----------|----------|
| Oversikt | AdminSystemOverview |
| Trenere | AdminCoachManagement |
| Brukere | PendingApprovalsPage, InvitationsPage |
| Konfig | CategoryManagementPage, TestConfigPage |
| Logger | AuditLogPage, ErrorLogPage |
| Tier | AdminTierManagement, TierFeaturesPage |
| Betaling | PaymentDashboard, SubscriptionAnalytics |

---

## 5. Onboarding-status

### Eksisterende komponenter
- `OnboardingPage.tsx` - Generell onboarding
- `PlayerOnboardingPage.tsx` - Spiller-spesifikk

### Database-felt
```prisma
model Player {
  onboardingComplete  Boolean  @default(false)
}
```

### I auth-flow
Ved login sjekkes `player.onboardingComplete` og returneres i response.

### Mangler
- Ingen `onboardingComplete` for Coach
- Ingen tvungen onboarding-redirect
- Onboarding-stegene er ikke fullstendig definert

---

## 6. Routing-struktur

### Player-routes (fra App.jsx)
```
/dashboard
/trening/*
/utvikling/*
/plan/*
/analyse/*
/tester/*
/turneringer/*
/maal/*
/kalender/*
/profil
/innstillinger/*
```

### Coach-routes
```
/coach/dashboard
/coach/athletes/*
/coach/groups/*
/coach/stats/*
/coach/plan/*
/coach/messages/*
/coach/exercises/*
/coach/booking/*
/coach/tournaments/*
/coach/videos/*
/coach/settings
```

### Admin-routes
```
/admin/overview
/admin/coaches/*
/admin/users/*
/admin/config/*
/admin/logs/*
/admin/tiers/*
/admin/billing/*
```

---

## 7. Gaps og mangler

### Kritiske mangler

| Gap | Beskrivelse | Prioritet |
|-----|-------------|-----------|
| Coach-Player kobling | Ikke eksplisitt implementert i UI | Høy |
| Invitasjonsflyt | Ikke fullstendig | Høy |
| Onboarding-tvang | Ingen redirect til onboarding | Medium |
| Rollebytte | Kan ikke bytte rolle | Lav |

### UX-mangler

| Gap | Beskrivelse |
|-----|-------------|
| Tomme tilstander | Mange sider mangler "empty state" |
| Første gangs bruk | Ingen veiledning for nye brukere |
| Coach-spiller visning | Coach ser ikke spillerens perspektiv |
| Mobil-opplevelse | Begrenset for coach |

### Tekniske mangler

| Gap | Beskrivelse |
|-----|-------------|
| Tilgangskontroll | Ikke konsekvent på API-nivå |
| Rolle-guard | ProtectedRoute sjekker ikke rolle |
| Data-isolasjon | Spillere kan se andre spilleres data (samme tenant) |

---

## 8. Arkitektur-diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Login → AuthContext → Rolle-sjekk                              │
│                │                                                 │
│                ├── role === 'player'                            │
│                │      └── PlayerAppShell                        │
│                │            └── Player features                 │
│                │                                                 │
│                ├── role === 'coach'                             │
│                │      └── CoachAppShell                         │
│                │            └── Coach features                  │
│                │                                                 │
│                └── role === 'admin'                             │
│                       └── AdminAppShell                         │
│                             └── Admin features                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                          BACKEND                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  JWT Token inneholder:                                           │
│    - userId                                                      │
│    - tenantId                                                    │
│    - role ('admin' | 'coach' | 'player')                        │
│    - playerId (hvis player)                                     │
│    - coachId (hvis coach)                                       │
│                                                                  │
│  API-tilgang:                                                    │
│    - Alle i samme tenant kan se hverandres data                 │
│    - Ingen eksplisitt rolle-sjekk per endpoint                  │
│    - CoachPlayerAssignment ikke brukt for tilgang               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         DATABASE                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Tenant (organisasjon)                                           │
│    ├── User[] (autentisering)                                   │
│    ├── Player[] (utøvere)                                       │
│    ├── Coach[] (trenere)                                        │
│    └── CoachPlayerAssignment[] (koblinger)                      │
│                                                                  │
│  Alle data er tenant-isolert:                                   │
│    - TrainingSession.tenantId                                   │
│    - Event.tenantId                                             │
│    - Test.tenantId                                              │
│    - etc.                                                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9. Neste steg

### Må avklares
1. Hvordan skal coach-player kobling fungere?
2. Hvilke steg skal onboarding ha?
3. Hvordan skal invitasjoner fungere?

### Må implementeres
1. Rolle-basert API-tilgang
2. Onboarding-redirect
3. Coach-player visnings-kobling
4. Forbedret tomme tilstander
