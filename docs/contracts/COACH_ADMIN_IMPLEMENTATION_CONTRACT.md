# Coach / Admin UI Implementation Contract

**Status:** Binding Contract
**Version:** 1.0
**Date:** 2025-12-18
**Dependencies:**
- COACH_ADMIN_AUTHORITY_CONTRACT.md
- COACH_ADMIN_JOURNEYS.md
- COACH_ADMIN_SCREEN_CONTRACT.md
- IMPLEMENTATION_CONTRACT.md (golfer)

This document defines non-negotiable implementation rules that make it **technically impossible** for Coach/Admin UI to violate the Authority and Screen Contracts.

This is NOT UI design. This is implementation enforcement.

**Violations of this contract are blocking issues. No exceptions.**

---

## PART 1 — DATA ACCESS RULES

### 1.1 Screen-Level Data Access Matrix

Each screen has explicit data access permissions. Queries outside this matrix MUST fail.

#### Coach Screens

| Screen | Allowed Data | Forbidden Data |
|--------|--------------|----------------|
| CAL (Athlete List) | athlete.name, athlete.id, session.nextDate, session.lastCompletedDate | proof.*, trajectory.*, reflection.*, baseline.value, any performance metric |
| CAD (Athlete Detail) | athlete.*, plan.*, session.completionStatus, effort.totals, baseline.value (read-only) | proof.interpretation, trajectory.trend, reflection.content (unless shared), other athletes |
| CTP (Training Plan) | plan.*, block.*, session.future | session.past (write), proof.*, baseline.* (write) |
| CPV (PROOF Viewer) | proof.* (read-only, this athlete only) | proof.* (write), other athletes' proof, annotations |
| CTV (Trajectory Viewer) | trajectory.* (read-only, this athlete only) | trajectory.* (write), trend calculations, other athletes |
| CNT (Notes) | coachNote.* (own notes only) | proof.*, trajectory.*, other coaches' notes |

#### Admin Screens

| Screen | Allowed Data | Forbidden Data |
|--------|--------------|----------------|
| ADO (Overview) | aggregate.userCount, aggregate.tierCounts, system.health, audit.log | individual.*, proof.*, trajectory.*, coach.content |
| AFF (Feature Flags) | feature.*, tier.featureAssignment | user.*, performance.*, coach.* |
| ATM (Tier Management) | tier.*, tier.userCount (aggregate) | tier.userList, performance.*, user.names |
| ACM (Coach Management) | coach.account.*, coach.athleteCount | coach.athletes, coach.notes, athlete.performance |
| AES (Escalation) | ticket.*, system.logs (anonymized) | user.data (without consent), proof.*, trajectory.* |

---

### 1.2 Forbidden Joins

The following JOIN operations MUST be rejected at the query layer:

| ID | Forbidden Join | Rationale |
|----|----------------|-----------|
| FJ-01 | athlete JOIN athlete ON performance | Enables comparison |
| FJ-02 | athlete JOIN ranking | Ranking table must not exist |
| FJ-03 | coach JOIN athlete.performance | Admin boundary |
| FJ-04 | proof JOIN coachNote | Keeps data separate |
| FJ-05 | trajectory JOIN trendAnalysis | Trend analysis forbidden |
| FJ-06 | athlete JOIN aggregate.performance | Individual in aggregate |
| FJ-07 | session JOIN outcome.evaluation | Evaluation forbidden |

**Enforcement:** Query middleware MUST reject queries containing forbidden joins.

---

### 1.3 Forbidden Derived Metrics

The following calculations MUST NOT exist in Coach/Admin code:

