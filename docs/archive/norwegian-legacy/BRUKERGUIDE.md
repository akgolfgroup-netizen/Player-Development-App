# AK Golf Academy - Komplett Brukerguide

> Detaljert forklaring av alle skjermer, knapper og funksjoner

---

# DEL 1: SPILLER-APPEN

## Innlogging

### Innloggingsskjermen

**Hva du ser:**
- AK Golf logo oppe
- E-post felt
- Passord felt
- "Logg inn" knapp (bla)
- "Glemt passord?" lenke

**Hva skjer nar du:**

| Handling | Resultat |
|----------|----------|
| Skriver e-post og passord, trykker "Logg inn" | Spinner vises, du sendes til Dashboard |
| Skriver feil passord | Rod feilmelding: "Feil e-post eller passord" |
| Trykker "Glemt passord?" | Popup apnes der du skriver e-post, far tilsendt lenke |

---

## Navigasjon (Venstre Meny)

Nar du er logget inn ser du en meny pa venstre side:

```
+---------------------------+
| [AK Logo]                 |
+---------------------------+
| > Dashboard               |
| v Min Utvikling          |
|   - Oversikt             |
|   - Breaking Points      |
|   - Kategori-fremgang    |
| v Trening                |
|   - Dagens plan          |
|   - Ukens plan           |
|   - Treningsdagbok       |
|   - Logg trening         |
| v Kalender               |
| v Testing                |
| v Turneringer            |
| v Kommunikasjon (3)      |
| v Mal og fremgang        |
| v Innstillinger          |
+---------------------------+
| [Ditt navn]              |
| [din@epost.no]           |
| [Logg ut]                |
+---------------------------+
```

**Hva skjer nar du:**

| Handling | Resultat |
|----------|----------|
| Trykker pa et menypunkt med pil (>) | Undermenyen utvides og viser flere valg |
| Trykker pa "Dashboard" | Du sendes til hovedoversikten |
| Trykker pa "Logg ut" | Du logges ut og sendes til innloggingssiden |

---

## Dashboard (Hovedoversikt)

**Nar du apner appen ser du:**

```
+----------------------------------------+
| Velkommen, [Ditt navn]!                |
| Kategori: D | Handicap: 12.4           |
+----------------------------------------+
|                                        |
| DAGENS PLAN                            |
| +------------------------------------+ |
| | Morgen: Putting-ovelser (30 min)   | |
| | Ettermiddag: Driving range (60 min)| |
| | Kveld: Refleksjon og journalforing | |
| +------------------------------------+ |
|                                        |
| STATISTIKK DENNE UKEN                  |
| +--------+ +--------+ +--------+       |
| | 85%    | | 7      | | 4.5t   |       |
| | Fullf. | | Streak | | Trening|       |
| +--------+ +--------+ +--------+       |
|                                        |
| [Logg trening] [Registrer test] [Book] |
+----------------------------------------+
```

**Hva de forskjellige elementene viser:**

| Element | Forklaring |
|---------|------------|
| Kategori | Din navaerende spillerkategori (A-K) |
| Handicap | Ditt offisielle handicap |
| Dagens plan | Hva du skal gjore i dag |
| 85% Fullfort | Hvor mange okter du har fullfort av planlagte |
| 7 Streak | Antall dager pa rad du har trent |
| 4.5t Trening | Totale treningstimer denne uken |

**Hva skjer nar du trykker:**

| Knapp | Resultat |
|-------|----------|
| "Logg trening" | Apner skjema for a registrere en okt |
| "Registrer test" | Apner testregistrering |
| "Book trener" | Apner booking-kalenderen |

---

## Logg Treningsokt

### Steg 1: Velg type trening

**Hva du ser:**

```
+----------------------------------------+
| NY TRENINGSOKT                         |
+----------------------------------------+
| Velg type:                             |
|                                        |
| [Driving]  [Putting]  [Chipping]       |
| [Pitching] [Bunker]   [Banespill]      |
| [Fysisk]   [Mental]                    |
|                                        |
| Dato: [15. des 2025]  Tid: [14:00]     |
|                                        |
|              [Neste ->]                |
+----------------------------------------+
```

**Hva skjer nar du:**

| Handling | Resultat |
|----------|----------|
| Trykker pa en type (f.eks "Putting") | Boksen blir bla, typen er valgt |
| Velger dato | Kalender apnes, du velger dato |
| Trykker "Neste" | Gar til steg 2 |

