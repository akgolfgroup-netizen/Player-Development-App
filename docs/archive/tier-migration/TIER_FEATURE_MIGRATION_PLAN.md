# TIER Feature Migration Plan
**Status:** I gang
**Estimert tid:** 20-30 timer
**Strategi:** High-impact features først

---

## 🎯 Prioriterte Features

### Prioritet 1 - Spiller Core (8-10 timer)
**Høyest synlighet og bruk**

1. **Dashboard** (`features/dashboard/`)
   - Main dashboard redesign
   - CategoryRing for A-K fremgang
   - StreakIndicator for treningsstreak
   - Stat cards med TierCard
   - Est. tid: 3 timer

2. **Badges** (`features/badges/`)
   - Badge gallery med AchievementBadge
   - Tier system (Bronze/Silver/Gold/Platinum)
   - Unlock animations
   - Est. tid: 2 timer

3. **Profile** (`features/profile/`)
   - Player header med level indicator
   - Stats cards
   - Achievement display
   - Est. tid: 2 timer

4. **Tests** (`features/tests/`)
   - Test cards med category colors
   - Pass/fail badges
   - Progress tracking
   - Est. tid: 1.5 timer

---

### Prioritet 2 - Coach Core (6-8 timer)

5. **Coach Dashboard** (`features/coach-dashboard/`)
   - Overview cards
   - Athlete list preview
   - Quick stats
   - Est. tid: 2 timer

6. **Coach Athlete List** (`features/coach-athlete-list/`)
   - Athlete cards
   - Status badges
   - Category indicators
   - Est. tid: 2 timer

7. **Coach Athlete Detail** (`features/coach-athlete-detail/`)
   - Detailed athlete view
   - Progress visualization
   - Category breakdown
   - Est. tid: 2 timer

---

### Prioritet 3 - Secondary Features (6-8 timer)

8. **Sessions** (`features/sessions/`)
   - Session cards
   - Evaluation badges
   - Est. tid: 1.5 timer

9. **Progress** (`features/progress/`)
   - Progress visualization
   - Category progress cards
   - Est. tid: 1.5 timer

10. **Goals** (`features/goals/`)
    - Goal cards
    - Status indicators
    - Est. tid: 1.5 timer

11. **Tournaments** (`features/tournaments/`)
    - Tournament cards
    - Result badges
    - Est. tid: 1.5 timer

---

## 🔧 Migration Strategy

### Phase 1: Component Replacement (iterativ)
For hver feature:
1. Identifiser eksisterende komponenter
2. Map til TIER komponenter
3. Replace med TIER komponenter
4. Test visuelt

### Phase 2: Color Migration
1. Erstatt hardkodede farger
2. Bruk TIER tokens
3. Test kontrast

### Phase 3: Polish
1. Legg til animasjoner
2. Responsiv testing
3. Accessibility check

---

## 📋 Komponent Mapping

### Eksisterende → TIER

| Gammel | TIER Replacement | Forbedring |
|--------|------------------|------------|
| `<button className="bg-green-600">` | `<TierButton variant="primary">` | Konsistent styling |
| `<div className="card">` | `<TierCard>` | Premium look |
| `<span className="badge">` | `<TierBadge variant="success">` | Status colors |
| Custom circle progress | `<CategoryRing>` | A-K colors + animation |
| Streak counter div | `<StreakIndicator>` | Fire animation |

---

## 🚀 Execution Plan

**Start:** Dashboard (spiller)
**Deretter:** Badges, Profile, Tests
**Coach:** Dashboard, Athlete List, Athlete Detail
**Polish:** Animations, responsivitet, dark mode

---

**Total estimert tid:** 20-30 timer (2-3 uker @ 10 timer/uke)
