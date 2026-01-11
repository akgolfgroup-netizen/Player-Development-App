# Implementeringsplan: Spillerstyrt Årsplan-generering

**Opprettet:** 2026-01-08
**Status:** Planleggingsfase
**Eier:** Anders Kristiansen

---

## 📋 Oversikt

Implementere selvbetjent årsplan-generering for spillere, hvor spillere kan:
- Opprette egne årsplaner uten coach-involvering
- Velge treningsperioder (Etablering, Grunntrening, Spesialisering, Turnering)
- Sette ukentlig treningsfrekvens per periode
- Definere mål og fokusområder
- Få AI-baserte anbefalinger (fremtidig fase)
- Eksportere plan til kalender og PDF

---

## 🎯 Målsetninger

### Funksjonelle krav
1. **Selvbetjening**: Spillere kan lage årsplan uten coach
2. **Enkel wizard**: Steg-for-steg prosess (4-5 steg)
3. **Periodisering**: Standard periodiseringsmodell (E→G→S→T)
4. **Fleksibilitet**: Spillere kan tilpasse perioder og frekvenser
5. **Visualisering**: Tydelig grafisk fremstilling av årsplan
6. **Integrasjon**: Sync med kalender og treningslogg

### Ikke-funksjonelle krav
1. **Ytelse**: Plan genereres på < 2 sekunder
2. **UX**: Maksimalt 5 klikk fra start til ferdig plan
3. **Validering**: Sikre at perioder ikke overlapper
4. **Tilgjengelighet**: Fungerer på mobil og desktop
5. **Lagring**: Auto-save ved hvert steg

---

## 🏗️ Arkitektur

### Komponentstruktur

```
apps/web/src/features/player-annual-plan/
├── index.ts                              # Export entrypoint
├── PlayerAnnualPlanWizard.tsx            # Main wizard component
├── hooks/
│   ├── useAnnualPlanWizard.ts           # Wizard state management
│   ├── usePlayerAnnualPlan.ts           # CRUD operations
│   └── useAnnualPlanValidation.ts       # Validation logic
├── steps/
│   ├── Step1_BasicInfo.tsx              # Navn, startdato, sluttdato
│   ├── Step2_PeriodSelection.tsx        # Velg periodetyper (E/G/S/T)
│   ├── Step3_PeriodDetails.tsx          # Detaljer per periode
│   ├── Step4_GoalsAndFocus.tsx          # Mål og fokusområder
│   └── Step5_Review.tsx                 # Forhåndsvisning og bekreft
├── components/
│   ├── PeriodCard.tsx                   # Periode-konfigurasjonskort
│   ├── PeriodTimeline.tsx               # Grafisk tidslinje
│   ├── FrequencySelector.tsx            # Velg treningsfrekvens
│   ├── GoalInput.tsx                    # Legg til mål
│   ├── PlanSummary.tsx                  # Oppsummering av plan
│   └── PlanCalendarPreview.tsx          # Kalender-forhåndsvisning
└── utils/
    ├── periodDefaults.ts                # Standard verdier for periodetyper
    ├── planValidation.ts                # Valideringsregler
    └── planExport.ts                    # Eksport til PDF/iCal

apps/api/src/api/v1/players/
├── annual-plan-routes.ts                # Player annual plan endpoints
├── annual-plan-service.ts               # Business logic
└── annual-plan-validation.ts            # Server-side validation
```

---

## 📊 Database Schema

### Eksisterende tabeller (gjenbruk)
```prisma
model AnnualTrainingPlan {
  id                   String   @id @default(uuid())
  tenantId             String
  playerId             String
  coachId              String?  // NULL hvis player-generert
  name                 String
  startDate            DateTime
  endDate              DateTime

  // Periodisering
  periods              Json     // Array av Period objekter

  // Metadata
  status               String   @default("active") // active, completed, paused
  createdBy            String   // "player" eller "coach"
  lastModified         DateTime @updatedAt

  // Relations
  player               Player   @relation(fields: [playerId], references: [id])
  tenant               Tenant   @relation(fields: [tenantId], references: [id])

  @@unique([playerId, tenantId])
  @@index([playerId])
  @@index([tenantId])
}
```

