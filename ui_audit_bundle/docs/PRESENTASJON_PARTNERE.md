# IUP Golf Academy
## Komplett Digital Treningsplattform for Junior Golf

**Presentasjon for Partnere**
31. desember 2024

---

## Hva har vi bygget?

En **enterprise-grade treningsplattform** spesifikt designet for junior golftreningssentre, basert på Team Norways IUP-metodikk (Individuell UtviklingsPlan).

| Nøkkeltall | |
|------------|--------|
| **API Endepunkter** | 40+ |
| **Database-modeller** | 75+ |
| **Frontend-moduler** | 79 |
| **Integrasjoner** | 4 (DataGolf, Vær, AI, Kalender) |
| **Status** | Produksjon (live) |

**Live URL:** https://ak-golf-iup-frontend-production.up.railway.app

---

## Hovedfunksjoner

### 1. Spillerutvikling & Testing

| Funksjon | Beskrivelse |
|----------|-------------|
| **20+ Standardiserte Tester** | Driver, approach, short game, putting, fysikk |
| **Automatisk Beregning** | Resultater beregnes automatisk mot kategori-krav |
| **Peer Comparison** | Sammenlign deg med jevnaldrende i samme kategori |
| **Breaking Points** | AI identifiserer prestasjonsgap og forbedringsområder |
| **Skill DNA** | Detaljert analyse av spillerens styrker/svakheter |

### 2. Treningsplanlegging

| Funksjon | Beskrivelse |
|----------|-------------|
| **12-måneders Plan** | Automatisk generert årlig treningsplan |
| **Periodisering** | E/G/S/T-faser (Ettertrening, Generell, Spesifikk, Turnering) |
| **Ukentlige Oppdrag** | Dag-for-dag treningsoppgaver |
| **Øvelsesbibliotek** | Komplett database med øvelser |
| **Kalender-sync** | Synkronisering med Google Calendar |

### 3. Video-analyse

| Funksjon | Beskrivelse |
|----------|-------------|
| **Video-opplasting** | Sikker opplasting til AWS S3 |
| **Annotasjoner** | Markører, tegninger og lydnotater |
| **Sammenligning** | Side-by-side sammenligning av svinger |
| **Progress Timeline** | Se utviklingen over tid |
| **Trener-tilbakemelding** | Direkte kommentarer på video |

### 4. Gamification & Motivasjon

| Funksjon | Beskrivelse |
|----------|-------------|
| **20+ Badge-typer** | Streak, volum, forbedring, deltakelse |
| **XP-system** | Nivåoppgradering basert på aktivitet |
| **Achievements** | Milepæler og prestasjoner |
| **Anti-Gaming** | Beskyttelse mot juks/manipulering |

### 5. Trener-verktøy

| Funksjon | Beskrivelse |
|----------|-------------|
| **Athlete Dashboard** | Oversikt over alle spillere |
| **Team Analytics** | Aggregert teamstatistikk |
| **Booking-system** | Time-booking med konfliktdeteksjon |
| **Notater & Kommunikasjon** | Meldinger og notater per spiller |
| **Trajectory Viewer** | Visualisering av spillerutvikling |

### 6. Turnerings-håndtering

| Funksjon | Beskrivelse |
|----------|-------------|
| **Turneringskalender** | Oversikt over kommende turneringer |
| **Resultat-registrering** | Automatisk import fra GolfBox |
| **WAGR-ranking** | World Amateur Golf Ranking integrering |
| **Sesongbaseline** | Tracking av sesongprestasjoner |

---

## Integrasjoner

### DataGolf (Pro-statistikk)
- Strokes Gained-beregninger (OTT, Approach, Around-the-green, Putting)
- Sammenligning med tourspillere
- Skill decomposition
- Historiske rundedata

### MET Norway (Vær)
- Sanntids værmelding for treningsforhold
- Temperatur, vind, nedbør, UV-indeks
- Optimal treningsplanlegging

### AI Coach (Claude)
- Personlig treningsassistent
- Automatiske anbefalinger
- Breaking point-analyse
- Skreddersydde råd

### Google Calendar
- Ekstern kalender-synkronisering
- Automatiske påminnelser
- iCal-støtte

---

