# Project Structure - Complete Guide for Senior Engineers

> Comprehensive guide to understanding the IUP Golf Academy codebase architecture
> **For**: Senior engineers taking over or reviewing the project
> **Updated**: December 16, 2025

---

## 📋 Table of Contents

1. [High-Level Architecture](#high-level-architecture)
2. [Folder Structure Explained](#folder-structure-explained)
3. [Key Technical Decisions](#key-technical-decisions)
4. [Data Flow](#data-flow)
5. [Code Organization Patterns](#code-organization-patterns)
6. [Current State & What's Next](#current-state--whats-next)

---

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                             │
│              React 18 + React Router + Axios                 │
│                   http://localhost:3001                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ REST API (HTTP/JSON)
                     │
┌────────────────────▼────────────────────────────────────────┐
│                          BACKEND                             │
│         Fastify + TypeScript + Prisma ORM                   │
│                   http://localhost:3000                      │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
┌─────────────┐ ┌──────────┐ ┌─────────┐
│ PostgreSQL  │ │  Redis   │ │LocalStack│
│  (Primary)  │ │ (Cache)  │ │  (S3)    │
│  Port 5432  │ │Port 6379 │ │Port 4566 │
└─────────────┘ └──────────┘ └─────────┘
```

**Key Characteristics:**
- **Monorepo**: Single repository with multiple packages
- **Multi-tenancy**: Tenant-based data isolation
- **Event-driven**: Transactional outbox pattern
- **Type-safe**: Full TypeScript coverage
- **Production-ready**: Authentication, caching, rate-limiting

---

## 📁 Folder Structure Explained

### Root Level

```
IUP_Master_V1/
├── apps/web/           # ⭐ React apps/web (Active - Use this)
├── apps/api/    # ⭐ Fastify backend (Active - Use this)
│
├── backend/            # ⚠️ Legacy Express backend (DO NOT USE)
├── IUP_Master_Folder/  # ⚠️ Old workspace (DO NOT USE)
├── IUP_Master_Folder_2/# ⚠️ Old build artifacts (DO NOT USE)
│
├── packages/design-system/             # Design System v2.1 (Figma + tokens)
├── docs/               # 📚 All documentation
├── data/               # Reference data (tests, exercises)
├── scripts/            # Utility Scripts
├── Database/           # Database utilities
│
├── README.md           # ⭐ START HERE
├── PROJECT_STRUCTURE.md # ⭐ This file
├── .gitignore          # Git ignore rules
├── docker-compose.yml  # Full stack Docker setup
└── pnpm-workspace.yaml # pnpm workspace config
```

**⚠️ IMPORTANT**: Only use `frontend/` and `apps/api/`. Other backend/apps/web folders are legacy.

---

### apps/web Structure (`/apps/web/`)

```
apps/web/
├── src/
│   ├── components/          # UI Components
│   │   ├── AKGolfDashboard.jsx       # Dashboard screen
│   │   ├── Login.jsx                 # Login page
│   │   ├── ProtectedRoute.jsx        # Auth guard
│   │   ├── Navigation.jsx            # Sidebar nav
│   │   ├── DashboardContainer.jsx    # Dashboard with API
│   │   │
│   │   ├── ak_golf_brukerprofil_onboarding.jsx  # User profile
│   │   ├── Trenerteam.jsx            # Coach team
│   │   ├── Målsetninger.jsx          # Goals
│   │   ├── Aarsplan.jsx              # Annual plan
│   │   ├── Testprotokoll.jsx         # Test protocol
│   │   ├── Testresultater.jsx        # Test results
│   │   ├── Treningsprotokoll.jsx     # Training log
│   │   ├── Treningsstatistikk.jsx    # Training stats
│   │   ├── Kalender.jsx              # Calendar
│   │   ├── Øvelser.jsx               # Exercises
│   │   ├── Notater.jsx               # Notes
│   │   └── Arkiv.jsx                 # Archive
│   │
│   ├── contexts/             # React Context
│   │   └── AuthContext.jsx   # Authentication state
│   │
│   ├── services/             # API Layer
│   │   └── api.js            # Axios instance + all API functions
│   │
│   ├── design-tokens.js      # Design System tokens
│   ├── App.jsx               # Main app with routing
│   ├── index.js              # Entry point
│   └── index.css             # Global styles
│
├── public/
│   └── index.html            # HTML template
│
├── package.json              # Dependencies
└── .env                      # Environment (PORT=3001)
```

**Key Files:**
- `App.jsx` - Routing, AuthProvider, ProtectedRoutes
- `services/api.js` - All backend communication
- `contexts/AuthContext.jsx` - Authentication logic
- `components/Navigation.jsx` - Main navigation

**Component Pattern:**
All 13 screen components follow similar structure but are NOT yet connected to backend API. They contain mock/static data. Integration is next step.

---

### Backend Structure (`/apps/api/`)

```
apps/api/
├── src/
│   ├── api/v1/                    # API Routes
│   │   ├── auth/                  # Authentication
│   │   │   ├── index.ts           # Routes
│   │   │   ├── schema.ts          # Zod schemas
│   │   │   └── service.ts         # Business logic
│   │   │
│   │   ├── players/               # Player management
│   │   ├── coaches/               # Coach management
│   │   ├── tests/                 # Test protocols
│   │   │   ├── index.ts           # Basic CRUD routes
│   │   │   ├── enhanced-routes.ts # Auto-calc routes
│   │   │   └── test-results-enhanced.service.ts
│   │   │
│   │   ├── dashboard/             # Dashboard data
│   │   ├── coach-analytics/       # Analytics
│   │   ├── peer-comparison/       # Peer ranking
│   │   ├── filters/               # Advanced filtering
│   │   ├── datagolf/              # DataGolf integration
│   │   ├── training-plan/         # Training plans
│   │   ├── exercises/             # Exercise CRUD
│   │   ├── bookings/              # Session booking
│   │   ├── availability/          # Coach availability
│   │   ├── calendar/              # Calendar
│   │   └── breaking-points/       # Breaking points
│   │
│   ├── domain/                    # Business Logic
│   │   ├── tests/
│   │   │   ├── test-calculator.ts    # Auto-calc engine
│   │   │   └── calculations/
│   │   │       ├── distance-tests.ts
│   │   │       ├── approach-tests.ts
│   │   │       ├── short-game-tests.ts
│   │   │       └── physical-tests.ts
│   │   │
│   │   ├── peer-comparison/
│   │   │   └── peer-comparison.service.ts  # Percentile calc
│   │   │
│   │   ├── coach-analytics/
│   │   │   └── coach-analytics.service.ts
│   │   │
│   │   ├── training-plan/
│   │   │   ├── plan-generation.service.ts
│   │   │   ├── periodization-templates.ts
│   │   │   └── session-selection.service.ts
│   │   │
│   │   ├── breaking-points/
│   │   └── calibration/
│   │
│   ├── core/                      # Infrastructure
│   │   ├── db/
│   │   │   └── prisma.ts          # Prisma client
│   │   ├── cache/                 # Redis
│   │   ├── queue/                 # BullMQ
│   │   └── storage/               # S3/MinIO
│   │
│   ├── middleware/                # Middleware
│   │   ├── auth.ts                # JWT verification
│   │   ├── tenant.ts              # Multi-tenancy
│   │   ├── rate-limit.ts          # Rate limiting
│   │   └── error-handler.ts       # Global error handling
│   │
│   ├── plugins/                   # Fastify Plugins
│   │   ├── swagger.ts             # OpenAPI docs
│   │   └── websocket.ts           # WebSocket support
│   │
│   ├── utils/                     # Utilities
│   │   ├── logger.ts              # Pino logger
│   │   └── validation.ts          # Zod helpers
│   │
│   ├── types/                     # TypeScript types
│   ├── config/                    # Configuration
│   ├── app.ts                     # Fastify app setup
│   └── server.ts                  # Entry point
│
├── prisma/
│   ├── schema.prisma              # ⭐ Database schema (13+ tables)
│   ├── migrations/                # Migration files
│   └── seeds/
│       ├── demo-users.ts          # Demo user data
│       ├── category-requirements.ts  # A-K requirements (440 rows)
│       ├── speed-category-mappings.ts
│       └── session-templates.ts
│
├── tests/                         # Tests
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── docker/                        # Docker configs
├── docs/                          # API documentation
│
├── package.json
├── tsconfig.json
├── .env                           # Environment
└── docker-compose.yml             # Database containers
```

**Key Architecture Patterns:**

1. **Route → Service → Domain** layering
2. **Dependency injection** via Fastify decorators
3. **Transactional outbox** for events
4. **Repository pattern** via Prisma
5. **Middleware pipeline** for auth, tenant, rate-limit

---

## 🔑 Key Technical Decisions

### Why Fastify over Express?
- **Performance**: 2-3x faster than Express
- **Schema validation**: Built-in Zod support
- **TypeScript**: Better type safety
- **Plugin system**: Modular architecture
- **Async/await**: Native promise support

### Why Prisma ORM?
- **Type safety**: Generated TypeScript types
- **Migrations**: Declarative schema management
- **Multi-database**: PostgreSQL today, easy to switch
- **Query builder**: Intuitive API
- **Connection pooling**: Built-in

### Why pnpm over npm?
- **Disk efficiency**: Shared packages
- **Faster installs**: Content-addressable storage
- **Workspace support**: Monorepo friendly
- **Strict**: Prevents phantom dependencies

### Authentication Strategy
- **JWT tokens**: Stateless, scalable
- **Argon2 hashing**: Most secure password hashing
- **Refresh tokens**: Long-lived sessions
- **Role-based**: Admin, Coach, Player, Parent
- **Tenant-scoped**: Multi-tenancy security

### Multi-Tenancy Design
- **Tenant ID**: On every table
- **Row-Level Security**: PostgreSQL RLS
- **Middleware injection**: Auto-filter by tenant
- **Data isolation**: Complete separation

---

## 🔄 Data Flow

### Authentication Flow

```
1. User enters credentials (Login.jsx)
         ↓
2. POST /api/v1/auth/login (api.js)
         ↓
3. Auth service validates (auth/service.ts)
         ↓
4. Generates JWT token + user data
         ↓
5. Returns { accessToken, user }
         ↓
6. AuthContext stores in localStorage
         ↓
7. All subsequent requests include:
   Authorization: Bearer <token>
         ↓
8. Auth middleware verifies token
         ↓
9. Injects user & tenant into request
         ↓
10. Route handlers access req.user
```

### Test Result Auto-Calculation Flow

```
1. POST /api/v1/tests/results/enhanced
         ↓
2. enhanced-routes.ts validates input
         ↓
3. test-results-enhanced.service.ts
         ↓
4. Calls domain/tests/test-calculator.ts
         ↓
5. Calculator selects specific test formula:
   - distance-tests.ts (driver, 3-wood, hybrid, 5-iron)
   - approach-tests.ts (100m, 75m, 50m, wedge + PEI)
   - short-game-tests.ts (10m chip, 20m chip, bunker)
   - physical-tests.ts (strength, speed, mobility)
         ↓
6. Formula calculates result (e.g., avg, best of 5, PEI)
         ↓
7. Saves result to Database via Prisma
         ↓
8. Returns calculated result + test data
```

### Peer Comparison Flow

```
1. GET /peer-comparison?playerId=X&testId=Y
         ↓
2. peer-comparison.service.ts
         ↓
3. Fetches player's latest result
         ↓
4. Queries all peers:
   - Same category
   - Same gender
   - Similar age group
         ↓
5. Calculates statistics:
   - Percentile rank
   - Z-score
   - Mean, median, SD
         ↓
6. Returns comparison data
```

---

## 🎨 Code Organization Patterns

### API Route Pattern

```typescript
// src/api/v1/tests/index.ts

import { FastifyPluginAsync } from 'fastify';
import { testsSchema } from './schema';
import { TestsService } from './service';

const testsRoutes: FastifyPluginAsync = async (fastify) => {
  const service = new TestsService(fastify.prisma);

  // GET /api/v1/tests
  fastify.get('/', {
    schema: testsSchema.listTests,
    handler: async (req, reply) => {
      const tests = await service.listTests(req.tenant.id);
      return { tests };
    }
  });

  // POST /api/v1/tests
  fastify.post('/', {
    schema: testsSchema.createTest,
    handler: async (req, reply) => {
      const test = await service.createTest(req.tenant.id, req.body);
      return { test };
    }
  });
};

export default testsRoutes;
```

### Service Pattern

```typescript
// src/api/v1/tests/service.ts

export class TestsService {
  constructor(private prisma: PrismaClient) {}

  async listTests(tenantId: string) {
    return this.prisma.test.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async createTest(tenantId: string, data: CreateTestInput) {
    return this.prisma.test.create({
      data: { ...data, tenantId }
    });
  }
}
```

### Domain Pattern

```typescript
// src/domain/tests/test-calculator.ts

export class TestCalculator {
  calculate(testType: string, attempts: number[]): TestResult {
    switch (testType) {
      case 'driver_distance':
        return this.calculateDistance(attempts);
      case 'approach_100m':
        return this.calculateApproach(attempts, 100);
      default:
        throw new Error(`Unknown test type: ${testType}`);
    }
  }

  private calculateDistance(attempts: number[]): TestResult {
    const sorted = attempts.sort((a, b) => b - a);
    const best5 = sorted.slice(0, 5);
    const average = best5.reduce((sum, val) => sum + val, 0) / 5;

    return {
      value: average,
      best: sorted[0],
      attempts: attempts.length
    };
  }
}
```

---

## 📊 Current State & What's Next

### ✅ Complete

- **Authentication system** - Full JWT auth with roles
- **Backend API** - 40+ endpoints across 16 modules
- **Database schema** - 13+ tables with migrations
- **Test auto-calculation** - All 20 test formulas
- **Peer comparison** - Percentile ranking
- **Coach analytics** - Dashboard & insights
- **apps/web structure** - All 13 screens created
- **Routing** - Protected routes with auth guards
- **Design system** - v2.1 tokens & components
- **Demo data** - 3 users (admin, coach, player)

### 🚧 In Progress

- **apps/web-backend integration** - Components need API connection
- **Real data display** - Replace mock data with API calls
- **Form submissions** - Connect forms to backend

### 📋 Todo (Priority Order)

1. **Connect Brukerprofil** to `/api/v1/players/:id`
2. **Connect Trenerteam** to `/api/v1/coaches`
3. **Connect Testprotokoll** to `/api/v1/tests`
4. **Connect Dashboard** to real data
5. **Connect Kalender** to `/api/v1/bookings`
6. **Add Exercise Database** (150+ exercises)
7. **Add Week templates** (88 templates)
8. **Import Notion data**
9. **Add file upload** for media
10. **Add real-time notifications**

### 🔮 Future Enhancements

- **Mobile app** - React Native
- **Offline support** - PWA
- **Video analysis** - Upload & review
- **Tournament tracking** - Results & rankings
- **Parent portal** - Progress visibility
- **Automated reports** - PDF generation
- **Notifications** - Email & push
- **Analytics dashboard** - Advanced insights

---

## 🎯 Quick Wins for New Engineers

### Easy (< 2 hours)
1. Connect Brukerprofil component to player API
2. Add loading states to components
3. Add error boundaries
4. Update design tokens usage

### Medium (< 1 day)
1. Connect all 13 screens to backend
2. Add form validation
3. Implement file upload
4. Add pagination to lists

### Hard (< 1 week)
1. Build real-time notification system
2. Add exercise Database UI
3. Create PDF report generation
4. Implement advanced analytics

---

## 📚 Essential Reading

**Before coding:**
1. [README.md](./README.md) - Project overview
2. [AUTHENTICATION_COMPLETE.md](./AUTHENTICATION_COMPLETE.md) - Auth system
3. [INTEGRATION_COMPLETE.md](./INTEGRATION_COMPLETE.md) - apps/web-backend

**For backend work:**
1. [/apps/api/IMPLEMENTATION_SUMMARY.md](./apps/api/IMPLEMENTATION_SUMMARY.md) - Full API docs
2. [/apps/api/prisma/schema.prisma](./apps/api/prisma/schema.prisma) - Database schema

**For apps/web work:**
1. [DESIGN_SOURCE_OF_TRUTH.md](./DESIGN_SOURCE_OF_TRUTH.md) - Design system
2. [/apps/web/src/services/api.js](./apps/web/src/services/api.js) - API layer

---

## 🔍 Code Quality Standards

### TypeScript
- Strict mode enabled
- No `any` types
- Explicit return types
- Interface over type for objects

### Testing
- Unit tests for business logic
- Integration tests for API endpoints
- E2E tests for critical flows
- Minimum 80% coverage

### Git
- Conventional commits
- Feature branches
- PR reviews required
- Squash merges

### Code Style
- ESLint + Prettier
- 2-space indentation
- Single quotes
- Semicolons required
- Max line length: 100

---

**This document provides everything a senior engineer needs to understand and contribute to the codebase. Welcome aboard! 🚀**