### Period JSON struktur
```typescript
interface Period {
  id: string;                    // UUID
  type: 'E' | 'G' | 'S' | 'T';  // Etablering, Grunntrening, Spesialisering, Turnering
  name: string;                  // "Grunntrening 1"
  description?: string;          // Valgfri beskrivelse
  startDate: string;             // ISO date
  endDate: string;               // ISO date
  weeklyFrequency: number;       // 1-7 økter per uke
  goals: string[];               // Liste over mål
  color: string;                 // Hex color for visuell fremstilling
  textColor: string;             // Tekst-farge
}
```

---

## 🔌 API Endepunkter

### Player Annual Plan API

```typescript
// Base: /api/v1/players/:playerId/annual-plan

// GET /api/v1/players/:playerId/annual-plan
// Hent gjeldende årsplan for spiller
Response: {
  success: true,
  data: {
    plan: AnnualTrainingPlan | null,
    hasActivePlan: boolean
  }
}

// POST /api/v1/players/:playerId/annual-plan
// Opprett ny årsplan (kun hvis ingen aktiv plan finnes)
Body: {
  name: string,
  startDate: string,
  endDate: string,
  periods: Period[]
}
Response: {
  success: true,
  data: {
    plan: AnnualTrainingPlan
  }
}

// PUT /api/v1/players/:playerId/annual-plan
// Oppdater eksisterende årsplan
Body: {
  name?: string,
  startDate?: string,
  endDate?: string,
  periods?: Period[],
  status?: 'active' | 'completed' | 'paused'
}
Response: {
  success: true,
  data: {
    plan: AnnualTrainingPlan
  }
}

// DELETE /api/v1/players/:playerId/annual-plan
// Slett årsplan (soft delete - setter status til 'cancelled')
Response: {
  success: true,
  message: "Annual plan cancelled"
}

// GET /api/v1/players/:playerId/annual-plan/templates
// Hent forslag til årsplan-maler basert på nivå/mål
Response: {
  success: true,
  data: {
    templates: [
      {
        id: string,
        name: string,
        description: string,
        targetLevel: string,
        durationWeeks: number,
        periods: Period[]
      }
    ]
  }
}

// POST /api/v1/players/:playerId/annual-plan/export
// Eksporter plan til PDF eller iCal
Body: {
  format: 'pdf' | 'ical'
}
Response: {
  success: true,
  data: {
    downloadUrl: string,
    expiresAt: string
  }
}
```

---

## 🎨 UI/UX Flow

### Wizard Steps

#### **Steg 1: Grunnleggende informasjon**
```
┌─────────────────────────────────────────────┐
│ Opprett din årsplan                        │
│                                             │
│ Planens navn:                               │
│ [Min treningsplan 2026            ]        │
│                                             │
│ Periode:                                    │
│ Fra: [01.01.2026] Til: [31.12.2026]       │
│                                             │
│ Din nåværende kategori:                     │
│ ( ) Elite                                   │
│ (•) Aspirant                                │
│ ( ) Talent                                  │
│ ( ) Junior                                  │
│                                             │
│ [Avbryt]              [Neste steg →]       │
└─────────────────────────────────────────────┘
```

#### **Steg 2: Velg perioder**
```
┌─────────────────────────────────────────────┐
│ Hvilke treningsperioder vil du ha?         │
│                                             │
│ ☑ Etablering (E)                           │
│   Bygge grunnlag, fokus på teknikk         │
│   Anbefalt: 4-8 uker                        │
│                                             │
│ ☑ Grunntrening (G)                         │
│   Øke volum, bygge styrke/kondisjon        │
│   Anbefalt: 12-20 uker                      │
│                                             │
│ ☑ Spesialisering (S)                       │
│   Golf-spesifikk trening, pre-sesong       │
│   Anbefalt: 8-12 uker                       │
│                                             │
│ ☑ Turnering (T)                            │
│   Konkurransesesong, vedlikehold           │
│   Anbefalt: 12-20 uker                      │
│                                             │
│ [← Tilbake]              [Neste steg →]    │
└─────────────────────────────────────────────┘
```

