# Spiller Progresjon - Arbeidsskjema for Trenere
> AK Golf Academy | Utviklet for Spania Treningssamling Januar 2026
> Versjon: 1.0 | Dato: 2. januar 2026

---

## Innholdsfortegnelse
1. [Kategori-Score Referanse](#1-kategori-score-referanse)
2. [Ikke-lineær Progresjon: Kjerneprinsippet](#2-ikke-lineær-progresjon-kjerneprinsippet)
3. [Progresjons-formel](#3-progresjons-formel)
4. [Vanskelighetsgrad per Kategoriovergang](#4-vanskelighetsgrad-per-kategoriovergang)
5. [Faktoranalyse: Hva påvirker progresjon?](#5-faktoranalyse-hva-påvirker-progresjon)
6. [Arbeidsskjema: Spillervurdering](#6-arbeidsskjema-spillervurdering)
7. [Coach Diskusjonspunkter](#7-coach-diskusjonspunkter)
8. [Validering og Kalibrering](#8-validering-og-kalibrering)

---

## 1. Kategori-Score Referanse

### Scoring Average Mapping (18 hull)

| Kategori | Snittscore | Strokes Gained | HCP-ekvivalent | Nivåbeskrivelse |
|----------|------------|----------------|----------------|-----------------|
| **A** | +6 til +8 | +2.0 | +6-8 | World Elite (PGA Tour) |
| **B** | +4 til +5.9 | +1.5 | +4-6 | Tour Professional |
| **C** | +2 til +3.9 | +1.0 | +2-4 | Elite Amateur |
| **D** | 0 til +1.9 | +0.5 | 0-2 | Advanced Competitive |
| **E** | 72-76 | 0.0 | 2-5 | Competitive Amateur |
| **F** | 77-81 | -0.5 | 5-10 | Intermediate |
| **G** | 82-88 | -1.0 | 10-17 | Developing |
| **H** | 89-97 | -1.5 | 17-26 | Beginner Adult |
| **I** | 98-108 | -2.0 | 26-36 | Recreational Junior |
| **J** | 82-92 (Junior) | -0.5 | 10-21 | Developing Junior |
| **K** | 93-108 (Junior) | -1.0 | 21-36 | Nybegynner Junior |

### Slag per Kategori (Gjennomsnitt)

```
K → J:  ~15 slag forskjell (93-108 → 82-92)
J → I:  ~8 slag forskjell (overlapper, aldersfaktor)
I → H:  ~8 slag forskjell (98-108 → 89-97)
H → G:  ~7 slag forskjell (89-97 → 82-88)
G → F:  ~5 slag forskjell (82-88 → 77-81)
F → E:  ~4 slag forskjell (77-81 → 72-76)
E → D:  ~3 slag forskjell (72-76 → 70-72)
D → C:  ~2 slag forskjell (70-72 → 68-70)
C → B:  ~2 slag forskjell (68-70 → 66-68)
B → A:  ~2 slag forskjell (66-68 → 64-66)
```

---

## 2. Ikke-lineær Progresjon: Kjerneprinsippet

### Visualisering: Diminishing Returns

```
                     INNSATS KREVET FOR 1 SLAGS FORBEDRING

Score 100 ──┼────────────────────────────────────────────────→ 100%
            │  █ (1 slag = ~20-30 timer)
Score 90  ──┼────────────────────────────────────────────────→ 100%
            │  ██ (1 slag = ~40-60 timer)
Score 85  ──┼────────────────────────────────────────────────→ 100%
            │  ████ (1 slag = ~80-120 timer)
Score 80  ──┼────────────────────────────────────────────────→ 100%
            │  ████████ (1 slag = ~150-200 timer)
Score 75  ──┼────────────────────────────────────────────────→ 100%
            │  ████████████████ (1 slag = ~250-350 timer)
Score 72  ──┼────────────────────────────────────────────────→ 100%
            │  ████████████████████████████████ (1 slag = ~500-800 timer)
Score 70  ──┼────────────────────────────────────────────────→ 100%
            │  ████████████████████████████████████████████████████ (1 slag = ~1000+ timer)
```

### Matematisk Modell: Eksponentiell Vanskelighet

**Formel for trenings-timer per slag forbedring:**

```
Timer_per_slag = BaseTimer × e^(k × (72 - NåværendeScore))

Der:
- BaseTimer = 20 (timer for nybegynner)
- k = 0.08 (vanskelighetskoeffisient)
- e = Eulers tall (2.718...)
```

### Eksempelberegninger

| Fra Score | Til Score | Slags-forbedring | Timer estimert | Timer/slag |
|-----------|-----------|------------------|----------------|------------|
| 100 | 95 | 5 | ~100-150 | ~25 |
| 95 | 90 | 5 | ~200-300 | ~50 |
| 90 | 85 | 5 | ~400-600 | ~100 |
| 88 | 80 | 8 | ~800-1200 | ~125 |
| 80 | 75 | 5 | ~1000-1500 | ~250 |
| 75 | 72 | 3 | ~1200-2000 | ~500 |
| **74 → 72** | **2** | **2** | **~1000-1500** | **~600** |
| 72 | 70 | 2 | ~2000-3000 | ~1250 |
| 70 | 68 | 2 | ~3000-5000 | ~2000 |

**Nøkkelobservasjon:** 88→80 (8 slag) tar omtrent like lang tid som 74→72 (2 slag)!

---

## 3. Progresjons-formel

### AK Golf Progresjon Estimator (APE)

**Grunnformel:**

```
Tid_måneder = ((TargetScore - NåværendeScore) × VanskelighetsFaktor × AldersModifikator)
              / (TreningsTimer_per_uke × Treningseffektivitet)
```

### Vanskelighets-faktor (VF) per Score-område

| Score-område | VanskelighetsFaktor | Forklaring |
|--------------|---------------------|------------|
| 100-90 | 1.0 | Baseline - rask progresjon |
| 90-85 | 1.5 | Moderat - krever mer fokus |
| 85-80 | 2.0 | Utfordrende - teknikk kritisk |
| 80-76 | 3.0 | Vanskelig - krever systematikk |
| 76-74 | 4.0 | Svært vanskelig - mental faktor |
| 74-72 | 6.0 | Ekstremt vanskelig - elite tilnærming |
| 72-70 | 10.0 | Profesjonell nivå - alt må stemme |
| 70-68 | 15.0 | Tour-nivå - marginale forbedringer |
| Under 68 | 25.0 | World Elite - genetikk + alt annet |

### Alders-modifikator

| Alder | Modifikator | Forklaring |
|-------|-------------|------------|
| 10-13 | 0.7 | Rask læring, høy plastisitet |
| 13-16 | 0.8 | Fortsatt rask utvikling |
| 16-19 | 0.9 | Peak læringspotensial |
| 19-25 | 1.0 | Baseline voksen |
| 25-35 | 1.2 | Moderat reduksjon |
| 35-45 | 1.5 | Tydelig reduksjon |
| 45-55 | 2.0 | Betydelig langsommere |
| 55+ | 2.5 | Fokus på vedlikehold |

### Trenings-effektivitet

| Treningskvalitet | Effektivitet | Beskrivelse |
|------------------|--------------|-------------|
| Elite coaching + optimal struktur | 1.3 | Strukturert trening, ekspert feedback |
| God coaching + fast plan | 1.0 | Baseline god trening |
| Selvtrening med plan | 0.7 | Mangler ekstern feedback |
| Tilfeldig trening | 0.4 | Ingen struktur |

---

## 4. Vanskelighetsgrad per Kategoriovergang

### Relativ Vanskelighetsmatrise

```
Overgang    | Slag | Relativt vanskelig | Estimert tid (10t/uke, god coach)
------------|------|-------------------|----------------------------------
K → J       | 10+  | ████              | 6-12 måneder (junior)
J → I       | 5-8  | ██████            | 4-8 måneder
I → H       | 8-10 | ████              | 6-10 måneder
H → G       | 7    | ████████          | 8-14 måneder
G → F       | 5    | ██████████        | 10-18 måneder
F → E       | 4    | ████████████████  | 12-24 måneder
E → D       | 3    | ████████████████████████  | 18-36 måneder
D → C       | 2    | ████████████████████████████████  | 24-48 måneder
C → B       | 2    | ████████████████████████████████████████  | 36-60+ måneder
B → A       | 2    | ████████████████████████████████████████████████  | 48-84+ måneder*
```

*De fleste når aldri A-kategori, selv med full dedikasjon

### Sannsynlighet for å nå kategori

| Start-kategori | Mål-kategori | Sannsynlighet (12 mnd) | Kommentar |
|----------------|--------------|----------------------|-----------|
| G | F | 70% | Realistisk med god innsats |
| G | E | 25% | Krever eksepsjonell progresjon |
| F | E | 55% | God sjanse med systematikk |
| F | D | 10% | Sjelden i ett år |
| E | D | 40% | Mulig men utfordrende |
| E | C | 5% | Nesten umulig i ett år |
| D | C | 25% | Krever betydelig innsats |
| D | B | 2% | Svært sjelden |
| C | B | 15% | Lang tidshorisont |
| B | A | 3% | Ekstremt sjelden |

---

## 5. Faktoranalyse: Hva påvirker progresjon?

### 5-Prosess Breaking Point System: Vekting

| Prosess | Vekt ved høyt HCP | Vekt ved lavt HCP | Hvorfor |
|---------|-------------------|-------------------|---------|
| **Teknikk** | 40% | 20% | Fundamentals viktigst tidlig |
| **Taktikk** | 10% | 25% | Course management viktigere for lave scores |
| **Fysikk** | 15% | 20% | Styrke/power mer relevant når teknikk er god |
| **Psyke** | 20% | 30% | Mental game dominerer på elite-nivå |
| **Utstyr** | 15% | 5% | Kan kompensere tidlig, minimal effekt senere |

### Detaljert Faktor-påvirkning

#### A. Teknikk-faktorer

| Faktor | Effekt på progresjon | Målbart via |
|--------|---------------------|-------------|
| Swing consistency | Høy | Dispersion, face control |
| Impact position | Høy | Smash factor, launch |
| Short game touch | Svært høy | PEI score, up-and-down % |
| Putting stroke | Høy | 3m%, lag control |

#### B. Fysisk-faktorer

| Faktor | Effekt på progresjon | Optimal verdi |
|--------|---------------------|---------------|
| Klubbhastighet | Moderat | Kategori-spesifikk |
| Rotasjonskraft | Moderat-Høy | Asymmetri < 15% |
| Utholdenhet | Lav-Moderat | Vedlikehold 18 hull |
| Mobilitet | Moderat | Full ROM i sving |

#### C. Mental-faktorer

| Faktor | Effekt på progresjon | Kritisk nivå |
|--------|---------------------|--------------|
| Pre-shot rutine | Svært høy | > 70% konsistens |
| Pressure handling | Høy | < 15% performance drop |
| Focus retention | Høy | > 85% under distraksjon |
| Recovery fra feil | Svært høy | Ikke målbart, observerbart |

#### D. Taktikk-faktorer

| Faktor | Effekt på progresjon | Når relevant |
|--------|---------------------|--------------|
| Klubbvalg | Moderat → Høy | Fra HCP 15 og nedover |
| Risk assessment | Høy | Fra HCP 10 og nedover |
| Course management | Svært høy | Fra HCP 5 og nedover |
| Pin strategy | Høy | Fra scratch og nedover |

---

## 6. Arbeidsskjema: Spillervurdering

### Skjema A: Individuell Spillerprofil

```
SPILLERPROFIL - PROGRESJONSVURDERING
=====================================

Dato: _______________
Vurdert av: _______________

GRUNNLEGGENDE INFO
------------------
Navn: _______________
Alder: _____
Kjønn: M / K
Nåværende kategori: _____
Nåværende snittscore (siste 10 runder): _____

TRENINGSSITUASJON
-----------------
Timer tilgjengelig per uke: _____
Coaching-tilgang: □ Elite  □ God  □ Selvtrening  □ Sporadisk
Treningsanlegg: □ Full tilgang  □ Begrenset  □ Minimal
Simulator/Trackman: □ Ja  □ Nei

FYSISK PROFIL
-------------
Klubbhastighet driver: _____ mph
Smash factor: _____
Benkpress 1RM: _____ kg
Markløft 1RM: _____ kg
Rotasjonskast 4kg: _____ m

TEKNISK PROFIL
--------------
Driver carry: _____ m
Jern 7 carry: _____ m
Jern 7 nøyaktighet (avg avvik): _____ m
Wedge PEI: _____
Putting 3m %: _____
Bunker save %: _____

MENTAL PROFIL
-------------
Pre-shot konsistens: _____ %
Pressure putting score: _____
Fokus under distraksjon: _____ % reduksjon

BREAKING POINTS (identifiserte svakheter)
-----------------------------------------
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

MÅL
---
Kortsiktig (3 mnd): Kategori ___ / Score ___
Mellomlangt (12 mnd): Kategori ___ / Score ___
Langsiktig (3+ år): _______________
```

### Skjema B: Progresjon-kalkulering

```
PROGRESJONS-ESTIMAT
===================

INNGANGSDATA
------------
Nåværende score: _____
Mål-score: _____
Slags-forbedring nødvendig: _____

VANSKELIGHETS-BEREGNING
-----------------------
Score-område: _____
Vanskelighets-faktor (VF): _____

Alder: _____
Alders-modifikator (AM): _____

Coaching-kvalitet: _______________
Trenings-effektivitet (TE): _____

Timer per uke: _____

FORMEL-BEREGNING
----------------
Basis-tid = Slag × VF × AM / (Timer × TE)

= _____ × _____ × _____ / (_____ × _____)

= _____ måneder

JUSTERT ESTIMAT (±30%)
----------------------
Optimistisk: _____ måneder
Realistisk: _____ måneder
Konservativt: _____ måneder

SANNSYNLIGHETSVURDERING
-----------------------
□ Svært sannsynlig (>70%)
□ Sannsynlig (50-70%)
□ Mulig (30-50%)
□ Utfordrende (10-30%)
□ Usannsynlig (<10%)

KOMMENTARER
-----------
_______________________________________________
_______________________________________________
```

### Skjema C: Sammenlignende Gruppe-analyse

```
GRUPPE-SAMMENLIGNING
====================

Dato: _______________
Gruppe: _______________

SPILLERE
--------
| # | Navn | Alder | Score | Mål | VF | AM | Timer | Est.tid |
|---|------|-------|-------|-----|----|----|-------|---------|
| 1 |      |       |       |     |    |    |       |         |
| 2 |      |       |       |     |    |    |       |         |
| 3 |      |       |       |     |    |    |       |         |
| 4 |      |       |       |     |    |    |       |         |
| 5 |      |       |       |     |    |    |       |         |

OBSERVASJONER
-------------
Raskest progresjon forventes for: _______________
Hvorfor: _______________________________________________

Tregest progresjon forventes for: _______________
Hvorfor: _______________________________________________

ANBEFALINGER FOR GRUPPEN
------------------------
_______________________________________________
_______________________________________________
```

---

## 7. Coach Diskusjonspunkter

### Spørsmål til å validere formelen

```
FOR DISKUSJON MED ERFARNE TRENERE:

1. VANSKELIGHETS-FAKTORER
   - Er VF=6.0 for 74→72 realistisk?
   - Hva er den faktiske opplevelsen med spillere i dette området?
   - Finnes det "breaking point" scores hvor alt plutselig blir vanskeligere?

2. ALDER OG UTVIKLING
   - Stemmer alders-modifikatorene med erfaring?
   - Viktor Hovland - hvordan var hans progresjonskurve som junior?
   - Kristoffer Reitan - hva var hans "breakthrough" periode?

3. TRENINGSTIMER
   - Hvor mange timer trente Viktor per uke i ulike aldre?
   - Hva er "minimum effective dose" for å opprettholde nivå?
   - Hva er "optimal" mengde før diminishing returns?

4. MENTAL FAKTOR
   - På hvilket scorenivå blir mental game dominerende?
   - Hvordan målte dere mental styrke hos elite-juniorene?
   - Hva skiller de som "breaker gjennom" fra de som "platåer"?

5. BREAKING POINTS
   - Hva er de vanligste tekniske begrensningene som stopper progresjon?
   - Hvordan identifiserte dere hva som måtte fikses?
   - Hvor lang tid tok det typisk å løse et kritisk breaking point?

6. TURNERINGS-EKSPONERING
   - Hvor viktig er turneringserfaring for score-forbedring?
   - Finnes det en "optimal" turnering/trening ratio?
   - Når går man fra "trene for å bli bedre" til "konkurrere for å bli bedre"?
```

### Case Studies for Validering

```
CASE STUDY FORMAT
=================

Spiller: _______________
Start-alder: _____
Start-score: _____
Slutt-alder: _____
Slutt-score: _____

PROGRESJON
----------
År 1: Score ___ → ___  (_____ slag forbedring)
År 2: Score ___ → ___  (_____ slag forbedring)
År 3: Score ___ → ___  (_____ slag forbedring)
År 4: Score ___ → ___  (_____ slag forbedring)
År 5: Score ___ → ___  (_____ slag forbedring)

TRENINGSMENGDE
--------------
Gjennomsnitt timer/uke: _____
Coaching-kvalitet: _______________

BREAKING POINTS UNDERVEIS
-------------------------
1. Ved score ___: Problem _______________ | Løst etter ___ mnd
2. Ved score ___: Problem _______________ | Løst etter ___ mnd
3. Ved score ___: Problem _______________ | Løst etter ___ mnd

HVA VAR NØKKELEN TIL SUKSESS?
-----------------------------
_______________________________________________
_______________________________________________

SAMMENLIGNING MED FORMEL
------------------------
Formel-estimat: _____ måneder
Faktisk tid: _____ måneder
Avvik: _____ %

JUSTERINGSFORSLAG
-----------------
_______________________________________________
```

---

## 8. Validering og Kalibrering

### Suksesskriterier for Formelen

For at APE-formelen skal være nyttig, må den:

1. **Prediktiv validitet**: Estimater innenfor ±30% av faktisk progresjon for >70% av spillere
2. **Face validity**: Erfarne trenere bør gjenkjenne mønstrene
3. **Diskriminerende validitet**: Skille mellom spillere som vil progresjonere raskt vs. sakte

### Data som trengs for validering

```
DATAINNSAMLING FOR KALIBRERING
==============================

For hver spiller, samle:

HISTORISKE DATA
---------------
□ Snittscore ved forskjellige tidspunkter (minimum årlig)
□ Treningsmengde per uke (gjennomsnitt)
□ Coaching-situasjon (kvalitet)
□ Alder ved start og underveis
□ Turneringsresultater

TESTDATA
--------
□ Team Norway tester (20 tester) ved benchmarks
□ Trackman/simulator data
□ Fysiske tester

KVALITATIVE DATA
----------------
□ Breaking points identifisert
□ Treningstilnærming
□ Mental modenhet vurdering
□ "Breakthrough" øyeblikk
```

### Statistisk Kalibrering

```
KALIBRERINGS-PROSESS
====================

1. Samle data fra minimum 20 spillere med kjent progresjon
2. Beregn estimert tid med formelen
3. Sammenlign med faktisk tid
4. Beregn avvik (%)
5. Juster koeffisienter:
   - Hvis systematisk underestimering: Øk VF
   - Hvis systematisk overestimering: Reduser VF
   - Hvis avvik korrelerer med alder: Juster AM
   - Hvis avvik korrelerer med treningstimer: Juster TE-skalaen

ANALYSE-TABELL
--------------
| Spiller | Est.tid | Faktisk | Avvik % | Kommentar |
|---------|---------|---------|---------|-----------|
|         |         |         |         |           |
|         |         |         |         |           |
|         |         |         |         |           |

GJENNOMSNITTLIG AVVIK: _____ %
STANDARDAVVIK: _____ %
```

---

## Oppsummering: Forenklet Estimat-tabell

### Quick Reference - Måneder per kategoriovergang

**Forutsetninger: 10 timer/uke, god coaching, 16-25 år**

| Overgang | Optimistisk | Realistisk | Konservativt |
|----------|-------------|------------|--------------|
| K → J | 4 | 8 | 14 |
| J → I | 3 | 6 | 10 |
| I → H | 5 | 8 | 12 |
| H → G | 6 | 12 | 18 |
| G → F | 8 | 14 | 22 |
| F → E | 10 | 18 | 28 |
| E → D | 14 | 26 | 42 |
| D → C | 20 | 38 | 60 |
| C → B | 30 | 52 | 84 |
| B → A | 48 | 72+ | Usikkert |

### Huskeliste

- **88 → 80**: Ca. 800-1200 timer (12-18 mnd ved 10t/uke)
- **74 → 72**: Ca. 1000-1500 timer (18-30 mnd ved 10t/uke)
- Den siste forbedringen fra 74→72 krever nesten like mye som 88→80!
- Mental game blir dominerende under score 78
- Breaking points må løses - de forsvinner ikke av seg selv
- Turnerings-eksponering er kritisk under score 76

---

**Dokumentversjon**: 1.0
**Status**: Arbeidsdokument for validering
**Til bruk**: Spania Treningssamling 3-10. januar 2026
**Formål**: Diskusjon med coaches og datainnsamling for kalibrering

---

*Dette dokumentet er basert på estimater og begrensede data. Formelen og koeffisientene skal valideres og kalibreres basert på erfaringer fra erfarne trenere og historiske spillerdata.*
