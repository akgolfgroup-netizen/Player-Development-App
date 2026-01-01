# Fullføringsplan: Resterende 30% Features

**Opprettet:** 2024-12-31
**Mål:** Oppgradere alle "Delvis" features til "Ferdig"

---

## Oversikt

| Kategori | Antall features | Estimert tid |
|----------|-----------------|--------------|
| Spiller (Delvis) | 10 | ~15 timer |
| Coach (Delvis) | 13 | ~20 timer |
| Minimal → Ferdig | 2 | ~4 timer |
| Admin | 1 + 4 minimal | ~6 timer |
| **Totalt** | **30 features** | **~45 timer** |

---

## SPRINT 2: Spiller-funksjoner (10 features)

### Dag 1: Video & Media (6 timer)

#### TIME 1-2: video-progress (832 linjer)
- [ ] Koble til `/api/v1/videos/progress` endpoint
- [ ] Implementer video completion tracking
- [ ] Lagre watch history per bruker
- [ ] Commit: `feat(video-progress): add progress tracking with API`

#### TIME 3-4: video-analysis (388 linjer)
- [ ] Koble til `/api/v1/videos/analysis` endpoint
- [ ] Implementer swing analysis annotations
- [ ] Legg til drawing tools for trenere
- [ ] Commit: `feat(video-analysis): add analysis tools with API`

#### TIME 5-6: video-comparison (333 linjer)
- [ ] Koble til eksisterende video API
- [ ] Implementer side-by-side view
- [ ] Synkroniser playback mellom videoer
- [ ] Commit: `feat(video-comparison): add synchronized comparison`

---

### Dag 2: Gamification & Collections (5 timer)

#### TIME 1-2: achievements (241 linjer) + badges (208 linjer)
- [ ] Koble til `/api/v1/achievements` og `/api/v1/badges`
- [ ] Implementer badge progress tracking
- [ ] Legg til achievement unlocking animations
- [ ] Vis earned badges på profil
- [ ] Commit: `feat(gamification): connect achievements and badges to API`

#### TIME 3-4: samlinger (883 linjer)
- [ ] Opprett Collection API endpoint
- [ ] Implementer CRUD for samlinger
- [ ] Legg til drag-and-drop reordering
- [ ] Commit: `feat(samlinger): add collection management with API`

#### TIME 5: bevis (509 linjer)
- [ ] Koble til `/api/v1/proof` endpoint
- [ ] Implementer file upload for bevis
- [ ] Legg til approval workflow
- [ ] Commit: `feat(bevis): add proof submission with API`

---

### Dag 3: Trening & Øvelser (4 timer)

#### TIME 1-2: exercises (743 linjer)
- [ ] Koble til `/api/v1/exercises` endpoint
- [ ] Implementer filter og søk
- [ ] Legg til favoritter-funksjon
- [ ] Commit: `feat(exercises): connect to exercises API with filtering`

#### TIME 3-4: focus-engine (343 linjer)
- [ ] Koble til `/api/v1/focus` endpoint
- [ ] Implementer focus score beregning
- [ ] Vis personlige anbefalinger
- [ ] Commit: `feat(focus-engine): connect to focus API with recommendations`

---

### Dag 4: Diverse (3 timer)

#### TIME 1: coaches/trenerteam (845 linjer)
- [ ] Koble til `/api/v1/coaches` endpoint
- [ ] Vis trener-profiler
- [ ] Implementer coach messaging link
- [ ] Commit: `feat(coaches): connect to coaches API`

#### TIME 2: archive (589 linjer)
- [ ] Koble til `/api/v1/archive` endpoint
- [ ] Implementer arkivering av items
- [ ] Legg til restore-funksjon
- [ ] Commit: `feat(archive): add archive management with API`

#### TIME 3: calendar-oversikt (414 linjer)
- [ ] Koble til `/api/v1/calendar` endpoint
- [ ] Synkroniser med sessions
- [ ] Vis upcoming events
- [ ] Commit: `feat(calendar-oversikt): connect to calendar API`

---

## SPRINT 3: Coach-funksjoner (13 features)

### Dag 5: Coach Dashboard & Stats (5 timer)

#### TIME 1-2: coach-dashboard (712 linjer)
- [ ] Koble til `/api/v1/coach/dashboard` endpoint
- [ ] Vis athlete overview med stats
- [ ] Implementer quick actions
- [ ] Commit: `feat(coach-dashboard): connect to dashboard API`

#### TIME 3-4: coach-statistics (719 linjer)
- [ ] Koble til `/api/v1/coach/statistics` endpoint
- [ ] Aggreger data på tvers av athletes
- [ ] Vis trend-grafer
- [ ] Commit: `feat(coach-statistics): connect to statistics API`

#### TIME 5: coach-settings (779 linjer)
- [ ] Koble til `/api/v1/coach/settings` endpoint
- [ ] Implementer notification preferences
- [ ] Lagre availability schedule
- [ ] Commit: `feat(coach-settings): connect to settings API`

---

### Dag 6: Athlete Management (6 timer)

#### TIME 1-2: coach-athlete-list (353 linjer)
- [ ] Koble til `/api/v1/coach/athletes` endpoint
- [ ] Implementer filtering og sorting
- [ ] Vis athlete status badges
- [ ] Commit: `feat(coach-athlete-list): connect to athletes API`

#### TIME 3-4: coach-athlete-detail (312 linjer)
- [ ] Koble til `/api/v1/coach/athletes/:id` endpoint
- [ ] Vis full athlete profil
- [ ] Implementer inline editing
- [ ] Commit: `feat(coach-athlete-detail): connect to athlete detail API`