#### **Steg 3: Detaljer per periode**
```
┌─────────────────────────────────────────────┐
│ Periode 1: Etablering                       │
│                                             │
│ Navn: [Etablering 2026           ]         │
│                                             │
│ Varighet:                                   │
│ Fra: [01.01.2026] Til: [28.02.2026]        │
│ (8 uker)                                    │
│                                             │
│ Ukentlig treningsfrekvens:                  │
│ [1] [2] [3] [4] [5] [6] [7] økter/uke     │
│                                             │
│ Hovedfokus:                                 │
│ ☑ Putteteknikk                             │
│ ☑ Grunnleggende swing                      │
│ ☐ Styrketrening                            │
│ ☐ Kondisjon                                │
│                                             │
│ [← Tilbake]  [Neste periode →]            │
└─────────────────────────────────────────────┘
```

#### **Steg 4: Mål og fokusområder**
```
┌─────────────────────────────────────────────┐
│ Hva er dine mål for 2026?                  │
│                                             │
│ Mål 1:                                      │
│ [Senke handicap til 5.0          ] [X]     │
│                                             │
│ Mål 2:                                      │
│ [Vinne klubbmesterskap           ] [X]     │
│                                             │
│ Mål 3:                                      │
│ [Forbedre putting 20%            ] [X]     │
│                                             │
│ [+ Legg til mål]                           │
│                                             │
│ Fokusområder (velg opptil 3):              │
│ [Putting] [Chipping] [Full swing]          │
│ [Strategi] [Mental] [Fysisk]               │
│                                             │
│ [← Tilbake]           [Se forhåndsvisning] │
└─────────────────────────────────────────────┘
```

#### **Steg 5: Forhåndsvisning og bekreft**
```
┌─────────────────────────────────────────────┐
│ Din årsplan er klar! 🎉                    │
│                                             │
│ Oppsummering:                               │
│ • 4 perioder over 52 uker                  │
│ • Gjennomsnittlig 4.5 økter/uke            │
│ • Totalt ~234 treningsøkter                │
│                                             │
│ [Grafisk tidslinje vises her]              │
│ ─E─────G────────S──────T─────────          │
│ Jan  Mar  May  Jul  Sep  Nov               │
│                                             │
│ Perioder:                                   │
│ 1. Etablering (8 uker, 3-4 økter/uke)      │
│ 2. Grunntrening (16 uker, 5 økter/uke)     │
│ 3. Spesialisering (12 uker, 4 økter/uke)   │
│ 4. Turnering (16 uker, 4 økter/uke)        │
│                                             │
│ [← Rediger]  [Last ned PDF]  [Lagre plan] │
└─────────────────────────────────────────────┘
```

---

## 💻 Implementering

### Fase 1: Backend (1-2 uker)

#### Oppgaver
| # | Oppgave | Fil | Beskrivelse |
|---|---------|-----|-------------|
| 1.1 | API routes | `apps/api/src/api/v1/players/annual-plan-routes.ts` | CRUD endepunkter |
| 1.2 | Service logic | `apps/api/src/api/v1/players/annual-plan-service.ts` | Business logic |
| 1.3 | Validation | `apps/api/src/api/v1/players/annual-plan-validation.ts` | Input validering |
| 1.4 | Templates | `apps/api/src/api/v1/players/annual-plan-templates.ts` | Forhåndslagde maler |
| 1.5 | Export service | `apps/api/src/api/v1/players/annual-plan-export.ts` | PDF/iCal generering |
| 1.6 | Tests | `apps/api/src/__tests__/player-annual-plan.test.ts` | Unit og integration tests |

#### API Service Implementation

