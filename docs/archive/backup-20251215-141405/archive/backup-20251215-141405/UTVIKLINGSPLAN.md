# 📱 AK GOLF IUP APP - UTVIKLINGSPLAN

**Dato**: 15. desember 2025
**Prosjekt**: AK Golf Academy - Individuell Utviklingsplan (IUP)
**Status**: Production-ready backend + Design system komplett
**Neste fase**: Frontend-implementering

---

## 📊 NÅVÆRENDE STATUS - QUICK OVERVIEW

### ✅ KOMPLETT (100%)
- **Backend Infrastructure**: Production-grade Fastify API med 50+ endpoints
- **Database**: PostgreSQL med 24 tabeller + golf-spesifikt data
- **Design System v2.1**: Figma kit, tokens, Tailwind config
- **Interactive Mockups**: 13 skjermer, komplett brukerflyt
- **Golf Intelligence**: AI treningsplaner, Team Norway data, gamification
- **DevOps**: Docker, pnpm monorepo, CI/CD struktur

### ⚠️ DELVIS KOMPLETT (60%)
- **Frontend Components**: 22 React-komponenter (gammelt design)
- **API Integration**: Noen komponenter koblet til backend
- **Styling**: Blanding av gammelt design og Tailwind

### ❌ MANGLER (0%)
- **Design System Implementation**: Komponenter med nytt design
- **13 App-skjermer**: Implementert i React med ny styling
- **Komplett API-integrasjon**: Alle skjermer koblet til backend
- **Media Processing**: Video/bilde-opplasting
- **Push Notifications**: Varsler til brukere
- **Production Deployment**: Live app i App Store/Play Store

---

## 🎯 MÅL FOR PROSJEKTET

### Hovedmål
Levere en **fullstendig, production-ready** AK Golf IUP mobilapp som:
1. Gir golfspillere full oversikt over sin individuelle utviklingsplan
2. Kobler trenere og spillere i en sømløs arbeidsflyt
3. Visualiserer fremdrift, tester, og måloppnåelse
4. Gir AI-drevne treningsanbefalinger basert på Team Norway standarder
5. Gamifiserer treningsprosessen med achievements og leaderboards

### Suksesskriterier
- ✅ Alle 13 skjermer implementert og fungerende
- ✅ Komplett API-integrasjon med backend
- ✅ Design System v2.1 konsekvent implementert
- ✅ Offline-funksjonalitet (local storage/cache)
- ✅ Push notifications for viktige events
- ✅ < 3 sekunder lastetid
- ✅ 95%+ test coverage
- ✅ Deploybar til iOS TestFlight og Android Beta

---

## 🗺️ OVERORDNET ROADMAP

```
FASE 1: FOUNDATION        [2 uker]  ████████░░░░░░░░░░░░  40% komplett
FASE 2: CORE FEATURES     [3 uker]  ░░░░░░░░░░░░░░░░░░░░   0% komplett
FASE 3: ADVANCED          [2 uker]  ░░░░░░░░░░░░░░░░░░░░   0% komplett
FASE 4: POLISH & TEST     [2 uker]  ░░░░░░░░░░░░░░░░░░░░   0% komplett
FASE 5: DEPLOYMENT        [1 uke]   ░░░░░░░░░░░░░░░░░░░░   0% komplett
───────────────────────────────────────────────────────────
TOTAL: 10 uker (2.5 måneder)
```

---

## 📅 DETALJERT UTVIKLINGSPLAN

---

## FASE 1: FOUNDATION (Uke 1-2)

**Mål**: Sett opp development environment og lag komponentbibliotek

### Uke 1: Setup & Komponentbibliotek

#### Dag 1-2: Development Environment
- [ ] **Oppsett av lokal utvikling**
  - Kjør `make dev` og verifiser at alle services starter
  - Test PostgreSQL, Redis, LocalStack
  - Verifiser at Vite dev server kjører på :5173
  - Test API endpoints med Postman/Thunder Client

- [ ] **Git Branching Strategy**
  - Opprett `develop` branch fra `main`
  - Opprett feature branches: `feature/design-system`, `feature/component-library`
  - Sett opp PR-templates

- [ ] **Environment Variables**
  - Kopier `.env.example` til `.env`
  - Fyll inn nødvendige secrets
  - Dokumenter alle environment variables

#### Dag 3-5: Komponentbibliotek (Design System v2.1)

**Opprett nye komponenter i `/frontend/src/components/ui/`**:

- [ ] **`Button.jsx`** - Primær, sekundær, tertiary variants
  ```jsx
  // Variants: primary, secondary, outline, ghost
  // Sizes: sm, md, lg
  // States: default, hover, active, disabled, loading
  ```

- [ ] **`Card.jsx`** - Kortkomponent med shadow og border-radius
  ```jsx
  // Variants: default, elevated, outlined
  // Padding: sm, md, lg
  // Clickable prop for hover effects
  ```

- [ ] **`Badge.jsx`** - Status badges og tags
  ```jsx
  // Variants: primary, success, warning, error
  // Sizes: sm, md, lg
  ```

