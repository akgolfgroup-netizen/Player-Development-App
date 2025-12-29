# IUP Golf Platform
## Komplett Presentasjonsdokumentasjon

**Versjon:** 1.1.0
**Dato:** Desember 2025
**Utviklet for:** Norges Golfforbund & Partnere

---

# EXECUTIVE SUMMARY

IUP Golf er en banebrytende digital plattform for individuell utvikling av golfspillere. Plattformen kombinerer Norges Golfforbunds kategorisystem (A-K) med moderne teknologi for å skape en helhetlig løsning for spillere, trenere og akademier.

## Nøkkeltall

| Metrikk | Verdi |
|---------|-------|
| **Antall Tester** | 20 standardiserte tester |
| **Kategorinivåer** | 11 nivåer (A-K) |
| **Badges/Utmerkelser** | 85 unike badges |
| **Kjønnstilpassede Krav** | Separate krav for menn (M) og kvinner (K) |
| **API-endepunkter** | 25+ domener |
| **Brukerroller** | Spiller, Trener, Admin |

---

# DEL 1: PRODUKTOVERSIKT

## 1.1 Visjon

Å demokratisere tilgangen til elite golftrening ved å gi enhver spiller - uansett klubb eller akademi - tilgang til de samme verktøyene som brukes av Team Norway.

## 1.2 Målgrupper

### Primær: Ambisiøse Juniorspillere
- Alder: 12-25 år
- Mål: Kategori-progresjon mot elitespill
- Behov: Strukturert utvikling, motivasjon, data-drevet feedback

### Sekundær: Golfakademier & Klubbtrenere
- Behov: Effektiv spilleroppfølging, objektiv måling, standardiserte protokoller

### Tertiær: Norges Golfforbund
- Behov: Nasjonal spillerutvikling, talentidentifikasjon, standardisering

## 1.3 Kjernefunksjoner

```
┌─────────────────────────────────────────────────────────────────┐
│                    IUP GOLF PLATFORM                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   SPILLER    │  │   TRENER     │  │    ADMIN     │           │
│  │   PORTAL     │  │   PORTAL     │  │   PORTAL     │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│         │                 │                 │                    │
│  ┌──────┴─────────────────┴─────────────────┴──────┐            │
│  │              FELLES TJENESTER                    │            │
│  │  • Autentisering & Autorisasjon                 │            │
│  │  • Kategori-beregning                           │            │
│  │  • Badge-evaluering                             │            │
│  │  • Treningsplan-motor                           │            │
│  │  • Analyse & Rapportering                       │            │
│  └─────────────────────────────────────────────────┘            │
│                           │                                      │
│  ┌────────────────────────┴────────────────────────┐            │
│  │              INTEGRASJONER                       │            │
│  │  • Met.no (Værdata)                             │            │
│  │  • GolfBox (Turneringer)                        │            │
│  │  • Trackman/FlightScope (Launch monitors)       │            │
│  └─────────────────────────────────────────────────┘            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

# DEL 2: KATEGORISYSTEMET (A-K)

## 2.1 Oversikt

IUP Golf implementerer Norges Golfforbunds offisielle kategorisystem som rangerer spillere fra A (elite) til K (nybegynner).

```
KATEGORI-PROGRESJON

  A  ←── Tour-nivå / Elite
  ↑
  B  ←── Landslagsnivå
  ↑
  C  ←── Høyt nasjonalt nivå
  ↑
  D  ←── Nasjonalt nivå
  ↑
  E  ←── Regionalt toppnivå
  ↑
  F  ←── Regionalt nivå
  ↑
  G  ←── Klubbnivå (høy)
  ↑
  H  ←── Klubbnivå (middels)
  ↑
  I  ←── Klubbnivå (lavt)
  ↑
  J  ←── Utviklingsspiller
  ↑
  K  ←── Nybegynner/Startspiller
```

## 2.2 Kravstruktur

Hver kategori har spesifikke krav innen alle 20 testområder, differensiert mellom menn (M) og kvinner (K).

### Eksempel: Driver Avstand (Carry)

| Kategori | Menn (M) | Kvinner (K) |
|----------|----------|-------------|
| **A** | ≥ 270m | ≥ 240m |
| **B** | ≥ 260m | ≥ 230m |
| **C** | ≥ 250m | ≥ 220m |
| **D** | ≥ 240m | ≥ 210m |
| **E** | ≥ 230m | ≥ 200m |
| **F** | ≥ 220m | ≥ 190m |
| **G** | ≥ 210m | ≥ 180m |
| **H** | ≥ 200m | ≥ 170m |
| **I** | ≥ 190m | ≥ 160m |
| **J** | ≥ 180m | ≥ 150m |
| **K** | ≥ 170m | ≥ 140m |

---

# DEL 3: TESTSYSTEMET (20 TESTER)

## 3.1 Testkategorier

```
┌────────────────────────────────────────────────────────────────┐
│                    20 STANDARDISERTE TESTER                     │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  LANGSPILL (4 tester)          SHORT GAME (4 tester)           │
│  ├─ 1. Driver Avstand (carry)   ├─ 15. Putting 3m             │
│  ├─ 2. 3-Tre Avstand            ├─ 16. Putting 6m             │
│  ├─ 3. 5-Jern Avstand           ├─ 17. Chipping               │
│  └─ 4. Wedge Avstand (PW)       └─ 18. Bunker                 │
│                                                                 │
│  TEKNIKK/SPEED (3 tester)      APPROACH (4 tester)             │
│  ├─ 5. Klubbhastighet           ├─ 8.  25m Approach (PEI)     │
│  ├─ 6. Ballhastighet            ├─ 9.  50m Approach (PEI)     │
│  └─ 7. Smash Factor             ├─ 10. 75m Approach (PEI)     │
│                                  └─ 11. 100m Approach (PEI)    │
│                                                                 │
│  FYSISK (3 tester)             ON-COURSE (2 tester)            │
│  ├─ 12. Benkpress (1RM)         ├─ 19. 9-hulls simulering     │
│  ├─ 13. Markløft Trapbar (1RM)  └─ 20. On-course skills       │
│  └─ 14. 3000m Løping                                           │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

## 3.2 PEI-systemet (Precision Efficiency Index)

For approach-tester brukes PEI-systemet som måler presisjon uavhengig av avstand:

```
PEI = Faktisk gjennomsnittlig avstand fra hull / Ideell avstand

Eksempel: 50m approach
- Ideell avstand: 5m (10% av slaglengde)
- Hvis gjennomsnitt er 5m → PEI = 1.0 (perfekt)
- Hvis gjennomsnitt er 10m → PEI = 2.0 (OK)
- Hvis gjennomsnitt er 15m → PEI = 3.0 (trenger forbedring)

Lavere PEI = Bedre presisjon
```

## 3.3 Komplett Testoversikt

### Tester 1-7: Langspill & Teknikk

| # | Test | Enhet | Sammenlikning | Kategori A (M) | Kategori A (K) |
|---|------|-------|---------------|----------------|----------------|
| 1 | Driver Avstand | meter | ≥ | 270 | 240 |
| 2 | 3-Tre Avstand | meter | ≥ | 250 | 210 |
| 3 | 5-Jern Avstand | meter | ≥ | 190 | 165 |
| 4 | Wedge Avstand | meter | ≥ | 130 | 110 |
| 5 | Klubbhastighet | km/t | ≥ | 193 | 169 |
| 6 | Ballhastighet | km/t | ≥ | 285 | 250 |
| 7 | Smash Factor | ratio | ≥ | 1.48 | 1.48 |

### Tester 8-11: Approach (PEI)

| # | Test | Enhet | Sammenlikning | Kategori A |
|---|------|-------|---------------|------------|
| 8 | 25m Approach | PEI | ≤ | 1.0 |
| 9 | 50m Approach | PEI | ≤ | 1.0 |
| 10 | 75m Approach | PEI | ≤ | 1.0 |
| 11 | 100m Approach | PEI | ≤ | 1.0 |

### Tester 12-14: Fysisk

| # | Test | Enhet | Sammenlikning | Kategori A (M) | Kategori A (K) |
|---|------|-------|---------------|----------------|----------------|
| 12 | Benkpress | kg | ≥ | 140 | 100 |
| 13 | Markløft Trapbar | kg | ≥ | 200 | 140 |
| 14 | 3000m Løping | sekunder | ≤ | 660 (11:00) | 750 (12:30) |

