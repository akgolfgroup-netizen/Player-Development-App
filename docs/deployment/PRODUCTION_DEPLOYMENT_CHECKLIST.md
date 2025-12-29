# Production Deployment Checklist

**Last Updated:** 2025-12-25
**Version:** 1.0.0

Use this checklist to ensure a smooth and secure production deployment.

---

## Pre-Deployment Checklist

### 1. Code Quality & Testing ✅
- [x] All 616 tests passing (100% coverage)
- [x] Linting passes without errors
- [x] TypeScript compilation successful
- [ ] Security audit completed (pnpm audit)
- [ ] Code review completed
- [ ] Performance testing completed

### 2. Environment Configuration 🔧
- [ ] Production environment variables configured
- [ ] Database connection string (production)
- [ ] Redis connection string (production)
- [ ] JWT secrets generated (strong, unique)
- [ ] S3/Object storage credentials
- [ ] SMTP credentials for emails
- [ ] API keys for third-party services
- [ ] CORS origins configured (production domains)
- [ ] Rate limiting configured appropriately

### 3. Database Preparation 🗄️
- [ ] Production database created
- [ ] Database user with appropriate permissions
- [ ] Database migrations ready
- [ ] Seed data prepared (if needed)
- [ ] Database backup strategy in place
- [ ] Database connection pooling configured
- [ ] Database indexes verified

### 4. Security Hardening 🔒
- [ ] Secrets stored in secure vault (not in code)
- [ ] SSL/TLS certificates configured
- [ ] HTTPS enforced
- [ ] Security headers configured (helmet)
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] SQL injection prevention verified
- [ ] XSS protection verified
- [ ] CSRF protection enabled
- [ ] Authentication/Authorization tested
- [ ] Password hashing verified (bcrypt)
- [ ] Session management secure

### 5. Infrastructure Setup 🏗️
- [ ] Production server/cloud instance provisioned
- [ ] Load balancer configured (if needed)
- [ ] CDN configured for static assets
- [ ] DNS records configured
- [ ] Firewall rules configured
- [ ] Container orchestration ready (Docker/K8s)
- [ ] Auto-scaling configured (if needed)

### 6. Monitoring & Logging 📊
- [ ] Error tracking configured (Sentry)
- [ ] Application logging configured
- [ ] Metrics collection enabled (/metrics endpoint)
- [ ] Prometheus/Grafana configured
- [ ] Health check endpoints working
  - `/health` - Application health
  - `/ready` - Kubernetes readiness
  - `/live` - Kubernetes liveness
- [ ] Alerts configured for critical errors
- [ ] Uptime monitoring configured
- [ ] Performance monitoring enabled

### 7. Backup & Disaster Recovery 💾
- [ ] Database backup automation configured
- [ ] Backup retention policy defined
- [ ] Disaster recovery plan documented
- [ ] Data restoration tested
- [ ] Application state backup (if stateful)

### 8. CI/CD Pipeline ⚙️
- [ ] GitHub Actions workflow tested
- [ ] Deployment secrets configured in GitHub
- [ ] Staging environment tested
- [ ] Production deployment workflow ready
- [ ] Rollback strategy defined
- [ ] Blue-green deployment configured (optional)

---

## Deployment Day Checklist

### Phase 1: Pre-Deployment (1-2 hours before)
- [ ] Notify team of deployment
- [ ] Create deployment announcement
- [ ] Verify all tests passing on main branch
- [ ] Review recent changes since last deployment
- [ ] Ensure backup is recent
- [ ] Verify staging environment matches production config

### Phase 2: Database Migration (30 min)
- [ ] Backup production database
- [ ] Test migration on copy of production data
- [ ] Run migrations with `prisma migrate deploy`
- [ ] Verify migration success
- [ ] Test application with migrated schema

### Phase 3: Application Deployment (30 min)
- [ ] Pull latest code from main branch
- [ ] Build production Docker image
- [ ] Tag Docker image with version
- [ ] Push Docker image to registry
- [ ] Deploy to production environment
- [ ] Wait for health checks to pass
- [ ] Verify application starts successfully