- [ ] **`Tab.jsx` / `Tabs.jsx`** - Tab navigation
  ```jsx
  // Horizontal tabs med active state
  // Support for icons + labels
  ```

- [ ] **`Input.jsx`** - Form inputs
  ```jsx
  // Types: text, email, password, number, date
  // States: default, error, disabled
  // Support for icons (leading/trailing)
  ```

- [ ] **`Select.jsx`** - Dropdown select
  ```jsx
  // Single select
  // Multi-select support
  // Search/filter support
  ```

- [ ] **`Modal.jsx`** - Overlay modal
  ```jsx
  // Sizes: sm, md, lg, full
  // Close on backdrop click
  // Escape key support
  ```

- [ ] **`ProgressBar.jsx`** - Progress indicator
  ```jsx
  // Linear progress
  // Circular progress (spinner)
  // Determinate vs indeterminate
  ```

- [ ] **`StatBox.jsx`** - Statistikk-kort
  ```jsx
  // Number + label
  // Optional trend (up/down arrow)
  // Colors based on context
  ```

- [ ] **`Avatar.jsx`** - Brukerbilder og initialer
  ```jsx
  // Sizes: xs, sm, md, lg, xl
  // Fallback til initialer
  // Status indicator (online/offline)
  ```

**Utviklingsprosess**:
1. Start med én komponent (Button)
2. Implementer alle variants og states
3. Skriv Storybook stories (optional, men anbefalt)
4. Skriv unit tests (Vitest)
5. Dokumenter props og usage
6. Gjenta for alle komponenter

**Leveranse**: Komponentbibliotek dokumentert i `/frontend/src/components/ui/README.md`

---

### Uke 2: Layout & Navigation

#### Dag 1-2: Layout-komponenter

- [ ] **`AppShell.jsx`** - App container
  ```jsx
  // Header (logo, title, avatar)
  // Main content area (scrollable)
  // Bottom navigation (5 items)
  // Menu overlay (13 skjermer)
  ```

- [ ] **`Header.jsx`** - App header
  ```jsx
  // Logo (AK box)
  // Dynamic title based on screen
  // User avatar
  // Responsive padding
  ```

- [ ] **`BottomNav.jsx`** - Bottom navigation
  ```jsx
  // 5 navigation items:
  //   - Hjem (Dashboard)
  //   - Kalender
  //   - Mål
  //   - Stats
  //   - Profil
  // Active state styling
  // SVG icons fra Figma kit
  ```

- [ ] **`MenuOverlay.jsx`** - Full screen menu
  ```jsx
  // Grid layout med alle 13 skjermer
  // Search/filter funksjonalitet
  // Keyboard shortcut (M key)
  // Click outside to close
  ```

#### Dag 3-5: Routing & Navigation Logic

- [ ] **React Router Setup**
  - Installer `react-router-dom@6.21`
  - Opprett `/frontend/src/routes.jsx`
  - Definer alle 13 ruter:
    ```jsx
    /                     -> Dashboard
    /kalender             -> Kalender
    /maal                 -> Målsetninger
    /stats                -> Statistikk
    /aarsplan             -> Årsplan
    /testprotokoll        -> Testprotokoll
    /testresultater       -> Testresultater
    /treningsprotokoll    -> Treningsprotokoll
    /ovelser              -> Øvelser
    /trenerteam           -> Trenerteam
    /arkiv                -> Arkiv
    /notater              -> Notater
    /profil               -> Profil
    ```

- [ ] **Protected Routes**
  - Implementer `<ProtectedRoute>` wrapper
  - Redirect til `/login` hvis ikke autentisert
  - Håndter refresh tokens

- [ ] **Navigation Context**
  - Opprett `NavigationContext.jsx`
  - State for active screen
  - State for menu open/closed
  - Functions: `navigateTo()`, `toggleMenu()`

**Leveranse**: Fungerende navigasjon mellom alle 13 skjermer

---

## FASE 2: CORE FEATURES (Uke 3-5)

**Mål**: Implementer alle 13 app-skjermer med full funksjonalitet

### Uke 3: Oversikt & Data (Skjerm 1-4)

#### Skjerm 1: Dashboard (`/`)

- [ ] **Layout & Komponenter**
  ```jsx
  <Dashboard>
    <Greeting name="Ola" />
    <CategoryInfo category="B" avgScore={74.2} />
    <FocusCard
      title="Dagens Fokus"
      sessions={2}
      total={3}
      tags={["L4", "CS60", "S6"]}
      name="Innspill 100-150m"
      progress={67}
    />
    <UpcomingSessions sessions={upcomingData} />
    <StatsGrid
      sessions={12}
      hours={14.5}
      completed={8}
    />
  </Dashboard>
  ```

- [ ] **API Integration**
  - `GET /api/players/:id/dashboard` - Hent dashboard data
  - `GET /api/sessions/upcoming` - Kommende økter
  - `GET /api/stats/summary` - Statistikk sammendrag
  - State management med React hooks eller Context