### Tester 15-18: Short Game

| # | Test | Enhet | Sammenlikning | Kategori A |
|---|------|-------|---------------|------------|
| 15 | Putting 3m | % | ≥ | 90 |
| 16 | Putting 6m | % | ≥ | 50 |
| 17 | Chipping | cm | ≤ | 100 |
| 18 | Bunker | cm | ≤ | 150 |

### Tester 19-20: On-Course

| # | Test | Enhet | Sammenlikning | Kategori A |
|---|------|-------|---------------|------------|
| 19 | 9-hulls simulering | score til par | ≤ | 0 |
| 20 | On-course skills | score til par | ≤ | 0 |

---

# DEL 4: GAMIFICATION & BADGE-SYSTEM

## 4.1 Oversikt

Plattformen inkluderer et omfattende gamification-system med **85 unike badges** designet for å motivere og anerkjenne progresjon.

```
BADGE-STRUKTUR

  ┌─────────────────────────────────────────────────────┐
  │                   85 BADGES                          │
  ├─────────────────────────────────────────────────────┤
  │                                                      │
  │  VOLUM (15)          STREAK (12)        PRESTASJON (18) │
  │  ├─ Sessions         ├─ Daglig          ├─ Kategori     │
  │  ├─ Timer            ├─ Ukentlig        ├─ Allrounder   │
  │  └─ Drills           └─ Månedlig        └─ Spesialist   │
  │                                                      │
  │  FASE (10)           SPESIELL (15)      SESONG (15)    │
  │  ├─ Onboarding       ├─ Unike           ├─ Vår         │
  │  ├─ Progresjon       │   prestasjoner   ├─ Sommer      │
  │  └─ Milepæler        └─ Utfordringer    └─ Høst/Vinter │
  │                                                      │
  └─────────────────────────────────────────────────────┘
```

## 4.2 Tier-system

Hver badge har tre nivåer med økende vanskelighetsgrad:

| Tier | Ikon | XP Belønning | Vanskelighet |
|------|------|--------------|--------------|
| **Bronse** | 🥉 | 50 XP | Standard |
| **Sølv** | 🥈 | 100 XP | Medium |
| **Gull** | 🥇 | 200 XP | Vanskelig |

## 4.3 Badge-kategorier i detalj

### Volum Badges (15 stk)

| Badge | Bronse | Sølv | Gull |
|-------|--------|------|------|
| **Session Master** | 10 økter | 50 økter | 100 økter |
| **Hour Logger** | 10 timer | 50 timer | 100 timer |
| **Drill Champion** | 100 drills | 500 drills | 1000 drills |
| **Driving Range Hero** | 500 baller | 2500 baller | 10000 baller |
| **Practice Dedication** | 25 dager | 100 dager | 365 dager |

### Streak Badges (12 stk)

| Badge | Bronse | Sølv | Gull |
|-------|--------|------|------|
| **Weekly Warrior** | 2 uker | 4 uker | 8 uker |
| **Daily Dedication** | 3 dager | 7 dager | 14 dager |
| **Monthly Master** | 1 måned | 3 måneder | 6 måneder |
| **Consistency King** | 80% oppmøte | 90% oppmøte | 95% oppmøte |

### Prestasjons Badges (18 stk)

| Badge | Krav |
|-------|------|
| **Category Champion** | Oppnå score 8+ i én kategori |
| **All-Rounder** | Score 6+ i alle kategorier |
| **Driver Pro** | Driving distance 250m+ |
| **Putting Wizard** | 1-putt percentage 40%+ |
| **Iron Man** | GIR 70%+ |
| **Short Game Specialist** | Up & down 60%+ |
| **Physical Beast** | Bestå alle fysiske tester på ønsket nivå |
| **Mental Warrior** | Fullføre mental trening 50 ganger |

### Onboarding Badges (6 stk)

| Badge | Krav |
|-------|------|
| **First Steps** | Fullfør profiloppsettet |
| **Ready to Train** | Fullfør første økt |
| **Week One** | 7 dager med aktivitet |
| **Month Strong** | 30 dager aktiv |
| **Committed** | 100 økter totalt |
| **Lifer** | 365 dager aktiv |

## 4.4 XP og Nivåsystem

```
NIVÅPROGRESJON

Nivå 1:     0 XP      Nybegynner
Nivå 2:   500 XP      Rookie
Nivå 3:  1000 XP      Aspirant
Nivå 4:  2000 XP      Utvikler
Nivå 5:  4000 XP      Competent
Nivå 6:  8000 XP      Proficient
Nivå 7: 16000 XP      Expert
Nivå 8: 32000 XP      Master
Nivå 9: 64000 XP      Elite
Nivå 10:128000 XP     Legend
```

## 4.5 Badge-evaluering

Badges evalueres automatisk etter:
- Fullført treningsøkt
- Registrerte testresultater
- Logget treningstid
- Fullførte konkurranser

```typescript
// Forenklet badge-evaluering
async function evaluateBadges(playerId: string) {
  const metrics = await calculateMetrics(playerId);

  for (const badge of ALL_BADGES) {
    if (badge.requirements.met(metrics)) {
      await awardBadge(playerId, badge.id);
    }
  }
}
```

---

# DEL 5: DESIGN SYSTEM

## 5.1 Merkevarefarger

### Primærpalett

```css
/* AK GOLF ACADEMY — DESIGN SYSTEM v3.0 */

/* Hovedfarger */
--ak-ink:           #02060D;    /* Tekst, mørk bakgrunn */
--ak-primary:       #10456A;    /* Hovedfarge (blå) */
--ak-primary-light: #2C5F7F;    /* Lysere variant */
--ak-snow:          #EDF0F2;    /* Lys bakgrunn */
--ak-surface:       #EBE5DA;    /* Overflater, kort */
--ak-gold:          #C9A227;    /* Aksenter, premium */
--ak-white:         #FFFFFF;    /* Hvit */
```

### Visuell Fargereferanse

