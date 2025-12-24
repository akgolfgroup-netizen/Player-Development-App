# Fullstendig arbeidsplan for IUP Golf Data Platform

Dette er en komplett, end-to-end plan som kan kjøres som et gjennomføringsdokument i repo. Den er skrevet for å maksimere kvalitet (korrekthet, reproduserbarhet, governance) og minimere fremtidig teknisk gjeld.

---

## 0) Mål, leveranser og “non-negotiables”

### 0.1 Primærmål
Bygg en dataplattform som tåler revisjon: tall skal være **korrekte**, **forklarlige**, **reproduserbare**, og **sikre** i en multi-tenant setting med mindreårige.

### 0.2 Non-negotiables (må håndheves i kode + DB + tester)
1. **SI-only i lagring** (DB lagrer kun SI; konvertering i edge/UI).
2. **Schema-kontrakt** (ingest valideres; fail-fast; ingen stille korrigering).
3. **Protocol gating** (benchmark/rapport bruker kun protokoll-komplette datapunkter som default).
4. **Versjonering av all beregningslogikk** (RequirementSet, metrics, benchmark-policy).
5. **Multi-tenant isolasjon** (tenant-scope på alle reads/writes; testet).
6. **Minors/GDPR** (RBAC + consent + audit + retention er plattform, ikke feature).

### 0.3 Definisjon av “Done”
- Alle beregninger og dashboards kan gjenskapes med samme input + versjoner.
- All sensitive tilgang logges (audit).
- Ingen cross-tenant dataeksponering (verifisert med integrasjonstester).
- Data quality er målbar: ingest-status, protokolldekning, peer-group stabilitet.

---

## 1) Programstruktur (arbeidsstrømmer)

### WS1: Data kontrakter og modell (Gold schema)
- Typed core fields + `raw_payload` som “escape hatch”.
- DB constraints og indekser.
- Migrasjonsstrategi: additive → dual-write → backfill → read-switch → enforce.

### WS2: Ingest & normalisering
- Schema validation per endpoint.
- Enhetskonvertering til SI.
- Range checks + idempotency/dedup.
- `ingest_status`: `ok | flagged | rejected`.

### WS3: Protokoll & kontekst
- `ProtocolSpec` per testtype.
- `protocol_complete` og `protocol_hash`.
- Minimumskrav for sammenlignbarhet.

### WS4: Requirement-set versjonering
- Effective dating på terskler.
- `ScoringRun` binder output til `requirement_set_id` + `metrics_version`.

### WS5: Benchmarking (stabilitet + confidence)
- Peer-group policy (tenant default).
- N-minimum, confidence, method.
- Output-kontrakt som alltid inkluderer trust-felter.

### WS6: Metrics layer (single source of truth)
- Alle KPI/formler som rene funksjoner i `domain/metrics`.
- `metricsVersion` pinning i scoring/rapporter.

### WS7: Governance (minors): RBAC, consent, audit, retention
- Roller, scopes, enforcement middleware.
- Audit events på sensitive reads + exports.
- Retention-jobb med purge-logg.

### WS8: Observability & Data Quality
- Structured logs (uten PII).
- Data quality dashboards: protokolldekning, reject-rate, peerCount distribusjoner.
- Alarmgrenser (operasjonelle, ikke “nice-to-have”).

### WS9: Reporting & Monetizable surfaces (etter trust-fundamentet)
- Foreldrerapport + Academy dashboard.
- Alltid: datadekning + confidence + versjoner.

---

## 2) Repo-standarder (for å holde systemet “boring and correct”)

### 2.1 Mappestruktur (minimum)
```
/domain
  /metrics
  /tests
  /requirements
  /benchmark
  /governance
/infra
  /db
  /api
  /jobs
  /obs
```

### 2.2 Kodestandarder
- Ingen formler i API/UI.
- All IO valideres på grensen (API handler).
- Feature flags for adferdsendringer (read-switch, benchmark-policy).

