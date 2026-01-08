# PRESENTASJONSSKRIPT
## Norges Golfforbund & Team Norway
**Dato:** [I morgen]
**Tema:** IUP Golf Master - Kategorisering og Årsplangenerator

---

## INNLEDNING (2-3 min)

**Velkommen**

"Takk for muligheten til å presentere IUP Golf Master-systemet. I dag skal jeg vise dere hvordan vi har bygget et helhetlig system for treningsplanlegging og kategorisering som støtter hele spillerutviklingsløpet - fra nybegynner til elite.

Fokuset i dag er på to kjerneområder:
1. **Kategoriseringssystemet** - hvordan vi strukturerer trening
2. **Årsplangeneratoren** - hvordan vi planlegger årets treningsløp

Begge systemene er utviklet med norsk golfs behov i fokus, og er allerede i produksjon."

---

## DEL 1: KATEGORISERINGSSYSTEMET (15-20 min)

### 1.1 OVERSIKT - DOBBELT KATEGORISERING

**Slide: Dobbelt kategorisering**

"Vi har implementert to parallelle kategoriseringssystemer som jobber sammen:

**A. Spillerkategorier (A-K)** - Hvem du er som spiller
**B. Treningsformler (AK-formel)** - Hva og hvordan du trener

La meg starte med spillerkategoriene."

---

### 1.2 SPILLERKATEGORIER (A-K SYSTEMET)

**Slide: A-K oversikt**

"Vi bruker 11 kategorier fra K (nybegynner) til A (elite). Dette gir oss en klar progresjonsstige:

| Kategori | Nivå | HCP Range | Gj.snitt Score |
|----------|------|-----------|----------------|
| **A** | Elite | 0-2 | 78 slag |
| **B** | Expert | 3-5 | 81 slag |
| **C** | Meget dyktig | 6-8 | 84 slag |
| **D** | Dyktig | 9-11 | 87 slag |
| **E** | Avansert | 12-14 | 90 slag |
| **F** | Kompetent | 15-19 | 93 slag |
| **G** | Mellomnivå | 20-24 | 98 slag |
| **H** | Fremskritt | 25-29 | 103 slag |
| **I** | Utviklende | 30-36 | 108 slag |
| **J** | Grunnleggende | 37-44 | 115 slag |
| **K** | Nybegynner | 45-54 | 125 slag |

**Nøkkelen:** Hver kategori har definerte benchmarks for:
- **Strokes Gained (SG)** - Tee, Approach, Around Green, Putting
- **Testkrav** - Maksimum PEI eller minimum prosent
- **Rundekrav** - Antall runder for å kvalifisere (5-18 runder)

Dette gir oss objektive målinger for progresjon."

**Pause for spørsmål**

---

### 1.3 AK-FORMEL SYSTEMET - TRENINGSPYRAMIDEN

**Slide: Treningspyramiden**

"Nå til den virkelig spennende delen - hvordan vi strukturerer selve treningen.

Vi bruker en pyramidemodell med 5 nivåer:

```
           TURNERING (TURN)
          Prestasjon under press

              SPILL (SPILL)
          Strategi, banehåndtering

           GOLFSLAG (SLAG)
         Slagkvalitet, resultat

           TEKNIKK (TEK)
       Bevegelsesmønster, posisjoner

          FYSISK (FYS)
    Styrke, power, mobilitet [GRUNNMUR]
```

**Viktig:** Dette er IKKE en aut-aut modell. Alle nivåer trenes kontinuerlig, men med ulik vekting gjennom sesongen.

**Eksempel progresjon gjennom året:**
- **Januar-Mars:** 50% FYS, 30% TEK, 20% SLAG
- **April-Mai:** 30% FYS, 30% TEK, 40% SLAG
- **Juni-August:** 20% FYS, 20% TEK, 30% SLAG, 30% SPILL/TURN
- **September-Desember:** Varierende avhengig av periodisering"

---

### 1.4 TRENINGSOMRÅDER - 16 KATEGORIER

**Slide: Treningsområder**

"Innenfor pyramiden har vi 16 spesifikke treningsområder:

**FULL SWING (5 områder)**
- **TEE** - Driver/woods fra tee
- **INN200** - 200+ meter innspill
- **INN150** - 150-200m (5-7 jern)
- **INN100** - 100-150m (8-PW)
- **INN50** - 50-100m (wedges full swing)

**NÆRSPILL (4 områder)**
- **CHIP** - Lav bue, mye rulle
- **PITCH** - Medium bue og rulle
- **LOB** - Høy bue, lite rulle
- **BUNKER** - Greenside sand

**PUTTING (7 områder)**
- **PUTT0-3** til **PUTT40+**
- Progresjon basert på distanse

**BANESPILL**
- **BANE** - Reelt spill på bane

Dette gir oss 16 unike treningsområder å spore."

---

### 1.5 L-FASER - MOTORISK LÆRING

**Slide: L-faser progresjon**

"Her kommer den pedagogiske kjernen i systemet. Vi har 5 læringsfaser som sikrer progressiv ferdighetslæring:

**L-KROPP (🧍)** - Kun kroppsbevegelse
- Ingen kølle, ingen ball
- Fokus: Isolert kroppsbevegelse og balanse
- Eksempel: Rotasjonsøvelser uten kølle

**L-ARM (💪)** - Legger til armbevegelse
- Fortsatt ingen kølle eller ball
- Fokus: Armbevegelse i kombinasjon med kropp

**L-KØLLE (🏌️)** - Legger til kølle
- Med kølle, ingen ball
- Anbefalt hastighet: CS20-40 (20-40% av maks)
- Fokus: Kjenne køllen i bevegelsen

**L-BALL (⚪)** - Legger til ball
- Første kontakt med ball
- Anbefalt hastighet: CS40-60
- Fokus: Overføre bevegelsesmønster til ball

**L-AUTO (🚀)** - Automatisert ferdighet
- Full hastighet
- Anbefalt hastighet: CS70-100
- Fokus: Prestasjon og resultat

**Nøkkelpoeng:** Man går IKKE videre før bevegelsen er stabil på foregående nivå. Dette forhindrer å bygge kompensasjoner inn i svingen."

---

### 1.6 CS-NIVÅER - KLUBBHASTIGHET

**Slide: CS-nivåer tabell**

"CS står for Club Speed - prosent av maksimal køllehodehastighet.

Vi har 10 nivåer fra CS0 til CS100:

| CS-Nivå | Prosent | Bruksområde |
|---------|---------|-------------|
| CS0 | 0% | Fysisk trening (ingen golf) |
| CS20 | 20% | Ekstrem sakte, kun posisjon |
| CS30 | 30% | Veldig sakte, bevegelsesflyt |
| CS40 | 40% | Sakte, mønsterfokus |
| CS50 | 50% | Moderat, komfortsone |
| CS60 | 60% | Økt hastighet, utfordring |
| CS70 | 70% | Konkurranselignende |
| CS80 | 80% | Høy intensitet |
| CS90 | 90% | Nær-maksimal |
| CS100 | 100% | Maksimal innsats |

**Viktig:** CS brukes KUN på full swing (TEE, INN200-INN50).
Nærspill og putting bruker IKKE CS.

**Breaking Point Identification:**
Ved å gradvis øke CS-nivå kan trener identifisere nøyaktig hvor teknikken bryter sammen. Dette er uvurderlig informasjon for teknikkutvikling."

---

### 1.7 M-MILJØ - TRENINGSSTED

**Slide: M-miljø progresjon**

"M står for Miljø - hvor treningen foregår. Vi har 6 nivåer:

**M0 (🏋️) - Off-course**
- Gym, hjemme
- Ikke golf-spesifikk trening
- Eksempel: Styrketrening, mobilitet

