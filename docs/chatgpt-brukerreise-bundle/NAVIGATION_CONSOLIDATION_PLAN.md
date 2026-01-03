# Navigasjon & Feature Konsolideringsplan

> Opprettet: 2025-12-31
> Status: Planlegging

## Oversikt

Redusere 78 feature-mapper til ~50 og forenkle navigasjonsstrukturen.

---

## Nåværende Menystruktur (Implementert)

```
HOVEDMENY (4 tabs)
├── Hjem
├── Aktivitet → Treningsplan | Treningslogg | Testing
├── Fremgang → Statistikk | Video | Prestasjoner
└── Plan → Kalender | Turneringer | Mål & Plan

BURGER (☰)
├── Profil → Min profil | Trenerteam
├── Meldinger → Innboks | Varsler
├── Innstillinger → Konto | Varsler | Kalibrering
└── Ressurser → Bibliotek | Notater & Arkiv
```

---

## Fase 1: Kritisk (Uke 1)

### 1.1 Statistikk-konsolidering

**Problem:** 4 separate statistikk-systemer

| Nåværende | Rute | Status |
|-----------|------|--------|
| `/stats` (StatsPageV2) | `/stats` | Aktiv |
| `/stats-pages` (4 containers) | `/stats/ny`, `/stats/turnering`, etc. | Legacy |
| `/player-stats` (14 komponenter) | `/statistikk` | Ny hub |
| `/training` (TreningsstatistikkContainer) | `/treningsstatistikk` | Aktiv |

**Løsning:**
```
/statistikk (StatistikkHub)
├── /statistikk/oversikt     → Hovedoversikt (fra StatsPageV2)
├── /statistikk/strokes-gained → Strokes Gained analyse
├── /statistikk/tester       → Testresultater
├── /statistikk/trening      → Treningsstatistikk
├── /statistikk/turnering    → Turneringsstatistikk
└── /statistikk/benchmark    → Benchmark-sammenligning
```

**Oppgaver:**
- [ ] Flytt StatsPageV2 innhold til StatistikkHub
- [ ] Integrer `/stats-pages` containers som tabs
- [ ] Fjern duplikate ruter
- [ ] Oppdater navigasjonsdata

---

### 1.2 Turnering-konsolidering

**Problem:** 3 separate turnering-systemer

| Nåværende | Type | Status |
|-----------|------|--------|
| `/tournaments` (4 containers) | Legacy player | Utdatert |
| `/tournament-calendar` (TypeScript) | Ny player | Aktiv |
| `/coach-tournaments` | Coach | Aktiv |

**Løsning:**
```
/turneringer (TournamentHub)
├── /turneringer/kalender    → Turneringskalender
├── /turneringer/mine        → Mine turneringer
├── /turneringer/resultater  → Resultater
└── /turneringer/registrer   → Registrer resultat

/coach/turneringer (CoachTournamentHub)
├── /coach/turneringer       → Oversikt
├── /coach/turneringer/spillere → Spilleroversikt
└── /coach/turneringer/resultater → Alle resultater
```

**Oppgaver:**
- [ ] Migrer `/tournaments` til `/tournament-calendar`
- [ ] Oppdater alle ruter til `/turneringer`
- [ ] Arkiver legacy `/tournaments` mappe
- [ ] Oppdater navigasjonsdata

---

## Fase 2: Høy prioritet (Uke 2)

### 2.1 Video-konsolidering

**Problem:** 5 separate video-features

| Nåværende | Funksjon |
|-----------|----------|
| `/video-library` | Videobibliotek |
| `/video-analysis` | Analyserverktøy |
| `/video-comparison` | Sammenligning |
| `/video-progress` | Fremgangsvisning |
| `/coach-videos` | Coach-administrasjon |

**Løsning:**
```
/video (VideoHub)
├── /video              → Bibliotek (liste)
├── /video/:id          → Enkelt video
├── /video/:id/analyse  → Analyseverktøy
├── /video/sammenlign   → Sammenligningsverktøy
└── /video/fremgang     → Swing-tidslinje

/coach/video (CoachVideoHub)
├── /coach/video            → Dashboard
├── /coach/video/venter     → Venter på gjennomgang
├── /coach/video/referanse  → Referansebibliotek
└── /coach/video/:id        → Enkelt video (delt komponent)
```

**Oppgaver:**
- [ ] Opprett VideoHub.tsx som samler alle views
- [ ] Flytt analyse/sammenligning til delte komponenter
- [ ] Oppdater ruter
- [ ] Fjern tomme feature-mapper

---

### 2.2 Coach-utøver konsolidering

**Problem:** 5 fragmenterte utøver-views

| Nåværende | Funksjon |
|-----------|----------|
| `/coach-athlete-list` | Liste over utøvere |
| `/coach-athlete-detail` | Utøverdetaljer |
| `/coach-athlete-status` | Statusoversikt |
| `/coach-athlete-tournaments` | Turneringer |
| `/coach-player` | Alternativ spillerside |

