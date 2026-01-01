# Implementeringsplan: Spiller-funksjoner (Delvis)

**Opprettet:** 2024-12-30
**Status:** Aktiv plan

---

## Oversikt

15 spiller-funksjoner er delvis implementert og trenger fullføring. Denne planen prioriterer arbeidet basert på brukerverdi og kompleksitet.

---

## FASE 1: Høy Prioritet (Daglig bruk)

### 1.1 Notes (Notater) - 85% ferdig
**Estimert arbeid:** Liten innsats
**Brukerverdi:** Høy

| Oppgave | Beskrivelse |
|---------|-------------|
| ✅ CRUD UI | Opprett/les/oppdater/slett fungerer |
| ✅ Tags & mood | 7 kategorier + humør-tracking |
| ✅ Søk & filter | Fungerer lokalt |
| ⬜ API-integrasjon | Koble til `/api/v1/notes` |
| ⬜ Persistens | Lagre til database |
| ⬜ Rich text | Legg til markdown-støtte |

**Filer å oppdatere:**
- `apps/web/src/features/notes/NotaterContainer.jsx`
- `apps/api/src/api/v1/notes/` (opprett)

---

### 1.2 Progress (Fremgang) - 40% ferdig
**Estimert arbeid:** Medium innsats
**Brukerverdi:** Høy

| Oppgave | Beskrivelse |
|---------|-------------|
| ✅ Stats-kort | Fullføringsrate, streak, økter |
| ✅ 12-ukers trend | Progress bars UI |
| ⬜ API-data | Hent ekte treningsdata |
| ⬜ Beregninger | Implementer trend-logikk |
| ⬜ Charts | Legg til chart-bibliotek |
| ⬜ Mål vs faktisk | Sammenligning |

**Filer å oppdatere:**
- `apps/web/src/features/progress/ProgressPage.jsx`
- `apps/web/src/hooks/useProgress.js` (opprett)

---

### 1.3 Notifications (Varsler) - 35% ferdig
**Estimert arbeid:** Medium innsats
**Brukerverdi:** Høy

| Oppgave | Beskrivelse |
|---------|-------------|
| ✅ Varselsenter UI | Filter og ikoner |
| ✅ Merk som lest | Fungerer lokalt |
| ⬜ Data-henting | useNotifications hook |
| ⬜ Real-time | WebSocket/polling |
| ⬜ Deep linking | Naviger til ressurs |
| ⬜ Preferanser | Varselinnstillinger |

**Filer å oppdatere:**
- `apps/web/src/features/notifications/NotificationCenter.jsx`
- `apps/web/src/hooks/useNotifications.js`

---

## FASE 2: Medium Prioritet (Ukentlig bruk)

### 2.1 Innstillinger (Settings) - 60% ferdig
**Estimert arbeid:** Medium innsats
**Brukerverdi:** Medium

| Oppgave | Beskrivelse |
|---------|-------------|
| ✅ Kalibrering UI | Driver-metrikker |
| ✅ Klubbavstander | 13 klubber |
| ✅ Fysiske metrikker | Styrke, fleksibilitet |
| ⬜ API-lagring | settingsAPI.saveCalibration |
| ⬜ Validering | Min/max verdier |
| ⬜ Enheter | Metrisk vs imperial |

**Filer å oppdatere:**
- `apps/web/src/features/innstillinger/CalibrationSettings.jsx`
- `apps/api/src/api/v1/settings/` (opprett)

---

### 2.2 Periodeplaner - 85% ferdig
**Estimert arbeid:** Liten innsats
**Brukerverdi:** Medium

| Oppgave | Beskrivelse |
|---------|-------------|
| ✅ 4 perioder | Off-season til transition |
| ✅ Ukentlige timer | Per fokustype |
| ✅ Mål-tracking | Fullføringsstatus |
| ⬜ API-integrasjon | Hent/lagre perioder |
| ⬜ Redigering | Rediger ukentlige økter |
| ⬜ Kalender-sync | Integrer med kalender |

**Filer å oppdatere:**
- `apps/web/src/features/periodeplaner/PerioderPage.jsx`
- `apps/api/src/api/v1/periods/` (opprett)

---

### 2.3 Calendar-oversikt - 75% ferdig
**Estimert arbeid:** Liten innsats
**Brukerverdi:** Medium