**M1 (🏠) - Innendørs**
- Nett, simulator, Trackman
- Kontrollert miljø
- Eksempel: Teknikkarbeid i simulator

**M2 (🏟️) - Range**
- Utendørs, matte eller gress
- Mer realistisk, men fremdeles isolert
- Eksempel: Standard driving range trening

**M3 (⛳) - Øvingsfelt**
- Kortbane, chipping green, putting green
- Realistiske lie og forhold
- Eksempel: Nærspillstrening på kort-bane

**M4 (🌿) - Bane trening**
- Treningsrunde på bane
- Reelle forhold, men uten press
- Eksempel: 9-hulls treningsrunde

**M5 (🏆) - Bane turnering**
- Turneringsrunde
- Fullt press og reelle konsekvenser
- Eksempel: Klubbturnering eller større turnering

**Progresjon:** M0 → M1 → M2 → M3 → M4 → M5

Dette sikrer at ferdighetene blir overført til reelle turneringsituasjoner."

---

### 1.8 PR-PRESS - MENTAL BELASTNING

**Slide: PR-press nivåer**

"PR står for Pressure - psykologisk press i treningssituasjonen:

**PR1 (😌) - Ingen press**
- Utforskende, ingen konsekvens
- Trygg læringssone
- Eksempel: Prøve ny teknikk alene

**PR2 (📊) - Selvmonitorering**
- Måltall og tracking
- Men ingen sosial komponent
- Eksempel: Trackman-økt med personlige mål

**PR3 (👥) - Sosial**
- Med andre, blir observert
- Lett sosialt press
- Eksempel: Gruppe-trening på range

**PR4 (🔥) - Konkurranse**
- Spill mot andre
- Innsats og konkurranseinstinkt
- Eksempel: Interne konkurranser på øvingsfeltet

**PR5 (🏆) - Turnering**
- Resultat teller
- Ranking og konsekvenser
- Eksempel: Offisiell turnering

**Pedagogikk:** Vi bygger gradvis opp evnen til å prestere under press.
En spiller som kun trener på PR1-PR2 vil slite i turneringer (PR5)."

---

### 1.9 P-POSISJONER - SVINGTEKNIKK

**Slide: P-posisjoner diagram**

"For teknikkarbeid bruker vi 14 definerte posisjoner i svingen:

**Bakswing:**
- P1.0 - Address (statisk start)
- P2.0 - Takeaway (shaft parallell)
- P3.0 - Mid-backswing (lead arm parallell)
- P4.0 - Top (maksimal rotasjon)

**Nedswing:**
- P4.5 - Transition (midt i overgang)
- P5.0 - Downswing start (lead arm parallell)
- P5.5 - Shallowed (shaft til albueplan)
- P6.0 - Delivery (shaft parallell)
- P6.1 - Release point (køllehodet krysser hender)
- P6.5 - Pre-impact (siste posisjon før treff)
- P7.0 - Impact (balltreff)

**Follow-through:**
- P8.0 - Release (shaft parallell etter impact)
- P9.0 - Follow-through (trail arm parallell)
- P10.0 - Finish (full rotasjon, balansert)

**Bruk:** Vi kan definere et treningspass som fokuserer på P6.0 til P7.0 (delivery til impact). Dette gir presis kommunikasjon mellom trener og spiller."

---

### 1.10 KOMPLETT FORMEL - EKSEMPEL

**Slide: Formeleksempler**

"La meg vise hvordan alt dette kombineres til en komplett treningsformel:

**EKSEMPEL 1 - Full Swing:**
```
TEK_TEE_L-BALL_CS50_M2_PR2_P6.0-P7.0
```

**Lesning:**
- **TEK** = Pyramidenivå: Teknikk
- **TEE** = Område: Driver/tee shots
- **L-BALL** = Læringsfase: Med ball
- **CS50** = Hastighet: 50% av maks
- **M2** = Miljø: Range
- **PR2** = Press: Selvmonitorering
- **P6.0-P7.0** = Posisjon: Delivery til impact

**På norsk:**
*"Teknikktrening med driver, med ball, 50% hastighet, på range, med selvmonitorering, fokus fra delivery til impact."*

---

**EKSEMPEL 2 - Nærspill:**
```
SLAG_CHIP_L-AUTO_M3_PR3
```

**Lesning:**
- **SLAG** = Pyramidenivå: Golfslag
- **CHIP** = Område: Chip
- **L-AUTO** = Læringsfase: Automatisert
- **M3** = Miljø: Øvingsfelt
- **PR3** = Press: Sosial

**På norsk:**
*"Slagtrening med chip, automatisert ferdighet, på øvingsfelt, med sosialt press."*

---

**EKSEMPEL 3 - Putting:**
```
SLAG_PUTT5-10_L-AUTO_M3_PR2_SPEED_S-F
```

**Lesning:**
- **SLAG** = Pyramidenivå: Golfslag
- **PUTT5-10** = Område: 5-10 fot putts
- **L-AUTO** = Læringsfase: Automatisert
- **M3** = Miljø: Øvingsfelt
- **PR2** = Press: Selvmonitorering
- **SPEED** = Puttingfokus: Hastighetskontroll
- **S-F** = Puttingfaser: Setup til Follow-through

---

**EKSEMPEL 4 - Turnering:**
```
TURN_RES_M5_PR5
```

**Lesning:**
- **TURN** = Pyramidenivå: Turnering
- **RES** = Type: Resultatfokusert
- **M5** = Miljø: Turneringsbane
- **PR5** = Press: Turnering

Dette viser fleksibiliteten i systemet."

---

### 1.11 PUTTING-SPESIFIKK KATEGORISERING

**Slide: Putting detaljer**

"Putting har sitt eget detaljerte system:

**Puttingfokus (5 områder):**
- **GREEN** - Greenlesing (fall, break, grain)
- **SIKTE** - Alignment (alignment, siktelinje)
- **TEKN** - Teknikk (forward press, loft, attack angle)
- **BALL** - Ball start (startlinje)
- **SPEED** - Speed (distansekontroll)

**Puttingfaser (4 faser):**
- **S** - Setup (adresse, alignment)
- **B** - Backstroke (backswing)
- **I** - Impact (treff)
- **F** - Follow-through (gjennomslag)

Dette gir oss svært presis kommunikasjon om puttingarbeid."

---

### 1.12 FORDELER MED SYSTEMET

**Slide: Hovedfordeler**

"La meg oppsummere hovedfordelene med dette kategoriseringssystemet:

**1. SYSTEMATISK PROGRESJON**
- L-fasene sikrer at ferdighetslæring bygges lagvis
- Ingen hopp i utviklingen

**2. BREAKING POINT IDENTIFIKASJON**
- CS-nivåer viser nøyaktig hvor teknikken bryter sammen
- Presisjonstrening på rett nivå

**3. MILJØOVERFØRING**
- M-progresjon sikrer at ferdigheter overføres til banen
- Fra range til turnering

**4. PSYKOLOGISK FORBEREDELSE**
- PR-nivåer forbereder spillere på turneringspress
- Gradvis økning av mental belastning

**5. PRESIS KOMMUNIKASJON**
- Trener og spiller snakker samme språk
- P-posisjoner gir millimeterpresisjon

**6. DATADREVET UTVIKLING**
- Alt logges og analyseres
- Tydelig progresjonssporing

**7. SPILLERMOTIVASJON**
- Synlig fremgang gjennom kategorier
- Badge-system for oppnådde milepæler"

---

## DEL 2: ÅRSPLANGENERATOREN (15-20 min)

### 2.1 OVERSIKT - PERIODISERING

