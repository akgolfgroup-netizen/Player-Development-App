# Funksjonsplan per Side - IUP Golf App
> **Formål:** Oversikt over alle funksjoner og deres plassering
> **Sist oppdatert:** 3. januar 2026

---

## Status-forklaring

| Symbol | Betydning |
|--------|-----------|
| ✅ | Ferdig implementert |
| 🔨 | Under arbeid |
| 📋 | Planlagt |
| ❌ | Ikke startet |
| 🆕 | Ny funksjon |
| ⚠️ | Trenger review |

---

# SPILLER-MODUL

## 1. Dashboard (`/`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Velkommen-kort | DashboardHeader | ✅ | - | |
| Dagens treningsplan | TodaySessionCard | ✅ | - | |
| Kommende økter | UpcomingSessions | ✅ | - | |
| Strokes Gained widget | StrokesGainedWidget | ✅ | - | |
| Aktivitetsfeed | ActivityFeed | ✅ | - | |
| Hurtighandlinger | QuickActions | ✅ | - | |
| Værwidget | WeatherWidget | ✅ | - | |
| Badge-progresjon | BadgeProgressWidget | 📋 | Lav | |

---

## 2. Min utvikling

### 2.1 Oversikt (`/utvikling`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Kategori-status | CategoryStatusCard | | | |
| Bruddpunkt-liste | BreakpointsList | | | |
| Progresjonsgraf | ProgressGraph | | | |
| Neste mål | NextGoalCard | | | |

### 2.2 Breaking Points (`/utvikling/breaking-points`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Bruddpunkt-oversikt | BreakpointsOverview | | | |
| Per domene | DomainBreakpoints | | | |
| Prioritert liste | PrioritizedList | | | |
| Anbefalte øvelser | RecommendedExercises | | | |

### 2.3 Kategori-fremgang (`/utvikling/kategori`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Nåværende kategori | CurrentCategory | | | |
| Krav for opprykk | PromotionRequirements | | | |
| Historikk | CategoryHistory | | | |

### 2.4 Benchmark-historie (`/utvikling/benchmark`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Benchmark-tidslinje | BenchmarkTimeline | | | |
| Sammenligning | BenchmarkComparison | | | |

---

## 3. Trening

### 3.1 Dagens plan (`/trening/dagens`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Dagens økter | TodaySessions | | | |
| Økt-detaljer | SessionDetails | | | |
| Start økt | StartSessionButton | | | |
| Hopp over | SkipSessionButton | | | |

### 3.2 Ukens plan (`/trening/ukens`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Ukevisning | WeekView | | | |
| Dag-kolonner | DayColumns | | | |
| Drag & drop | DragDropSession | | | |

### 3.3 Alle økter (`/sessions`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Økt-liste | SessionsList | ✅ | - | |
| Filtrering | SessionFilters | ✅ | - | |
| Søk | SessionSearch | ✅ | - | |
| Økt-kort | SessionCard | ✅ | - | |

### 3.4 Treningsdagbok (`/trening/dagbok`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Dagbok-visning | TrainingDiary | | | |
| Kalender-nav | DiaryCalendar | | | |
| Dagnotater | DayNotes | | | |

### 3.5 Logg trening (`/trening/logg`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Logg-skjema | LogTrainingForm | | | |
| Øvelsesvalg | ExerciseSelector | | | |
| Notater | TrainingNotes | | | |
| Humør/energi | MoodEnergyInput | | | |

### 3.6 Evalueringer (`/evaluering`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Evaluering-liste | EvaluationList | | | |
| Ny evaluering | NewEvaluation | | | |
| Coach-feedback | CoachFeedback | | | |

### 3.7 Øvelsesbank (`/ovelsesbibliotek`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Øvelse-liste | ExerciseLibrary | ✅ | - | |
| Domene-filter | DomainFilter | ✅ | - | |
| L-fase filter | LPhaseFilter | ✅ | - | |
| Øvelse-detalj | ExerciseDetail | ✅ | - | |
| Favoritter | FavoriteExercises | 📋 | Lav | |

---

## 4. Kalender