```typescript
// apps/api/src/api/v1/players/annual-plan-service.ts

export class PlayerAnnualPlanService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Hent årsplan for spiller
   */
  async getPlayerPlan(tenantId: string, playerId: string) {
    const plan = await this.prisma.annualTrainingPlan.findFirst({
      where: {
        playerId,
        tenantId,
        status: { not: 'cancelled' }
      },
      orderBy: { createdAt: 'desc' }
    });

    return {
      plan,
      hasActivePlan: !!plan && plan.status === 'active'
    };
  }

  /**
   * Opprett ny årsplan
   */
  async createPlayerPlan(
    tenantId: string,
    playerId: string,
    data: CreatePlayerAnnualPlanInput
  ) {
    // Validate player exists
    const player = await this.prisma.player.findUnique({
      where: { id: playerId, tenantId }
    });

    if (!player) {
      throw new Error('Player not found');
    }

    // Check if active plan exists
    const existingPlan = await this.prisma.annualTrainingPlan.findFirst({
      where: {
        playerId,
        tenantId,
        status: 'active'
      }
    });

    if (existingPlan) {
      throw new Error('Active annual plan already exists. Please cancel or complete it first.');
    }

    // Validate periods don't overlap
    this.validatePeriods(data.periods);

    // Create plan
    const plan = await this.prisma.annualTrainingPlan.create({
      data: {
        tenantId,
        playerId,
        coachId: null, // Player-generated
        name: data.name,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        periods: data.periods,
        status: 'active',
        createdBy: 'player'
      }
    });

    return plan;
  }

  /**
   * Oppdater eksisterende plan
   */
  async updatePlayerPlan(
    tenantId: string,
    playerId: string,
    data: UpdatePlayerAnnualPlanInput
  ) {
    const plan = await this.prisma.annualTrainingPlan.findFirst({
      where: {
        playerId,
        tenantId,
        status: { not: 'cancelled' }
      }
    });

    if (!plan) {
      throw new Error('No active annual plan found');
    }

    if (data.periods) {
      this.validatePeriods(data.periods);
    }

    return await this.prisma.annualTrainingPlan.update({
      where: { id: plan.id },
      data
    });
  }

  /**
   * Slett/kanseller plan
   */
  async cancelPlayerPlan(tenantId: string, playerId: string) {
    const plan = await this.prisma.annualTrainingPlan.findFirst({
      where: {
        playerId,
        tenantId,
        status: { not: 'cancelled' }
      }
    });

    if (!plan) {
      throw new Error('No active annual plan found');
    }

    return await this.prisma.annualTrainingPlan.update({
      where: { id: plan.id },
      data: { status: 'cancelled' }
    });
  }

  /**
   * Hent maler
   */
  async getTemplates(playerLevel: string) {
    // Return predefined templates based on player level
    return ANNUAL_PLAN_TEMPLATES.filter(t =>
      t.targetLevel === playerLevel || t.targetLevel === 'all'
    );
  }

  /**
   * Valider at perioder ikke overlapper
   */
  private validatePeriods(periods: Period[]) {
    const sorted = [...periods].sort((a, b) =>
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    for (let i = 0; i < sorted.length - 1; i++) {
      const current = sorted[i];
      const next = sorted[i + 1];

      const currentEnd = new Date(current.endDate);
      const nextStart = new Date(next.startDate);

      if (currentEnd >= nextStart) {
        throw new Error(`Period overlap detected: ${current.name} and ${next.name}`);
      }
    }
  }
}
```

---

### Fase 2: Frontend (2-3 uker)

#### Oppgaver
| # | Oppgave | Fil | Beskrivelse |
|---|---------|-----|-------------|
| 2.1 | Wizard component | `PlayerAnnualPlanWizard.tsx` | Hovedkomponent |
| 2.2 | Wizard hook | `useAnnualPlanWizard.ts` | State management |
| 2.3 | API hook | `usePlayerAnnualPlan.ts` | API calls |
| 2.4 | Step 1 | `Step1_BasicInfo.tsx` | Grunninfo |
| 2.5 | Step 2 | `Step2_PeriodSelection.tsx` | Velg perioder |
| 2.6 | Step 3 | `Step3_PeriodDetails.tsx` | Detaljer |
| 2.7 | Step 4 | `Step4_GoalsAndFocus.tsx` | Mål |
| 2.8 | Step 5 | `Step5_Review.tsx` | Forhåndsvisning |
| 2.9 | Timeline component | `PeriodTimeline.tsx` | Grafisk tidslinje |
| 2.10 | Integration | App.jsx routing | Legg til rute |