```
┌──────────────────────────────────────────────────────────────┐
│                    FARGEPALETT                                │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ██████  AK Ink (#02060D)         Tekst, kontrast           │
│                                                               │
│  ██████  AK Primary (#10456A)     Primærfarge, knapper       │
│                                                               │
│  ██████  AK Primary Light (#2C5F7F) Hover-states            │
│                                                               │
│  ██████  AK Snow (#EDF0F2)        Bakgrunn                   │
│                                                               │
│  ██████  AK Surface (#EBE5DA)     Kort, flater               │
│                                                               │
│  ██████  AK Gold (#C9A227)        Premium, aksent            │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Statusfarger

```css
--ak-success: #4A7C59;    /* Grønn - Suksess, bestått */
--ak-warning: #D4A84B;    /* Gul - Advarsel, OBS */
--ak-error:   #C45B4E;    /* Rød - Feil, ikke bestått */
```

### Gråskala

```css
--gray-50:  #F9FAFB;
--gray-100: #F2F4F7;
--gray-300: #D5D7DA;
--gray-500: #8E8E93;
--gray-600: #535862;
--gray-700: #414651;
--gray-900: #1C1C1E;
```

## 5.2 Typografi

### Fontfamilier

```css
--font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-logo:   'DM Sans', sans-serif;
```

### Type Scale (Apple HIG)

| Stil | Størrelse | Linjehøyde | Bruk |
|------|-----------|------------|------|
| **Large Title** | 34px | 41px | Hovedoverskrifter |
| **Title 1** | 28px | 34px | Seksjonsoverskrifter |
| **Title 2** | 22px | 28px | Underseksjoner |
| **Title 3** | 20px | 25px | Kortoverskrifter |
| **Headline** | 17px | 22px | Viktig tekst |
| **Body** | 17px | 22px | Brødtekst |
| **Subheadline** | 15px | 20px | Sekundær tekst |
| **Footnote** | 13px | 18px | Metadata |
| **Caption 1** | 12px | 16px | Labels |
| **Caption 2** | 11px | 13px | Små detaljer |

## 5.3 Spacing System

Basert på 4px grid:

```css
--spacing-1:  4px;
--spacing-2:  8px;
--spacing-3:  12px;
--spacing-4:  16px;
--spacing-5:  20px;
--spacing-6:  24px;
--spacing-8:  32px;
--spacing-10: 40px;
--spacing-12: 48px;
--spacing-16: 64px;
--spacing-20: 80px;
```

## 5.4 Border Radius

```css
--radius-sm:   8px;     /* Små elementer */
--radius-md:   12px;    /* Standard kort */
--radius-lg:   16px;    /* Store seksjoner */
--radius-xl:   20px;    /* Modaler */
--radius-full: 999px;   /* Sirkler, pills */
```

## 5.5 Shadows (Apple/Stripe-stil)

```css
--shadow-xs:       0 1px 2px rgba(0, 0, 0, 0.04);
--shadow-card:     0 1px 3px rgba(0, 0, 0, 0.04), 0 2px 8px rgba(0, 0, 0, 0.04);
--shadow-elevated: 0 4px 12px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.04);
--shadow-hover:    0 8px 24px rgba(0, 0, 0, 0.08), 0 4px 8px rgba(0, 0, 0, 0.04);
```

## 5.6 Dark Mode

Plattformen støtter automatisk mørk modus:

```css
/* Dark Mode Palette */
--ak-primary:      #2C5F7F;     /* Lysere blå */
--ak-ink:          #F2F2F7;     /* Lys tekst */
--ak-snow:         #1C1C1E;     /* Mørk bakgrunn */
--ak-surface:      #2C2C2E;     /* Mørke kort */
--ak-gold:         #D4A84B;     /* Lysere gull */
```

## 5.7 Ikon-system

### Spesifikasjoner

| Egenskap | Verdi |
|----------|-------|
| Base størrelse | 24 × 24px |
| Strektykkelse | 1.5px |
| Hjørneradius | 2px (standard) |
| Caps | Runde |
| Joins | Runde |
| Safe zone | 2px |

### Ikonkategorier

```
/icons/
├── /navigation/    (8 ikoner)  Home, Calendar, Profile, Settings...
├── /actions/       (10 ikoner) Play, Pause, Edit, Delete...
├── /status/        (8 ikoner)  Check, Warning, Lock, Star...
├── /golf/          (12 ikoner) Swing, Ball, Flag, Tee...
├── /training/      (12 ikoner) Session, Drill, Progress, Streak...
└── /misc/          (diverse)
```

## 5.8 Badge-design

### Tier-farger

```css
--tier-standard:   transparent;
--tier-bronze:     #B08D57;    /* Varm bronse */
--tier-silver:     #8A9BA8;    /* Kjølig sølv */
--tier-gold:       #C9A227;    /* AK merkevare gull */
--tier-platinum:   #E5E4E2;    /* Platinum grå */
```

### Badge-størelser

| Kontekst | Størrelse | Detaljnivå |
|----------|-----------|------------|
| Liste | 32px | Silhuett kun |
| Kort | 48px | Grunnleggende detalj |
| Profil | 64px | Full detalj |
| Modal/Feiring | 128px | Maksimal detalj |

---

# DEL 6: SPILLER-FUNKSJONER

## 6.1 Dashboard

Spillerens hovedvisning med sanntidsoversikt:

```
┌─────────────────────────────────────────────────────────────┐
│                    SPILLER DASHBOARD                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────┐  ┌─────────────────┐                   │
│  │  KATEGORI       │  │  NESTE MÅL      │                   │
│  │     ┌───┐       │  │                 │                   │
│  │     │ D │       │  │  Kategori C     │                   │
│  │     └───┘       │  │  ━━━━━━━━░░ 78% │                   │
│  │  Nivå 5 Competent │  │                 │                   │
│  └─────────────────┘  └─────────────────┘                   │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  UKENS TRENINGSPLAN                                      ││
│  │  ─────────────────────────────────────────               ││
│  │  Man: Short Game (45 min) ✓                              ││
│  │  Tir: Driving Range (60 min)                             ││
│  │  Ons: Fysisk Trening (45 min)                            ││
│  │  Tor: Approach Practice (45 min)                         ││
│  │  Fre: On-Course Training (90 min)                        ││
│  └─────────────────────────────────────────────────────────┘│
│                                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │ Sessions │ │ Streaks  │ │ Badges   │ │ Tests    │        │
│  │    47    │ │  14 🔥   │ │   23     │ │  18/20   │        │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘        │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  VÆR I DAG                    NESTE TURNERING           ││
│  │  ☀️ 18°C, Lett vind           NM Junior U18              ││
│  │  Ideelt for putting trening   Om 12 dager               ││
│  └─────────────────────────────────────────────────────────┘│
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 6.2 Profilsystem

### Spillerprofil inkluderer:

- Personlig informasjon (navn, alder, klubb)
- Golfspesifikk info (handicap, dominerende hånd, spillehistorikk)
- Nåværende kategori og progresjon
- Badge-samling og XP-nivå
- Treningsstatistikk og streaks
- Målsettinger (kort- og langsiktige)

### Onboarding-flyt

```
1. Opprett konto → 2. Personlige detaljer → 3. Golfbakgrunn →
4. Første testbatteri → 5. Automatisk kategoriplassering →
6. Personlig treningsplan genereres
```

## 6.3 Testresultater

Spillere kan:
- Se alle gjennomførte tester med historikk
- Sammenligne resultater over tid
- Se fremgang mot neste kategori per test
- Identifisere styrker og forbedringsområder

```
┌─────────────────────────────────────────────────────────────┐
│                    TESTRESULTATER                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Test: Driver Avstand (Carry)                               │
│  ─────────────────────────────                              │
│  Siste resultat: 235m                                       │
│  Nåværende kategori: D (krav: 240m)                        │
│  Neste kategori: C (krav: 250m)                            │
│                                                              │
│  Progresjon:                                                 │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░  78%              │
│                                                              │
│  Historikk:                                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 250m ─                                                │  │
│  │      │                              ●                 │  │
│  │ 240m ─                         ●         ● ← Mål D    │  │
│  │      │                    ●                           │  │
│  │ 230m ─               ●                                │  │
│  │      │          ●                                     │  │
│  │ 220m ─     ●                                          │  │
│  │      ├────┬────┬────┬────┬────┬────┬────┬────────────│  │
│  │      Jan  Feb  Mar  Apr  Mai  Jun  Jul  Aug          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 6.4 Treningsøkter

### Øktregistrering inkluderer:
- Øktype (Short Game, Driving, Fysisk, etc.)
- Varighet
- Spesifikke øvelser gjennomført
- Selvvurdering (fokus, energi, teknikk)
- Notater og refleksjoner

### Evaluering etter økt

```
┌─────────────────────────────────────────────────────────────┐
│                 ØKT-EVALUERING                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Hvordan var økten?                                         │
│                                                              │
│  Fokus:        ○ ○ ○ ● ○      (4/5)                        │
│  Energi:       ○ ○ ● ○ ○      (3/5)                        │
│  Teknikk:      ○ ○ ○ ○ ●      (5/5)                        │
│  Fornøydhet:   ○ ○ ○ ● ○      (4/5)                        │
│                                                              │
│  Notater:                                                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Bra dag på puttingen. Følte god rytme på 3m         │   │
│  │ putter. Må jobbe mer med lengre putter neste gang.  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│               [Lagre og avslutt]                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 6.5 Målsettinger

Spillere kan sette:
- **Kortsiktige mål** (1-4 uker): Spesifikke treningsfrekvenser, streaks
- **Mellomlangsiktige mål** (1-6 måneder): Kategorioppnåelse, testforbedringer
- **Langsiktige mål** (6+ måneder): Turnering-kvalifiseringer, årlige mål

## 6.6 Kalender

Integrert kalender med:
- Planlagte treningsøkter
- Turneringer
- Tester/evalueringer
- Coachingøkter
- Hvileperioder

## 6.7 Øvelsesbibliotek

Tilgang til strukturert øvelsesbibliotek:
- Kategorisert etter ferdighetsområde
- Vanskelighetsgradering
- Videodemonstrasjoner
- Tips og teknikk-beskrivelser
- Logging av gjennomførte øvelser

## 6.8 Statistikk & Fremgang

