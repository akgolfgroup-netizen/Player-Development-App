# Trenermodul - Komplett Funksjonsoversikt

> Generert: 2026-01-01
> Versjon: 1.0
> Kilde: IUP Golf App

---

## Innholdsfortegnelse

1. [Coach Dashboard](#1-coach-dashboard)
2. [Athlete List](#2-athlete-list)
3. [Athlete Detail](#3-athlete-detail)
4. [Training Plan](#4-training-plan)
5. [Training Plan Editor](#5-training-plan-editor)
6. [Coach Notes](#6-coach-notes)
7. [Proof Viewer](#7-proof-viewer)
8. [Trajectory Viewer](#8-trajectory-viewer)
9. [Alerts & Intelligence](#9-alerts--intelligence)
10. [Groups](#10-groups)
11. [Planning Hub](#11-planning-hub)
12. [Messages](#12-messages)
13. [Exercises & Templates](#13-exercises--templates)
14. [Booking & Calendar](#14-booking--calendar)
15. [Statistics](#15-statistics)
16. [Tournaments](#16-tournaments)
17. [Athlete Status](#17-athlete-status)
18. [Session Evaluations](#18-session-evaluations)
19. [Modification Requests](#19-modification-requests)
20. [Coach Settings](#20-coach-settings)
21. [Admin Coach Management](#21-admin-coach-management)

---

## 1. Coach Dashboard

**Sti:** `apps/web/src/features/coach-dashboard/`

### Komponenter

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| CoachDashboard | `CoachDashboard.tsx` | Hovedoversikt for trenere |
| CoachPlayerAlerts | `CoachPlayerAlerts.tsx` | Varsler-widget |
| CoachWeeklyTournaments | `CoachWeeklyTournaments.tsx` | Ukens turneringer |
| CoachInjuryTracker | `CoachInjuryTracker.tsx` | Skadeoversikt |

### Funksjoner

- **Velkomsthilsen** — Personlig greeting med tid-på-dagen kontekst
- **Hurtighandlinger** — Atleter, Kalender, Treningsplaner, Meldinger, Stats, Turneringer
- **Kritiske varsler** — Ventende oppgaver som krever oppmerksomhet
- **Utøverliste** — Alfabetisk sortert med siste aktivitet
- **Ventende items** — Bevis, notater, planer som trenger handling
- **Ukens turneringer** — Kommende konkurranser
- **Skadetracker** — Oversikt over utøveres helsestatus
- **Team fokus heatmap** — Visuell oversikt over teamets fokusområder
- **Dagens plan** — Kommende økter og møter
- **Ukentlig statistikk** — Aktive spillere, økter, treningstimer, ventende items

---

## 2. Athlete List

**Sti:** `apps/web/src/features/coach-athlete-list/`

### Komponenter

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| CoachAthleteList | `CoachAthleteList.tsx` | Utøveroversikt |

### Funksjoner

- **Utøverliste** — Alle tildelte utøvere
- **Alfabetisk sortering** — Alltid sortert A-Å (ikke-forhandlingsbart)
- **Søk** — Finn utøver på navn
- **Utøvervalg** — Klikk for å se detaljer
- **Nøytral presentasjon** — Ingen rangering eller sammenligning
- **Navigasjon** — Gå til utøverdetaljer

### Designprinsipper

> **VIKTIG:** Utøverlisten skal ALLTID være alfabetisk sortert.
> Ingen prestasjons-indikatorer eller rangeringer vises.
> Alle utøvere behandles likt visuelt.

---

## 3. Athlete Detail

**Sti:** `apps/web/src/features/coach-athlete-detail/`

### Komponenter

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| CoachAthleteDetail | `CoachAthleteDetail.tsx` | Navigasjonshub for utøver |

### Funksjoner

- **Se bevis** — Videoer og bilder fra økter
- **Se utvikling** — Historisk progresjon
- **Rediger treningsplan** — Gå til planeditor
- **Notater** — Opprett og se notater
- **Statisk navigasjon** — Ingen forhåndsvalg eller prioritering
- **Ingen prestasjonsindikatorer** — Nøytral visning

### Navigasjonsvalg

```
┌─────────────────────────────────────┐
│         UTØVER: Ola Nordmann        │
├─────────────────────────────────────┤
│                                     │
│  [📹 Se Bevis]    [📈 Se Utvikling] │
│                                     │
│  [📋 Treningsplan] [📝 Notater]     │
│                                     │
└─────────────────────────────────────┘
```

---

## 4. Training Plan

**Sti:** `apps/web/src/features/coach-training-plan/`

### Komponenter

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| CoachTrainingPlan | `CoachTrainingPlan.tsx` | Treningsplan visning |

### Funksjoner

- **Neste økt** — Fremhevet visning av kommende økt
- **Kommende økter** — Liste over planlagte treninger
- **Fullførte økter** — Historikk over gjennomførte økter
- **Øktdetaljer** — Navn, beskrivelse, dato, varighet
- **Kun lesing** — Ingen redigering av fortid
- **Ingen prestasjonsutfall** — Viser ikke "effektiv blokk" etc.

### Visningsstruktur

```
┌─────────────────────────────────────┐
│  NESTE ØKT                          │
│  ┌─────────────────────────────────┐│
│  │ 🎯 Putting Drill                ││
│  │ 📅 I morgen 10:00 | ⏱️ 60 min   ││
│  └─────────────────────────────────┘│
├─────────────────────────────────────┤
│  KOMMENDE                           │
│  • Driving Range (15. jan)          │
│  • Iron Play (17. jan)              │
│  • Full Round (20. jan)             │
├─────────────────────────────────────┤
│  FULLFØRT                           │
│  • Bunker Practice (10. jan) 🔒     │
│  • Short Game (8. jan) 🔒           │
└─────────────────────────────────────┘
```

---

## 5. Training Plan Editor

**Sti:** `apps/web/src/features/coach-training-plan-editor/`

### Komponenter

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| CoachTrainingPlanEditor | `CoachTrainingPlanEditor.tsx` | Planredigering |

### Funksjoner

- **Legg til blokk** — Opprett nye treningsblokker
- **Rediger kommende** — Endre fremtidige økter
- **Slett kommende** — Fjern planlagte økter
- **Kun lesing fortid** — Låste fullførte blokker med 🔒-ikon
- **Valideringskontroll** — Kan ikke sette dato i fortiden
- **Øktskjema** — Navn, dato, beskrivelse, varighet
- **Separert visning** — Fremtid (redigerbar) vs fortid (låst)

### Redigeringsregler

| Økt-status | Kan redigere | Kan slette |
|------------|--------------|------------|
| Fremtidig | ✅ Ja | ✅ Ja |
| I dag | ✅ Ja | ✅ Ja |
| Fortid | ❌ Nei (🔒) | ❌ Nei |

---

## 6. Coach Notes

**Sti:** `apps/web/src/features/coach-notes/`

### Komponenter

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| CoachNotes | `CoachNotes.tsx` | Trenernotater |

### Funksjoner

- **Opprett notat** — Tekstområde for nye notater
- **Notathistorikk** — Sortert etter dato (nyeste først)
- **"Coach Note" label** — Tydelig merket som trenernotat
- **Levert-status** — Indikator for leverte notater
- **Kun lesing levert** — Immutable etter levering
- **Ingen inline prestasjonsdata** — Rene observasjoner
- **Vises hos utøver** — I "Fra din trener"-seksjonen

### Notat-flyt

```
Trener skriver notat
        ↓
Notat lagres som "Utkast"
        ↓
Trener sender notat
        ↓
Status: "Levert" 🔒
        ↓
Vises i utøverens "Fra din trener"
```

---

## 7. Proof Viewer

**Sti:** `apps/web/src/features/coach-proof-viewer/`

### Komponenter

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| CoachProofViewer | `CoachProofViewer.tsx` | Bevisvisning |

### Funksjoner

- **Piksel-identisk visning** — Samme som utøverens PROOF-komponent
- **Ingen rolle-forgrening** — Direkte import av delt komponent
- **Absolutt paritet** — Trener og utøver ser nøyaktig det samme
- **Video-visning** — Se treningsvideoer
- **Bilde-visning** — Se treningsbilder
- **Metadata** — Dato, økt-tilknytning

### Designprinsipp

> **VIKTIG:** CoachProofViewer bruker nøyaktig samme komponent
> som utøveren. Ingen ekstra overskrifter, titler eller labels.
> Perfekt visuell paritet er påkrevd.

---

## 8. Trajectory Viewer

**Sti:** `apps/web/src/features/coach-trajectory-viewer/`

### Komponenter

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| CoachTrajectoryViewer | `CoachTrajectoryViewer.tsx` | Utviklingsvisning |

### Funksjoner

- **Identisk med utøver** — Samme TRAJECTORY-komponent
- **Ingen trender** — Viser ikke oppsummeringer
- **Ingen tolkning** — Rå data uten analyse
- **Direkte import** — Delt komponent
- **Absolutt paritet** — Samme visning for begge roller

### Designprinsipp

> **VIKTIG:** Trajectory-visningen skal være identisk for
> trener og utøver. Ingen ekstra kontekst eller analyse legges til.

---

## 9. Alerts & Intelligence

**Sti:** `apps/web/src/features/coach-intelligence/`

### Komponenter

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| CoachAlertsPage | `CoachAlertsPage.tsx` | Varslingsfeed |

### Funksjoner

- **Filter** — Alle eller uleste varsler
- **Alfabetisk sortering** — Etter utøvernavn
- **Varseltyper:**
  - 📹 Bevis lastet opp
  - 📋 Plan venter
  - 📝 Notat-forespørsel
  - 🏆 Milepæl oppnådd
- **Status-indikatorer** — Ulest-prikk, tid siden
- **Automatisk lest** — Markeres ved klikk
- **Ingen rangering** — Nøytral presentasjon

### Varsel-struktur

```
┌─────────────────────────────────────┐
│ 🔵 Ola Nordmann                     │
│ 📹 Lastet opp bevis                 │
│ 2 timer siden                       │
├─────────────────────────────────────┤
│    Kari Hansen                      │
│ 📋 Treningsplan venter godkjenning  │
│ 5 timer siden                       │
├─────────────────────────────────────┤
│ 🔵 Per Olsen                        │
│ 🏆 Oppnådde milepæl: 100 økter      │
│ 1 dag siden                         │
└─────────────────────────────────────┘
```

---

## 10. Groups

**Sti:** `apps/web/src/features/coach-groups/`

### Komponenter

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| CoachGroupList | `CoachGroupList.tsx` | Gruppeoversikt |
| CoachGroupDetail | `CoachGroupDetail.tsx` | Gruppedetaljer |
| CoachGroupCreate | `CoachGroupCreate.tsx` | Opprett gruppe |
| CoachGroupPlan | `CoachGroupPlan.tsx` | Gruppeplan |

### Funksjoner

- **Gruppeliste** — Alle trenerens grupper
- **Gruppetyper** — WANG, Team Norway, Egendefinert
- **Hurtigstatistikk** — Totalt grupper, medlemmer, grupper med plan
- **Søk og filter** — Etter type
- **Opprett gruppe** — Ny gruppe med navn og type
- **Rediger gruppe** — Endre gruppeinfo
- **Medlemshåndtering** — Legg til/fjern medlemmer
- **Gruppeplan** — Felles treningsplan for gruppe
- **Slett gruppe** — Med bekreftelsesmodal
- **Medlemsforhåndsvisning** — Avatar-stack

### Gruppetyper

| Type | Beskrivelse |
|------|-------------|
| WANG | WANG-program utøvere |
| Team Norway | Landslagsutøvere |
| Custom | Egendefinerte grupper |

---

## 11. Planning Hub

**Sti:** `apps/web/src/features/coach-planning/`

### Komponenter

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| CoachPlanningHub | `CoachPlanningHub.tsx` | Planleggingssenter |

### Funksjoner

- **Fane-veksling** — Spillere vs Grupper
- **Spillerkort** — Med planstatus-indikator
- **Gruppekort** — Med planstatus
- **Hurtigstatistikk:**
  - Spillere med/uten plan
  - Grupper med/uten plan
- **Søk** — Etter navn
- **Filter** — Etter planstatus
- **Navigasjon** — Til individuell planeditor
- **HCP-visning** — Handicap og kategori for spillere
- **Medlemstall** — For grupper

### Visningsstruktur

```
┌─────────────────────────────────────┐
│ [Spillere]  [Grupper]               │
├─────────────────────────────────────┤
│ 📊 Med plan: 12  |  Uten plan: 3   │
├─────────────────────────────────────┤
│ 🔍 Søk...           [Filter ▼]      │
├─────────────────────────────────────┤
│ ┌─────────┐ ┌─────────┐ ┌─────────┐│
│ │ Ola N.  │ │ Kari H. │ │ Per O.  ││
│ │ HCP 5.2 │ │ HCP 8.1 │ │ HCP 3.4 ││
│ │ ✅ Plan │ │ ⚠️ Ingen│ │ ✅ Plan ││
│ └─────────┘ └─────────┘ └─────────┘│
└─────────────────────────────────────┘
```

---

## 12. Messages

**Sti:** `apps/web/src/features/coach-messages/`

### Komponenter

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| CoachMessageList | `CoachMessageList.tsx` | Sendte meldinger |
| CoachMessageCompose | `CoachMessageCompose.tsx` | Skriv melding |
| CoachScheduledMessages | `CoachScheduledMessages.tsx` | Planlagte meldinger |

### Funksjoner

- **Meldingsliste** — Sendte meldinger med forhåndsvisning
- **Søk** — I meldinger
- **Kategorier:**
  - 🏋️ Trening
  - 🏆 Turnering
  - ⚠️ Viktig
  - 📢 Generelt
- **Status-indikatorer:**
  - ⏳ Venter
  - ✅ Levert
  - 👁️ Lest
- **Mottakertype** — Spiller, gruppe, alle
- **Vedlegg-indikator** — Viser om melding har vedlegg
- **Skriv ny** — Komponer melding
- **Planlegg** — Send senere

### Meldingsflyt

```
Skriv melding
      ↓
Velg mottaker(e)
      ↓
  [Send nå]  eller  [Planlegg]
      ↓                ↓
Status: Levert    Status: Planlagt
      ↓                ↓
   (venter)        (sendes automatisk)
      ↓
Status: Lest 👁️
```

---

## 13. Exercises & Templates

**Sti:** `apps/web/src/features/coach-exercises/`

### Komponenter

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| CoachExerciseLibrary | `CoachExerciseLibrary.tsx` | Øvelsesbibliotek |
| CoachMyExercises | `CoachMyExercises.tsx` | Mine øvelser |
| CoachExerciseTemplates | `CoachExerciseTemplates.tsx` | Øktmaler |
| CoachSessionTemplateEditor | `CoachSessionTemplateEditor.tsx` | Malredigering |

### Funksjoner

- **Øvelsesbibliotek** — Alle tilgjengelige øvelser
- **7 kategorier:**
  - 🎯 Putting
  - 🏌️ Driving
  - ⛳ Iron
  - 🔺 Wedge
  - ⛱️ Bunker
  - 🧠 Mental
  - 💪 Fitness
- **Vanskelighetsgrader** — Beginner, Intermediate, Advanced
- **Søk og filter** — Etter kategori, vanskelighet, nøkkelord
- **Øvelsesdetaljer:**
  - Navn og beskrivelse
  - Varighet
  - Utstyr
  - Rating
- **Video/guide-indikatorer** — Viser om øvelse har media
- **Favoritter** — Merk favorittøvelser
- **Brukstall** — Hvor ofte øvelsen er brukt
- **Egne øvelser** — Opprett custom øvelser
- **Øktmaler** — Ferdiglagde øktstrukturer

---

## 14. Booking & Calendar

**Sti:** `apps/web/src/features/coach-booking/`

### Komponenter

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| CoachBookingCalendar | `CoachBookingCalendar.tsx` | Ukekalender |
| CoachBookingRequests | `CoachBookingRequests.tsx` | Booking-forespørsler |
| CoachBookingSettings | `CoachBookingSettings.tsx` | Tilgjengelighet |

### Funksjoner

- **Ukevisning** — 7 dagers kalender
- **Tidsluker** — 09:00-17:00 (konfigurerbart)
- **Booking-statuser:**
  - 🟢 Tilgjengelig
  - 🔵 Booket
  - 🟡 Venter
  - 🔴 Blokkert
- **Hurtigstatistikk** — Booket, ventende, tilgjengelig
- **Forespørselshåndtering** — Godkjenn/avslå
- **Sett tilgjengelighet** — Blokker tider
- **Uke-navigasjon** — Forrige/neste/i dag
- **Booking-detaljer** — Modal med utøverinfo
- **Økttype** — Hvilken type trening
- **Spillernotater** — Forhåndsinformasjon

### Kalendervisning

```
┌─────────────────────────────────────────────────────┐
│  [◀]  Uke 2, 2026  [▶]              [I dag]        │
├───────┬───────┬───────┬───────┬───────┬───────┬────┤
│  Man  │  Tir  │  Ons  │  Tor  │  Fre  │  Lør  │Søn │
├───────┼───────┼───────┼───────┼───────┼───────┼────┤
│ 09:00 │       │ 🔵    │       │ 🟡    │       │    │
│ 10:00 │ 🔵    │       │ 🔵    │       │ 🔴    │    │
│ 11:00 │       │ 🔵    │       │       │ 🔴    │    │
│ ...   │       │       │       │       │       │    │
└───────┴───────┴───────┴───────┴───────┴───────┴────┘
```

---

## 15. Statistics

**Sti:** `apps/web/src/features/coach-statistics/`

### Komponenter

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| CoachStatsOverview | `CoachStatsOverview.tsx` | Statistikk-dashboard |
| CoachStatsProgress | `CoachStatsProgress.tsx` | Forbedring |
| CoachStatsRegression | `CoachStatsRegression.tsx` | Nedgang |
| CoachDataGolf | `CoachDataGolf.tsx` | DataGolf-integrasjon |

### Funksjoner

- **Hurtigstatistikk:**
  - 📈 Forbedring (antall)
  - 📉 Nedgang (antall)
  - 📊 Gjennomsnittlig HCP-endring
  - 🏋️ Totalt økter
- **Kategorioversikt** — A, B, C med gjennomsnitt
- **Spillerliste** — Med trendindikator
- **Trend-typer:**
  - ⬆️ Opp (grønn)
  - ⬇️ Ned (rød)
  - ➡️ Stabil (grå)
- **HCP-visning** — Nåværende og endring
- **Økttall** — Antall og frekvens
- **Turneringsresultater** — Scores
- **Høydepunkter** — Prestasjoner per utøver
- **Sortering** — Trend, navn, HCP, aktivitet
- **Søk og filter** — Etter kategori

---

## 16. Tournaments

**Sti:** `apps/web/src/features/coach-tournaments/`

### Komponenter

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| CoachTournamentCalendar | `CoachTournamentCalendar.tsx` | Turneringskalender |
| CoachTournamentPlayers | `CoachTournamentPlayers.tsx` | Deltakere |
| CoachTournamentResults | `CoachTournamentResults.tsx` | Resultater |

### Funksjoner

- **Turneringskalender** — Oversikt over konkurranser
- **Kommende turneringer** — Fremtidige events
- **Deltakerliste** — Hvilke utøvere deltar
- **Resultater** — Historiske resultater
- **Prestasjonsanalyse** — Sammenligning over tid

---

## 17. Athlete Status

**Sti:** `apps/web/src/features/coach-athlete-status/`

### Komponenter

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| CoachAthleteStatus | `CoachAthleteStatus.tsx` | Status-oversikt |

### Funksjoner

- **Utøverstatus** — Oversikt over alle utøvere
- **Skadetracking** — Registrer og følg skader
- **Tilgjengelighet** — Hvem kan trene
- **Status-indikatorer:**
  - 🟢 Klar
  - 🟡 Begrenset
  - 🔴 Skadet/utilgjengelig

---

## 18. Session Evaluations

**Sti:** `apps/web/src/features/coach-session-evaluations/`

### Komponenter

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| CoachSessionEvaluations | `CoachSessionEvaluations.tsx` | Øktevalueringer |

### Funksjoner

- **Evalueringsskjema** — Vurder gjennomførte økter
- **Prestasjonsnotater** — Dokumenter observasjoner
- **Rating-system** — Vurder øktens kvalitet
- **Oppfølgingspunkter** — Hva bør jobbes med

---

## 19. Modification Requests

**Sti:** `apps/web/src/features/coach/`

### Komponenter

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| ModificationRequestDashboard | `ModificationRequestDashboard.jsx` | Endringsforespørsler |

### Funksjoner

- **Filter etter status:**
  - ⏳ Venter
  - 🔍 Under vurdering
  - ✅ Løst
  - ❌ Avvist
- **Utøverbekymringer** — Hva ønsker de endret
- **Notater** — Utøverens begrunnelse
- **Svar-grensesnitt** — Responder på forespørsler
- **Status-tracking** — Følg behandling
- **Hastegrad:**
  - 🟢 Lav
  - 🟡 Medium
  - 🔴 Høy
- **Detaljert svar** — Skriv forklaring
- **Datoer** — Opprettet og behandlet

### Forespørsel-flyt

```
Utøver sender forespørsel
         ↓
Status: Venter ⏳
         ↓
Trener åpner forespørsel
         ↓
Status: Under vurdering 🔍
         ↓
    ┌────┴────┐
    ↓         ↓
Godkjenn    Avslå
    ↓         ↓
Status: ✅  Status: ❌
```

---

## 20. Coach Settings

**Sti:** `apps/web/src/features/coach-settings/`

### Komponenter

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| CoachSettings | `CoachSettings.tsx` | Innstillinger |

### Funksjoner

- **Profiladministrasjon** — Oppdater personlig info
- **Varslingspreferanser** — Hvilke varsler du vil ha
- **Systeminnstillinger** — App-konfigurasjon
- **Tilgjengelighetstider** — Standard arbeidstider
- **Notifikasjoner** — E-post, push, SMS

---

## 21. Admin Coach Management

**Sti:** `apps/web/src/features/admin-coach-management/`

### Komponenter

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| AdminCoachManagement | `AdminCoachManagement.tsx` | Treneradministrasjon |

### Funksjoner

- **Liste alle trenere** — Oversikt over alle trenere
- **Aktiv/inaktiv toggle** — Aktiver eller deaktiver trener
- **E-post-visning** — Kontaktinformasjon
- **Ingen prestasjonsdata** — Trenere evalueres ikke
- **Brukeradministrasjon** — Behandles som brukere

---

## Navigasjonsstruktur

```
/coach                          → Coach Dashboard
/coach/athletes                 → Athlete List
/coach/athletes/:id             → Athlete Detail
/coach/athletes/:id/plan        → Training Plan
/coach/athletes/:id/plan/edit   → Training Plan Editor
/coach/athletes/:id/notes       → Coach Notes
/coach/athletes/:id/proof       → Proof Viewer
/coach/athletes/:id/trajectory  → Trajectory Viewer
/coach/alerts                   → Alerts & Intelligence
/coach/groups                   → Groups List
/coach/groups/:id               → Group Detail
/coach/groups/create            → Create Group
/coach/planning                 → Planning Hub
/coach/messages                 → Messages
/coach/messages/compose         → Compose Message
/coach/exercises                → Exercise Library
/coach/exercises/my             → My Exercises
/coach/exercises/templates      → Session Templates
/coach/booking                  → Booking Calendar
/coach/booking/requests         → Booking Requests
/coach/booking/settings         → Availability Settings
/coach/statistics               → Statistics Overview
/coach/tournaments              → Tournaments
/coach/modification-requests    → Modification Requests
/coach/settings                 → Coach Settings
/admin/coaches                  → Admin Coach Management
```

---

## Designprinsipper for Trenermodulen

### 1. Nøytralitet
- Ingen rangering av utøvere
- Alfabetisk sortering alltid
- Ingen "beste" eller "verste" indikatorer

### 2. Paritet
- Proof Viewer = identisk med utøver
- Trajectory Viewer = identisk med utøver
- Ingen ekstra analyse-lag

### 3. Immutabilitet
- Fortid kan ikke endres
- Leverte notater er låst
- Fullførte økter er read-only

### 4. Klarhet
- Tydelig merking av trenernotater
- Klare status-indikatorer
- Separasjon mellom trener/system-data

---

## Totalt

- **21 hovedkategorier**
- **50+ komponenter**
- **150+ funksjoner**
- **25+ ruter**

---

*Dokumentet er generert automatisk fra kodebase-analyse.*
