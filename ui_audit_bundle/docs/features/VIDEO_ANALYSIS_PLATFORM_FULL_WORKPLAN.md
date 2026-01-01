# Video Analysis Platform – Fullstendig arbeidsplan (produksjonsklar)

Basert på vedlagt implementeringsplan, men strammet til et “principal/staff data + platform engineering”-nivå: korrekthet, sikkerhet, multi-tenant isolasjon, kostkontroll, driftbarhet og reproduserbarhet. fileciteturn1file0

**Scope:** Native videoanalyse (upload, avspilling, annotasjoner, voice-over, sammenligning, deling), med grunnmur som tåler skalering og revisjon.

---

## 0) Non‑negotiables (invariants)

### 0.1 Sikkerhet og personvern (minors-first)
1. **Least privilege** på alt (API, S3, DB, jobber).
2. **Kryptering**: TLS i transit; server-side encryption i S3 (KMS hvis tilgjengelig).
3. **Kortlevde playback-URLer** (signed URLs) + revokering ved tilgangsendring.
4. **RBAC + samtykke** styrer deling, global visning, eksport/nedlasting.
5. **Audit** på: deling, nedlasting/eksport, sensitive reads (video/annotasjoner/kommentarer).
6. **Retention og sletting**: policy per dataklasse; hard purge gjennom jobb; verifiserbar.

### 0.2 Multi-tenant isolasjon
1. Alle records har `tenant_id`; alle queries er tenant-scopet.
2. Objektlagring (S3) er navnerom-splittet per tenant (prefix eller bucket-per-tenant) og policyt.
3. Signed URLs må inneholde og validere tenant-scope (via server-side kontroll).

### 0.3 Driftbarhet og reproduserbarhet
1. **State machine** for video-prosessering: deterministic status transitions.
2. **Idempotent ingest**: confirm/endepunkt tåler retry uten duplikater.
3. **Observability**: SLO/SLI definert; metrics + structured logs; alarms.
4. **Kostkontroll**: quotas, max duration, lifecycle/tiers, transcoding policy.

---

## 1) Produktkontrakter (hva systemet må levere)

### 1.1 MVP (må ha)
- Upload (resumable/multipart) og trygg lagring
- Playback med slow-mo + frame-by-frame (desktop først, mobil kompatibel)
- Tegne/annotere (line/circle/arrow/angle + text)
- Voice-over (opptak, synk, lagring)
- Deling coach↔player (med RBAC + audit)
- Responsive UI

### 1.2 P1 (bør ha)
- Side-by-side comparison med synkpunkter
- Annotasjons-tidslinje (markers)
- Video library med filtre, kø for review
- WebSocket events for status og kommentarer

### 1.3 P2 (nice)
- Ghost overlay
- Progress view over tid (swing timeline)
- Export med “burn-in” annotasjoner og audio
- Batch review flows

---

## 2) Referansearkitektur (robust, men enkel)

### 2.1 Komponenter
- **API**: genererer signed upload URLs, validerer metadata, styrer RBAC/consent, signerer playback.
- **Object Storage (S3)**: råfiler, thumbnails, transcodede renditions (HLS/MP4), audio tracks.
- **Processing workers**: ffmpeg/mediaconvert pipeline (thumbnail, metadata, transcode, waveform, optional burn-in).
- **DB**: video/annotation/comment/comparison + policy/audit.
- **CDN (valgfritt)**: distribusjon av HLS/MP4, men fortsatt gated via signed URLs/tokens.
- **WebSocket**: status og samarbeidsnotifikasjoner.

### 2.2 State machine (video status)
**Tillatte statusverdier (enum):**
- `created` → `uploading` → `uploaded` → `processing` → `ready`
- feil: `failed` (med error_code), `quarantined` (virus/validation), `deleted`

**Regler:**
- kun worker kan flytte `processing→ready|failed`
- `deleted` er terminal
- alle transitions logges (audit/ops log)

---

## 3) Datamodell (DB) – “Gold schema” for media

Dette bygger videre på skjemaet i vedlegget, men gjør det produksjonsklart og driftbart. fileciteturn1file0

### 3.1 Video (utvidelser)
**Legg til felter:**
- `status` (enum), `errorCode`, `errorMessage` (kort), `processingVersion`
- `checksumSha256` (valgfritt, men nyttig for dedup/integritet)
- `fps`, `rotation`, `bitrateKbps` (metadata)
- `renditions` (jsonb) eller egen tabell `video_renditions`
- `visibility` (private|coach_only|tenant|link) + `shareExpiresAt` (for link)
- `createdAt`, `updatedAt`, `deletedAt`
- `retentionClass` (e.g. standard|sensitive)
- `storageRegion` (hvis relevant)