### Steg 2: Detaljer

**Hva du ser:**

```
+----------------------------------------+
| TRENINGSDETALJER                       |
+----------------------------------------+
| Varighet:                              |
| ( ) 15 min  ( ) 30 min  (x) 60 min     |
| ( ) 90 min  ( ) 120 min                |
|                                        |
| Laringsfase:                           |
| [L1 Ball] [L2 Teknikk] [L3 Transfer]   |
| [L4 Variasjon] [L5 Spill]              |
|                                        |
| Periode:                               |
| [E Etablering] [G Grunn] [S Spesifikk] |
|                                        |
| Intensitet: [----o--------] 40%        |
|                                        |
| Fokusomrade: [___________________]     |
|                                        |
| Notater:                               |
| [                                   ]  |
| [                                   ]  |
|                                        |
| [Avbryt]            [Opprett okt]      |
+----------------------------------------+
```

**Forklaring av feltene:**

| Felt | Hva det betyr |
|------|---------------|
| Varighet | Hvor lenge okten skal vare |
| Laringsfase L1-L5 | Hvilken type laering du fokuserer pa |
| L1 Ball | Fokus pa ballkontakt |
| L2 Teknikk | Teknisk trening |
| L3 Transfer | Overfore teknikk til spill |
| L4 Variasjon | Variert trening |
| L5 Spill | Spillsituasjoner |
| Periode E/G/S/T | Hvilken treningsperiode du er i |
| Intensitet | Hvor hardt du skal trene (0-100%) |

**Hva skjer nar du trykker:**

| Knapp | Resultat |
|-------|----------|
| "Avbryt" | Gar tilbake, ingenting lagres |
| "Opprett okt" | Okten lagres, du ser bekreftelse |

---

## Kalender

### Ukesvisning

**Hva du ser:**

```
+----------------------------------------+
| < Uke 51, 2025 >                       |
| [Dag] [Uke] [Maned] [Ar]               |
+----------------------------------------+
|     Man  Tir  Ons  Tor  Fre  Lor  Son  |
|     16   17   18   19   20   21   22   |
+----------------------------------------+
| 09  |    |[Put]|    |    |    |    |   |
| 10  |[Drv]|    |    |    |    |    |   |
| 11  |    |    |[Fys]|    |    |    |   |
| 12  |    |    |    |    |    |    |   |
| ... |    |    |    |    |    |    |   |
+----------------------------------------+
|              [+ Ny okt]                |
+----------------------------------------+

[Drv] = Driving okt (bla boks)
[Put] = Putting okt (gronn boks)
[Fys] = Fysisk okt (oransje boks)
```

**Hva skjer nar du:**

| Handling | Resultat |
|----------|----------|
| Trykker "<" | Gar til forrige uke |
| Trykker ">" | Gar til neste uke |
| Trykker "Maned" | Bytter til manedsvisning |
| Trykker pa en okt (f.eks [Drv]) | Apner oktdetaljer |
| Trykker "+ Ny okt" | Apner "Logg treningsokt" |
| Trykker pa et tomt felt | Apner "Ny okt" med dato fylt ut |

---

## Testprotokoll

### Testoversikt

**Hva du ser:**

```
+----------------------------------------+
| MINE TESTER                            |
+----------------------------------------+
| Driver Distance          | Neste: 20/12|
| [================] 85%   | Bestatt     |
+----------------------------------------+
| Driver Accuracy          | Neste: 20/12|
| [=========       ] 60%   | Ikke bestatt|
+----------------------------------------+
| Approach 100m            | Sist: 15/11 |
| [================] 92%   | Bestatt     |
+----------------------------------------+
| Putting 2m               | Sist: 15/11 |
| [=============   ] 78%   | Bestatt     |
+----------------------------------------+
|                                        |
|         [Registrer ny test]            |
+----------------------------------------+
```

**Hva fargekodene betyr:**

| Farge | Betydning |
|-------|-----------|
| Gronn | Testen er bestatt |
| Rod | Testen er ikke bestatt |
| Gul | Testen er snart pafrist |
| Gra | Testen er ikke utfort enna |

**Hva skjer nar du:**

| Handling | Resultat |
|----------|----------|
| Trykker pa en test | Apner testdetaljer med historikk |
| Trykker "Registrer ny test" | Apner testregistreringsskjema |

### Registrer Testresultat

**Hva du ser:**

