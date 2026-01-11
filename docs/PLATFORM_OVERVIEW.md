# TIER Golf Platform - Komplett Oversikt

## Executive Summary

TIER Golf er en banebrytende golf-coaching plattform som kombinerer **avansert strokes gained-analyse**, **AI-drevet innsikt**, **periodisert treningsplanlegging** og **DataGolf pro-benchmarking** i én integrert løsning. Plattformen er bygget med moderne teknologi og tilbyr funksjonalitet som ingen andre golf-coaching plattformer har samlet.

---

## Teknisk Arkitektur

### Stack Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Player    │  │    Coach    │  │    Admin    │              │
│  │   Module    │  │   Module    │  │   Module    │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│                                                                  │
│  Design System: Catalyst UI + Tailwind + Custom Tokens          │
│  State: React Query + Context + Custom Hooks                     │
│  Routing: React Router v6 (V4 Hub Architecture)                  │
└──────────────────────────┬──────────────────────────────────────┘
                           │ REST API
┌──────────────────────────▼──────────────────────────────────────┐
│                      BACKEND (Fastify)                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Auth &    │  │  Business   │  │ Integration │              │
│  │   RBAC      │  │   Logic     │  │  Services   │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│                                                                  │
│  Validation: Zod | Docs: OpenAPI/Swagger | Cache: Redis          │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                       DATA LAYER                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ PostgreSQL  │  │   Redis     │  │  DataGolf   │              │
│  │  (Prisma)   │  │   Cache     │  │    API      │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

### Tekniske Nøkkeltall

| Komponent | Teknologi | Versjon |
|-----------|-----------|---------|
| Frontend | React + TypeScript | 18.x |
| Backend | Fastify + TypeScript | 4.x |
| Database | PostgreSQL + Prisma | 16.x / 5.x |
| Cache | Redis | 7.x |
| Build | Turborepo | 2.x |
| UI | Catalyst + Tailwind | 3.x |
| Auth | JWT + Refresh Tokens | - |
| Multi-tenant | Row-level isolation | - |

---

## SPILLER-MODUL (Player Module)

### Funksjoner

#### 1. Dashboard & Oversikt
- **Personlig dashboard** med dagens oppgaver
- **Målstreek-tracking** med gamification
- **Quick stats** (Total SG, 30-dagers trend, aktive mål)
- **Nylig aktivitet** og kommende økter

#### 2. Årsplanlegging (Annual Planning)
- **Multi-step wizard** for årsplan-opprettelse
- **4 periodiseringsfaser**:
  - E (Endurance/Utholdenhet)
  - G (General/Grunnlag)
  - S (Specific/Spesifikk)
  - T (Taper/Nedtrapping)
- **Visuell tidslinje** med fargekodede perioder
- **Ukentlig treningsfrekvens** per periode
- **Målsetting per periode**

#### 3. Strokes Gained Analyse
- **Full SG breakdown**:
  - SG Off The Tee (Driving)
  - SG Approach (Innspill)
  - SG Around Green (Kortspill)
  - SG Putting
  - SG Total
- **Benchmark-typer**:
  - Scratch (0 hcp)
  - Tour Average
  - Peer (mot andre spillere)
  - PGA Elite
- **Historisk trending** og progresjon
- **Shot-by-shot data** (JSONB)

#### 4. Player Insights (AI-drevet)
- **SG Journey**: Visualisert reise mot PGA Elite-nivå
- **Skill DNA**: Unik spillerprofil-visualisering
- **Bounty Board**: Gamifiserte utfordringer og belønninger
- **Personlige anbefalinger** basert på data

#### 5. Målsetting & Gamification
- **Måltyper**: Kortsiktig, Langsiktig, Prosess, Resultat, Ferdighet
- **Kategorier**: Score, Teknikk, Fysisk, Mental, Turnering, Prosess
- **Streaks**: Sammenhengende måloppnåelse
- **Badges**: Prestasjonsmerker som låses opp
- **Progress tracking** med visuell fremgang

#### 6. Treningslogging
- **Økttyper**: Gym, Golf, Cardio, Fleksibilitet, Range, Bane, Mental
- **Intensitetsnivåer**: Lav, Medium, Høy
- **Fokusområder** per økt
- **Kobling til daglige oppgaver**
- **Treningsstatistikk**: Ukentlig, Månedlig, Årlig

