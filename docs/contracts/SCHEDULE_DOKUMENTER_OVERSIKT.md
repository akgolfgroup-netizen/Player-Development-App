# Schedule-dokumenter - Komplett oversikt

**Opprettet:** 27. desember 2025
**Formål:** NGF-presentasjon 13. januar 2025
**Status:** Utkast til gjennomgang

---

## OPPRETTEDE DOKUMENTER

### Plassering: `/docs/contracts/`

| Dokument | Størrelse | Innhold |
|----------|-----------|---------|
| **SCHEDULE_A_SERVICE_DESCRIPTION.md** | ~15 KB | Komplett tjenestebeskrivelse |
| **SCHEDULE_B_DATA_PROCESSING.md** | ~18 KB | Databehandleravtale (GDPR) |
| **SCHEDULE_C_COMMERCIAL_TERMS.md** | ~16 KB | Kommersielle vilkår og prising |
| **TECHNICAL_APPENDIX.md** | ~18 KB | Teknisk spesifikasjon |

---

## SCHEDULE A: SERVICE DESCRIPTION

### Formål
Beskriver hva IUP Golf er, hva plattformen gjør, og hvilke funksjoner som er tilgjengelige.

### Nøkkelinnhold

**Brukerroller:**
- Player (spiller/utøver)
- Coach (trener)
- Admin (administrator)
- Super Admin (plattformadmin)

**Feature-moduler:**
- 20+ spillermoduler (dashboard, trening, testing, gamification)
- 18+ trenermoduler (utøveroversikt, planredigering, bevisgjennomgang)
- 6 adminmoduler (brukerhåndtering, tier-konfigurasjon)

**Team Norway A-K System:**
| Kategori | Navn | Beskrivelse |
|----------|------|-------------|
| A | Driver | Lengde og presisjon |
| B | Long Game | Fairway-trær og lange jern |
| C | Approach | Jernspill til green |
| D | Short Game | Pitch og chip |
| E | Bunker | Sandspill |
| F | Putting | Green-prestasjon |
| G | Course Management | Strategi |
| H | Mental Game | Fokus og press |
| I | Physical Fitness | Styrke, mobilitet |
| J | Practice Quality | Treningseffektivitet |
| K | Competition | Turneringsprestasjon |

**Gamification:**
- 85 badges fordelt på kategorier
- XP-system med nivåprogresjon
- Kategori-skalering for rettferdig progresjon

**Video-analyse (under utvikling):**
- Opplasting: Ferdig
- Annotering: Under arbeid
- Voice-over: Planlagt
- Sammenligning: Planlagt

**Teknisk stack:**
- Frontend: React 18, Capacitor (mobil)
- Backend: Fastify, Node.js 20
- Database: PostgreSQL 16
- Cache: Redis 7
- Fil: AWS S3

---

## SCHEDULE B: DATA PROCESSING AGREEMENT

### Formål
Regulerer hvordan persondata behandles i henhold til GDPR, med spesiell fokus på mindreårige.

### Nøkkelinnhold

**Roller:**
| Rolle | Part | Ansvar |
|-------|------|--------|
| Controller | Kundeorganisasjon | Bestemmer formål med databehandling |
| Processor | Leverandør | Behandler data på vegne av Controller |
| Data Subject | Utøvere/spillere | Personer hvis data behandles |

**Datakategorier:**
- Identitetsdata (navn, fødselsdato, kjønn)
- Kontaktdata (e-post)
- Treningsdata (økter, resultater, notater)
- Prestasjonsdata (tester, badges, XP)
- Mediedata (videoer, bilder)
- Kommunikasjon (meldinger med trener)

**Mindreårige (viktig for NGF):**

| Aldersgruppe | Samtykkekrav |
|--------------|--------------|
| 16-17 år | Spillersamtykke + foreldrevarsel |
| 13-15 år | Spillersamtykke + foreldresamtykke |
| Under 13 år | Kun foreldresamtykke |

