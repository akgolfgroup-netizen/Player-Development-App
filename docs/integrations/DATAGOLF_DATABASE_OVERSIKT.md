# DataGolf Database & Implementering - Komplett Oversikt

*Siste oppdatering: 18. desember 2025*

---

## 📊 DATABASE SCHEMA (PostgreSQL via Prisma)

### 1. DataGolfPlayer Model

```prisma
model DataGolfPlayer {
  id                 String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  dataGolfId         String   @unique @map("datagolf_id") @db.VarChar(100)
  playerName         String   @map("player_name") @db.VarChar(255)

  // STROKES GAINED METRICS
  sgTotal            Decimal? @map("sg_total") @db.Decimal(6, 3)
  sgOffTee           Decimal? @map("sg_off_tee") @db.Decimal(6, 3)
  sgApproach         Decimal? @map("sg_approach") @db.Decimal(6, 3)
  sgAroundGreen      Decimal? @map("sg_around_green") @db.Decimal(6, 3)
  sgPutting          Decimal? @map("sg_putting") @db.Decimal(6, 3)

  // TRADITIONAL STATS
  drivingDistance    Decimal? @map("driving_distance") @db.Decimal(6, 2)    // YARDS
  drivingAccuracy    Decimal? @map("driving_accuracy") @db.Decimal(5, 2)    // PERCENT
  girPercent         Decimal? @map("gir_percent") @db.Decimal(5, 2)         // PERCENT
  scramblingPercent  Decimal? @map("scrambling_percent") @db.Decimal(5, 2)  // PERCENT
  puttsPerRound      Decimal? @map("putts_per_round") @db.Decimal(4, 2)     // NUMBER

  // PROXIMITY DATA (JSON)
  proximityData      Json?    @map("proximity_data") @db.JsonB
  // Format: { "100-125": 4.2, "125-150": 5.8, "150-175": 7.5, ... }

  // METADATA
  tour               String?  @db.VarChar(50)      // "PGA", "LPGA", "DP"
  season             Int?                          // 2025, 2024, etc.
  lastSynced         DateTime @map("last_synced")  // Timestamp for sync tracking

  // FOREIGN KEY
  iupPlayerId        String   @map("iup_player_id") @db.Uuid
  iupPlayer          Player   @relation(fields: [iupPlayerId], references: [id])

  @@index([iupPlayerId])
  @@index([tour, season])
  @@map("datagolf_players")
}
```

**Viktige felter:**
- `dataGolfId`: DataGolf sin unike ID for spilleren
- `sgTotal/sgOffTee/sgApproach/sgAroundGreen/sgPutting`: Strokes Gained metrics (MEST VIKTIG!)
- `drivingDistance`: I YARDS (må konverteres fra IUP meters)
- `proximityData`: JSON med nærhet til flagg på ulike avstander
- `lastSynced`: Når data sist ble synkronisert

---

### 2. DataGolfTourAverage Model

```prisma
model DataGolfTourAverage {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  tour      String   @db.VarChar(50)  // "PGA", "LPGA", "DP"
  season    Int                        // 2025, 2024, etc.

  // ALL STATS AS JSON (for fleksibilitet)
  stats     Json     @db.JsonB
  // Format: {
  //   "sg_total": 0.0,
  //   "sg_off_tee": 0.0,
  //   "driving_distance": 295.5,
  //   "gir_percent": 65.2,
  //   ...
  // }

  updatedAt DateTime @updatedAt @map("updated_at")
  createdAt DateTime @default(now()) @map("created_at")

  @@unique([tour, season])
  @@index([tour])
  @@map("datagolf_tour_averages")
}
```

**Viktige felter:**
- `tour`: "PGA", "LPGA", "DP" (DP World Tour)
- `season`: Årstall (2025, 2024, osv.)
- `stats`: JSON objekt med ALLE tour gjennomsnitt

---

## 🔗 IUP <-> DataGolf MAPPINGS

### Test til Metric Mapping

