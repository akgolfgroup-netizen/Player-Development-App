# Player Navigation - Komplett Oversikt

> AK Golf Academy - Spiller Navigasjon
> Basert på database-skjema og eksisterende funksjonalitet

---

## Database-modeller → Menyfunksjoner

### Kartlegging av alle tilgjengelige funksjoner

| Database-modell | Nåværende meny | Mangler | Prioritet |
|-----------------|----------------|---------|-----------|
| Player | Profil | - | - |
| Event/Calendar | Kalender | - | - |
| Tournament/TournamentResult | Turneringer | Turneringsresultater | Medium |
| Test/TestResult | Testprotokoll | Test-historikk visning | Høy |
| TrainingSession | Trening | Logg/evaluering | Medium |
| Periodization | Planlegger | Periodeoversikt | Medium |
| Exercise | Øvelsesbank | - | - |
| BreakingPoint | Mangler helt | Breaking Points dashboard | Høy |
| ProgressLog | Evaluering | Treningsdagbok | Høy |
| BenchmarkSession | Mangler helt | Benchmark-oversikt | Medium |
| AnnualTrainingPlan | Årsplan | Plangenerering | Høy |
| DailyTrainingAssignment | Dagens plan | - | - |
| WeeklyTrainingStats | Stats | Ukestatistikk | Medium |
| MonthlyTrainingStats | Stats | Månedsstatistikk | Medium |
| PlayerAchievement | Mangler | Prestasjoner/Badges | Høy |
| ChatGroup/ChatMessage | Mangler | Meldinger | Høy |
| Note | Notater | - | - |
| Goal/PlayerGoal | Målsetninger | Målsporing | Medium |
| Fag/Skoletime/Oppgave | Skole | - | - |
| ClubSpeedCalibration | Mangler | Kalibrering | Medium |
| PlayerIntake | Mangler | Onboarding | Lav |
| Booking | Mangler | Booking med trener | Høy |
| Media | Arkiv | Videobevis | Medium |
| Notification | Mangler | Varsler | Høy |

---

## Anbefalt Navigasjonsstruktur

### Hovedseksjoner (11 kategorier)

```
1. Dashboard (Hjem)
2. Min Utvikling
3. Trening
4. Kalender
5. Testing
6. Turneringer
7. Kommunikasjon
8. Mål & Fremgang
9. Kunnskap
10. Skole
11. Innstillinger
```

---

## Detaljert Menystruktur

### 1. Dashboard (Hjem)
**Ikon:** `Home`
**Sti:** `/`

Dashboard viser:
- Dagens treningsplan (fra `DailyTrainingAssignment`)
- Ukestatistikk widget (fra `WeeklyTrainingStats`)
- Neste turnering (fra `ScheduledTournament`)
- Siste prestasjoner (fra `PlayerAchievement`)
- Uleste meldinger (fra `ChatMessage`)
- Breaking points status (fra `BreakingPoint`)

---

### 2. Min Utvikling
**Ikon:** `TrendingUp`

| Undermeny | Sti | Database | Status |
|-----------|-----|----------|--------|
| Oversikt | `/utvikling` | Player, WeeklyStats | **NY** |
| Breaking Points | `/utvikling/breaking-points` | BreakingPoint | **NY** |
| Kategori-fremgang | `/utvikling/kategori` | TestResult, CategoryRequirement | **NY** |
| Benchmark-historie | `/utvikling/benchmark` | BenchmarkSession | **NY** |
| Peer sammenligning | `/utvikling/sammenligning` | PeerComparison | **NY** |

**Nye komponenter:**
```
/features/player-development/
├── PlayerDevelopmentOverview.tsx
├── BreakingPointsDashboard.tsx
├── CategoryProgressTracker.tsx
├── BenchmarkHistory.tsx
└── PeerComparisonView.tsx
```

---

### 3. Trening
**Ikon:** `Activity`