```
+----------------------------------------+
| REGISTRER TESTRESULTAT                 |
+----------------------------------------+
| Velg test:                             |
| [Driver Distance        v]             |
|                                        |
| Dato: [18. des 2025]                   |
|                                        |
| Resultat:                              |
| Avstand: [245] meter                   |
| Presisjon: [72] %                      |
|                                        |
| Video-bevis (valgfritt):               |
| [Last opp video]                       |
|                                        |
| Notater:                               |
| [God dag, lite vind              ]     |
|                                        |
| [Avbryt]           [Registrer]         |
+----------------------------------------+
```

**Hva skjer etter registrering:**

1. Systemet beregner automatisk om du bestod
2. Sammenligner med kategorikrav
3. Viser fremgang fra forrige test
4. Oppdaterer statistikken din

---

## Meldinger

### Meldingsoversikt

**Hva du ser:**

```
+----------------------------------------+
| MELDINGER                              |
| [Sok...]                               |
+----------------------------------------+
| +------------------------------------+ |
| | [AT] Anders Trener         2t     | |
| | "Hei, husk a gjore..."    (ulest) | |
| +------------------------------------+ |
| | [MH] Maria Hansen          1d     | |
| | "Takk for okten i gar..."         | |
| +------------------------------------+ |
| | [System]                   3d     | |
| | "Du har oppnadd ny badge!"        | |
| +------------------------------------+ |
|                                        |
|            [+ Ny melding]              |
+----------------------------------------+
```

**Hva skjer nar du:**

| Handling | Resultat |
|----------|----------|
| Trykker pa en melding | Apner samtalen |
| Trykker "+ Ny melding" | Apner skrivevindu |
| Skriver i sokefelt | Filtrerer meldinger |

### Inne i en samtale

**Hva du ser:**

```
+----------------------------------------+
| < Anders Trener                        |
+----------------------------------------+
|                                        |
|        [Hei! Hvordan gikk okten?]      |
|                             14:32      |
|                                        |
| [Det gikk bra! Jobbet med           ]  |
| [putting som du foreslo.            ]  |
|                             14:45      |
|                                        |
|        [Flott! Send gjerne video    ]  |
|        [sa kan jeg gi tilbakemelding]  |
|                             15:02      |
|                                        |
+----------------------------------------+
| [Skriv melding...          ] [Send]    |
+----------------------------------------+
```

---

## Min Profil

### Profilsiden

**Hva du ser:**

```
+----------------------------------------+
| MIN PROFIL                             |
+----------------------------------------+
| +------+                               |
| | FOTO |  Ola Nordmann                 |
| +------+  ola@email.no                 |
|           Kategori: D                  |
|           Handicap: 12.4               |
+----------------------------------------+
| PERSONLIG INFORMASJON                  |
| Fornavn: [Ola            ]             |
| Etternavn: [Nordmann     ]             |
| Fodselsdato: [15.03.2008 ]             |
|                         [Lagre]        |
+----------------------------------------+
| FYSISKE DATA                           |
| Hoyde: [175] cm                        |
| Vekt: [68] kg                          |
|                         [Oppdater]     |
+----------------------------------------+
| NODKONTAKT                             |
| Navn: [Kari Nordmann     ]             |
| Telefon: [+47 123 45 678 ]             |
|                         [Lagre]        |
+----------------------------------------+
```

---

## Mal og Fremgang

### Maloversikt

**Hva du ser:**

```
+----------------------------------------+
| MINE MAL                               |
+----------------------------------------+
| +------------------------------------+ |
| | Forbedre putting                   | |
| | Mal: 90% pa 2m                     | |
| | Na: 78%                            | |
| | [=============   ] 87%             | |
| | Frist: 31. januar 2026             | |
| |                    [Rediger] [X]   | |
| +------------------------------------+ |
| +------------------------------------+ |
| | Kategori C                         | |
| | Na: Kategori D                     | |
| | [========        ] 45%             | |
| | Frist: 1. juni 2026                | |
| +------------------------------------+ |
|                                        |
|            [+ Nytt mal]                |
+----------------------------------------+
```

**Hva skjer nar du:**

| Handling | Resultat |
|----------|----------|
| Trykker "+ Nytt mal" | Apner skjema for a lage nytt mal |
| Trykker "Rediger" | Apner malet for redigering |
| Trykker "X" | Spor om du vil slette malet |

---

# DEL 2: TRENER-APPEN

## Trener-Dashboard

**Nar du logger inn som trener ser du:**