### 4.1 Ukeplan (`/kalender?view=week`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Uke-grid | WeekGrid | | | |
| Time-slots | TimeSlots | | | |
| Hendelse-kort | EventCard | | | |

### 4.2 Månedsoversikt (`/kalender?view=month`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Måned-grid | MonthGrid | | | |
| Dag-celler | DayCells | | | |
| Hendelse-dots | EventDots | | | |

### 4.3 Book trener (`/kalender/booking`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Trener-valg | CoachSelector | | | |
| Ledig tid | AvailableSlots | | | |
| Booking-skjema | BookingForm | | | |
| Bekreftelse | BookingConfirmation | | | |

---

## 5. Planlegger

### 5.1 Årsplan (`/aarsplan`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Årshjul | AnnualWheel | ✅ | - | |
| Periode-blokker | PeriodBlocks | ✅ | - | |
| Turneringer | TournamentMarkers | ✅ | - | |
| Benchmark-uker | BenchmarkWeeks | ✅ | - | |

### 5.2 Opprett årsplan (`/aarsplan/ny`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Wizard-steg | PlanWizard | | | |
| Turneringsvalg | TournamentSelector | | | |
| Periode-fordeling | PeriodDistribution | | | |
| Generering | GeneratePlan | | | |

### 5.3 Periodisering (`/aarsplan/perioder`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Periode-liste | PeriodList | | | |
| Periode-detalj | PeriodDetail | | | |
| Domene-fordeling | DomainDistribution | | | |

### 5.4 Periodeplaner (`/periodeplaner`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Aktiv periode | ActivePeriod | | | |
| Kommende | UpcomingPeriods | | | |
| Fokusområder | PeriodFocus | | | |

### 5.5 Turneringsplan (`/turneringer/planlegger`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Turneringsliste | TournamentList | | | |
| A/B/C prioritering | TournamentPriority | | | |
| Forberedelse | TournamentPrep | | | |

### 5.6 Fokusområder (`/aarsplan/fokus`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Fokus-liste | FocusAreasList | | | |
| Prioritering | FocusPriority | | | |

---

## 6. Testing

### 6.1 Testprotokoll (`/testprotokoll`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| 20 tester oversikt | TestProtocol | ✅ | - | |
| Kategori-gruppering | TestCategories | ✅ | - | |
| Status-indikatorer | TestStatus | ✅ | - | |
| Start test | StartTestButton | ✅ | - | |

### 6.2 Mine resultater (`/testresultater`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Resultat-liste | TestResultsList | ✅ | - | |
| Historikk-graf | ResultsGraph | ✅ | - | |
| Sammenligning | ResultsComparison | | | |

### 6.3 Kategori-krav (`/testing/krav`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Krav-tabell | RequirementsTable | | | |
| Din status | YourStatus | | | |
| Gap-analyse | GapAnalysis | | | |

### 6.4 Registrer test (`/testing/registrer`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Test-valg | TestSelector | | | |
| Resultat-input | ResultInput | | | |
| Validering | ResultValidation | | | |
| Lagre | SaveResult | | | |

---

## 7. Turneringer

### 7.1 Kalender (`/turneringskalender`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Kalender-visning | TournamentCalendar | ✅ | - | |
| Filter (type) | TournamentFilter | ✅ | - | |
| Turnering-kort | TournamentCard | ✅ | - | |

### 7.2 Mine turneringer (`/mine-turneringer`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Påmeldte | RegisteredTournaments | | | |
| Kommende | UpcomingTournaments | | | |
| Historikk | TournamentHistory | | | |

### 7.3 Resultater (`/turneringer/resultater`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Resultat-liste | TournamentResults | ✅ | - | |
| Statistikk | TournamentStats | | | |
| Sammenligning | ResultsComparison | | | |

### 7.4 Registrer resultat (`/turneringer/registrer`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Turnering-valg | TournamentSelector | ✅ | - | |
| Score-input | ScoreInput | ✅ | - | |
| Runde-detaljer | RoundDetails | | | |

---

## 8. Statistikk

### 8.1 Statistikk-hub (`/statistikk`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Tab-navigasjon | StatsTabs | ✅ | - | |
| Oversikt-kort | StatsOverview | ✅ | - | |

