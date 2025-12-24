# Option B: Backend Enhancement

**Started:** 2025-12-16
**Status:** In Progress

## Overview

Transform the backend from development/prototype state to production-ready with real database integration, caching, proper authentication, and production-grade middleware.

## Current State vs Target

| Feature | Current | Target | Priority |
|---------|---------|--------|----------|
| Data Storage | In-memory Maps | PostgreSQL + Prisma | High |
| Idempotency Cache | In-memory Map | Redis | High |
| Rate Limiting | None | Redis-based rate limiter | Medium |
| Request Logging | Basic console | Structured logging (pino) | High |
| API Documentation | Comments only | OpenAPI/Swagger | Medium |
| Health Checks | Basic `/health` | Detailed health checks | Medium |
| Caching Strategy | None | Redis multi-layer cache | Medium |
| Authentication | JWT (basic) | JWT + refresh tokens | Low |

## Tasks

### 1. Request Logging Enhancement ✅

**Current:** Basic fastify logger
**Target:** Structured logging with request/response tracking

**Implementation:**
```typescript
// apps/api/src/utils/logger.ts - ALREADY EXISTS
import pino from 'pino';
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  // Already configured properly
});
```

**Status:** ✅ Already implemented in `apps/api/src/utils/logger.ts`

### 2. OpenAPI Documentation

**Target:** Auto-generated API documentation with Swagger UI

**Implementation:**
```typescript
// apps/api/src/plugins/swagger.ts - ALREADY EXISTS
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

export async function registerSwagger(app: FastifyInstance) {
  await app.register(swagger, {
    openapi: {
      info: {
        title: 'IUP Golf Academy API',
        version: '1.0.0',
      },
    },
  });

  await app.register(swaggerUi, {
    routePrefix: '/docs',
  });
}
```

**Status:** ✅ Already implemented - Available at `http://localhost:3000/docs`

### 3. Rate Limiting Middleware

**Target:** Protect API from abuse with Redis-backed rate limiting

**File:** `apps/api/src/middleware/rate-limiter.ts`

```typescript
import rateLimit from '@fastify/rate-limit';

export async function registerRateLimit(app: FastifyInstance) {
  await app.register(rateLimit, {
    max: 100, // 100 requests
    timeWindow: '1 minute',
    cache: 10000,
    allowList: ['127.0.0.1'],
    redis: process.env.REDIS_URL, // Use Redis in production
  });
}
```

**Dependencies:**
```bash
npm install @fastify/rate-limit ioredis
```

**Status:** 🔸 To Implement

### 4. Redis for Idempotency Cache

**Current:** In-memory Map (lost on restart)
**Target:** Redis with TTL

**File:** `apps/api/src/middleware/idempotency.ts` (Update)

```typescript
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export async function idempotencyMiddleware(request, reply) {
  const key = request.headers['idempotency-key'];
  if (!key || request.method !== 'POST') return;

  const cacheKey = `idempotency:${request.user.id}:${key}`;

  // Check Redis
  const cached = await redis.get(cacheKey);
  if (cached) {
    return reply.status(200).send(JSON.parse(cached));
  }

  // Store in Redis with 24h TTL
  request.addHook('onSend', async (req, reply, payload) => {
    await redis.setex(cacheKey, 86400, payload);
  });
}
```

**Status:** 🔸 To Implement

### 5. Database Integration

**Current:** Mock data in Maps
**Target:** PostgreSQL via Prisma

**Prisma Schema:** `apps/api/prisma/schema.prisma` - ALREADY EXISTS

**Implementation Steps:**

a) **Environment Setup**
```bash
# .env
DATABASE_URL="postgresql://user:pass@localhost:5432/iup_golf"
REDIS_URL="redis://localhost:6379"
```

b) **Migration**
```bash
cd apps/api
npx prisma migrate dev --name init
npx prisma generate
```

c) **Update Endpoints** - Replace Map usage with Prisma calls

Example for `/plan/current`:
```typescript
// Before
const plans = new Map();
return plans.get(userId) || mockPlan;

// After
const plan = await prisma.trainingPlan.findFirst({
  where: { playerId: userId, active: true },
  include: { weeks: true },
});
```

**Status:** 🔸 Schema exists, needs migration + endpoint updates

### 6. Multi-Layer Caching Strategy

**Target:** Redis caching for frequently accessed data