```
+----------------------------------------+
| TRENER-OVERSIKT                        |
| Anders Kristiansen                     |
+----------------------------------------+
|                                        |
| MINE SPILLERE (12 aktive)              |
| +------------------------------------+ |
| | [AB] Berg, Anna         Kat: C    | |
| | [CD] Dahl, Christian    Kat: D    | |
| | [EF] Eriksen, Emma      Kat: E    | |
| | [GH] Hansen, Gustav     Kat: D    | |
| | ...                                | |
| +------------------------------------+ |
|                                        |
| VENTENDE ELEMENTER (3)                 |
| +------------------------------------+ |
| | [Video] Anna Berg - Ny video       | |
| |         lastet opp (2 timer siden) | |
| +------------------------------------+ |
| | [Notat] Christian Dahl - Onsker    | |
| |         tilbakemelding (1 dag)     | |
| +------------------------------------+ |
|                                        |
| HURTIGVALG                             |
| [Spillere] [Kalender] [Planer]         |
| [Meldinger] [Stats] [Turneringer]      |
+----------------------------------------+
```

**Hva skjer nar du:**

| Handling | Resultat |
|----------|----------|
| Trykker pa en spiller | Apner spillerens detaljside |
| Trykker pa "Ventende element" | Gar til det spesifikke elementet |
| Trykker "Spillere" | Gar til full spillerliste |

---

## Spilleradministrasjon

### Spillerliste

**Hva du ser:**

```
+----------------------------------------+
| MINE SPILLERE                          |
| [Sok etter spiller...]                 |
+----------------------------------------+
| Navn              | Kat | Sist aktiv   |
+----------------------------------------+
| Berg, Anna        |  C  | I dag        |
| Dahl, Christian   |  D  | I gar        |
| Eriksen, Emma     |  E  | 3 dager      |
| Hansen, Gustav    |  D  | I dag        |
| Iversen, Ida      |  F  | 1 uke        |
| ...               |     |              |
+----------------------------------------+
```

**Hva skjer nar du:**

| Handling | Resultat |
|----------|----------|
| Trykker pa en rad | Apner spillerens detaljside |
| Skriver i sokefelt | Filtrerer listen |
| Trykker pa kolonneoverskrift | Sorterer listen |

### Spillerdetaljer

**Nar du trykker pa en spiller ser du:**

```
+----------------------------------------+
| < Tilbake                              |
+----------------------------------------+
| +------+                               |
| | FOTO |  Anna Berg                    |
| +------+  anna@email.no                |
|           Kategori: C | HCP: 8.2       |
+----------------------------------------+
| [Oversikt] [Treningsplan] [Notater]    |
+----------------------------------------+
|                                        |
| SISTE OKTER                            |
| - 18/12: Putting (60 min) - Fullfort   |
| - 17/12: Driving (45 min) - Fullfort   |
| - 15/12: Fysisk (30 min) - Hoppet over |
|                                        |
| SISTE TESTRESULTATER                   |
| - Driver: 92% (bestatt)                |
| - Putting 2m: 85% (bestatt)            |
| - Approach 100m: 78% (ikke bestatt)    |
|                                        |
| BREAKING POINTS                        |
| ! Approach presisjon (Hoy prioritet)   |
| ! Bunkerslag (Medium prioritet)        |
|                                        |
| [Rediger plan] [Skriv notat] [Melding] |
+----------------------------------------+
```

**Hva fanene viser:**

| Fane | Innhold |
|------|---------|
| Oversikt | Sammendrag av alt |
| Treningsplan | Spillerens arsplan |
| Notater | Dine notater om spilleren |

---

## Booking-kalender (Trener)

### Kalendervisning

**Hva du ser:**

```
+----------------------------------------+
| BOOKING-KALENDER          [Innstillinger]
| < Uke 51, 2025 >                       |
+----------------------------------------+
|     Man  Tir  Ons  Tor  Fre  Lor  Son  |
+----------------------------------------+
| 09  |Ledig|Anna|Ledig|    |    |    |  |
| 10  |Chris|    |Emma |    |    |    |  |
| 11  |Ledig|Ledig|    |    |    |    |  |
| 12  | --- | --- | --- | --- | --- |   |
| 13  |Ledig|Gust |Ledig|    |    |    |  |
| ... |     |     |     |     |     |   |
+----------------------------------------+

Ledig = Gronn boks, kan bookes
Anna = Bla boks, booket av Anna Berg
--- = Gra, blokkert/ikke tilgjengelig
```

