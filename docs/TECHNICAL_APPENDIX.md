# Technical Appendix

**IUP Golf Platform**
**Version:** 1.0
**Effective Date:** [TBD]
**Document Status:** Draft for Review

---

## 1. SYSTEM ARCHITECTURE

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐           │
│   │   Web App    │   │  Mobile App  │   │   Admin UI   │           │
│   │  (React 18)  │   │ (Capacitor)  │   │   (React)    │           │
│   └──────┬───────┘   └──────┬───────┘   └──────┬───────┘           │
│          │                  │                  │                    │
│          └──────────────────┼──────────────────┘                    │
│                             │                                        │
│                             ▼                                        │
│                     ┌───────────────┐                               │
│                     │  API Gateway  │                               │
│                     │    (HTTPS)    │                               │
│                     └───────┬───────┘                               │
│                             │                                        │
├─────────────────────────────┼───────────────────────────────────────┤
│                         API LAYER                                    │
├─────────────────────────────┼───────────────────────────────────────┤
│                             ▼                                        │
│                     ┌───────────────┐                               │
│                     │  Fastify API  │                               │
│                     │  (Node.js 20) │                               │
│                     └───────┬───────┘                               │
│                             │                                        │
│         ┌───────────────────┼───────────────────┐                   │
│         ▼                   ▼                   ▼                   │
│   ┌───────────┐      ┌───────────┐      ┌───────────┐              │
│   │Middleware │      │  Routes   │      │  Plugins  │              │
│   │(Auth,CORS)│      │ (70+ eps) │      │(WS,Cache) │              │
│   └───────────┘      └───────────┘      └───────────┘              │
│                             │                                        │
│                             ▼                                        │
│                     ┌───────────────┐                               │
│                     │Domain Services│                               │
│                     │  (Business)   │                               │
│                     └───────┬───────┘                               │
│                             │                                        │
├─────────────────────────────┼───────────────────────────────────────┤
│                         DATA LAYER                                   │
├─────────────────────────────┼───────────────────────────────────────┤
│                             ▼                                        │
│         ┌───────────────────┼───────────────────┐                   │
│         ▼                   ▼                   ▼                   │
│   ┌───────────┐      ┌───────────┐      ┌───────────┐              │
│   │PostgreSQL │      │   Redis   │      │  AWS S3   │              │
│   │    16     │      │     7     │      │ (Files)   │              │
│   └───────────┘      └───────────┘      └───────────┘              │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.2 Component Overview

| Component | Technology | Purpose |
|-----------|------------|---------|
| Web Frontend | React 18, Vite | Single Page Application |
| Mobile App | Capacitor 6 | iOS/Android wrapper |
| API Server | Fastify 4, Node.js 20 | REST API backend |
| ORM | Prisma 5 | Database access layer |
| Database | PostgreSQL 16 | Primary data storage |
| Cache | Redis 7 | Session cache, rate limiting |
| File Storage | AWS S3 | Videos, images, documents |
| Monitoring | Sentry, Prometheus | Error tracking, metrics |

---

## 2. INFRASTRUCTURE SPECIFICATIONS

### 2.1 Production Environment

| Resource | Specification | Purpose |
|----------|---------------|---------|
| Application Servers | 2+ instances, 4 vCPU, 8 GB RAM | API hosting |
| Database | PostgreSQL 16, 8 GB RAM, SSD | Data storage |
| Cache | Redis 7, 2 GB RAM | Session, rate limits |
| Load Balancer | AWS ALB / Nginx | Traffic distribution |
| CDN | CloudFront / Cloudflare | Static asset delivery |
| Storage | S3 Standard | File storage |

### 2.2 Scaling Strategy

| Load Level | Players | Infrastructure |
|------------|---------|----------------|
| Small | < 500 | 1 API instance, shared DB |
| Medium | 500-2000 | 2 API instances, dedicated DB |
| Large | 2000-10000 | 4+ API instances, DB replica |
| Enterprise | 10000+ | Auto-scaling, read replicas |

### 2.3 Geographic Distribution

| Region | Services | Purpose |
|--------|----------|---------|
| EU (Ireland) | Primary | Main deployment |
| EU (Frankfurt) | Backup | Disaster recovery |

---

## 3. API SPECIFICATION

### 3.1 API Overview

| Attribute | Value |
|-----------|-------|
| Base URL | `https://api.iup-golf.com/api/v1` |
| Protocol | HTTPS (TLS 1.2+) |
| Format | JSON |
| Authentication | Bearer Token (JWT) |
| Versioning | URL path (`/v1/`, `/v2/`) |