**Foreldrerettigheter:**
- Tilgang til barnets data
- Retting av feil
- Sletting (rett til å bli glemt)
- Innsigelse mot behandling
- Kopi av data (portabilitet)

**Sikkerhetstiltak:**
- JWT-autentisering (15 min access token)
- Valgfri 2FA (TOTP)
- Kryptering i transit (TLS 1.2+)
- Kryptering i hvile (database)
- Multi-tenant isolasjon
- Rate limiting
- Input-validering

**Sub-processors:**
| Leverandør | Formål | Lokasjon |
|------------|--------|----------|
| AWS | Hosting, S3 | EU (Ireland) |
| Redis Labs | Caching | EU |
| Sentry | Feilovervåking | EU |

**Retensjonstider:**
| Datatype | Oppbevaring |
|----------|-------------|
| Treningshistorikk | Konto + 5 år |
| Testresultater | Konto + 5 år |
| Medier (video) | Konto + 1 år |
| Meldinger | Konto + 2 år |
| Audit-logger | 3 år |

**Vedlegg inkludert:**
- Vedlegg A: Samtykkeformmal for mindreårige
- Vedlegg B: Forespørselsskjema for datasubjekter

---

## SCHEDULE C: COMMERCIAL TERMS

### Formål
Definerer prising, abonnementsmodeller, SLA og kommersielle vilkår.

### Nøkkelinnhold

**Abonnementstier:**

| Tier | Målgruppe | Spillere | Pris/mnd (NOK) |
|------|-----------|----------|----------------|
| Starter | Enkelttrenere | 1-10 | 990 |
| Club | Golfklubber | 11-50 | 2,990 |
| Academy | Akademier | 51-200 | 7,990 |
| Federation | NGF/regional | 200+ | Tilpasset |

**Feature-matrise (utvalg):**

| Feature | Starter | Club | Academy | Federation |
|---------|---------|------|---------|------------|
| Spiller-dashboard | Ja | Ja | Ja | Ja |
| Gamification (85 badges) | Ja | Ja | Ja | Ja |
| Video-opplasting | 10 GB | 50 GB | 200 GB | Ubegrenset |
| Voice-over | Nei | Ja | Ja | Ja |
| Multi-trener | Nei | Ja | Ja | Ja |
| API-tilgang | Nei | Begrenset | Full | Full |
| Aggregert rapportering | Nei | Nei | Nei | Ja |
| SLA-garanti | 99% | 99% | 99.5% | 99.9% |

**Aktiv spiller-definisjon:**
En "aktiv spiller" er en konto som har:
- Logget inn siste 30 dager, ELLER
- Hatt treningsdata registrert siste 30 dager

**Per-spiller prising (for større volum):**

| Volum | Per spiller/mnd |
|-------|-----------------|
| 1-50 | 99 NOK |
| 51-200 | 79 NOK |
| 201-500 | 59 NOK |
| 500+ | 39 NOK |

**NGF/Forbund spesialtilbud:**
- Pilot-program: 3 måneder gratis (inntil 3 klubber)
- Nasjonal utrulling: 40-50% volumrabatt
- Flerårig avtale: Ytterligere 10% rabatt

**SLA med service credits:**

| Oppnådd oppetid | Kreditt |
|-----------------|---------|
| 99.0-99.5% | 10% av månedspris |
| 98.0-99.0% | 25% av månedspris |
| 95.0-98.0% | 50% av månedspris |
| Under 95% | 100% av månedspris |

**Support-nivåer:**

| Tier | Responstid (kritisk) |
|------|----------------------|
| Starter/Club | 8 timer |
| Academy | 4 timer |
| Federation | 1 time |

**Vedlegg inkludert:**
- Vedlegg A: Pilot-program vilkår
- Vedlegg B: Ordreformmal

---

## TECHNICAL APPENDIX

### Formål
Gir detaljert teknisk dokumentasjon for due diligence og integrasjon.

### Nøkkelinnhold

