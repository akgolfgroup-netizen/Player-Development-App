# Contract Enforcement Summary

## Kontekst

Golf-treningsapp (AK Golf Academy) med streng produktfilosofi:

- **Ingen gamification** (XP, badges, streaks)
- **Ingen motivasjonsretorikk** ("Great job!", "Keep it up!")
- **Ingen progresjonsspråk** før bevis foreligger
- **Nøytral presentasjon** av resultater (ingen grønn/rød fargekoding)

For å sikre at filosofien aldri brytes, ble det bygget et **automatisk håndhevingssystem** som gjør det teknisk umulig å introdusere brudd.

---

## Arkitektur

```
repo/
├── apps/golfer/screens/
│   ├── SESSION.tsx      # Øktgjennomføring
│   ├── REFLECTION.tsx   # Innsamling etter økt
│   ├── HOME.tsx         # Orientering
│   ├── BASELINE.tsx     # Referansepunkt-oppsett
│   ├── PROOF.tsx        # Bevisvisning
│   ├── TRAJECTORY.tsx   # Historikk
│   └── index.ts
├── scripts/
│   └── contract-check.ts
├── .github/
│   ├── workflows/contract.yml
│   └── pull_request_template.md
└── docs/
    └── IMPLEMENTATION_CONTRACT.md
```

---

## Skjermansvar

Hver skjerm har **ett ansvar** og er **låst** fra å gjøre andre skjermers jobb:

| Skjerm | Ansvar | Forbud |
|--------|--------|--------|
| **SESSION** | Støtte øktgjennomføring uten distraksjon | Ingen outcome, proof, baseline, mål |
| **REFLECTION** | Samle inn subjektiv input uten evaluering | Ingen sammenligning, rating, forbedring |
| **HOME** | Orientere til neste handling | Ingen progresjon, benchmark-resultater |
| **BASELINE** | Etablere nøytralt referansepunkt | Ingen mål, forventning, prediksjon |
| **PROOF** | Vise ubestridelig bevis uten tolkning | Ingen effort, motivasjon, kausalitet |
| **TRAJECTORY** | Vise historikk uten prediksjon | Ingen trend, gjennomsnitt, "best/worst" |

---

## Automatisk håndhevelse

### `scripts/contract-check.ts`

Statisk analyse som kjører på alle `.tsx`-filer i `apps/golfer/screens/`.

**Globale forbudte mønstre (alle skjermer):**

```typescript
/\bprogress\b/i
/\bimprovement\b/i
/keep it up/i
/\bgreat\b/i
/\bstreak\b/i
/\bXP\b/
/#4A7C59/i  // grønn
/#C45B4E/i  // rød
/StreakCounter/
/TrendArrow/
```

**Skjermspesifikke forbudte mønstre:**

| Skjerm | Forbudt |
|--------|---------|
| SESSION | improve, progress, baseline, proof, better, worse, goal, benchmark, score |
| REFLECTION | improve, progress, baseline, better, worse, "great session", score, rating |
| HOME | on track, improve, progress, proof, benchmark, goal, recommend |
| BASELINE | improve, progress, goal, expect, ambitious, conservative, recommend, journey |
| PROOF | great job, keep going, effort, session, motivat, because you, decline, sorry |
| TRAJECTORY | trend, improve, forecast, prediction, on track, average, best, worst |

### `.github/workflows/contract.yml`

```yaml
name: Implementation Contract Check

on:
  pull_request:
    paths:
      - "apps/**"
      - "packages/**"
      - "scripts/**"
      - "docs/IMPLEMENTATION_CONTRACT.md"
  push:
    branches: [main]

jobs:
  contract:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npx tsx scripts/contract-check.ts
```

**Resultat:** PR kan ikke merges hvis kontrakten brytes.

---

## Skjermimplementasjoner

### SESSION.tsx
- Rep-teller (56pt font, sentrum)
- Økttid (HH:MM:SS)
- Blokktid (MM:SS nedtelling)
- Pause-overlay med "Fortsett" / "Avslutt økt"
- Haptic feedback på rep-endring
- Tilstander: active, paused, block-complete, session-complete

### REFLECTION.tsx
- Kropp-skala (5-punkt, emoji: 😫😕😐🙂💪)
- Hode-skala (5-punkt, emoji: 😤😔😐😊😌)
- Søvn-timer (segmentert: 5, 6, 7, 8, 9+)
- Søvn-kvalitet (3-punkt)
- Fritekst-notater
- Alle inputs valgfrie

### HOME.tsx
- Bruker-navn + dato
- Neste økt-kort (treningsområde, tid, sted, varighet)
- Nedtelling til test/event
- Akkumulert innsats (timer, økter, per område)
- "PÅGÅR"-tilstand hvis økt er aktiv

### BASELINE.tsx
- 3-stegs veiviser
- Steg 1: Forklaring av baseline-konsept
- Steg 2: Valg mellom sesongsnitt / siste 8 runder
- Steg 3: Bekreftelse med implikasjoner
- Baseline låses etter bekreftelse

### PROOF.tsx
- Test-navn + dato
- NÅ-verdi (48pt+, nøytral farge)
- BASELINE-verdi
- ENDRING (delta med fortegn: +5.7 eller −3.4)
- "Forstått"-knapp (ikke "OK")
- Identisk layout for positive/negative resultater

### TRAJECTORY.tsx
- "Historikk" tittel
- Kategori-filter (Alle, Putting, Langspill, etc.)
- Kronologisk liste gruppert etter benchmark-dato
- Test-kort: navn, verdi, baseline, delta
- Tap → åpner PROOF for den testen

---

## Design Tokens

Alle skjermer bruker `@ak-golf/design-system`:

```typescript
tokens.colors.primary    // Primærfarge
tokens.colors.charcoal   // Tekst
tokens.colors.steel      // Sekundær tekst
tokens.colors.white      // Bakgrunn
tokens.colors.snow       // Lysgrå bakgrunn
tokens.colors.mist       // Dividers, inaktive elementer
tokens.colors.surface    // Kort-bakgrunn
```

---

## Edge Cases

| Skjerm | Case | Håndtering |
|--------|------|------------|
| PROOF | Første test | "Første test" som baseline, em-dash for delta |
| PROOF | Delta = 0 | "(0)" ikke "(+0)" eller "(−0)" |
| TRAJECTORY | Ingen tester | "Ingen tester registrert" |
| TRAJECTORY | Tom kategori | "Ingen tester i denne kategorien" |
| HOME | Ingen økter | "Ingen økter planlagt" |
| BASELINE | Kun sesongsnitt | Skjul "siste 8"-alternativ |

---

## Hvorfor dette systemet

1. **Tillit:** Brukere skal stole på at appen ikke manipulerer følelser
2. **Ærlighet:** Ingen påstander om forbedring uten bevis
3. **Autonomi:** Brukeren tolker selv, appen presenterer fakta
4. **Konsistens:** Umulig å introdusere brudd ved uhell

---

## Kjøre lokalt

```bash
# Kjør kontraktsjekk
npx tsx scripts/contract-check.ts

# Forventet output ved suksess:
# ✅ Implementation Contract check passed.

# Forventet output ved brudd:
# ❌ PROOF.tsx
#    Screen rule violation: "/\beffort\b/i"
# ⛔ Implementation Contract violated.
```

---

## Oppsummering

| Komponent | Status |
|-----------|--------|
| 6 skjermer implementert | ✓ |
| Automatisk kontraktsjekk | ✓ |
| CI-workflow | ✓ |
| PR-mal | ✓ |
| Kontraktdokument | ✓ |

**Kontrakten er teknisk umulig å bryte uten at CI feiler.**