### 3.2 Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | User login, returns JWT |
| POST | `/auth/register` | New user registration |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/logout` | Invalidate refresh token |
| POST | `/auth/forgot-password` | Request password reset |
| POST | `/auth/reset-password` | Complete password reset |
| POST | `/auth/2fa/setup` | Initialize 2FA |
| POST | `/auth/2fa/verify` | Verify 2FA code |
| POST | `/auth/2fa/disable` | Disable 2FA |

### 3.3 Player Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/players` | List players (coach/admin) |
| GET | `/players/:id` | Get player details |
| PUT | `/players/:id` | Update player profile |
| GET | `/players/:id/dashboard` | Player dashboard data |
| GET | `/players/:id/achievements` | Player badges and XP |
| GET | `/players/:id/tests` | Player test results |
| GET | `/players/:id/sessions` | Training sessions |

### 3.4 Training Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/training-plans` | List training plans |
| POST | `/training-plans` | Create training plan |
| GET | `/training-plans/:id` | Get plan details |
| PUT | `/training-plans/:id` | Update plan |
| DELETE | `/training-plans/:id` | Delete plan |
| GET | `/sessions` | List training sessions |
| POST | `/sessions` | Create session |
| PUT | `/sessions/:id/complete` | Mark session complete |

### 3.5 Test Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tests` | List test protocols |
| GET | `/tests/:id` | Get test details |
| POST | `/tests/results` | Record test result |
| GET | `/tests/results` | Get test results |
| GET | `/tests/benchmarks` | Get category benchmarks |

### 3.6 Video Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/media/upload-url` | Get pre-signed upload URL |
| POST | `/media/confirm` | Confirm upload complete |
| GET | `/videos` | List videos |
| GET | `/videos/:id` | Get video details |
| DELETE | `/videos/:id` | Delete video |
| POST | `/videos/:id/annotations` | Add annotation |
| GET | `/videos/:id/annotations` | List annotations |

### 3.7 Rate Limits

| Endpoint Type | Limit | Window |
|---------------|-------|--------|
| Authentication | 5 requests | 1 minute |
| Standard read | 100 requests | 1 minute |
| Standard write | 30 requests | 1 minute |
| Heavy operations | 10 requests | 1 minute |
| Search | 50 requests | 1 minute |

### 3.8 Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token",
    "details": { ... }
  }
}
```

---

## 4. DATABASE SCHEMA

### 4.1 Core Tables

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     Tenant      │     │      User       │     │     Player      │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id (PK)         │◄────│ tenant_id (FK)  │     │ id (PK)         │
│ name            │     │ id (PK)         │◄────│ user_id (FK)    │
│ created_at      │     │ email           │     │ tenant_id (FK)  │
│ settings (JSON) │     │ password_hash   │     │ first_name      │
└─────────────────┘     │ role            │     │ last_name       │
                        │ 2fa_enabled     │     │ date_of_birth   │
                        └─────────────────┘     │ gender          │
                                                │ category (A-K)  │
                                                └─────────────────┘
```

### 4.2 Training Tables

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ TrainingPlan    │     │TrainingSession  │     │   Exercise      │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id (PK)         │◄────│ plan_id (FK)    │     │ id (PK)         │
│ player_id (FK)  │     │ id (PK)         │────►│ name            │
│ coach_id (FK)   │     │ player_id (FK)  │     │ description     │
│ start_date      │     │ date            │     │ category        │
│ end_date        │     │ duration        │     │ difficulty      │
│ phase (E/G/S/T) │     │ status          │     │ video_url       │
└─────────────────┘     │ notes           │     └─────────────────┘
                        └─────────────────┘
```

### 4.3 Testing Tables

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│      Test       │     │   TestResult    │     │  Benchmark      │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id (PK)         │◄────│ test_id (FK)    │     │ id (PK)         │
│ name            │     │ id (PK)         │     │ test_id (FK)    │
│ category (A-K)  │     │ player_id (FK)  │     │ category (A-K)  │
│ metric_unit     │     │ value           │     │ gender          │
│ instructions    │     │ date            │     │ target_value    │
└─────────────────┘     │ notes           │     └─────────────────┘
                        └─────────────────┘
```

### 4.4 Gamification Tables

```
┌─────────────────┐     ┌─────────────────┐
│     Badge       │     │PlayerAchievement│
├─────────────────┤     ├─────────────────┤
│ id (PK)         │◄────│ badge_id (FK)   │
│ name            │     │ player_id (FK)  │
│ description     │     │ earned_at       │
│ category        │     │ progress (%)    │
│ tier            │     └─────────────────┘
│ xp_value        │
│ requirements    │
└─────────────────┘
```

### 4.5 Indexes