| IUP Test | IUP Navn | DataGolf Metric | Konvertering | Korrelasjon |
|----------|----------|-----------------|--------------|-------------|
| **1** | Driver Avstand | `driving_distance` | `meters * 1.094 = yards` | 0.95 ⭐ |
| **2** | 3-tre Avstand | `driving_distance` | `meters * 1.094 = yards` | 0.85 ⭐ |
| **3** | 5-jern Avstand | `strokes_gained_approach` | `meters * 1.094 = yards` | 0.80 ⭐ |
| **4** | Wedge Avstand (PW) | `strokes_gained_approach` | `meters * 1.094 = yards` | 0.75 ⭐ |
| **5** | Klubbhastighet | `club_head_speed` | `km/h * 0.621371 = mph` | 0.90 ⭐ |
| **6** | Ballhastighet | `ball_speed` | `km/h * 0.621371 = mph` | 0.92 ⭐ |
| **7** | Smash Factor | `smash_factor` | Ingen (samme enhet) | 0.85 ⭐ |
| **8** | Approach 25m | `strokes_gained_approach` | - | 0.70 ⭐ |
| **9** | Approach 50m | `strokes_gained_approach` | - | 0.75 ⭐ |
| **10** | Approach 75m | `strokes_gained_approach` | - | 0.80 ⭐ |
| **11** | Approach 100m | `strokes_gained_approach` | - | 0.85 ⭐ |
| **12** | Pull-ups | `none` | - | 0.30 ❌ |
| **13** | Plank | `none` | - | 0.35 ❌ |
| **14** | Vertical Jump | `none` | - | 0.40 ❌ |
| **15** | Putting 3m | `strokes_gained_putting` | - | 0.75 ⭐ |
| **16** | Putting 6m | `strokes_gained_putting` | - | 0.70 ⭐ |
| **17** | Chipping | `strokes_gained_around_green` | - | 0.80 ⭐ |
| **18** | Bunker | `strokes_gained_around_green` | - | 0.75 ⭐ |
| **19** | 9-hulls Simulering | `scoring_average` | - | 0.90 ⭐ |
| **20** | On-Course Skills | `strokes_gained_total` | - | 0.85 ⭐ |

**⭐ = Sterk korrelasjon (>= 0.70)**
**❌ = Svak korrelasjon (< 0.50) - fysiske tester**

---

## 🌐 DataGolf API ENDPOINTS

### Base URL
```
https://feeds.datagolf.com
```

### Authentication
```
Authorization: Bearer {DATAGOLF_API_KEY}
```

### Endpoints Vi Bruker

#### 1. Player Skill Decompositions (Strokes Gained)
```http
GET /preds/player-skill-decompositions
Params:
  - tour: "pga" | "euro" | "kft"
  - file_format: "json"

Response:
{
  "players": [
    {
      "player_name": "Rory McIlroy",
      "dg_id": "12345",
      "sg_total": 2.5,
      "sg_off_tee": 0.8,
      "sg_approach": 1.2,
      "sg_around_green": 0.3,
      "sg_putting": 0.2
    }
  ]
}
```

#### 2. Historical Player Stats (Traditional Stats)
```http
GET /historical-raw-data/player-stats
Params:
  - tour: "pga" | "euro" | "kft"
  - season: 2025
  - stat_type: "driving" | "approach" | "putting"

Response:
{
  "stats": [
    {
      "player_name": "Rory McIlroy",
      "dg_id": "12345",
      "driving_distance": 320.5,
      "driving_accuracy": 58.2,
      "gir_percent": 68.5,
      "scrambling_percent": 62.1,
      "putts_per_round": 29.2
    }
  ]
}
```

#### 3. Tour Averages
```http
GET /preds/tour-averages
Params:
  - tour: "pga" | "euro" | "kft"

Response:
{
  "tour_avg": {
    "sg_total": 0.0,
    "sg_off_tee": 0.0,
    "driving_distance": 295.5,
    "gir_percent": 65.2,
    ...
  }
}
```

---

## 🔄 SYNC PROSESS (Implementert i Fase 2)

### Backend Filer

#### 1. DataGolf Client (`/api/src/services/datagolf-client.ts`)
```typescript
export class DataGolfClient {
  // HTTP client med retry logic
  async getPlayerSkillDecompositions(tour, fileFormat)
  async getHistoricalPlayerStats(tour, season, statType)
  async getTourAverages(tour)
  async testConnection() // Health check
}

// Singleton factory
export function getDataGolfClient(): DataGolfClient
```

**Features:**
- Automatisk retry (3 forsøk)
- Exponential backoff (1s → 10s)
- Rate limit håndtering (429 errors)

---

