# PRIORITERT IMPLEMENTERINGSPLAN - AK Golf Academy

> Generert: 2025-12-31
> Status: Klar for gjennomføring

---

## OVERSIKT

| Prioritet | Feature | Estimat | Kompleksitet |
|:---------:|---------|---------|:------------:|
| **P1** | Årsplan → Økt synkronisering | 2-3 timer | Høy |
| **P2** | Periodeplaner kobling | 1-2 timer | Medium |
| **P3** | Skoleplan implementasjon | 2 timer | Medium |
| **P4** | Push-varsler | 1 time | Lav |
| **P5** | Offline-støtte | 3-4 timer | Høy |
| **P6** | PDF-eksport | 2-3 timer | Medium |
| **P7** | AI Coach | 4+ timer | Høy |
| **P8** | Peer comparison frontend | 1-2 timer | Lav |

---

## P1: ÅRSPLAN → ØKT SYNKRONISERING

### Problem
Når bruker lager årsplan, synkroniseres ikke økter automatisk til kalender.

### Løsning
Koble AarsplanGenerator til calendar API og sessions API.

### Oppgaver (AUTO-YES)
```
[ ] 1.1 Les apps/api/src/api/v1/training-plan/index.ts
[ ] 1.2 Legg til endpoint: POST /training-plan/:planId/sync-to-calendar
[ ] 1.3 Oppdater AarsplanGenerator.jsx med sync-knapp
[ ] 1.4 Legg til API-kall i frontend for synkronisering
[ ] 1.5 Test sync-funksjonalitet
```

### Teknisk detaljer
- Backend: Ny service `syncPlanToCalendar(planId, playerId)`
- Frontend: Knapp "Synkroniser til kalender" i AarsplanGenerator
- Database: Bruk eksisterende `TrainingSession` og `Event` modeller

---

## P2: PERIODEPLANER KOBLING

### Problem
Periodeplaner viser UI men kobler ikke til faktiske treningsøkter.

### Løsning
Koble PeriodeplanerContainer til training-plan API.

### Oppgaver (AUTO-YES)
```
[ ] 2.1 Les PeriodeplanerContainer.jsx for å forstå struktur
[ ] 2.2 Legg til API-kall for å hente periodeplaner
[ ] 2.3 Koble perioder til sessions via playerId
[ ] 2.4 Vis faktiske økter per periode
[ ] 2.5 Test visning
```

### Teknisk detaljer
- Bruk `trainingPlanAPI.getPeriods(playerId)`
- Map perioder til `TrainingSession` via datoer

---

## P3: SKOLEPLAN IMPLEMENTASJON

### Problem
Skoleplan er placeholder med mock-data.

### Løsning
Koble til skoleplan API og vis faktiske oppgaver.

### Oppgaver (AUTO-YES)
```
[ ] 3.1 Les apps/api/src/api/v1/skoleplan/ struktur
[ ] 3.2 Sjekk database-modeller (Fag, Oppgave, Skoletime)
[ ] 3.3 Oppdater SkoleplanContainer med API-kall
[ ] 3.4 Vis fag, oppgaver og skoletimer
[ ] 3.5 Legg til opprett/rediger funksjonalitet
[ ] 3.6 Test CRUD operasjoner
```

### Teknisk detaljer
- Modeller: `Fag`, `Oppgave`, `Skoletime`
- API: `/api/v1/skoleplan`

---

## P4: PUSH-VARSLER

### Problem
Push-varsler fungerer delvis, mangler service worker setup.

### Løsning
Fullføre PWA push notification setup.

### Oppgaver (AUTO-YES)
```
[ ] 4.1 Sjekk public/service-worker.js
[ ] 4.2 Oppdater NotificationContext med push subscription
[ ] 4.3 Legg til backend endpoint for push tokens
[ ] 4.4 Test push på mobil via Capacitor
[ ] 4.5 Verifiser varsler kommer gjennom
```

### Teknisk detaljer
- Bruk Web Push API
- Capacitor: `@capacitor/push-notifications`

---

## P5: OFFLINE-STØTTE

### Problem
App fungerer ikke uten internett.

### Løsning
Implementer service worker caching og IndexedDB.

### Oppgaver (AUTO-YES)
```
[ ] 5.1 Konfigurer Workbox i CRA
[ ] 5.2 Cache statiske assets
[ ] 5.3 Implementer IndexedDB for data
[ ] 5.4 Lag sync-queue for offline handlinger
[ ] 5.5 Vis offline-indikator i UI
[ ] 5.6 Test offline-modus
```