| Undermeny | Sti | Database | Status |
|-----------|-----|----------|--------|
| Dagens plan | `/trening/dagens` | DailyTrainingAssignment | Finnes |
| Ukens plan | `/trening/ukens` | DailyTrainingAssignment | Finnes |
| Treningsdagbok | `/trening/dagbok` | ProgressLog | **NY** |
| Øvelsesbank | `/ovelsesbibliotek` | Exercise | Finnes |
| Teknisk plan | `/trening/teknisk` | - | Finnes |
| Logg trening | `/trening/logg` | TrainingSession | **NY** |

**Nye komponenter:**
```
/features/training-log/
├── TrainingDiary.tsx           - Dagbok-visning
├── TrainingLogForm.tsx         - Logg ny økt
├── TrainingSessionCard.tsx     - Øktkort
└── TrainingReflection.tsx      - Refleksjon etter økt
```

---

### 4. Kalender
**Ikon:** `Calendar`

| Undermeny | Sti | Database | Status |
|-----------|-----|----------|--------|
| Årsplan | `/kalender?view=year` | AnnualTrainingPlan | Finnes |
| Periodeplaner | `/kalender?view=month` | Periodization | Finnes |
| Treningsplan | `/kalender?view=week` | DailyTrainingAssignment | Finnes |
| Turneringer | `/kalender?view=tournament` | ScheduledTournament | Finnes |
| Book trener | `/kalender/booking` | Booking, Availability | **NY** |

**Nye komponenter:**
```
/features/player-booking/
├── CoachBookingView.tsx        - Se ledige timer
├── BookingRequestForm.tsx      - Book time
├── MyBookings.tsx              - Mine bookinger
└── BookingConfirmation.tsx     - Bekreftelse
```

---

### 5. Testing
**Ikon:** `Target`

| Undermeny | Sti | Database | Status |
|-----------|-----|----------|--------|
| Testprotokoll | `/testprotokoll` | Test | Finnes |
| Mine resultater | `/testresultater` | TestResult | Finnes |
| Kategori-krav | `/testing/krav` | CategoryRequirement | **NY** |
| Test-historikk | `/testing/historikk` | TestResult | **NY** |
| Registrer test | `/testing/registrer` | TestResult | **NY** |

**Nye komponenter:**
```
/features/testing/
├── CategoryRequirementsView.tsx  - Vis krav per kategori
├── TestHistoryTimeline.tsx       - Tidslinje med alle tester
├── TestRegistrationForm.tsx      - Registrer nytt resultat
└── TestComparisonChart.tsx       - Sammenlign over tid
```

---

### 6. Turneringer
**Ikon:** `Trophy`

| Undermeny | Sti | Database | Status |
|-----------|-----|----------|--------|
| Kalender | `/turneringskalender` | Tournament | Finnes |
| Mine turneringer | `/mine-turneringer` | ScheduledTournament | Finnes |
| Resultater | `/turneringer/resultater` | TournamentResult | **NY** |
| Statistikk | `/turneringer/stats` | TournamentResult | **NY** |
| Registrer resultat | `/turneringer/registrer` | TournamentResult | **NY** |

**Nye komponenter:**
```
/features/tournament-results/
├── TournamentResultsHistory.tsx  - Alle resultater
├── TournamentStatsView.tsx       - Turneringsstatistikk
├── RegisterTournamentResult.tsx  - Registrer resultat
└── TournamentPerformanceChart.tsx
```

---

### 7. Kommunikasjon
**Ikon:** `MessageSquare`

| Undermeny | Sti | Database | Status |
|-----------|-----|----------|--------|
| Meldinger | `/meldinger` | ChatGroup, ChatMessage | **NY** |
| Varsler | `/varsler` | Notification | **NY** |
| Fra trener | `/meldinger/trener` | ChatMessage | **NY** |

**Nye komponenter:**
```
/features/messaging/
├── MessageCenter.tsx            - Meldingsoversikt
├── ConversationView.tsx         - Chat-visning
├── NotificationCenter.tsx       - Varsler
├── MessageCompose.tsx           - Ny melding
└── CoachMessages.tsx            - Beskjeder fra trener
```

---

### 8. Mål & Fremgang
**Ikon:** `Flag`

