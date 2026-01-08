# TIER Golf IUP - Komplett Funksjonsoversikt

Sist oppdatert: 2024-12-30

---

## 🏠 SPILLER-FUNKSJONER

### 📊 Dashboard & Profil
| Route | Funksjon | Beskrivelse |
|-------|----------|-------------|
| `/dashboard` | Dashboard | Hovedoversikt med ukestatus, badges, siste 7 dager |
| `/dashboard-v2` | Dashboard V2 | Alternativ dashboard-visning |
| `/profil` | Min profil | Profilinformasjon og innstillinger |
| `/profil/oppdater` | Oppdater profil | Rediger profilinformasjon |
| `/progress` | Fremgang | Fremgangsoversikt og utvikling |

### 🏋️ Trening & Økter
| Route | Funksjon | Beskrivelse |
|-------|----------|-------------|
| `/trening/dagbok` | Treningsdagbok | Ukentlig heatmap, øktliste, filtrering |
| `/trening/logg` | Logg trening | Registrer ny treningsøkt |
| `/trening/dagens` | Dagens trening | Dagens planlagte trening |
| `/trening/ukens` | Ukens trening | Ukens treningsplan |
| `/trening/teknisk` | Teknisk trening | Teknikkfokusert trening |
| `/session/new` | Ny økt | Opprett ny treningsøkt |
| `/session/:sessionId` | Økt detaljer | Vis økt-informasjon |
| `/session/:sessionId/active` | Aktiv økt | Gjennomfør økt |
| `/session/:sessionId/reflection` | Refleksjon | Økt-refleksjon etter trening |
| `/session/:sessionId/evaluate` | Evaluering | Evaluer gjennomført økt |
| `/session/stats` | Økt-statistikk | Statistikk for økter |
| `/sessions` | Alle økter | Liste over alle økter |
| `/treningsprotokoll` | Treningsprotokoll | Historikk over trening |
| `/treningsstatistikk` | Treningsstatistikk | Statistikk for trening |

### 📅 Kalender & Planlegging
| Route | Funksjon | Beskrivelse |
|-------|----------|-------------|
| `/kalender` | Kalender | Hovedkalender |
| `/kalender/dag` | Dag-visning | Detaljert dagvisning |
| `/kalender/oversikt` | Kalender oversikt | Måneds/uke-oversikt |
| `/kalender/booking` | Book trener | Bestill trenertimer |
| `/aarsplan` | Årsplan | Årlig planlegging |
| `/aarsplan/perioder` | Perioder | Periodeplanlegging |
| `/aarsplan/fokus` | Fokusområder | Fokusområder i årsplan |
| `/periodeplaner` | Periodeplaner | Detaljerte periodeplaner |
| `/plan-preview/:planId` | Plan forhåndsvisning | Se plan før aktivering |

### 📈 Statistikk & Analyse
| Route | Funksjon | Beskrivelse |
|-------|----------|-------------|
| `/statistikk` | Statistikk | Hovedside for statistikk |
| `/statistikk/status` | Status & Mål | Statusoversikt og måloppnåelse |
| `/statistikk/strokes-gained` | Strokes Gained | Strokes Gained analyse |
| `/statistikk/testresultater` | Testresultater | Testresultater og utvikling |
| `/stats` | Stats (gammel) | Eldre statistikk-side |
| `/stats/ny` | Ny stats | Registrer ny statistikk |
| `/stats/turnering` | Turneringsstats | Turneringsstatistikk |
| `/stats/verktoy` | Stats verktøy | Analyseverktøy |

### 🧪 Testing & Evaluering
| Route | Funksjon | Beskrivelse |
|-------|----------|-------------|
| `/testprotokoll` | Testprotokoll | Testhistorikk |
| `/testresultater` | Testresultater | Resultater fra tester |
| `/testing/krav` | Kategori-krav | Krav per kategori |
| `/testing/registrer` | Registrer test | Registrer ny test |
| `/evaluering` | Evaluering | Evalueringsoversikt |
| `/evaluering/trening` | Treningsevaluering | Evaluer treningsøkter |
| `/evaluering/turnering` | Turneringsevaluering | Evaluer turneringer |
| `/bevis` | Bevis | Bevis og dokumentasjon |

