# Plan: Ny STATISTIKK-fane - "Status & Progresjon"

## Oversikt

En ny fane under STATISTIKK som gir spilleren en helhetlig oversikt over sin nåværende status og fremgang mot målsetninger. Fanen fungerer som en "cockpit-view" hvor spilleren raskt kan se:

- **Hvor står jeg nå?** (Nåværende nivå og status)
- **Hvor skal jeg?** (Mål og targets)
- **Hvordan går det?** (Progresjon og trend)

---

## 1. Navigasjon & Rute

### Plassering i meny
```
STATISTIKK (hovedmeny)
├── Oversikt              (eksisterende - /statistikk)
├── Strokes Gained        (eksisterende - /statistikk/strokes-gained)
├── Testresultater        (eksisterende - /statistikk/testresultater)
└── Status & Mål          (NY - /statistikk/status)  ← DENNE
```

### Filer å endre
- `apps/web/src/config/navigation.js` - Legg til menyitem
- `apps/web/src/App.jsx` - Legg til route (~linje 679)

---

## 2. Sidestruktur & Layout

### Wireframe

```
┌─────────────────────────────────────────────────────────────────┐
│  STATUS & MÅL                                    [Oppdater] ⟳   │
│  Din progresjon mot målsetningene                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌────────────┐ │
│  │ TOTALT MÅL  │ │  INNSATS    │ │ FREMGANG    │ │ BREAKING   │ │
│  │   OPPNÅDD   │ │   SCORE     │ │   TREND     │ │  POINTS    │ │
│  │    45%      │ │    78%      │ │    ↑ +12    │ │   3 / 5    │ │
│  │ ▓▓▓▓▓░░░░░░ │ │ ▓▓▓▓▓▓▓▓░░░ │ │  siste 30d  │ │  løst      │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └────────────┘ │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────┬─────────────────────────────┐│
│  │      SKILL DNA RADAR          │   MÅL-PROGRESJON           ││
│  │                               │                             ││
│  │         Lengde               │   ◉ Handicap → 5.0          ││
│  │           ●                   │     ▓▓▓▓▓▓▓░░░  72%        ││
│  │    Fysisk   ●   Hastighet     │                             ││
│  │           ●                   │   ◉ Drive > 250m            ││
│  │    Putting   Presisjon        │     ▓▓▓▓▓░░░░░  53%        ││
│  │           ●                   │                             ││
│  │        Kortspill              │   ◉ GIR > 60%               ││
│  │                               │     ▓▓▓▓▓▓▓▓░░  85%        ││
│  │   [Se detaljer →]             │                             ││
│  └───────────────────────────────┴─────────────────────────────┘│
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  BREAKING POINTS STATUS                                         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ 🔴 Driver konsistens          Innsats: 85%  │ Resultat: 45%│  │
│  │    Mål: <15m spredning        ▓▓▓▓▓▓▓▓░     │ ▓▓▓▓░░░░░   │  │
│  │    Neste: Benchmark-test om 3 dager                       │  │
│  ├──────────────────────────────────────────────────────────┤   │
│  │ 🟡 Putting 3-6m               Innsats: 60%  │ Resultat: 60%│  │
│  │    Mål: >70% holing rate      ▓▓▓▓▓▓░░░░    │ ▓▓▓▓▓▓░░░   │  │
│  ├──────────────────────────────────────────────────────────┤   │
│  │ 🟢 Bunkerslag                 Innsats: 100% │ Resultat: 90%│  │
│  │    Mål: Sand save >40%        ▓▓▓▓▓▓▓▓▓▓    │ ▓▓▓▓▓▓▓▓▓░  │  │
│  │    ✓ Løst - Venter bekreftelse                            │  │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  STROKES GAINED TREND (12 uker)                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  +1.5 ─┐                                           ┌────  │   │
│  │        │     ┌──┐              ┌──┐     ┌──┐       │      │   │
│  │   0  ──┼─────┤  ├──┐     ┌────┤  ├─────┤  ├───────┤      │   │
│  │        │     └──┘  │  ┌──┤    └──┘     └──┘       └────  │   │
│  │  -0.5 ─┘           └──┘  └──                              │   │
│  │   Uke: 1   2   3   4   5   6   7   8   9  10  11  12     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌────────────────┬────────────────┬────────────────┐           │
│  │ TEE: +0.4      │ APPROACH: +0.8  │ PUTTING: -0.2  │           │
│  │ ↑ forbedring   │ ↑ stor framgang │ ↓ fokusområde  │           │
│  └────────────────┴────────────────┴────────────────┘           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Komponenter

### 3.1 Hovedkomponent: `StatusProgressPage.tsx`

```typescript
// apps/web/src/features/player-stats/StatusProgressPage.tsx

