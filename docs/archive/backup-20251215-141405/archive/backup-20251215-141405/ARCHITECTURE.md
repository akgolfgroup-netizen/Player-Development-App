# System Architecture

## Overview

The coaching platform is designed as a production-grade, multi-tenant SaaS application optimized for media-heavy workloads and event-driven operations.

## Core Principles

### 1. Multi-Tenancy with RLS (Row Level Security)

**Why RLS?**
- Database-level isolation prevents cross-tenant data leaks
- No application-level bugs can bypass tenant boundaries
- Single database simplifies operations while maintaining security
- Lower cost than database-per-tenant approach

**How it works:**
1. Every request sets `app.tenant_id` session variable via Prisma
2. PostgreSQL RLS policies automatically filter all queries
3. Cross-tenant reads return empty results
4. Cross-tenant writes fail with constraint violations

**Example:**
```sql
-- RLS policy on users table
CREATE POLICY users_tenant_isolation ON users
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
```

### 2. Event-Driven Architecture

**Transactional Outbox Pattern:**

```
[Business Logic] → [DB Transaction]
                    ├── Insert/Update business data
                    └── Insert outbox event

[Outbox Relay] → Poll outbox table
                 └── Publish to SQS

[Workers] → Consume from SQS
            └── Process event idempotently
```

**Why Outbox?**
- Guarantees events are published (no lost messages)
- Events written in same transaction as business changes
- Survives crashes and network failures
- Enables at-least-once delivery with idempotency

**Event Types:**
- `post.created` - New post published
- `comment.created` - Comment added to post
- `session.scheduled` - Session booked
- `session.cancelled` - Session cancelled
- `media.process` - Media file ready for processing

### 3. Direct-to-S3 Media Upload

**Traditional approach (bad):**
```
Client → Upload to API → API uploads to S3
```
Problems: High bandwidth cost, slow, doesn't scale

**Our approach (good):**
```
Client → Request upload URL from API
       → Upload directly to S3 (multipart)
       → Notify API when complete
       → Worker processes media
```

Benefits:
- No bandwidth through API servers
- Supports huge files (multipart uploads)
- Scales infinitely
- Client-side progress tracking

**Flow:**
1. Client: `POST /media/upload-intent` → Get pre-signed URLs
2. Client: Upload parts directly to S3
3. Client: `POST /media/:id/finalize` → Trigger processing
4. Worker: Process media (thumbnails, transcoding, etc.)
5. Client: `GET /media/:id/playback-url` → Get signed playback URL

### 4. Rate Limiting & Abuse Prevention

**Multi-Layer Rate Limiting:**
- **Per IP**: Prevent single bad actor from overwhelming system
- **Per User**: Fair usage across authenticated users
- **Per Tenant**: Prevent one tenant from affecting others

**Implementation:**
- Redis-backed sliding window counters
- Configurable limits per endpoint
- Graceful degradation (429 responses with retry-after)

**Upload Quotas:**
- Max file size (default: 500MB)
- Max tenant storage (default: 100GB)
- Enforced before upload starts

### 5. Observability

**Structured Logging (Pino):**
```json
{
  "level": "info",
  "time": 1702886400000,
  "requestId": "abc-123",
  "userId": "user-uuid",
  "tenantId": "tenant-uuid",
  "msg": "Session booked",
  "sessionId": "session-uuid"
}
```

**Distributed Tracing (OpenTelemetry):**
- Trace requests across services
- Measure latency at each step
- Identify bottlenecks
- (Currently stubbed - needs OTLP exporter configuration)

**Metrics:**
- `/admin/metrics` endpoint for platform stats
- Custom business metrics (sessions booked, posts created, etc.)
- Infrastructure metrics (CPU, memory, DB connections)

## Service Breakdown

### API Service (Fastify)
- **Role**: HTTP API for clients
- **Port**: 3000
- **Responsibilities**:
  - Authentication & authorization
  - Request validation (Zod schemas)
  - Business logic
  - Writing to outbox table
  - Serving OpenAPI docs

### Outbox Relay Worker
- **Role**: Reliable event publishing
- **Responsibilities**:
  - Poll `outbox_events` table
  - Publish to SQS
  - Mark events as published
  - Retry failed publishes (max 3 attempts)