**Implementation:**
```typescript
// apps/api/src/utils/cache.ts
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export async function cacheGet<T>(key: string): Promise<T | null> {
  const cached = await redis.get(key);
  return cached ? JSON.parse(cached) : null;
}

export async function cacheSet(key: string, value: any, ttl = 300) {
  await redis.setex(key, ttl, JSON.stringify(value));
}

// Usage in routes
const cacheKey = `dashboard:player:${userId}`;
let data = await cacheGet(cacheKey);
if (!data) {
  data = await fetchFromDatabase();
  await cacheSet(cacheKey, data, 60); // 1 min TTL
}
```

**Status:** 🔸 To Implement

### 7. Health Checks Enhancement

**Current:** Basic `/health` endpoint
**Target:** Detailed health with dependency checks

**File:** `apps/api/src/api/v1/health.ts`

```typescript
export async function registerHealthRoutes(app: FastifyInstance) {
  app.get('/health', async (req, reply) => {
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      checks: {
        database: await checkDatabase(),
        redis: await checkRedis(),
        memory: process.memoryUsage(),
      },
    };

    const allHealthy = Object.values(health.checks).every(
      c => typeof c === 'object' ? c.status === 'ok' : true
    );

    return reply
      .code(allHealthy ? 200 : 503)
      .send(health);
  });
}

async function checkDatabase() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: 'ok' };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
}
```

**Status:** 🔸 To Implement

### 8. Authentication Enhancement

**Current:** JWT with hardcoded demo users
**Target:** Refresh tokens + proper session management

**Not Critical for MVP** - Current auth is sufficient for development

**Status:** ⏸️ Deferred

## Implementation Priority

### Phase 1: Foundation (High Priority)
1. ✅ Request Logging - Already done
2. ✅ OpenAPI Docs - Already done
3. 🔸 Redis Setup - Docker compose
4. 🔸 Rate Limiting - Quick win

### Phase 2: Data Layer (Critical)
5. 🔸 Database Migration - Run Prisma migrations
6. 🔸 Update Endpoints - Replace Maps with Prisma
7. 🔸 Idempotency Redis - Update middleware

### Phase 3: Performance (Medium Priority)
8. 🔸 Multi-layer Caching - Implement cache utils
9. 🔸 Enhanced Health Checks - Add dependency checks

### Phase 4: Security (Lower Priority for MVP)
10. ⏸️ Refresh Tokens - Deferred

## Quick Wins (Implemented Now)

### Add Rate Limiting

```bash
cd apps/api
npm install @fastify/rate-limit
```

### Docker Compose for Redis

```yaml
# apps/api/docker-compose.yml
version: '3.8'
services:
  redis:
    image: redis:7-alpine
    ports:
      - '6379:6379'
    volumes:
      - redis-data:/data

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: iup_golf
      POSTGRES_PASSWORD: dev_password
      POSTGRES_DB: iup_golf_dev
    ports:
      - '5432:5432'
    volumes:
      - postgres-data:/var/lib/postgresql/data

volumes:
  redis-data:
  postgres-data:
```

**Start:** `docker-compose up -d`

## Benefits

**Rate Limiting:**
- Prevents API abuse
- Protects against DDoS
- Fair usage enforcement

**Redis Caching:**
- Faster response times (cached data: <5ms vs database: 50-100ms)
- Reduced database load
- Better scalability

**Database Integration:**
- Data persistence across restarts
- Proper data relationships
- Transaction support
- Better query performance

**Enhanced Logging:**
- Easier debugging
- Performance monitoring
- Audit trail

**OpenAPI Docs:**
- Self-documenting API
- Easy integration for clients
- Interactive testing

## Current Status

✅ **Completed:**
- Logging infrastructure (pino)
- OpenAPI/Swagger documentation
- Error handling middleware
- Authentication middleware

🔸 **In Progress:**
- Rate limiting setup
- Redis integration
- Database migrations

⏸️ **Deferred:**
- Refresh token implementation

## Next Steps

1. **Create docker-compose.yml** for Redis + PostgreSQL
2. **Install rate-limiting** package
3. **Run database migrations** (Prisma)
4. **Update 3-5 critical endpoints** to use Prisma (dashboard, plan, tests)
5. **Update idempotency middleware** to use Redis
6. **Test and verify** all changes

**Estimated Time:** 2-3 hours for critical path