**Løsning:**
```
/coach/utovere (CoachAthleteHub)
├── /coach/utovere           → Liste
└── /coach/utovere/:id       → Detaljer (tabs inne)
    ├── Tab: Oversikt
    ├── Tab: Trening
    ├── Tab: Statistikk
    ├── Tab: Turneringer
    ├── Tab: Video
    └── Tab: Notater
```

**Oppgaver:**
- [ ] Lag CoachAthleteHub med tabs
- [ ] Flytt status/turneringer til tabs
- [ ] Fjern `/coach-player` (duplikat)
- [ ] Oppdater coach-navigasjon

---

### 2.3 Kalender-forenkling

**Problem:** Overlappende kalender-views

| Nåværende | Funksjon |
|-----------|----------|
| `/calendar` | Hovedkalender |
| `/calendar-oversikt` | Oversiktsvisning |

**Løsning:**
```
/kalender (CalendarHub)
├── /kalender              → Ukevisning (standard)
├── /kalender?view=dag     → Dagvisning
├── /kalender?view=maned   → Månedsvisning
├── /kalender?view=oversikt → Oversikt
└── /kalender/booking      → Book trener
```

**Oppgaver:**
- [ ] Integrer `/calendar-oversikt` i CalendarHub
- [ ] Bruk query params for view-switching
- [ ] Fjern `/calendar-oversikt` mappe

---

## Fase 3: Medium prioritet (Uke 3-4)

### 3.1 Treningsplan-konsolidering

**Nåværende:** 4 separate systemer
**Mål:** 2 systemer (player + coach)

```
/trening (TreningHub)
├── /trening/plan      → Dagens/ukens plan (tabs)
├── /trening/logg      → Logg trening
├── /trening/dagbok    → Treningsdagbok
└── /trening/teknisk   → Teknisk plan

/coach/trening (CoachTreningHub)
├── /coach/trening              → Planleggingshub
├── /coach/trening/:utoverId    → Utøvers plan
└── /coach/trening/maler        → Treningsmaler
```

---

### 3.2 Meldinger-opprydding

**Nåværende:** 3 systemer
**Mål:** 1 hierarki

```
/meldinger (MessageHub)
├── /meldinger         → Innboks
├── /meldinger/ny      → Ny melding
├── /meldinger/:id     → Samtale
└── /meldinger/arkiv   → Arkiverte

/coach/meldinger (CoachMessageHub)
├── /coach/meldinger           → Oversikt
├── /coach/meldinger/ny        → Ny bulk-melding
└── /coach/meldinger/planlagt  → Planlagte meldinger
```

---

### 3.3 Utvikling/Progress-sammenslåing

**Nåværende:** 3 overlappende systemer
**Mål:** 1 unified view

```
/utvikling (UtviklingHub)
├── /utvikling              → Oversikt/dashboard
├── /utvikling/breaking-points → Breaking points
├── /utvikling/kategori     → Kategori-fremgang
├── /utvikling/benchmark    → Benchmark-historie
└── /utvikling/tidslinje    → Tidslinje-visning
```

---

### 3.4 Øvelser-konsolidering

**Nåværende:** 3 systemer
**Mål:** 2 systemer (player + coach)

```
/ovelser (ExerciseLibrary)
├── /ovelser           → Bibliotek
├── /ovelser/:id       → Øvelsesdetaljer
└── /ovelser/favoritter → Mine favoritter

/coach/ovelser (CoachExerciseHub)
├── /coach/ovelser         → Bibliotek
├── /coach/ovelser/mine    → Mine øvelser
├── /coach/ovelser/maler   → Treningsmaler
└── /coach/ovelser/ny      → Opprett øvelse
```

---

## Fase 4: Opprydding (Uke 5)

### 4.1 Fjern ubrukte features

| Mappe | Grunn | Handling |
|-------|-------|----------|
| `/komunikasjon` | Tom/legacy | Slett |
| `/planning` | Placeholder | Slett |
| `/focus-engine` | Ubrukt widget | Integrer eller slett |
| `/coach-statistics` | Duplikat | Arkiver |

### 4.2 Fjern dev-only fra prod

| Mappe | Handling |
|-------|----------|
| `/ui-lab` | Betinget import (dev only) |
| `/stats-lab` | Betinget import (dev only) |

---

## Resultatmål

| Metrikk | Før | Etter | Endring |
|---------|-----|-------|---------|
| Feature-mapper | 78 | ~50 | -36% |
| Top-level ruter | ~80 | ~55 | -31% |
| Undermeny-valg | 38 | 18 | -53% |
| Duplisert kode | ~20 filer | ~5 filer | -75% |

---

## Risikoer

1. **Breaking changes i ruter** - Må implementere redirects
2. **Coach-funksjoner** - Teste grundig at alt fungerer
3. **Mobil-navigasjon** - Sjekke at tabs fungerer på liten skjerm

---

## Neste steg

1. Godkjenn denne planen
2. Start med Fase 1.1 (Statistikk)
3. Test grundig før neste fase