**Hva skjer nar du:**

| Handling | Resultat |
|----------|----------|
| Trykker pa "Ledig" | Apner for a manuelt booke |
| Trykker pa en booking (f.eks "Anna") | Viser bookingdetaljer |
| Trykker "Innstillinger" | Gar til tilgjengelighetsinnstillinger |

### Booking-foresporsler

**Hva du ser:**

```
+----------------------------------------+
| VENTENDE FORESPORSLER (3)              |
+----------------------------------------+
| +------------------------------------+ |
| | Anna Berg                          | |
| | Onsker: Torsdag 19/12 kl 10:00     | |
| | Type: Individuell okt (60 min)     | |
| | Melding: "Onsker fokus pa putting" | |
| | Sendt: 2 timer siden               | |
| |                                    | |
| |         [Godta]  [Avslå]           | |
| +------------------------------------+ |
| +------------------------------------+ |
| | Christian Dahl                     | |
| | ...                                | |
| +------------------------------------+ |
+----------------------------------------+
```

**Hva skjer nar du:**

| Knapp | Resultat |
|-------|----------|
| "Godta" | Bookingen bekreftes, spilleren far varsel |
| "Avsla" | Du kan skrive begrunnelse, spilleren far varsel |

---

## Treningsplanlegger

### Velg spiller

**Hva du ser:**

```
+----------------------------------------+
| TRENINGSPLANLEGGER                     |
+----------------------------------------+
| Hvem skal du planlegge for?            |
|                                        |
| ( ) Enkelt spiller                     |
| ( ) Gruppe                             |
|                                        |
| [Sok etter spiller...]                 |
|                                        |
| Forslag:                               |
| [Anna Berg] [Christian Dahl] [Emma E.] |
|                                        |
|              [Neste ->]                |
+----------------------------------------+
```

### Rediger treningsplan

**Hva du ser:**

```
+----------------------------------------+
| TRENINGSPLAN FOR ANNA BERG             |
+----------------------------------------+
| Plannavn: [Varsesong 2026        ]     |
| Periode: [01.01.2026] - [30.06.2026]   |
+----------------------------------------+
| PERIODISERING                          |
|                                        |
| Uke 1-4:   [E - Etablering    v]       |
| Uke 5-10:  [G - Grunnfase     v]       |
| Uke 11-18: [S - Spesifikk     v]       |
| Uke 19-24: [T - Turnering     v]       |
|                                        |
| [+ Legg til periode]                   |
+----------------------------------------+
| UKENTLIG MAL                           |
| Okter per uke: [5]                     |
| Timer per uke: [8]                     |
+----------------------------------------+
|                                        |
| [Avbryt]  [Lagre utkast]  [Publiser]   |
+----------------------------------------+
```

**Hva knappene gjor:**

| Knapp | Resultat |
|-------|----------|
| "Lagre utkast" | Lagrer uten a sende til spilleren |
| "Publiser" | Lagrer OG sender til spilleren |
| "+ Legg til periode" | Legger til ny treningsperiode |

---

## Meldinger (Trener)

### Skriv ny melding

**Hva du ser:**

```
+----------------------------------------+
| NY MELDING                             |
+----------------------------------------+
| Til:                                   |
| [Sok etter mottaker...]                |
| Valgt: [Anna Berg X] [Christian D. X]  |
|                                        |
| Emne (valgfritt):                      |
| [Treningsfokus denne uken         ]    |
|                                        |
| Melding:                               |
| +------------------------------------+ |
| | Hei!                               | |
| |                                    | |
| | Denne uken skal vi fokusere pa...  | |
| |                                    | |
| +------------------------------------+ |
|                                        |
| [ ] Send na                            |
| [x] Planlegg sending: [20/12] [08:00]  |
|                                        |
|            [Avbryt]  [Send/Planlegg]   |
+----------------------------------------+
```

---

## Statistikk og Analyse

### Spilleroversikt

**Hva du ser:**

