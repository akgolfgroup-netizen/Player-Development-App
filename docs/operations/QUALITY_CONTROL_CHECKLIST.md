# 🔍 TIER Golf - Kvalitetskontroll Sjekkliste

**Dato:** 2025-12-17
**Versjon:** Beta v1.0
**Status:** 🟡 Testing Pågår

---

## 📋 Test Miljø

- **Backend:** http://localhost:3000 ✅ Kjører
- **Frontend:** http://localhost:3001 ✅ Kjører
- **Database:** PostgreSQL (iup_golf_dev) ✅ Tilgjengelig
- **Browser:** Chrome/Safari (anbefalt)

---

## 1️⃣ AUTENTISERING & SIKKERHET

### Test Login
- [ ] **Åpne:** http://localhost:3001/login
- [ ] **Test gyldig login:** player@demo.com / player123
- [ ] **Verifiser:** Redirecter til dashboard
- [ ] **Test ugyldig login:** feil@email.com / feilpassord
- [ ] **Verifiser:** Feilmelding vises
- [ ] **Test tom input:** Submit uten data
- [ ] **Verifiser:** Validering fungerer

### Test Sessions
- [ ] **Logg inn:** Som player
- [ ] **Refresh page:** Token persisterer
- [ ] **Logout:** Klikk logout
- [ ] **Verifiser:** Redirecter til login
- [ ] **Test protected route:** Gå til /profil uten login
- [ ] **Verifiser:** Redirecter til login

### Test Roller
- [ ] **Login som Admin:** admin@demo.com / admin123
- [ ] **Verifiser:** Admin-spesifikke funksjoner
- [ ] **Login som Coach:** coach@demo.com / coach123
- [ ] **Verifiser:** Coach-spesifikke funksjoner
- [ ] **Login som Player:** player@demo.com / player123
- [ ] **Verifiser:** Player-spesifikke funksjoner

**Status:** ⬜ Ikke testet

---

## 2️⃣ DESKTOP SCREENS (21 screens)

### Core Screens

#### Dashboard (/)
- [ ] **Åpne:** http://localhost:3001/
- [ ] **Verifiser:** Dagens plan vises
- [ ] **Verifiser:** Statistikk cards (Kategori, HCP, Tester)
- [ ] **Verifiser:** Loading state fungerer
- [ ] **Test:** Refresh data
- [ ] **Verifiser:** Error handling

#### Brukerprofil (/profil)
- [ ] **Åpne:** http://localhost:3001/profil
- [ ] **Verifiser:** Bruker info vises
- [ ] **Test:** Rediger profil
- [ ] **Verifiser:** Endringer lagres
- [ ] **Test:** Upload profilbilde (hvis implementert)
- [ ] **Verifiser:** Kategori fremgang vises

#### Trenerteam (/trenerteam)
- [ ] **Åpne:** http://localhost:3001/trenerteam
- [ ] **Verifiser:** Liste over trenere
- [ ] **Test:** Velg trener
- [ ] **Verifiser:** Trener-detaljer vises
- [ ] **Test:** Kontakt trener (hvis implementert)

### Planlegging & Mål

#### Målsetninger (/maalsetninger)
- [ ] **Åpne:** http://localhost:3001/maalsetninger
- [ ] **Verifiser:** Liste av mål vises
- [ ] **Test:** Opprett nytt mål
- [ ] **Verifiser:** Mål legges til i listen
- [ ] **Test:** Rediger eksisterende mål
- [ ] **Verifiser:** Endringer lagres
- [ ] **Test:** Marker mål som fullført
- [ ] **Verifiser:** Status oppdateres
- [ ] **Test:** Slett mål
- [ ] **Verifiser:** Mål fjernes

#### Årsplan (/aarsplan)
- [ ] **Åpne:** http://localhost:3001/aarsplan
- [ ] **Verifiser:** Periodisering vises (E/G/S/T)
- [ ] **Test:** Generer ny plan
- [ ] **Verifiser:** Plan genereres korrekt
- [ ] **Test:** Naviger mellom faser
- [ ] **Verifiser:** Fase-detaljer vises
- [ ] **Test:** Legg til turnering
- [ ] **Verifiser:** Turnering lagres i plan

#### Kalender (/kalender)
- [ ] **Åpne:** http://localhost:3001/kalender
- [ ] **Verifiser:** Kalendervisning fungerer
- [ ] **Test:** Naviger mellom måneder
- [ ] **Verifiser:** Økter vises på riktig dag
- [ ] **Test:** Klikk på dag
- [ ] **Verifiser:** Dagens økter vises
- [ ] **Test:** Book ny økt
- [ ] **Verifiser:** Booking lagres