#### 7. Testing & Benchmarking
- **Testdefinisjoner** med kategorier
- **Resultatregistrering** med video-støtte
- **Progresjonssporing** over tid
- **Sammenligning** mot tidligere resultater
- **Percentil-ranking**

#### 8. Video & Analyse
- **Videobibliotek** med organisering
- **Side-by-side sammenligning**
- **Annotasjonsverktøy**
- **Referansevideoer** fra coach

### Tekniske Detaljer - Player

```typescript
// Datamodeller
Player {
  id, firstName, lastName, email, phone
  dateOfBirth, gender, category (A-K)
  handicap (-10 til 54), wagrRank
  weeklyTrainingHours, currentPeriod
  status: 'active' | 'inactive' | 'suspended'
  goals[], emergencyContact, medicalNotes
}

AnnualPlan {
  id, playerId, name, startDate, endDate
  periods: Period[] {
    type: 'E' | 'G' | 'S' | 'T'
    weeklyFrequency, goals[], colors
  }
}

StrokesGainedData {
  sgOffTheTee, sgApproach, sgAroundGreen
  sgPutting, sgTotal, benchmarkType
  shotData: JSONB
}
```

**API Endpoints (21+)**:
- `/api/v1/players/*` - CRUD + weekly-summary, onboarding
- `/api/v1/players/:id/annual-plan/*` - Årsplan-håndtering
- `/api/v1/strokes-gained/*` - SG-data og breakdown
- `/api/v1/player-insights/*` - AI-innsikt
- `/api/v1/goals/*` - Mål og badges
- `/api/v1/tests/*` - Testing og resultater
- `/api/v1/training/*` - Treningsøkter

---

## COACH-MODUL (Coach Module)

### Funksjoner

#### 1. Coach Dashboard
- **Spilleroversikt** med alle tildelte spillere
- **Aktivitetsfeed** med nylige hendelser
- **Ventende elementer** som krever handling
- **Varsler og notifikasjoner**
- **Quick actions** for vanlige oppgaver

#### 2. Spilleradministrasjon
- **Full spillerliste** med søk og filtrering
- **Batch-operasjoner**:
  - Masseutsending av notater
  - Batch-tildeling av treningsøkter
  - Batch-statusoppdatering
  - Batch-opprettelse av planer fra maler
- **Spillertildeling/-fjerning**
- **Statussporing**: Aktiv, Inaktiv, På pause

#### 3. Avansert Analyse & Rapportering
- **Team Analytics Dashboard**:
  - Totalt antall spillere
  - Gjennomsnittlig handicap
  - Kategorifordeling
  - Trender (improving/stable/declining)
- **Regresjonsdeteksjon**:
  - Handicap-regresjon
  - Testresultat-nedgang
  - Oppmøte-problemer
- **Spillersammenligning** (2-10 spillere)
- **Kategori-progresjon** per spiller
- **30-dagers trendanalyse**

#### 4. DataGolf Pro-integrasjon
- **Sanntids tour-statistikk**
- **SG-metrikker fra PGA Tour**:
  - Driving Distance & Accuracy
  - SG: Tee, Approach, Around, Putting
  - Percentil-ranking
- **Benchmark mot tour-gjennomsnitt**
- **Søk og sammenlign** med pro-spillere
- **Radar-charts** for visuell sammenligning
- **11,271 spiller-sesonger** (2000-2026)
- **863,818 runder** aggregert

#### 5. Treningsplanlegging
- **AK Formula** treningsblokk-definisjon
- **Drag-and-drop** økt-organisering
- **AI-drevne planforslag**
- **Øvelsesbibliotek**:
  - Kategorier: Putting, Driving, Iron, Wedge, Bunker, Mental, Fitness
  - Vanskelighetsgrad: Beginner, Intermediate, Advanced
  - Utstyrssporing
  - Video og guide-vedlegg
- **Øktmaler** for gjenbruk
- **Årsplanlegging** med periodisering

