# Kritiske beslutninger for systemkoherens

> Dette dokumentet inneholder 4 beslutninger som MÅ tas før algoritmer kan røres.
> Hver beslutning har kontekst, alternativer, og et felt for endelig valg.

**Status:** UBESVART - Krever produktbeslutning

---

## Beslutning 1: Når skal planen regenereres?

### Kontekst

Dagens situasjon:
- Planer genereres én gang og er deretter statiske
- Coach kan manuelt justere økter, uker, turneringer
- Testresultater oppdaterer breaking points, men ikke planen
- Ingen automatisk respons på endrede forutsetninger

**Konsekvens:** En spiller som trener 50% mer enn planlagt, eller som har et gjennombrudd, fortsetter med samme plan.

### Alternativer

#### A) Aldri automatisk regenerering (status quo)
```
Trigger: Kun manuell coach-handling
Hva endres: Det coach eksplisitt endrer
```

| Fordeler | Ulemper |
|----------|---------|
| Forutsigbart for spiller | Coach må følge med aktivt |
| Trener har full kontroll | Planer blir utdaterte |
| Enklest å implementere | Mister adaptiv verdi |

#### B) Periodisk regenerering (ukentlig/månedlig)
```
Trigger: Scheduled job (hver søndag / 1. i måneden)
Hva endres: Fremtidige økter basert på oppdatert data
```

| Fordeler | Ulemper |
|----------|---------|
| Automatisk oppdatering | Kan føles ustabilt for spiller |
| Fanger opp endringer | Trenger god kommunikasjon |
| Balanse mellom stabilitet og adaptivitet | Mer kompleks implementering |

#### C) Hendelsesdrevet regenerering
```
Trigger:
- Kategori-opprykk
- Breaking point resolved/regressed
- >20% avvik fra forventet gjennomføring
- Ny turnering lagt til

Hva endres: Avhenger av trigger-type
```

| Fordeler | Ulemper |
|----------|---------|
| Reagerer på reelle endringer | Kan bli uforutsigbart |
| Idrettsfaglig korrekt | Kompleks å implementere |
| Maksimal adaptivitet | Krever god UX for å forklare |

#### D) Foreslå, ikke tving
```
Trigger: Som C, men genererer forslag
Hva endres: Ingenting før coach/spiller godkjenner
```

| Fordeler | Ulemper |
|----------|---------|
| Beholder kontroll hos mennesker | Krever aktiv oppfølging |
| Transparent system | Forslag kan ignoreres |
| God mellomløsning | Ekstra UX-kompleksitet |

### Beslutning

```
┌─────────────────────────────────────────────────────────────┐
│ VALGT ALTERNATIV: [ ]                                       │
│                                                             │
│ BEGRUNNELSE:                                                │
│                                                             │
│                                                             │
│                                                             │
│ BESLUTTET AV: ________________  DATO: ________________      │
└─────────────────────────────────────────────────────────────┘
```

### Implementeringskonsekvenser

| Valg | Kode som må endres |
|------|-------------------|
| A | Ingen |
| B | Ny scheduled job, `plan-regeneration.service.ts` |
| C | Event listeners, trigger-logikk, partial regeneration |
| D | Som C + forslags-UI + godkjennings-flow |

---

## Beslutning 2: Hvordan skal mål valideres mot virkelighet?

### Kontekst

Dagens situasjon:
- Spillere setter mål fritt (score, teknikk, turnering, etc.)
- Ingen validering mot spillerkategori (A1-K)
- Ingen estimat på tid til mål
- Ingen advarsel om urealistiske mål

**Konsekvens:** En K-spiller kan sette "bli scratch" som mål. Systemet sier ingenting.

### Alternativer

#### A) Ingen validering (status quo)
```
Bruker: Setter hvilket som helst mål
System: Aksepterer alt
Trener: Må manuelt korrigere
```

| Fordeler | Ulemper |
|----------|---------|
| Enklest | Urealistiske forventninger |
| Ingen begrensning på drømmer | Systemet fremstår naivt |
| Trener kan veilede manuelt | Mister tillit når mål ikke nås |

#### B) Soft validation (advarsel, men tillat)
```
Bruker: Setter mål
System: "Basert på din kategori (F) tar dette typisk 3-5 år"
Bruker: Bekrefter eller justerer
```

| Fordeler | Ulemper |
|----------|---------|
| Ærlig uten å blokkere | Kan demotivere |
| Bygger realistiske forventninger | Estimater kan være feil |
| Beholder brukerens autonomi | Krever progresjonsdata |

#### C) Hard validation (blokkering)
```
Bruker: Setter mål
System: "Dette målet krever kategori B. Du er F. Velg et nærmere mål."
Bruker: Må velge realistisk mål
```

| Fordeler | Ulemper |
|----------|---------|
| Tvinger realisme | Kan føles begrensende |
| Ingen falske forventninger | Dreper drømmer? |
| Klare spilleregler | Krever presis kategori-mapping |

