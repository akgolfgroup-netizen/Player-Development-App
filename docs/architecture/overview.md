# Architecture Overview

> System architecture for the IUP Golf Platform

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
| **Frontend** | React 18, TypeScript | Single Page Application |
| **Styling** | Tailwind CSS | Utility-first CSS |
| **Backend** | Node.js, Fastify | REST API server |
| **ORM** | Prisma | Database access |
| **Database** | PostgreSQL 15 | Primary data store |
| **Cache** | Redis | Session cache, rate limiting |
| **Storage** | S3-compatible | File uploads (videos, images) |
| **Mobile** | Capacitor | iOS/Android wrapper |

## Project Structure

```
IUP_Master_V1/
├── apps/
│   ├── api/                 # Backend API
│   │   ├── src/
│   │   │   ├── api/v1/      # Route handlers
│   │   │   ├── domain/      # Business logic
│   │   │   ├── middleware/  # Auth, error handling
│   │   │   └── plugins/     # Fastify plugins
│   │   ├── prisma/          # Database schema
│   │   └── tests/           # Test suites
│   │
│   ├── web/                 # React frontend
│   │   ├── src/
│   │   │   ├── components/  # Reusable UI
│   │   │   ├── features/    # Feature modules
│   │   │   ├── contexts/    # React contexts
│   │   │   └── hooks/       # Custom hooks
│   │   └── public/          # Static assets
│   │
│   └── golfer/              # Mobile app screens
│
├── docs/                    # Documentation
└── packages/                # Shared packages
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

1. **Network**: HTTPS only, CORS restrictions
2. **Authentication**: JWT with short expiry, refresh tokens
3. **Authorization**: Role-based access (player/coach/admin)
4. **Data isolation**: Tenant-scoped queries
5. **Input validation**: Zod schemas on all endpoints
6. **Rate limiting**: Per-IP and per-user limits

---

See also:
- [Data Model](./data-model.md)
- [Security Architecture](./security.md)
- [ADRs](./decisions/)