interface StatusProgressPageProps {}

export function StatusProgressPage() {
  // Henter data fra eksisterende hooks
  const { data: goals, isLoading: goalsLoading } = useGoals();
  const { data: insights, isLoading: insightsLoading } = usePlayerInsights();
  const { data: sgData, loading: sgLoading } = useStrokesGained();
  const { data: bpData, loading: bpLoading } = useBreakingPoints(); // NY HOOK

  return (
    <AppShellTemplate title="Status & Mål" subtitle="Din progresjon mot målsetningene">
      {/* KPI Stats Grid */}
      <StatsGridTemplate items={summaryStats} columns={4} />

      {/* Skill DNA + Goals */}
      <TwoColumnSection>
        <SkillDNAWidget data={insights?.skillDNA} compact />
        <GoalProgressList goals={goals?.goals} />
      </TwoColumnSection>

      {/* Breaking Points Status */}
      <BreakingPointsStatusCard breakingPoints={bpData} />

      {/* SG Trend */}
      <SGTrendChart data={sgData?.weeklyTrend} byCategory={sgData?.byCategory} />
    </AppShellTemplate>
  );
}
```

### 3.2 Nye komponenter å lage

| Komponent | Beskrivelse | Plassering |
|-----------|-------------|------------|
| `StatusProgressPage.tsx` | Hovedside | `features/player-stats/` |
| `GoalProgressList.tsx` | Liste med mål-progresjon | `components/goals/` |
| `BreakingPointsStatusCard.tsx` | BP status med effort/progress | `components/insights/` |
| `SGTrendChart.tsx` | SG trend-graf | `components/insights/` |
| `EffortProgressBar.tsx` | Dobbel progress-bar | `ui/composites/` |

### 3.3 Gjenbruk eksisterende

- `AppShellTemplate` - Sidelayout
- `StatsGridTemplate` - KPI-grid
- `SkillDNAWidget` - Radar-chart (allerede laget)
- `Card` - Kort-container
- `ProgressBar` - Enkel progress
- `Badge` - Status-badges

---

## 4. Datakilder & API

### Eksisterende endpoints (gjenbruk)
```
GET /api/v1/player-insights/skill-dna     → Skill DNA data
GET /api/v1/strokes-gained/current        → SG data med trend
GET /api/v1/goals                         → Spillerens mål
```

### Nye/oppdaterte endpoints
```
GET /api/v1/breaking-points               → Liste breaking points
GET /api/v1/breaking-points/:id/evidence  → Effort vs Progress (allerede laget!)
```

### Ny aggregerings-hook: `useStatusProgress.ts`
```typescript
// apps/web/src/hooks/useStatusProgress.ts

export function useStatusProgress() {
  const goals = useGoals();
  const insights = usePlayerInsights();
  const sg = useStrokesGained();
  const bp = useBreakingPoints();

  const summaryStats = useMemo(() => ({
    goalProgress: calculateOverallGoalProgress(goals.data),
    effortScore: calculateAverageEffort(bp.data),
    progressTrend: calculateProgressTrend(sg.data),
    bpResolved: countResolvedBP(bp.data),
  }), [goals.data, bp.data, sg.data]);

  return {
    isLoading: goals.isLoading || insights.isLoading || sg.loading || bp.loading,
    summaryStats,
    goals: goals.data,
    skillDNA: insights.data?.skillDNA,
    sgData: sg.data,
    breakingPoints: bp.data,
  };
}
```

---

## 5. Nøkkelkonsepter

### 5.1 Effort vs Progress (BP-Evidence)

**Kritisk distinksjon som må visualiseres:**

| Konsept | Beskrivelse | Måles av |
|---------|-------------|----------|
| **Effort (Innsats)** | Hvor mye spilleren har trent | Fullførte treningsøkter |
| **Progress (Fremgang)** | Faktisk forbedring målt | Benchmark-tester |

**Visualisering:**
```
Breaking Point: Driver konsistens
┌─────────────────────────────────────────┐
│ INNSATS  ▓▓▓▓▓▓▓▓░░  80%               │  ← Fra treningsøkter
│ FREMGANG ▓▓▓▓░░░░░░  40%               │  ← Fra benchmark-test
└─────────────────────────────────────────┘
Neste benchmark: 15. januar
```

### 5.2 Goal Progress Calculation

```typescript
interface GoalProgress {
  id: string;
  title: string;
  current: number;
  target: number;
  unit: string;
  percentComplete: number;
  trend: 'up' | 'down' | 'stable';
  daysRemaining?: number;
}