**Slide: Periodiseringsmodell**

"Nå går vi over til årsplangeneratoren. Dette er verktøyet som tar kategoriseringssystemet og setter det inn i en helhetlig årsplan.

Vi bruker en klassisk periodiseringsmodell med 4 periodetyper:

**E - EVALUERING** (Lilla 🟣)
- Testing og kartlegging
- Benchmark-etablering
- Typisk varighet: 4 uker
- Eksempel: Januar (sesongstart)

**G - GRUNNPERIODE** (Oransje 🟠)
- Grunnleggende ferdighetsutvikling
- Høyt volum, moderat intensitet
- Typisk varighet: 12 uker
- Eksempel: Februar-April

**S - SPESIALISERING** (Blågrønn 🔵)
- Fokusert spesialisering
- Moderat volum, høy intensitet
- Typisk varighet: 10 uker
- Eksempel: Mai-Juni

**T - TURNERING** (Gull 🟡)
- Konkurranser og prestasjoner
- Lavere volum, maksimal intensitet
- Typisk varighet: 8 uker
- Eksempel: Juli-August

Disse roterer gjennom sesongen basert på turneringskalender."

---

### 2.2 DATAMODELL FOR ÅRSPLAN

**Slide: Årsplanstruktur**

"En årsplan i systemet inneholder:

**GRUNNDATA:**
- Spiller-ID og navn
- Start- og sluttdato
- Status (aktiv, fullført, pauset, kansellert)

**BASELINE-DATA:**
- Gjennomsnittlig score
- Handicap
- Driver-hastighet
- Spillerkategori (A-K)

**PERIODEKONFIGURASJON:**
- Antall uker per periode (E, G, S, T)
- Ukentlig timemål
- Intensitetsprofil

**DAGLIGE ØKTER:**
- Knyttes til spesifikke dager
- Inneholder AK-formel
- Status (planlagt, fullført, hoppet over)

**TURNERINGER:**
- Planlagte turneringer
- Viktighetsgrad (A, B, C)
- Resultatmål

**MODIFIKASJONER:**
- Endringslogg
- Godkjenningsflyt for endringer"

---

### 2.3 GENERERINGS-WORKFLOW

**Slide: Genererings-workflow diagram**

"Prosessen for å generere en årsplan:

**STEG 1: MODUSVALG**
- **Mal-basert:** Velg ferdig mal (A, B, C, etc.)
- **Fra bunnen:** Bygg helt tilpasset plan

**STEG 2: PERIODEKONFIGURASJON**
- Sett start- og sluttdato
- Definer lengde på E, G, S, T perioder
- Eksempel: E:4, G:12, S:10, T:8 uker

**STEG 3: TIDSLINJEVISUALISERING**
- Månedsvisning: Se hele året
- Ukevisning: Detaljert per uke
- Drag-and-drop for justering

**STEG 4: ØKTTILORDNING**
- Koble treningsøkter til perioder
- Velg treningstyper per uke
- Sett intensitet og volum

**STEG 5: TURNERINGSPLANLEGGING**
- Legg til turneringer
- Sett viktighet (A/B/C)
- Automatisk taper før A-turneringer

**STEG 6: EKSPORT**
- PDF-eksport med full plan
- Del med spiller og foreldre
- Integrasjon med kalender"

---

### 2.4 DAGLIG TRENINGSOPPDRAG

**Slide: Daily Training Assignment**

"Hver dag i planen har et treningsoppdrag med:

**ØKTTILORDNING:**
- Øktnavn og -type
- Estimert varighet
- AK-formel (full spesifikasjon)

**PERIODEKONTEKST:**
- Hvilken periode (E, G, S, T)
- Uke nummer i sesongen
- Dag i uken

**FLEXIBILITET:**
- Hviledag (ja/nei)
- Valgfri (ja/nei)
- Kan substitueres (ja/nei)

**UTFØRELSESTRACKING:**
- Status (planlagt, fullført, hoppet over)
- Kobling til fullført økt
- Spillernotater

**SAMLING-INTEGRASJON:**
- Kobling til samling-økt hvis relevant
- Kilde (plan, samling, manuell)

Dette gir full sporbarhet av planlagt vs utført."

---

### 2.5 PERIODISERING PER UKE

**Slide: Ukentlig periodisering**

"Hver uke i året har en periodiseringsprofil:

**PRIORITETSHIERARKI (0-3):**
- Turnering (Competition)
- Spill (Play)
- Golfslag (Golf Shot)
- Teknikk (Technique)
- Fysisk (Physical)

**Eksempel - Turneringsuke:**
- Turnering: 3 (høyeste)
- Spill: 2
- Golfslag: 2
- Teknikk: 1
- Fysisk: 0

**Eksempel - Grunnperiode:**
- Turnering: 0
- Spill: 1
- Golfslag: 2
- Teknikk: 3 (høyeste)
- Fysisk: 3

**TRENINGSPARAMETRE:**
- L-fase range (min-maks)
- CS-nivå range (min-maks)
- Planlagte timer vs faktiske timer
- Volum-intensitet (lav, medium, høy, topp, taper)

Dette styrer automatisk øktgenerering."

---

### 2.6 STATISTIKK OG ANALYSE

**Slide: Statistikkvisning**

"Systemet genererer automatisk statistikk på flere nivåer:

**UKENTLIG STATISTIKK:**
- Planlagte vs fullførte økter
- Fullføringsrate (%)
- Planlagte vs faktiske minutter
- Økttypefordeling
- L-fase minutter
- Gjennomsnittlig kvalitet, fokus, intensitet
- Streak (dager på rad)
- Periode (E, G, S, T)

**MÅNEDLIG STATISTIKK:**
- Totale økter
- Fullføringsrate
- Total tid
- Gjennomsnittsminutter per økt
- Gjennomsnittsminutter per dag
- Økttypefordeling
- Gjennomsnittskvalitet
- Tester fullført/bestått
- Badges opptjent

**SESONGANALYSE:**
- Totaloversikt hele sesongen
- Progresjon gjennom kategorier
- Sammenligning planlagt vs utført
- Breaking points identifisert
- Turneringsresultater korrelert med treningsvolum

Dette gir trener og spiller fullstendig oversikt."

---

### 2.7 MODIFIKASJONSSTYRING

**Slide: Endringsflyt**

"Årsplaner er levende dokumenter. Vi har et styringssystem for endringer:

**ENDRINGSFORESPØRSEL:**
- Hvem forespør (spiller, trener, forelder)
- Type endring (flytt økt, endre intensitet, legg til turnering)
- Begrunnelse
- Prioritet (lav, medium, høy)

**GODKJENNINGSFLYT:**
- Automatisk godkjenning for enkle endringer
- Krev godkjenning fra hovedtrener for større endringer
- Varsling til relevante parter

**VERSJONSHISTORIKK:**
- Alle endringer logges
- Tidsstempel og ansvarlig
- Mulighet for rollback

**KONFLIKTDETEKSJON:**
- Varsler ved overlapp med andre økter
- Sjekker mot hvileperioder
- Validerer mot periodeplanen

Dette sikrer at planen forblir strukturert selv med endringer."

---

### 2.8 TURNERINGSINTEGRASJON

**Slide: Turneringsplanlegging**

"Turneringer er kjernen i periodiseringen:

**TURNERINGSTYPER:**
- **A-turnering:** Hovedmål, full forberedelse
- **B-turnering:** Viktig, men ikke hovedmål
- **C-turnering:** Trenings-turnering

**AUTOMATISK FORBEREDELSE:**
- **4 uker før A-turnering:**
  - Gradvis økning av PR-nivå (PR3 → PR4 → PR5)
  - Økning av M-nivå (M3 → M4 → M5)
  - Opprettholder L-AUTO fase