| ID | Forbidden Metric | Rationale |
|----|------------------|-----------|
| FM-01 | athlete.rank | Ranking forbidden |
| FM-02 | athlete.percentile | Comparison forbidden |
| FM-03 | athlete.trend | Trend analysis forbidden |
| FM-04 | athlete.status (on-track/off-track) | Status labels forbidden |
| FM-05 | athlete.improvementRate | Progress language forbidden |
| FM-06 | coach.effectiveness | Coach evaluation forbidden |
| FM-07 | session.qualityScore | Evaluation forbidden |
| FM-08 | proof.interpretation | System interpretation forbidden |
| FM-09 | trajectory.prediction | Prediction forbidden |
| FM-10 | athlete.riskLevel | Risk labels forbidden |

**Enforcement:** Static analysis MUST flag any code that calculates these metrics.

---

### 1.4 Forbidden Aggregations

The following aggregations MUST NOT be computed or displayed:

| ID | Forbidden Aggregation | Rationale |
|----|----------------------|-----------|
| FA-01 | AVG(athlete.performance) grouped by coach | Coach comparison |
| FA-02 | COUNT(athlete) WHERE performance < threshold | "Problem" lists |
| FA-03 | TOP N athletes by any metric | Leaderboard |
| FA-04 | BOTTOM N athletes by any metric | Problem list |
| FA-05 | athlete.performance PERCENTILE | Ranking |
| FA-06 | GROUP BY performance.tier | Performance tiers forbidden |

**Minimum aggregation size:** Any aggregation shown to Admin MUST have N ≥ 10. Groups smaller than 10 MUST show "< 10".

---

### 1.5 Historical Mutation Rules

| ID | Rule | Enforcement |
|----|------|-------------|
| HM-01 | PROOF records are immutable | No UPDATE/DELETE on proof table from Coach/Admin |
| HM-02 | BASELINE values are immutable | No UPDATE on baseline from Coach/Admin |
| HM-03 | TRAJECTORY records are immutable | No UPDATE/DELETE on trajectory from Coach/Admin |
| HM-04 | REFLECTION records are immutable | No UPDATE/DELETE from Coach/Admin |
| HM-05 | Completed sessions are immutable | No UPDATE on session WHERE completed = true |
| HM-06 | Coach notes (delivered) are immutable | No UPDATE/DELETE on notes WHERE delivered = true |

**Enforcement:** Database triggers MUST reject mutations. API layer MUST not expose mutation endpoints.

---

## PART 2 — RENDERING CONSTRAINTS

### 2.1 Forbidden Visual Signals

The following visual patterns MUST NOT appear in Coach/Admin UI:

| ID | Forbidden Signal | Rationale |
|----|------------------|-----------|
| FV-01 | Red/Yellow/Green status indicators | Judgment colors |
| FV-02 | Up/Down arrows | Trend indication |
| FV-03 | Checkmarks for "good" performance | Evaluation |
| FV-04 | X marks for "bad" performance | Evaluation |
| FV-05 | Progress bars | Progress indication |
| FV-06 | Sparklines | Trend visualization |
| FV-07 | Heat maps | Performance comparison |
| FV-08 | Star ratings | Evaluation |
| FV-09 | Trophy/medal icons | Achievement/gamification |
| FV-10 | Warning badges | "Needs attention" |
| FV-11 | Celebration animations | Positive reinforcement |
| FV-12 | Sad/concerned icons | Negative framing |

**Forbidden colors (performance context):**

| ID | Color | Hex | Context |
|----|-------|-----|---------|
| FC-01 | Success green | #4A7C59, #22c55e | Performance indication |
| FC-02 | Error red | #C45B4E, #ef4444 | Performance indication |
| FC-03 | Warning yellow | #f59e0b, #eab308 | Status indication |

**Allowed colors:** Neutral palette only (charcoal, steel, mist, snow, white, surface).

---

### 2.2 Component Reuse Requirements

#### Components that MUST be reused from golfer system

| Component | Reuse Requirement | Rationale |
|-----------|-------------------|-----------|
| PROOF display | MUST be identical to golfer PROOF | No coach interpretation layer |
| TRAJECTORY display | MUST be identical to golfer TRAJECTORY | No trend overlay |
| Delta display | MUST use same neutral formatting | Consistency |
| Date formatting | MUST use same format | Consistency |
| Number formatting | MUST use same precision | Consistency |

