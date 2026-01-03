# Data Input Audit - IUP Golf System
> Komplett gjennomgang av all data som mater appen
> Dato: 2. januar 2026

---

## Oppsummering

| Kategori | Antall | Status | Fil |
|----------|--------|--------|-----|
| **Dokumentasjon** | 232 .md filer | ⚠️ Behov for rydding | `/docs/` |
| **Øvelser** | ~300 stk | ✅ Omfattende | `exercises.ts` |
| **Session Templates** | ~39 stk | ⚠️ Trenger flere | `session-templates.ts` |
| **Tester** | 20 stk | ✅ Komplett | `tests.ts` |
| **Kategori-krav** | 440 datapunkter | ✅ Komplett | `category-requirements.ts` |
| **Ukeplan Templates** | 88 stk | ✅ Komplett | `week-templates.ts` |
| **Periodisering** | 52 uker | ✅ Definert | `training-plan.ts` |
| **Domain Mapping** | 8 domener | ✅ Definert | `domain-mapping.config.ts` |
| **Gamification** | Konfigurert | ✅ | `gamification.config.ts` |

---

## 1. SEED DATA (Database Input)

### 1.1 Øvelser (`exercises.ts`)
**Antall:** ~300 øvelser
**Størrelse:** 269,811 bytes (269 KB)

**Struktur per øvelse:**
```typescript
{
  name: string,                    // Navn på øvelse
  description: string,             // Beskrivelse
  purpose: string,                 // Formål
  exerciseType: string,            // 'teknikk' | 'fysisk' | 'mental' etc.
  learningPhases: ['L1'-'L5'],     // Hvilke læringsfaser
  settings: ['S1'-'S10'],          // Hvilke settings
  clubSpeedLevels: ['CS60'-'CS100'], // Hastighets-nivåer
  categories: ['A'-'K'],           // Hvilke kategorier
  periods: ['E','G','S','T'],      // Hvilke perioder
  repsOrTime: string,              // Repetisjoner eller tid
  equipment: { required, optional },
  location: string,                // 'range' | 'bane' etc.
  difficulty: string,              // 'easy' | 'medium' | 'hard'
  processCategory: string,         // 'golfslag' | 'fysisk' etc.
  progressionSteps: string,
  coachingCues: string,
  commonMistakes: string,
  tags: string[]
}
```

**Kategorier dekket:**
- Driver & Long Game: ~30 øvelser
- Iron Play: ~25 øvelser
- Wedge/Short Game: ~40 øvelser
- Putting: ~35 øvelser
- Bunker: ~15 øvelser
- Physical/Fitness: ~40 øvelser
- Mental: ~20 øvelser
- Course Strategy: ~15 øvelser
- Competition Prep: ~10 øvelser

**⚠️ Mulige mangler:**
- [ ] Mental trening øvelser (begrenset)
- [ ] Taktikk-øvelser
- [ ] Recovery/restitusjon øvelser

---

### 1.2 Session Templates (`session-templates.ts`)
**Antall:** ~39 templates
**Størrelse:** 29,810 bytes

**Struktur per template:**
```typescript
{
  name: string,
  description: string,
  sessionType: 'technical' | 'physical' | 'mental' | 'recovery' | 'tactical',
  learningPhase: 'L1' | 'L2' | 'L3' | 'L4' | 'L5',
  setting: 'S1' - 'S10',
  clubSpeed: 'CS90' etc.,
  categories: ['A'-'K'],
  periods: ['E','G','S','T'],
  duration: number (minutter),
  primaryDomain: 'TEE' | 'INN50' | 'INN100' | 'INN150' | 'INN200' | 'ARG' | 'PUTT' | 'PHYS' | null,
  exerciseSequence: {
    warmup: string[],
    main: string[],
    cooldown: string[]
  },
  objectives: string,
  structure: string,
  successCriteria: string
}
```

**Perioder dekket:**
| Periode | Antall Templates | Type |
|---------|------------------|------|
| E (Etablering) | ~10 | Fundamental |
| G (Grunnlag) | ~10 | Building |
| S (Spesialisering) | ~10 | Specific |
| T (Turnering) | ~9 | Competition |

