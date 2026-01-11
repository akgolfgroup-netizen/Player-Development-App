# Coach-modul Spesifikasjon

> Komplett dokumentasjon for treneropplevelsen

---

## 1. Oversikt

### Målgruppe
Trenere som ønsker å:
- Følge opp flere utøvere
- Lage treningsplaner
- Analysere fremgang
- Kommunisere effektivt

### Kjerneverdier
- **Oversikt** - Se alle spillere på ett sted
- **Effektivitet** - Spare tid med maler og bulk-operasjoner
- **Innsikt** - Data-drevet coaching
- **Kommunikasjon** - Enkel kontakt med utøvere

---

## 2. Navigasjonsstruktur

### Hovednavigasjon
```
┌──────────────────────────────────────────────────────┐
│  Dashboard  │  Spillere  │  Analyse  │  Plan  │  Mer  │
└──────────────────────────────────────────────────────┘
```

### Dashboard `/coach/dashboard`
- Oversikt over alle spillere
- Varsler og oppfølgingspunkter
- Kommende økter og turneringer
- Rask tilgang til handlinger

### Spillere `/coach/athletes`
- **Liste** - Alle mine spillere
- **Grupper** - Organiserte grupper
- **Spiller-profil** - Individuell visning
- **Tilordning** - Legg til/fjern spillere

### Analyse `/coach/analyse`
- **Statistikk** - Aggregert for alle/gruppe
- **Sammenligning** - Spiller vs spiller
- **Rapporter** - Genererte rapporter
- **Varsler** - Avvik og oppmerksomhetspunkter

### Plan `/coach/plan`
- **Årsplaner** - For individ og gruppe
- **Øktsplaner** - Maler og tildelinger
- **Kalender** - Helhetlig oversikt
- **Samlinger** - Treningssamlinger

### Mer `/coach/settings`
- **Innstillinger** - App-konfig
- **Øvelsesbibliotek** - Mine øvelser
- **Maler** - Økts- og planmaler
- **Profil** - Min profil

---

## 3. Feature-spesifikasjoner

### 3.1 Dashboard

#### Komponenter
```
┌──────────────────────────────────────────────────────┐
│  God morgen, Coach [Navn]!                  🔔 5     │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌─────────────────────────────────────────────┐     │
│  │  🚨 Krever oppmerksomhet                    │     │
│  │                                             │     │
│  │  • Ole har ikke logget på 7 dager           │     │
│  │  • Lisa har 3 uleste meldinger              │     │
│  │  • Per mangler testresultater               │     │
│  └─────────────────────────────────────────────┘     │
│                                                      │
│  ┌─────────────────┐  ┌─────────────────┐            │
│  │  Denne uken     │  │  Spillere       │            │
│  │  12 økter       │  │  24 aktive      │            │
│  │  planlagt       │  │  3 inaktive     │            │
│  └─────────────────┘  └─────────────────┘            │
│                                                      │
│  ┌─────────────────────────────────────────────┐     │
│  │  Kommende                                   │     │
│  │  • I dag 14:00 - Gruppetrening A-lag        │     │
│  │  • I morgen - NM Kvalifisering              │     │
│  │  • Fredag - Samling helg                    │     │
│  └─────────────────────────────────────────────┘     │
│                                                      │
└──────────────────────────────────────────────────────┘
```

#### Varsler/Alerts
Coach-dashboardet viser automatiske varsler:
- Spillere som ikke har logget aktivitet
- Mål som nærmer seg deadline
- Testresultater under forventet
- Uleste meldinger
- Avlyste/endrede økter

### 3.2 Spilleroversikt

#### Liste-visning
```
┌──────────────────────────────────────────────────────┐
│  Mine spillere                    [ + Inviter ]      │
├──────────────────────────────────────────────────────┤
│  🔍 Søk...                    Filter: [ Alle ▼ ]    │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌─────────────────────────────────────────────┐     │
│  │  👤 Ole Hansen          Kategori B          │     │
│  │     Sist aktiv: i dag   HCP: 12.4           │     │
│  │     Status: ✅ På sporet                    │     │
│  │     [ Se profil ] [ Melding ] [ Plan ]      │     │
│  └─────────────────────────────────────────────┘     │
│                                                      │
│  ┌─────────────────────────────────────────────┐     │
│  │  👤 Lisa Andersen       Kategori A          │     │
│  │     Sist aktiv: 2 dager HCP: 5.2            │     │
│  │     Status: ⚠️ Trenger oppfølging           │     │
│  │     [ Se profil ] [ Melding ] [ Plan ]      │     │
│  └─────────────────────────────────────────────┘     │
│                                                      │
└──────────────────────────────────────────────────────┘
```

