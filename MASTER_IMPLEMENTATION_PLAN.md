# TIER Golf - Master Implementeringsplan

**Opprettet**: 2026-01-08
**Status**: I gang
**Scope**: UI-forbedringer + Integrasjoner + Onboarding
**Estimat totalt**: 3-4 uker

---

## 🎯 OVERORDNET STRATEGI

Vi implementerer i **3 parallelle spor**:

1. **UI/UX Track** - Forbedringer av navigasjon og brukeropplevelse
2. **Integration Track** - Backend og eksterne tjenester
3. **Onboarding Track** - Database og bruker-setup

**Prioritering**: Kritiske blokkere først, deretter parallell utvikling

---

## 📅 IMPLEMENTERINGSPLAN (4 Uker)

### **UKE 1: Foundation & Quick Wins**

#### **Mandag-Tirsdag: Kritiske UI-fikser** (Track 1)
```
✅ FERDIG:
- Duplikate headings fjernet
- Gold buttons fikset

🔜 NESTE:
- [ ] Video-konsolidering (1 dag)
      Flytt video-sammenligning og annotering til tabs
      File: /src/features/hub-pages/TreningHub.tsx

- [ ] Teknisk plan duplikat (0.5 dag)
      Velg: Bevis ELLER Teknikkplan
      Beslutning nødvendig fra deg
```

#### **Onsdag-Torsdag: Database & Backend check** (Track 3)
```
- [ ] Sjekk database tabeller (0.5 dag)
      Verifiser at alle nødvendige tabeller eksisterer

- [ ] Verifiser backend API endpoints (0.5 dag)
      Test kritiske endpoints

- [ ] Sjekk Supabase setup (0.5 dag)
      Eller hvilket DB system som brukes
```

#### **Fredag: Email Service Setup** (Track 2)
```
- [ ] Setup SendGrid konto (1 time)
- [ ] Implementer backend email service (3 timer)
- [ ] Lag email templates (2 timer)
- [ ] Test password reset email (1 time)
```

---

### **UKE 2: Integrasjoner & UI Polish**

#### **Mandag: OAuth & Stripe Setup** (Track 2)
```
- [ ] Google Cloud Console setup (2 timer)
- [ ] Implementer OAuth backend (2 timer)
- [ ] Stripe account setup (1 time)
- [ ] Implementer Stripe backend (3 timer)
```

#### **Tirsdag: Aktivere OAuth & Stripe** (Track 2)
```
- [ ] Aktivere Google Sign-In i frontend (2 timer)
- [ ] Test OAuth flow (1 time)
- [ ] Aktivere Stripe i frontend (2 timer)
- [ ] Test payment flow med test-kort (2 timer)
```

#### **Onsdag-Torsdag: Turneringer & Mer-området** (Track 1)
```
- [ ] Konsolider turneringer til tabs (1 dag)
      /plan/turneringer som hub med 3 tabs

- [ ] Reorganiser Mer-området (1 dag)
      Split "Ressurser" i logiske kategorier
```

#### **Fredag: Onboarding Flow Start** (Track 3)
```
- [ ] Implementer spiller-onboarding (4 timer)
- [ ] Implementer trener-onboarding (4 timer)
```

---

### **UKE 3: Advanced Features & Testing**

#### **Mandag-Tirsdag: Sentry & Notifications** (Track 2)
```
- [ ] Setup Sentry account (1 time)
- [ ] Implementer Sentry frontend (2 timer)
- [ ] Test error capture (1 time)

- [ ] Socket.IO setup (4 timer)
- [ ] Implementer real-time notifications (4 timer)
```

#### **Onsdag: Google Calendar Sync** (Track 2)
```
- [ ] Enable Calendar API (1 time)
- [ ] Implementer backend calendar service (4 timer)
- [ ] Implementer frontend sync (3 timer)
```

#### **Torsdag-Fredag: Testing & Data** (Track 3)
```
- [ ] Opprett testbruker 1 (spiller) (2 timer)
- [ ] Opprett testbruker 2 (trener) (2 timer)
- [ ] Legg inn testdata (4 timer)
- [ ] Valideringstesting (4 timer)
```

---

