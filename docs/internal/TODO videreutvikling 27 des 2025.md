# TODO: Videreutvikling 27. desember 2025

**Opprettet:** 27. desember 2025
**Ansvarlig:** [TBD]
**Status:** Under arbeid
**Demo-deadline:** 48 timer (29. desember 2025)

---

## KRITISK: DEMO OM 48 TIMER

### Blokkerende Bugs (MÅ fikses)

- [x] ~~**Email templates mangler i dist/**~~
  - **FIKSET:** Kopiert manuelt fra src/templates til dist/templates
  - **TODO:** Legg til kopi-steg i build-script for permanent fix
  - Fil: `apps/api/package.json` - legg til postbuild script

- [x] ~~**Build-script må kopiere templates automatisk**~~
  - **FIKSET:** Lagt til `"postbuild": "cp -r src/templates dist/"` i package.json
  - Templates kopieres nå automatisk ved `npm run build`

- [ ] **Tester feiler (487 av 616)**
  - Hovedsakelig integrasjonstester
  - TypeError i teardown: `Cannot read properties of undefined (reading 'close')`
  - Prioritet: Medium (ikke blokkerende for demo, men bør fikses)

### Backend Status

| Komponent | Status | Merknad |
|-----------|--------|---------|
| API Build | ✅ OK | Bygger på 345ms |
| Database migrations | ✅ OK | 11 migrasjoner, alle anvendt |
| Seed data | ✅ OK | 4 brukere, 293 øvelser, 141 treningsøkter |
| Health endpoint | ✅ OK | `/health` fungerer |
| Auth/Login | ✅ OK | JWT tokens genereres |
| Redis | ✅ OK | Cache og rate limiting |
| PostgreSQL | ✅ OK | Docker container kjører |

### Frontend Status

| Komponent | Status | Merknad |
|-----------|--------|---------|
| Build | ✅ OK | Bygger med warnings (ikke errors) |
| ESLint warnings | ⚠️ 50+ | Ubrukte variabler, missing deps |
| TypeScript | ✅ OK | Ingen type-feil |

### ESLint Warnings (bør ryddes før demo)

- [ ] `useAnnotationCanvas.js` - manglende useCallback deps
- [ ] `useVideoPlayer.js` - ubrukte imports (initHls, destroyHls, etc.)
- [ ] `VideoLibraryPage.jsx` - ubrukt 'loadingRequests'
- [ ] `Toast.composite.tsx` - manglende useCallback dep
- [ ] `ThemeSwitcher.tsx` - manglende useEffect dep

---

## DEMO-FORBEREDELSER

### Demo-brukerkontoer

| Rolle | E-post | Passord |
|-------|--------|---------|
| Admin | admin@demo.com | admin123 |
| Coach | coach@demo.com | coach123 |
| Player | player@demo.com | player123 |

### Demo-data tilgjengelig

- ✅ 1 spiller (Andreas Holm)
- ✅ 1 trener (Anders Kristiansen)
- ✅ 293 øvelser
- ✅ 141 treningsøkter
- ✅ 36 testresultater
- ✅ 16 videoer
- ✅ 24 badges opptjent

### Før Demo-kjøring

- [ ] Verifiser at API kjører: `PORT=3000 npm start`
- [ ] Verifiser at frontend kjører: `npm start` (port 3001)
- [ ] Test login-flow for alle roller
- [ ] Test dashboard-lasting
- [ ] Test video-opplasting
- [ ] Forberede backup-data hvis noe feiler

---

## FUNKSJONELLE MANGLER (TODO i kode)

### Høy prioritet (påvirker demo)

- [ ] **Video-bevis åpning** (`BevisContainer.jsx`)
  - `onClick={() => { /* TODO: Open video detail/player */ }}`

- [ ] **Logg trening lagring** (`LoggTreningContainer.jsx`)
  - `// TODO: Save to backend API`

- [ ] **Turneringsresultat lagring** (`RegistrerTurneringsResultatContainer.jsx`)
  - `// TODO: Save tournament result to backend API`

### Medium prioritet

- [ ] **Verify reset token** (`VerifyResetToken.jsx`)
  - `// TODO: Replace with actual API call`

- [ ] **2FA disable** (`TwoFactorDisable.jsx`)
  - `// TODO: Replace with actual API call`

- [ ] **Coach scheduled messages** (`CoachScheduledMessages.tsx`)
  - Delete og send now ikke implementert

- [ ] **Coach exercises** (`CoachMyExercises.tsx`)
  - Duplicate og delete ikke implementert via API

### Lavere prioritet

- [ ] Spillerprofil onboarding submit
- [ ] Stats verktøy navigasjon
- [ ] Skoleoppgaver detail navigering
- [ ] Utviklingsoversikt area navigering
- [ ] Error boundary tracking (Sentry)

---

## DOKUMENTER OPPRETTET

