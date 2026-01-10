# Nåværende implementeringsstatus

> Detaljert analyse av hva som er bygget og hva som mangler

---

## Executive Summary

Arkitekturen er **95% ferdig bygget** men **funksjonelt inaktiv** fordi:

1. ✅ All konfigurasjon er komplett og dokumentert
2. ✅ Database schema er på plass
3. ✅ API endpoints er implementert
4. ✅ React infrastruktur er klar
5. ❌ **App.jsx hardkodet til golf**
6. ❌ **Data-modeller tracker ikke sport**
7. ❌ **UI konsumerer ikke sport context**
8. ❌ **Feature flags ikke implementert**

---

## 1. Backend status

### ✅ Fullstendig implementert

#### Database (Prisma Schema)
```prisma
// apps/api/prisma/schema.prisma

enum SportId {
  GOLF
  RUNNING
  HANDBALL
  FOOTBALL
  TENNIS
  SWIMMING
  JAVELIN
}

model Tenant {
  sportId  SportId @default(GOLF)
  // ... andre felt
}

model SportConfig {
  id                    String   @id @default(cuid())
  tenantId              String   @unique
  sportId               SportId  @default(GOLF)

  // Override felt
  trainingAreasOverride Json?
  environmentsOverride  Json?
  phasesOverride        Json?
  benchmarksOverride    Json?
  terminologyOverride   Json?
  navigationOverride    Json?

  // Feature flags
  usesHandicap          Boolean  @default(true)
  usesClubSpeed         Boolean  @default(true)
  usesSG                Boolean  @default(true)
  usesAKFormula         Boolean  @default(true)
  usesBenchmarks        Boolean  @default(true)

  // Branding
  primaryColor          String?
  secondaryColor        String?
  logoUrl               String?

  // Relasjoner
  tenant                Tenant   @relation(...)
}
```

#### API Routes
```
GET  /api/v1/sport-config/sports     → Liste over tilgjengelige idretter
GET  /api/v1/sport-config            → Hent tenant's sport config
PUT  /api/v1/sport-config            → Oppdater sport config (admin)
DELETE /api/v1/sport-config          → Reset til default (admin)
GET  /api/v1/sport-config/all        → Alle configs (admin)
GET  /api/v1/sport-config/by-sport/:id → Filter per sport (admin)
```

#### Service Layer
- `SportConfigService` klasse med full CRUD
- Merger API-overrides med statisk config
- Proper feilhåndtering

### ❌ Mangler i backend

1. **Ingen `sportId` på data-tabeller:**
   ```prisma
   // MANGLER på disse modellene:
   model TrainingSession {
     // sportId SportId @default(GOLF)  ← MANGLER
   }
   model Event {
     // sportId SportId @default(GOLF)  ← MANGLER
   }
   model Test {
     // sportId SportId @default(GOLF)  ← MANGLER
   }
   model Goal {
     // sportId SportId @default(GOLF)  ← MANGLER
   }
   ```

2. **Ingen API for å bytte sport:**
   ```
   PATCH /api/v1/tenant/sport  ← MANGLER
   ```

3. **Ingen sport-filtrering i queries**

---

## 2. Frontend status

### ✅ Sport-konfigurasjoner (100% ferdig)

**Totalt: 5,254 linjer kode**

| Fil | Linjer | Innhold |
|-----|--------|---------|
| `types.ts` | 470 | Alle TypeScript interfaces |
| `index.ts` | 98 | Registry og hjelpefunksjoner |
| `golf.config.ts` | 907 | Golf konfigurasjon |
| `running.config.ts` | 850 | Løping konfigurasjon |
| `handball.config.ts` | 900 | Håndball konfigurasjon |
| `football.config.ts` | 850 | Fotball konfigurasjon |
| `tennis.config.ts` | 800 | Tennis konfigurasjon |
| `swimming.config.ts` | 750 | Svømming konfigurasjon |
| `javelin.config.ts` | 700 | Spydkast konfigurasjon |

Hver konfigurasjon inneholder:
- Treningsområder med gruppering
- Miljøer (inne/ute/blandet)
- Treningsfaser
- Intensitetsnivåer
- Pressnivåer
- Målkategorier med ikoner
- Ytelsesmetriker med benchmarks
- Testprotokoller (20+ per sport)
- Terminologi (NO/EN)
- Navigasjon og hurtighandlinger

### ✅ React Context (100% ferdig)

**Fil:** `src/contexts/SportContext.tsx` (385 linjer)

```tsx
// Providers
<SportProvider sportId="golf">     // Statisk config
<ApiSportProvider>                  // Henter fra API

// Hooks
useSport()      // Strict - krever provider
useSportSafe()  // Safe - fallback til Golf

// Context verdi
{
  // Data
  trainingAreas, environments, phases,
  intensityLevels, pressureLevels, goals,
  testProtocols, metrics, terminology,

  // Hjelpefunksjoner
  getTrainingArea(id),
  getEnvironment(id),
  getTerm(key),

  // Metadata
  sportId, isGolf
}
```

### ✅ API-klient (100% ferdig)

**Fil:** `src/services/api.ts`

```typescript
sportConfigAPI = {
  getSports(),      // Hent liste over idretter
  getConfig(),      // Hent tenant config
  updateConfig(),   // Oppdater config
  resetConfig(),    // Reset til default
  getAllConfigs(),  // Admin: alle configs
  getBySport()      // Admin: filter per sport
}
```

### ✅ Hooks (100% ferdig)

**Fil:** `src/hooks/useSportConfig.ts` (206 linjer)
```typescript
useSportConfig()    // Hent og merg config fra API
useSportFeatures()  // Hent feature flags
```