```
┌─────────────────────────────────────────────────────────────┐
│                STATISTIKK-DASHBOARD                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  KATEGORI-PROGRESJON                                        │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                                                        │ │
│  │    A ─┬─                                               │ │
│  │    B ─│─                                               │ │
│  │    C ─│─                            ●──────────────●   │ │
│  │    D ─│─               ●────────────●                  │ │
│  │    E ─│─ ●─────────────●                               │ │
│  │    F ─│─●                                              │ │
│  │      ─┴─┬────┬────┬────┬────┬────┬────┬────┬────┬───  │ │
│  │         Q1   Q2   Q3   Q4   Q1   Q2   Q3   Q4        │ │
│  │              2024              2025                    │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                              │
│  STYRKER                        FORBEDRINGSOMRÅDER          │
│  ┌─────────────────────┐       ┌─────────────────────┐     │
│  │ ● Driving (Score 8) │       │ ○ Putting (Score 5) │     │
│  │ ● Iron Play (7)     │       │ ○ Bunker (5)        │     │
│  │ ● Fysisk (7)        │       │ ○ Mental (5)        │     │
│  └─────────────────────┘       └─────────────────────┘     │
│                                                              │
│  TRENINGSTID DENNE MÅNEDEN                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Short Game   ████████████████░░░░░░  65% (8.5 timer)│   │
│  │ Driving      ████████████░░░░░░░░░░  50% (6.5 timer)│   │
│  │ Fysisk       ██████░░░░░░░░░░░░░░░░  25% (3 timer)  │   │
│  │ On-Course    ████████░░░░░░░░░░░░░░  35% (4.5 timer)│   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

# DEL 7: TRENER-FUNKSJONER

## 7.1 Trener Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│                    TRENER DASHBOARD                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  VARSLER & OPPGAVER                                      ││
│  │  ─────────────────────                                   ││
│  │  🔴 3 spillere med fallende prestasjon                   ││
│  │  🟡 5 nye testresultater å godkjenne                     ││
│  │  🟢 2 spillere oppnådde ny kategori                      ││
│  └─────────────────────────────────────────────────────────┘│
│                                                              │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│  │  Spillere   │ │  Aktive     │ │  Denne uke  │            │
│  │     24      │ │    18       │ │  47 økter   │            │
│  └─────────────┘ └─────────────┘ └─────────────┘            │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  UKENTLIGE TURNERINGER                                   ││
│  │  ─────────────────────                                   ││
│  │  ● NM Junior U18 - 12. jan (3 spillere påmeldt)         ││
│  │  ● NGF Tour #2 - 19. jan (5 spillere påmeldt)           ││
│  └─────────────────────────────────────────────────────────┘│
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  SKADE-TRACKER                                           ││
│  │  ─────────────                                           ││
│  │  Emma S. - Håndleddsskade - Tilbake om 5 dager          ││
│  │  Jonas K. - Ryggproblemer - Under evaluering            ││
│  └─────────────────────────────────────────────────────────┘│
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 7.2 Spilleroversikt

Trenere kan se:
- Komplett liste over alle sine spillere
- Filtrer etter kategori, alder, aktivitetsnivå
- Sorter etter progresjon, treningsfrekvens
- Se siste aktivitet og kommende økter

## 7.3 Spillerdetaljer

For hver spiller kan treneren se:
- Full profilinfo og kontaktdetaljer
- Komplett testhistorikk med grafer
- Treningsplan og etterlevelse
- Notater og kommunikasjonslogg
- Målprogresjon

## 7.4 Treningsplan-editor

```
┌─────────────────────────────────────────────────────────────┐
│              TRENINGSPLAN-EDITOR                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Spiller: Emma Sørensen (Kategori D)                        │
│  Periode: Januar 2025                                        │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  UKE 1                                                 │  │
│  │  ─────                                                 │  │
│  │  Man: [Short Game - 45 min] ← Dra & slipp øvelser     │  │
│  │  Tir: [Driving - 60 min]                               │  │
│  │  Ons: [Fysisk - 45 min]                                │  │
│  │  Tor: [Fri]                                            │  │
│  │  Fre: [Approach - 45 min]                              │  │
│  │  Lør: [On-Course - 90 min]                             │  │
│  │  Søn: [Hvile]                                          │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
│  ØVELSESBIBLIOTEK              VALGTE ØVELSER               │
│  ┌──────────────────┐         ┌──────────────────┐          │
│  │ ○ 3m Putting     │   →     │ ✓ 3m Putting     │          │
│  │ ○ 6m Putting     │         │ ✓ Gate Drill     │          │
│  │ ○ Gate Drill     │         │ ✓ Clock Drill    │          │
│  │ ○ Clock Drill    │         └──────────────────┘          │
│  │ ○ Distance Ctrl  │                                       │
│  └──────────────────┘                                       │
│                                                              │
│            [Lagre plan]    [Send til spiller]               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 7.5 Proof Viewer

Trenere kan se og godkjenne:
- Video-bevis for spesifikke øvelser
- Fotodokumentasjon av testresultater
- Screenrecordings fra launch monitors
- Trackman/FlightScope-data

## 7.6 Trajectory Viewer

Visualisering av spillerens utvikling over tid:
- Kategorihistorikk
- Testresultat-trender
- Prediktive analyser
- Sammenligning med peers

## 7.7 Intelligence & Alerts

AI-drevet analyse som varsler om:
- Fallende prestasjoner som krever oppmerksomhet
- Uvanlige mønstre i treningsdata
- Spillere som nærmer seg kategorigrenser
- Optimale tidspunkter for tester

## 7.8 Notat-system

- Føre løpende notater per spiller
- Strukturerte observasjoner
- Private vs delte notater
- Kobling til spesifikke økter/tester

## 7.9 Meldinger & Kommunikasjon

- Direkte meldinger til spillere
- Gruppemeldinger
- Automatiske påminnelser
- Planlagte meldinger

## 7.10 Gruppeadministrasjon

- Opprette og administrere treningsgrupper
- Tildele spillere til grupper
- Planlegge gruppeøkter
- Se gruppestatistikk

## 7.11 Øvelsesbibliotek (Trener)

Trenere kan:
- Se hele øvelsesbiblioteket
- Opprette egne øvelser
- Tilpasse eksisterende øvelser
- Tildele øvelser til treningsplaner

## 7.12 Statistikk & Rapporter

```
┌─────────────────────────────────────────────────────────────┐
│              TRENER-STATISTIKK                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  TOTAL OVERSIKT                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Spillere totalt:        24                          │   │
│  │  Aktive denne uken:      18 (75%)                    │   │
│  │  Kategorifremgang siste 6 mnd:                       │   │
│  │    ↑ 12 spillere (opp minst 1 kategori)              │   │
│  │    → 8 spillere (samme kategori)                     │   │
│  │    ↓ 4 spillere (ned en kategori)                    │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  KATEGORIFORDELING                                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ A: ░░ 0                                              │   │
│  │ B: ██ 2                                              │   │
│  │ C: ████ 4                                            │   │
│  │ D: ██████ 6                                          │   │
│  │ E: ████████ 8                                        │   │
│  │ F: ████ 4                                            │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  TOPP UTVIKLERE (siste 3 mnd)                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 1. Emma S.    E → C  (+2 kategorier)                 │   │
│  │ 2. Jonas K.   F → D  (+2 kategorier)                 │   │
│  │ 3. Maria L.   G → F  (+1 kategori)                   │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

# DEL 8: ADMIN-FUNKSJONER

## 8.1 Systemadministrasjon

- Brukeradministrasjon (opprette, deaktivere, roller)
- Tenant/Klubb-administrasjon (multi-tenancy)
- Feature flags (aktivere/deaktivere funksjoner)
- Systeminnstillinger

## 8.2 Eskaleringshåndtering

Håndtering av:
- Rapporterte problemer fra brukere
- Tekniske feilmeldinger
- Sikkerhetshendelser
- Support-eskalering

## 8.3 Tier Management

- Se og justere kategori-krav
- Administrere badge-definisjoner
- Justere XP-verdier
- Sesongbaserte justeringer

## 8.4 Systemoversikt

Dashboard med:
- Aktive brukere og vekst
- Systemhelse og responstider
- Feilrater og oppetid
- Ressursbruk

---

# DEL 9: TEKNISK ARKITEKTUR

## 9.1 Stack-oversikt

```
┌─────────────────────────────────────────────────────────────┐
│                    TEKNISK ARKITEKTUR                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  FRONTEND                         BACKEND                    │
│  ┌──────────────────┐            ┌──────────────────┐       │
│  │  React 18        │  ← API →  │  Fastify (Node)  │       │
│  │  TypeScript      │            │  TypeScript      │       │
│  │  Tailwind CSS    │            │  Prisma ORM      │       │
│  │  React Query     │            │  PostgreSQL      │       │
│  │  React Router    │            │  JWT Auth        │       │
│  └──────────────────┘            └──────────────────┘       │
│                                          │                   │
│                                          ▼                   │
│                                  ┌──────────────────┐       │
│                                  │   DATABASE       │       │
│                                  │  PostgreSQL 15   │       │
│                                  │  + TimescaleDB   │       │
│                                  └──────────────────┘       │
│                                                              │
│  INTEGRASJONER                                               │
│  ┌──────────────────┐  ┌──────────────────┐                 │
│  │  Met.no API      │  │  GolfBox API     │                 │
│  │  (Værdata)       │  │  (Turneringer)   │                 │
│  └──────────────────┘  └──────────────────┘                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 9.2 Datamodell (Utvalgte entiteter)

