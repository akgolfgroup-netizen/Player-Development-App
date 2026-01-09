# Multi-Sport Database Schema Planning

## Phase 3E: Database Schema for Multi-Sport Support

This document outlines the database schema changes needed to support multiple sports in the IUP system.

---

## Current State Analysis

### Golf-Specific Elements Found in Schema

**Player Model:**
- `handicap` - Golf handicap (Decimal 4,1)
- `averageScore` - Average golf score
- `category` - Golf skill category (A-K)
- `wagrRank` - World Amateur Golf Ranking

**TrainingSession Model:**
- `clubSpeed` - CS0-CS100 levels
- `akFormula` - AK Golf Kategori Hierarki formula
- `puttingFocus` - GREEN, SIKTE, TEKN, BALL, SPEED
- `puttingPhases` - S, B, I, F combinations
- `positionStart/End` - P1.0-P10.0 swing positions

**TrainingAreaPerformance Model:**
- `trainingArea` - Golf areas: TEE, INN200, PUTT, BUNKER, etc.
- `madePutts`, `totalPutts` - Putting metrics
- `upAndDownSuccess` - Short game metrics

**Tournament/TournamentResult Models:**
- `courseName`, `par`, `courseRating`, `slopeRating`
- `strokesGained`, `fairwaysHit`, `greensInRegulation`
- `puttsPerRound`

**Dedicated Golf Tables:**
- `StrokesGainedData` - SG analytics
- `StrokesGainedBenchmark` - SG benchmarks
- `ClubSpeedCalibration` - CS calibration
- `ClubGapping` - Club distances
- `CourseStrategy`, `HoleStrategy` - Course management
- `DataGolf*` tables - DataGolf integration
- `GolfClub`, `GolfCourse`, `GolfCourseTee` - Course data

---

## Architecture Options

### Option A: Tenant-Level Sport (Recommended)

Each tenant is dedicated to a single sport. This is the simplest approach.

```
Tenant
├── sportId: 'golf' | 'running' | 'handball' | ...
├── players (all same sport)
├── tests (sport-specific)
└── trainingSessions (sport-specific)
```

**Pros:**
- Simplest implementation
- Clean data separation
- No mixed-sport complexity
- Existing golf data works unchanged

**Cons:**
- Cannot have multi-sport academies in one tenant
- Users need separate accounts per sport

### Option B: Player-Level Sport

Each player can be associated with a different sport.

**Pros:**
- More flexible for multi-sport facilities

**Cons:**
- Complex data model
- Sport-specific fields need conditionals
- UI must handle multiple sports

### Option C: Hybrid (Tenant Default + Player Override)

Tenant has a default sport, but players can specify a different sport.

**Not recommended** - adds complexity without clear benefit.

---

## Recommended Schema Changes

### Phase 3E-1: Add SportId to Tenant

```prisma
enum SportId {
  GOLF
  RUNNING
  HANDBALL
  FOOTBALL
  TENNIS
  SWIMMING
  JAVELIN
}

model Tenant {
  // ... existing fields ...
  sportId SportId @default(GOLF) @map("sport_id")
}
```

**Migration Strategy:**
1. Add `sport_id` column with default `GOLF`
2. All existing tenants automatically get `GOLF`
3. No data changes needed

### Phase 3E-2: Create SportConfig Table

Store sport-specific configuration that can be customized per tenant.

```prisma
model SportConfig {
  id                String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  tenantId          String   @unique @map("tenant_id") @db.Uuid
  sportId           SportId  @map("sport_id")

  // Customizable sport settings (JSON)
  trainingAreasJson Json     @default("[]") @map("training_areas") @db.JsonB
  environmentsJson  Json     @default("[]") @map("environments") @db.JsonB
  phasesJson        Json     @default("[]") @map("phases") @db.JsonB
  benchmarksJson    Json     @default("{}") @map("benchmarks") @db.JsonB
  terminologyJson   Json     @default("{}") @map("terminology") @db.JsonB

  // Feature flags per sport
  usesHandicap      Boolean  @default(false) @map("uses_handicap")
  usesClubSpeed     Boolean  @default(false) @map("uses_club_speed")
  usesSG            Boolean  @default(false) @map("uses_strokes_gained")
  usesAKFormula     Boolean  @default(false) @map("uses_ak_formula")

  createdAt         DateTime @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt         DateTime @default(now()) @updatedAt @map("updated_at") @db.Timestamptz(6)

  tenant            Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@map("sport_configs")
}
```

