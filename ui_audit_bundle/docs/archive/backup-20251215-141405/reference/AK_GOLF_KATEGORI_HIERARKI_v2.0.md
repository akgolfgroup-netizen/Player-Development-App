# AK Golf – Komplett Kategorihierarki v2.0
> Referansedokument for økt-kategorisering i AK Golf App
> Versjon: 2.0
> Dato: 14. desember 2025

---

## Innholdsfortegnelse

1. [Oversikt](#1-oversikt)
2. [Pyramidestruktur](#2-pyramidestruktur)
3. [Treningsområder](#3-treningsområder)
4. [L-Faser (Motorisk læring)](#4-l-faser-motorisk-læring)
5. [CS-Nivåer (Clubspeed)](#5-cs-nivåer-clubspeed)
6. [M-Miljø (Fysisk kontekst)](#6-m-miljø-fysisk-kontekst)
7. [PR-Press (Psykologisk belastning)](#7-pr-press-psykologisk-belastning)
8. [P-Posisjonssystem (MORAD)](#8-p-posisjonssystem-morad)
9. [Putting-system](#9-putting-system)
10. [Turneringskategorier](#10-turneringskategorier)
11. [Spillernivåer](#11-spillernivåer)
12. [AK-Formel Struktur](#12-ak-formel-struktur)
13. [Eksempelformler](#13-eksempelformler)
14. [Regler og unntak](#14-regler-og-unntak)

---

## 1. Oversikt

AK-formelen er et systematisk kategoriseringssystem for golftrening som muliggjør:

- **Presis øktbeskrivelse** – Hver økt har en unik, søkbar ID
- **Progressiv trening** – L-faser og CS-nivåer styrer progresjon
- **Breaking Point-tracking** – Samle data om når teknikk bryter sammen
- **Standardprogrammer** – Generere tilpassede programmer per spillernivå

---

## 2. Pyramidestruktur

Fem nivåer fra fundament til topp:

```
┌─────────────────────────────────┐
│       TURNERING (TURN)          │  Prestasjon under press
├─────────────────────────────────┤
│         SPILL (SPILL)           │  Strategi, banehåndtering
├─────────────────────────────────┤
│       GOLFSLAG (SLAG)           │  Slagkvalitet, resultat
├─────────────────────────────────┤
│        TEKNIKK (TEK)            │  Bevegelsesmønster
├─────────────────────────────────┤
│         FYSISK (FYS)            │  Styrke, power, mobilitet
└─────────────────────────────────┘
```

### Pyramidekoder

| Kode | Nivå | Beskrivelse |
|------|------|-------------|
| **FYS** | Fysisk | Styrke, power, mobilitet, stabilitet, kondisjon |
| **TEK** | Teknikk | Bevegelsesmønster, posisjoner, sekvens |
| **SLAG** | Golfslag | Slagkvalitet, avstand, nøyaktighet, konsistens |
| **SPILL** | Spill | Strategi, banehåndtering, scoring, beslutninger |
| **TURN** | Turnering | Mental prestasjon, konkurransefokus |

---

## 3. Treningsområder

### 3.1 Områdeoversikt (16 områder)

| # | Kode | Område | CS relevant? | P-system? |
|---|------|--------|--------------|-----------|
| 1 | TEE | Tee Total | ✅ Ja | P1.0–P10.0 |
| 2 | INN200 | Innspill 200+ m | ✅ Ja | P1.0–P10.0 |
| 3 | INN150 | Innspill 150–200 m | ✅ Ja | P1.0–P10.0 |
| 4 | INN100 | Innspill 100–150 m | ✅ Ja | P1.0–P10.0 |
| 5 | INN50 | Innspill 50–100 m | ✅ Ja | P1.0–P10.0 |
| 6 | CHIP | Chip | ❌ Nei | P1.0–P10.0 |
| 7 | PITCH | Pitch | ❌ Nei | P1.0–P10.0 |
| 8 | LOB | Lob | ❌ Nei | P1.0–P10.0 |
| 9 | BUNKER | Bunker | ❌ Nei | P1.0–P10.0 |
| 10 | PUTT0-3 | Putting 0–3 ft | ❌ Nei | Putting-faser |
| 11 | PUTT3-5 | Putting 3–5 ft | ❌ Nei | Putting-faser |
| 12 | PUTT5-10 | Putting 5–10 ft | ❌ Nei | Putting-faser |
| 13 | PUTT10-15 | Putting 10–15 ft | ❌ Nei | Putting-faser |
| 14 | PUTT15-25 | Putting 15–25 ft | ❌ Nei | Putting-faser |
| 15 | PUTT25-40 | Putting 25–40 ft | ❌ Nei | Putting-faser |
| 16 | PUTT40+ | Putting 40+ ft | ❌ Nei | Putting-faser |

### 3.2 Full Swing (5 områder)

| Kode | Område | Typisk klubb |
|------|--------|--------------|
| TEE | Tee Total | Driver og generelle woods |
| INN200 | Innspill 200+ m | Woods, hybrid, long iron |
| INN150 | Innspill 150–200 m | 5-7 iron |
| INN100 | Innspill 100–150 m | 8-PW |
| INN50 | Innspill 50–100 m | Wedges (full swing) |

### 3.3 Nærspill (4 områder)

| Kode | Område | Beskrivelse |
|------|--------|-------------|
| CHIP | Chip | Lav bue, mye rulle |
| PITCH | Pitch | Middels bue, middels rulle |
| LOB | Lob | Høy bue, lite rulle |
| BUNKER | Bunker | Sand, greenside |

### 3.4 Putting (7 avstander)

| Kode | Avstand |
|------|---------|
| PUTT0-3 | 0–3 ft (makk-putts) |
| PUTT3-5 | 3–5 ft (korte) |
| PUTT5-10 | 5–10 ft (mellom) |
| PUTT10-15 | 10–15 ft (mellom-lange) |
| PUTT15-25 | 15–25 ft (lange) |
| PUTT25-40 | 25–40 ft (lag putts) |
| PUTT40+ | 40+ ft (ekstra lange) |

---

## 4. L-Faser (Motorisk læring)

Progressiv læring fra isolert bevegelse til automatisert ferdighet.

| Kode | Navn | Beskrivelse | Utstyr |
|------|------|-------------|--------|
| **L-KROPP** | Kropp | Kun kroppsbevegelse | Ingen |
| **L-ARM** | Arm | Kropp + armer | Ingen kølle/ball |
| **L-KØLLE** | Kølle | Kropp + armer + kølle | Ingen ball |
| **L-BALL** | Ball | Alt inkludert, lav hastighet | CS40-60 |
| **L-AUTO** | Auto | Full hastighet, automatisert | CS70-100 |

### L-Fase progresjon

```
L-KROPP → L-ARM → L-KØLLE → L-BALL → L-AUTO
   │         │         │         │         │
   ▼         ▼         ▼         ▼         ▼
 Isoler   Integrer   Verktøy   Resultat  Prestasjon
bevegelse  armer     inn       synlig    under press
```

### Eksempel: Ny hofterotasjon

1. **L-KROPP**: Spiller øver rotasjon, tilt, plan – kun kropp
2. **L-ARM**: Legg til armbevegelse, føle sekvens
3. **L-KØLLE**: Hold kølle, sjekk posisjoner i speil/video
4. **L-BALL**: Slå baller på CS50, fokus på følelse
5. **L-AUTO**: Gradvis øke til CS80+, varierende forhold

---

## 5. CS-Nivåer (Clubspeed)

Prosentandel av spillerens maksimale klubbhastighet.

| Nivå | % av maks | Bruksområde |
|------|-----------|-------------|
| **CS0** | 0% | Fysisk trening (off-course) |
| **CS20** | 20% | Ekstrem sakte, kun posisjon |
| **CS30** | 30% | Veldig sakte, bevegelsesflyt |
| **CS40** | 40% | Langsom, fokus på mønster |
| **CS50** | 50% | Moderat, komfortsone |
| **CS60** | 60% | Økt hastighet, begynner utfordre |
| **CS70** | 70% | Konkurranselignende |
| **CS80** | 80% | Høy intensitet |
| **CS90** | 90% | Nær-maksimal |
| **CS100** | 100% | Maksimal innsats |

### CS-Kalibrering (Onboarding)

Spiller tester maks clubspeed med:
- Driver
- 7-jern
- Wedge (PW eller 52°)

**System beregner:**
```
Spiller.maxCS.driver = 105 mph
Spiller.maxCS.7iron = 85 mph
Spiller.maxCS.wedge = 75 mph

Økt: TEK_TEE_L-BALL_CS50_M1_PR1_P5.0-P6.0
→ Mål-hastighet: 105 × 0.50 = 52.5 mph
```

### CS-Relevans per område

| Områder | CS brukes? |
|---------|------------|
| TEE, INN200, INN150, INN100, INN50 | ✅ Ja |
| CHIP, PITCH, LOB, BUNKER | ❌ Nei |
| PUTT (alle) | ❌ Nei |

---

## 6. M-Miljø (Fysisk kontekst)

| Kode | Miljø | Beskrivelse |
|------|-------|-------------|
| **M0** | Off-course | Gym, hjemme, ikke golf-spesifikt |
| **M1** | Innendørs | Nett, simulator, Trackman |
| **M2** | Range | Utendørs, matte eller gress |
| **M3** | Øvingsfelt | Kortbane, chipping green, putting green |
| **M4** | Bane trening | Treningsrunde på bane |
| **M5** | Bane turnering | Turneringsrunde |

### Miljø-progresjon

```
M0 → M1 → M2 → M3 → M4 → M5
│     │     │     │     │     │
▼     ▼     ▼     ▼     ▼     ▼
Gym  Sim  Range Øving Trening Turn
```

---

## 7. PR-Press (Fysisk & Mental belastning)

| Kode | Pressnivå | Beskrivelse |
|------|-----------|-------------|
| **PR1** | Ingen | Utforskende, ingen konsekvens |
| **PR2** | Selvmonitorering | Måltall, tracking, men ingen sosial |
| **PR3** | Sosial | Med andre, observert |
| **PR4** | Konkurranse | Innsats, spill mot andre |
| **PR5** | Turnering | Resultat teller, ranking |

### Press-progresjon

```
PR1 → PR2 → PR3 → PR4 → PR5
 │     │     │     │     │
 ▼     ▼     ▼     ▼     ▼
Fri   Data  Sosial Kamp  Turn
```

---

## 8. P-Posisjonssystem 



### 8.1 Hovedposisjoner

| Posisjon | Navn | Definisjon |
|----------|------|------------|
| **P1.0** | Address | Statisk startposisjon |
| **P2.0** | Takeaway | Skaft parallelt med bakken (backswing) |
| **P3.0** | Mid-Backswing | Lead arm parallelt med bakken |
| **P4.0** | Topp | Maksimal rotasjon, svingens apex |
| **P5.0** | Transition | Lead arm parallelt (downswing start) |
| **P6.0** | Delivery | Skaft parallelt med bakken (downswing) |
| **P7.0** | Impact | Treff, moment of truth |
| **P8.0** | Release | Skaft parallelt post-impact |
| **P9.0** | Follow-through | Trail arm parallelt |
| **P10.0** | Finish | Fullført rotasjon, balanse |

### 8.2 Kritiske desimalposisjoner

| Posisjon | Beskrivelse |
|----------|-------------|
| **P4.5** | Midt i transition |
| **P5.5** | Skaft "shallowed" til albueplan |
| **P6.1** | Klubbhode krysser hendene (release-punkt) |
| **P6.5** | Siste posisjon før impact |

### 8.3 Visuell oversikt

```
Backswing:    P1.0 → P2.0 → P3.0 → P4.0
                                    │
Transition:                       P4.5
                                    │
Downswing:              P5.0 → P5.5 → P6.0 → P6.5
                                              │
Impact:                                     P7.0
                                              │
Follow-through:               P8.0 → P9.0 → P10.0
```

### 8.4 Bruk i formelen

**Enkeltpunkt** – Fokus på én spesifikk posisjon:
```
P6.0
```

**Range** – Fokus på en sekvens:
```
P5.0-P7.0
```

### 8.5 P-System relevans

| Områder | P-system |
|---------|----------|
| TEE, INN200, INN150, INN100, INN50 | ✅ P1.0–P10.0 |
| CHIP, PITCH, LOB, BUNKER | ✅ P1.0–P10.0 |
| PUTT (alle) | ❌ Nei (eget system) |

---

## 9. Putting-system

### 9.1 Fokusområder

| Kode | Fokus | Beskrivelse |
|------|-------|-------------|
| **GREEN** | Greenlesning | Fall, break, grain |
| **SIKTE** | Sikte | Alignment, aim point |
| **TEKN** | Teknikk | FWD press, loft, attack |
| **BALL** | Ballstart | Startlinje, |
| **SPEED** | Speed | Lengdekontroll |

### 9.2 Faser

| Kode | Fase | Beskrivelse |
|------|------|-------------|
| **S** | Setup | Adressering, alignment |
| **B** | Back swing |  |
| **I** | Impact | Treff |
| **F** | Follow through | Gjennomslag |

### 9.3 Fase-kombinasjoner

| Kode | Beskrivelse |
|------|-------------|
| S | Kun setup |
| S-B | Setup til back stroke |
| S-I | Setup til impact |
| S-F | Hele stroke (vanligst) |
| B-I |  |
| I-F | Impact til follow through |

### 9.4 Eksempel putting-formel

```
TEK_PUTT5-10_L-BALL_M3_PR2_SPEED_S-F
```
- Teknikk
- Putting 5-10 ft
- L-BALL fase
- Øvingsfelt
- Selvmonitorering
- Fokus: Speed/lengdekontroll
- Faser: Hele stroke

---

## 10. Turneringskategorier

Turnering bruker forenklet system uten CS og P-posisjoner.

### 10.1 Turneringstyper

| Kode | Type | Beskrivelse |
|------|------|-------------|
| **RES** | Resultat | Resultatet er viktigst, full prestasjonsmodus |
| **UTV** | Prestasjonsutvikling | Teste spesifikke ting under turneringspress |
| **TRE** | Trening | Teknisk trening på banen, venne seg til ny bevegelse |

### 10.2 Turneringsformel

```
TURN_[Type]_M5_PR5
```

### 10.3 Eksempler

```
TURN_RES_M5_PR5     → Resultatfokus
TURN_UTV_M5_PR5     → Utviklingsfokus (teste ny pre-shot rutine)
TURN_TRE_M5_PR5     → Treningsfokus (ny teknikk under press)
```

---

## 11. Spillernivåer

### 11.1 Kategori A-L

| Kat | Nivå | Snittscore | Power G | Power J | Ansvarlig |
|-----|------|------------|---------|---------|-----------|
| **A** | OWGR/Rolex World Top 150 | – | 2000 | 2000 | Egen |
| **B** | OWGR/Rolex World Top 400 | – | 1900 | 1900 | Egen |
| **C** | OWGR/Rolex Top 700 | – | 1700 | 1700 | Egen |
| **D** | Amatør World Top 100 | – | 1000 | 1000 | Egen |
| **F** | Junior World Top 300 | < 72 | 220 | 834 | Egen, TN Junior, VGS, Klubb |
| **G** | Junior Europe Top 700 | 72-74 | 118 | 172 | Egen, TN Junior, VGS, Klubb |
| **H** | Junior National Top 2000 | 74-76 | 80 | 58 | Egen, TN Junior, Ung, Klubb |
| **I** | Junior Region | 76-80 | – | – | Egen, Ung, VGS, Klubb |
| **J** | Junior Klubb | 80-85 | – | – | Egen, Ung, VGS, Klubb |
| **K** | Junior Klubb | 85+ | – | – | Egen, Ung, VGS, Klubb |
|       |                          |            |         |         |                             |

### 11.2 Ansvarlig miljø

| Kode | Beskrivelse |
|------|-------------|
| **Egen** | Spiller har hovedansvar |
| **TN Junior** | Team Norway Junior |
| **VGS** | Videregående skole (toppidrett) |
| **Ung** | Ung-satsing |
| **Klubb** | Klubbtrener |

---

## 12. AK-Formel Struktur

### 12.1 Full formel (med CS)

For områder som bruker CS (TEE, INN200, INN150, INN100, INN50):

```
[Pyramide]_[Område]_L-[fase]_CS[nivå]_M[miljø]_PR[press]_[P-posisjon]
```

### 12.2 Forenklet formel (uten CS)

For kortspill (CHIP, PITCH, LOB, BUNKER):

```
[Pyramide]_[Område]_L-[fase]_M[miljø]_PR[press]_[P-posisjon]
```

### 12.3 Putting-formel

```
[Pyramide]_[Område]_L-[fase]_M[miljø]_PR[press]_[Fokus]_[Faser]
```

### 12.4 Turneringsformel

```
TURN_[Type]_M5_PR5
```

### 12.5 Fysisk-formel

```
FYS_[Fokus]_M0
```

---

## 13. Eksempelformler

### 13.1 Fysisk (FYS)

```
FYS_STYRKE_M0
```
→ Fysisk trening, styrke, off-course (gym)

```
FYS_MOBILITET_M0
```
→ Fysisk trening, mobilitet, off-course

```
FYS_POWER_M0
```
→ Fysisk trening, power/eksplosivitet, off-course

---

### 13.2 Teknikk (TEK)

**Driver:**

```
TEK_TEE_L-KROPP_CS0_M1_PR1_P5.0-P6.0
```
→ Teknikk, driver, kun kroppsbevegelse, simulator, lavt press, transition til delivery

```
TEK_TEE_L-KØLLE_CS40_M1_PR1_P4.0-P5.0
```
→ Teknikk, driver, med kølle uten ball, 40% speed, simulator, topp til transition

```
TEK_TEE_L-BALL_CS50_M2_PR2_P6.0-P7.0
```
→ Teknikk, driver, med ball, 50% speed, range, selvmonitorering, delivery til impact

---

**Innspill:**
```
TEK_INN100_L-BALL_CS60_M2_PR2_P7.0
```
→ Teknikk, 100-150m, med ball, 60% speed, range, selvmonitorering, impact-fokus

```
TEK_INN50_L-AUTO_CS80_M2_PR3_P5.0-P8.0
```
→ Teknikk, 50-100m, automatisert, 80% speed, range, sosial, transition til release

---

**Kortspill:**
```
TEK_CHIP_L-KØLLE_M3_PR1_P1.0-P4.0
```
→ Teknikk, chip, med kølle uten ball, øvingsfelt, lavt press, setup til topp

```
TEK_PITCH_L-BALL_M3_PR2_P6.0-P8.0
```
→ Teknikk, pitch, med ball, øvingsfelt, selvmonitorering, delivery til release

```
TEK_BUNKER_L-BALL_M3_PR2_P7.0
```
→ Teknikk, bunker, med ball, øvingsfelt, selvmonitorering, impact-fokus

---

**Putting:**
```
TEK_PUTT3-5_L-BALL_M3_PR1_TEKN_S-I
```
→ Teknikk, putting 3-5ft, med ball, øvingsfelt, lavt press, teknikk-fokus, setup til impact

```
TEK_PUTT15-25_L-BALL_M3_PR2_SPEED_S-F
```
→ Teknikk, putting 15-25ft, med ball, øvingsfelt, selvmonitorering, speed-fokus, hele stroke

```
TEK_PUTT5-10_L-AUTO_M3_PR3_BALL_B-I
```
→ Teknikk, putting 5-10ft, automatisert, øvingsfelt, sosial, ballstart-fokus, back til impact

---

### 13.3 Golfslag (SLAG)

**Full swing:**
```
SLAG_TEE_L-AUTO_CS80_M2_PR3_P7.0
```
→ Golfslag, driver, automatisert, 80% speed, range, sosial, impact-fokus

```
SLAG_INN150_L-AUTO_CS85_M2_PR4_P7.0
```
→ Golfslag, 150-200m, automatisert, 85% speed, range, konkurranse, impact-fokus

---

**Kortspill:**
```
SLAG_CHIP_L-AUTO_M3_PR3_P7.0-P8.0
```
→ Golfslag, chip, automatisert, øvingsfelt, sosial, impact til release

```
SLAG_BUNKER_L-AUTO_M3_PR4_P7.0
```
→ Golfslag, bunker, automatisert, øvingsfelt, konkurranse, impact-fokus

---

**Putting:**
```
SLAG_PUTT5-10_L-AUTO_M3_PR3_SIKTE_S-F
```
→ Golfslag, putting 5-10ft, automatisert, øvingsfelt, sosial, sikte-fokus

```
SLAG_PUTT25-40_L-AUTO_M3_PR4_SPEED_S-F
```
→ Golfslag, putting 25-40ft, automatisert, øvingsfelt, konkurranse, speed-fokus

---

### 13.4 Spill (SPILL)

```
SPILL_BANE_L-AUTO_CS80_M4_PR3_STRATEGI
```
→ Spill, bane, automatisert, 80% speed, treningsrunde, sosial, strategi-fokus

```
SPILL_BANE_L-AUTO_CS85_M4_PR4_SCORING
```
→ Spill, bane, automatisert, 85% speed, treningsrunde, konkurranse, scoring-fokus

```
SPILL_BANE_L-AUTO_CS90_M4_PR4_RISIKO
```
→ Spill, bane, automatisert, 90% speed, treningsrunde, konkurranse, risikostyring

---

### 13.5 Turnering (TURN)

```
TURN_RES_M5_PR5
```
→ Turnering, resultatfokus

```
TURN_UTV_M5_PR5
```
→ Turnering, utviklingsfokus (teste nye elementer)

```
TURN_TRE_M5_PR5
```
→ Turnering, treningsfokus (teknisk arbeid under press)

---

## 14. Regler og unntak

### 14.1 CS-regler

| Regel | Beskrivelse |
|-------|-------------|
| **CS brukes** | TEE, INN200, INN150, INN100, INN50 |
| **CS brukes IKKE** | CHIP, PITCH, LOB, BUNKER, PUTT (alle) |
| **CS0** | Kun for FYS (off-course) |
| **L-KROPP/L-ARM** | Bruk CS0 eller dropp CS |
| **L-KØLLE** | CS20-40 anbefalt |
| **L-BALL** | CS40-60 anbefalt |
| **L-AUTO** | CS70-100 anbefalt |

### 14.2 P-Posisjon regler

| Regel | Beskrivelse |
|-------|-------------|
| **P brukes** | Full swing og kortspill |
| **P brukes IKKE** | Putting (bruk faser S/B/I/F) |
| **Enkeltpunkt** | `P6.0` – én posisjon |
| **Range** | `P5.0-P7.0` – sekvens |
| **Desimaler** | P1.0 til P10.0, med .1-.9 mellom |

### 14.3 Putting-regler

| Regel | Beskrivelse |
|-------|-------------|
| **Fokus obligatorisk** | GREEN, SIKTE, TEKN, BALL, SPEED |
| **Faser obligatorisk** | S, B, I, F (eller kombinasjon) |
| **CS** | Brukes ikke |
| **P-posisjon** | Brukes ikke |

### 14.4 Turnering-regler

| Regel | Beskrivelse |
|-------|-------------|
| **Type obligatorisk** | RES, UTV, TRE |
| **Miljø** | Alltid M5 |
| **Press** | Alltid PR5 |
| **CS** | Brukes ikke i formel |
| **P-posisjon** | Brukes ikke |

### 14.5 Breaking Point-tracking

Breaking Point samles som data, ikke del av formelen:

| Breaking Point | Eksempel |
|----------------|----------|
| **CS-terskel** | Teknikk holder til CS60, bryter ved CS70+ |
| **M-terskel** | Fungerer på M1, bryter på M2 (range) |
| **PR-terskel** | Holder i PR2, bryter i PR4 (konkurranse) |

Data samles over tid for å identifisere spillerens grenser.

---

## Vedlegg: Hurtigreferanse

### Pyramide
| FYS | TEK | SLAG | SPILL | TURN |

### Områder (16)
| TEE | INN200 | INN150 | INN100 | INN50 |
| CHIP | PITCH | LOB | BUNKER |
| PUTT0-3 | PUTT3-5 | PUTT5-10 | PUTT10-15 | PUTT15-25 | PUTT25-40 | PUTT40+ |

### L-Faser
| L-KROPP | L-ARM | L-KØLLE | L-BALL | L-AUTO |

### CS-Nivåer
| CS0 | CS20 | CS30 | CS40 | CS50 | CS60 | CS70 | CS80 | CS90 | CS100 |

### M-Miljø
| M0 | M1 | M2 | M3 | M4 | M5 |

### PR-Press
| PR1 | PR2 | PR3 | PR4 | PR5 |

### P-Posisjoner
| P1.0 | P2.0 | P3.0 | P4.0 | P5.0 | P6.0 | P7.0 | P8.0 | P9.0 | P10.0 |

### Putting-fokus
| GREEN | SIKTE | TEKN | BALL | SPEED |

### Putting-faser
| S | B | I | F |

### Turnering-type
| RES | UTV | TRE |

---

**Dokument Status**: ✅ Komplett
**Versjon**: 2.0
**Dato**: 14. desember 2025
**Neste revisjon**: Ved testing med eksempeløkter