#### Spiller-profil (Coach-view)
```
┌──────────────────────────────────────────────────────┐
│  ← Tilbake                                           │
├──────────────────────────────────────────────────────┤
│                                                      │
│  👤 Ole Hansen                                       │
│  Kategori B • HCP 12.4 • Alder 24                   │
│                                                      │
│  ┌─────────────────────────────────────────────┐     │
│  │  Tabs: Oversikt | Trening | Tester | Mål   │     │
│  └─────────────────────────────────────────────┘     │
│                                                      │
│  [OVERSIKT]                                          │
│                                                      │
│  Denne måneden                                       │
│  • 12 treningsøkter (mål: 15)                       │
│  • 2 turneringer                                     │
│  • Handicap: 12.8 → 12.4 (-0.4)                     │
│                                                      │
│  Fokusområder                                        │
│  • Short Game (60% av trening)                       │
│  • Putting (25%)                                     │
│                                                      │
│  Siste aktivitet                                     │
│  • I dag: Putting drill, 1.5t                        │
│  • I går: Iron practice, 2t                          │
│                                                      │
│  [ Send melding ] [ Lag treningsplan ] [ Evaluer ]  │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### 3.3 Grupper

#### Gruppe-liste
```
┌──────────────────────────────────────────────────────┐
│  Mine grupper                      [ + Ny gruppe ]   │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌─────────────────────────────────────────────┐     │
│  │  🏌️ A-laget                                 │     │
│  │     8 spillere • Neste trening: I morgen    │     │
│  │     [ Åpne ] [ Planlegg ] [ Melding ]       │     │
│  └─────────────────────────────────────────────┘     │
│                                                      │
│  ┌─────────────────────────────────────────────┐     │
│  │  🏌️ Junior-gruppa                           │     │
│  │     12 spillere • Neste trening: Fredag     │     │
│  │     [ Åpne ] [ Planlegg ] [ Melding ]       │     │
│  └─────────────────────────────────────────────┘     │
│                                                      │
└──────────────────────────────────────────────────────┘
```

#### Gruppe-detalj
- Liste over spillere i gruppen
- Felles kalender
- Gruppe-meldinger
- Statistikk for gruppen

### 3.4 Analyse og Statistikk

#### Oversikt
```
┌──────────────────────────────────────────────────────┐
│  Analyse                                             │
├──────────────────────────────────────────────────────┤
│  Filter: [ Alle spillere ▼ ] Periode: [ Siste 30d ] │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Treningsvolum                                       │
│  ┌─────────────────────────────────────────────┐     │
│  │  📊 [Graf: Timer per uke]                   │     │
│  │     Snitt: 8.5t/uke                         │     │
│  │     Trend: +12% vs forrige periode          │     │
│  └─────────────────────────────────────────────┘     │
│                                                      │
│  Fremgang                                            │
│  ┌─────────────────────────────────────────────┐     │
│  │  📈 [Graf: Handicap-utvikling]              │     │
│  │     5 spillere forbedret                    │     │
│  │     2 uendret                               │     │
│  │     1 gått opp                              │     │
│  └─────────────────────────────────────────────┘     │
│                                                      │
└──────────────────────────────────────────────────────┘
```

#### Sammenligning
- Velg 2-4 spillere
- Sammenlign metriker
- Visualiser forskjeller

#### Rapporter
- Generer PDF-rapporter
- Perioderapporter (uke/måned/år)
- Individuelle utviklingsrapporter

### 3.5 Planlegging

#### Årsplan-generator
```
┌──────────────────────────────────────────────────────┐
│  Lag årsplan                                         │
├──────────────────────────────────────────────────────┤
│                                                      │
│  For: [ Ole Hansen ▼ ]                              │
│                                                      │
│  Sesong: [ 2026 ▼ ]                                 │
│                                                      │
│  Hovedmål:                                           │
│  ┌──────────────────────────────────────────────┐   │
│  │ Redusere handicap fra 12.4 til 10            │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  Hovedturneringer:                                   │
│  [ + Legg til turnering ]                           │
│  • NM - Juni                                         │
│  • Klubbmesterskap - August                          │
│                                                      │
│  Treningsfaser:                                      │
│  ┌─────────────────────────────────────────────┐     │
│  │  Jan-Mar: Grunntrening (Teknikk fokus)      │     │
│  │  Apr-Mai: Oppbygging (Konkurranse-prep)     │     │
│  │  Jun-Aug: Konkurransesesong                 │     │
│  │  Sep-Nov: Evaluering og forbedring          │     │
│  │  Des: Hvile                                 │     │
│  └─────────────────────────────────────────────┘     │
│                                                      │
│  [ Generer plan ]                                    │
│                                                      │
└──────────────────────────────────────────────────────┘
```

#### Øktsplaner
- Lag maler for treningsøkter
- Tilordne til spillere/grupper
- Kopier og tilpass

#### Kalender
- Se alle spilleres planer
- Filtrer per spiller/gruppe
- Dra-og-slipp for endringer

### 3.6 Kommunikasjon

#### Meldinger
```
┌──────────────────────────────────────────────────────┐
│  Meldinger                         [ + Ny melding ]  │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌─────────────────────────────────────────────┐     │
│  │  Ole Hansen                      I dag 14:32│     │
│  │  "Takk for feedbacken på..."                │     │
│  └─────────────────────────────────────────────┘     │
│                                                      │
│  ┌─────────────────────────────────────────────┐     │
│  │  Lisa Andersen                   I går      │     │
│  │  "Kan vi flytte økten til..."               │     │
│  └─────────────────────────────────────────────┘     │
│                                                      │
└──────────────────────────────────────────────────────┘
```

#### Bulk-meldinger
- Send til alle spillere
- Send til gruppe
- Planlagte meldinger

#### Feedback på økter
- Kommenter på registrerte treninger
- Gi karakter/vurdering
- Legg til video-feedback

### 3.7 Øvelsesbibliotek

#### Mine øvelser
- Opprett egne øvelser
- Kategoriser og tagg
- Del med andre trenere

#### Økts-maler
- Bygg maler fra øvelser
- Tilordne til spillere
- Spor gjennomføring

---

## 4. Spiller-tilordning

### Kobling coach → spiller

#### Alternativ 1: Direkte tilordning
```prisma
model CoachPlayerAssignment {
  coachId   String
  playerId  String
  role      'primary' | 'secondary'
  startDate DateTime
  endDate   DateTime?
}
```

#### Alternativ 2: Gruppe-basert
```prisma
model Group {
  id       String
  coachId  String
  name     String
  players  GroupPlayer[]
}
```

#### Anbefaling
Bruk begge:
- Primær coach (1:1) for hovedoppfølging
- Grupper for fellesaktiviteter

### Invitasjonsflyt

```
Coach logger inn
    ↓
