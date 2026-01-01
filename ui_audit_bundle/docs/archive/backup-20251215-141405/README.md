# Coaching Platform Backend

Production-grade backend for a CoachNow-like coaching platform. Built for scale with multi-tenancy, event-driven architecture, and media-heavy workloads.

## Architecture

### Tech Stack
- **Monorepo**: pnpm workspaces + Turborepo
- **Language**: TypeScript (Node 20)
- **API**: Fastify with OpenAPI 3.1 documentation
- **Validation**: Zod
- **Database**: PostgreSQL with Row Level Security (RLS) for tenant isolation
- **ORM**: Prisma
- **Cache/Rate Limiting**: Redis
- **Message Queue**: AWS SQS (LocalStack for local dev)
- **Media Storage**: S3 (LocalStack for local dev)
- **Auth**: JWT (access + refresh tokens), Argon2 password hashing
- **Logging**: Pino (structured JSON logs)
- **Observability**: OpenTelemetry (stub), metrics endpoints

### Key Features

#### 1. Tenant Isolation (RLS)
Every table includes `tenant_id` and PostgreSQL Row Level Security policies enforce complete data isolation at the database level. Cross-tenant access is impossible, even with direct SQL queries.

#### 2. Event-Driven Architecture
- **Transactional Outbox Pattern**: Events written to `outbox_events` table in same transaction as business changes
- **Outbox Relay Worker**: Polls outbox table and publishes to SQS
- **Consumer Workers**: Process events idempotently with deduplication via Redis and DB constraints

#### 3. Media Pipeline
- **Direct-to-S3 Upload**: Pre-signed multipart upload URLs (client uploads directly to S3)
- **Finalize Endpoint**: Records asset metadata and enqueues processing job
- **Media Worker**: Processes videos/images (stub - FFmpeg processing ready for ECS Fargate)
- **Signed Playback URLs**: Time-limited access to media files

#### 4. Security & Abuse Controls
- **Rate Limiting**: Per IP, per user, per tenant (Redis-backed)
- **Upload Quotas**: Per-file and per-tenant storage limits
- **Audit Logging**: Immutable audit trail for sensitive operations
- **RBAC**: Role-based access control (ADMIN, COACH, ATHLETE, SCHEDULER)

## Project Structure

```
/
├── packages/
│   ├── shared/          # Shared types, schemas, errors
│   └── db/              # Prisma schema, migrations, RLS policies
├── services/
│   ├── api/             # Fastify API service
│   ├── outbox-relay/    # Outbox pattern event publisher
│   ├── media-worker/    # Media processing worker
│   ├── notifications-worker/ # Notification delivery
│   └── scheduler-worker/ # Scheduled tasks (reminders, cleanup)
├── infra/
│   └── terraform/       # Infrastructure as Code (stub)
├── scripts/
│   └── localstack-init.sh # Initialize LocalStack resources
├── docker-compose.yml
├── Makefile
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 20+
- pnpm 8+
- Docker & Docker Compose

### Initial Setup

1. **Install dependencies**:
   ```bash
   make install
   ```

2. **Copy environment file**:
   ```bash
   cp .env.example .env
   ```

3. **Start infrastructure** (postgres, redis, localstack):
   ```bash
   make docker-up
   ```

4. **Run migrations and seed data**:
   ```bash
   make migrate
   make seed
   ```

5. **Start all services** (API + workers):
   ```bash
   make dev
   ```

The API will be available at `http://localhost:3000` with OpenAPI docs at `http://localhost:3000/docs`.

### Test Credentials (from seed)
- **Admin**: `admin@demo.com` / `admin123`
- **Coach**: `coach@demo.com` / `coach123`
- **Athlete**: `athlete@demo.com` / `athlete123`

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user (creates tenant)
- `POST /auth/login` - Login
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout

### Tenants
- `GET /tenants/:id` - Get tenant details
- `POST /tenants/:id/invite` - Invite member (admin only)
- `GET /tenants/:id/members` - List members

### Spaces
- `GET /spaces` - List accessible spaces
- `POST /spaces` - Create space
- `GET /spaces/:id` - Get space details
- `PATCH /spaces/:id` - Update space
- `POST /spaces/:id/members` - Add member
- `DELETE /spaces/:id/members/:userId` - Remove member

