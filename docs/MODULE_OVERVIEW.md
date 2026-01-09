# IUP Master V1 - Modul Oversikt

> Fullstendig dokumentasjon av alle funksjoner i spiller- og trenermodulene

---

## Innholdsfortegnelse

1. [Spillermodul (Player)](#spillermodul-player)
   - [Layout & Navigasjon](#layout--navigasjon)
   - [Data Hooks](#data-hooks)
   - [Årsplan-funksjon](#årsplan-funksjon)
   - [Statistikk-funksjon](#statistikk-funksjon)
   - [Innsikt-funksjon](#innsikt-funksjon)
   - [Andre spillerfunksjoner](#andre-spillerfunksjoner)
2. [Trenermodul (Coach)](#trenermodul-coach)
   - [Layout & Navigasjon](#layout--navigasjon-1)
   - [Data Hooks](#data-hooks-1)
   - [Dashboard](#dashboard)
   - [Utøverstyring](#utøverstyring)
   - [Treningsplanlegging](#treningsplanlegging)
   - [Årsplanlegging](#årsplanlegging)
   - [Booking & Kalender](#booking--kalender)
   - [Meldinger](#meldinger)
   - [Øvelses- & Øktstyring](#øvelses---øktstyring)
   - [Gruppestyring](#gruppestyring)
   - [Statistikk & Analyse](#statistikk--analyse)
   - [Turneringsstyring](#turneringsstyring)
   - [Video & Bevis](#video--bevis)
   - [AI-trener](#ai-trener)
3. [Backend API-tjenester](#backend-api-tjenester)
4. [Delt funksjonalitet](#delt-funksjonalitet)
5. [Oppsummering](#oppsummering)

---

## Spillermodul (Player)

### Layout & Navigasjon

| Fil | Funksjon | Beskrivelse |
|-----|----------|-------------|
| `components/layout/PlayerAppShell.tsx` | Hovedlayout | Wrapper for alle spillersider, mobilresponsiv, henter uleste meldinger hvert 5. minutt |
| `components/layout/PlayerSidebarV3.tsx` | Sidemeny | Vertikal navigasjon med 5 områder (hub-basert struktur) |
| `config/player-navigation-v4.ts` | Navigasjonskonfig | 62 route-redirects, fargepaletter, tabs-konfigurasjon |

#### Navigasjonsfunksjoner

```typescript
getAreaByPath(path: string): NavArea | undefined
// Finn navigasjonsområde basert på URL-sti

getAreaById(id: string): NavArea | undefined
// Finn navigasjonsområde basert på ID

getAllNavItems(): NavItem[]
// Hent flat liste over alle navigasjonselementer

getAreaTabs(areaId: string): Tab[]
// Hent tabs for spesifikt område
```

#### 5 Navigasjonsområder

| Område | Farge | Innhold |
|--------|-------|---------|
| **Oversikt** | Standard | Dashboard, hjem |
| **Plan** | Amber | Kalender, mål, turneringer |
| **Trening** | Grønn | Økter, øvelser, testing |
| **Analyse** | Blå | Statistikk, sammenligninger, rapporter |
| **Mer** | Lilla | Profil, innstillinger, ressurser |

---

### Data Hooks

| Hook | Fil | Funksjon |
|------|-----|----------|
| `useDashboardData` | `data/hooks/useDashboardData.ts` | Henter dashborddata (økter + KPI-statistikk) |
| `useStats` | `data/hooks/useStats.ts` | Henter omfattende statistikk (6 KPIer, beste runder, handicap) |
| `useGoals` | `data/hooks/useGoals.ts` | Henter mål og progresjon |
| `useCalendarSessions` | `data/hooks/useCalendarSessions.ts` | Henter treningsøkter for kalendervisning |

#### useDashboardData

```typescript
useDashboardData(playerId: string): HookResult<DashboardData>
```

**Returnerer:**
- Dagens økter (opptil 5)
- Ukentlig statistikk (treningstid, fullførte økter, målprogresjon)
- Fallback-data for offline/feil-tilstander

#### useStats

```typescript
useStats(playerId: string): HookResult<StatsData>
```

**Returnerer:**
- 6 KPIer: treningstid, økter, putting-snitt, distanse, progresjon, GIR
- Oversiktsstatistikk: beste runde, snitt, handicap, fairway %, sand saves
- 3 nyeste økter med type/varighet

#### useGoals

```typescript
useGoals(playerId: string): HookResult<GoalsData>
```

**Returnerer:**
- Mål-array (kortsiktige og langsiktige mål med nåværende/mål-verdier)
- Målstatistikk (aktive, fullførte, gjennomsnittlig progresjon %)
- Målstatus-mapping (aktiv, pauset, fullført)

---

### Årsplan-funksjon

**Katalog:** `features/player-annual-plan/`

#### Komponenter

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| `PlayerAnnualPlanWizard` | `PlayerAnnualPlanWizard.tsx` | Hovedveiviser for å lage årsplaner |
| `PlayerAnnualPlanOverview` | `PlayerAnnualPlanOverview.tsx` | Se og administrer eksisterende årsplaner |
| `Step1_BasicInfo` | `Step1_BasicInfo.tsx` | Steg 1: Grunnleggende planinformasjon |
| `Step2_PeriodSelection` | `Step2_PeriodSelection.tsx` | Steg 2: Velg treningsperioder |
| `Step3_PeriodDetails` | `Step3_PeriodDetails.tsx` | Steg 3: Konfigurer periodedetaljer |
| `Step4_GoalsAndFocus` | `Step4_GoalsAndFocus.tsx` | Steg 4: Sett mål og fokusområder |
| `Step5_Review` | `Step5_Review.tsx` | Steg 5: Gjennomgang og bekreftelse |

#### Hooks

```typescript
useAnnualPlanWizard(): WizardState
// Administrer veiviser-tilstand (6 steg)

usePlayerAnnualPlan(): AnnualPlanOperations
// Opprett/oppdater årsplaner
```

#### Utilities

| Fil | Funksjon |
|-----|----------|
| `periodDefaults.ts` | Standard periodekonfigurasjoner |
| `planExport.ts` | Eksporter planer til PDF/Excel |

---

### Statistikk-funksjon

**Katalog:** `features/player-stats/`

| Side/Komponent | Fil | Beskrivelse |
|----------------|-----|-------------|
| `PlayerStatsPage` | `PlayerStatsPage.tsx` | Hovedhub for statistikk |
| `StatistikkHub` | `StatistikkHub.tsx` | Statistikkoversikt |
| `StrokesGainedPage` | `StrokesGainedPage.tsx` | Strokes Gained-analyse |
| `StatusProgressPage` | `StatusProgressPage.tsx` | Status og målprogresjon |
| `BenchmarkPage` | `BenchmarkPage.tsx` | Sammenlign med jevnaldrende/proffer |
| `TestResultsPage` | `TestResultsPage.tsx` | Testresultater og historikk |
| `TestComparisonWidget` | `TestComparisonWidget.tsx` | Sammenlign testresultater |
| `TestDetailPage` | `TestDetailPage.tsx` | Detaljer for enkelttest |
| `CategoryProgressionWidget` | `CategoryProgressionWidget.tsx` | Progresjonssporing per kategori |
| `CoachNotesPanel` | `CoachNotesPanel.tsx` | Trenerfeedback og notater |

---

### Innsikt-funksjon

**Katalog:** `features/player-insights/`

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| `PlayerInsightsPage` | `PlayerInsightsPage.tsx` | Hovedhub for innsikt |
| `SkillDNAView` | `SkillDNAView.tsx` | Ferdighetsnedbrytning og analyse |
| `SGJourneyView` | `SGJourneyView.tsx` | Strokes Gained-reise over tid |
| `BountyBoardView` | `BountyBoardView.tsx` | Prestasjoner og belønningstavle |

---

### Andre spillerfunksjoner

#### Oversikt

**Katalog:** `features/player-overview/`

| Komponent | Beskrivelse |
|-----------|-------------|
| `PlayerOverviewPage.tsx` | Spillerens dashboard-oversikt |

#### Onboarding

**Katalog:** `features/onboarding/`

| Komponent | Beskrivelse |
|-----------|-------------|
| `PlayerOnboardingPage.tsx` | Spillerregistrering og profilopprettelse |

#### Booking

**Katalog:** `features/bookings/`

| Komponent | Beskrivelse |
|-----------|-------------|
| `PlayerBookingPage.tsx` | Bestill coachingøkter |

#### Kalender

**Katalog:** `features/calendar/`

| Komponent/Hook | Beskrivelse |
|----------------|-------------|
| `PlayerCalendarPage.tsx` | Spillerkalendervisning |
| `useCalendarEvents()` | Hent kalenderhendelser |
| `useCalendarState()` | Administrer kalender UI-tilstand |
| `useAKFormula()` | AK treningsformel-beregninger |
| `useSessionPlanner()` | Planlegg treningsøkter |

#### Video

**Katalog:** `features/coach-videos/`

| Komponent/Utility | Beskrivelse |
|-------------------|-------------|
| `PlayerVideoFeed.jsx` | Videofeed for spillere |
| `useVideoPlayer.js` | Hook for videoavspilling |
| `hlsPlayer.js` | HLS-strømningsspiller |

#### Delte spillerkomponenter

| Fil | Komponent | Beskrivelse |
|-----|-----------|-------------|
| `components/shadcn/golf/player-stat-card.tsx` | `PlayerStatCard` | Kort som viser spillerstatistikk |
| `components/tier/widgets/PlayerHeader.jsx` | `PlayerHeader` | Spillerprofil header-widget |
| `components/ui/ak-player-intake-v1.jsx` | `AKPlayerIntake` | Spillerregistreringsskjema (v1) |
| `components/widgets/ProPlayerComparison.tsx` | `ProPlayerComparison` | Sammenlign med profesjonelle |

---

## Trenermodul (Coach)

### Layout & Navigasjon

| Fil | Funksjon | Beskrivelse |
|-----|----------|-------------|
| `components/layout/CoachAppShell.tsx` | Hovedlayout | Wrapper for trenersider, henter varsler |
| `components/layout/CoachSidebarV3.tsx` | Sidemeny | Flat navigasjon med 5 hovedpunkter |
| `config/coach-navigation.ts` | Navigasjonskonfig | 10 hovednavigasjonspunkter |

#### 10 Navigasjonspunkter

| # | Navn | Beskrivelse |
|---|------|-------------|
| 1 | **Oversikt** | Dashboard |
| 2 | **Spillere** | Alfabetisk liste over utøvere |
| 3 | **Planlegging** | Planleggingsverktøy |
| 4 | **Varsler** | Varsler og notifikasjoner |
| 5 | **Kalender** | Kalender & Booking |
| 6 | **Meldinger** | Meldingssystem |
| 7 | **Bibliotek** | Øvelser & Maler |
| 8 | **Innsikt** | Statistikk & Analyse |
| 9 | **Turneringer** | Turneringsadministrasjon |
| 10 | **Mer** | Grupper, Status, Evalueringer, Innstillinger |

#### Eksporterte konstanter

```typescript
coachNavigationConfig: NavItem[]      // Hovednavigasjon
coachQuickActions                     // Hurtigaksjoner (Ny melding, Ny økt)
coachMobileNavItems                   // Mobilnavigasjon (første 6 elementer)
coachAlertTypes                       // 6 varseltyper
athleteDetailActions                  // 5 utøverdetalj-aksjoner
exerciseCategories                    // 7 øvelseskategorier
difficultyLevels                      // 3 vanskelighetsgrader
bookingStatuses                       // Bookingstatus-definisjoner
messageCategories                     // Meldingskategorityper
athleteStatusOptions                  // Klar, Begrenset, Skadet
modificationRequestStatuses           // Forespørselstatus-sporing
modificationRequestPriority           // Prioritetsnivåer
```

---

### Data Hooks

#### useCoachPlayer

```typescript
useCoachPlayer(playerId: string): HookResult<CoachPlayerData>
```

**Returnerer:**
- Spillerinfo (id, navn, e-post, tier, registreringsdato)
- Statistikk (4-6 KPI-kort)
- Videoer (opptil 5 nyeste med status)
- Økter (opptil 5 nyeste)
- Mål (opptil 3 aktive)

**Funksjoner:**
- API-responstype-mapping
- Videostatus-normalisering (pending, reviewed, needs_followup)
- Fallback-data for demo/feil-tilstander

---

### Dashboard

**Katalog:** `features/coach-dashboard/`

#### Hovedkomponenter

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| `CoachDashboard` | `CoachDashboard.tsx` | Hoveddashboard-komponent |
| `CoachDashboardContainer` | `CoachDashboardContainer.tsx` | Container/wrapper-komponent |

#### Widgets

| Widget | Fil | Beskrivelse |
|--------|-----|-------------|
| `CoachPlayerAlerts` | `CoachPlayerAlerts.tsx` | Varsler om spillere |
| `ActiveSessionWidget` | `ActiveSessionWidget.tsx` | Nåværende/aktive økter |
| `SessionStatsWidget` | `SessionStatsWidget.tsx` | Øktstatistikk |
| `WeeklySummaryWidget` | `WeeklySummaryWidget.tsx` | Ukentlig oppsummering |
| `CoachInjuryTracker` | `CoachInjuryTracker.tsx` | Skade-/sykdomssporing |
| `CoachWeeklyTournaments` | `CoachWeeklyTournaments.tsx` | Turneringskalender |

#### Batch-operasjoner

| Modal | Fil | Beskrivelse |
|-------|-----|-------------|
| `BatchNoteModal` | `BatchNoteModal.tsx` | Legg til notater for flere utøvere |
| `BatchPlanModal` | `BatchPlanModal.tsx` | Opprett/oppdater planer for flere |
| `BatchSessionModal` | `BatchSessionModal.tsx` | Batch økt-operasjoner |
| `BatchStatusModal` | `BatchStatusModal.tsx` | Oppdater status for flere utøvere |

---

### Utøverstyring

#### Utøverliste

**Katalog:** `features/coach-athlete-list/`

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| `CoachAthleteList` | `CoachAthleteList.tsx` | Liste over utøvere (alfabetisk, nøytral) |
| `CoachAthleteListContainer` | `CoachAthleteListContainer.tsx` | Container-komponent |
| `BatchOperationsPanel` | `BatchOperationsPanel.tsx` | Batch-operasjonsverktøylinje |

#### Utøverdetalj

**Katalog:** `features/coach-athlete-detail/`

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| `CoachAthleteDetail` | `CoachAthleteDetail.tsx` | Enkelutøver-detaljhub (5 hovedaksjoner) |
| `CoachAthleteDetailContainer` | `CoachAthleteDetailContainer.tsx` | Container-komponent |
| `CategoryProgressionCard` | `CategoryProgressionCard.tsx` | Kategoriprogresjon-widget |

#### Utøverstatus

**Katalog:** `features/coach-athlete-status/`

| Komponent | Beskrivelse |
|-----------|-------------|
| `CoachAthleteStatus.tsx` | Administrer utøverens klar/skadet-status |

#### Utøverprogresjon

**Katalog:** `features/coach-athlete-progression/`

| Komponent | Beskrivelse |
|-----------|-------------|
| `CategoryProgressionPage.tsx` | Spor utøverens kategoriprogresjon |

#### Utøverturneringer

**Katalog:** `features/coach-athlete-tournaments/`

| Komponent | Beskrivelse |
|-----------|-------------|
| `CoachAthleteTournaments.tsx` | Se utøverdeltakelse i turneringer |

#### Utøverhub

**Katalog:** `features/coach-athletes/`

| Komponent | Beskrivelse |
|-----------|-------------|
| `CoachAthleteHub.tsx` | Utøveroversikt-hub |

---

### Treningsplanlegging

#### Treningsplan

**Katalog:** `features/coach-training-plan/`

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| `CoachTrainingPlan` | `CoachTrainingPlan.tsx` | Vis utøvers treningsplan |
| `CoachTrainingPlanContainer` | `CoachTrainingPlanContainer.tsx` | Container-komponent |

#### Treningsplaneditor

**Katalog:** `features/coach-training-plan-editor/`

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| `CoachTrainingPlanEditor` | `CoachTrainingPlanEditor.tsx` | Rediger treningsplan |
| `CoachTrainingPlanEditorContainer` | `CoachTrainingPlanEditorContainer.tsx` | Container-komponent |
| `AIPlanSuggestions` | `AIPlanSuggestions.tsx` | AI-drevne planforslag |

---

### Årsplanlegging

**Katalog:** `features/coach-annual-plan/`

#### Hovedkomponenter

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| `AnnualPlanGenerator` | `AnnualPlanGenerator.tsx` | Generer årsplaner |
| `AnnualPlanGeneratorComplete` | `AnnualPlanGeneratorComplete.tsx` | Komplett versjon |
| `AnnualPlanGeneratorWithDnD` | `AnnualPlanGeneratorWithDnD.tsx` | Drag-and-drop versjon |

#### Underkomponenter

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| `PeriodDetailPanel` | `PeriodDetailPanel.tsx` | Rediger periodedetaljer |
| `SessionLibrary` | `SessionLibrary.tsx` | Øktmalbibliotek |
| `TemplateSelectorModal` | `TemplateSelectorModal.tsx` | Velg planmaler |

---

### Booking & Kalender

**Katalog:** `features/coach-booking/`

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| `CoachBookingCalendar` | `CoachBookingCalendar.tsx` | Coachingavtalekalender |
| `CoachBookingRequests` | `CoachBookingRequests.tsx` | Se bookingforespørsler |
| `CoachBookingSettings` | `CoachBookingSettings.tsx` | Konfigurer tilgjengelighet |
| `CoachAvailabilityWidget` | `CoachAvailabilityWidget.tsx` | Tilgjengelighetsvisning |
| `BookingCreateDialog` | `BookingCreateDialog.tsx` | Opprett ny booking |

**Katalog:** `features/calendar/`

| Komponent | Beskrivelse |
|-----------|-------------|
| `CoachCalendarPage.tsx` | Trenerkalenderintegrasjon |

---

### Meldinger

**Katalog:** `features/coach-messages/`

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| `CoachMessageList` | `CoachMessageList.tsx` | Se sendte meldinger |
| `CoachMessageCompose` | `CoachMessageCompose.tsx` | Skriv ny melding |
| `CoachScheduledMessages` | `CoachScheduledMessages.tsx` | Administrer planlagte meldinger |

---

### Øvelses- & Øktstyring

**Katalog:** `features/coach-exercises/`

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| `CoachExerciseLibrary` | `CoachExerciseLibrary.tsx` | Bla gjennom alle øvelser |
| `CoachMyExercises` | `CoachMyExercises.tsx` | Personlig øvelsesbibliotek |
| `CoachExerciseTemplates` | `CoachExerciseTemplates.tsx` | Øktmaler |
| `CoachSessionTemplateEditor` | `CoachSessionTemplateEditor.tsx` | Opprett/rediger maler |

#### 7 Øvelseskategorier

| Kategori | Beskrivelse |
|----------|-------------|
| Putting | Putting-øvelser |
| Driving | Driving/utslagsøvelser |
| Iron | Jernøvelser |
| Wedge | Wedge-øvelser |
| Bunker | Bunkerøvelser |
| Mental | Mental trening |
| Fitness | Fysisk trening |

#### 3 Vanskelighetsgrader

- Lett
- Medium
- Vanskelig

---

### Gruppestyring

**Katalog:** `features/coach-groups/`

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| `CoachGroupList` | `CoachGroupList.tsx` | Liste over grupper |
| `CoachGroupCreate` | `CoachGroupCreate.tsx` | Opprett ny gruppe |
| `CoachGroupDetail` | `CoachGroupDetail.tsx` | Gruppedetaljer |
| `CoachGroupPlan` | `CoachGroupPlan.tsx` | Gruppens treningsplan |

---

### Statistikk & Analyse

**Katalog:** `features/coach-stats/`

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| `CoachStatsOverview` | `CoachStatsOverview.tsx` | Lagstatistikkoversikt |
| `CoachStatsProgress` | `CoachStatsProgress.tsx` | Lagprogresjonanalyse |
| `CoachStatsRegression` | `CoachStatsRegression.tsx` | Regresjonsanalyse |
| `CoachDataGolf` | `CoachDataGolf.tsx` | DataGolf-integrasjon |
| `PlayerComparisonTool` | `PlayerComparisonTool.tsx` | Sammenlign utøvere |
| `TeamAnalyticsDashboard` | `TeamAnalyticsDashboard.tsx` | Omfattende analyse |

**Katalog:** `features/coach-statistics/`

| Komponent | Beskrivelse |
|-----------|-------------|
| `CoachStatistics.tsx` | Statistikkside |

---

### Turneringsstyring

**Katalog:** `features/coach-tournaments/`

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| `CoachTournamentCalendar` | `CoachTournamentCalendar.tsx` | Turneringskalender |
| `CoachTournamentPlayers` | `CoachTournamentPlayers.tsx` | Spillere i turneringer |
| `CoachTournamentResults` | `CoachTournamentResults.tsx` | Turneringsresultater |

---

### Video & Bevis

#### Video Dashboard

**Katalog:** `features/coach-videos/`

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| `CoachVideosDashboard` | `CoachVideosDashboard.jsx` | Video-gjennomgangsdashboard |
| `PendingReviewQueue` | `PendingReviewQueue.tsx` | Videoer som venter på gjennomgang |
| `PlayerVideoFeed` | `PlayerVideoFeed.jsx` | Utøvervideofeed |
| `ReferenceLibrary` | `ReferenceLibrary.jsx` | Referansevideobibliotek |
| `ReferenceVideoCard` | `ReferenceVideoCard.jsx` | Referansevideokort |

#### Bevis-visning

**Katalog:** `features/coach-proof-viewer/`

| Komponent | Beskrivelse |
|-----------|-------------|
| `CoachProofViewer.tsx` | Se treningsvideoer/bevis |

#### Trajektorie-visning

**Katalog:** `features/coach-trajectory-viewer/`

| Komponent | Beskrivelse |
|-----------|-------------|
| `CoachTrajectoryViewer.tsx` | Historisk progresjonsvisning |

---

### AI-trener

**Katalog:** `features/ai-coach/`

| Komponent/Fil | Type | Beskrivelse |
|---------------|------|-------------|
| `AICoachPanel.tsx` | Komponent | AI-assistentgrensesnitt |
| `AICoachButton.tsx` | Komponent | AI-trener veksleknapp |
| `AICoachGuide.tsx` | Komponent | AI-retningslinjer |
| `AICoachContext.tsx` | Context | AI-tilstandshåndtering |
| `useAITriggers.ts` | Hook | Detekter AI-utløsere |

---

### Andre trenerfunksjoner

#### Hub-sider

**Katalog:** `features/coach-hub-pages/`

| Komponent | Beskrivelse |
|-----------|-------------|
| `CoachAnalyseHub.tsx` | Analysehub |
| `CoachMerHub.tsx` | "Mer"-hub |
| `CoachPlanHub.tsx` | Planleggingshub |
| `CoachSpillereHub.tsx` | Utøverhub |

#### Planlegging

**Katalog:** `features/coach-planning/`

| Komponent | Beskrivelse |
|-----------|-------------|
| `CoachPlanningHub.tsx` | Planleggingsoversikt |

#### Varsler

**Katalog:** `features/coach-intelligence/`

| Komponent | Beskrivelse |
|-----------|-------------|
| `CoachAlertsPage.tsx` | Varselhåndterings-dashboard |

**Katalog:** `features/coach/alerts/`

| Komponent | Beskrivelse |
|-----------|-------------|
| `CoachAlerts.tsx` | Varsler |

#### Øktevalueringer

**Katalog:** `features/coach-session-evaluations/`

| Komponent | Beskrivelse |
|-----------|-------------|
| `CoachSessionEvaluations.tsx` | Øktfeedback/evalueringer |

#### Innstillinger

**Katalog:** `features/coach-settings/`

| Komponent | Beskrivelse |
|-----------|-------------|
| `CoachSettings.tsx` | Trenerkontoinnstillinger |

#### Treneradministrasjon

**Katalog:** `features/admin-coach-management/`

| Komponent | Beskrivelse |
|-----------|-------------|
| `AdminCoachManagement.tsx` | Admin trenerstyring |
| `CoachCreateModal.tsx` | Opprett trener |
| `CoachEditModal.tsx` | Rediger trener |
| `CoachDetailView.tsx` | Trenerdetaljer |

**Katalog:** `features/coaches/`

| Komponent | Beskrivelse |
|-----------|-------------|
| `Trenerteam.jsx` | Trenerteam-liste |
| `TrenerteamContainer.jsx` | Container-komponent |

#### Mobil

**Katalog:** `mobile/`

| Komponent | Beskrivelse |
|-----------|-------------|
| `MobileCoachDashboard.jsx` | Mobil dashboard |
| `MobileCoachAthleteDetail.jsx` | Mobil utøverdetalj |
| `MobileCoachSessionsView.jsx` | Mobil øktvisning |
| `MobileCoachTestResults.jsx` | Mobil testresultater |

---

## Backend API-tjenester

### Spiller-API

**Lokasjon:** `apps/api/src/api/v1/players/`

#### PlayerService

```typescript
class PlayerService {
  createPlayer(tenantId: string, input: CreatePlayerInput): Promise<PlayerWithRelations>
  getPlayer(playerId: string, tenantId: string): Promise<PlayerWithRelations>
  listPlayers(tenantId: string, query: ListPlayersQuery): Promise<PlayerListResponse>
  updatePlayer(playerId: string, tenantId: string, input: UpdatePlayerInput): Promise<PlayerWithRelations>
  deletePlayer(playerId: string, tenantId: string): Promise<void>
  getWeeklySummary(playerId: string, tenantId: string): Promise<WeeklySummary>
}
```

#### Årsplan-ruter

| Fil | Beskrivelse |
|-----|-------------|
| `annual-plan-routes.ts` | Spiller årsplan CRUD-endepunkter |
| `annual-plan-service.ts` | Årsplan opprettelse, oppdateringer og administrasjon |

#### Skjemaer

| Skjema | Beskrivelse |
|--------|-------------|
| `CreatePlayerInput` | Opprett spiller-validering |
| `UpdatePlayerInput` | Oppdater spiller-validering |
| `ListPlayersQuery` | Liste spillere-spørring |
| `PlayerOnboardingInput` | Onboarding-validering |

---

### Trener-API

**Lokasjon:** `apps/api/src/api/v1/coaches/`

#### CoachService

```typescript
class CoachService {
  createCoach(tenantId: string, input: CreateCoachInput): Promise<Coach>
  getCoach(coachId: string, tenantId: string): Promise<CoachWithRelations>
  listCoaches(tenantId: string, query: ListCoachesQuery): Promise<CoachListResponse>
  updateCoach(coachId: string, tenantId: string, input: UpdateCoachInput): Promise<Coach>
  deleteCoach(coachId: string, tenantId: string): Promise<void>
  getCoachPlayers(coachId: string, tenantId: string): Promise<CoachPlayerView[]>
  getCoachStatistics(coachId: string, tenantId: string): Promise<CoachStatistics>
  getCoachAlerts(coachId: string, tenantId: string): Promise<CoachAlert[]>
}
```

#### Ruter

| Fil | Beskrivelse |
|-----|-------------|
| `routes.ts` | Trenerstyring-endepunkter (CRUD, varsler, statistikk) |
| `annual-plan-routes.ts` | Trener årsplan-administrasjon for utøvere |
| `annual-plan-service.ts` | Planopprettelse, distribusjon og oppdateringer |

---

### Trenerspesifikk API

**Lokasjon:** `apps/api/src/api/v1/coach/`

**Funksjonalitet:**
- Metoder for trener-utøver-relasjoner
- Øktstyring for trenere
- Planvalidering og utrulling

---

### Treneranalyse

**Lokasjon:** `apps/api/src/domain/coach-analytics/`

#### CoachAnalyticsService

**Formål:** Lagbasert analyse og innsikt

**Nøkkelmetrikker:**
- Lagprogresjons-aggregering
- Utøverytelsestrender
- Øktfullføringsrater
- Treningsoverholdelse-sporing

---

### Spillerinnsikt

**Lokasjon:** `apps/api/src/api/v1/player-insights/`

| Tjeneste | Fil | Beskrivelse |
|----------|-----|-------------|
| Bounty Service | `bounty-service.ts` | Prestasjons-/belønningsberegninger |
| SG Journey | `sg-journey.ts` | Strokes Gained-reisesporing |
| Skill DNA | `skill-dna.ts` | Ferdighets-DNA-analyse |

---

### AI-trenertjeneste

**Lokasjon:** `apps/api/src/services/ai/`

#### AICoachService

**Formål:** AI-drevne treningsanbefalinger

**Nøkkelfunksjoner:**
- Treningsplanforslag
- Ytelsesanalyse
- Personaliserte anbefalinger

---

## Delt funksjonalitet

### Vanlige Hooks

| Hook | Fil | Beskrivelse | Brukes av |
|------|-----|-------------|-----------|
| `useProPlayerSearch` | `hooks/useProPlayerSearch.ts` | Søk i profesjonell spillerdatabase | Trenerstatistikk, sammenligninger |
| `useProBenchmark` | `hooks/useProBenchmark.ts` | Benchmark mot profesjonelle | Spiller/trener statistikk |
| `usePeerComparison` | `hooks/usePeerComparison.ts` | Sammenlign med jevnaldrende utøvere | Spillerinnsikt, treneranalyse |
| `useTestResults` | `hooks/useTestResults.ts` | Administrer testdata og resultater | Spiller/trener testsider |
| `useTrainingAnalytics` | `hooks/useTrainingAnalytics.ts` | Treningsanalyse og rapportering | Treningsanalysesider |

### Vanlige tjenester

| Tjeneste | Fil | Beskrivelse |
|----------|-----|-------------|
| API Client | `services/api.ts` | Kjerne API-klient med `coachesAPI` og `playersAPI` |
| Annual Plan API | `services/annualPlanApi.ts` | Årsplan API-wrapper |
| AI Service | `services/aiService.ts` | AI-trener tjenesteintegrasjon |
| PDF Export | `services/pdfExport.ts` | PDF-eksportfunksjonalitet |

### Mock Data

| Fil | Beskrivelse |
|-----|-------------|
| `lib/coachMockData.ts` | Utviklingsmockdata for trenere (utøvere, planer, økter, varsler) |

---

## Integrasjonsmønstre

### Autentiseringskontekst

```typescript
// Brukes i begge AppShells
useAuth(): { user, logout }
eventClient.init(): void  // Initialiser analyse med brukerrolle ('player' eller 'coach')
```

### Dataflytt-mønster

```
1. Komponent → Forespør data via Hook/Service
2. Hook/Service → Gjør API-kall (med auth-token)
3. API → Spør database via Prisma
4. Respons → Mappes til frontend-typer
5. Fallback → Mock-data ved feil/offline
```

### Navnekonvensjoner

| Type | Konvensjon | Eksempel |
|------|------------|----------|
| Filer | kebab-case | `coach-dashboard.tsx`, `player-stats.tsx` |
| Komponenter | PascalCase | `CoachDashboard`, `PlayerStatsPage` |
| Hooks | useXxx | `useCoachPlayer`, `usePlayerAnnualPlan` |
| Tjenester | xxxService | `PlayerService`, `CoachService` |
| Ruter | lowercase-path | `/coach/athletes`, `/player/stats` |

### Mobilstøtte

- Responsiv breakpoint: 768px
- Mobil bunnnavigasjon: Første 5-6 elementer
- Mobilspesifikke komponenter i `/mobile/`-katalogen
- Skip-to-content tilgjengelighetsfunksjon

---

## Oppsummering

| Kategori | Antall |
|----------|--------|
| Spillerkomponenter | 25+ |
| Trenerkomponenter | 40+ |
| Delte komponenter | 10+ |
| Custom hooks | 40+ |
| API-tjenester | 6 hovedklasser |
| Spillernavigasjonsområder | 5 |
| Trenernavigasjonselementer | 10 |
| Route-redirects | 62 |

---

*Dokumentasjon generert: 2026-01-09*