```
+----------------------------------------+
| STATISTIKK                             |
| [Velg spiller: Anna Berg      v]       |
| [Periode: Siste 3 maneder     v]       |
+----------------------------------------+
|                                        |
| TRENINGSOVERSIKT                       |
| +------------------------------------+ |
| |     ^                              | |
| |    /|\    Okter per uke            | |
| |   / | \                            | |
| |  /  |  \_____                      | |
| | /   |       \                      | |
| +----+----+----+----+----+----+----> | |
| | U1 | U2 | U3 | U4 | U5 | U6 |      | |
| +------------------------------------+ |
|                                        |
| TESTFREMGANG                           |
| Driver:     [================] 92%     |
| Putting 2m: [=============   ] 78%     |
| Approach:   [=========       ] 65%     |
|                                        |
| BREAKING POINTS                        |
| - Approach presisjon (aktiv)           |
| - Bunkerslag (lost 15/12)              |
+----------------------------------------+
```

---

## Ovelsesbibliotek (Trener)

### Bla i ovelser

**Hva du ser:**

```
+----------------------------------------+
| OVELSESBANK                            |
| [Sok...]                               |
| Filter: [Alle typer v] [Alle faser v]  |
+----------------------------------------+
| +----------+ +----------+ +----------+ |
| |  [Bilde] | |  [Bilde] | |  [Bilde] | |
| | Gate     | | Klokke   | | Ladder   | |
| | Drill    | | Drill    | | Drill    | |
| | Putting  | | Putting  | | Footwork | |
| | L2       | | L3       | | L1       | |
| | [Se] [+] | | [Se] [+] | | [Se] [+] | |
| +----------+ +----------+ +----------+ |
| +----------+ +----------+ +----------+ |
| | ...      | | ...      | | ...      | |
+----------------------------------------+
```

**Hva knappene gjor:**

| Knapp | Resultat |
|-------|----------|
| "Se" | Apner full ovelsesbeskrivelse |
| "+" | Legger ovelsen til i plan/mal |

---

## Varsler og Intelligens

### Varseloversikt

**Hva du ser:**

```
+----------------------------------------+
| VARSLER                      [3 nye]   |
+----------------------------------------+
| +------------------------------------+ |
| | ! HOY PRIORITET                    | |
| | Anna Berg - Rapporterer lite sovn  | |
| | "Sov kun 4 timer siste natt"       | |
| | 2 timer siden                      | |
| |        [Se spiller] [Marker lost]  | |
| +------------------------------------+ |
| +------------------------------------+ |
| | * MEDIUM                           | |
| | Christian Dahl - 5 dager siden     | |
| | siste trening                      | |
| |        [Se spiller] [Send melding] | |
| +------------------------------------+ |
| +------------------------------------+ |
| | i INFO                             | |
| | Emma Eriksen - Ny video lastet opp | |
| |        [Se video]                  | |
| +------------------------------------+ |
+----------------------------------------+
```

**Varseltypene:**

| Ikon | Type | Eksempel |
|------|------|----------|
| ! | Hoy prioritet | Skade, lite sovn, sykdom |
| * | Medium | Inaktivitet, missed okter |
| i | Info | Nye videoer, fullforte mal |

---

# DEL 3: ADMIN-PANELET

## Admin-Dashboard

**Hva du ser:**

```
+----------------------------------------+
| SYSTEMSTATUS                           |
+----------------------------------------+
| Brukere totalt: 156                    |
| Trenere: 12 | Spillere: 144            |
|                                        |
| SYSTEMHELSE                            |
| Database:     [OK]  (15ms)             |
| API:          [OK]  (45ms)             |
| E-post:       [OK]                     |
| Lagring:      85% brukt                |
|                                        |
| AKTIVITET SISTE 24T                    |
| - 234 innlogginger                     |
| - 89 nye okter registrert              |
| - 12 tester fullfort                   |
| - 3 nye brukere                        |
+----------------------------------------+
```

---

# DESIGN-REFERANSE

## Farger

| Farge | Hex | Bruk |
|-------|-----|------|
| Primar bla | #10456A | Knapper, lenker |
| Suksess gronn | #4A7C59 | Bekreftelser, bestatt |
| Advarsel gul | #D4A84B | Varsler |
| Feil rod | #C45B4E | Feil, ikke bestatt |
| Bakgrunn | #EDF0F2 | Sidebakgrunn |
| Tekst | #1C1C1E | Hovedtekst |

## Knappestiler

| Type | Utseende | Bruk |
|------|----------|------|
| Primar | Bla bakgrunn, hvit tekst | Hovedhandlinger |
| Sekundar | Hvit bakgrunn, bla tekst | Alternative handlinger |
| Fare | Rod bakgrunn, hvit tekst | Sletting, avbryt |

---

**Sist oppdatert**: Desember 2025
