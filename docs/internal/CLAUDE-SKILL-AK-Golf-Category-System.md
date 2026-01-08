# TIER Golf - Category & Badge System Skill

## System Overview

This skill enables working with TIER Golf's player development system, including:
- **20 Team Norway Tests** with category-specific requirements
- **11 Player Categories** (A-K) from elite to beginner
- **Badge/Achievement System** with hierarchical scaling
- **Category Progression Logic**

---

## 1. Player Categories (A-K)

Categories represent player skill levels from elite (A) to complete beginner (K):

| Category | Description | Target Handicap | Multiplier |
|----------|-------------|-----------------|------------|
| A | Elite/Tour-aspirant | +2 to 0 | 1.00 |
| B | High level | 0 to 2 | 0.95 |
| C | Regional level | 2 to 5 | 0.90 |
| D | Club+ level | 5 to 8 | 0.85 |
| E | Club level | 8 to 12 | 0.80 |
| F | Active amateur | 12 to 18 | 0.70 |
| G | Development player | 18 to 24 | 0.60 |
| H | Intermediate | 24 to 30 | 0.50 |
| I | Beginner+ | 30 to 36 | 0.40 |
| J | Beginner | 36 to 45 | 0.35 |
| K | Complete beginner | 45+ | 0.30 |

---

## 2. The 20 Team Norway Tests

### Distance Tests (1-4)
Tests measure carry distance in meters. Higher is better (>=).

| Test | Name | A (M) | A (K) | D (M) | D (K) | K (M) | K (K) |
|------|------|-------|-------|-------|-------|-------|-------|
| 1 | Driver Carry | 270m | 240m | 240m | 210m | 170m | 140m |
| 2 | 3-Wood | 250m | 210m | 220m | 180m | 150m | 110m |
| 3 | 5-Iron | 190m | 165m | 175m | 150m | 140m | 115m |
| 4 | Wedge (PW) | 130m | 110m | 115m | 95m | 80m | 60m |

### Speed Tests (5-7)
| Test | Name | Unit | A (M) | A (K) | D (M) | D (K) |
|------|------|------|-------|-------|-------|-------|
| 5 | Club Speed | km/h | 193 | 169 | 169 | 145 |
| 6 | Ball Speed | km/h | 285 | 250 | 240 | 205 |
| 7 | Smash Factor | ratio | 1.48 | 1.48 | 1.42 | 1.42 |

### Approach Tests (8-11)
PEI (Precision Efficiency Index) - Lower is better (<=).

| Test | Name | A | B | C | D | E | F | G | H | I | J | K |
|------|------|---|---|---|---|---|---|---|---|---|---|---|
| 8 | 25m Approach | 1.0 | 1.2 | 1.4 | 1.6 | 1.8 | 2.0 | 2.2 | 2.4 | 2.6 | 2.8 | 3.0 |
| 9 | 50m Approach | 1.0 | 1.2 | 1.4 | 1.6 | 1.8 | 2.0 | 2.2 | 2.4 | 2.6 | 2.8 | 3.0 |
| 10 | 75m Approach | 1.0 | 1.2 | 1.4 | 1.6 | 1.8 | 2.0 | 2.2 | 2.4 | 2.6 | 2.8 | 3.0 |
| 11 | 100m Approach | 1.0 | 1.2 | 1.4 | 1.6 | 1.8 | 2.0 | 2.2 | 2.4 | 2.6 | 2.8 | 3.0 |

### Physical Tests (12-14)
From DATABASE_FORMLER_KOMPLETT.md:

| Test | Name | Unit | A (M) | A (K) | D (M) | D (K) | H (M) | H (K) |
|------|------|------|-------|-------|-------|-------|-------|-------|
| 12 | Benkpress | kg (1RM) | 140+ | 100+ | 110+ | 70+ | 70+ | 40+ |
| 13 | Markløft Trapbar | kg (1RM) | 200+ | 140+ | 155+ | 110+ | 95+ | 70+ |
| 14 | Rotasjonskast 4kg | m | 12.0+ | 10.0+ | 9.0+ | 7.0+ | - | - |

**Asymmetri-krav for Rotasjonskast:**
- A: <10%, B: <12%, C: <15%, D: <18%, E: <20%, F: <25%

### Utvidede Fysiske Tester (foreslatte krav)

#### CMJ - Counter Movement Jump (Trykkplate)

