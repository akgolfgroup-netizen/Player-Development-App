# Kritiske beslutninger for systemkoherens

> Dette dokumentet inneholder 4 beslutninger som MÅ tas før algoritmer kan røres.
> Hver beslutning har kontekst, alternativer, og et felt for endelig valg.

**Status:** ANBEFALING GITT - Venter på endelig godkjenning

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
│ ANBEFALT ALTERNATIV: [D] Foreslå, ikke tving               │
│                                                             │
│ BEGRUNNELSE:                                                │
│ • Beholder menneskelig kontroll - coach/spiller godkjenner  │
│ • Transparent system - spilleren forstår hvorfor endring    │
│ • Kan bygges ut - start enkelt, legg til triggers senere    │
│ • Lavere risiko - feil forslag ignoreres, plan ødelegges    │
│   ikke                                                      │
│                                                             │
│ TRIGGERS SOM AKTIVERER FORSLAG:                             │
│ • Kategori-opprykk                                          │
│ • Breaking point resolved                                   │
│ • >20% avvik fra forventet gjennomføring                    │
│ • Ny turnering lagt til                                     │
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
| **D** | **Som C + forslags-UI + godkjennings-flow** |

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
│ ANBEFALT ALTERNATIV: [B] Soft validation (advarsel)        │
│                                                             │
│ BEGRUNNELSE:                                                │
│ • Ærlig uten å begrense - respekterer spillerens autonomi   │
│ • Setter forventninger - ingen overraskelse når det tar tid │
│ • Enkel implementering - bare én advarsel-dialog            │
│ • Kan utvides til D - "Vil du se delmål?" kan legges til    │
│                                                             │
│ EKSEMPEL PÅ DIALOG:                                         │
│ "Basert på kategori F tar dette typisk 4-6 år med           │
│  10+ timer/uke. Vil du fortsatt sette dette målet?"         │
│  [Ja, jeg forstår] [Juster målet]                           │
│                                                             │
│ BESLUTTET AV: ________________  DATO: ________________      │
└─────────────────────────────────────────────────────────────┘
```

### Implementeringskonsekvenser

| Valg | Kode som må endres |
|------|-------------------|
| A | Ingen |
| **B** | **`goals/schema.ts` + progresjons-estimator + frontend-advarsel** |
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
│ ANBEFALT ALTERNATIV: [B+E] Kombinasjon                      │
│                                                             │
│ KOMBINASJON:                                                │
│ • B: Automatisk breaking point-lukking                      │
│ • E: Kategori-opprykk trigger                               │
│                                                             │
│ BEGRUNNELSE:                                                │
│ • Løser to forskjellige problemer:                          │
│   - B: Hva skjer når én test forbedres?                     │
│   - E: Hva skjer når ALLE kategori-krav oppfylles?          │
│ • Tydelige milepæler - kategori-opprykk er motiverende      │
│ • Breaking points flyter - ingen manuell lukking nødvendig  │
│ • Kobler til Beslutning 1 - opprykk trigger plan-forslag    │
│                                                             │
│ FLYT:                                                       │
│ Test bestått → BP status oppdateres (B)                     │
│             → Sjekk om alle kategori-krav oppfylt           │
│             → Hvis ja: Kategori-opprykk (E)                 │
│             → Trigger plan-forslag (kobler til D1)          │
│                                                             │
│ BESLUTTET AV: ________________  DATO: ________________      │
└─────────────────────────────────────────────────────────────┘
```

### Implementeringskonsekvenser