### Posts & Comments
- `GET /posts` - Get feed (paginated)
- `POST /posts` - Create post
- `GET /posts/:id` - Get post with comments
- `POST /posts/:id/comments` - Add comment
- `DELETE /posts/:id` - Delete post

### Media
- `POST /media/upload-intent` - Get pre-signed upload URLs
- `POST /media/:id/finalize` - Finalize upload, trigger processing
- `GET /media/:id/playback-url` - Get signed playback URL
- `GET /media/:id` - Get media metadata

### Scheduling
- `POST /scheduling/availability` - Create availability rule (coach)
- `GET /scheduling/availability/:coachId` - List coach availability
- `POST /scheduling/sessions/book` - Book session
- `GET /scheduling/sessions` - List sessions
- `POST /scheduling/sessions/:id/cancel` - Cancel session

### Admin
- `GET /admin/audit` - Get audit logs
- `POST /admin/export` - Export tenant data (stub)
- `DELETE /admin/users/:userId` - Delete user (stub)
- `GET /admin/metrics` - Platform metrics

## Development

### Available Commands
```bash
make install     # Install dependencies
make dev         # Start all services in watch mode
make build       # Build all packages
make test        # Run tests
make lint        # Lint code
make format      # Format code
make typecheck   # Type-check TypeScript
```

### Database Commands
```bash
make migrate     # Run migrations
make seed        # Seed database
make reset       # Reset database (drop, migrate, seed)
```

### Docker Commands
```bash
make docker-up   # Start Docker services
make docker-down # Stop Docker services
```

## Testing

### Run Tests
```bash
make test
```

### Test Coverage
- **Unit tests**: Auth, RBAC, scheduling logic
- **Integration tests**: RLS tenant isolation, outbox flow
- **Contract tests**: OpenAPI schema validation

### Critical Test: Tenant Isolation
The RLS tests prove cross-tenant data access is impossible:
- Reading another tenant's data returns empty/null
- Writing to another tenant's tables fails
- All queries automatically scoped by `app.tenant_id` session variable

## Event Types

Events published to the outbox:
- `post.created` → Triggers notifications to space members
- `comment.created` → Notifies post author
- `session.scheduled` → Notifies coach and athlete
- `session.cancelled` → Notifies affected parties
- `media.process` → Triggers media processing worker

## Configuration

See `.env.example` for all configuration options. Key settings:

- **Database**: `DATABASE_URL`
- **Redis**: `REDIS_URL`
- **AWS/LocalStack**: `AWS_ENDPOINT`, `S3_BUCKET`, `SQS_QUEUE_URL`
- **Auth**: `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`
- **Limits**: `MAX_UPLOAD_SIZE_MB`, `MAX_TENANT_STORAGE_GB`
- **Rate Limiting**: `RATE_LIMIT_MAX_PER_IP`

## TODO / Next Steps

### High Priority
- [ ] Apply RLS migration script on Prisma schema changes
- [ ] Add FFmpeg video processing in media-worker
- [ ] Implement Stripe webhook handlers for payments
- [ ] Configure OpenTelemetry exporters
- [ ] Set up Terraform modules for AWS deployment
- [ ] Add email service integration (invites, notifications)

### Medium Priority
- [ ] Implement data export functionality
- [ ] Add user account deletion with GDPR compliance
- [ ] Set up CI/CD pipeline (GitHub Actions stub included)
- [ ] Add E2E tests with real Docker env
- [ ] Implement API client SDK generation from OpenAPI
- [ ] Add real-time features with WebSockets

### Low Priority
- [ ] Add GraphQL layer (optional)
- [ ] Implement multi-region support
- [ ] Add analytics and reporting
- [ ] Build admin dashboard

## Production Deployment

### Checklist
- [ ] Set strong JWT secrets
- [ ] Configure CORS allowed origins
- [ ] Set up real AWS credentials (remove LocalStack config)
- [ ] Enable OTEL exporter to observability platform
- [ ] Configure Stripe production keys
- [ ] Set up database backups
- [ ] Configure Redis persistence
- [ ] Set up CloudWatch alarms
- [ ] Review and adjust rate limits
- [ ] Enable database connection pooling
- [ ] Set up CDN for media playback
- [ ] Configure DNS and SSL certificates

## License

UNLICENSED - Proprietary

## Support

For issues or questions, see `/docs` or contact the development team.
