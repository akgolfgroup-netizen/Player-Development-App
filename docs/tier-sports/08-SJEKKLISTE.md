# Implementeringssjekkliste

> Bruk denne for å tracke fremgang

---

## Fase 0: Forberedelse

### Audit
- [ ] Søkt etter alle "golf" strenger i kodebasen
- [ ] Identifisert alle hardkodede golf-referanser
- [ ] Dokumentert hvor terminologi må endres
- [ ] Kartlagt alle komponenter som trenger oppdatering

### Planlegging
- [ ] Bestemt MVP-scope
- [ ] Prioritert features
- [ ] Satt opp test-miljø
- [ ] Laget backup av database

---

## Fase 1: Aktiver idrettsbytte

### Backend
- [ ] `PATCH /api/v1/sport-config/switch` endpoint laget
- [ ] `switchSport()` metode i service
- [ ] Validering av sportId
- [ ] Tester skrevet for switch endpoint
- [ ] Tester passerer

### Frontend - Provider
- [ ] `App.jsx` endret til `ApiSportProvider`
- [ ] Loading state implementert
- [ ] Feilhåndtering/fallback implementert
- [ ] Testet at Golf fortsatt fungerer

### Frontend - UI
- [ ] `SportSelector` komponent laget
- [ ] Integrert i innstillinger
- [ ] Sport-indikator i header
- [ ] Manuell testing av sport-bytte
- [ ] E2E test skrevet

### Verifisering
- [ ] Kan bytte fra Golf til Løping
- [ ] Kan bytte tilbake til Golf
- [ ] Header oppdateres
- [ ] Ingen console errors

---

## Fase 2: Data-modell

### Database
- [ ] `sportId` lagt til på `TrainingSession`
- [ ] `sportId` lagt til på `Event`
- [ ] `sportId` lagt til på `Test`
- [ ] `sportId` lagt til på `Goal`
- [ ] `sportId` lagt til på `Exercise` (optional)
- [ ] `sportId` lagt til på `SessionTemplate` (optional)
- [ ] Indekser opprettet
- [ ] Migrering kjørt uten feil
- [ ] Eksisterende data har GOLF som default

### Backend API
- [ ] Session queries filtrerer på sportId
- [ ] Event queries filtrerer på sportId
- [ ] Test queries filtrerer på sportId
- [ ] Goal queries filtrerer på sportId
- [ ] Validering ved opprettelse
- [ ] API-tester oppdatert

### Frontend queries
- [ ] `useSessions` inkluderer sportId i queryKey
- [ ] `useEvents` inkluderer sportId i queryKey
- [ ] `useTests` inkluderer sportId i queryKey
- [ ] `useGoals` inkluderer sportId i queryKey
- [ ] Create-hooks sender sportId

### Verifisering
- [ ] Kan opprette session med riktig sport
- [ ] Sessions filtreres per sport
- [ ] Bytte sport viser kun relevante data

---

## Fase 3: UI-integrasjon

### Treningsregistrering
- [ ] `LoggTreningContainer` bruker dynamiske treningsområder
- [ ] Dynamiske miljøer implementert
- [ ] Dynamiske intensitetsnivåer implementert
- [ ] Gruppering av områder fungerer
- [ ] Fungerer for Golf
- [ ] Fungerer for Løping
- [ ] Fungerer for andre idretter

### Testregistrering
- [ ] `TestDetailPage` henter fra sport config
- [ ] Dynamisk test-skjema fungerer
- [ ] Benchmarks vises per sport
- [ ] 404 for ikke-eksisterende tester
- [ ] Fungerer for Golf-tester
- [ ] Fungerer for Løping-tester

### Målsetting
- [ ] `Maalsetninger` bruker dynamiske kategorier
- [ ] Ikoner og farger fra config
- [ ] Goal-form fungerer
- [ ] Fungerer for alle idretter

### Dashboard
- [ ] Sport-indikator på kort
- [ ] `FocusCard` bruker getTerm()
- [ ] `PlayerStatCard` viser riktige metriker
- [ ] Statistikk er sport-spesifikk

### Analyse
- [ ] `AnalyseHub` viser relevante kategorier
- [ ] Benchmarks skjules hvis ikke støttet
- [ ] Metriker grupperes riktig

---

## Fase 4: Feature flags

### Betinget visning
- [ ] Handicap skjules for ikke-golf
- [ ] Klubbhastighet skjules for ikke-golf
- [ ] Strokes Gained skjules for ikke-golf
- [ ] AK-formel vises kun hvis konfigurert
- [ ] Benchmarks vises kun hvis konfigurert

### Terminologi
- [ ] "spiller"/"utøver" dynamisk
- [ ] "trener"/"coach" dynamisk
- [ ] "økt"/"trening" dynamisk
- [ ] "runde"/"kamp"/"løp" dynamisk
- [ ] Alle hardkodede termer erstattet

### Navigasjon
- [ ] Hurtighandlinger sport-spesifikke
- [ ] Irrelevante menypunkter skjult

---

## Fase 5: Kvalitetssikring

### Testing
- [ ] E2E test for sport-bytte
- [ ] Komponent-tester for hver idrett
- [ ] API-tester for sport endpoints
- [ ] Regresjonstesting golf
- [ ] Alle tester passerer

### Dokumentasjon
- [ ] README oppdatert
- [ ] API-dokumentasjon oppdatert
- [ ] "Hvordan legge til ny idrett" guide

### Produksjon
- [ ] Staging-deploy OK
- [ ] Produksjons-deploy plan
- [ ] Rollback-plan

---

## Per-sport verifisering

### Golf (baseline)
- [ ] Alt fungerer som før
- [ ] Ingen regresjoner
- [ ] Handicap, SG, klubbhastighet fungerer

### Løping
- [ ] Treningsområder vises riktig
- [ ] Tester (Cooper, 5K, etc.) fungerer
- [ ] Benchmarks vises
- [ ] Terminologi korrekt ("løper", "løp")

### Håndball
- [ ] Treningsområder vises riktig
- [ ] Tester fungerer
- [ ] Terminologi korrekt ("håndballspiller", "kamp")

### Fotball
- [ ] Treningsområder vises riktig
- [ ] Tester fungerer
- [ ] Terminologi korrekt ("fotballspiller", "kamp")

### Tennis
- [ ] Treningsområder vises riktig
- [ ] Tester fungerer
- [ ] Terminologi korrekt ("tennisspiller", "kamp")

### Svømming
- [ ] Treningsområder vises riktig
- [ ] Tester fungerer
- [ ] Terminologi korrekt ("svømmer", "stevne")

### Spydkast
- [ ] Treningsområder vises riktig
- [ ] Tester fungerer
- [ ] Terminologi korrekt ("kaster", "stevne")

---

## Notater underveis

### Problemer oppdaget
```
Dato: ___________
Problem: ___________
Løsning: ___________
```

### Beslutninger tatt
```
Dato: ___________
Beslutning: ___________
Begrunnelse: ___________
```

### Teknisk gjeld
```
Hva: ___________
Prioritet: Høy / Medium / Lav
Når fikse: ___________
```

---

## Tidslogg

| Dato | Fase | Oppgave | Timer | Notater |
|------|------|---------|-------|---------|
| | | | | |
| | | | | |
| | | | | |
| | | | | |
| | | | | |

**Total timer brukt:** ___________