### Media Worker
- **Role**: Process uploaded media
- **Responsibilities**:
  - Generate thumbnails
  - Transcode videos (stub - needs FFmpeg)
  - Optimize images
  - Extract metadata
  - Update asset status

### Notifications Worker
- **Role**: Send notifications to users
- **Responsibilities**:
  - Create in-app notifications
  - Send push notifications (stub)
  - Send emails (stub)
  - Handle notification preferences

### Scheduler Worker
- **Role**: Periodic tasks
- **Responsibilities**:
  - Send session reminders
  - Clean up expired idempotency keys
  - Archive old audit logs
  - Generate reports

## Data Model

### Core Tables
- `tenants` - Organization/account
- `users` - User accounts
- `memberships` - User-tenant relationships
- `refresh_tokens` - JWT refresh tokens

### Collaboration
- `spaces` - Groups/communities
- `space_members` - Space membership
- `posts` - Content posts
- `comments` - Post comments

### Media
- `media_assets` - Files (videos, images, docs)

### Scheduling
- `availability_rules` - Coach availability
- `sessions` - Scheduled sessions

### Payments (stub)
- `products` - Purchasable items
- `purchases` - Payment records

### System
- `audit_events` - Immutable audit trail
- `outbox_events` - Event queue
- `idempotency_keys` - Deduplication
- `notifications` - In-app notifications
- `device_tokens` - Push notification tokens
- `integrations` - Third-party integrations

## Security

### Authentication
- **JWT Access Tokens**: Short-lived (15 minutes)
- **JWT Refresh Tokens**: Long-lived (7 days), rotated on use
- **Password Hashing**: Argon2 (recommended by OWASP)

### Authorization (RBAC)
- **ADMIN**: Full access to tenant
- **COACH**: Create spaces, manage athletes, schedule sessions
- **ATHLETE**: View content, book sessions
- **SCHEDULER**: Manage availability and sessions

### Input Validation
- Zod schemas for all endpoints
- SQL injection prevention (Prisma parameterized queries)
- XSS prevention (JSON responses, no HTML rendering)

### Tenant Isolation
- RLS at database level
- Session variables set per request
- Cannot bypass with application bugs

## Scaling Strategy

### Database
- **Read Replicas**: Offload read traffic
- **Connection Pooling**: PgBouncer
- **Partitioning**: By tenant_id for large tables
- **Caching**: Redis for hot data

### API Servers
- **Horizontal Scaling**: Add more API instances
- **Load Balancer**: ALB with health checks
- **Auto Scaling**: Based on CPU/memory

### Workers
- **Parallel Processing**: Multiple worker instances
- **Queue Depth**: Monitor SQS queue depth
- **Auto Scaling**: Scale based on queue length

### Media
- **CDN**: CloudFront for global distribution
- **S3 Transfer Acceleration**: For uploads
- **Multi-Region**: Replicate to edge locations

## Deployment

### Development
- Docker Compose (postgres, redis, localstack)
- LocalStack for S3 and SQS
- All services run locally

### Production (TODO)
- **Compute**: ECS Fargate
- **Database**: RDS PostgreSQL Multi-AZ
- **Cache**: ElastiCache Redis cluster
- **Queue**: AWS SQS
- **Storage**: S3 + CloudFront
- **Secrets**: AWS Secrets Manager
- **Monitoring**: CloudWatch + OTLP exporter
- **IaC**: Terraform

## Future Enhancements

### High Priority
- [ ] WebSocket support for real-time updates
- [ ] Full-text search (Elasticsearch or PostgreSQL FTS)
- [ ] Email service integration (SendGrid/SES)
- [ ] Mobile app (React Native)

### Medium Priority
- [ ] GraphQL API layer
- [ ] Analytics dashboard
- [ ] Automated backups and disaster recovery
- [ ] Multi-region support

### Low Priority
- [ ] AI-powered content recommendations
- [ ] Video conferencing integration (Zoom/Meet)
- [ ] Calendar sync (Google/Outlook)
- [ ] Custom branding per tenant