**⚠️ Mulige mangler:**
- [ ] Flere templates per kategori-periode kombinasjon
- [ ] Benchmark-uke spesifikke templates
- [ ] Recovery-fokuserte templates
- [ ] Mental prep templates for turneringer

---

### 1.3 Tester (`tests.ts`)
**Antall:** 20 tester
**Størrelse:** 10,967 bytes

**Test 1-7: Golf Shots**
| Test | Navn | Kategori | Måleenhet |
|------|------|----------|-----------|
| 1 | Driver Clubhead Speed | speed | mph |
| 2 | 7-Iron Clubhead Speed | speed | mph |
| 3 | Driver Carry Distance | distance | meter |
| 4 | PEI (Proximity Efficiency) | accuracy | ratio |
| 5 | Fairway Accuracy | accuracy | % |
| 6 | GIR Simulation | accuracy | % |
| 7 | Short Game Up & Down | short_game | % |

**Test 8-11: Short Game**
| Test | Navn | Kategori |
|------|------|----------|
| 8 | Bunker Proximity | short_game |
| 9 | Putting 1.5m | putting |
| 10 | Putting 3m | putting |
| 11 | Lag Putting 10m | putting |

**Test 12-16: Physical**
| Test | Navn | Kategori |
|------|------|----------|
| 12 | Med Ball Throw | physical |
| 13 | Vertical Jump | physical |
| 14 | Hip Rotation | physical |
| 15 | Thoracic Rotation | physical |
| 16 | Plank Hold | physical |

**Test 17-20: Scoring & Mental**
| Test | Navn | Kategori |
|------|------|----------|
| 17 | 9-Hole Scoring | scoring |
| 18 | Mental Focus Test | mental |
| 19 | Pre-Shot Routine Consistency | mental |
| 20 | Competition Simulation | mental |

**⚠️ Diskrepans:**
- Seed-fil har 20 tester med annen nummerering enn dokumentasjonen
- `DATABASE_FORMLER_KOMPLETT.md` beskriver 20 andre tester
- Må harmoniseres!

---

### 1.4 Kategori-krav (`category-requirements.ts`)
**Antall:** 440 datapunkter (20 tester × 11 kategorier × 2 kjønn)
**Størrelse:** 50,444 bytes

**Struktur:**
```typescript
{
  category: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K',
  gender: 'M' | 'K',
  testNumber: 1-20,
  requirement: number,
  unit: string,
  comparison: '>=' | '<=' | '=='
}
```

**Eksempel - Test 1 (Driver Carry) Menn:**
| Kategori | Krav |
|----------|------|
| A | 270m |
| B | 260m |
| C | 250m |
| D | 240m |
| E | 230m |
| F | 220m |
| G | 210m |
| H | 200m |
| I | 190m |
| J | 180m |
| K | 170m |

**✅ Status:** Komplett definert for alle tester og kategorier

---

### 1.5 Ukeplan Templates (`week-templates.ts`)
**Antall:** 88 templates (11 kategorier × 4 perioder × 2 varianter)

**Timer per uke (kategori × periode):**
| Kategori | E | G | S | T |
|----------|---|---|---|---|
| A | 8 | 22 | 24 | 20 |
| B | 7 | 20 | 22 | 18 |
| C | 6 | 17 | 19 | 16 |
| D | 5 | 15 | 16 | 13 |
| E | 4 | 12 | 14 | 11 |
| F | 4 | 10 | 12 | 9 |
| G | 3 | 8 | 10 | 7 |
| H | 3 | 6 | 8 | 6 |
| I | 2 | 5 | 6 | 4 |
| J | 2 | 6 | 7 | 5 |
| K | 1 | 3 | 4 | 2 |

**Distribusjon per periode (Elite A-C):**
| Periode | Teknikk | Fysisk | Shortgame | Mental | Spill |
|---------|---------|--------|-----------|--------|-------|
| E | 40% | 30% | 20% | 10% | - |
| G | 35% | 25% | 25% | 15% | - |
| S | 25% | 15% | 35% | - | 25% |
| T | 15% | - | 25% | 10% | 50% |