- **2 uker før:**
  - Peak-uke (høyeste intensitet)

- **1 uke før:**
  - Taper-uke (redusert volum, høy intensitet)
  - Fokus på sharpness og mental forberedelse

**ETTER TURNERING:**
- Hviledag eller lett økt
- Evaluering av prestasjon
- Justering av plan basert på resultat

**TURNERINGSLOGGING:**
- Score, plassering, statistikk
- Sammenkobling med treningsdata
- Identifisering av mønstre"

---

### 2.9 SAMLING-INTEGRASJON

**Slide: Samling og årsplan**

"Samlinger (treningsleirer) integreres sømløst:

**SAMLING-OPPSETT:**
- Start- og sluttdato
- Sted og fasiliteter
- Hovedtema (teknikk, spill, fysisk)
- Ansvarlig trener

**ØKTINTEGRASJON:**
- Samling-økter erstatter planlagte daglige økter
- Automatisk markering av berørte dager
- Synkronisering av AK-formel fra samling

**SAMLINGS-ØKTER:**
- Defineres med full AK-formel
- Kan være gruppeøkt eller individuelle
- Evalueres som normale økter

**STATISTIKK:**
- Samlings-økter inkluderes i ukentlig/månedlig statistikk
- Separat visning av samling vs individuell trening
- Sammenligning før/etter samling

Dette gir helhetlig bilde av treningsbelastning."

---

### 2.10 SPILLER- OG FORELDREVISNING

**Slide: Brukergrensesnitt for spiller**

"Spillere og foreldre ser forenklet versjon:

**SPILLERVISNING:**
- **Ukeoversikt:**
  - Dagens økt fremhevet
  - Kommende økter denne uken
  - Status på fullførte økter

- **Øktdetaljer:**
  - Hva skal trenes (forståelig språk)
  - Hvor lenge
  - Hvor (hvilket miljø)
  - Tips og fokusområder

- **Fremgang:**
  - Streak-teller
  - Fullføringsrate
  - Opptjente badges
  - Kategoriutvikling

**FORELDREVISNING:**
- Samme som spillervisning
- + Oversikt over periodisering
- + Turneringsplan
- + Kommunikasjon med trener

**TRENERVISNING:**
- Full tilgang til alle data
- Analyseverktøy
- Mulighet for justering
- Oversikt over flere spillere

Dette sikrer at alle parter har riktig informasjonsnivå."

---

### 2.11 EKSEMPEL PÅ KOMPLETT ÅRSPLAN

**Slide: Årsplan eksempel**

"La meg vise et konkret eksempel på en årsplan for kategori D-spiller (HCP 9-11):

**JANUAR - EVALUERING (E-periode, 4 uker)**
- **Uke 1-2:** Testing
  - Tester: Approach 25/50/75/100m, Short game, Putting
  - Baseline målinger: SG-data, Driver speed
  - Svinganalyse: Video + Trackman

- **Uke 3-4:** Planlegging
  - Resultatgjennomgang med trener
  - Identifisere fokusområder
  - Sette sesongmål

**FEBRUAR-APRIL - GRUNNPERIODE (G-periode, 12 uker)**
- **Fokus:** 40% TEK, 30% FYS, 30% SLAG
- **L-fase:** Hovedvekt L-KROPP, L-ARM, L-KØLLE
- **CS-nivå:** CS0-CS40
- **Miljø:** M0-M2 (gym, indoor, range)
- **Press:** PR1-PR2
- **Ukentlig:** 8-10 timer
  - 2x Gym (styrke/mobilitet)
  - 2x Teknikk indoor
  - 2x Range (fundamental drills)

**MAI-JUNI - SPESIALISERING (S-periode, 10 uker)**
- **Fokus:** 30% TEK, 20% FYS, 50% SLAG
- **L-fase:** L-BALL, L-AUTO
- **CS-nivå:** CS50-CS80
- **Miljø:** M2-M4 (range, øvingsfelt, bane)
- **Press:** PR2-PR3
- **Ukentlig:** 10-12 timer
  - 1x Gym
  - 1x Teknikk
  - 2x Slagtrening (full intensitet)
  - 2x Banespill

**JULI-AUGUST - TURNERING (T-periode, 8 uker)**
- **Fokus:** 50% SPILL/TURN, 30% SLAG, 20% TEK
- **L-fase:** L-AUTO
- **CS-nivå:** CS80-CS100
- **Miljø:** M4-M5 (bane, turnering)
- **Press:** PR4-PR5
- **Turneringer:**
  - Uke 27: A-turnering (Regionsmesterskap)
  - Uke 29: B-turnering (Klubb-turnering)
  - Uke 31: A-turnering (Junior-NM)
  - Uke 33: C-turnering (Avslutning)
- **Ukentlig:** 12-15 timer
  - Mye banespill
  - Presstrening
  - Mental trening
  - Vedlikeholdstrening (gym/teknikk)

**SEPTEMBER-OKTOBER - GRUNNPERIODE 2 (G-periode, 8 uker)**
- Lignende som Februar-April
- Fokus på svakheter identifisert i turneringssesong
- Forberedelse til vinterdrill

**NOVEMBER-DESEMBER - EVALUERING 2 (E-periode, 4 uker)**
- Testing av sesongens utvikling
- Oppsummering
- Planlegging neste sesong

**TOTALT:**
- 52 uker
- ~450-500 timer trening
- 8-12 turneringer
- 6-8 tester/evalueringer"

---

## DEL 3: INTEGRASJON OG VERDI (5-10 min)

### 3.1 HVORDAN SYSTEMENE JOBBER SAMMEN

**Slide: Integrasjon**

"Kategorisering og årsplangenerator er to sider av samme mynt:

**FLYT:**
```
Spillerkategori (A-K)
    ↓
Periodisering (E, G, S, T)
    ↓
Ukentlige prioriteringer
    ↓
Daglige økter med AK-formel
    ↓
Utførelse og logging
    ↓
Analyse og justering
    ↓
Progresjon i kategori
```

**KONKRET EKSEMPEL:**
1. **Spiller:** Kategori D (HCP 10)
2. **Svakhet identifisert:** Approach shots 100-150m (SG -0.5)
3. **Sesongmål:** Kategori C (HCP 8)
4. **Årsplan:**
   - G-periode: Teknikk focus på INN100, L-KØLLE → L-BALL, CS20-CS50
   - S-periode: Slagtrening INN100, L-AUTO, CS70-CS90, M2-M3, PR2-PR3
   - T-periode: Banespill med fokus INN100, L-AUTO, CS100, M4-M5, PR4-PR5
5. **Resultat:**
   - Måling før: SG Approach 100-150m = -0.5
   - Måling etter: SG Approach 100-150m = -0.2
   - Forbedring: 0.3 slag per runde = ~5 slag over 18 hull
   - Ny HCP: 8.5 → Kvalifisert for kategori C

**Dette er data-drevet, systematisk utvikling.**"

---

### 3.2 VERDI FOR NORSK GOLF

**Slide: Verdi for forbundet**

"Hva gir dette systemet til Norsk Golf?

**1. STANDARDISERING**
- Felles språk og struktur
- Enklere sammenligning på tvers av klubber
- Bedre datagrunnlag for talentutvikling

**2. OBJEKTIVE MÅLINGER**
- Kategori-benchmarks med SG-data
- Klare krav for progresjon
- Mindre subjektivitet

**3. SPILLERUTVIKLING**
- Systematisk progresjon
- Breaking point identifikasjon
- Individuelt tilpassede planer

**4. TRENERVERKTØY**
- Komplett planleggingsverktøy
- Analyseverktøy for progresjon
- Kommunikasjon med spillere/foreldre

