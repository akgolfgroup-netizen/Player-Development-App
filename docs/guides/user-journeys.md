# IUP Golf - User Journey Flow Diagrams

**Document Version:** 1.0
**Created:** 2025-12-20
**Purpose:** Visual representation of all user flows through the IUP Golf application

---

## Table of Contents

1. [Authentication Flow](#1-authentication-flow)
2. [Player Journey](#2-player-journey)
3. [Coach Journey](#3-coach-journey)
4. [Admin Journey](#4-admin-journey)
5. [Training Session Flow](#5-training-session-flow)
6. [Test Protocol Flow](#6-test-protocol-flow)

---

## 1. Authentication Flow

### 1.1 Login Process

```
┌─────────────────────────────────────────────────────────────────────┐
│                         AUTHENTICATION FLOW                          │
└─────────────────────────────────────────────────────────────────────┘

    START
      │
      ▼
┌──────────────┐
│  Login Page  │
│  /login      │
└──────┬───────┘
       │
       ├─────────────────────┬──────────────────────┐
       ▼                     ▼                      ▼
┌─────────────┐      ┌──────────────┐      ┌──────────────┐
│ Manual      │      │ Demo Login   │      │ Forgot       │
│ Email/Pass  │      │ (3 options)  │      │ Password     │
└──────┬──────┘      └──────┬───────┘      └──────┬───────┘
       │                    │                      │
       ▼                    ▼                      ▼
┌─────────────────────────────────┐       ┌──────────────────┐
│  AuthContext.login()            │       │ Password Reset   │
│  • Validates credentials        │       │ Modal            │
│  • Demo users: bypass API       │       │ • Enter email    │
│  • Real users: call authAPI     │       │ • Submit request │
└──────────┬──────────────────────┘       └──────────────────┘
           │
           ├─── SUCCESS ────┐
           │                │
           ▼                ▼
    ┌──────────────┐  ┌─────────────────┐
    │ Store Token  │  │ Store User Data │
    │ localStorage │  │ (role, id, etc) │
    └──────┬───────┘  └────────┬────────┘
           │                   │
           └────────┬──────────┘
                    │
                    ▼
            ┌───────────────┐
            │ Set User in   │
            │ AuthContext   │
            └───────┬───────┘
                    │
                    ▼
            ┌───────────────────┐
            │ Navigate Based on │
            │ User Role         │
            └───────┬───────────┘
                    │
       ┌────────────┼────────────┐
       ▼            ▼            ▼
┌─────────┐   ┌─────────┐   ┌─────────┐
│ Player  │   │ Coach   │   │ Admin   │
│ → /     │   │ → /     │   │ → /     │
└─────────┘   └─────────┘   └─────────┘
```

### 1.2 Token Management

```
┌─────────────────────────────────────────────────────────────┐
│                    TOKEN LIFECYCLE                           │
└─────────────────────────────────────────────────────────────┘

App Load
   │
   ▼
┌────────────────────┐
│ AuthProvider Init  │
│ useEffect()        │
└────────┬───────────┘
         │
         ▼
┌──────────────────────┐      NO      ┌─────────────┐
│ Token in localStorage? ├───────────►│ user = null │
└────────┬─────────────┘              └─────────────┘
         │ YES
         ▼
┌──────────────────────┐
│ Parse User Data      │
│ Set user state       │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ ProtectedRoute Check │
└────────┬─────────────┘
         │
    ┌────┴────┐
    │         │
   YES       NO
    │         │
    ▼         ▼
 RENDER   REDIRECT
  PAGE    TO /login
```

### 1.3 Logout Flow

```
LOGOUT TRIGGER (any page)
         │
         ▼
┌──────────────────┐
│ AuthContext      │
│ .logout()        │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Clear Local      │
│ Storage:         │
│ • accessToken    │
│ • userData       │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ setUser(null)    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Navigate to      │
│ /login           │
└──────────────────┘
```

---

## 2. Player Journey

### 2.1 Player Dashboard Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        PLAYER DASHBOARD JOURNEY                      │
└─────────────────────────────────────────────────────────────────────┘

LOGIN SUCCESS (Player Role)
         │
         ▼
┌────────────────────────┐
│ DashboardContainer     │
│ • Fetches /dashboard/  │
│   player               │
│ • Loading state        │
└────────┬───────────────┘
         │
         ▼
┌───────────────────────────────────────────────────────────────┐
│              AKGolfDashboard (Player View)                    │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Top Section: Welcome + Quick Stats                  │    │
│  │ • Greeting (time-based)                             │    │
│  │ • Player category badge                             │    │
│  │ • Current XP/Level                                  │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Countdown Widgets (3-col grid)                      │    │
│  │ ┌──────────┐  ┌──────────┐  ┌──────────┐          │    │
│  │ │Next Test │  │Tournament│  │Goal      │          │    │
│  │ │14 days   │  │28 days   │  │Progress  │          │    │
│  │ └──────────┘  └──────────┘  └──────────┘          │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Today's Sessions                                    │    │
│  │ • Session cards with time, title, status            │    │
│  │ • Click → Session Detail View                       │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Quick Actions                                        │    │
│  │ • Log Quick Session                                 │    │
│  │ • View Progress                                     │    │
│  │ • Take Test                                         │    │
│  │ • Messages (with unread count)                      │    │
│  └─────────────────────────────────────────────────────┘    │
└───────────────────────────────────────────────────────────────┘
         │
         │ NAVIGATION OPTIONS
         │
    ┌────┴────┬─────────┬─────────┬──────────┬─────────┐
    ▼         ▼         ▼         ▼          ▼         ▼
┌────────┐ ┌────────┐ ┌──────┐ ┌──────┐ ┌────────┐ ┌────────┐
│Session │ │Progress│ │Tests │ │Goals │ │Profile │ │Archive │
│Detail  │ │Stats   │ │      │ │      │ │        │ │        │
└────────┘ └────────┘ └──────┘ └──────┘ └────────┘ └────────┘
```

### 2.2 Player Navigation Map

```
┌─────────────────────────────────────────────────────────────────┐
│                  PLAYER NAVIGATION MAP                          │
└─────────────────────────────────────────────────────────────────┘

                      ┌───────────────┐
                      │   Dashboard   │
                      │       /       │
                      └───────┬───────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐      ┌──────────────┐     ┌──────────────┐
│  Training    │      │  Testing &   │     │  Planning &  │
│              │      │  Progress    │     │  Goals       │
└──────┬───────┘      └──────┬───────┘     └──────┬───────┘
       │                     │                     │
       ├─────────┐           ├─────────┐          ├─────────┐
       ▼         ▼           ▼         ▼          ▼         ▼
┌───────────┐ ┌──────────┐ ┌──────┐ ┌────────┐ ┌──────┐ ┌──────┐
│/sessions  │ │/training │ │/test │ │/test   │ │/goals│ │/aars │
│           │ │protokoll │ │proto │ │result  │ │      │ │plan  │
│Session    │ │          │ │koll  │ │ater    │ │      │ │      │
│Library    │ │Training  │ │      │ │        │ │Goal  │ │Annual│
│           │ │Log       │ │Select│ │Results │ │Track │ │Plan  │
└───────────┘ └──────────┘ │Test  │ │History │ └──────┘ └──────┘
                           └──────┘ └────────┘

        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐      ┌──────────────┐     ┌──────────────┐
│  Resources   │      │  Social &    │     │  Admin       │
│              │      │  Coaching    │     │              │
└──────┬───────┘      └──────┬───────┘     └──────┬───────┘
       │                     │                     │
       ├─────────┐           ├─────────┐          ├─────────┐
       ▼         ▼           ▼         ▼          ▼         ▼
┌───────────┐ ┌──────────┐ ┌──────┐ ┌────────┐ ┌──────┐ ┌──────┐
│/oevelser  │ │/notater  │ │/coach│ │/badges │ │/profil│ │/arkiv│
│           │ │          │ │team  │ │        │ │       │ │      │
│Exercise   │ │Notes &   │ │      │ │Achieve │ │Profile│ │Hist  │
│Library    │ │Journal   │ │Coach │ │ments   │ │       │ │ory   │
└───────────┘ └──────────┘ │List  │ └────────┘ └──────┘ └──────┘
                           └──────┘
```

---

## 3. Coach Journey

### 3.1 Coach Dashboard Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        COACH DASHBOARD JOURNEY                       │
└─────────────────────────────────────────────────────────────────────┘

LOGIN SUCCESS (Coach Role)
         │
         ▼
┌────────────────────────┐
│ DashboardContainer     │
│ • Fetches /dashboard/  │
│   coach                │
└────────┬───────────────┘
         │
         ▼
┌───────────────────────────────────────────────────────────────┐
│              CoachDashboard View                              │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Header: Greeting + Overview                         │    │
│  │ • "God morgen/dag/kveld, Trener"                    │    │
│  │ • "Her er din oversikt for i dag"                   │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Quick Actions (4-col grid)                          │    │
│  │ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐  │    │
│  │ │Spillere │ │Kalender │ │Planer   │ │Meldinger│  │    │
│  │ └─────────┘ └─────────┘ └─────────┘ └─────────┘  │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌──────────────────────────┐  ┌──────────────────────┐    │
│  │ Mine Spillere (Left)     │  │ Venter på deg (Right)│    │
│  │ • Search bar             │  │ • Pending proofs     │    │
│  │ • Athlete list (A-Z)     │  │ • Notes to review    │    │
│  │   - Avatar               │  │ • Plans pending      │    │
│  │   - Name (Last, First)   │  │   approval           │    │
│  │   - Category badge       │  │                      │    │
│  │   - Last active date     │  │                      │    │
│  └──────────────────────────┘  └──────────────────────┘    │
│                                                               │
│  ┌──────────────────────────┐  ┌──────────────────────┐    │
│  │ Dagens Program           │  │ Ukens Oversikt       │    │
│  │ • Today's sessions       │  │ • Active players: 12 │    │
│  │ • Time + title           │  │ • Sessions this week │    │
│  │ • Athlete count          │  │ • Hours trained: 48  │    │
│  └──────────────────────────┘  └──────────────────────┘    │
└───────────────────────────────────────────────────────────────┘
         │
         │ NAVIGATION OPTIONS
         │
    ┌────┴────┬─────────┬─────────┬──────────┐
    ▼         ▼         ▼         ▼          ▼
┌────────┐ ┌────────┐ ┌──────┐ ┌──────┐ ┌────────┐
│Athlete │ │Plan    │ │Pending│ │Calendar│ │Messages│
│Detail  │ │Creator │ │Review │ │        │ │        │
└────────┘ └────────┘ └──────┘ └──────┘ └────────┘
```

### 3.2 Coach Athlete Management Flow

```
┌─────────────────────────────────────────────────────────────────┐
│              COACH → ATHLETE MANAGEMENT FLOW                    │
└─────────────────────────────────────────────────────────────────┘

Coach Dashboard
       │
       ▼
┌──────────────────┐
│ Click "Spillere" │
│ or athlete name  │
└────────┬─────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ Athlete List View (/coach/athletes)                    │
│ • Search/filter by name, category                      │
│ • Sort by: name, last session, category               │
│ • Athlete cards with:                                  │
│   - Photo/avatar                                       │
│   - Name, category                                     │
│   - Last session date                                  │
│   - Quick stats (sessions/week)                        │
└────────┬────────────────────────────────────────────────┘
         │
         ▼ CLICK ATHLETE
┌─────────────────────────────────────────────────────────┐
│ Athlete Detail View (/coach/athlete/:id)               │
│                                                         │
│ Navigation Hub to 4 Approved Tools:                    │
│                                                         │
│ ┌──────────────────────────────────────────────────┐  │
│ │ 1. Se dokumentasjon (View Proof)                 │  │
│ │ 2. Se utvikling (View Trajectory)                │  │
│ │ 3. Treningsplan (Edit Training Plan)             │  │
│ │ 4. Notater (View/Edit Notes)                     │  │
│ └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
         │
         ▼ ACTIONS
    ┌────┴────┬─────────┬──────────┐
    ▼         ▼         ▼          ▼
┌────────┐ ┌────────┐ ┌──────┐ ┌────────┐
│Proof   │ │Trajec  │ │Plan  │ │Notes   │
│Viewer  │ │tory    │ │Editor│ │        │
└────────┘ └────────┘ └──────┘ └────────┘
```

### 3.3 Coach Plan Creation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│              COACH PLAN CREATION FLOW                           │
└─────────────────────────────────────────────────────────────────┘

Athlete Detail → Click "Create Plan"
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ STEP 1: Plan Type & Duration                            │
│ ┌────────────────────────────────────────────────┐     │
│ │ • Annual Plan (full season)                    │     │
│ │ • Phase Plan (12 weeks)                        │     │
│ │ • Weekly Plan                                  │     │
│ │ • Single Session                               │     │
│ └────────────────────────────────────────────────┘     │
└────────┬─────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ STEP 2: Phase Configuration (if annual/phase)           │
│ • Preparation Phase: dates, focus                       │
│ • Competition Phase: dates, focus                       │
│ • Recovery Phase: dates, focus                          │
│ • Assign test dates within phases                       │
└────────┬─────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ STEP 3: Weekly Breakdown                                │
│ • Days per week (3-6)                                   │
│ • Session types per day:                                │
│   - Technical / Physical / Mental / Strategic           │
│ • Duration per session                                  │
└────────┬─────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ STEP 4: Session Block Builder                           │
│   ┌─────────────────────────────────────────────┐      │
│   │ Add Block:                                   │      │
│   │ • Exercise (from library or custom)          │      │
│   │ • Focus area (lag, delivery, face, etc)     │      │
│   │ • Volume (reps, time, distance)              │      │
│   │ • L-Phase level (1-5)                        │      │
│   │ • CS level (1-5)                             │      │
│   │ • Environment (indoor/outdoor/course)        │      │
│   │ • Pressure rating (0-10)                     │      │
│   │ • Instructions (text)                        │      │
│   └─────────────────────────────────────────────┘      │
└────────┬─────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ STEP 5: Review & Assign                                 │
│ • Summary view of full plan                             │
│ • Athlete name confirmation                             │
│ • Start date                                            │
│ • Save as draft OR Publish immediately                  │
└────────┬─────────────────────────────────────────────────┘
         │
         ├── Save Draft ───► Plan saved, editable later
         │
         └── Publish ──────► Plan assigned to athlete
                             │
                             ▼
                      ┌──────────────────┐
                      │ Athlete receives │
                      │ notification     │
                      └──────────────────┘
```

---

## 4. Admin Journey

### 4.1 Admin Dashboard Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    ADMIN DASHBOARD JOURNEY                      │
└─────────────────────────────────────────────────────────────────┘

LOGIN SUCCESS (Admin Role)
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ Admin System Overview (/admin/system-overview)          │
│                                                          │
│ PURPOSE: System-level visibility ONLY                   │
│ NO access to athlete data or performance metrics        │
│                                                          │
│ ┌────────────────────────────────────────────────┐     │
│ │ System Status Cards (3-col grid)               │     │
│ │ ┌──────────┐  ┌──────────┐  ┌──────────┐     │     │
│ │ │Environment│  │Version   │  │Uptime    │     │     │
│ │ │Production │  │v1.0.0    │  │342h      │     │     │
│ │ └──────────┘  └──────────┘  └──────────┘     │     │
│ └────────────────────────────────────────────────┘     │
│                                                          │
│ ┌────────────────────────────────────────────────┐     │
│ │ Feature Flags List                             │     │
│ │ ┌────────────────────────────────────────┐    │     │
│ │ │ proof_enabled          ON              │    │     │
│ │ │ coach_notes            ON              │    │     │
│ │ │ trajectory_view        ON              │    │     │
│ │ │ advanced_analytics     OFF             │    │     │
│ │ └────────────────────────────────────────┘    │     │
│ └────────────────────────────────────────────────┘     │
└────────┬─────────────────────────────────────────────────┘
         │
    ┌────┴────┬─────────┬──────────┬─────────┐
    ▼         ▼         ▼          ▼         ▼
┌────────┐ ┌────────┐ ┌──────┐ ┌──────┐ ┌────────┐
│Coach   │ │Feature │ │Tier  │ │Escal │ │Logs    │
│Mgmt    │ │Flags   │ │Mgmt  │ │ation │ │Monitor │
└────────┘ └────────┘ └──────┘ └──────┘ └────────┘
```

### 4.2 Admin Feature Flag Management

```
┌─────────────────────────────────────────────────────────────────┐
│              ADMIN → FEATURE FLAG MANAGEMENT                    │
└─────────────────────────────────────────────────────────────────┘

Admin Dashboard → "Feature Flags"
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ Feature Flags Management (/admin/feature-flags)         │
│                                                          │
│ ┌────────────────────────────────────────────────┐     │
│ │ Global Feature Flags                           │     │
│ │                                                 │     │
│ │ Flag Name              Status      Actions      │     │
│ │ ──────────────────────────────────────────     │     │
│ │ proof_enabled          ON         [Toggle]     │     │
│ │ coach_notes            ON         [Toggle]     │     │
│ │ trajectory_view        ON         [Toggle]     │     │
│ │ advanced_analytics     OFF        [Toggle]     │     │
│ │ peer_comparison        OFF        [Toggle]     │     │
│ │ ai_recommendations     OFF        [Toggle]     │     │
│ └────────────────────────────────────────────────┘     │
│                                                          │
│ ┌────────────────────────────────────────────────┐     │
│ │ Tier-Specific Overrides                        │     │
│ │                                                 │     │
│ │ Tier          Override Flags                   │     │
│ │ ──────────────────────────────────────────     │     │
│ │ Premium       • advanced_analytics (ON)        │     │
│ │               • ai_recommendations (BETA)      │     │
│ │ Standard      (no overrides)                   │     │
│ └────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────┘
```

---

## 5. Training Session Flow

### 5.1 Complete Training Session Lifecycle

```
┌─────────────────────────────────────────────────────────────────────┐
│                  TRAINING SESSION COMPLETE FLOW                     │
└─────────────────────────────────────────────────────────────────────┘

SESSION PRE-WORK (Planning Phase)
         │
         ▼
┌──────────────────┐
│ Coach creates    │
│ session in plan  │
│ • Blocks defined │
│ • Exercises set  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Session assigned │
│ to athlete       │
│ • Appears in     │
│   calendar       │
└────────┬─────────┘
         │
SESSION EXECUTION (Athlete Experience)
         │
         ▼
┌───────────────────────────────────────────────────────────────┐
│ STEP 1: SESSION DISCOVERY                                     │
│                                                                │
│ Athlete Dashboard                                             │
│   │                                                            │
│   ├─► "Today's Sessions" widget                               │
│   │   • Shows sessions scheduled for today                    │
│   │   • Status: Not Started, In Progress, Completed           │
│   │                                                            │
│   └─► OR /kalender                                            │
│       • Calendar view                                          │
│       • Click date → see sessions                             │
└───────┬───────────────────────────────────────────────────────┘
        │
        ▼ Click Session Card
┌───────────────────────────────────────────────────────────────┐
│ STEP 2: SESSION DETAIL VIEW (/session/:sessionId)            │
│                                                                │
│ ┌────────────────────────────────────────────────────┐       │
│ │ Header: Session title, date, time, location        │       │
│ │ Status badge (Upcoming, Active, Completed)         │       │
│ │ Estimated duration                                 │       │
│ └────────────────────────────────────────────────────┘       │
│                                                                │
│ ┌────────────────────────────────────────────────────┐       │
│ │ Session Blocks (expandable list)                   │       │
│ │                                                      │       │
│ │ Block 1: Lag Control Drills                        │       │
│ │ ├─ Exercise: 9-3 Drill                             │       │
│ │ ├─ Focus: Lag maintenance                          │       │
│ │ ├─ Volume: 50 reps                                 │       │
│ │ ├─ L-Phase: 3                                      │       │
│ │ ├─ CS Level: 4                                     │       │
│ │ └─ Instructions: "Focus on shaft angle..."        │       │
│ │                                                      │       │
│ │ Block 2: Face Control                              │       │
│ │ Block 3: Integration                               │       │
│ └────────────────────────────────────────────────────┘       │
│                                                                │
│ [Start Training] [Edit Session] [Cancel Session]              │
└───────┬────────────────────────────────────────────────────────┘
        │
        ▼ Click "Start Training"
┌───────────────────────────────────────────────────────────────┐
│ STEP 3: ACTIVE SESSION VIEW                                   │
│                                                                │
│ ┌────────────────────────────────────────────────────┐       │
│ │ Top Bar:                                            │       │
│ │ │Total Time: 00:23:45│ │Block 2/3│ │[Pause][End]│ │       │
│ └────────────────────────────────────────────────────┘       │
│                                                                │
│ ┌────────────────────────────────────────────────────┐       │
│ │ Current Block: Lag Control Drills                  │       │
│ │ Exercise: 9-3 Drill                                 │       │
│ │ Focus: Lag maintenance                              │       │
│ │                                                      │       │
│ │ Rep Counter:  [30 / 50]                             │       │
│ │ [-1] [-5] [+1] [+5] [+10]                          │       │
│ │                                                      │       │
│ │ Block Timer: 12:34                                 │       │
│ └────────────────────────────────────────────────────┘       │
│                                                                │
│ Block Navigation: [Block 1: Done] [Block 2: Active] [Block 3]│
└───────┬────────────────────────────────────────────────────────┘
        │
        ▼ Block Complete (50/50 reps)
┌───────────────────────────────────────────────────────────────┐
│ STEP 4: BLOCK RATING MODAL                                    │
│                                                                │
│ ┌────────────────────────────────────────────────────┐       │
│ │ How was this block?                                 │       │
│ │                                                      │       │
│ │ Quality (1-10):    [═══════●══] 7                   │       │
│ │ Focus (1-10):      [════●═════] 5                   │       │
│ │ Intensity (1-10):  [═══════●══] 8                   │       │
│ │                                                      │       │
│ │ Notes: [Text area]                                  │       │
│ │                                                      │       │
│ │ [Skip] [Submit & Continue]                          │       │
│ └────────────────────────────────────────────────────┘       │
└───────┬────────────────────────────────────────────────────────┘
        │
        ▼ All Blocks Complete
┌───────────────────────────────────────────────────────────────┐
│ STEP 5: SESSION REFLECTION                                    │
│                                                                │
│ ┌────────────────────────────────────────────────────┐       │
│ │ Session Summary                                     │       │
│ │ • Total time: 01:15:23                              │       │
│ │ • Blocks completed: 3/3                             │       │
│ │ • Total reps: 150                                   │       │
│ └────────────────────────────────────────────────────┘       │
│                                                                │
│ Overall Rating (1-10): [═══════●══] 8                         │
│                                                                │
│ Key Learnings:                                                │
│ • What went well? [Text area]                                 │
│ • What was challenging? [Text area]                           │
│ • Next focus areas? [Text area]                               │
│                                                                │
│ Upload Proof (optional): [Upload Button]                      │
│                                                                │
│ [Submit Reflection]                                            │
└───────┬────────────────────────────────────────────────────────┘
        │
        ▼ Submit
┌───────────────────────────────────────────────────────────────┐
│ STEP 6: POST-SESSION                                          │
│                                                                │
│ • Session saved with status: Completed                        │
│ • Dashboard updated: Sessions +1, Hours updated               │
│ • Streak maintained (if applicable)                           │
│ • Achievement unlocked (if threshold hit)                     │
│ • Notification sent to coach                                  │
└────────────────────────────────────────────────────────────────┘
```

---

## 6. Test Protocol Flow

### 6.1 Complete Test Execution Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    TEST PROTOCOL COMPLETE FLOW                      │
└─────────────────────────────────────────────────────────────────────┘

TEST DISCOVERY
       │
       ▼
┌───────────────────────────────────────────────────────────────┐
│ STEP 1: TEST OVERVIEW (/testprotokoll)                        │
│                                                                │
│ ┌────────────────────────────────────────────────────┐       │
│ │ Test Categories (5 tabs)                           │       │
│ │ [Golf] [Teknikk] [Fysisk] [Mental] [Strategisk]   │       │
│ └────────────────────────────────────────────────────┘       │
│                                                                │
│ ┌────────────────────────────────────────────────────┐       │
│ │ Test Cards Grid                                     │       │
│ │                                                      │       │
│ │ ┌──────────────────────────────────────┐          │       │
│ │ │ Test: Driver Carry Distance          │          │       │
│ │ │ Status: NOT PASSED                   │          │       │
│ │ │ Last: 245m (2024-11-15)              │          │       │
│ │ │ Requirement: 250m                    │          │       │
│ │ │ Progress: 98%                        │          │       │
│ │ │ Trend: +5m vs previous               │          │       │
│ │ │ [Take Test]                          │          │       │
│ │ └──────────────────────────────────────┘          │       │
│ │                                                      │       │
│ │ ┌──────────────────────────────────────┐          │       │
│ │ │ Test: Putting 1.5m Circle            │          │       │
│ │ │ Status: PASSED                       │          │       │
│ │ │ Last: 8/10 (2024-12-01)              │          │       │
│ │ │ Requirement: 7/10                    │          │       │
│ │ │ [View History] [Retake]              │          │       │
│ │ └──────────────────────────────────────┘          │       │
│ └────────────────────────────────────────────────────┘       │
│                                                                │
│ Quick Stats: Tests passed: 12/20 | Avg progress: 87%         │
└───────┬────────────────────────────────────────────────────────┘
        │
        ▼ Click [Take Test]
┌───────────────────────────────────────────────────────────────┐
│ STEP 2: TEST SETUP & INSTRUCTIONS                             │
│                                                                │
│ ┌────────────────────────────────────────────────────┐       │
│ │ Test: Driver Carry Distance                        │       │
│ │ Category: Golf                                      │       │
│ │ Requirement: 250m                                   │       │
│ └────────────────────────────────────────────────────┘       │
│                                                                │
│ Instructions:                                                 │
│ 1. Warm up thoroughly (10-15 minutes)                        │
│ 2. Use your game driver                                       │
│ 3. Hit 10 drives with full commitment                        │
│ 4. Measure carry distance (use TrackMan/SkyTrak)             │
│ 5. Record best carry distance                                 │
│                                                                │
│ Historical Context:                                           │
│ • 2024-11-15: 245m                                            │
│ • 2024-10-01: 240m                                            │
│ • Trend: +7m over 3 months                                    │
│                                                                │
│ [Cancel] [Start Test]                                         │
└───────┬────────────────────────────────────────────────────────┘
        │
        ▼ Click [Start Test]
┌───────────────────────────────────────────────────────────────┐
│ STEP 3: TEST EXECUTION (RECORDING RESULTS)                    │
│                                                                │
│ ┌────────────────────────────────────────────────────┐       │
│ │ Best Carry Distance (meters): [    252    ]        │       │
│ │ Number of Attempts:           [    10     ]        │       │
│ │                                                      │       │
│ │ Conditions:                                         │       │
│ │ [x] Indoor (TrackMan)                              │       │
│ │ [ ] Outdoor (calm)                                 │       │
│ │ [ ] Outdoor (windy)                                │       │
│ │                                                      │       │
│ │ Notes: [Text area]                                  │       │
│ │                                                      │       │
│ │ Upload Proof: [Upload Files]                        │       │
│ └────────────────────────────────────────────────────┘       │
│                                                                │
│ [Cancel] [Submit Results]                                     │
└───────┬────────────────────────────────────────────────────────┘
        │
        ▼ Click [Submit Results]
┌───────────────────────────────────────────────────────────────┐
│ STEP 4: RESULT FEEDBACK                                       │
│                                                                │
│ ┌────────────────────────────────────────────────────┐       │
│ │               TEST RESULT                           │       │
│ │                                                      │       │
│ │               PASSED!                               │       │
│ │                                                      │       │
│ │ Your Result: 252m                                   │       │
│ │ Requirement: 250m                                   │       │
│ │ Margin: +2m                                         │       │
│ │                                                      │       │
│ │ Improvement:                                         │       │
│ │ • vs Last Test (245m): +7m                          │       │
│ │ • vs Benchmark Start (238m): +14m                  │       │
│ │                                                      │       │
│ │ Achievement Unlocked: "Driver Distance Master"     │       │
│ │                                                      │       │
│ │ [View All Results] [Back to Tests]                 │       │
│ └────────────────────────────────────────────────────┘       │
└───────────────────────────────────────────────────────────────┘
```

### 6.2 Test Results History View

```
┌─────────────────────────────────────────────────────────────────┐
│              TEST RESULTS & HISTORY                             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Test Results View (/testresultater)                     │
│                                                          │
│ ┌────────────────────────────────────────────────┐     │
│ │ Benchmark Timeline                             │     │
│ │ [U15-U18] [U18-U21] [U21-U25] [U25-U33] [U33-U48]│  │
│ │                                    ↑ Current    │     │
│ └────────────────────────────────────────────────┘     │
│                                                          │
│ ┌────────────────────────────────────────────────┐     │
│ │ Overall Statistics                             │     │
│ │ • Tests passed: 13/20 (65%)                    │     │
│ │ • Improved since last benchmark: 6 tests       │     │
│ │ • Average progress to requirement: 92%         │     │
│ └────────────────────────────────────────────────┘     │
│                                                          │
│ ┌────────────────────────────────────────────────┐     │
│ │ 7-Point Radar Chart                            │     │
│ │                                                 │     │
│ │        Golf (4/5)                               │     │
│ │          / \                                    │     │
│ │ Strategisk  Teknikk (3/4)                     │     │
│ │   (2/3)      \ /                               │     │
│ │        Mental (2/4)                             │     │
│ │          / \                                    │     │
│ │   Fysisk   (2/4)                               │     │
│ └────────────────────────────────────────────────┘     │
│                                                          │
│ Test Details (Expandable):                              │
│ ▼ Golf Tests (4/5 passed)                               │
│ ▼ Teknikk Tests (3/4 passed)                            │
│ ▶ Fysisk Tests (2/4 passed)                             │
│ ▶ Mental Tests (2/4 passed)                             │
│ ▶ Strategisk Tests (2/3 passed)                         │
└─────────────────────────────────────────────────────────┘
```

---

## Summary

This document provides visual flow diagrams for all major user journeys:

| Flow | Description |
|------|-------------|
| Authentication | Login, token lifecycle, logout |
| Player Journey | Dashboard, navigation, weekly cycle |
| Coach Journey | Dashboard, athlete management, plan creation |
| Admin Journey | System overview, feature flags, tier management |
| Training Session | Complete lifecycle from discovery to reflection |
| Test Protocol | Test selection, execution, results, history |

### Key Navigation Patterns

- **Role-based routing**: All users land on `/` but see different content
- **Protected routes**: All routes require authentication
- **Lazy loading**: All feature components are lazy-loaded
- **AppShell layout**: Consistent navigation wrapper

### Data Flow Patterns

- **Container pattern**: Data fetching separated from presentation
- **API-first**: All operations go through `apiClient`
- **LocalStorage**: Auth tokens persisted for session continuity
- **Real-time updates**: Timers and counters update during active training

---

**Document Status**: Complete
**Last Updated**: 2025-12-20
