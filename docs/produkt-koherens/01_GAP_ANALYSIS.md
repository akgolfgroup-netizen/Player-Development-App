# Gap-analyse: IUP Golf System Coherence

> Kartlegging av hva som finnes, hva som mangler, og konsekvensene for systemkoherens.

---

## 1. Bruker- og produktlogikk

### 1.1 Brukerflyt / Produktbeskrivelse

| Aspekt | Status | Lokasjon |
|--------|--------|----------|
| Onboarding → daglig bruk | ✅ Dokumentert | `docs/02_BRUKERREISER.md`, `docs/specs/FUNCTIONAL_USER_JOURNEY_MAP.md` |
| Autentisering/token-flyt | ✅ Detaljert | `docs/features/AUTHENTICATION_FLOWS.md` |
| Coach-journey | ✅ Dokumentert | `docs/features/COACH_ADMIN_JOURNEYS.md` |
| Målsetting → plan → evaluering | ⚠️ DELVIS | Flyt finnes, men ingen kobling mellom goals og plan-generering |

**Kritisk hull:**

Målsettingsmodulen (`/api/v1/goals/`) og plan-generatoren (`plan-generation.service.ts`) snakker ikke sammen. Spillermål lagres, men brukes ikke som input til planalgoritmen.

### 1.2 Målsettingslogikk

| Aspekt | Status | Detaljer |
|--------|--------|----------|
| Hvordan brukeren setter mål | ✅ Implementert | Score, teknikk, fysisk, mental, turnering, prosess |
| Validering | ✅ Basis | Tittel, datoer, type, 0-100% progress |
| Konflikt: tid vs ambisjon vs nivå | ❌ IKKE IMPLEMENTERT | Ingen sjekk om mål er realistisk gitt spillerkategori |

**Kritisk hull:**

Progresjonsmodellen (A1→K) er brutal og ærlig. Men målsettingslogikken ignorerer spillerkategori helt. En K-spiller kan sette "bli scratch" som mål uten varsler.

**Mangler:**
- Ingen `Player.category` → `Goal.feasibility` validering
- Ingen "estimert tid til mål" basert på progresjonsdata
- Ingen konflikt-håndtering mellom flere samtidige mål

---

## 2. Data- og feedback-sløyfer

### 2.1 Hva måles faktisk?

| Kategori | Antall | Frekvens | Hvem legger inn |
|----------|--------|----------|-----------------|
| Tester | 20 definerte | Sporadisk (benchmark-basert) | Spiller/trener |
| Øvelser | ~50+ i bibliotek | Per økt | Automatisk + spiller |
| Breaking Points | Dynamisk | Kontinuerlig tracking | System + trener |
| Gamification metrics | 100+ KPIer | Kalkulert on-demand | System |

**Godt implementert:**
- 20 golf-spesifikke tester med nøyaktige kalkulasjoner
- PEI (Precision Efficiency Index) for approach-shots
- Effort vs Progress separasjon ("Completion affects EFFORT, NOT progress")
- Breaking point status-flow: `not_started → identified → in_progress → awaiting_proof → resolved`

**Kritisk hull:**

Testresultater oppdaterer breaking point progress, men trigger ikke plan-endringer. Systemet vet at du er bedre, men gjør ingenting med planen.

### 2.2 Re-planlegging og adaptiv logikk

| Trigger | Implementert | Hva skjer |
|---------|-------------|-----------|
| Testresultat | ⚠️ Delvis | Oppdaterer breaking point, ikke plan |
| Manglende gjennomføring | ❌ Nei | Kun status-endring, ingen redistribusjon |
| Turnering | ✅ Ja | Manuell rescheduling med topping/tapering |
| Coach-override | ✅ Ja | Full manuell kontroll |
| Automatisk regenerering | ❌ IKKE IMPLEMENTERT | Ingen scheduler eller trigger |

**Kritisk hull:**

Planen er i praksis statisk etter generering. Det finnes:
- Ingen automatisk plan-regenerering
- Ingen smart redistribusjon av tapte økter
- Ingen kategori-opprykk automation
- Ingen "performance-based re-planning"

**Konsekvens:** Systemet er teknisk imponerende, men idrettsfaglig passivt.

---

## 3. Innhold og semantikk

### 3.1 Session Templates