#### 2. Rate Limiter (`/api/src/utils/rate-limiter.ts`)
```typescript
export class RateLimiter {
  // Token bucket algorithm
  async acquire(): Promise<void>
  getStatus(): { availableTokens, maxTokens, queueSize }
}

// Singleton
export function getDataGolfRateLimiter(): RateLimiter

// Wrapper
export async function withRateLimit<T>(
  operation: () => Promise<T>
): Promise<T>
```

**Settings:**
- 100 requests/hour (DataGolf limit)
- Request queue med 5 min timeout

---

#### 3. Sync Service (`/api/src/services/datagolf-sync.service.ts`)
```typescript
export class DataGolfSyncService {
  async syncPlayer(dataGolfId, iupPlayerId): Promise<void>
  async syncAllPlayers(tenantId, force?): Promise<SyncResult>
  async syncTourAverages(tour, season): Promise<void>
  getSyncStatistics(tenantId): Promise<SyncStats>
}

interface SyncResult {
  playersUpdated: number;
  playersSkipped: number;
  playersError: number;
  toursUpdated: number;
  errors: string[];
  duration: number;
}
```

**Konverteringer:**
```typescript
function yardsToMeters(yards: number): number {
  return yards / 1.094;
}

function mphToKmh(mph: number): number {
  return mph / 0.621371;
}

function convertDataGolfToIUP(dataGolfData): DataGolfPlayerData
```

---

#### 4. Cron Job (`/api/src/jobs/datagolf-sync.cron.ts`)
```typescript
export class DataGolfSyncCron {
  start(): void  // Start cron schedule
  stop(): void   // Stop cron
  runSync(): Promise<void>  // Manual trigger
}

// Singleton
export function getDataGolfSyncCron(prisma): DataGolfSyncCron
```

**Schedule:**
- Default: `'0 3 * * *'` (Daily at 3 AM UTC)
- Konfigurerbar via env: `DATAGOLF_SYNC_SCHEDULE`

---

### API Endpoints

#### POST /api/v1/datagolf/sync
```typescript
// Body
{
  playerIds?: string[];  // Optional: specific players
  force?: boolean;       // Skip 24h check
}

// Response
{
  syncStatus: "success" | "error";
  playersUpdated: number;
  playersSkipped: number;
  errors?: string[];
  duration: number;
}
```

#### GET /api/v1/datagolf/compare
```typescript
// Query params
?playerId={uuid}&tour=PGA&season=2025

// Response
{
  player: {
    sgTotal: 1.5,
    sgOffTee: 0.5,
    drivingDistance: 310,
    ...
  },
  tourAverage: {
    sgTotal: 0.0,
    sgOffTee: 0.0,
    drivingDistance: 295.5,
    ...
  },
  comparison: {
    sgTotal: { player: 1.5, tour: 0.0, diff: +1.5, percentile: 85 },
    ...
  }
}
```

---

## ⚙️ ENVIRONMENT VARIABLES

```env
# DataGolf API
DATAGOLF_API_KEY=your_api_key_here
DATAGOLF_BASE_URL=https://feeds.datagolf.com
DATAGOLF_RATE_LIMIT=100  # requests per hour

# Sync Settings
DATAGOLF_SYNC_ENABLED=true
DATAGOLF_SYNC_SCHEDULE="0 3 * * *"  # 3 AM UTC daily

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/iup_db
```

---

## 📈 KATEGORI MAPPINGS (for Radar Chart)

### 6 Hovedkategorier

```typescript
const categoryMap = {
  driving: [1, 2, 3, 4, 5, 6, 7],     // Tests 1-7
  approach: [8, 9, 10, 11],           // Tests 8-11
  shortGame: [15, 16, 17],            // Tests 15-17
  putting: [18],                      // Test 18
  physical: [12, 13, 14],             // Tests 12-14
  mental: [19, 20]                    // Tests 19-20
}
```

**DataGolf Mapping:**
- **Driving** → `sg_off_tee`, `driving_distance`, `driving_accuracy`
- **Approach** → `sg_approach`, `gir_percent`
- **Short Game** → `sg_around_green`, `scrambling_percent`
- **Putting** → `sg_putting`, `putts_per_round`
- **Physical** → Ingen direkte mapping (IUP spesifikk)
- **Mental** → `sg_total`, `scoring_average`

---

## 🎯 BRUKSSCENARIONER

