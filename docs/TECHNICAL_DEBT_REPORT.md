# Teknisk Gjeld & Testdekning Rapport

> IUP Master V1 - Analyse utført 2026-01-09

---

## Sammendrag

| Kategori | Status | Kritisk | Høy | Medium | Lav |
|----------|--------|---------|-----|--------|-----|
| **Testdekning** | 🔴 5.5% | - | - | - | - |
| **TODO/FIXME** | 🟠 69 items | 3 | 11 | 19 | 36 |
| **Type-sikkerhet** | 🟠 486 violations | 8 | 50+ | 100+ | 300+ |
| **Hardkodede verdier** | 🔴 Kritisk | 2 | 3 | 5 | 10+ |
| **Dependencies** | 🟡 B+ | 3 | 4 | 5 | - |
| **Console.log** | 🟠 500+ | 20 | 50 | 100+ | 300+ |
| **Store filer** | 🔴 60-70 filer | 5 | 15 | 20 | 30 |

**Helhetlig teknisk gjeld-score: C+ (Betydelig forbedring nødvendig)**

---

## Innholdsfortegnelse

1. [Testdekning](#1-testdekning)
2. [TODO/FIXME Kommentarer](#2-todofixme-kommentarer)
3. [TypeScript Type-sikkerhet](#3-typescript-type-sikkerhet)
4. [Hardkodede Verdier & Sikkerhet](#4-hardkodede-verdier--sikkerhet)
5. [Dependencies](#5-dependencies)
6. [Debug Statements](#6-debug-statements)
7. [Kode-kompleksitet](#7-kode-kompleksitet)
8. [Prioritert Handlingsplan](#8-prioritert-handlingsplan)

---

## 1. Testdekning

### Nøkkeltall

| Metrikk | Verdi | Mål | Status |
|---------|-------|-----|--------|
| Totalt antall testfiler | 55 | 200+ | 🔴 |
| Totalt antall kildefiler | 991 | - | - |
| Testdekning (filer) | 5.5% | 80%+ | 🔴 |
| API testdekning | 34 filer | 100+ | 🟠 |
| Web testdekning | 11 filer | 150+ | 🔴 |
| E2E tester | 8 specs | 30+ | 🟠 |

### Testfil-fordeling

```
apps/
├── api/tests/
│   ├── integration/ (17 filer)
│   │   ├── auth.test.ts
│   │   ├── players.test.ts
│   │   ├── coaches.test.ts
│   │   ├── sessions.test.ts
│   │   ├── training-plan.test.ts
│   │   └── ... (12 andre)
│   ├── unit/ (13 filer)
│   │   ├── focus-engine.test.ts
│   │   ├── test-calculator.test.ts
│   │   └── ... (11 andre)
│   └── security/ (3 filer)
│       ├── xss.test.ts
│       ├── rbac.test.ts
│       └── sql-injection.test.ts
├── web/
│   ├── __tests__/ (4 filer)
│   └── features/__tests__/ (7 filer)
└── e2e/tests/ (8 Playwright specs)
```

### Konfigurerte Dekningsmål

**Web App (jest.config.js):**
- Branches: 70%
- Functions: 70%
- Lines: 80%
- Statements: 80%

**API (jest.config.js):**
- Branches: 50%
- Functions: 50%
- Lines: 50%
- Statements: 50%

### Kritiske Mangler

#### API Endpoints UTEN Tester (45 av 62)

| Prioritet | Endpoint | Risiko |
|-----------|----------|--------|
| 🔴 KRITISK | `/payments/*` | Finansielle transaksjoner |
| 🔴 KRITISK | `/admin/*` | Admin-operasjoner |
| 🔴 KRITISK | `/ai/*` | AI-integrasjoner |
| 🟠 HØY | `/bookings/*` | Booking-system |
| 🟠 HØY | `/calendar/*` | Kalender-funksjonalitet |
| 🟠 HØY | `/chat/*` | Meldingssystem |
| 🟡 MEDIUM | `/coach-analytics/*` | Analyse |
| 🟡 MEDIUM | `/tournaments/*` | Turneringer |

#### Web Features UTEN Tester (115+ av 120)

**Coach-modulen (50+ features uten tester):**
- coach-annual-plan
- coach-athlete-detail
- coach-athlete-list
- coach-booking
- coach-dashboard
- coach-exercises
- coach-groups
- coach-messages
- coach-training-plan
- ... og 40+ andre

**Player-modulen:**
- player-annual-plan
- player-insights
- player-overview
- player-stats

### Anbefalinger for Testdekning

| Prioritet | Tiltak | Estimert Innsats |
|-----------|--------|------------------|
| 🔴 Umiddelbart | Legg til tester for payments API | 2 uker |
| 🔴 Umiddelbart | Legg til tester for auth flows | 1 uke |
| 🟠 Kort sikt | Øk web app dekning til 20% | 4 uker |
| 🟠 Kort sikt | Legg til flere E2E tester | 2 uker |
| 🟡 Medium sikt | Oppnå 50% API dekning | 6 uker |
| 🟢 Lang sikt | Oppnå 80% total dekning | 3 måneder |

---

## 2. TODO/FIXME Kommentarer

### Oversikt

| Kategori | Antall | Kritisk | Høy | Medium | Lav |
|----------|--------|---------|-----|--------|-----|
| TODO | 55 | 3 | 8 | 8 | 36 |
| FIXME | 0 | - | - | - | - |
| @deprecated | 27 | - | - | 10 | 17 |
| Tech Debt Comments | 6 | - | 3 | 1 | 2 |
| **TOTALT** | **88** | **3** | **11** | **19** | **55** |

### 🔴 KRITISKE TODO-er (Produksjonsrisiko)

#### 1. Stripe Database-synkronisering

**Fil:** `apps/api/src/services/stripe.service.ts`

```typescript
// Linje 482
// TODO: Update subscription in database
// RISIKO: Subscription-tilstand ut av sync med Stripe

// Linje 499
// TODO: Cancel subscription in database
// RISIKO: Kansellerte subscriptions ikke reflektert i app

// Linje 581
// TODO: Update payment record in database
// RISIKO: Betalingsrecords ut av sync
```

**Konsekvens:** Betalinger kan gå tapt, brukere kan ha feil tilgang.

#### 2. Video Keyframe Extraction

**Fil:** `apps/api/src/api/v1/video-keyframes/service.ts`

```typescript
// Linje 63
// TODO: In production, trigger async job to extract actual frame from video
// RISIKO: Video frames ekstraheres ikke - feature fungerer ikke

// Linje 196
// TODO: In production, also delete S3 objects
// RISIKO: Storage leak - orphaned S3 objects akkumulerer

// Linje 209
// TODO: In production, generate signed S3 URL
// RISIKO: Sikkerhetsproblem - video access control bypassed
```

### 🟠 HØYPRIORITET TODO-er

| Fil | Linje | TODO | Konsekvens |
|-----|-------|------|------------|
| `stripe.service.ts` | 593 | Implement email notifications | Ingen betalingsvarsler |
| `payments/service.ts` | 214 | Create Stripe invoice | Ingen fakturaer |
| `payments/service.ts` | 545 | Cancel in Stripe | Kanselleringer synces ikke |
| `progress-reports/index.ts` | 127 | Send email to parent | Foreldre varsles ikke |
| `PendingApprovalsPage.tsx` | 26 | Replace with actual API call | Admin-godkjenning virker ikke |
| `AnnualPlanGenerator.tsx` | 352 | API call to save | Planer lagres ikke |

### Teknisk Gjeld Kommentarer

**Type-duplisering (HØYPRIORITET):**

```typescript
// apps/web/src/domain/tests/mappers.ts:50-66
// TECHNICAL DEBT: These types are intentionally duplicated from @iup/shared-types
// CRA webpack cannot transpile raw TypeScript from workspace packages
// EXIT PATHS:
// 1. Migrate from CRA to Vite/Next.js
// 2. Add build step to shared-types emitting .js + .d.ts
// 3. Use tsup/unbuild for pre-compilation
```

**Samme problem i:** `apps/web/src/domain/goals/mappers.ts:33-48`

---

## 3. TypeScript Type-sikkerhet

### Oversikt

| Issue Type | Antall | Filer Berørt |
|-----------|--------|--------------|
| `: any` type annotations | 355 | 156+ filer |
| `as any` type assertions | 89 | 57 filer |
| `@ts-ignore` comments | 11 | 8 filer |
| `@ts-nocheck` file directives | 28 | 28 filer |
| `@ts-expect-error` | 3 | 2 filer |
| **TOTALT** | **486** | **~200+ filer** |

### TSConfig Analyse

| App | Strict Mode | noImplicitAny | Status |
|-----|-------------|---------------|--------|
| Root | ✅ Enabled | ✅ | Utmerket |
| API | ✅ Enabled | ✅ | God |
| Web | ✅ Enabled | ❌ **false** | Kritisk gap |
| Golfer | ❌ **false** | ❌ | Kritisk |
| Shared Types | ✅ Enabled | ✅ | Utmerket |

### 🔴 Kritisk: Web App har `noImplicitAny: false`

```json
// apps/web/tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": false,  // ❌ KRITISK GAP
    "noUnusedLocals": false,
    "noUnusedParameters": false
  }
}
```

### 🔴 Kritisk: Golfer App har `strict: false`

```json
// apps/golfer/tsconfig.json
{
  "compilerOptions": {
    "strict": false  // ❌ INGEN TYPE-SJEKKING
  }
}
```

### Filer med Flest Type-problemer

#### API (Høy risiko - behandler data)

| Fil | `: any` | `as any` | Risiko |
|-----|---------|----------|--------|
| `integrations/golfcourse/client.ts` | 11 | 0 | 🔴 Ekstern API |
| `api/v1/skoleplan/index.ts` | 11 | 0 | 🔴 API Route |
| `integrations/datagolf/client.ts` | 6 | 0 | 🔴 Ekstern API |
| `api/v1/admin/payment-analytics.routes.ts` | 6 | 0 | 🔴 Betalinger |
| `api/v1/emails/index.ts` | 0 | 8 | 🔴 E-post |

#### Web (304 violations totalt)

| Fil | Issues | Problem |
|-----|--------|---------|
| `AKGolfDashboardV4.tsx` | @ts-nocheck | Hele filen disabled |
| `CoachTrainingPlanEditorContainer.tsx` | 14 | Mange any-typer |
| `useAIConversations.ts` | 9 | Hook med any |
| `IntakeFormPage.tsx` | 9 | Brukerinput |

### Filer med `@ts-nocheck` (20 filer)

```
apps/web/src/features/dashboard/AKGolfDashboardV4.tsx
apps/web/src/features/dashboard/DashboardV5.tsx
apps/web/src/features/calendar/Kalender.tsx
apps/web/src/features/coach-messages/CoachMessageCompose.tsx
apps/web/src/features/tests/Testresultater.tsx
... og 15 andre
```

### Anbefalinger

| Prioritet | Tiltak | Estimat |
|-----------|--------|---------|
| 🔴 Uke 1 | Sett `noImplicitAny: true` i web | 2 timer |
| 🔴 Uke 1 | Sett `strict: true` i golfer | 1 dag |
| 🔴 Uke 2 | Fiks payment routes any-typer | 1 uke |
| 🟠 Måned 1 | Fjern @ts-nocheck fra dashboard | 2 uker |
| 🟠 Måned 2 | Type eksterne API-responser | 2 uker |

---

## 4. Hardkodede Verdier & Sikkerhet

### 🔴 KRITISKE SIKKERHETSPROBLEMER

#### 1. Eksponert API-nøkkel i Dokumentasjon

**Filer:**
- `docs/architecture/KOMPLETT_SYSTEMDOKUMENTASJON.md:126`
- `docs/integrations/DATAGOLF_IMPLEMENTATION_STATUS.md:12`

```markdown
DataGolf API Key: 73c5ee864270d96fb23f0eac2265
```

**Tiltak:** Revoke nøkkel UMIDDELBART og regenerer.

#### 2. Committet .env Filer

| Fil | Status | Innhold |
|-----|--------|---------|
| `.env.production` | Committet | Produksjons-secrets |
| `.env.staging` | Committet | Staging-credentials |
| `apps/api/.env` | Committet | Database URL, S3 keys |
| `apps/web/.env` | Committet | API keys |

**Tiltak:** Fjern fra git-historikk med `git-filter-repo` eller BFG.

#### 3. Hardkodede Test-credentials

**Fil:** `apps/api/tests/setup.ts`

```typescript
// Linje 33
DATABASE_URL = 'postgresql://iup_golf:dev_password@localhost:5432/iup_golf_test'
// Linje 46-47
S3_ACCESS_KEY_ID = 'minioadmin'
S3_SECRET_ACCESS_KEY = 'minioadmin'
```

### Environment Variable Status

| Fil | Linjer | Status |
|-----|--------|--------|
| `.env.example` (root) | 189 | ✅ Komplett |
| `apps/api/.env.example` | - | ✅ Komplett |
| `apps/web/.env.example` | 44 | ✅ Tilstrekkelig |

### Anbefalinger

| Prioritet | Tiltak |
|-----------|--------|
| 🔴 NÅ | Revoke DataGolf API key |
| 🔴 NÅ | Fjern .env filer fra git-historikk |
| 🟠 Denne uken | Flytt test credentials til .env.test |
| 🟠 Denne uken | Installer git-secrets pre-commit hook |

---

## 5. Dependencies

### Monorepo Struktur

```
IUP_Master_V1/
├── apps/
│   ├── web/     (88 deps)
│   ├── api/     (69 deps)
│   └── golfer/  (31 deps)
├── packages/
│   ├── shared-types/
│   └── design-system/
├── pnpm-lock.yaml (896 KB)
└── turbo.json
```

### Totalt Antall Dependencies

| App | Production | Development | Totalt |
|-----|------------|-------------|--------|
| Web | 68 | 20 | 88 |
| API | 45 | 24 | 69 |
| Golfer | 19 | 12 | 31 |
| **TOTALT** | **132** | **56** | **188** |

**Estimert med transitive:** ~752 pakker

### 🔴 Kritiske Oppdateringer Nødvendig

| Pakke | Nåværende | Anbefalt | Risiko |
|-------|-----------|----------|--------|
| jest (web) | ^27.5.1 | ^29.7.0 | EOL siden 2021 |
| axios (golfer) | ^1.6.2 | ^1.13.2 | Sikkerhetspatches mangler |
| react-scripts | ^5.0.1 | Vite | Maintenance mode |
| react-native | ^0.73.0 | ^0.76.0+ | Nærmer seg EOL |

### Versjonsinkonsistenser

| Pakke | API | Web | Golfer |
|-------|-----|-----|--------|
| TypeScript | ^5.5.4 | ^5.3.3 | ^5.3.3 |
| @babel/core | ^7.28.5 | - | ^7.23.0 |
| jest | ^29.7.0 | ^27.5.1 | - |

### Sikkerhetssensitive Pakker ✅

| Pakke | Versjon | Status |
|-------|---------|--------|
| jsonwebtoken | ^9.0.2 | ✅ Oppdatert |
| argon2 | ^0.40.3 | ✅ Oppdatert |
| @prisma/client | ^7.2.0 | ✅ Oppdatert |
| stripe | ^20.1.2 | ✅ Oppdatert |
| @aws-sdk/client-s3 | ^3.645.0 | ✅ Oppdatert |

### Anbefalinger

| Prioritet | Tiltak | Kommando |
|-----------|--------|----------|
| 🔴 NÅ | Oppdater jest i web | `pnpm --filter web add -D jest@^29.7.0` |
| 🔴 NÅ | Oppdater axios i golfer | `pnpm --filter golfer add axios@^1.13.2` |
| 🟠 Sprint | Standardiser TypeScript | Alle til ^5.5.4 |
| 🟡 Q2 | Migrer fra CRA til Vite | Planlegg migrasjon |

---

## 6. Debug Statements

### Oversikt

| Type | Antall | Prioritet |
|------|--------|-----------|
| console.log | 200+ | 🟠 Bør fjernes |
| console.error | 150+ | 🟡 Vurder |
| console.warn | 100+ | 🟡 Vurder |
| alert() | 90+ | 🔴 Bør erstattes |
| debugger | 0 | ✅ OK |

### 🔴 Kritiske Debug Statements

#### Lab/Development Komponenter (Bør slettes)

```
apps/web/src/ui/lab/CalendarLab.tsx
├── Linje 185: alert('Valgt økt: ${session.title}...')
├── Linje 190: alert('WeekView Session...')
└── Linje 287: alert('Legg til ny hendelse')

apps/web/src/ui/lab/TemplatesLab.tsx
└── 10+ alert() calls
```

#### Feature Komponenter (Bør ryddes)

| Fil | Linje | Statement |
|-----|-------|-----------|
| `DrillManagementPage.tsx` | 392 | `console.log('Edit drill:', drill)` |
| `DrillManagementPage.tsx` | 412 | `console.log('Add to session:', drill)` |
| `CalendarOversiktPage.tsx` | 71 | `console.log('Event clicked:', event)` |
| `AnnualPlanGenerator.tsx` | 351 | `console.log('Saving annual plan:', plan)` |
| `AnnualPlanGenerator.tsx` | 454 | `console.log('Period clicked:', period)` |

### Alert() Calls som Bør Erstattes med Toast

| Modul | Antall alert() |
|-------|----------------|
| Payments | 20+ |
| Progress Reports | 6 |
| Video Annotations | 4 |
| Annual Plans | 4 |
| Support | 1 |
| Chat | 2 |
| **TOTALT** | **90+** |

### Anbefalinger

| Prioritet | Tiltak |
|-----------|--------|
| 🔴 NÅ | Slett hele `ui/lab/` katalogen |
| 🟠 Sprint | Fjern console.log fra feature-filer |
| 🟠 Sprint | Erstatt alert() med toast notifications |
| 🟡 Q2 | Implementer strukturert logging (Sentry) |

---

## 7. Kode-kompleksitet

### Kritiske Funn

#### 5 Dashboard-versjoner (Duplikat Kode)

```
apps/web/src/features/dashboard/
├── AKGolfDashboard.jsx      (2,596 linjer) ← Hovedversjon?
├── AKGolfDashboardV3.jsx    (1,756 linjer) ← Duplikat
├── AKGolfDashboardV4.tsx    (882 linjer)   ← Variant
├── DashboardV5.tsx          (888 linjer)   ← Variant
└── TierDashboard.jsx        (286 linjer)   ← Omdøpt
```

**Tiltak:** Konsolider til én implementasjon.

### Filer Over 1000 Linjer (Krever Refaktorering)

#### Top 20 Web Komponenter

| Fil | Linjer | Problem |
|-----|--------|---------|
| `AKGolfDashboard.jsx` | 2,596 | Monolittisk |
| `api.ts` | 2,247 | Blander alle API-kall |
| `App.jsx` | 2,189 | Alle routes + contexts |
| `Treningsstatistikk.tsx` | 1,986 | For kompleks |
| `AKGolfAppDesignSystem.jsx` | 1,981 | Design system |
| `tier_golf_brukerprofil_onboarding.jsx` | 1,775 | Onboarding |
| `AKGolfDashboardV3.jsx` | 1,756 | Duplikat |
| `ak-intake-form-premium-v2.jsx` | 1,524 | Form |
| `SamlingDetail.tsx` | 1,238 | Detalj-visning |
| `utviklingsplan_b_nivaa.jsx` | 1,202 | Utviklingsplan |

#### Top 10 API Filer

| Fil | Linjer | Problem |
|-----|--------|---------|
| `training-plan/index.ts` | 2,086 | 14+ endpoints i én fil |
| `achievement-definitions.ts` | 1,466 | Konstanter |
| `datagolf/routes.ts` | 1,294 | Routes |
| `datagolf/service.ts` | 1,229 | Service |
| `badge-evaluator.ts` | 1,157 | Evaluator |
| `videos/index.ts` | 1,050 | Video routes |

### Dupliserte Form-komponenter

```
apps/web/src/components/ui/
├── ak-player-intake-v1.jsx      (1,130 linjer)
├── ak-intake-form-premium-v2.jsx (1,524 linjer)
└── tier_golf_brukerprofil_onboarding.jsx (1,775 linjer)
```

**Tiltak:** Konsolider til ett gjenbrukbart form-system.

### Backup-katalog Problem

```
/backup_20260107_105918/  ← Full kopi av hele codebase
```

**Tiltak:** Slett og bruk git-historikk i stedet.

### Estimert Refaktorering

| Område | Timer | Gevinst |
|--------|-------|---------|
| Dashboard konsolidering | 40-60 | 30% færre bugs |
| api.ts splitting | 20-30 | Bedre vedlikehold |
| App.jsx splitting | 15-25 | Enklere routing |
| training-plan splitting | 30-40 | Testbarhet |
| **TOTALT** | **200-350** | Betydelig forbedring |

---

## 8. Prioritert Handlingsplan

### 🔴 UMIDDELBART (Dag 1-2)

| # | Tiltak | Ansvar | Risiko hvis utsatt |
|---|--------|--------|-------------------|
| 1 | Revoke DataGolf API key | DevOps | Sikkerhetsbrist |
| 2 | Fjern .env fra git-historikk | DevOps | Credentials eksponert |
| 3 | Fiks Stripe DB-sync TODOs | Backend | Betalingsfeil |

### 🟠 DENNE UKEN (Dag 3-5)

| # | Tiltak | Ansvar | Estimat |
|---|--------|--------|---------|
| 4 | Sett `noImplicitAny: true` i web | Frontend | 2 timer |
| 5 | Sett `strict: true` i golfer | Mobile | 1 dag |
| 6 | Oppdater jest til v29 | Frontend | 4 timer |
| 7 | Oppdater axios i golfer | Mobile | 1 time |
| 8 | Slett `/ui/lab/` katalog | Frontend | 30 min |
| 9 | Slett `/backup_20260107_105918/` | DevOps | 5 min |

### 🟡 NESTE SPRINT (Uke 2-3)

| # | Tiltak | Ansvar | Estimat |
|---|--------|--------|---------|
| 10 | Legg til payment API tester | Backend | 2 uker |
| 11 | Fjern console.log fra features | All | 2 dager |
| 12 | Erstatt alert() med toast | Frontend | 3 dager |
| 13 | Konsolider dashboard til 1 versjon | Frontend | 1 uke |
| 14 | Split api.ts etter domene | Frontend | 1 uke |

### 🟢 Q1 2026

| # | Tiltak | Estimat |
|---|--------|---------|
| 15 | Oppnå 20% web testdekning | 4 uker |
| 16 | Oppnå 50% API testdekning | 6 uker |
| 17 | Fjern alle @ts-nocheck | 2 uker |
| 18 | Migrer fra CRA til Vite | 3 uker |
| 19 | Implementer strukturert logging | 1 uke |

### 🔵 Q2 2026

| # | Tiltak | Estimat |
|---|--------|---------|
| 20 | Oppnå 80% total testdekning | 3 måneder |
| 21 | Full TypeScript strict compliance | 1 måned |
| 22 | Alle filer under 500 linjer | 2 måneder |
| 23 | SOC 2 forberedelse | Løpende |

---

## Vedlegg

### A. Test Kommandoer

```bash
# API
cd apps/api
npm test              # Kjør alle tester
npm run test:coverage # Generer coverage rapport
npm run test:clean    # Reset + reseed + test

# Web
cd apps/web
npm test              # Kjør tester (watch mode)
npm run test:e2e      # Kjør Playwright tester
npm run test:e2e:ui   # Playwright UI
```

### B. Dependency Oppdateringer

```bash
# Kritiske oppdateringer
pnpm --filter web add -D jest@^29.7.0 @types/jest@^29.5.0
pnpm --filter golfer add axios@^1.13.2
pnpm --filter golfer add react-native@^0.76.0

# TypeScript standardisering
pnpm add -D typescript@^5.5.4 -w
```

### C. Git Cleanup

```bash
# Fjern .env filer fra historikk
git filter-repo --path .env.production --invert-paths
git filter-repo --path .env.staging --invert-paths
git filter-repo --path apps/api/.env --invert-paths
git filter-repo --path apps/web/.env --invert-paths

# Installer git-secrets
brew install git-secrets
git secrets --install
git secrets --register-aws
```

### D. TSConfig Fikser

```json
// apps/web/tsconfig.json
{
  "compilerOptions": {
    "noImplicitAny": true,  // Endre fra false
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}

// apps/golfer/tsconfig.json
{
  "compilerOptions": {
    "strict": true  // Endre fra false
  }
}
```

---

*Rapport generert: 2026-01-09*
*Neste review: Ukentlig*