**5. DATA FOR FORBUNDET**
- Nasjonal oversikt over treningsvolum
- Identifisering av best practices
- Grunnlag for ressursallokering
- Talentidentifikasjon

**6. INTEGRASJON MED TEAM NORWAY**
- Sømløs overgang til landslags-struktur
- Felles kategorisystem
- Data-drevet utvalg"

---

### 3.3 STATUS OG VEIEN VIDERE

**Slide: Status**

"Hvor er vi i dag?

**PRODUKSJONSKLART:**
- ✅ Kategoriseringssystem (A-K)
- ✅ AK-formel systemet (komplett)
- ✅ Årsplangenerator (v1.0)
- ✅ Treningsdagbok med AK-formel
- ✅ Statistikk og analyse
- ✅ Badge-system

**PÅGÅENDE ARBEID:**
- 🔄 Samling-integrasjon (80% ferdig)
- 🔄 Turneringsresultat-API
- 🔄 SG-data import fra Golf Genius

**PLANLAGT:**
- 📋 Video-integrasjon for svingteknikk
- 📋 AI-assistert planforslag
- 📋 Parent/coach kommunikasjonsmodul
- 📋 Mobil-app (iOS/Android)

**NØKKELTALL:**
- 35+ filer i kodebasen
- 2000+ linjer kjernelogikk
- 11 database-modeller
- Fullstendig TypeScript-typing
- Komplett API med CRUD-operasjoner"

---

## DEL 4: DATALAGRING OG TESTDATA-DELING (10-15 min)

### 4.1 OVERSIKT - DATAARKITEKTUR

**Slide: Systemarkitektur**

"Før vi avslutter, la meg forklare hvordan data faktisk lagres og deles i systemet. Dette er viktig for å forstå sikkerhet, personvern og hvordan trenere får tilgang til spillerdata.

Systemet er bygget med tre kjerneprinsipper:

**1. MULTI-TENANT ARKITEKTUR**
- Hver organisasjon (klubb, akademi) har sin egen isolerte "tenant"
- Data deles IKKE på tvers av organisasjoner
- Full dataseparasjon

**2. RELASJONSBASERT TILGANG**
- Trenere får tilgang gjennom direkte spiller-trener relasjoner
- Ingen kompliserte tilgangskontroll-tabeller
- Enkelt og sporbart

**3. GRANULÆR LOGGING**
- All dataaksess logges
- Tidsstempel på alle endringer
- Full revisjonsspor for GDPR-compliance

La meg vise hvordan dette fungerer i praksis."

---

### 4.2 DATABASE-MODELL - KJERNEENTITETER

**Slide: Database-oversikt**

"La meg starte med å vise hovedentitetene i databasen:

**ORGANISASJON (TENANT)**
```
Tenant
├── id (organisasjons-ID)
├── name (f.eks. "Oslo Golfklubb")
├── subscriptionTier (free, pro, enterprise)
└── Isolerer all data for denne organisasjonen
```

**BRUKER (USER)**
```
User
├── id
├── email, password (kryptert)
├── role (admin, coach, player, parent)
├── tenantId → Tenant
└── Kobles til Coach ELLER Player
```

**TRENER (COACH)**
```
Coach
├── id, userId
├── tenantId → Tenant
├── certifications (JSON)
├── specializations (JSON)
└── players[] → Player (alle spillere under treneren)
```

**SPILLER (PLAYER)**
```
Player
├── id, userId
├── coachId → Coach (direkte tilknytning til trener)
├── parentId → Parent
├── category (A-K)
├── handicap, WAGR rank
├── testResults[] → TestResult (alle testresultater)
└── tenantId → Tenant
```

**Nøkkelen:** Spiller har `coachId` - dette gir treneren automatisk tilgang til spillerens data."

---

### 4.3 TESTDATA-MODELLEN

**Slide: Test-struktur**

"Nå til testdataene - dette er kjernen i systemet:

**TESTDEFINISJON (TEST)**
```
Test
├── id
├── testNumber (1-20, unikt per tenant)
├── name ("Approach 25m")
├── category, testType
├── protocolName, protocolVersion
├── testDetails (JSON):
│   ├── equipment (liste)
│   ├── setup (beskrivelse)
│   ├── instructions (steg-for-steg)
│   ├── scoringCriteria
│   └── duration, repetitions
├── benchmarkWeek (boolean)
└── tenantId → Tenant
```

**Viktig:** Testdefinisjoner er system-nivå. Alle spillere i samme tenant bruker samme testdefinisjoner.

---

**TESTRESULTAT (TESTRESULT)**
```
TestResult
├── id
├── testId → Test
├── playerId → Player
├── tenantId → Tenant
├── testDate, testTime
├── location, facility, environment
├── weather, equipment
│
├── results (JSON) ← Rådata fra testen
├── value (Decimal) ← Hovedverdi (f.eks. 65%)
├── pei (Decimal) ← Performance Energy Index (0-10)
│
├── passed (Boolean)
├── categoryRequirement (krav for kategori)
├── percentOfRequirement (f.eks. 87%)
├── categoryBenchmark (Boolean)
├── improvementFromLast (Decimal)
│
├── videoUrl (link til video-analyse)
├── trackerData (JSON - Trackman data)
├── coachFeedback (Text)
├── playerFeedback (Text)
│
└── peerComparisons[] → PeerComparison
```

**Nøkkelpunkter:**
- Rådata lagres i `results` (JSON) - full fleksibilitet
- Beregnede verdier lagres separat for rask tilgang
- Feedback-felt for kommunikasjon
- Video-integrasjon
- Peer-sammenligninger lagres på testtidspunktet

---

**PEER-SAMMENLIGNING (PEERCOMPARISON)**
```
PeerComparison
├── id
├── testResultId → TestResult
├── playerId → Player
├── criteriaCategory (A-K)
├── criteriaGender
├── criteriaAgeRange
├── criteriaHandicapRange
│
├── percentile (0-100)
├── categoryRank (plassering)
├── percentOfGroupAverage
└── createdAt (tidsstempel)
```

**Hvorfor lagre ved testtidspunkt?**
- Historisk nøyaktighet
- Benchmark endrer seg over tid
- Spillere kan se egen utvikling mot bevegelige mål"

---

### 4.4 DATAFLYT - FRA TEST TIL DASHBOARD

**Slide: Dataflyt-diagram**

"La meg vise hele dataflyten fra en test blir tatt til den vises i trener-dashboardet:

**STEG 1: TEST OPPRETTELSE**
```
Trener/Admin → POST /api/v1/tests/
    ↓
Validering (testNumber unikt, testDetails komplett)
    ↓
Test lagres i database med testNumber 1-20
    ↓
Tilgjengelig for alle spillere i samme tenant
```

---

**STEG 2: TEST UTFØRELSE**
```
Spiller/Trener → POST /api/v1/tests/results
    ↓
Input:
  - testId (hvilken test)
  - playerId (hvem)
  - testDate (når)
  - results (JSON med rådata)
  - location, weather, equipment
    ↓
Beregning:
  - value (hovedverdi)
  - pei (performance energy index)
  - passed (bestått/ikke bestått)
  - improvementFromLast (endring fra forrige)
    ↓
TestResult lagres
    ↓
OPTIONAL: PeerComparison beregnes og lagres
```

---

**STEG 3: TRENER-TILGANG**
```
Trener logger inn → JWT token genereres
    ↓
GET /api/v1/coaches/me/players
    ↓
Query: Player WHERE coachId = trener.id
    ↓
Returnerer liste med spillere inkludert testResults[]
    ↓
Vises i Trener-dashboard
```

---

