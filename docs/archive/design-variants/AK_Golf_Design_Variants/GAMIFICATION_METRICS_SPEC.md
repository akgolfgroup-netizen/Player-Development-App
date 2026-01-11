# AK Golf Academy — Gamification Metrics System

## Oversikt

Dette dokumentet definerer et komplett metrikkbasert gamification-system som sporer:
- Treningsvolum (timer, økter, repetisjoner)
- Styrketrening (vekt, sets, PRs)
- Fasebasert progresjon (periodisering)
- Ferdighetsutvikling (accuracy, speed, consistency)

---

# DEL 1: METRIKKATEGORIER

## 1.1 Volummetrikker

### Timer Trent
```
TOTAL TIMER
├── Alle kategorier samlet
├── Per treningstype
│   ├── Teknikk-timer
│   ├── Spill-timer (på bane)
│   ├── Fysisk-timer
│   ├── Mental-timer
│   └── Konkurransetimer
└── Per periode
    ├── Denne uken
    ├── Denne måneden
    └── Dette året
```

### Økter Fullført
```
ØKTER
├── Totalt antall
├── Per type
├── Fullføringsrate (%)
├── Konsistens (standardavvik)
└── Gjennomsnittlig varighet
```

### Repetisjoner
```
REPETISJONER
├── Slag slått (totalt)
│   ├── Driver
│   ├── Jern
│   ├── Wedge
│   └── Putter
├── Drills fullført
├── Øvelser gjennomført
└── Spesifikke øvelser (f.eks. "Gate Drill" x 500)
```

---

## 1.2 Styrkemetrikker (Gym)

### Vekt Løftet
```
STYRKE
├── Total tonnasje (kg løftet totalt)
├── Per øvelse
│   ├── Knebøy
│   ├── Markløft
│   ├── Benkpress
│   ├── Rows
│   ├── Skulderpress
│   └── Core-øvelser
├── 1RM estimater
├── Relative styrke (kg/kroppsvekt)
└── Volum per uke (sets × reps × weight)
```

### Personal Records (PRs)
```
PRs
├── Per øvelse (1RM, 3RM, 5RM)
├── Forbedring over tid
├── Antall PRs satt
└── Tid siden siste PR
```

### Golf-spesifikk Styrke
```
GOLF FITNESS
├── Rotasjonsstyrke
│   ├── Med-ball throws (m/distanse)
│   ├── Cable rotations (kg)
│   └── Russian twists (reps)
├── Eksplosivitet
│   ├── Vertical jump (cm)
│   ├── Broad jump (cm)
│   └── Box jumps (høyde)
├── Mobilitet
│   ├── Hip rotation (grader)
│   ├── Thoracic rotation (grader)
│   └── Shoulder mobility score
└── Stabilitet
    ├── Single-leg balance (sek)
    ├── Plank hold (sek)
    └── Anti-rotation holds (sek)
```

---

## 1.3 Fasemetrikker (Periodisering)

### Årsplan-faser
```
PERIODISERING
├── Grunnlagsfase (Off-season)
│   ├── Volum-mål
│   ├── Styrke-fokus
│   └── Teknikk-repetisjon
├── Oppbyggingsfase (Pre-season)
│   ├── Intensitet øker
│   ├── Spesifisitet øker
│   └── Konkurranseprep
├── Konkurransefase (In-season)
│   ├── Vedlikehold
│   ├── Peaking
│   └── Recovery-fokus
└── Overgangsfase (Transition)
    ├── Aktiv hvile
    ├── Cross-training
    └── Mental reset
```

### Fase-compliance
```
COMPLIANCE
├── Planlagte vs gjennomførte økter (%)
├── Volum vs plan (%)
├── Intensitet vs plan (%)
└── Fase-mål oppnådd (ja/nei)
```

---

## 1.4 Prestasjonsmetrikker

### Tekniske Målinger
```
TEKNIKK
├── Clubhead Speed
│   ├── Driver (mph)
│   ├── 7-iron (mph)
│   └── Wedge (mph)
├── Ball Speed
├── Smash Factor
├── Launch Angle
├── Spin Rate
├── Carry Distance
└── Total Distance
```

### Presisjon
```
PRESISJON
├── Fairway hit (%)
├── GIR - Greens in Regulation (%)
├── Proximity to hole (avg meters)
├── Dispersion (standardavvik)
├── Miss direction (L/R tendency)
└── Distance control (± meters)
```

