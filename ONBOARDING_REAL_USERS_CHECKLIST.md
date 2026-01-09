# Onboarding Faktiske Spillere og Trenere - Sjekkliste

**Dato**: 2026-01-08
**Status**: Pre-implementering
**Mål**: Legge inn første reelle spiller og trener med komplett data

---

## 🎯 OVERSIKT

For å kunne ta i bruk appen med faktiske spillere og trenere må følgende være på plass:

1. **Database-oppsett** - Tabeller og relasjoner
2. **Autentisering** - Login og roller
3. **Onboarding-prosess** - Spiller og trener setup
4. **Datapunkter** - Minimum nødvendig informasjon
5. **Integrasjoner** - Eksterne systemer
6. **Testing** - Validere at alt fungerer

---

## FASE 1: DATABASE OG BACKEND (Kritisk)

### ✅ Sjekk: Er database-tabellene på plass?

**Nødvendige tabeller**:
```
[ ] users - Brukertabell (spillere og trenere)
[ ] profiles - Utvidet profilinformasjon
[ ] roles - Roller (player, coach, admin)
[ ] coach_athlete_relationships - Trener-spiller relasjoner
[ ] sessions - Treningsøkter
[ ] session_logs - Økt-loggføring
[ ] tests - Testresultater
[ ] test_protocols - Testprotokoll-definisjoner
[ ] goals - Målsetninger
[ ] training_plans - Treningsplaner
[ ] exercises - Øvelser
[ ] videos - Video-bibliotek
[ ] video_annotations - Video-annoteringer
[ ] tournaments - Turneringer
[ ] tournament_registrations - Turneringspåmeldinger
[ ] calendar_events - Kalenderavtaler
[ ] bookings - Booking/reservasjoner
[ ] messages - Meldinger mellom bruker-trener
[ ] notifications - Varslinger
[ ] badges - Merker/achievements
[ ] player_badges - Spilleres merker
[ ] statistics - Statistikk data
[ ] strokes_gained - Strokes Gained data
[ ] peer_comparisons - Peer-sammenligninger
[ ] billing - Fakturering
[ ] subscriptions - Abonnementer
```

**Database-sjekk kommando**:
```bash
# Kjør i backend
npm run db:check-schema
# Eller manually
psql -d tier_golf -c "\dt"
```

---

### ✅ Sjekk: Er Supabase setup korrekt?

**Supabase-oppsett**:
```
[ ] Supabase project opprettet
[ ] Environment variables (.env):
    - REACT_APP_SUPABASE_URL
    - REACT_APP_SUPABASE_ANON_KEY
    - SUPABASE_SERVICE_ROLE_KEY
[ ] Row Level Security (RLS) policies definert
[ ] Storage buckets opprettet:
    - profile-images
    - video-uploads
    - exercise-media
    - tournament-documents
[ ] Database functions og triggers
[ ] Realtime subscriptions konfigurert
```

**Supabase test**:
```javascript
// Test i browser console
import { supabase } from './lib/supabase';
const { data, error } = await supabase.from('users').select('*').limit(1);
console.log('Supabase test:', data, error);
```

---

### ✅ Sjekk: API endpoints fungerer

**Kritiske endpoints**:
```
[ ] POST /api/auth/register - Registrer ny bruker
[ ] POST /api/auth/login - Login
[ ] GET /api/users/:id - Hent brukerprofil
[ ] PUT /api/users/:id - Oppdater profil
[ ] GET /api/sessions - Hent treningsøkter
[ ] POST /api/sessions - Opprett økt
[ ] GET /api/goals - Hent målsetninger
[ ] POST /api/goals - Opprett mål
[ ] GET /api/statistics/:userId - Hent statistikk
[ ] POST /api/tests - Registrer test
[ ] GET /api/calendar/:userId - Hent kalender
[ ] POST /api/bookings - Book tid
[ ] GET /api/coach/athletes - Hent treners spillere
[ ] POST /api/messages - Send melding
```