**Indekser:**
- `(tenant_id, player_id, created_at desc)`
- `(tenant_id, status)`
- `(tenant_id, uploaded_by_id, created_at desc)`

### 3.2 VideoAnnotation (kontrakt for koordinater)
**Kritisk:** definér koordinatsystem og versjonering.
- `schemaVersion` (int)
- `coordinateSpace` (video_px|normalized_0_1)
- `videoTime` (ms eller decimal sek)
- `frameNumber` (optional, men stabilt ved fps)  
- `drawingData` må ha:
  - type + points + style + tool params
  - **reference** til video metadata (`width/height`) ved opprettelse for reproduserbar rendering

### 3.3 Voice-over (audio track)
Enten som del av annotation eller egen tabell:
- `video_audio_track(id, video_id, created_by_id, s3_key, duration_ms, waveform_key, created_at)`
Fordel: flere audio-takes og bedre kontroll.

### 3.4 Comments og threads
- `video_comment(id, video_id, created_by_id, body, created_at)`
- vurder `parent_id` for threads

### 3.5 Audit
- `audit_event(tenant_id, actor_id, action, resource_type, resource_id, subject_id?, metadata_json, ts, request_id)`
Action-eksempler:
- `VIDEO_SHARED`, `VIDEO_DOWNLOADED`, `ANNOTATION_ADDED`, `COMMENT_ADDED`, `PLAYBACK_URL_ISSUED`

---

## 4) Storage, upload og playback (korrekt og kost-effektivt)

### 4.1 Upload (resumable)
- Bruk S3 multipart upload (Uppy støtter dette). fileciteturn1file0
- API utsteder:
  - `uploadId`, `key`, `parts`/signering per part, `expiresIn`
- **Idempotency key** per opplasting (`clientUploadId`) for å unngå duplikater.

### 4.2 Upload policy
- Max varighet: 5 min (som vedlegget).
- Max filstørrelse: sett eksplisitt (f.eks. 500MB) + server-side enforcement.
- MIME allowlist: `video/mp4`, `video/quicktime` etc.
- Content-length + content-type validering (fail fast).

### 4.3 Virus/malware scanning (anbefalt baseline)
- Når fil er `uploaded`: send til scan (lambda/worker).
- Ved funn: status→`quarantined`, blokkér playback.

### 4.4 Transcoding + thumbnails
- Mål: rask start + lav kost.
- Minimum renditions:
  - MP4 “proxy” (lav) for rask preview
  - HLS (adaptive) for streaming hvis behov
- Thumbnails:
  - 1 “poster”
  - optional: sprite sheet for timeline scrubbing

### 4.5 Playback gating
- Ingen public S3-URL.
- API utsteder playback token/URL etter RBAC+consent check.
- TTL kort (f.eks. 60–300s) + cache kontroll.

### 4.6 Lifecycle / retention
- S3 lifecycle:
  - flytt eldre objekter til billigere tier
  - purge etter retention policy (for deleted/expired shares)
- Per-tenant quota: GB + antall videoer + månedlig opplastingsvolum.

---

## 5) API-kontrakter (komplette, idempotente, tenant-safe)

Dette utvider tabellen fra vedlegget til en driftbar kontrakt. fileciteturn1file0

### 5.1 Media upload
- `POST /api/v1/media/upload/init`
  - input: `clientUploadId`, metadata (title, category, clubType, viewAngle, playerId)
  - output: `videoId`, `key`, `uploadId`, signed part URLs policy
- `POST /api/v1/media/upload/complete`
  - input: `videoId`, `uploadId`, `parts` (etag list), checksum optional
  - effect: status→`uploaded`, enqueue processing job
- `POST /api/v1/media/upload/abort`
  - abort multipart + status→`failed|deleted`

### 5.2 Video CRUD
- `POST /api/v1/videos` (kan være del av init)
- `GET /api/v1/videos?filters...`
- `GET /api/v1/videos/:id`
- `PATCH /api/v1/videos/:id`
- `DELETE /api/v1/videos/:id` (soft delete + purge workflow)

### 5.3 Playback
- `GET /api/v1/videos/:id/playback`
  - return: signed URL(s) for rendition + poster + subtitles/audio (hvis)
  - inkluder: `expiresAt`, `policyVersion`