### Putting
```
PUTTING
├── Putts per runde
├── 1-putt rate (%)
├── 3-putt avoidance (%)
├── Make rate per distanse
│   ├── 0-3 ft (%)
│   ├── 3-6 ft (%)
│   ├── 6-10 ft (%)
│   ├── 10-20 ft (%)
│   └── 20+ ft (%)
├── Strokes Gained: Putting
└── First putt distance (avg)
```

### Kort Spill
```
KORT SPILL
├── Up-and-down rate (%)
├── Sand save (%)
├── Scrambling (%)
├── Proximity from 50y (avg m)
├── Proximity from 100y (avg m)
└── Strokes Gained: Around Green
```

---

# DEL 2: BADGE-TAXONOMI MED METRIKKER

## 2.1 Volum-Badges

### Timer Trent
| Badge | Krav | Tier | XP |
|-------|------|------|-----|
| **Starter** | 10 timer totalt | Standard | 50 |
| **Dedikert** | 50 timer totalt | Bronze | 100 |
| **Seriøs** | 100 timer totalt | Bronze | 200 |
| **Forpliktet** | 250 timer totalt | Silver | 400 |
| **Arbeidskar** | 500 timer totalt | Silver | 600 |
| **Marathoner** | 1000 timer totalt | Gold | 1000 |
| **Elite Timer** | 2500 timer totalt | Platinum | 2000 |

### Timer per Type
| Badge | Krav | Symbol |
|-------|------|--------|
| **Teknikk-Fokus I-V** | 10/50/100/250/500 timer teknikk | target |
| **Bane-Rotte I-V** | 10/50/100/250/500 timer på bane | flag |
| **Gym-Rotte I-V** | 10/50/100/250/500 timer gym | dumbbell |
| **Mental Warrior I-III** | 10/50/100 timer mental | brain |

### Slag Slått
| Badge | Krav | Tier | XP |
|-------|------|------|-----|
| **Første Tusen** | 1,000 slag | Standard | 50 |
| **Fem Tusen** | 5,000 slag | Bronze | 150 |
| **Ti Tusen** | 10,000 slag | Silver | 300 |
| **Femti Tusen** | 50,000 slag | Gold | 800 |
| **Hundre Tusen** | 100,000 slag | Platinum | 1500 |

### Slag per Klubb
| Badge | Krav | Symbol |
|-------|------|--------|
| **Driver Specialist I-V** | 1k/5k/10k/25k/50k driver-slag | zap |
| **Iron Master I-V** | 1k/5k/10k/25k/50k jern-slag | target |
| **Wedge Wizard I-V** | 1k/5k/10k/25k/50k wedge-slag | flag |
| **Putting Grinder I-V** | 1k/5k/10k/25k/50k putter-slag | target |

---

## 2.2 Styrke-Badges

### Total Tonnasje
| Badge | Krav | Tier | XP |
|-------|------|------|-----|
| **Begynner Løfter** | 1,000 kg løftet | Standard | 50 |
| **Seriøs Løfter** | 10,000 kg | Bronze | 150 |
| **Sterk** | 50,000 kg | Silver | 300 |
| **Kraftpakke** | 100,000 kg | Gold | 600 |
| **Beast Mode** | 500,000 kg | Platinum | 1200 |

### Øvelsesspesifikke PRs
| Badge | Krav | Symbol |
|-------|------|--------|
| **Squat Club** | 1.0/1.25/1.5/1.75/2.0 × kroppsvekt | dumbbell |
| **Deadlift Club** | 1.25/1.5/1.75/2.0/2.5 × kroppsvekt | dumbbell |
| **Bench Club** | 0.75/1.0/1.25/1.5 × kroppsvekt | dumbbell |

### Golf-Fitness Milestones
| Badge | Krav | Tier |
|-------|------|------|
| **Rotator I** | Med-ball throw > 8m | Bronze |
| **Rotator II** | Med-ball throw > 10m | Silver |
| **Rotator III** | Med-ball throw > 12m | Gold |
| **Explosive I** | Vertical jump > 40cm | Bronze |
| **Explosive II** | Vertical jump > 50cm | Silver |
| **Explosive III** | Vertical jump > 60cm | Gold |
| **Mobile I** | Hip rotation > 45° | Bronze |
| **Mobile II** | Hip rotation > 55° | Silver |
| **Mobile III** | Hip rotation > 65° | Gold |

