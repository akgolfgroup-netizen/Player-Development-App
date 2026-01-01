# IUP Master V1 - Komplett API Endpoint Inventar

**Generert**: 22. desember 2025
**Base URL**: `http://localhost:3000`
**API Version**: `/api/v1`

---

## 📋 Innholdsfortegnelse

1. [Auth Module](#1-auth-module)
2. [Players Module](#2-players-module)
3. [Coaches Module](#3-coaches-module)
4. [Goals Module](#4-goals-module)
5. [Achievements Module](#5-achievements-module)
6. [Calendar Module](#6-calendar-module)
7. [Bookings Module](#7-bookings-module)
8. [Archive Module](#8-archive-module)
9. [Sessions Module](#9-sessions-module)
10. [Tests Module](#10-tests-module)
11. [Notes Module](#11-notes-module)
12. [Messages Module](#12-messages-module)
13. [Filters Module](#13-filters-module)
14. [Peer-Comparison Module](#14-peer-comparison-module)
15. [Badges Module](#15-badges-module)
16. [Training-Plan Module](#16-training-plan-module)
17. [Dashboard Module](#17-dashboard-module)
18. [Additional Modules](#additional-modules)

---

## 1. AUTH MODULE

**Path**: `/api/v1/auth`

### Endpoints

| Method | Route | Funksjonalitet | Auth | Request Body | Response |
|--------|-------|-----------------|------|--------------|----------|
| POST | `/register` | Registrer ny bruker og organisasjon | Public | `email`, `password`, `firstName`, `lastName` | `{ accessToken, refreshToken, user }` |
| POST | `/login` | Login med email og passord | Public | `email`, `password` | `{ accessToken, refreshToken, user }` |
| POST | `/refresh` | Refresh access token | Public | `refreshToken` | `{ accessToken, refreshToken, user }` |
| POST | `/logout` | Logout og revoke refresh token | Bearer | `refreshToken` | `{ message }` |
| POST | `/change-password` | Endre passord | Bearer | `currentPassword`, `newPassword` | `{ message }` |
| GET | `/me` | Hent autentisert bruker info | Bearer | - | `{ id, email, firstName, lastName, role, tenantId }` |

---

## 2. PLAYERS MODULE

**Path**: `/api/v1/players`

### Endpoints

| Method | Route | Funksjonalitet | Auth | Query/Body Params | Response |
|--------|-------|-----------------|------|-------------------|----------|
| POST | `/` | Opprett ny spiller | Bearer + Tenant | `firstName`, `lastName`, `email`, `category` | Player object |
| GET | `/` | List spillere med filter og paginering | Bearer + Tenant | `page`, `limit`, `search` | `{ players[], pagination }` |
| GET | `/:id` | Hent spiller by ID | Bearer + Tenant | - | Player details |
| PATCH | `/:id` | Oppdater spiller | Bearer + Tenant | `firstName`, `lastName`, `status` | Updated player |
| DELETE | `/:id` | Slett spiller | Bearer + Tenant | - | `{ message }` |
| GET | `/:id/weekly-summary` | Hent ukentlig sammendrag | Bearer + Tenant | `weekStart` (optional) | `{ training, tests, breakingPoints }` |

---

## 3. COACHES MODULE

**Path**: `/api/v1/coaches`

### Endpoints

| Method | Route | Funksjonalitet | Auth | Query/Body Params | Response |
|--------|-------|-----------------|------|-------------------|----------|
| POST | `/` | Opprett ny coach | Bearer + Tenant | `firstName`, `lastName`, `email` | Coach object |
| GET | `/` | List coaches med filter | Bearer + Tenant | `page`, `limit` | `{ coaches[], pagination }` |
| GET | `/:id` | Hent coach by ID | Bearer + Tenant | - | Coach details |
| PATCH | `/:id` | Oppdater coach | Bearer + Tenant | `firstName`, `lastName`, `status` | Updated coach |
| DELETE | `/:id` | Slett coach | Bearer + Tenant | - | `{ message }` |
| GET | `/:id/availability` | Hent coach tilgjengelighet | Bearer + Tenant | `startDate`, `endDate` | Availability array |
| GET | `/:id/statistics` | Hent coach statistikk | Bearer + Tenant | - | `{ playersCount, sessionsData }` |

---

## 4. GOALS MODULE

**Path**: `/api/v1/goals`

### Endpoints

| Method | Route | Funksjonalitet | Auth | Query/Body Params | Response |
|--------|-------|-----------------|------|-------------------|----------|
| GET | `/` | List mål | Bearer | `status`, `goalType` (optional) | Goals array |
| GET | `/active` | Hent aktive mål | Bearer | - | Active goals array |
| GET | `/completed` | Hent fullførte mål | Bearer | - | Completed goals array |
| GET | `/:id` | Hent enkelt mål | Bearer | - | Goal details |
| POST | `/` | Opprett nytt mål | Bearer | `name`, `description`, `targetValue`, `targetDate` | Created goal |
| PUT | `/:id` | Oppdater mål | Bearer | `name`, `description`, `currentValue`, `status` | Updated goal |
| PATCH | `/:id/progress` | Oppdater målframgang | Bearer | `currentValue` | Updated goal |
| DELETE | `/:id` | Slett mål | Bearer | - | `{ message }` |

---

## 5. ACHIEVEMENTS MODULE

**Path**: `/api/v1/achievements`

### Endpoints

| Method | Route | Funksjonalitet | Auth | Query/Body Params | Response |
|--------|-------|-----------------|------|-------------------|----------|
| GET | `/` | List achievements | Bearer | `category` (optional) | Achievements array |
| GET | `/new` | Hent nye achievements | Bearer | - | New achievements array |
| GET | `/stats` | Hent achievement statistikk | Bearer | - | Stats object |
| GET | `/recent` | Hent nylige achievements | Bearer | `limit` (optional) | Recent achievements |
| GET | `/:id` | Hent enkelt achievement | Bearer | - | Achievement details |
| POST | `/` | Unlock achievement | Bearer | `achievementData` | Unlocked achievement |
| PATCH | `/:id/viewed` | Marker som sett | Bearer | - | Updated achievement |
| POST | `/mark-all-viewed` | Marker alle som sett | Bearer | - | Result object |
| DELETE | `/:id` | Slett achievement | Bearer | - | `{ message }` |

---

## 6. CALENDAR MODULE

**Path**: `/api/v1/calendar`

### Endpoints

| Method | Route | Funksjonalitet | Auth | Query/Body Params | Response |
|--------|-------|-----------------|------|-------------------|----------|
| GET | `/events` | Hent alle events | Bearer | - | Events array |
| GET | `/tournaments` | Hent kun turneringer | Bearer | - | Tournaments array |
| GET | `/my-tournaments` | Hent mine turneringer | Bearer | - | `{ upcoming, past }` |
| GET | `/event/:id` | Hent event detaljer | Bearer | - | Event details |
| POST | `/tournament-result` | Registrer turneringsresultat | Bearer + Coach | `tournamentId`, `playerId`, `position`, `score` | Result object |
| GET | `/ical/:token` | iCal feed export | Public token | - | ICS calendar |
| POST | `/ical/generate-token` | Generer kalender token | Bearer | - | `{ token, subscriptionUrl }` |
| GET | `/google/auth` | Google Calendar auth URL | Bearer | - | `{ authUrl }` |
| GET | `/google/callback` | Google OAuth callback | Public | `code`, `state` | Redirect |
| POST | `/google/sync` | Synk til Google Calendar | Bearer | - | `{ syncedCount }` |
| DELETE | `/google/disconnect` | Koble fra Google | Bearer | - | `{ message }` |
| GET | `/google/status` | Google Calendar status | Bearer | - | `{ connected }` |

---

## 7. BOOKINGS MODULE

**Path**: `/api/v1/bookings`

### Endpoints

| Method | Route | Funksjonalitet | Auth | Query/Body Params | Response |
|--------|-------|-----------------|------|-------------------|----------|
| POST | `/` | Opprett booking | Bearer + Tenant | `eventId`, `playerId` | Booking object |
| GET | `/` | List bookings | Bearer + Tenant | `page`, `limit`, `playerId`, `status`, `dateRange` | `{ bookings[], pagination }` |
| GET | `/:id` | Hent booking detaljer | Bearer + Tenant | - | Booking details |
| PATCH | `/:id` | Oppdater booking | Bearer + Tenant | `status`, `notes` | Updated booking |
| POST | `/:id/confirm` | Bekreft booking | Bearer + Tenant | - | Confirmed booking |
| POST | `/:id/cancel` | Avbryt booking | Bearer + Tenant | `reason` | Cancelled booking |
| POST | `/check-conflicts` | Sjekk konflikter | Bearer + Tenant | `coachId`, `playerId`, `startTime`, `endTime` | Conflicts array |

---

## 8. ARCHIVE MODULE

**Path**: `/api/v1/archive`

### Endpoints

| Method | Route | Funksjonalitet | Auth | Query/Body Params | Response |
|--------|-------|-----------------|------|-------------------|----------|
| GET | `/` | List arkiverte items | Bearer | `entityType` (optional) | Archived items array |
| GET | `/count` | Hent arkiv count | Bearer | - | Count object |
| GET | `/:id` | Hent arkivert item | Bearer | - | Archived item details |
| POST | `/` | Arkiver item | Bearer | `entityType`, `entityId`, `reason` | Archived item |
| POST | `/:id/restore` | Restore item | Bearer | - | Restored item |
| POST | `/bulk-delete` | Bulk delete | Bearer | `archiveIds` | Result object |
| DELETE | `/:id` | Permanent delete | Bearer | - | `{ message }` |

---

## 9. SESSIONS MODULE

**Path**: `/api/v1/training/sessions` eller `/api/v1/sessions`

### Endpoints

| Method | Route | Funksjonalitet | Auth | Query/Body Params | Response |
|--------|-------|-----------------|------|-------------------|----------|
| POST | `/` | Opprett treningssession | Bearer | `playerId` (coach), `duration`, `notes` | Session object |
| GET | `/` | List sessions (coach) | Bearer + Coach | `page`, `limit`, `filters` | `{ sessions[], pagination }` |
| GET | `/my` | Hent mine sessions | Bearer + Player | `page`, `limit` | Player's sessions |
| GET | `/in-progress` | Hent aktive sessions | Bearer + Player | - | In-progress sessions |
| GET | `/technical-cues` | Hent teknikktips | Public | - | Cue strings array |
| GET | `/:id` | Hent session detaljer | Bearer | - | Session details |
| PATCH | `/:id` | Oppdater session | Bearer | `duration`, `notes` | Updated session |
| DELETE | `/:id` | Slett session | Bearer | - | `{ message }` |
| PATCH | `/:id/evaluation` | Oppdater evaluering | Bearer | `evaluationData` | Updated session |
| POST | `/:id/complete` | Fullført session | Bearer | `evaluationData` | Completed session |
| POST | `/:id/auto-complete` | Auto-complete (timeout) | Bearer | - | Completed session |
| GET | `/stats/evaluation` | Evalueringsstatistikk | Bearer | `fromDate`, `toDate`, `playerId` | Stats object |
| POST | `/admin/batch-auto-complete` | Batch auto-complete | Bearer + Coach | `timeoutMinutes` | Count object |

---

## 10. TESTS MODULE

**Path**: `/api/v1/tests`

### Endpoints

| Method | Route | Funksjonalitet | Auth | Query/Body Params | Response |
|--------|-------|-----------------|------|-------------------|----------|
| POST | `/` | Opprett test definisjon | Bearer + Tenant | `name`, `description`, `testType` | Test object |
| GET | `/` | List test definisjoner | Bearer + Tenant | `page`, `limit` | `{ tests[], pagination }` |
| GET | `/:id` | Hent test definisjon | Bearer + Tenant | - | Test details |
| PATCH | `/:id` | Oppdater test | Bearer + Tenant | `name`, `description` | Updated test |
| DELETE | `/:id` | Slett test | Bearer + Tenant | - | `{ message }` |
| POST | `/results` | Registrer testresultat | Bearer + Tenant | `testId`, `playerId`, `score`, `date` | Result object |
| GET | `/results` | List testresultater | Bearer + Tenant | `page`, `limit`, `playerId`, `testId` | `{ results[], pagination }` |
| GET | `/results/:id` | Hent testresultat | Bearer + Tenant | - | Result details |
| PATCH | `/results/:id` | Oppdater testresultat | Bearer + Tenant | `score`, `notes` | Updated result |
| DELETE | `/results/:id` | Slett testresultat | Bearer + Tenant | - | `{ message }` |
| GET | `/progress` | Hent spillerframgang | Bearer + Tenant | `playerId`, `testId` (optional) | Progress data |

---

## 11. NOTES MODULE

**Path**: `/api/v1/notes`

### Endpoints

| Method | Route | Funksjonalitet | Auth | Query/Body Params | Response |
|--------|-------|-----------------|------|-------------------|----------|
| GET | `/` | List notater | Bearer | `category`, `search` (optional) | Notes array |
| GET | `/:id` | Hent enkelt notat | Bearer | - | Note details |
| POST | `/` | Opprett notat | Bearer | `title`, `content`, `category` | Created note |
| PUT | `/:id` | Oppdater notat | Bearer | `title`, `content`, `category` | Updated note |
| DELETE | `/:id` | Slett notat | Bearer | - | `{ message }` |

---

## 12. MESSAGES MODULE

**Path**: `/api/v1/messages`

### Endpoints

| Method | Route | Funksjonalitet | Auth | Query/Body Params | Response |
|--------|-------|-----------------|------|-------------------|----------|
| GET | `/conversations` | List konversasjoner | Bearer | - | `{ conversations[], unreadCount }` |
| POST | `/conversations` | Opprett konversasjon | Bearer | `type`, `participantIds` | Conversation object |
| GET | `/conversations/:conversationId` | Hent konversasjon | Bearer | `limit`, `before` (pagination) | `{ messages[], conversation }` |
| POST | `/conversations/:conversationId/messages` | Send melding | Bearer | `content`, `attachments` (optional) | Message object |
| PATCH | `/messages/:messageId` | Rediger melding | Bearer | `content` | Updated message |
| DELETE | `/messages/:messageId` | Slett melding | Bearer | - | `{ message }` |
| POST | `/conversations/:conversationId/read` | Marker som lest | Bearer | - | `{ markedAsRead }` |
| GET | `/unread-count` | Ulesttelling | Bearer | - | `{ unreadCount }` |

---

## 13. FILTERS MODULE

**Path**: `/api/v1/filters`

### Endpoints

| Method | Route | Funksjonalitet | Auth | Query/Body Params | Response |
|--------|-------|-----------------|------|-------------------|----------|
| POST | `/` | Opprett lagret filter | Bearer + Tenant | `coachId`, `name`, `description`, `filters` | Filter object |
| GET | `/` | List lagrede filtere | Bearer + Tenant | `coachId` | Filters array |
| GET | `/:id` | Hent filter detaljer | Bearer + Tenant | - | Filter details |
| PUT | `/:id` | Oppdater filter | Bearer + Tenant | `name`, `description`, `filters` | Updated filter |
| DELETE | `/:id` | Slett filter | Bearer + Tenant | - | `{ message }` |
| POST | `/apply` | Anvend filterkriterier | Bearer + Tenant | `filters`, `limit`, `offset` | Filtered players array |
| GET | `/suggestions` | Filtersuggeson er | Bearer + Tenant | - | Filter options |

---

## 14. PEER-COMPARISON MODULE

**Path**: `/api/v1/peer-comparison`

### Endpoints

| Method | Route | Funksjonalitet | Auth | Query Params | Response |
|--------|-------|-----------------|------|--------------|----------|
| GET | `/` | Peer comparison | Bearer + Tenant | `playerId`, `testNumber`, `category`, `age`, `handicap` | Comparison data |
| GET | `/multi-level` | Multi-level comparison | Bearer + Tenant | `playerId`, `testNumber` | Cross-category comparison |
| GET | `/peer-group` | Hent peer gruppe | Bearer + Tenant | `playerId`, `category`, `gender`, `age`, `handicap` | Peers array |

---

## 15. BADGES MODULE

**Path**: `/api/v1/badges`

### Endpoints

| Method | Route | Funksjonalitet | Auth | Query/Body Params | Response |
|--------|-------|-----------------|------|-------------------|----------|
| GET | `/definitions` | Alle badge definisjoner | Public | `includeUnavailable` (optional) | `{ badges[], summary }` |
| GET | `/definitions/:category` | Badges by kategori | Public | `category`, `includeUnavailable` | Category badges |
| GET | `/progress` | Badge framgang | Bearer | - | `{ unlocked, progress, stats }` |
| GET | `/recent` | Nylige badges | Bearer | `limit` (optional) | Recent badges array |
| GET | `/leaderboard` | Badge leaderboard | Bearer | `limit` (optional) | Ranked players |
| POST | `/award` | Award badge | Bearer | `badgeId`, `playerId` (optional) | Awarded badge |

---

## 16. TRAINING-PLAN MODULE

**Path**: `/api/v1/training-plan`

### Endpoints

| Method | Route | Funksjonalitet | Auth | Query/Body Params | Response |
|--------|-------|-----------------|------|-------------------|----------|
| GET | `/` | Alle training plans | Bearer + Tenant | - | Plans array |
| POST | `/generate` | Generer 12-måneders plan | Bearer + Tenant | `playerId`, `startDate`, `baselineScore`, `tournaments` | Generated plan |
| GET | `/player/:playerId` | Plan for spiller | Bearer + Tenant | - | Plan details |
| GET | `/:planId/calendar` | Kalendervisning | Bearer + Tenant | `startDate`, `endDate`, `weekNumber` | `{ assignments, summary }` |
| PUT | `/:planId/daily/:date` | Oppdater daglig oppgave | Bearer + Tenant | `sessionTemplateId`, `status`, `notes` | Updated assignment |
| DELETE | `/:planId` | Slett plan | Bearer + Tenant | - | `{ message }` |
| POST | `/:planId/tournaments` | Legg til turnering | Bearer + Tenant | `name`, `startDate`, `endDate`, `importance` | Tournament object |
| GET | `/:planId/full` | Komplett plan (365 dager) | Bearer + Tenant | `includeSessionDetails`, `includeExercises` | Full plan data |
| PUT | `/:planId/accept` | Accept og aktivér plan | Bearer + Tenant | - | Activated plan |
| POST | `/:planId/modification-request` | Ønsk om endring | Bearer + Tenant | `concerns`, `notes`, `urgency` | Request object |
| PUT | `/:planId/reject` | Avslå plan | Bearer + Tenant | `reason`, `willCreateNewIntake` | Rejected status |
| GET | `/:planId/analytics` | Plan analytics | Bearer + Tenant | - | `{ completion, trends }` |
| POST | `/:planId/daily/:date/substitute` | Finn alternativer | Bearer + Tenant | `reason` (optional) | Alternatives array |
| PUT | `/:planId/daily/:date/quick-action` | Quick actions | Bearer + Tenant | `action`, `duration`, `notes` | Updated assignment |
| GET | `/:planId/today` | Dagens oppgave | Bearer + Tenant | - | Today's assignment |
| GET | `/:planId/achievements` | Plan achievements | Bearer + Tenant | - | Earned achievements |
| GET | `/modification-requests` | List requests | Bearer + Coach | `status` (optional) | Requests array |
| PUT | `/modification-requests/:requestId/respond` | Svar på request | Bearer + Coach | `response`, `status` | Updated request |

---

## 17. DASHBOARD MODULE

**Path**: `/api/v1/dashboard`

### Endpoints

| Method | Route | Funksjonalitet | Auth | Query Params | Response |
|--------|-------|-----------------|------|--------------|----------|
| GET | `/` | Dashboard for spiller | Bearer + Tenant | `date` (YYYY-MM-DD, optional) | `{ player, period, sessions, badges, goals }` |
| GET | `/:playerId` | Dashboard (coach view) | Bearer + Coach | `date` (optional) | Player dashboard data |
| GET | `/weekly-stats` | Ukentlig statistikk | Bearer + Player | `week`, `year` (optional) | Weekly stats |
| GET | `/badges` | Alle badges | Bearer + Player | - | Achievements array |
| GET | `/goals` | Mål | Bearer + Player | `status` (optional) | Goals array |

---

## Additional Modules

Følgende moduler er identifisert i kodebasen, men krever nærmere undersøkelse for detaljerte endpoint-spesifikasjoner:

- **Availability** (`/api/v1/availability`)
- **Exercises** (`/api/v1/exercises`)
- **Breaking-Points** (`/api/v1/breaking-points`)
- **Coach-Analytics** (`/api/v1/coach-analytics`)
- **DataGolf** (`/api/v1/datagolf`)
- **Calibration** (`/api/v1/calibration`)
- **Intake** (`/api/v1/intake`)
- **Plan** (`/api/v1/plan`)
- **Season** (`/api/v1/season`)
- **Skoleplan** (`/api/v1/skoleplan`)
- **Export** (`/api/v1/export`)
- **Me** (`/api/v1/me`)

---

## 🔐 Authentication Requirements Summary

### Auth Types

| Type | Beskrivelse | Middleware |
|------|-------------|------------|
| **Public** | Ingen auth required | - |
| **Bearer** | JWT token i Authorization header | `authenticateUser` |
| **Tenant** | Tenant context injected | `injectTenantContext` |
| **Coach** | Require coach/admin role | `requireCoach` |
| **Player** | Require player role | `requirePlayer` |

### Middleware Stack

```javascript
authenticateUser      // JWT validation
injectTenantContext  // Tenant injection
requireCoach         // Coach role check
requirePlayer        // Player role check
```

---

## ❤️ Health Check

| Method | Route | Funksjonalitet | Auth |
|--------|-------|-----------------|------|
| GET | `/health` | Server health check | Public |

---

## 📝 Notater

- Base URL for development: `http://localhost:3000`
- API version prefix: `/api/v1`
- WebSocket støtte: Ja (via `/api/v1/ws`)
- Pagination: Standard er `page=1, limit=20`
- Timestamp format: ISO 8601
- Error format: `{ error: string, message: string, statusCode: number }`

---

**Dokumentasjon generert**: 22. desember 2025
**Kilde**: `/Users/anderskristiansen/Developer/IUP_Master_V1/apps/api/src/api/v1/`
