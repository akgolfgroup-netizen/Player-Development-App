# TIER Golf - Development Roadmap 2025

> Sist oppdatert: 29. desember 2025

## Executive Summary

Applikasjonen er **produksjonsmoden** med 46 fullt implementerte features, 16 delvis implementerte, og 5 i tidlig fase. Fokus fremover er **stabilisering**, **mobil-utvikling**, og **UX-forbedringer**.

---

## Current Status Overview

| Kategori | Full | Delvis | Tidlig |
|----------|------|--------|--------|
| Dashboard & Core | 12 | 2 | 1 |
| Coach Tools | 10 | 2 | 1 |
| Training & Planning | 8 | 5 | 1 |
| Analytics | 4 | 3 | 2 |
| Video Management | 5 | 0 | 0 |
| Communication | 3 | 0 | 0 |
| Gamification | 3 | 0 | 0 |
| Admin Tools | 1 | 4 | 0 |
| **TOTAL** | **46** | **16** | **5** |

---

## Phase 1: Production Stabilization
**Prioritet: KRITISK**

### 1.1 Railway Deployment (Denne uken)
- [ ] Opprett `iup-golf-web` service i Railway
- [ ] Konfigurer RAILWAY_TOKEN i GitHub Secrets
- [ ] Seed produksjonsdatabase med demo-data
- [ ] Verifiser end-to-end funksjonalitet

### 1.2 Demo Mode & Testing
- [ ] Sikre at demo-bruker fungerer (`player@demo.com`)
- [ ] Test alle kritiske brukerflyter:
  - Login/logout
  - Dashboard visning
  - Logg treningsøkt
  - Se statistikk
  - Kalender navigasjon

### 1.3 Bug Fixes & Polish
- [ ] Fiks eventuelle 404-routes
- [ ] Sikre konsistent Card Shell design
- [ ] Verifiser mobil-responsivitet på web

---

## Phase 2: Core Feature Enhancement
**Prioritet: HØY**

### 2.1 Player Dashboard (AKGolfDashboard)
**Status:** Fungerer, men kan forbedres

- [ ] **ProfileCard** - Koble til ekte API-data
- [ ] **StrokesGainedWidget** - Live data fra tester
- [ ] **DagensPlan** - Hent fra kalender/treningsplan
- [ ] **Quick Actions** - Verifiser alle navigasjoner fungerer

### 2.2 Treningssystem
**Status:** Delvis implementert

- [ ] **Dagens Plan** (`/trening/dagens`) - Vis dagens planlagte økter
- [ ] **Ukens Plan** (`/trening/ukens`) - Ukesoversikt med drag-drop
- [ ] **Logg Trening** (`/trening/logg`) - Forenkle innlogging av økt
- [ ] **Treningsdagbok** (`/trening/dagbok`) - Historikk og refleksjoner

### 2.3 Testing & Kategori
**Status:** Robust backend, frontend trenger polish

- [ ] **Testprotokoll** - Visuell guide for gjennomføring
- [ ] **Registrer Test** - Forenklet input med validering
- [ ] **Kategori-krav** - Tydelig fremstilling av krav per kategori
- [ ] **Breaking Points** - Visualisering av forbedringspotensial

### 2.4 Statistikk & Analytics
**Status:** Backend komplett, frontend under utvikling

- [ ] **Strokes Gained Dashboard** - Full SG-analyse med grafer
- [ ] **DataGolf Integration** - Koble frontend til backend
- [ ] **Peer Comparison** - Sammenlign med andre spillere
- [ ] **Trend Analysis** - Vis utvikling over tid

---

## Phase 3: Coach Features
**Prioritet: MEDIUM**

### 3.1 Coach Dashboard
- [ ] **Spiller-oversikt** - Alle spillere med status
- [ ] **Varsler** - Spillere som trenger oppfølging
- [ ] **Treningsplaner** - Lage og tildele planer
- [ ] **Meldinger** - Kommunikasjon med spillere

### 3.2 Treningsplan-editor
- [ ] **Drag-drop ukesplan** - Visuell planlegger
- [ ] **Øvelsesbibliotek** - Velg fra database
- [ ] **Mal-system** - Gjenbrukbare treningsblokker
- [ ] **Automatisk periodisering** - Basert på sesong

### 3.3 Video-analyse
- [ ] **Last opp video** - Direkte fra telefon
- [ ] **Annotasjoner** - Tegne på video
- [ ] **Sammenligning** - Side-by-side analyse
- [ ] **Deling** - Send til spiller med kommentarer