### 📈 Utvikling & Fremgang
| Route | Funksjon | Beskrivelse |
|-------|----------|-------------|
| `/utvikling` | Utvikling | Utviklingsoversikt |
| `/utvikling/breaking-points` | Breaking Points | Identifiser breaking points |
| `/utvikling/kategori` | Kategori fremgang | Fremgang per kategori |
| `/utvikling/benchmark` | Benchmark | Sammenlign med benchmark |

### 🏆 Turneringer
| Route | Funksjon | Beskrivelse |
|-------|----------|-------------|
| `/turneringskalender` | Turneringskalender | Kalender med turneringer |
| `/turneringer/planlegger` | Turneringsplanlegger | Planlegg turneringsdeltakelse |
| `/mine-turneringer` | Mine turneringer | Oversikt over egne turneringer |
| `/turneringer/resultater` | Turneringsresultater | Resultater fra turneringer |
| `/turneringer/registrer` | Registrer resultat | Registrer turneringsresultat |

### 🎯 Mål & Achievements
| Route | Funksjon | Beskrivelse |
|-------|----------|-------------|
| `/maalsetninger` | Målsetninger | Sett og følg mål |
| `/goals` | Goals (ny) | Ny målsetnings-side |
| `/achievements` | Achievements | Oppnådde achievements |
| `/badges` | Badges | Merker og utmerkelser |

### 📚 Øvelser & Ressurser
| Route | Funksjon | Beskrivelse |
|-------|----------|-------------|
| `/oevelser` | Øvelser | Øvelsesoversikt |
| `/ovelsesbibliotek` | Øvelsesbibliotek | Bibliotek med øvelser |
| `/ressurser` | Ressurser | Kunnskapsbase og ressurser |

### 🎬 Video
| Route | Funksjon | Beskrivelse |
|-------|----------|-------------|
| `/videos` | Videoer | Videobibliotek |
| `/videos/:videoId/analyze` | Videoanalyse | Analyser video |
| `/videos/compare` | Sammenlign | Sammenlign videoer |
| `/videos/progress` | Video fremgang | Fremgang via video |

### 💬 Kommunikasjon
| Route | Funksjon | Beskrivelse |
|-------|----------|-------------|
| `/meldinger` | Meldinger | Meldingsoversikt |
| `/meldinger/ny` | Ny melding | Skriv ny melding |
| `/meldinger/:conversationId` | Samtale | Vis samtale |
| `/meldinger/trener` | Fra trener | Meldinger fra trener |
| `/varsler` | Varsler | Varsler og notifikasjoner |

### 📝 Annet
| Route | Funksjon | Beskrivelse |
|-------|----------|-------------|
| `/notater` | Notater | Personlige notater |
| `/arkiv` | Arkiv | Arkiverte elementer |
| `/trenerteam` | Trenerteam | Oversikt over trenere |
| `/skoleplan` | Skoleplan | Skoleplanlegging |
| `/skole/oppgaver` | Skoleoppgaver | Skoleoppgaver |
| `/samlinger` | Samlinger | Treningssamlinger |
| `/innstillinger/varsler` | Varselinnstillinger | Innstillinger for varsler |
| `/kalibrering` | Kalibrering | Kalibrering av verdier |

---

## 👨‍🏫 TRENER-FUNKSJONER (Coach)

### 📊 Dashboard & Utøvere
| Route | Funksjon | Beskrivelse |
|-------|----------|-------------|
| `/coach` | Coach Dashboard | Hovedoversikt for trener |
| `/coach/athletes` | Utøverliste | Liste over alle utøvere |
| `/coach/athletes/status` | Utøverstatus | Statusoversikt for utøvere |
| `/coach/athletes/tournaments` | Utøver-turneringer | Turneringer for utøvere |
| `/coach/athletes/:athleteId` | Utøver detaljer | Detaljert utøvervisning |
| `/coach/athletes/:athleteId/notes` | Utøver notater | Notater for utøver |
| `/coach/athletes/:athleteId/plan` | Utøver plan | Treningsplan for utøver |
| `/coach/athletes/:athleteId/plan/edit` | Rediger plan | Rediger utøvers plan |
| `/coach/athletes/:athleteId/trajectory` | Trajectory | Utviklingsbane for utøver |
| `/coach/players/:playerId` | Spiller | Spilleroversikt |