## Teknisk Arkitektur

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND                              │
│  React 18 + React Router 7 + Radix UI + Capacitor       │
│  (Web + iOS + Android)                                   │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    BACKEND API                           │
│  Fastify + JWT Auth + WebSocket + Rate Limiting         │
│  40+ endepunkter med Swagger dokumentasjon              │
└─────────────────────────────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│ PostgreSQL  │   │    Redis    │   │   AWS S3    │
│  Database   │   │   Caching   │   │   Storage   │
│  75+ models │   │ Pub/Sub     │   │   Video     │
└─────────────┘   └─────────────┘   └─────────────┘
```

### Teknologi-stack

| Lag | Teknologi |
|-----|-----------|
| Frontend | React 18, TypeScript, Radix UI, Tailwind |
| Backend | Fastify, Node.js 20, TypeScript |
| Database | PostgreSQL 16, Prisma ORM |
| Caching | Redis 7 |
| Storage | AWS S3 (video/media) |
| Auth | JWT + 2FA (TOTP) |
| AI | Anthropic Claude API |
| Hosting | Railway (Production) |
| CI/CD | GitHub Actions |

---

## Sikkerhet & Compliance

| Funksjon | Implementert |
|----------|--------------|
| JWT-autentisering | ✅ 15-min access + 7-dagers refresh |
| To-faktor autentisering | ✅ TOTP med backup-koder |
| Argon2 passordhashing | ✅ |
| RBAC (Rollebasert tilgang) | ✅ Admin, Trener, Spiller, Forelder |
| Multi-tenant isolasjon | ✅ Sikker data-separasjon |
| Audit logging | ✅ Full aktivitetslogging |
| Rate limiting | ✅ Per endepunkt |
| CORS-beskyttelse | ✅ Whitelist-basert |
| PII-redigering | ✅ Automatisk i logger |

---

## Produksjons-metrikker

| Metrikk | Mål | Status |
|---------|-----|--------|
| Oppetid | > 99.9% | ✅ |
| Responstid (p95) | < 200ms | ✅ |
| Feilrate | < 0.1% | ✅ |
| Database query (p95) | < 100ms | ✅ |

**Monitoring:**
- `/health` - Helsesjekk
- `/metrics` - Prometheus-metrikker
- `/ready` - Kubernetes readiness
- Sentry error tracking

---

## Brukerroller

### Spiller
- Se egen dashboard med fremgang
- Gjennomføre tester og registrere resultater
- Se treningsplan og øvelser
- Laste opp video for analyse
- Chatte med trener
- Tjene badges og achievements

### Trener
- Administrere alle spillere
- Lage treningsplaner og øvelser
- Gi tilbakemelding på video
- Se team-analytikk
- Booking og tilgjengelighet
- Breaking point-analyse

### Admin
- Brukeradministrasjon
- Feature flags
- System-oversikt
- Support-saker
- Tier-management

---

## Database-modeller (utdrag)

### Kjernemodeller
- `User` - Brukerkontoer
- `Player` - Spillerprofiler
- `Coach` - Trenerprofiler
- `Tenant` - Organisasjoner/akademier

### Trening & Testing
- `Test` - Testprotokoller (20+ tester)
- `TestResult` - Testresultater
- `TrainingSession` - Treningsøkter
- `AnnualTrainingPlan` - Årsplaner
- `Exercise` - Øvelsesbibliotek

### Gamification
- `PlayerBadge` - Badge-tildelinger
- `AchievementDefinition` - Achievement-definisjoner
- `ProgressLog` - Fremgangslogging

### Video & Media
- `Video` - Video-metadata
- `VideoAnnotation` - Annotasjoner
- `VideoComparison` - Sammenligninger

### Kommunikasjon
- `Message` - Meldinger
- `Notification` - Push-varsler
- `Conversation` - Samtaletrå

---

## Roadmap & Videreutvikling

### Q1 2025
- [ ] iOS/Android native app (Capacitor)
- [ ] Offline-modus for trening
- [ ] Avansert video-analyse med AI

### Q2 2025
- [ ] Foreldre-portal
- [ ] Betalingsintegrasjon (Stripe)
- [ ] Utvidede rapporter

### Q3 2025
- [ ] Flere språk (Engelsk, Svensk, Dansk)
- [ ] API for tredjeparter
- [ ] White-label løsning

---

## Konkurransefortrinn

| Oss | Konkurrenter |
|-----|--------------|
| Bygget spesifikt for IUP-metodikk | Generiske treningsapper |
| DataGolf pro-statistikk integrasjon | Ingen pro-sammenligning |
| AI-drevet breaking point-analyse | Manuell analyse |
| Norsk kontekst (GolfBox, MET, NGF) | Internasjonal fokus |
| Full video-analyse plattform | Begrenset eller ingen |
| Gamification for motivasjon | Statisk tracking |

---

## Oppsummering

**IUP Golf Academy** er en komplett, produksjonsklar plattform som gir:

1. **Spillere** - Strukturert utvikling med motiverende gamification
2. **Trenere** - Kraftige verktøy for analyse og oppfølging
3. **Akademier** - Skalerbar løsning for flere lokasjoner
4. **Foreldre** - Innsikt i barnets utvikling (kommer)

### Neste steg
- Demo av live-systemet
- Diskutere go-to-market strategi
- Pilotprosjekt med første akademi

---

*Bygget med moderne teknologi. Designet for norsk golf.*

**Kontakt:** anders@akgolf.no