### 5.4 Annotations
- `POST /api/v1/videos/:id/annotations` (optimistic concurrency med `ifMatch` eller `version`)
- `GET /api/v1/videos/:id/annotations?since=...`
- `PATCH /api/v1/annotations/:id`
- `DELETE /api/v1/annotations/:id`

### 5.5 Voice-over
- `POST /api/v1/videos/:id/audio/init` + `complete` (samme multipart mønster)

### 5.6 Comparisons
- `POST /api/v1/videos/comparisons`
- `GET /api/v1/videos/comparisons`
- `GET /api/v1/videos/comparisons/:id`

### 5.7 Sharing
- `POST /api/v1/videos/:id/share`
  - body: `{visibility, recipients?, expiresAt?}`
  - effect: audit event + websocket notify
- `POST /api/v1/videos/:id/unshare`
- `GET /api/v1/shares/:token` (kun hvis link-sharing)

---

## 6) Frontend-implementering (det som faktisk fungerer i praksis)

### 6.1 Player
- HTML5 video element + custom controls.
- Frame-by-frame: implementér via `currentTime += 1/fps`.
- Keyboard shortcuts (space, J/K/L).
- Loop segment: A/B markers.

### 6.2 Canvas/annotations
- Canvas overlay synkronisert med video time.
- Data binding:
  - render annotations for `t` i nærmeste “frame bucket”
  - støtte undo/redo per session
- Serialisering: stable JSON med `schemaVersion`.

### 6.3 Upload UX (robust)
- resumable upload + pause/resume
- progress + retry
- “processing” state med live updates (WebSocket)

### 6.4 Side-by-side
- En “sync controller” som:
  - binder begge videos relative offset
  - håndterer ulik fps/resolution ved normalisering
- “sync points” lagres i `VideoComparison`.

---

## 7) Jobber og prosessering (pålitelig pipeline)

### 7.1 Jobtyper
- `video.process` (metadata, transcode, thumbnail)
- `video.waveform` (for audio)
- `video.burnin.export` (P2)
- `retention.purge` (daglig)
- `quota.enforce` (daglig/ukentlig)

### 7.2 Retry og feilmodell
- Exponential backoff + maks retries.
- `errorCode` standardiseres (f.eks. `FFMPEG_FAIL`, `S3_NOT_FOUND`, `SCAN_FAIL`).
- `failed` skal kunne reprocesses (admin action) med ny `processingVersion`.

---

## 8) Observability, SLOs og kostkontroll

### 8.1 SLO/SLI (operasjonelt)
- Upload success rate (init→complete): **≥ 99%**
- Median processing latency (uploaded→ready): **< 2 min** (proxy + poster)
- Playback start time: **p95 < 2s**
- Annotation write latency: **p95 < 500ms**
- Error budget og alarms på regress.

### 8.2 Metrics (minimum)
- `uploads_initiated`, `uploads_completed`, `uploads_aborted`, `uploads_rejected`
- `processing_duration_ms` (hist)
- `playback_url_issued` (count)
- `annotation_create_latency_ms`
- `storage_bytes_by_tenant`, `storage_objects_by_tenant`
- `egress_bytes_by_tenant` (hvis tilgjengelig)

### 8.3 Kost-policy
- Quotas per tenant (hard/soft).
- Default transcode: 720p proxy + optional HLS (feature flag).
- Lifecycle to cold storage etter X dager (konfig).

---

## 9) Risiko og mitigering (operasjonell liste)

| Risiko | Tiltak |
|---|---|
| Upload feiler på mobil | Multipart + resume + robust retry; tydelig UX |
| Kost eksploderer (storage/egress) | Max lengde/størrelse, quotas, lifecycle, begrens nedlasting |
| Feil i annotasjonssynk | Definér fps/coordinateSpace; versionér schema; golden fixtures |
| Multi-tenant leakage | Tenant middleware + DB constraints + security tests + audit on anomalies |
| Minors/GDPR brudd | Consent gating, audit, retention, “right to delete” workflow |
| FFmpeg kompleksitet | State machine + standard error codes + reprocess API |

---

## 10) Testplan (det som faktisk hindrer feil)

### 10.1 Unit tests
- upload init/complete idempotency
- policy checks (RBAC/consent) for playback/share
- annotation schema validation (versioned)
- state machine transitions (illegal transitions fail)

### 10.2 Integrasjonstester
- multipart upload happy path (mock S3) + processing job enqueue
- playback URL issuance (tenant + role gate)
- cross-tenant access attempt (must fail + audit event)
- retention purge removes DB + objects (mock)