### 2.3 PR-regler
- 1 PR = 1 invariant eller 1 sammenhengende leveranse.
- Hver PR må ha: migration notes + test plan + rollout plan.

---

## 3) Milepæler og PR-sekvens (implementeringsplan)

Nedenfor er den konkrete gjennomføringsrekkefølgen. Hver “M” består av en eller flere PR-er.

### M1: Foundations (schema, ingest-status, tenant-guardrails)
**PR1.1 – DB: foundation fields**
- Legg til på relevante tabeller:
  - `schema_version INT`
  - `raw_payload JSONB`
  - `ingest_status ENUM(ok, flagged, rejected)`
  - `ingest_errors TEXT[]`
  - `tenant_id NOT NULL` (der det mangler)
- Indekser: `(tenant_id, player_id, measured_at)`.

**PR1.2 – API: hard tenant scoping**
- Middleware som injiserer og håndhever `tenant_id`.
- “Fail closed”: uten tenant → 401/403.

**Akseptkriterier**
- Alle writes krever tenant_id.
- Integrasjonstest: cross-tenant read feiler.

---

### M2: SI-units enforcement (korrekthet i tall)
**PR2.1 – Unit module**
- `domain/tests/units`: konverteringsbibliotek (mph→m/s, yd→m, km/h→m/s).
- “Unknown unit” ⇒ reject.

**PR2.2 – Ingest: SI normalization**
- Ved ingest:
  - parse → validate → convert → persist SI
  - sett `ingest_status` og `ingest_errors` deterministisk

**Akseptkriterier**
- DB lagrer kun SI.
- Ukjent unit → `rejected`.
- Unit tests + 1 integrasjonstest for ingest.

---

### M3: Protokoll (sammenlignbarhet)
**PR3.1 – ProtocolSpec**
- Definer per testtype:
  - required fields: `environment`, `device`, `ball_type`, `location_id`
  - putting/chipping: `green_speed` eller `green_speed_unknown`
- `protocol_complete` beregnes ved ingest.
- `protocol_hash` = hash(normalisert protokoll + spec version).

**PR3.2 – Benchmark gating**
- Default: inkluder kun `protocol_complete=true AND ingest_status=ok`.

**Akseptkriterier**
- Protokoll mangler ⇒ `flagged` (eller `rejected` hvis kritisk).
- Benchmark-respons inkluderer `protocolApplied=true/false`.

---

### M4: Requirement-set versjonering (historikk tåler endringer)
**PR4.1 – DB: requirement_set + requirement_item**
- `effective_from`, `effective_to`, `version`, `notes`.
- Terskler lagres i SI.

**PR4.2 – ScoringRun**
- `scoring_run` binder:
  - player + tenant + time-window
  - `requirement_set_id`
  - `metrics_version`
  - `computed_at`

**Akseptkriterier**
- Nye terskler påvirker ikke historiske runs.
- Recompute med samme set+metrics gir identisk output.

---

### M5: Metrics layer (single source of truth)
**PR5.1 – domain/metrics**
- Implementer KPI-er og formler som rene funksjoner.
- Innfør `metricsVersion` konstant.

**PR5.2 – Bytt scoring/benchmark til metrics layer**
- Ingen dupliserte formler i API.

**Akseptkriterier**
- Alle KPI/formler finnes kun i `domain/metrics`.
- Snapshot-test for determinisme.

---

### M6: Benchmarking “trust fields” og stabilitet
**PR6.1 – Peer selection policy**
- Default: tenant peer group.
- Global peer group krever consent scope.

**PR6.2 – Confidence**
- Returner alltid:
  - `peerCount`, `confidence`, `method`, `policyVersion`
- Min-N policy:
  - N ≥ 30: high
  - 15–29: med
  - <15: low og `method=none`

**Akseptkriterier**
- Benchmark uten nok data gir “insufficient data”, ikke misvisende percentiler.
- Alle responser inneholder trust-felter.

---

### M7: Governance for minors (RBAC + consent + audit + retention)
**PR7.1 – RBAC**
- Roller: player, guardian, coach, academy_admin, tenant_admin, super_admin.
- `guardian_link` relasjon.