| Valg | Kode som må endres |
|------|-------------------|
| A | Ingen |
| **B** | **`plan-progress.service.ts` + BP-prioriterings-logikk** |
| C | Som B + `session-selection.service.ts` re-scoring |
| D | Event-trigger + forslags-generering + coach-UI |
| **E** | **Kategori-evaluator + plan-regenerering + notifikasjoner** |

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
│ ANBEFALT ALTERNATIV: [D] Kategori-basert øvelsesfilter     │
│                                                             │
│ BEGRUNNELSE:                                                │
│ • Minimal kode-endring - bare filter i queries              │
│ • Skalerbart - funker for 10 eller 10,000 spillere          │
│ • Naturlig progresjon - opprykk = nye øvelser               │
│ • Kan bygges ut - legg til B/C/E senere                     │
│ • Kobler til Beslutning 3 - kategori-opprykk trigger        │
│   automatisk at nye øvelser blir synlige                    │
│                                                             │
│ FORESLÅTT KATEGORI-RANGE PER LEARNING PHASE:                │
│ • L1 Fundamental:  [F, G, H, I, J, K]                       │
│ • L2 Development:  [D, E, F, G, H]                          │
│ • L3 Integration:  [C, D, E, F]                             │
│ • L4 Specific:     [B, C, D]                                │
│ • L5 Competition:  [A, B, C]                                │
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
| **D** | **Kategori-filter i øvelse-queries + tagging av alle øvelser** |
| E | `Competency` modell + test→kompetanse mapping + øvelse→kompetanse |

---

## Oppsummering: Beslutningsmatrise

| # | Beslutning | Anbefalt | Kompleksitet | Avhenger av |
|---|-----------|----------|--------------|-------------|
| 1 | Plan regenerering | **D** (foreslå) | Moderat | - |
| 2 | Mål-validering | **B** (advarsel) | Lav | - |
| 3 | Test → handling | **B+E** (BP + kategori) | Moderat | D1, D4 |
| 4 | Øvelsesprogresjon | **D** (kategori-filter) | Lav-Moderat | D3 |

**Anbefalingene er basert på:**
- Lavest implementeringskompleksitet som gir reell verdi
- Beholder menneskelig kontroll
- Kan bygges ut senere

---

## Hvordan beslutningene henger sammen

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│   Spiller forbedrer seg på tester                          │
│                 │                                          │
│                 ▼                                          │
│   [D3-B] Breaking point → resolved                         │
│                 │                                          │
│                 ▼                                          │
│   Alle kategori-krav oppfylt?                              │
│        │                    │                              │
│       NEI                  JA                              │
│        │                    │                              │
│        ▼                    ▼                              │
│   Fortsett             [D3-E] Kategori-opprykk             │
│                             │                              │
│              ┌──────────────┴──────────────┐               │
│              ▼                             ▼               │
│   [D1-D] Foreslå plan-justering    [D4-D] Nye øvelser      │
│              │                       synlige               │
│              ▼                                             │
│   [D2-B] Nye mål valideres mot                             │
│          oppdatert kategori                                │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

Dette gir et **koherent system** hvor:
1. Forbedring måles (tester)
2. Forbedring anerkjennes (BP resolved, kategori-opprykk)
3. Plan tilpasses (forslag til coach/spiller)
4. Innhold tilpasses (nye øvelser blir synlige)
5. Forventninger justeres (mål-validering mot ny kategori)

---

## Neste steg

Anbefalinger er nå dokumentert. For å gå videre:

1. [ ] **Godkjenn eller juster** anbefalingene (fyll inn BESLUTTET AV/DATO)
2. [ ] **Oppdater implementeringsplan** i `03_IMPLEMENTATION_PLAN.md`
3. [ ] **Prioriter rekkefølge:**
   - Start med D2 (mål-validering) - lavest kompleksitet
   - Deretter D4 (øvelsesfilter) - forberedelse til D3
   - Så D3 (test → handling) - kjernefunksjonalitet
   - Til slutt D1 (plan-forslag) - avhenger av D3
4. [ ] **Estimer** konkrete oppgaver per beslutning

---

## Estimat-tabell for mål-validering (D2)

For å implementere soft validation trengs denne kategori→tid mappingen:

| Fra | Til | Estimert tid | Timer/uke krav |
|-----|-----|--------------|----------------|
| K | J | 6-12 mnd | 5-8 |
| J | I | 6-12 mnd | 6-10 |
| I | H | 8-14 mnd | 8-12 |
| H | G | 10-16 mnd | 8-12 |
| G | F | 12-18 mnd | 10-14 |
| F | E | 12-24 mnd | 10-14 |
| E | D | 18-30 mnd | 12-16 |
| D | C | 24-36 mnd | 14-18 |
| C | B | 30-48 mnd | 16-20 |
| B | A | 36-60 mnd | 18-22 |

*Disse estimatene bør valideres mot faktisk progresjonsdata når tilgjengelig.*

---

*Sist oppdatert: 2026-01-03*
