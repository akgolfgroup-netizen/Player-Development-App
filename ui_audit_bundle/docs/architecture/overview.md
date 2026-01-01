# Architecture Overview

> System architecture for the IUP Golf Platform

## Status

| Metric | Value |
|--------|-------|
| **API Endpoints** | 70+ |
| **Feature Modules** | 65+ |
| **Test Coverage** | 45%+ |
| **Security Rating** | Good (7.5/10) |

## System Context

```
┌─────────────────────────────────────────────────────────────────┐
│                         IUP Golf Platform                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐                 │
│   │  Player  │    │  Coach   │    │  Admin   │   Users         │
│   │   App    │    │   App    │    │  Portal  │                 │
│   └────┬─────┘    └────┬─────┘    └────┬─────┘                 │
│        │               │               │                        │
│        └───────────────┼───────────────┘                        │
│                        ▼                                        │
│              ┌─────────────────┐                                │
│              │   React SPA     │   Frontend                     │
│              │   (apps/web)    │                                │
│              └────────┬────────┘                                │
│                       │ HTTPS                                   │
│                       ▼                                         │
│              ┌─────────────────┐                                │
│              │  Fastify API    │   Backend                      │
│              │   (apps/api)    │                                │
│              └────────┬────────┘                                │
│                       │                                         │
│         ┌─────────────┼─────────────┐                          │
│         ▼             ▼             ▼                          │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐                    │
│   │PostgreSQL│  │  Redis   │  │    S3    │   Data Layer       │
│   │          │  │ (Cache)  │  │ (Files)  │                    │
│   └──────────┘  └──────────┘  └──────────┘                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18, Vite | Single Page Application |
| **Styling** | Tailwind CSS | Utility-first CSS |
| **Backend** | Node.js 20+, Fastify 4 | REST API server |
| **ORM** | Prisma 5 | Database access |
| **Database** | PostgreSQL 15 | Primary data store |
| **Cache** | Redis 7 | Session cache, rate limiting |
| **Storage** | S3-compatible | File uploads (videos, images) |
| **Mobile** | Capacitor | iOS/Android wrapper |
| **Auth** | JWT + TOTP (2FA) | Authentication with 2FA support |
| **Testing** | Jest, Playwright, K6 | Unit, E2E, load testing |
| **Build** | Turbo, pnpm | Monorepo build system |

## Project Structure

```
IUP_Master_V1/
├── apps/
│   ├── api/                 # Backend API (Fastify)
│   │   ├── src/
│   │   │   ├── api/v1/      # Route handlers (70+ endpoints)
│   │   │   ├── domain/      # Business logic
│   │   │   │   ├── tests/   # Test calculations
│   │   │   │   ├── gamification/
│   │   │   │   └── training-plan/
│   │   │   ├── middleware/  # Auth, error handling
│   │   │   └── plugins/     # Fastify plugins
│   │   ├── prisma/          # Database schema
│   │   └── tests/           # Test suites (240+ tests)
│   │
│   ├── web/                 # React frontend
│   │   ├── src/
│   │   │   ├── components/  # Reusable UI
│   │   │   ├── features/    # Feature modules (65+)
│   │   │   ├── ui/          # Design system
│   │   │   │   ├── primitives/
│   │   │   │   ├── composites/
│   │   │   │   └── templates/
│   │   │   ├── contexts/    # React contexts
│   │   │   └── hooks/       # Custom hooks
│   │   └── tests/           # Jest + Playwright tests
│   │
│   └── golfer/              # Mobile app (Capacitor)
│
├── packages/                # Shared packages
│   ├── database/            # Shared Prisma schema
│   └── design-system/       # UI components
│
├── docs/                    # Documentation
└── scripts/                 # Utility scripts
```

## Key Design Decisions

### Multi-Tenant Architecture

Every table includes a `tenant_id` column for organization isolation:

```sql
-- All queries are scoped by tenant
SELECT * FROM players WHERE tenant_id = :tenantId AND id = :playerId
```

See [ADR-003: Multi-Tenant Architecture](./decisions/003-multi-tenant.md)

### Authentication Flow

```
┌────────┐     ┌────────┐     ┌────────┐
│ Client │────▶│  API   │────▶│   DB   │
└────────┘     └────────┘     └────────┘
     │              │
     │  1. Login    │
     │─────────────▶│
     │              │ 2. Verify credentials
     │              │────────────────────▶
     │              │◀────────────────────
     │  3. JWT      │
     │◀─────────────│
     │              │
     │  4. Request  │
     │  + JWT       │
     │─────────────▶│
     │              │ 5. Validate JWT
     │              │ 6. Extract tenant_id
     │              │ 7. Query with tenant scope
```

See [ADR-004: JWT Authentication](./decisions/004-jwt-auth.md)

### Domain Layer

Business logic is separated from HTTP handlers:

```
api/v1/players/
├── index.ts      # Route definitions
├── schema.ts     # Request/response validation
└── service.ts    # Business logic

domain/
├── tests/        # Test calculation logic
├── gamification/ # Badge evaluation
└── training-plan/# Plan generation
```

## Data Flow

### Player Dashboard

```
1. GET /api/v1/dashboard/player
   │
   ├─▶ Authenticate (JWT middleware)
   │
   ├─▶ Extract tenant_id from token
   │
   ├─▶ DashboardService.getPlayerDashboard()
   │   ├─▶ Get player profile
   │   ├─▶ Get recent test results
   │   ├─▶ Get training progress
   │   ├─▶ Get badge progress
   │   └─▶ Aggregate stats
   │
   └─▶ Return JSON response
```

### Badge Evaluation

```
1. Player completes action (test, session, etc.)
   │
   ├─▶ Action persisted to database
   │
   ├─▶ BadgeEvaluatorService.evaluatePlayerBadges()
   │   ├─▶ Calculate player metrics
   │   ├─▶ Check badge requirements
   │   ├─▶ Identify newly unlocked badges
   │   └─▶ Persist badge progress
   │
   └─▶ Return unlocked badges for notification
```

## Scalability Considerations

| Concern | Solution |
|---------|----------|
| Database load | Read replicas, query optimization, indexes |
| API throughput | Horizontal scaling, load balancer |
| File storage | S3 with CDN |
| Session state | Redis cluster |
| Background jobs | Job queue (Bull) |

## Security Layers

| Layer | Implementation |
|-------|----------------|
| **Network** | HTTPS only, CORS restrictions |
| **Authentication** | JWT (15min access, 7d refresh), optional 2FA (TOTP) |
| **Authorization** | Role-based access (player/coach/admin) |
| **Data isolation** | Tenant-scoped queries |
| **Input validation** | Zod schemas on all endpoints |
| **Rate limiting** | Per-IP and per-user limits |
| **SQL injection** | Prisma ORM (parameterized queries) |
| **Audit logging** | Comprehensive activity tracking |

## Security Audit Results

- **Overall Rating:** Good (7.5/10)
- **Critical Issues:** 0
- **Security Tests:** 149 test cases
- **Multi-tenant Isolation:** Verified (no cross-tenant leakage)

---

See also:
- [Data Model](./data-model.md)
- [Security Architecture](./security.md)
- [ADRs](./decisions/)
