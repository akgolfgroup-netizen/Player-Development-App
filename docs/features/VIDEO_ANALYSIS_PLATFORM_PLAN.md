# Video Analysis Platform - Implementeringsplan

> Bygge native video-analyse funksjonalitet lik OnForm/CoachNow

**Dato:** 22. desember 2025
**Estimert tidsramme:** 16 uker (3-4 måneder)
**Prioritet:** Høy - Nøkkeldifferensiator for premium-tier

---

## Innholdsfortegnelse

1. [Sammendrag](#sammendrag)
2. [Konfigurasjonsvalg](#konfigurasjonsvalg)
3. [Faser og Milepæler](#faser-og-milepæler)
4. [Teknisk Arkitektur](#teknisk-arkitektur)
5. [Database Schema](#database-schema)
6. [API Endepunkter](#api-endepunkter)
7. [Frontend Komponenter](#frontend-komponenter)
8. [Prioritering](#prioritering)
9. [Avhengigheter](#avhengigheter)
10. [Risiko og Mitigering](#risiko-og-mitigering)
11. [Suksesskriterier](#suksesskriterier)

---

## Sammendrag

Bygge en komplett video-analyseplattform som gjør det mulig for trenere å gi visuell tilbakemelding på spillersvinger med:

- Tegne-/annoteringverktøy
- Slow-motion avspilling
- Frame-by-frame navigering
- Side-by-side sammenligning
- Voice-over opptak
- Coach-spiller deling

### Eksisterende Infrastruktur (Allerede på Plass)

| Komponent | Status | Detaljer |
|-----------|--------|----------|
| S3 Konfigurasjon | Klar | AWS SDK v3 installert, env vars definert |
| Media Model | Eksisterer | Prisma schema med grunnleggende felter |
| WebSocket | Fungerer | Real-time notifikasjoner |
| Autentisering | Komplett | JWT + rolle-basert tilgang |
| Video URL-felter | Eksisterer | I Exercise, TestResult, TrainingSession |

### Hva Mangler (Må Bygges)

| Komponent | Prioritet |
|-----------|-----------|
| Video upload endpoints | Kritisk |
| Custom video player | Kritisk |
| Annotation canvas | Kritisk |
| Voice-over recording | Høy |
| Side-by-side comparison | Medium |
| Coach video dashboard | Medium |

---

## Konfigurasjonsvalg

| Innstilling | Beslutning | Begrunnelse |
|-------------|------------|-------------|
| Maks videolengde | **5 minutter** | Balanse mellom funksjonalitet og lagringskostnad |
| Plattform | **Responsive (begge)** | Spillere filmer på mobil, trenere analyserer på desktop |
| Voice-over | **Essensielt** | Kritisk for trener-feedback, prioriteres i Phase 3 |
| Pro-referanser | **Coach-opplastet** | Trenere laster opp egne demo-videoer |

---

## Faser og Milepæler

### Fase 1: Foundation (Uke 1-3)

**Mål:** Grunnleggende opplasting og lagring

**Nye Filer - Backend:**
```
apps/api/src/
├── services/storage.service.ts      # S3 operasjoner
└── api/v1/
    ├── media/
    │   ├── index.ts                 # Routes
    │   ├── service.ts               # Business logic
    │   └── schema.ts                # Validering
    └── videos/
        ├── index.ts
        ├── service.ts
        └── schema.ts
```

**Leveranser:**
- Pre-signed URL generering for direkte S3 opplasting
- Chunked upload støtte for store videoer
- Automatisk thumbnail generering
- Video metadata ekstraksjon (varighet, oppløsning)
- API endpoints for upload/download

**API Endpoints:**
| Metode | Endpoint | Beskrivelse |
|--------|----------|-------------|
| POST | `/api/v1/media/upload-url` | Få pre-signed upload URL |
| POST | `/api/v1/media/confirm` | Bekreft fullført opplasting |
| GET | `/api/v1/media/:id` | Få media detaljer + playback URL |
| DELETE | `/api/v1/media/:id` | Slett media |
| GET | `/api/v1/media/:id/thumbnail` | Få video thumbnail |

---

### Fase 2: Video Player & Core UI (Uke 4-6)

**Mål:** Custom video player med avanserte kontroller

**Nye Filer - Frontend:**
```
apps/web/src/
├── components/video/
│   ├── VideoPlayer.tsx
│   ├── VideoControls.tsx
│   ├── VideoTimeline.tsx
│   └── PlaybackSpeedSelector.tsx
├── features/video-library/
│   ├── VideoLibrary.tsx
│   ├── VideoCard.tsx
│   └── VideoFilters.tsx
└── hooks/
    ├── useVideoPlayer.ts
    └── useVideoUpload.ts
```

**Video Player Features:**
| Feature | Beskrivelse |
|---------|-------------|
| Frame-by-frame | Piltaster for enkeltframe navigering |
| Hastighet | 0.1x, 0.25x, 0.5x, 1x, 2x |
| Keyboard shortcuts | Space, J/K/L for scrubbing |
| Touch-friendly | Mobilvennlig scrubber |
| Fullscreen | Fullskjermmodus |
| Loop section | Løkke valgt seksjon |

**Video Upload Features:**
- Drag-and-drop opplastingssone
- Fremdriftsindikator med avbryt-mulighet
- Video forhåndsvisning før opplasting
- Metadata-skjema (tittel, kategori, klubb, vinkel)
- Mobil kamera-integrasjon

---

### Fase 3: Annotation Tools (Uke 7-10)

**Mål:** Tegne-verktøy og voice-over

**Nye Filer:**
```
apps/web/src/components/video/
├── AnnotationCanvas.tsx
├── ToolPalette.tsx
├── VoiceRecorder.tsx
├── AnnotationTimeline.tsx
└── tools/
    ├── LineTool.tsx
    ├── CircleTool.tsx
    ├── ArrowTool.tsx
    ├── AngleTool.tsx
    ├── FreehandTool.tsx
    └── TextTool.tsx
```

**Tegne-verktøy:**
| Verktøy | Formål | Golf Bruksområde |
|---------|--------|------------------|
| Linje | Rette linjer | Swing plane, ryggvinkel |
| Sirkel | Markere områder | Ballposisjon, håndposisjon |
| Pil | Retning/bevegelse | Svingbane, vektoverføring |
| Vinkel | Måle vinkler | Håndleddshengsel, hofterotasjon |
| Frihånd | Fri tegning | Egendefinerte markeringer |
| Tekst | Etiketter | Notater på spesifikke punkter |

**Voice-over Features:**
- Ta opp lyd mens video spiller
- Synkroniser lyd til video-tidslinje
- Bølgeform-visualisering
- Trim/ta opp på nytt
- Last opp lyd til S3

**Teknisk Implementering:**
- HTML5 Canvas for tegning
- Serialiser tegninger som JSON
- Lagre per-frame annotasjoner
- Undo/redo stack
- Fargevelger og strekbredde-kontroller

---

### Fase 4: Comparison & Analysis (Uke 11-13)

**Mål:** Side-by-side sammenligning

**Nye Filer:**
```
apps/web/src/features/
├── video-comparison/
│   ├── VideoComparison.tsx
│   ├── SyncControls.tsx
│   └── ComparisonSelector.tsx
└── video-progress/
    ├── VideoProgressView.tsx
    └── SwingTimeline.tsx
```

**Comparison Features:**
| Feature | Beskrivelse |
|---------|-------------|
| Split-screen | 50/50 eller justerbar visning |
| Synkronisert avspilling | Begge videoer spiller sammen |
| Sync-punkter | Sett synkpunkter (f.eks. treffpunkt) |
| Ghost overlay | Semi-transparent overlegg |
| Uavhengige kontroller | Eller låste kontroller |

**Progress Tracking:**
- Tidslinje av sving-videoer over tid
- Visuell sammenligning av samme øvelse over uker/måneder
- Før/etter snapshots

---

### Fase 5: Sharing & Communication (Uke 14-15)

**Mål:** Deling og notifikasjoner

**Oppdateringer:**
- `apps/api/src/plugins/websocket.ts` - Legg til video events
- `apps/web/src/contexts/NotificationContext.jsx` - Håndter video notifikasjoner

**Deling Features:**
- Del med trener/spiller i appen
- Generer delbar lenke (tidsbegrenset)
- Personvernkontroller (privat, kun trener, offentlig)
- Nedlasting (med/uten annotasjoner)
- WhatsApp/Email deling

**Nye Notifikasjoner:**
| Event | Mottaker |
|-------|----------|
| Ny video lastet opp | Trener |
| Trener la til annotasjon | Spiller |
| Ny kommentar på video | Begge |
| Video prosessering ferdig | Opplaster |

---

### Fase 6: Coach-Specific Features (Uke 16)

**Mål:** Trener-spesifikke verktøy

**Nye Filer:**
```
apps/web/src/features/coach-videos/
├── CoachVideosDashboard.tsx
├── PlayerVideoFeed.tsx
├── PendingReviewQueue.tsx
└── ReferenceLibrary.tsx
```

**Coach Dashboard Features:**
- Alle spillervideoer i én feed
- Filter etter spiller, dato, gjennomgått status
- Hurtig annotasjonsmodus
- Batch-handlinger (merk gjennomgått, be om flere videoer)
- Video-oppgave (be spiller ta opp spesifikk drill)

**Reference Library:**
- Last opp trener demo-videoer
- Drill instruksjonsvideoer
- Del med spillere som eksempler

---

## Teknisk Arkitektur

### Fil-struktur Oversikt

```
apps/api/src/
├── api/v1/
│   ├── videos/
│   │   ├── index.ts           # Routes
│   │   ├── service.ts         # Business logic
│   │   ├── schema.ts          # Validering
│   │   └── types.ts           # TypeScript types
│   ├── annotations/
│   │   ├── index.ts
│   │   ├── service.ts
│   │   └── schema.ts
│   └── media/
│       ├── index.ts
│       ├── service.ts
│       └── storage.service.ts  # S3 operasjoner
└── jobs/
    └── video-processing.job.ts # Bakgrunnsprosessering

apps/web/src/
├── components/video/
│   ├── VideoPlayer.tsx
│   ├── VideoControls.tsx
│   ├── AnnotationCanvas.tsx
│   ├── ToolPalette.tsx
│   ├── VoiceRecorder.tsx
│   └── ...
├── features/
│   ├── video-library/
│   ├── video-analysis/
│   ├── video-comparison/
│   └── coach-videos/
└── hooks/
    ├── useVideoPlayer.ts
    ├── useAnnotationCanvas.ts
    └── useVideoUpload.ts
```

---

## Database Schema

### Video Model

```prisma
model Video {
  id              String   @id @default(uuid())
  tenantId        String   @map("tenant_id")
  playerId        String   @map("player_id")
  uploadedById    String   @map("uploaded_by_id")

  // Media info
  title           String   @db.VarChar(255)
  description     String?  @db.Text
  s3Key           String   @map("s3_key") @db.VarChar(500)
  thumbnailKey    String?  @map("thumbnail_key") @db.VarChar(500)
  duration        Int      // sekunder
  width           Int?
  height          Int?
  fileSize        BigInt   @map("file_size")
  mimeType        String   @map("mime_type") @db.VarChar(100)

  // Klassifisering
  category        String?  @db.VarChar(50)  // swing, putting, short_game
  clubType        String?  @map("club_type") @db.VarChar(50)
  viewAngle       String?  @map("view_angle") @db.VarChar(50)  // face_on, down_the_line

  // Status
  status          String   @default("processing") @db.VarChar(20)
  processedAt     DateTime? @map("processed_at")

  // Relasjoner
  annotations     VideoAnnotation[]
  comments        VideoComment[]
  comparisons     VideoComparison[]

  @@index([tenantId])
  @@index([playerId])
  @@map("videos")
}
```

### VideoAnnotation Model

```prisma
model VideoAnnotation {
  id              String   @id @default(uuid())
  videoId         String   @map("video_id")
  createdById     String   @map("created_by_id")

  // Timing
  timestamp       Decimal  @db.Decimal(10, 3)  // sekunder med ms presisjon
  duration        Decimal? @db.Decimal(10, 3)

  // Tegnedata
  type            String   @db.VarChar(50)     // line, circle, arrow, angle
  drawingData     Json     @map("drawing_data") @db.JsonB
  color           String   @default("#FF0000") @db.VarChar(20)
  strokeWidth     Int      @default(3)

  // Voice-over
  audioKey        String?  @map("audio_key") @db.VarChar(500)
  audioDuration   Decimal? @db.Decimal(10, 3)

  // Tekstnotat
  note            String?  @db.Text

  @@index([videoId])
  @@index([timestamp])
  @@map("video_annotations")
}
```

### VideoComparison Model

```prisma
model VideoComparison {
  id                String   @id @default(uuid())
  tenantId          String   @map("tenant_id")
  createdById       String   @map("created_by_id")
  primaryVideoId    String   @map("primary_video_id")
  comparisonVideoId String   @map("comparison_video_id")

  title             String?  @db.VarChar(255)
  notes             String?  @db.Text

  // Synk-innstillinger
  syncPoint1        Decimal  @db.Decimal(10, 3)  // tidsstempel i video 1
  syncPoint2        Decimal  @db.Decimal(10, 3)  // tidsstempel i video 2

  @@index([primaryVideoId])
  @@map("video_comparisons")
}
```

---

## API Endepunkter

### Videos

| Metode | Endpoint | Beskrivelse |
|--------|----------|-------------|
| POST | `/api/v1/videos` | Opprett video record |
| GET | `/api/v1/videos` | List videoer (med filtre) |
| GET | `/api/v1/videos/:id` | Få video detaljer |
| PATCH | `/api/v1/videos/:id` | Oppdater video metadata |
| DELETE | `/api/v1/videos/:id` | Slett video |

### Annotations

| Metode | Endpoint | Beskrivelse |
|--------|----------|-------------|
| POST | `/api/v1/videos/:id/annotations` | Legg til annotasjon |
| GET | `/api/v1/videos/:id/annotations` | List annotasjoner |
| PATCH | `/api/v1/annotations/:id` | Oppdater annotasjon |
| DELETE | `/api/v1/annotations/:id` | Slett annotasjon |

### Comments

| Metode | Endpoint | Beskrivelse |
|--------|----------|-------------|
| POST | `/api/v1/videos/:id/comments` | Legg til kommentar |
| GET | `/api/v1/videos/:id/comments` | List kommentarer |

### Comparisons

| Metode | Endpoint | Beskrivelse |
|--------|----------|-------------|
| POST | `/api/v1/videos/comparisons` | Opprett sammenligning |
| GET | `/api/v1/videos/comparisons` | List sammenligninger |
| GET | `/api/v1/videos/comparisons/:id` | Få sammenligning |

### Media/Upload

| Metode | Endpoint | Beskrivelse |
|--------|----------|-------------|
| POST | `/api/v1/media/upload-url` | Få pre-signed URL |
| POST | `/api/v1/media/confirm` | Bekreft opplasting |
| GET | `/api/v1/media/:id/stream` | Stream video |

---

## Frontend Komponenter

### Video Player Komponenter

| Komponent | Formål |
|-----------|--------|
| `VideoPlayer.tsx` | Hoved video player wrapper |
| `VideoControls.tsx` | Play/pause, seek, volume |
| `VideoTimeline.tsx` | Tidslinje med annotasjonsmarkører |
| `PlaybackSpeedSelector.tsx` | Hastighetskontroll dropdown |

### Annotation Komponenter

| Komponent | Formål |
|-----------|--------|
| `AnnotationCanvas.tsx` | Canvas overlay for tegning |
| `ToolPalette.tsx` | Verktøylinje for tegnevalg |
| `VoiceRecorder.tsx` | Lydopptak interface |
| `AnnotationTimeline.tsx` | Annotasjonsmarkører på tidslinje |

### Library Komponenter

| Komponent | Formål |
|-----------|--------|
| `VideoLibrary.tsx` | Hovedbibliotek visning |
| `VideoCard.tsx` | Enkelt video kort |
| `VideoFilters.tsx` | Filter panel |
| `VideoUploader.tsx` | Opplastings-widget |

---

## Prioritering

### Must Have (MVP)

- Video upload (maks 5 min, chunked)
- Custom video player (slow-mo, frame-by-frame)
- Tegne-verktøy (linje, sirkel, pil, vinkel)
- Voice-over opptak
- Coach-spiller deling
- Responsive design

### Should Have

- Side-by-side sammenligning
- Annotasjons-tidslinje
- Video library med filtre
- Real-time notifikasjoner

### Nice to Have

- Ghost overlay sammenligning
- Progress tracking over tid
- Batch annotasjonsmodus
- Nedlasting med annotasjoner brent inn

---

## Avhengigheter

### Backend (npm install)

```json
{
  "@fastify/multipart": "^8.0.0",
  "@aws-sdk/lib-storage": "^3.645.0",
  "fluent-ffmpeg": "^2.1.2",
  "sharp": "^0.33.0"
}
```

### Frontend (npm install)

```json
{
  "@uppy/core": "^3.0.0",
  "@uppy/react": "^3.0.0",
  "@uppy/aws-s3": "^3.0.0",
  "react-player": "^2.13.0",
  "fabric": "^5.3.0"
}
```

---

## Risiko og Mitigering

| Risiko | Mitigering |
|--------|------------|
| Store filopplastinger feiler | Chunked uploads, resume-funksjonalitet |
| S3 kostnader eskalerer | Video komprimering, retention policies, 5 min grense |
| Mobil ytelse | Adaptive bitrate, thumbnail-first lasting |
| Kompleks annotasjonssynk | Optimistic updates, konfliktløsning |

---

## Suksesskriterier

| Metrikk | Mål |
|---------|-----|
| Video opplasting suksessrate | >95% |
| Gjennomsnittlig opplastingstid (60s video) | <30 sekunder |
| Annotasjon lagringslatens | <500ms |
| Video avspillings starttid | <2 sekunder |
| Trener annotasjon turnaround | <24 timer |
| Spiller video innsending rate | 2+ per uke |

---

## WebSocket Events

```typescript
// Nye events å legge til
VIDEO_UPLOADED: 'video:uploaded'
VIDEO_PROCESSING: 'video:processing'
VIDEO_READY: 'video:ready'
ANNOTATION_ADDED: 'video:annotation_added'
COMMENT_ADDED: 'video:comment_added'
VIDEO_SHARED: 'video:shared'
```

---

## Tidslinje Oversikt

```
Uke 1-3   ████████░░░░░░░░░░░░░░░░  Phase 1: Foundation
Uke 4-6   ░░░░░░░░████████░░░░░░░░  Phase 2: Video Player
Uke 7-10  ░░░░░░░░░░░░░░░░████████  Phase 3: Annotation
Uke 11-13 ░░░░░░░░░░░░░░░░░░░░████  Phase 4: Comparison
Uke 14-15 ░░░░░░░░░░░░░░░░░░░░░░██  Phase 5: Sharing
Uke 16    ░░░░░░░░░░░░░░░░░░░░░░░█  Phase 6: Coach Tools
```

---

*Dokument generert: 22. desember 2025*
*For strategisk analyse og implementeringsplanlegging*