### Testing

#### Testprotokoll (/testprotokoll)
- [ ] **Åpne:** http://localhost:3001/testprotokoll
- [ ] **Verifiser:** Liste over tester (20+)
- [ ] **Test:** Velg test (Driver Distance)
- [ ] **Verifiser:** Test-skjema vises
- [ ] **Test:** Registrer testresultater
- [ ] **Verifiser:** Resultater lagres
- [ ] **Test:** Auto-kalkulering (PEI)
- [ ] **Verifiser:** Formler fungerer korrekt

#### Testresultater (/testresultater)
- [ ] **Åpne:** http://localhost:3001/testresultater
- [ ] **Verifiser:** Historikk vises
- [ ] **Verifiser:** Percentiler beregnes
- [ ] **Test:** Filtrer per kategori (Driver/Putting/etc)
- [ ] **Verifiser:** Filtering fungerer
- [ ] **Test:** Sammenlign med peers
- [ ] **Verifiser:** Peer comparison vises
- [ ] **Test:** Eksporter data
- [ ] **Verifiser:** Export fungerer

### Trening

#### Treningsprotokoll (/treningsprotokoll)
- [ ] **Åpne:** http://localhost:3001/treningsprotokoll
- [ ] **Verifiser:** Logg-skjema vises
- [ ] **Test:** Logg ny økt
- [ ] **Verifiser:** Økt lagres
- [ ] **Test:** Legg til notater
- [ ] **Verifiser:** Notater lagres
- [ ] **Test:** RPE rating (1-10)
- [ ] **Verifiser:** Rating fungerer

#### Treningsstatistikk (/treningsstatistikk)
- [ ] **Åpne:** http://localhost:3001/treningsstatistikk
- [ ] **Verifiser:** Statistikk vises
- [ ] **Verifiser:** Grafer rendres korrekt
- [ ] **Test:** Velg tidsperiode (uke/måned/år)
- [ ] **Verifiser:** Data oppdateres
- [ ] **Test:** Filtrer per økt-type
- [ ] **Verifiser:** Filtering fungerer

#### Øvelser (/oevelser)
- [ ] **Åpne:** http://localhost:3001/oevelser
- [ ] **Verifiser:** Øvelsesbibliotek (150+)
- [ ] **Test:** Søk etter øvelse
- [ ] **Verifiser:** Søk fungerer
- [ ] **Test:** Filtrer per kategori
- [ ] **Verifiser:** Filtering fungerer
- [ ] **Test:** Åpne øvelse-detaljer
- [ ] **Verifiser:** Video/beskrivelse vises

### Kommunikasjon

#### Notater (/notater)
- [ ] **Åpne:** http://localhost:3001/notater
- [ ] **Verifiser:** Trener-notater vises
- [ ] **Test:** Opprett nytt notat
- [ ] **Verifiser:** Notat lagres
- [ ] **Test:** Legg til tags
- [ ] **Verifiser:** Tags fungerer
- [ ] **Test:** Pin notat
- [ ] **Verifiser:** Pinning fungerer
- [ ] **Test:** Søk i notater
- [ ] **Verifiser:** Søk fungerer

#### Arkiv (/arkiv)
- [ ] **Åpne:** http://localhost:3001/arkiv
- [ ] **Verifiser:** Arkiverte items vises
- [ ] **Test:** Filtrer per type
- [ ] **Verifiser:** Filtering fungerer
- [ ] **Test:** Restore item fra arkiv
- [ ] **Verifiser:** Restore fungerer
- [ ] **Test:** Permanent slett
- [ ] **Verifiser:** Sletting fungerer

### Fremgang & Achievements

#### Progress Dashboard (/progress)
- [ ] **Åpne:** http://localhost:3001/progress
- [ ] **Verifiser:** Handicap-graf vises
- [ ] **Verifiser:** Kategorifremgang vises
- [ ] **Test:** Velg tidsperiode
- [ ] **Verifiser:** Graf oppdateres
- [ ] **Verifiser:** Statistikk er korrekt

#### Achievements (/achievements)
- [ ] **Åpne:** http://localhost:3001/achievements
- [ ] **Verifiser:** Achievement badges vises
- [ ] **Verifiser:** Poeng-system fungerer
- [ ] **Test:** Filtrer per kategori
- [ ] **Verifiser:** Filtering fungerer
- [ ] **Test:** Marker som sett
- [ ] **Verifiser:** "NEW" badge forsvinner