### PR-Samlinger
| Badge | Krav | XP |
|-------|------|-----|
| **First PR** | Sett 1 PR | 100 |
| **PR Collector** | Sett 10 PRs | 300 |
| **PR Hunter** | Sett 25 PRs | 600 |
| **PR Machine** | Sett 50 PRs | 1000 |

---

## 2.3 Fase-Badges

### Fase-Compliance
| Badge | Krav | Tier | XP |
|-------|------|------|-----|
| **Fase-Følger** | Fullfør 1 fase med 80%+ compliance | Bronze | 200 |
| **Periodisert** | Fullfør 4 faser med 80%+ | Silver | 500 |
| **Årsplan-Mester** | Fullfør helt år med 85%+ | Gold | 1000 |
| **Systematiker** | 2 år med 85%+ compliance | Platinum | 2000 |

### Fase-Spesifikke
| Badge | Krav | Symbol |
|-------|------|--------|
| **Grunnlag Bygger** | Fullført grunnlagsfase | book |
| **Pre-Season Ready** | Fullført oppbyggingsfase | sunrise |
| **Peak Performer** | Nådd peak i konkurransefase | star |
| **Smart Restitusjon** | Fullført overgangsfase uten skader | moon |

### Ukentlig/Månedlig Volum
| Badge | Krav | Tier |
|-------|------|------|
| **10-Timer Uke** | 10+ timer på én uke | Bronze |
| **15-Timer Uke** | 15+ timer på én uke | Silver |
| **20-Timer Uke** | 20+ timer på én uke | Gold |
| **40-Timer Måned** | 40+ timer på én måned | Bronze |
| **60-Timer Måned** | 60+ timer på én måned | Silver |
| **80-Timer Måned** | 80+ timer på én måned | Gold |

---

## 2.4 Prestasjon-Badges

### Speed Milestones
| Badge | Krav | Tier | XP |
|-------|------|------|-----|
| **100 Club** | Driver CHS ≥ 100 mph | Bronze | 200 |
| **105 Club** | Driver CHS ≥ 105 mph | Silver | 400 |
| **110 Club** | Driver CHS ≥ 110 mph | Gold | 600 |
| **115 Club** | Driver CHS ≥ 115 mph | Gold | 800 |
| **120 Club** | Driver CHS ≥ 120 mph | Platinum | 1200 |

### Speed Improvement
| Badge | Krav | XP |
|-------|------|-----|
| **Speed Boost I** | +3 mph fra baseline | 200 |
| **Speed Boost II** | +5 mph fra baseline | 400 |
| **Speed Boost III** | +8 mph fra baseline | 700 |
| **Speed Boost IV** | +10 mph fra baseline | 1000 |
| **Speed Boost V** | +15 mph fra baseline | 1500 |

### Presisjon-Badges
| Badge | Krav | Tier |
|-------|------|------|
| **Fairway Finder I** | 50%+ FW hit | Bronze |
| **Fairway Finder II** | 60%+ FW hit | Silver |
| **Fairway Finder III** | 70%+ FW hit | Gold |
| **Green Machine I** | 50%+ GIR | Bronze |
| **Green Machine II** | 65%+ GIR | Silver |
| **Green Machine III** | 75%+ GIR | Gold |
| **Green Machine IV** | 80%+ GIR | Platinum |

### Putting-Badges
| Badge | Krav | Tier |
|-------|------|------|
| **Putter I** | < 32 putts/runde avg | Bronze |
| **Putter II** | < 30 putts/runde avg | Silver |
| **Putter III** | < 28 putts/runde avg | Gold |
| **One-Putt Master** | 40%+ 1-putt rate | Gold |
| **No 3-Putts** | Runde uten 3-putt | Silver |
| **Holing Out** | 5 putts > 20ft made | Gold |

### Scoring-Badges
| Badge | Krav | Tier | XP |
|-------|------|------|-----|
| **Under 80** | Runde under 80 | Bronze | 200 |
| **Under 75** | Runde under 75 | Silver | 400 |
| **Par Breaker** | Runde under par | Gold | 800 |
| **Deep Under Par** | -3 eller bedre | Platinum | 1200 |
| **Personal Best** | Ny laveste score | Gold | 500 |

---

# DEL 3: PROGRESS-TRACKING SYSTEM

## 3.1 Data Model