### 8.2 Strokes Gained (`/statistikk?tab=strokes-gained`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Total SG | TotalSGCard | ✅ | - | |
| Per kategori | SGByCategory | ✅ | - | |
| Trend-graf | SGTrendGraph | ✅ | - | |
| PGA sammenligning | PGAComparison | ✅ | - | |

### 8.3 Benchmark (`/statistikk?tab=benchmark`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Elite-sammenligning | EliteComparison | ✅ | - | |
| Peer-sammenligning | PeerComparison | ✅ | - | |
| Pro-spiller søk | ProPlayerSearch | ✅ | - | |

### 8.4 Testresultater (`/statistikk?tab=testresultater`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Resultat-tabell | TestResultsTable | ✅ | - | |
| Historikk | TestHistory | ✅ | - | |

### 8.5 Status & Mål (`/statistikk?tab=status`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Målstatus | GoalStatus | | | |
| Fremgang | ProgressTracker | | | |

### 8.6 Guide (`/stats/guide`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| SG forklaring | SGExplanation | ✅ | - | |
| Interaktiv demo | InteractiveDemo | | | |

---

## 9. Kommunikasjon

### 9.1 Meldinger (`/meldinger`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Innboks | Inbox | | | |
| Melding-liste | MessageList | | | |
| Les melding | ReadMessage | | | |
| Svar | ReplyMessage | | | |

### 9.2 Varsler (`/varsler`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Varsel-liste | NotificationList | | | |
| Markér lest | MarkAsRead | | | |
| Filter | NotificationFilter | | | |

### 9.3 Fra trener (`/meldinger/trener`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Coach-meldinger | CoachMessages | | | |
| Feedback | CoachFeedback | | | |

---

## 10. Målsetninger og progresjon

### 10.1 Mine mål (`/maalsetninger`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Mål-liste | GoalsList | | | |
| Nytt mål | NewGoalForm | | | |
| Mål-detalj | GoalDetail | | | |
| Progresjon | GoalProgress | | | |

### 10.2 Fremgang (`/progress`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Fremgangs-oversikt | ProgressOverview | | | |
| Per domene | DomainProgress | | | |
| Tidslinje | ProgressTimeline | | | |

### 10.3 Prestasjoner (`/achievements`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Prestasjon-liste | AchievementsList | | | |
| Låst opp | UnlockedAchievements | | | |
| Kommende | UpcomingAchievements | | | |

### 10.4 Badges (`/badges`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Badge-galleri | BadgeGallery | ✅ | - | |
| Per tier | BadgesByTier | ✅ | - | |
| Progresjon | BadgeProgress | ✅ | - | |

---

## 11. Kunnskap

### 11.1 Ressurser (`/ressurser`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Ressurs-liste | ResourceList | | | |
| Kategorier | ResourceCategories | | | |

### 11.2 Videoer (`/videos`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Video-bibliotek | VideoLibrary | ✅ | - | |
| Kategori-filter | VideoFilters | ✅ | - | |
| Video-spiller | VideoPlayer | ✅ | - | |
| Sammenligning | VideoComparison | | | |

### 11.3 Notater (`/notater`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Notat-liste | NotesList | | | |
| Ny notat | NewNote | | | |
| Fra coach | CoachNotes | | | |

### 11.4 Videobevis (`/bevis`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Last opp bevis | UploadProof | | | |
| Bevis-liste | ProofList | | | |
| Coach-vurdering | ProofReview | | | |

### 11.5 Samlinger (`/samlinger`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Samling-liste | CampList | | | |
| Samling-detalj | CampDetail | | | |
| Program | CampProgram | | | |

### 11.6 Arkiv (`/arkiv`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Arkivert innhold | ArchivedContent | | | |
| Søk | ArchiveSearch | | | |

---

## 12. Innstillinger

### 12.1 Min profil (`/profil`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Profil-info | ProfileInfo | ✅ | - | |
| Rediger profil | EditProfile | ✅ | - | |
| Bilde-opplasting | AvatarUpload | ✅ | - | |
| Kategori-info | CategoryInfo | ✅ | - | |

