# Offline Arbeidsplan - Reise til Spania
> **Dato:** 3. januar 2026
> **Tid:** 6 timer (2t buss + 4t fly)
> **Mål:** Gjennomgå terminologi og forstå systemarkitektur

---

## TIDSPLAN

```
┌────────────────────────────────────────────────────────┐
│  BUSS (2 timer)                                        │
│  ├── 0:00-0:45  Terminologi gjennomgang               │
│  └── 0:45-2:00  Årsplan & Periodisering struktur      │
├────────────────────────────────────────────────────────┤
│  FLY (4 timer)                                         │
│  ├── 0:00-1:30  Treningsøkt-struktur                  │
│  ├── 1:30-3:00  Øvelsesdatabase & Templates           │
│  └── 3:00-4:00  Notater & beslutninger                │
└────────────────────────────────────────────────────────┘
```

---

# DEL 1: TERMINOLOGI (45 min)

## 1.1 Beslutninger å ta

For hver term, bestem om du vil:
- ✅ Behold (allerede bra)
- 🔄 Endre til norsk
- ⚠️ Vurder nærmere

### Golf-områder

| Engelsk | Forslag | Din beslutning |
|---------|---------|----------------|
| Short Game | Nærspill | Nærspill |
| Long Game | Innspill | Innspill |
| Approach | Innspill | Innspill |
| Full Swing | Grunnteknikk | Grunnteknikk |
|  |              |                |
|  |              | |

### Periodisering

| Engelsk | Forslag | Din beslutning |
|---------|---------|----------------|
| Session | Økt | Økt |
| Training Plan | Treningsplan | Treningsplan |
| Period | Periode | Periode |
| Ground Period | Grunnperiode | Grunnperiode |
| Specialization | Spesialisering | Spesialiseringsperiode |
| Tournament Period | Turneringsperiode | Turneringsperiode |
| Taper | Nedtrapping | Restitusjon |
| Peak | Toppform | Formtopp |

### Gamification

| Engelsk | Forslag | Din beslutning |
|---------|---------|----------------|
| Badge | Merke / Badge | Merke |
| Achievement | Prestasjon | Prestasjon |
| Level | Nivå | Nivå |
| Tier | Grad / Tier | Grad |
| Progress | Fremgang | Fremgang |
| Streak | Streak / Serie | Streak |
| Unlock | Låse opp | Låse opp |

### Test & Evaluering

| Engelsk | Forslag | Din beslutning |
|---------|---------|----------------|
| Score | Poeng / Score | Poeng |
| Result | Resultat | Resultat |
| Pass | Bestått | Fullført |
| Fail | Ikke bestått | Ikke fullført |
| Benchmark | Benchmark | Referanse |
| Requirement | Krav | Krav |

---

# DEL 2: ÅRSPLAN & PERIODISERING (1t 15min)

## 2.1 Årsplan-struktur (Uke 43-42)

```
┌─────────────────────────────────────────────────────────────────┐
│                        ÅRSPLAN (52 uker)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Uke 43-46   EVALUERING (4 uker)                               │
│  ├── Sesongavslutning                                          │
│  ├── Testing og analyse                                         │
│  ├── Målsetting for neste år                                   │
│  └── IUP-generering                                            │
│                                                                 │
│  Uke 47-12   GRUNNPERIODE (18 uker)                            │
│  ├── Fysisk oppbygging (30%)                                   │
│  ├── Tekniske fundamentals (40%)                               │
│  ├── Shortgame (20%)                                           │
│  └── Mental (10%)                                              │
│                                                                 │
│  Uke 13-25   SPESIALISERINGSPERIODE (13 uker)                  │
│  ├── Golf-spesifikk styrke                                     │
│  ├── Variasjonstrening                                         │
│  ├── Simulert spill                                            │
│  └── Shortgame/Putting fokus (35%)                             │
│                                                                 │
│  Uke 26-42   TURNERINGSPERIODE (17 uker)                       │
│  ├── Tapering                                                  │
│  ├── Turneringer (50%)                                         │
│  ├── Vedlikeholdstrening                                       │
│  └── Mental forberedelse                                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 2.2 Hvordan årsplan genereres i appen

**Input:**
1. Spillerens kategori (A-K)
2. Spillerens alder
3. Turneringskalender
4. Testresultater (bruddpunkter)

**Algoritme:**
```
1. Hent kategori-krav fra database
2. Sammenlign med spillerens testresultater fra onboarding 
3. Identifiser bruddpunkter (svake områder)
4. Generer periodefordeling basert på:
   - Standard periodisering for kategorien
   - Justert for bruddpunkter
   - Justert for turneringskalender
