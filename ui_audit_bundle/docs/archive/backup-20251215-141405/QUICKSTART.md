# Quick Start Guide

Get the coaching platform running locally in 5 minutes.

## Prerequisites Check

```bash
node --version  # Should be v20+
docker --version
docker-compose --version
```

## Step 1: Install Dependencies

If you don't have pnpm installed globally:

```bash
npx pnpm@8.12.1 install
```

Or with pnpm installed:

```bash
pnpm install
```

## Step 2: Environment Setup

```bash
cp .env.example .env
```

The default `.env` values work for local development - no changes needed!

## Step 3: Start Infrastructure

```bash
make docker-up
```

This starts:
- PostgreSQL on port 5432
- Redis on port 6379
- LocalStack (S3 + SQS) on port 4566

Wait ~10 seconds for services to be healthy.

## Step 4: Database Setup

Generate Prisma client and run migrations:

```bash
cd packages/db
npx prisma generate
npx prisma migrate dev --name init
cd ../..
```

Then apply RLS policies:

```bash
docker exec -i coaching-postgres psql -U postgres -d coaching_platform < packages/db/init.sql
docker exec -i coaching-postgres psql -U postgres -d coaching_platform < packages/db/migrations/001_enable_rls.sql
```

Seed the database:

```bash
make seed
```

## Step 5: Start Services

```bash
npx turbo run dev --parallel
```

Or if you installed pnpm globally:

```bash
make dev
```

This starts:
- **API** on http://localhost:3000
- **Outbox Relay Worker**
- **Media Worker**
- **Notifications Worker**
- **Scheduler Worker**

## Step 6: Test the API

Visit http://localhost:3000/health - should return:

```json
{
  "status": "healthy",
  "timestamp": "2025-12-15T...",
  "uptime": 1.234
}
```

Visit http://localhost:3000/docs to see the OpenAPI documentation!

## Test Credentials

From the seed data:

- **Admin**: `admin@demo.com` / `admin123`
- **Coach**: `coach@demo.com` / `coach123`
- **Athlete**: `athlete@demo.com` / `athlete123`

## Example API Flow

### 1. Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@demo.com",
    "password": "admin123"
  }'
```

Copy the `accessToken` from the response.

### 2. List Spaces

```bash
curl http://localhost:3000/spaces \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 3. Create a Post

```bash
curl -X POST http://localhost:3000/posts \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "spaceId": "SPACE_ID_FROM_ABOVE",
    "type": "TEXT",
    "title": "My First Post",
    "content": "Hello from the coaching platform!"
  }'
```

### 4. Check the Feed

```bash
curl http://localhost:3000/posts \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Troubleshooting

### "pnpm: command not found"

Use npx instead:
```bash
npx pnpm@8.12.1 install
npx turbo run dev --parallel
```

### Database connection error

Make sure Docker is running and containers are healthy:
```bash
docker ps
```

All containers should show "healthy" status.

### Port already in use

Check what's using the ports:
```bash
lsof -i :3000  # API
lsof -i :5432  # PostgreSQL
lsof -i :6379  # Redis
```

Kill the process or change ports in .env and docker-compose.yml.

### Can't connect to LocalStack

Check LocalStack logs:
```bash
docker logs coaching-localstack
```

Restart if needed:
```bash
make docker-down
make docker-up
```

## Next Steps

- Explore the API at http://localhost:3000/docs
- Read the main [README.md](./README.md) for architecture details
- Check out the tests: `make test`
- Review the database schema: `packages/db/schema.prisma`

## Stopping Everything

```bash
# Stop all services (Ctrl+C in the terminal running `make dev`)

# Stop Docker containers
make docker-down

# Or to completely remove volumes:
docker-compose down -v
```

## Clean Slate

To start fresh:

```bash
make clean      # Remove node_modules and build artifacts
make docker-down -v  # Remove Docker volumes
```

Then follow Steps 1-5 again.