### Phase 3E-3: Sport-Agnostic Performance Metrics

Replace golf-specific fields with generic metric storage.

```prisma
model PerformanceMetric {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  playerId  String   @map("player_id") @db.Uuid
  metricId  String   @map("metric_id") @db.VarChar(50) // e.g., 'handicap', 'sg_total', 'pace_5k'
  value     Decimal  @db.Decimal(10, 4)
  unit      String?  @db.VarChar(20)
  date      DateTime @db.Date
  source    String?  @db.VarChar(50) // 'manual', 'import', 'calculated'
  metadata  Json?    @db.JsonB
  createdAt DateTime @default(now()) @map("created_at") @db.Timestamptz(6)

  player    Player   @relation(fields: [playerId], references: [id], onDelete: Cascade)

  @@index([playerId, metricId, date])
  @@map("performance_metrics")
}
```

**Benefits:**
- Works for any sport
- Flexible metric storage
- Sport config defines which metrics exist

---

## Migration Strategy

### Phase 1: Non-Breaking Additions (Safe)

1. Add `sport_id` to Tenant with default `GOLF`
2. Create `SportConfig` table
3. Create `PerformanceMetric` table
4. No changes to existing tables

### Phase 2: Data Migration (Careful)

1. Create SportConfig entries for existing tenants
2. Copy golf-specific fields to PerformanceMetric
3. Keep original fields for backwards compatibility

### Phase 3: Deprecation (Future)

1. Mark golf-specific fields as deprecated
2. Migrate components to use new generic metrics
3. Eventually remove deprecated fields

---

## Implementation Order

1. **Phase 3E-1**: Add sportId enum and field to Tenant
2. **Phase 3E-2**: Create SportConfig model
3. **Phase 3E-3**: Create PerformanceMetric model
4. **Phase 3E-4**: Seed default sport configs for golf
5. **Phase 3E-5**: Update SportContext to read from DB if available

---

## API Changes

### New Endpoints

```
GET    /api/v1/sports                    # List available sports
GET    /api/v1/tenants/:id/sport-config  # Get tenant sport config
PUT    /api/v1/tenants/:id/sport-config  # Update tenant sport config
GET    /api/v1/players/:id/metrics       # Get player metrics
POST   /api/v1/players/:id/metrics       # Add player metric
```

### Modified Endpoints

- Player endpoints should return sport-relevant fields only
- Training session endpoints should validate against sport config
- Test endpoints should filter by sport-appropriate tests

---

## Frontend Integration

The SportContext (already implemented in Phase 3) will:

1. First check if tenant has custom SportConfig in DB
2. Fall back to static config file (golf.config.ts)
3. Merge tenant customizations with base config

This allows:
- Zero database setup required (uses static configs)
- Optional per-tenant customization
- Gradual migration path

---

## Testing Strategy

1. **Unit Tests**: SportConfig model CRUD operations
2. **Integration Tests**: Tenant with different sports
3. **E2E Tests**: Player workflow for non-golf sport
4. **Regression Tests**: Existing golf functionality unchanged

---

## Timeline

Phase 3E is **planning only**. Implementation will be:

- Phase 4A: Database migrations
- Phase 4B: API endpoints
- Phase 4C: Frontend integration
- Phase 5: Additional sport configurations

---

## Questions for Review

1. Should we support multi-sport players within a tenant?
2. Do we need sport-specific user roles (e.g., "Running Coach")?
3. How should sport configs be versioned for backwards compatibility?
4. Should tenant admins be able to customize training areas?

---

*Document created: Phase 3E - Multi-Sport Database Schema Planning*