5. Fordel treningsvolum per domene
```

**Output:**
- 52-ukers plan med perioder
- Ukentlig treningsfordeling
- Benchmark-uker (hver 3. uke)
- Turneringsforberedelse

## 2.3 Periodisering per kategori 

| Kategori | Grunn | Spes | Turn | Fokus |
|----------|-------|------|------|-------|
| A-B | 6 uker | 6 uker | 40 uker | Prestasjon |
| C-D | 8 uker | 8 uker | 36 uker | Utvikling |
| E-F | 12 uker | 10 uker | 30 uker | Grunnlag |
| G-K | 16 uker | 12 uker | 24 uker | Lek & læring |

## 2.4 Spørsmål å vurdere

- [ ] Er 4 perioder riktig, eller trenger vi flere/færre?
- [ ] Skal overgangsperioder være egne perioder?
- [ ] Hvordan håndtere skader/pauser?
- [ ] Skal planen kunne re-genereres underveis?

---

# DEL 3: TRENINGSØKT-STRUKTUR (1t 30min)

## 3.1 Økt-anatomi

```
┌─────────────────────────────────────────────────────────────────┐
│                      TRENINGSØKT                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  METADATA                                                       │
│  ├── id: string (UUID)                                         │
│  ├── name: string                                              │
│  ├── type: SessionType                                         │
│  ├── domain: TEE|INN50|INN100|INN150|ARG|PUTT|PHYS|MENTAL     │
│  ├── duration: number (minutter)                               │
│  ├── intensity: L|M|H (lav/middels/høy)                       │
│  └── period: G|S|T|E (grunn/spes/turn/eval)                   │
│                                                                 │
│  STRUKTUR                                                       │
│  ├── warmup: Exercise[] (oppvarming)                           │
│  │   ├── duration: 10-15 min                                   │
│  │   └── exercises: 2-4 øvelser                                │
│  │                                                             │
│  ├── main: Exercise[] (hoveddel)                               │
│  │   ├── duration: 40-60 min                                   │
│  │   └── exercises: 4-8 øvelser                                │
│  │                                                             │
│  └── cooldown: Exercise[] (avslutning)                         │
│       ├── duration: 5-10 min                                   │
│       └── exercises: 1-3 øvelser                               │
│                                                                 │
│  L-FASE (Læringsfase)                                          │
│  ├── L1: Eksponering (ny ferdighet)                           │
│  ├── L2: Fundamentals (grunnleggende)                         │
│  ├── L3: Variasjon (ulike betingelser)                        │
│  ├── L4: Timing & Flow (integrering)                          │
│  └── L5: Automatisering (under press)                         │
│                                                                 │
│  SETTING (S1-S10)                                              │
│  ├── S1-S3: Range/øvingsområde                                │
│  ├── S4-S5: Treningsrunder                                    │
│  ├── S6-S7: Intern konkurranse                                │
│  └── S8-S10: Turneringer                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 3.2 Session Types (Økttyper)

| Kode | Type | Beskrivelse | Typisk varighet |
|------|------|-------------|-----------------|
| TEK | Teknikk | Sving-mekanikk, posisjon | 60-120 min |
| FYS | Fysisk | Styrke, mobilitet, utholdenhet, hurtighet | 45-60 min |
|  | Golfslag |  | 45-120 min |
| MEN | Mental | Fokus, visualisering, rutiner, selvregulering | 30-45 min |
| SPL | Spill | Banespill | 120-240 min |
| TST | Test | Benchmark-testing | 60-90 min |

## 3.3 Domener (Treningsområder)

```
┌─────────────────────────────────────────────────────────────────┐
│  GOLF-DOMENER                                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  TEE (Utslag)                                                  │
│  ├── Driver                                                    │
│  ├── 3-tre                                                     │
│  └── Hybrid/Rescue                                             │
│                                                                 │
│  INN200 (Innspill 150-200m)                                    │
│  ├──                                                  │
│                                                                 │
│  INN150 (Innspill 100-150m)                                    │
│  ├──                                                │
│                                                                 │
│  INN100 (Innspill 50-100m)                                     │
│  ├──                                             │
│                                                                 │
│  INN50 (Innspill 0-50m)                                        │
│  ├                                        │
│                                                                 │
│  ARG (Nærspill)                             │
│  ├── Chipping                                                  │
│  ├── Pitching                                                  │
│  ├── Bunker                                                    │
│  └── Lob slag                                                │
│                                                                 │
│  PUTT (Putting)                                                │
│  ├── 0-3 ft                                        │
│  ├── 3-5 ft                                      │
│  ├── 5-10 ft                                     │
│  └── 10-15 ft 
			 15-25 ft 
			 25-40 ft 
			 40ft + 
│                                                                 │
│  FYS (Fysisk)                                                 │
│  ├── Styrke                                                    │
│  ├── Mobilitet                                                 │
│  ├── Eksplosivitet                                             │
│  └── Utholdenhet                                               │
│                                                                 │
│  MENTAL                                                        │
│  ├── Fokus                                                     │
│  ├── Visualisering                                             │
│  ├── Rutine                                           │
│  └── Selvregulering  
				Adferd
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 3.4 Hvordan økter genereres

**Algoritme:**

```
Input:
- Spillerens kategori
- Ukenummer (periode)
- Bruddpunkter
- Tilgjengelig tid

