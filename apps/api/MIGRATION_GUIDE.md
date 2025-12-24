# Database Migration Guide

## ModificationRequest Model Migration

### Prerequisites

1. **Docker** must be running
2. **PostgreSQL database** must be accessible on `localhost:5432`
3. **Database name** must be `ak_golf_iup` (as configured in `.env`)

### Docker Setup

#### Option 1: Using apps/api/docker/docker-compose.yml (Recommended)

```bash
cd apps/api/docker
docker-compose up -d

# Wait for containers to be healthy
docker-compose ps

# Check logs if there are issues
docker-compose logs postgres
```

This starts:
- PostgreSQL on port 5433:5432
- Redis on port 6379
- MinIO on ports 9000-9001

**Note:** If using this option, update `.env` DATABASE_URL to use port 5433:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/ak_golf_iup?schema=public
```

#### Option 2: Using root docker-compose.yml

```bash
# From project root
make docker-up
```

This starts PostgreSQL on port 5432 with database `coaching_platform`.

**Note:** If using this option, either:
1. Create `ak_golf_iup` database manually, OR
2. Update `.env` to use `coaching_platform` database

### Running the Migration

Once Docker is confirmed running and database is accessible:

```bash
cd apps/api

# Run migration
npx prisma migrate dev --name add_modification_request_model

# Generate Prisma Client
npx prisma generate
```

### What This Migration Creates

1. **New Table:** `modification_requests`
   - Stores player modification requests
   - Links to `annual_training_plans` and `users`
   - Tracks request status, coach responses, resolution

2. **New Relations:**
   - `User.requestedModifications` - Modifications requested by this user
   - `User.reviewedModifications` - Modifications reviewed by this user
   - `AnnualTrainingPlan.modificationRequests` - All modification requests for this plan

3. **Indexes:**
   - `annualPlanId` - Fast lookup by plan
   - `requestedBy` - Fast lookup by player
   - `status` - Filter by pending/resolved
   - `createdAt` - Sort by request date

### Verifying Migration Success

```bash
# Check migration status
npx prisma migrate status

# Open Prisma Studio to verify table
npx prisma studio

# Or check directly with psql
psql -h localhost -p 5432 -U postgres -d ak_golf_iup -c "\dt modification_requests"
```

### Troubleshooting

#### Error: Can't reach database server

**Symptoms:**
```
Error: P1001: Can't reach database server at `localhost:5432`
```

**Solutions:**

1. **Check Docker is running:**
   ```bash
   docker ps
   # Should show postgres container
   ```

2. **Check port is correct:**
   ```bash
   lsof -i :5432
   # Should show postgres or docker
   ```

3. **Check database exists:**
   ```bash
   # If using docker-compose from apps/api/docker
   docker exec -it iup-golf-postgres psql -U postgres -l

   # Should list ak_golf_iup database
   ```

4. **Verify .env DATABASE_URL:**
   ```bash
   cat apps/api/.env | grep DATABASE_URL
   # Should match your Docker configuration
   ```

5. **Test connection manually:**
   ```bash
   npx prisma db execute --stdin <<< "SELECT 1;"
   # Should return "1" if connection works
   ```

#### Error: Docker API version mismatch

**Symptoms:**
```
request returned 500 Internal Server Error for API route and version http://...
check if the server supports the requested API version
```

**Solutions:**

1. **Update Docker Desktop** to latest version

2. **Restart Docker:**
   ```bash
   # On macOS
   killall Docker && open /Applications/Docker.app
   ```

3. **Check Docker version:**
   ```bash
   docker --version
   docker-compose --version
   ```

#### Migration Already Applied

If migration was already applied:

```bash
# Check migration history
npx prisma migrate status

# If "add_modification_request_model" is already applied, just generate client
npx prisma generate
```

### Manual Migration (If Automated Migration Fails)

If `npx prisma migrate dev` fails, you can apply the migration SQL manually:

1. **Get the migration SQL:**
   ```bash
   cat prisma/migrations/*_add_modification_request_model/migration.sql
   ```

2. **Apply manually:**
   ```bash
   psql -h localhost -p 5432 -U postgres -d ak_golf_iup -f prisma/migrations/*_add_modification_request_model/migration.sql
   ```

3. **Update Prisma migration tracking:**
   ```bash
   npx prisma migrate resolve --applied add_modification_request_model
   ```

4. **Generate client:**
   ```bash
   npx prisma generate
   ```

### Next Steps After Migration

1. ✅ Migration complete
2. Test API endpoints with real data
3. Configure SMTP for notifications
4. Deploy to staging environment

---

**Last Updated:** 2025-12-16
**Migration Name:** `add_modification_request_model`
**Prisma Version:** 5.22.0