### Spesialskjermer

#### Plan Preview (/plan-preview/:planId)
- [ ] **Åpne:** Med gyldig planId
- [ ] **Verifiser:** Full plan vises (365 dager)
- [ ] **Test:** Switch view modes (5 modes)
- [ ] **Verifiser:** Alle modes fungerer
- [ ] **Test:** Accept plan
- [ ] **Verifiser:** Plan aktiveres
- [ ] **Test:** Request modifications
- [ ] **Verifiser:** Request sendes
- [ ] **Test:** Reject plan
- [ ] **Verifiser:** Plan arkiveres

#### Modification Requests (/coach/modification-requests)
- [ ] **Login som Coach**
- [ ] **Åpne:** http://localhost:3001/coach/modification-requests
- [ ] **Verifiser:** Requests vises
- [ ] **Test:** Sorter per urgency
- [ ] **Verifiser:** Sorting fungerer
- [ ] **Test:** Godta request
- [ ] **Verifiser:** Status oppdateres
- [ ] **Test:** Avvis request
- [ ] **Verifiser:** Status oppdateres

### Session Screens

#### Session Detail (/session/:sessionId)
- [ ] **Åpne:** Med gyldig sessionId
- [ ] **Verifiser:** Session detaljer vises
- [ ] **Test:** Start session
- [ ] **Verifiser:** Redirecter til active view

#### Active Session (/session/:sessionId/active)
- [ ] **Verifiser:** Timer fungerer
- [ ] **Test:** Logg exercise sets
- [ ] **Verifiser:** Logging fungerer
- [ ] **Test:** Complete session
- [ ] **Verifiser:** Redirecter til reflection

#### Session Reflection (/session/:sessionId/reflection)
- [ ] **Verifiser:** Reflection form vises
- [ ] **Test:** Fyll ut reflection
- [ ] **Verifiser:** Lagres korrekt
- [ ] **Test:** Submit reflection
- [ ] **Verifiser:** Redirecter til dashboard

#### Exercise Library (/ovelsesbibliotek)
- [ ] **Åpne:** http://localhost:3001/ovelsesbibliotek
- [ ] **Verifiser:** Library vises
- [ ] **Test:** Søk funksjoner
- [ ] **Verifiser:** Søk fungerer
- [ ] **Test:** Legg til i favoritter
- [ ] **Verifiser:** Favoritter lagres

**Desktop Status:** ⬜ 0/21 testet

---

## 3️⃣ MOBILE SCREENS (5 screens)

### Mobile Home (/m/home)
- [ ] **Åpne:** http://localhost:3001/m/home
- [ ] **Verifiser:** Responsivt design
- [ ] **Verifiser:** Touch gestures fungerer
- [ ] **Test:** Quick actions
- [ ] **Verifiser:** Actions fungerer

### Mobile Plan (/m/plan)
- [ ] **Åpne:** http://localhost:3001/m/plan
- [ ] **Verifiser:** Dagens plan vises
- [ ] **Test:** Swipe mellom dager
- [ ] **Verifiser:** Navigation fungerer

### Mobile Quick Log (/m/log)
- [ ] **Åpne:** http://localhost:3001/m/log
- [ ] **Verifiser:** Quick log form
- [ ] **Test:** Logg rask økt
- [ ] **Verifiser:** Lagres korrekt

### Mobile Calendar (/m/calendar)
- [ ] **Åpne:** http://localhost:3001/m/calendar
- [ ] **Verifiser:** Touch-friendly kalender
- [ ] **Test:** Velg dag
- [ ] **Verifiser:** Dagens økter vises

### Mobile Calibration (/m/calibration)
- [ ] **Åpne:** http://localhost:3001/m/calibration
- [ ] **Verifiser:** Calibration wizard
- [ ] **Test:** Fullør calibration
- [ ] **Verifiser:** Data lagres

**Mobile Status:** ⬜ 0/5 testet

---

## 4️⃣ API ENDPOINTS

### Auth Endpoints
```bash
# Test login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"player@demo.com","password":"player123"}'

# Expected: 200 + JWT token
```
- [ ] **POST /auth/login** - Returnerer token
- [ ] **POST /auth/logout** - Logger ut
- [ ] **POST /auth/register** - Registrerer bruker
- [ ] **GET /auth/me** - Returnerer brukerinfo