**STEG 4: DETALJVISNING**
```
Trener klikker på spiller → Detaljside
    ↓
Henter spesifikk spillers TestResults
    ↓
Viser:
  - Siste testresultat
  - Historisk trend (line chart)
  - Sammenligning med kategori-krav
  - Peer-ranking
  - Video-analyser (hvis tilgjengelig)
  - Tidligere feedback
    ↓
Trener kan legge til coachFeedback
    ↓
PATCH /api/v1/tests/results/:id
    ↓
Oppdatert feedback synlig for spiller
```

Dette er en fullstendig, sporbar flyt."

---

### 4.5 TRENER-SPILLER RELASJONER

**Slide: Tilgangsmodell**

"Hvordan får trenere tilgang til spillerdata? Det er faktisk veldig enkelt:

**DIREKTE RELASJON**
```
Player-tabell har felt: coachId

Eksempel:
Player {
  id: "abc123"
  name: "Ola Nordmann"
  coachId: "xyz789" ← Direkte referanse til Coach
  category: "D"
  testResults: [...]
}

Coach {
  id: "xyz789"
  name: "Kari Trener"
  players: [Player where coachId = "xyz789"]
}
```

**TILGANGSLOGIKK**
```
Når trener spør om spillere:
1. Autentisering: JWT token valideres
2. Identifikasjon: request.user.coachId = "xyz789"
3. Query: Player.findMany({ coachId: "xyz789" })
4. Return: Alle spillere med coachId = "xyz789"
5. Include: testResults, peerComparisons, chatGroups
```

**FORDELER:**
- ✅ Enkelt å forstå og vedlikeholde
- ✅ Rask query (indeksert på coachId)
- ✅ Automatisk oppdatering ved relasjonsendring
- ✅ Ingen kompleks ACL-tabell
- ✅ Full revisjonsspor via database-logg

**SIKKERHET:**
- Tenant-nivå isolasjon (første sjekk)
- Relasjon-basert tilgang (andre sjekk)
- Alle endringer logges med tidsstempel
- GDPR-compliant datahåndtering"

---

### 4.6 GRUPPE-KOMMUNIKASJON

**Slide: ChatGroup-modell**

"For å dele testdata og gi feedback bruker vi gruppe-kommunikasjon:

**CHATGROUP**
```
ChatGroup
├── id
├── tenantId → Tenant
├── name ("Ola Nordmann - Treningsgruppe")
├── groupType:
│   ├── 'direct' → 1:1 samtale
│   ├── 'team' → Flere spillere/trenere
│   ├── 'academy' → Organisasjons-bred
│   └── 'coach_player' → Trener-til-spiller kanal
├── isArchived, isMuted
├── lastMessageAt
└── members[] → ChatGroupMember
```

---

**CHATGROUPMEMBER**
```
ChatGroupMember
├── id
├── groupId → ChatGroup
├── memberType ('player' | 'coach' | 'parent')
├── memberId (polymorph - kan være Player/Coach/Parent ID)
├── role ('admin' | 'member')
│
├── lastReadAt ← Siste leste melding
├── unreadCount ← Antall uleste
├── lastReadMessageId
│
├── isMuted
├── notificationsEnabled
└── joinedAt, leftAt
```

**BRUKSTILFELLER FOR TESTDATA:**

1. **Opprett coach_player gruppe**
   - Trener oppretter gruppe med spiller
   - Automatisk notifikasjon til spiller

2. **Del testresultat**
   - Trener poster melding: "Ny testresultat Test 4"
   - Inkluderer link til TestResult
   - Spiller får notifikasjon

3. **Gi feedback**
   - Trener skriver coachFeedback i TestResult
   - Poster melding i gruppe med sammendrag
   - Spiller kan svare og stille spørsmål

4. **Video-deling**
   - VideoShare-modell kobler video til spiller
   - Link deles i gruppe-chat
   - Mulighet for tidskodet kommentarer

5. **Diskusjon**
   - Full samtale-historie
   - Emojis, reactions
   - File attachments (screenshots fra Trackman)

**FORDELER:**
- Kontekstuell kommunikasjon
- Historikk vedlikeholdes
- Multi-part samtaler (trener + spiller + forelder)
- Push-notifikasjoner
- Read-receipts (lastReadAt)"

---

### 4.7 SIKKERHET OG PERSONVERN

**Slide: Sikkerhetsarkitektur**

"Personvern og datasikkerhet er kritisk. La meg vise våre sikkerhetstiltak:

**NIVÅ 1: MULTI-TENANT ISOLASJON**
```
Alle queries filtreres automatisk:
WHERE tenantId = request.tenant!.id

Eksempel:
Player.findMany({
  coachId: coachId,
  tenantId: request.tenant!.id  ← Automatisk lagt til
})

Resultat:
- Organisasjon A kan ALDRI se data fra Organisasjon B
- Selv ikke admin kan gå på tvers
- Komplett dataseparasjon
```

---

**NIVÅ 2: ROLLE-BASERT TILGANG**
```
User.role bestemmer hva du kan gjøre:

'admin'   → Full tilgang innenfor tenant
'coach'   → Kan se egne spilleres data, opprette tester
'player'  → Kan se egen data, registrere tester
'parent'  → Kan se barns data (via parentId-relasjon)
```

---

**NIVÅ 3: RELASJON-BASERT TILGANG**
```
Trener kan kun se:
  Player WHERE coachId = trener.id

Spiller kan kun se:
  TestResult WHERE playerId = spiller.id

Forelder kan kun se:
  Player WHERE parentId = forelder.id
```

---

**AUTENTISERING**
```
JWT Token-basert:
- Login → JWT med userId, role, tenantId
- Hver request → Validerer JWT
- Utløper etter 1 time (konfigurerbart)
- Refresh token for lang-levd session
- 2FA support (valgfritt aktivert)
```

---

**KRYPTERING**
```
Data in transit:
- HTTPS/TLS 1.3 for all API-kommunikasjon
- WebSocket over WSS for real-time chat

Data at rest:
- PostgreSQL database med kryptert storage
- Passordhashing med bcrypt (salt + pepper)
- Sensitive felter (medicalNotes) kan krypteres ekstra
```

---

**LOGGING & AUDIT TRAIL**
```
Alle endringer logges:
- createdAt (når opprettet)
- updatedAt (når sist endret)
- createdBy, modifiedBy (hvem)
- changeHistory (JSON med endringer)

Eksempel testresultat:
{
  id: "abc123",
  createdAt: "2025-01-15T10:30:00Z",
  updatedAt: "2025-01-15T14:20:00Z",
  modifiedBy: "coach_xyz",
  changeHistory: [
    { field: "coachFeedback", old: null, new: "Bra fremgang!", timestamp: "..." }
  ]
}
```

---

**GDPR-COMPLIANCE**
```
Innebygd personvern:

1. DATA MINIMERING
   - Lagrer kun nødvendig data
   - Ingen unødvendige personidentifikatorer

2. RETT TIL INNSYN
   - API-endpoint: GET /api/v1/players/:id/personal-data
   - Returnerer all data om spilleren

3. RETT TIL SLETTING
   - API-endpoint: DELETE /api/v1/players/:id
   - Kaskade-sletting av testresultater
   - Anonymisering av historiske data

4. DATA PORTABILITET
   - Export til JSON format
   - Strukturert for import i andre systemer

5. SAMTYKKE
   - Foreldre må godkjenne for spillere under 18
   - Logging av samtykke-tidspunkt
```

---

**API-SIKKERHET**
```
Rate limiting:
- 100 requests per minutt per bruker
- Beskytter mot DDoS og automatiserte angrep

Input validering:
- Zod schemas for all input
- SQL injection prevention (parameteriserte queries)
- XSS prevention (sanitering av user input)

CORS:
- Whitelist av tillatte origins
- Sikrer at kun vår frontend kan kalle APIet
```