**PR7.2 – Consent**
- `consent_record(subject_id, guardian_id, scope, status, ts, policy_version)`
- Scopes:
  - `analytics_basic`
  - `benchmark_tenant`
  - `benchmark_global`
  - `reports_export`
  - `sensitive_health` (om relevant)

**PR7.3 – Audit**
- `audit_event(actor_id, subject_id, tenant_id, action, resource, fields, ts, request_id)`
- Audit trigges ved:
  - read av sensitive data
  - exports/rapporter
  - consent-endringer
  - cross-tenant attempts

**PR7.4 – Retention job**
- Daily purge: soft delete → grace → hard delete.
- Purge-logg (counts + policy version).

**Akseptkriterier**
- Uten consent: global benchmark og exports blokkeres.
- Sensitive reads genererer audit event.
- Retention job kan kjøres idempotent.

---

### M8: Observability og Data Quality (operasjonell kontroll)
**PR8.1 – Structured logging**
- Ingen PII i logglinjer.
- `request_id`, `tenant_id`, `actor_id` (pseudonymisert) i context.

**PR8.2 – Data quality metrics**
- Målinger:
  - ingest ok/flagged/rejected rate
  - protocol_complete rate per testtype
  - peerCount distribusjon
  - benchmark confidence rate
- Dashboards og alarmer (thresholds).

**Akseptkriterier**
- Du kan svare på: “hva er datakvaliteten i produksjon?” med tall.

---

### M9: Rapporter og kommersielle flater (først etter M1–M8)
**PR9.1 – Foreldrerapport (MVP)**
- Innhold:
  - progresjon siste vindu
  - styrker/svakheter per kategori
  - benchmark med confidence
  - datadekning (hva inngår / mangler)
  - versjoner: requirementSet, metrics, benchmark policy

**PR9.2 – Academy dashboard (MVP)**
- Cohort view:
  - compliance (tester gjennomført)
  - training adherence
  - drop-off risk

**Akseptkriterier**
- Ingen rapport viser tall uten å vise datadekning + confidence.

---

## 4) Migrering av eksisterende data (sikker og kontrollerbar)

### 4.1 Dual-write og backfill
- Dual-write: ved nye ingests skriv typed fields + raw_payload.
- Backfill-job:
  - les raw_payload
  - parse → convert SI → populate typed
  - sett `backfilled_at`
- Backfill må være:
  - idempotent
  - resumable
  - rate-limited

### 4.2 Read-switch
- Feature flag: `USE_TYPED_FOR_BENCHMARK=true`.
- Før switch:
  - sammenlign output typed vs legacy i staging (diff report).
- Etter switch:
  - monitor reject-rate og confidence-rate.

---

## 5) Sikkerhets- og personvernkrav (konkret sjekkliste)

### 5.1 Data-minimering
- Ikke samle mer enn nødvendig for funksjon.
- Sensitive felter isoleres (egen tabell / egen tilgang).

### 5.2 Tilgang
- RBAC enforcement på alle endpoints.
- “Least privilege” default.

### 5.3 Logging
- PII skal ikke i logger.
- Audit er strukturelt, ikke tekstlig.

### 5.4 Retention
- Policy per dataklasse:
  - sensitive kortere
  - generelle treningsdata lengre (etter forretningsbehov)
- Purge-job dokumentert og testet.

---

## 6) Testplan (minimum som faktisk hindrer produksjonsfeil)

### 6.1 Unit tests
- Unit conversion (inkl. boundary cases).
- Protocol completeness per testtype.
- Metrics determinisme (snapshot).
- Confidence policy.

### 6.2 Integrasjonstester
- Ingest end-to-end:
  - ok payload → ok
  - ukjent unit → rejected
  - manglende protokoll → flagged
- Multi-tenant:
  - cross-tenant read/write feiler.
- Governance:
  - consent gating for global benchmark
  - audit på sensitive reads
- Retention job:
  - purger riktig og idempotent.