#### 6. Kommunikasjon
- **Meldingssystem**:
  - Individuell/gruppe-mottakere
  - Kategorisering (trening, turnering, generell, urgent)
  - Planlagte meldinger
  - Vedlegg-støtte
- **Notatsystem** knyttet til spillere
- **Batch-kommunikasjon**

#### 7. Booking & Timeplan
- **Visuell kalender**
- **Tilgjengelighetsinnstillinger**:
  - Ukentlig timeplan
  - Blokkerte datoer
  - Forhåndsbooking-grenser
  - Minimum varseltid
  - Buffer mellom økter
- **Automatisk godkjenning** (valgfritt)
- **Avbestillingsregler**

#### 8. Turnering & Konkurranse
- **Turneringskalender**
- **Spillerpåmeldinger**
- **Resultatsporing**
- **Analyse av turneringsprestasjoner**

#### 9. Varsler & Overvåking
- **Varseltyper**:
  - Skade
  - Ytelsesnedgang
  - Tapte økter
  - Målfrist
  - Kategori-risiko
- **Alvorlighetsgrad**: Lav, Medium, Høy
- **Skadesporing** med gjenopprettingstidslinje

#### 10. Video & Evaluering
- **Video dashboard**
- **Anmeldelseskø** for ventende videoer
- **Referansebibliotek**
- **Økt-evalueringer**
- **Bevis-visning** (bilder/videoer fra trening)

### Tekniske Detaljer - Coach

**API Endpoints (30+)**:
- `/api/v1/coach/athletes` - Spilleradministrasjon
- `/api/v1/coach/stats/*` - Statistikk og analyse
- `/api/v1/coach-analytics/*` - Avansert analyse
- `/api/v1/coaches/me/*` - Personlige data
- `/api/v1/coaches/me/batch/*` - Batch-operasjoner
- `/api/v1/coach/bookings/*` - Booking-håndtering
- `/api/v1/coach/tournaments/*` - Turneringer
- `/api/v1/coach/groups/*` - Gruppehåndtering
- `/api/v1/coach/dashboard/*` - Dashboard-data

---

## ADMIN-MODUL (Admin Module)

### Funksjoner

#### 1. Admin Dashboard
- **5 hovedfaner**:
  - System Status
  - Feature Flags
  - Support Cases
  - Subscription Tiers
  - Audit Log
- **Sanntidsmetrikker**

#### 2. Betalings- & Inntektsanalyse
- **MRR/ARR-beregninger** (Monthly/Annual Recurring Revenue)
- **Abonnementsmålinger**:
  - Aktive
  - Trial
  - Kansellerte
- **Customer Lifetime Value (LTV)**
- **Betalingsmetode-statistikk**
- **Churn rate**
- **Feilede betalinger** med varsler
- **Webhook-hendelser**
- **Auto-refresh** hvert 30. sekund

#### 3. Brukeradministrasjon
- **Invitasjonssystem**:
  - E-postinvitasjoner
  - Rolletildeling
  - Statussporing
  - Gjeninvitasjon/tilbaketrekking
- **Godkjenningsarbeidsflyt**:
  - Ventende brukere
  - Godkjenn/avvis
  - Historikk

#### 4. Coach-administrasjon
- **Full CRUD** for coach-kontoer
- **Sertifiseringer og spesialiseringer**
- **Aktiver/deaktiver** kontoer
- **Spillertelling** per coach
- **Økter per måned** per coach

#### 5. Feature Flags
- **Full CRUD** for funksjonsflagg
- **Toggle on/off**
- **Søk og filter**
- **Rollout percentage** (gradvis utrulling)
- **Metadata-sporing**

#### 6. Systemkonfigurasjon
- **Kategoriadministrasjon**
- **Varslingsinnstillinger**
- **Testkonfigurasjon**

#### 7. Audit Logging
- **Hendelsestyper**: Create, Update, Delete, Login, Logout
- **Ressurstyper**: User, Player, Coach, Test, Session
- **Avansert filtrering**:
  - Handling
  - Ressurstype
  - Aktør-ID
  - Datoperiode
- **IP-adresse-sporing**
- **30-dagers statistikk**
- **Eksport av audit trail**