### **UKE 4: Polish, Documentation & Demo Prep**

#### **Mandag-Tirsdag: Final UI Polish**
```
- [ ] Profil edit som modal (0.5 dag)
- [ ] Testing/statistikk navnegiving (0.5 dag)
- [ ] Quick actions forbedringer (0.5 dag)
- [ ] Dark mode testing (0.5 dag)
```

#### **Onsdag: Analytics & Monitoring**
```
- [ ] Aktivere PostHog analytics (2 timer)
- [ ] Test event tracking (2 timer)
- [ ] Setup monitoring dashboards (2 timer)
```

#### **Torsdag: Integration Testing**
```
- [ ] End-to-end user flows (4 timer)
- [ ] Payment flows testing (2 timer)
- [ ] Error scenarios testing (2 timer)
```

#### **Fredag: Demo Prep**
```
- [ ] Documentation oppdatering (3 timer)
- [ ] Demo script (2 timer)
- [ ] Backup plan (1 time)
- [ ] Final testing (2 timer)
```

---

## 🚦 KRITISK KJEDE (Må gjøres i rekkefølge)

### **BLOCKER 1: Database Check** (Før onboarding)
```
MUST → Verifiser database tabeller
MUST → Sjekk Supabase/DB connection
THEN → Kan implementere onboarding
```

### **BLOCKER 2: Backend API** (Før integrasjoner)
```
MUST → Verifiser backend kjører
MUST → Test kritiske endpoints
THEN → Kan implementere integrasjoner
```

### **BLOCKER 3: Email Service** (Før OAuth/Stripe testing)
```
MUST → Setup email service
THEN → Kan teste forgot password
THEN → Kan teste payment receipts
```

---

## ⚡ PARALLELLE TASKS (Kan gjøres samtidig)

### **Parallelt Sett 1: UI + Database Check**
```
Person A: Video-konsolidering (UI)
Person B: Database verification (Backend)
→ Ingen avhengigheter
```

### **Parallelt Sett 2: OAuth + Stripe**
```
Task A: Google OAuth setup
Task B: Stripe setup
→ Begge uavhengige
→ Kan gjøres samme dag
```

### **Parallelt Sett 3: UI Polish + Testing**
```
Track 1: Siste UI-forbedringer
Track 2: Validering og testing
→ Kan pågå samtidig
```

---

## 📋 DETALJERT TASK BREAKDOWN

### **TRACK 1: UI/UX FORBEDRINGER**

#### **1.1 Video-konsolidering** (Prioritet: HØY)
**Estimat**: 1 dag
**Filer**:
- `/src/features/hub-pages/TreningHub.tsx`
- `/src/config/player-navigation-v4.ts`

**Implementering**:
```
1. Opprett ny video hub-komponent med tabs:
   - Tab 1: Bibliotek (eksisterende /trening/videoer)
   - Tab 2: Sammenligning (flytt fra /trening/video-sammenligning)
   - Tab 3: Annotasjon (flytt fra /trening/video-annotering)

2. Oppdater navigation config
3. Legg til redirects for gamle URLs
4. Test alle tre tabs fungerer
```

**Suksess-kriterier**:
- [ ] Video bibliotek vises i Tab 1
- [ ] Sammenligning fungerer i Tab 2
- [ ] Annotasjon fungerer i Tab 3
- [ ] Gamle URLs redirecter korrekt

---

#### **1.2 Teknisk Plan Duplikat** (Prioritet: HØY)
**Estimat**: 0.5 dag
**Beslutning nødvendig**: Behold "Bevis" eller "Teknikkplan"?

**Opsjon A: Behold Bevis**
```
1. Fjern /trening/teknikkplan fra navigation
2. Redirect /trening/teknikkplan → /bevis
3. Fjern TeknikPlan komponent (eller marker deprecated)
```

**Opsjon B: Behold Teknikkplan**
```
1. Fjern /bevis fra navigation
2. Redirect /bevis → /trening/teknikkplan
3. Fjern Bevis komponent
```

**❓ BESLUTNING NØDVENDIG FRA DEG**:
- Hvilken terminologi foretrekker spillere?
- Hvilken funksjonalitet er mest komplett?

---

