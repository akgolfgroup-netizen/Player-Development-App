# Spillermodul - Komplett Funksjonsoversikt

> Generert: 2026-01-01
> Versjon: 1.0
> Kilde: IUP Golf App

---

## Innholdsfortegnelse

1. [Dashboard](#1-dashboard)
2. [Statistikk & Analyse](#2-statistikk--analyse)
3. [Profil & Innstillinger](#3-profil--innstillinger)
4. [Økter & Trening](#4-økter--trening)
5. [Mål](#5-mål)
6. [Fremgang](#6-fremgang)
7. [Kalender](#7-kalender)
8. [Tester](#8-tester)
9. [Prestasjoner & Badges](#9-prestasjoner--badges)
10. [Notater](#10-notater)
11. [Øvelser](#11-øvelser)
12. [Turneringer](#12-turneringer)
13. [Treningsplaner](#13-treningsplaner)
14. [Kommunikasjon](#14-kommunikasjon)
15. [Innstillinger](#15-innstillinger)
16. [Kunnskapsbase](#16-kunnskapsbase)
17. [Video-analyse](#17-video-analyse)

---

## 1. Dashboard

**Sti:** `apps/web/src/features/dashboard/`

### Komponenter

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| AKGolfDashboard | `AKGolfDashboard.jsx` | Hovedspillerens dashboard med premium layout |
| DashboardContainer | `DashboardContainer.jsx` | Data-henting og state management |
| AKGolfDashboardV3 | `AKGolfDashboardV3.jsx` | Alternativ dashboard-versjon |
| OnboardingChecklist | `OnboardingChecklist.jsx` | Ny-bruker veiledning |
| DashboardWidget | `components/DashboardWidget.jsx` | Gjenbrukbar widget-komponent |

### Funksjoner

- **Velkomsthilsen** — Personlig greeting med navn og dato
- **KPI-kort (4 stk)** — Viktige nøkkeltall for spilleren
- **Nedtellingswidgets** — Dager til neste turnering/test
- **Dagens plan** — Kalendervisning for dagens aktiviteter
- **Ukemål-widget** — Progresjon mot ukentlige mål
- **Øktliste** — Kommende treningsøkter
- **Meldingswidget** — Uleste meldinger fra coach/system
- **Treningsstatistikk** — Økter fullført, timer, streak
- **Oppgaveliste** — To-do items med completion tracking
- **Gamification** — XP, nivå, nylige badges

---

## 2. Statistikk & Analyse

**Sti:** `apps/web/src/features/player-stats/`

### Komponenter

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| PlayerStatsPage | `PlayerStatsPage.tsx` | Hovedstatistikk-dashboard |
| StatistikkHub | `StatistikkHub.tsx` | Sentral statistikk-hub |
| BenchmarkPage | `BenchmarkPage.tsx` | Elite benchmarking |
| BenchmarkContent | `BenchmarkContent.tsx` | Benchmark-innhold |
| StrokesGainedPage | `StrokesGainedPage.tsx` | Detaljert SG-analyse |
| StrokesGainedContent | `StrokesGainedContent.tsx` | SG datavisualisering |
| TestResultsPage | `TestResultsPage.tsx` | Testresultat-dashboard |
| TestResultsContent | `TestResultsContent.tsx` | Testresultat-visning |
| TestDetailPage | `TestDetailPage.tsx` | Individuell testdetalj |
| StatusProgressPage | `StatusProgressPage.tsx` | Kategori-progresjon |
| StatusProgressContent | `StatusProgressContent.tsx` | Progresjon-visualisering |
| CategoryProgressionWidget | `CategoryProgressionWidget.tsx` | Kategori-progresjonskart |
| TestComparisonWidget | `TestComparisonWidget.tsx` | Test-sammenligning |
| ImprovementVelocityWidget | `ImprovementVelocityWidget.tsx` | Forbedringshastighet |
| CoachNotesPanel | `CoachNotesPanel.tsx` | Trenernotater på stats |

### Funksjoner

- **Strokes Gained Total** — Samlet SG-score
- **SG Breakdown** — Approach, Around Green, Putting
- **Percentil-ranking** — Sammenligning med andre spillere
- **Elite Benchmarking** — vs PGA Elite, WAGR, Tour averages
- **Gap-analyse** — Identifiser forbedringsområder
- **Testhistorikk** — Historiske testdata med trender
- **Kategori-progresjon** — Fremgang per kategori over tid
- **Test-sammenligning** — Side-by-side test-resultater
- **Forbedringshastighet** — Velocity of improvement metrics
- **Trenerkommentarer** — Coach feedback på statistikk

---

## 3. Profil & Innstillinger

**Sti:** `apps/web/src/features/profile/`

### Komponenter

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| BrukerprofilContainer | `BrukerprofilContainer.jsx` | Profilhåndtering container |
| ak_golf_brukerprofil_onboarding | `ak_golf_brukerprofil_onboarding.jsx` | Onboarding-skjema |
| TwoFactorSetup | `TwoFactorSetup.jsx` | 2FA konfigurasjon |
| TwoFactorDisable | `TwoFactorDisable.jsx` | 2FA deaktivering |

### Funksjoner

- **Profilvisning** — Vis brukerinfo (navn, bilde, klubb)
- **Profilredigering** — Oppdater personlig informasjon
- **Onboarding-flow** — Ny-bruker oppsett
- **Kategori-valg** — Velg spillerkategori
- **Klubb-tilknytning** — Koble til golfklubb
- **Handicap-registrering** — Sett og oppdater handicap
- **To-faktor autentisering** — Aktiver/deaktiver 2FA
- **Avatarbilde** — Last opp profilbilde

---

## 4. Økter & Trening

**Sti:** `apps/web/src/features/sessions/`

### Komponenter

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| SessionsListView | `SessionsListView.tsx` | Treningsøkter oversikt |
| SessionsListContainer | `SessionsListContainer.jsx` | Sessions liste wrapper |
| ActiveSessionView | `ActiveSessionView.jsx` | Live økt-grensesnitt |
| ActiveSessionViewContainer | `ActiveSessionViewContainer.jsx` | Aktiv økt wrapper |
| SessionDetailView | `SessionDetailView.jsx` | Individuell økt-detaljer |
| SessionDetailViewContainer | `SessionDetailViewContainer.jsx` | Detalj-visning wrapper |
| SessionCreateForm | `SessionCreateForm.jsx` | Opprett ny økt |
| SessionCreateFormContainer | `SessionCreateFormContainer.jsx` | Opprett-skjema wrapper |
| SessionEvaluationForm | `SessionEvaluationForm.jsx` | Post-økt evaluering |
| SessionEvaluationFormContainer | `SessionEvaluationFormContainer.jsx` | Evaluering wrapper |
| SessionEvaluationWidget | `SessionEvaluationWidget.jsx` | Rask evaluering-kort |
| SessionReflectionForm | `SessionReflectionForm.jsx` | Detaljert refleksjon |
| SessionReflectionFormContainer | `SessionReflectionFormContainer.jsx` | Refleksjon wrapper |
| EvaluationStatsDashboard | `EvaluationStatsDashboard.jsx` | Økt-statistikk oversikt |
| EvaluationStatsDashboardContainer | `EvaluationStatsDashboardContainer.jsx` | Stats wrapper |
| QuickActionsWidget | `QuickActionsWidget.jsx` | Hurtighandlinger |
| BlockRatingModal | `BlockRatingModal.jsx` | Blokk-rating |
| ShareSessionModal | `ShareSessionModal.jsx` | Del økt med coach |
| ExerciseLibraryContainer | `ExerciseLibraryContainer.jsx` | Øvelsesbibliotek |

### Funksjoner

- **Øktliste** — Filtrerbar liste over alle økter
- **Søk i økter** — Fritekst-søk
- **Status-filtrering** — Planlagt, pågående, fullført
- **Økt-detaljer** — Full visning av én økt
- **Blokk-struktur** — Ekspanderbare treningsblokker
- **Blokk-parametere** — Læringsfase, CS-nivå, Miljø, Pressure
- **Aktiv økt-modus** — Fullskjerm treningsvisning
- **Blokk-fullføring** — Marker blokker som fullført
- **Blokk-rating** — Vurder vanskelighetsgrad
- **Opprett økt** — Ny treningsøkt-skjema
- **Økt-evaluering** — Post-session vurdering
- **Refleksjon** — Dypere ettertanke om økten
- **Del med coach** — Send økt til trener
- **Øvelsesbank** — Bla i tilgjengelige øvelser
- **Hurtiglogging** — Rask registrering av aktivitet

### Blokk-parametere

| Parameter | Verdier |
|-----------|---------|
| Læringsfase | Ball, Teknikk, Transfer, Variasjon, Spill |
| CS-nivå | 20-100 (kompleksitet/ferdighetsprogresjon) |
| Miljø | M1 (Inne), M2 (Matte), M3 (Treningsområde), M4 (Øvingsbane), M5 (Bane) |
| Pressure Rating | PR1-PR5 (ingen → maks press) |

---

## 5. Mål

**Sti:** `apps/web/src/features/goals/`

### Komponenter

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| GoalsPage | `GoalsPage.tsx` | Mål-dashboard |
| Maalsetninger | `Maalsetninger.tsx` | Målvisning |
| MaalsetningerContainer | `MaalsetningerContainer.jsx` | Mål wrapper |

### Funksjoner

- **Ukemål** — Kortsiktige ukentlige mål
- **Langsiktige mål** — Sesong/års-mål
- **Mål-progresjon** — Visuell fremgang mot mål
- **Mål-kategorier** — Tekniske, fysiske, mentale mål
- **Mål-oppretting** — Sett nye mål
- **Mål-redigering** — Juster eksisterende mål
- **Mål-fullføring** — Marker mål som oppnådd

---

## 6. Fremgang

**Sti:** `apps/web/src/features/progress/`

### Komponenter

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| ProgressDashboard | `ProgressDashboard.jsx` | Fremgang-oversikt |
| ProgressDashboardContainer | `ProgressDashboardContainer.jsx` | Fremgang wrapper |
| ProgressWidget | `ProgressWidget.jsx` | Kompakt fremgang-visning |

### Funksjoner

- **Fullføringsrate** — Prosent av planlagte aktiviteter fullført
- **Streak-tracking** — Sammenhengende treningsdager
- **12-ukers trend** — Langsiktig fremgangsvisning
- **Timer logget** — Total treningstid
- **Ukentlig sammenligning** — Denne vs forrige uke
- **Progresjonsgraf** — Visuell fremgangskurve

---

## 7. Kalender

**Sti:** `apps/web/src/features/calendar/`

### Komponenter

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| CalendarPage | `CalendarPage.tsx` | Multi-view kalender |
| Kalender | `Kalender.tsx` | Kjernekalender-komponent |
| KalenderContainer | `KalenderContainer.jsx` | Kalender wrapper |
| DayViewPage | `DayViewPage.tsx` | Dagvisning-side |
| CalendarHeader | `components/CalendarHeader.tsx` | Kalender-header |
| CalendarDayView | `components/CalendarDayView.tsx` | Dag-visning |
| CalendarWeekView | `components/CalendarWeekView.tsx` | Uke-visning |
| CalendarMonthView | `components/CalendarMonthView.tsx` | Måned-visning |
| CalendarYearView | `components/CalendarYearView.tsx` | År-visning |
| EventDetailsPanel | `components/EventDetailsPanel.tsx` | Hendelse-detaljer |
| CreateSessionModal | `components/CreateSessionModal.tsx` | Enkel økt-oppretting |
| SessionPlannerModal | `components/session-planner/SessionPlannerModal.tsx` | Avansert øktplanlegger |
| SummaryStep | `session-planner/steps/SummaryStep.tsx` | Plan-oppsummering |
| ContextStep | `session-planner/steps/ContextStep.tsx` | Kontekst-valg |
| AreaStep | `session-planner/steps/AreaStep.tsx` | Område-valg |
| PyramidStep | `session-planner/steps/PyramidStep.tsx` | AK-formel pyramide |
| LPhaseStep | `session-planner/steps/LPhaseStep.tsx` | Treningsfase |
| FocusStep | `session-planner/steps/FocusStep.tsx` | Fokusområder |
| NotionWeekView | `components/NotionWeekView.tsx` | Notion-stil ukevisning |

### Funksjoner

- **Dagvisning** — Detaljert dagsplan
- **Ukevisning** — 7-dagers oversikt
- **Månedsvisning** — Månedsoversikt
- **Årsvisning** — Årsoversikt
- **Navigasjon** — Bla fremover/bakover i tid
- **Hendelse-detaljer** — Klikk for mer info
- **Rask økt-oppretting** — Enkel ny økt
- **Avansert planlegger** — Multi-step øktplanlegging
- **AK-formel** — Pyramide-basert treningsstruktur
- **Fargekoding** — Kategorier har unike farger
- **Drag & drop** — Flytt hendelser (desktop)

### Økt-typer (fargekoder)

| Type | Farge | Hex |
|------|-------|-----|
| Teknikk | Blå | #2C5F7F |
| Golfslag | Grønn | #4A7C59 |
| Spill | Mørk blå | #10456A |
| Konkurranse | Gull | #C9A227 |
| Fysisk | Oransje | #D4A84B |
| Mental | Grå | #8E8E93 |

---

## 8. Tester

**Sti:** `apps/web/src/features/tests/`

### Komponenter

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| Testresultater | `Testresultater.tsx` | Testresultat-historikk |
| TestresultaterContainer | `TestresultaterContainer.jsx` | Resultater wrapper |
| Testprotokoll | `Testprotokoll.jsx` | Testgjennomføring |
| TestprotokollContainer | `TestprotokollContainer.jsx` | Protokoll wrapper |
| RegistrerTestContainer | `RegistrerTestContainer.jsx` | Test-registrering |
| StartTestModal | `StartTestModal.jsx` | Start test UI |
| KategoriKravContainer | `KategoriKravContainer.jsx` | Kategorikrav |
| PEIBaneTestForm | `PEIBaneTestForm.jsx` | PEI banetest-skjema |
| PEIBaneTestPage | `PEIBaneTestPage.jsx` | PEI banetest-side |
| TestOverviewPage | `templates/TestOverviewPage.tsx` | Test-oversikt template |
| PercentageForm | `templates/PercentageForm.tsx` | Prosent-input |
| RoundScoringForm | `templates/RoundScoringForm.tsx` | Runde-scoring |
| TableDataForm | `templates/TableDataForm.tsx` | Tabell-data input |
| SimpleAttemptsForm | `templates/SimpleAttemptsForm.tsx` | Forsøks-telling |
| TestDetailPage | `pages/TestDetailPage.tsx` | Test-detaljvisning |

### Funksjoner

- **Testhistorikk** — Alle tidligere tester
- **Trend-analyse** — Utvikling over tid
- **Kategori-progresjon** — Fremgang per kategori
- **Start ny test** — Initier testgjennomføring
- **Test-protokoll** — Steg-for-steg gjennomføring
- **Registrer resultat** — Logg testresultater
- **Kategorikrav** — Se krav for hver kategori
- **PEI Banetest** — Spesifikk testtype
- **Prosent-baserte tester** — Treffprosent etc.
- **Runde-scoring** — Golf-runde resultater
- **Test-sammenligning** — Sammenlign flere tester

---

## 9. Prestasjoner & Badges

**Sti:** `apps/web/src/features/achievements/` & `apps/web/src/features/badges/`

### Komponenter

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| AchievementsDashboard | `achievements/AchievementsDashboard.jsx` | Prestasjons-oversikt |
| AchievementsDashboardContainer | `achievements/AchievementsDashboardContainer.jsx` | Prestasjoner wrapper |
| Badges | `badges/Badges.jsx` | Badge-utstilling |

### Funksjoner

- **XP-visning** — Total erfaringspoeng
- **Nivå-indikator** — Nåværende nivå
- **Nivå-progresjon** — XP til neste nivå
- **Badge-galleri** — Alle tilgjengelige badges
- **Opplåste badges** — Badges du har tjent
- **Låste badges** — Badges å jobbe mot
- **Badge-progresjon** — Fremgang mot badges
- **Tier-system** — Bronze, Silver, Gold, Platinum
- **Kategori-filtrering** — Filtrer på badge-type
- **Nylige prestasjoner** — Siste opplåste badges
- **Achievement-varsler** — Pop-up ved ny prestasjon

---

## 10. Notater

**Sti:** `apps/web/src/features/notes/`

### Komponenter

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| Notater | `Notater.jsx` | Notat-grensesnitt |
| NotaterContainer | `NotaterContainer.jsx` | Notater wrapper |

### Funksjoner

- **Opprett notat** — Skriv nye notater
- **Rediger notat** — Endre eksisterende
- **Slett notat** — Fjern notater
- **Notat-liste** — Oversikt over alle notater
- **Søk i notater** — Finn spesifikke notater
- **Humør-tracking** — Registrer stemning
- **Del med coach** — Send notat til trener
- **Kategorisering** — Tagg notater
- **Dato-filtrering** — Finn notater fra periode

---

## 11. Øvelser

**Sti:** `apps/web/src/features/exercises/`

### Komponenter

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| Oevelser | `Oevelser.tsx` | Øvelsesbibliotek |
| OevelserContainer | `OevelserContainer.jsx` | Øvelser wrapper |

### Funksjoner

- **Øvelsesdatabase** — Komplett øvelseskatalog
- **Søk** — Finn øvelser på navn/beskrivelse
- **Kategori-filtrering** — Filtrer på treningstype
- **Øvelse-detaljer** — Full beskrivelse og instruksjoner
- **Vanskelighetsgrad** — Nivå-indikatorer
- **Video-instruksjoner** — Embedded videoer
- **Favoritter** — Merk favoritt-øvelser
- **Legg til i økt** — Inkluder i treningsplan

---

## 12. Turneringer

**Sti:** `apps/web/src/features/tournaments/`

### Komponenter

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| MineTurneringerContainer | `MineTurneringerContainer.jsx` | Mine turneringer |
| TurneringskalenderContainer | `TurneringskalenderContainer.jsx` | Turneringskalender |
| TurneringsResultaterContainer | `TurneringsResultaterContainer.jsx` | Turneringsresultater |
| RegistrerTurneringsResultatContainer | `RegistrerTurneringsResultatContainer.jsx` | Registrer resultat |

### Funksjoner

- **Turneringskalender** — Kommende turneringer
- **Mine turneringer** — Påmeldte turneringer
- **Påmelding** — Meld deg på turnering
- **Turneringsdetaljer** — Info om turnering
- **Resultater** — Tidligere resultater
- **Registrer resultat** — Logg turneringscore
- **Rangering** — Din plassering
- **Historikk** — Alle dine turneringer

---

## 13. Treningsplaner

**Sti:** `apps/web/src/features/annual-plan/` & `apps/web/src/features/trening-plan/`

### Årsplan-komponenter

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| Aarsplan | `annual-plan/Aarsplan.jsx` | Årsplan-visning |
| AarsplanContainer | `annual-plan/AarsplanContainer.jsx` | Årsplan wrapper |
| AarsplanGenerator | `annual-plan/AarsplanGenerator.jsx` | Plan-generator |
| PlanPreview | `annual-plan/PlanPreview.jsx` | Plan-forhåndsvisning |
| PlanPreviewContainer | `annual-plan/PlanPreviewContainer.jsx` | Preview wrapper |

### Treningsplan-komponenter

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| TreningsdagbokPage | `trening-plan/treningsdagbok/TreningsdagbokPage.tsx` | Treningsdagbok |
| DagensTreningsplanContainer | `trening-plan/DagensTreningsplanContainer.jsx` | Dagens plan |
| UkensTreningsplanContainer | `trening-plan/UkensTreningsplanContainer.jsx` | Ukens plan |
| TekniskPlanContainer | `trening-plan/TekniskPlanContainer.jsx` | Teknisk plan |
| LoggTreningContainer | `trening-plan/LoggTreningContainer.jsx` | Logg trening |
| DagbokComplianceBand | `treningsdagbok/components/DagbokComplianceBand.tsx` | Compliance-indikator |
| DagbokSessionList | `treningsdagbok/components/DagbokSessionList.tsx` | Økt-liste |
| DagbokSummarySection | `treningsdagbok/components/DagbokSummarySection.tsx` | Oppsummering |
| DagbokHierarchyFilters | `treningsdagbok/components/DagbokHierarchyFilters.tsx` | Hierarkiske filtre |
| DagbokSessionRow | `treningsdagbok/components/DagbokSessionRow.tsx` | Økt-rad |
| DagbokWeeklyHeatmap | `treningsdagbok/components/DagbokWeeklyHeatmap.tsx` | Ukentlig heatmap |
| DagbokFilterBar | `treningsdagbok/components/DagbokFilterBar.tsx` | Filter-bar |

### Funksjoner

- **Årsplan-visning** — Helårs treningsstruktur
- **Plan-generering** — AI/algoritme-genererte planer
- **Plan-forhåndsvisning** — Se utkast før bekreftelse
- **Treningsdagbok** — Komplett treningslogg
- **Dagens plan** — Dagens planlagte økter
- **Ukens plan** — Ukeoversikt
- **Teknisk plan** — Teknikk-fokuserte økter
- **Manuell logging** — Logg trening manuelt
- **Compliance-tracking** — Overholdelse av plan
- **Ukentlig heatmap** — Visuell aktivitetskart
- **Hierarkiske filtre** — Multi-nivå filtrering
- **Periode-oppsummering** — Sammendrag for periode

---

## 14. Kommunikasjon

**Sti:** `apps/web/src/features/kommunikasjon/`

### Komponenter

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| MeldingerContainer | `MeldingerContainer.jsx` | Meldinger |
| FraTrenerContainer | `FraTrenerContainer.jsx` | Fra trener |
| VarslerContainer | `VarslerContainer.jsx` | Varsler |

### Funksjoner

- **Meldingsliste** — Alle meldinger
- **Fra trener** — Coach-meldinger separat
- **Les melding** — Full meldingsvisning
- **Svar på melding** — Responder til coach
- **System-varsler** — App-notifikasjoner
- **Varsel-innstillinger** — Konfigurer varsler
- **Ulest-teller** — Antall uleste meldinger
- **Meldingshistorikk** — Tidligere korrespondanse

---

## 15. Innstillinger

**Sti:** `apps/web/src/features/innstillinger/`

### Komponenter

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| VarselinnstillingerContainer | `VarselinnstillingerContainer.tsx` | Varsel-innstillinger |
| KalibreringsContainer | `KalibreringsContainer.jsx` | Kalibrering |

### Funksjoner

- **Varsel-preferanser** — Hvilke varsler du vil ha
- **Push-varsler** — Aktiver/deaktiver push
- **E-post varsler** — E-post notifikasjoner
- **Kalibrering** — System-oppsett
- **Språkvalg** — Velg språk
- **Tema** — Lys/mørk modus (fremtidig)

---

## 16. Kunnskapsbase

**Sti:** `apps/web/src/features/knowledge/`

### Komponenter

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| KnowledgeBlog | `KnowledgeBlog.jsx` | Læringsinnhold |
| RessurserContainer | `RessurserContainer.jsx` | Ressurser |

### Funksjoner

- **Artikler** — Læringsartikler
- **Tips** — Korte golf-tips
- **Tutorials** — Steg-for-steg veiledninger
- **Videoer** — Instruksjonsvideoer
- **Ressursbibliotek** — Samlede ressurser
- **Søk** — Finn spesifikt innhold
- **Kategorier** — Filtrer på tema
- **Bokmerker** — Lagre favoritter

---

## 17. Video-analyse

**Sti:** `apps/web/src/features/video-progress/`

### Komponenter

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| VideoProgressView | `VideoProgressView.jsx` | Sving-progresjon |
| SwingTimeline | `SwingTimeline.jsx` | Tidslinje |

### Funksjoner

- **Sving-progresjon** — Visuell forbedring over tid
- **Video-tidslinje** — Kronologisk video-oversikt
- **Sammenligning** — Side-by-side videoer
- **Før/etter** — Se forbedringer
- **Coach-kommentarer** — Trener-annotasjoner
- **Markører** — Viktige punkter i video

---

## Navigasjonsstruktur

```
/                           → Dashboard
/profil                     → Profil
/aarsplan                   → Årsplan
/treningsprotokoll          → Treningsplan
/ovelsesbibliotek           → Øvelsesbank
/kalender                   → Kalender
/session/:id                → Økt-detaljer
/session/:id/active         → Aktiv økt
/session/:id/reflection     → Refleksjon
/oevelser                   → Øvelser
/treningsstatistikk         → Treningsstatistikk
/progress                   → Fremgang
/achievements               → Prestasjoner
/stats                      → Statistikk
/testprotokoll              → Testprotokoll
/testresultater             → Testresultater
/turneringskalender         → Turneringskalender
/mine-turneringer           → Mine turneringer
/ressurser                  → Ressurser
/notater                    → Notater
/arkiv                      → Arkiv
/trenerteam                 → Trenerteam
```

---

## Totalt

- **18 hovedkategorier**
- **100+ komponenter**
- **200+ funksjoner**
- **30+ ruter**

---

*Dokumentet er generert automatisk fra kodebase-analyse.*
