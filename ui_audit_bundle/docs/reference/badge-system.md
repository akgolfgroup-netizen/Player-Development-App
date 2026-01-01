# Badge System

> Gamification through achievements and badges

## Overview

The IUP Golf Platform includes a comprehensive badge system to motivate players and track achievements. There are **85 unique badges** across multiple categories.

## Badge Categories

| Category | Count | Description |
|----------|-------|-------------|
| Volume | 15 | Training quantity milestones |
| Streak | 12 | Consistency achievements |
| Performance | 18 | Skill-based achievements |
| Phase | 10 | Training phase completion |
| Special | 15 | Unique accomplishments |
| Seasonal | 15 | Time-based challenges |

## Badge Tiers

Each badge has three tiers:

| Tier | Icon | XP Reward |
|------|------|-----------|
| Bronze | 🥉 | 50 XP |
| Silver | 🥈 | 100 XP |
| Gold | 🥇 | 200 XP |

## Example Badges

### Volume Badges

| Badge | Bronze | Silver | Gold |
|-------|--------|--------|------|
| Session Master | 10 sessions | 50 sessions | 100 sessions |
| Hour Logger | 10 hours | 50 hours | 100 hours |
| Drill Champion | 100 drills | 500 drills | 1000 drills |

### Streak Badges

| Badge | Bronze | Silver | Gold |
|-------|--------|--------|------|
| Weekly Warrior | 2 weeks | 4 weeks | 8 weeks |
| Daily Dedication | 3 days | 7 days | 14 days |
| Monthly Master | 1 month | 3 months | 6 months |

### Performance Badges

| Badge | Requirement |
|-------|-------------|
| Category Champion | Score 8+ in any category |
| All-Rounder | Score 6+ in all categories |
| Driver Pro | Driving distance 250m+ |
| Putting Wizard | 1-putt percentage 40%+ |

## XP and Levels

Players earn XP from badges and progress through levels:

```
Level 1:    0 XP
Level 2:  500 XP
Level 3: 1000 XP
Level 4: 2000 XP
Level 5: 4000 XP
...
```

## Evaluation Logic

Badges are evaluated automatically after:
- Completing a training session
- Recording test results
- Logging practice time
- Finishing competitions

```typescript
// Simplified badge evaluation
async function evaluateBadges(playerId: string) {
  const metrics = await calculateMetrics(playerId);

  for (const badge of ALL_BADGES) {
    if (badge.requirements.met(metrics)) {
      await awardBadge(playerId, badge.id);
    }
  }
}
```

## Anti-Gaming

To prevent badge manipulation:

- Minimum time between session logs
- Verification for distance claims
- Coach approval for certain achievements
- Anomaly detection for unusual patterns

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /badges` | List all badges |
| `GET /badges/player/:id` | Player's earned badges |
| `GET /badges/progress/:id` | Badge progress |

## Badge Display

Badges appear in:
- Player profile
- Dashboard achievements section
- Leaderboards
- Sharing cards

---

See also:
- [Golf Categories](./golf-categories.md)
- [Test Protocols](./test-protocols.md)
