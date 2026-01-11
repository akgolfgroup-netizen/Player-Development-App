# Spiller-modul Spesifikasjon

> Komplett dokumentasjon for spilleropplevelsen

---

## 1. Oversikt

### Målgruppe
Utøvere som ønsker å:
- Logge treninger og prestasjoner
- Følge treningsplaner
- Se egen utvikling over tid
- Kommunisere med trener

### Kjerneverdier
- **Enkelhet** - Rask logging og oversikt
- **Motivasjon** - Synlig fremgang og achievements
- **Personlig** - Skreddersydd opplevelse
- **Kommunikasjon** - Kobling til trenerteam

---

## 2. Navigasjonsstruktur (V3)

### Hovednavigasjon (5 items)
```
┌─────────────────────────────────────────────┐
│  Dashboard  │  Trening  │  Utvikling  │  Plan  │  Mer  │
└─────────────────────────────────────────────┘
```

### Dashboard `/dashboard`
- Dagens oversikt
- Neste økt
- Ukentlig fremgang
- Varsler og påminnelser
- Achievements/badges

### Trening `/trening`
- **Logg økt** - Registrer trening
- **Treningsdagbok** - Historikk
- **Øvelser** - Øvelsesbibliotek
- **Øktsplaner** - Ferdige maler

### Utvikling `/utvikling`
- **Statistikk** - Aggregert data
- **Tester** - Testresultater
- **Fremgang** - Grafer og trender
- **Benchmarks** - Sammenligning

### Plan `/plan`
- **Årsplan** - Helhetlig oversikt
- **Kalender** - Dag/uke/måned
- **Mål** - Målsettinger
- **Turneringer** - Konkurranser

### Mer `/mer`
- **Profil** - Personlig info
- **Innstillinger** - App-konfig
- **Coaches** - Mine trenere
- **Video** - Videoanalyse
- **Meldinger** - Kommunikasjon
- **Hjelp** - Support

---

## 3. Feature-spesifikasjoner

### 3.1 Dashboard

#### Komponenter
```
┌──────────────────────────────────────────────────┐
│  God morgen, [Navn]!                    🔔 3     │
├──────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐        │
│  │  Neste økt      │  │  Ukens mål      │        │
│  │  Putting drill  │  │  ████████░░ 80% │        │
│  │  i dag 14:00    │  │  4/5 økter      │        │
│  └─────────────────┘  └─────────────────┘        │
│                                                  │
│  ┌─────────────────────────────────────────┐     │
│  │  Denne uken                             │     │
│  │  Ma  Ti  On  To  Fr  Lø  Sø            │     │
│  │  ✓   ✓   ✓   ○   ○   ○   ○             │     │
│  └─────────────────────────────────────────┘     │
│                                                  │
│  ┌─────────────────┐  ┌─────────────────┐        │
│  │  Siste badge    │  │  Fra coach      │        │
│  │  🏅 Streak 7    │  │  "Bra jobba..." │        │
│  └─────────────────┘  └─────────────────┘        │
└──────────────────────────────────────────────────┘
```

#### Data som vises
- Neste planlagte økt (fra kalender)
- Ukentlig fremgang (økter fullført / planlagt)
- Siste aktivitet
- Nyeste achievement
- Ulest melding fra coach

### 3.2 Logg Trening

#### Flyt
1. **Velg type** - Trening / Turnering / Test
2. **Treningsområde** - Fra sport-config
3. **Miljø** - Inne/Ute/Bane/etc.
4. **Varighet** - Timer/minutter
5. **Intensitet** - Fra sport-config
6. **Øvelser** - Velg fra bibliotek (optional)
7. **Notater** - Fritekst
8. **Lagre**

#### Skjema
```
┌──────────────────────────────────────────────────┐
│  Logg trening                                    │
├──────────────────────────────────────────────────┤
│  Dato          [ 10. januar 2026 ▼ ]             │
│                                                  │
│  Treningsområde                                  │
│  [ Velg område ▼ ]                               │
│    ├── Full Swing                                │
│    │     ├── Driving                             │
│    │     └── Iron Play                           │
│    ├── Short Game                                │
│    └── Putting                                   │
│                                                  │
│  Miljø         [ Treningsbane ▼ ]                │
│                                                  │
│  Varighet      [ 1 ] t [ 30 ] min                │
│                                                  │
│  Intensitet    ○ Lett  ● Moderat  ○ Hard         │
│                                                  │
│  Øvelser (valgfritt)                             │
│  [ + Legg til øvelse ]                           │
│                                                  │
│  Notater                                         │
│  ┌──────────────────────────────────────────┐   │
│  │ Fokuserte på tempo i svingen...          │   │
│  └──────────────────────────────────────────┘   │
│                                                  │
│  [ Lagre trening ]                               │
└──────────────────────────────────────────────────┘
```

### 3.3 Treningsdagbok

#### Visning
- **Liste** - Kronologisk liste
- **Kalender** - Kalendervisning
- **Filter** - Per område, miljø, periode

#### Økt-kort
```
┌──────────────────────────────────────────────────┐
│  10. januar 2026                                 │
├──────────────────────────────────────────────────┤
│  🏌️ Putting drill                               │
│  1t 30min • Treningsbane • Moderat              │
│                                                  │
│  "Fokuserte på tempo i svingen. Følte god       │
│   kontroll på 3-footers."                        │
│                                                  │
│  [ Se detaljer ] [ Rediger ]                     │
└──────────────────────────────────────────────────┘
```

### 3.4 Tester

#### Testprotokoll-liste
Viser alle tilgjengelige tester fra sport-config:
- Navn og beskrivelse
- Sist gjennomført
- Beste resultat