- [ ] **Interaktivitet**
  - Click på session -> Naviger til session detail
  - Pull-to-refresh
  - Loading states
  - Error handling

**Tidsestimert**: 2 dager

---

#### Skjerm 2: Kalender (`/kalender`)

- [ ] **Layout & Komponenter**
  ```jsx
  <Kalender>
    <WeekSelector week={50} year={2025} />
    <WeekView
      days={weekDays}
      activeDay={selectedDay}
      onDayClick={handleDayClick}
    />
    <DaySchedule
      date={selectedDate}
      sessions={daySessions}
    />
    <StatsGrid
      sessions={12}
      hours={14.5}
      completed={8}
    />
  </Kalender>
  ```

- [ ] **API Integration**
  - `GET /api/sessions/calendar?week=50&year=2025` - Uke-data
  - `GET /api/sessions/day?date=2025-12-14` - Dag-data
  - `POST /api/sessions` - Opprett ny session
  - `PUT /api/sessions/:id` - Oppdater session
  - `DELETE /api/sessions/:id` - Slett session

- [ ] **Interaktivitet**
  - Swipe mellom uker
  - Click på dag -> Vis dag-visning
  - Click på session -> Vis detaljer
  - Add session knapp -> Modal for å opprette

**Tidsestimert**: 2 dager

---

#### Skjerm 3: Målsetninger (`/maal`)

- [ ] **Layout & Komponenter**
  ```jsx
  <Goals>
    <PageHeader
      title="Mine målsetninger"
      subtitle="Dine mål og fremdrift"
    />
    <GoalList goals={goalsData}>
      {goals.map(goal => (
        <GoalItem
          key={goal.id}
          icon={goal.icon}
          title={goal.title}
          type={goal.type} // Kort/Mellom/Lang
          deadline={goal.deadline}
          progress={goal.progress}
          onClick={() => navigateToGoalDetail(goal.id)}
        />
      ))}
    </GoalList>
    <AddGoalButton onClick={openAddGoalModal} />
  </Goals>
  ```

- [ ] **API Integration**
  - `GET /api/goals` - Hent alle mål
  - `GET /api/goals/:id` - Hent detaljer
  - `POST /api/goals` - Opprett mål
  - `PUT /api/goals/:id` - Oppdater mål
  - `DELETE /api/goals/:id` - Slett mål

- [ ] **Interaktivitet**
  - Click på goal -> Detail view med historikk
  - Add goal modal
  - Edit goal inline
  - Mark as completed
  - Filter: Alle / Kortsiktig / Mellomlang / Langsiktig

**Tidsestimert**: 1.5 dager

---

#### Skjerm 4: Statistikk (`/stats`)

- [ ] **Layout & Komponenter**
  ```jsx
  <Stats>
    <PageHeader
      title="Treningsstatistikk"
      subtitle="Oversikt over din aktivitet"
    />
    <StatsGrid>
      <StatBox number="12.5t" label="Treningstimer" />
      <StatBox number="8/12" label="Økter fullført" />
    </StatsGrid>
    <Card title="Timer per dag">
      <BarChart data={dailyHours} />
    </Card>
    <Card title="Økter per kategori">
      <CategoryBreakdown
        data={[
          { name: "Teknikk", percent: 45, color: "forest" },
          { name: "Fysisk", percent: 30, color: "success" },
          { name: "Mental", percent: 25, color: "warning" }
        ]}
      />
    </Card>
  </Stats>
  ```

- [ ] **API Integration**
  - `GET /api/stats/overview` - Generell statistikk
  - `GET /api/stats/daily?from=2025-12-01&to=2025-12-31` - Daily breakdown
  - `GET /api/stats/categories` - Category distribution

- [ ] **Interaktivitet**
  - Date range picker
  - Toggle between charts (daily/weekly/monthly)
  - Export data knapp

**Tidsestimert**: 1.5 dager

**Total Uke 3**: Dashboard, Kalender, Mål, Stats

---

### Uke 4: Planlegging & Testing (Skjerm 5-8)

#### Skjerm 5: Årsplan (`/aarsplan`)

- [ ] **Layout & Komponenter**
  ```jsx
  <Aarsplan>
    <PageHeader
      title="Årsplan 2025-2026"
      subtitle="Uke 43 (2025) - Uke 42 (2026)"
    />
    <Tabs>
      <Tab label="Timeline" />
      <Tab label="Grid" />
      <Tab label="Perioder" />
    </Tabs>

    {/* Timeline View */}
    <PeriodList>
      <PeriodCard
        phase="E"
        title="Etableringsfase"
        weeks={13}
        dateRange="Okt - Des 2025"
        tags={["Grunnleggende teknikk", "Fysisk base", "Rutiner"]}
        color="success"
      />
      {/* G, S, T perioder */}
    </PeriodList>
  </Aarsplan>
  ```

- [ ] **API Integration**
  - `GET /api/annual-plan/:year` - Hent årsplan
  - `GET /api/periods` - Alle perioder (E, G, S, T)
  - `PUT /api/periods/:id` - Oppdater periode