### Player Endpoints
- [ ] **GET /players** - Liste spillere
- [ ] **GET /players/:id** - Hent spiller
- [ ] **POST /players** - Opprett spiller
- [ ] **PUT /players/:id** - Oppdater spiller
- [ ] **DELETE /players/:id** - Slett spiller

### Test Endpoints
- [ ] **GET /tests** - Liste tester
- [ ] **POST /tests/results** - Registrer resultat
- [ ] **GET /tests/results/:id** - Hent resultat
- [ ] **PUT /tests/results/:id** - Oppdater resultat

### Training Plan Endpoints
- [ ] **POST /training-plan/generate** - Generer plan
- [ ] **GET /training-plan/:planId/full** - ⭐ Hent full plan (Task 2)
- [ ] **PUT /training-plan/:planId/accept** - ⭐ Aktiver plan (Task 2)
- [ ] **POST /training-plan/:planId/modification-request** - ⭐ Request changes (Task 2)
- [ ] **PUT /training-plan/:planId/reject** - ⭐ Avvis plan (Task 2)

### Goals Endpoints (Task 2)
- [ ] **GET /goals** - Liste mål
- [ ] **POST /goals** - Opprett mål
- [ ] **PUT /goals/:id** - Oppdater mål
- [ ] **DELETE /goals/:id** - Slett mål
- [ ] **POST /goals/:id/complete** - Marker som fullført

### Notes Endpoints (Task 2)
- [ ] **GET /notes** - Liste notater
- [ ] **POST /notes** - Opprett notat
- [ ] **PUT /notes/:id** - Oppdater notat
- [ ] **DELETE /notes/:id** - Slett notat
- [ ] **POST /notes/:id/pin** - Pin notat

### Archive Endpoints (Task 2)
- [ ] **GET /archive** - Liste arkiv
- [ ] **POST /archive** - Arkiver item
- [ ] **POST /archive/:id/restore** - Restore item
- [ ] **DELETE /archive/:id** - Permanent slett

### Achievements Endpoints (Task 2)
- [ ] **GET /achievements** - Liste achievements
- [ ] **POST /achievements** - Unlock achievement
- [ ] **GET /achievements/stats** - Hent statistikk
- [ ] **PATCH /achievements/:id/viewed** - Marker som sett

**API Status:** ⬜ 0/40+ testet

---

## 5️⃣ DATABASE OPERASJONER

### Migrations
- [ ] **Verifiser:** Alle migrasjoner kjørt
- [ ] **Test:** Rollback siste migrasjon
- [ ] **Test:** Re-apply migrasjon
- [ ] **Verifiser:** Ingen data tap

### Seed Data
- [ ] **Kjør:** `npm run prisma:seed`
- [ ] **Verifiser:** Demo brukere opprettet
- [ ] **Verifiser:** Test data tilgjengelig
- [ ] **Test:** Login med seed users

### Data Integrity
- [ ] **Test:** Foreign key constraints
- [ ] **Test:** Cascade deletes
- [ ] **Test:** Unique constraints
- [ ] **Verifiser:** Ingen orphaned records

### Performance
- [ ] **Test:** Query response times (< 100ms)
- [ ] **Verifiser:** Indexes fungerer
- [ ] **Test:** Concurrent users
- [ ] **Verifiser:** No connection leaks

**Database Status:** ⬜ Ikke testet

---

## 6️⃣ KRITISKE BRUKERFLYTER

### Ny Bruker Onboarding
1. [ ] Registrer ny bruker
2. [ ] Fullfør intake form
3. [ ] Generer første plan
4. [ ] Book første økt
5. [ ] Verifiser: Alt lagres korrekt

### Test & Evaluering Flow
1. [ ] Login som player
2. [ ] Gå til testprotokoll
3. [ ] Registrer driver test
4. [ ] Se resultater med percentile
5. [ ] Sammenlign med peers
6. [ ] Verifiser: Auto-kalkulering korrekt

### Plan & Modifikasjon Flow
1. [ ] Coach genererer plan for player
2. [ ] Player mottar plan
3. [ ] Player ber om endringer
4. [ ] Coach mottar request (email?)
5. [ ] Coach godkjenner/avviser
6. [ ] Player får oppdatert plan
7. [ ] Verifiser: Hele flyten fungerer

### Treningsøkt Flow
1. [ ] Player ser dagens plan
2. [ ] Starter økten
3. [ ] Logger exercises
4. [ ] Fullf ører reflection
5. [ ] Statistikk oppdateres
6. [ ] Verifiser: Data synkronisert