### 12.2 Kalibrering (`/kalibrering`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Utstyr-kalibrering | EquipmentCalibration | | | |
| Trackman-innstillinger | TrackmanSettings | | | |

### 12.3 Trenerteam (`/trenerteam`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Mine trenere | MyCoaches | | | |
| Kontakt-info | CoachContact | | | |

### 12.4 Varselinnstillinger (`/innstillinger/varsler`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Push-varsler | PushSettings | | | |
| E-post | EmailSettings | | | |
| In-app | InAppSettings | | | |

---

# COACH-MODUL

## 1. Dashboard (`/coach`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Oversikt-kort | DashboardCards | ✅ | - | |
| Varsler/røde flagg | AlertsWidget | ✅ | - | |
| Kommende bookinger | UpcomingBookings | ✅ | - | |
| Siste aktivitet | RecentActivity | ✅ | - | |
| Hurtighandlinger | QuickActions | ✅ | - | |

---

## 2. Mine spillere

### 2.1 Alle spillere (`/coach/athletes`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Spiller-liste | AthleteList | ✅ | - | |
| Søk | AthleteSearch | ✅ | - | |
| Filter (kategori) | CategoryFilter | ✅ | - | |
| Spiller-kort | AthleteCard | ✅ | - | |

### 2.2 Status & varsler (`/coach/athletes?tab=status`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Varsel-liste | AthleteAlerts | | | |
| Skade/sykdom | InjuryStatus | | | |
| Søvn/ernæring | WellnessStatus | | | |

### 2.3 Turneringsdeltakelse (`/coach/athletes?tab=turneringer`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Kommende turneringer | UpcomingTournaments | | | |
| Spillere per turnering | AthletesPerTournament | | | |

### 2.4 Spillervideoer (`/coach/videos`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Video-liste | AthleteVideos | ✅ | - | |
| Filter | VideoFilters | ✅ | - | |
| Review | VideoReview | ✅ | - | |

### 2.5 Referansebibliotek (`/coach/reference-videos`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Referanse-videoer | ReferenceLibrary | ✅ | - | 🆕 |
| Last opp | UploadReference | ✅ | - | |
| Kategorisering | VideoCategories | ✅ | - | |

---

## 3. Mine grupper

### 3.1 Alle grupper (`/coach/groups`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Gruppe-liste | GroupList | ✅ | - | |
| Gruppe-kort | GroupCard | ✅ | - | |
| Medlemmer | GroupMembers | ✅ | - | |

### 3.2 Ny gruppe (`/coach/groups/create`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Opprett-skjema | CreateGroupForm | ✅ | - | |
| Velg spillere | SelectAthletes | ✅ | - | |

---

## 4. Samlinger

### 4.1 Alle samlinger (`/coach/samlinger`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Samling-liste | CampList | | | |
| Samling-detalj | CampDetail | | | |
| Deltakere | CampParticipants | | | |

### 4.2 Ny samling (`/coach/samlinger/ny`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Opprett-skjema | CreateCampForm | | | 🆕 |
| Program-planlegger | ProgramPlanner | | | |
| Inviter spillere | InviteAthletes | | | |

---

## 5. Booking

### 5.1 Kalender (`/coach/booking`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Booking-kalender | BookingCalendar | | | |
| Dag/uke-visning | CalendarViews | | | |
| Booking-detalj | BookingDetail | | | |

### 5.2 Forespørsler (`/coach/booking/requests`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Forespørsel-liste | RequestList | | | |
| Godkjenn/avslå | ApproveReject | | | |

### 5.3 Tilgjengelighet (`/coach/booking/settings`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Ukentlig tid | WeeklyAvailability | | | |
| Blokker tid | BlockTime | | | |
| Ferie | VacationSettings | | | |

---

## 6. Statistikk

### 6.1 Spilleroversikt (`/coach/stats`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Alle spillere stats | AllAthletesStats | | | |
| Sortering | StatsSorting | | | |
| Sammenligning | StatsComparison | | | |