**API test**:
```bash
# Test API lokalt
curl -X GET http://localhost:3001/api/health
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

---

## FASE 2: AUTENTISERING OG ROLLER

### ✅ Autentiseringsflyt

**Implementert**:
```
[ ] Login-side (/login)
[ ] Registrering (/register)
[ ] Forgot password (/forgot-password)
[ ] Reset password (/reset-password)
[ ] Email verification
[ ] OAuth providers (Google, Apple)
[ ] Role-based access control (RBAC)
[ ] Protected routes (ProtectedRoute component)
[ ] Session management (tokens, refresh)
[ ] Logout funksjonalitet
```

**Test autentisering**:
```
1. Gå til /register
2. Opprett testbruker med epost og passord
3. Verifiser epost (hvis påkrevd)
4. Login med testbruker
5. Sjekk at riktig rolle vises (player/coach)
6. Test logout
7. Test "Forgot password" flow
```

---

### ✅ Roller og tilganger

**Roller definert**:
```
[ ] Player - Spillerrolle
[ ] Coach - Trenerrolle
[ ] Admin - Administratorrolle
```

**Tilgangskontroll**:
```
[ ] Players kan se egen data
[ ] Players kan IKKE se andre spilleres data
[ ] Coaches kan se sine spilleres data
[ ] Coaches kan IKKE se andre coaches sine spillere
[ ] Admins kan se all data
```

**Test roller**:
```
1. Opprett 1 spiller, 1 trener, 1 admin
2. Login som spiller - sjekk at kun player-routes er tilgjengelig
3. Login som trener - sjekk at coach-routes er tilgjengelig
4. Login som admin - sjekk at admin-routes er tilgjengelig
5. Test at spiller IKKE kan nå /coach routes
6. Test at trener IKKE kan se andre treneres spillere
```

---

## FASE 3: ONBOARDING-PROSESS

### ✅ Spiller-onboarding

**Onboarding-steg** (etter registrering):
```
Steg 1: Velkomst og rolle-bekreftelse
[ ] Vis velkomstskjerm
[ ] Bekreft rolle (player)
[ ] Samle inn grunnleggende info:
    - Fullt navn
    - Fødselsdato
    - Kjønn
    - Telefon
    - Adresse

Steg 2: Golf-profil
[ ] Handicap
[ ] Heimebane
[ ] Kategori (A-K system)
[ ] Spiller siden (år)
[ ] Ambisjonsnivå (hobby, klubb, region, nasjonalt, elite)
[ ] Foretrukket hånd (høyre/venstre)

Steg 3: Fysisk profil
[ ] Høyde (cm)
[ ] Vekt (kg)
[ ] Tidligere skader
[ ] Fysiske begrensninger

Steg 4: Trenerkobling
[ ] Velg hovedtrener fra liste
[ ] Inviter trener (hvis ikke i system)
[ ] Godkjenn at trener kan se din data

Steg 5: Målsetninger
[ ] Kortsiktige mål (3 mnd)
[ ] Langsiktige mål (12 mnd)
[ ] Fokusområder (teknikk, fysisk, mental, spill)

Steg 6: Første treningsplan
[ ] Velg ferdig treningsplan (mal)
[ ] Eller opprett custom plan
[ ] Sett opp første treningsøkt

Steg 7: Kalender-integrasjon
[ ] Koble til Google Calendar (optional)
[ ] Sett opp booking-preferanser
[ ] Velg tilgjengelighet

Steg 8: Betalingsinformasjon
[ ] Velg abonnementsplan
[ ] Legg inn betalingsmetode (Stripe)
[ ] Godkjenn vilkår
```

**Onboarding-komponent**:
```
Fil: /src/features/onboarding/OnboardingV2.tsx
Status: [ ] Implementert [ ] Må oppdateres [ ] Ikke implementert
```

---

### ✅ Trener-onboarding

**Onboarding-steg** (etter registrering):
```
Steg 1: Velkomst og rolle-bekreftelse
[ ] Vis velkomstskjerm
[ ] Bekreft rolle (coach)
[ ] Samle inn grunnleggende info:
    - Fullt navn
    - Fødselsdato
    - Telefon
    - Epost (business)

Steg 2: Trener-kvalifikasjoner
[ ] PGA-sertifisering (ja/nei + nummer)
[ ] Andre sertifiseringer
[ ] Erfaring (år)
[ ] Spesialiseringer (junior, elite, fysisk, mental)
[ ] Bio (200 ord)
[ ] Profilbilde

Steg 3: Organisasjonstilknytning
[ ] Golfklubb/Akademi navn
[ ] Adresse
[ ] Organisasjonsnummer
[ ] Rolle i organisasjon

Steg 4: Kalender og booking
[ ] Sett opp arbeidsuke (dager/timer)
[ ] Definere øktlengder (30/60/90 min)
[ ] Priser per økttype
[ ] Booking-policies (avbestillingsregler)

Steg 5: Treningssystem og filosofi
[ ] Velg treningsfilosofi (mal)
[ ] Kategorisystem preference (A-K standard eller custom)
[ ] Testprotokoll preferanser