### Achievement Flow
1. [ ] Player fullfører mål
2. [ ] Achievement unlocked
3. [ ] Notifikasjon vises
4. [ ] Poeng tildeles
5. [ ] Verifiser: Achievement system fungerer

**Brukerflyter Status:** ⬜ 0/5 testet

---

## 7️⃣ YTELSE & SIKKERHET

### Performance
- [ ] **Lighthouse Score:** > 80
- [ ] **Bundle Size:** < 500KB gzipped
- [ ] **API Response:** < 200ms average
- [ ] **Database Queries:** Optimized (< 100ms)
- [ ] **Memory Leaks:** None detected

### Security
- [ ] **HTTPS:** Enforced (prod)
- [ ] **JWT:** Proper expiration
- [ ] **SQL Injection:** Protected (Prisma)
- [ ] **XSS:** Protected (React escaping)
- [ ] **CSRF:** Tokens implemented
- [ ] **Rate Limiting:** Configured
- [ ] **CORS:** Properly configured

### Browser Compatibility
- [ ] **Chrome:** Latest
- [ ] **Safari:** Latest
- [ ] **Firefox:** Latest
- [ ] **Mobile Safari:** iOS 14+
- [ ] **Mobile Chrome:** Android 10+

**Ytelse Status:** ⬜ Ikke testet

---

## 8️⃣ ERROR HANDLING

### Frontend Errors
- [ ] **Network Error:** Graceful fallback
- [ ] **404 Errors:** Proper error page
- [ ] **401 Errors:** Auto-redirect to login
- [ ] **500 Errors:** User-friendly message
- [ ] **Loading States:** Everywhere
- [ ] **Empty States:** Informative

### Backend Errors
- [ ] **Validation Errors:** Clear messages
- [ ] **Auth Errors:** Proper status codes
- [ ] **Database Errors:** Logged & handled
- [ ] **Not Found:** 404 responses
- [ ] **Server Errors:** 500 with logging

**Error Handling Status:** ⬜ Ikke testet

---

## 9️⃣ NOTIFICATIONS

### Email Notifications (Task 2)
- [ ] **SMTP:** Configured (or console)
- [ ] **Modification Request:** Coach får email
- [ ] **Plan Rejection:** Coach får email
- [ ] **HTML Templates:** Rendres korrekt
- [ ] **Unsubscribe:** Link fungerer (future)

### In-App Notifications
- [ ] **Toast Messages:** Fungerer
- [ ] **Success:** Green toast
- [ ] **Error:** Red toast
- [ ] **Info:** Blue toast
- [ ] **Auto-dismiss:** 3-5 sekunder

**Notifications Status:** ⬜ Ikke testet

---

## 🔟 DOCUMENTATION

- [ ] **README:** Oppdatert
- [ ] **API Docs:** OpenAPI tilgjengelig
- [ ] **User Guide:** For players
- [ ] **Coach Guide:** For coaches
- [ ] **Admin Guide:** For administrators
- [ ] **Deployment Guide:** Step-by-step

**Documentation Status:** ⬜ Ikke testet

---

## ✅ SAMMENDRAG

### Status Oversikt

| Kategori | Tests | Fullført | Status |
|----------|-------|----------|--------|
| Autentisering | 15 | 0 | ⬜ Ikke startet |
| Desktop Screens | 21 | 0 | ⬜ Ikke startet |
| Mobile Screens | 5 | 0 | ⬜ Ikke startet |
| API Endpoints | 40+ | 0 | ⬜ Ikke startet |
| Database | 10 | 0 | ⬜ Ikke startet |
| Brukerflyter | 5 | 0 | ⬜ Ikke startet |
| Ytelse | 10 | 0 | ⬜ Ikke startet |
| Error Handling | 12 | 0 | ⬜ Ikke startet |
| Notifications | 8 | 0 | ⬜ Ikke startet |
| Documentation | 6 | 0 | ⬜ Ikke startet |

**TOTAL:** 0/132+ tests fullført

---

## 📝 NOTATER & ISSUES

### Funnet Bugs
*Ingen funnet ennå*

### Performance Issues
*Ingen funnet ennå*

### Forbedringer
*Ingen identifisert ennå*

---

## 🚀 NESTE STEG

1. Start systematisk testing med autentisering
2. Test alle desktop screens en etter en
3. Verifiser API endpoints
4. Test kritiske brukerflyter
5. Lag rapport med funn
6. Prioriter og fiks issues
7. Re-test etter fikser
8. Godkjenn for beta

---

**Opprettet:** 2025-12-17
**Av:** Claude Code
**Formål:** Kvalitetssikring før beta-lansering
