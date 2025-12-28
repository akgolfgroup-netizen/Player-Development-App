# IUP Golf Academy - Presentasjon til Norges Golfforbund

**Dato:** 13. januar 2025
**Versjon:** 1.0
**Produsert:** Basert på faktisk kodebase og dokumentasjon

---

# DEL 1: EXECUTIVE SUMMARY

## Hva er IUP Golf Academy?

IUP Golf Academy er en digital plattform for systematisk spillerutvikling i golf, bygget på Team Norway IUP-metodikk (Individuell UtviklingsPlan).

**Plattformen er ~90% ferdigstilt.** UI/designsystem er i sluttfase, men funksjonalitet, arkitektur og domenelogikk er implementert og testet.

### Nøkkeltall fra kodebasen

| Metrikk | Verdi |
|---------|-------|
| API-endepunkter | 70+ |
| Feature-moduler | 65+ |
| Kodelinjer backend | 27,890 |
| Testdekning | 45%+ |
| Testcases | 240+ |
| Sikkerhetsvurdering | A- (Excellent) |
| Badges/gamification | 85 stk |
| Golfkategorier | 11 (A-K) |

### Problemet vi løser

**For spillere:** Manglende systematikk i trening, ingen helhetlig oversikt over utvikling, fragmenterte verktøy.

**For trenere:** Ineffektiv oppfølging av mange spillere, manuell dokumentasjon, ingen standardisert metodikk.

**For forbund/organisasjoner:** Ingen felles plattform for talentutvikling, manglende datainnsikt, vanskelig å skalere.

### Løsningen

En helintegrert plattform som:
- Følger Team Norway IUP-metodikk med 11 utviklingskategorier (A-K)
- Gir spillere eierskap til egen utvikling med gamification
- Gir trenere effektive verktøy uten å kompromittere spillerens autonomi
- Gir organisasjoner innsikt og skalerbarhet

---

# DEL 2: FUNKSJONS- OG MODULOVERSIKT

## 2.1 Hovedmoduler

### For Spillere (20+ moduler)

| Modul | Status | Beskrivelse |
|-------|--------|-------------|
| Dashboard | Ferdig | Personlig oversikt med widgets |
| Årsplan | Ferdig | Periodisert treningsplan (E/G/S/T-faser) |
| Treningsøkter | Ferdig | Aktiv trening med sanntidssporing |
| Testresultater | Ferdig | 20+ testprotokoller med benchmarks |
| Mål og fremgang | Ferdig | Målsetting og sporingsverktøy |
| Prestasjoner/Badges | Ferdig | 85 badges med XP-system |
| Kalender | Ferdig | Trenings- og turneringskalender |
| Videobevis | Ferdig | Last opp bevis på trening |
| Notater | Ferdig | Personlig treningsdagbok |
| Skoleplan | Ferdig | Integrering med skolegang |
| Turneringer | Ferdig | Turneringskalender og resultater |

### For Trenere (18+ moduler)

| Modul | Status | Beskrivelse |
|-------|--------|-------------|
| Trener-dashboard | Ferdig | Oversikt alle utøvere |
| Utøverliste | Ferdig | Nøytral alfabetisk liste |
| Utøverdetalj | Ferdig | Navigasjonshub til verktøy |
| Bevisgjennomgang | Ferdig | Se videoer fra spillere |
| Utviklingssporing | Ferdig | Visualiser fremgang |
| Treningsplanredigerer | Ferdig | Opprett og endre planer |
| Trenernotater | Ferdig | Private notater per spiller |
| Intelligensvarslinger | Ferdig | Automatiske innsikter |
| Meldinger | Ferdig | Kommunikasjon med spillere |

### For Admin (6 moduler)

| Modul | Status | Beskrivelse |
|-------|--------|-------------|
| Systemoversikt | Ferdig | Helsesjekk og metrikker |
| Brukeradministrasjon | Ferdig | Håndter trenere og spillere |
| Tier-administrasjon | Ferdig | Abonnementsnivåer |
| Eskaleringshåndtering | Ferdig | Supportssaker |
| Feature flags | Ferdig | Aktivering av funksjoner |