#### 8. Abonnementsnivåer
- **Tier-konfigurasjon**: Standard, Pro, Team
- **Funksjoner per nivå**:
  - PROOF-visning
  - Trajectory/utviklingsvisning
  - Coach-notater
- **Aktiver/deaktiver** nivåer
- **Prisadministrasjon**

#### 9. Support & Eskalering
- **Saksstatus**: Open, In Progress, Closed
- **Prioritetsnivåer**
- **Sakssporing**
- **Eskaleringshåndtering**

### Tekniske Detaljer - Admin

**API Endpoints (15+)**:
- `/api/v1/admin/system/status` - Systemhelse
- `/api/v1/admin/feature-flags/*` - Feature flags
- `/api/v1/admin/support-cases/*` - Support
- `/api/v1/admin/tiers/*` - Abonnementsnivåer
- `/api/v1/admin/payment-stats` - Betalingsstatistikk
- `/api/v1/admin/recent-transactions` - Transaksjoner
- `/api/v1/admin/webhook-events` - Webhooks
- `/api/v1/admin/failed-payments` - Feilede betalinger
- `/api/v1/admin/subscription-analytics` - Abonnementsanalyse

---

## Konkurransesammenligning

### Konkurrerende Plattformer

| Plattform | Type | Pris | Hovedfokus |
|-----------|------|------|------------|
| **CoachNow** | Video coaching | $29-99/mnd | Video-analyse |
| **Skillest** | Instruction platform | $19-79/mnd | Video-leksjoner |
| **GameForge** | Performance tracking | $15-50/mnd | Statistikk |
| **Arccos** | Shot tracking | $149/år | GPS + shot data |
| **Clippd** | Performance app | £7.99/mnd | AI-analyse |
| **V1 Golf** | Video analysis | $9-29/mnd | Swing-analyse |
| **TIER Golf** | All-in-one coaching | TBD | Alt integrert |

### Feature-sammenligning

| Funksjon | TIER | CoachNow | Skillest | Arccos | Clippd |
|----------|------|----------|----------|--------|--------|
| **Strokes Gained Analyse** | ✅ Full | ❌ | ❌ | ⚠️ Basic | ✅ |
| **Pro Tour Benchmarking** | ✅ DataGolf | ❌ | ❌ | ❌ | ⚠️ Limited |
| **Periodisert Årsplan** | ✅ E/G/S/T | ❌ | ❌ | ❌ | ❌ |
| **AI Player Insights** | ✅ Skill DNA | ❌ | ❌ | ❌ | ✅ |
| **Coach Dashboard** | ✅ Full | ⚠️ Basic | ✅ | ❌ | ❌ |
| **Multi-player Comparison** | ✅ 2-10 | ❌ | ❌ | ❌ | ❌ |
| **Video Analyse** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Gamification** | ✅ Badges/Bounties | ❌ | ⚠️ | ❌ | ⚠️ |
| **Batch Operations** | ✅ | ❌ | ⚠️ | ❌ | ❌ |
| **Booking System** | ✅ Full | ⚠️ | ✅ | ❌ | ❌ |
| **Turnerings-tracking** | ✅ | ❌ | ❌ | ✅ | ⚠️ |
| **Regression Detection** | ✅ AI | ❌ | ❌ | ❌ | ⚠️ |
| **Multi-tenant** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Feature Flags** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Audit Logging** | ✅ Full | ❌ | ❌ | ❌ | ❌ |

---

## Hvorfor TIER Golf er Banebrytende

### 1. Eneste Plattform med Full DataGolf-integrasjon

```
┌─────────────────────────────────────────────────────┐
│              DataGolf Integration                    │
├─────────────────────────────────────────────────────┤
│  • 11,271 spiller-sesonger (2000-2026)             │
│  • 863,818 runder med SG-data                       │
│  • 481 pro-spillere tilgjengelig                    │
│  • Sanntids percentil-ranking                       │
│  • Tour-gjennomsnitt benchmarking                   │
└─────────────────────────────────────────────────────┘
```

**Ingen andre coaching-plattformer** tilbyr direkte sammenligning med PGA Tour-spillere basert på ekte strokes gained-data.

### 2. Periodisert Treningsplanlegging (AK Formula)

