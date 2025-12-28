# IUP Golf - Demo Environment

This document describes the demo environment setup, URLs, credentials, and procedures for internal testing and demonstrations.

## Staging URLs

| Service | URL |
|---------|-----|
| API | https://iupgolf-demo-api.up.railway.app |
| Web | https://iupgolf-demo-web.up.railway.app |
| API Health | https://iupgolf-demo-api.up.railway.app/health |

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Player | player@demo.com | player123 |
| Coach | coach@demo.com | coach123 |
| Admin | admin@demo.com | admin123 |

## Demo Flows

### 1. Player Dashboard Flow
1. Login as player@demo.com
2. View dashboard with:
   - Progress widget
   - Recent badges
   - Active goals
   - Upcoming sessions
3. Navigate to Goals → View goal details
4. Navigate to Badges → View earned badges
5. Navigate to Training Plan → View sessions

### 2. Coach Dashboard Flow
1. Login as coach@demo.com
2. View coach dashboard with:
   - Player overview
   - Session schedule
   - Test results
3. Select a player → View player detail
4. Create/edit training plan
5. Schedule a session

### 3. Admin Flow
1. Login as admin@demo.com
2. Access admin panel
3. View system overview
4. Manage users/tenants

## Pre-Demo Checklist

- [ ] Run smoke test: `pnpm demo:smoke`
- [ ] Verify API health endpoint responds
- [ ] Login with each demo account works
- [ ] Dashboard loads without errors
- [ ] Check Railway dashboard for service health
- [ ] Verify database has demo data seeded

## Running Smoke Tests

```bash
# Run against staging
pnpm demo:smoke

# Run against local dev
pnpm demo:smoke:local

# Run with verbose output
./scripts/demo-smoke.sh --verbose

# Run against custom URL
./scripts/demo-smoke.sh --url https://custom-api.example.com
```

## Hotfix Process

If a critical issue is found during demo:

### Quick Fix (< 30 min)
1. Create fix branch from `demo`: `git checkout -b hotfix/issue-name demo`
2. Apply fix
3. Test locally with `pnpm demo:smoke:local`
4. Merge to `demo` branch
5. Push to trigger staging deploy
6. Verify fix in staging

### Rollback to Previous Tag
1. Check current tag: `git describe --tags`
2. Rollback: `git checkout demo-v1`
3. Force push (if needed): `git push origin demo --force`

## Troubleshooting

### API Not Responding
1. Check Railway dashboard for API service status
2. Check logs: Railway Dashboard → API Service → Logs
3. Verify DATABASE_URL is correctly configured
4. Check Redis connection if caching issues

### Login Not Working
1. Verify demo seed data exists in database
2. Check JWT_SECRET is configured
3. Test with curl:
   ```bash
   curl -X POST https://iupgolf-demo-api.up.railway.app/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"player@demo.com","password":"player123"}'
   ```

### Database Issues
1. Check PostgreSQL service in Railway
2. Verify migrations are applied
3. Re-seed if needed: `pnpm --filter iup-golf-backend prisma:seed`

### CORS Errors
1. Verify ALLOWED_ORIGINS includes the web URL
2. Check for trailing slashes in URLs
3. Verify web is using correct API_URL

## Environment Variables

The staging environment should have these configured in Railway:

```
# Required
DATABASE_URL=postgresql://...
NODE_ENV=staging
PORT=3000
JWT_SECRET=<secret>
JWT_REFRESH_SECRET=<secret>
ALLOWED_ORIGINS=https://iupgolf-demo-web.up.railway.app

# Optional
REDIS_URL=redis://...
SENTRY_DSN=<dsn>
```

## Git Workflow

```
main (production)
  │
  ├── develop (development)
  │
  └── demo (staging/demo)
        │
        └── demo-v1 (tag: stable demo version)
```

### Updating Demo Branch
```bash
# Sync demo with latest main
git checkout demo
git merge main
git push origin demo

# Create new demo tag after significant updates
git tag -a demo-v2 -m "Demo v2 - description of changes"
git push origin demo-v2
```

## Railway Dashboard

- URL: https://railway.app/dashboard
- Project: IUP Golf
- Services: API, Web, PostgreSQL, Redis

## Contact

For demo environment issues, contact:
- Tech Lead: [Name]
- DevOps: [Name]