Steg 6: Spillere
[ ] Importer eksisterende spillere (CSV)
[ ] Inviter første spiller
[ ] Eller hopp over (kan legges til senere)

Steg 7: Betalingsinformasjon
[ ] Velg abonnementsplan (coach-tier)
[ ] Legg inn betalingsmetode
[ ] Bank-kontoinfo for utbetalinger (hvis relevant)
[ ] Godkjenn vilkår
```

**Onboarding-komponent**:
```
Fil: /src/features/onboarding/CoachOnboardingV2.tsx
Status: [ ] Implementert [ ] Må oppdateres [ ] Ikke implementert
```

---

## FASE 4: MINIMUM DATAPUNKTER

### ✅ Spiller - Minimum Required Data

**Profil (påkrevd)**:
```json
{
  "userId": "uuid",
  "email": "spiller@example.com",
  "role": "player",
  "firstName": "Ola",
  "lastName": "Nordmann",
  "dateOfBirth": "2005-03-15",
  "phone": "+47 12345678",
  "gender": "male",
  "profileImage": "https://...",
  "createdAt": "2026-01-08"
}
```

**Golf-profil (påkrevd)**:
```json
{
  "handicap": 5.4,
  "homeClub": "Oslo Golf Club",
  "category": "E", // A-K system
  "playingSince": 2015,
  "ambitionLevel": "regional", // hobby|club|regional|national|elite
  "preferredHand": "right"
}
```

**Trener-relasjon (påkrevd)**:
```json
{
  "coachId": "uuid-of-coach",
  "athleteId": "uuid-of-player",
  "relationshipType": "primary", // primary|secondary
  "startDate": "2026-01-08",
  "status": "active"
}
```

**Første mål (optional men anbefalt)**:
```json
{
  "title": "Senke handicap til 3.0",
  "description": "Fokus på putting og kort spill",
  "targetDate": "2026-06-30",
  "category": "technical",
  "status": "in_progress",
  "milestones": [
    {
      "title": "Forbedre putting-gjennomsnitt til 1.8 per hull",
      "deadline": "2026-03-31"
    }
  ]
}
```

---

### ✅ Trener - Minimum Required Data

**Profil (påkrevd)**:
```json
{
  "userId": "uuid",
  "email": "trener@example.com",
  "role": "coach",
  "firstName": "Kari",
  "lastName": "Trenersen",
  "phone": "+47 98765432",
  "bio": "PGA-sertifisert trener med 10 års erfaring...",
  "profileImage": "https://...",
  "createdAt": "2026-01-08"
}
```

**Kvalifikasjoner (påkrevd)**:
```json
{
  "pgaCertified": true,
  "pgaNumber": "PGA-123456",
  "certifications": ["PGA Level 3", "TrackMan Certified"],
  "experienceYears": 10,
  "specializations": ["junior", "technique", "mental"]
}
```

**Organisasjon (påkrevd)**:
```json
{
  "organizationName": "Oslo Golf Academy",
  "organizationAddress": "Bygdøy allé 1, Oslo",
  "organizationNumber": "123456789",
  "role": "Head Coach"
}
```

**Kalender-setup (påkrevd for booking)**:
```json
{
  "workingHours": {
    "monday": {"start": "09:00", "end": "17:00"},
    "tuesday": {"start": "09:00", "end": "17:00"},
    "wednesday": {"start": "09:00", "end": "17:00"},
    "thursday": {"start": "09:00", "end": "17:00"},
    "friday": {"start": "09:00", "end": "17:00"},
    "saturday": {"start": "10:00", "end": "14:00"},
    "sunday": null
  },
  "sessionDurations": [30, 60, 90], // minutes
  "bookingPolicies": {
    "advanceBookingDays": 14,
    "cancellationHours": 24
  }
}
```

---

## FASE 5: INTEGRASJONER

### ✅ Eksterne systemer som må kobles til

**Betalingssystem**:
```
[ ] Stripe integration
    - API keys (.env)
    - Webhook endpoint: /api/stripe/webhook
    - Products/Plans definert i Stripe
    - Test med test-kort
    - Produksjon med ekte kort

Test Stripe:
- Test-kort: 4242 4242 4242 4242
- Opprett test-abonnement
- Sjekk at webhook registrerer betaling
```

**Email-system**:
```
[ ] SendGrid / Resend integration
    - API key (.env)
    - Email templates:
        - Velkomst-epost
        - Verifisering
        - Passord reset
        - Booking-bekreftelse
        - Påminnelser
    - Test utsending