### 📋 Planlegging
| Route | Funksjon | Beskrivelse |
|-------|----------|-------------|
| `/coach/planning` | Planning Hub | Planleggingssenter |
| `/coach/training-plans/create` | Opprett plan | Lag ny treningsplan |
| `/coach/modification-requests` | Endringsforespørsler | Forespørsler om endringer |

### 👥 Grupper
| Route | Funksjon | Beskrivelse |
|-------|----------|-------------|
| `/coach/groups` | Grupper | Gruppeoversikt |
| `/coach/groups/create` | Opprett gruppe | Lag ny gruppe |
| `/coach/groups/:groupId` | Gruppe detaljer | Vis gruppe |
| `/coach/groups/:groupId/edit` | Rediger gruppe | Endre gruppe |
| `/coach/groups/:groupId/plan` | Gruppeplan | Plan for gruppe |

### 📅 Booking
| Route | Funksjon | Beskrivelse |
|-------|----------|-------------|
| `/coach/booking` | Booking | Booking-oversikt |
| `/coach/booking/requests` | Forespørsler | Booking-forespørsler |
| `/coach/booking/settings` | Innstillinger | Booking-innstillinger |

### 🏆 Turneringer
| Route | Funksjon | Beskrivelse |
|-------|----------|-------------|
| `/coach/tournaments` | Turneringer | Turneringsoversikt |
| `/coach/tournaments/players` | Spillere | Spillere i turneringer |
| `/coach/tournaments/results` | Resultater | Turneringsresultater |

### 📈 Statistikk
| Route | Funksjon | Beskrivelse |
|-------|----------|-------------|
| `/coach/stats` | Statistikk | Coach statistikk |
| `/coach/stats/progress` | Fremgang | Fremgangsstatistikk |
| `/coach/stats/regression` | Regression | Regresjonsanalyse |
| `/coach/stats/datagolf` | DataGolf | DataGolf-integrasjon |

### 💬 Kommunikasjon
| Route | Funksjon | Beskrivelse |
|-------|----------|-------------|
| `/coach/messages` | Meldinger | Meldingsoversikt |
| `/coach/messages/compose` | Skriv melding | Ny melding |
| `/coach/messages/scheduled` | Planlagte | Planlagte meldinger |
| `/coach/alerts` | Varsler | Varsler og alerts |

### 🏋️ Øvelser & Maler
| Route | Funksjon | Beskrivelse |
|-------|----------|-------------|
| `/coach/exercises` | Øvelser | Øvelsesoversikt |
| `/coach/exercises/mine` | Mine øvelser | Egne øvelser |
| `/coach/exercises/templates` | Maler | Øvelsesmaler |
| `/coach/exercises/templates/create` | Ny mal | Opprett mal |
| `/coach/exercises/templates/:templateId/edit` | Rediger mal | Endre mal |

### 🎬 Video
| Route | Funksjon | Beskrivelse |
|-------|----------|-------------|
| `/coach/videos` | Videoer | Videooversikt |
| `/coach/videos/:videoId/analyze` | Analyser | Videoanalyse |
| `/coach/videos/compare` | Sammenlign | Sammenlign videoer |
| `/coach/reference-videos` | Referansevideoer | Referansebibliotek |

### 📝 Annet
| Route | Funksjon | Beskrivelse |
|-------|----------|-------------|
| `/coach/proof` | Bevis | Bevisgjennomgang |
| `/coach/sessions/evaluations` | Økt-evalueringer | Evaluer økter |
| `/coach/settings` | Innstillinger | Coach-innstillinger |

---

## 🔧 ADMIN-FUNKSJONER

### 👤 Brukeradministrasjon
| Route | Funksjon | Beskrivelse |
|-------|----------|-------------|
| `/admin` | Admin Dashboard | Hovedoversikt |
| `/admin/users/coaches` | Trenere | Administrer trenere |
| `/admin/users/pending` | Ventende | Ventende brukere |
| `/admin/users/invitations` | Invitasjoner | Håndter invitasjoner |

### 💎 Tiers & Features
| Route | Funksjon | Beskrivelse |
|-------|----------|-------------|
| `/admin/tiers` | Tiers | Tier-administrasjon |
| `/admin/tiers/features` | Features | Funksjoner per tier |
| `/admin/feature-flags` | Feature Flags | Feature toggles |