#### TIME 5-6: coach-athlete-status (639 linjer)
- [ ] Koble til `/api/v1/coach/athletes/:id/status` endpoint
- [ ] Vis current training status
- [ ] Implementer status updates
- [ ] Commit: `feat(coach-athlete-status): connect to status API`

---

### Dag 7: Training Plan Management (5 timer)

#### TIME 1-2: coach-training-plan (327 linjer)
- [ ] Koble til `/api/v1/training-plan` endpoint
- [ ] Vis plan overview for athletes
- [ ] Implementer plan approval
- [ ] Commit: `feat(coach-training-plan): connect to training plan API`

#### TIME 3-4: coach-training-plan-editor (559 linjer)
- [ ] Koble til `/api/v1/training-plan` PUT endpoint
- [ ] Implementer drag-and-drop editing
- [ ] Legg til template selection
- [ ] Commit: `feat(coach-training-plan-editor): add plan editing with API`

#### TIME 5: coach-planning (556 linjer)
- [ ] Koble til `/api/v1/coach/planning` endpoint
- [ ] Vis weekly planning view
- [ ] Implementer bulk scheduling
- [ ] Commit: `feat(coach-planning): connect to planning API`

---

### Dag 8: Communication & Intelligence (4 timer)

#### TIME 1-2: coach-notes (337 linjer)
- [ ] Koble til `/api/v1/notes` endpoint (coach view)
- [ ] Vis notater delt med coach
- [ ] Implementer coach-only notes
- [ ] Commit: `feat(coach-notes): connect to notes API with coach view`

#### TIME 3: coach-session-evaluations (438 linjer)
- [ ] Koble til `/api/v1/sessions/evaluations` endpoint
- [ ] Vis pending evaluations
- [ ] Implementer evaluation submission
- [ ] Commit: `feat(coach-session-evaluations): connect to evaluations API`

#### TIME 4: coach-intelligence (448 linjer)
- [ ] Koble til `/api/v1/coach/intelligence` endpoint
- [ ] Vis AI-genererte insights
- [ ] Implementer action recommendations
- [ ] Commit: `feat(coach-intelligence): connect to intelligence API`

---

### Dag 9: Player View & Admin (4 timer)

#### TIME 1: coach-player (382 linjer)
- [ ] Koble til `/api/v1/coach/athletes/:id/view` endpoint
- [ ] Vis player perspective
- [ ] Implementer impersonation mode
- [ ] Commit: `feat(coach-player): connect to player view API`

#### TIME 2-4: Admin Features (admin-tier-management + minimal)
- [ ] Koble admin-tier-management til API
- [ ] Implementer admin-system-overview med stats
- [ ] Koble admin-coach-management til API
- [ ] Commit: `feat(admin): connect admin features to API`

---

## SPRINT 4: Polish & Testing (2 dager)

### Dag 10: Testing & Bug Fixes
- [ ] End-to-end testing av alle oppgraderte features
- [ ] Fix edge cases og error handling
- [ ] Performance optimalisering
- [ ] Commit: `fix: address issues from testing`

### Dag 11: Documentation & Deployment
- [ ] Oppdater FEATURE_STATUS.md
- [ ] Skriv release notes
- [ ] Deploy til production
- [ ] Commit: `docs: final feature status update`

---

## Prioritert Rekkefølge (Etter Brukerverdi)

### Høy Prioritet (Gjør først)
1. **achievements + badges** - Gamification driver engagement
2. **coach-dashboard** - Viktig for trenere
3. **exercises** - Brukes daglig
4. **coach-athlete-detail** - Kritisk for coaching

### Medium Prioritet
5. **video-progress** - Tracking for videoer
6. **samlinger** - Organiseringsfunksjon
7. **coach-training-plan** - Plan management
8. **focus-engine** - Personlige anbefalinger

### Lavere Prioritet (Kan vente)
9. **video-analysis** - Avansert funksjon
10. **video-comparison** - Spesialisert bruk
11. **coach-intelligence** - AI features
12. **admin features** - Intern bruk

---

## Tekniske Avhengigheter

### API Endpoints som må eksistere/utvides:
```
/api/v1/achievements (GET, POST badge progress)
/api/v1/badges (GET, PUT earned status)
/api/v1/collections (CRUD)
/api/v1/proof (POST upload, GET list, PUT approve)
/api/v1/coach/dashboard (GET aggregated stats)
/api/v1/coach/statistics (GET with date range)
/api/v1/coach/athletes (GET list, filters)
/api/v1/coach/athletes/:id (GET full profile)
/api/v1/coach/athletes/:id/status (GET/PUT)
/api/v1/coach/planning (GET/PUT weekly)
/api/v1/coach/intelligence (GET AI insights)
```

### Prisma Schema Additions:
```prisma
model Collection {
  id        String   @id @default(uuid())
  userId    String
  name      String
  items     Json[]
  createdAt DateTime @default(now())
}

model VideoProgress {
  id         String   @id @default(uuid())
  userId     String
  videoId    String
  progress   Float    // 0-100%
  completed  Boolean
  watchedAt  DateTime
}
```

---

## Ressurser & Estimater

| Ressurs | Estimat |
|---------|---------|
| Total utviklingstid | ~45 timer |
| Antall commits | ~25 |
| API endpoints | ~15 nye/utvidede |
| Database migrations | ~3 |

---

## Godkjenning

Bekreft hvilke sprints du vil starte med.