#### Registrer test
1. Velg testprotokoll
2. Fyll inn resultater (dynamisk skjema fra config)
3. Se scoring og benchmark
4. Lagre

#### Testhistorikk
- Graf over tid
- Sammenligning med benchmarks
- Trend-analyse

### 3.5 Mål

#### Mål-kategorier
Fra sport-config, f.eks.:
- Teknikk
- Fysisk
- Mental
- Konkurranseresultater

#### Mål-struktur
```typescript
interface Goal {
  id: string;
  title: string;
  category: string;      // Fra sport-config
  targetValue?: number;
  currentValue?: number;
  deadline: Date;
  status: 'active' | 'completed' | 'abandoned';
  milestones?: Milestone[];
}
```

#### Mål-visning
```
┌──────────────────────────────────────────────────┐
│  🎯 Mine mål                                     │
├──────────────────────────────────────────────────┤
│  Aktive mål (3)                                  │
│                                                  │
│  ┌─────────────────────────────────────────┐     │
│  │  Redusere handicap til 10               │     │
│  │  ████████████████░░░░░░  12.4 → 10.0    │     │
│  │  Frist: 1. juni 2026                    │     │
│  └─────────────────────────────────────────┘     │
│                                                  │
│  ┌─────────────────────────────────────────┐     │
│  │  Forbedre puttesnitt                    │     │
│  │  ████████░░░░░░░░░░░░░░  1.8 → 1.6      │     │
│  │  Frist: 1. mars 2026                    │     │
│  └─────────────────────────────────────────┘     │
│                                                  │
│  [ + Nytt mål ]                                  │
└──────────────────────────────────────────────────┘
```

### 3.6 Kalender

#### Visninger
- **Dag** - Detaljert dagsvisning
- **Uke** - Ukeoversikt
- **Måned** - Månedsoversikt

#### Hendelsestyper
- Planlagte treninger
- Turneringer
- Tester
- Møter med coach

#### Integrasjoner
- Synk med Google Calendar
- Eksport til iCal

### 3.7 Kommunikasjon med Coach

#### Meldinger
- Innboks med meldinger fra coach
- Svar-funksjonalitet
- Fil-vedlegg (video, bilder)

#### Feedback
- Motta feedback på økter
- Se kommentarer på video

---

## 4. Gamification

### Achievements
- **Streak-badges** - 7, 30, 100 dager
- **Volume-badges** - Timer trent
- **Milestone-badges** - Første test, første mål nådd
- **Improvement-badges** - PB, handicap-reduksjon

### Leaderboards (optional)
- Innen gruppe/team
- Anonymisert hvis ønsket

### Progress-visualisering
- Nivå-system
- XP-poeng
- Fremgangsbar

---

## 5. Personalisering

### Profilinnstillinger
- Personlig info
- Målsettinger
- Preferanser

### App-innstillinger
- Varsler (push, email)
- Tema (lys/mørk)
- Språk

### Trenertilknytning
- Se mine trenere
- Kommunikasjonspreferanser
- Dele-innstillinger

---

## 6. Mobil-opplevelse

### Responsive design
- Full funksjonalitet på mobil
- Touch-optimalisert
- Swipe-navigasjon

### Offline-støtte
- Cache treninger lokalt
- Synk når online
- PWA-støtte

### Quick actions
- Logg trening (1-tap start)
- Stopp-klokke
- Dagens plan-widget

---

## 7. Tekniske krav

### Frontend-komponenter
```
src/features/
├── dashboard/
│   ├── PlayerDashboard.tsx
│   ├── QuickStats.tsx
│   └── UpcomingSession.tsx
├── training/
│   ├── LogTraining.tsx
│   ├── TrainingDiary.tsx
│   └── SessionDetail.tsx
├── tests/
│   ├── TestList.tsx
│   ├── TestDetail.tsx
│   └── RegisterTest.tsx
├── goals/
│   ├── GoalList.tsx
│   ├── GoalDetail.tsx
│   └── CreateGoal.tsx
└── calendar/
    ├── Calendar.tsx
    ├── DayView.tsx
    └── WeekView.tsx
```

### API-endepunkter
```
GET    /api/v1/player/dashboard
GET    /api/v1/player/sessions
POST   /api/v1/player/sessions
GET    /api/v1/player/tests
POST   /api/v1/player/tests
GET    /api/v1/player/goals
POST   /api/v1/player/goals
GET    /api/v1/player/calendar
```

### Data-modeller
- Se Prisma schema for Player, TrainingSession, Test, Goal, etc.

---

## 8. Implementeringsplan

### Fase 1: Kjernefunksjonalitet
- [ ] Dashboard med nøkkeldata
- [ ] Logg trening (forenklet)
- [ ] Treningsdagbok (liste)

### Fase 2: Utvikling
- [ ] Testregistrering
- [ ] Testhistorikk og grafer
- [ ] Mål-modul

### Fase 3: Planlegging
- [ ] Kalender-integrasjon
- [ ] Årsplan-visning
- [ ] Turneringskalender

### Fase 4: Sosial
- [ ] Coach-kommunikasjon
- [ ] Achievements
- [ ] Deling

---

## 9. Designprinsipper

### Farger (fra sport-config)
- Primær: Sport-spesifikk
- Sekundær: Støtte-farge
- Status: Grønn/gul/rød for fremgang

### Typografi
- Headings: Semi-bold, store
- Body: Regular, lesbar
- Numbers: Tabular for statistikk

### Ikoner
- Sport-spesifikke fra config
- Konsistente action-ikoner
- Tydelige status-ikoner

### Tomme tilstander
Hver side må ha "empty state" med:
- Illustrasjon
- Forklaring
- Call-to-action