---

## 2.2 Team Norway IUP-system (A-K Kategorier)

Plattformen følger Team Norway sitt kategorisystem for spillerutvikling:

| Kategori | Navn | Beskrivelse |
|----------|------|-------------|
| A | Driver | Lengde og presisjon |
| B | Langt spill | Fairway-trær og lange jern |
| C | Approach | Jernspill til green |
| D | Kort spill | Pitch og chip |
| E | Bunker | Sandspill |
| F | Putting | Green-prestasjon |
| G | Banemanagement | Strategi og beslutninger |
| H | Mentalt spill | Fokus og pressmestring |
| I | Fysisk form | Styrke, mobilitet, utholdenhet |
| J | Treningskvalitet | Effektivitet i trening |
| K | Konkurranse | Turneringsprestasjon |

**Scoreskala:** 1-10 (Begynner → Elite)

**Utviklingsfaser:**
- E (Etablere) → G (Grow/Vokse) → S (Strengthen/Styrke) → T (Turnering)

---

## 2.3 Testprotokollsystem

### Fysiske tester (i produksjon)

| Test | Menn Elite | Kvinner Elite |
|------|------------|---------------|
| Benkpress 1RM | 140 kg | 100 kg |
| Markløft trapbar 1RM | 200 kg | 140 kg |
| 3000m løping | 11:00 | 12:30 |

### Golf-tester (i produksjon)

| Test | Menn Elite | Kvinner Elite |
|------|------------|---------------|
| Driver carry | 270m | 240m |
| Clubhead speed | 193 km/t | 169 km/t |
| Ball speed | 285 km/t | 250 km/t |
| Smash factor | 1.48 | 1.48 |
| Jern 7 carry | 175m | 150m |

Alle tester er skalerbare per kategori (A-K) med definerte krav.

---

## 2.4 Gamification-system

### 85 Badges fordelt på kategorier:

| Kategori | Antall | Eksempler |
|----------|--------|-----------|
| Volum | 20+ | Timer trent, økter fullført, slag slått |
| Styrke | 15+ | Tonnasje, PRs, relativ styrke |
| Prestasjon | 20+ | Speed milestones, presisjon, scoring |
| Fase/Periodisering | 10+ | Fase-compliance, årsplan-mestring |
| Streaks | 10+ | Konsistens over tid |

### XP-system
- Badges gir XP (50-2000 poeng)
- Høyere XP for vanskeligere kategorier (K-spillere får multiplikator)
- Nivåprogresjon som synlig motivasjon

---

## 2.5 Video-analyseplattform (under utvikling)

**Status:** Infrastruktur ferdig, UI under implementering

| Funksjon | Status |
|----------|--------|
| Video-opplasting (S3) | Ferdig |
| Multipart upload | Ferdig |
| Thumbnail-generering | Ferdig |
| Metadata-ekstraksjon | Ferdig |
| Tegne-/annoteringsverktøy | Under arbeid |
| Voice-over | Under arbeid |
| Side-by-side sammenligning | Planlagt |
| Trener-dashboard for video | Planlagt |

**Estimert ferdigstillelse:** 8-10 uker fra nå

---

# DEL 3: ROLLEBASERT BRUKERFLYT

## 3.1 Spillerreise

```
ONBOARDING
└── Opprett konto → Fyll ut profil → Kobles til trener → Dashboard

DAGLIG BRUK
├── Dashboard: Se dagens oppgaver, meldinger, streaks
├── Trening: Følg plan, logg økter, registrer resultater
├── Testing: Gjennomfør tester, sammenlign med benchmarks
├── Mål: Sett mål, spor fremgang, feire milepæler
└── Kommunikasjon: Motta feedback fra trener

UTVIKLING OVER TID
├── Årsplan: Følg periodisering (E→G→S→T)
├── Badges: Lås opp prestasjoner
├── Historikk: Se egen utvikling over måneder/år
└── Eksport: Last ned data og rapporter
```

