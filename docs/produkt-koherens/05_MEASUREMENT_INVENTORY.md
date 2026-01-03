# Måle-inventar: Tester, Metrics og Data

> Komplett oversikt over hva systemet faktisk måler og når.

**Kilder:**
- `apps/api/src/domain/tests/` - Testdefinisjoner
- `apps/api/src/domain/gamification/types.ts` - Metrics
- `apps/api/src/domain/breaking-points/` - Breaking points

---

## 1. Golf-tester (20 totalt)

### Distanse & Hastighet (Test 1-7)

| Test | Navn | Input | Output | Enhet |
|------|------|-------|--------|-------|
| 1 | Driver Distance | 6 slag | Avg av topp 3 | meter |
| 2 | 3-Wood Distance | 6 slag | Avg av topp 3 | meter |
| 3 | 5-Iron Distance | 6 slag | Avg av topp 3 | meter |
| 4 | Wedge (PW) Distance | 6 slag | Avg av topp 3 | meter |
| 5 | Club Speed Driver | 6 slag | Avg av topp 3 | km/t |
| 6 | Ball Speed Driver | 6 slag | Avg av topp 3 | km/t |
| 7 | Smash Factor | 6 slag | Avg av topp 3 | ratio |

**Formel Smash Factor:** `ball_speed / club_speed`

### Approach (Test 8-11)

| Test | Navn | Input | Output | Formel |
|------|------|-------|--------|--------|
| 8 | Approach 25m | 10 slag | PEI score | `avg_dist / 2.5` |
| 9 | Approach 50m | 10 slag | PEI score | `avg_dist / 5.0` |
| 10 | Approach 75m | 10 slag | PEI score | `avg_dist / 7.5` |
| 11 | Approach 100m | 10 slag | PEI score | `avg_dist / 10.0` |

**PEI (Precision Efficiency Index):** Lavere = bedre. 1.0 = treffer "ideell" avstand.

### Fysisk (Test 12-14)

| Test | Navn | Måling | Enhet | Retning |
|------|------|--------|-------|---------|
| 12 | Bench Press 1RM | Max løft | kg | Høyere = bedre |
| 13 | Trap Bar Deadlift 1RM | Max løft | kg | Høyere = bedre |
| 14 | 3000m Treadmill | Tid | sekunder | Lavere = bedre |

### Short Game (Test 15-18)

| Test | Navn | Input | Output | Enhet |
|------|------|-------|--------|-------|
| 15 | Putting 3m | 10 putter | Suksessrate | % |
| 16 | Putting 6m | 10 putter | Suksessrate | % |
| 17 | Chipping | 10 chips | Avg avstand fra hull | cm |
| 18 | Bunker | 10 slag | Avg avstand fra hull | cm |

### On-Course (Test 19-20)

| Test | Navn | Format | Primær metric | Sekundære metrics |
|------|------|--------|---------------|-------------------|
| 19 | 9-Hole Simulation | 9 hull | Score to Par | FIR%, GIR%, Avg Putts, Up&Down% |
| 20 | On-Course Skills | 3-6 hull | Score to Par | FIR%, GIR%, Scrambling%, Penalties |

---

## 2. Breaking Point Tracking

### Status-flow

```
not_started → identified → in_progress → awaiting_proof → resolved
                              ↓                              ↓
                           regressed ←─────────────────── regressed
```

### Metrics per Breaking Point

| Felt | Beskrivelse | Oppdateres når |
|------|-------------|----------------|
| `severity` | low/medium/high | Ved opprettelse |
| `effortPercent` | 0-100 | Økt fullført |
| `progressPercent` | 0-100 | Test bestått |
| `status` | Se flow over | Automatisk |
| `hoursPerWeek` | 2/3/4 (basert på severity) | Ved opprettelse |

### Severity → Timer

| Severity | Avvik fra target | Timer/uke |
|----------|-----------------|-----------|
| Low | 5-10% | 2 |
| Medium | 10-15% | 3 |
| High | >15% | 4 |

---

## 3. Gamification Metrics (100+)

### Volum

| Metric | Beskrivelse |
|--------|-------------|
| `totalTrainingHours` | Totalt treningstimer |
| `totalSessions` | Antall økter |
| `completionRate` | Gjennomføringsrate % |
| `totalSwings` | Totalt antall slag |
| `totalDrills` | Antall drills fullført |
| `weeklyHours` | Timer denne uken |
| `monthlyHours` | Timer denne måneden |
| `yearlyHours` | Timer dette året |

### Hastighet

| Metric | Beskrivelse |
|--------|-------------|
| `driverSpeed` | Driver-hastighet (mph) |
| `ironSpeed` | 7-jern hastighet (mph) |
| `wedgeSpeed` | Wedge-hastighet (mph) |
| `driverBaselineSpeed` | Baseline-hastighet |
| `speedImprovement` | Forbedring fra baseline |
| `ballSpeed` | Ball-hastighet |
| `smashFactor` | Ball/club ratio |
| `launchAngle` | Launch-vinkel |
| `spinRate` | Spin-rate |

### Presisjon

