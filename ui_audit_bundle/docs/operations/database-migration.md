# Database Migration Runbook

## Overview

This runbook provides step-by-step procedures for safely executing database migrations in the IUP Golf Academy platform.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Pre-Migration Checklist](#pre-migration-checklist)
3. [Development Migration](#development-migration)
4. [Staging Migration](#staging-migration)
5. [Production Migration](#production-migration)
6. [Rollback Procedures](#rollback-procedures)
7. [Troubleshooting](#troubleshooting)
8. [Post-Migration Verification](#post-migration-verification)

---

## Prerequisites

### Required Access
- Database credentials for target environment
- SSH/VPN access to application servers
- Access to monitoring dashboards
- On-call backup engineer contact

### Required Tools
- `pnpm` package manager (v8+)
- `prisma` CLI
- `psql` PostgreSQL client
- Database backup tool (pg_dump)

### Environment Variables
```bash
DATABASE_URL=postgresql://user:password@host:5432/database
SHADOW_DATABASE_URL=postgresql://user:password@host:5432/shadow_db
```

---

## Pre-Migration Checklist

Before executing ANY migration, complete this checklist:

- [ ] **Review Migration Files**
  - Check `apps/api/prisma/migrations/` for new migration files
  - Review SQL statements for potential issues
  - Identify destructive operations (DROP, TRUNCATE, etc.)

- [ ] **Estimate Downtime**
  - Small migrations: < 1 minute (indexes, new columns)
  - Medium migrations: 1-5 minutes (data transformations)
  - Large migrations: 5+ minutes (table restructuring)

- [ ] **Create Database Backup**
  ```bash
  pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql
  ```

- [ ] **Verify Backup Integrity**
  ```bash
  psql $DATABASE_URL < backup_*.sql --dry-run
  ```

- [ ] **Check Disk Space**
  ```bash
  df -h /var/lib/postgresql
  ```
  Ensure at least 2x current database size available

- [ ] **Schedule Maintenance Window**
  - Notify stakeholders 24-48 hours in advance
  - Choose low-traffic time window
  - Update status page

- [ ] **Prepare Rollback Plan**
  - Document rollback steps
  - Keep previous application version ready
  - Test rollback procedure in staging

---

## Development Migration

### Step 1: Generate Migration

```bash
cd apps/api
pnpm prisma migrate dev --name descriptive_migration_name
```

This will:
- Create migration SQL file
- Apply migration to development database
- Regenerate Prisma Client

### Step 2: Review Generated SQL

```bash
cat prisma/migrations/*/migration.sql
```

### Step 3: Test Migration

```bash
# Reset database to clean state
pnpm prisma migrate reset

# Run all migrations
pnpm prisma migrate dev

# Seed test data
pnpm prisma db seed
```

### Step 4: Verify Application

```bash
pnpm dev
# Test affected endpoints
```

---

## Staging Migration

### Step 1: Pre-Migration Checks

```bash
# Connect to staging server
ssh staging-api-server

# Navigate to application directory
cd /opt/iup-api

# Check current migration status
pnpm prisma migrate status
```

### Step 2: Enable Maintenance Mode

```bash
# Set maintenance mode flag
export MAINTENANCE_MODE=true

# Restart application (will show maintenance page)
pm2 restart api
```

### Step 3: Create Backup

```bash
# Create timestamped backup
pg_dump $DATABASE_URL > /backups/staging_$(date +%Y%m%d_%H%M%S).sql

# Verify backup
ls -lh /backups/staging_*.sql
```

### Step 4: Execute Migration

```bash
# Pull latest code
git pull origin develop

# Install dependencies
pnpm install --frozen-lockfile

# Apply migrations
pnpm --filter iup-golf-backend prisma migrate deploy

# Verify migration status
pnpm prisma migrate status
```

### Step 5: Disable Maintenance Mode

```bash
# Unset maintenance mode
unset MAINTENANCE_MODE

# Restart application
pm2 restart api

# Check logs
pm2 logs api --lines 100
```

### Step 6: Smoke Tests

```bash
# Health check
curl https://staging-api.iup-golf.com/health

# Test authentication
curl -X POST https://staging-api.iup-golf.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Test affected endpoints
curl https://staging-api.iup-golf.com/api/v1/players \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

---

## Production Migration

### CRITICAL: Production migrations require extra caution

### Step 1: Final Pre-Flight Checks

```bash
# Verify staging migration was successful
# Wait at least 24 hours after staging deployment
# Review monitoring for any anomalies
```

**Checklist:**
- [ ] Staging migration successful (24h+ running)
- [ ] No errors in Sentry
- [ ] Performance metrics normal
- [ ] Stakeholder approval obtained
- [ ] Maintenance window scheduled
- [ ] On-call team notified
- [ ] Rollback plan documented
- [ ] Database backup confirmed

### Step 2: Pre-Migration Communication

```bash
# Post to status page
curl -X POST https://status.iup-golf.com/api/incidents \
  -d "title=Scheduled Database Maintenance" \
  -d "status=investigating"

# Notify Slack channel
# Send email to users (if necessary)
```

### Step 3: Enable Maintenance Mode

```bash
# Connect to production server
ssh production-api-server

cd /opt/iup-api

# Enable maintenance mode
export MAINTENANCE_MODE=true
pm2 restart api

# Verify maintenance page is showing
curl https://api.iup-golf.com
```

### Step 4: Create Production Backup

```bash
# Create backup with verification
pg_dump $DATABASE_URL | tee /backups/prod_$(date +%Y%m%d_%H%M%S).sql | gzip > /backups/prod_$(date +%Y%m%d_%H%M%S).sql.gz

# Upload to S3 for redundancy
aws s3 cp /backups/prod_*.sql.gz s3://iup-backups/database/

# Verify backup size
ls -lh /backups/prod_*.sql.gz
```

### Step 5: Execute Migration

```bash
# Pull latest code from main branch
git pull origin main

# Verify correct branch and commit
git log -1

# Install dependencies
pnpm install --frozen-lockfile

# Generate Prisma Client
pnpm --filter iup-golf-backend prisma:generate

# Apply migrations (NO --create-only flag!)
pnpm --filter iup-golf-backend prisma migrate deploy

# Verify migration status
pnpm --filter iup-golf-backend prisma migrate status
```

### Step 6: Verify Database State

```bash
# Connect to database
psql $DATABASE_URL

# Check migration history
SELECT * FROM "_prisma_migrations" ORDER BY finished_at DESC LIMIT 5;

# Verify table structure
\d+ table_name

# Check row counts
SELECT COUNT(*) FROM critical_table;

# Exit psql
\q
```

### Step 7: Restart Application

```bash
# Build application
pnpm --filter iup-golf-backend build

# Restart with new code
pm2 restart api

# Watch logs in real-time
pm2 logs api --lines 100
```

### Step 8: Disable Maintenance Mode

```bash
# Unset maintenance mode
unset MAINTENANCE_MODE

# Restart application
pm2 restart api

# Wait 30 seconds for application to stabilize
sleep 30
```

### Step 9: Post-Migration Verification

```bash
# Health check
curl https://api.iup-golf.com/health

# Check metrics
curl https://api.iup-golf.com/metrics | grep http_requests_total

# Run smoke tests
./scripts/smoke-tests.sh production

# Monitor error rates
# Check Sentry dashboard
# Check Prometheus/Grafana dashboards
```

### Step 10: Post-Migration Communication

```bash
# Update status page
curl -X PATCH https://status.iup-golf.com/api/incidents/latest \
  -d "status=resolved" \
  -d "message=Database maintenance completed successfully"

# Notify team on Slack
```

---

## Rollback Procedures

### When to Rollback

Rollback immediately if:
- Application fails to start after migration
- Critical errors in Sentry (> 10 errors/minute)
- Database queries timing out
- Data integrity issues detected
- Any P0/P1 incident

### Rollback Steps

#### Option 1: Rollback Migration (Preferred)

```bash
# Connect to server
ssh production-api-server
cd /opt/iup-api

# Enable maintenance mode
export MAINTENANCE_MODE=true
pm2 restart api

# Identify migration to rollback
pnpm prisma migrate status

# Create rollback migration
pnpm prisma migrate resolve --rolled-back MIGRATION_NAME

# Apply rollback
pnpm prisma migrate deploy

# Restart application with previous version
git checkout PREVIOUS_COMMIT
pnpm install --frozen-lockfile
pnpm build
pm2 restart api

# Disable maintenance mode
unset MAINTENANCE_MODE
pm2 restart api
```

#### Option 2: Database Restore (Nuclear Option)

```bash
# ONLY USE IF MIGRATION ROLLBACK FAILS

# Enable maintenance mode
export MAINTENANCE_MODE=true
pm2 stop api

# Restore from backup
psql $DATABASE_URL < /backups/prod_TIMESTAMP.sql

# Or restore from S3
aws s3 cp s3://iup-backups/database/prod_TIMESTAMP.sql.gz - | gunzip | psql $DATABASE_URL

# Verify restoration
psql $DATABASE_URL -c "SELECT COUNT(*) FROM users;"

# Restart application with previous version
git checkout PREVIOUS_COMMIT
pnpm install --frozen-lockfile
pnpm build
pm2 restart api

# Disable maintenance mode
unset MAINTENANCE_MODE
pm2 restart api
```

### Post-Rollback Actions

- [ ] Document rollback reason in incident report
- [ ] Notify stakeholders of rollback
- [ ] Schedule post-mortem meeting
- [ ] Fix migration issues in development
- [ ] Test fixed migration in staging
- [ ] Reschedule production migration

---

## Troubleshooting

### Issue: Migration Fails with "relation already exists"

**Cause:** Migration was partially applied

**Solution:**
```bash
# Mark migration as resolved
pnpm prisma migrate resolve --applied MIGRATION_NAME

# Continue with next migrations
pnpm prisma migrate deploy
```

### Issue: "Shadow database" error

**Cause:** No shadow database configured

**Solution:**
```bash
# Set shadow database URL
export SHADOW_DATABASE_URL=postgresql://user:password@host:5432/shadow_db

# Create shadow database
psql $DATABASE_URL -c "CREATE DATABASE shadow_db;"

# Retry migration
pnpm prisma migrate deploy
```

### Issue: Migration timeout

**Cause:** Long-running data transformation

**Solution:**
```bash
# Increase timeout
export MIGRATION_TIMEOUT=300000

# Retry migration
pnpm prisma migrate deploy
```

### Issue: Foreign key constraint violation

**Cause:** Data inconsistency

**Solution:**
```bash
# Identify problematic records
psql $DATABASE_URL -c "SELECT * FROM table WHERE column NOT IN (SELECT id FROM referenced_table);"

# Fix data or adjust migration
# Then retry
```

---

## Post-Migration Verification

### Automated Checks

```bash
# Run integration tests
pnpm test:integration

# Run E2E tests
pnpm test:e2e

# Check metrics endpoint
curl https://api.iup-golf.com/metrics
```

### Manual Verification Checklist

- [ ] **Database Schema**
  - Verify new tables exist
  - Check column types and constraints
  - Validate indexes created

- [ ] **Data Integrity**
  - Check row counts match expectations
  - Verify no NULL values in required fields
  - Validate foreign key relationships

- [ ] **Application Health**
  - All endpoints responding
  - No 500 errors in logs
  - Response times within normal range

- [ ] **Monitoring**
  - No alerts firing
  - Error rate < 0.1%
  - Database query performance normal

- [ ] **Business Functions**
  - User login working
  - Key user flows functional
  - Reports generating correctly

### Monitoring for 24 Hours

After production migration, monitor for 24 hours:

- **Error Rates:** Check Sentry hourly
- **Performance:** Monitor P95/P99 latency
- **Database:** Watch connection pool, query times
- **Business Metrics:** Verify user activity normal

---

## Emergency Contacts

- **DBA:** +47 XXX XX XXX
- **DevOps Lead:** +47 XXX XX XXX
- **CTO:** +47 XXX XX XXX
- **PagerDuty:** https://iup-golf.pagerduty.com

---

## Changelog

| Date | Author | Changes |
|------|--------|---------|
| 2025-12-23 | Anders K | Initial runbook creation |

---

## Related Documentation

- [Deployment Guide](./deployment.md)
- [Incident Response](./incident-response.md)
- [Monitoring Guide](./monitoring.md)
- [Prisma Documentation](https://www.prisma.io/docs/concepts/components/prisma-migrate)