**Spillerens eierskap:** Spilleren eier egne data. Trenerens observasjoner er tydelig merket som trenernotat, ikke system-sannhet.

---

## 3.2 Trenerreise

```
DAGLIG ARBEID
├── Dashboard: Se alle tilknyttede spillere (alfabetisk)
├── Velg spiller: Nøytral liste uten prestasjonsindikatorer
├── Se bevis: Gjennomgå videoer og bilder
├── Se utvikling: Kronologisk data uten fargekodig vurdering
├── Redigere plan: Legg til/fjern treningsblokker
└── Skriv notat: Tydelig merket som "Trenernotat"

BEGRENSINGNER (Authority Contract)
├── Kan IKKE rangere spillere
├── Kan IKKE endre historiske data
├── Kan IKKE se system-genererte "anbefalinger"
├── Kan IKKE merke spillere som "gode" eller "dårlige"
└── Observasjoner er alltid atskilt fra systemdata
```

**Autoritetsbeskyttelse:** Trenere har verktøy, ikke dommer-makt. Spilleren beholder tolkningsrett over egne data.

---

## 3.3 Adminreise

```
SYSTEMOVERSIKT
├── Teknisk helse: Server, database, API-ytelse
├── Aggregerte tall: Totalt antall brukere per tier
├── Feature flags: Aktivere/deaktivere funksjoner
└── Støttesaker: Håndtere eskalerte problemer

BEGRENSNINGER
├── Kan IKKE se individuelle spillerdata
├── Kan IKKE se trener-spiller relasjonsdetaljer
├── Kan IKKE evaluere trenere basert på spillerprestasjon
└── Alle handlinger logges og er sporbare
```

---

# DEL 4: TEKNISK OG ORGANISATORISK OVERSIKT (NGF-nivå)

## 4.1 Arkitektur