**Fil:** `src/hooks/useTrainingConfig.ts`
```typescript
useTrainingConfig()   // Treningsdata
useGoalCategories()   // Målkategorier
useTestConfig()       // Testprotokoller
```

### ❌ Kritisk mangel: App.jsx

**Fil:** `src/App.jsx` (linje 14)

```jsx
// NÅVÆRENDE (hardkodet):
<SportProvider sportId="golf">
  {/* All app content */}
</SportProvider>

// BURDE VÆRE:
<ApiSportProvider>
  {/* All app content */}
</ApiSportProvider>
```

### ❌ Lav adoptering i komponenter

**Kun 3 komponenter bruker sport context:**

1. `Maalsetninger.tsx` - bruker `useGoalCategories()`
2. `TestDetailPage.tsx` - bruker sport-aware test data
3. `CommandPalette.tsx` - sport-aware commands

**Komponenter som BURDE bruke sport context:**

| Komponent | Hva den trenger |
|-----------|-----------------|
| `LoggTreningContainer.jsx` | Treningsområder, miljøer, intensitet |
| `ExerciseLibrary.jsx` | Øvelser per sport |
| `AnalyseHub.tsx` | Metriker, benchmarks |
| `AnalyseStatistikkHub.tsx` | Sport-spesifikk statistikk |
| `AnalyseTesterHub.tsx` | Testprotokoller |
| `FocusCard.tsx` | Terminologi, metriker |
| `ProfileOverviewCard.tsx` | Sport-indikator |
| `QuickActions.tsx` | Sport-spesifikke handlinger |
| `Header.tsx` | Sport-logo, navn |
| Dashboard-komponenter | Alt ovenfor |

---

## 3. Implementeringsmatrise

### Tier 1: Fundament (95% ferdig)
- [x] Type-definisjoner og interfaces
- [x] Sport-konfigurasjonsfiler (alle 7)
- [x] React Context system
- [x] API endpoints og routes
- [x] Service layer
- [x] Database schema
- [x] Database migreringer
- [x] API-klient metoder
- [ ] **App-level provider setup** ← BLOKKERER

### Tier 2: Integrasjon (5% ferdig)
- [ ] App initialisering med ApiSportProvider
- [ ] Sport selection UI for admins
- [ ] Sport switching endpoints
- [ ] Feature flag integrasjon i UI
- [ ] Betinget rendering basert på sport
- [ ] Test form customization per sport
- [ ] Goal categories per sport
- [ ] Training session UI med sport awareness
- [ ] Player sport preference storage

### Tier 3: Data Layer (0% ferdig)
- [ ] Sport tracking i TrainingSession
- [ ] Sport tracking i Event
- [ ] Sport tracking i Test results
- [ ] Sport tracking i Exercise
- [ ] Sport-spesifikk validering
- [ ] Data queries per sport
- [ ] Sport-basert filtrering i dashboards
- [ ] Cross-sport compatibility checks
- [ ] Sport migration/change handling

### Tier 4: Avanserte features (0% ferdig)
- [ ] Multi-sport per bruker
- [ ] Coach team sport assignments
- [ ] Equipment management per sport
- [ ] Custom benchmarks per sport
- [ ] Sport-spesifikke rapporter
- [ ] Inter-sport sammenligning
- [ ] Sport-spesifikk AI coaching
- [ ] Sport-spesifikke notifications

---

## 4. Arkitekturdiagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  App.jsx                                                         │
│    │                                                             │
│    └── SportProvider (HARDKODET: golf)  ← PROBLEM!              │
│          │                                                       │
│          ├── SportContext                                        │
│          │     │                                                 │
│          │     ├── useSport()                                    │
│          │     └── useSportSafe()                                │
│          │                                                       │
│          └── Komponenter (kun 3 bruker context)                  │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  src/config/sports/                                              │
│    ├── index.ts (registry)                                       │
│    ├── types.ts (interfaces)                                     │
│    └── [sport].config.ts (7 filer)                              │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  src/services/api.ts                                             │
│    └── sportConfigAPI                                            │
│          │                                                       │
│          └── HTTP kall til backend                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  /api/v1/sport-config/*                                          │
│    │                                                             │
│    └── SportConfigService                                        │
│          │                                                       │
│          └── Prisma (SportConfig model)                          │
│                │                                                 │
│                └── Database                                      │
│                      │                                           │
│                      ├── Tenant.sportId ✓                        │
│                      ├── SportConfig ✓                           │
│                      │                                           │
│                      ├── TrainingSession.sportId ✗ MANGLER       │
│                      ├── Event.sportId ✗ MANGLER                 │
│                      ├── Test.sportId ✗ MANGLER                  │
│                      └── Goal.sportId ✗ MANGLER                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. Teknisk gjeld

### Golf-sentrisk terminologi hardkodet

Flere steder bruker "golf" eller golf-termer direkte:

```javascript
// Eksempler funnet i kodebasen:

// Email-referanser
"akgolf.no"

// Proof-beskrivelser
"golfer"

// Treningsområde-navn
"Tee Total", "Putting", "Short Game"

// Test-definisjoner
"/src/features/tests/config/testDefinitions.ts"  // Kun golf-tester
```

### Feature flags definert men ikke brukt

```typescript
// Definert i SportConfig:
usesHandicap: boolean
usesClubSpeed: boolean
usesSG: boolean
usesAKFormula: boolean
usesBenchmarks: boolean

// Men ingen steder i UI sjekker:
if (sport.features.usesHandicap) { ... }
```

### Begrenset komponent-adopsjon

- Kun 3 av ~50+ komponenter bruker sport context
- Ingen konsistent mønster for sport-aware komponenter