### 10.3 “Golden fixtures”
- Sample video metadata + expected renditions manifest
- Sample annotation JSON + expected render positions
- Comparison sync scenario with fixed fps

---

## 11) Milepæler og PR-sekvens (small PRs, høy sikkerhet)

**M1 (Uke 1–2): Foundation**
- PR1: DB schema hardening (status enum, audit table, indexes, soft delete)
- PR2: Upload init/complete (multipart) + idempotency + tenant guard

**M2 (Uke 2–3): Processing**
- PR3: processing worker + thumbnail + metadata + proxy mp4
- PR4: playback endpoint + signed URLs + RBAC gating

**M3 (Uke 4–6): Player + Library**
- PR5: VideoPlayer + controls + timeline markers
- PR6: VideoLibrary + filters + upload UX

**M4 (Uke 7–10): Annotations + Voice**
- PR7: AnnotationCanvas + tool palette + schema versioning
- PR8: Voice-over upload + waveform job + playback sync
- PR9: realtime updates + conflict strategy (optimistic concurrency)

**M5 (Uke 11–13): Comparison**
- PR10: side-by-side + sync points + comparison model/API

**M6 (Uke 14–16): Sharing + Coach tools**
- PR11: share/unshare + link tokens + audit + notifications
- PR12: coach dashboard + review queue + reference library

**M7 (kontinuerlig): Governance/Retention/Cost**
- PR13: retention jobs + lifecycle config hooks
- PR14: quotas + enforcement + dashboards/alarms

---

## 12) Claude Code prompt-pack (token-sparende, men presist)

### 12.1 Repo context (sett én gang)
```
Multi-tenant video analysis platform for junior athletes. Hard invariants:
- tenant_id scoping everywhere (DB queries, S3 keys, signed URLs)
- RBAC+consent gating for playback/share/download; audit all share/export/download
- state machine for video: created->uploading->uploaded->processing->ready; failed/quarantined/deleted
- upload is multipart/resumable + idempotent (clientUploadId)
- no public S3 URLs; short-lived signed playback URLs
- retention + purge jobs; quotas per tenant; structured logs without PII
Add migrations + tests in every PR. Small PRs only.
```

### 12.2 PR task template
```
TASK: <name>
GOAL: <1 line>
TOUCH: <modules/files>
MUST: tenant scope; RBAC/consent; audit; tests
ACCEPT: <3-6 verifiable bullets>
OUTPUT: migration+code+tests+PR notes
```

### 12.3 Konkrete prompts (copy/paste)

**PR2 – Multipart upload + idempotency**
```
TASK: Multipart upload init/complete with idempotency
GOAL: Reliable resumable uploads; no dupes; tenant-safe
TOUCH: api/media, storage service, db migrations
MUST: tenant scope; audit on completion; tests
ACCEPT:
- init returns videoId+key+uploadId; complete is idempotent via clientUploadId
- invalid mime/size rejected
- status transitions enforced
- integration test for retry complete
OUTPUT: migration+code+tests
```

**PR4 – Playback signed URL**
```
TASK: Playback endpoint with signed URLs
GOAL: Issue short-lived URLs after RBAC/consent check
TOUCH: api/videos/playback, auth middleware, audit
MUST: tenant scope; audit; tests
ACCEPT:
- no public URLs; TTL <= 5 min
- blocks unauthorized; logs PLAYBACK_URL_ISSUED audit
- integration test: cross-tenant denied
OUTPUT: code+tests
```

**PR7 – Annotation schema v1**
```
TASK: Versioned annotation schema + canvas sync
GOAL: Deterministic annotation rendering across devices
TOUCH: domain/annotations, api/annotations, web/AnnotationCanvas
MUST: schemaVersion+coordinateSpace; tests
ACCEPT:
- schema validation server-side
- coordinateSpace normalized_0_1 supported
- snapshot tests for serialization
OUTPUT: code+tests
```

---

## 13) Endelig leveranseliste (alt som skal finnes i repo)
- DB migrations: videos/annotations/comments/comparisons + audit + soft delete + indexes
- Upload: init/complete/abort + multipart storage service
- Worker pipeline: metadata + thumbnails + proxy + status machine
- Playback endpoint: signed URLs + RBAC/consent + audit
- Web: VideoPlayer + upload UX + annotation tools + voice-over + library + coach dashboard
- Jobs: retention purge + quota enforce
- Observability: metrics/logging + alarms
- Golden fixtures + integration tests
- Runbooks: backfill/reprocess, retention, incident response

---