Test Email:
- Send test-epost til deg selv
- Sjekk at alle templates rendres riktig
```

**Kalender**:
```
[ ] Google Calendar integration (optional)
    - OAuth setup
    - Calendar sync
    - Test two-way sync

[ ] Notion integration (hvis brukt)
    - API key
    - Database ID
    - Test sync
```

**TrackMan** (hvis tilgjengelig):
```
[ ] TrackMan API integration
    - API credentials
    - Endpoint: /api/trackman/sync
    - Test data import
```

**Video storage**:
```
[ ] Supabase Storage buckets
    - video-uploads bucket
    - Max file size: 500MB
    - Allowed formats: .mp4, .mov, .avi
    - Test upload og playback

[ ] Alternative: AWS S3 / Cloudinary
```

---

## FASE 6: TESTDATA OG VALIDERING

### ✅ Opprett testbruker

**Testspiller 1** (komplett profil):
```
Email: test.spiller@iup-golf.com
Passord: Test1234!
Navn: Test Spiller
Handicap: 12.5
Kategori: G
Trener: Test Trener

Data å legge inn:
- 5 treningsøkter (siste 2 uker)
- 3 testresultater (driver, putting, short game)
- 2 målsetninger
- 1 turneringspåmelding
- 10 videoer (5 swing, 5 putting)
- 3 annoterte videoer
```

**Testtrener 1** (komplett profil):
```
Email: test.trener@iup-golf.com
Passord: Test1234!
Navn: Test Trener
PGA: PGA-TEST-001
Organisasjon: Test Golf Academy

Data å legge inn:
- 3 spillere (koble til testspiller 1 + opprett 2 dummy)
- 1 treningsplan (ukentlig)
- 10 øvelser i bibliotek
- 5 økter planlagt (neste 2 uker)
- 3 evalueringer av økt
```

---

### ✅ Valideringstester

**Funksjonelle tester**:
```
[ ] Login som spiller → Se dashboard → All data vises
[ ] Logg treningsøkt → Sjekk at den vises i historikk
[ ] Registrer test → Sjekk at den vises i statistikk
[ ] Opprett mål → Sjekk progresjon
[ ] Last opp video → Sjekk playback
[ ] Annoter video → Sjekk at markering lagres
[ ] Book tid med trener → Sjekk at den vises i kalender
[ ] Send melding til trener → Sjekk mottak
[ ] Oppdater profil → Sjekk at endringer lagres

[ ] Login som trener → Se coach dashboard
[ ] Se spilleres data → Sjekk at korrekt spiller vises
[ ] Opprett treningsplan for spiller → Sjekk at spiller ser den
[ ] Evaluer økt → Sjekk at spiller får tilbakemelding
[ ] Send melding til spiller → Sjekk mottak
[ ] Se statistikk for spiller → Valider data
[ ] Eksporter rapport → Last ned PDF
```

**Performance-tester**:
```
[ ] Dashboard loader på < 2 sekunder
[ ] Video upload (50MB) tar < 1 minutt
[ ] Statistikk-sider loader på < 1 sekund
[ ] Kalender-view loader på < 500ms
[ ] Søk i spillerliste (100+ spillere) < 500ms
```

**Brukeropplevelse**:
```
[ ] Navigasjon er intuitiv
[ ] Alle knapper fungerer
[ ] Ingen broken links
[ ] Responsivt design (desktop/tablet/mobil)
[ ] Ingen console errors
[ ] Loading states vises
[ ] Error handling fungerer
```

---

## FASE 7: PRODUKSJONSKLARGJØRING

### ✅ Pre-launch sjekkliste

**Backend**:
```
[ ] Database migrations kjørt
[ ] Seeds/fixtures lastet (hvis nødvendig)
[ ] API rate limiting konfigurert
[ ] CORS policies satt korrekt
[ ] Environment variables satt (prod)
[ ] Logging og monitoring setup (Sentry, LogRocket)
[ ] Backup-rutiner konfigurert
[ ] SSL-sertifikat installert
[ ] Domain DNS peker til server
```

**Frontend**:
```
[ ] Production build fungerer (npm run build)
[ ] Environment variables satt (.env.production)
[ ] Analytics setup (Google Analytics / Mixpanel)
[ ] Error tracking (Sentry)
[ ] CDN konfigurert (for assets)
[ ] Service worker (PWA) fungerer
[ ] Meta tags for SEO
[ ] Favicon og app icons
```

**Sikkerhet**:
```
[ ] HTTPS påkrevd
[ ] Password hashing (bcrypt)
[ ] JWT tokens med expiry
[ ] XSS protection
[ ] CSRF protection
[ ] SQL injection prevention
[ ] Rate limiting på auth endpoints
[ ] Input validation på alle felter
[ ] File upload validation (type, size)
```

**Compliance**:
```
[ ] GDPR-kompatibel (privacy policy, data handling)
[ ] Cookie consent banner
[ ] Brukervilkår (Terms of Service)
[ ] Data export funksjonalitet (GDPR right to access)
[ ] Data deletion funksjonalitet (GDPR right to erasure)
```

---

## FASE 8: ONBOARDING FØRSTE REELLE BRUKER

### ✅ Første spiller

**Pre-onboarding**:
```
1. [ ] Velg spiller (ideelt: engasjert, tech-savvy, gir feedback)
2. [ ] Send invitasjon via epost
3. [ ] Forbered onboarding-call (15-30 min)
4. [ ] Ha testdata klar å vise
```

**Under onboarding**:
```
1. [ ] Gå gjennom registrering sammen
2. [ ] Fyll inn profil step-by-step
3. [ ] Demonstrer nøkkelfunksjoner:
    - Logg treningsøkt
    - Se statistikk
    - Sett mål
    - Last opp video
    - Booking