#### D) Trinnvis mål-dekomponering
```
Bruker: "Jeg vil bli scratch"
System: "For å nå scratch fra kategori F, foreslår vi disse delmålene:
         1. F → E (estimert 8-12 mnd)
         2. E → D (estimert 12-18 mnd)
         3. D → C (estimert 18-24 mnd)
         ..."
Bruker: Velger første delmål som aktivt mål
```

| Fordeler | Ulemper |
|----------|---------|
| Beholder stor visjon | Mest kompleks å implementere |
| Gir konkrete steg | Krever god progresjonsmodell |
| Pedagogisk riktig | Kan føles overveldende |

### Beslutning

```
┌─────────────────────────────────────────────────────────────┐
│ VALGT ALTERNATIV: [ ]                                       │
│                                                             │
│ BEGRUNNELSE:                                                │
│                                                             │
│                                                             │
│                                                             │
│ BESLUTTET AV: ________________  DATO: ________________      │
└─────────────────────────────────────────────────────────────┘
```

### Implementeringskonsekvenser

| Valg | Kode som må endres |
|------|-------------------|
| A | Ingen |
| B | `goals/schema.ts` + progresjons-estimator + frontend-advarsel |
| C | `goals/schema.ts` + kategori→mål-mapping + blokkerings-logikk |
| D | Som B + mål-dekomponerings-algoritme + sub-goals relasjon |

### Avhengig data

For B, C, D trengs:
- Mapping: Kategori → typiske mål som er oppnåelige
- Estimat: Kategori → tid til neste kategori (basert på historikk eller teori)
- Validering: Mål-type → krav til kategori

---

## Beslutning 3: Hva skal skje når tester viser fremgang?

### Kontekst

Dagens situasjon:
- Testresultater lagres korrekt
- Breaking point progress oppdateres (effort vs progress separert)
- Ingenting skjer med planen
- Ingen automatisk kategori-opprykk

**Konsekvens:** Spiller forbedrer seg dramatisk, men fortsetter med øvelser designet for lavere nivå.

### Alternativer

#### A) Kun logging (status quo)
```
Test bestått → Breaking point progress oppdatert
              → Ingenting mer
```

| Fordeler | Ulemper |
|----------|---------|
| Enkelt og forutsigbart | Mister adaptiv verdi |
| Trener vurderer manuelt | Passivt system |
| Ingen overraskelser | Planen blir utdatert |

#### B) Automatisk breaking point-lukking
```
Test bestått → Breaking point → "resolved"
              → Neste breaking point aktiveres automatisk
              → Plan fortsetter uendret
```

| Fordeler | Ulemper |
|----------|---------|
| Breaking points flyter naturlig | Planen henger etter |
| Delvis adaptivt | Kan hoppe over viktige områder |
| Moderat kompleksitet | Krever BP-prioritering |

#### C) Breaking point + session-justering
```
Test bestått → Breaking point → "resolved"
              → Fremtidige sessions re-scores
              → Sessions som adresserte løst BP nedprioriteres
              → Sessions for nye BP opprioriteres
```

| Fordeler | Ulemper |
|----------|---------|
| Plan tilpasser seg faktisk utvikling | Kompleks implementering |
| Bruker constraint-aware selection | Kan føles ustabilt |
| Idrettsfaglig korrekt | Krever god kommunikasjon |

#### D) Full plan-evaluering ved milepæler
```
X antall tester bestått → Trigger plan-review
                        → System foreslår justering
                        → Coach godkjenner
```

| Fordeler | Ulemper |
|----------|---------|
| Kontrollert adaptivitet | Krever coach-involvering |
| Balansert tilnærming | Kan forsinke tilpasning |
| Transparent | Ekstra prosess |

#### E) Kategori-opprykk trigger
```
Alle kategori-krav bestått → Automatisk kategori-opprykk
                           → Plan regenereres for ny kategori
                           → Spiller/coach notifiseres
```

| Fordeler | Ulemper |
|----------|---------|
| Tydelig milepæl-system | Stor endring på en gang |
| Motiverende for spiller | Kan være forstyrrende |
| Kobler test→kategori→plan | Krever robust kategori-logikk |

### Beslutning

```
┌─────────────────────────────────────────────────────────────┐
│ VALGT ALTERNATIV: [ ]                                       │
│                                                             │
│ KOMBINASJON? (f.eks. B+E):                                  │
│                                                             │
│ BEGRUNNELSE:                                                │
│                                                             │
│                                                             │
│ BESLUTTET AV: ________________  DATO: ________________      │
└─────────────────────────────────────────────────────────────┘
```

### Implementeringskonsekvenser

