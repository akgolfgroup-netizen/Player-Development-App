# Deployment Guide - IUP Golf Training Platform

## Quick Start - Staging Deployment

### Prerequisites
- Node.js 18+ installed
- pnpm 8+ installed (`npm install -g pnpm`)
- Docker Desktop running (for database)
- Git configured

### Automated Deployment

```bash
# 1. Make script executable
chmod +x scripts/deploy-staging.sh

# 2. Run deployment script
./scripts/deploy-staging.sh
```

The script will:
- ✅ Check prerequisites
- ✅ Install dependencies
- ✅ Build backend & frontend
- ✅ Prompt for database migration
- ✅ Start Docker services
- ✅ Run health checks

---

## Manual Deployment Steps

### 1. Environment Setup

**Backend (.env.staging):**
```bash
cd apps/api
cp .env.staging.template .env.staging
# Edit .env.staging with actual credentials
```

**Frontend (.env):**
```bash
cd apps/web
cat > .env << EOF
REACT_APP_API_BASE_URL=http://localhost:3000/api/v1
# For remote deployment:
# REACT_APP_API_BASE_URL=https://api-staging.akgolf.com/api/v1
EOF
```

### 2. Install Dependencies

```bash
# From project root
pnpm install
```

### 3. Database Setup

#### Option A: Local Docker (Development/Staging)
```bash
cd apps/api/docker
docker-compose up -d
```

Wait for PostgreSQL to be healthy (~10 seconds).

#### Option B: Remote Database (Production)
Update `DATABASE_URL` in `.env.staging` with remote connection string:
```
postgresql://user:password@db.example.com:5432/ak_golf_iup
```

### 4. Run Database Migration

```bash
cd apps/api

# CRITICAL: Run this migration for ModificationRequest model
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# Optional: Seed database with sample data
npx prisma db seed
```

### 5. Build Applications

**Backend:**
```bash
cd apps/api
pnpm run build
```

**Frontend:**
```bash
cd apps/web
pnpm run build
```

### 6. Start Services

**Development Mode:**
```bash
# Terminal 1 - Backend
cd apps/api
pnpm run dev

# Terminal 2 - Frontend
cd apps/web
pnpm run start
```

**Production Mode:**
```bash
# Backend
cd apps/api
pnpm run start

# Frontend (serve build folder)
cd apps/web
npx serve -s build -l 3001
```

### 7. Verify Deployment

**Health Checks:**
```bash
# API health
curl http://localhost:3000/health

# API documentation
open http://localhost:3000/documentation

# Frontend
open http://localhost:3001
```

**Test Login:**
1. Navigate to http://localhost:3001/login
2. Create admin user or use existing credentials
3. Test new features:
   - `/progress` - Progress dashboard
   - `/achievements` - Achievements
   - `/coach/modification-requests` - Coach dashboard (coach role)

---

## Environment Variables Reference

### Critical Variables (Must Configure)

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection | `postgresql://user:pass@host:5432/db` |
| `JWT_ACCESS_SECRET` | JWT signing secret (min 32 chars) | Generate with: `openssl rand -base64 32` |
| `JWT_REFRESH_SECRET` | Refresh token secret (min 32 chars) | Generate with: `openssl rand -base64 32` |

### Optional Variables (Enhanced Features)

| Variable | Description | Default |
|----------|-------------|---------|
| `SMTP_HOST` | Email server hostname | Falls back to console logging |
| `SMTP_USER` | Email username | - |
| `SMTP_PASS` | Email password/API key | - |
| `FRONTEND_URL` | Frontend base URL for emails | `http://localhost:3001` |
| `S3_ENDPOINT` | S3-compatible storage endpoint | Uses local MinIO |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |

### Full Variable List
See `apps/api/.env.staging.template` for complete reference.

---

## Email Notifications Setup

### Gmail (Development/Testing)

1. Enable 2FA on Gmail account
2. Generate app-specific password: https://myaccount.google.com/apppasswords
3. Configure in `.env`:
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
SMTP_FROM_EMAIL=noreply@akgolf.com
SMTP_FROM_NAME=TIER Golf IUP
FRONTEND_URL=http://localhost:3001
```

### SendGrid (Production Recommended)

1. Create SendGrid account
2. Generate API key
3. Configure:
```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=YOUR_SENDGRID_API_KEY
```

### AWS SES (Enterprise)

1. Verify domain in AWS SES
2. Create SMTP credentials
3. Configure with provided credentials

**Note:** If SMTP not configured, emails will log to console (development mode).

---

## Database Migration Troubleshooting

### Issue: "Can't reach database server"

**Solutions:**
1. Check Docker is running:
```bash
docker ps | grep postgres
```

2. Verify DATABASE_URL:
```bash
cat apps/api/.env | grep DATABASE_URL
```

3. Test connection:
```bash
cd apps/api
npx prisma db execute --stdin <<< "SELECT 1;"
```

4. Check Docker logs:
```bash
cd apps/api/docker
docker-compose logs postgres
```

5. Restart Docker services:
```bash
docker-compose down
docker-compose up -d
```

### Issue: Migration already applied

```bash
# Check migration status
npx prisma migrate status

