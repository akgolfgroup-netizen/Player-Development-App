# IUP Golf Academy - Komplett Funksjonsoversikt

## Innholdsfortegnelse
1. [Plattformoversikt](#plattformoversikt)
2. [Spillerfunksjoner](#spillerfunksjoner)
3. [Trenerfunksjoner](#trenerfunksjoner)
4. [Adminfunksjoner](#adminfunksjoner)
5. [Integrasjoner](#integrasjoner)
6. [Gamification](#gamification)

---

## Plattformoversikt

### Nøkkeltall
| Metrikk | Antall |
|---------|--------|
| API Endepunkter | 42+ |
| Database Modeller | 75+ |
| Frontend Moduler | 79 |
| Custom Hooks | 25+ |
| Integrasjoner | 4 |

### Brukerroller
| Rolle | Beskrivelse |
|-------|-------------|
| **Spiller** | Junior golfspiller som trener og utvikler seg |
| **Trener** | Coach som følger opp spillere |
| **Forelder** | Foresatt med innsyn (kommer) |
| **Admin** | Systemadministrator |

---

## Spillerfunksjoner

### 1. Dashboard
**Lokasjon:** `/dashboard`

| Funksjon | Beskrivelse |
|----------|-------------|
| Ukeoversikt | Treningsminutter, mål, fremgang |
| Quick Stats | Streak, Strokes Gained, ukemål |
| Siste tester | Nylige testresultater med trender |
| Kommende økter | Planlagte treninger og turneringer |
| Badges | Nylig opptjente badges |
| Værvarsel | Treningsforhold for i dag |

### 2. Treningsplanlegging

#### 2.1 Årsplan
**Lokasjon:** `/aarsplan`

| Funksjon | Beskrivelse |
|----------|-------------|
| 12-måneders plan | Automatisk generert basert på nivå |
| Periodisering | E/G/S/T-faser (Ettertrening, Generell, Spesifikk, Turnering) |
| Ukemål | Timer per uke, fokusområder |
| Turneringsintegrasjon | Turneringer innarbeidet i plan |

#### 2.2 Ukesplan
**Lokasjon:** `/ukeplan`

| Funksjon | Beskrivelse |
|----------|-------------|
| Daglig oversikt | Hva skal trenes hver dag |
| Øvelsesforslag | Anbefalte øvelser basert på fokus |
| Fleksibilitet | Kan flytte økter mellom dager |

#### 2.3 Treningsdagbok
**Lokasjon:** `/treningsdagbok`

| Funksjon | Beskrivelse |
|----------|-------------|
| Logg økt | Registrer gjennomført trening |
| Varighet | Tid brukt på trening |
| Øvelser | Hvilke øvelser ble gjort |
| Notater | Egne refleksjoner |
| Evaluering | Selvvurdering av økten |

### 3. Testing & Evaluering

#### 3.1 Testprotokoller
**Lokasjon:** `/tester`

**20 standardiserte tester:**

| Kategori | Tester |
|----------|--------|
| **Distanse** | Driver, 3-wood, 5-wood, 3-iron, 5-iron, 7-iron, 9-iron |
| **Approach** | Pitching (10-50m), Chipping |
| **Short Game** | Sand play, Precision, Up & Down |
| **Putting** | Distance control, Direction, Short putts |
| **On-Course** | 9-hull score, 18-hull score |
| **Fysisk** | Fleksibilitet, Styrke, Utholdenhet |

#### 3.2 Testresultater
**Lokasjon:** `/testresultater`

| Funksjon | Beskrivelse |
|----------|-------------|
| Historikk | Alle gjennomførte tester |
| Trender | Graf over utvikling |
| Kategori-krav | Hva kreves for neste kategori |
| Sammenligning | Mot egen baseline |

#### 3.3 Automatisk Beregning
| Funksjon | Beskrivelse |
|----------|-------------|
| Score kalkulering | Automatisk basert på input |
| Kategori-sjekk | Sjekker mot krav for A1/A2/B/C/D |
| Peer percentil | Hvor du ligger vs jevnaldrende |

### 4. Prestasjonsanalyse

#### 4.1 Statistikk
**Lokasjon:** `/statistikk`

| Funksjon | Beskrivelse |
|----------|-------------|
| Strokes Gained | OTT, Approach, Around-the-green, Putting |
| Trender | Utvikling over tid |
| Styrker/svakheter | Automatisk identifisert |
| Tour-sammenligning | Sammenlign med proffene (DataGolf) |

#### 4.2 Breaking Points
**Lokasjon:** `/breaking-points`

| Funksjon | Beskrivelse |
|----------|-------------|
| Gap-analyse | Identifiserer prestasjonsgap |
| Prioritering | Hva bør fokuseres på |
| Handlingsplan | Forslag til forbedring |
| Status-tracking | In Progress / Completed |

#### 4.3 Skill DNA
**Lokasjon:** `/player-insights`

| Funksjon | Beskrivelse |
|----------|-------------|
| Styrke-profil | Visualisering av ferdigheter |
| Sammenligningsgrunnlag | Mot kategori-standard |
| Utviklingspotensial | Hvor er gevinsten størst |

#### 4.4 Peer Comparison
**Lokasjon:** `/peer-comparison`

| Funksjon | Beskrivelse |
|----------|-------------|
| Kategori-sammenligning | Mot andre i samme kategori |
| Aldersgruppe | Mot jevnaldrende |
| Percentil | Din ranking i gruppen |

### 5. Video-analyse

#### 5.1 Videobibliotek
**Lokasjon:** `/videoer`

| Funksjon | Beskrivelse |
|----------|-------------|
| Opplasting | Last opp swing-video |
| Organisering | Kategorisering etter type |
| Søk | Finn video etter dato/type |
| Deling | Del med trener |

#### 5.2 Annotasjoner
| Funksjon | Beskrivelse |
|----------|-------------|
| Tegne-verktøy | Linjer, sirkler, piler |
| Markører | Tidspunkt-markering |
| Lydnotater | Spill inn kommentar |
| Tekst | Skriftlige notater |

#### 5.3 Sammenligning
**Lokasjon:** `/video-sammenligning`

| Funksjon | Beskrivelse |
|----------|-------------|
| Side-by-side | To videoer ved siden av hverandre |
| Synkronisering | Automatisk sync av timing |
| Før/etter | Se utvikling over tid |

#### 5.4 Progress Timeline
**Lokasjon:** `/video-progress`

| Funksjon | Beskrivelse |
|----------|-------------|
| Tidslinje | Alle videoer kronologisk |
| Milepæler | Markerte forbedringer |
| Eksport | Last ned samling |

### 6. Kalender & Booking

#### 6.1 Kalender
**Lokasjon:** `/kalender`

| Funksjon | Beskrivelse |
|----------|-------------|
| Månedsoversikt | Se hele måneden |
| Ukeoversikt | Detaljert ukevisning |
| Dagsvisning | Time-for-time |
| Hendelsestyper | Trening, test, turnering, møte |

#### 6.2 Book Trener
**Lokasjon:** `/book-trener`

| Funksjon | Beskrivelse |
|----------|-------------|
| Tilgjengelighet | Se ledige tider |
| Booking | Velg ønsket tid |
| Bekreftelse | Automatisk bekreftelse |
| Avbestilling | Kanseller booking |

#### 6.3 Google Calendar Sync
| Funksjon | Beskrivelse |
|----------|-------------|
| To-veis sync | Synkroniserer begge veier |
| Automatisk | Skjer i bakgrunnen |
| Påminnelser | Push-varsler |

### 7. Mål & Fremgang

#### 7.1 Målsetting
**Lokasjon:** `/maal`

| Funksjon | Beskrivelse |
|----------|-------------|
| Kortsiktige mål | Ukentlige/månedlige |
| Langsiktige mål | Sesong/årsmål |
| SMART-mål | Spesifikke, målbare mål |
| Progress-tracking | Hvor langt har du kommet |

#### 7.2 Fremgangsoversikt
**Lokasjon:** `/fremgang`

| Funksjon | Beskrivelse |
|----------|-------------|
| Visualisering | Grafer og diagrammer |
| Milepæler | Oppnådde mål |
| Trender | Retning over tid |

### 8. Kommunikasjon

#### 8.1 Meldinger
**Lokasjon:** `/meldinger`

| Funksjon | Beskrivelse |
|----------|-------------|
| Direct messages | Chat med trener |
| Varsler | Push-notifikasjoner |
| Historikk | Se tidligere samtaler |

#### 8.2 Notater
**Lokasjon:** `/notater`

| Funksjon | Beskrivelse |
|----------|-------------|
| Egne notater | Private refleksjoner |
| Trener-notater | Delt med trener |
| Kategorisering | Organiser etter tema |

### 9. Turneringer

#### 9.1 Turneringskalender
**Lokasjon:** `/turneringer`

| Funksjon | Beskrivelse |
|----------|-------------|
| Kommende | Planlagte turneringer |
| Påmelding | Meld deg på |
| Mine turneringer | Dine påmeldinger |

#### 9.2 Resultater
| Funksjon | Beskrivelse |
|----------|-------------|
| GolfBox-import | Automatisk resultatimport |
| Historikk | Tidligere resultater |
| Statistikk | Turneringsstatistikk |
| WAGR | World Amateur Golf Ranking |

---

## Trenerfunksjoner

### 1. Trener Dashboard
**Lokasjon:** `/trener/dashboard`

| Funksjon | Beskrivelse |
|----------|-------------|
| Spilleroversikt | Alle spillere i en visning |
| Quick stats | Aggregert teamstatistikk |
| Varsler | Spillere som trenger oppfølging |
| Kalender | Dagens økter |

### 2. Spilleradministrasjon

#### 2.1 Spillerliste
**Lokasjon:** `/trener/spillere`

| Funksjon | Beskrivelse |
|----------|-------------|
| Liste | Alle tilknyttede spillere |
| Søk & filter | Finn spiller raskt |
| Status-oversikt | Aktiv, inaktiv, etc. |
| Bulk-handlinger | Flere spillere samtidig |

#### 2.2 Spillerdetaljer
**Lokasjon:** `/trener/spiller/:id`

| Funksjon | Beskrivelse |
|----------|-------------|
| Profil | All spillerinformasjon |
| Treningshistorikk | Gjennomførte økter |
| Testresultater | Alle tester |
| Breaking points | Identifiserte gap |
| Videoer | Spillerens videoer |
| Notater | Trenerens notater |

### 3. Treningsplanlegging (Trener)

#### 3.1 Plan-generering
| Funksjon | Beskrivelse |
|----------|-------------|
| Generer plan | Lag 12-måneders plan |
| Tilpass | Juster for individ |
| Mal-bibliotek | Gjenbrukbare maler |

#### 3.2 Plan-editor
**Lokasjon:** `/trener/plan-editor`

| Funksjon | Beskrivelse |
|----------|-------------|
| Dra-og-slipp | Flytt økter |
| Periodisering | Justér faser |
| Øvelsesvalg | Velg spesifikke øvelser |

### 4. Øvelsesbibliotek
**Lokasjon:** `/trener/ovelser`

| Funksjon | Beskrivelse |
|----------|-------------|
| Alle øvelser | Komplett database |
| Kategorier | Organisert etter type |
| Opprett ny | Lag egen øvelse |
| Tilpass | Modifiser eksisterende |
| Video-instruksjoner | Legg ved video |

### 5. Testing (Trener)

#### 5.1 Gjennomfør test
| Funksjon | Beskrivelse |
|----------|-------------|
| Velg spiller | Hvem testes |
| Velg test | Hvilken protokoll |
| Registrer | Input målinger |
| Auto-beregning | Automatisk score |

#### 5.2 Benchmark-sesjoner
| Funksjon | Beskrivelse |
|----------|-------------|
| Gruppetesting | Test flere spillere |
| Sammenligning | Se resultater side-by-side |
| Eksport | Last ned resultater |

### 6. Video-gjennomgang
**Lokasjon:** `/trener/videoer`

| Funksjon | Beskrivelse |
|----------|-------------|
| Innboks | Videoer til gjennomgang |
| Annotér | Legg til feedback |
| Sammenlign | Se utvikling |
| Send tilbake | Returner med kommentarer |

### 7. Analytics

#### 7.1 Team Analytics
**Lokasjon:** `/trener/analytics`

| Funksjon | Beskrivelse |
|----------|-------------|
| Aggregert data | Hele teamet |
| Trender | Utvikling over tid |
| Benchmarks | Team vs standard |
| Rapporter | Generer rapporter |

#### 7.2 Intelligence Dashboard
**Lokasjon:** `/trener/intelligence`

| Funksjon | Beskrivelse |
|----------|-------------|
| AI-innsikter | Automatiske anbefalinger |
| Risikoanalyse | Spillere som sliter |
| Muligheter | Spillere med potensial |

### 8. Kommunikasjon (Trener)

#### 8.1 Meldinger
| Funksjon | Beskrivelse |
|----------|-------------|
| Individuelle | Chat med enkeltspiller |
| Gruppe | Send til flere |
| Varsler | Push til mobil |

#### 8.2 Notater
| Funksjon | Beskrivelse |
|----------|-------------|
| Per spiller | Notater på hver spiller |
| Private | Kun for trener |
| Delte | Synlig for spiller |

### 9. Booking & Tilgjengelighet

#### 9.1 Min tilgjengelighet
**Lokasjon:** `/trener/tilgjengelighet`

| Funksjon | Beskrivelse |
|----------|-------------|
| Sett tider | Når er du ledig |
| Blokkér | Sett av privat tid |
| Gjentakende | Ukentlig mønster |

#### 9.2 Booking-oversikt
| Funksjon | Beskrivelse |
|----------|-------------|
| Kommende | Planlagte økter |
| Forespørsler | Ventende bookinger |
| Historikk | Tidligere økter |

### 10. Grupper
**Lokasjon:** `/trener/grupper`

| Funksjon | Beskrivelse |
|----------|-------------|
| Opprett gruppe | Lag treningsgruppe |
| Medlemmer | Administrer medlemmer |
| Gruppetrening | Planlegg for gruppe |

---

## Adminfunksjoner

### 1. System Overview
**Lokasjon:** `/admin/system`

| Funksjon | Beskrivelse |
|----------|-------------|
| Helse-sjekk | System status |
| Metrikker | Performance data |
| Feillogg | Sentry-integrasjon |

### 2. Brukeradministrasjon
**Lokasjon:** `/admin/brukere`

| Funksjon | Beskrivelse |
|----------|-------------|
| Alle brukere | Liste over brukere |
| Opprett | Ny bruker |
| Deaktiver | Slå av tilgang |
| Roller | Endre brukerrolle |

### 3. Treneradministrasjon
**Lokasjon:** `/admin/trenere`

| Funksjon | Beskrivelse |
|----------|-------------|
| Alle trenere | Liste over trenere |
| Tilordne spillere | Koble spiller-trener |
| Statistikk | Trener-performance |

### 4. Feature Flags
**Lokasjon:** `/admin/feature-flags`

| Funksjon | Beskrivelse |
|----------|-------------|
| Liste | Alle feature flags |
| Toggle | Slå av/på funksjoner |
| Rollout | Gradvis utrulling |

### 5. Tier Management
**Lokasjon:** `/admin/tiers`

| Funksjon | Beskrivelse |
|----------|-------------|
| Abonnement-nivåer | Free, Pro, Elite |
| Begrensninger | Kvoter per tier |
| Oppgradering | Endre tier |

### 6. Support
**Lokasjon:** `/admin/support`

| Funksjon | Beskrivelse |
|----------|-------------|
| Support-saker | Innkommende saker |
| Eskalering | Prioritér saker |
| Løsning | Lukk saker |

---

## Integrasjoner

### 1. DataGolf
| Funksjon | Beskrivelse |
|----------|-------------|
| Strokes Gained | SG-beregninger |
| Tour-statistikk | Sammenlign med proffer |
| Skill decomposition | Detaljert breakdown |
| Historiske data | Rundedata |

### 2. MET Norway (Vær)
| Funksjon | Beskrivelse |
|----------|-------------|
| Værmelding | Sanntids vær |
| Treningsforhold | Anbefaling |
| 7-dagers prognose | Planlegging |

### 3. Google Calendar
| Funksjon | Beskrivelse |
|----------|-------------|
| Sync | To-veis synkronisering |
| Påminnelser | Automatiske varsler |
| iCal | Standard format |

### 4. AI Coach (Claude)
| Funksjon | Beskrivelse |
|----------|-------------|
| Chat | Personlig assistent |
| Anbefalinger | Treningsråd |
| Analyse | Breaking point-analyse |

### 5. GolfBox
| Funksjon | Beskrivelse |
|----------|-------------|
| Turneringsimport | Automatisk import |
| Resultater | Runder og scorer |
| WAGR | Ranking-data |

### 6. AWS S3
| Funksjon | Beskrivelse |
|----------|-------------|
| Video-lagring | Sikker lagring |
| Presigned URLs | Sikker tilgang |
| Multi-part upload | Store filer |

---

## Gamification

### 1. Badge-system (20+ typer)

#### Streak Badges
| Badge | Krav |
|-------|------|
| 3-Day Streak | 3 dager på rad |
| 7-Day Streak | 7 dager på rad |
| 14-Day Streak | 14 dager på rad |
| 30-Day Streak | 30 dager på rad |

#### Volum Badges
| Badge | Krav |
|-------|------|
| 10 Hours | 10 timer trening |
| 25 Hours | 25 timer trening |
| 50 Hours | 50 timer trening |
| 100 Hours | 100 timer trening |

#### Forbedring Badges
| Badge | Krav |
|-------|------|
| Personal Best | Ny PB på test |
| Category Up | Opprykk i kategori |
| Test Master | Bestått alle tester |

#### Deltakelse Badges
| Badge | Krav |
|-------|------|
| First Session | Første økt |
| First Test | Første test |
| First Tournament | Første turnering |
| Video Upload | Første video |

### 2. XP-system
| Handling | XP |
|----------|-----|
| Logg økt | 10 XP |
| Gjennomfør test | 25 XP |
| Forbedring | 50 XP |
| Badge opptjent | 100 XP |

### 3. Nivåer
| Nivå | XP Required |
|------|-------------|
| Rookie | 0 |
| Beginner | 500 |
| Intermediate | 2000 |
| Advanced | 5000 |
| Expert | 10000 |
| Master | 25000 |

### 4. Achievements
| Achievement | Beskrivelse |
|-------------|-------------|
| Early Bird | Tren før kl 07:00 |
| Night Owl | Tren etter kl 20:00 |
| Weekend Warrior | Tren lørdag og søndag |
| Consistency King | 4 uker uten pause |
| Test Champion | Topp 10% på test |

### 5. Anti-Gaming
| Beskyttelse | Beskrivelse |
|-------------|-------------|
| Duplikat-sjekk | Blokkerer like økter |
| Rimelighetskontroll | Urealistiske verdier |
| Tidsvalidering | Minimum økttid |
| Frekvensgrense | Maks økter per dag |

---

## Teknisk Implementasjon

Se `02_BRUKERREISER.md` for detaljerte brukerreiser og `03_TEKNISK_DOKUMENTASJON.md` for arkitektur og kode.