```typescript
interface PlayerMetrics {
  // Volume
  totalHours: number;
  hoursByType: {
    teknikk: number;
    spill: number;
    fysisk: number;
    mental: number;
    konkurranse: number;
  };
  totalSessions: number;
  totalSwings: number;
  swingsByClub: {
    driver: number;
    irons: number;
    wedges: number;
    putter: number;
  };

  // Strength
  totalTonnage: number; // kg
  prs: {
    squat: { weight: number; date: Date; };
    deadlift: { weight: number; date: Date; };
    bench: { weight: number; date: Date; };
    // ... more exercises
  };
  prCount: number;
  golfFitness: {
    medBallThrow: number; // meters
    verticalJump: number; // cm
    hipRotation: number; // degrees
    thoracicRotation: number; // degrees
  };

  // Performance
  clubheadSpeed: {
    driver: number;
    baseline: number;
    improvement: number;
  };
  accuracy: {
    fairwayHit: number; // %
    gir: number; // %
    proximity: number; // meters
  };
  putting: {
    avgPutts: number;
    onePuttRate: number;
    threePuttRate: number;
  };
  bestScore: number;
  avgScore: number;

  // Phase
  currentPhase: 'grunnlag' | 'oppbygging' | 'konkurranse' | 'overgang';
  phaseCompliance: number; // %
  phasesCompleted: number;

  // Streaks
  currentStreak: number;
  longestStreak: number;
  weeklyHours: number;
  monthlyHours: number;
}
```

## 3.2 Badge Calculation Logic

```typescript
function checkVolumeBadges(metrics: PlayerMetrics): Badge[] {
  const badges: Badge[] = [];

  // Total hours badges
  const hourThresholds = [10, 50, 100, 250, 500, 1000, 2500];
  const hourBadges = ['starter', 'dedikert', 'serios', 'forpliktet', 'arbeidskar', 'marathoner', 'elite-timer'];

  for (let i = 0; i < hourThresholds.length; i++) {
    if (metrics.totalHours >= hourThresholds[i]) {
      badges.push({
        id: `hours-${hourBadges[i]}`,
        earned: true,
        earnedAt: calculateEarnedDate(metrics, 'hours', hourThresholds[i])
      });
    } else {
      badges.push({
        id: `hours-${hourBadges[i]}`,
        earned: false,
        progress: (metrics.totalHours / hourThresholds[i]) * 100
      });
      break; // Stop at first unearned
    }
  }

  return badges;
}

function checkStrengthBadges(metrics: PlayerMetrics): Badge[] {
  const badges: Badge[] = [];

  // Tonnage badges
  const tonnageThresholds = [1000, 10000, 50000, 100000, 500000];
  // ... similar logic

  // Relative strength badges (e.g., squat 1.5x bodyweight)
  const bodyweight = metrics.bodyweight || 70;
  const squatRatio = metrics.prs.squat.weight / bodyweight;

  if (squatRatio >= 2.0) badges.push({ id: 'squat-club-5', tier: 'platinum' });
  else if (squatRatio >= 1.75) badges.push({ id: 'squat-club-4', tier: 'gold' });
  // ... etc

  return badges;
}

function checkSpeedBadges(metrics: PlayerMetrics): Badge[] {
  const badges: Badge[] = [];
  const speed = metrics.clubheadSpeed.driver;
  const improvement = metrics.clubheadSpeed.improvement;

  // Absolute speed badges
  if (speed >= 120) badges.push({ id: '120-club', tier: 'platinum' });
  else if (speed >= 115) badges.push({ id: '115-club', tier: 'gold' });
  else if (speed >= 110) badges.push({ id: '110-club', tier: 'gold' });
  else if (speed >= 105) badges.push({ id: '105-club', tier: 'silver' });
  else if (speed >= 100) badges.push({ id: '100-club', tier: 'bronze' });

  // Improvement badges
  if (improvement >= 15) badges.push({ id: 'speed-boost-5', tier: 'platinum' });
  else if (improvement >= 10) badges.push({ id: 'speed-boost-4', tier: 'gold' });
  // ... etc

  return badges;
}
```

## 3.3 Real-time Progress Updates