- [x] Presentasjon NGF (`/docs/PRESENTASJON_NGF_13_JANUAR.md`)
- [x] Schedule A: Service Description (`/docs/contracts/SCHEDULE_A_SERVICE_DESCRIPTION.md`)
- [x] Schedule B: Data Processing Agreement (`/docs/contracts/SCHEDULE_B_DATA_PROCESSING.md`)
- [x] Schedule C: Commercial Terms (`/docs/contracts/SCHEDULE_C_COMMERCIAL_TERMS.md`)
- [x] Technical Appendix (`/docs/contracts/TECHNICAL_APPENDIX.md`)
- [x] Schedule-dokumenter oversikt (`/docs/innbox/SCHEDULE_DOKUMENTER_OVERSIKT.md`)
- [x] Juridisk veiledning databehandling (`/docs/contracts/JURIDISK_VEILEDNING_DATABEHANDLING.md`)

---

## JURIDISK OG PERSONVERN

### Kritisk (Må gjøres før NGF-møtet 13. jan)

- [ ] **Juridisk gjennomgang av Schedule B (DPA)**
  - Advokat med personvernkompetanse
  - Fokus på mindreårige og samtykke
  - Frist: Senest 10. januar

- [ ] **DPIA (Data Protection Impact Assessment)**
  - Vurdere om nødvendig før NGF-lansering
  - Dokumentere risikovurdering
  - Kontakte Datatilsynet hvis påkrevd

- [ ] **Samtykkeformular for mindreårige**
  - Ferdigstille digital versjon
  - Tilpasse norsk juridisk praksis
  - Verifiseringsmekanisme for foreldre

### Viktig

- [ ] **Personvernerklæring**
  - Oppdatere med NGF-spesifikk informasjon
  - Alderstilpasset språk for barn

- [ ] **Avviksprosedyre**
  - Dokumentere intern varslingsprosess
  - 72-timers frist til Datatilsynet

---

## KOMMERSIELT

### Kritisk

- [ ] **Prisvalidering Schedule C**
  - Sammenligne med konkurrenter
  - Verifisere marginer

- [ ] **NGF rabattstruktur**
  - Ferdigstille pilotavtale (3 mnd gratis)
  - Volumrabatt 40-50%

- [ ] **Pilotprogram detaljer**
  - Identifisere 2-3 pilotklubber
  - Definere suksesskriterier

---

## TEKNISK (etter demo)

### Build-forbedringer

- [ ] **Automatisk template-kopiering**
  ```json
  "postbuild": "cp -r src/templates dist/"
  ```

- [ ] **Fikse test-teardown**
  - `tests/integration/exercises.test.ts:44` - undefined.close error

- [ ] **Rydde console.log statements**
  - 78 console statements i API-koden
  - Erstatte med logger

### Video-analyse

- [ ] Custom video player (under utvikling)
- [ ] Annotation tools (under utvikling)
- [ ] Voice-over (planlagt)
- [ ] Side-by-side comparison (planlagt)

### Integrasjoner (roadmap)

- [ ] Trackman import
- [ ] GC Quad import
- [ ] GolfBox sync
- [ ] Golf Genius turneringsdata

---

## PRESENTASJON (13. januar)

### Kritisk

- [ ] **Presentasjonsmateriell**
  - Konvertere MD til PowerPoint/Keynote
  - Designe visuelle slides

- [ ] **Live demo**
  - Script for demo-gjennomgang
  - Backup-plan ved tekniske problemer

- [ ] **Q&A forberedelser**
  - FAQ
  - Potensielle innvendinger

---

## TIDSLINJE

| Dato | Milepæl |
|------|---------|
| **27. des** | Dokumenter opprettet, app-gjennomgang |
| **29. des** | **DEMO DEADLINE** |
| 30. des | Juridisk gjennomgang startet |
| 3. jan | Prisvalidering ferdig |
| 6. jan | Demo-miljø klart |
| 8. jan | Presentasjon ferdig |
| 10. jan | Intern gjennomkjøring |
| **13. jan** | **NGF-presentasjon** |

---

## INFRASTRUKTUR-STATUS

### Docker Containers

```bash
# Sjekk status
docker ps

# Forventet output:
# iup-golf-postgres (port 5432)
# iup-golf-redis (port 6379)
```

### Start API

```bash
cd apps/api
npm run build  # postbuild kopierer templates automatisk
PORT=3000 npm start
```

### Start Frontend

```bash
cd apps/web
npm start  # Kjører på port 3001
```

---

## NOTATER

### 27. desember 2025
- Alle grunnlagsdokumenter opprettet
- Juridisk veiledning ferdigstilt
- **Full app-gjennomgang utført:**
  - Backend: 173 filer, bygger OK
  - Frontend: 72 features, bygger OK med warnings
  - Database: 70 tabeller, seed-data OK
  - Kritisk bug fikset: email templates
  - Identifisert 20+ TODO-items i kode
  - Test-suite: 129 pass, 487 fail (integrasjon)

---

## KOMMANDOER

### Kjør alt lokalt
```bash
# Terminal 1: API
cd /Users/anderskristiansen/Developer/IUP_Master_V1/apps/api
npm run build && PORT=3000 npm start

# Terminal 2: Frontend
cd /Users/anderskristiansen/Developer/IUP_Master_V1/apps/web
npm start
```

### Test login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"player@demo.com","password":"player123"}'
```

### Sjekk health
```bash
curl http://localhost:3000/health
```

---

**Sist oppdatert:** 27. desember 2025 kl. 15:30