| Undermeny | Sti | Database | Status |
|-----------|-----|----------|--------|
| Mine mål | `/maalsetninger` | Goal, PlayerGoal | Finnes |
| Fremgang | `/progress` | ProgressDashboard | Finnes |
| Prestasjoner | `/achievements` | PlayerAchievement | Finnes |
| Badges | `/badges` | PlayerAchievement | **FORBEDRING** |
| Sesongoversikt | `/sesong` | SeasonBaseline | **NY** |

**Nye komponenter:**
```
/features/achievements/
├── AchievementShowcase.tsx      - Vis alle badges
├── AchievementUnlocked.tsx      - Ny badge animasjon
├── SeasonOverview.tsx           - Sesongoversikt
└── GoalTracker.tsx              - Målsporing
```

---

### 9. Kunnskap
**Ikon:** `BookMarked`

| Undermeny | Sti | Database | Status |
|-----------|-----|----------|--------|
| Ressurser | `/ressurser` | - | Finnes |
| Notater | `/notater` | Note | Finnes |
| Arkiv | `/arkiv` | ArchivedItem, Media | Finnes |
| Videobevis | `/bevis` | Media | **NY** |

**Nye komponenter:**
```
/features/proof/
├── ProofUpload.tsx              - Last opp video
├── ProofGallery.tsx             - Mine videobevis
├── ProofDetail.tsx              - Enkeltvisning
└── ProofFeedback.tsx            - Trenerfeedback
```

---

### 10. Skole
**Ikon:** `GraduationCap`

| Undermeny | Sti | Database | Status |
|-----------|-----|----------|--------|
| Timeplan | `/skoleplan` | Fag, Skoletime | Finnes |
| Oppgaver | `/skole/oppgaver` | Oppgave | **NY** |
| Kalender | `/skole/kalender` | Skoletime | **NY** |

**Nye komponenter:**
```
/features/school/
├── AssignmentList.tsx           - Oppgaveliste
├── AssignmentForm.tsx           - Legg til oppgave
├── SchoolCalendar.tsx           - Skolekalender
└── SubjectSettings.tsx          - Faginnstillinger
```

---

### 11. Innstillinger
**Ikon:** `Settings`

| Undermeny | Sti | Database | Status |
|-----------|-----|----------|--------|
| Profil | `/profil` | User, Player | Finnes |
| Kalibrering | `/kalibrering` | ClubSpeedCalibration | **NY** |
| Trenerteam | `/trenerteam` | Coach | Finnes |
| Preferanser | `/innstillinger` | User settings | **NY** |
| Varselinnstillinger | `/innstillinger/varsler` | Notification prefs | **NY** |

**Nye komponenter:**
```
/features/settings/
├── CalibrationWizard.tsx        - Køllekalibrering
├── PreferencesForm.tsx          - Brukerpreferanser
├── NotificationSettings.tsx     - Varselinnstillinger
└── ProfileEditor.tsx            - Redigere profil
```

---

## Komplett Navigasjon Config