**Implementation:** Coach PROOF/TRAJECTORY viewers MUST import and render the exact golfer components. No wrapper that adds interpretation.

---

### 2.3 Components that MUST NOT Exist

The following components MUST NOT be created for Coach/Admin:

| ID | Forbidden Component | Rationale |
|----|---------------------|-----------|
| FComp-01 | `<AthleteRanking />` | Ranking forbidden |
| FComp-02 | `<PerformanceChart />` | Trend visualization forbidden |
| FComp-03 | `<TrendArrow />` | Trend indication forbidden |
| FComp-04 | `<StatusBadge />` | Status labels forbidden |
| FComp-05 | `<ProgressSummary />` | Progress language forbidden |
| FComp-06 | `<ComparisonTable />` | Comparison forbidden |
| FComp-07 | `<InsightCard />` | System insights forbidden |
| FComp-08 | `<RecommendationPanel />` | Recommendations forbidden |
| FComp-09 | `<AlertBanner type="performance" />` | Performance alerts forbidden |
| FComp-10 | `<LeaderboardList />` | Leaderboard forbidden |
| FComp-11 | `<EffectivenessScore />` | Evaluation forbidden |
| FComp-12 | `<AtRiskIndicator />` | Risk labels forbidden |

**Enforcement:** CI MUST fail if any of these component names exist in codebase.

---

### 2.4 Identical Rendering Requirements

#### CPV (Coach PROOF Viewer)

```
REQUIREMENT: CPV-RENDER-01
The Coach PROOF Viewer MUST render PROOF data using the EXACT same component as the golfer PROOF screen.

IMPLEMENTATION:
- Import: `import { ProofDisplay } from '@athlete/proof'`
- No wrapper component that adds coach-specific elements
- No additional props that modify display
- No conditional rendering based on viewer role

VERIFICATION:
- Visual diff test: Coach view vs Athlete view MUST be pixel-identical
- Component import check: MUST import from athlete module
```

#### CTV (Coach Trajectory Viewer)

```
REQUIREMENT: CTV-RENDER-01
The Coach Trajectory Viewer MUST render TRAJECTORY data using the EXACT same component as the golfer TRAJECTORY screen.

IMPLEMENTATION:
- Import: `import { TrajectoryList } from '@athlete/trajectory'`
- No trend overlay
- No chart additions
- No analysis components

VERIFICATION:
- Visual diff test: Coach view vs Athlete view MUST be pixel-identical
- Component import check: MUST import from athlete module
```

---

## PART 3 — INTERACTION CONSTRAINTS

### 3.1 Forbidden Interactions

| ID | Forbidden Interaction | Screen | Rationale |
|----|----------------------|--------|-----------|
| FI-01 | Sort by performance | CAL | Ranking |
| FI-02 | Sort by improvement | CAL | Ranking |
| FI-03 | Sort by "last active" with performance context | CAL | Implicit prioritization |
| FI-04 | Filter by performance threshold | CAL | "Problem" filtering |
| FI-05 | Select multiple athletes for comparison | CAL, CAD | Comparison |
| FI-06 | Export with performance rankings | Any | Ranking |
| FI-07 | Drag to reorder by performance | CAL | Manual ranking |
| FI-08 | Click to see "similar athletes" | CAD | Comparison |
| FI-09 | Annotate PROOF records | CPV | Interpretation injection |
| FI-10 | Add trend line | CTV | Trend visualization |
| FI-11 | Modify past records | CTP | Historical mutation |
| FI-12 | Backdate entries | CTP | Historical mutation |

---

### 3.2 Allowed Sort Options