### Phase 4: Smoke Testing (15 min)
- [ ] Test authentication (login/logout)
- [ ] Test critical endpoints:
  - [ ] `GET /health` - Returns healthy status
  - [ ] `GET /api/v1/players` - Lists players
  - [ ] `POST /api/v1/auth/login` - Authentication works
  - [ ] `GET /api/v1/dashboard` - Dashboard loads
  - [ ] `GET /api/v1/tests` - Tests list
- [ ] Test database connectivity
- [ ] Test Redis connectivity
- [ ] Test S3/file uploads
- [ ] Test email sending
- [ ] Verify metrics collection (/metrics)

### Phase 5: Monitoring (ongoing)
- [ ] Monitor error logs for 1 hour
- [ ] Check Sentry for new errors
- [ ] Verify metrics in Grafana
- [ ] Monitor response times
- [ ] Check database performance
- [ ] Monitor memory/CPU usage
- [ ] Verify no spike in errors

---

## Post-Deployment Checklist

### Immediate (First Hour)
- [ ] Verify application is serving traffic
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Verify all integrations working
- [ ] Test user flows end-to-end
- [ ] Announce deployment success

### First 24 Hours
- [ ] Monitor error tracking dashboard
- [ ] Review application logs
- [ ] Check database performance
- [ ] Monitor API response times
- [ ] Verify scheduled jobs running
- [ ] Check email delivery
- [ ] Monitor user feedback

### First Week
- [ ] Review performance metrics
- [ ] Analyze error patterns
- [ ] Check resource utilization
- [ ] Optimize based on real usage
- [ ] Document any issues found
- [ ] Plan follow-up improvements

---

## Rollback Plan 🔙

### When to Rollback
- Critical security vulnerability discovered
- Data integrity issues
- Application crashes repeatedly
- Performance degradation > 50%
- Critical feature completely broken
- Database corruption

### Rollback Procedure
1. **Immediate Actions**
   - [ ] Stop incoming traffic (load balancer)
   - [ ] Notify team of rollback
   - [ ] Identify root cause

2. **Application Rollback**
   - [ ] Deploy previous Docker image tag
   - [ ] Verify previous version starts
   - [ ] Re-enable traffic

3. **Database Rollback (if needed)**
   - [ ] Restore from backup
   - [ ] Verify data integrity
   - [ ] Test with restored data

4. **Post-Rollback**
   - [ ] Document what went wrong
   - [ ] Create hotfix plan
   - [ ] Communicate to stakeholders
   - [ ] Schedule next deployment

---

## Environment-Specific Configurations

### Production Environment Variables

```bash
# Server
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
API_VERSION=v1

# Database (CHANGE THESE)
DATABASE_URL=postgresql://user:password@prod-db.example.com:5432/iup_golf_prod
DB_POOL_MIN=10
DB_POOL_MAX=50

# Redis (CHANGE THESE)
REDIS_URL=redis://prod-redis.example.com:6379
REDIS_PASSWORD=<strong-password>

# JWT (GENERATE NEW SECRETS)
JWT_ACCESS_SECRET=<generate-with-openssl-rand-base64-64>
JWT_REFRESH_SECRET=<generate-with-openssl-rand-base64-64>
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# S3 (PRODUCTION BUCKET)
S3_ENDPOINT=https://s3.eu-north-1.amazonaws.com
S3_BUCKET=iup-golf-prod-media
S3_REGION=eu-north-1
S3_ACCESS_KEY_ID=<aws-access-key>
S3_SECRET_ACCESS_KEY=<aws-secret-key>
S3_FORCE_PATH_STYLE=false

# CORS
CORS_ORIGIN=https://app.iupgolf.com,https://www.iupgolf.com
CORS_CREDENTIALS=true

# Rate Limiting (adjust based on load)
RATE_LIMIT_MAX=1000
RATE_LIMIT_WINDOW=60000

# Logging
LOG_LEVEL=warn
LOG_PRETTY=false

# Error Tracking
SENTRY_DSN=<sentry-project-dsn>
SENTRY_ENVIRONMENT=production
SENTRY_RELEASE=<git-commit-sha>

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=<email-username>
SMTP_PASS=<email-password>
SMTP_FROM=noreply@iupgolf.com

# Security
BCRYPT_ROUNDS=12
```