**⚠️ Observasjon:** Distribusjon mangler for noen kombinasjoner

---

### 1.6 Periodisering (`training-plan.ts`)
**Dekker:** 52 uker

**Periode-struktur (Norsk golf-sesong):**
| Periode | Uker | Fase | Fokus |
|---------|------|------|-------|
| Grunnlag (G) | 1-12 | base | Teknikk, fysisk |
| Spesialisering (S) | 13-24 | specialization | Golf-spesifikk |
| Turnering (T) | 25-40 | tournament | Konkurranse |
| Overgang (E) | 41-44 | recovery | Hvile, evaluering |
| Grunnlag 2 (G) | 45-52 | base | Ny sesong prep |

**Prioriteter (1-3 skala):**
```
G-periode: Teknikk=3, Fysisk=3, Konkurranse=0, Spill=1, Golfslag=2
S-periode: Teknikk=2, Fysisk=2, Konkurranse=1, Spill=2, Golfslag=3
T-periode: Teknikk=1, Fysisk=1, Konkurranse=3, Spill=3, Golfslag=2
E-periode: Teknikk=1, Fysisk=2, Konkurranse=0, Spill=1, Golfslag=1
```

---

## 2. DOMAIN KONFIGURASJON

### 2.1 Domain Mapping (`domain-mapping.config.ts`)

**8 Test-domener:**
| Kode | Beskrivelse | Strokes Gained Component |
|------|-------------|--------------------------|
| TEE | Tee shots | OTT (Off The Tee) |
| INN200 | Approach 200+ m | APP |
| INN150 | Approach 150-200 m | APP |
| INN100 | Approach 100-150 m | APP |
| INN50 | Approach 50-100 m | APP |
| ARG | Around the Green | ARG |
| PUTT | Putting | PUTT |
| PHYS | Physical | TOTAL |

**Test-til-Domain Mapping:**
```
Test 1-7: TEE (Driver/speed)
Test 8-9: INN50/INN100
Test 10-11: INN150/INN200
Test 12-14: PHYS
Test 15-16, 20: PUTT
Test 17-19: ARG
```

**⚠️ Observasjon:** Test-nummerering avviker mellom filer

---

### 2.2 Gamification Config (`gamification.config.ts`)

**XP System:**
```typescript
xp: {
  perBadge: 50,
  baseXpForLevel2: 100,
  levelMultiplier: 1.5
}
```

**Session Thresholds:**
```typescript
sessions: {
  plannedPerWeek: 5,
  perfectWeekThreshold: 5,
  defaultDurationMinutes: 60,
  defaultIntensity: 5
}
```

**Streak Config:**
```typescript
streaks: {
  maxGapDays: 1.5,
  earlyMorningHour: 9,
  eveningHour: 19
}
```

**Badge Tiers (XP):**
| Tier | XP |
|------|-----|
| Standard | 25 |
| Bronze | 50 |
| Silver | 100 |
| Gold | 200 |
| Platinum | 500 |

**Training Types:**
- teknikk
- golfslag
- spill
- konkurranse
- fysisk
- mental
- rest

---

## 3. DOKUMENTASJON OVERSIKT

### 3.1 Mapper i `/docs/`

| Mappe | Antall filer | Beskrivelse |
|-------|--------------|-------------|
| `/api/` | 8 | API dokumentasjon |
| `/architecture/` | 5 | Arkitektur docs |
| `/contracts/` | 13 | Kontrakter og juridisk |
| `/demo/` | 12 | Demo-materiale |
| `/design/` | 18 | Design system |
| `/features/` | 15 | Feature-spesifikasjoner |
| `/guides/` | 2 | Guider |
| `/integrations/` | 2 | Integrasjoner |
| `/internal/` | 5 | Intern dokumentasjon |
| `/operations/` | 1 | Drift |
| `/plans/` | 3 | Planer |
| `/reference/` | 12 | Referansedokumenter |
| `/specs/` | 20 | Spesifikasjoner |
| **Rotmappe** | ~80 | Diverse |

**Total:** 232 markdown-filer

### 3.2 Nøkkeldokumenter for Data