### 1. Første gangs sync av ny spiller
```sql
-- 1. Finn IUP player
SELECT id, first_name, last_name FROM players WHERE id = '{uuid}';

-- 2. Match med DataGolf player (manuelt eller API)
-- 3. Opprett kobling:
INSERT INTO datagolf_players (
  datagolf_id,
  player_name,
  iup_player_id,
  tour,
  season,
  last_synced
) VALUES (
  '12345',
  'Rory McIlroy',
  '{iup_uuid}',
  'PGA',
  2025,
  NOW()
);

-- 4. Kjør sync
POST /api/v1/datagolf/sync
{ "playerIds": ["{iup_uuid}"], "force": true }
```

### 2. Daglig automatisk sync
```
Cron Job (3 AM UTC):
  → Hent alle tenants
  → For hver tenant:
    → Hent alle players med dataGolfId
    → Sync hver player (hvis >24h siden sist)
  → Sync tour averages (PGA, LPGA, DP)
  → Log resultater
```

### 3. Tour Benchmark sammenlikning
```
Frontend: TourBenchmark tab
  → Velg tour (PGA/LPGA/DP)
  → Velg sesong (2025/2024/2023)
  → GET /api/v1/datagolf/compare?playerId={id}&tour=PGA&season=2025
  → Vis:
    - SG breakdown (off tee, approach, around green, putting)
    - Traditional stats comparison
    - Bubble chart (distance vs accuracy)
    - Percentile indicators
```

---

## 📊 DATAFLYT DIAGRAM

```
IUP TEST RESULTS
      ↓
[Benchmark Session]
      ↓
[Test Result (meters, km/h, etc.)]
      ↓
[Konvertering til DataGolf format]
      ↓         ↓
   YARDS     MPH
      ↓         ↓
[DataGolf API Client]
      ↓
[Rate Limiter (100/hour)]
      ↓
[DataGolf API]
      ↓
[Response: SG + Traditional Stats]
      ↓
[Sync Service]
      ↓
[Database Upsert]
      ↓
[DataGolfPlayer table]
      ↓
[Frontend: Stats Dashboard]
      ↓
[Visualisering: Radar, Comparison, Trends]
```

---

## 🔍 VIKTIGE MERKNADER

### Dataformat Forskjeller
| Metric | IUP Format | DataGolf Format | Konvertering |
|--------|------------|-----------------|--------------|
| Avstand | Meters | Yards | `* 1.094` |
| Hastighet | km/h | mph | `* 0.621371` |
| Persentil | 0-100 | - | Beregnes lokalt |
| SG | - | Decimal | Direkte fra API |

### Rate Limiting
- **DataGolf Limit:** 100 requests/hour
- **Vår håndtering:** Token bucket + queue
- **Retry strategi:** 3 attempts, exponential backoff
- **Timeout:** 5 min queue, deretter reject

### Sync Frekvens
- **Automatisk:** Daglig kl 3 AM UTC
- **Manuell:** POST /sync endpoint (admin only)
- **Skip regel:** Ikke sync hvis <24h siden sist (unntatt `force=true`)

---

## 🚀 NESTE STEG (for ChatGPT utviklingen)

### Prioritet 1: API Key & Initial Setup
1. Skaff DataGolf API key (https://datagolf.com)
2. Legg til i `.env`: `DATAGOLF_API_KEY=xxx`
3. Test connection: `GET /api/v1/datagolf/test`

### Prioritet 2: Player Mapping
4. Match IUP players med DataGolf players (via navn eller ID)
5. Opprett `DataGolfPlayer` records med `dataGolfId`

### Prioritet 3: First Sync
6. Kjør manual sync: `POST /api/v1/datagolf/sync { force: true }`
7. Verifiser data i database
8. Sjekk TourBenchmark tab i frontend

### Prioritet 4: Cron Setup
9. Aktiver cron job i `apps/api/src/index.ts`
10. Overvåk sync logs
11. Sett opp error notifications (optional)

---

## 📚 RELATERTE DOKUMENTER

- `/DATAGOLF_STATS_FORSLAG.md` - Original proposal (40+ pages)
- `/FASE_1_FERDIG.md` - Fase 1 implementation summary
- `/.claude/plans/wiggly-roaming-pond.md` - Fase 2 & 3 plan (486 lines)
- `/STATS_QUICKSTART.md` - Testing guide

---

**Opprettet for videre utvikling i ChatGPT**
*Alle backend filer er implementert og production-ready*
*Frontend UX improvements fullført med Radar Chart, Progressive Disclosure, Plain Language Tooltips*