#### Wizard State Management

```typescript
// apps/web/src/features/player-annual-plan/hooks/useAnnualPlanWizard.ts

interface WizardState {
  currentStep: number;
  totalSteps: number;
  basicInfo: {
    name: string;
    startDate: string;
    endDate: string;
    playerLevel: string;
  };
  selectedPeriodTypes: Array<'E' | 'G' | 'S' | 'T'>;
  periods: Period[];
  goals: string[];
  focusAreas: string[];
}

export function useAnnualPlanWizard() {
  const [state, setState] = useState<WizardState>({
    currentStep: 0,
    totalSteps: 5,
    basicInfo: {
      name: '',
      startDate: '',
      endDate: '',
      playerLevel: 'talent'
    },
    selectedPeriodTypes: [],
    periods: [],
    goals: [],
    focusAreas: []
  });

  const goToNext = useCallback(() => {
    if (state.currentStep < state.totalSteps - 1) {
      setState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
    }
  }, [state.currentStep, state.totalSteps]);

  const goToPrevious = useCallback(() => {
    if (state.currentStep > 0) {
      setState(prev => ({ ...prev, currentStep: prev.currentStep - 1 }));
    }
  }, [state.currentStep]);

  const updateBasicInfo = useCallback((info: Partial<WizardState['basicInfo']>) => {
    setState(prev => ({
      ...prev,
      basicInfo: { ...prev.basicInfo, ...info }
    }));
  }, []);

  const updatePeriodTypes = useCallback((types: Array<'E' | 'G' | 'S' | 'T'>) => {
    setState(prev => ({ ...prev, selectedPeriodTypes: types }));
  }, []);

  const updatePeriods = useCallback((periods: Period[]) => {
    setState(prev => ({ ...prev, periods }));
  }, []);

  const updateGoals = useCallback((goals: string[]) => {
    setState(prev => ({ ...prev, goals }));
  }, []);

  const updateFocusAreas = useCallback((areas: string[]) => {
    setState(prev => ({ ...prev, focusAreas: areas }));
  }, []);

  const reset = useCallback(() => {
    setState({
      currentStep: 0,
      totalSteps: 5,
      basicInfo: {
        name: '',
        startDate: '',
        endDate: '',
        playerLevel: 'talent'
      },
      selectedPeriodTypes: [],
      periods: [],
      goals: [],
      focusAreas: []
    });
  }, []);

  return {
    state,
    goToNext,
    goToPrevious,
    updateBasicInfo,
    updatePeriodTypes,
    updatePeriods,
    updateGoals,
    updateFocusAreas,
    reset,
    isFirstStep: state.currentStep === 0,
    isLastStep: state.currentStep === state.totalSteps - 1
  };
}
```

---

### Fase 3: Integrasjon og Testing (1 uke)

#### Oppgaver
| # | Oppgave | Beskrivelse |
|---|---------|-------------|
| 3.1 | Kalenderintegrasjon | Sync perioder til spillerens kalender |
| 3.2 | Treningslogg-kobling | Link økter til perioder |
| 3.3 | PDF-eksport | Generer PDF med årsplan |
| 3.4 | iCal-eksport | Eksporter til Apple/Google Calendar |
| 3.5 | Notifikasjoner | Varsle når ny periode starter |
| 3.6 | E2E testing | Test hele flyten |
| 3.7 | Mobiloptimalisering | Responsive design |

---

## 🧪 Testing

### Unit Tests
```typescript
// apps/api/src/__tests__/player-annual-plan.test.ts

describe('PlayerAnnualPlanService', () => {
  describe('createPlayerPlan', () => {
    it('should create a new plan for player', async () => {
      // Test implementation
    });

    it('should reject if active plan already exists', async () => {
      // Test implementation
    });

    it('should reject overlapping periods', async () => {
      // Test implementation
    });
  });

  describe('validatePeriods', () => {
    it('should accept non-overlapping periods', () => {
      // Test implementation
    });

    it('should reject overlapping periods', () => {
      // Test implementation
    });
  });
});
```

