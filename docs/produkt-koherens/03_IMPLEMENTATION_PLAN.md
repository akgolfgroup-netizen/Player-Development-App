# Implementeringsplan

> Dette dokumentet fylles ut etter at beslutningene i `02_CRITICAL_DECISIONS.md` er tatt.

**Status:** VENTER PÅ BESLUTNINGER

---

## Avhengigheter mellom beslutninger

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   [1. Plan regenerering]                                        │
│           │                                                     │
│           ▼                                                     │
│   [3. Test → handling] ◄──────┐                                 │
│           │                   │                                 │
│           ▼                   │                                 │
│   [4. Øvelsesprogresjon]      │                                 │
│                               │                                 │
│   [2. Mål-validering] ────────┘                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Beslutning 1 påvirker 3: Hva som skjer når tester viser fremgang
                          avhenger av om planen kan regenereres.

Beslutning 2 påvirker 3: Mål-validering kan bruke samme
                          progresjonsdata som test→handling.

Beslutning 3 påvirker 4: Hvis tester trigger kategori-opprykk,
                          må øvelser filtreres deretter.
```

---

## Mal for implementeringsplan

### Fase 1: Grunnlag (etter beslutninger)

| Oppgave | Beslutning | Estimat | Avhengigheter |
|---------|-----------|---------|---------------|
| TBD | # | - | - |

### Fase 2: Kjernefunksjonalitet

| Oppgave | Beslutning | Estimat | Avhengigheter |
|---------|-----------|---------|---------------|
| TBD | # | - | - |

### Fase 3: Integrasjon

| Oppgave | Beslutning | Estimat | Avhengigheter |
|---------|-----------|---------|---------------|
| TBD | # | - | - |

---

## Filer som sannsynligvis må endres

Basert på gap-analysen, uavhengig av beslutninger:

### Backend (apps/api/src/)

```
domain/training-plan/
├── plan-generation.service.ts      # Plan regenerering
├── plan-progress.service.ts        # Test → handling
├── session-selection.service.ts    # Øvelsesprogresjon
└── [NY] plan-adaptation.service.ts # Adaptiv logikk

api/v1/goals/
├── service.ts                      # Mål-validering
├── schema.ts                       # Validerings-regler
└── [NY] goal-feasibility.ts        # Kategori-sjekk

domain/tests/
├── test-calculator.ts              # Eksisterende
└── [NY] test-trigger.service.ts    # Test → handling

domain/exercises/
└── [NY] exercise-progression.ts    # Øvelsesprogresjon
```

### Frontend (apps/web/src/)

```
features/goals/
├── GoalsPage.tsx                   # Advarsel-UI
└── [NY] GoalFeasibilityWarning.tsx # Validerings-feedback

features/training-plan/
└── [NY] PlanAdaptationNotice.tsx   # Forslags-UI

components/
└── [NY] ProgressionIndicator.tsx   # Vise progresjon
```

### Database (apps/api/prisma/)

```
schema.prisma
├── [ENDRE] Goal                    # Legge til feasibility-felt
├── [NY] ExerciseProgression        # Kjede-modell (hvis valgt)
└── [NY] PlanAdaptationLog          # Logg av endringer
```

---

## Når beslutninger er tatt

1. Kopier valgte alternativer hit
2. Detaljér implementeringsoppgaver
3. Sett rekkefølge basert på avhengigheter
4. Estimer kompleksitet (S/M/L/XL)
5. Tildel ansvar

---

*Sist oppdatert: 2026-01-02*