| Metric | Beskrivelse |
|--------|-------------|
| `fairwayHitPercent` | Fairway hit % |
| `avgDrivingDistance` | Avg driving distanse |
| `drivingDispersion` | Standardavvik |
| `girPercent` | Green in Regulation % |
| `avgProximity` | Avg avstand til hull |
| `proximityFrom100` | Proximity fra 100 yards |
| `proximityFrom150` | Proximity fra 150 yards |

### Putting

| Metric | Beskrivelse |
|--------|-------------|
| `avgPuttsPerRound` | Avg putter per runde |
| `onePuttPercent` | 1-putt % |
| `threePuttPercent` | 3-putt % |
| `makeRateInside3ft` | Make rate <3ft |
| `makeRate3to6ft` | Make rate 3-6ft |
| `makeRate6to10ft` | Make rate 6-10ft |
| `makeRate10to20ft` | Make rate 10-20ft |
| `makeRateOver20ft` | Make rate >20ft |
| `avgFirstPuttDistance` | Avg lag-putt avstand |

### Short Game

| Metric | Beskrivelse |
|--------|-------------|
| `upAndDownPercent` | Up & Down % |
| `sandSavePercent` | Sand save % |
| `scramblingPercent` | Scrambling % |
| `proximityFrom50` | Proximity fra 50 yards |
| `proximityFrom30` | Proximity fra 30 yards |
| `chipProximity` | Chip proximity |

### Styrke

| Metric | Beskrivelse |
|--------|-------------|
| `totalTonnage` | Totalt løftet (kg) |
| `weeklyTonnage` | Ukentlig tonnage |
| `monthlyTonnage` | Månedlig tonnage |
| `bodyweight` | Kroppsvekt |
| `personalRecords` | Antall PRs |
| `relativeSquat` | Knebøy/kroppsvekt |
| `relativeDeadlift` | Markløft/kroppsvekt |
| `relativeBench` | Benkpress/kroppsvekt |
| `medBallThrow` | Med ball kast |
| `verticalJump` | Vertikalsprang |
| `broadJump` | Lengdehopp |
| `hipRotationL/R` | Hofterotasjon |
| `thoracicRotation` | Thorax-rotasjon |
| `shoulderMobility` | Skuldermobilitet |
| `singleLegBalanceL/R` | Enbeins balanse |
| `plankHold` | Planke-hold |

### Streaks & Konsistens

| Metric | Beskrivelse |
|--------|-------------|
| `currentStreak` | Nåværende streak (dager) |
| `longestStreak` | Lengste streak |
| `perfectWeeks` | Uker med 100% gjennomføring |
| `earlyMorningSessions` | Økter før 09:00 |
| `eveningSessions` | Økter etter 19:00 |
| `weekendSessions` | Helge-økter |
| `consistencyScore` | Konsistens-score 0-100 |
| `lastActiveDate` | Sist aktiv |

### Scoring

| Metric | Beskrivelse |
|--------|-------------|
| `best18HoleScore` | Beste 18-hulls score |
| `best9HoleScore` | Beste 9-hulls score |
| `avgScoreAllTime` | Avg score (alle runder) |
| `avgScoreLast10` | Avg score (siste 10) |
| `avgScoreLast20` | Avg score (siste 20) |
| `roundsUnder80` | Runder under 80 |
| `roundsUnder75` | Runder under 75 |
| `roundsUnder70` | Runder under 70 |
| `roundsUnderPar` | Runder under par |
| `currentHandicap` | Nåværende HCP |
| `lowHandicap` | Laveste HCP |
| `handicapTrend` | HCP-trend |
| `totalRoundsPlayed` | Totalt runder |
| `competitiveRounds` | Konkurranserunder |
| `casualRounds` | Casual runder |

---

## 4. Målefrekvens

| Type | Frekvens | Hvem |
|------|----------|------|
| Økter | Real-time | Spiller logger |
| Tester | Sporadisk (benchmark) | Spiller/trener |
| Breaking points | Automatisk | System |
| Gamification | On-demand | System |
| Kategori-sjekk | Ved test | System |

---

## 5. Data-kilder

| Datapunkt | Kilde | Frivillig/Påkrevd |
|-----------|-------|-------------------|
| Økt-gjennomføring | Spiller | Påkrevd for tracking |
| Testresultater | Spiller/trener | Frivillig |
| Video | Spiller | Frivillig |
| Tracker-data | Import | Frivillig |
| Turneringsresultater | Trener | Påkrevd for status |

---

## 6. Kobling: Test → Domain → Session

| Test | Domain | Sessions som trener dette |
|------|--------|---------------------------|
| 1, 5, 6, 7 | TEE | Driver Introduksjon, Ball Striking |
| 2, 3 | INN150 | Hybridkølle Intro, Ball Striking |
| 4 | INN100 | Jern Grunnkurs, Ball Striking |
| 8, 9 | INN50 | Pitch Introduksjon |
| 10, 11 | INN100 | Jern Grunnkurs |
| 12, 13, 14 | PHYS | Alle Physical sessions |
| 15, 16 | PUTT | Putting Fundamenter |
| 17, 18 | ARG | Chipping, Bunker, Short Game |
| 19, 20 | (blandet) | On-Course sessions |

---

*Sist oppdatert: 2026-01-02*