- [ ] **Interaktivitet**
  - Switch mellom Timeline/Grid/Perioder views
  - Click på periode -> Detail modal
  - Drag-and-drop sessions mellom perioder (avansert)

**Tidsestimert**: 1.5 dager

---

#### Skjerm 6: Testprotokoll (`/testprotokoll`)

- [ ] **Layout & Komponenter**
  ```jsx
  <Testprotokoll>
    <PageHeader
      title="Testprotokoll"
      subtitle="20 tester · Kategori B"
    />
    <Tabs>
      <Tab label="Alle" />
      <Tab label="Golf" />
      <Tab label="Fysisk" />
      <Tab label="Mental" />
    </Tabs>

    <TestList>
      {tests.map(test => (
        <TestCard
          key={test.id}
          icon={test.icon}
          name={test.name}
          requirement={test.requirement}
          currentValue={test.currentValue}
          status={test.status} // pass/fail/warning
          trend={test.trend} // +2.4%
          onClick={() => navigateToTestDetail(test.id)}
        />
      ))}
    </TestList>
  </Testprotokoll>
  ```

- [ ] **API Integration**
  - `GET /api/tests` - Hent alle tester
  - `GET /api/tests/:id` - Detaljer om en test
  - `GET /api/test-requirements?category=B` - Team Norway krav
  - `POST /api/test-results` - Registrer resultat

- [ ] **Interaktivitet**
  - Filter etter kategori (Golf/Fysisk/Mental)
  - Click på test -> Detail view med historikk
  - Add test result modal
  - Sort by: Status, Name, Date

**Tidsestimert**: 1.5 dager

---

#### Skjerm 7: Testresultater (`/testresultater`)

- [ ] **Layout & Komponenter**
  ```jsx
  <Testresultater>
    <PageHeader
      title="Testresultater"
      subtitle="Benchmark Uke 48"
    />
    <StatsGrid>
      <StatBox number="12/20" label="Bestått" />
      <StatBox number="75%" label="Forbedret" />
      <StatBox number="89%" label="Til krav" />
    </StatsGrid>

    <Card title="Samlet profil">
      <RadarChart
        categories={[
          "Driver", "Jern", "Wedge", "Putting",
          "Fysisk", "Mental", "Strategi"
        ]}
        current={currentScores}
        target={targetScores}
      />
    </Card>

    <Card title="Historikk (6 benchmarks)">
      <LineChart
        benchmarks={benchmarkHistory}
        metrics={["Driver avstand", "Jern 7", "Putting"]}
      />
    </Card>
  </Testresultater>
  ```

- [ ] **API Integration**
  - `GET /api/benchmarks/latest` - Siste benchmark
  - `GET /api/benchmarks/history` - Historiske benchmarks
  - `GET /api/benchmarks/:id/details` - Full benchmark data
  - `POST /api/benchmarks` - Registrer ny benchmark

- [ ] **Interaktivitet**
  - Select benchmark fra dropdown
  - Toggle metrics on/off i chart
  - Export benchmark as PDF
  - Compare to Team Norway / Tour Pro

**Tidsestimert**: 2 dager

---

#### Skjerm 8: Treningsprotokoll (`/treningsprotokoll`)

- [ ] **Layout & Komponenter**
  ```jsx
  <Treningsprotokoll>
    <PageHeader
      title="Treningsprotokoll"
      subtitle="Øktbibliotek"
    />
    <Tabs>
      <Tab label="Alle" />
      <Tab label="Teknikk" />
      <Tab label="Golf" />
      <Tab label="Fysisk" />
    </Tabs>

    <SessionTemplateList>
      {templates.map(template => (
        <SessionItem
          key={template.id}
          icon={template.icon}
          title={template.title}
          duration={template.duration}
          tags={template.tags} // L2, CS40, S1
          onClick={() => navigateToTemplate(template.id)}
        />
      ))}
    </SessionTemplateList>

    <AddTemplateButton onClick={openAddModal} />
  </Treningsprotokoll>
  ```

- [ ] **API Integration**
  - `GET /api/session-templates` - Hent alle templates
  - `GET /api/session-templates/:id` - Template detaljer
  - `POST /api/session-templates` - Opprett template
  - `PUT /api/session-templates/:id` - Oppdater
  - `DELETE /api/session-templates/:id` - Slett

- [ ] **Interaktivitet**
  - Filter etter type
  - Search templates
  - Click på template -> Detail view
  - "Start session" knapp -> Book session
  - Favorite templates

**Tidsestimert**: 1.5 dager

**Total Uke 4**: Årsplan, Testprotokoll, Testresultater, Treningsprotokoll

---

### Uke 5: Bibliotek & Team (Skjerm 9-13)

#### Skjerm 9: Øvelser (`/ovelser`)

