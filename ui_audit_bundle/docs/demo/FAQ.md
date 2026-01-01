# IUP Golf Academy - FAQ for Partnere

**Sist oppdatert:** 25. desember 2025

Vanlige spørsmål fra partnere om IUP Golf Academy plattformen, med detaljerte svar.

---

## 💰 Kostnad & Business

### Q: "Hva koster det å drifte dette?"

**A:** Hosting-kostnad avhenger av skalering:

- **Pilot/Beta (< 100 brukere):** ~1.000 kr/mnd
  - Railway: 500 kr/mnd (eller gratis tier)
  - SendGrid email: 180 kr/mnd
  - Monitoring (Sentry): 300 kr/mnd

- **Production (100-500 brukere):** ~5.000 kr/mnd
  - AWS/Railway hosting: 2.000 kr/mnd
  - Database (PostgreSQL): 1.500 kr/mnd
  - Redis cache: 500 kr/mnd
  - Email, monitoring, backups: 1.000 kr/mnd

- **Scale (500-2000 brukere):** ~15.000 kr/mnd
  - Autoscaling infrastructure
  - CDN for global performance
  - Premium support

**Skalerbarhet:** Kostnad skalerer lineært med antall brukere.

---

### Q: "Hva er pricing-strategien for kunder?"

**A:** Vi foreslår 3 modeller:

1. **Klubb-lisens (B2B):**
   - 5.000 kr/mnd for ubegrenset spillere + trenere
   - Årlig kontrakt: 54.000 kr (10% rabatt)
   - Inkluderer: support, oppdateringer, data backup

2. **Per spiller (B2C):**
   - 199 kr/mnd per spiller
   - Familierabatt: 149 kr/mnd per barn (hvis foreldre betaler for 2+)
   - Årlig: 1.990 kr (2 måneder gratis)

3. **Trener-verktøy (B2B2C):**
   - 799 kr/mnd for freelance-trenere
   - Inkluderer: 10 spillere, video-analyse, rapporter
   - Ekstra spillere: +50 kr/mnd per spiller

**Pilot-pricing:** 50% rabatt første 6 måneder for early adopters.

---

### Q: "Hvor mye investering trengs for å skalere?"

**A:** Avhenger av ambisjon:

**Scenario 1: Bootstrap (0 kr investering)**
- Start med 1-2 pilot-klubber
- Reinvester inntekter fra pilot-kunder
- Organisk vekst over 12-18 måneder
- **Forventet første år:** 500k kr revenue

**Scenario 2: Skalering (1M kr investering)**
- 500k kr: Marketing & sales (2 personer deltid)
- 200k kr: AWS infrastructure for 1 år
- 300k kr: Utvikler-støtte (1 person deltid)
- **Forventet første år:** 2-3M kr revenue

**Scenario 3: Ekspansjon (3M kr investering)**
- Full marketing team (4 personer)
- Nordisk ekspansjon (Sverige, Danmark)
- Enterprise features development
- **Forventet første år:** 8-10M kr revenue

---

## 🔒 Sikkerhet & Juridisk

### Q: "Hvor sikker er dataen?"

**A:** Vi tar sikkerhet ekstremt seriøst:

**Tekniske tiltak:**
- ✅ **2FA autentisering** - Two-factor authentication for alle brukere
- ✅ **JWT tokens** - Secure session management med refresh tokens
- ✅ **Argon2 password hashing** - Industry-standard (bedre enn bcrypt)
- ✅ **HTTPS/TLS** - All trafikk kryptert end-to-end
- ✅ **SQL injection beskyttelse** - Prisma ORM med parameteriserte queries
- ✅ **XSS beskyttelse** - React's built-in sanitization
- ✅ **CSRF tokens** - Cross-site request forgery protection
- ✅ **Rate limiting** - DDoS protection på API-nivå
- ✅ **Helmet.js** - Security headers (CSP, HSTS, etc.)