### Integration Tests
```typescript
// apps/web/src/features/player-annual-plan/__tests__/wizard.test.tsx

describe('PlayerAnnualPlanWizard', () => {
  it('should navigate through all steps', () => {
    // Test step navigation
  });

  it('should validate form inputs', () => {
    // Test validation
  });

  it('should save plan on completion', async () => {
    // Test plan creation
  });
});
```

### E2E Tests
```typescript
// apps/web/e2e/player-annual-plan.spec.ts

test('Player can create annual plan', async ({ page }) => {
  // 1. Navigate to annual plan page
  await page.goto('/plan/aarsplan/ny');

  // 2. Fill in basic info
  await page.fill('input[name="planName"]', 'Min plan 2026');

  // 3. Select periods
  await page.click('input[value="E"]');
  await page.click('input[value="G"]');

  // 4. Complete wizard
  // ...

  // 5. Verify plan was created
  await expect(page.locator('text=Plan opprettet')).toBeVisible();
});
```

---

## 📍 Routing

### Nye ruter

```typescript
// apps/web/src/App.jsx

// Player Annual Plan routes
<Route path="/plan/aarsplan" element={
  <ProtectedRoute>
    <PlayerLayout>
      <PlayerAnnualPlanOverview />
    </PlayerLayout>
  </ProtectedRoute>
} />

<Route path="/plan/aarsplan/ny" element={
  <ProtectedRoute>
    <PlayerLayout>
      <PlayerAnnualPlanWizard />
    </PlayerLayout>
  </ProtectedRoute>
} />

<Route path="/plan/aarsplan/:planId" element={
  <ProtectedRoute>
    <PlayerLayout>
      <PlayerAnnualPlanDetail />
    </PlayerLayout>
  </ProtectedRoute>
} />

<Route path="/plan/aarsplan/:planId/rediger" element={
  <ProtectedRoute>
    <PlayerLayout>
      <PlayerAnnualPlanEdit />
    </PlayerLayout>
  </ProtectedRoute>
} />
```

### Navigasjonsintegrasjon

Legg til i `/plan` hub:
```typescript
// apps/web/src/config/player-navigation-v3.ts

{
  id: 'plan',
  sections: [
    {
      id: 'mal',
      label: 'Mål',
      items: [
        {
          href: '/plan/maal',
          label: 'Målsetninger',
          icon: 'TargetIcon'
        },
        {
          href: '/plan/aarsplan',
          label: 'Årsplan',
          icon: 'CalendarIcon',
          description: 'Lag og følg din treningsplan' // NY
        },
      ]
    }
  ]
}
```

---

## 🎨 Design Tokens

### Periodefarger

```typescript
// apps/web/src/features/player-annual-plan/utils/periodDefaults.ts

export const PERIOD_COLORS = {
  E: {
    primary: '#10B981',    // Grønn (Etablering)
    light: '#D1FAE5',
    dark: '#047857',
    text: '#065F46'
  },
  G: {
    primary: '#3B82F6',    // Blå (Grunntrening)
    light: '#DBEAFE',
    dark: '#1E40AF',
    text: '#1E3A8A'
  },
  S: {
    primary: '#F59E0B',    // Oransje (Spesialisering)
    light: '#FEF3C7',
    dark: '#D97706',
    text: '#92400E'
  },
  T: {
    primary: '#EF4444',    // Rød (Turnering)
    light: '#FEE2E2',
    dark: '#DC2626',
    text: '#991B1B'
  }
};

export const PERIOD_DEFAULTS = {
  E: {
    name: 'Etablering',
    description: 'Bygge teknisk grunnlag og grunnkondisjon',
    weeklyFrequency: 3,
    defaultWeeks: 6,
    goals: [
      'Bygge treningsvaner',
      'Grunnleggende teknikk',
      'Funksjonstest og baseline'
    ]
  },
  G: {
    name: 'Grunntrening',
    description: 'Øke treningsvolum og bygge fysisk kapasitet',
    weeklyFrequency: 5,
    defaultWeeks: 16,
    goals: [
      'Øke styrke og kondisjon',
      'Teknisk utvikling',
      'Bygge treningsvaner'
    ]
  },
  S: {
    name: 'Spesialisering',
    description: 'Golf-spesifikk trening og pre-sesong forberedelse',
    weeklyFrequency: 4,
    defaultWeeks: 10,
    goals: [
      'Turnerings-forberedelse',
      'Short game finpuss',
      'Mental trening'
    ]
  },
  T: {
    name: 'Turnering',
    description: 'Konkurransesesong med vedlikeholdstrening',
    weeklyFrequency: 4,
    defaultWeeks: 16,
    goals: [
      'Prestere i konkurranser',
      'Vedlikeholde form',
      'Analysere resultater'
    ]
  }
};
```