| Valg | Kode som må endres |
|------|-------------------|
| A | Ingen |
| B | `plan-progress.service.ts` + BP-prioriterings-logikk |
| C | Som B + `session-selection.service.ts` re-scoring |
| D | Event-trigger + forslags-generering + coach-UI |
| E | Kategori-evaluator + plan-regenerering + notifikasjoner |

---

## Beslutning 4: Hvordan skal øvelser progredieres?

### Kontekst

Dagens situasjon:
- Øvelser har `learningPhases: L1-L5`
- Øvelser har `difficulty: beginner/intermediate/advanced/elite`
- Felt for `progressionSteps` og `regressionSteps` (strings, ikke strukturert)
- Ingen automatisk progresjon implementert

**Konsekvens:** L1-L5 er labels, ikke oppførsel. En spiller gjør samme øvelse uendret i måneder.

### Alternativer

#### A) Manuell progresjon (status quo)
```
Trener: Bytter øvelse manuelt når spiller er klar
System: Tilbyr øvelsesbibliotek
```

| Fordeler | Ulemper |
|----------|---------|
| Full trenerkontroll | Krever aktiv trener |
| Fleksibelt | Ikke skalerbart |
| Enklest | Inkonsistent progresjon |

#### B) Øvelse-kjeder (progression chains)
```
Definere: Øvelse A → Øvelse B → Øvelse C
Trigger: X repetisjoner med Y% suksess
System: Foreslår neste øvelse i kjeden
```

| Fordeler | Ulemper |
|----------|---------|
| Strukturert progresjon | Krever manuell kjede-definisjon |
| Klare kriterier | Kan mangle fleksibilitet |
| Automatiserbart | Stort oppsett-arbeid |

#### C) Parameter-basert progresjon
```
Samme øvelse, men med økende vanskelighetsgrad:
- Putting 3m → 6m → 10m
- 10 reps → 15 reps → 20 reps
- Statisk → dynamisk → under press

Trigger: Konsistent mestring over X økter
```

| Fordeler | Ulemper |
|----------|---------|
| Smidig progresjon | Kompleks øvelse-modellering |
| Kjente øvelser | Ikke alle øvelser har parametre |
| Målbar fremgang | Krever parameter-schema |

#### D) Hybrid: Kategori-basert øvelsesfilter
```
Øvelser tagges med kategori-range (F-K, D-A, etc.)
Spiller ser kun øvelser for sin kategori ±1
Ved kategori-opprykk: Nye øvelser blir tilgjengelige
```

| Fordeler | Ulemper |
|----------|---------|
| Enkel implementering | Grovt filter |
| Kategori-kobling | Mister individuell tilpasning |
| Skalerbart | Krever øvelse-tagging |

#### E) Kompetanse-basert progresjon
```
Definere kompetanser: "Putt 3m konsistent", "Driver 200m carry"
Øvelser trener spesifikke kompetanser
Når kompetanse er demonstrert (via test) → Nye øvelser tilgjengelig
```

| Fordeler | Ulemper |
|----------|---------|
| Kobler test→øvelse | Kompleks modellering |
| Individuelt tilpasset | Stort oppsett-arbeid |
| Målbar progresjon | Krever kompetanse-rammeverk |

### Beslutning

```
┌─────────────────────────────────────────────────────────────┐
│ VALGT ALTERNATIV: [ ]                                       │
│                                                             │
│ BEGRUNNELSE:                                                │
│                                                             │
│                                                             │
│                                                             │
│ BESLUTTET AV: ________________  DATO: ________________      │
└─────────────────────────────────────────────────────────────┘
```

### Implementeringskonsekvenser

| Valg | Kode som må endres |
|------|-------------------|
| A | Ingen |
| B | Ny `ExerciseProgression` modell + kjede-logikk |
| C | Utvide `Exercise` schema + parameter-variasjon i sessions |
| D | Kategori-filter i øvelse-queries + tagging av alle øvelser |
| E | `Competency` modell + test→kompetanse mapping + øvelse→kompetanse |

---

## Oppsummering: Beslutningsmatrise

| # | Beslutning | Alternativer | Anbefalt start |
|---|-----------|--------------|----------------|
| 1 | Plan regenerering | A/B/C/D | D (foreslå) |
| 2 | Mål-validering | A/B/C/D | B (advarsel) |
| 3 | Test → handling | A/B/C/D/E | B+E (BP + kategori) |
| 4 | Øvelsesprogresjon | A/B/C/D/E | D (kategori-filter) |

**Anbefalingene er basert på:**
- Lavest implementeringskompleksitet som gir reell verdi
- Beholder menneskelig kontroll
- Kan bygges ut senere

---

## Neste steg

Når alle 4 beslutninger er tatt:

1. [ ] Oppdater dette dokumentet med valg
2. [ ] Lag implementeringsplan i `03_IMPLEMENTATION_PLAN.md`
3. [ ] Prioriter rekkefølge basert på avhengigheter
4. [ ] Estimer kompleksitet per valg

---

*Sist oppdatert: 2026-01-02*