"Inviter spiller" → Fyller ut email
    ↓
System sender invitasjon
    ↓
Spiller registrerer seg
    ↓
Automatisk kobling til coach
```

---

## 5. Varsler og oppfølging

### Automatiske varsler

| Trigger | Varsel |
|---------|--------|
| Spiller inaktiv 7 dager | "Ole har ikke logget aktivitet" |
| Mål nærmer seg deadline | "Lisa har 2 uker til mål-deadline" |
| Test under forventet | "Per scoret under benchmark på putting" |
| Treningsplan ikke fulgt | "3 spillere mangler økter denne uken" |

### Coach Intelligence
- Automatiske anbefalinger
- Identifiser mønstre
- Foreslå tiltak

---

## 6. Rapporter

### Individuelle rapporter
- Ukentlig/månedlig oppsummering
- Utviklingsrapport
- Testresultat-analyse

### Gruppe-rapporter
- Team-statistikk
- Sammenligning
- Fremmøte

### Eksport
- PDF
- Excel
- Deling via link

---

## 7. Tekniske krav

### Frontend-komponenter
```
src/features/
├── coach-dashboard/
│   ├── CoachDashboard.tsx
│   ├── AlertsCard.tsx
│   └── QuickActions.tsx
├── coach-athletes/
│   ├── AthleteList.tsx
│   ├── AthleteProfile.tsx
│   └── AthleteStats.tsx
├── coach-groups/
│   ├── GroupList.tsx
│   ├── GroupDetail.tsx
│   └── GroupCreate.tsx
├── coach-planning/
│   ├── AnnualPlanGenerator.tsx
│   ├── SessionPlanner.tsx
│   └── CalendarView.tsx
└── coach-messages/
    ├── MessageList.tsx
    ├── MessageCompose.tsx
    └── BulkMessage.tsx
```

### API-endepunkter
```
GET    /api/v1/coach/dashboard
GET    /api/v1/coach/athletes
GET    /api/v1/coach/athletes/:id
POST   /api/v1/coach/athletes/invite
GET    /api/v1/coach/groups
POST   /api/v1/coach/groups
GET    /api/v1/coach/stats
GET    /api/v1/coach/reports
POST   /api/v1/coach/messages
```

---

## 8. Implementeringsplan

### Fase 1: Grunnleggende
- [ ] Coach dashboard med oversikt
- [ ] Spillerliste (enkel)
- [ ] Spiller-profil visning

### Fase 2: Kommunikasjon
- [ ] Meldingssystem
- [ ] Feedback på økter
- [ ] Varsler

### Fase 3: Planlegging
- [ ] Øktsplaner
- [ ] Årsplan-generator
- [ ] Kalender-integrasjon

### Fase 4: Analyse
- [ ] Statistikk-dashboard
- [ ] Rapporter
- [ ] Sammenligning

---

## 9. Designprinsipper

### Data-tetthet
Coach-UI kan vise mer data enn spiller-UI:
- Tabeller i stedet for kort
- Flere datapunkter synlige
- Avanserte filtre

### Bulk-operasjoner
- Multi-select i lister
- Bulk-meldinger
- Bulk-plantilordning

### Hurtigtilgang
- Søk på tvers av alt
- Favoritter/nylige
- Tastatursnarveier