---

## 📦 Leveranse

### Fase 1: MVP (3-4 uker)
- ✅ Backend API for CRUD operasjoner
- ✅ Wizard med 5 steg
- ✅ Grunnleggende periodisering (E/G/S/T)
- ✅ Lagring i database
- ✅ Visning av årsplan

### Fase 2: Forbedringer (2-3 uker)
- ✅ Kalenderintegrasjon
- ✅ PDF-eksport
- ✅ iCal-eksport
- ✅ Forhåndslagde maler
- ✅ Notifikasjoner

### Fase 3: AI og Analytics (4-6 uker)
- 🔮 AI-baserte anbefalinger
- 🔮 Automatisk justering basert på progresjon
- 🔮 Prediktiv analyse
- 🔮 Sammenligning med andre spillere

---

## 🚀 Deployment

### Checklist
- [ ] Database migrations kjørt
- [ ] API endpoints testet
- [ ] Frontend bygger uten feil
- [ ] E2E tester passerer
- [ ] Dokumentasjon oppdatert
- [ ] Feature flag aktivert
- [ ] Brukerguide skrevet

### Rollout Plan
1. **Uke 1**: Intern testing (dev/staging)
2. **Uke 2**: Beta-testing med 10-20 spillere
3. **Uke 3**: Soft launch til 50% av spillere
4. **Uke 4**: Full rollout til alle spillere

---

## 📈 Suksessmålinger

### KPIer
- **Adopsjon**: >60% av spillere oppretter årsplan innen 3 måneder
- **Fullføring**: >80% fullfører wizard
- **Engasjement**: Spillere sjekker planen 2+ ganger/uke
- **Retention**: 70% av planer er aktive etter 6 måneder
- **Tilfredshet**: NPS >8.0

### Metrikker å spore
- Antall opprettede planer per uke
- Gjennomsnittlig tid brukt i wizard
- Drop-off rate per steg
- Eksport-rate (PDF/iCal)
- Support tickets relatert til årsplan

---

## ❓ Ofte stilte spørsmål

### Q: Kan spillere ha flere aktive årsplaner samtidig?
**A:** Nei, kun én aktiv plan om gangen. De kan deaktivere nåværende plan og opprette ny.

### Q: Kan coach overstyre spillerens årsplan?
**A:** Ja, coach kan se og foreslå endringer, men spiller må godkjenne.

### Q: Hva skjer hvis spiller ikke følger planen?
**A:** Systemet sender påminnelser, men tvinger ikke etterlevelse. Analytics viser avvik.

### Q: Kan planen justeres underveis?
**A:** Ja, spiller kan når som helst redigere perioder, frekvens og mål.

### Q: Synces planen med kalender automatisk?
**A:** Nei, spiller må eksplisitt eksportere til iCal eller PDF. Auto-sync kan legges til senere.

---

## 📚 Referanser

- Periodisering: [NSCA Periodization Guide](https://www.nsca.com)
- Golf training: [PGA Teaching Manual](https://www.pga.com)
- UX wizard patterns: [Nielsen Norman Group](https://www.nngroup.com)
- Eksisterende implementasjon: `/features/coach-annual-plan/`

---

## ✅ Godkjenning

| Rolle | Navn | Dato | Signatur |
|-------|------|------|----------|
| Product Owner | _______ | _______ | _______ |
| Tech Lead | _______ | _______ | _______ |
| UX Designer | _______ | _______ | _______ |
| QA Lead | _______ | _______ | _______ |

---

**Neste steg**: Gjennomgå plan med team og prioriter backlog for Sprint 1.