The database includes 50+ optimized indexes for:
- Primary key lookups
- Foreign key relationships
- Tenant-scoped queries
- Date-range queries
- Full-text search

---

## 5. SECURITY ARCHITECTURE

### 5.1 Authentication Flow

```
┌────────┐     ┌────────┐     ┌────────┐     ┌────────┐
│ Client │     │  API   │     │  Auth  │     │   DB   │
└───┬────┘     └───┬────┘     └───┬────┘     └───┬────┘
    │              │              │              │
    │ 1. Login     │              │              │
    │─────────────►│              │              │
    │              │ 2. Validate  │              │
    │              │─────────────►│              │
    │              │              │ 3. Check user│
    │              │              │─────────────►│
    │              │              │◄─────────────│
    │              │◄─────────────│              │
    │ 4. JWT       │              │              │
    │◄─────────────│              │              │
    │              │              │              │
    │ 5. API call  │              │              │
    │  + JWT       │              │              │
    │─────────────►│              │              │
    │              │ 6. Validate  │              │
    │              │    JWT       │              │
    │              │              │              │
    │              │ 7. Extract   │              │
    │              │   tenant_id  │              │
    │              │              │              │
    │              │ 8. Query     │              │
    │              │─────────────────────────────►│
    │              │◄─────────────────────────────│
    │ 9. Response  │              │              │
    │◄─────────────│              │              │
```

### 5.2 JWT Token Structure

**Access Token (15 min expiry):**
```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "role": "player",
  "tenantId": "tenant-uuid",
  "playerId": "player-uuid",
  "iat": 1703683200,
  "exp": 1703684100,
  "aud": "iup-golf-api",
  "iss": "iup-golf-backend"
}
```

**Refresh Token (7 day expiry):**
- Stored server-side in Redis
- One-time use (rotation on refresh)
- Revocable

### 5.3 Password Security

| Measure | Implementation |
|---------|----------------|
| Hashing | bcrypt (10-12 rounds) or Argon2 |
| Salt | Unique per password |
| Minimum length | 8 characters |
| Breach check | Optional HIBP integration |
| Reset tokens | 32-byte cryptographically random |
| Reset expiry | 1 hour |

### 5.4 Two-Factor Authentication

| Feature | Implementation |
|---------|----------------|
| Algorithm | TOTP (RFC 6238) |
| Library | Speakeasy |
| Window | 30 seconds |
| Backup codes | 10 codes, one-time use |
| Recovery | Admin reset process |

### 5.5 Security Headers

```
Content-Security-Policy: default-src 'self'; script-src 'self'
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

### 5.6 Input Validation

All API inputs validated with Zod schemas:
- Type checking
- Length limits
- Format validation (email, UUID, etc.)
- Custom business rules

### 5.7 SQL Injection Prevention

- Prisma ORM with parameterized queries
- No raw SQL in application code
- Query analysis and optimization

---

## 6. MONITORING AND OBSERVABILITY

### 6.1 Metrics Collection

| Metric Type | Tool | Data |
|-------------|------|------|
| Application | Prometheus | Request rate, latency, errors |
| Infrastructure | CloudWatch | CPU, memory, disk |
| Errors | Sentry | Stack traces, user context |
| Business | Custom | Active users, sessions |

### 6.2 Health Check Endpoints

| Endpoint | Purpose | Response |
|----------|---------|----------|
| `/health` | Application health | 200 OK + status |
| `/ready` | Kubernetes readiness | 200 if ready |
| `/live` | Kubernetes liveness | 200 if alive |
| `/metrics` | Prometheus metrics | Metric data |

### 6.3 Logging

| Level | Usage |
|-------|-------|
| ERROR | Exceptions, failed operations |
| WARN | Deprecated usage, near-limits |
| INFO | Request/response, business events |
| DEBUG | Detailed debugging (dev only) |

**Log Format (JSON):**
```json
{
  "timestamp": "2025-12-27T10:30:00Z",
  "level": "INFO",
  "message": "Request completed",
  "requestId": "uuid",
  "userId": "uuid",
  "tenantId": "uuid",
  "duration": 45,
  "status": 200
}
```

### 6.4 Alerting

| Alert | Condition | Action |
|-------|-----------|--------|
| High error rate | > 1% over 5 min | Page on-call |
| API latency | p95 > 500ms | Page on-call |
| Database connection | < 5 available | Warning |
| Disk space | > 80% used | Warning |
| Memory usage | > 90% | Page on-call |

---

## 7. BACKUP AND DISASTER RECOVERY

### 7.1 Backup Schedule

| Data Type | Frequency | Retention |
|-----------|-----------|-----------|
| Database (full) | Daily | 30 days |
| Database (incremental) | Hourly | 7 days |
| Database (WAL) | Continuous | 7 days |
| File storage (S3) | Versioning | 30 days |
| Configuration | On change | 90 days |

### 7.2 Recovery Objectives

| Metric | Target | Description |
|--------|--------|-------------|
| RPO (Recovery Point) | 1 hour | Maximum data loss |
| RTO (Recovery Time) | 4 hours | Maximum downtime |

### 7.3 Disaster Recovery Procedures

1. **Database failure:**
   - Automatic failover to replica (< 5 min)
   - Manual promotion if needed
   - Point-in-time recovery available

2. **Application failure:**
   - Auto-scaling replaces failed instances
   - Load balancer health checks
   - Rollback to previous version if needed

3. **Region failure:**
   - Failover to backup region (manual)
   - DNS update for traffic routing
   - Restore from S3 cross-region replication

---

## 8. DEVELOPMENT AND DEPLOYMENT

### 8.1 Development Environment

```bash
# Prerequisites
Node.js 20+
Docker Desktop
pnpm 8.12+