#### **1.3 Turneringer som Tabs** (Prioritet: MEDIUM)
**Estimat**: 1 dag
**Filer**:
- `/src/features/hub-pages/PlanHub.tsx`
- `/src/config/player-navigation-v4.ts`

**Implementering**:
```
1. Lag TournamentHub med tabs:
   - Tab 1: Alle turneringer (oversikt)
   - Tab 2: Mine turneringer (påmeldt)
   - Tab 3: Forberedelse (per turnering)

2. Oppdater navigation
3. Implementer tab-switching
4. Test data vises korrekt i hver tab
```

---

#### **1.4 Mer-området Reorganisering** (Prioritet: MEDIUM)
**Estimat**: 1 dag
**Beslutning**: Minimal (Split) eller Aggressiv (Flytt)?

**Opsjon A: Minimal - Split "Ressurser"**
```
Ressurser → Data:
  - Eksporter data
  - Arkiv
  - AI Treningshistorikk

Ressurser → Kunnskap:
  - Kunnskapsbase
  - Notater
  - Baner & Vær

Ressurser → System:
  - Samlinger
  - Betaling & Fakturering
```

**Opsjon B: Aggressiv - Flytt til andre områder**
```
Notater → Quick-access (alltid tilgjengelig)
Kunnskapsbase → Eget "Utdanning" område
Samlinger → /trening
Baner & Vær → /plan
```

---

### **TRACK 2: INTEGRASJONER**

#### **2.1 Email Service** (Prioritet: KRITISK)
**Estimat**: 1 dag
**Status**: Må implementeres

**Backend tasks**:
```
1. [ ] Install @sendgrid/mail
2. [ ] Opprett emailService.js
3. [ ] Lag email templates (5 stk):
       - Welcome
       - Password reset
       - Email verification
       - Booking confirmation
       - Session reminder
4. [ ] Integrer i auth routes
5. [ ] Integrer i booking routes
```

**Environment vars**:
```
SENDGRID_API_KEY=xxxxx
SENDGRID_FROM_EMAIL=noreply@iup-golf.com
```

**Testing**:
```
[ ] Test forgot password email
[ ] Test welcome email
[ ] Test booking confirmation
[ ] Verify email rendering
```

---

#### **2.2 OAuth (Google)** (Prioritet: HØY)
**Estimat**: 0.5-1 dag
**Status**: Framework klar, må aktiveres

**Setup tasks**:
```
1. [ ] Google Cloud Console project
2. [ ] Enable Google+ API
3. [ ] Create OAuth 2.0 Client ID
4. [ ] Set authorized origins/redirects
5. [ ] Copy Client ID
```

**Backend tasks**:
```
1. [ ] Install google-auth-library
2. [ ] Implement /auth/google/signin endpoint
3. [ ] Verify ID token
4. [ ] Find or create user
5. [ ] Return JWT
```

**Frontend tasks**:
```
1. [ ] Set REACT_APP_GOOGLE_CLIENT_ID
2. [ ] Set REACT_APP_ENABLE_OAUTH=true
3. [ ] Test login button appears
4. [ ] Test login flow
```

---

#### **2.3 Stripe Payments** (Prioritet: HØY)
**Estimat**: 1 dag
**Status**: Framework klar, må aktiveres

**Setup tasks**:
```
1. [ ] Create Stripe account
2. [ ] Enable test mode
3. [ ] Create products/prices (Base, Premium, Elite)
4. [ ] Copy API keys
5. [ ] Setup webhook endpoint
```

**Backend tasks**:
```
1. [ ] Install stripe
2. [ ] Create stripeService.js
3. [ ] Implement /payments endpoints:
       - /create-setup-intent
       - /create-subscription
       - /webhook
4. [ ] Handle subscription events
```

**Frontend tasks**:
```
1. [ ] Set REACT_APP_STRIPE_PUBLISHABLE_KEY
2. [ ] Set REACT_APP_ENABLE_STRIPE=true
3. [ ] Test checkout flow
4. [ ] Test with test card (4242 4242 4242 4242)
```

---

#### **2.4 Sentry** (Prioritet: MEDIUM)
**Estimat**: 0.5 dag

