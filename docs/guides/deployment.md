# Deployment Guide

> Deploy IUP Golf Platform to staging and production

## Environments

| Environment | Branch | Auto-Deploy | URL |
|-------------|--------|-------------|-----|
| Development | feature/* | No | localhost:3000 |
| Staging | develop | Yes (CI/CD) | staging.iupgolf.com |
| Production | main | Manual | app.iupgolf.com |

## Prerequisites

- Docker and Docker Compose
- Access to container registry
- Database credentials (PostgreSQL 15+)
- S3 bucket for file storage
- Redis instance for caching

## Infrastructure

```
┌─────────────────────────────────────────────┐
│                Load Balancer                │
└─────────────────┬───────────────────────────┘
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
   ┌─────────┐         ┌─────────┐
   │   API   │         │   API   │   (2+ replicas)
   │ Server  │         │ Server  │
   └────┬────┘         └────┬────┘
        │                   │
        └─────────┬─────────┘
                  │
   ┌──────────────┼──────────────┐
   ▼              ▼              ▼
┌──────┐    ┌──────────┐    ┌──────┐
│  DB  │    │  Redis   │    │  S3  │
└──────┘    └──────────┘    └──────┘
```

## Deployment Steps

### 1. Build Docker Images

```bash
# Backend
cd apps/api
docker build -t iup-api:latest .

# Frontend
cd apps/web
docker build -t iup-web:latest .
```

### 2. Push to Registry

```bash
docker tag iup-api:latest registry.example.com/iup-api:v1.0.0
docker push registry.example.com/iup-api:v1.0.0

docker tag iup-web:latest registry.example.com/iup-web:v1.0.0
docker push registry.example.com/iup-web:v1.0.0
```

### 3. Run Database Migrations

```bash
# Connect to production database
DATABASE_URL="postgresql://..." npx prisma migrate deploy
```

### 4. Deploy

```bash
# Using docker-compose
docker-compose -f docker-compose.prod.yml up -d

# Or using Kubernetes
kubectl apply -f k8s/
```

## Environment Variables

### Production Backend

```bash
# Required
DATABASE_URL=postgresql://user:pass@host:5432/iup_golf
JWT_SECRET=<long-random-string>
NODE_ENV=production

# Optional
REDIS_URL=redis://host:6379
S3_BUCKET=iup-golf-prod
S3_REGION=eu-north-1
SENTRY_DSN=https://...
```

### Production Frontend

```bash
VITE_API_URL=https://api.iupgolf.com
VITE_SENTRY_DSN=https://...
```

## Health Checks

### API Health

```bash
curl https://api.iupgolf.com/health
# {"status":"ok","timestamp":"2025-12-25T12:00:00Z"}
```

### Database Health

```bash
curl https://api.iupgolf.com/health/db
# {"status":"ok","latency_ms":5}
```

## Rollback

```bash
# Docker Compose
docker-compose -f docker-compose.prod.yml down
docker tag registry.example.com/iup-api:v0.9.0 iup-api:latest
docker-compose -f docker-compose.prod.yml up -d

# Kubernetes
kubectl rollout undo deployment/iup-api
```

## Monitoring

### Logs

```bash
# Docker
docker logs -f iup-api

# Kubernetes
kubectl logs -f deployment/iup-api
```

### Metrics

Prometheus metrics available at `/metrics`:

- `http_request_duration_seconds`
- `http_requests_total`
- `database_query_duration_seconds`

### Alerts

Configure alerts for:
- Error rate > 1%
- Response time > 500ms
- Database connection failures
- Memory usage > 80%

## SSL/TLS

Use Let's Encrypt with auto-renewal:

```bash
certbot certonly --webroot -w /var/www/html -d api.iupgolf.com
```

## Database Backups

```bash
# Daily backup
pg_dump $DATABASE_URL | gzip > backup-$(date +%Y%m%d).sql.gz

# Upload to S3
aws s3 cp backup-*.sql.gz s3://iup-golf-backups/
```

## Scaling

### Horizontal Scaling

```bash
# Docker Compose
docker-compose -f docker-compose.prod.yml up -d --scale api=3

# Kubernetes
kubectl scale deployment/iup-api --replicas=3
```

### Database Scaling

1. Add read replicas for query load
2. Increase instance size for write load
3. Consider sharding for large tenants

---

See also:
- [Development Guide](./development.md)
- [Architecture Overview](../architecture/overview.md)