### Teknisk detaljer
- Workbox for service worker
- IndexedDB via `idb` bibliotek
- Background sync for køede handlinger

---

## P6: PDF-EKSPORT

### Problem
Ingen mulighet for å eksportere rapporter som PDF.

### Løsning
Implementer PDF-generering for viktige rapporter.

### Oppgaver (AUTO-YES)
```
[ ] 6.1 Installer jspdf og html2canvas
[ ] 6.2 Lag ExportButton komponent
[ ] 6.3 Legg til PDF-eksport i Dashboard
[ ] 6.4 Legg til PDF-eksport i Testresultater
[ ] 6.5 Legg til PDF-eksport i Årsplan
[ ] 6.6 Legg til PDF-eksport i Statistikk
[ ] 6.7 Test alle eksporter
```

### Teknisk detaljer
- `jspdf` for PDF-generering
- `html2canvas` for å konvertere HTML til bilde
- Eksporter: Dashboard, Testresultater, Årsplan, Statistikk

---

## P7: AI COACH

### Problem
AI Coach er eksperimentell og ufullstendig.

### Løsning
Fullføre AI Coach integrasjon med Claude API.

### Oppgaver (AUTO-YES)
```
[ ] 7.1 Les apps/api/src/api/v1/ai/ struktur
[ ] 7.2 Sjekk eksisterende AI-integrasjon
[ ] 7.3 Implementer chat-grensesnitt
[ ] 7.4 Koble til spillerdata for kontekst
[ ] 7.5 Lag treningsforslag basert på data
[ ] 7.6 Test AI-anbefalinger
```

### Teknisk detaljer
- Claude API for AI
- Kontekst: Spillerdata, testresultater, mål
- Output: Treningsforslag, feedback

---

## P8: PEER COMPARISON FRONTEND

### Problem
Backend for peer comparison er klar, men frontend mangler.

### Løsning
Bygge frontend-komponent for sammenligning.

### Oppgaver (AUTO-YES)
```
[ ] 8.1 Les apps/api/src/api/v1/peer-comparison/
[ ] 8.2 Lag PeerComparisonWidget komponent
[ ] 8.3 Vis sammenligning med anonymiserte peers
[ ] 8.4 Legg til i Dashboard
[ ] 8.5 Legg til i Statistikk-hub
[ ] 8.6 Test visning
```

### Teknisk detaljer
- API: `peerComparisonAPI`
- Vis: Percentiler, gjennomsnitt, beste/verste
- Anonymisert data (ingen navn)

---

## AUTO-YES OPPGAVELISTE

Følgende oppgaver kan kjøres automatisk uten bekreftelse:

### BATCH 1: P1 + P2 (Planlegging)
```bash
# Årsplan synk + Periodeplaner
1.1, 1.2, 1.3, 1.4, 1.5
2.1, 2.2, 2.3, 2.4, 2.5
```

### BATCH 2: P3 + P4 (Skole + Varsler)
```bash
# Skoleplan + Push
3.1, 3.2, 3.3, 3.4, 3.5, 3.6
4.1, 4.2, 4.3, 4.4, 4.5
```

### BATCH 3: P6 + P8 (Eksport + Sammenligning)
```bash
# PDF + Peer comparison
6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7
8.1, 8.2, 8.3, 8.4, 8.5, 8.6
```

### BATCH 4: P5 + P7 (Avansert)
```bash
# Offline + AI (krever mer arbeid)
5.1, 5.2, 5.3, 5.4, 5.5, 5.6
7.1, 7.2, 7.3, 7.4, 7.5, 7.6
```

---

## KJØREKOMMANDO

For å starte implementering, si:

> "Kjør Batch 1" eller "Start P1"

Alle oppgaver i batchen kjøres automatisk uten bekreftelse.

---

## AVHENGIGHETER

```
P1 (Årsplan) ──┬──> P2 (Periodeplaner)
               │
P3 (Skole)     │
               │
P4 (Push) ─────┴──> P5 (Offline)

P6 (PDF)       (Uavhengig)

P7 (AI)        (Uavhengig)

P8 (Peer)      (Uavhengig)
```

Anbefalt rekkefølge: P1 → P2 → P3 → P4 → P6 → P8 → P5 → P7