- [ ] **Layout & Komponenter**
  ```jsx
  <Ovelser>
    <PageHeader
      title="Øvelsesbibliotek"
      subtitle="24 øvelser tilgjengelig"
    />
    <Tabs>
      <Tab label="Alle" />
      <Tab label="Langspill" />
      <Tab label="Shortgame" />
      <Tab label="Putting" />
    </Tabs>

    <SearchBar
      placeholder="Søk øvelser..."
      onSearch={handleSearch}
    />

    <ExerciseGrid>
      {exercises.map(exercise => (
        <ExerciseCard
          key={exercise.id}
          thumbnail={exercise.thumbnail}
          title={exercise.title}
          description={exercise.description}
          duration={exercise.duration}
          level={exercise.level} // L1-L5
          favorite={exercise.isFavorite}
          onToggleFavorite={() => toggleFavorite(exercise.id)}
          onClick={() => navigateToExercise(exercise.id)}
        />
      ))}
    </ExerciseGrid>
  </Ovelser>
  ```

- [ ] **API Integration**
  - `GET /api/exercises` - Hent alle øvelser
  - `GET /api/exercises/:id` - Detaljer + video
  - `POST /api/exercises/:id/favorite` - Toggle favorite
  - `POST /api/exercises/:id/log` - Logg utført øvelse

- [ ] **Interaktivitet**
  - Filter etter kategori
  - Search funksjonalitet
  - Favorite toggle
  - Click -> Video modal med instruksjoner
  - "Add to session" knapp

**Tidsestimert**: 1.5 dager

---

#### Skjerm 10: Trenerteam (`/trenerteam`)

- [ ] **Layout & Komponenter**
  ```jsx
  <Trenerteam>
    <PageHeader
      title="Mitt Trenerteam"
      subtitle="4 trenere tilknyttet"
    />
    <Tabs>
      <Tab label="Team" />
      <Tab label="Økter" />
      <Tab label="Meldinger" />
    </Tabs>

    {/* Primary Coach Highlight */}
    <PrimaryCoachCard
      name="Magnus Andersen"
      role="Hovedtrener"
      sessions={156}
      avatar="MA"
      onContact={() => openChat("magnus")}
    />

    {/* Other Coaches */}
    <CoachList>
      {coaches.map(coach => (
        <TrainerCard
          key={coach.id}
          name={coach.name}
          role={coach.role}
          avatar={coach.initials}
          tags={coach.specialties}
          sessions={coach.sessionCount}
          since={coach.memberSince}
          onClick={() => navigateToCoach(coach.id)}
        />
      ))}
    </CoachList>
  </Trenerteam>
  ```

- [ ] **API Integration**
  - `GET /api/coaches/my-team` - Mitt trenerteam
  - `GET /api/coaches/:id` - Coach detaljer
  - `GET /api/coaches/:id/sessions` - Coach sessions
  - `POST /api/messages` - Send melding til coach

- [ ] **Interaktivitet**
  - Switch tabs (Team / Økter / Meldinger)
  - Click coach -> Detail view
  - "Kontakt" knapp -> Åpne chat/email
  - View shared sessions

**Tidsestimert**: 1 dag

---

#### Skjerm 11: Arkiv (`/arkiv`)

- [ ] **Layout & Komponenter**
  ```jsx
  <Arkiv>
    <PageHeader
      title="Arkiv"
      subtitle="Historiske dokumenter"
    />
    <Tabs>
      <Tab label="2025" />
      <Tab label="2024" />
      <Tab label="2023" />
    </Tabs>

    <ArchiveList>
      {archives.map(item => (
        <ArchiveItem
          key={item.id}
          icon={item.icon}
          title={item.title}
          date={item.date}
          type={item.type} // plan, tests, tournaments, goals, notes
          onClick={() => openArchive(item.id)}
        />
      ))}
    </ArchiveList>
  </Arkiv>
  ```

- [ ] **API Integration**
  - `GET /api/archives?year=2025` - Hent arkiv for år
  - `GET /api/archives/:id` - Åpne arkiverte dokument
  - `GET /api/archives/:id/download` - Last ned PDF

- [ ] **Interaktivitet**
  - Filter etter år
  - Search archives
  - Click -> View/download
  - Export as PDF

**Tidsestimert**: 1 dag

---

#### Skjerm 12: Notater (`/notater`)

- [ ] **Layout & Komponenter**
  ```jsx
  <Notater>
    <PageHeader
      title="Treningsdagbok"
      subtitle="Dine notater og refleksjoner"
    />
    <Tabs>
      <Tab label="Alle" />
      <Tab label="Trening" />
      <Tab label="Turnering" />
      <Tab label="Refleksjon" />
    </Tabs>

    <NoteList>
      {notes.map(note => (
        <NoteCard
          key={note.id}
          date={note.date}
          mood={note.mood} // emoji
          content={note.content}
          tags={note.tags}
          onClick={() => openNote(note.id)}
        />
      ))}
    </NoteList>

    <AddNoteButton onClick={openAddNoteModal} />
  </Notater>
  ```

- [ ] **API Integration**
  - `GET /api/notes` - Hent alle notater
  - `GET /api/notes/:id` - Detaljer
  - `POST /api/notes` - Opprett notat
  - `PUT /api/notes/:id` - Oppdater
  - `DELETE /api/notes/:id` - Slett

