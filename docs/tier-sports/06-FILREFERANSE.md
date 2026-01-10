# Filreferanse

> Komplett liste over alle relevante filer for multi-sport implementering

---

## Frontend - Konfigurasjon

### Sport-konfigurasjoner
```
apps/web/src/config/sports/
├── index.ts              # Registry, getSportConfig(), getAvailableSports()
├── types.ts              # Alle TypeScript interfaces (470 linjer)
├── golf.config.ts        # Golf konfigurasjon (907 linjer)
├── running.config.ts     # Løping konfigurasjon (~850 linjer)
├── handball.config.ts    # Håndball konfigurasjon (~900 linjer)
├── football.config.ts    # Fotball konfigurasjon (~850 linjer)
├── tennis.config.ts      # Tennis konfigurasjon (~800 linjer)
├── swimming.config.ts    # Svømming konfigurasjon (~750 linjer)
└── javelin.config.ts     # Spydkast konfigurasjon (~700 linjer)
```

---

## Frontend - Context og Hooks

### SportContext
```
apps/web/src/contexts/SportContext.tsx     # 385 linjer
  - SportContext (React Context)
  - SportProvider (statisk config)
  - ApiSportProvider (henter fra API)
  - useSport() hook (strict)
  - useSportSafe() hook (med fallback)
```

### Hooks
```
apps/web/src/hooks/
├── useSportConfig.ts        # API-integrasjon (206 linjer)
│   - useSportConfig()       # Hent og merg config
│   - useSportFeatures()     # Hent feature flags
│
└── useTrainingConfig.ts     # Trenings-spesifikke hooks
    - useTrainingConfig()
    - useGoalCategories()
    - useTestConfig()
```

---

## Frontend - App Setup

### Kritisk fil (hardkodet til Golf)
```
apps/web/src/App.jsx         # Linje ~14: SportProvider sportId="golf"
```

---

## Frontend - API-klient

```
apps/web/src/services/api.ts
  - sportConfigAPI.getSports()
  - sportConfigAPI.getConfig()
  - sportConfigAPI.updateConfig()
  - sportConfigAPI.resetConfig()
  - sportConfigAPI.getAllConfigs()
  - sportConfigAPI.getBySport()
```

---

## Frontend - Komponenter som bruker sport context

### Aktive (bruker allerede)
```
apps/web/src/features/goals/Maalsetninger.tsx
apps/web/src/features/tests/pages/TestDetailPage.tsx
apps/web/src/components/CommandPalette.tsx
```

### Må oppdateres
```
apps/web/src/features/trening-plan/LoggTreningContainer.jsx
apps/web/src/features/sessions/ExerciseLibrary.jsx
apps/web/src/features/analyse/AnalyseHub.tsx
apps/web/src/features/analyse/AnalyseStatistikkHub.tsx
apps/web/src/features/analyse/AnalyseTesterHub.tsx
apps/web/src/components/dashboard/FocusCard.tsx
apps/web/src/components/dashboard/ProfileOverviewCard.tsx
apps/web/src/components/dashboard/QuickActions.tsx
apps/web/src/components/shadcn/golf/goal-progress.tsx
apps/web/src/components/shadcn/golf/player-stat-card.tsx
```

---

## Backend - Database

### Prisma Schema
```
apps/api/prisma/schema.prisma
  - enum SportId (linje ~XX)
  - model Tenant.sportId (linje ~XX)
  - model SportConfig (linje ~XX)
```

### Migreringer
```
apps/api/prisma/migrations/
├── 20260109_add_multi_sport_support/    # Eksisterende
│   └── migration.sql
│
└── [NY] add_sport_to_data_models/       # Må lages (Fase 2)
    └── migration.sql
```

---

## Backend - API Routes

### Sport Config
```
apps/api/src/api/v1/sport-config/
├── index.ts      # Export
├── routes.ts     # 6 endpoints
└── service.ts    # SportConfigService klasse
```

### Andre routes som må oppdateres (Fase 2)
```
apps/api/src/api/v1/sessions/
├── routes.ts     # Legg til sportId filter
└── service.ts    # Oppdater queries

apps/api/src/api/v1/events/
├── routes.ts
└── service.ts

apps/api/src/api/v1/tests/
├── routes.ts
└── service.ts

apps/api/src/api/v1/goals/
├── routes.ts
└── service.ts
```

