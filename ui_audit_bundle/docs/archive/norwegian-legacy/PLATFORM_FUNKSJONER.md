# AK Golf Academy - Komplett Funksjonsoversikt

> Alle funksjoner i IUP-plattformen for spillere og trenere

---

## Innholdsfortegnelse

1. [Spiller-plattformen](#spiller-plattformen)
2. [Trener-plattformen](#trener-plattformen)
3. [Admin-funksjoner](#admin-funksjoner)
4. [Integrasjoner](#integrasjoner)

---

# SPILLER-PLATTFORMEN

## 1. Innlogging og Profil

### Registrering og Innlogging
- **Hva det gjor**: Opprett brukerkonto med e-post/passord, logg inn med JWT-token
- **Funksjoner**:
  - Registrer ny bruker
  - Logg inn/ut
  - Bytt passord
  - Automatisk token-fornyelse

### Min Profil
- **Hva det gjor**: Se og rediger personlig informasjon
- **Innhold**:
  - Persondata (navn, fodselsdato, kjonn)
  - Kontaktinformasjon
  - Nodkontakt
  - Medisinske notater
  - Ukentlige treningstimer (mal)
  - Handicap og kategori (A-K)

---

## 2. Dashboard (Oversikt)

### Spiller-Dashboard
- **Hva det gjor**: Gir oversikt over alt viktig pa ett sted
- **Viser**:
  - Navaerende treningsperiode (E/G/S/T)
  - Ukens fremgang
  - Aktive mal
  - Siste testresultater
  - Uleste meldinger fra trener
  - Opptjente badges
  - Kommende okter og turneringer

---

## 3. Testprotokoll-systemet

### Testprotokoll-oversikt
- **Hva det gjor**: Viser alle 20+ tester tilgjengelig
- **Testkategorier**:
  | Nr | Test | Type |
  |----|------|------|
  | 1-2 | Driver (lengde/presisjon) | Langt spill |
  | 3-6 | Approach (100m, 75m, 50m, wedge) | Innspill |
  | 7-9 | Kortspill (10m, 20m, bunker) | Kortspill |
  | 10-14 | Putting (2m, 4m, 6m, 8m, lag) | Putting |
  | 15-20 | Fysiske tester | Fysisk |

### Registrer Testresultat
- **Hva det gjor**: Logger testresultater med automatisk beregning
- **Funksjoner**:
  - Legg inn radata
  - Last opp video (bevis)
  - Tracker-data import
  - Auto-kalkulering av PEI (Precision Efficiency Index)
  - Sammenligning mot kategorikrav
  - Bestatt/ikke bestatt status

### Testhistorikk
- **Hva det gjor**: Viser alle tidligere testresultater
- **Viser**:
  - Trendgrafer over tid
  - Forbedring fra forrige test
  - Percentil-rangering mot jevnaldrende
  - Kategori-benchmark sammenligning

---

## 4. Breaking Point System

### Hva er Breaking Points?
- **Definisjon**: Omrader der spilleren har prestasjons-gap som hindrer fremgang
- **Kilder**:
  - Automatisk oppdaget fra testfeil
  - Manuelt registrert av trener
  - Fra klubbhastighets-kalibrering

### Breaking Point Visning
- **Hva det gjor**: Viser alle aktive breaking points
- **Innhold**:
  - Alvorlighetsgrad (lav/medium/hoy/kritisk)
  - Baseline-maling
  - Malverdi
  - Tildelte ovelser for a lose problemet
  - Fremgang mot losning
  - Dato for losning

### Klubbhastighets-kalibrering
- **Hva det gjor**: Kalibrerer forventet klubbhastighet for hver kolle
- **Funksjoner**:
  - Registrer hastighet per kolle
  - Identifiser avvik fra forventet
  - Automatisk breaking point ved store avvik

---

## 5. Treningssystemet

### Arsplan (ATP - Annual Training Plan)
- **Hva det gjor**: Viser 12-maneders treningsplan
- **Innhold**:
  - Periodisering (E/G/S/T-faser)
  - Planlagte turneringer
  - Ukentlig fokusomrade
  - Hviledager

### Periodisering (E/G/S/T)
- **Faser**:
  | Fase | Navn | Fokus |
  |------|------|-------|
  | E | Endurance | Grunntrening, volum |
  | G | General | Allsidig utvikling |
  | S | Specialization | Spesifikk teknikk |
  | T | Tournament | Konkurranseforberedelse |

### Daglige Treningsoppgaver
- **Hva det gjor**: Viser dagens planlagte trening
- **Innhold**:
  - Okt-mal med ovelser
  - Varighet og intensitet
  - Fokusomrade
  - Status (planlagt/fullfort/hoppet over)

### Logg Treningsokt
- **Hva det gjor**: Registrer gjennomfort trening
- **Registrerer**:
  - Dato og varighet
  - Okt-type (teknikk, styrke, spill, mental)
  - Laringsfase
  - Fokusomrade
  - Intensitetsniva

### Egenvurdering
- **Hva det gjor**: Vurder egen treningsokt
- **Vurderer** (1-10):
  - Fokus
  - Teknisk utforelse
  - Energiniva
  - Mental tilstand
  - Pre-shot rutine konsistens

---

## 6. Ovelsesbibliotek

### Bla i Ovelser
- **Hva det gjor**: Se alle tilgjengelige ovelser
- **Filtrering**:
  - Laringsfase (1-5)
  - Setting (range, bane, simulator, hjemme)
  - Klubbhastighet
  - Kategori (A-K)
  - Periode (E/G/S/T)
  - Prosess-kategori

### Ovelsesinformasjon
- **Viser per ovelse**:
  - Navn og beskrivelse
  - Video/bilder
  - Coaching-tips
  - Suksesskriterier
  - Progresjonstrinn
  - Regresjonstrinn
  - Varighet

---

## 7. Kalender og Booking

### Treningskalender
- **Hva det gjor**: Viser all planlagt aktivitet
- **Innhold**:
  - Treningsokter
  - Turneringer
  - Trenerbolinger
  - Hviledager
  - Google Calendar-synkronisering

### Book Trener
- **Hva det gjor**: Bestill treningsokt med trener
- **Funksjoner**:
  - Se ledige tidspunkter
  - Velg okt-type
  - Legg til notater/onsker
  - Motta bekreftelse
  - Avbestill/endre

---

## 8. Mal og Fremgang

### Malsetting
- **Hva det gjor**: Sett og folg personlige mal
- **Funksjoner**:
  - Opprett nye mal
  - Sett frist
  - Folg fremgang (%)
  - Marker som fullfort

### Fremgangslogg
- **Hva det gjor**: Daglig logg av treningsaktivitet
- **Logger**:
  - Gjennomforte okter
  - Planlagt vs faktisk
  - Kvalitetsvurdering
  - Energiniva for/etter
  - Viktigste laerdom

---

## 9. Sammenligning og Statistikk

### Peer Comparison (Jevnaldrende-sammenligning)
- **Hva det gjor**: Sammenlign deg med andre i samme kategori
- **Viser**:
  - Percentil-rangering per test
  - Z-score
  - Gjennomsnitt, median, standardavvik for gruppen
  - Kvartilplassering

### Statistikkoversikt
- **Hva det gjor**: Detaljert prestasjonsstatistikk
- **Inneholder**:
  - Trendgrafer
  - Beste resultater
  - Forbedringsrate
  - Historisk utvikling

---

## 10. Gamification (Badges og Achievements)

### Badge-system
- **Hva det gjor**: Opptjen merker for prestasjoner
- **Badge-typer**:
  - Testrelaterte (bestatt tester)
  - Konsistens (streak-baserte)
  - Maloppnaelse
  - Treningsvolum
  - Spesielle prestasjoner

### Achievement Tracking
- **Hva det gjor**: Folg med pa oppnadde milepaler
- **Eksempler**:
  - Forste bestatte test
  - Personlig rekord
  - Kategori-oppgradering
  - 100 treningsokter

---

## 11. Kommunikasjon

### Meldinger
- **Hva det gjor**: Send og motta meldinger med trener
- **Funksjoner**:
  - Samtalehistorikk
  - Sok i meldinger
  - Lest/ulest status

### Varsler
- **Hva det gjor**: Motta viktige oppdateringer
- **Varseltyper**:
  - Test-paininnelser
  - Booking-bekreftelser
  - Malframgang
  - Trenermeldinger
  - Badge-oppnaelser

---

## 12. Data og Eksport

### Dataeksport
- **Hva det gjor**: Last ned egne data
- **Eksporterer**:
  - Treningsdata
  - Testresultater
  - Fremgangsrapporter

### Arkiv
- **Hva det gjor**: Tilgang til historiske data
- **Innhold**:
  - Gamle treningsplaner
  - Tidligere sesonger
  - Arkiverte mal

---

# TRENER-PLATTFORMEN

## 1. Trener-Dashboard

### Hovedoversikt
- **Hva det gjor**: Sentral oversikt over alle utovere
- **Viser**:
  - Antall aktive utovere
  - Nylige testresultater
  - Varsler som krever handling
  - Ukens aktivitet
  - Planlagte okter i dag

---

## 2. Utoveradministrasjon

### Utoverliste
- **Hva det gjor**: Se og administrer alle utovere
- **Funksjoner**:
  - Sok og filtrer
  - Sorter pa kategori/status/prestasjon
  - Bulk-handlinger
  - Hurtigtilgang til profil

### Utoverdetaljer
- **Hva det gjor**: Komplett oversikt over en utover
- **Inneholder**:
  - Profil og kontaktinfo
  - Alle testresultater
  - Treningsplan
  - Breaking points
  - Malstatus
  - Treningshistorikk
  - Notater

### Utoverstatus
- **Hva det gjor**: Sanntids status pa utovere
- **Viser**:
  - Navaerende periode
  - Siste aktivitet
  - Kategoriniva
  - Aktive varsler

### Gruppeadministrasjon
- **Hva det gjor**: Organiser utovere i grupper
- **Funksjoner**:
  - Opprett grupper
  - Tildel utovere
  - Batch-operasjoner
  - Gruppetrening planlegging

---

## 3. Testadministrasjon

### Administrer Testprotokoller
- **Hva det gjor**: Opprett og rediger tester
- **Funksjoner**:
  - Definer testparametre
  - Sett bestaatt-grenser
  - Kategorikrav per kjonn
  - Test-instruksjoner

### Se Testresultater
- **Hva det gjor**: Oversikt over alle utoveres tester
- **Funksjoner**:
  - Filtrer pa utover/test/dato
  - Se trendanalyse
  - Identifiser problem-omrader
  - Eksporter data

### Registrer Resultater
- **Hva det gjor**: Legg inn testresultater for utovere
- **Inkluderer**:
  - Radata
  - Video-bevis
  - Automatisk kalkulering
  - Kategori-validering

---

## 4. Breaking Point Analyse

### Breaking Point Oversikt
- **Hva det gjor**: Se alle utoveres breaking points
- **Funksjoner**:
  - Filtrer pa alvorlighet
  - Se uloste vs loste
  - Prioriter tiltak

### Tildel Ovelser
- **Hva det gjor**: Koble ovelser til breaking points
- **Prosess**:
  1. Velg breaking point
  2. Velg relevante ovelser
  3. Sett mal og tidslinje
  4. Folg fremgang

### Auto-deteksjon
- **Hva det gjor**: Automatisk identifisering av breaking points
- **Kilder**:
  - Testfeil
  - Kalibrerings-avvik
  - Trendanalyse

---

## 5. Treningsplanlegging

### Arsplan-generator
- **Hva det gjor**: Generer 12-maneders treningsplan
- **Input**:
  - Baseline-statistikk
  - Turneringsliste
  - Kategori og mal
- **Output**:
  - Periodisert plan (E/G/S/T)
  - Ukentlige fokusomrader
  - Hviledager

### Rediger Treningsplan
- **Hva det gjor**: Juster eksisterende plan
- **Muligheter**:
  - Flytt perioder
  - Endre fokus
  - Legg til turneringer
  - Justere intensitet

### Ukeplan-maler
- **Hva det gjor**: Lag gjenbrukbare ukeplaner
- **Inneholder**:
  - Daglig okt-fordeling
  - Standard varigheter
  - Anbefalte ovelser

### Daglige Tildelinger
- **Hva det gjor**: Administrer daglige treningsoppgaver
- **Funksjoner**:
  - Se planlagte okter
  - Endre/bytte okter
  - Marker fullfort

---

## 6. Okt-administrasjon

### Okt-maler
- **Hva det gjor**: Lag gjenbrukbare okt-maler
- **Inneholder**:
  - Ovelsesrekkefolge
  - Mal og suksesskriterier
  - Varighet per ovelse
  - Laringsfase

### Okt-planlegger
- **Hva det gjor**: Design treningsokter
- **Funksjoner**:
  - Velg ovelser fra bibliotek
  - Sett rekkefolge
  - Beregn total varighet
  - Lagre som mal

### Evaluering av Okter
- **Hva det gjor**: Se utoveres egenvurderinger
- **Viser**:
  - Fokus-score
  - Teknisk vurdering
  - Energiniva
  - Mental tilstand
  - Pre-shot rutine konsistens
- **Legg til**:
  - Trenerfeedback
  - Tekniske notater
  - Observasjoner

---

## 7. Ovelsesadministrasjon

### Ovelsesbibliotek (full tilgang)
- **Hva det gjor**: Administrer alle ovelser
- **Funksjoner**:
  - Opprett nye ovelser
  - Rediger eksisterende
  - Kategoriser og tag
  - Last opp video/bilder

### Mine Ovelser
- **Hva det gjor**: Egne tilpassede ovelser
- **Funksjoner**:
  - Personlig bibliotek
  - Del med andre trenere
  - Versjonskontroll

### Ovelses-editor
- **Hva det gjor**: Detaljert ovelses-redigering
- **Felter**:
  - Navn og beskrivelse
  - Laringsfase (1-5)
  - Setting
  - Klubbhastighets-niva
  - Coaching-tips
  - Suksesskriterier
  - Progresjons/regresjonstrinn

---

## 8. Analyse og Rapporter

### Treneranalyse-dashboard
- **Hva det gjor**: Team-analyse og KPIer
- **Viser**:
  - Team-gjennomsnitt per test
  - Forbedringstrend
  - Kategorifordeling
  - Aktivitetsniva

### Utover-prestasjonsoversikt
- **Hva det gjor**: Dyp analyse av enkeltutover
- **Inneholder**:
  - Alle testsammendrag
  - Styrker og svakheter
  - Breaking points
  - Anbefalte tiltak

### Kategori-progresjon
- **Hva det gjor**: Analyser kategori-opprykk mulighet
- **Viser**:
  - Oppfylte krav
  - Manglende krav
  - Prognosert tidspunkt for opprykk

### Sammenlign Utovere
- **Hva det gjor**: Side-by-side sammenligning
- **Funksjoner**:
  - Velg flere utovere
  - Sammenlign spesifikke tester
  - Se relative styrker

### Peer Benchmarking
- **Hva det gjor**: Statistisk analyse mot gruppe
- **Statistikk**:
  - Gjennomsnitt
  - Median
  - Standardavvik
  - Percentiler
  - Z-scores

---

## 9. Turneringsadministrasjon

### Turneringsoversikt
- **Hva det gjor**: Administrer turneringskalender
- **Funksjoner**:
  - Opprett turneringer
  - Sett datoer og sted
  - Link til treningsplan

### Turneringsresultater
- **Hva det gjor**: Registrer og analyser resultater
- **Logger**:
  - Rundescore
  - Strokes gained
  - Prestasjonsstatistikk

### Turnering-trening integrasjon
- **Hva det gjor**: Koble turnering til treningsplan
- **Funksjoner**:
  - Toppings-fase
  - Tapering-periode
  - Post-turnering evaluering

---

## 10. Booking og Tilgjengelighet

### Tilgjengelighetsstyring
- **Hva det gjor**: Definer ledige tidspunkter
- **Innstillinger**:
  - Ukedager og tider
  - Varighet per okt
  - Maks antall bookinger
  - Okt-typer tilgjengelig

### Booking-foresporsler
- **Hva det gjor**: Handter innkommende bookinger
- **Funksjoner**:
  - Se alle foresporsler
  - Godkjenn/avvis
  - Send bekreftelse
  - Haandter avbestillinger

### Booking-kalender
- **Hva det gjor**: Visuell oversikt over alle bookinger
- **Viser**:
  - Alle bookede okter
  - Ledige slots
  - Konflikter

---

## 11. Kommunikasjon

### Meldinger til Utovere
- **Hva det gjor**: Send og motta meldinger
- **Funksjoner**:
  - Skriv nye meldinger
  - Samtalehistorikk
  - Sok

### Planlagte Meldinger
- **Hva det gjor**: Tidsinnstilt melding-utsending
- **Funksjoner**:
  - Sett dato/tid
  - Batch-meldinger

### Varslingssystem
- **Hva det gjor**: Send varsler til utovere
- **Kanaler**:
  - App-notifikasjon
  - E-post
  - SMS
  - Push

---

## 12. Notater og Dokumentasjon

### Utovernotater
- **Hva det gjor**: Skriv detaljerte notater
- **Funksjoner**:
  - Kategorisr notater
  - Sok og filtrer
  - Tidsstempling

### Bevis-visning
- **Hva det gjor**: Se video/bilder fra utovere
- **Bruksomrade**:
  - Teknikkanalyse
  - Fremgangsdokumentasjon

---

## 13. Intelligens og Varsler

### Trener-intelligens
- **Hva det gjor**: Smarte varsler og innsikt
- **Varseltyper**:
  - Risikoaltsler (utovere som sliter)
  - Prestasjonsanomalier
  - Breaking points som krever handling
  - Milepaler naadd

### Trajektorie-visning
- **Hva det gjor**: Langtids utviklingsanalyse
- **Viser**:
  - Utviklingskurve over tid
  - Prediksjoner
  - Trend-indikatorer

---

## 14. Filtre og Lagrede Visninger

### Filtreadministrasjon
- **Hva det gjor**: Lag og lagre egne filter
- **Bruksomrade**:
  - Hurtig tilgang til utover-grupper
  - Gjenbrukbare sok

---

## 15. Trenerinnstillinger

### Trenerprofil
- **Hva det gjor**: Rediger egen informasjon
- **Innhold**:
  - Persondata
  - Spesialiseringer
  - Sertifiseringer
  - Timepris
  - Profilbilde

### Arbeidstider
- **Hva det gjor**: Sett tilgjengelighet
- **Innstillinger**:
  - Daglige arbeidstider
  - Faste fridager
  - Unntak

---

# ADMIN-FUNKSJONER

## Systemadministrasjon

### Systemoversikt
- Se plattform-helse
- Brukerstatistikk
- Ressursovervaking

### Treneradministrasjon
- Opprett/administrer trenere
- Tildel utovere
- Overvak bruk

### Abonnements-styring
- Administrer abonnementsniva
- Sett grenser (maks utovere/trenere)
- Feature-tilgang

### Feature Flags
- Aktiver/deaktiver funksjoner
- Per tenant eller globalt
- A/B-testing

### Eskalering og Support
- Handter brukersaker
- Support-tickets
- Feilrapporter

---

# INTEGRASJONER

## DataGolf
- **Hva det gjor**: Synkroniserer profesjonell spiller-data
- **Funksjoner**:
  - Strokes gained statistikk
  - Pro-sammenligning
  - Tour-gjennomsnitt

## Google Calendar
- **Hva det gjor**: Toveis kalendersynkronisering
- **Funksjoner**:
  - OAuth 2.0 autentisering
  - Automatisk synk av okter
  - Konflikthandtering

## iCal Eksport
- **Hva det gjor**: Generer kalender-feed
- **Funksjoner**:
  - Token-basert tilgang
  - Abonner i ekstern kalender

---

# OPPSUMMERING

## Antall Funksjoner

| Plattform | Hovedfunksjoner | Delfunksjoner |
|-----------|-----------------|---------------|
| Spiller | 12 | 50+ |
| Trener | 15 | 80+ |
| Admin | 5 | 15+ |
| **Totalt** | **32** | **145+** |

## API-endepunkter
- Totalt: ~110 endepunkter
- Fordelt pa 30 moduler

## Database-tabeller
- 40+ Prisma-modeller
- Multi-tenant arkitektur

---

**Sist oppdatert**: Desember 2025