Steg 1: Velg økttype basert på periode
  - Grunnperiode → mer teknikk/fysisk
  - Turneringsperiode → mer spill/mental

Steg 2: Velg domene basert på bruddpunkter
  - Prioriter svake områder
  - Vedlikehold sterke områder

Steg 3: Velg øvelser fra database
  - Filtrer på L-fase (spillerens nivå)
  - Filtrer på Setting (S1-S10)
  - Velg variert mix

Steg 4: Bygg økt-struktur
  - Oppvarming (relatert til hoveddel)
  - Hoveddel (domene-fokus)
  - Avslutning (stretching/review)

Output:
- Komplett økt med øvelser
- Estimert varighet
- Utstyrsliste
- Coach-notater
```

## 3.5 Spørsmål å vurdere

- [ ] Skal spillere kunne tilpasse økter selv? Ja, spiller skal kunne redigere og tilpasse økter 
- [ ] Hvordan håndtere "skip" av øvelser? Skip øvelser skal registeres og logges hos coach/admin
- [ ] Skal det være video-demonstrasjoner? 
- [ ] Hvordan logge gjennomførte økter?

---

# DEL 4: ØVELSESDATABASE (1t 30min)

## 4.1 Øvelse-struktur

```typescript
interface Exercise {
  id: string;
  name: string;                    // "Alignment Stick Drill"
  nameNo: string;                  // "Siktelinje-øvelse"
  domain: Domain;                  // TEE, INN50, ARG, etc.
  type: ExerciseType;             // DRILL, GAME, TEST

  // Progresjon
  lPhase: 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
  settings: ('S1' | 'S2' | ... | 'S10')[];
  difficulty: 'easy' | 'medium' | 'hard';

  // Utførelse
  repsOrTime: string;             // "20" eller "15 min"
  equipment: string[];            // ["alignment sticks", "range balls"]
  location: 'range' | 'course' | 'gym' | 'home';

  // Instruksjoner
  description: string;
  steps: string[];
  coachingCues: string[];
  commonMistakes: string[];

  // Metadata
  categories: Category[];         // A-K
  periods: Period[];              // G, S, T, E
  tags: string[];
  videoUrl?: string;
}
```

## 4.2 Øvelseskategorier per domene

| Domene | Antall øvelser | Eksempler |
|--------|----------------|-----------|
| TEE | ~30 | Driver speed, Alignment, Tempo |
| INN200 | ~20 | Long iron accuracy, Trajectory |
| INN150 | ~25 | Stock shot, Distance control |
| INN100 | ~30 | Scoring zone, Wedge matrix |
| INN50 | ~40 | Clock drill, Ladder, Landing spot |
| ARG | ~35 | Bump & run, Flop, Bunker splash |
| PUTT | ~35 | Gate drill, Lag, Speed control |
| PHYS | ~40 | Rotation, Stability, Power |
| MENTAL | ~20 | Visualization, Routine, Breathing |

**Total: ~275 øvelser**

## 4.3 L-fase fordeling

| L-fase | Beskrivelse | Kategori-match |
|--------|-------------|----------------|
| L1 | Eksponering | K-I (nybegynner) |
| L2 | Fundamentals | I-G (rekrutt) |
| L3 | Variasjon | G-E (klubb) |
| L4 | Timing/Flow | E-C (regional) |
| L5 | Automatisering | C-A (elite) |

## 4.4 Eksempel: Komplett øvelse

```
┌─────────────────────────────────────────────────────────────────┐
│  GATE DRILL (Putting)                                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Domene: PUTT                                                  │
│  Type: DRILL                                                   │
│  L-fase: L2-L3                                                 │
│  Setting: S1, S2, S3                                           │
│  Vanskelighet: Medium                                          │
│                                                                 │
│  BESKRIVELSE:                                                  │
│  Plasser to tees som en "port" like foran ballen.             │
│  Porten skal være ca 1 cm bredere enn putter-hodet.           │
│  Fokuser på å sende ballen rett gjennom porten.               │
│                                                                 │
│  UTFØRELSE:                                                    │
│  1. Sett opp port 5-10 cm foran ball                          │
│  2. Start med 10 putts fra 1 meter                            │
│  3. Øk til 1.5m, 2m, 3m                                       │
│  4. Mål: 8/10 gjennom porten                                  │
│                                                                 │
│  COACHING CUES:                                                │
│  - "Hold putter-face square"                                   │
│  - "Smooth stroke, ikke jabb"                                  │
│  - "Øynene over ballen"                                        │
│                                                                 │
│  VANLIGE FEIL:                                                 │
│  - For rask backstroke                                         │
│  - Åpner/lukker face                                           │
│  - Ser opp for tidlig                                          │
│                                                                 │
│  UTSTYR: Putter, 2 tees, 10 baller                            │
│  VARIGHET: 10-15 min                                           │
│  KATEGORIER: G-A (alle nivåer)                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 4.5 Session Templates (Øktmaler)