| Kategori | Hopphøyde (M) | Hopphøyde (K) | Peak Power (W/kg) | Asymmetri |
|----------|---------------|---------------|-------------------|-----------|
| A | 55+ cm | 45+ cm | 55+ | <10% |
| B | 50+ cm | 42+ cm | 50+ | <12% |
| C | 45+ cm | 38+ cm | 45+ | <15% |
| D | 40+ cm | 34+ cm | 40+ | <18% |
| E | 35+ cm | 30+ cm | 35+ | <20% |
| F | 30+ cm | 26+ cm | 30+ | <25% |
| G | 25+ cm | 22+ cm | 25+ | - |
| H | 22+ cm | 20+ cm | 22+ | - |

**CMJ korrelerer med klubbhastighet** - høyere hoppkraft = mer power i svingen.

#### 3000m Løping (Mølle)

| Kategori | Tid (M) | Tid (K) | Beskrivelse |
|----------|---------|---------|-------------|
| A | <11:00 | <12:30 | Elite utholdenhet |
| B | <11:30 | <13:00 | Høyt nivå |
| C | <12:00 | <13:30 | Regionalt nivå |
| D | <12:30 | <14:00 | Klubb+ nivå |
| E | <13:00 | <14:30 | Klubbnivå |
| F | <13:30 | <15:00 | Aktiv amatør |
| G | <14:00 | <15:30 | Utviklingsspiller |
| H | <15:00 | <16:30 | Mellomnivå |

**Utholdenhet er kritisk** for prestasjon over 18 hull, spesielt i varme/krevende forhold.

#### Clubhead Speed - Komplett Oversikt

| Kategori | Menn (km/h) | Menn (mph) | Kvinner (km/h) | Kvinner (mph) |
|----------|-------------|------------|----------------|---------------|
| A | 193+ | 120+ | 169+ | 105+ |
| B | 185+ | 115+ | 161+ | 100+ |
| C | 177+ | 110+ | 153+ | 95+ |
| D | 169+ | 105+ | 145+ | 90+ |
| E | 161+ | 100+ | 137+ | 85+ |
| F | 153+ | 95+ | 129+ | 80+ |
| G | 145+ | 90+ | 121+ | 75+ |
| H | 137+ | 85+ | 113+ | 70+ |
| I | 129+ | 80+ | 105+ | 65+ |
| J | 121+ | 75+ | 97+ | 60+ |
| K | 113+ | 70+ | 89+ | 55+ |

**Speed-trening badges:**
- +5 mph improvement = Level 1
- +10 mph improvement = Level 2
- +15 mph improvement = Level 3

### Mental/Performance Tests (15-18)
From DATABASE_FORMLER_KOMPLETT.md:

| Test | Name | Unit | Comparison | A | D |
|------|------|------|------------|---|---|
| 15 | Pressure Putting | % | >= | 90%+ | 60%+ |
| 16 | Pre-shot Rutine | % | >= | 90%+ | 60%+ |
| 17 | Fokus under Distraksjon | % | <= (impact) | <5% | <20% |
| 18 | Mental Toughness (MTQ48) | score | >= | 4.5+ | 3.5+ |

### Strategy Tests (19-20)
| Test | Name | Unit | Comparison | A | D |
|------|------|------|------------|---|---|
| 19 | Klubbvalg & Risiko | % | >= | 85%+ | 65%+ |
| 20 | Banestrategi | 1-5 | >= | 4.5+ | 3.5+ |

---

## 3. Strokes Gained (SG) Stats

Fra DataGolf-integrasjon (`apps/api/src/api/v1/datagolf/types.ts`):

| Metric | Description |
|--------|-------------|
| strokesGainedTotal | Total SG |
| strokesGainedOTT | Off the Tee |
| strokesGainedAPR | Approach |
| strokesGainedARG | Around the Green |
| strokesGainedPutting | Putting |

Brukes for sammenligning med tour-spillere og identifisering av styrker/svakheter.

---

## 4. Current Badge/Achievement System

### Active Achievements (from achievement-definitions.ts)