### Hovedentiteter

| Entitet | Beskrivelse |
|---------|-------------|
| **Tenant** | Klubb/Akademi (multi-tenancy) |
| **User** | Bruker med autentisering |
| **Player** | Spiller med golfdata |
| **Coach** | Trener med spillerkobling |
| **Test** | Testdefinisjon |
| **TestResult** | Testresultat per spiller |
| **TrainingSession** | Treningsøkt |
| **TrainingPlan** | Treningsplan med øvelser |
| **Badge** | Badge-definisjon |
| **PlayerBadge** | Tildelt badge |
| **Goal** | Spillermål |
| **CategoryRequirement** | Krav per kategori/kjønn |

### Relasjoner

```
Tenant ─┬─→ Player (1:N)
        ├─→ Coach (1:N)
        └─→ User (1:N)

Player ─┬─→ TestResult (1:N)
        ├─→ TrainingSession (1:N)
        ├─→ PlayerBadge (1:N)
        ├─→ Goal (1:N)
        └─→ Coach (N:1)

Coach ─┬─→ Player (1:N)
       └─→ TrainingPlan (1:N)

TrainingPlan ─→ Exercise (N:M)
```

## 9.3 API-struktur

### Hovedendepunkter

| Domene | Base Path | Beskrivelse |
|--------|-----------|-------------|
| Auth | `/api/v1/auth` | Autentisering, registrering, 2FA |
| Players | `/api/v1/players` | Spilleradministrasjon |
| Tests | `/api/v1/tests` | Testresultater og historikk |
| Training | `/api/v1/training-plan` | Treningsplaner og økter |
| Dashboard | `/api/v1/dashboard` | Dashboard-data |
| Badges | `/api/v1/badges` | Gamification |
| Coaches | `/api/v1/coaches` | Trenerfunksjoner |
| Coach Analytics | `/api/v1/coach-analytics` | Treneranalyse |
| Goals | `/api/v1/goals` | Målsettinger |
| Sessions | `/api/v1/sessions` | Øktadministrasjon |
| Weather | `/api/v1/weather` | Værdata (Met.no) |
| Golf Courses | `/api/v1/golf-courses` | Baneinfo |
| Groups | `/api/v1/groups` | Gruppeadministrasjon |
| Messaging | `/api/v1/messages` | Meldingssystem |
| Admin | `/api/v1/admin/*` | Administrasjon |

## 9.4 Sikkerhet

- **Autentisering:** JWT-basert med refresh tokens
- **Autorisasjon:** Rollebasert (RBAC) + tenant-isolasjon
- **Data:** Kryptert i transit (TLS) og rest (AES-256)
- **Multi-tenancy:** Strikt tenant-separasjon på databasenivå
- **API:** Rate limiting, input validering, CORS

## 9.5 Integrasjoner

### Met.no (Værdata)
- Sanntids værdata for norske golfbaner
- Værvarsel for planlegging
- Historisk værdata for analyse

### GolfBox (Turneringer)
- Turneringskalender
- Påmeldingsstatus
- Resultatimport

### Launch Monitors (Planlagt)
- Trackman-integrasjon
- FlightScope-støtte
- Automatisk datainnhenting

---

# DEL 10: POTENSIALE & SKALERBARHET

## 10.1 Markedspotensiale

### Norge

| Segment | Antall | Penetrasjonsestimat |
|---------|--------|---------------------|
| Aktive juniorer (13-21) | ~8,000 | 25% = 2,000 |
| Golfskoler/Akademier | ~50 | 40% = 20 |
| Klubbtrenere | ~200 | 30% = 60 |
| **Total potensielle brukere** | | **~2,100** |

### Nordisk

| Land | Potensielle juniorer | Markedsandel 5-års mål |
|------|---------------------|------------------------|
| Norge | 8,000 | 25% |
| Sverige | 25,000 | 15% |
| Danmark | 12,000 | 15% |
| Finland | 8,000 | 10% |
| **Total** | **53,000** | **~9,000 brukere** |

### Globalt (langsiktig)

- Europeisk junior-golf: ~500,000 spillere
- Amerikanske junior-golfer: ~3,000,000 spillere
- Asiatisk vekstmarked: Eksplosiv vekst

## 10.2 Inntektsmodeller

### B2C (Direkte til spiller)

| Tier | Pris/mnd | Funksjoner |
|------|----------|------------|
| Free | 0 kr | Grunnleggende profil, begrenset testing |
| Player | 99 kr | Full testing, badges, basis treningsplan |
| Pro | 199 kr | Avansert analyse, coach-kobling, AI-innsikt |

### B2B (Akademier & Forbund)

| Tier | Pris/mnd | Inkluderer |
|------|----------|------------|
| Academy Starter | 2,500 kr | Opp til 25 spillere |
| Academy Pro | 5,000 kr | Opp til 75 spillere |
| Federation | Custom | Ubegrenset, white-label, API |

### Estimert ARR ved full penetrasjon

```
Norge alene (realistisk scenario):
- 1,500 Player @ 99 kr/mnd = 1,782,000 kr/år
- 300 Pro @ 199 kr/mnd = 716,400 kr/år
- 15 Academy Starter = 450,000 kr/år
- 5 Academy Pro = 300,000 kr/år
─────────────────────────────────
Total estimert ARR: ~3,2 MNOK
```

## 10.3 Teknisk Skalerbarhet