| Template | Domene | Varighet | Innhold |
|----------|--------|----------|---------|
| TEE_POWER | TEE | 60 min | Speed + distance |
| TEE_ACCURACY | TEE | 60 min | Fairway focus |
| WEDGE_DISTANCE | INN50 | 75 min | Avstandskontroll |
| ARG_COMPLETE | ARG | 90 min | Chip + pitch + bunker |
| PUTT_SHORT | PUTT | 45 min | 0-3 meter fokus |
| PUTT_LAG | PUTT | 45 min | 5-10 meter fokus |
| PHYS_MOBILITY | PHYS | 45 min | ROM + stretching |
| PHYS_POWER | PHYS | 60 min | Eksplosivitet |
| MENTAL_ROUTINE | MENTAL | 30 min | Pre-shot focus |

## 4.6 Spørsmål å vurdere

- [ ] Trenger vi video for alle øvelser?
- [ ] Skal coaches kunne lage egne øvelser?
- [ ] Hvordan versjonere øvelser over tid?
- [ ] Skal spillere kunne favoritt-markere?

---

# DEL 5: NOTATER & BESLUTNINGER (1 time)

## 5.1 Mine beslutninger - Terminologi

**Golf-områder:**
```
Short Game → ________________
Approach → ________________
Full Swing → ________________
```

**Periodisering:**
```
Session → ________________
Period → ________________
Phase → ________________
```

**Gamification:**
```
Badge → ________________
Achievement → ________________
Level → ________________
Progress → ________________
```

## 5.2 Mine beslutninger - Struktur

**Årsplan:**
- Antall perioder: ________________
- Benchmark-frekvens: ________________
- Overgangsperioder: ________________

**Treningsøkter:**
- Standard varighet: ________________
- Øvelser per økt: ________________
- L-fase synlig for spiller: Ja / Nei

**Øvelser:**
- Video påkrevd: Ja / Nei
- Coach-tilpasning: Ja / Nei
- Spiller-favoritter: Ja / Nei

## 5.3 Spørsmål til team/Claude

1. ________________________________________________
2. ________________________________________________
3. ________________________________________________
4. ________________________________________________
5. ________________________________________________

## 5.4 Prioritert TODO etter reisen

| Prioritet | Oppgave | Estimat |
|-----------|---------|---------|
| 1 | | |
| 2 | | |
| 3 | | |
| 4 | | |
| 5 | | |

---

# VEDLEGG

## A. Fil-referanser i kodebasen

**Årsplan:**
- `apps/api/src/domain/training-plan/plan-generation.service.ts`
- `apps/web/src/features/annual-plan/`

**Treningsplan:**
- `apps/api/src/domain/training-plan/`
- `apps/web/src/features/trening-plan/`

**Øvelser:**
- `apps/api/prisma/seeds/exercises.ts`
- `apps/web/src/features/exercises/`

**Periodisering:**
- `apps/api/src/domain/training-plan/data/`
- `apps/web/src/features/periodeplaner/`

## B. Kategori-oversikt

| Kat | Snittscore | Alder | Beskrivelse |
|-----|------------|-------|-------------|
| A | <68 | 25+ | World Elite |
| B | 68-72 | 18-20+ | National Elite |
| C | 72-74 | 16-19 | National U21 |
| D | 74-76 | 15-18 | Regional Elite |
| E | 76-78 | 14-17 | Regional U18 |
| F | 78-80 | 15-17 | Klubbspiller |
| G | 80-85 | 14-16 | Klubbspiller |
| H | 85-90 | 13-15 | Region |
| I | 90-95 | 12-14 | Region |
| J | 95-100 | 11-13 | Lokal |
| K | 100+ | 8-11 | Lokal |

## C. Domene-koder

| Kode | Norsk | Engelsk |
|------|-------|---------|
| TEE | Utslag | Tee shots |
| INN200 | Innspill 150-200m | Approach 150-200m |
| INN150 | Innspill 100-150m | Approach 100-150m |
| INN100 | Innspill 50-100m | Approach 50-100m |
| INN50 | Innspill 0-50m | Approach 0-50m |
| ARG | Nærspill | Around the Green |
| PUTT | Putting | Putting |
| PHYS | Fysisk | Physical |
| MENTAL | Mental | Mental |

---

_God reise! Lykke til med gjennomgangen._