### 📋 Logger & Support
| Route | Funksjon | Beskrivelse |
|-------|----------|-------------|
| `/admin/support` | Support | Support/eskalering |
| `/admin/logs/audit` | Audit-logg | Revisjonslogg |
| `/admin/logs/errors` | Feillogg | Feil og exceptions |

### ⚙️ Konfigurasjon
| Route | Funksjon | Beskrivelse |
|-------|----------|-------------|
| `/admin/config/categories` | Kategorier | Kategori-oppsett |
| `/admin/config/tests` | Tester | Test-konfigurasjon |
| `/admin/config/notifications` | Varsler | Varsel-konfigurasjon |

---

## 📱 MOBILE-FUNKSJONER

| Route | Funksjon | Beskrivelse |
|-------|----------|-------------|
| `/m/home` | Hjem | Mobil hovedside |
| `/m/plan` | Plan | Mobil planvisning |
| `/m/log` | Quick Log | Rask logging |
| `/m/calendar` | Kalender | Mobil kalender |
| `/m/calibration` | Kalibrering | Mobil kalibrering |

---

## 🔐 AUTENTISERING

| Route | Funksjon | Beskrivelse |
|-------|----------|-------------|
| `/login` | Logg inn | Innloggingsside |
| `/welcome` | Velkommen | Landing page |

---

## 🧪 DEV/LAB (Kun utvikling)

| Route | Funksjon | Beskrivelse |
|-------|----------|-------------|
| `/ui-lab` | UI Lab | UI komponent-testing |
| `/stats-lab` | Stats Lab | Statistikk-testing |
| `/appshell-lab` | AppShell Lab | Layout-testing |
| `/calendar-lab` | Calendar Lab | Kalender-testing |
| `/ui-canon` | UI Canon | Design system referanse |

---

## 📊 SAMMENDRAG

| Kategori | Antall Routes |
|----------|---------------|
| Dashboard & Profil | 5 |
| Trening & Økter | 14 |
| Kalender & Planlegging | 9 |
| Statistikk & Analyse | 8 |
| Testing & Evaluering | 7 |
| Utvikling & Fremgang | 4 |
| Turneringer | 5 |
| Mål & Achievements | 4 |
| Øvelser & Ressurser | 3 |
| Video | 4 |
| Kommunikasjon | 5 |
| Annet (spiller) | 8 |
| **Spiller totalt** | **76** |
| | |
| Coach Dashboard & Utøvere | 10 |
| Coach Planlegging | 3 |
| Coach Grupper | 5 |
| Coach Booking | 3 |
| Coach Turneringer | 3 |
| Coach Statistikk | 4 |
| Coach Kommunikasjon | 4 |
| Coach Øvelser | 5 |
| Coach Video | 4 |
| Coach Annet | 3 |
| **Coach totalt** | **44** |
| | |
| **Admin totalt** | **13** |
| **Mobile totalt** | **5** |
| **Auth totalt** | **2** |
| **Dev/Lab totalt** | **5** |
| | |
| **TOTALT** | **~145 routes** |

---

## 🔗 Navigasjonsstruktur

```
/ (Landing/Welcome)
├── /login
├── /dashboard (Hovedside etter innlogging)
│
├── /trening/
│   ├── dagbok
│   ├── logg
│   ├── dagens
│   ├── ukens
│   └── teknisk
│
├── /kalender/
│   ├── (hovedkalender)
│   ├── dag
│   ├── oversikt
│   └── booking
│
├── /statistikk/
│   ├── (hovedside)
│   ├── status
│   ├── strokes-gained
│   └── testresultater
│
├── /turneringer/
│   ├── planlegger
│   ├── resultater
│   └── registrer
│
├── /utvikling/
│   ├── (hovedside)
│   ├── breaking-points
│   ├── kategori
│   └── benchmark
│
├── /coach/ (Trener-portal)
│   ├── athletes/
│   ├── groups/
│   ├── booking/
│   ├── tournaments/
│   ├── stats/
│   ├── messages/
│   ├── exercises/
│   ├── videos/
│   └── ...
│
├── /admin/ (Admin-portal)
│   ├── users/
│   ├── tiers/
│   ├── logs/
│   └── config/
│
└── /m/ (Mobile)
    ├── home
    ├── plan
    ├── log
    ├── calendar
    └── calibration
```
