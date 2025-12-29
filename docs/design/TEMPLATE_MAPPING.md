# Template Mapping - Phase 2

**Status:** In Progress
**Date:** December 29, 2025

---

## Available Templates

| Template | Purpose | Key Features |
|----------|---------|--------------|
| `DashboardTemplate` | Main dashboards | Stats, widgets, grids |
| `ListTemplate` | List views | Search, filters, pagination |
| `DetailTemplate` | Detail pages | Header, content sections, actions |
| `ProfileTemplate` | User profiles | Avatar, info sections, tabs |
| `SettingsTemplate` | Settings pages | Form sections, toggles |
| `FormTemplate` | Form pages | Validation, submit actions |
| `StatsGridTemplate` | Statistics | Stats cards, trends |
| `CardGridTemplate` | Card layouts | Responsive grid of cards |
| `CalendarTemplate` | Calendar views | Day/week/month views |
| `AppShellTemplate` | Base wrapper | Header, navigation, content |

---

## Current Template Usage

### ✅ Using Templates (7 pages)

| File | Template(s) Used |
|------|------------------|
| `calendar/CalendarPage.tsx` | AppShellTemplate + CalendarTemplate |
| `coach-dashboard/CoachDashboard.tsx` | StatsGridTemplate |
| `coach-player/CoachPlayerPage.tsx` | StatsGridTemplate |
| `dashboard/AKGolfDashboard.jsx` | DashboardTemplate |
| `dashboard/DashboardPage.tsx` | AppShellTemplate + StatsGridTemplate |
| `goals/GoalsPage.tsx` | AppShellTemplate + StatsGridTemplate |
| `stats/StatsPageV2.tsx` | AppShellTemplate + StatsGridTemplate |

---

## Migration Plan

### Priority 1: High-Traffic Pages

| Page | Current State | Target Template | Effort |
|------|---------------|-----------------|--------|
| `sessions/SessionsListView.jsx` | Custom styles | ListTemplate | Medium |
| `sessions/SessionDetailView.jsx` | Custom styles | DetailTemplate | Medium |
| `profile/*` | Custom styles | ProfileTemplate | Medium |
| `achievements/AchievementsDashboard.jsx` | Custom styles | DashboardTemplate | Low |

### Priority 2: Coach Features

| Page | Current State | Target Template | Effort |
|------|---------------|-----------------|--------|
| `coach-athlete-list/*` | Custom styles | ListTemplate | Medium |
| `coach-athlete-detail/*` | Custom styles | DetailTemplate | Medium |
| `coach-videos/CoachVideosDashboard.jsx` | Custom styles | CardGridTemplate | Low |
| `coach-stats/*` | Custom styles | StatsGridTemplate | Low |
| `coach-exercises/*` | Custom styles | ListTemplate | Medium |

### Priority 3: Player Features

| Page | Current State | Target Template | Effort |
|------|---------------|-----------------|--------|
| `tests/*` | Custom styles | ListTemplate + DetailTemplate | Medium |
| `exercises/*` | Custom styles | ListTemplate | Low |
| `badges/*` | Custom styles | CardGridTemplate | Low |
| `video-library/VideoLibraryPage.jsx` | Custom styles | CardGridTemplate | Medium |
| `progress/ProgressDashboard.jsx` | Custom styles | DashboardTemplate | Medium |

### Priority 4: Admin/Settings

| Page | Current State | Target Template | Effort |
|------|---------------|-----------------|--------|
| `admin-*/*` | Custom styles | SettingsTemplate | Low |
| `innstillinger/*` | Custom styles | SettingsTemplate | Low |

### Priority 5: Utility Pages

| Page | Current State | Target Template | Effort |
|------|---------------|-----------------|--------|
| `not-found/NotFoundPage.tsx` | Custom styles | None (keep simple) | Skip |
| `planning/PlaceholderPage.jsx` | Placeholder | None (temporary) | Skip |

---

## Template Selection Guide

```
Is it a dashboard with widgets/stats?
  → DashboardTemplate or StatsGridTemplate

Is it a list of items?
  → ListTemplate

Is it a detail/single item view?
  → DetailTemplate

Is it a user profile?
  → ProfileTemplate

Is it settings/configuration?
  → SettingsTemplate

Is it a form submission?
  → FormTemplate

Is it a grid of cards?
  → CardGridTemplate

Is it a calendar?
  → CalendarTemplate
```

---

## Implementation Steps

### For Each Page Migration:

1. **Analyze current page structure**
   - What data does it display?
   - What actions are available?
   - What components does it use?

2. **Choose appropriate template**
   - Match to template selection guide above
   - Consider combination of templates if needed

3. **Refactor page component**
   ```tsx
   // Before
   export default function MyPage() {
     return (
       <div className="custom-styles">
         <h1>Title</h1>
         {/* content */}
       </div>
     );
   }

   // After
   import { ListTemplate } from '../../ui/templates';

   export default function MyPage() {
     return (
       <ListTemplate
         title="Title"
         items={items}
         // ... template props
       />
     );
   }
   ```

4. **Test responsiveness**
   - Mobile (320px)
   - Tablet (768px)
   - Desktop (1024px+)

5. **Verify design tokens**
   - Colors use CSS variables
   - Spacing uses design system values
   - Typography matches spec

---

## Metrics

- **Total page components:** ~36
- **Using templates:** 7 (19%)
- **Need migration:** ~25 (69%)
- **Skip (utility):** 4 (11%)

**Target:** 80% template coverage

---

## Next Actions

1. Start with `sessions/SessionsListView.jsx` (high traffic)
2. Migrate to ListTemplate
3. Verify consistent styling
4. Repeat for priority 1 pages
