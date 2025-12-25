# IUP Master V1 - Komplett Funksjonsmatrise

**Generert**: 22. desember 2025
**Plattformer**: Web (Next.js), Mobil (Ionic/Capacitor), API (Fastify)

**Statuskoder**:
- ✅ **Implementert**: Funksjonalitet er fullt fungerende
- ⚠️ **Delvis**: Noen komponenter/endpoints finnes, men ikke komplett
- ❌ **Ikke startet**: Kun placeholder eller mangler helt
- 🚧 **Under utvikling**: Aktiv utvikling pågår

---

## 📋 Innholdsfortegnelse

1. [Auth & Brukeradministrasjon](#auth--brukeradministrasjon)
2. [Dashboard & Oversikt](#dashboard--oversikt)
3. [Treningsplanlegging](#treningsplanlegging)
4. [Treningslogging & Evaluering](#treningslogging--evaluering)
5. [Testing & Vurdering](#testing--vurdering)
6. [Turneringer & Resultater](#turneringer--resultater)
7. [Achievements & Badges](#achievements--badges)
8. [Målsettinger (Goals)](#målsettinger-goals)
9. [Breaking Points & Framgang](#breaking-points--framgang)
10. [Kalender & Booking](#kalender--booking)
11. [Messaging & Kommunikasjon](#messaging--kommunikasjon)
12. [Notater](#notater)
13. [Coach Portal](#coach-portal)
14. [Admin-funksjoner](#admin-funksjoner)
15. [Videoanalyse](#videoanalyse)
16. [Integrasjoner](#integrasjoner)
17. [Skole-integrasjon](#skole-integrasjon)
18. [Eksport/Import](#eksportimport)

---

## 1. AUTH & BRUKERADMINISTRASJON

### 1.1 Registrering & Login

| Feature | Beskrivelse | Web | Mobil | API | Nøkkelfiler |
|---------|-------------|-----|-------|-----|-------------|
| **Brukerregistrering** | Registrer ny bruker + organisasjon | ✅ | ✅ | ✅ | `apps/web/src/features/auth/Login.jsx`<br>`apps/api/src/api/v1/auth/index.ts` |
| **Login** | Email/passord login | ✅ | ✅ | ✅ | `apps/web/src/features/auth/Login.jsx`<br>`apps/api/src/api/v1/auth/service.ts` |
| **Logout** | Sikker utlogging + token revoke | ✅ | ✅ | ✅ | `apps/api/src/api/v1/auth/index.ts` |
| **JWT Refresh** | Automatisk token refresh | ✅ | ✅ | ✅ | `apps/api/src/utils/jwt.ts` |
| **Passordendring** | Endre passord | ✅ | ⚠️ | ✅ | `apps/api/src/api/v1/auth/index.ts` |
| **Glemt passord** | Reset passord via epost | ❌ | ❌ | ❌ | - |
| **2FA** | To-faktor autentisering | ❌ | ❌ | ❌ | - |

### 1.2 Brukeradministrasjon

| Feature | Beskrivelse | Web | Mobil | API | Nøkkelfiler |
|---------|-------------|-----|-------|-----|-------------|
| **Profiladministrasjon** | Rediger profil, avatar | ⚠️ | ⚠️ | ✅ | `apps/web/src/features/profile/`<br>`apps/api/src/api/v1/me/index.ts` |
| **Rollebasert tilgang** | Player/Coach/Admin roller | ✅ | ✅ | ✅ | `apps/api/src/middleware/auth.ts` |
| **Multi-tenancy** | Organisasjonsisolasjon | ✅ | ✅ | ✅ | `apps/api/src/middleware/tenant.ts` |

---

## 2. DASHBOARD & OVERSIKT

### 2.1 Spiller Dashboard

| Feature | Beskrivelse | Web | Mobil | API | Nøkkelfiler |
|---------|-------------|-----|-------|-----|-------------|
| **Hovedoversikt** | Dagens oppgave, badges, mål | ✅ | ✅ | ✅ | `apps/web/src/features/dashboard/AKGolfDashboard.jsx`<br>`apps/api/src/api/v1/dashboard/index.ts` |
| **Ukentlig sammendrag** | Gjennomførte økter, statistikk | ✅ | ✅ | ✅ | `apps/api/src/api/v1/players/index.ts` (weekly-summary) |
| **Periodeoversikt** | Visuell periodisering (E/G/S/T) | ✅ | ⚠️ | ✅ | `apps/web/src/features/dashboard/` |
| **Streak-tracking** | Treningsstreak-visning | ✅ | ✅ | ✅ | Stats i database |
| **Breaking points** | Aktive breaking points | ✅ | ⚠️ | ✅ | `apps/api/src/api/v1/breaking-points/` |

### 2.2 Coach Dashboard

| Feature | Beskrivelse | Web | Mobil | API | Nøkkelfiler |
|---------|-------------|-----|-------|-----|-------------|
| **Coach oversikt** | Spilleroversikt, alerts | ✅ | ❌ | ✅ | `apps/web/src/features/coach-dashboard/CoachDashboard.tsx`<br>`apps/api/src/api/v1/coach-analytics/` |
| **Player alerts** | Varsler om spillere som trenger oppfølging | ✅ | ❌ | ✅ | `apps/web/src/features/coach-dashboard/widgets/CoachPlayerAlerts.tsx` |
| **Ukentlige turneringer** | Kommende turneringer for spillere | ✅ | ❌ | ✅ | `apps/web/src/features/coach-dashboard/widgets/CoachWeeklyTournaments.tsx` |
| **Injury tracker** | Skadeoppfølging | ✅ | ❌ | ✅ | `apps/web/src/features/coach-dashboard/widgets/CoachInjuryTracker.tsx` |

---

## 3. TRENINGSPLANLEGGING

### 3.1 Årlig Treningsplan

| Feature | Beskrivelse | Web | Mobil | API | Nøkkelfiler |
|---------|-------------|-----|-------|-----|-------------|
| **Plan-generering** | AI-generert 12-måneders plan | ✅ | ❌ | ✅ | `apps/web/src/features/annual-plan/`<br>`apps/api/src/api/v1/training-plan/index.ts` |
| **Intake-skjema** | Spillerinntak før plangenerering | ✅ | ⚠️ | ✅ | `apps/api/src/api/v1/intake/` |
| **Periodisering** | E/G/S/T-fordeling | ✅ | ⚠️ | ✅ | Prisma: `Periodization` |
| **Turnerings-scheduling** | Planlegg turneringer i planen | ✅ | ⚠️ | ✅ | `apps/api/src/api/v1/training-plan/` (tournaments) |
| **Topping/Tapering** | Automatisk topping/tapering før turnering | ✅ | ❌ | ✅ | Prisma: `ScheduledTournament` |
| **Plan-godkjenning** | Spiller godkjenner plan | ✅ | ⚠️ | ✅ | `apps/api/src/api/v1/training-plan/:planId/accept` |
| **Endringsforespørsler** | Spiller ber om endringer | ✅ | ⚠️ | ✅ | `apps/api/src/api/v1/training-plan/modification-request` |

### 3.2 Daglig/Ukentlig Plan

| Feature | Beskrivelse | Web | Mobil | API | Nøkkelfiler |
|---------|-------------|-----|-------|-----|-------------|
| **Dagens oppgave** | Vis dagens tildelte økt | ✅ | ✅ | ✅ | `apps/api/src/api/v1/training-plan/:planId/today` |
| **Ukesplan** | Oversikt over uken | ✅ | ✅ | ✅ | `apps/web/src/features/trening-plan/UkensTreningsplanContainer.jsx`<br>`apps/api/src/api/v1/training-plan/:planId/calendar` |
| **Kalendervisning** | Visuell kalender | ✅ | ✅ | ✅ | `apps/api/src/api/v1/training-plan/:planId/calendar` |
| **Økt-substitusjon** | Finn alternative økter | ✅ | ⚠️ | ✅ | `apps/api/src/api/v1/training-plan/:planId/daily/:date/substitute` |
| **Quick actions** | Start/fullfør/skip økt | ✅ | ✅ | ✅ | `apps/api/src/api/v1/training-plan/:planId/daily/:date/quick-action` |

### 3.3 Coach-planlegging

| Feature | Beskrivelse | Web | Mobil | API | Nøkkelfiler |
|---------|-------------|-----|-------|-----|-------------|
| **Planleggingshub** | Coach planleggingsverktøy | ✅ | ❌ | ✅ | `apps/web/src/features/coach-planning/CoachPlanningHub.tsx` |
| **Treningsplan-editor** | Rediger spillerplaner | ✅ | ❌ | ✅ | `apps/web/src/features/coach-training-plan-editor/` |
| **Gruppeplaner** | Planlegg for grupper | ✅ | ❌ | ⚠️ | `apps/web/src/features/coach-groups/` |

---

## 4. TRENINGSLOGGING & EVALUERING

### 4.1 Logg Trening

| Feature | Beskrivelse | Web | Mobil | API | Nøkkelfiler |
|---------|-------------|-----|-------|-----|-------------|
| **Start økt** | Start treningsøkt | ✅ | ✅ | ✅ | `apps/api/src/api/v1/sessions/` POST |
| **Logg økt** | Manuell logging | ✅ | ✅ | ✅ | `apps/web/src/features/trening-plan/LoggTreningContainer.jsx` |
| **Evalueringsskjema** | Fokus, Technical, Energy, Mental | ✅ | ✅ | ✅ | `apps/web/src/features/sessions/SessionReflectionForm.jsx`<br>`apps/api/src/api/v1/sessions/:id/evaluation` |
| **Pre-shot consistency** | Evaluer pre-shot rutine | ✅ | ✅ | ✅ | Del av evalueringsskjema |
| **Tekniske cues** | Forhåndsdefinerte teknikktips | ✅ | ✅ | ✅ | `apps/api/src/api/v1/sessions/technical-cues` |
| **Auto-complete** | Auto-fullfør ved timeout | ✅ | ✅ | ✅ | `apps/api/src/api/v1/sessions/:id/auto-complete` |

### 4.2 Treningsdagbok

| Feature | Beskrivelse | Web | Mobil | API | Nøkkelfiler |
|---------|-------------|-----|-------|-----|-------------|
| **Daglig logg** | Dagbok med refleksjon | ✅ | ⚠️ | ✅ | `apps/web/src/features/trening-plan/TreningsdagbokContainer.jsx`<br>Prisma: `ProgressLog` |
| **Treningshistorikk** | Oversikt over alle økter | ✅ | ✅ | ✅ | `apps/web/src/features/training/Treningsprotokoll.jsx` |
| **Statistikk** | Ukentlig/månedlig statistikk | ✅ | ⚠️ | ✅ | `apps/web/src/features/training/Treningsstatistikk.jsx`<br>Prisma: `WeeklyTrainingStats`, `MonthlyTrainingStats` |

### 4.3 Coach-evaluering

| Feature | Beskrivelse | Web | Mobil | API | Nøkkelfiler |
|---------|-------------|-----|-------|-----|-------------|
| **Økt-evaluering** | Coach evaluerer spillerøkter | ✅ | ❌ | ✅ | `apps/web/src/features/coach-session-evaluations/` |
| **Evalueringsstatistikk** | Aggregerte evalueringer | ✅ | ❌ | ✅ | `apps/api/src/api/v1/sessions/stats/evaluation` |

---

## 5. TESTING & VURDERING

### 5.1 Kategorikrav (20 tester)

| Feature | Beskrivelse | Web | Mobil | API | Nøkkelfiler |
|---------|-------------|-----|-------|-----|-------------|
| **Testprotokoll** | Definer tester (1-20) | ✅ | ⚠️ | ✅ | `apps/web/src/features/tests/Testprotokoll.jsx`<br>`apps/api/src/api/v1/tests/` |
| **Registrer testresultat** | Logg testresultat | ✅ | ✅ | ✅ | `apps/web/src/features/tests/RegistrerTestContainer.jsx`<br>`apps/api/src/api/v1/tests/results` |
| **Testresultater** | Oversikt over resultater | ✅ | ✅ | ✅ | `apps/web/src/features/tests/Testresultater.jsx` |
| **Kategori-krav** | Krav per kategori A-K | ✅ | ✅ | ✅ | `apps/web/src/features/tests/KategoriKravContainer.jsx`<br>Prisma: `CategoryRequirement` |
| **Bestått/ikke bestått** | Automatisk vurdering | ✅ | ✅ | ✅ | Beregnes i API |
| **Peer comparison** | Sammenlign med peers | ✅ | ⚠️ | ✅ | `apps/api/src/api/v1/peer-comparison/` |
| **Test 4 PEI** | Physical Efficiency Index | ✅ | ⚠️ | ✅ | Prisma: `TestResult.pei` |

### 5.2 Klubbhastighet Kalibrering

| Feature | Beskrivelse | Web | Mobil | API | Nøkkelfiler |
|---------|-------------|-----|-------|-----|-------------|
| **Kalibrering** | Registrer klubbhastigheter | ✅ | ⚠️ | ✅ | `apps/web/src/features/innstillinger/KalibreringsContainer.jsx`<br>`apps/api/src/api/v1/calibration/` |
| **Auto-detect breaking points** | Automatisk identifiser breaking points | ✅ | ❌ | ✅ | Prisma: `BreakingPoint.autoDetected` |

### 5.3 Benchmark-økter

| Feature | Beskrivelse | Web | Mobil | API | Nøkkelfiler |
|---------|-------------|-----|-------|-----|-------------|
| **Benchmark (uke 8, 16, 24...)** | Systematiske vurderinger | ⚠️ | ❌ | ✅ | Prisma: `BenchmarkSession` |
| **PDF-rapporter** | Generer vurderingsrapporter | ❌ | ❌ | ⚠️ | `BenchmarkSession.pdfReportUrl` |

---

## 6. TURNERINGER & RESULTATER

### 6.1 Turneringsadministrasjon

| Feature | Beskrivelse | Web | Mobil | API | Nøkkelfiler |
|---------|-------------|-----|-------|-----|-------------|
| **Turneringsoversikt** | Liste over turneringer | ✅ | ✅ | ✅ | `apps/web/src/features/tournaments/`<br>`apps/api/src/api/v1/calendar/tournaments` |
| **Mine turneringer** | Registrerte turneringer | ✅ | ✅ | ✅ | `apps/api/src/api/v1/calendar/my-tournaments` |
| **Turneringsregistrering** | Registrer deltakelse | ✅ | ⚠️ | ✅ | `apps/api/src/api/v1/calendar/` (EventParticipant) |
| **Turneringsdetaljer** | Baneinformasjon, format | ✅ | ✅ | ✅ | Prisma: `Tournament` |

### 6.2 Resultater

| Feature | Beskrivelse | Web | Mobil | API | Nøkkelfiler |
|---------|-------------|-----|-------|-----|-------------|
| **Registrer resultat** | Logg turneringsresultat | ✅ | ⚠️ | ✅ | `apps/api/src/api/v1/calendar/tournament-result` |
| **Strokes gained** | SG-statistikk | ✅ | ⚠️ | ✅ | Prisma: `TournamentResult.strokesGained` |
| **Runde-score** | Score per runde | ✅ | ✅ | ✅ | Prisma: `TournamentResult.roundScores` |
| **Fairways/GIR/Putts** | Detaljstatistikk | ✅ | ⚠️ | ✅ | Prisma: `TournamentResult` felter |
| **Historikk** | Turneringshistorikk | ✅ | ✅ | ✅ | `apps/web/src/features/stats-pages/TurneringsstatistikkContainer.jsx` |

### 6.3 Coach-turneringsadministrasjon

| Feature | Beskrivelse | Web | Mobil | API | Nøkkelfiler |
|---------|-------------|-----|-------|-----|-------------|
| **Coach turneringsoversikt** | Oversikt over spilleres turneringer | ✅ | ❌ | ✅ | `apps/web/src/features/coach-tournaments/` |
| **Athlete tournaments** | Spesifikk spillers turneringer | ✅ | ❌ | ✅ | `apps/web/src/features/coach-athlete-tournaments/` |

---

## 7. ACHIEVEMENTS & BADGES

### 7.1 Achievements

| Feature | Beskrivelse | Web | Mobil | API | Nøkkelfiler |
|---------|-------------|-----|-------|-----|-------------|
| **Achievement-system** | Streak/milestone/skill achievements | ✅ | ✅ | ✅ | `apps/web/src/features/achievements/`<br>`apps/api/src/api/v1/achievements/` |
| **Unlock achievement** | Automatisk unlocking | ✅ | ✅ | ✅ | `apps/api/src/api/v1/achievements/` POST |
| **Nye achievements** | Varsel om nye | ✅ | ✅ | ✅ | `apps/api/src/api/v1/achievements/new` |
| **Achievement-statistikk** | Totaloversikt | ✅ | ✅ | ✅ | `apps/api/src/api/v1/achievements/stats` |

### 7.2 Badge-system (85 hierarkiske badges)

| Feature | Beskrivelse | Web | Mobil | API | Nøkkelfiler |
|---------|-------------|-----|-------|-----|-------------|
| **Badge-grid** | Visuell badge-oversikt | ✅ | ✅ | ✅ | `apps/web/src/components/badges/BadgeGrid.jsx`<br>`apps/api/src/api/v1/badges/` |
| **Badge-definisjoner** | 85 badges (kategori-fremmelse, test-badges) | ✅ | ✅ | ✅ | `apps/api/src/api/v1/badges/definitions` |
| **Badge-framgang** | Framgang mot badges | ✅ | ✅ | ✅ | `apps/api/src/api/v1/badges/progress` |
| **Badge-notifikasjoner** | Varsel når badge oppnås | ✅ | ✅ | ✅ | Prisma: `PlayerBadge.viewedAt` |
| **Leaderboard** | Badge-leaderboard | ✅ | ⚠️ | ✅ | `apps/api/src/api/v1/badges/leaderboard` |
| **Badge-tildeling (coach)** | Coach kan tildele badges | ✅ | ❌ | ✅ | `apps/api/src/api/v1/badges/award` |

---

## 8. MÅLSETTINGER (GOALS)

### 8.1 Personlige Mål

| Feature | Beskrivelse | Web | Mobil | API | Nøkkelfiler |
|---------|-------------|-----|-------|-----|-------------|
| **Opprett mål** | Sett opp mål (score/teknikk/fysisk/mental) | ✅ | ✅ | ✅ | `apps/web/src/features/goals/Målsetninger.jsx`<br>`apps/api/src/api/v1/goals/` |
| **Måltyper** | Score, teknikk, fysisk, mental, konkurranse | ✅ | ✅ | ✅ | Prisma: `Goal.goalType` |
| **Timeframe** | Kort/medium/lang sikt | ✅ | ✅ | ✅ | Prisma: `Goal.timeframe` |
| **Framgangsvisning** | Progress bar + prosent | ✅ | ✅ | ✅ | Beregnes fra `currentValue`/`targetValue` |
| **Milestones** | Delmål | ✅ | ⚠️ | ✅ | Prisma: `Goal.milestones` (JSON) |
| **Oppdater framgang** | Oppdater currentValue | ✅ | ✅ | ✅ | `apps/api/src/api/v1/goals/:id/progress` |
| **Aktive/fullførte mål** | Filter etter status | ✅ | ✅ | ✅ | `apps/api/src/api/v1/goals/active`, `/completed` |
| **Linked goals** | Koble til tester/breaking points | ✅ | ⚠️ | ✅ | Prisma: `PlayerGoal.linkedTestId`, `linkedBreakingPointId` |

---

## 9. BREAKING POINTS & FRAMGANG

### 9.1 Breaking Points

| Feature | Beskrivelse | Web | Mobil | API | Nøkkelfiler |
|---------|-------------|-----|-------|-----|-------------|
| **Identifiser breaking point** | Manuell eller auto fra kalibrering | ✅ | ⚠️ | ✅ | `apps/api/src/api/v1/breaking-points/`<br>Prisma: `BreakingPoint` |
| **Processkategorier** | Rhythm, clubface, swing path, impact, balance | ✅ | ⚠️ | ✅ | Enum i Prisma |
| **Severity-nivåer** | Low/medium/high/critical | ✅ | ⚠️ | ✅ | Prisma: `BreakingPoint.severity` |
| **Øvelsestildeling** | Tildel øvelser til breaking point | ✅ | ❌ | ✅ | Prisma: `BreakingPoint.assignedExerciseIds` |
| **Framgangssporing** | Baseline → target → current | ✅ | ⚠️ | ✅ | Prisma: `BreakingPoint` måleverdier |
| **Løs breaking point** | Marker som løst | ✅ | ⚠️ | ✅ | Prisma: `BreakingPoint.status = resolved` |
| **Suksess-historikk** | Historikk over framgang | ✅ | ❌ | ✅ | Prisma: `BreakingPoint.successHistory` |

### 9.2 Framgang & Utvikling

| Feature | Beskrivelse | Web | Mobil | API | Nøkkelfiler |
|---------|-------------|-----|-------|-----|-------------|
| **Progress dashboard** | Oversikt over framgang | ✅ | ⚠️ | ✅ | `apps/web/src/features/progress/ProgressDashboard.jsx` |
| **Trajectory viewer** | Visuell utviklingskurve | ✅ | ❌ | ✅ | `apps/web/src/features/coach-trajectory-viewer/` |
| **Player overview** | Helhetlig spilleroversikt | ✅ | ⚠️ | ✅ | `apps/web/src/features/player-overview/` |

---

## 10. KALENDER & BOOKING

### 10.1 Kalender

| Feature | Beskrivelse | Web | Mobil | API | Nøkkelfiler |
|---------|-------------|-----|-------|-----|-------------|
| **Kalendervisning** | Dag/uke/måned/år visninger | ✅ | ✅ | ✅ | `apps/web/src/features/calendar/Kalender.jsx`<br>`apps/api/src/api/v1/calendar/events` |
| **Event-typer** | Trening, turnering, samling, møte | ✅ | ✅ | ✅ | Prisma: `Event.eventType` |
| **Turneringsvisning** | Spesialisert turneringsvisning | ✅ | ✅ | ✅ | `apps/web/src/features/calendar/views/TournamentView.jsx` |
| **Session preview** | Forhåndsvis økter | ✅ | ⚠️ | ✅ | `apps/web/src/features/calendar/components/SessionPreviewModal.jsx` |

### 10.2 Booking

| Feature | Beskrivelse | Web | Mobil | API | Nøkkelfiler |
|---------|-------------|-----|-------|-----|-------------|
| **Book trener** | Booking-system for trenere | ✅ | ⚠️ | ✅ | `apps/web/src/features/calendar/BookTrenerContainer.jsx`<br>`apps/api/src/api/v1/bookings/` |
| **Coach availability** | Trenertilgjengelighet | ✅ | ❌ | ✅ | `apps/api/src/api/v1/coaches/:id/availability`<br>`apps/api/src/api/v1/availability/` |
| **Booking-bekreftelse** | Bekreft/avslå bookinger | ✅ | ❌ | ✅ | `apps/api/src/api/v1/bookings/:id/confirm` |
| **Konflikt-sjekk** | Sjekk for bookingkonflikter | ✅ | ❌ | ✅ | `apps/api/src/api/v1/bookings/check-conflicts` |
| **Coach booking-admin** | Coach administrerer bookinger | ✅ | ❌ | ✅ | `apps/web/src/features/coach-booking/` |

### 10.3 Kalenderintegrasjoner

| Feature | Beskrivelse | Web | Mobil | API | Nøkkelfiler |
|---------|-------------|-----|-------|-----|-------------|
| **iCal export** | iCal feed-generering | ✅ | ✅ | ✅ | `apps/api/src/api/v1/calendar/ical/:token` |
| **Google Calendar** | To-veis synk med Google | ✅ | ⚠️ | ✅ | `apps/api/src/api/v1/calendar/google/*` |
| **Apple/Outlook Calendar** | Kalenderintegrasjoner | ⚠️ | ⚠️ | ⚠️ | Prisma: `CalendarIntegration` (struktur finnes) |

---

## 11. MESSAGING & KOMMUNIKASJON

### 11.1 Meldinger

| Feature | Beskrivelse | Web | Mobil | API | Nøkkelfiler |
|---------|-------------|-----|-------|-----|-------------|
| **Conversations** | 1-1 og gruppesamtaler | ✅ | ⚠️ | ✅ | `apps/web/src/features/messaging/`<br>`apps/api/src/api/v1/messages/` |
| **Send melding** | Send tekst + vedlegg | ✅ | ⚠️ | ✅ | `apps/api/src/api/v1/messages/conversations/:id/messages` |
| **Lest-status** | Meldingslesing-tracking | ✅ | ⚠️ | ✅ | Prisma: `MessageRead` |
| **Ulesttelling** | Uleste meldinger | ✅ | ✅ | ✅ | `apps/api/src/api/v1/messages/unread-count` |
| **Rediger/slett melding** | Rediger og slett meldinger | ✅ | ⚠️ | ✅ | `apps/api/src/api/v1/messages/:messageId` PATCH/DELETE |

### 11.2 Chat-grupper

| Feature | Beskrivelse | Web | Mobil | API | Nøkkelfiler |
|---------|-------------|-----|-------|-----|-------------|
| **Chat-grupper** | Team/akademi/coach-player grupper | ✅ | ⚠️ | ✅ | Prisma: `ChatGroup`, `ChatGroupMember`, `ChatMessage` |
| **Gruppe-admin** | Administrer gruppemedlemmer | ⚠️ | ❌ | ⚠️ | Prisma: `ChatGroupMember.role` |
| **Mute/unmute** | Demp varsler | ⚠️ | ⚠️ | ⚠️ | Prisma: `ChatGroup.isMuted` |
| **Replies/threads** | Svar på meldinger | ⚠️ | ❌ | ⚠️ | Prisma: `ChatMessage.replyToId` |

### 11.3 Coach-kommunikasjon

| Feature | Beskrivelse | Web | Mobil | API | Nøkkelfiler |
|---------|-------------|-----|-------|-----|-------------|
| **Fra trener** | Spiller ser meldinger fra trener | ✅ | ⚠️ | ✅ | `apps/web/src/features/kommunikasjon/FraTrenerContainer.jsx` |
| **Coach messages** | Coach sender meldinger | ✅ | ❌ | ✅ | `apps/web/src/features/coach-messages/` |
| **Scheduled messages** | Planlegg fremtidige meldinger | ✅ | ❌ | ⚠️ | `apps/web/src/features/coach-messages/CoachScheduledMessages.tsx` |

### 11.4 Varsler

| Feature | Beskrivelse | Web | Mobil | API | Nøkkelfiler |
|---------|-------------|-----|-------|-----|-------------|
| **Varsler** | Push/email/SMS varsler | ✅ | ✅ | ✅ | `apps/web/src/features/notifications/`<br>`apps/web/src/features/kommunikasjon/VarslerContainer.jsx`<br>Prisma: `Notification` |
| **Varselinnstillinger** | Konfigurerbare varsler | ✅ | ⚠️ | ⚠️ | `apps/web/src/features/innstillinger/VarselinnstillingerContainer.jsx` |
| **Badge-varsler** | Spesialiserte badge-varsler | ✅ | ✅ | ✅ | `apps/web/src/contexts/BadgeNotificationContext.jsx` |

---

## 12. NOTATER

| Feature | Beskrivelse | Web | Mobil | API | Nøkkelfiler |
|---------|-------------|-----|-------|-----|-------------|
| **Opprett notat** | Lag notater med kategorier | ✅ | ⚠️ | ✅ | `apps/web/src/features/notes/`<br>`apps/api/src/api/v1/notes/` |
| **Kategorier** | Organisering i kategorier | ✅ | ⚠️ | ✅ | Prisma: `Note.category` |
| **Tags** | Tag-basert søk | ✅ | ⚠️ | ✅ | Prisma: `Note.tags` |
| **Pin notater** | Fest viktige notater | ✅ | ⚠️ | ✅ | Prisma: `Note.isPinned` |
| **Farge-koding** | Farger på notater | ✅ | ⚠️ | ✅ | Prisma: `Note.color` |
| **Linked entities** | Koble notater til økter/turneringer | ✅ | ❌ | ✅ | Prisma: `Note.linkedEntityType/Id` |
| **Coach notes** | Trenernotater per spiller | ✅ | ❌ | ✅ | `apps/web/src/features/coach-notes/` |

---

## 13. COACH PORTAL

### 13.1 Spilleradministrasjon

| Feature | Beskrivelse | Web | Mobil | API | Nøkkelfiler |
|---------|-------------|-----|-------|-----|-------------|
| **Spillerliste** | Oversikt over alle spillere | ✅ | ❌ | ✅ | `apps/web/src/features/coach-athlete-list/CoachAthleteList.tsx`<br>`apps/api/src/api/v1/players/` |
| **Spillerdetaljer** | Detaljert spillerprofil | ✅ | ❌ | ✅ | `apps/web/src/features/coach-athlete-detail/CoachAthleteDetail.tsx` |
| **Spillerstatus** | Status-oversikt | ✅ | ❌ | ✅ | `apps/web/src/features/coach-athlete-status/` |
| **Filtersystem** | Filtrer spillere | ✅ | ❌ | ✅ | `apps/api/src/api/v1/filters/`<br>`apps/web/src/features/coach/` |
| **Lagrede filtere** | Lagre ofte brukte filtere | ✅ | ❌ | ✅ | `apps/api/src/api/v1/filters/` |

### 13.2 Coach Intelligence

| Feature | Beskrivelse | Web | Mobil | API | Nøkkelfiler |
|---------|-------------|-----|-------|-----|-------------|
| **Coach alerts** | Automatiske varsler | ✅ | ❌ | ✅ | `apps/web/src/features/coach-intelligence/CoachAlertsPage.tsx` |
| **Coach analytics** | Analysedashboard | ✅ | ❌ | ✅ | `apps/api/src/api/v1/coach-analytics/` |
| **Statistikk** | Aggregert spillerstatistikk | ✅ | ❌ | ✅ | `apps/web/src/features/coach-statistics/`<br>`apps/web/src/features/coach-stats/` |

### 13.3 Coach Verktøy

| Feature | Beskrivelse | Web | Mobil | API | Nøkkelfiler |
|---------|-------------|-----|-------|-----|-------------|
| **Proof viewer** | Se spillerbevis | ✅ | ❌ | ✅ | `apps/web/src/features/coach-proof-viewer/` |
| **Øvelsesbibliotek** | Administrer øvelser | ✅ | ❌ | ✅ | `apps/web/src/features/coach-exercises/`<br>`apps/api/src/api/v1/exercises/` |
| **Treningsplan-oversikt** | Oversikt over planer | ✅ | ❌ | ✅ | `apps/web/src/features/coach-training-plan/` |
| **Gruppestyring** | Administrer grupper | ✅ | ❌ | ✅ | `apps/web/src/features/coach-groups/` |

---

## 14. ADMIN-FUNKSJONER

| Feature | Beskrivelse | Web | Mobil | API | Nøkkelfiler |
|---------|-------------|-----|-------|-----|-------------|
| **Coach-administrasjon** | Administrer trenere | ✅ | ❌ | ✅ | `apps/web/src/features/admin-coach-management/`<br>`apps/api/src/api/v1/coaches/` |
| **Tier-administrasjon** | Administrer abonnementsnivåer | ✅ | ❌ | ⚠️ | `apps/web/src/features/admin-tier-management/` |
| **Feature flags** | Slå features på/av | ✅ | ❌ | ⚠️ | `apps/web/src/features/admin-feature-flags/` |
| **System-oversikt** | Systemovervåking | ✅ | ❌ | ⚠️ | `apps/web/src/features/admin-system-overview/` |
| **Eskalering & support** | Support-system | ✅ | ❌ | ⚠️ | `apps/web/src/features/admin-escalation/` |

---

## 15. VIDEOANALYSE

| Feature | Beskrivelse | Web | Mobil | API | Nøkkelfiler |
|---------|-------------|-----|-------|-----|-------------|
| **Video-opplasting** | Last opp svingvideoer | ⚠️ | ⚠️ | ✅ | Prisma: `Media` (struktur finnes)<br>`apps/api/src/api/v1/` (ingen dedikert video-modul ennå) |
| **Video-analyse** | Analyseverktøy | ❌ | ❌ | ❌ | Se `docs/VIDEO_ANALYSIS_PLATFORM_PLAN.md` (planlagt) |
| **Video-sammenligning** | Side-by-side sammenligning | ❌ | ❌ | ❌ | Ikke implementert |
| **Frame-by-frame** | Detaljert analyse | ❌ | ❌ | ❌ | Ikke implementert |
| **AI-analyse** | Automatisk svinganalyse | ❌ | ❌ | ❌ | Ikke implementert |
| **Tegne-verktøy** | Tegn linjer/vinkler | ❌ | ❌ | ❌ | Ikke implementert |

**Status**: 🚧 **Under planlegging** - Se `docs/VIDEO_ANALYSIS_PLATFORM_FULL_WORKPLAN.md`

---

## 16. INTEGRASJONER

### 16.1 DataGolf

| Feature | Beskrivelse | Web | Mobil | API | Nøkkelfiler |
|---------|-------------|-----|-------|-----|-------------|
| **DataGolf-spillere** | Importer pro-spillerdata | ⚠️ | ❌ | ✅ | `apps/api/src/api/v1/datagolf/`<br>Prisma: `DataGolfPlayer` |
| **Tour-gjennomsnitt** | Tour-stats (PGA, European, etc.) | ⚠️ | ❌ | ✅ | Prisma: `DataGolfTourAverage` |
| **Sammenligning** | Sammenlign med pro-spillere | ⚠️ | ❌ | ⚠️ | Se `docs/features/datagolf/` |
| **Live-data** | Live-turneringsdata | ❌ | ❌ | ⚠️ | Planlagt |

**Status**: ⚠️ **Delvis** - Grunnstruktur implementert, begrenset funksjonalitet

### 16.2 Andre integrasjoner

| Feature | Beskrivelse | Web | Mobil | API | Nøkkelfiler |
|---------|-------------|-----|-------|-----|-------------|
| **Google Calendar** | Kalendersynk | ✅ | ⚠️ | ✅ | `apps/api/src/api/v1/calendar/google/*` |
| **iCal feed** | iCal subscription | ✅ | ✅ | ✅ | `apps/api/src/api/v1/calendar/ical/:token` |
| **OAuth** | Google OAuth | ✅ | ⚠️ | ✅ | `apps/api/src/api/v1/auth/` (struktur finnes) |

---

## 17. SKOLE-INTEGRASJON

| Feature | Beskrivelse | Web | Mobil | API | Nøkkelfiler |
|---------|-------------|-----|-------|-----|-------------|
| **Fag** | Registrer skolefag | ✅ | ⚠️ | ✅ | `apps/web/src/features/school/`<br>`apps/api/src/api/v1/skoleplan/`<br>Prisma: `Fag` |
| **Skoletimer** | Timeplan | ✅ | ⚠️ | ✅ | Prisma: `Skoletime` |
| **Oppgaver** | Skoleoppgaver | ✅ | ⚠️ | ✅ | Prisma: `Oppgave` |
| **Frist-varsler** | Varsler for frister | ⚠️ | ⚠️ | ⚠️ | Planned |

**Status**: ✅ **Grunnleggende implementert** - Basis CRUD-operasjoner

---

## 18. EKSPORT/IMPORT

| Feature | Beskrivelse | Web | Mobil | API | Nøkkelfiler |
|---------|-------------|-----|-------|-----|-------------|
| **Eksporter data** | CSV/JSON/PDF eksport | ⚠️ | ❌ | ⚠️ | `apps/api/src/api/v1/export/` (struktur finnes) |
| **PDF-rapporter** | Generere rapporter | ⚠️ | ❌ | ⚠️ | Delvis (benchmark-rapporter) |
| **Importer data** | Bulk-import | ❌ | ❌ | ❌ | Ikke implementert |

---

## 📊 OPPSUMMERING PER PLATTFORM

### Web (Next.js)
- **Totale features**: 61 feature-moduler
- **Implementert**: ~85% av kjernefeatures
- **Delvis**: ~10%
- **Ikke startet**: ~5% (primært videoanalyse, avansert eksport)

### Mobil (Ionic/Capacitor)
- **Totale features**: apps/golfer finnes
- **Implementert**: ~40-50% (primært grunnleggende features)
- **Delvis**: ~30%
- **Ikke startet**: ~20-30% (primært coach-features, admin)

### API (Fastify)
- **Totale moduler**: 30 API-moduler
- **Implementert**: ~90% av kjernefeatures
- **Delvis**: ~8%
- **Ikke startet**: ~2% (videoanalyse-spesifikke endepunkter)

---

## 🎯 PRIORITERTE GAPS

### Høy prioritet (❌ eller ⚠️)

1. **Videoanalyse** - Komplett mangler
2. **Mobil-app paritet** - Mange coach-features mangler
3. **Glemt passord** - Kritisk auth-feature
4. **PDF-rapporter** - Benchmark-rapporter
5. **Avansert messaging** - Threads, gruppe-admin
6. **DataGolf full integrasjon** - Kun grunnstruktur

### Medium prioritet

1. **2FA** - Sikkerhet
2. **Advanced filtering** - Mer omfattende filtere
3. **Bulk operations** - Bulk-import/eksport
4. **Advanced analytics** - Mer detaljert analyse

### Lav prioritet

1. **Apple/Outlook calendar** - Flere kalenderintegrasjoner
2. **Advanced notifications** - SMS, push til foreldre
3. **Multi-language** - i18n

---

**Siste oppdatering**: 22. desember 2025
**Kartlagt av**: Kodebase-analyse + API endpoint inventory + Prisma schema
