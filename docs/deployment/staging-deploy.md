# Staging Deploy Runbook

Step-by-step guide for deploying to staging environment.

---

## Prerequisites

- [ ] Access to staging server/platform
- [ ] Environment variables configured (see `staging-env.md`)
- [ ] Database migrations ready
- [ ] S3 bucket exists and accessible

---

## 1. Pre-Deploy Checks

```bash
# Verify local builds pass
cd apps/web && DISABLE_ESLINT_PLUGIN=true npm run build
cd apps/api && npm run build

# Check for uncommitted changes
git status

# Verify you're on correct branch
git branch --show-current
```

---

## 2. Deploy API (apps/api)

### 2.1 Build

```bash
cd apps/api
npm ci --production
npm run build
```

### 2.2 Database Migration

```bash
# Run migrations (staging DB)
DATABASE_URL=$STAGING_DB_URL npx prisma migrate deploy

# Verify migration status
DATABASE_URL=$STAGING_DB_URL npx prisma migrate status
```

### 2.3 Deploy

**Docker:**
```bash
docker build -t akgolf-api:staging .
docker push registry.example.com/akgolf-api:staging
# Deploy to container platform
```

**Direct:**
```bash
# Copy dist/ and node_modules to server
rsync -avz dist/ staging-server:/app/api/dist/
rsync -avz node_modules/ staging-server:/app/api/node_modules/

# Restart service
ssh staging-server "sudo systemctl restart akgolf-api"
```

### 2.4 Verify API Health

```bash
curl -s https://api-staging.akgolf.no/health | jq
# Expected: {"status":"ok","timestamp":"..."}

curl -s https://api-staging.akgolf.no/ready | jq
# Expected: {"status":"ok","database":"connected","redis":"connected"}
```

---

## 3. Deploy Web (apps/web)

### 3.1 Build with Staging Env

```bash
cd apps/web

# Set staging environment
export REACT_APP_API_URL=https://api-staging.akgolf.no/api/v1

# Build
DISABLE_ESLINT_PLUGIN=true npm run build
```

### 3.2 Verify Build Artifacts

```bash
# Check CSS includes tokens
grep -l "var(--ak-primary)" build/static/css/*.css

# Check JS bundle size (should be < 500KB gzipped for main)
ls -lh build/static/js/main.*.js
```

### 3.3 Deploy to CDN/Static Host

**Vercel/Netlify:**
```bash
vercel --prod --env-file .env.staging
# or
netlify deploy --prod --dir=build
```

**S3 + CloudFront:**
```bash
aws s3 sync build/ s3://akgolf-staging-web/ --delete
aws cloudfront create-invalidation --distribution-id $CF_DIST_ID --paths "/*"
```

**Nginx:**
```bash
rsync -avz build/ staging-server:/var/www/akgolf-staging/
```

---

## 4. Post-Deploy Verification

### 4.1 Smoke Test

Run through the staging smoke test checklist (see `release-smoke-test.md`):

| Route | Expected |
|-------|----------|
| `/` | Dashboard loads, no console errors |
| `/login` | Login form, auth works |
| `/kalender` | Calendar renders |
| `/stats` | Stats page with charts |
| `/videos` | Video library loads |
| Theme toggle | Light/dark/system all work |

### 4.2 API Connection

```bash
# From browser console on staging site:
fetch('/api/v1/health').then(r => r.json()).then(console.log)
```

### 4.3 Check for Errors

- Open browser DevTools → Console (filter for errors)
- Check Network tab for failed requests
- Verify no 404s for CSS/JS assets

---

## 5. CDN Cache Invalidation

### CloudFront
```bash
aws cloudfront create-invalidation \
  --distribution-id $DISTRIBUTION_ID \
  --paths "/*"
```

### Cloudflare
```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/purge_cache" \
  -H "Authorization: Bearer $CF_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'
```

### Vercel
Automatic on deploy.

### Manual Browser
```
Ctrl+Shift+R (hard refresh)
```

---

## 6. Rollback Procedure

### 6.1 Identify Previous Version

```bash
# Check deployment history
git log --oneline -10

# Or check container registry
docker images akgolf-api --format "{{.Tag}} {{.CreatedAt}}"
```

### 6.2 Rollback API

**Docker:**
```bash
docker pull registry.example.com/akgolf-api:previous-tag
# Redeploy with previous tag
```

**Direct:**
```bash
# Restore from backup
ssh staging-server "cp -r /app/api/dist.backup /app/api/dist"
ssh staging-server "sudo systemctl restart akgolf-api"
```

### 6.3 Rollback Web

**S3:**
```bash
# Restore from previous build
aws s3 sync s3://akgolf-staging-web-backup/ s3://akgolf-staging-web/ --delete
aws cloudfront create-invalidation --distribution-id $CF_DIST_ID --paths "/*"
```

**Vercel:**
```bash
vercel rollback
```

### 6.4 Database Rollback (if needed)

```bash
# Restore from backup (CAUTION)
DATABASE_URL=$STAGING_DB_URL psql < backup.sql
```

---

## 7. Common Issues

| Issue | Solution |
|-------|----------|
| CSS missing/broken | Check Tailwind content paths, rebuild |
| API 502/503 | Check API health endpoint, logs |
| CORS errors | Verify `CORS_ORIGIN` includes frontend URL |
| Auth fails | Check JWT secrets match, token expiry |
| Videos don't load | Check S3 credentials, CORS on bucket |
| Dark mode broken | Clear localStorage, check CSS variables |

---

## 8. Monitoring

After deploy, monitor for 15-30 minutes:

- [ ] No spike in error rates
- [ ] Response times normal
- [ ] No memory leaks (API)
- [ ] No console errors (Web)

---

## Contact

- **On-call:** [team Slack channel]
- **Escalation:** [lead developer]