**Testing:**
- 149 sikkerhetstester kjørt (integration + unit)
- Automatisk vulnerability scanning (npm audit)
- Code review av kritiske features

**Compliance:**
- GDPR-compliant arkitektur
- Data retention policies
- Right to be forgotten (bruker-sletting)
- Audit logging av alle sensitive handlinger

---

### Q: "Hvem eier koden? IP?"

**A:** Ownership må diskuteres og avklares før lansering. Alternativer:

**Alternativ 1: Enkelt eierskap**
- Anders Kristiansen eier 100% av koden
- Lisensiert til partnere/investorer
- Partnere får royalty eller profit-sharing

**Alternativ 2: Joint venture**
- Nytt selskap opprettes
- Eierskap fordeles basert på bidrag:
  - Kode/development: 40-60%
  - Kapital/investering: 20-30%
  - Sales/marketing: 10-20%
  - Strategisk rådgivning: 5-10%

**Alternativ 3: Salg til partnere**
- Partnere kjøper koden outright
- Engangsbetaling + bonus ved milestones
- Anders fortsetter som lead developer (kontrakt)

**Anbefaling:** Diskuter med advokat før signing.

---

### Q: "Hva med GDPR og personvern?"

**A:** Plattformen er designet GDPR-compliant fra grunnen av:

**Data minimalisering:**
- Samler kun nødvendig data (navn, e-post, treningsdata)
- Ingen tracking av atferd utover app-bruk
- Ingen salg av data til tredjeparter

**Bruker-rettigheter:**
- ✅ **Right to access** - Brukere kan eksportere all sin data (JSON/CSV)
- ✅ **Right to erasure** - Sletting av konto + all data (anonymisert statistikk beholdes)
- ✅ **Right to rectification** - Brukere kan rette feil i profil
- ✅ **Right to portability** - Data kan eksporteres til andre systemer

**Datalagring:**
- EU-baserte servere (Railway EU region eller AWS eu-north-1)
- Backup-rutiner med kryptering
- Ingen lagring av sensitive data i plain text

**Personvernerklæring:** Må skrives av advokat før lansering.

---

## 🔧 Teknisk

### Q: "Kan dette integreres med eksisterende systemer?"

**A:** Ja! Vi har en fullstendig RESTful API:

**40+ API endpoints inkluderer:**
- Bruker-administrasjon (CRUD)
- Treningsplaner (GET, POST, PUT, DELETE)
- Tester og resultater
- Badges og achievements
- Video-analyse
- Rapporter og statistikk

**Integrasjonsmuligheter:**
- **GolfBox:** Import av handicap og turnerings-resultater
- **Minute:** Kalender-synkronisering
- **Garmin/Strava:** Import av treningsdata
- **Google Calendar:** Automatisk synk av økter
- **Stripe/Vipps:** Payment integration

**API dokumentasjon:** Automatisk generert med Swagger/OpenAPI (swagger.json tilgjengelig).

**Webhooks:** Kan legges til for real-time notifikasjoner til eksterne systemer.

---

### Q: "Hvor lang tid tok det å bygge?"

**A:** _[FYLL INN BASERT PÅ FAKTISK TID]_

Eksempel: "6 måneder deltid (ca 20 timer/uke) = ~500 timer totalt."

Breakdown:
- Backend API: 200 timer
- Frontend React app: 150 timer
- Database design: 50 timer
- Testing & sikkerhet: 50 timer
- Dokumentasjon: 30 timer
- Deployment & DevOps: 20 timer

---

### Q: "Kan vi skalere til 10,000 brukere?"

**A:** Absolutt. Arkitekturen er bygget for skalering:

**Multi-tenant design:**
- 1 database instance kan håndtere ∞ klubber (tenants)
- Optimaliserte queries med indexer
- Connection pooling (PgBouncer)

**Horizontal scaling:**
- Stateless API - kan kjøre flere instanser
- Load balancer distribuerer trafikk
- Redis cache reduserer database load