Dette er enterprise-nivå sikkerhet."

---

### 4.8 PRAKTISK EKSEMPEL - FULL TESTDATA-FLYT

**Slide: Komplett eksempel**

"La meg vise et komplett, realistisk eksempel:

**SCENARIO:** Spiller "Emma Andresen" (kategori D) tar Test 4 (Approach 50m)

---

**STEG 1: TRENER OPPRETTER TESTDEFINISJON**
```
Trener: POST /api/v1/tests/
Body: {
  "testNumber": 4,
  "name": "Approach 50m",
  "category": "Innspill",
  "testType": "percentage",
  "protocolName": "IUP Golf Test 4",
  "description": "Treff 10 baller fra 50m, tell % som lander på green",
  "testDetails": {
    "equipment": ["Wedge (50-54°)", "10 baller", "Målebånd"],
    "setup": "50m til flagg, grønn på flat gresskvalitet",
    "instructions": [
      "Varming 10 slag",
      "Treff 10 baller mot flagg",
      "Tell hvor mange baller som lander på green",
      "Prosentandel = (antall_på_green / 10) * 100"
    ],
    "scoringCriteria": "Kategori D krav: 30%",
    "duration": 20
  }
}

Response: Test opprettet med id "test_004"
```

---

**STEG 2: EMMA TAR TESTEN**
```
Emma (eller hennes trener): POST /api/v1/tests/results
Body: {
  "testId": "test_004",
  "playerId": "emma_123",
  "testDate": "2025-01-20",
  "testTime": "14:30",
  "location": "Oslo Golfklubb",
  "facility": "Øvingsfelt",
  "environment": "outdoor",
  "weather": "Solfylt, 15°C, lett vind",
  "equipment": "Titleist Vokey 52°",

  "results": {
    "totalShots": 10,
    "shotsOnGreen": 4,
    "distances": [48m, 51m, 47m, 50m, 52m, 49m, 50m, 51m, 48m, 50m],
    "notes": "4 på green, 6 like utenfor (2-3m)"
  },

  "value": 40.0,  // 4/10 = 40%
  "pei": 6.5      // Moderat innsats
}

Backend beregner automatisk:
- categoryRequirement: 30% (for kategori D)
- percentOfRequirement: 133% (40% / 30%)
- passed: true (40% >= 30%)
- categoryBenchmark: false (ikke benchmark-uke)
- improvementFromLast: +10% (forrige test var 30%)

Response: TestResult opprettet med id "result_456"
```

---

**STEG 3: PEER-SAMMENLIGNING BEREGNES**
```
Backend oppretter automatisk PeerComparison:

Body (automatisk generert): {
  "testResultId": "result_456",
  "playerId": "emma_123",
  "criteriaCategory": "D",
  "criteriaGender": "F",
  "criteriaAgeRange": "14-16",
  "criteriaHandicapRange": "9-11"
}

Backend henter alle TestResults som matcher:
- Test 4 (Approach 50m)
- Kategori D
- Jenter
- Alder 14-16
- Handicap 9-11

Beregner:
- Gjennomsnitt i gruppen: 35%
- Emmas verdi: 40%
- Percentile: 68 (Emma er bedre enn 68% i sin gruppe)
- CategoryRank: 12 av 38
- percentOfGroupAverage: 114% (40% / 35%)

Lagres i PeerComparison-tabell
```

---

**STEG 4: TRENEREN SER RESULTATET**
```
Trener "Kari Hansen" logger inn
    ↓
GET /api/v1/coaches/me/players
    ↓
Får liste med spillere, inkludert Emma
    ↓
Klikker på Emma i dashboard
    ↓
GET /api/v1/players/emma_123?include=testResults
    ↓
Ser:
- Emmas siste testresultat: 40% (BESTÅTT)
- Forbedring: +10% fra forrige
- Kategori-krav: 30% (Emma 133% av krav)
- Peer-ranking: 68. percentil
- Graf som viser progresjon: 20% → 30% → 40%
```

---

**STEG 5: TRENER GIR FEEDBACK**
```
Kari skriver feedback:

PATCH /api/v1/tests/results/result_456
Body: {
  "coachFeedback": "Fantastisk fremgang, Emma! Du har økt fra 30% til 40%.
                    Neste steg: Fokus på å få de 6 ballene som lander
                    2-3m utenfor green nærmere flagget. Jobber vi med
                    approach-teknikk i L-BALL fase, CS50, neste uke."
}

TestResult oppdateres
    ↓
Emma får notifikasjon i appen
    ↓
Emma kan se feedback i sin profil under Test 4
```

---

**STEG 6: DELING I GRUPPE**
```
Kari oppretter melding i coach_player ChatGroup:

POST /api/v1/chat/groups/emma_kari_group/messages
Body: {
  "content": "Gratulerer med Test 4 resultat! Se feedback. 🎉",
  "attachments": [
    { "type": "testResult", "id": "result_456" }
  ]
}

Emma får push-notifikasjon
    ↓
Emmas forelder (del av gruppen) ser også meldingen
    ↓
Full samtale-tråd med feedback og oppfølgingsspørsmål
```

---

**STEG 7: EMMAS FORELDER SER DATA**
```
Forelder logger inn (rolle: 'parent')
    ↓
GET /api/v1/players?parentId=parent_789
    ↓
Får Emma (siden Emma.parentId = parent_789)
    ↓
Ser:
- Test 4 resultat: 40%
- Trener-feedback
- Progresjonsgraf
- Peer-sammenligning
- Neste test planlagt: Test 5 (Approach 75m) om 2 uker

Kan IKKE endre data, kun se
```

Dette viser hele økosystemet i aksjon!"

---

### 4.9 OPPSUMMERING - DATALAGRING OG DELING

**Slide: Hovedpunkter data**

"La meg oppsummere datalagring og testdata-deling:

**DATALAGRING:**
✅ **PostgreSQL relasjonsdatabase** - robust, skalerbar
✅ **Multi-tenant arkitektur** - fullstendig dataisolasjon
✅ **Strukturert testdata** - JSON for fleksibilitet, relasjoner for integritet
✅ **Peer-sammenligninger lagret** - historisk nøyaktighet
✅ **Full audit trail** - createdAt, updatedAt, changeHistory

**TESTDATA-DELING:**
✅ **Automatisk tilgang** - trenere får tilgang via coachId-relasjon
✅ **Gruppe-kommunikasjon** - ChatGroups for feedback og diskusjon
✅ **Video-integrasjon** - VideoShare for svingteknikk-analyser
✅ **Push-notifikasjoner** - spillere varsles om ny feedback
✅ **Foreldretilgang** - foreldre kan følge med via parentId

**SIKKERHET & PERSONVERN:**
✅ **Tre-lags sikkerhet** - Tenant, Rolle, Relasjon
✅ **JWT autentisering** - token-basert med refresh
✅ **HTTPS/TLS kryptering** - data in transit sikret
✅ **GDPR-compliant** - rett til innsyn, sletting, portabilitet
✅ **Rate limiting** - beskyttelse mot misbruk

**API-ENDEPUNKTER:**
- `/api/v1/tests/` - Test definitions
- `/api/v1/tests/results` - Test results
- `/api/v1/coaches/me/players` - Coach's players
- `/api/v1/peer-comparison` - Benchmarking
- `/api/v1/chat/groups` - Communication

**Dette er et trygt, skalerbart system bygget for norsk golf.**"

---

## AVSLUTNING (5 min)

### OPPSUMMERING