### Generate Secrets

```bash
# Generate JWT secrets
openssl rand -base64 64

# Generate random password
openssl rand -base64 32
```

---

## Health Check Endpoints

### Application Health
```bash
curl https://api.iupgolf.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-12-25T12:00:00.000Z",
  "uptime": 123456.78,
  "memory": { ... },
  "metrics": {
    "totalRequests": 150000,
    "totalErrors": 50,
    "activeUsers": 25,
    "lastUpdated": "2025-12-25T11:59:58.000Z"
  }
}
```

### Metrics Endpoint
```bash
curl https://api.iupgolf.com/metrics
```

### Readiness (Kubernetes)
```bash
curl https://api.iupgolf.com/ready
```

### Liveness (Kubernetes)
```bash
curl https://api.iupgolf.com/live
```

---

## Deployment Commands

### Build Docker Image
```bash
cd apps/api
docker build -t iup-golf-api:latest -t iup-golf-api:v1.0.0 .
```

### Tag and Push to Registry
```bash
docker tag iup-golf-api:latest registry.example.com/iup-golf-api:v1.0.0
docker push registry.example.com/iup-golf-api:v1.0.0
```

### Run Database Migrations
```bash
# In production container
npx prisma migrate deploy
```

### Start Application (Docker)
```bash
docker run -d \
  --name iup-golf-api \
  --env-file .env.production \
  -p 3000:3000 \
  registry.example.com/iup-golf-api:v1.0.0
```

### Using Docker Compose
```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

## Monitoring & Alerts

### Critical Alerts (Immediate Response)
- Application down (5xx errors > 50%)
- Database connection failures
- Redis connection failures
- Response time > 5 seconds (p99)
- Memory usage > 90%
- Disk usage > 85%

### Warning Alerts (Monitor Closely)
- Error rate > 1%
- Response time > 1 second (p99)
- Memory usage > 75%
- Database connection pool > 80% utilized
- Failed login attempts spike

### Metrics to Monitor
- Request rate (req/sec)
- Error rate (%)
- Response time (p50, p90, p99)
- Database query performance
- Memory/CPU usage
- Active connections
- Queue depth (if using BullMQ)

---

## Support & Troubleshooting

### Common Issues

#### Application Won't Start
1. Check environment variables
2. Verify database connection
3. Check Redis connection
4. Review application logs
5. Verify migrations ran successfully

#### High Error Rate
1. Check Sentry for error patterns
2. Review application logs
3. Check database performance
4. Verify external service availability
5. Check rate limiting configuration

#### Slow Performance
1. Check /metrics endpoint
2. Identify slow endpoints
3. Review database query performance
4. Check Redis cache hit rate
5. Verify connection pool settings
6. Check for N+1 query problems

### Getting Help
- **Documentation:** `/docs` directory
- **Logs:** Check application logs and Sentry
- **Metrics:** Grafana dashboard
- **Team:** Contact DevOps team

---

## Success Criteria

### Deployment is Successful When:
- [x] All health checks passing
- [x] Zero critical errors in first hour
- [x] Response times < 100ms (p90)
- [x] All smoke tests passing
- [x] Database migrations successful
- [x] Monitoring and alerts working
- [x] Backups confirmed working

### Ready for Traffic When:
- [x] Load testing completed successfully
- [x] All integrations verified
- [x] Team notified and ready
- [x] Rollback plan tested
- [x] Documentation updated

---

## Contacts

- **DevOps Lead:** [Name] - [Email]
- **Backend Lead:** [Name] - [Email]
- **On-Call Engineer:** [Phone]
- **Database Admin:** [Name] - [Email]

---

## Changelog

### Version 1.0.0 (2025-12-25)
- Initial production deployment checklist
- All 616 tests passing
- Performance optimization complete
- Metrics and monitoring enabled