**Tasks**:
```
1. [ ] Create Sentry account
2. [ ] Create project (React)
3. [ ] Install @sentry/react
4. [ ] Initialize in index.tsx
5. [ ] Wrap App in ErrorBoundary
6. [ ] Test error capture
7. [ ] Configure beforeSend filter
```

---

#### **2.5 Socket.IO** (Prioritet: MEDIUM)
**Estimat**: 2 dager

**Backend tasks**:
```
1. [ ] Install socket.io
2. [ ] Initialize socket server
3. [ ] Implement authentication middleware
4. [ ] Implement event emitters:
       - new-message
       - new-booking
       - session-reminder
```

**Frontend tasks**:
```
1. [ ] Install socket.io-client
2. [ ] Create SocketContext
3. [ ] Implement useSocket hook
4. [ ] Listen for events
5. [ ] Show notifications
```

---

### **TRACK 3: ONBOARDING & DATA**

#### **3.1 Database Verification** (Prioritet: KRITISK)
**Estimat**: 0.5 dag

**Tasks**:
```
1. [ ] Identifiser DB system (Supabase? PostgreSQL? MongoDB?)
2. [ ] Verifiser connection
3. [ ] List alle tabeller
4. [ ] Sjekk kritiske tabeller eksisterer:
       [ ] users
       [ ] profiles
       [ ] roles
       [ ] sessions
       [ ] tests
       [ ] goals
       [ ] videos
       [ ] messages
       [ ] bookings
       [ ] subscriptions
5. [ ] Sjekk RLS policies (hvis Supabase)
6. [ ] Verifiser storage buckets
```

---

#### **3.2 Backend API Verification** (Prioritet: KRITISK)
**Estimat**: 0.5 dag

**Tasks**:
```
Test kritiske endpoints:
[ ] POST /api/auth/register
[ ] POST /api/auth/login
[ ] GET /api/users/:id
[ ] POST /api/sessions
[ ] POST /api/goals
[ ] GET /api/statistics/:userId
[ ] POST /api/tests
[ ] POST /api/bookings
[ ] POST /api/messages

Check:
[ ] Authentication middleware fungerer
[ ] JWT tokens valideres
[ ] Error handling er robust
```

---

#### **3.3 Onboarding Flow Implementation** (Prioritet: HØY)
**Estimat**: 1-2 dager

**Spiller-onboarding** (8 steg):
```
1. [ ] Velkomst og rolle-bekreftelse
2. [ ] Golf-profil (handicap, heimebane, kategori)
3. [ ] Fysisk profil (høyde, vekt)
4. [ ] Trenerkobling
5. [ ] Målsetninger
6. [ ] Første treningsplan
7. [ ] Kalender-integrasjon
8. [ ] Betalingsinformasjon
```

**Trener-onboarding** (7 steg):
```
1. [ ] Velkomst og rolle-bekreftelse
2. [ ] Kvalifikasjoner (PGA, erfaring)
3. [ ] Organisasjonstilknytning
4. [ ] Kalender og booking setup
5. [ ] Treningssystem og filosofi
6. [ ] Spillere import/invite
7. [ ] Betalingsinformasjon
```

**Komponenter**:
```
- /src/features/onboarding/OnboardingV2.tsx (oppdater)
- /src/features/onboarding/CoachOnboardingV2.tsx (opprett)
- /src/features/onboarding/steps/* (8 steg-komponenter)
```

---

#### **3.4 Testdata Creation** (Prioritet: HØY)
**Estimat**: 0.5 dag

**Testspiller 1**:
```
Email: test.spiller@iup-golf.com
Navn: Test Spiller
Handicap: 12.5
Kategori: G

Data:
- [ ] 5 treningsøkter (siste 2 uker)
- [ ] 3 testresultater
- [ ] 2 målsetninger
- [ ] 1 turneringspåmelding
- [ ] 10 videoer (5 swing, 5 putting)
- [ ] 3 annoterte videoer
```

**Testtrener 1**:
```
Email: test.trener@iup-golf.com
Navn: Test Trener
PGA: PGA-TEST-001

Data:
- [ ] 3 spillere (inkl. testspiller 1)
- [ ] 1 treningsplan
- [ ] 10 øvelser i bibliotek
- [ ] 5 økter planlagt
- [ ] 3 øktevalueringer
```