| ID | Name | Category | Description | Levels |
|----|------|----------|-------------|--------|
| streak | Streak Master | consistency | Consecutive training days | 3, 7, 14, 30, 60 days |
| total_sessions | Training Warrior | volume | Total sessions completed | 10, 25, 50, 100, 250 sessions |
| total_hours | Time Champion | volume | Total hours trained | 10, 25, 50, 100, 250 hours |
| completion_rate | Reliable | consistency | Completion rate (30+ sessions) | 70%, 80%, 90%, 95% |
| early_bird | Early Bird | special | Sessions before 9 AM | 5, 20, 50 sessions |
| breaking_points | Weakness Crusher | improvement | Breaking points resolved | 1, 3, 5, 10 points |
| perfect_week | Perfect Week | consistency | All planned sessions completed | 1, 4, 12 weeks |
| tournament_ready | Tournament Ready | milestone | Complete prep before tournament | 1, 3, 5 tournaments |
| speed_boost | Speed Demon | improvement | Driver speed improvement | +5, +10, +15 mph |
| night_owl | Night Owl | special | Sessions after 7 PM | 10, 25 sessions |

### Achievement Categories
- **consistency**: Streak, completion rate, perfect weeks
- **volume**: Total sessions, total hours
- **improvement**: Breaking points, speed boost
- **milestone**: Tournament prep
- **special**: Early bird, night owl

---

## 4. Hierarchical Badge Scaling System

### Scaling Formula

```typescript
function getScaledRequirement(baseValue: number, playerCategory: string): number {
  const multipliers: Record<string, number> = {
    'A': 1.00, 'B': 0.95, 'C': 0.90, 'D': 0.85, 'E': 0.80,
    'F': 0.70, 'G': 0.60, 'H': 0.50, 'I': 0.40, 'J': 0.35, 'K': 0.30
  };
  return Math.round(baseValue * multipliers[playerCategory]);
}
```

### Scaling Types

**ABSOLUTE (scales with category):**
- Total sessions
- Total hours
- Streak days
- Perfect weeks
- Tonnage lifted
- Training volume

**RELATIVE (does NOT scale):**
- Completion rate (%)
- Speed improvement (%)
- Personal records
- Test completion

### Example: "100 Hours" Badge

| Category | Requirement | Calculation |
|----------|-------------|-------------|
| A | 100 hours | 100 × 1.00 |
| C | 90 hours | 100 × 0.90 |
| D | 85 hours | 100 × 0.85 |
| F | 70 hours | 100 × 0.70 |
| K | 30 hours | 100 × 0.30 |

---

## 6. Category Progression Criteria

To progress from one category to the next (e.g., D → C), a player must:

1. **Score Consistency** (3 months, 10+ rounds)
   - Average score within target range
   - Differential trending down

2. **Physical Tests** (2 of 3 must pass)
   - Test 12: Benkpress (1RM)
   - Test 13: Markløft Trapbar (1RM)
   - Test 14: Rotasjonskast 4kg Medisinball

3. **Benchmark Golf Tests** (4 of 7 must pass)
   - Test 1-7: Golfslag-tester (Driver, Jern, Wedge, Speed, Smash Factor)
   - Category-specific requirements

4. **Mental Maturity Assessment**
   - Test 15: Pressure Putting
   - Test 16: Pre-shot Rutine Konsistens
   - Coach evaluation

---

## 7. XP System (Reverse Scaling)

Lower categories earn MORE XP to reward effort at their level:

| Category Range | XP Multiplier |
|---------------|---------------|
| A | 1.0x |
| B-C | 1.1x |
| D-E | 1.2x |
| F-G | 1.3x |
| H-I | 1.4x |
| J-K | 1.5x |

**Logic:** A K-player training 30 hours shows the same relative dedication as an A-player training 100 hours.

---

## 8. Data Models (from Prisma schema)

### CategoryRequirement
```prisma
model CategoryRequirement {
  id          String  @id @db.Uuid
  category    String  @db.VarChar(2)    // A-K
  gender      String  @db.VarChar(1)    // M or K
  testNumber  Int                        // 1-20
  requirement Decimal @db.Decimal(10,2)
  unit        String  @db.VarChar(50)
  comparison  String  @db.VarChar(10)   // >= or <=
}
```

### Test & TestResult
```prisma
model Test {
  id            String   @id @db.Uuid
  testNumber    Int      // 1-20
  name          String
  category      String   // distance, speed, approach, physical, short_game, on_course
  testType      String
  testDetails   Json
  isActive      Boolean
  results       TestResult[]
}

model TestResult {
  id              String   @id @db.Uuid
  testId          String   @db.Uuid
  playerId        String   @db.Uuid
  testDate        DateTime
  value           Decimal
  pei             Decimal?
  categoryBenchmark Boolean
  improvementFromLast Decimal?
}
```