| Screen | Allowed Sorts | Default |
|--------|---------------|---------|
| CAL | Alphabetical (name), Next session date | Alphabetical |
| CAD | N/A (single athlete view) | N/A |
| CTP | Chronological (date) | Chronological ascending |
| CPV | Chronological (date) | Chronological descending |
| CTV | Chronological (date), Category filter | Chronological descending |
| CNT | Chronological (date) | Chronological descending |

**No other sort options may be added.**

---

### 3.3 Navigation Constraints

| ID | Rule | Rationale |
|----|------|-----------|
| NC-01 | Coach screens MUST NOT link to Admin screens | Role separation |
| NC-02 | Admin screens MUST NOT link to Coach screens | Role separation |
| NC-03 | Coach MUST NOT navigate to another athlete from PROOF/TRAJECTORY | Prevents side-by-side comparison |
| NC-04 | Admin MUST NOT navigate to individual athlete data | Admin boundary |
| NC-05 | No "compare" navigation pattern | Comparison forbidden |

**Navigation from CPV/CTV:** Return to Athlete Detail only. No "Next athlete" or "Previous athlete".

---

### 3.4 Confirmation Requirements

High-authority actions MUST require explicit confirmation:

| Action | Confirmation Required | Confirmation Text |
|--------|----------------------|-------------------|
| Delete future training block | Yes | "Remove this training block?" |
| Deactivate coach account | Yes | "Deactivate coach account? They will lose access." |
| Enable feature globally | Yes | "Enable {feature} for all users in {tier}?" |
| Modify tier definition | Yes | "Change tier definition? This affects {N} users." |
| Access user data (escalation) | Yes + Consent | "Request user consent to access their data?" |

**No confirmation bypasses allowed.**

---

## PART 4 — ENFORCEMENT MECHANISMS

### 4.1 CI Rules

```yaml
# .github/workflows/coach-admin-contract.yml

name: Coach/Admin Contract Enforcement

on:
  pull_request:
    paths:
      - 'apps/web/src/features/coach-**'
      - 'apps/web/src/features/admin-**'
      - 'apps/web/src/routes/coach**'
      - 'apps/web/src/routes/admin**'
  push:
    branches: [main]
    paths:
      - 'apps/web/src/features/coach-**'
      - 'apps/web/src/features/admin-**'

jobs:
  enforce-contract:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npx tsx scripts/coach-admin-contract-check.ts
```

---

### 4.2 Contract Check Script Requirements

```typescript
// scripts/coach-admin-contract-check.ts

// MUST check for:

// 1. Forbidden component names
const FORBIDDEN_COMPONENTS = [
  'AthleteRanking',
  'PerformanceChart',
  'TrendArrow',
  'StatusBadge',
  'ProgressSummary',
  'ComparisonTable',
  'InsightCard',
  'RecommendationPanel',
  'LeaderboardList',
  'EffectivenessScore',
  'AtRiskIndicator',
];

// 2. Forbidden colors in coach/admin code
const FORBIDDEN_COLORS = [
  '#4A7C59', '#22c55e',  // success green
  '#C45B4E', '#ef4444',  // error red
  '#f59e0b', '#eab308',  // warning yellow
];

// 3. Forbidden strings
const FORBIDDEN_STRINGS = [
  /\brank/i,
  /\bleaderboard/i,
  /\bcompare.*athlete/i,
  /\bon.?track/i,
  /\boff.?track/i,
  /\bimproving/i,
  /\bdeclining/i,
  /\bat.?risk/i,
  /\bneeds.?attention/i,
  /\btop.?performer/i,
  /\bbottom.?performer/i,
  /\beffectiveness/i,
];

// 4. Forbidden data access patterns
const FORBIDDEN_QUERIES = [
  /ORDER BY.*performance/i,
  /ORDER BY.*score/i,
  /ORDER BY.*rank/i,
  /GROUP BY.*athlete.*performance/i,
  /WHERE.*performance.*[<>]/i,
  /JOIN.*ranking/i,
];

// 5. Component import verification
// CPV must import from athlete module
// CTV must import from athlete module
```