// Eksempel:
{
  title: "Handicap",
  current: 7.2,
  target: 5.0,
  unit: "hcp",
  percentComplete: 72, // (start - current) / (start - target)
  trend: 'up',
}
```

### 5.3 Status-indikatorer

| Farge | Betydning | Kriterier |
|-------|-----------|-----------|
| 🟢 Grønn | På track / Løst | Progress ≥ 80% |
| 🟡 Gul | Pågår | 30% ≤ Progress < 80% |
| 🔴 Rød | Trenger fokus | Progress < 30% eller effort >> progress |

---

## 6. Implementeringsplan

### Fase 1: Grunnstruktur
1. Opprett `StatusProgressPage.tsx` med AppShellTemplate
2. Legg til route i `App.jsx`
3. Legg til menyitem i `navigation.js`
4. Implementer `useBreakingPoints` hook (hent fra API)

### Fase 2: KPI-seksjon
1. Beregn summerte stats
2. Bruk StatsGridTemplate for visning
3. Koble til eksisterende data-hooks

### Fase 3: Skill DNA + Mål
1. Gjenbruk SkillDNAWidget (compact mode)
2. Lag GoalProgressList komponent
3. To-kolonne layout

### Fase 4: Breaking Points Status
1. Lag BreakingPointsStatusCard
2. Implementer EffortProgressBar (dobbel)
3. Vis pending transitions

### Fase 5: SG Trend
1. Lag SGTrendChart (12-ukers)
2. Kategori-breakdown
3. Trend-indikatorer

### Fase 6: Polish
1. Loading states (StateCard)
2. Error handling
3. Empty states
4. Responsiv design (mobil)

---

## 7. Tekniske detaljer

### Fil-struktur
```
apps/web/src/
├── features/player-stats/
│   ├── StatusProgressPage.tsx       ← NY
│   ├── PlayerStatsPage.tsx          (eksisterende)
│   └── ...
├── components/
│   ├── goals/
│   │   └── GoalProgressList.tsx     ← NY
│   └── insights/
│       ├── BreakingPointsStatusCard.tsx  ← NY
│       ├── SGTrendChart.tsx         ← NY
│       └── SkillDNAWidget.jsx       (eksisterende)
├── ui/composites/
│   └── EffortProgressBar.tsx        ← NY
└── hooks/
    ├── useStatusProgress.ts         ← NY
    ├── useBreakingPoints.ts         ← NY (om ikke finnes)
    └── useStrokesGained.js          (eksisterende)
```

### Avhengigheter
- Ingen nye npm-pakker nødvendig
- Gjenbruker Recharts for grafer (allerede installert)
- Bruker eksisterende design-tokens

---

## 8. Mobile-tilpasning

```
Mobil layout (< 768px):
┌─────────────────────┐
│ STATUS & MÅL        │
├─────────────────────┤
│ ┌─────┐ ┌─────┐     │
│ │ Mål │ │Inns.│     │  ← 2x2 grid
│ └─────┘ └─────┘     │
│ ┌─────┐ ┌─────┐     │
│ │Trend│ │ BP  │     │
│ └─────┘ └─────┘     │
├─────────────────────┤
│   SKILL DNA         │  ← Full width
│   (radar chart)     │
├─────────────────────┤
│   MINE MÅL          │  ← Full width
│   • Handicap 72%    │
│   • Drive    53%    │
├─────────────────────┤
│   BREAKING POINTS   │  ← Stacked cards
│   [BP Card 1]       │
│   [BP Card 2]       │
├─────────────────────┤
│   SG TREND          │
│   [Chart]           │
└─────────────────────┘
```

---

## 9. Suksesskriterier

- [ ] Spilleren kan se total måloppnåelse på én skjerm
- [ ] Tydelig skille mellom innsats og faktisk fremgang
- [ ] Breaking points viser effort vs progress separat
- [ ] Mål viser nåværende verdi vs target
- [ ] SG trend gir historisk kontekst
- [ ] Skill DNA viser styrker/svakheter visuelt
- [ ] Responsivt på mobil
- [ ] Loading/error states håndtert

---

## 10. Fremtidige utvidelser

1. **Sammenligning med kategori-gjennomsnitt**
   - Vis spillerens level vs kategori-krav

2. **Coach-notater integrasjon**
   - Vis siste coach-feedback på breaking points

3. **Prediksjon**
   - "Ved nåværende tempo når du målet om X uker"

4. **Historikk-view**
   - Se status fra tidligere datoer

5. **Eksport/deling**
   - Last ned status-rapport som PDF