- [ ] **Interaktivitet**
  - Filter etter kategori
  - Rich text editor for notater
  - Mood selector (emoji picker)
  - Tag management
  - Search notater

**Tidsestimert**: 1.5 dager

---

#### Skjerm 13: Profil (`/profil`)

- [ ] **Layout & Komponenter**
  ```jsx
  <Profil>
    <Card>
      <ProfileHeader
        avatar="ON"
        name="Ola Nordmann"
        category="B"
        club="AK Golf Academy"
        team="Team Norway"
      />
    </Card>

    <Card title="Statistikk 2025">
      <StatRow label="Snittscore" value="74.2" />
      <StatRow label="Treningstimer" value="456t" />
      <StatRow label="Turneringer" value="12" />
      <StatRow label="Tester bestått" value="12/20" />
    </Card>

    <Card title="Innstillinger">
      <SettingItem
        icon="⚙️"
        label="Preferanser"
        onClick={() => navigate('/settings/preferences')}
      />
      <SettingItem
        icon="🔔"
        label="Notifikasjoner"
        onClick={() => navigate('/settings/notifications')}
      />
      <SettingItem
        icon="🔒"
        label="Personvern"
        onClick={() => navigate('/settings/privacy')}
      />
    </Card>

    <Button
      variant="secondary"
      onClick={handleLogout}
    >
      Logg ut
    </Button>
  </Profil>
  ```

- [ ] **API Integration**
  - `GET /api/players/me` - Min profil
  - `PUT /api/players/me` - Oppdater profil
  - `GET /api/players/me/stats` - Statistikk
  - `POST /api/auth/logout` - Logg ut

- [ ] **Interaktivitet**
  - Edit profile modal
  - Upload avatar
  - Change password
  - Manage notifications
  - Privacy settings
  - Logout confirmation

**Tidsestimert**: 1 dag

**Total Uke 5**: Øvelser, Trenerteam, Arkiv, Notater, Profil

---

## FASE 3: ADVANCED FEATURES (Uke 6-7)

**Mål**: Implementer avanserte funksjoner og integrasjoner

### Uke 6: Media & Real-time

#### Media Pipeline (Video/Image Upload)

- [ ] **Implementer Media Upload**
  - Integrer med `/api/media/upload` endpoint
  - Direct S3 upload flow:
    1. Request signed URL fra API
    2. Upload direkte til S3
    3. Finalize upload via API
  - Progress indicator
  - Error handling og retry logic

- [ ] **Video Player**
  - Integrer video player (react-player eller native video)
  - Playback controls (play, pause, seek, volume)
  - Fullscreen support
  - Thumbnail generation

- [ ] **Image Gallery**
  - Grid layout for bilder
  - Lightbox view
  - Zoom og pan
  - Delete funksjonalitet

- [ ] **Camera Integration**
  - Capture video fra device camera
  - Capture image fra device camera
  - Permission handling

**Tidsestimert**: 3 dager

---

#### Real-time Features

- [ ] **WebSocket Connection**
  - Koble til backend WebSocket
  - Handle connection/disconnection
  - Reconnect logic

- [ ] **Push Notifications**
  - Integrer push notification service
  - Request permissions
  - Handle notification click
  - Badge counts

- [ ] **Live Updates**
  - Real-time session updates
  - Coach messages
  - Achievement unlocks
  - Leaderboard changes

**Tidsestimert**: 2 dager

---

### Uke 7: Offline & Performance

#### Offline Functionality

- [ ] **Service Worker**
  - Registrer service worker
  - Cache static assets
  - Cache API responses
  - Offline fallback page

- [ ] **Local Storage**
  - Cache user data
  - Cache session templates
  - Cache exercises
  - Sync strategy (background sync)

- [ ] **IndexedDB**
  - Store large datasets (benchmarks, notes)
  - Query local data
  - Sync with backend når online

**Tidsestimert**: 2 dager

---

#### Performance Optimization

- [ ] **Code Splitting**
  - Lazy load routes
  - Lazy load heavy components (charts, video)
  - Bundle analysis
  - Tree shaking

- [ ] **Image Optimization**
  - Responsive images
  - WebP format
  - Lazy loading
  - Blurhash placeholders

- [ ] **API Optimization**
  - Request batching
  - Debouncing search
  - Caching strategies
  - Pagination for lists

**Tidsestimert**: 2 dager

---

#### Charts & Visualizations

- [ ] **Recharts Integration**
  - Bar charts (daily hours)
  - Line charts (benchmark history)
  - Radar charts (test profile)
  - Pie charts (category breakdown)
  - Responsive charts
  - Tooltips og legends
  - Export chart as image

**Tidsestimert**: 1 dag

---

## FASE 4: POLISH & TESTING (Uke 8-9)

**Mål**: Testing, bug fixes, polish

### Uke 8: Testing

#### Unit Testing

