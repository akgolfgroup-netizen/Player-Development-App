# TIER Golf - Komplett Funksjonsoversikt 2025

> **Sist oppdatert:** 31. desember 2024
> **Versjon:** 2.0
> **Kilde:** Generert fra faktisk kodebase (App.jsx, API-ruter, features/)

---

## Innholdsfortegnelse

1. [Plattformoversikt](#plattformoversikt)
2. [Brukerroller](#brukerroller)
3. [Spiller-funksjoner](#spiller-funksjoner)
4. [Trener-funksjoner](#trener-funksjoner)
5. [Admin-funksjoner](#admin-funksjoner)
6. [Mobil-funksjoner](#mobil-funksjoner)
7. [API-endepunkter](#api-endepunkter)
8. [Integrasjoner](#integrasjoner)
9. [Gamification](#gamification)
10. [Teknisk arkitektur](#teknisk-arkitektur)

---

## Plattformoversikt

### Nøkkeltall (Faktisk status)

| Metrikk | Antall | Beskrivelse |
|---------|--------|-------------|
| **Frontend-ruter** | 130+ | Unike sider/views |
| **Feature-moduler** | 75 | Separate feature-mapper |
| **API-endepunkter** | 45+ | Backend-tjenester |
| **Brukerroller** | 3 | Player, Coach, Admin |
| **Mobil-ruter** | 5 | PWA/Capacitor-støtte |

### Teknologistakk

| Lag | Teknologi |
|-----|-----------|
| **Frontend** | React 18, React Router, Tailwind CSS, Shadcn/UI |
| **Backend** | Node.js, Express, TypeScript, Prisma ORM |
| **Database** | PostgreSQL 15 |
| **Autentisering** | JWT, bcrypt |
| **Video** | AWS S3, presigned URLs |
| **Vær** | MET Norway API |
| **Golf-data** | DataGolf API |

---

## Brukerroller

### Rollebeskrivelser

| Rolle | Beskrivelse | Layout | Tilgang |
|-------|-------------|--------|---------|
| **Player** | Junior golfspiller som trener og utvikler seg | TopNav Layout | Egne data, treningsplaner, statistikk |
| **Coach** | Trener som følger opp en eller flere spillere | CoachAppShell | Alle tilknyttede spilleres data |
| **Admin** | Systemadministrator | AdminAppShell | System-config, **IKKE spillerdata** |

### Tilgangskontroll

```
Player → Kun egne data
Coach → Spillere i sitt team + systemfunksjoner
Admin → Kun systemadministrasjon (ingen spillerdata)
```

---

## Spiller-funksjoner

### 1. Dashboard & Hovedoversikt

#### 1.1 Dashboard (`/dashboard`)
Hovedsiden spilleren ser etter innlogging.

| Komponent | Beskrivelse | Data |
|-----------|-------------|------|
| **Ukeoversikt** | Treningsminutter denne uken | Sessions API |
| **Quick Stats** | Streak, ukemål, fremgang | Player Insights API |
| **Siste tester** | Nylige testresultater med trender | Tests API |
| **Kommende økter** | Planlagte treninger og turneringer | Calendar API |
| **Badges** | Nylig opptjente merker | Achievements API |
| **Værvarsel** | Treningsforhold for nærmeste bane | Weather API |
| **Strokes Gained** | SG-sammendrag hvis data finnes | DataGolf API |

#### 1.2 Dashboard V2 (`/dashboard-v2`)
Ny versjon med forbedret design og flere widgets.

---

### 2. Profil & Innstillinger

| Rute | Funksjon | Beskrivelse |
|------|----------|-------------|
| `/profil` | **Min profil** | Se og administrer kontoinformasjon |
| `/profil/oppdater` | **Oppdater profil** | Onboarding-flyt for profildata |
| `/trenerteam` | **Trenerteam** | Se tilknyttede trenere og støtteapparat |
| `/kalibrering` | **Kalibrering** | Kalibrer personlige innstillinger |
| `/innstillinger/varsler` | **Varselinnstillinger** | Administrer push-varsler og e-post |

#### Profildata som lagres:
- Navn, e-post, telefon
- Fødselsdato, kjønn
- Hjemmeklubb, handicap
- Kategori (A1/A2/B/C/D/E/F/G/H/I/J/K)
- Profilbilde
- Foretrukne varsler

---

### 3. Målsetting & Planlegging

#### 3.1 Målsetninger (`/maalsetninger`, `/goals`)

| Funksjon | Beskrivelse |
|----------|-------------|
| **Kortsiktige mål** | Ukentlige og månedlige mål |
| **Langsiktige mål** | Sesong- og årsmål |
| **SMART-mål** | Spesifikke, målbare, oppnåelige, relevante, tidsbestemte |
| **Progress-tracking** | Visuell fremgang mot hvert mål |
| **Målkategorier** | Trening, testing, turnering, fysisk |

#### 3.2 Årsplan

| Rute | Funksjon | Beskrivelse |
|------|----------|-------------|
| `/aarsplan` | **Årsplan** | 12-måneders treningsplan |
| `/aarsplan/perioder` | **Periodisering** | E/G/S/T-faser (Ettertrening, Generell, Spesifikk, Turnering) |
| `/aarsplan/fokus` | **Fokusområder** | Målsetninger for hver periode |
| `/aarsplan/ny` | **Generer årsplan** | AI-assistert plangenerering |

#### Periodiseringsmodell:
```
E - Ettertrening (off-season): Restitusjon, grunntrening
G - Generell: Bred ferdighetstrening
S - Spesifikk: Målrettet mot sesongens hovedmål
T - Turnering: Konkurransefokus, vedlikehold
```

#### 3.3 Periodeplaner (`/periodeplaner`)
Langsiktig treningsplanlegging med periodeoversikt.

#### 3.4 Samlinger (`/samlinger`)
Oversikt over samlinger, deltakelse og oppmøte.

---

### 4. Trening & Økter

#### 4.1 Øktadministrasjon

| Rute | Funksjon | Beskrivelse |
|------|----------|-------------|
| `/sessions` | **Alle økter** | Liste over alle treningsøkter |
| `/session/new` | **Ny økt** | Opprett ny treningsøkt |
| `/session/:id` | **Øktdetaljer** | Se og rediger en økt |
| `/session/:id/active` | **Aktiv økt** | Gjennomfør økten i sanntid |
| `/session/:id/reflection` | **Refleksjon** | Reflekter over fullført økt |
| `/session/:id/evaluate` | **Evaluering** | Detaljert evaluering med score |
| `/session/stats` | **Øktstatistikk** | Analyse av alle økter |

#### Øktstruktur:
```typescript
interface Session {
  id: string;
  playerId: string;
  type: 'driving' | 'iron_play' | 'short_game' | 'putting' | 'on_course' | 'physical' | 'mental';
  plannedDuration: number;  // minutter
  actualDuration?: number;
  exercises: Exercise[];
  notes?: string;
  evaluation?: {
    technicalScore: 1-5;
    mentalScore: 1-5;
    physicalScore: 1-5;
    overallScore: 1-5;
    reflection: string;
  };
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  createdAt: Date;
  completedAt?: Date;
}
```

#### 4.2 Øvelsesbibliotek (`/ovelsesbibliotek`)

| Funksjon | Beskrivelse |
|----------|-------------|
| **Søk** | Fulltekstsøk i øvelser |
| **Kategorier** | Driving, Iron, Short Game, Putting, Fysisk, Mental |
| **Favoritter** | Lagre favorittøvelser |
| **Detaljer** | Instruksjoner, video, tips |
| **Tilpasset** | Egendefinerte øvelser |

#### Øvelseskategorier:
- **Driving**: Driver, fairway-trær
- **Iron Play**: Lange, mellom, korte jern
- **Short Game**: Pitch, chip, bunker
- **Putting**: Avstand, retning, korte putter
- **Fysisk**: Styrke, bevegelighet, utholdenhet
- **Mental**: Konsentrasjon, visualisering, rutiner

#### 4.3 Treningsdagbok (`/trening/dagbok`)

| Funksjon | Beskrivelse |
|----------|-------------|
| **Kronologisk logg** | Alle økter over tid |
| **Filtrering** | Etter type, dato, kategori |
| **Pyramidevisning** | Hierarkisk øvelsesoversikt |
| **Statistikk** | Aggregert treningsdata |
| **Eksport** | Last ned treningshistorikk |

#### 4.4 Treningsplaner

| Rute | Funksjon |
|------|----------|
| `/trening/dagens` | Dagens treningsplan |
| `/trening/ukens` | Ukens treningsplan |
| `/trening/teknisk` | Teknisk plan med fokusområder |
| `/trening/logg` | Hurtiglogging av trening |

---

### 5. Testing & Evaluering

#### 5.1 Testprotokoll (`/testprotokoll`)

**20 standardiserte tester fordelt på kategorier:**

| Kategori | Tester | Måleenhet |
|----------|--------|-----------|
| **Driving** | Driver, 3-wood, 5-wood | Carry distance (m), dispersion |
| **Iron Play** | 3-iron, 5-iron, 7-iron, 9-iron | Carry distance, accuracy |
| **Approach** | Pitching 10-50m, Chipping | Proximity to hole (m) |
| **Short Game** | Sand play, Up & Down | % success rate |
| **Putting** | Distance control, Direction, Short putts | Putts made, distance left |
| **On-Course** | 9-hull, 18-hull | Score vs par |
| **Fysisk** | Fleksibilitet, Styrke, Utholdenhet | Standardiserte tester |

#### 5.2 Testresultater (`/testresultater`)

| Funksjon | Beskrivelse |
|----------|-------------|
| **Historikk** | Alle gjennomførte tester |
| **Trender** | Graf over utvikling |
| **Kategori-krav** | Hva kreves for neste nivå |
| **Sammenligning** | Mot egen baseline og peers |
| **Eksport** | PDF-rapport |

#### 5.3 Kategorikrav (`/testing/krav`)
Detaljert oversikt over krav for hver kategori (A1 → K).

#### 5.4 Registrer test (`/testing/registrer`)
Skjema for å logge nye testresultater med automatisk scoring.

#### 5.5 Evaluering

| Rute | Funksjon |
|------|----------|
| `/evaluering` | Hovedevalueringsside |
| `/evaluering/trening` | Evaluer treningsøkter |
| `/evaluering/turnering` | Evaluer turneringsprestasjoner |

---

### 6. Statistikk & Analyse

#### 6.1 Statistikk Hub (`/statistikk`)
Samlet statistikkside med tab-navigasjon:

| Tab | Innhold |
|-----|---------|
| **Oversikt** | Sammendrag av all statistikk |
| **Strokes Gained** | SG breakdown |
| **Testresultater** | Testhistorikk |
| **Status/Fremgang** | Kategori-fremgang |
| **Benchmark** | Sammenligning |

#### 6.2 Strokes Gained (`/statistikk` → SG-tab)

| Kategori | Beskrivelse |
|----------|-------------|
| **SG: Off-the-Tee** | Driving-prestasjon |
| **SG: Approach** | Innspill til green |
| **SG: Around-the-Green** | Short game |
| **SG: Putting** | Putting-prestasjon |
| **SG: Total** | Samlet SG |

**DataGolf-integrasjon:**
- Sammenligning mot PGA Tour-gjennomsnitt
- Historiske trender
- Skill decomposition

#### 6.3 Min utvikling

| Rute | Funksjon |
|------|----------|
| `/utvikling` | Utviklingsoversikt |
| `/utvikling/breaking-points` | Viktige milepæler og gap-analyse |
| `/utvikling/kategori` | Fremgang per kategori A-K |
| `/utvikling/benchmark` | Benchmark-historikk |

#### Breaking Points-analyse:
```
1. Identifiserer prestasjonsgap
2. Prioriterer forbedringsområder
3. Foreslår handlingsplan
4. Tracker status (In Progress / Completed)
```

#### 6.4 Fremgang (`/progress`)
Visuell fremgangsvisning med grafer og milepæler.

---

### 7. Turneringer

#### 7.1 Turneringskalender (`/turneringskalender`)

| Funksjon | Beskrivelse |
|----------|-------------|
| **Kalenderoversikt** | Alle kommende turneringer |
| **Filtrering** | Etter region, nivå, dato |
| **Detaljer** | Bane, format, påmeldingsfrist |
| **Påmelding** | Direkte påmelding (GolfBox-link) |

#### 7.2 Turneringsplanlegger (`/turneringer/planlegger`)
Personlig turneringsplan for sesongen.

#### 7.3 Mine turneringer (`/mine-turneringer`)
Oversikt over påmeldte og gjennomførte turneringer.

#### 7.4 Turneringsresultater (`/turneringer/resultater`)

| Funksjon | Beskrivelse |
|----------|-------------|
| **Resultatliste** | Alle turneringsresultater |
| **Statistikk** | Gjennomsnittsscore, beste runde |
| **Trender** | Utvikling over tid |
| **WAGR** | World Amateur Golf Ranking-poeng |

#### 7.5 Registrer resultat (`/turneringer/registrer`)
Manuell registrering av turneringsresultat.

---

### 8. Kalender & Booking

#### 8.1 Kalender

| Rute | Funksjon |
|------|----------|
| `/kalender` | Hovedkalender (måned/uke) |
| `/kalender/dag` | Dagsoversikt |
| `/kalender/oversikt` | Full kalenderoversikt |

#### Hendelsestyper:
- Treningsøkt
- Test
- Turnering
- Trenermøte
- Samling
- Annet

#### 8.2 Book trener (`/kalender/booking`)

| Funksjon | Beskrivelse |
|----------|-------------|
| **Se tilgjengelighet** | Trenerens ledige tider |
| **Book time** | Velg tid og type |
| **Bekreftelse** | Automatisk bekreftelse |
| **Avbestilling** | Kanseller med varsel |

---

### 9. Video & Analyse

#### 9.1 Videoer (`/videos`)

| Funksjon | Beskrivelse |
|----------|-------------|
| **Opplasting** | Last opp swing-video (AWS S3) |
| **Organisering** | Kategorisering etter type |
| **Søk** | Finn etter dato, type, tags |
| **Deling** | Del med trener |
| **Kommentarer** | Trener-feedback |

#### 9.2 Videoanalyse (`/videos/:id/analyze`)

| Verktøy | Beskrivelse |
|---------|-------------|
| **Tegning** | Linjer, sirkler, piler |
| **Markører** | Tidspunkt-markering |
| **Sammenligning** | Side-by-side med referanse |
| **Slow-motion** | Variabel avspillingshastighet |
| **Frame-by-frame** | Steg gjennom bilder |

#### 9.3 Videosammenligning (`/videos/compare`)
Sammenlign to videoer side om side med synkronisert avspilling.

#### 9.4 Videofremgang (`/videos/progress`)
Tidslinje over alle videoer for å se utvikling over tid.

---

### 10. Kommunikasjon

#### 10.1 Meldinger

| Rute | Funksjon |
|------|----------|
| `/meldinger` | Meldingssenter |
| `/meldinger/ny` | Start ny samtale |
| `/meldinger/trener` | Trenermeldinger |
| `/meldinger/:id` | Samtalevisning |

#### Meldingsfunksjoner:
- Sanntids-chat
- Filvedlegg
- Lesebekreftelse
- Push-varsler

#### 10.2 Varsler (`/varsler`)

| Varseltype | Beskrivelse |
|------------|-------------|
| **Treningspåminnelse** | Kommende økt |
| **Testpåminnelse** | Planlagt test |
| **Ny melding** | Ulestemeldinger |
| **Badge opptjent** | Ny badge |
| **Trener-feedback** | Kommentar på video/økt |

---

### 11. Prestasjoner & Merker

#### 11.1 Achievements (`/achievements`)
Dashboard med alle oppnåelser og fremgang.

#### 11.2 Badges (`/badges`)

| Kategori | Eksempler |
|----------|-----------|
| **Streak** | 3-dag, 7-dag, 14-dag, 30-dag streak |
| **Volum** | 10, 25, 50, 100 timer trening |
| **Forbedring** | Personal Best, Kategori-opprykk |
| **Deltakelse** | Første økt, test, turnering, video |
| **Spesielle** | Early Bird, Night Owl, Weekend Warrior |

#### 11.3 Bevis (`/bevis`)
Dokumenter og bevis på fremgang (bilder, videoer, sertifikater).

---

### 12. Kunnskap & Skole

#### 12.1 Ressurser (`/ressurser`)

| Innholdstype | Beskrivelse |
|--------------|-------------|
| **Artikler** | Trenings- og teknikkartikler |
| **Videoer** | Instruksjonsvideoer |
| **PDF-er** | Nedlastbare guider |
| **Linker** | Eksterne ressurser |

#### 12.2 Skoleplan (`/skoleplan`)
Balanse mellom skole og golf for juniorer.

#### 12.3 Skoleoppgaver (`/skole/oppgaver`)
Oversikt over skoleoppgaver og frister.

---

### 13. Diverse spillerfunksjoner

| Rute | Funksjon |
|------|----------|
| `/notater` | Personlige notater og refleksjoner |
| `/arkiv` | Historiske data og arkiverte planer |
| `/plan-preview/:id` | Forhåndsvisning av plan |

---

## Trener-funksjoner

### 1. Coach Dashboard (`/coach`)

| Widget | Beskrivelse |
|--------|-------------|
| **Spilleroversikt** | Alle spillere med status |
| **Varsler** | Spillere som trenger oppfølging |
| **Dagens økter** | Planlagte treninger i dag |
| **Quick stats** | Aggregert teamstatistikk |
| **Nylige aktiviteter** | Siste handlinger |

---

### 2. Utøveradministrasjon

#### 2.1 Spillerliste (`/coach/athletes`)

| Funksjon | Beskrivelse |
|----------|-------------|
| **Liste** | Alle tilknyttede spillere |
| **Søk** | Finn spiller raskt |
| **Filtrering** | Etter kategori, status, aktivitet |
| **Sortering** | Navn, siste aktivitet, kategori |
| **Bulk-handlinger** | Send melding til flere |

#### 2.2 Spillerdetaljer (`/coach/athletes/:id`)

| Tab/Seksjon | Innhold |
|-------------|---------|
| **Oversikt** | Profil, kategori, mål |
| **Treningshistorikk** | Alle økter |
| **Testresultater** | Testdata og trender |
| **Statistikk** | SG, breaking points |
| **Videoer** | Spillerens videoer |
| **Notater** | Trenernotater |
| **Kalender** | Spillerens plan |

#### 2.3 Andre utøver-ruter

| Rute | Funksjon |
|------|----------|
| `/coach/athletes/status` | Statusoversikt alle spillere |
| `/coach/athletes/tournaments` | Spilleres turneringsdeltakelse |
| `/coach/athletes/:id/plan` | Spillerens treningsplan |
| `/coach/athletes/:id/plan/edit` | Rediger treningsplan |
| `/coach/athletes/:id/notes` | Notater om spiller |
| `/coach/athletes/:id/trajectory` | Utviklingsbane |
| `/coach/players/:id` | Full spillerprofil |

---

### 3. Grupper

| Rute | Funksjon |
|------|----------|
| `/coach/groups` | Liste over alle grupper |
| `/coach/groups/create` | Opprett ny gruppe |
| `/coach/groups/:id` | Gruppedetaljer |
| `/coach/groups/:id/edit` | Rediger gruppe |
| `/coach/groups/:id/plan` | Gruppeplan |

#### Gruppefunksjoner:
- Opprette treningsgrupper
- Definere gruppemedlemmer
- Gruppetrening og -planer
- Gruppestatistikk
- Massekommunikasjon

---

### 4. Booking & Kalender

| Rute | Funksjon |
|------|----------|
| `/coach/booking` | Bookingkalender |
| `/coach/booking/requests` | Forespørsler |
| `/coach/booking/settings` | Tilgjengelighetsinnstillinger |

#### Bookingfunksjoner:
- Sette tilgjengelighet
- Godkjenne/avslå forespørsler
- Blokkere tid
- Gjentakende tilgjengelighet

---

### 5. Turneringer (Coach)

| Rute | Funksjon |
|------|----------|
| `/coach/tournaments` | Turneringskalender |
| `/coach/tournaments/players` | Spillere i turneringer |
| `/coach/tournaments/results` | Turneringsresultater |

---

### 6. Statistikk & Analyse (Coach)

| Rute | Funksjon |
|------|----------|
| `/coach/stats` | Statistikkoversikt |
| `/coach/stats/progress` | Spillerfremgang |
| `/coach/stats/regression` | Regresjonsanalyse |
| `/coach/stats/datagolf` | DataGolf-integrasjon |

#### Coach Intelligence (`/coach/alerts`)
AI-drevne varsler og innsikter:
- Spillere med nedgang
- Spillere med potensial
- Anbefalte intervensjoner
- Risikoanalyse

---

### 7. Kommunikasjon (Coach)

| Rute | Funksjon |
|------|----------|
| `/coach/messages` | Meldingsliste |
| `/coach/messages/compose` | Skriv ny melding |
| `/coach/messages/scheduled` | Planlagte meldinger |

#### Meldingsfunksjoner:
- Individuelle meldinger
- Gruppemeldinger
- Planlagte meldinger
- Maler
- Vedlegg

---

### 8. Øvelser & Maler

| Rute | Funksjon |
|------|----------|
| `/coach/exercises` | Øvelsesbibliotek |
| `/coach/exercises/mine` | Mine egne øvelser |
| `/coach/exercises/templates` | Øktmaler |
| `/coach/exercises/templates/create` | Opprett mal |
| `/coach/exercises/templates/:id/edit` | Rediger mal |

#### Malfunksjoner:
- Lagre øktmaler
- Dele maler med team
- Tilpasse per spiller
- Kategorisere maler

---

### 9. Video (Coach)

| Rute | Funksjon |
|------|----------|
| `/coach/videos` | Video-dashboard |
| `/coach/videos/:id/analyze` | Analyser spillervideo |
| `/coach/videos/compare` | Sammenlign videoer |
| `/coach/reference-videos` | Referansebibliotek |
| `/coach/proof` | Bevisvisning |

---

### 10. Planlegging & Evaluering

| Rute | Funksjon |
|------|----------|
| `/coach/planning` | Planleggingshub |
| `/coach/sessions/evaluations` | Øktevalueringer |
| `/coach/training-plans/create` | Opprett treningsplan |

---

### 11. Innstillinger

| Rute | Funksjon |
|------|----------|
| `/coach/settings` | Trenerinnstillinger |

---

## Admin-funksjoner

> **VIKTIG:** Admin har IKKE tilgang til spillerdata. Kun systemadministrasjon.

### Implementerte funksjoner

| Rute | Funksjon | Status |
|------|----------|--------|
| `/admin` | Systemoversikt | ✅ Implementert |
| `/admin/users/coaches` | Trenerhåndtering | ✅ Implementert |
| `/admin/tiers` | Tier-håndtering | ✅ Implementert |
| `/admin/feature-flags` | Feature flags | ✅ Implementert |
| `/admin/support` | Eskalert support | ✅ Implementert |

### Placeholder-funksjoner

| Rute | Funksjon | Status |
|------|----------|--------|
| `/admin/users/pending` | Ventende godkjenninger | 🔲 Placeholder |
| `/admin/users/invitations` | Invitasjoner | 🔲 Placeholder |
| `/admin/tiers/features` | Funksjoner per nivå | 🔲 Placeholder |
| `/admin/logs/audit` | Audit-logg | 🔲 Placeholder |
| `/admin/logs/errors` | Feillogg | 🔲 Placeholder |
| `/admin/config/categories` | Kategorier (A-K) | 🔲 Placeholder |
| `/admin/config/tests` | Testkonfigurasjon | 🔲 Placeholder |
| `/admin/config/notifications` | Varsler | 🔲 Placeholder |

---

## Mobil-funksjoner

### PWA & Capacitor-støtte

| Rute | Funksjon | Beskrivelse |
|------|----------|-------------|
| `/m/home` | Mobil Hjem | Forenklet dashboard |
| `/m/plan` | Mobil Plan | Dagens/ukens plan |
| `/m/log` | Hurtiglogg | Rask treningslogging |
| `/m/calendar` | Mobil Kalender | Kompakt kalender |
| `/m/calibration` | Mobil Kalibrering | Innstillinger |

### Native funksjoner (Capacitor)
- Push-varsler
- Kamera-tilgang (video)
- Offline-støtte
- Focus Mode (iOS)

---

## API-endepunkter

### Autentisering & Bruker

| Endepunkt | Metoder | Beskrivelse |
|-----------|---------|-------------|
| `/api/v1/auth` | POST | Login, register, refresh |
| `/api/v1/me` | GET | Brukerinfo |
| `/api/v1/players` | GET, POST, PUT | Spillerprofiler |
| `/api/v1/coaches` | GET, POST, PUT | Trenerprofiler |

### Trening & Aktivitet

| Endepunkt | Metoder | Beskrivelse |
|-----------|---------|-------------|
| `/api/v1/sessions` | CRUD | Treningsøkter |
| `/api/v1/exercises` | GET, POST | Øvelser |
| `/api/v1/training` | GET, POST | Treningsdata |
| `/api/v1/training-plan` | CRUD | Treningsplaner |

### Testing & Evaluering

| Endepunkt | Metoder | Beskrivelse |
|-----------|---------|-------------|
| `/api/v1/tests` | CRUD | Testprotokoller og resultater |
| `/api/v1/calibration` | GET, POST | Kalibrering |

### Statistikk & Analyse

| Endepunkt | Metoder | Beskrivelse |
|-----------|---------|-------------|
| `/api/v1/dashboard` | GET | Dashboard-data |
| `/api/v1/player-insights` | GET | Spillerinnsikt |
| `/api/v1/coach-analytics` | GET | Treneranalyse |
| `/api/v1/peer-comparison` | GET | Sammenligning |
| `/api/v1/datagolf` | GET | DataGolf-data |
| `/api/v1/breaking-points` | GET | Gap-analyse |

### Kalender & Booking

| Endepunkt | Metoder | Beskrivelse |
|-----------|---------|-------------|
| `/api/v1/calendar` | CRUD | Kalenderdata |
| `/api/v1/bookings` | CRUD | Bookinger |
| `/api/v1/availability` | GET, POST | Tilgjengelighet |

### Video

| Endepunkt | Metoder | Beskrivelse |
|-----------|---------|-------------|
| `/api/v1/videos` | CRUD | Videohåndtering |
| `/api/v1/annotations` | CRUD | Videoannotering |
| `/api/v1/comparisons` | GET, POST | Videosammenligninger |
| `/api/v1/filters` | GET | Videofiltre |

### Kommunikasjon

| Endepunkt | Metoder | Beskrivelse |
|-----------|---------|-------------|
| `/api/v1/messages` | CRUD | Meldinger |
| `/api/v1/notifications` | GET, PUT | Varsler |
| `/api/v1/comments` | CRUD | Kommentarer |
| `/api/v1/notes` | CRUD | Notater |

### Gamification

| Endepunkt | Metoder | Beskrivelse |
|-----------|---------|-------------|
| `/api/v1/achievements` | GET | Prestasjoner |
| `/api/v1/badges` | GET | Merker |

### Diverse

| Endepunkt | Metoder | Beskrivelse |
|-----------|---------|-------------|
| `/api/v1/goals` | CRUD | Målsetninger |
| `/api/v1/archive` | GET | Arkiv |
| `/api/v1/collections` | CRUD | Samlinger |
| `/api/v1/golf-courses` | GET | Golfbaner |
| `/api/v1/weather` | GET | Værdata |
| `/api/v1/skoleplan` | CRUD | Skoleplanlegging |
| `/api/v1/focus-engine` | GET | Fokusmotor |
| `/api/v1/season` | GET | Sesongdata |
| `/api/v1/plan` | CRUD | Planer |
| `/api/v1/export` | GET | Eksportfunksjoner |
| `/api/v1/emails` | POST | E-post |
| `/api/v1/admin` | CRUD | Adminfunksjoner |
| `/api/v1/ai` | POST | AI-funksjoner |

---

## Integrasjoner

### 1. DataGolf API
| Funksjon | Beskrivelse |
|----------|-------------|
| **Strokes Gained** | SG-beregninger mot Tour-standard |
| **Tour-statistikk** | Sammenlign med proffene |
| **Skill decomposition** | Detaljert breakdown |
| **Historiske data** | Rundedata og trender |

### 2. MET Norway (Vær)
| Funksjon | Beskrivelse |
|----------|-------------|
| **Sanntidsvær** | Nåværende forhold |
| **7-dagers prognose** | Fremtidig vær |
| **Treningsforhold** | Anbefaling basert på vær |
| **Bane-spesifikt** | Vær for nærmeste bane |

### 3. AWS S3
| Funksjon | Beskrivelse |
|----------|-------------|
| **Video-lagring** | Sikker lagring av videoer |
| **Presigned URLs** | Sikker tilgang |
| **Multi-part upload** | Store filer |
| **CDN** | Rask levering |

### 4. GolfBox (planlagt)
| Funksjon | Beskrivelse |
|----------|-------------|
| **Turneringsimport** | Automatisk resultatimport |
| **Handicap-sync** | Handicap-oppdateringer |
| **WAGR** | Ranking-data |

---

## Gamification

### Badge-system (85+ badges)

#### Streak Badges
| Badge | Krav |
|-------|------|
| 3-Day Streak | 3 dager på rad |
| 7-Day Streak | 7 dager på rad |
| 14-Day Streak | 14 dager på rad |
| 30-Day Streak | 30 dager på rad |
| 100-Day Streak | 100 dager på rad |

#### Volum Badges
| Badge | Krav |
|-------|------|
| 10 Hours | 10 timer trening |
| 25 Hours | 25 timer trening |
| 50 Hours | 50 timer trening |
| 100 Hours | 100 timer trening |
| 500 Hours | 500 timer trening |

#### Forbedring Badges
| Badge | Krav |
|-------|------|
| Personal Best | Ny PB på test |
| Category Up | Opprykk i kategori |
| Test Master | Bestått alle tester |
| Double Improvement | 2x forbedring på en test |

#### Deltakelse Badges
| Badge | Krav |
|-------|------|
| First Session | Første økt |
| First Test | Første test |
| First Tournament | Første turnering |
| Video Upload | Første video |
| Profile Complete | Komplett profil |

### XP-system
| Handling | XP |
|----------|-----|
| Logg økt | 10 XP |
| Gjennomfør test | 25 XP |
| Forbedring | 50 XP |
| Badge opptjent | 100 XP |
| Turnering fullført | 75 XP |

### Anti-Gaming beskyttelse
- Duplikat-sjekk
- Rimelighetskontroll
- Tidsvalidering
- Frekvensgrenser

---

## Teknisk arkitektur

### Frontend-struktur

```
apps/web/src/
├── components/          # Delte komponenter
│   ├── layout/         # App shells, navigation
│   ├── ui/             # UI primitiver
│   ├── guards/         # Route guards
│   └── shadcn/         # Shadcn/UI komponenter
├── features/           # Feature-moduler (75+)
│   ├── dashboard/
│   ├── sessions/
│   ├── tests/
│   ├── player-stats/
│   ├── coach-*/
│   └── admin-*/
├── contexts/           # React contexts
├── hooks/              # Custom hooks
├── services/           # API-klienter
├── utils/              # Hjelpefunksjoner
└── mobile/             # Mobil-spesifikke views
```

### Backend-struktur

```
apps/api/src/
├── api/v1/             # API-ruter
├── domain/             # Forretningslogikk
├── integrations/       # Eksterne API-er
├── middleware/         # Express middleware
└── utils/              # Hjelpefunksjoner
```

### Database (PostgreSQL)

```
75+ tabeller inkludert:
- users, players, coaches
- sessions, exercises
- tests, test_results
- videos, annotations
- messages, notifications
- badges, achievements
- goals, plans
- bookings, availability
```

---

## Oppsummering

| Kategori | Antall |
|----------|--------|
| **Spiller-ruter** | ~65 |
| **Trener-ruter** | ~45 |
| **Admin-ruter** | ~15 |
| **Mobil-ruter** | 5 |
| **API-endepunkter** | ~45 |
| **Feature-moduler** | 75 |
| **Database-tabeller** | 75+ |
| **Integrasjoner** | 4 |
| **Badges** | 85+ |
| **TOTALT FUNKSJONER** | ~175 |

---

*Dokumentet er automatisk generert fra kodebasen og oppdateres ved behov.*