# If needed, mark as applied
npx prisma migrate resolve --applied add_modification_request_model

# Regenerate client
npx prisma generate
```

---

## Production Deployment Checklist

### Pre-Deployment
- [ ] Update JWT secrets (use `openssl rand -base64 32`)
- [ ] Configure production DATABASE_URL
- [ ] Set up SMTP/email service
- [ ] Configure S3 or object storage
- [ ] Set NODE_ENV=production
- [ ] Disable LOG_PRETTY (set to false)
- [ ] Update CORS_ORIGIN with production domains
- [ ] Configure SSL certificates
- [ ] Set up monitoring (Sentry, etc.)

### Security
- [ ] Review and rotate all secrets
- [ ] Enable rate limiting
- [ ] Configure firewall rules
- [ ] Set up backup strategy
- [ ] Enable audit logging
- [ ] Review CORS settings
- [ ] Implement DDoS protection

### Database
- [ ] Run migrations on production DB
- [ ] Configure automated backups
- [ ] Set up read replicas (if needed)
- [ ] Enable connection pooling
- [ ] Monitor query performance

### Monitoring
- [ ] Set up uptime monitoring
- [ ] Configure error tracking (Sentry)
- [ ] Enable performance monitoring (APM)
- [ ] Set up log aggregation
- [ ] Configure alerts

---

## Docker Services

### Services Included
- **PostgreSQL 14** - Main database (port 5432)
- **Redis 7** - Caching & sessions (port 6379)
- **MinIO** - S3-compatible storage (ports 9000, 9001)

### Manage Services

```bash
cd apps/api/docker

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Reset (delete data)
docker-compose down -v
```

---

## Common Tasks

### Create Admin User
```bash
cd apps/api
npx prisma db seed
# Or use API endpoint POST /api/v1/auth/register
```

### Backup Database
```bash
docker exec iup-golf-postgres pg_dump -U postgres ak_golf_iup > backup.sql
```

### Restore Database
```bash
docker exec -i iup-golf-postgres psql -U postgres ak_golf_iup < backup.sql
```

### View API Logs
```bash
cd apps/api
tail -f logs/app.log
# Or use pnpm run dev for live logs
```

### Test Email Notifications
1. Configure SMTP in .env
2. Create a plan and request modifications
3. Check console or inbox for email

---

## Platform URLs (Default)

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3001 | React application |
| Backend API | http://localhost:3000 | Fastify REST API |
| API Docs | http://localhost:3000/documentation | Swagger UI |
| PostgreSQL | localhost:5432 | Database |
| Redis | localhost:6379 | Cache |
| MinIO Console | http://localhost:9001 | Object storage UI |
| MinIO API | http://localhost:9000 | S3-compatible API |

**Default Credentials:**
- MinIO: minioadmin / minioadmin
- PostgreSQL: postgres / postgres

---

## Performance Optimization

### Production Build
```bash
# Backend - Uses SWC for fast compilation
cd apps/api
pnpm run build

# Frontend - Optimized React build
cd apps/web
pnpm run build
```

### Database Optimization
```bash
# Create indexes (already in Prisma schema)
npx prisma db push

# Analyze query performance
npx prisma studio
# Enable "Query Preview" for slow queries
```

### Caching Strategy
- Redis caching enabled for analytics
- Session storage in Redis
- Client-side caching with React Query (recommended)

---

## Troubleshooting

### Frontend Build Fails
```bash
cd apps/web
rm -rf node_modules package-lock.json
pnpm install
pnpm run build
```

### Backend Build Fails
```bash
cd apps/api
rm -rf node_modules dist
pnpm install
pnpm run build
```

### Port Already in Use
```bash
# Find process on port 3000
lsof -i :3000
# Kill process
kill -9 <PID>
```

### Docker Issues
```bash
# Restart Docker Desktop
# Then:
cd apps/api/docker
docker-compose down
docker-compose up -d
```

---

## Support

- **Documentation:** See `/docs` folder
- **API Spec:** http://localhost:3000/documentation
- **Issues:** Check TROUBLESHOOTING.md
- **Audit:** See COMPLETE_PLATFORM_AUDIT_2025-12-16.md

---

**Last Updated:** December 16, 2025
**Platform Version:** 1.0.0-staging