### Achievement & PlayerAchievement
```prisma
model Achievement {
  id          String  @id @db.Uuid
  category    String  // consistency, volume, improvement, milestone, special
  name        String
  description String
  icon        String
  levels      Json    // Array of { level, requirement, title, xp, color }
}

model PlayerAchievement {
  id            String   @id @db.Uuid
  playerId      String   @db.Uuid
  achievementId String   @db.Uuid
  level         Int
  earnedAt      DateTime
  xpEarned      Int
}
```

---

## 9. Key Files in Codebase

| Purpose | File Path |
|---------|-----------|
| **KONFIG: Alle Testkrav** | `docs/CONFIG_KATEGORI_KRAV.md` |
| Master Test Documentation | `docs/DATABASE_FORMLER_KOMPLETT.md` |
| Category Requirements | `apps/api/prisma/seeds/category-requirements.ts` |
| Test Types | `apps/api/src/domain/tests/types.ts` |
| Test Calculations | `apps/api/src/domain/tests/calculations/*.ts` |
| Achievement Definitions | `apps/api/src/domain/achievements/achievement-definitions.ts` |
| Test Service | `apps/api/src/api/v1/tests/service.ts` |
| DataGolf/SG Stats | `apps/api/src/api/v1/datagolf/types.ts` |
| Prisma Schema | `apps/api/prisma/schema.prisma` |

---

## 10. Common Tasks

### Calculate Category Progression Gap
```typescript
// Example: D → C for a male player on Test 1 (Driver Carry)
const currentReq = 240; // D requirement
const targetReq = 250;  // C requirement
const gap = targetReq - currentReq; // 10 meters improvement needed
```

### Check if Badge is Earned (with scaling)
```typescript
function isBadgeEarned(
  baseRequirement: number,
  playerCategory: string,
  currentValue: number
): boolean {
  const scaledReq = getScaledRequirement(baseRequirement, playerCategory);
  return currentValue >= scaledReq;
}
```

### Calculate Progress Percentage
```typescript
function getProgress(
  baseRequirement: number,
  playerCategory: string,
  currentValue: number
): number {
  const scaledReq = getScaledRequirement(baseRequirement, playerCategory);
  return Math.min(100, (currentValue / scaledReq) * 100);
}
```

---

## 11. Example Scenarios

### Scenario 1: D-Player Badge Progress
**Player:** Category D, Male
**Badge:** "100 Hours" (Time Champion Level 4)
**Scaled Requirement:** 100 × 0.85 = 85 hours
**Current Hours:** 60
**Progress:** 60/85 = 70.6%

### Scenario 2: Category Progression D → C
**Requirements to pass:**
- Test 1 (Driver Carry): 240m → 250m (+10m)
- Test 5 (Club Speed): 169 km/h → 177 km/h (+8 km/h)
- Test 12 (Benkpress): 110kg → 120kg (+10kg)
- Test 13 (Trapbar Markløft): 155kg → 170kg (+15kg)
- Score average within C-level range (2-5 handicap equivalent)

### Scenario 3: K-Player Earning First Badge
**Player:** Category K, Female
**Badge:** "Training Warrior Level 1" (10 sessions)
**Scaled Requirement:** 10 × 0.30 = 3 sessions
**XP Earned:** 100 × 1.5 = 150 XP

---

## 12. Integration Points

### Frontend Components
- `apps/web/src/features/achievements/` - Badge UI components
- `apps/web/src/features/tests/` - Test result components
- `apps/web/src/features/progress/` - Progress tracking

### API Endpoints
- `GET /api/v1/players/:id/achievements` - Player badges
- `GET /api/v1/players/:id/tests/progress` - Test progress
- `POST /api/v1/tests/results` - Record test result
- `GET /api/v1/category-requirements` - Get requirements

---

## Usage Instructions

When working with this system:

1. **For category progression:** Use actual test requirements from `category-requirements.ts`
2. **For badge scaling:** Apply multiplier based on player category
3. **For XP calculations:** Use reverse scaling (lower category = higher XP)
4. **For test evaluation:** Check comparison operator (<= for PEI, >= for most others)
5. **For progression checks:** Verify 2/3 physical + 4/7 benchmark + score consistency