---

## Frontend - Nye filer å lage

### Fase 1: Idrettsvelger
```
apps/web/src/components/sport/
├── SportSelector.tsx         # Dropdown for å velge idrett
├── SportIndicator.tsx        # Viser nåværende idrett i header
└── SportSwitcher.tsx         # Komplett bytte-komponent
```

### Fase 3: Gjenbrukbare selects
```
apps/web/src/components/sport/
├── TrainingAreaSelect.tsx    # Velg treningsområde
├── EnvironmentSelect.tsx     # Velg miljø
├── IntensitySelect.tsx       # Velg intensitet
├── PhaseSelect.tsx           # Velg treningsfase
└── PressureSelect.tsx        # Velg pressnivå
```

---

## Tester

### Eksisterende
```
apps/web/tests/core-flows.spec.js
apps/web/tests/dom-injection.spec.js
```

### Nye å lage
```
apps/web/tests/sport-switching.spec.js     # E2E for idrettsbytte
apps/api/tests/sport-config.test.ts        # API-tester
```

---

## Konfigurasjon

### Tailwind (for farger)
```
apps/web/tailwind.config.js
  - Legg til sport-spesifikke farger hvis nødvendig
```

### Tier tokens
```
apps/web/src/styles/tier-tokens.css
  - Mulig å legge til sport-variabler her
```

---

## Dokumentasjon

```
docs/
├── tier-sports/                  # Denne mappen
├── architecture/
│   └── KOMPLETT_SYSTEMDOKUMENTASJON.md
└── integrations/
    └── DATAGOLF_IMPLEMENTATION_STATUS.md   # Golf-spesifikk
```

---

## Mappestruktur oversikt

```
IUP_Master_V1/
├── apps/
│   ├── web/                          # Frontend (React)
│   │   ├── src/
│   │   │   ├── App.jsx               # ⚠️ KRITISK: hardkodet golf
│   │   │   ├── config/
│   │   │   │   └── sports/           # ✅ 7 sport configs
│   │   │   ├── contexts/
│   │   │   │   └── SportContext.tsx  # ✅ Ferdig
│   │   │   ├── hooks/
│   │   │   │   ├── useSportConfig.ts # ✅ Ferdig
│   │   │   │   └── useTrainingConfig.ts
│   │   │   ├── services/
│   │   │   │   └── api.ts            # ✅ sportConfigAPI
│   │   │   ├── features/
│   │   │   │   ├── goals/            # Må oppdateres
│   │   │   │   ├── tests/            # Må oppdateres
│   │   │   │   ├── analyse/          # Må oppdateres
│   │   │   │   ├── trening-plan/     # Må oppdateres
│   │   │   │   └── sessions/         # Må oppdateres
│   │   │   └── components/
│   │   │       ├── dashboard/        # Må oppdateres
│   │   │       └── sport/            # NY mappe å lage
│   │   └── tests/
│   │
│   └── api/                          # Backend (Node/Express)
│       ├── prisma/
│       │   ├── schema.prisma         # ✅ SportId enum, SportConfig
│       │   └── migrations/
│       └── src/
│           └── api/v1/
│               ├── sport-config/     # ✅ Ferdig
│               ├── sessions/         # Må oppdateres
│               ├── events/           # Må oppdateres
│               ├── tests/            # Må oppdateres
│               └── goals/            # Må oppdateres
│
└── docs/
    └── tier-sports/                  # Denne dokumentasjonen
```

---

## Hurtigreferanse - Viktigste filer

| Prioritet | Fil | Handling |
|-----------|-----|----------|
| 1 | `apps/web/src/App.jsx` | Bytt til ApiSportProvider |
| 2 | `apps/api/prisma/schema.prisma` | Legg til sportId på modeller |
| 3 | `apps/web/src/contexts/SportContext.tsx` | Allerede klar |
| 4 | `apps/api/src/api/v1/sport-config/routes.ts` | Legg til switch endpoint |
| 5 | `apps/web/src/features/trening-plan/LoggTreningContainer.jsx` | Bruk sport context |