| Oppgave | Beskrivelse |
|---------|-------------|
| ✅ Unified view | Dag/uke/måned |
| ✅ Event-filtrering | Per type |
| ✅ Hooks | useOversiktState |
| ⬜ Event-redigering | Opprett/rediger UI |
| ⬜ Drag-and-drop | Flytt hendelser |
| ⬜ Konflikter | Markér overlapp |

**Filer å oppdatere:**
- `apps/web/src/features/calendar-oversikt/UnifiedCalendarView.tsx`
- `apps/web/src/features/calendar-oversikt/EventModal.tsx` (opprett)

---

### 2.4 Archive (Arkiv) - 70% ferdig
**Estimert arbeid:** Medium innsats
**Brukerverdi:** Medium

| Oppgave | Beskrivelse |
|---------|-------------|
| ✅ Mappestruktur | Planer, tester, videoer |
| ✅ År-filter | 2023-2025 |
| ✅ Dokumentkort | Med metadata |
| ⬜ Backend | Filsystem-integrasjon |
| ⬜ Nedlasting | Faktisk fil-henting |
| ⬜ Opplasting | Legg til filer |

**Filer å oppdatere:**
- `apps/web/src/features/archive/ArchivePage.jsx`
- `apps/api/src/api/v1/files/` (opprett)

---

## FASE 3: Video-funksjoner

### 3.1 Video-analysis - 75% ferdig
**Estimert arbeid:** Stor innsats
**Brukerverdi:** Høy

| Oppgave | Beskrivelse |
|---------|-------------|
| ✅ VideoAnalyzer | Komponent-integrasjon |
| ✅ Annotasjoner | Tegne/markere |
| ✅ Kommentarer | Panel-struktur |
| ⬜ Videospiller | Kontroller (pause, søk) |
| ⬜ Tegneverktøy | Velg verktøy UI |
| ⬜ AI-analyse | Sving-forslag |

**Filer å oppdatere:**
- `apps/web/src/features/video-analysis/VideoAnalyzer.jsx`
- `apps/web/src/components/video/VideoPlayerControls.jsx` (opprett)

---

### 3.2 Video-comparison - 50% ferdig
**Estimert arbeid:** Stor innsats
**Brukerverdi:** Høy

| Oppgave | Beskrivelse |
|---------|-------------|
| ✅ Dual video slots | Valggrensesnitt |
| ✅ Videomodal | Med grid |
| ✅ URL-state | Persistens |
| ⬜ Synk-avspilling | Implementer |
| ⬜ Frame-by-frame | Sammenligning |
| ⬜ Metrikk-overlay | Hastighet, vinkel |

**Filer å oppdatere:**
- `apps/web/src/features/video-comparison/VideoComparisonPage.jsx`
- `apps/web/src/components/video/SyncPlayer.jsx` (opprett)

---

### 3.3 Video-progress - 50% ferdig
**Estimert arbeid:** Medium innsats
**Brukerverdi:** Medium

| Oppgave | Beskrivelse |
|---------|-------------|
| ✅ SwingTimeline | Kronologisk visning |
| ✅ Kategori-filter | Fungerer |
| ✅ Stats-visning | Videoer sporet |
| ⬜ Trend-charts | Grafikk-rendering |
| ⬜ Metrikk-ekstraksjon | Fra videoer |
| ⬜ Før/etter | Sammenligning |

**Filer å oppdatere:**
- `apps/web/src/features/video-progress/VideoProgressView.jsx`
- `apps/web/src/features/video-progress/TrendChart.jsx` (opprett)

---

### 3.4 Bevis (Evidence) - 50% ferdig
**Estimert arbeid:** Medium innsats
**Brukerverdi:** Medium

| Oppgave | Beskrivelse |
|---------|-------------|
| ✅ Videolisting | Med kategorier |
| ✅ Upload UI | Placeholder |
| ✅ Verifisering | Statusvisning |
| ⬜ Upload handler | Faktisk opplasting |
| ⬜ Verifikasjon | Arbeidsflyt |
| ⬜ Trener-review | System |

**Filer å oppdatere:**
- `apps/web/src/features/bevis/BevisPage.jsx`
- `apps/web/src/services/uploadService.js` (opprett)

---

## FASE 4: Tilleggsfunksjoner

### 4.1 Samlinger (Camps) - 90% ferdig
**Estimert arbeid:** Liten innsats
**Brukerverdi:** Lav-Medium