```javascript
export const playerNavigationConfig = [
  // DASHBOARD
  {
    label: 'Dashboard',
    icon: 'Home',
    href: '/'
  },

  // MIN UTVIKLING
  {
    label: 'Min utvikling',
    icon: 'TrendingUp',
    submenu: [
      { href: '/utvikling', label: 'Oversikt' },
      { href: '/utvikling/breaking-points', label: 'Breaking Points' },
      { href: '/utvikling/kategori', label: 'Kategori-fremgang' },
      { href: '/utvikling/benchmark', label: 'Benchmark-historie' },
    ]
  },

  // TRENING
  {
    label: 'Trening',
    icon: 'Activity',
    submenu: [
      { href: '/trening/dagens', label: 'Dagens plan' },
      { href: '/trening/ukens', label: 'Ukens plan' },
      { href: '/trening/dagbok', label: 'Treningsdagbok' },
      { href: '/trening/logg', label: 'Logg trening' },
      { href: '/ovelsesbibliotek', label: 'Øvelsesbank' },
    ]
  },

  // KALENDER
  {
    label: 'Kalender',
    icon: 'Calendar',
    submenu: [
      { href: '/kalender?view=week', label: 'Treningsplan' },
      { href: '/kalender?view=month', label: 'Månedsoversikt' },
      { href: '/kalender?view=year', label: 'Årsplan' },
      { href: '/kalender/booking', label: 'Book trener' },
    ]
  },

  // TESTING
  {
    label: 'Testing',
    icon: 'Target',
    submenu: [
      { href: '/testprotokoll', label: 'Testprotokoll' },
      { href: '/testresultater', label: 'Mine resultater' },
      { href: '/testing/krav', label: 'Kategori-krav' },
      { href: '/testing/registrer', label: 'Registrer test' },
    ]
  },

  // TURNERINGER
  {
    label: 'Turneringer',
    icon: 'Trophy',
    submenu: [
      { href: '/turneringskalender', label: 'Kalender' },
      { href: '/mine-turneringer', label: 'Mine turneringer' },
      { href: '/turneringer/resultater', label: 'Resultater' },
      { href: '/turneringer/registrer', label: 'Registrer resultat' },
    ]
  },

  // KOMMUNIKASJON
  {
    label: 'Kommunikasjon',
    icon: 'MessageSquare',
    badge: 'unreadMessages',
    submenu: [
      { href: '/meldinger', label: 'Meldinger' },
      { href: '/varsler', label: 'Varsler' },
      { href: '/meldinger/trener', label: 'Fra trener' },
    ]
  },

  // MÅL & FREMGANG
  {
    label: 'Mål & Fremgang',
    icon: 'Flag',
    submenu: [
      { href: '/maalsetninger', label: 'Mine mål' },
      { href: '/progress', label: 'Fremgang' },
      { href: '/achievements', label: 'Prestasjoner' },
    ]
  },

  // KUNNSKAP
  {
    label: 'Kunnskap',
    icon: 'BookMarked',
    submenu: [
      { href: '/ressurser', label: 'Ressurser' },
      { href: '/notater', label: 'Notater' },
      { href: '/bevis', label: 'Videobevis' },
      { href: '/arkiv', label: 'Arkiv' },
    ]
  },

  // SKOLE
  {
    label: 'Skole',
    icon: 'GraduationCap',
    submenu: [
      { href: '/skoleplan', label: 'Timeplan' },
      { href: '/skole/oppgaver', label: 'Oppgaver' },
    ]
  },

  // INNSTILLINGER
  {
    label: 'Innstillinger',
    icon: 'Settings',
    submenu: [
      { href: '/profil', label: 'Min profil' },
      { href: '/kalibrering', label: 'Kalibrering' },
      { href: '/trenerteam', label: 'Trenerteam' },
      { href: '/innstillinger/varsler', label: 'Varselinnstillinger' },
    ]
  },
];
```

---

## Prioritert Utviklingsplan

### Fase 1: Kritiske mangler (Høy prioritet)
1. **Kommunikasjon** - Meldinger og varsler
2. **Breaking Points** - Utviklingsoversikt
3. **Booking** - Book trener
4. **Treningsdagbok** - Logg og refleksjon

### Fase 2: Viktige funksjoner (Medium prioritet)
1. **Turneringsresultater** - Registrer og vis
2. **Test-historikk** - Tidslinje
3. **Videobevis** - Last opp og vis
4. **Sesongoversikt** - Baseline og fremgang

### Fase 3: Forbedringer (Lav prioritet)
1. **Kategori-krav visning**
2. **Peer-sammenligning**
3. **Skoleoppgaver**
4. **Kalibrering wizard**

---

## Estimert arbeidsmengde

| Modul | Nye komponenter | Estimat |
|-------|-----------------|---------|
| Min Utvikling | 5 | 4-5 dager |
| Trening (dagbok) | 4 | 2-3 dager |
| Booking | 4 | 3-4 dager |
| Testing | 4 | 2-3 dager |
| Turneringer | 4 | 2-3 dager |
| Kommunikasjon | 5 | 4-5 dager |
| Prestasjoner | 4 | 2-3 dager |
| Videobevis | 4 | 2-3 dager |
| Skole | 4 | 2 dager |
| Innstillinger | 4 | 2 dager |

**Total: 25-33 dager**

---

*Dokument generert: Desember 2025*
*AK Golf Academy - Player Navigation v2.0*