| Fil | Innhold | Status |
|-----|---------|--------|
| `KATEGORI_SYSTEM_KOMPLETT.md` | Full kategori A-K | ✅ |
| `DATABASE_FORMLER_KOMPLETT.md` | 20 tester med formler | ✅ |
| `TRENINGSPLAN_ALGORITMER.md` | Plangenerering | ✅ |
| `TRENINGSPLAN_NAAVÆRENDE_IMPLEMENTASJON.md` | Teknisk impl. | ✅ |
| `TRENINGSPLAN_UTVIKLINGSPLAN.md` | Utviklingsplan | ✅ |
| `SPANIA_TRENINGSSAMLING_PLAN.md` | Spania-prep | ✅ |
| `SPILLER_PROGRESJON_ARBEIDSSKJEMA.md` | Progresjon-formel | ✅ |

---

## 4. IDENTIFISERTE PROBLEMER

### 4.1 Kritiske Inkonsekvenser

| Problem | Beskrivelse | Prioritet |
|---------|-------------|-----------|
| **Test-nummerering** | Seed-fil vs dokumentasjon har ulik nummerering | 🔴 Høy |
| **Manglende domain mapping** | Noen session templates har `primaryDomain: null` | 🟡 Medium |
| **Duplikate docs** | Flere overlappende dokumenter | 🟢 Lav |

### 4.2 Manglende Data

| Type | Mangler | Anbefaling |
|------|---------|------------|
| Session Templates | Bare ~39 stk, trenger ~150 | Lag flere per kategori/periode |
| Mental øvelser | Begrenset utvalg | Utvid med mental trening |
| Recovery sessions | Ingen dedikerte | Lag recovery templates |
| Taktikk-innhold | Minimal | Definer taktikk-øvelser |

### 4.3 Dokumentasjonsrydding

**Anbefalt sletting/konsolidering:**
- Duplikate design-docs
- Gamle specs som er implementert
- Demo-materiale som er utdatert
- Overlappende API-docs

---

## 5. ANBEFALTE TILTAK

### Før Spania (3. januar)

1. **Harmoniser test-nummerering**
   - Velg én autoritativ kilde
   - Oppdater seed-filer
   - Oppdater dokumentasjon

2. **Lag komplett session template liste**
   - Definer 150 templates (mål)
   - Sørg for alle kategori×periode kombinasjoner

3. **Print nøkkeldokumenter**
   - KATEGORI_SYSTEM_KOMPLETT.md
   - DATABASE_FORMLER_KOMPLETT.md
   - SPILLER_PROGRESJON_ARBEIDSSKJEMA.md
   - SPANIA_TRENINGSSAMLING_PLAN.md

### Under Spania

4. **Valider med trenere**
   - Er kategorikravene riktige?
   - Mangler tester?
   - Er periodiseringen korrekt?

5. **Samle inn data**
   - Spillerprofiler
   - Treningslogger
   - Breaking points

### Etter Spania

6. **Implementer funn**
   - Oppdater seed-data
   - Revidere algoritmer
   - Teste med reelle data

---

## 6. QUICK REFERENCE

### Fil-stier

```
SEED DATA:
/apps/api/prisma/seeds/
├── exercises.ts          (~300 øvelser)
├── session-templates.ts  (~39 templates)
├── tests.ts              (20 tester)
├── category-requirements.ts (440 krav)
├── week-templates.ts     (88 uke-templates)
├── training-plan.ts      (periodisering)
├── events-tournaments.ts (turneringer)
├── demo-users.ts         (demo-data)
└── videos.ts             (video-innhold)

DOMAIN CONFIG:
/apps/api/src/domain/
├── gamification/gamification.config.ts
├── performance/domain-mapping/domain-mapping.config.ts
├── performance/category-constraints/category-constraints.config.ts
└── training-plan/session-selection.service.ts

DOKUMENTASJON:
/docs/
├── reference/kategori/KATEGORI_SYSTEM_KOMPLETT.md
├── architecture/DATABASE_FORMLER_KOMPLETT.md
├── TRENINGSPLAN_*.md
└── SPANIA_*.md
```

---

**Rapport generert:** 2. januar 2026
**Neste review:** Etter Spania-tur (11. januar 2026)
