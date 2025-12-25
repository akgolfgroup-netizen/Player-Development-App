# IUP Golf App - Developer Review Guide

**Prepared for:** Senior Developer Review (Wemade)
**Date:** January 4th, 2025
**Repository:** https://github.com/akgolfgroup-netizen/IUP-app

---

## Quick Start

```bash
# Clone the repository
git clone https://github.com/akgolfgroup-netizen/IUP-app.git
cd IUP-app

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your database credentials

# Start development
npm run dev
```

---

## Project Overview

**IUP Golf** is a comprehensive golf training and development platform for players, coaches, and administrators. The application tracks player progress, manages training plans, handles test results, and provides a gamification system with badges and achievements.

### Target Users
- **Players** - Track progress, complete training sessions, view badges
- **Coaches** - Manage players, create training plans, analyze performance
- **Administrators** - System management, user management, analytics

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Node.js, Fastify, TypeScript |
| **Database** | PostgreSQL with Prisma ORM |
| **Frontend** | React (JSX/TSX), Tailwind CSS |
| **Mobile** | Capacitor (iOS/Android) |
| **Testing** | Jest, Playwright |
| **Deployment** | Docker, GitHub Actions CI/CD |

---

## Project Structure

```
IUP_Master_V1/
├── apps/
│   ├── api/                    # Backend API (Fastify + Prisma)
│   │   ├── src/
│   │   │   ├── api/v1/         # REST API endpoints
│   │   │   ├── domain/         # Business logic
│   │   │   ├── middleware/     # Auth, error handling
│   │   │   └── plugins/        # Fastify plugins
│   │   ├── prisma/             # Database schema & migrations
│   │   └── tests/              # Unit & integration tests
│   │
│   ├── web/                    # React frontend
│   │   ├── src/
│   │   │   ├── components/     # Reusable UI components
│   │   │   ├── features/       # Feature-based modules
│   │   │   ├── contexts/       # React contexts
│   │   │   └── hooks/          # Custom hooks
│   │   └── public/             # Static assets & mockups
│   │
│   └── golfer/                 # Mobile app screens
│
├── docs/                       # Documentation
└── packages/                   # Shared packages
```

---

## Key Features Implemented

### 1. Authentication & Authorization
- JWT-based authentication
- Role-based access control (Player, Coach, Admin)
- Multi-tenant architecture
- Password reset flow

**Key files:**
- `apps/api/src/api/v1/auth/`
- `apps/api/src/middleware/auth.ts`
- `apps/web/src/contexts/AuthContext.jsx`

### 2. Player Management
- Player profiles with handicap tracking
- Intake form for new players
- Progress tracking over time

**Key files:**
- `apps/api/src/api/v1/players/`
- `apps/api/src/api/v1/intake/`

### 3. Training Plan System
- AI-generated training plans based on player level
- Weekly session scheduling
- Exercise library with categories
- Period-based planning (mesocycles)

**Key files:**
- `apps/api/src/api/v1/training-plan/`
- `apps/api/src/domain/training-plan/`

### 4. Test & Assessment System
- Multiple test categories (Distance, Short Game, Approach, Physical, On-Course)
- Score calculation with category-specific formulas
- Progress tracking and history

**Key files:**
- `apps/api/src/api/v1/tests/`
- `apps/api/src/domain/tests/`

### 5. Gamification System
- 85 unique badges across categories
- Achievement tracking
- Anti-gaming protection
- Badge evaluator with unlock logic

**Key files:**
- `apps/api/src/domain/gamification/`
- `apps/web/src/components/badges/`

### 6. Dashboard & Analytics
- Player dashboard with progress overview
- Coach analytics dashboard
- Peer comparison features

**Key files:**
- `apps/api/src/api/v1/dashboard/`
- `apps/web/src/features/dashboard/`

---

## Database Schema Overview

The database uses Prisma ORM with PostgreSQL. Key models include:

- `User` - Authentication and profile
- `Player` - Player-specific data
- `Coach` - Coach profiles
- `TrainingPlan` - Training plan definitions
- `TrainingSession` - Individual sessions
- `TestResult` - Test scores and history
- `Badge` / `PlayerBadge` - Gamification
- `Exercise` - Exercise library

**Schema location:** `apps/api/prisma/schema.prisma`

---

## API Endpoints

All endpoints are prefixed with `/api/v1/`

| Category | Endpoints |
|----------|-----------|
| Auth | `/auth/login`, `/auth/register`, `/auth/refresh` |
| Players | `/players`, `/players/:id` |
| Tests | `/tests`, `/tests/results`, `/tests/history` |
| Training | `/training-plan`, `/sessions` |
| Dashboard | `/dashboard/player`, `/dashboard/coach` |
| Badges | `/badges`, `/badges/player/:id` |

---

## Areas for Review

### Priority 1: Architecture & Security
- [ ] Authentication flow and JWT handling
- [ ] Role-based access control implementation
- [ ] SQL injection prevention (Prisma parameterized queries)
- [ ] Multi-tenant data isolation

### Priority 2: Business Logic
- [ ] Test score calculation formulas (`apps/api/src/domain/tests/calculations/`)
- [ ] Badge evaluation logic (`apps/api/src/domain/gamification/badge-evaluator.ts`)
- [ ] Training plan generation algorithm

### Priority 3: Frontend Architecture
- [ ] Component structure and reusability
- [ ] State management with React contexts
- [ ] Mobile responsiveness

### Priority 4: Performance
- [ ] Database query optimization
- [ ] API response times
- [ ] Frontend bundle size

---

## Running Tests

```bash
# Run all tests
npm test

# Run API tests only
cd apps/api && npm test

# Run specific test file
npm test -- tests/integration/auth.test.ts

# Run with coverage
npm test -- --coverage
```

---

## Environment Variables

See `.env.example` for all required variables:

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for JWT signing
- `JWT_EXPIRES_IN` - Token expiration time
- `REDIS_URL` - Redis connection (for caching)

---

## Recent Changes (December 2024)

1. **Database Query Optimization** - Added indexes for dashboard queries
2. **Test Calculator Updates** - Refined scoring formulas
3. **Badge Evaluator Tests** - Improved test coverage
4. **Dashboard Integration** - New player dashboard widgets

---

## Contact

For questions about this codebase, contact the project owner.

---

*This document was generated to facilitate code review.*