---

## Phase 4: Mobile App (Capacitor)
**Prioritet: MEDIUM-HØY**

### 4.1 Core Screens
**Status:** 5 skjermer eksisterer, trenger utvidelse

- [ ] **Home** - Dashboard med dagens plan
- [ ] **Quick Log** - Hurtig registrering av økt
- [ ] **Calendar** - Ukevisning med swipe
- [ ] **Profile** - Grunnleggende profil
- [ ] **Notifications** - Push-varsler

### 4.2 Native Features
- [ ] **Push Notifications** - Påminnelser om trening
- [ ] **Offline Mode** - Cache treningsplan
- [ ] **Camera Integration** - Ta opp video direkte
- [ ] **Biometric Login** - Face ID / Touch ID

### 4.3 App Store
- [ ] **iOS Build** - TestFlight distribusjon
- [ ] **Android Build** - Play Store intern testing
- [ ] **App Icons & Splash** - Branding assets

---

## Phase 5: Advanced Features
**Prioritet: LAV (Fremtidig)**

### 5.1 AI & Insights
- [ ] **AI Coach Assistant** - Automatiske anbefalinger
- [ ] **Predictive Analytics** - Prognoser for utvikling
- [ ] **Personalized Plans** - Genererte treningsplaner

### 5.2 Integrasjoner
- [ ] **GolfBox** - Turnerings-import
- [ ] **Trackman/Toptracer** - Automatisk data-import
- [ ] **Wearables** - Garmin/Apple Watch

### 5.3 Gamification 2.0
- [ ] **Leaderboards** - Sammenlign med andre
- [ ] **Challenges** - Ukentlige utfordringer
- [ ] **Streaks** - Motivasjonsystem

---

## Technical Debt & Infrastructure

### Testing
- [ ] Øk testdekning til 60%+ (nå ~25%)
- [ ] E2E tester for kritiske flyter
- [ ] API integration tests
- [ ] Performance benchmarks

### Documentation
- [ ] API dokumentasjon (OpenAPI/Swagger)
- [ ] Komponent-dokumentasjon (Storybook)
- [ ] Onboarding guide for utviklere

### Performance
- [ ] Database query optimalisering
- [ ] Frontend bundle size reduksjon
- [ ] Image/video CDN optimalisering
- [ ] Caching strategi review

### Security
- [ ] Security audit
- [ ] GDPR compliance review
- [ ] Rate limiting på API
- [ ] Input sanitization review

---

## Feature Priority Matrix

```
                    Impact
                    High    Medium    Low
              ┌─────────┬─────────┬─────────┐
         High │ Phase 1 │ Phase 2 │ Phase 5 │
Effort        │ Deploy  │ Core    │ AI      │
              ├─────────┼─────────┼─────────┤
       Medium │ Phase 2 │ Phase 3 │ Phase 5 │
              │ Train   │ Coach   │ Integr. │
              ├─────────┼─────────┼─────────┤
          Low │ Phase 1 │ Phase 4 │   -     │
              │ Bugs    │ Mobile  │         │
              └─────────┴─────────┴─────────┘
```

---

## Sprint Suggestions

### Sprint 1: Go Live
- Railway web deployment
- Demo data seeding
- Critical bug fixes
- Smoke testing

### Sprint 2: Dashboard Polish
- ProfileCard live data
- StrokesGained widget
- DagensPlan integration
- Navigation fixes

### Sprint 3: Training Flow
- Logg trening forbedring
- Treningsdagbok UX
- Øvelsesbibliotek søk
- Session evaluering

### Sprint 4: Mobile MVP
- Mobile home screen
- Quick log funksjon
- Push notifications
- TestFlight release

---

## Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Uptime | - | 99.5% |
| Page Load | - | <2s |
| Test Coverage | ~25% | 60% |
| Mobile Users | 0 | 50+ |
| Active Players | 0 | 100+ |

---

## Team Notes

**Fokusområder Q1 2025:**
1. Stabil produksjon med demo-miljø
2. Player dashboard som "wow"-faktor
3. Enkel treningslogging for spillere
4. Coach-verktøy for treningsplaner

**Teknisk gjeld å adressere:**
- Multiple dashboard-versjoner (konsolidere)
- TODO/FIXME comments (30+ filer)
- Manglende TypeScript i web (gradvis migrering)

---

*Denne roadmapen oppdateres månedlig basert på feedback og prioriteringer.*