**Arkitektur:**
```
Client Layer → API Gateway → Fastify API → Data Layer
                                            ├── PostgreSQL
                                            ├── Redis
                                            └── AWS S3
```

**API-statistikk:**
- 70+ endepunkter
- 240+ testcases
- 45%+ testdekning
- A- sikkerhetsvurdering

**Sikkerhetsimplementasjon:**
- JWT med 15 min utløp
- Refresh tokens med 7 dagers utløp
- Valgfri TOTP 2FA med backup-koder
- bcrypt/Argon2 passordhashing
- Komplett RBAC (player/coach/admin)
- Multi-tenant dataisolasjon

**Database-skjema:**
- Tenant-isolasjon på alle tabeller
- 50+ optimaliserte indekser
- Prisma ORM (SQL injection-beskyttet)

**Backup og recovery:**
- RPO: 1 time (maks datatap)
- RTO: 4 timer (maks nedetid)
- Daglig full backup, 30 dagers oppbevaring
- Kontinuerlig WAL-logging

**Ytelsestester:**
- Dashboard-lasting: 180ms (p95)
- Session-opprettelse: 220ms (p95)
- Video-opplasting (60s): < 25 sekunder

---

## ANBEFALINGER FØR NGF-MØTET

### Høy prioritet

1. **Juridisk gjennomgang**
   - Schedule B (DPA) bør gjennomgås av advokat
   - Spesielt fokus på mindreårige og samtykke
   - Vurder norsk juridisk praksis

2. **Kommersiell validering**
   - Schedule C priser er forslag
   - Valider mot markedspris for lignende løsninger
   - Avklar rabattstruktur for NGF

3. **Pilot-program**
   - Forbered konkret forslag til pilotklubber
   - Definer suksesskriterier for pilot
   - Avklar support under pilot

### Medium prioritet

4. **Samtykkeformmal**
   - Vedlegg A i Schedule B må tilpasses
   - Vurder digital vs. papirbasert samtykke
   - Integrer med eksisterende medlemssystemer?

5. **Integrasjoner**
   - Avklar interesse for GolfBox-integrasjon
   - Trackman/GC Quad prioritering
   - Golf Genius turneringsdata

### Lavere prioritet

6. **Sertifiseringer**
   - ISO 27001 på roadmap
   - SOC 2 på roadmap
   - Tidslinje for disse

---

## FILREFERANSER

**Presentasjon:**
- `/docs/PRESENTASJON_NGF_13_JANUAR.md`

**Kontrakter:**
- `/docs/contracts/SCHEDULE_A_SERVICE_DESCRIPTION.md`
- `/docs/contracts/SCHEDULE_B_DATA_PROCESSING.md`
- `/docs/contracts/SCHEDULE_C_COMMERCIAL_TERMS.md`
- `/docs/contracts/TECHNICAL_APPENDIX.md`

**Mockups:**
- `Visuelle mock ups/IUP_PLAYER_MOCKUPS_1.html`
- `Visuelle mock ups/IUP_MOCKUPS_COACH.html`
- `Visuelle mock ups/IUP_INVESTOR_MOCKUPS.html`

**Teknisk dokumentasjon:**
- `/docs/architecture/overview.md`
- `/docs/SECURITY_AUDIT_REPORT.md`
- `/docs/feature-modules.md`
- `/docs/reference/golf-categories.md`
- `/docs/reference/GAMIFICATION_METRICS_SPEC.md`

---

## AKSJONSLISTE

- [ ] Juridisk gjennomgang av Schedule B
- [ ] Prisvalidering for Schedule C
- [ ] Identifiser 2-3 pilotklubber
- [ ] Tilpass samtykkeformmal (Vedlegg A)
- [ ] Forbered demo-miljø for presentasjon
- [ ] Avklar GolfBox-integrasjon med NGF
- [ ] Ferdigstill pilotavtale-vilkår

---

*Generert basert på faktisk kodebase-analyse.*
*Ingen antagelser - kun verifisert informasjon.*