### 6.2 Fremgang (`/coach/stats/progress`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Fremgangs-liste | ProgressList | | | |
| Topp-forbedringer | TopImprovers | | | |

### 6.3 Tilbakegang (`/coach/stats/regression`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Røde flagg | RegressionAlerts | | | |
| Bekymringer | ConcernsList | | | |

### 6.4 Data Golf (`/coach/stats/datagolf`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| SG-analyse | SGAnalysis | | | |
| PGA-sammenligning | PGABenchmark | | | |

---

## 7. Treningsplanlegger

### 7.1 Velg spiller (`/coach/planning`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Spiller-valg | AthleteSelector | | | |
| Eksisterende plan | ExistingPlan | | | |
| Ny plan | CreatePlan | | | |

### 7.2 Velg gruppe (`/coach/planning/group`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Gruppe-valg | GroupSelector | | | |
| Gruppe-plan | GroupPlan | | | |

### 7.3 Maler (`/coach/planning/templates`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Mal-liste | TemplateList | | | |
| Ny mal | CreateTemplate | | | |
| Bruk mal | UseTemplate | | | |

---

## 8. Turneringer

### 8.1 Kalender (`/coach/tournaments`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Turnerings-kalender | TournamentCalendar | | | |
| Filter | TournamentFilters | | | |

### 8.2 Mine spillere (`/coach/tournaments/players`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Spillere per turnering | PlayersPerTournament | | | |
| Forberedelse-status | PrepStatus | | | |

### 8.3 Resultater (`/coach/tournaments/results`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Resultat-oversikt | TournamentResults | | | |
| Analyse | ResultsAnalysis | | | |

---

## 9. Beskjeder

### 9.1 Sendt (`/coach/messages`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Sendte meldinger | SentMessages | | | |
| Melding-detalj | MessageDetail | | | |

### 9.2 Ny beskjed (`/coach/messages/compose`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Mottaker-valg | RecipientSelector | | | |
| Melding-editor | MessageEditor | | | |
| Send | SendMessage | | | |

### 9.3 Planlagt (`/coach/messages/scheduled`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Planlagte meldinger | ScheduledMessages | | | |
| Rediger | EditScheduled | | | |

---

## 10. Øvelsesbank

### 10.1 Alle øvelser (`/coach/exercises`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Øvelse-liste | ExerciseList | ✅ | - | |
| Filter | ExerciseFilters | ✅ | - | |
| Søk | ExerciseSearch | ✅ | - | |

### 10.2 Mine øvelser (`/coach/exercises/mine`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Egne øvelser | MyExercises | | | |
| Ny øvelse | CreateExercise | | | |
| Rediger | EditExercise | | | |

### 10.3 Treningsplaner (`/coach/exercises/templates`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Plan-maler | PlanTemplates | | | |
| Ny mal | CreatePlanTemplate | | | |

---

## 11. System

### 11.1 Varsler (`/coach/alerts`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Alle varsler | AllAlerts | | | |
| Filter | AlertFilters | | | |
| Markér håndtert | MarkHandled | | | |

### 11.2 Innstillinger (`/coach/settings`)

| Funksjon | Komponent | Status | Prioritet | Notater |
|----------|-----------|--------|-----------|---------|
| Profil | CoachProfile | | | |
| Varsler | NotificationSettings | | | |
| Tilgjengelighet | AvailabilitySettings | | | |

---

# OPPSUMMERING

## Totalt antall funksjoner

| Modul | Sider | Funksjoner | Implementert |
|-------|-------|------------|--------------|
| Spiller | 35 | ~150 | ~40 |
| Coach | 25 | ~100 | ~25 |
| **Total** | **60** | **~250** | **~65** |

## Prioriterte områder

### Høy prioritet
1. Treningsplan-generering
2. Økt-gjennomføring
3. Test-registrering
4. Coach-spiller kommunikasjon

### Medium prioritet
1. Årsplan-wizard
2. Booking-system
3. Video-analyse
4. Gamification

### Lav prioritet
1. Skole-integrasjon
2. Avansert statistikk
3. AI-coach

---

_Oppdater "Status" kolonnen etter hvert som funksjoner implementeres_
