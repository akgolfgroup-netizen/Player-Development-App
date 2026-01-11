# Nattarbeid Plan: 00:00 - 05:00

**Dato:** 2024-12-30
**Mål:** Fullføre Sprint 1 + deler av Sprint 2

---

## TIME 1: 00:00 - 01:00 | Notes (Notater)

### Mål: Gjøre Notes fullt funksjonell med API

#### 00:00-00:20: Backend API
- [ ] Opprett `apps/api/src/api/v1/notes/router.ts`
- [ ] Opprett `apps/api/src/api/v1/notes/service.ts`
- [ ] Opprett `apps/api/src/api/v1/notes/types.ts`
- [ ] Prisma schema: Note-modell med tags, mood, pinned, sharedWithCoach

#### 00:20-00:40: Frontend Hooks
- [ ] Opprett `apps/web/src/hooks/useNotes.js`
- [ ] Implementer CRUD operasjoner
- [ ] Koble NotaterContainer til API

#### 00:40-01:00: Testing & Commit
- [ ] Test create/read/update/delete
- [ ] Commit: "feat(notes): add full CRUD with API integration"

---

## TIME 2: 01:00 - 02:00 | Progress (Fremgang)

### Mål: Vise ekte treningsstatistikk

#### 01:00-01:20: Backend Endpoint
- [ ] Opprett `apps/api/src/api/v1/progress/router.ts`
- [ ] Aggreger data fra sessions, tests, goals
- [ ] Beregn streak, completion rate, totaler

#### 01:20-01:40: Frontend Hook & Beregninger
- [ ] Opprett `apps/web/src/hooks/useProgress.js`
- [ ] Implementer trend-beregninger (12 uker)
- [ ] Koble ProgressPage til API

#### 01:40-02:00: Visualisering
- [ ] Forbedre progress bars med ekte data
- [ ] Legg til loading states
- [ ] Commit: "feat(progress): connect to real training data"

---

## TIME 3: 02:00 - 03:00 | Notifications (Varsler)

### Mål: Real-time varslingssystem

#### 02:00-02:20: Backend
- [ ] Opprett `apps/api/src/api/v1/notifications/router.ts`
- [ ] Notification-modell i Prisma
- [ ] Generer varsler fra events (sessions, tests, achievements)

#### 02:20-02:40: Frontend
- [ ] Oppdater `useNotifications.js` med API-kall
- [ ] Implementer mark-as-read
- [ ] Polling for nye varsler (30 sek intervall)

#### 02:40-03:00: Testing & Commit
- [ ] Test varsler vises korrekt
- [ ] Test deep linking til ressurser
- [ ] Commit: "feat(notifications): add notification system with polling"

---

## TIME 4: 03:00 - 04:00 | Innstillinger (Settings)

### Mål: Lagre spillerkalibrering

#### 03:00-03:20: Backend
- [ ] Opprett `apps/api/src/api/v1/settings/router.ts`
- [ ] PlayerSettings-modell (calibration, clubDistances, physicalMetrics)
- [ ] PATCH endpoint for oppdateringer

#### 03:20-03:40: Frontend
- [ ] Oppdater CalibrationSettings med API-kall
- [ ] Legg til validering (min/max verdier)
- [ ] Success/error feedback

#### 03:40-04:00: Testing & Commit
- [ ] Test lagring fungerer
- [ ] Test data laster ved refresh
- [ ] Commit: "feat(settings): persist player calibration data"

---

## TIME 5: 04:00 - 05:00 | Periodeplaner + Polish

### Mål: Fullføre periodeplaner og rydde opp

#### 04:00-04:20: Periodeplaner Backend
- [ ] Opprett `apps/api/src/api/v1/periods/router.ts`
- [ ] Period-modell med phases, goals, weeklyPlan
- [ ] GET/PUT endpoints

#### 04:20-04:40: Periodeplaner Frontend
- [ ] Koble PerioderPage til API
- [ ] Implementer goal completion toggle
- [ ] Lagre endringer

#### 04:40-05:00: Oppsummering
- [ ] Commit alle endringer
- [ ] Push til Railway
- [ ] Oppdater FEATURE_STATUS.md
- [ ] Skriv rapport over hva som ble gjort

---

## Forventet Resultat

| Feature | Før | Etter |
|---------|-----|-------|
| Notes | 85% | ✅ 100% |
| Progress | 40% | ✅ 90% |
| Notifications | 35% | ✅ 85% |
| Innstillinger | 60% | ✅ 95% |
| Periodeplaner | 85% | ✅ 95% |

**5 features oppgradert fra "Delvis" til "Ferdig"**

---

## Commits som vil bli laget

1. `feat(notes): add full CRUD with API integration`
2. `feat(progress): connect to real training data`
3. `feat(notifications): add notification system with polling`
4. `feat(settings): persist player calibration data`
5. `feat(periods): add period plan persistence`
6. `docs: update feature status after sprint 1`

---

## Tekniske Avhengigheter

### Prisma Schema Oppdateringer
```prisma
model Note {
  id            String   @id @default(uuid())
  playerId      String
  title         String
  content       String
  tags          String[] // training, tournament, mental, technique, goals, reflection
  mood          Int?     // 1-5
  isPinned      Boolean  @default(false)
  sharedWithCoach Boolean @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  player        Player   @relation(fields: [playerId], references: [id])
}

model Notification {
  id        String   @id @default(uuid())
  userId    String
  type      String   // session, test, achievement, tournament, coach, system
  title     String
  message   String
  link      String?
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
}

model PlayerSettings {
  id              String @id @default(uuid())
  playerId        String @unique
  calibration     Json?  // { driverSpeed, ballSpeed, launchAngle, spinRate, carryDistance }
  clubDistances   Json?  // { driver: { carry, total }, ... }
  physicalMetrics Json?  // { coreStrength, flexibility, rotationSpeed }
  updatedAt       DateTime @updatedAt
  player          Player @relation(fields: [playerId], references: [id])
}

model Period {
  id          String   @id @default(uuid())
  playerId    String
  name        String   // Off-season, Pre-season, Competition, Transition
  phase       String
  startDate   DateTime
  endDate     DateTime
  weeklyHours Json     // { technical, physical, mental, tournament }
  goals       Json[]   // [{ text, completed }]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  player      Player   @relation(fields: [playerId], references: [id])
}
```

---

## Godkjenning

Bekreft at jeg skal starte dette automatiske arbeidet nå.