```typescript
// After each training session
async function onSessionComplete(session: TrainingSession) {
  const metrics = await getPlayerMetrics(session.playerId);

  // Update volume metrics
  metrics.totalHours += session.duration / 60;
  metrics.hoursByType[session.type] += session.duration / 60;
  metrics.totalSessions += 1;

  // Update swings if applicable
  if (session.swingCount) {
    metrics.totalSwings += session.swingCount;
    metrics.swingsByClub[session.club] += session.swingCount;
  }

  // Update strength if gym session
  if (session.type === 'fysisk' && session.exercises) {
    for (const exercise of session.exercises) {
      const tonnage = exercise.sets.reduce((sum, set) =>
        sum + (set.reps * set.weight), 0);
      metrics.totalTonnage += tonnage;

      // Check for PRs
      const estimatedMax = exercise.sets.reduce((max, set) => {
        const oneRM = set.weight * (1 + set.reps / 30);
        return Math.max(max, oneRM);
      }, 0);

      if (estimatedMax > metrics.prs[exercise.name]?.weight) {
        metrics.prs[exercise.name] = {
          weight: estimatedMax,
          date: new Date()
        };
        metrics.prCount += 1;

        // Trigger PR celebration
        await triggerBadgeUnlock(session.playerId, 'pr-set');
      }
    }
  }

  // Check for new badges
  const newBadges = await checkAllBadges(metrics);
  for (const badge of newBadges) {
    if (badge.justUnlocked) {
      await triggerBadgeUnlock(session.playerId, badge);
    }
  }

  // Save updated metrics
  await savePlayerMetrics(session.playerId, metrics);
}
```

---

# DEL 4: VISUELLE PROGRESS-INDIKATORER

## 4.1 Dashboard Widgets

### Timer-Widget
```
┌─────────────────────────────────────┐
│ TIMER TRENT                         │
├─────────────────────────────────────┤
│                                     │
│     247.5                           │
│     TIMER TOTALT                    │
│                                     │
│  ┌────────────────────────────────┐ │
│  │████████████████░░░░░░░░░░░░░░░│ │
│  └────────────────────────────────┘ │
│  247.5 / 500 → "Arbeidskar" badge   │
│                                     │
│  Denne uken: 12.5t  │  Mål: 15t     │
│  ████████████░░░░░  │  83%          │
│                                     │
└─────────────────────────────────────┘
```

### Styrke-Widget
```
┌─────────────────────────────────────┐
│ STYRKE                              │
├─────────────────────────────────────┤
│                                     │
│  TOTAL TONNASJE                     │
│  ┌─────────────────────────────┐    │
│  │ 45,230 kg                   │    │
│  └─────────────────────────────┘    │
│  → 4,770 kg til "Kraftpakke"        │
│                                     │
│  SISTE PRs                          │
│  ┌─────────────────────────────┐    │
│  │ Knebøy    95kg  (+5) 🆕     │    │
│  │ Markløft  110kg             │    │
│  │ Benkpress 70kg              │    │
│  └─────────────────────────────┘    │
│                                     │
└─────────────────────────────────────┘
```

### Speed-Widget
```
┌─────────────────────────────────────┐
│ DRIVER SPEED                        │
├─────────────────────────────────────┤
│                                     │
│      ╭────────────╮                 │
│     ╱              ╲                │
│    │   107 mph     │                │
│    │   +7 mph      │  🔥            │
│     ╲              ╱                │
│      ╰────────────╯                 │
│                                     │
│  Baseline: 100 mph (Jan 2024)       │
│                                     │
│  ┌─────────────────────────────┐    │
│  │██████████████░░░░░░░░░░░░░░│    │
│  └─────────────────────────────┘    │
│  7/10 mph → "Speed Boost III"       │
│                                     │
└─────────────────────────────────────┘
```

## 4.2 Skill Trees med Metrikker

```
PUTTING MASTERY
═══════════════════════════════════════════════════════════════

  ○───────○───────◐───────○───────○
  │       │       │       │       │
  I       II      III     IV      V

  Putter  Green   Distance Clutch  Master
  10 drills Reader Control Putter
          50 drills 100 drills 200 drills 500 drills
          70% acc 80% acc  pressure  90% acc

  ✓ DONE  ✓ DONE  75%      LOCKED  LOCKED
                   ▓▓▓▓▓▓░░

  Current: 75 drills, 76% accuracy
  Need: 25 more drills, +4% accuracy
```

## 4.3 Progress Notifications