| Aspekt | Status |
|--------|--------|
| Komplett liste | ✅ 39 templates dokumentert |
| Perioder (E/G/S/T) | ✅ Korrekt fordelt |
| Learning phases (L1-L5) | ✅ Definert |
| Domains (TEE, PUTT, ARG, etc.) | ✅ Koblet |
| Kategori-begrensninger | ⚠️ Finnes, men alle templates tillatt for alle kategorier |

**Observasjon:**

De fleste templates har `categories: [A,B,C,D,E,F,G,H,I,J,K]` - altså ingen reell filtrering basert på spillernivå. L1-sessions burde kanskje ikke være tilgjengelige for A-spillere, og L5-sessions ikke for K-spillere.

### 3.2 Øvelsesbibliotek / Progresjonssteg

| Aspekt | Status |
|--------|--------|
| Øvelse-schema | ✅ Detaljert (difficulty, progressionSteps, regressionSteps) |
| L1→L5 progresjon | ⚠️ Labels finnes, men ingen automatisk progresjon |
| Øvelse → breaking point kobling | ✅ `addressesBreakingPoints[]` felt finnes |

**Hull:**

Feltene `progressionSteps` og `regressionSteps` er strings, ikke strukturerte data. Systemet vet ikke hvordan en øvelse skal bli vanskeligere.

---

## 4. Roller og ansvar

| Hvem | Kan | Kan ikke |
|------|-----|----------|
| Trener | Generere plan, endre økter, respondere på requests, batch-operasjoner | Tvinge spiller til å akseptere plan |
| Spiller | Akseptere/avslå plan, be om endringer, logge økter | Endre økter direkte, se andre spilleres data |
| System | Låse periodisering, historiske data, plan-struktur | Automatisk re-planlegge, oppdatere kategori |

**Godt implementert:**
- Tydelig separasjon mellom `coachNotes` og `playerNotes`
- Modification request workflow med urgency levels
- Tenant-isolasjon

---

## 5. Forventningsstyring

| Aspekt | Status | Kommentar |
|--------|--------|-----------|
| Markedsføringspåstander | ❓ Ikke funnet | Ingen `/marketing` eller lignende i docs |
| App-copy om progresjon | ⚠️ Delvis | Frontend viser progress %, men forklarer ikke metodikken |
| Estimater til bruker | ❌ Ikke implementert | Ingen "forventet tid til mål" eller "prosjektert kategori-opprykk" |

**Fra `FUNCTIONAL_USER_JOURNEY_MAP.md`:**

> "App tracks 'what you do' but fails at 'proving it works'"

16 identifiserte gaps inkludert "no onboarding for new users" og "no value proof"

---

## 6. Oppsummering

### Det som FINNES og fungerer

1. **Brukerflyt-dokumentasjon** - Detaljert i 3+ dokumenter
2. **20 tester med presis matematikk** - Kategori-krav, PEI-formler, etc.
3. **39 session templates** - Med perioder, phases, domains
4. **Coach/Player rollegrenser** - Klar separasjon i kode
5. **Breaking point tracking** - Effort vs Progress separert

### Det som MANGLER (kritisk)

| # | Mangler | Konsekvens |
|---|---------|------------|
| 1 | Mål → Plan kobling | Spillermål ignoreres av planalgoritmen |
| 2 | Automatisk re-planlegging | Planer er statiske etter generering |
| 3 | Kategori-validering av mål | Urealistiske mål tillates |
| 4 | Øvelsesprogresjon-logikk | L1-L5 er labels, ikke oppførsel |
| 5 | Testresultat → Plan-trigger | Forbedring oppdager systemet, men reagerer ikke |

---

## 7. Nøkkelfiler i kodebasen

| Område | Filer |
|--------|-------|
| Plan-generering | `apps/api/src/domain/training-plan/plan-generation.service.ts` |
| Mål | `apps/api/src/api/v1/goals/service.ts`, `schema.ts` |
| Tester | `apps/api/src/domain/tests/` (20 tester) |
| Session templates | `apps/api/prisma/seeds/session-templates.ts` |
| Breaking points | `apps/api/src/domain/breaking-points/` |
| Manuell justering | `apps/api/src/domain/training-plan/manual-adjustment.service.ts` |
| Progress tracking | `apps/api/src/domain/training-plan/plan-progress.service.ts` |

---

*Neste steg: Se [02_CRITICAL_DECISIONS.md](./02_CRITICAL_DECISIONS.md) for beslutninger som må tas.*