---

## 🎯 MINIMUM VIABLE DEMO (MVD) - Dag 10

Etter 10 dager må disse være ferdig:

### ✅ MUST HAVE
```
[ ] Email service fungerer
[ ] Google Sign-In fungerer
[ ] Stripe payments fungerer (test mode)
[ ] Video upload fungerer (already done)
[ ] Backend API er stabilt
[ ] Database er verifisert
[ ] 1 testspiller med komplett data
[ ] 1 testtrener med komplett data
```

### ⚠️ SHOULD HAVE
```
[ ] Video-konsolidering ferdig
[ ] Teknisk plan duplikat fjernet
[ ] Onboarding flow implementert
[ ] Sentry error tracking aktiv
```

### 📦 NICE TO HAVE
```
[ ] Turneringer som tabs
[ ] Mer-området reorganisert
[ ] Real-time notifications
[ ] Google Calendar sync
```

---

## ✅ DEMO-DAG SJEKKLISTE

**Dag før demo**:
```
[ ] Alle integrasjoner testet
[ ] Testbruker data komplett
[ ] Error scenarios håndtert
[ ] Performance < 2s load time
[ ] Backup plan dokumentert
[ ] Demo script skrevet
[ ] Known issues dokumentert
```

**Demo-dag**:
```
[ ] Verifiser alle services kjører
[ ] Test login flow
[ ] Test payment flow (test card)
[ ] Test video upload
[ ] Test notifications
[ ] Test error handling
```

---

## 📝 DAGLIGE STANDUP FORMAT

Hver dag:
```
✅ Ferdig i går:
- Task 1
- Task 2

🔜 I dag skal jeg:
- Task 3
- Task 4

🚧 Blokkere:
- Issue 1 (trenger hjelp med X)
```

---

## 🚀 START HER (Første 3 dager)

### **DAG 1: Database & Email Foundation**
```
Morgen (4 timer):
[ ] Verifiser database setup
[ ] List alle tabeller
[ ] Test backend endpoints

Ettermiddag (4 timer):
[ ] Setup SendGrid konto
[ ] Implementer email service (backend)
[ ] Lag email templates
[ ] Test forgot password email
```

### **DAG 2: Video & OAuth**
```
Morgen (4 timer):
[ ] Video-konsolidering start
[ ] Opprett VideoHub komponent
[ ] Implementer tabs (Bibliotek, Sammenligning, Annotasjon)

Ettermiddag (4 timer):
[ ] Google Cloud Console setup
[ ] Implementer OAuth backend
[ ] Aktivere OAuth frontend
[ ] Test Google Sign-In
```

### **DAG 3: Stripe & Testing**
```
Morgen (4 timer):
[ ] Stripe account setup
[ ] Implementer Stripe backend
[ ] Aktivere Stripe frontend

Ettermiddag (4 timer):
[ ] Test payment flow
[ ] Video-konsolidering fullføring
[ ] Test video tabs
[ ] Opprett testbruker 1
```

---

## 📊 PROGRESS TRACKING

Vi tracker progresjon i 3 dimensjoner:

**1. Tasks Completed** (Quantity)
```
Total tasks: 50+
Completed: X
Remaining: Y
```

**2. Demo Readiness** (Quality)
```
Critical features: X/8
Important features: Y/10
Nice-to-have: Z/15
```

**3. Code Quality** (Health)
```
Tests passing: X%
No console errors: ✓/✗
Performance: X/5
```

---

## 🎉 FERDIG!

Når alt er gjennomført har vi:

✅ **Polert UI** - Video konsolidert, duplikater fjernet, Mer-området ryddig
✅ **Full integrasjon** - Email, OAuth, Stripe, Sentry, Real-time
✅ **Onboarding klar** - Database verifisert, flows implementert, testdata
✅ **Demo-klar** - Performance, error handling, monitoring

**Total estimat**: 3-4 uker
**Minimum demo**: 10 dager
**Status**: KLAR TIL START! 🚀

---

**Neste**: Start med Dag 1 tasks!