- [ ] **Component Tests** (Vitest + React Testing Library)
  - Test alle UI komponenter
  - Test interactions (click, input, etc.)
  - Test edge cases
  - Snapshot testing
  - Coverage target: 80%+

- [ ] **Hook Tests**
  - Test custom hooks
  - Test state management
  - Test API integration hooks

- [ ] **Utility Tests**
  - Test helper functions
  - Test date formatting
  - Test calculations

**Tidsestimert**: 3 dager

---

#### Integration Testing

- [ ] **API Integration Tests**
  - Test API calls
  - Mock API responses
  - Test error handling
  - Test authentication flow
  - Test CRUD operations

- [ ] **E2E Tests** (Cypress eller Playwright)
  - Test kritiske user flows:
    - Login → Dashboard → Kalender → Book session
    - View tests → Add test result → View benchmark
    - Add goal → Track progress → Mark complete
    - Upload media → View gallery
  - Cross-browser testing (Chrome, Safari, Firefox)

**Tidsestimert**: 2 dager

---

### Uke 9: Polish & Bug Fixes

#### UI/UX Polish

- [ ] **Animations & Transitions**
  - Smooth page transitions
  - Loading skeletons
  - Micro-interactions
  - Gesture animations (swipe, pull-to-refresh)

- [ ] **Accessibility**
  - ARIA labels
  - Keyboard navigation
  - Screen reader testing
  - Color contrast (WCAG AA)
  - Focus indicators

- [ ] **Responsive Design**
  - Test på alle skjermstørrelser (320px - 428px)
  - Test på tablet (iPad)
  - Test landscape orientation
  - Safe area insets (iPhone notch)

**Tidsestimert**: 2 dager

---

#### Bug Fixes & Refinement

- [ ] **Bug Triage**
  - Lag bug tracker (GitHub Issues eller Jira)
  - Prioriter bugs (Critical, High, Medium, Low)
  - Assign og fix bugs

- [ ] **Performance Testing**
  - Lighthouse audit (target: 90+ score)
  - Bundle size analysis (target: < 500KB)
  - Load time testing (target: < 3s)

- [ ] **User Acceptance Testing**
  - Test med ekte brukere (trenere + spillere)
  - Samle feedback
  - Iterér på UX issues

**Tidsestimert**: 3 dager

---

## FASE 5: DEPLOYMENT (Uke 10)

**Mål**: Deploy til production og lansering

### Production Deployment

#### Backend Deployment

- [ ] **Setup Production Environment**
  - Provision AWS/GCP/Azure resources
  - Setup PostgreSQL database (RDS eller Supabase)
  - Setup Redis (ElastiCache eller Upstash)
  - Setup S3 buckets
  - Setup SQS queues

- [ ] **Environment Variables**
  - Setup secrets management (AWS Secrets Manager, Doppler)
  - Configure production environment variables
  - Setup SSL certificates

- [ ] **Deploy Services**
  - Deploy Fastify API (Railway, Render, eller AWS ECS)
  - Deploy workers (background jobs)
  - Setup load balancer
  - Setup CDN (CloudFront eller Cloudflare)

- [ ] **Database Migration**
  - Run production migrations
  - Seed initial data (categories, requirements, etc.)
  - Backup strategy

**Tidsestimert**: 2 dager

---

#### Frontend Deployment

- [ ] **Build & Optimize**
  - Production build (`npm run build`)
  - Verify bundle size
  - Test production build locally

- [ ] **Progressive Web App (PWA)**
  - Generate manifest.json
  - Setup service worker
  - Add to homescreen prompt
  - Offline fallback

- [ ] **Deploy Frontend**
  - Deploy til Vercel/Netlify/Cloudflare Pages
  - Setup custom domain
  - Configure SSL
  - Setup CDN caching

**Tidsestimert**: 1 dag

---

#### Mobile App (Optional - hvis native)

- [ ] **iOS App (React Native eller Capacitor)**
  - Setup Xcode project
  - Configure app icons og splash screens
  - Setup push notification certificates
  - TestFlight beta distribution
  - App Store submission

- [ ] **Android App (React Native eller Capacitor)**
  - Setup Android Studio project
  - Configure app icons og splash screens
  - Setup FCM for push notifications
  - Google Play Beta distribution
  - Play Store submission

**Tidsestimert**: 2 dager (hvis native)

---

#### Monitoring & Analytics

- [ ] **Setup Monitoring**
  - Error tracking (Sentry)
  - Performance monitoring (Sentry eller New Relic)
  - Uptime monitoring (UptimeRobot eller Better Uptime)
  - Log aggregation (Logtail eller Papertrail)

- [ ] **Setup Analytics**
  - User analytics (PostHog eller Mixpanel)
  - Event tracking (sessions, goals, tests)
  - Conversion funnels
  - Dashboard for metrics

**Tidsestimert**: 1 dag

---

#### Launch Checklist

- [ ] **Pre-launch**
  - [ ] All tests passing
  - [ ] No critical bugs
  - [ ] Performance benchmarks met
  - [ ] Security audit passed
  - [ ] Backup strategy in place
  - [ ] Rollback plan documented