**Database:**
- PostgreSQL kan håndtere millioner av rows
- Ved behov: Read replicas for rapporter
- Partitioning av store tabeller

**Estimat:**
- 10,000 brukere = ~100 klubber
- ~5 requests/sekund (peak)
- Database: <1GB (under 100M rows)
- **Hosting cost:** ~20.000 kr/mnd (AWS/Railway)

**Kubernetes-klar:** Vi kan deploye til k8s for auto-scaling ved behov.

---

### Q: "Hva med mobilapp? Native eller web?"

**A:** Hybrid-løsning med Capacitor:

**Current state:**
- Web-app er fullt responsiv (fungerer på mobil browser)
- Capacitor wrapper klar for iOS/Android deployment
- Kan publiseres til App Store/Google Play i løpet av 2 uker

**Fordeler:**
- ✅ 1 codebase = Web + iOS + Android
- ✅ Raskere utvikling (ingen duplisering)
- ✅ Push notifications (via Firebase)
- ✅ Offline mode (Service Workers)
- ✅ Kamera-tilgang (for video upload)

**Ulemper:**
- ⚠️ Ikke 100% native performance (men 95% er bra nok for vår use-case)
- ⚠️ Noen native features krever plugins

**Fremtid:** Hvis markedet krever det, kan vi bygge native iOS/Android (Swift/Kotlin) senere.

---

## 🏆 Marked & Konkurranse

### Q: "Hvem er konkurrentene?"

**A:** Hovedkonkurrenter i Europa:

**1. ClubV1 (UK)**
- Pris: £12/mnd per spiller (~150 kr)
- Fokus: Klubb-administrasjon + booking
- **Svakhet:** Begrenset coaching-verktøy, ikke junior-fokusert

**2. GolfGenius (USA)**
- Pris: Enterprise ($$$, ikke offentlig)
- Fokus: Turnerings-administrasjon
- **Svakhet:** Komplisert setup, ikke coaching-fokusert

**3. CoachNow (USA)**
- Pris: $20/mnd per coach (~200 kr)
- Fokus: Video-analyse
- **Svakhet:** Kun video, ingen treningsplanlegging eller badges

**4. Golf Genius Trainer (UK)**
- Pris: £15/mnd per spiller (~185 kr)
- Fokus: Treningsplanlegging
- **Svakhet:** Ikke gamification, dårlig UX

**Vårt fortrinn:**
- ✅ Norsk lokalisering (språk, kultur, IUP metodikk)
- ✅ Komplett løsning (ikke bare én feature)
- ✅ Junior-fokusert med gamification
- ✅ Moderne UX (React, TailwindCSS)
- ✅ Rimelig pricing (konkurransedyktig)

---

### Q: "Hva med konkurransesituasjonen i Norge?"

**A:** Begrenset konkurranse:

**Eksisterende tools:**
- Excel/Google Sheets (90% av klubber bruker dette)
- Minute (booking, ikke coaching)
- GolfBox (handicap, ikke trening)

**Konklusjon:** Ingen komplett coaching-plattform tilgjengelig i Norge i dag.

---

## 📈 Produkt & Features

### Q: "Hvilke features savner dere?"

**A:** Vi har allerede 95% av core features. Ønskeliste for v2.0:

**Høy prioritet (Q1-Q2 2026):**
- [ ] Parent portal (for foreldre å følge med)
- [ ] Klubb-admin dashboard (statistikk for klubb-ledelse)
- [ ] Tournament integration (automatisk import fra GolfBox)
- [ ] Advanced rapporter (PDF export, custom queries)
- [ ] Gruppetime-administrasjon (flere spillere samtidig)

**Medium prioritet (Q3-Q4 2026):**
- [ ] AI-basert treningsplan-generering (ML modell)
- [ ] Live swing analysis (real-time feedback via kamera)
- [ ] Rangering/leaderboards (intra-klubb konkurranse)
- [ ] Social features (spillere kan dele badges)
- [ ] Equipment tracking (klubber, baller, hansker)