```
SKALERINGSARKITEKTUR

┌─────────────────────────────────────────────────────────────┐
│                                                              │
│  CDN (Vercel/Cloudflare)                                    │
│         ↓                                                    │
│  ┌──────────────┐                                           │
│  │ Load Balancer│                                           │
│  └──────┬───────┘                                           │
│         ↓                                                    │
│  ┌──────────────────────────────────────────────┐           │
│  │            API Cluster (Auto-scaling)         │           │
│  │  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐         │           │
│  │  │ Pod │  │ Pod │  │ Pod │  │ ... │         │           │
│  │  └─────┘  └─────┘  └─────┘  └─────┘         │           │
│  └──────────────────────────────────────────────┘           │
│         ↓                                                    │
│  ┌──────────────────────────────────────────────┐           │
│  │         PostgreSQL (Read Replicas)            │           │
│  │  ┌────────┐     ┌────────┐     ┌────────┐   │           │
│  │  │ Primary│ ──→ │Replica1│ ──→ │Replica2│   │           │
│  │  └────────┘     └────────┘     └────────┘   │           │
│  └──────────────────────────────────────────────┘           │
│                                                              │
│  Kapasitet: 100,000+ samtidige brukere                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 10.4 Fremtidige Funksjoner

### Q1-Q2 2025
- [ ] Mobilapp (iOS/Android)
- [ ] Video-analyse med AI
- [ ] Utvidet launch monitor-integrasjon

### Q3-Q4 2025
- [ ] Sosiale funksjoner (leaderboards, utfordringer)
- [ ] Parent portal for yngre spillere
- [ ] Avansert prediktiv analyse

### 2026+
- [ ] VR/AR treningsstøtte
- [ ] Internasjonal ekspansjon
- [ ] Wearable-integrasjon
- [ ] Automatisk video-tagging

---

# DEL 11: KONKURRANSEFORTRINN

## 11.1 Unike differensierere

| Område | IUP Golf | Konkurrenter |
|--------|----------|--------------|
| **Kategori-system** | Offisielt NGF-system (A-K) | Egne/ingen systemer |
| **Testkrav** | 20 standardiserte tester | Ad-hoc testing |
| **Kjønnstilpasning** | Separate krav M/K | Ofte unisex |
| **Gamification** | 85 badges, XP-system | Begrenset/ingen |
| **Trenerverktøy** | Komplett trenerportal | Begrensede verktøy |
| **Norsk tilpasning** | Språk, klubber, turneringer | Utenlandske systemer |
| **NGF-støtte** | Offisiell partner | Uavhengig |

## 11.2 Tekniske fortrinn

- **Moderne stack:** React, TypeScript, Prisma
- **Mobil-først:** Responsivt design, PWA-støtte
- **Sanntidsdata:** Værdata, turneringsinfo
- **Skalerbar:** Cloud-native arkitektur
- **Sikker:** Enterprise-grade sikkerhet

## 11.3 Strategiske fortrinn

- **NGF-partnerskap:** Offisiell sanksjonering
- **Lokalt utviklet:** Norsk team, norske behov
- **Golffaglig forankring:** Utviklet med trenere og akademier
- **Kontinuerlig forbedring:** Agil utvikling med bruker-feedback

---

# VEDLEGG A: FARGEPALETT (Visuell Referanse)

```
╔══════════════════════════════════════════════════════════════╗
║                    AK GOLF ACADEMY                            ║
║                    FARGEPALETT v3.0                           ║
╠══════════════════════════════════════════════════════════════╣
║                                                               ║
║  MERKEVAREFARGER                                              ║
║  ───────────────                                              ║
║                                                               ║
║  ┌────────┐                                                   ║
║  │████████│  AK Ink        #02060D    Tekst, mørke elementer  ║
║  └────────┘                                                   ║
║                                                               ║
║  ┌────────┐                                                   ║
║  │████████│  AK Primary    #10456A    Primærfarge             ║
║  └────────┘                                                   ║
║                                                               ║
║  ┌────────┐                                                   ║
║  │████████│  AK Primary L  #2C5F7F    Hover, sekundær         ║
║  └────────┘                                                   ║
║                                                               ║
║  ┌────────┐                                                   ║
║  │░░░░░░░░│  AK Snow       #EDF0F2    Bakgrunn                ║
║  └────────┘                                                   ║
║                                                               ║
║  ┌────────┐                                                   ║
║  │▒▒▒▒▒▒▒▒│  AK Surface    #EBE5DA    Kort, flater           ║
║  └────────┘                                                   ║
║                                                               ║
║  ┌────────┐                                                   ║
║  │████████│  AK Gold       #C9A227    Aksent, premium         ║
║  └────────┘                                                   ║
║                                                               ║
║  STATUSFARGER                                                 ║
║  ────────────                                                 ║
║                                                               ║
║  ┌────────┐                                                   ║
║  │████████│  Success       #4A7C59    Grønn - Bestått         ║
║  └────────┘                                                   ║
║                                                               ║
║  ┌────────┐                                                   ║
║  │████████│  Warning       #D4A84B    Gul - Advarsel          ║
║  └────────┘                                                   ║
║                                                               ║
║  ┌────────┐                                                   ║
║  │████████│  Error         #C45B4E    Rød - Feil              ║
║  └────────┘                                                   ║
║                                                               ║
║  TIER-FARGER (BADGES)                                         ║
║  ────────────────────                                         ║
║                                                               ║
║  ┌────────┐                                                   ║
║  │████████│  Bronze        #B08D57    Bronse-tier             ║
║  └────────┘                                                   ║
║                                                               ║
║  ┌────────┐                                                   ║
║  │████████│  Silver        #8A9BA8    Sølv-tier               ║
║  └────────┘                                                   ║
║                                                               ║
║  ┌────────┐                                                   ║
║  │████████│  Gold          #C9A227    Gull-tier               ║
║  └────────┘                                                   ║
║                                                               ║
║  ┌────────┐                                                   ║
║  │░░░░░░░░│  Platinum      #E5E4E2    Platinum-tier           ║
║  └────────┘                                                   ║
║                                                               ║
╚══════════════════════════════════════════════════════════════╝
```

---

# VEDLEGG B: ALLE 85 BADGES

## Volum Badges (15)

| # | Badge Navn | Bronse | Sølv | Gull |
|---|------------|--------|------|------|
| 1 | Session Master | 10 økter | 50 økter | 100 økter |
| 2 | Hour Logger | 10 timer | 50 timer | 100 timer |
| 3 | Drill Champion | 100 drills | 500 drills | 1000 drills |
| 4 | Driving Range Hero | 500 baller | 2500 baller | 10000 baller |
| 5 | Practice Dedication | 25 dager | 100 dager | 365 dager |
| 6 | Short Game Specialist | 20 økter | 100 økter | 250 økter |
| 7 | Iron Grinder | 500 jern-slag | 2500 slag | 10000 slag |
| 8 | Putting Marathon | 500 putter | 2500 putter | 10000 putter |
| 9 | Bunker Battler | 100 bunker-slag | 500 slag | 2000 slag |
| 10 | Approach Artist | 200 approach | 1000 approach | 5000 approach |
| 11 | Mental Minutes | 60 min | 300 min | 1000 min |
| 12 | Physical Prowess | 10 fysiske økter | 50 økter | 150 økter |
| 13 | Video Analyzer | 10 videoer | 50 videoer | 200 videoer |
| 14 | Course Conqueror | 5 runder | 25 runder | 100 runder |
| 15 | Test Taker | 5 tester | 25 tester | 100 tester |

## Streak Badges (12)

| # | Badge Navn | Bronse | Sølv | Gull |
|---|------------|--------|------|------|
| 1 | Daily Dedication | 3 dager | 7 dager | 14 dager |
| 2 | Weekly Warrior | 2 uker | 4 uker | 8 uker |
| 3 | Monthly Master | 1 måned | 3 måneder | 6 måneder |
| 4 | Hot Start | 3 dager streak | 5 dager | 7 dager |
| 5 | On Fire | 7 dager | 14 dager | 21 dager |
| 6 | Blazing | 14 dager | 21 dager | 30 dager |
| 7 | Unstoppable | 30 dager | 45 dager | 60 dager |
| 8 | Legendary Streak | 60 dager | 90 dager | 180 dager |
| 9 | Comeback King | Gjenoppta 2x | 4x | 8x |
| 10 | Morning Person | 10 morgenøkter | 30 økter | 100 økter |
| 11 | Night Owl | 10 kveldsøkter | 30 økter | 100 økter |
| 12 | Weekend Warrior | 10 helgeøkter | 30 økter | 100 økter |

## Prestasjons Badges (18)

| # | Badge Navn | Krav |
|---|------------|------|
| 1 | Category Champion | Oppnå kategori-økning |
| 2 | Double Jump | Hoppe 2 kategorier |
| 3 | All-Rounder | Score 6+ i alle testområder |
| 4 | Driver Pro | Driver avstand 250m+ (M) / 220m+ (K) |
| 5 | Putting Wizard | 3m putting 80%+ |
| 6 | Iron Man | 5-jern avstand 175m+ (M) / 150m+ (K) |
| 7 | Short Game Genius | Chipping snitt under 150cm |
| 8 | Bunker Boss | Bunker snitt under 200cm |
| 9 | Speed Demon | Klubbhastighet 175km/t+ (M) / 150km/t+ (K) |
| 10 | Smash King | Smash factor 1.45+ |
| 11 | Approach Ace | PEI under 1.5 på alle approach |
| 12 | Endurance Elite | 3000m under 12:00 (M) / 13:00 (K) |
| 13 | Power Player | Benkpress 100kg+ (M) / 60kg+ (K) |
| 14 | Strength Star | Markløft 150kg+ (M) / 100kg+ (K) |
| 15 | Perfect Week | 100% plan-etterlevelse i 1 uke |
| 16 | Perfect Month | 100% plan-etterlevelse i 1 måned |
| 17 | Test Ace | Bestå alle tester på ønsket nivå |
| 18 | Physical Beast | Bestå alle fysiske tester på A-nivå |

## Fase/Onboarding Badges (10)

| # | Badge Navn | Krav |
|---|------------|------|
| 1 | First Steps | Fullfør profiloppsettet |
| 2 | Ready to Train | Fullfør første økt |
| 3 | Getting Started | Logg 5 økter |
| 4 | Week One | 7 dager aktiv |
| 5 | Getting Serious | 25 økter fullført |
| 6 | Month Strong | 30 dager aktiv |
| 7 | Committed | 100 økter totalt |
| 8 | Half Year Hero | 180 dager aktiv |
| 9 | Lifer | 365 dager aktiv |
| 10 | Veteran | 2 års aktivitet |

## Spesielle Badges (15)

| # | Badge Navn | Krav |
|---|------------|------|
| 1 | First Blood | Første testresultat registrert |
| 2 | Personal Best | Slå egen rekord |
| 3 | Rapid Rise | 2 kategorier på 3 måneder |
| 4 | Consistency King | 90%+ oppmøte over 3 måneder |
| 5 | Weakness Crusher | Forbedre svakeste område med 20%+ |
| 6 | Goal Getter | Oppnå et satt mål |
| 7 | Multi-Tasker | Trene 3+ ulike områder samme uke |
| 8 | Early Riser | 20 økter før kl. 08:00 |
| 9 | Dedication Warrior | Trene på alle 7 ukedager minst 1 gang |
| 10 | Social Golfer | Delta i gruppetrening 10 ganger |
| 11 | Tournament Ready | Fullfør turnerings-forberedelse |
| 12 | Battle Tested | 5 turneringer fullført |
| 13 | Champion | Vinn en turnering |
| 14 | Mentor | Hjelp 3 junior-spillere |
| 15 | Academy Pride | Fullfør akademi-utfordring |

## Sesong Badges (15)

| # | Badge Navn | Krav |
|---|------------|------|
| 1 | Spring Starter | 20 økter i mars-mai |
| 2 | Summer Sizzle | 30 økter i juni-august |
| 3 | Fall Fighter | 20 økter i september-november |
| 4 | Winter Warrior | 15 økter i desember-februar |
| 5 | January Jumper | Trene alle dager i januar |
| 6 | Summer Camp Graduate | Fullfør sommertreningsleir |
| 7 | Season Opener | Spille sesongstart-turnering |
| 8 | Season Closer | Spille sesongavslutning |
| 9 | Holiday Hustler | Trene i juleferien |
| 10 | Easter Effort | Trene i påskeferien |
| 11 | New Year Resolution | Trene 7 dager i januar |
| 12 | Midsummer Magic | Trene 21. juni |
| 13 | End of Year Strong | Minimum 20 økter i desember |
| 14 | Quarterly Champion | Topp-utvikling i et kvartal |
| 15 | Year in Review | Fullfør alle sesongbadges |

---

# VEDLEGG C: KOMPLETT TEST-MATRISE

## Alle Kategorikrav (A-K) for Menn

| Test | A | B | C | D | E | F | G | H | I | J | K |
|------|---|---|---|---|---|---|---|---|---|---|---|
| 1. Driver (m) | 270 | 260 | 250 | 240 | 230 | 220 | 210 | 200 | 190 | 180 | 170 |
| 2. 3-Tre (m) | 250 | 240 | 230 | 220 | 210 | 200 | 190 | 180 | 170 | 160 | 150 |
| 3. 5-Jern (m) | 190 | 185 | 180 | 175 | 170 | 165 | 160 | 155 | 150 | 145 | 140 |
| 4. Wedge (m) | 130 | 125 | 120 | 115 | 110 | 105 | 100 | 95 | 90 | 85 | 80 |
| 5. Klubbh. (km/t) | 193 | 185 | 177 | 169 | 161 | 153 | 145 | 137 | 129 | 121 | 113 |
| 6. Ballh. (km/t) | 285 | 270 | 255 | 240 | 225 | 210 | 195 | 180 | 170 | 160 | 145 |
| 7. Smash | 1.48 | 1.46 | 1.44 | 1.42 | 1.40 | 1.38 | 1.36 | 1.34 | 1.32 | 1.30 | 1.28 |
| 8. 25m PEI | ≤1.0 | ≤1.2 | ≤1.4 | ≤1.6 | ≤1.8 | ≤2.0 | ≤2.2 | ≤2.4 | ≤2.6 | ≤2.8 | ≤3.0 |
| 9. 50m PEI | ≤1.0 | ≤1.2 | ≤1.4 | ≤1.6 | ≤1.8 | ≤2.0 | ≤2.2 | ≤2.4 | ≤2.6 | ≤2.8 | ≤3.0 |
| 10. 75m PEI | ≤1.0 | ≤1.2 | ≤1.4 | ≤1.6 | ≤1.8 | ≤2.0 | ≤2.2 | ≤2.4 | ≤2.6 | ≤2.8 | ≤3.0 |
| 11. 100m PEI | ≤1.0 | ≤1.2 | ≤1.4 | ≤1.6 | ≤1.8 | ≤2.0 | ≤2.2 | ≤2.4 | ≤2.6 | ≤2.8 | ≤3.0 |
| 12. Benk (kg) | 140 | 130 | 120 | 110 | 100 | 90 | 80 | 70 | 60 | 50 | 40 |
| 13. Markl. (kg) | 200 | 185 | 170 | 155 | 140 | 125 | 110 | 95 | 80 | 65 | 50 |
| 14. 3km (min) | 11:00 | 11:30 | 12:00 | 12:30 | 13:00 | 13:30 | 14:00 | 15:00 | 16:00 | 17:00 | 18:00 |
| 15. Putt 3m (%) | 90 | 80 | 70 | 60 | 50 | 40 | 35 | 30 | 25 | 20 | 15 |
| 16. Putt 6m (%) | 50 | 40 | 30 | 25 | 20 | 15 | 12 | 10 | 8 | 5 | 5 |
| 17. Chip (cm) | ≤100 | ≤120 | ≤150 | ≤180 | ≤200 | ≤220 | ≤250 | ≤280 | ≤300 | ≤320 | ≤350 |
| 18. Bunker (cm) | ≤150 | ≤180 | ≤200 | ≤220 | ≤250 | ≤280 | ≤300 | ≤320 | ≤350 | ≤380 | ≤400 |
| 19. 9-hull (+) | 0 | +2 | +4 | +6 | +8 | +10 | +12 | +14 | +16 | +18 | +20 |
| 20. On-course (+) | 0 | +1 | +2 | +3 | +4 | +5 | +6 | +7 | +8 | +10 | +12 |

## Alle Kategorikrav (A-K) for Kvinner

| Test | A | B | C | D | E | F | G | H | I | J | K |
|------|---|---|---|---|---|---|---|---|---|---|---|
| 1. Driver (m) | 240 | 230 | 220 | 210 | 200 | 190 | 180 | 170 | 160 | 150 | 140 |
| 2. 3-Tre (m) | 210 | 200 | 190 | 180 | 170 | 160 | 150 | 140 | 130 | 120 | 110 |
| 3. 5-Jern (m) | 165 | 160 | 155 | 150 | 145 | 140 | 135 | 130 | 125 | 120 | 115 |
| 4. Wedge (m) | 110 | 105 | 100 | 95 | 90 | 85 | 80 | 75 | 70 | 65 | 60 |
| 5. Klubbh. (km/t) | 169 | 161 | 153 | 145 | 137 | 129 | 121 | 113 | 105 | 97 | 89 |
| 6. Ballh. (km/t) | 250 | 235 | 220 | 205 | 190 | 180 | 170 | 160 | 150 | 140 | 130 |
| 7. Smash | 1.48 | 1.46 | 1.44 | 1.42 | 1.40 | 1.38 | 1.36 | 1.34 | 1.32 | 1.30 | 1.28 |
| 8-11. Approach | (Samme som menn) |
| 12. Benk (kg) | 100 | 90 | 80 | 70 | 60 | 50 | 45 | 40 | 35 | 30 | 25 |
| 13. Markl. (kg) | 140 | 130 | 120 | 110 | 100 | 90 | 80 | 70 | 60 | 50 | 40 |
| 14. 3km (min) | 12:30 | 13:00 | 13:30 | 14:00 | 14:30 | 15:00 | 15:30 | 16:30 | 17:30 | 18:30 | 20:00 |
| 15-20. Short Game | (Samme som menn) |

---

# VEDLEGG D: API-ENDEPUNKTER

## Autentisering (`/api/v1/auth`)

| Metode | Endpoint | Beskrivelse |
|--------|----------|-------------|
| POST | `/register` | Opprett ny bruker |
| POST | `/login` | Logg inn |
| POST | `/logout` | Logg ut |
| POST | `/refresh` | Forny token |
| POST | `/forgot-password` | Glemt passord |
| POST | `/reset-password` | Tilbakestill passord |
| POST | `/2fa/enable` | Aktiver 2FA |
| POST | `/2fa/verify` | Verifiser 2FA |

## Spillere (`/api/v1/players`)

| Metode | Endpoint | Beskrivelse |
|--------|----------|-------------|
| GET | `/` | Liste spillere |
| GET | `/:id` | Hent spiller |
| PUT | `/:id` | Oppdater spiller |
| GET | `/:id/tests` | Spillerens tester |
| GET | `/:id/badges` | Spillerens badges |
| GET | `/:id/progress` | Spillerens progresjon |
| GET | `/:id/training-plan` | Spillerens treningsplan |

## Tester (`/api/v1/tests`)

| Metode | Endpoint | Beskrivelse |
|--------|----------|-------------|
| GET | `/` | Liste alle testtyper |
| GET | `/results/:playerId` | Spillerens resultater |
| POST | `/results` | Registrer resultat |
| GET | `/history/:playerId/:testId` | Testhistorikk |
| GET | `/category-requirements` | Kategorikrav |

## Dashboard (`/api/v1/dashboard`)

| Metode | Endpoint | Beskrivelse |
|--------|----------|-------------|
| GET | `/player/:id` | Spiller-dashboard |
| GET | `/coach/:id` | Trener-dashboard |
| GET | `/stats/:playerId` | Statistikk |
| GET | `/goals/:playerId` | Mål og progresjon |

## Badges (`/api/v1/badges`)

| Metode | Endpoint | Beskrivelse |
|--------|----------|-------------|
| GET | `/` | Alle badges |
| GET | `/player/:id` | Spillerens badges |
| GET | `/progress/:id` | Badge-progresjon |
| POST | `/evaluate/:playerId` | Evaluer badges |

## Trening (`/api/v1/training-plan`)

| Metode | Endpoint | Beskrivelse |
|--------|----------|-------------|
| GET | `/:playerId` | Hent plan |
| POST | `/` | Opprett plan |
| PUT | `/:id` | Oppdater plan |
| GET | `/exercises` | Øvelsesbibliotek |

---

# VEDLEGG E: SKJERMBILDER (Wireframes)

## Spiller Dashboard (Mobil)

```
┌────────────────────────────┐
│ ☰  IUP Golf      👤        │
├────────────────────────────┤
│                            │
│  ┌────────────────────┐    │
│  │   KATEGORI D       │    │
│  │   ━━━━━━━░░░ 78%   │    │
│  │   Neste: C         │    │
│  └────────────────────┘    │
│                            │
│  DAGENS TRENING            │
│  ┌────────────────────┐    │
│  │ 🏌️ Short Game      │    │
│  │ 45 min | 3 øvelser │    │
│  │                    │    │
│  │    [Start økt]     │    │
│  └────────────────────┘    │
│                            │
│  STREAK                    │
│  ┌────────────────────┐    │
│  │ 🔥 14 dager        │    │
│  │ Fortsett i morgen! │    │
│  └────────────────────┘    │
│                            │
│  SISTE BADGES              │
│  ┌────┐ ┌────┐ ┌────┐     │
│  │ 🥇 │ │ 🥈 │ │ 🥉 │     │
│  └────┘ └────┘ └────┘     │
│                            │
├────────────────────────────┤
│ 🏠  📊  ➕  🏆  👤        │
└────────────────────────────┘
```

## Testresultater (Mobil)

```
┌────────────────────────────┐
│ ←  Testresultater          │
├────────────────────────────┤
│                            │
│  DRIVER AVSTAND            │
│  ┌────────────────────┐    │
│  │                    │    │
│  │  ┌──────────────┐  │    │
│  │  │    235m      │  │    │
│  │  │   Siste      │  │    │
│  │  └──────────────┘  │    │
│  │                    │    │
│  │  Kategori D: 240m  │    │
│  │  ━━━━━━━━━░░ 98%   │    │
│  │                    │    │
│  └────────────────────┘    │
│                            │
│  HISTORIKK                 │
│  ┌────────────────────┐    │
│  │ 250┤              ● │    │
│  │ 240┤         ●      │    │
│  │ 230┤     ●          │    │
│  │ 220┤ ●              │    │
│  │    └─┬──┬──┬──┬──┬─ │    │
│  │      J  F  M  A  M  │    │
│  └────────────────────┘    │
│                            │
│  ALLE TESTER               │
│  ┌────────────────────┐    │
│  │ • 3-Tre: 228m   ✓  │    │
│  │ • 5-Jern: 172m  ✓  │    │
│  │ • Wedge: 112m   ✓  │    │
│  │ • 3m Putt: 75%  ○  │    │
│  └────────────────────┘    │
│                            │
└────────────────────────────┘
```

## Trener Dashboard (Desktop)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  🏌️ IUP Golf Coach                                    🔔  👤 Coach Name  │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌────────────────────────────────────┐  ┌────────────────────────────┐  │
│  │  VARSLER                           │  │  OPPSUMMERING              │  │
│  │  ──────                            │  │  ───────────               │  │
│  │  🔴 Emma S. - fallende prestasjon  │  │  Spillere: 24              │  │
│  │  🟡 3 tester å godkjenne           │  │  Aktive: 18 (75%)          │  │
│  │  🟢 Jonas K. - ny kategori C       │  │  Økter denne uke: 47       │  │
│  │                                    │  │  Snitt fremgang: +12%      │  │
│  └────────────────────────────────────┘  └────────────────────────────┘  │
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────────────┐│
│  │  MINE SPILLERE                                              [+ Ny]   ││
│  │  ─────────────                                                       ││
│  │  ┌──────────┬──────────┬────────┬──────────┬──────────┬───────────┐ ││
│  │  │ Navn     │ Kategori │ Trend  │ Aktivitet│ Siste økt│ Handlinger│ ││
│  │  ├──────────┼──────────┼────────┼──────────┼──────────┼───────────┤ ││
│  │  │ Emma S.  │ D        │ ↓ -5%  │ 85%      │ I dag    │ 👁️ ✏️     │ ││
│  │  │ Jonas K. │ C ⬆️     │ ↑ +18% │ 92%      │ I går    │ 👁️ ✏️     │ ││
│  │  │ Maria L. │ E        │ → 0%   │ 78%      │ 2 dager  │ 👁️ ✏️     │ ││
│  │  │ ...      │ ...      │ ...    │ ...      │ ...      │ ...       │ ││
│  │  └──────────┴──────────┴────────┴──────────┴──────────┴───────────┘ ││
│  └──────────────────────────────────────────────────────────────────────┘│
│                                                                           │
│  ┌────────────────────────────┐  ┌────────────────────────────────────┐  │
│  │  KOMMENDE TURNERINGER     │  │  SKADE-TRACKER                      │  │
│  │  ─────────────────────    │  │  ─────────────                      │  │
│  │  ● NM Junior (3 påmeldt)  │  │  Emma S. - Håndledd - 5 dager       │  │
│  │  ● NGF Tour (5 påmeldt)   │  │  Jonas K. - Rygg - Evaluering       │  │
│  └────────────────────────────┘  └────────────────────────────────────┘  │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

---

# VEDLEGG F: ORDLISTE

| Begrep | Forklaring |
|--------|------------|
| **A-K Kategori** | Norges Golfforbunds nivåsystem fra A (elite) til K (nybegynner) |
| **Badge** | Digital utmerkelse for oppnådde milepæler |
| **Carry** | Distansen ballen flyr i luften før landing |
| **Coach Portal** | Trenerens dashboard og administrasjonsverktøy |
| **GIR** | Greens In Regulation - grønn truffet på regulering |
| **IUP** | Individuell Utviklingsplan |
| **Launch Monitor** | Teknologi som måler balldata (Trackman, FlightScope) |
| **PEI** | Precision Efficiency Index - mål på approach-presisjon |
| **Smash Factor** | Forholdet mellom ball- og klubbhastighet |
| **Streak** | Sammenhengende dager med aktivitet |
| **Tenant** | Klubb/akademi i multi-tenant-arkitekturen |
| **Tier** | Nivå innen et badge (Bronse, Sølv, Gull) |
| **XP** | Experience Points - poeng opptjent gjennom aktivitet |

---

*Dokumentasjon utarbeidet for presentasjon til Norges Golfforbund og partnere.*
*Versjon 1.1.0 | Desember 2025*
*© AK Golf Academy*