# Setup (5 minutes)
cd apps/api
docker-compose up -d          # PostgreSQL, Redis
pnpm install
npx prisma generate
npx prisma migrate deploy
pnpm run prisma:seed
pnpm dev                      # http://localhost:3000

cd ../web
pnpm install
pnpm start                    # http://localhost:3001
```

### 8.2 CI/CD Pipeline

```
┌─────────────────────────────────────────────────────────────────┐
│                        GitHub Actions                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐            │
│  │  Lint   │─►│  Test   │─►│  Build  │─►│ Deploy  │            │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘            │
│                                                                  │
│  • ESLint      • Unit        • Docker     • Staging (auto)     │
│  • TypeScript  • Integration • Artifacts  • Production (manual)│
│  • Security    • E2E                                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 8.3 Deployment Environments

| Environment | Branch | Auto-Deploy | URL |
|-------------|--------|-------------|-----|
| Development | feature/* | No | localhost |
| Staging | develop | Yes | staging.iup-golf.com |
| Production | main | Manual approval | iup-golf.com |

### 8.4 Rollback Procedure

1. Identify issue (monitoring/alerts)
2. Assess severity
3. Execute rollback:
   ```bash
   # Revert to previous deployment
   kubectl rollout undo deployment/api
   # Or: redeploy previous version
   ```
4. Verify health checks
5. Post-incident review

---

## 9. INTEGRATION SPECIFICATIONS

### 9.1 Webhook Events (Planned)

| Event | Payload | Use Case |
|-------|---------|----------|
| `player.created` | Player data | Sync with external systems |
| `session.completed` | Session data | Training log integration |
| `test.recorded` | Test result | Performance tracking |
| `badge.earned` | Badge data | Notification systems |

### 9.2 Webhook Security

- HMAC signature verification
- Timestamp validation (5 min window)
- IP allowlisting (optional)
- Retry with exponential backoff

### 9.3 Data Export Formats

| Format | Use Case |
|--------|----------|
| JSON | API responses, programmatic access |
| CSV | Spreadsheet import, reporting |
| PDF | Official reports, certificates |

---

## 10. PERFORMANCE BENCHMARKS

### 10.1 Load Testing Results

| Scenario | Concurrent Users | Response Time (p95) | Error Rate |
|----------|------------------|---------------------|------------|
| Dashboard load | 100 | 180ms | 0% |
| Session create | 50 | 220ms | 0% |
| Test results list | 100 | 150ms | 0% |
| Video upload (60s) | 10 | 25s | < 1% |

### 10.2 Database Performance

| Query Type | Average Time |
|------------|--------------|
| Single record lookup | < 5ms |
| List with pagination | < 50ms |
| Complex aggregation | < 200ms |
| Full-text search | < 100ms |

### 10.3 Optimization Techniques

- 50+ database indexes
- Redis caching for hot data
- Query optimization (N+1 prevention)
- Connection pooling
- CDN for static assets

---

## 11. COMPLIANCE CERTIFICATIONS

### 11.1 Current Status

| Certification | Status | Notes |
|---------------|--------|-------|
| GDPR | Compliant | See Schedule B |
| ISO 27001 | Roadmap | Planned for 2025 |
| SOC 2 | Roadmap | Planned for 2025 |

### 11.2 Security Audit

**Latest audit:** December 2025
**Rating:** A- (Excellent)
**Findings:** See Schedule B, Section 6

---

**Document Control**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-27 | Generated from codebase | Initial draft |

---

*This Technical Appendix provides detailed specifications for the IUP Golf Platform. All specifications are based on actual implementation and may evolve as the platform develops.*