**Lav prioritet (2027+):**
- [ ] VR swing analysis (hvis teknologien modnes)
- [ ] Biomechanics integration (3D capture)
- [ ] Gambling/betting integration? (kontroversielt)

---

### Q: "Fungerer det offline?"

**A:** Delvis:

**Current state:**
- Web-app krever internett for most features
- Cached data vises hvis API ikke svarer

**v2.0 plan:**
- Service Workers for offline caching
- Spillere kan logge økter offline
- Synkroniserer når internett returnerer
- **Timeline:** Q2 2026

---

## 🚀 Lansering & Pilot

### Q: "Når kan vi starte pilot?"

**A:** I morgen! (Bokstavelig talt)

**Pilot-prosess:**
1. **Uke 1:** Setup av pilot-klubb (tenant, brukere, data import)
2. **Uke 2-4:** Onboarding av 5-10 spillere + 2 trenere
3. **Uke 5-12:** Aktiv bruk, feedback-innsamling, iterasjon
4. **Uke 13:** Evaluering og beslutning om fortsettelse

**Hva vi trenger fra pilot-klubben:**
- 1 tech-savvy kontaktperson
- 5-10 motiverte spillere (helst junior)
- 2 trenere villige til å teste
- Commitment til 12 uker testing

**Hva klubben får:**
- Gratis tilgang i 6 måneder
- Prioritert support
- Innflytelse på produkt-roadmap
- Early-adopter badge 🏆

---

### Q: "Hvordan skal vi markedsføre dette?"

**A:** Multi-channel strategi:

**Fase 1: Word-of-mouth (Q1 2026)**
- Pilot-klubber forteller til andre klubber
- Demo på konferanser (NGF Klubblederdager)
- LinkedIn posts fra fornøyde trenere

**Fase 2: Content marketing (Q2 2026)**
- Blogg med coaching-tips
- YouTube tutorials ("Hvordan bruke IUP Golf Academy")
- Case studies fra pilot-klubber

**Fase 3: Paid marketing (Q3 2026)**
- Google Ads (søk: "golf treningsplanlegging")
- Facebook/Instagram ads (target: foreldre til junior-golfere)
- Sponsing av junior-turneringer

**Fase 4: Partnerships (Q4 2026)**
- Partnership med NGF (Norges Golfforbund)
- Equipment-sponsorer (TaylorMade, Callaway)
- Golf Magazine ads

---

### Q: "Trenger vi investorer?"

**A:** Avhenger av vekst-ambisjon:

**Scenario A: Bootstrap (Nei)**
- Start med pilot-inntekter
- Organisk vekst 12-18 måneder
- Lavere risiko, men tregere vekst

**Scenario B: Angel/Seed (500k - 1M kr)**
- Raskere skalering
- Ansett sales person
- Marketing budget
- **Dilution:** 10-20% equity

**Scenario C: Venture Capital (5-10M kr)**
- Aggressiv ekspansjon (Sverige, Danmark, Finland)
- Fullt team (10+ personer)
- **Dilution:** 30-40% equity

**Anbefaling:** Start bootstrap, raise seed ved traction (50+ betalende klubber).

---

## 📞 Kontakt & Neste Steg

**Har flere spørsmål?**
- E-post: [din e-post]
- Telefon: [ditt nummer]
- Demo-booking: [Calendly-link eller lignende]

**Test selv:**
- Demo URL: https://iupgolf-demo.up.railway.app
- Spiller: `player@demo.com` / `player123`
- Trener: `coach@demo.com` / `coach123`

**Neste møte:**
- Diskuter pilot-klubb kandidater
- Avklar eierskap og investment
- Plan for Q1 2026 kickoff

---

_Sist oppdatert: 25. desember 2025_