---

### 4.3 Lint Rules

```javascript
// .eslintrc.coach-admin.js

module.exports = {
  rules: {
    // No performance-based sorting
    'no-restricted-syntax': [
      'error',
      {
        selector: 'CallExpression[callee.property.name="sort"][arguments.0.body.body.0.argument.property.name=/performance|score|rank/]',
        message: 'Performance-based sorting is forbidden in Coach/Admin'
      }
    ],

    // No forbidden component imports
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['**/ranking/**', '**/leaderboard/**', '**/comparison/**'],
            message: 'Ranking/comparison imports forbidden in Coach/Admin'
          }
        ]
      }
    ]
  }
};
```

---

### 4.4 Component Boundaries

```
apps/web/src/
├── features/
│   ├── coach-*/           # Coach screens
│   │   └── ALLOWED: Import from @athlete/proof, @athlete/trajectory
│   │   └── FORBIDDEN: Create own PROOF/TRAJECTORY rendering
│   │
│   └── admin-*/           # Admin screens
│       └── FORBIDDEN: Import any athlete data components
│       └── FORBIDDEN: Import any coach content components
│
├── components/
│   ├── athlete/           # Shared athlete components (golfer + coach viewer)
│   │   ├── ProofDisplay.tsx       # Reused in golfer + CPV
│   │   └── TrajectoryList.tsx     # Reused in golfer + CTV
│   │
│   ├── coach/             # Coach-only components
│   │   └── FORBIDDEN: Any ranking, comparison, trend components
│   │
│   └── admin/             # Admin-only components
│       └── FORBIDDEN: Any individual athlete data components
```

---

### 4.5 Database-Level Enforcement

```sql
-- Triggers to prevent historical mutation from Coach/Admin

CREATE OR REPLACE FUNCTION prevent_proof_mutation()
RETURNS TRIGGER AS $$
BEGIN
  IF current_setting('app.role', true) IN ('coach', 'admin') THEN
    RAISE EXCEPTION 'PROOF records are immutable for coach/admin';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER proof_immutable
BEFORE UPDATE OR DELETE ON proof
FOR EACH ROW EXECUTE FUNCTION prevent_proof_mutation();

-- Similar triggers for: baseline, trajectory, reflection, completed sessions
```

---

### 4.6 API-Level Enforcement

```typescript
// middleware/authority-guard.ts

const FORBIDDEN_ENDPOINTS_COACH = [
  { method: 'PUT', path: /\/proof\// },
  { method: 'DELETE', path: /\/proof\// },
  { method: 'PUT', path: /\/baseline\// },
  { method: 'DELETE', path: /\/trajectory\// },
  { method: 'GET', path: /\/athletes\/compare/ },
  { method: 'GET', path: /\/athletes\/rank/ },
];

const FORBIDDEN_ENDPOINTS_ADMIN = [
  { method: 'GET', path: /\/athlete\/\d+\/proof/ },
  { method: 'GET', path: /\/athlete\/\d+\/trajectory/ },
  { method: 'GET', path: /\/coach\/\d+\/athletes/ },
  { method: 'GET', path: /\/coach\/\d+\/notes/ },
];

export function authorityGuard(role: 'coach' | 'admin') {
  return (req, res, next) => {
    const forbidden = role === 'coach'
      ? FORBIDDEN_ENDPOINTS_COACH
      : FORBIDDEN_ENDPOINTS_ADMIN;

    const violation = forbidden.find(f =>
      f.method === req.method && f.path.test(req.path)
    );

    if (violation) {
      return res.status(403).json({
        error: 'AUTHORITY_VIOLATION',
        message: 'This action is forbidden for your role'
      });
    }

    next();
  };
}
```

---

### 4.7 Review Gates

All PRs touching Coach/Admin code MUST include:

