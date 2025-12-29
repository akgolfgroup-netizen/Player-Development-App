# Database Formler - Komplett Oversikt
> IUP Golf Academy - Alle formler for test-database implementering
> Versjon: 1.0 | Dato: 15. desember 2025

---

## 📋 INNHOLDSFORTEGNELSE

1. [20 Team Norway Tester - Formler](#1-20-team-norway-tester)
2. [Kategori-system Formler](#2-kategori-system-formler)
3. [Progressjons-formler](#3-progressjons-formler)
4. [Dashboard-beregninger](#4-dashboard-beregninger)
5. [Trener-verktøy Formler](#5-trener-verktøy-formler)
6. [Database Implementering](#6-database-implementering)

---

# 1. 20 TEAM NORWAY TESTER

## Test 1: Driver Avstand (Carry)

### Beskrivelse
Måler carry distance (ikke total distance) for driver

### Måleenhet
Meter (m)

### Testprotokoll
- 6 slag med driver
- Beste 3 av 6 slag teller
- Gjennomsnitt av de 3 beste

### Formel
```
driver_carry = AVG(TOP 3 OF 6 shots)
```

### Kategori-krav (Menn)

| Kategori | Krav (meter) | Clubspeed (mph) | Smash Factor |
|----------|--------------|-----------------|--------------|
| A | 270+ | 120+ | 1.48+ |
| B | 260+ | 115+ | 1.46+ |
| C | 250+ | 110+ | 1.44+ |
| D | 240+ | 105+ | 1.42+ |
| E | 230+ | 100+ | 1.40+ |
| F | 220+ | 95+ | 1.38+ |
| G | 210+ | 90+ | 1.36+ |
| H | 200+ | 85+ | 1.34+ |
| I | 190+ | 80+ | 1.32+ |
| J | Aldersbasert | 70-95 | 1.30+ |
| K | Aldersbasert | 60-80 | 1.28+ |

### Kategori-krav (Kvinner)

| Kategori | Krav (meter) | Clubspeed (mph) | Smash Factor |
|----------|--------------|-----------------|--------------|
| A | 240+ | 105+ | 1.48+ |
| B | 230+ | 100+ | 1.46+ |
| C | 220+ | 95+ | 1.44+ |
| D | 210+ | 90+ | 1.42+ |
| E | 200+ | 85+ | 1.40+ |
| F | 190+ | 80+ | 1.38+ |
| G | 180+ | 75+ | 1.36+ |
| H | 170+ | 70+ | 1.34+ |
| I | 160+ | 65+ | 1.32+ |

### Database-felter
```typescript
{
  test_id: UUID,
  player_id: UUID,
  test_date: DATE,
  results: {
    shots: [265, 270, 268, 262, 271, 269], // 6 shots
    top_3: [271, 270, 269],
    average_carry: 270.0,
    clubspeed_mph: 118,
    ball_speed_mph: 174.6,
    smash_factor: 1.48,
    launch_angle: 12.5,
    spin_rate: 2400
  },
  category_requirement: 270,
  passed: true,
  improvement_from_last: +5.0
}
```

---

## Test 2: Jern 7 Avstand (Carry)

### Beskrivelse
Måler carry distance for jern 7

### Måleenhet
Meter (m)

### Testprotokoll
- 6 slag med jern 7
- Beste 3 av 6 slag teller
- Gjennomsnitt av de 3 beste

### Formel
```
iron7_carry = AVG(TOP 3 OF 6 shots)
```

### Kategori-krav (Menn)

| Kategori | Krav (meter) |
|----------|--------------|
| A | 175+ |
| B | 170+ |
| C | 165+ |
| D | 160+ |
| E | 155+ |
| F | 150+ |
| G | 145+ |
| H | 140+ |
| I | 135+ |

### Kategori-krav (Kvinner)

| Kategori | Krav (meter) |
|----------|--------------|
| A | 150+ |
| B | 145+ |
| C | 140+ |
| D | 135+ |
| E | 130+ |
| F | 125+ |
| G | 120+ |
| H | 115+ |

### Database-felter
```typescript
{
  results: {
    shots: [162, 165, 164, 160, 166, 163],
    top_3: [166, 165, 164],
    average_carry: 165.0,
    clubspeed_mph: 87,
    smash_factor: 1.36
  },
  category_requirement: 165,
  passed: true
}
```

---

## Test 3: Jern 7 Nøyaktighet

### Beskrivelse
Måler spredning til target med jern 7

### Måleenhet
Meter (m) - gjennomsnittlig avstand fra target

### Testprotokoll
- 6 slag til target (150m for kategori D)
- Mål avstand fra target for hvert slag
- Beregn gjennomsnittlig avvik

### Formel
```
accuracy_score = AVG(distance_from_target for 6 shots)
```

### Kategori-krav (Menn)

| Kategori | Target distanse | Maks avg avvik |
|----------|----------------|----------------|
| A | 175m | 6.0m |
| B | 170m | 7.0m |
| C | 165m | 8.0m |
| D | 160m | 9.0m |
| E | 155m | 10.0m |
| F | 150m | 12.0m |
| G | 145m | 14.0m |
| H | 140m | 16.0m |

### Prosent-score formel
```
accuracy_percent = (1 - (avg_deviation / target_distance)) * 100
```

### Database-felter
```typescript
{
  results: {
    target_distance: 160,
    shots: [
      { distance_from_target: 8.5, direction: "right" },
      { distance_from_target: 9.2, direction: "left" },
      { distance_from_target: 7.8, direction: "long" },
      { distance_from_target: 10.1, direction: "short" },
      { distance_from_target: 8.9, direction: "right" },
      { distance_from_target: 9.5, direction: "long" }
    ],
    average_deviation: 9.0,
    accuracy_percent: 94.4,
    dispersion_pattern: "slight_right_bias"
  },
  category_requirement: 9.0,
  passed: true
}
```

---

## Test 4: Wedge PEI (Precision Efficiency Index)

### Beskrivelse
Måler presisjon med wedge fra ulike distanser

### Måleenhet
PEI-score (decimal)

### Testprotokoll
- 18 slag (3 slag fra hver av 6 distanser)
- Distanser: 50m, 60m, 70m, 80m, 90m, 100m
- Mål avstand fra hull for hvert slag
- Beregn PEI

### PEI-formel
```
PEI = (Gjennomsnittlig avstand fra hull) / (Ideal approach-distanse for kategorien)
```

### Detaljert beregning
```typescript
// Step 1: Beregn gjennomsnittlig avstand fra hull for alle 18 slag
avg_distance_to_pin = SUM(all 18 shots) / 18

// Step 2: Finn ideal approach-distanse for spillerens kategori
ideal_approach_distance = CATEGORY_TABLE[player_category]

// Step 3: Beregn PEI
PEI = avg_distance_to_pin / ideal_approach_distance
```

### Ideal Approach-distanse per kategori

| Kategori | Ideal distanse (m) |
|----------|--------------------|
| A | 100 |
| B | 110 |
| C | 120 |
| D | 140 |
| E | 160 |
| F | 180 |
| G | 200 |
| H | 220 |

### PEI Tolkning

| PEI-score | Vurdering |
|-----------|-----------|
| <0.05 | Utmerket |
| 0.05-0.07 | Bra |
| 0.07-0.10 | Gjennomsnitt |
| >0.10 | Svakt område (bruddpunkt) |

### Kategori-krav (PEI-maks)

| Kategori | Maks PEI |
|----------|----------|
| A | 0.05 |
| B | 0.06 |
| C | 0.07 |
| D | 0.08 |
| E | 0.10 |
| F | 0.12 |
| G | 0.14 |

### Database-felter
```typescript
{
  results: {
    shots_by_distance: {
      "50m": [3.2, 4.1, 3.8],
      "60m": [4.5, 5.2, 4.9],
      "70m": [5.8, 6.1, 5.5],
      "80m": [7.2, 6.8, 7.5],
      "90m": [8.5, 9.1, 8.8],
      "100m": [10.2, 9.8, 10.5]
    },
    total_shots: 18,
    average_distance_to_pin: 6.7,
    ideal_approach_distance: 140,
    pei_score: 0.048,
    assessment: "Utmerket"
  },
  category_requirement: 0.08,
  passed: true,
  pei: 0.048
}
```

---

## Test 5: Lag-kontroll Putting

### Beskrivelse
Måler evne til å kontrollere distanse på putts

### Måleenhet
Poeng (0-9)

### Testprotokoll
- 9 putts totalt (3 distanser x 3 forsøk)
- Distanser: 3m, 6m, 9m
- Scoring: 1 poeng hvis putt stopper innenfor 90cm fra hullet
- Maks score: 9 poeng

### Formel
```
lag_control_score = SUM(points for all 9 putts)
lag_control_percent = (lag_control_score / 9) * 100
```

### Kategori-krav

| Kategori | Min poeng | Min prosent |
|----------|-----------|-------------|
| A | 8 | 89% |
| B | 7 | 78% |
| C | 6 | 67% |
| D | 5 | 56% |
| E | 4 | 44% |
| F | 3 | 33% |

### Database-felter
```typescript
{
  results: {
    putts_3m: [
      { stopped_distance_from_hole: 0.45, within_90cm: true, points: 1 },
      { stopped_distance_from_hole: 0.68, within_90cm: true, points: 1 },
      { stopped_distance_from_hole: 1.15, within_90cm: false, points: 0 }
    ],
    putts_6m: [
      { stopped_distance_from_hole: 0.72, within_90cm: true, points: 1 },
      { stopped_distance_from_hole: 0.88, within_90cm: true, points: 1 },
      { stopped_distance_from_hole: 0.55, within_90cm: true, points: 1 }
    ],
    putts_9m: [
      { stopped_distance_from_hole: 0.95, within_90cm: false, points: 0 },
      { stopped_distance_from_hole: 0.82, within_90cm: true, points: 1 },
      { stopped_distance_from_hole: 0.79, within_90cm: true, points: 1 }
    ],
    total_points: 7,
    total_putts: 9,
    success_rate: 77.8
  },
  category_requirement: 6,
  passed: true
}
```

---

## Test 6: Lesing Putting

### Beskrivelse
Måler evne til å lese break på putts

### Måleenhet
Poeng (0-6)

### Testprotokoll
- 6 putts med break (3 meter)
- 2 høyre-breaks, 2 venstre-breaks, 2 dobbel-breaks
- Scoring: 1 poeng per putt som går i hull
- Maks score: 6 poeng

### Formel
```
reading_score = SUM(holed_putts)
reading_percent = (reading_score / 6) * 100
```

### Kategori-krav

| Kategori | Min poeng | Min prosent |
|----------|-----------|-------------|
| A | 5 | 83% |
| B | 4 | 67% |
| C | 3 | 50% |
| D | 3 | 50% |
| E | 2 | 33% |
| F | 2 | 33% |

### Database-felter
```typescript
{
  results: {
    putts: [
      { distance: 3.0, break_type: "right", break_inches: 12, holed: true, points: 1 },
      { distance: 3.0, break_type: "right", break_inches: 8, holed: false, points: 0 },
      { distance: 3.0, break_type: "left", break_inches: 10, holed: true, points: 1 },
      { distance: 3.0, break_type: "left", break_inches: 14, holed: true, points: 1 },
      { distance: 3.0, break_type: "double", break_inches: 16, holed: false, points: 0 },
      { distance: 3.0, break_type: "double", break_inches: 12, holed: true, points: 1 }
    ],
    total_holed: 4,
    success_rate: 66.7
  },
  category_requirement: 3,
  passed: true
}
```

---

## Test 7: Bunker

### Beskrivelse
Måler evne til å slå fra bunker

### Måleenhet
Prosent (%)

### Testprotokoll
- 10 slag fra greenside bunker
- Pin-posisjon varierer
- Mål: Få ball innenfor 3 meter fra hull
- Scoring: Prosent av slag innenfor 3m

### Formel
```
bunker_success_rate = (shots_within_3m / 10) * 100
```

### Kategori-krav

| Kategori | Min prosent |
|----------|-------------|
| A | 80% |
| B | 70% |
| C | 60% |
| D | 50% |
| E | 40% |
| F | 30% |

### Database-felter
```typescript
{
  results: {
    shots: [
      { distance_to_pin: 2.5, within_3m: true },
      { distance_to_pin: 1.8, within_3m: true },
      { distance_to_pin: 4.2, within_3m: false },
      { distance_to_pin: 2.9, within_3m: true },
      { distance_to_pin: 3.5, within_3m: false },
      { distance_to_pin: 1.5, within_3m: true },
      { distance_to_pin: 2.2, within_3m: true },
      { distance_to_pin: 2.7, within_3m: true },
      { distance_to_pin: 3.8, within_3m: false },
      { distance_to_pin: 2.0, within_3m: true }
    ],
    total_within_3m: 7,
    success_rate: 70.0,
    average_distance: 2.71
  },
  category_requirement: 50,
  passed: true
}
```

---

## Test 8: Klubbfart Driver

### Beskrivelse
Måler clubspeed med driver

### Måleenhet
Miles per hour (mph)

### Testprotokoll
- 6 slag med driver
- Registrer clubspeed for hvert slag
- Beste 3 av 6 teller
- Gjennomsnitt av beste 3

### Formel
```
clubspeed = AVG(TOP 3 OF 6 swings)
```

### Kategori-krav (se Test 1 tabell)

### Database-felter
```typescript
{
  results: {
    swings: [118, 120, 119, 117, 121, 119],
    top_3: [121, 120, 119],
    average_clubspeed: 120.0,
    max_clubspeed: 121
  },
  category_requirement: 120,
  passed: true
}
```

---

## Test 9: Smash Factor Driver

### Beskrivelse
Måler effektivitet i energy transfer fra klubbe til ball

### Måleenhet
Ratio (ball speed / club speed)

### Testprotokoll
- 6 slag med driver
- Mål både clubspeed og ball speed
- Beste 3 av 6 teller
- Gjennomsnitt av beste 3

### Formel
```
smash_factor = ball_speed_mph / club_speed_mph

avg_smash_factor = AVG(TOP 3 smash_factors)
```

### Optimal Smash Factor
- Maximum teoretisk: 1.50
- PGA Tour gjennomsnitt: 1.48-1.50
- God amatør: 1.40-1.45

### Kategori-krav (se Test 1 tabell)

### Database-felter
```typescript
{
  results: {
    shots: [
      { club_speed: 118, ball_speed: 174, smash_factor: 1.47 },
      { club_speed: 120, ball_speed: 178, smash_factor: 1.48 },
      { club_speed: 119, ball_speed: 176, smash_factor: 1.48 },
      { club_speed: 117, ball_speed: 172, smash_factor: 1.47 },
      { club_speed: 121, ball_speed: 180, smash_factor: 1.49 },
      { club_speed: 119, ball_speed: 177, smash_factor: 1.49 }
    ],
    top_3: [1.49, 1.49, 1.48],
    average_smash_factor: 1.487
  },
  category_requirement: 1.48,
  passed: true
}
```

---

## Test 10: Launch Angle Driver

### Beskrivelse
Måler vertikal vinkel ved ball-launch

### Måleenhet
Grader (°)

### Testprotokoll
- 6 slag med driver
- Mål launch angle for hvert slag
- Beste 3 av 6 teller
- Gjennomsnitt av beste 3

### Formel
```
launch_angle_avg = AVG(TOP 3 OF 6 shots)
```

### Optimal Launch Angle

| Clubspeed (mph) | Optimal Launch (°) | Range |
|-----------------|-------------------|-------|
| 120+ | 10-13° | 9-14° |
| 110-119 | 11-14° | 10-15° |
| 100-109 | 12-15° | 11-16° |
| 90-99 | 13-16° | 12-17° |
| 80-89 | 14-17° | 13-18° |

### Database-felter
```typescript
{
  results: {
    shots: [
      { launch_angle: 12.5, carry: 270 },
      { launch_angle: 13.2, carry: 272 },
      { launch_angle: 12.8, carry: 271 },
      { launch_angle: 11.9, carry: 268 },
      { launch_angle: 13.5, carry: 273 },
      { launch_angle: 12.7, carry: 270 }
    ],
    top_3: [13.5, 13.2, 12.8],
    average_launch_angle: 13.17,
    optimal_range: "10-13",
    within_optimal: true
  }
}
```

---

## Test 11: Spin Rate Driver

### Beskrivelse
Måler backspin på driver

### Måleenhet
Revolutions per minute (rpm)

### Testprotokoll
- 6 slag med driver
- Mål spin rate for hvert slag
- Beste 3 av 6 teller (basert på carry)
- Gjennomsnitt av beste 3

### Formel
```
spin_rate_avg = AVG(TOP 3 spin_rates)
```

### Optimal Spin Rate

| Clubspeed (mph) | Optimal Spin (rpm) | Range |
|-----------------|-------------------|-------|
| 120+ | 2200-2500 | 2000-2700 |
| 110-119 | 2400-2700 | 2200-2900 |
| 100-109 | 2600-2900 | 2400-3100 |
| 90-99 | 2800-3100 | 2600-3300 |
| 80-89 | 3000-3300 | 2800-3500 |

### Database-felter
```typescript
{
  results: {
    shots: [
      { spin_rate: 2450, carry: 270, total_distance: 285 },
      { spin_rate: 2520, carry: 272, total_distance: 287 },
      { spin_rate: 2380, carry: 271, total_distance: 286 },
      { spin_rate: 2600, carry: 268, total_distance: 283 },
      { spin_rate: 2490, carry: 273, total_distance: 288 },
      { spin_rate: 2430, carry: 270, total_distance: 285 }
    ],
    top_3: [2490, 2520, 2380],
    average_spin_rate: 2463,
    optimal_range: "2200-2500",
    within_optimal: true
  }
}
```

---

## Test 12: Benkpress

### Beskrivelse
Måler øvre kropps styrke

### Måleenhet
Kilogram (kg) - 1 Repetition Maximum (1RM)

### Testprotokoll
- Oppvarming: 3 sett med økende vekt
- Test: Finn 1RM innen 3-5 forsøk
- Må være korrekt teknikk (full range of motion)

### Formel
```
bench_press_1rm = MAX(successful_lift_weight)
```

### Estimert 1RM fra flere reps
```
estimated_1rm = weight_lifted / (1.0278 - (0.0278 * reps))
```

### Kategori-krav (Menn)

| Kategori | 1RM (kg) |
|----------|----------|
| A | 140+ |
| B | 130+ |
| C | 120+ |
| D | 110+ |
| E | 100+ |
| F | 90+ |
| G | 80+ |
| H | 70+ |

### Kategori-krav (Kvinner)

| Kategori | 1RM (kg) |
|----------|----------|
| A | 100+ |
| B | 90+ |
| C | 80+ |
| D | 70+ |
| E | 60+ |
| F | 50+ |
| G | 45+ |
| H | 40+ |

### Database-felter
```typescript
{
  results: {
    warmup: [
      { weight: 60, reps: 8 },
      { weight: 80, reps: 5 },
      { weight: 100, reps: 3 }
    ],
    max_attempts: [
      { weight: 115, successful: true },
      { weight: 120, successful: true },
      { weight: 125, successful: false }
    ],
    one_rep_max: 120,
    bodyweight: 78,
    relative_strength: 1.54
  },
  category_requirement: 110,
  passed: true
}
```

---

## Test 13: Markløft Trapbar

### Beskrivelse
Måler nedre kropps og core styrke

### Måleenhet
Kilogram (kg) - 1 Repetition Maximum (1RM)

### Testprotokoll
- Oppvarming: 3 sett med økende vekt
- Test: Finn 1RM innen 3-5 forsøk
- Bruk trap bar (hex bar)

### Formel
```
trap_bar_deadlift_1rm = MAX(successful_lift_weight)
```

### Kategori-krav (Menn)

| Kategori | 1RM (kg) |
|----------|----------|
| A | 200+ |
| B | 185+ |
| C | 170+ |
| D | 155+ |
| E | 140+ |
| F | 125+ |
| G | 110+ |
| H | 95+ |

### Kategori-krav (Kvinner)

| Kategori | 1RM (kg) |
|----------|----------|
| A | 140+ |
| B | 130+ |
| C | 120+ |
| D | 110+ |
| E | 100+ |
| F | 90+ |
| G | 80+ |
| H | 70+ |

### Database-felter
```typescript
{
  results: {
    warmup: [
      { weight: 80, reps: 6 },
      { weight: 120, reps: 4 },
      { weight: 140, reps: 2 }
    ],
    max_attempts: [
      { weight: 160, successful: true },
      { weight: 170, successful: true },
      { weight: 180, successful: false }
    ],
    one_rep_max: 170,
    bodyweight: 78,
    relative_strength: 2.18
  },
  category_requirement: 155,
  passed: true
}
```

---

## Test 14: Rotasjonskast 4kg Medisinball

### Beskrivelse
Måler rotasjonskraft og power

### Måleenhet
Meter (m)

### Testprotokoll
- 4kg medisinball
- Kast fra golf-setup posisjon
- Roter som i golf swing
- 3 kast per side (høyre og venstre)
- Beste kast per side telles

### Formel
```
rotation_power_right = MAX(3 throws_right)
rotation_power_left = MAX(3 throws_left)
rotation_power_avg = (rotation_power_right + rotation_power_left) / 2
```

### Asymmetri-beregning
```
asymmetry_percent = ABS(right - left) / MAX(right, left) * 100
```

### Kategori-krav (Menn)

| Kategori | Gjennomsnitt (m) | Maks asymmetri |
|----------|------------------|----------------|
| A | 12.0+ | <10% |
| B | 11.0+ | <12% |
| C | 10.0+ | <15% |
| D | 9.0+ | <18% |
| E | 8.0+ | <20% |
| F | 7.0+ | <25% |

### Kategori-krav (Kvinner)

| Kategori | Gjennomsnitt (m) | Maks asymmetri |
|----------|------------------|----------------|
| A | 10.0+ | <10% |
| B | 9.0+ | <12% |
| C | 8.0+ | <15% |
| D | 7.0+ | <18% |
| E | 6.0+ | <20% |
| F | 5.0+ | <25% |

### Database-felter
```typescript
{
  results: {
    throws_right: [9.5, 10.2, 9.8],
    throws_left: [9.2, 9.9, 9.6],
    best_right: 10.2,
    best_left: 9.9,
    average: 10.05,
    asymmetry_percent: 2.9,
    asymmetry_assessment: "Excellent balance"
  },
  category_requirement: 9.0,
  passed: true
}
```

---

## Test 15: Pressure Putting

### Beskrivelse
Måler putting-prestasjon under press

### Måleenhet
Prosent (%)

### Testprotokoll
- 10 putts fra 2 meter
- Eliminering-format: Miss = ute
- Sammenlign med baseline (samme test uten press)
- Mål reduksjon i prestasjon

### Formel
```
baseline_score = (holed_putts_baseline / 10) * 100
pressure_score = (holed_putts_pressure / 10) * 100
pressure_impact = baseline_score - pressure_score
pressure_ratio = pressure_score / baseline_score
```

### Kategori-krav

| Kategori | Min pressure_score | Maks impact |
|----------|-------------------|-------------|
| A | 90%+ | <5% |
| B | 80%+ | <10% |
| C | 70%+ | <15% |
| D | 60%+ | <20% |
| E | 50%+ | <25% |

### Database-felter
```typescript
{
  results: {
    baseline_session: {
      total_putts: 10,
      holed: 9,
      success_rate: 90.0
    },
    pressure_session: {
      putts: [
        { putt_number: 1, holed: true },
        { putt_number: 2, holed: true },
        { putt_number: 3, holed: true },
        { putt_number: 4, holed: true },
        { putt_number: 5, holed: true },
        { putt_number: 6, holed: true },
        { putt_number: 7, holed: false, eliminated: true }
      ],
      total_putts: 7,
      holed: 6,
      success_rate: 60.0
    },
    pressure_impact: 30.0,
    pressure_ratio: 0.67,
    assessment: "Significant pressure impact - needs work"
  },
  category_requirement: 60,
  passed: true
}
```

---

## Test 16: Pre-shot Rutine Konsistens

### Beskrivelse
Måler konsistens i pre-shot rutine

### Måleenhet
Prosent (%)

### Testprotokoll
- Video 18 hull
- Analyser pre-shot rutine for hvert slag
- Mål: Tid (±2 sek), Bevegelser (samme sekvens), Fokuspunkter
- Beregn konsistens-prosent

### Formel
```
consistency_score = (consistent_routines / 18) * 100

Per slag scoring:
- Tid innenfor ±2 sek av baseline: +33.3%
- Samme bevegelsessekvens: +33.3%
- Samme fokuspunkter: +33.3%
- Total: 0-100% per slag
```

### Kategori-krav

| Kategori | Min konsistens |
|----------|----------------|
| A | 90%+ |
| B | 80%+ |
| C | 70%+ |
| D | 60%+ |
| E-K | 50%+ |

### Database-felter
```typescript
{
  results: {
    baseline_time: 23.5, // sekunder
    shots: [
      {
        shot_number: 1,
        time: 24.0,
        time_within_range: true,
        movement_sequence_correct: true,
        focus_points_correct: true,
        consistency_score: 100
      },
      {
        shot_number: 2,
        time: 26.2,
        time_within_range: false,
        movement_sequence_correct: true,
        focus_points_correct: true,
        consistency_score: 66.7
      }
      // ... 16 more shots
    ],
    total_shots: 18,
    average_consistency: 85.2,
    assessment: "Very good routine consistency"
  },
  category_requirement: 70,
  passed: true
}
```

---

## Test 17: Fokus under Distraksjon

### Beskrivelse
Måler evne til å opprettholde fokus med distraksjoner

### Måleenhet
Prosent (%)

### Testprotokoll
- Baseline: 20 slag til target uten distraksjon
- Test: 20 slag til target med planlagte distraksjoner
- Distraksjoner: Lyd, bevegelse, kommentarer
- Sammenlign treff-prosent

### Formel
```
baseline_accuracy = (shots_on_target_baseline / 20) * 100
distraction_accuracy = (shots_on_target_distraction / 20) * 100
focus_impact = baseline_accuracy - distraction_accuracy
focus_retention = (distraction_accuracy / baseline_accuracy) * 100
```

### Kategori-krav

| Kategori | Maks reduksjon |
|----------|----------------|
| A | <5% |
| B | <10% |
| C | <15% |
| D-K | <20% |

### Database-felter
```typescript
{
  results: {
    baseline_session: {
      total_shots: 20,
      on_target: 17,
      accuracy: 85.0
    },
    distraction_session: {
      shots: [
        { shot_number: 1, distraction_type: "noise", on_target: true },
        { shot_number: 2, distraction_type: "movement", on_target: false },
        // ... 18 more
      ],
      total_shots: 20,
      on_target: 15,
      accuracy: 75.0
    },
    focus_impact: 10.0,
    focus_retention: 88.2,
    assessment: "Good focus under pressure"
  },
  category_requirement: 15,
  passed: true
}
```

---

## Test 18: Mental Toughness Questionnaire (MTQ48)

### Beskrivelse
Måler mental styrke med standardisert spørreskjema

### Måleenhet
Score (1-5 skala)

### Testprotokoll
- MTQ48 spørreskjema (48 spørsmål)
- Eller forenklet versjon (24 spørsmål)
- 4 kategorier: Challenge, Commitment, Control, Confidence

### Formel
```
MTQ_total = SUM(all_responses) / number_of_questions

Sub-scores:
MTQ_challenge = AVG(challenge_questions)
MTQ_commitment = AVG(commitment_questions)
MTQ_control = AVG(control_questions)
MTQ_confidence = AVG(confidence_questions)
```

### Tolkning

| Total Score | Vurdering |
|-------------|-----------|
| 4.5-5.0 | Excellent mental toughness |
| 4.0-4.4 | Very good |
| 3.5-3.9 | Good |
| 3.0-3.4 | Average |
| <3.0 | Needs development |

### Database-felter
```typescript
{
  results: {
    questionnaire_version: "MTQ48",
    responses: [
      { question_id: 1, category: "challenge", response: 4 },
      { question_id: 2, category: "commitment", response: 5 },
      // ... 46 more
    ],
    subscores: {
      challenge: 4.2,
      commitment: 4.5,
      control: 3.8,
      confidence: 4.0
    },
    total_score: 4.13,
    assessment: "Very good mental toughness",
    areas_to_develop: ["control", "confidence"]
  }
}
```

---

## Test 19: Klubbvalg og Risikovurdering

### Beskrivelse
Måler evne til å velge riktig klubbe og vurdere risiko

### Måleenhet
Prosent (%)

### Testprotokoll
- 20 scenarios med bilder/beskrivelser
- Spiller velger klubbe og strategi
- Sammenlign med ekspertpanel (PGA-trenere)
- Scoring: Prosent samsvar med ekspertpanel

### Formel
```
decision_quality = (optimal_decisions / 20) * 100
```

### Kategori-krav

| Kategori | Min prosent |
|----------|-------------|
| A | 85%+ |
| B | 75%+ |
| C | 65%+ |
| D-K | 50%+ |

### Database-felter
```typescript
{
  results: {
    scenarios: [
      {
        scenario_id: 1,
        description: "200m to pin, slight headwind, bunker front",
        expert_choice: "6-iron, safe line",
        player_choice: "6-iron, safe line",
        optimal: true,
        points: 1
      },
      {
        scenario_id: 2,
        description: "180m over water, back pin",
        expert_choice: "7-iron, center green",
        player_choice: "8-iron, at pin",
        optimal: false,
        points: 0
      }
      // ... 18 more
    ],
    total_scenarios: 20,
    optimal_decisions: 16,
    decision_quality: 80.0,
    risk_profile: "Balanced - good course management"
  },
  category_requirement: 65,
  passed: true
}
```

---

## Test 20: Banestrategi-planlegging

### Beskrivelse
Måler evne til å planlegge 18-hulls strategi

### Måleenhet
Kvalitativ vurdering (1-5)

### Testprotokoll
- Gis scorekort og banekart for 18 hull
- Spiller lager detaljert strategi for hvert hull
- Trener vurderer kvalitet basert på kriterier
- Scoring: 1-5 per kategori

### Vurderingskriterier
```
Kategorier (hver 1-5 poeng):
1. Risikostyring (risk vs reward)
2. Klubbvalg-logikk
3. Par-5 strategi
4. Pin-posisjon tilpasning
5. Spillbarhet (realistisk for spillernivå)

Total score = SUM(5 categories) / 5
```

### Kategori-krav

| Kategori | Min score | Beskrivelse |
|----------|-----------|-------------|
| A-C | 4.0+ | Detaljert plan |
| D-K | 3.0+ | Grunnleggende plan |

### Database-felter
```typescript
{
  results: {
    course_name: "Bogstad Golf Course",
    plan_details: {
      hole_strategies: [
        {
          hole: 1,
          par: 4,
          distance: 380,
          strategy: "Driver, wedge. Aim center fairway, avoid right bunker.",
          club_off_tee: "Driver",
          target_area: "Center fairway",
          approach_club: "54-degree wedge"
        }
        // ... 17 more holes
      ]
    },
    scoring: {
      risk_management: 4,
      club_selection_logic: 4,
      par5_strategy: 5,
      pin_position_adaptation: 3,
      playability: 4,
      total_score: 4.0
    },
    coach_feedback: "Excellent overall strategy. Work on pin position adaptation."
  },
  category_requirement: 4.0,
  passed: true
}
```

---

# 2. KATEGORI-SYSTEM FORMLER

## 2.1 Kategori-overgang Beslutning

### Hovedformel
```typescript
function canProgressToCategory(player, targetCategory) {
  // 1. 3-måneders score-regel
  const scoreCheck = checkScoreConsistency(player, targetCategory, 3months)

  // 2. Fysisk modenhet (2 av 3 tester)
  const physicalCheck = check2Of3PhysicalTests(player, targetCategory)

  // 3. Benchmark-test (4 av 7 golf-tester)
  const benchmarkCheck = checkBenchmarkTests(player, targetCategory, 4of7)

  // 4. Mental modenhet
  const mentalCheck = checkMentalMaturity(player, targetCategory)

  // Alle må være oppfylt
  return scoreCheck && physicalCheck && benchmarkCheck && mentalCheck
}
```

### 2.2 Score-konsistens Formel

```typescript
function checkScoreConsistency(player, targetCategory, months = 3) {
  const rounds = getRoundsLast3Months(player)

  // Krav: Minimum 10 tellende runder
  if (rounds.length < 10) return false

  // Beregn gjennomsnitt
  const avgScore = rounds.reduce((sum, r) => sum + r.score, 0) / rounds.length

  // Hent kategori-krav
  const categoryRange = getCategoryScoreRange(targetCategory)

  // Sjekk om gjennomsnittet er innenfor målkategorien
  const withinRange = avgScore >= categoryRange.min && avgScore <= categoryRange.max

  // Sjekk outliers (maks 2)
  const outliers = rounds.filter(r =>
    r.score < categoryRange.min - 5 || r.score > categoryRange.max + 5
  )
  const maxOutliers = outliers.length <= 2

  return withinRange && maxOutliers
}
```

### 2.3 Fysisk Modenhet (2 av 3)

```typescript
function check2Of3PhysicalTests(player, targetCategory) {
  const physicalTests = [
    { test: 12, name: "Benkpress", requirement: getRequirement(targetCategory, 12) },
    { test: 13, name: "Markløft", requirement: getRequirement(targetCategory, 13) },
    { test: 14, name: "Rotasjonskast", requirement: getRequirement(targetCategory, 14) }
  ]

  // Hent siste test-resultater
  const results = physicalTests.map(t => {
    const latestResult = getLatestTestResult(player, t.test)
    return {
      ...t,
      result: latestResult.value,
      passed: latestResult.value >= t.requirement
    }
  })

  // Tell antall beståtte
  const passedCount = results.filter(r => r.passed).length

  // Minimum 2 av 3
  return passedCount >= 2
}
```

### 2.4 Benchmark-test (4 av 7)

```typescript
function checkBenchmarkTests(player, targetCategory, minRequired = 4) {
  const golfTests = [1, 2, 3, 4, 5, 6, 7] // Test 1-7: Golf shots

  // Hent siste benchmark-session
  const latestBenchmark = getLatestBenchmarkSession(player)

  if (!latestBenchmark) return false

  // Sjekk hvor mange tester som ble bestått
  const results = golfTests.map(testNum => {
    const result = latestBenchmark.test_results.find(r => r.test_number === testNum)
    const requirement = getRequirement(targetCategory, testNum)
    return {
      test: testNum,
      result: result?.value,
      requirement,
      passed: result?.value >= requirement
    }
  })

  const passedCount = results.filter(r => r.passed).length

  return passedCount >= minRequired
}
```

### 2.5 Mental Modenhet

```typescript
function checkMentalMaturity(player, targetCategory) {
  // Test 16: Pre-shot rutine konsistens
  const preShot = getLatestTestResult(player, 16)
  const preShotCheck = preShot.value >= 70 // Minimum 70%

  // Test 15: Pressure putting performance
  const pressure = getLatestTestResult(player, 15)
  const pressureRequirement = getRequirement(targetCategory, 15)
  const pressureCheck = pressure.value >= pressureRequirement

  // Trener-vurdering
  const coachApproval = getCoachApproval(player, targetCategory)

  return preShotCheck && pressureCheck && coachApproval
}
```

## 2.6 Forventet Årlig Forbedring

### Formel
```typescript
function getExpectedImprovement(player) {
  const age = calculateAge(player.dateOfBirth)

  const improvementTable = {
    "13-15": { avg: 4.0, range80: [2, 6], range95: [0, 8] },
    "15-17": { avg: 2.5, range80: [1, 4], range95: [0, 6] },
    "17-19": { avg: 1.5, range80: [0.5, 3], range95: [0, 5] },
    "19+": { avg: 0.75, range80: [0, 2], range95: [-1, 3] }
  }

  if (age >= 13 && age < 15) return improvementTable["13-15"]
  if (age >= 15 && age < 17) return improvementTable["15-17"]
  if (age >= 17 && age < 19) return improvementTable["17-19"]
  return improvementTable["19+"]
}
```

## 2.7 Hybrid-kategori Fordeling

### Formel
```typescript
function calculateHybridDistribution(player, currentCategory, targetCategory) {
  const rounds = getRoundsLast3Months(player)
  const avgScore = rounds.reduce((sum, r) => sum + r.score, 0) / rounds.length

  const currentRange = getCategoryScoreRange(currentCategory)
  const targetRange = getCategoryScoreRange(targetCategory)

  // Beregn posisjon i hybrid-sonen
  const totalRange = currentRange.max - targetRange.min
  const positionInRange = avgScore - targetRange.min
  const percentInRange = (positionInRange / totalRange) * 100

  // Fordeling basert på posisjon
  if (percentInRange <= 25) {
    return { current: 30, target: 70 } // Nært målet
  } else if (percentInRange <= 50) {
    return { current: 50, target: 50 } // Midt i
  } else {
    return { current: 70, target: 30 } // Trygg base
  }
}
```

---

# 3. PROGRESSJONS-FORMLER

## 3.1 Test-progresjon Over Tid

### Formel
```typescript
function calculateTestProgression(player, testId, timeframe = "12months") {
  const results = getTestResults(player, testId, timeframe)

  if (results.length < 2) return null

  // Sorter etter dato
  results.sort((a, b) => a.test_date - b.test_date)

  const first = results[0]
  const latest = results[results.length - 1]

  return {
    first_value: first.value,
    latest_value: latest.value,
    absolute_change: latest.value - first.value,
    percent_change: ((latest.value - first.value) / first.value) * 100,
    num_tests: results.length,
    trend: calculateTrend(results),
    monthly_improvement_rate: calculateMonthlyRate(results)
  }
}
```

### Trend-beregning
```typescript
function calculateTrend(results) {
  // Linear regression for trend
  const n = results.length
  const sumX = results.reduce((sum, r, i) => sum + i, 0)
  const sumY = results.reduce((sum, r) => sum + r.value, 0)
  const sumXY = results.reduce((sum, r, i) => sum + (i * r.value), 0)
  const sumX2 = results.reduce((sum, r, i) => sum + (i * i), 0)

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)

  if (slope > 0.5) return "improving"
  if (slope < -0.5) return "declining"
  return "stable"
}
```

## 3.2 Breaking Point Progresjon

### Formel
```typescript
function calculateBreakingPointProgress(breakingPoint) {
  const baseline = parseFloat(breakingPoint.baselineMeasurement)
  const target = parseFloat(breakingPoint.targetMeasurement)
  const current = parseFloat(breakingPoint.currentMeasurement)

  if (!baseline || !target || !current) return 0

  // Beregn progresjon som prosent av total distanse
  const totalDistance = Math.abs(target - baseline)
  const currentProgress = Math.abs(current - baseline)

  const progressPercent = (currentProgress / totalDistance) * 100

  // Cap ved 100%
  return Math.min(progressPercent, 100)
}
```

## 3.3 Kategori-progresjon Score

### Formel
```typescript
function calculateCategoryProgressionScore(player, targetCategory) {
  const tests = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]

  const results = tests.map(testId => {
    const latest = getLatestTestResult(player, testId)
    const requirement = getRequirement(targetCategory, testId)

    if (!latest || !requirement) return { passed: false, progress: 0 }

    const progressPercent = (latest.value / requirement) * 100

    return {
      test: testId,
      passed: latest.value >= requirement,
      progress: Math.min(progressPercent, 100)
    }
  })

  const passedCount = results.filter(r => r.passed).length
  const avgProgress = results.reduce((sum, r) => sum + r.progress, 0) / results.length

  return {
    tests_passed: passedCount,
    total_tests: tests.length,
    pass_rate: (passedCount / tests.length) * 100,
    avg_progress: avgProgress,
    ready_for_progression: passedCount >= (tests.length * 0.7) // 70% kriterium
  }
}
```

## 3.4 Treningsmengde Akkumulering

### Formel
```typescript
function calculateTrainingVolume(player, period = "week") {
  const sessions = getTrainingSessions(player, period)

  const byType = {
    T: 0, // Teknikk
    G: 0, // Golfslag
    S: 0, // Spill
    K: 0, // Kompetanse
    Fs: 0, // Fysisk
    Fu: 0 // Funksjonell
  }

  sessions.forEach(session => {
    const type = session.sessionType
    byType[type] += session.duration
  })

  const total = Object.values(byType).reduce((sum, hours) => sum + hours, 0)

  return {
    total_minutes: total,
    total_hours: total / 60,
    by_type: byType,
    distribution_percent: Object.fromEntries(
      Object.entries(byType).map(([type, mins]) => [
        type,
        (mins / total) * 100
      ])
    )
  }
}
```

---

# 4. DASHBOARD-BEREGNINGER

## 4.1 Spiller Dashboard - Hovedmetrikker

### Gjennomsnittlig Score (Siste 20 runder)
```typescript
function calculateAverageScore(player) {
  const rounds = getRecentRounds(player, 20)

  if (rounds.length === 0) return null

  const total = rounds.reduce((sum, r) => sum + r.totalScore, 0)
  const average = total / rounds.length

  const previous20 = getRounds(player, offset: 20, limit: 20)
  const previousAvg = previous20.length > 0
    ? previous20.reduce((sum, r) => sum + r.totalScore, 0) / previous20.length
    : null

  return {
    current_average: round(average, 2),
    rounds_count: rounds.length,
    trend: previousAvg ? average - previousAvg : null,
    best_round: Math.min(...rounds.map(r => r.totalScore)),
    worst_round: Math.max(...rounds.map(r => r.totalScore))
  }
}
```

### Test-gjennomføring Rate
```typescript
function calculateTestCompletionRate(player, period = "year") {
  const expectedTests = getExpectedBenchmarkWeeks(period) // 14 uker per år
  const completedSessions = getCompletedBenchmarkSessions(player, period)

  const rate = (completedSessions.length / expectedTests.length) * 100

  return {
    expected: expectedTests.length,
    completed: completedSessions.length,
    completion_rate: round(rate, 1),
    missing_weeks: expectedTests.filter(w =>
      !completedSessions.find(s => s.weekNumber === w)
    )
  }
}
```

### Kategori-readiness Score
```typescript
function calculateCategoryReadiness(player, targetCategory) {
  const progression = calculateCategoryProgressionScore(player, targetCategory)
  const scoreCheck = checkScoreConsistency(player, targetCategory, 3)
  const physicalCheck = check2Of3PhysicalTests(player, targetCategory)
  const benchmarkCheck = checkBenchmarkTests(player, targetCategory, 4)
  const mentalCheck = checkMentalMaturity(player, targetCategory)

  const criteria = [
    { name: "Score consistency", met: scoreCheck, weight: 30 },
    { name: "Physical tests", met: physicalCheck, weight: 25 },
    { name: "Benchmark tests", met: benchmarkCheck, weight: 25 },
    { name: "Mental maturity", met: mentalCheck, weight: 20 }
  ]

  const totalScore = criteria.reduce((sum, c) =>
    sum + (c.met ? c.weight : 0), 0
  )

  return {
    readiness_score: totalScore,
    readiness_percent: totalScore,
    criteria: criteria,
    ready: totalScore >= 90
  }
}
```

## 4.2 Breaking Points Oversikt

### Aktive Breaking Points
```typescript
function getActiveBreakingPoints(player) {
  const breakingPoints = getBreakingPoints(player, status: ["in_progress", "not_started"])

  return breakingPoints.map(bp => ({
    ...bp,
    progress_percent: calculateBreakingPointProgress(bp),
    weeks_in_progress: calculateWeeksSince(bp.identifiedDate),
    priority: calculatePriority(bp)
  })).sort((a, b) => b.priority - a.priority)
}
```

### Priority-beregning
```typescript
function calculatePriority(breakingPoint) {
  const severityScore = {
    "critical": 100,
    "high": 75,
    "medium": 50,
    "low": 25
  }[breakingPoint.severity]

  const progressScore = 100 - breakingPoint.progressPercent
  const timeScore = Math.min(calculateWeeksSince(breakingPoint.identifiedDate) * 2, 50)

  return severityScore * 0.5 + progressScore * 0.3 + timeScore * 0.2
}
```

## 4.3 Trenings-distribusjon Visualisering

### Formel
```typescript
function getTrainingDistribution(player, period = "week") {
  const volume = calculateTrainingVolume(player, period)
  const periodPlan = getPeriodPlan(player)

  return {
    actual: volume.distribution_percent,
    planned: periodPlan.distribution,
    variance: Object.fromEntries(
      Object.entries(volume.distribution_percent).map(([type, actual]) => [
        type,
        actual - (periodPlan.distribution[type] || 0)
      ])
    )
  }
}
```

---

# 5. TRENER-VERKTØY FORMLER

## 5.1 Gruppe-sammenligning

### Formel
```typescript
function comparePlayerGroup(playerIds, testId) {
  const results = playerIds.map(playerId => {
    const player = getPlayer(playerId)
    const latestTest = getLatestTestResult(player, testId)
    const categoryReq = getRequirement(player.category, testId)

    return {
      player_id: playerId,
      player_name: `${player.firstName} ${player.lastName}`,
      category: player.category,
      result: latestTest?.value,
      requirement: categoryReq,
      passed: latestTest?.value >= categoryReq,
      percent_of_requirement: (latestTest?.value / categoryReq) * 100
    }
  })

  const values = results.map(r => r.result).filter(v => v != null)

  return {
    players: results,
    group_stats: {
      average: values.reduce((sum, v) => sum + v, 0) / values.length,
      median: calculateMedian(values),
      min: Math.min(...values),
      max: Math.max(...values),
      std_dev: calculateStdDev(values)
    },
    pass_rate: (results.filter(r => r.passed).length / results.length) * 100
  }
}
```

## 5.2 Benchmark-session Analyse

### Formel
```typescript
function analyzeBenchmarkSession(sessionId) {
  const session = getBenchmarkSession(sessionId)
  const player = getPlayer(session.playerId)
  const testResults = session.testsCompleted.map(testId =>
    getTestResult(testId)
  )

  // Kategoriser tester
  const passed = testResults.filter(r => r.passed)
  const failed = testResults.filter(r => !r.passed)

  // Identifiser styrker og svakheter
  const strengths = passed
    .filter(r => (r.value / r.requirement) >= 1.1) // 10% over krav
    .map(r => r.test_name)

  const weaknesses = failed
    .filter(r => (r.value / r.requirement) < 0.9) // 10% under krav
    .map(r => r.test_name)

  // Breaking points
  const newBreakingPoints = identifyBreakingPoints(failed, player)

  return {
    session_id: sessionId,
    player: {
      id: player.id,
      name: `${player.firstName} ${player.lastName}`,
      category: player.category
    },
    summary: {
      tests_completed: testResults.length,
      tests_passed: passed.length,
      tests_failed: failed.length,
      pass_rate: (passed.length / testResults.length) * 100
    },
    strengths,
    weaknesses,
    new_breaking_points: newBreakingPoints,
    progression_recommendation: determineProgressionStatus(session, player)
  }
}
```

## 5.3 Periodisering Compliance

### Formel
```typescript
function checkPeriodizationCompliance(player, weekNumber) {
  const plan = getPeriodizationPlan(player, weekNumber)
  const actualSessions = getTrainingSessions(player, week: weekNumber)

  const plannedDistribution = plan.distribution
  const actualVolume = calculateTrainingVolume(player, week: weekNumber)

  const compliance = Object.entries(plannedDistribution).map(([type, plannedPercent]) => {
    const actualPercent = actualVolume.distribution_percent[type] || 0
    const variance = actualPercent - plannedPercent
    const variancePercent = (variance / plannedPercent) * 100

    return {
      type,
      planned_percent: plannedPercent,
      actual_percent: actualPercent,
      variance_percent: variancePercent,
      compliant: Math.abs(variancePercent) <= 20 // ±20% toleranse
    }
  })

  const overallCompliance = compliance.filter(c => c.compliant).length / compliance.length * 100

  return {
    week_number: weekNumber,
    period: plan.period,
    compliance_by_type: compliance,
    overall_compliance: overallCompliance,
    compliant: overallCompliance >= 75
  }
}
```

## 5.4 Breaking Point Identifikasjon

### Formel
```typescript
function identifyBreakingPoints(failedTests, player) {
  return failedTests.map(test => {
    // Finn hvilket av de 5 prosessene dette tilhører
    const processCategory = mapTestToProcess(test.test_number)

    // Beregn severity basert på hvor langt under kravet
    const gap = (test.requirement - test.value) / test.requirement * 100
    const severity =
      gap > 30 ? "critical" :
      gap > 20 ? "high" :
      gap > 10 ? "medium" : "low"

    return {
      process_category: processCategory,
      specific_area: test.test_name,
      description: `Below requirement by ${round(gap, 1)}%`,
      severity,
      baseline_measurement: test.value.toString(),
      target_measurement: test.requirement.toString(),
      suggested_exercises: suggestExercises(test.test_number, player.category)
    }
  })
}
```

---

# 6. DATABASE IMPLEMENTERING

## 6.1 TestResult Modell

### Database Schema
```typescript
model TestResult {
  id: UUID
  testId: UUID // Relation til Test
  playerId: UUID // Relation til Player
  testDate: Date

  // Test-spesifikk data
  results: JSON // Se individuelle test-formater over

  // Beregnet data
  value: Decimal // Hovedverdi for testen
  pei: Decimal? // Kun for Test 4
  categoryRequirement: Decimal // Krav for spillerens kategori
  passed: Boolean // value >= categoryRequirement

  // Progresjon
  improvementFromLast: Decimal?
  percentOfRequirement: Decimal // (value / requirement) * 100

  // Metadata
  location: String?
  weather: String?
  equipment: String?
  videoUrl: String?

  // Feedback
  coachFeedback: Text?
  playerFeedback: Text?

  // Tracking
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### Indekser
```sql
CREATE INDEX idx_test_results_player_test ON test_results(player_id, test_id);
CREATE INDEX idx_test_results_date ON test_results(test_date DESC);
CREATE INDEX idx_test_results_passed ON test_results(passed);
```

## 6.2 Stored Procedures

### Calculate Test Progression
```sql
CREATE OR REPLACE FUNCTION calculate_test_progression(
  p_player_id UUID,
  p_test_id UUID
) RETURNS JSON AS $$
DECLARE
  v_results JSON;
BEGIN
  SELECT json_build_object(
    'first_value', first_value(value ORDER BY test_date),
    'latest_value', last_value(value ORDER BY test_date),
    'absolute_change', last_value(value ORDER BY test_date) - first_value(value ORDER BY test_date),
    'num_tests', COUNT(*),
    'avg_value', AVG(value)
  ) INTO v_results
  FROM test_results
  WHERE player_id = p_player_id
    AND test_id = p_test_id
    AND test_date >= CURRENT_DATE - INTERVAL '12 months';

  RETURN v_results;
END;
$$ LANGUAGE plpgsql;
```

### Check Category Readiness
```sql
CREATE OR REPLACE FUNCTION check_category_readiness(
  p_player_id UUID,
  p_target_category VARCHAR(2)
) RETURNS JSON AS $$
DECLARE
  v_readiness JSON;
  v_score_check BOOLEAN;
  v_physical_check BOOLEAN;
  v_benchmark_check BOOLEAN;
BEGIN
  -- Implementer de 4 kriteriene
  -- Returner JSON med detaljer
END;
$$ LANGUAGE plpgsql;
```

## 6.3 Triggers

### Auto-calculate improvement
```sql
CREATE OR REPLACE FUNCTION calculate_improvement_trigger()
RETURNS TRIGGER AS $$
DECLARE
  v_previous_result DECIMAL;
BEGIN
  -- Hent forrige resultat for samme spiller og test
  SELECT value INTO v_previous_result
  FROM test_results
  WHERE player_id = NEW.player_id
    AND test_id = NEW.test_id
    AND test_date < NEW.test_date
  ORDER BY test_date DESC
  LIMIT 1;

  -- Beregn forbedring
  IF v_previous_result IS NOT NULL THEN
    NEW.improvement_from_last := NEW.value - v_previous_result;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_calculate_improvement
  BEFORE INSERT ON test_results
  FOR EACH ROW
  EXECUTE FUNCTION calculate_improvement_trigger();
```

## 6.4 Visninger (Views)

### Player Dashboard View
```sql
CREATE VIEW v_player_dashboard AS
SELECT
  p.id AS player_id,
  p.first_name || ' ' || p.last_name AS player_name,
  p.category,

  -- Gjennomsnittlig score
  (
    SELECT ROUND(AVG(total_score), 2)
    FROM tournament_results tr
    WHERE tr.player_id = p.id
      AND tr.created_at >= CURRENT_DATE - INTERVAL '3 months'
  ) AS avg_score_3months,

  -- Test completion rate
  (
    SELECT ROUND(
      COUNT(DISTINCT week_number)::DECIMAL / 14 * 100,
      1
    )
    FROM benchmark_sessions bs
    WHERE bs.player_id = p.id
      AND bs.date >= CURRENT_DATE - INTERVAL '1 year'
  ) AS test_completion_rate,

  -- Aktive breaking points
  (
    SELECT COUNT(*)
    FROM breaking_points bp
    WHERE bp.player_id = p.id
      AND bp.status IN ('not_started', 'in_progress')
  ) AS active_breaking_points,

  -- Siste benchmark dato
  (
    SELECT MAX(date)
    FROM benchmark_sessions bs
    WHERE bs.player_id = p.id
  ) AS last_benchmark_date

FROM players p
WHERE p.status = 'active';
```

---

## 📊 OPPSUMMERING

### Hovedformler per kategori:

**Tester (1-20):**
- 7 Golf Shots tester med spesifikke scoringsformler
- 4 Tekniske tester (clubspeed, smash factor, etc.)
- 3 Fysiske tester (1RM formler)
- 4 Mentale tester (konsistens og press)
- 2 Strategiske tester (kvalitativ vurdering)

**Kategori-system:**
- 4 hovedkriterier for overgang
- Score-konsistens over 3 måneder
- 2-of-3 fysisk test krav
- 4-of-7 benchmark test krav
- Mental modenhet vurdering

**Progresjon:**
- Test-progresjon over tid (linear regression)
- Breaking point progresjon (prosent til mål)
- Kategori-readiness score (vektet kriterier)
- Treningsmengde akkumulering

**Dashboard:**
- Gjennomsnittlig score beregninger
- Test-gjennomføring rate
- Breaking points prioritering
- Trenings-distribusjon variance

**Trener-verktøy:**
- Gruppe-sammenligning statistikk
- Benchmark-session analyse
- Periodisering compliance
- Breaking point identifikasjon

---

**Dokumentversjon**: 1.0
**Status**: ✅ Komplett for database-implementering
**Sist oppdatert**: 15. desember 2025
**Forfatter**: AK Golf Academy & Team Norway Golf