| Oppgave | Beskrivelse |
|---------|-------------|
| ✅ Camp-kort | Med priser og datoer |
| ✅ Detaljmodal | Full info |
| ✅ Påmelding UI | Lokal state |
| ⬜ API-kobling | Hent ekte camps |
| ⬜ Persistens | Lagre påmelding |
| ⬜ Betaling | Integrasjon |

**Filer å oppdatere:**
- `apps/web/src/features/samlinger/SamlingerPage.jsx`
- `apps/api/src/api/v1/camps/` (opprett)

---

### 4.2 Coaches (Trenerteam) - 30% ferdig
**Estimert arbeid:** Medium innsats
**Brukerverdi:** Medium

| Oppgave | Beskrivelse |
|---------|-------------|
| ✅ Trenerkort | Avatar, rolle, kontakt |
| ✅ Rollesystem | 5 roller med farger |
| ⬜ Data-lasting | Fra API |
| ⬜ Profiler | Kvalifikasjoner |
| ⬜ Booking | Timereservering |
| ⬜ Meldinger | Kommunikasjon |

**Filer å oppdatere:**
- `apps/web/src/features/coaches/CoachesPage.jsx`
- `apps/web/src/hooks/useCoachTeam.js` (opprett)

---

### 4.3 Exercises (Øvelser) - 20% ferdig
**Estimert arbeid:** Stor innsats
**Brukerverdi:** Medium

| Oppgave | Beskrivelse |
|---------|-------------|
| ✅ Container | Grunnstruktur |
| ⬜ Øvelsesdatabase | API-integrasjon |
| ⬜ Øvelseskort | Med video/bilde |
| ⬜ Søk & filter | Funksjonalitet |
| ⬜ Vanskelighetsgrad | System |
| ⬜ Treningsplan | Bygg treningsøkt |

**Filer å oppdatere:**
- `apps/web/src/features/exercises/ExercisesPage.jsx`
- `apps/api/src/api/v1/exercises/` (utvid)

---

### 4.4 Focus-engine - 60% ferdig
**Estimert arbeid:** Liten innsats
**Brukerverdi:** Medium

| Oppgave | Beskrivelse |
|---------|-------------|
| ✅ FocusWidget | Anbefalinger |
| ✅ Komponent-scoring | OTT, APP, ARG, PUTT |
| ✅ API-tilkobling | /focus-engine/me/focus |
| ⬜ Forklarings-UI | Hvorfor denne anbefaling |
| ⬜ Treningsforslag | Basert på fokus |
| ⬜ Historikk | Tidligere fokusområder |

**Filer å oppdatere:**
- `apps/web/src/features/focus-engine/FocusWidget.jsx`
- `apps/web/src/features/focus-engine/FocusExplanation.jsx` (opprett)

---

## Prioritert Rekkefølge

### Sprint 1: Fundament
1. **Notes** - Ferdigstill API-integrasjon
2. **Progress** - Koble til treningsdata
3. **Notifications** - Real-time varsler

### Sprint 2: Planlegging
4. **Innstillinger** - Lagre kalibrering
5. **Periodeplaner** - API-persistens
6. **Calendar-oversikt** - Event-redigering

### Sprint 3: Video
7. **Video-analysis** - Spillerkontroller
8. **Video-comparison** - Synk-avspilling
9. **Video-progress** - Trend-charts
10. **Bevis** - Upload-system

### Sprint 4: Komplett
11. **Archive** - Filsystem
12. **Samlinger** - Camp-booking
13. **Coaches** - Trener-profiler
14. **Exercises** - Øvelsesbibliotek
15. **Focus-engine** - Forklaringer

---

## API-endepunkter som trengs

```
POST   /api/v1/notes
GET    /api/v1/notes
PUT    /api/v1/notes/:id
DELETE /api/v1/notes/:id

GET    /api/v1/progress/overview
GET    /api/v1/progress/trends

GET    /api/v1/notifications
PUT    /api/v1/notifications/:id/read
PUT    /api/v1/notifications/preferences

POST   /api/v1/settings/calibration
GET    /api/v1/settings/calibration

GET    /api/v1/periods
PUT    /api/v1/periods/:id

GET    /api/v1/files
POST   /api/v1/files/upload
GET    /api/v1/files/:id/download

GET    /api/v1/camps
POST   /api/v1/camps/:id/register

GET    /api/v1/coaches/team
GET    /api/v1/coaches/:id/availability
```

---

## Neste steg

Start med **Sprint 1** - Notes, Progress, Notifications. Disse gir umiddelbar brukerverdi og er relativt enkle å fullføre.