4. [ ] Svar på spørsmål
5. [ ] Noter tilbakemeldinger
```

**Post-onboarding**:
```
1. [ ] Send oppfølgingsepost med viktige lenker
2. [ ] Be om feedback etter 1 uke
3. [ ] Overvåk brukeraktivitet første uken
4. [ ] Løs eventuelle problemer raskt
```

---

### ✅ Første trener

**Pre-onboarding**:
```
1. [ ] Velg trener (ideelt: erfaren, teknisk komfortabel)
2. [ ] Send invitasjon via epost
3. [ ] Forbered onboarding-call (30-45 min)
4. [ ] Ha testdata klar å vise
```

**Under onboarding**:
```
1. [ ] Gå gjennom registrering sammen
2. [ ] Fyll inn profil og kvalifikasjoner
3. [ ] Sett opp kalender og booking
4. [ ] Legg til første spiller (hvis allerede i systemet)
5. [ ] Demonstrer nøkkelfunksjoner:
    - Se spilleroversikt
    - Opprett treningsplan
    - Evaluer økt
    - Analyser statistikk
    - Send melding
6. [ ] Svar på spørsmål
7. [ ] Noter tilbakemeldinger
```

**Post-onboarding**:
```
1. [ ] Send oppfølgingsepost med ressurser
2. [ ] Tilby support første 2 uker
3. [ ] Be om feedback etter 2 uker
4. [ ] Overvåk brukeraktivitet
```

---

## 📊 METRIKKER Å FØLGE

**Brukerengasjement**:
```
- Daily Active Users (DAU)
- Weekly Active Users (WAU)
- Session duration
- Features used per session
- Retention rate (D1, D7, D30)
```

**Funksjonalitet**:
```
- Treningsøkter logget per uke
- Videoer lastet opp per uke
- Mål opprettet og fullført
- Bookings gjennomført
- Meldinger sendt
- Tester registrert
```

**Teknisk**:
```
- Page load times
- API response times
- Error rate
- Crash rate
- Video upload success rate
```

---

## 🚀 TIMELINE

**Uke 1-2**: Setup og testing
- Database og backend klart
- Autentisering fungerer
- API endpoints testet
- Testbrukere opprettet

**Uke 3**: Onboarding implementation
- Onboarding-flow ferdig
- Integrasjoner på plass
- Email templates klare

**Uke 4**: Pilot
- Onboard første spiller og trener
- Samle feedback
- Fikse kritiske bugs

**Uke 5+**: Scale
- Onboard flere brukere
- Iterere basert på feedback
- Utvikle nye features

---

## ✅ KLART FOR PRODUKSJON?

**Sjekkliste før launch**:
```
[ ] Alle kritiske bugs fikset
[ ] Performance godkjent
[ ] Sikkerhet validert
[ ] Backups fungerer
[ ] Monitoring aktiv
[ ] Support-kanaler satt opp
[ ] Dokumentasjon ferdig
[ ] Team trent på support
[ ] Rollback-plan på plass
```

---

**Lykke til med onboarding! 🏌️‍♂️⛳**

**Neste steg**: Gjennomgå listen, marker hva som er ferdig, identifiser gaps, og prioriter!