```markdown
## Coach/Admin Contract Compliance

- [ ] No forbidden components created
- [ ] No forbidden colors used
- [ ] No forbidden strings in UI text
- [ ] No performance-based sorting
- [ ] No comparison functionality
- [ ] No ranking functionality
- [ ] CPV imports from @athlete/proof
- [ ] CTV imports from @athlete/trajectory
- [ ] No historical data mutation
- [ ] High-authority actions have confirmation
- [ ] Tested against contract-check.ts

If any checkbox cannot be checked, PR is blocked.
```

---

## PART 5 — VIOLATION HANDLING

### 5.1 What Constitutes a Blocking Violation

| Category | Violation | Severity |
|----------|-----------|----------|
| Data Access | Query returns forbidden data | BLOCKING |
| Data Access | Join uses forbidden pattern | BLOCKING |
| Data Access | Historical mutation attempted | BLOCKING |
| Rendering | Forbidden component exists | BLOCKING |
| Rendering | Forbidden color in performance context | BLOCKING |
| Rendering | PROOF/TRAJECTORY not identical to athlete | BLOCKING |
| Interaction | Performance-based sorting exists | BLOCKING |
| Interaction | Comparison functionality exists | BLOCKING |
| Interaction | Ranking functionality exists | BLOCKING |
| Text | Forbidden string in UI | BLOCKING |
| Text | "Progress" language in coach view | BLOCKING |

**All violations are blocking. There is no "warning" level.**

---

### 5.2 Automated Detection

| Detection Method | What It Catches |
|-----------------|-----------------|
| CI contract-check.ts | Forbidden components, colors, strings, query patterns |
| ESLint rules | Sorting patterns, import violations |
| Database triggers | Historical mutation attempts |
| API middleware | Forbidden endpoint access |
| Visual regression tests | PROOF/TRAJECTORY rendering parity |

**Detection runs on:**
- Every PR (pre-merge)
- Every push to main (post-merge verification)
- Nightly full scan

---

### 5.3 Exception Policy

**Default: NO EXCEPTIONS**

Exceptions require:
1. Written justification documenting why violation is necessary
2. Explicit approval from project authority
3. Documented compensating control
4. Time-limited exception with review date
5. Entry in EXCEPTIONS.md with expiration

**Exceptions for the following are NEVER granted:**
- Ranking functionality
- Athlete comparison
- Performance-based sorting
- Historical data mutation
- Status labels (on-track/off-track)
- Trend visualization

---

### 5.4 Violation Response

```
VIOLATION DETECTED
       │
       ▼
┌─────────────────┐
│ CI Fails        │
│ PR Blocked      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Developer fixes │
│ violation       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Re-run CI       │
│ Contract check  │
└────────┬────────┘
         │
         ▼
    Pass? ──No──► Back to fix
         │
        Yes
         │
         ▼
┌─────────────────┐
│ PR can merge    │
└─────────────────┘
```

**No merge without green contract check.**

---

## COMPLIANCE SUMMARY

| Layer | Enforcement | Automated |
|-------|-------------|-----------|
| Query | Middleware + Triggers | Yes |
| API | Authority Guard | Yes |
| Component | Import restrictions + CI | Yes |
| Visual | Forbidden colors/components | Yes |
| Text | Forbidden strings | Yes |
| Interaction | Lint rules + CI | Yes |
| Review | PR checklist | Manual + CI |

**Total automated checks:** 50+
**Manual review gates:** 1 (PR checklist)
**Exception policy:** None by default

---

## DOCUMENT AUTHORITY

This document has equal authority to:
- IMPLEMENTATION_CONTRACT.md (golfer)
- COACH_ADMIN_AUTHORITY_CONTRACT.md
- COACH_ADMIN_JOURNEYS.md
- COACH_ADMIN_SCREEN_CONTRACT.md

All Coach/Admin implementation MUST comply with this document.

**Violations are blocking. No exceptions without documented approval.**