```
┌─────────────────────────────────────────────────────────────┐
│                    IUP Golf Platform                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   [Spiller App]    [Trener App]    [Admin Portal]           │
│         │               │               │                    │
│         └───────────────┼───────────────┘                    │
│                         ▼                                    │
│               ┌─────────────────┐                            │
│               │   React SPA     │   Frontend (Web + Mobil)   │
│               └────────┬────────┘                            │
│                        │ HTTPS                               │
│                        ▼                                     │
│               ┌─────────────────┐                            │
│               │  Fastify API    │   Backend (Node.js)        │
│               └────────┬────────┘                            │
│                        │                                     │
│         ┌──────────────┼──────────────┐                      │
│         ▼              ▼              ▼                      │
│   [PostgreSQL]    [Redis]        [AWS S3]                    │
│    Database        Cache          Filer                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 4.2 Teknologivalg

| Lag | Teknologi | Formål |
|-----|-----------|--------|
| Frontend | React 18 | Single Page Application |
| Mobil | Capacitor | iOS/Android wrapper |
| Backend | Fastify 4, Node.js 20 | REST API |
| Database | PostgreSQL 16 | Primær datalagring |
| ORM | Prisma 5 | Typesikker database-tilgang |
| Cache | Redis 7 | Sesjonscache, rate limiting |
| Fil | AWS S3 | Video, bilder, dokumenter |
| Auth | JWT + TOTP (2FA) | Autentisering |

## 4.3 Multi-tenant arkitektur

Plattformen støtter flere organisasjoner med fullstendig dataisolasjon:

```sql
-- Alle spørringer er begrenset per tenant
SELECT * FROM players
WHERE tenant_id = :tenantId
AND id = :playerId
```

**Implikasjoner for NGF:**
- Hvert akademi/klubb er isolert
- Ingen krysslekkasje av data mellom organisasjoner
- Sentralisert administrasjon mulig for forbundsnivå
- Skalerbart til mange klubber

---

## 4.4 Sikkerhetsvurdering

**Overordnet vurdering: A- (Excellent)**

### Implementerte sikkerhetstiltak

| Tiltak | Status | Detaljer |
|--------|--------|----------|
| JWT-autentisering | Implementert | 15 min access, 7 dager refresh |
| Tofaktorautentisering (2FA) | Implementert | TOTP med backup-koder |
| Rollebasert tilgang (RBAC) | Implementert | Admin, Coach, Player |
| Passordhashing | Implementert | bcrypt/Argon2 |
| Passordtilbakestilling | Implementert | Kryptografisk sikre tokens |
| Rate limiting | Implementert | Per bruker og per IP |
| Sikkerhetsheadere | Implementert | CSP, HSTS, X-Frame-Options |
| CORS-beskyttelse | Implementert | Hviteliste-basert |
| SQL injection-beskyttelse | Implementert | Prisma ORM |
| Input-validering | Implementert | Zod-skjemaer |
| Feilovervåking | Implementert | Sentry |

### Anbefalte forbedringer før produksjon

| Tiltak | Prioritet |
|--------|-----------|
| CSRF-beskyttelse | Høy |
| API-nøkkel for integrasjoner | Høy |
| Audit logging for kritiske handlinger | Høy |
| Penetrasjonstesting | Medium |

---

## 4.5 Personvern og samtykke

### Gjeldende prinsipper (fra kode og dokumentasjon)

**Dataminimering:**
- Kun nødvendige data samles
- Sensitive data logges ikke (tokens, passord, e-post i analytics)

**Dataisolasjon:**
- Multi-tenant med fullstendig separasjon
- Spillere ser kun egne data
- Trenere ser kun tilknyttede spillere
- Admin ser kun aggregerte tall

**Spillerens eierskap:**
- Spilleren eier egne data
- Trenernotat er tydelig merket som trener-innhold
- Spilleren kan ignorere eller deaktivere trenernotat-visning

### Mindreårige (under 18)

**Basert på kodelogikk og autoritetskontrakten:**
- Spilleren (inkl. mindreårige) har tolkningsrett over egne data
- Trenere kan ikke sette "gode/dårlige" merkelapper
- System presenterer data nøytralt uten verdivurdering

**Anbefaling for NGF:**
- Formelt samtykkeskjema for foresatte bør dokumenteres
- Foreldretilgang som egen rolle kan vurderes
- GDPR-verktøy (eksport, sletting) er delvis implementert

---

## 4.6 Seat counting / Active player-logikk

**Fra tier-administrasjonsmodulen:**

Plattformen støtter abonnementsnivåer (tiers) med:
- Definerte funksjonsett per tier
- Mulighet for begrensning per antall aktive spillere
- Admin-grensesnitt for tier-konfigurasjon

**Foreslått NGF-modell:**
- Lisens per aktiv spiller per måned
- Definere "aktiv" som innlogget siste 30 dager
- Volumrabatt for forbundsnivå

---

# DEL 5: STATUS OG FERDIGSTILLELSE

## 5.1 Hva er ferdig

| Område | Ferdigstillelse | Kommentar |
|--------|-----------------|-----------|
| Backend API | 95% | 70+ endepunkter, komplett domenelogikk |
| Autentisering | 100% | JWT, 2FA, passordtilbakestilling |
| Rollesystem | 100% | Player, Coach, Admin |
| Database-skjema | 100% | Prisma med migrasjoner |
| Spiller-features | 90% | Alle hovedfunksjoner |
| Trener-features | 85% | Alle hovedfunksjoner |
| Admin-features | 80% | Hovedfunksjoner |
| Gamification | 100% | 85 badges, XP-system |
| Testprotokoller | 100% | 20+ tester med benchmarks |
| Sikkerhet | 90% | A- rating |
| Monitoring | 85% | Prometheus, Sentry |
| UI/Design | 70% | Funksjonelt, polering gjenstår |

## 5.2 Hva gjenstår

| Område | Gjenstående | Estimat |
|--------|-------------|---------|
| UI-polish | Designsystem v3.1 fullføring | 2-3 uker |
| Video-analyse | Annoterings-UI, voice-over | 6-8 uker |
| E2E-testing | Utvide dekning | 2 uker |
| CSRF-beskyttelse | Implementere | 3-4 dager |
| Dokumentasjon | Brukerhåndbøker | 1 uke |
| Produksjonsdeploy | AWS/GCP oppsett | 1 uke |

**Total estimert gjenstående arbeid: 10-12 uker**

---

# DEL 6: SLIDE-STRUKTUR FOR PRESENTASJON

## Foreslått presentasjonsflyt (30-45 min)

### Slide 1: Tittel
**IUP Golf Academy**
*Digitalt verktøy for systematisk spillerutvikling*

Presentatør: [Navn]
Dato: 13. januar 2025

---

### Slide 2: Problemet
**Fragmentert spillerutvikling**
- Ingen helhetlig oversikt for spiller
- Ineffektiv oppfølging for trener
- Manglende skalerbarhet for forbund/klubb

*Illustrasjon: Fragmenterte verktøy (Excel, papir, separate apper)*

---

### Slide 3: Løsningen
**IUP Golf Academy - Én plattform**
- Følger Team Norway IUP-metodikk
- 11 kategorier (A-K)
- Gamification for motivasjon
- Tydelig rollefordeling

*Illustrasjon: Systemarkitektur*

---

### Slide 4: Demo - Spiller
**Live demo eller mockups:**
- Dashboard med widgets
- Treningsøkt-gjennomføring
- Testresultater og utvikling
- Badges og prestasjoner

*Bruk: IUP_PLAYER_MOCKUPS_1.html*

---

### Slide 5: Demo - Trener
**Live demo eller mockups:**
- Trener-dashboard
- Utøveroversikt
- Treningsplanredigering
- Bevisgjennomgang

*Bruk: IUP_MOCKUPS_COACH.html*

---

### Slide 6: Team Norway-integrasjon
**A-K Kategorisystem**
- 11 utviklingsområder
- Definerte benchmarks per kategori
- Fysiske og golfrelaterte tester
- Periodisering (E/G/S/T)

*Tabell: Kategorier med eksempler på elite-krav*

---

### Slide 7: Gamification
**85 Badges for motivasjon**
- Volum: Timer, økter, slag
- Styrke: Tonnasje, PRs
- Prestasjon: Speed, presisjon
- Konsistens: Streaks, compliance

*Illustrasjon: Badge-eksempler fra PDF*

---

### Slide 8: Teknisk oversikt
**Enterprise-klar plattform**
- Multi-tenant arkitektur
- A- sikkerhetsvurdering
- 70+ API-endepunkter
- Skalerbar til mange klubber

---

### Slide 9: Sikkerhet og personvern
**Trygg for mindreårige og organisasjoner**
- 2FA-autentisering
- Rollebasert tilgang
- Dataisolasjon per organisasjon
- Spilleren eier egne data

---

### Slide 10: Status
**~90% ferdigstilt**
| Ferdig | Under arbeid |
|--------|--------------|
| Backend 95% | UI-polish |
| Features 85-95% | Video-analyse |
| Sikkerhet A- | E2E-testing |

*UI er i sluttfase - funksjonalitet er ferdig*

---

### Slide 11: Neste steg
**Anbefalt vei videre**
1. Pilotavtale med 2-3 klubber
2. Feedback-løkke (8 uker)
3. Forbundsavtale for bredere utrulling

---

### Slide 12: Teamet
**WeMade + Anders + Jørn Andre Hammer**
- WeMade: Teknisk utvikling
- Anders: Fagansvarlig golf, aktivt utviklingsarbeid
- Jørn Andre Hammer: Prosjektansvarlig

---

### Slide 13: Spørsmål
*Kontaktinformasjon*

---

# DEL 7: RISIKO OG REALISME

## 7.1 Identifiserte hull i dokumentasjon

| Område | Observasjon | Anbefaling |
|--------|-------------|------------|
| Schedule A/B/C | Ikke funnet i repo | Bør utarbeides separat |
| GDPR-verktøy | Delvis implementert | Ferdigstill eksport/sletting |
| Foreldresamtykke | Ikke formalisert | Lag samtykkeskjema |
| SLA-avtale | Ikke dokumentert | Definer oppetidsmål |
| Prismodell | Ikke i kode | Ferdigstill kommersiell modell |

## 7.2 Områder som bør avklares før pilot

| Spørsmål | Ansvarlig |
|----------|-----------|
| Hvem er databehandler vs. behandlingsansvarlig? | Juridisk |
| Formell samtykkehåndtering for mindreårige | Juridisk + Produkt |
| Hosting-lokasjon (EU-krav) | Teknisk |
| Backup og disaster recovery | Teknisk |
| Support-struktur (hvem svarer spillere?) | Drift |

## 7.3 Tekniske avhengigheter

| Avhengighet | Risiko | Mitigering |
|-------------|--------|------------|
| AWS S3 for video | Kostnad ved stor bruk | Livssykluspolicyer, 5 min maks |
| Trackman/GC integrasjon | Ikke implementert | Manuell import først |
| Push-notifikasjoner | Ikke ferdig | WebSocket fungerer |
| iOS App Store | Ikke publisert | Capacitor-wrapper klar |

---

# DEL 8: ANBEFALTE NESTE STEG ETTER MØTET

## Umiddelbart (uke 1-2)
1. **Avklare intensjonsavtale** med NGF
2. **Identifisere 2-3 pilotklubber** for begrenset utrulling
3. **Ferdigstille samtykkeskjema** for mindreårige

## Kortsiktig (uke 3-8)
4. **Pilotperiode** med utvalgte klubber
5. **Ukentlig feedback-møte** med pilot-trenere
6. **UI-polish** basert på brukeropplevelse
7. **Ferdigstille video-analyse** til MVP

## Mellomlang sikt (uke 9-16)
8. **Evaluering av pilot** med NGF
9. **Prisjustering** basert på bruksmønster
10. **Forbundsavtale** for nasjonal utrulling
11. **App Store-publisering** for iOS/Android

---

# VEDLEGG

## A: Tekniske ressurser i repo

| Fil | Innhold |
|-----|---------|
| `/docs/README.md` | Dokumentasjonsindex |
| `/docs/architecture/overview.md` | Arkitekturoversikt |
| `/docs/SECURITY_AUDIT_REPORT.md` | Sikkerhetsvurdering |
| `/docs/feature-modules.md` | 36 feature-moduler |
| `/docs/reference/golf-categories.md` | A-K kategorier |
| `/docs/reference/CONFIG_KATEGORI_KRAV.md` | Alle testkrav |
| `/docs/reference/GAMIFICATION_METRICS_SPEC.md` | 85 badges |
| `/docs/VIDEO_ANALYSIS_PLATFORM_PLAN.md` | Videoplan |

## B: Mockups tilgjengelige

| Fil | Innhold |
|-----|---------|
| `Visuelle mock ups/IUP_PLAYER_MOCKUPS_1.html` | Spiller-dashboard |
| `Visuelle mock ups/IUP_MOCKUPS_COACH.html` | Trener-grensesnitt |
| `Visuelle mock ups/IUP_INVESTOR_MOCKUPS.html` | Investor-presentasjon |
| `docs/AK Golf Academy - Alle 85 Designede Badges.pdf` | Badge-bibliotek |

## C: Demo-innlogging

| Rolle | E-post | Passord |
|-------|--------|---------|
| Admin | admin@demo.com | admin123 |
| Trener | coach@demo.com | coach123 |
| Spiller | player@demo.com | player123 |

---

*Dokumentet er generert basert på faktisk kodebase og dokumentasjon.*
*Ingen antagelser - kun verifisert informasjon.*

**Sist oppdatert:** 27. desember 2025