### 6.3 “Golden dataset” fixture
- Et lite dataset med kjente forventede outputs for:
  - scoring
  - benchmarking
  - rapport

---

## 7) Produksjonssetting og drift (runbooks)

### 7.1 Runbooks (må ligge i repo)
- Backfill-runbook (start/stop/rollback).
- Retention-runbook (policy change, verifikasjon).
- Incident-runbook:
  - data leak suspicion
  - audit review
  - benchmark anomaly

### 7.2 Rollout-strategi
- Feature flags for:
  - typed read-switch
  - benchmark policy
  - global benchmark
- Canary tenant først (intern).

### 7.3 Operasjonelle alarmer
- Rejected ingest > terskel
- Protocol_complete rate faller
- Cross-tenant attempt > 0
- Confidence low-andel øker uventet

---

## 8) Claude Code prompt-pack (kompakt, men presist)

### 8.1 One-time repo context
```
Multi-tenant junior sports app. Hard invariants:
SI-only in DB; ingest validates schema+units; protocol_complete gates benchmark; benchmark returns peerCount+confidence+policyVersion; version RequirementSet+metrics+benchmark policy; enforce tenant_id scoping everywhere; minors: RBAC+consent+audit+retention; add tests for all.
No formulas outside domain/metrics. Small PRs with migrations+tests.
```

### 8.2 PR task template
```
TASK: <name>
GOAL: <1 line>
TOUCH: <modules>
MUST: tenant scope; SI storage; tests; versioning if numbers change
ACCEPT: <bullets>
OUTPUT: migration+code+tests+PR notes
```

### 8.3 Konkrete PR prompts (kopier direkte)
**PR2 (SI enforcement)**
```
TASK: Enforce SI units on ingest
GOAL: DB stores SI only; unknown units rejected
TOUCH: infra/api ingest, domain/tests/units, infra/db/migrations
MUST: tenant scope; structured errors; tests
ACCEPT:
- converts mph->m/s, km/h->m/s, yards->m
- unknown unit => ingest_status=rejected + ingest_errors
- stored values SI only
- unit + integration tests
OUTPUT: migration+code+tests+PR notes
```

**PR3 (Protocol gating)**
```
TASK: ProtocolSpec + protocol_complete
GOAL: protocol_complete computed; benchmark filters by protocol_complete+ok
TOUCH: domain/tests/protocol, infra/api ingest, domain/benchmark
MUST: tenant scope; tests
ACCEPT:
- required fields per test type enforced
- protocol_hash stored
- benchmark response includes protocolApplied + dataCoverage
OUTPUT: code+tests+PR notes
```

**PR6 (Benchmark confidence)**
```
TASK: Benchmark confidence policy
GOAL: every response has peerCount+confidence+method+policyVersion
TOUCH: domain/benchmark, infra/api/benchmark
MUST: protocol_complete+ok filter; tenant scope; tests
ACCEPT:
- N>=30 high; 15-29 med; <15 low with method=none
- deterministic output snapshot tests
OUTPUT: code+tests+PR notes
```

---

## 9) Kvalitetsporter (Go/No-Go)
Du går ikke videre til neste milepæl før:

- **Etter M2:** SI-only er verifisert og testet.
- **Etter M3:** protokoll gating er aktiv i benchmark.
- **Etter M4–M5:** scoring/benchmark er reproduserbar med pinned versions.
- **Etter M7:** consent/audit/retention er i drift.
- **Før M9:** data quality dashboards viser stabil drift.

---

## 10) Endelig leveranseliste (alt som skal eksistere i repo)
- Migrasjoner for: foundation fields, requirement sets, scoring_run, consent, audit.
- `domain/metrics` med `metricsVersion`.
- `domain/tests/units` + `domain/tests/protocol`.
- `domain/benchmark` med confidence + policyVersion.
- RBAC middleware + consent enforcement.
- Audit logger (structured) + retention job.
- Golden dataset fixtures + deterministiske snapshot-tester.
- Runbooks (backfill, retention, incident).
- Observability dashboards/alarmer definert.

---
