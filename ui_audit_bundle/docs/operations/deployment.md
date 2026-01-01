# Deployment Guide

## Overview

This guide provides comprehensive procedures for deploying the IUP Golf Academy platform across different environments.

## Table of Contents

1. [Deployment Architecture](#deployment-architecture)
2. [Prerequisites](#prerequisites)
3. [Development Deployment](#development-deployment)
4. [Staging Deployment](#staging-deployment)
5. [Production Deployment](#production-deployment)
6. [Rollback Procedures](#rollback-procedures)
7. [Post-Deployment Verification](#post-deployment-verification)
8. [Troubleshooting](#troubleshooting)

---

## Deployment Architecture

### Infrastructure Overview

```
┌─────────────────────────────────────────────────────────┐
│                     Load Balancer (Nginx)                │
│                   (SSL Termination)                      │
└─────────────────────────────────────────────────────────┘
                            │
           ┌────────────────┴────────────────┐
           │                                  │
    ┌──────▼──────┐                  ┌──────▼──────┐
    │   API Node 1 │                  │   API Node 2 │
    │   (PM2)      │                  │   (PM2)      │
    └──────┬───────┘                  └──────┬───────┘
           │                                  │
           └────────────────┬────────────────┘
                            │
         ┌──────────────────┼──────────────────┐
         │                  │                   │
    ┌────▼────┐      ┌─────▼─────┐     ┌──────▼──────┐
    │PostgreSQL│      │   Redis   │     │     S3      │
    │ Primary  │      │  (Cache)  │     │   (Media)   │
    └──────────┘      └───────────┘     └─────────────┘
```

### Environment Configuration

| Environment | Purpose | Branch | Auto-Deploy | URL |
|------------|---------|--------|-------------|-----|
| Development | Local dev | feature/* | No | localhost:3001 |
| Staging | QA/Testing | develop | Yes | staging-api.iup-golf.com |
| Production | Live users | main | Manual | api.iup-golf.com |

---

## Prerequisites

### Required Access
- GitHub repository access
- SSH keys for deployment servers
- AWS credentials (for S3, RDS)
- Environment variable secrets
- CI/CD pipeline access

### Required Tools
```bash
# Node.js and pnpm
node --version  # v20+
pnpm --version  # v8+

# Git
git --version

# SSH client
ssh -V

# AWS CLI (if using AWS)
aws --version

# Docker (optional)
docker --version
```

### Environment Variables

Create `.env.{environment}` files with required variables:

```bash
# .env.production example
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://user:pass@host:5432/db
REDIS_URL=redis://host:6379
JWT_SECRET=secure-random-string
AWS_ACCESS_KEY_ID=XXXX
AWS_SECRET_ACCESS_KEY=XXXX
SENTRY_DSN=https://xxx@sentry.io/xxx
```

---

## Development Deployment

### Local Setup

```bash
# Clone repository
git clone https://github.com/your-org/iup-golf-platform.git
cd iup-golf-platform

# Install dependencies
pnpm install

# Set up environment
cp .env.example .env
# Edit .env with your local configuration

# Set up database
docker-compose up -d postgres redis

# Run database migrations
cd apps/api
pnpm prisma migrate dev

# Seed database (optional)
pnpm prisma db seed

# Start development server
pnpm dev
```

### Verify Local Deployment

```bash
# API health check
curl http://localhost:3001/health

# Test authentication
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Access Swagger docs
open http://localhost:3001/docs
```

---

## Staging Deployment

### Automated Deployment (via CI/CD)

Staging deploys automatically when code is pushed to `develop` branch.

```bash
# Merge feature branch to develop
git checkout develop
git pull origin develop
git merge feature/your-feature
git push origin develop

# GitHub Actions will automatically:
# 1. Run tests
# 2. Run security audit
# 3. Build application
# 4. Deploy to staging
# 5. Run smoke tests
```

### Manual Deployment to Staging

If automated deployment fails or manual deployment is needed:

```bash
# SSH to staging server
ssh staging-api-server

# Navigate to application directory
cd /opt/iup-api

# Pull latest code
git fetch origin
git checkout develop
git pull origin develop

# Install dependencies
pnpm install --frozen-lockfile

# Run database migrations
pnpm --filter iup-golf-backend prisma migrate deploy

# Build application
pnpm --filter iup-golf-backend build

# Restart application
pm2 restart api

# Verify deployment
pm2 status
pm2 logs api --lines 50
```

### Staging Deployment Checklist

- [ ] Code merged to `develop` branch
- [ ] All tests passing in CI
- [ ] Security audit completed
- [ ] Database migrations ready (if any)
- [ ] Environment variables updated (if needed)
- [ ] Deployment completed successfully
- [ ] Application logs showing no errors
- [ ] Smoke tests passing
- [ ] Stakeholders notified (if major changes)

---

## Production Deployment

### Pre-Deployment Checklist

**Mandatory checks before production deployment:**

- [ ] **Code Quality**
  - [ ] All tests passing
  - [ ] Code review approved
  - [ ] Security audit passed
  - [ ] No critical bugs in Sentry

- [ ] **Staging Verification**
  - [ ] Deployed to staging for 24+ hours
  - [ ] Smoke tests passing
  - [ ] Performance metrics normal
  - [ ] No regressions identified

- [ ] **Documentation**
  - [ ] CHANGELOG.md updated
  - [ ] API documentation updated (if API changes)
  - [ ] Deployment notes prepared
  - [ ] Rollback plan documented

- [ ] **Database**
  - [ ] Migrations tested in staging
  - [ ] Backup strategy confirmed
  - [ ] Migration downtime estimated
  - [ ] Rollback SQL prepared (if needed)

- [ ] **Communication**
  - [ ] Deployment window scheduled
  - [ ] Stakeholders notified (24-48h advance)
  - [ ] Status page message prepared
  - [ ] On-call team informed

- [ ] **Infrastructure**
  - [ ] Server capacity sufficient
  - [ ] CDN caches ready to purge
  - [ ] DNS TTL reduced (if DNS changes)
  - [ ] Monitoring alerts configured

### Production Deployment Steps

#### Step 1: Pre-Deployment

```bash
# Create deployment branch from main
git checkout main
git pull origin main
git checkout -b deploy/v1.2.0

# Tag release
git tag -a v1.2.0 -m "Release version 1.2.0"
git push origin v1.2.0

# Notify team in Slack
# Post on status page (if maintenance window)
```

#### Step 2: Backup Database

```bash
# SSH to production server
ssh production-api-server

# Create timestamped backup
pg_dump $DATABASE_URL > /backups/prod_$(date +%Y%m%d_%H%M%S).sql

# Compress backup
gzip /backups/prod_$(date +%Y%m%d_%H%M%S).sql

# Upload to S3 for redundancy
aws s3 cp /backups/prod_*.sql.gz s3://iup-backups/database/

# Verify backup
ls -lh /backups/prod_*.sql.gz
aws s3 ls s3://iup-backups/database/ --human-readable
```

#### Step 3: Enable Maintenance Mode (if needed)

```bash
# For deployments with database migrations or significant changes
export MAINTENANCE_MODE=true
pm2 restart api

# Verify maintenance page showing
curl https://api.iup-golf.com
```

#### Step 4: Deploy Application

```bash
# Pull latest code
git fetch origin
git checkout main
git pull origin main

# Verify correct tag
git describe --tags

# Install dependencies
pnpm install --frozen-lockfile

# Run database migrations (if any)
pnpm --filter iup-golf-backend prisma migrate deploy

# Verify migration status
pnpm --filter iup-golf-backend prisma migrate status

# Generate Prisma Client
pnpm --filter iup-golf-backend prisma:generate

# Build application
pnpm --filter iup-golf-backend build

# Verify build artifacts
ls -la apps/api/dist/
```

#### Step 5: Restart Application

```bash
# If using PM2
pm2 restart api

# Or for zero-downtime deployment
pm2 reload api

# Watch logs for errors
pm2 logs api --lines 100 --err
```

#### Step 6: Disable Maintenance Mode

```bash
# Unset maintenance mode
unset MAINTENANCE_MODE

# Restart application
pm2 restart api

# Wait for application to stabilize
sleep 30
```

#### Step 7: Verify Deployment

```bash
# Health check
curl https://api.iup-golf.com/health

# Check version endpoint (if available)
curl https://api.iup-golf.com/version

# Test authentication
curl -X POST https://api.iup-golf.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Run smoke tests
./scripts/smoke-tests.sh production

# Check metrics
curl https://api.iup-golf.com/metrics | grep http_errors_total

# Verify no errors in Sentry (last 5 minutes)
```

#### Step 8: Post-Deployment Monitoring

```bash
# Monitor for 30 minutes after deployment
# Watch for:
# - Error rate spikes
# - Response time degradation
# - Memory/CPU usage
# - Database query performance

# If any issues, proceed to rollback
```

### Production Deployment Checklist

- [ ] Pre-deployment checklist completed
- [ ] Database backup created and verified
- [ ] Maintenance mode enabled (if needed)
- [ ] Code deployed successfully
- [ ] Database migrations applied (if any)
- [ ] Application built successfully
- [ ] Application restarted
- [ ] Maintenance mode disabled
- [ ] Health checks passing
- [ ] Smoke tests passing
- [ ] No errors in logs (first 5 minutes)
- [ ] Metrics within normal range
- [ ] Monitoring dashboards green
- [ ] Status page updated
- [ ] Team notified of successful deployment

---

## Rollback Procedures

### When to Rollback

Rollback immediately if:
- **Critical errors** in production logs
- **Error rate** > 5% within first 15 minutes
- **Response time** > 2x normal
- **Database issues** detected
- **User reports** of critical functionality broken
- **Data integrity** concerns

### Rollback Steps

#### Option 1: Quick Rollback (No Database Changes)

```bash
# SSH to production server
ssh production-api-server
cd /opt/iup-api

# Enable maintenance mode
export MAINTENANCE_MODE=true
pm2 restart api

# Revert to previous tag
git fetch --tags
git checkout v1.1.9  # Previous stable version

# Reinstall dependencies
pnpm install --frozen-lockfile

# Rebuild application
pnpm --filter iup-golf-backend build

# Restart application
pm2 restart api

# Disable maintenance mode
unset MAINTENANCE_MODE
pm2 restart api

# Verify rollback successful
curl https://api.iup-golf.com/health
pm2 logs api --lines 50
```

**Rollback Time:** 5-10 minutes

#### Option 2: Rollback with Database Migration Revert

```bash
# Enable maintenance mode
export MAINTENANCE_MODE=true
pm2 restart api

# Identify migration to rollback
pnpm --filter iup-golf-backend prisma migrate status

# Mark migration as rolled back
pnpm --filter iup-golf-backend prisma migrate resolve --rolled-back MIGRATION_NAME

# Or restore database from backup
psql $DATABASE_URL < /backups/prod_TIMESTAMP.sql

# Revert code
git checkout v1.1.9

# Reinstall dependencies
pnpm install --frozen-lockfile

# Rebuild application
pnpm --filter iup-golf-backend build

# Restart application
pm2 restart api

# Disable maintenance mode
unset MAINTENANCE_MODE
pm2 restart api

# Verify rollback
curl https://api.iup-golf.com/health
```

**Rollback Time:** 10-20 minutes

### Post-Rollback Actions

- [ ] Verify application stability
- [ ] Update status page
- [ ] Notify team and stakeholders
- [ ] Document rollback reason
- [ ] Schedule post-mortem
- [ ] Fix issues in develop branch
- [ ] Re-test in staging
- [ ] Reschedule production deployment

---

## Post-Deployment Verification

### Automated Verification

```bash
# Run smoke tests
pnpm test:smoke

# Run integration tests against production
ENVIRONMENT=production pnpm test:integration

# Check health endpoint
curl https://api.iup-golf.com/health

# Check metrics endpoint
curl https://api.iup-golf.com/metrics
```

### Manual Verification Checklist

#### Application Health
- [ ] Health endpoint returning 200
- [ ] No errors in application logs
- [ ] PM2 showing process as "online"
- [ ] Memory usage within normal range
- [ ] CPU usage within normal range

#### Database
- [ ] Migrations applied successfully
- [ ] Connection pool healthy
- [ ] Query performance normal
- [ ] No blocked queries

#### Critical User Flows
- [ ] User can register/login
- [ ] User can view dashboard
- [ ] Coach can view players
- [ ] Coach can create exercises
- [ ] Player can book sessions
- [ ] Player can view goals

#### External Integrations
- [ ] S3 uploads working
- [ ] Email delivery working
- [ ] Payment processing (if applicable)
- [ ] Third-party APIs responding

#### Performance
- [ ] Response time < 200ms (p95)
- [ ] Error rate < 0.1%
- [ ] Database query time < 100ms (p95)
- [ ] API requests/sec within capacity

#### Monitoring
- [ ] Sentry: No new critical errors
- [ ] Prometheus: All metrics green
- [ ] Grafana: Dashboards showing normal
- [ ] CloudWatch: No alarms triggered

---

## Deployment Strategies

### Blue-Green Deployment

```bash
# Deploy new version to "green" environment
pm2 start dist/server.js --name api-green --port 3002

# Test green environment
curl http://localhost:3002/health

# Switch load balancer to green
sudo vim /etc/nginx/sites-enabled/api
# Change upstream port from 3001 to 3002
sudo nginx -t
sudo systemctl reload nginx

# Monitor for issues
# If stable, stop blue environment
pm2 stop api-blue

# If issues, switch back to blue
sudo vim /etc/nginx/sites-enabled/api
# Change upstream port back to 3001
sudo nginx -t
sudo systemctl reload nginx
```

### Canary Deployment

```bash
# Deploy new version alongside old
pm2 start dist/server.js --name api-v2 --port 3002

# Configure load balancer for 10% traffic to new version
sudo vim /etc/nginx/sites-enabled/api
# Add weighted upstream
# upstream api {
#   server localhost:3001 weight=9;
#   server localhost:3002 weight=1;
# }
sudo nginx -t
sudo systemctl reload nginx

# Monitor metrics for both versions
# If stable, increase traffic to 50%, then 100%

# Once fully migrated, stop old version
pm2 stop api-v1
```

---

## Troubleshooting

### Issue: Build fails with "Out of memory"

**Solution:**
```bash
# Increase Node.js memory
NODE_OPTIONS="--max-old-space-size=4096" pnpm build
```

### Issue: Application won't start after deployment

**Solution:**
```bash
# Check logs
pm2 logs api --err

# Common causes:
# 1. Missing environment variables
env | grep -E "(DATABASE|REDIS|JWT)"

# 2. Port already in use
lsof -i :3001
kill -9 PID

# 3. Database not reachable
psql $DATABASE_URL -c "SELECT 1;"

# 4. Dependencies not installed
rm -rf node_modules
pnpm install --frozen-lockfile
```

### Issue: Database migration fails

**Solution:**
```bash
# Check migration status
pnpm prisma migrate status

# If migration partially applied
pnpm prisma migrate resolve --applied MIGRATION_NAME

# If migration failed
pnpm prisma migrate resolve --rolled-back MIGRATION_NAME

# Re-run migrations
pnpm prisma migrate deploy
```

### Issue: High memory usage after deployment

**Solution:**
```bash
# Restart application
pm2 restart api

# Set memory limit
pm2 delete api
pm2 start dist/server.js --name api --max-memory-restart 1G

# Monitor memory usage
pm2 monit

# If persists, investigate memory leak
node --inspect dist/server.js
```

---

## Deployment Metrics

### Key Performance Indicators

| Metric | Target | Measurement |
|--------|--------|-------------|
| Deployment Frequency | 2x per week | Git tags |
| Lead Time | < 1 day | Commit to production |
| Mean Time to Recovery (MTTR) | < 15 minutes | Incident logs |
| Change Failure Rate | < 5% | Rollback count |
| Deployment Success Rate | > 95% | Successful deployments |
| Automated Test Coverage | > 80% | Coverage reports |

---

## Emergency Contacts

- **DevOps Lead:** +47 XXX XX XXX
- **CTO:** +47 XXX XX XXX
- **Database Admin:** +47 XXX XX XXX
- **On-Call Engineer:** PagerDuty

---

## Related Documentation

- [Database Migration Runbook](./database-migration.md)
- [Incident Response Playbook](./incident-response.md)
- [Monitoring Guide](./monitoring.md)
- [CI/CD Pipeline](../../.github/workflows/ci.yml)

---

## Changelog

| Date | Author | Changes |
|------|--------|---------|
| 2025-12-23 | Anders K | Initial deployment guide |
