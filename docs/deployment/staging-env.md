# Staging Environment Variables

This document lists all required and optional environment variables for staging deployment.

---

## apps/web (Frontend)

| Variable | Required | Default | Example | Notes |
|----------|----------|---------|---------|-------|
| `REACT_APP_API_URL` | **Yes** | `http://localhost:4000/api/v1` | `https://api-staging.akgolf.no/api/v1` | Must include `/api/v1` suffix |
| `REACT_APP_API_BASE_URL` | No | `http://localhost:3000/api/v1` | `https://api-staging.akgolf.no/api/v1` | Legacy - some widgets use this |
| `REACT_APP_VAPID_PUBLIC_KEY` | No | _(empty)_ | `BNxr...` | For push notifications |
| `NODE_ENV` | Auto | `production` | `production` | Set by build process |
| `PUBLIC_URL` | No | `/` | `https://staging.akgolf.no` | For service worker |

### Build-time vs Runtime

All `REACT_APP_*` variables are **baked into the build** at build time. You cannot change them after build without rebuilding.

---

## apps/api (Backend)

### Required Variables

| Variable | Example | Notes |
|----------|---------|-------|
| `NODE_ENV` | `production` | `development`, `production`, or `test` |
| `DATABASE_URL` | `postgresql://user:pass@host:5432/db` | Postgres connection string |
| `JWT_ACCESS_SECRET` | `your-32-char-secret-here` | Min 32 characters |
| `JWT_REFRESH_SECRET` | `another-32-char-secret` | Min 32 characters |
| `S3_ENDPOINT` | `https://s3.eu-north-1.amazonaws.com` | S3-compatible endpoint |
| `S3_BUCKET` | `akgolf-staging-videos` | Bucket name |
| `S3_ACCESS_KEY_ID` | `AKIA...` | S3 credentials |
| `S3_SECRET_ACCESS_KEY` | `wJal...` | S3 credentials |
| `DEFAULT_TENANT_ID` | `00000000-0000-0000-0000-000000000001` | UUID |

### Optional Variables

| Variable | Default | Example | Notes |
|----------|---------|---------|-------|
| `PORT` | `3000` | `4000` | API server port |
| `HOST` | `0.0.0.0` | `0.0.0.0` | Bind address |
| `API_VERSION` | `v1` | `v1` | API version prefix |
| `REDIS_HOST` | `localhost` | `redis.internal` | Redis host |
| `REDIS_PORT` | `6379` | `6379` | Redis port |
| `REDIS_PASSWORD` | _(empty)_ | `secret` | Redis password |
| `REDIS_URL` | _(computed)_ | `redis://:pass@host:6379/0` | Full Redis URL |
| `CORS_ORIGIN` | `http://localhost:3001` | `https://staging.akgolf.no` | Comma-separated origins |
| `CORS_CREDENTIALS` | `true` | `true` | Allow credentials |
| `RATE_LIMIT_MAX` | `100` | `200` | Requests per window |
| `RATE_LIMIT_WINDOW` | `60000` | `60000` | Window in ms |
| `LOG_LEVEL` | `info` | `debug` | Logging level |
| `LOG_PRETTY` | `true` | `false` | Pretty print logs |
| `S3_REGION` | `eu-north-1` | `eu-north-1` | S3 region |
| `S3_FORCE_PATH_STYLE` | `false` | `true` | For MinIO |
| `DB_POOL_MIN` | `2` | `2` | Min DB connections |
| `DB_POOL_MAX` | `10` | `20` | Max DB connections |
| `DEFAULT_TENANT_NAME` | `AK Golf Academy` | `AK Golf Academy` | Tenant name |
| `DEFAULT_TENANT_SLUG` | `ak-golf` | `ak-golf` | Tenant slug |
| `GOOGLE_CLIENT_ID` | _(empty)_ | `xxx.apps.googleusercontent.com` | For Google Calendar |
| `GOOGLE_CLIENT_SECRET` | _(empty)_ | `GOCSPX-...` | For Google Calendar |
| `GOOGLE_REDIRECT_URI` | _(empty)_ | `https://api.akgolf.no/auth/google/callback` | OAuth redirect |

---

## Staging-Specific Checklist

- [ ] `REACT_APP_API_URL` points to staging API (not localhost)
- [ ] `CORS_ORIGIN` includes staging frontend URL
- [ ] `S3_BUCKET` uses staging bucket (not prod)
- [ ] `DATABASE_URL` uses staging database (not prod)
- [ ] JWT secrets are unique (not same as prod)
- [ ] `LOG_LEVEL` set to `debug` for troubleshooting

---

## Example .env.staging (web)

```bash
REACT_APP_API_URL=https://api-staging.akgolf.no/api/v1
REACT_APP_API_BASE_URL=https://api-staging.akgolf.no/api/v1
```

## Example .env.staging (api)

```bash
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://akgolf:password@staging-db.internal:5432/akgolf_staging
JWT_ACCESS_SECRET=staging-access-secret-32-chars-min
JWT_REFRESH_SECRET=staging-refresh-secret-32-chars-min
S3_ENDPOINT=https://s3.eu-north-1.amazonaws.com
S3_BUCKET=akgolf-staging-videos
S3_ACCESS_KEY_ID=AKIA...
S3_SECRET_ACCESS_KEY=...
CORS_ORIGIN=https://staging.akgolf.no
DEFAULT_TENANT_ID=00000000-0000-0000-0000-000000000001
LOG_LEVEL=debug
```
