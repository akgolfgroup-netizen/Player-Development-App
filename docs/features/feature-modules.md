# IUP Golf - Feature Modules Documentation

**Version:** 1.0
**Last Updated:** 2025-12-20
**Design System:** Blue Palette 01 (v3.0)

---

## Table of Contents

1. [Overview](#overview)
2. [Shared Features](#shared-features)
3. [Player Features](#player-features)
4. [Coach Features](#coach-features)
5. [Admin Features](#admin-features)
6. [Feature Dependencies](#feature-dependencies)

---

## Overview

The IUP Golf application is organized into **36 feature modules** grouped by user role. Each feature module is self-contained with its own components, state management, and API integrations.

### Architecture Pattern
- **Component Pattern:** Container/Presenter pattern with hooks
- **State Management:** React Context API + Local State (useState)
- **Styling:** Inline styles using design tokens
- **API Communication:** Axios with JWT authentication
- **File Organization:** Feature-first structure

---

## Shared Features

Features accessible to all authenticated users.

### 1. Authentication (`auth/`)

**Purpose:** Handle user authentication and session management.

**Key Components:**
- `Login.jsx` - Main authentication interface

**File Path:** `/apps/web/src/features/auth/Login.jsx`

**State Management:**
- Uses `AuthContext` from `/contexts/AuthContext`
- Local state for form inputs and error handling

**User Interactions:**
- Email/password login
- Demo login for different roles (player, coach, admin)
- Password reset functionality

**API Integrations:**
- `POST /api/auth/login`
- `POST /api/auth/reset-password`

---

### 2. Dashboard (`dashboard/`)

**Purpose:** Main landing page showing personalized overview.

**Key Components:**
- `AKGolfDashboard.jsx` - Main dashboard component
- `DashboardContainer.jsx` - Data container
- Widgets: CountdownWidget, TrainingStatsWidget, TasksWidget, MessagesWidget, GamificationWidget

**File Path:** `/apps/web/src/features/dashboard/AKGolfDashboard.jsx`

**State Management:**
- Props for dashboard data from API
- Local state for tasks

**API Integrations:**
- `GET /api/dashboard` - Fetch personalized dashboard data

---

### 3. Calendar (`calendar/`)

**Purpose:** View and manage training calendar with events.

**Key Components:**
- `Kalender.jsx` - Calendar view
- `KalenderContainer.jsx` - Data container

**File Path:** `/apps/web/src/features/calendar/`

**API Integrations:**
- `GET /api/calendar/events`
- `GET /api/calendar/sessions`

---

### 4. Profile (`profile/`)

**Purpose:** User profile management and onboarding.

**Key Components:**
- `BrukerprofilContainer.jsx`
- `ak_golf_brukerprofil_onboarding.jsx`

**File Path:** `/apps/web/src/features/profile/`

**API Integrations:**
- `GET /api/user/profile`
- `PUT /api/user/profile`

---

## Player Features

Features designed specifically for player/athlete users.

### 5. Annual Plan (`annual-plan/`)

**Purpose:** View yearly training plan based on periodization.

**Key Components:**
- `Aarsplan.jsx` - Main annual plan view
- `AarsplanContainer.jsx` - Data container
- `PlanPreview.jsx` - Plan preview

**File Path:** `/apps/web/src/features/annual-plan/`

**Key Features:**
- **Periodization:** 4 training periods (E, G, S, T)
  - E (Evaluering) - Assessment phase
  - G (Grunnperiode) - Base building
  - S (Spesialperiode) - Specific preparation
  - T (Turnering) - Competition phase
- **Priority System:** Visual bars (0-3)
- **Five Process Areas:** Teknisk, Fysisk, Mental, Strategisk, Sosial

**API Integrations:**
- `GET /api/annual-plan/:playerId`

---

### 6. Sessions (`sessions/`)

**Purpose:** Active training session execution with real-time tracking.

**Key Components:**
- `ActiveSessionView.jsx` - Live session interface
- `SessionDetailView.jsx` - Session details
- `SessionReflectionForm.jsx` - Post-session reflection
- `BlockRatingModal.jsx` - Rate individual blocks
- `ExerciseLibrary.jsx` - Exercise database

**File Path:** `/apps/web/src/features/sessions/`

**State Management:**
- Current block index
- Completed blocks tracking
- Total time and block time
- Rep counter
- Pause state

**API Integrations:**
- `GET /api/sessions/:id`
- `POST /api/sessions/:id/start`
- `PUT /api/sessions/:id/blocks/:blockId/complete`
- `POST /api/sessions/:id/complete`

---

### 7. Progress (`progress/`)

**Purpose:** Track training plan progress and analytics.

**Key Components:**
- `ProgressDashboard.jsx` - Analytics dashboard
- `ProgressWidget.jsx` - Dashboard widget

**File Path:** `/apps/web/src/features/progress/`

**API Integrations:**
- `GET /api/training-plan/:planId/analytics`

---

### 8. Goals (`goals/`)

**Purpose:** Set, track, and manage personal golf goals.

**Key Components:**
- `Målsetninger.jsx` - Goals management interface

**File Path:** `/apps/web/src/features/goals/`

**Goal Categories:**
- Score/Resultat
- Teknikk
- Fysisk
- Mental
- Turnering
- Prosess

**API Integrations:**
- `GET /api/goals`
- `POST /api/goals`
- `PUT /api/goals/:id`
- `PUT /api/goals/:id/progress`

---

### 9. Training Protocol (`training/`)

**Purpose:** Access library of training sessions and protocols.

**Key Components:**
- `Treningsprotokoll.jsx` - Training protocol library
- `Treningsstatistikk.jsx` - Training statistics

**File Path:** `/apps/web/src/features/training/`

**TIER Golf Parameters:**
- **Learning Phase (L1-L5):** Exposure → Automaticity
- **Club Speed (CS0-CS100):** N/A to Max speed
- **Setting (S1-S10):** Range → Tournament

**API Integrations:**
- `GET /api/training/sessions`

---

### 10. Tests (`tests/`)

**Purpose:** View test results and track benchmark progress.

**Key Components:**
- `Testresultater.jsx` - Test results display
- `Testprotokoll.jsx` - Test protocol viewer

**File Path:** `/apps/web/src/features/tests/`

**Test Categories:**
- Golf
- Teknikk
- Fysisk
- Mental
- Strategisk

**API Integrations:**
- `GET /api/tests/results`
- `GET /api/tests/benchmarks`

---

### 11. Achievements (`achievements/`)

**Purpose:** View earned badges and track gamification progress.

**Key Components:**
- `AchievementsDashboard.jsx`
- `AchievementsDashboardContainer.jsx`

**File Path:** `/apps/web/src/features/achievements/`

**API Integrations:**
- `GET /api/achievements`
- `GET /api/achievements/progress`

---

### 12. Badges (`badges/`)

**Purpose:** Display badge collection and requirements.

**Key Components:**
- `Badges.jsx` - Badge gallery

**File Path:** `/apps/web/src/features/badges/`

**API Integrations:**
- `GET /api/badges`

---

### 13. Coaches (`coaches/`)

**Purpose:** View coach team and contact information.

**Key Components:**
- `Trenerteam.jsx`
- `TrenerteamContainer.jsx`

**File Path:** `/apps/web/src/features/coaches/`

**API Integrations:**
- `GET /api/coaches/team`

---

### 14. Exercises (`exercises/`)

**Purpose:** Browse exercise library with instructions.

**Key Components:**
- `Øvelser.jsx` - Exercise browser
- `OevelserContainer.jsx`

**File Path:** `/apps/web/src/features/exercises/`

**API Integrations:**
- `GET /api/exercises`
- `GET /api/exercises/:id`

---

### 15. Notes (`notes/`)

**Purpose:** Personal training notes and journal.

**Key Components:**
- `Notater.jsx`
- `NotaterContainer.jsx`

**File Path:** `/apps/web/src/features/notes/`

**API Integrations:**
- `GET /api/notes`
- `POST /api/notes`
- `PUT /api/notes/:id`
- `DELETE /api/notes/:id`

---

### 16. School (`school/`)

**Purpose:** View school schedule and academic integration.

**Key Components:**
- `Skoleplan.jsx`
- `SkoleplanContainer.jsx`

**File Path:** `/apps/web/src/features/school/`

**API Integrations:**
- `GET /api/skoleplan`

---

### 17. Stats (`stats/`)

**Purpose:** Personal statistics and performance metrics.

**Key Components:**
- `StatsPage.tsx`

**File Path:** `/apps/web/src/features/stats/`

**API Integrations:**
- `GET /api/stats/player/:id`

---

### 18. Tournaments (`tournaments/`)

**Purpose:** View tournament schedule and results.

**Key Components:**
- `TurneringskalenderContainer.jsx`

**File Path:** `/apps/web/src/features/tournaments/`

**API Integrations:**
- `GET /api/tournaments`

---

### 19. Archive (`archive/`)

**Purpose:** Access archived sessions and historical data.

**Key Components:**
- `Arkiv.jsx`
- `ArkivContainer.jsx`

**File Path:** `/apps/web/src/features/archive/`

**API Integrations:**
- `GET /api/archive`
- `POST /api/archive/:id/restore`

---

### 20. Knowledge (`knowledge/`)

**Purpose:** Access training resources and educational content.

**Key Components:**
- `RessurserContainer.jsx`

**File Path:** `/apps/web/src/features/knowledge/`

**API Integrations:**
- `GET /api/resources`

---

## Coach Features

Features designed specifically for coach users.

### 21. Coach Dashboard (`coach-dashboard/`)

**Purpose:** Overview dashboard for coaches showing athletes and pending items.

**Key Components:**
- `CoachDashboard.tsx`

**File Path:** `/apps/web/src/features/coach-dashboard/`

**Dashboard Widgets:**
- Athletes List (alphabetically sorted)
- Pending Items
- Today's Schedule
- Week Statistics

**Contract Compliance:**
- Alphabetical sorting ONLY (by last name)
- No performance metrics displayed
- Neutral presentation

**API Integrations:**
- `GET /api/coach/dashboard`
- `GET /api/coach/athletes`
- `GET /api/coach/pending`

---

### 22. Coach Athlete List (`coach-athlete-list/`)

**Purpose:** Neutral alphabetical list of all athletes.

**Key Components:**
- `CoachAthleteList.tsx`

**File Path:** `/apps/web/src/features/coach-athlete-list/`

**Contract Compliance:**
- NO counts, badges, or performance indicators
- NO ranking or comparison
- Alphabetical only

**API Integrations:**
- `GET /api/coach/athletes`

---

### 23. Coach Athlete Detail (`coach-athlete-detail/`)

**Purpose:** Navigation hub to access approved coach tools.

**Key Components:**
- `CoachAthleteDetail.tsx`

**File Path:** `/apps/web/src/features/coach-athlete-detail/`

**Navigation Items (4 approved tools):**
1. Se dokumentasjon (View Proof)
2. Se utvikling (View Trajectory)
3. Treningsplan (Edit Training Plan)
4. Notater (View/Edit Notes)

**Contract Compliance:**
- NO summaries or performance indicators
- NO prioritization or default focus
- Navigation only - gateway to tools

---

### 24. Coach Proof Viewer (`coach-proof-viewer/`)

**Purpose:** View athlete-uploaded photos and videos.

**Key Components:**
- `CoachProofViewer.tsx`

**File Path:** `/apps/web/src/features/coach-proof-viewer/`

**API Integrations:**
- `GET /api/coach/proof/:athleteId`
- `POST /api/coach/proof/:id/comment`

---

### 25. Coach Trajectory Viewer (`coach-trajectory-viewer/`)

**Purpose:** Visualize athlete progress and development trends.

**Key Components:**
- `CoachTrajectoryViewer.tsx`

**File Path:** `/apps/web/src/features/coach-trajectory-viewer/`

**API Integrations:**
- `GET /api/coach/trajectory/:athleteId`

---

### 26. Coach Training Plan Editor (`coach-training-plan-editor/`)

**Purpose:** Create and edit training plans for athletes.

**Key Components:**
- `CoachTrainingPlanEditor.tsx`

**File Path:** `/apps/web/src/features/coach-training-plan-editor/`

**API Integrations:**
- `GET /api/coach/plans/:athleteId`
- `POST /api/coach/plans`
- `PUT /api/coach/plans/:id`

---

### 27. Coach Training Plan (`coach-training-plan/`)

**Purpose:** View athlete's current training plan.

**Key Components:**
- `CoachTrainingPlan.tsx`

**File Path:** `/apps/web/src/features/coach-training-plan/`

**API Integrations:**
- `GET /api/coach/plans/:athleteId/current`

---

### 28. Coach Notes (`coach-notes/`)

**Purpose:** Private coach notes about athletes.

**Key Components:**
- `CoachNotes.tsx`

**File Path:** `/apps/web/src/features/coach-notes/`

**API Integrations:**
- `GET /api/coach/notes/:athleteId`
- `POST /api/coach/notes`
- `PUT /api/coach/notes/:id`

---

### 29. Coach Intelligence (`coach-intelligence/`)

**Purpose:** Receive automated alerts about athlete performance.

**Key Components:**
- `CoachAlertsPage.tsx`

**File Path:** `/apps/web/src/features/coach-intelligence/`

**Alert Types:**
- Missed sessions
- Performance changes
- Engagement drops
- Milestone achievements

**API Integrations:**
- `GET /api/coach/alerts`
- `PUT /api/coach/alerts/:id/read`

---

### 30. Modification Request Dashboard (`coach/`)

**Purpose:** Handle athlete modification requests for training plans.

**Key Components:**
- `ModificationRequestDashboard.jsx`
- `ModificationRequestDashboardContainer.jsx`

**File Path:** `/apps/web/src/features/coach/`

**API Integrations:**
- `GET /api/coach/modification-requests`
- `PUT /api/coach/modification-requests/:id`

---

### 31. Player Overview (`player-overview/`)

**Purpose:** Detailed player information (coach view).

**Key Components:**
- `PlayerOverviewPage.tsx`

**File Path:** `/apps/web/src/features/player-overview/`

**API Integrations:**
- `GET /api/coach/player/:id/overview`

---

## Admin Features

Features designed specifically for administrator users.

### 32. Admin System Overview (`admin-system-overview/`)

**Purpose:** System health and configuration monitoring.

**Key Components:**
- `AdminSystemOverview.tsx`

**File Path:** `/apps/web/src/features/admin-system-overview/`

**System Metrics:**
- Environment badge (Production/Staging/Development)
- Version number
- Uptime
- Active feature flags

**Contract Compliance:**
- NO athlete data access
- NO coach performance metrics
- System integrity focus ONLY

---

### 33. Admin Coach Management (`admin-coach-management/`)

**Purpose:** Manage coach accounts and permissions.

**Key Components:**
- `AdminCoachManagement.tsx`

**File Path:** `/apps/web/src/features/admin-coach-management/`

**API Integrations:**
- `GET /api/admin/coaches`
- `POST /api/admin/coaches`
- `PUT /api/admin/coaches/:id`
- `DELETE /api/admin/coaches/:id`

---

### 34. Admin Tier Management (`admin-tier-management/`)

**Purpose:** Manage subscription tiers and feature access.

**Key Components:**
- `AdminTierManagement.tsx`

**File Path:** `/apps/web/src/features/admin-tier-management/`

**API Integrations:**
- `GET /api/admin/tiers`
- `PUT /api/admin/tiers/:id`

---

### 35. Admin Escalation Support (`admin-escalation/`)

**Purpose:** Handle escalated support issues.

**Key Components:**
- `AdminEscalationSupport.tsx`

**File Path:** `/apps/web/src/features/admin-escalation/`

**API Integrations:**
- `GET /api/admin/escalations`
- `PUT /api/admin/escalations/:id`

---

### 36. Admin Feature Flags (`admin-feature-flags/`)

**Purpose:** Toggle system-wide feature flags.

**Key Components:**
- `AdminFeatureFlagsEditor.tsx`

**File Path:** `/apps/web/src/features/admin-feature-flags/`

**Feature Flags:**
- Enable/disable features
- A/B testing configuration
- Gradual rollout controls
- Emergency kill switches

**API Integrations:**
- `GET /api/admin/feature-flags`
- `PUT /api/admin/feature-flags/:key`

---

## Feature Dependencies

### Shared Components

| Component | Used By |
|-----------|---------|
| `PageHeader` | Annual Plan, Training Protocol, Test Results |
| `Avatar` | Dashboard, Coach Dashboard, all profile views |
| `Card` | Universal across features |
| `Badge` | Universal for status/category indicators |
| `ProgressBar` | Dashboard, Progress, Goals, Tests |

### Shared Contexts

| Context | Purpose |
|---------|---------|
| `AuthContext` | Authentication state, user info, login/logout |

### Design System

- **Primary:** Blue Palette 01 v3.0
  - Primary: #10456A
  - Snow: #EDF0F2
  - Gold: #C9A227
- **Legacy:** Forest Theme v2.1 (being phased out)

---

## File Structure Summary

```
apps/web/src/features/
├── achievements/           # Achievement tracking
├── admin-coach-management/ # Admin: Coach management
├── admin-escalation/       # Admin: Support escalation
├── admin-feature-flags/    # Admin: Feature toggles
├── admin-system-overview/  # Admin: System metrics
├── admin-tier-management/  # Admin: Tier config
├── annual-plan/            # Player: Yearly training plan
├── archive/                # Shared: Archived items
├── auth/                   # Shared: Authentication
├── badges/                 # Player: Badge collection
├── calendar/               # Shared: Calendar view
├── coach/                  # Coach: Modification requests
├── coach-athlete-detail/   # Coach: Athlete navigation hub
├── coach-athlete-list/     # Coach: Athlete list
├── coach-dashboard/        # Coach: Main dashboard
├── coach-intelligence/     # Coach: Alerts and insights
├── coach-notes/            # Coach: Private notes
├── coach-proof-viewer/     # Coach: View athlete proof
├── coach-training-plan/    # Coach: View plans
├── coach-training-plan-editor/ # Coach: Edit plans
├── coach-trajectory-viewer/# Coach: Progress visualization
├── coaches/                # Player: View coach team
├── dashboard/              # Shared: Main dashboard
├── exercises/              # Player: Exercise library
├── goals/                  # Player: Goal management
├── knowledge/              # Player: Resources
├── notes/                  # Player: Personal notes
├── player-overview/        # Coach: Player details
├── profile/                # Shared: User profile
├── progress/               # Player: Progress analytics
├── school/                 # Player: School schedule
├── sessions/               # Player: Active sessions
├── stats/                  # Player: Statistics
├── tests/                  # Player: Test results
├── tournaments/            # Player: Tournament calendar
└── training/               # Player: Training protocols
```

---

**Document Status**: Complete
**Last Updated**: 2025-12-20