**Slide: Hovedpunkter**

"La meg oppsummere de tre viktigste punktene:

**1. SYSTEMATISK PROGRESJON**
Vi har bygget et system som sikrer at spillere utvikler seg lagvis, fra fundamentalt til automatisert, fra range til turnering. L-faser, M-miljø og PR-press garanterer at overføring skjer metodisk.

**2. DATADREVET BESLUTNING**
Alt logges, alt måles. Trener og spiller kan ta informerte beslutninger basert på faktisk data, ikke magefølelse. Breaking points identifiseres, svakheter adresseres systematisk.

**3. HELHETLIG ÅRSPLANLEGGING**
Årsplangeneratoren tar hensyn til alle aspekter: periodisering, turneringskalender, individuell utvikling, treningsvolum og intensitet. Alt henger sammen i ett system.

**Dette er ikke bare et digitaliseringsprosjekt.**

**Dette er et nytt pedagogisk verktøy for norsk golf.**"

---

### SPØRSMÅL OG DISKUSJON

**Slide: Spørsmål**

"Jeg er klar for spørsmål!

Mulige diskusjonstema:
- Hvordan kan Norges Golfforbund bruke systemet?
- Integrasjon med Team Norway-struktur
- Skalering til klubber over hele landet
- Opplæring av trenere
- Data-deling og personvern
- Videre utvikling"

---

### NESTE STEG

**Slide: Veien videre**

"Forslag til neste steg:

**KORT SIKT (1-3 måneder):**
1. Pilot med 2-3 Team Norway-spillere
2. Tilbakemelding og justering
3. Trener-opplæring

**MEDIUM SIKT (3-6 måneder):**
1. Utrulling til Team Norway-strukturen
2. Pilot med 3-5 utvalgte klubber
3. Utvikle opplæringsmateriell

**LANG SIKT (6-12 måneder):**
1. Nasjonal utrulling
2. Integrasjon med Norges Golfforbunds systemer
3. Kontinuerlig videreutvikling basert på feedback

**Jeg ser frem til å jobbe videre med dette sammen med dere.**"

---

## VEDLEGG: TEKNISKE DETALJER

### A. DATABASE-STRUKTUR

**TrainingSession (komplett modell)**
```typescript
model TrainingSession {
  id: UUID
  playerId: UUID?
  coachId: UUID?

  // Hva og når
  sessionType: VARCHAR(50)
  sessionDate: Timestamptz
  duration: Int

  // AK-formel v2.0
  akFormula: VARCHAR(500)
  learningPhase: VARCHAR(10)    // L-KROPP to L-AUTO
  clubSpeed: VARCHAR(10)         // CS0-CS100
  environment: VARCHAR(2)        // M0-M5
  pressure: VARCHAR(3)           // PR1-PR5
  positionStart: VARCHAR(5)      // P1.0-P10.0
  positionEnd: VARCHAR(5)
  puttingFocus: VARCHAR(10)
  puttingPhases: VARCHAR(10)

  // Evaluering (1-10)
  evaluationFocus: Int?
  evaluationTechnical: Int?
  evaluationEnergy: Int?
  evaluationMental: Int?

  // Pre-shot routine
  preShotConsistency: VARCHAR(20)
  preShotCount: Int?
  totalShots: Int?

  // Status
  completionStatus: VARCHAR(20)
  completedAt: Timestamptz?

  // Notater
  whatWentWell: Text?
  nextSessionFocus: Text?
  mediaUrls: VARCHAR[]
}
```

---

### B. API-ENDEPUNKTER

**Årsplan API:**
```
POST   /coach/annual-plans           Opprett ny plan
GET    /coach/annual-plans/:id       Hent spesifikk plan
GET    /coach/annual-plans/player/:id Hent spillers plan
PUT    /coach/annual-plans/:id       Oppdater plan
DELETE /coach/annual-plans/:id       Slett plan
```

**Kategorier API:**
```
GET    /categories                    Hent alle kategorier (A-K)
GET    /categories/:id                Hent spesifikk kategori
GET    /categories/:id/benchmarks     Hent benchmarks
```

**Trenings-økter API:**
```
POST   /training-sessions            Opprett økt
GET    /training-sessions/:id        Hent økt
PUT    /training-sessions/:id        Oppdater økt
GET    /training-sessions/player/:id Liste økter for spiller
```

**Statistikk API:**
```
GET    /stats/weekly/:playerId/:year/:week    Ukentlig statistikk
GET    /stats/monthly/:playerId/:year/:month  Månedlig statistikk
GET    /stats/season/:playerId/:year          Sesongstatistikk
```

---

### C. KOMPONENTER I KODEBASEN

**Frontend (React):**
```
/apps/web/src/
├── features/
│   ├── coach-annual-plan/
│   │   ├── AnnualPlanGenerator.tsx
│   │   ├── AnnualPlanGeneratorWithDnD.tsx
│   │   └── AnnualPlanGeneratorComplete.tsx
│   ├── calendar/
│   │   └── components/session-planner/
│   │       ├── hooks/useAKFormula.ts      (KJERNE)
│   │       └── steps/LPhaseStep.tsx
│   ├── trening-plan/
│   │   ├── LoggTreningContainer.jsx
│   │   └── treningsdagbok/
│   └── knowledge/
│       └── TrainingCategorySystemPage.tsx
├── components/shadcn/golf/
│   └── training-category-badge.tsx
├── config/
│   └── category-sg-benchmarks.ts
├── constants/
│   └── terminology.ts
└── services/
    ├── api.js
    ├── annualPlanApi.ts
    └── sessionsAPI.js

**Backend (Node.js + Express):**
```
/apps/api/
├── src/
│   ├── api/v1/
│   │   ├── annual-plans/
│   │   ├── training-sessions/
│   │   ├── periodization/
│   │   └── categories/
│   ├── domain/
│   │   ├── annual-planning/
│   │   └── training/
│   └── integrations/
│       ├── golf-genius/
│       └── trackman/
└── prisma/
    ├── schema.prisma
    └── seeds/
        └── category-requirements.ts
```

---

### D. NØKKELKONSTANTER

**L-faser:**
```typescript
const L_PHASES = {
  'L-KROPP': { label: 'Kropp', cs: null },
  'L-ARM':   { label: 'Arm', cs: null },
  'L-KØLLE': { label: 'Kølle', cs: [20, 40] },
  'L-BALL':  { label: 'Ball', cs: [40, 60] },
  'L-AUTO':  { label: 'Auto', cs: [70, 100] }
}
```

**CS-nivåer:**
```typescript
const CS_LEVELS = [0, 20, 30, 40, 50, 60, 70, 80, 90, 100]
```

**M-miljø:**
```typescript
const ENVIRONMENTS = {
  'M0': 'Off-course',
  'M1': 'Innendørs',
  'M2': 'Range',
  'M3': 'Øvingsfelt',
  'M4': 'Bane trening',
  'M5': 'Bane turnering'
}
```

**PR-press:**
```typescript
const PRESSURE_LEVELS = {
  'PR1': 'Ingen',
  'PR2': 'Selvmonitorering',
  'PR3': 'Sosial',
  'PR4': 'Konkurranse',
  'PR5': 'Turnering'
}
```

---

## SLUTT PÅ PRESENTASJONSSKRIPT

**Totalt estimert tid:** 45-50 minutter + Q&A

**Anbefalinger for presentasjon:**
- Bruk live-demo av systemet hvis mulig
- Ha screenshots klare som backup
- Print ut formel-eksempler for å dele ut
- Vis faktiske trenings-logger fra systemet
- Ha en test-bruker tilgjengelig for demonstrasjon

**Lykke til med presentasjonen! 🏌️⛳🏆**