```typescript
// Milestone approaching notification
if (metrics.totalHours >= 450 && metrics.totalHours < 500) {
  notify({
    title: "Nesten der!",
    body: `${500 - metrics.totalHours} timer til "Arbeidskar" badge`,
    icon: "clock",
    priority: "low"
  });
}

// PR notification
if (newPR) {
  notify({
    title: "Ny PR! 💪",
    body: `${exercise}: ${weight}kg (+${improvement}kg)`,
    icon: "trophy",
    priority: "high",
    celebration: true
  });
}

// Speed improvement notification
if (speedImprovement >= 5 && !badges.includes('speed-boost-2')) {
  triggerBadgeUnlock('speed-boost-2');
}
```

---

# DEL 5: IMPLEMENTASJONSPLAN

## 5.1 Database Schema

```sql
-- Player metrics table
CREATE TABLE player_metrics (
  player_id UUID PRIMARY KEY,
  total_hours DECIMAL(10,2) DEFAULT 0,
  hours_teknikk DECIMAL(10,2) DEFAULT 0,
  hours_spill DECIMAL(10,2) DEFAULT 0,
  hours_fysisk DECIMAL(10,2) DEFAULT 0,
  hours_mental DECIMAL(10,2) DEFAULT 0,
  total_sessions INT DEFAULT 0,
  total_swings INT DEFAULT 0,
  total_tonnage DECIMAL(12,2) DEFAULT 0,
  pr_count INT DEFAULT 0,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  best_score INT,
  avg_score DECIMAL(4,1),
  driver_speed DECIMAL(5,1),
  driver_speed_baseline DECIMAL(5,1),
  fairway_hit_pct DECIMAL(5,2),
  gir_pct DECIMAL(5,2),
  avg_putts DECIMAL(4,1),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Strength PRs table
CREATE TABLE player_prs (
  id UUID PRIMARY KEY,
  player_id UUID REFERENCES player_metrics,
  exercise VARCHAR(50),
  weight DECIMAL(6,2),
  reps INT,
  estimated_1rm DECIMAL(6,2),
  achieved_at TIMESTAMP DEFAULT NOW()
);

-- Badge progress table
CREATE TABLE badge_progress (
  player_id UUID,
  badge_id VARCHAR(50),
  progress DECIMAL(5,2) DEFAULT 0,
  earned BOOLEAN DEFAULT FALSE,
  earned_at TIMESTAMP,
  PRIMARY KEY (player_id, badge_id)
);
```

## 5.2 API Endpoints

```typescript
// GET /api/v1/player/:id/metrics
// Returns full metrics summary

// POST /api/v1/player/:id/session
// Log training session, updates metrics

// GET /api/v1/player/:id/badges
// Returns all badges with progress

// POST /api/v1/player/:id/strength
// Log gym session with exercises

// GET /api/v1/player/:id/prs
// Returns all personal records

// GET /api/v1/player/:id/progress/:badgeId
// Returns detailed progress for specific badge
```

## 5.3 Frontend Components

```
/components/gamification/
├── BadgeCard.jsx
├── BadgeGrid.jsx
├── BadgeModal.jsx
├── ProgressRing.jsx
├── SkillTree.jsx
├── MetricsWidget.jsx
├── StrengthWidget.jsx
├── SpeedWidget.jsx
├── VolumeWidget.jsx
├── PRList.jsx
├── StreakCounter.jsx
└── UnlockCelebration.jsx
```

---

# DEL 6: PRIORITERT IMPLEMENTERING

## Fase 1: Grunnleggende Metrikker (Uke 1-2)
- [ ] Player metrics database table
- [ ] Session logging med timer/type
- [ ] Total timer badges (7 nivåer)
- [ ] Streak tracking
- [ ] Basic dashboard widgets

## Fase 2: Styrke-tracking (Uke 3-4)
- [ ] Gym session logging
- [ ] Tonnage calculation
- [ ] PR tracking system
- [ ] Relative strength badges
- [ ] Strength widget

## Fase 3: Prestasjons-metrikker (Uke 5-6)
- [ ] Speed tracking (fra Trackman/GC integration)
- [ ] Accuracy metrics
- [ ] Putting stats
- [ ] Speed badges
- [ ] Precision badges

## Fase 4: Avansert Gamification (Uke 7-8)
- [ ] Skill trees UI
- [ ] Phase compliance tracking
- [ ] Milestone notifications
- [ ] Celebration animations
- [ ] Leaderboards (optional)

---

**Neste steg:** Velg hvilken metrikk-kategori som skal implementeres først.