- [ ] **Launch Day**
  - [ ] Deploy to production
  - [ ] Verify all endpoints working
  - [ ] Test critical flows
  - [ ] Monitor error rates
  - [ ] Monitor performance metrics

- [ ] **Post-launch**
  - [ ] Monitor for 24 hours
  - [ ] Fix critical issues immediately
  - [ ] Gather user feedback
  - [ ] Plan iteration 1

**Tidsestimert**: 1 dag

---

## 📈 SUKSESSMÅLINGER (KPIs)

### Technical KPIs
- **Performance**
  - Lighthouse score: 90+
  - Time to Interactive: < 3s
  - Bundle size: < 500KB gzipped

- **Quality**
  - Test coverage: 80%+
  - Zero critical bugs at launch
  - Uptime: 99.9%

- **User Experience**
  - Session completion rate: 90%+
  - Crash rate: < 1%
  - User satisfaction: 4.5+ stars

### Business KPIs
- **Adoption**
  - 50+ active users first month
  - 80% retention after 30 days
  - 10+ sessions per user per week

- **Engagement**
  - Daily active users (DAU): 30+
  - Weekly active users (WAU): 50+
  - Average session length: 5+ min

---

## 🛠️ VERKTØY & TEKNOLOGIER

### Development
- **Code Editor**: VS Code
- **Version Control**: Git + GitHub
- **Package Manager**: pnpm
- **Task Runner**: Turborepo
- **API Testing**: Thunder Client / Postman

### Frontend
- **Framework**: React 18.2
- **Build Tool**: Vite 5.0
- **Styling**: Tailwind CSS 3.4
- **Charts**: Recharts 2.10
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **State**: React Context / Zustand

### Backend
- **Framework**: Fastify
- **Database**: PostgreSQL 16
- **ORM**: Prisma
- **Cache**: Redis 7
- **Queue**: AWS SQS
- **Storage**: AWS S3

### Testing
- **Unit**: Vitest
- **E2E**: Playwright
- **Coverage**: c8

### Deployment
- **Frontend**: Vercel/Netlify
- **Backend**: Railway/Render
- **Database**: Supabase/AWS RDS
- **Monitoring**: Sentry
- **Analytics**: PostHog

---

## 📋 TEAM & ROLLER (hvis relevant)

### Roller som trengs
- **Frontend Developer** (primær)
- **Backend Developer** (support/maintenance)
- **UI/UX Designer** (konsulent for feedback)
- **QA Tester** (for user acceptance testing)
- **DevOps** (for deployment)

### Alternativ: Solo Developer
Hvis du jobber alene, prioriter:
1. **Uke 1-5**: Frontend implementation (kjernefunksjonalitet)
2. **Uke 6-7**: Advanced features (media, offline)
3. **Uke 8-9**: Testing og polish
4. **Uke 10**: Deployment

---

## 🎯 PRIORITERING

### Must-Have (MVP)
- ✅ Alle 13 skjermer implementert
- ✅ API integration fungerende
- ✅ Autentisering og brukerdata
- ✅ Design System v2.1 konsekvent
- ✅ Responsive design
- ✅ Basic offline support

### Nice-to-Have
- Video upload og playback
- Push notifications
- Real-time updates
- Advanced charts
- PWA features

### Future Iterations
- Native mobile apps (iOS/Android)
- Coach collaboration features
- AI training recommendations (mer avansert)
- Social features (feed, comments)
- Integrasjoner (Strava, Apple Health, Trackman)

---

## 📞 NESTE STEG - ACTION ITEMS

### Umiddelbart (i dag)
1. [ ] Review denne planen
2. [ ] Bestem om du vil følge planen eller justere
3. [ ] Opprett GitHub Project board
4. [ ] Setup development environment (`make dev`)

### Denne uken
5. [ ] Start på komponentbibliotek (Uke 1)
6. [ ] Implementer Button, Card, Badge komponenter
7. [ ] Setup routing og navigation
8. [ ] Implementer AppShell og BottomNav

### Neste uke
9. [ ] Implementer Dashboard (første skjerm)
10. [ ] Test API integration
11. [ ] Begynn på Kalender

---

## 📝 OPPSUMMERING

**Total utviklingstid**: 10 uker (2.5 måneder)
**Estimert effort**: 400 timer
**Kompleksitet**: Moderat til høy
**Risk areas**: Media processing, offline sync, deployment

**Biggest wins**:
- Backend er 100% komplett ✅
- Design system er klar ✅
- Mockups viser eksakt hva som skal bygges ✅

**Biggest challenges**:
- Migrere 22 eksisterende komponenter til nytt design
- Implementere 13 nye skjermer
- Testing og QA
- Deployment og monitoring

**Anbefaling**: Start med Fase 1 (Foundation) og få komponentbiblioteket på plass først. Dette gir deg reusable building blocks for alle 13 skjermer, og gjør resten av utviklingen mye raskere.

---

**Lykke til med utviklingen! 🚀**

*Har du spørsmål eller vil diskutere planen, gi meg beskjed!*