Vi er den **eneste plattformen** som implementerer profesjonell periodisering:

- **E-fase** (Endurance): Grunnleggende utholdenhet
- **G-fase** (General): Allsidig trening
- **S-fase** (Specific): Turneringsforberedelse
- **T-fase** (Taper): Nedtrapping før konkurranse

Dette er standard i **elite-idrett** men finnes ikke i andre golf-apper.

### 3. AI-drevet Skill DNA

```
┌─────────────────────────────────────────────────────┐
│                  Skill DNA Profile                   │
├─────────────────────────────────────────────────────┤
│  Unik spillerprofil basert på:                      │
│  • Strokes Gained breakdown                         │
│  • Historisk utvikling                              │
│  • Styrker og svakheter                             │
│  • Personlige anbefalinger                          │
│  • Sammenligning mot idealspiller                   │
└─────────────────────────────────────────────────────┘
```

### 4. SG Journey - Visuell Progresjon

Spillere kan se sin **reise mot PGA Elite-nivå** med:
- Milestone-markers
- Prosentvis fremgang per kategori
- Estimert tid til mål
- Historisk sammenligningsdata

### 5. Bounty Board - Gamifisert Utvikling

**Unikt konsept** der spillere får:
- Daglige/ukentlige utfordringer
- Belønninger for måloppnåelse
- Streaks for konsistent innsats
- Badges som låses opp
- Leaderboard-funksjonalitet

### 6. Coach Intelligence Suite

Trenere får verktøy som **ikke finnes andre steder**:

| Funksjon | Beskrivelse |
|----------|-------------|
| **Regression Detection** | AI identifiserer spillere som går tilbake |
| **Multi-player Comparison** | Sammenlign opptil 10 spillere simultant |
| **Batch Operations** | Massehåndtering av spillere |
| **Category Risk Alerts** | Varsler når spillere risikerer kategori-fall |
| **Injury Tracking** | Full skadehåndtering med timeline |

### 7. Enterprise-grade Admin

**Profesjonell administrasjon** med:
- Full audit logging
- Feature flags for gradvis utrulling
- Multi-tenant arkitektur
- Stripe-integrasjon for betalinger
- Support case management

### 8. Moderne Teknisk Arkitektur

```
┌─────────────────────────────────────────────────────┐
│              Tekniske Fordeler                       │
├─────────────────────────────────────────────────────┤
│  ✅ TypeScript end-to-end                           │
│  ✅ Monorepo med Turborepo                          │
│  ✅ Prisma ORM med PostgreSQL                       │
│  ✅ Redis caching                                    │
│  ✅ OpenAPI dokumentasjon                           │
│  ✅ Zod validering                                  │
│  ✅ Multi-tenant isolasjon                          │
│  ✅ Rate limiting                                   │
│  ✅ WebSocket støtte                                │
└─────────────────────────────────────────────────────┘
```

---

## Oppsummering - Unike Salgspoeng (USPs)

### For Spillere:
1. **Se din SG sammenlignet med PGA Tour-spillere**
2. **Få AI-drevne anbefalinger** basert på din Skill DNA
3. **Gamifisert utvikling** med bounties og badges
4. **Periodisert årsplan** som elite-utøvere bruker

### For Trenere:
1. **DataGolf-benchmarking** mot 481 pro-spillere
2. **Regresjonsdeteksjon** - se hvem som trenger hjelp
3. **Batch-operasjoner** - effektiv spilleradministrasjon
4. **Avansert analyse** som ingen andre tilbyr

### For Akademier:
1. **Multi-tenant** - hver akademi er isolert
2. **Full audit trail** - dokumentér alt
3. **Feature flags** - kontrollert utrulling
4. **Enterprise billing** - Stripe-integrasjon

---

## Statistikk

| Metrikk | Verdi |
|---------|-------|
| Frontend features | 100+ |
| API endpoints | 70+ |
| Custom hooks | 60+ |
| Database modeller | 40+ |
| DataGolf spillere | 481 |
| DataGolf sesonger | 27 (2000-2026) |
| DataGolf runder | 863,818 |
| Spiller-sesonger | 11,271 |

---

*Dokumentasjon generert: Januar 2026*
*Versjon: 1.0*
