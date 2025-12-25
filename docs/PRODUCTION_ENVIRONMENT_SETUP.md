# Production Environment Setup Guide

**Last Updated:** 2025-12-25
**Target:** Production deployment on cloud infrastructure

This guide walks you through setting up the production environment for the IUP Golf Academy API.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Infrastructure Setup](#infrastructure-setup)
3. [Database Configuration](#database-configuration)
4. [Redis Configuration](#redis-configuration)
5. [Environment Variables](#environment-variables)
6. [Secrets Management](#secrets-management)
7. [SSL/TLS Certificates](#ssltls-certificates)
8. [Monitoring Setup](#monitoring-setup)
9. [Deployment Options](#deployment-options)

---

## Prerequisites

### Required Accounts & Services
- [ ] Cloud provider account (AWS, GCP, Azure, or DigitalOcean)
- [ ] PostgreSQL database (managed service recommended)
- [ ] Redis instance (managed service recommended)
- [ ] S3-compatible object storage
- [ ] Email service (SMTP or SendGrid)
- [ ] Domain name and DNS access
- [ ] SSL certificate (Let's Encrypt or cloud provider)
- [ ] Error tracking (Sentry account)
- [ ] Container registry (Docker Hub, AWS ECR, or GCP Container Registry)

### Required Tools
```bash
# Install required CLIs
brew install docker
brew install kubernetes-cli  # if using K8s
brew install awscli          # if using AWS
brew install postgresql      # for database management
brew install redis           # for Redis CLI

# Verify installations
docker --version
kubectl version --client
aws --version
psql --version
redis-cli --version
```

---

## Infrastructure Setup

### Option 1: AWS (Recommended)

#### 1.1 Create VPC and Security Groups
```bash
# Create VPC
aws ec2 create-vpc --cidr-block 10.0.0.0/16 --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=iup-golf-vpc}]'

# Create security groups
aws ec2 create-security-group \
  --group-name iup-golf-api-sg \
  --description "Security group for IUP Golf API" \
  --vpc-id <vpc-id>

# Allow HTTPS (443)
aws ec2 authorize-security-group-ingress \
  --group-id <sg-id> \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0

# Allow HTTP (80) - redirect to HTTPS
aws ec2 authorize-security-group-ingress \
  --group-id <sg-id> \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0
```

#### 1.2 Provision RDS PostgreSQL
```bash
aws rds create-db-instance \
  --db-instance-identifier iup-golf-prod-db \
  --db-instance-class db.t3.medium \
  --engine postgres \
  --engine-version 15.5 \
  --master-username iupgolf \
  --master-user-password <strong-password> \
  --allocated-storage 100 \
  --storage-type gp3 \
  --vpc-security-group-ids <sg-id> \
  --db-name iup_golf_prod \
  --backup-retention-period 7 \
  --preferred-backup-window "03:00-04:00" \
  --preferred-maintenance-window "mon:04:00-mon:05:00" \
  --storage-encrypted \
  --enable-cloudwatch-logs-exports postgresql \
  --deletion-protection
```

#### 1.3 Provision ElastiCache Redis
```bash
aws elasticache create-cache-cluster \
  --cache-cluster-id iup-golf-redis \
  --engine redis \
  --cache-node-type cache.t3.medium \
  --num-cache-nodes 1 \
  --engine-version 7.0 \
  --security-group-ids <sg-id> \
  --snapshot-retention-limit 5 \
  --snapshot-window "03:00-05:00"
```

#### 1.4 Create S3 Bucket
```bash
aws s3api create-bucket \
  --bucket iup-golf-prod-media \
  --region eu-north-1 \
  --create-bucket-configuration LocationConstraint=eu-north-1

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket iup-golf-prod-media \
  --versioning-configuration Status=Enabled

# Configure lifecycle policy
aws s3api put-bucket-lifecycle-configuration \
  --bucket iup-golf-prod-media \
  --lifecycle-configuration file://s3-lifecycle.json
```

#### 1.5 Deploy with ECS Fargate
```bash
# Create ECR repository
aws ecr create-repository --repository-name iup-golf-api

# Build and push Docker image
docker build -t iup-golf-api:latest .
docker tag iup-golf-api:latest <account-id>.dkr.ecr.eu-north-1.amazonaws.com/iup-golf-api:latest
aws ecr get-login-password --region eu-north-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.eu-north-1.amazonaws.com
docker push <account-id>.dkr.ecr.eu-north-1.amazonaws.com/iup-golf-api:latest

# Create ECS cluster
aws ecs create-cluster --cluster-name iup-golf-prod

# Create task definition (see task-definition.json)
aws ecs register-task-definition --cli-input-json file://task-definition.json

# Create service
aws ecs create-service \
  --cluster iup-golf-prod \
  --service-name iup-golf-api \
  --task-definition iup-golf-api:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[<subnet-id>],securityGroups=[<sg-id>],assignPublicIp=ENABLED}"
```

### Option 2: Google Cloud Platform

```bash
# Enable required APIs
gcloud services enable compute.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable redis.googleapis.com
gcloud services enable run.googleapis.com

# Create Cloud SQL PostgreSQL instance
gcloud sql instances create iup-golf-db \
  --database-version=POSTGRES_15 \
  --tier=db-custom-2-7680 \
  --region=europe-north1 \
  --backup

# Create Redis instance
gcloud redis instances create iup-golf-redis \
  --size=1 \
  --region=europe-north1 \
  --redis-version=redis_7_0

# Deploy to Cloud Run
gcloud run deploy iup-golf-api \
  --image gcr.io/<project-id>/iup-golf-api:latest \
  --platform managed \
  --region europe-north1 \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production
```

### Option 3: DigitalOcean (Cost-Effective)

```bash
# Install doctl
brew install doctl

# Authenticate
doctl auth init

# Create Kubernetes cluster
doctl kubernetes cluster create iup-golf-prod \
  --region ams3 \
  --size s-2vcpu-4gb \
  --count 2

# Create managed PostgreSQL
doctl databases create iup-golf-db \
  --engine pg \
  --region ams3 \
  --size db-s-2vcpu-4gb \
  --num-nodes 1

# Create managed Redis
doctl databases create iup-golf-redis \
  --engine redis \
  --region ams3 \
  --size db-s-1vcpu-1gb

# Deploy using kubectl (see kubernetes/ directory)
kubectl apply -f kubernetes/
```

---

## Database Configuration

### PostgreSQL Setup

#### 1. Create Production Database
```sql
-- Connect to PostgreSQL instance
psql -h <db-host> -U <db-user> -d postgres

-- Create database
CREATE DATABASE iup_golf_prod;

-- Create application user
CREATE USER iup_api WITH PASSWORD '<strong-password>';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE iup_golf_prod TO iup_api;

-- Connect to the database
\c iup_golf_prod

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO iup_api;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO iup_api;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO iup_api;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO iup_api;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO iup_api;
```

#### 2. Configure Connection Pooling

**DATABASE_URL Format:**
```
postgresql://username:password@host:port/database?schema=public&connection_limit=10&pool_timeout=20
```

**Recommended Settings:**
```env
DB_POOL_MIN=10      # Minimum connections
DB_POOL_MAX=50      # Maximum connections (adjust based on load)
```

#### 3. Performance Tuning

Add to PostgreSQL config:
```conf
# Memory Configuration
shared_buffers = 2GB
effective_cache_size = 6GB
maintenance_work_mem = 512MB
work_mem = 32MB

# Connection Settings
max_connections = 200

# Query Performance
random_page_cost = 1.1  # For SSD storage
effective_io_concurrency = 200

# Logging
log_min_duration_statement = 1000  # Log queries > 1 second
log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h '
```

#### 4. Backup Strategy

**Automated Backups:**
- Daily full backups (retention: 7 days)
- Point-in-time recovery enabled
- Backup window: 03:00-04:00 UTC
- Cross-region backup replication

**Manual Backup:**
```bash
# Create backup
pg_dump -h <db-host> -U <db-user> -d iup_golf_prod -F c -b -v -f backup_$(date +%Y%m%d_%H%M%S).dump

# Restore backup
pg_restore -h <db-host> -U <db-user> -d iup_golf_prod -v backup.dump
```

---

## Redis Configuration

### Redis Setup

#### 1. Connection Configuration

```env
REDIS_URL=redis://:<password>@<redis-host>:6379
REDIS_PASSWORD=<strong-password>
REDIS_DB=0
```

#### 2. Redis Security

```conf
# Set password
requirepass <strong-password>

# Disable dangerous commands
rename-command FLUSHDB ""
rename-command FLUSHALL ""
rename-command CONFIG ""

# Network security
bind 10.0.0.0/8  # Only allow from VPC
protected-mode yes
```

#### 3. Performance Tuning

```conf
# Memory management
maxmemory 2gb
maxmemory-policy allkeys-lru

# Persistence
save 900 1
save 300 10
save 60 10000
appendonly yes
appendfsync everysec

# Performance
tcp-backlog 511
timeout 300
tcp-keepalive 300
```

---

## Environment Variables

### Production .env File

Create `/apps/api/.env.production`:

```bash
# =============================================================================
# SERVER CONFIGURATION
# =============================================================================
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
API_VERSION=v1

# =============================================================================
# DATABASE CONFIGURATION
# =============================================================================
DATABASE_URL=postgresql://iup_api:<DB_PASSWORD>@<RDS_ENDPOINT>:5432/iup_golf_prod?schema=public&connection_limit=20&pool_timeout=20
DB_POOL_MIN=10
DB_POOL_MAX=50

# =============================================================================
# REDIS CONFIGURATION
# =============================================================================
REDIS_URL=redis://:<REDIS_PASSWORD>@<ELASTICACHE_ENDPOINT>:6379
REDIS_PASSWORD=<REDIS_PASSWORD>
REDIS_DB=0

# =============================================================================
# JWT CONFIGURATION
# Generate with: openssl rand -base64 64
# =============================================================================
JWT_ACCESS_SECRET=<GENERATE_ME>
JWT_REFRESH_SECRET=<GENERATE_ME>
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# =============================================================================
# S3 / OBJECT STORAGE
# =============================================================================
S3_ENDPOINT=https://s3.eu-north-1.amazonaws.com
S3_BUCKET=iup-golf-prod-media
S3_REGION=eu-north-1
S3_ACCESS_KEY_ID=<AWS_ACCESS_KEY>
S3_SECRET_ACCESS_KEY=<AWS_SECRET_KEY>
S3_FORCE_PATH_STYLE=false

# =============================================================================
# CORS CONFIGURATION
# =============================================================================
CORS_ORIGIN=https://app.iupgolf.com,https://www.iupgolf.com,https://admin.iupgolf.com
CORS_CREDENTIALS=true

# =============================================================================
# RATE LIMITING
# =============================================================================
RATE_LIMIT_MAX=1000
RATE_LIMIT_WINDOW=60000

# =============================================================================
# LOGGING
# =============================================================================
LOG_LEVEL=warn
LOG_PRETTY=false

# =============================================================================
# ERROR TRACKING (SENTRY)
# =============================================================================
SENTRY_DSN=https://<key>@<org>.ingest.sentry.io/<project>
SENTRY_ENVIRONMENT=production
SENTRY_RELEASE=<GIT_COMMIT_SHA>
SENTRY_TRACES_SAMPLE_RATE=0.1
SENTRY_PROFILES_SAMPLE_RATE=0.1

# =============================================================================
# EMAIL CONFIGURATION
# =============================================================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=<EMAIL_USERNAME>
SMTP_PASS=<EMAIL_APP_PASSWORD>
SMTP_FROM=noreply@iupgolf.com
SMTP_FROM_NAME=IUP Golf Academy

# =============================================================================
# QUEUE CONFIGURATION
# =============================================================================
QUEUE_NAME=iup-golf-prod-events
QUEUE_CONCURRENCY=10

# =============================================================================
# TENANT CONFIGURATION
# =============================================================================
DEFAULT_TENANT_ID=00000000-0000-0000-0000-000000000001
DEFAULT_TENANT_NAME=IUP Golf Academy
DEFAULT_TENANT_SLUG=iup-golf

# =============================================================================
# SECURITY
# =============================================================================
BCRYPT_ROUNDS=12

# =============================================================================
# FEATURE FLAGS (optional)
# =============================================================================
ENABLE_VIDEO_PROCESSING=true
ENABLE_PEER_COMPARISON=true
ENABLE_BADGE_SYSTEM=true
```

### Generate Secrets

```bash
# JWT Access Secret
openssl rand -base64 64

# JWT Refresh Secret
openssl rand -base64 64

# Database Password
openssl rand -base64 32

# Redis Password
openssl rand -base64 32
```

---

## Secrets Management

### Option 1: AWS Secrets Manager

```bash
# Create secret
aws secretsmanager create-secret \
  --name iup-golf-prod/env \
  --description "Production environment variables" \
  --secret-string file://.env.production

# Retrieve secret
aws secretsmanager get-secret-value \
  --secret-id iup-golf-prod/env \
  --query SecretString \
  --output text > .env.production

# Update secret
aws secretsmanager update-secret \
  --secret-id iup-golf-prod/env \
  --secret-string file://.env.production
```

### Option 2: HashiCorp Vault

```bash
# Write secrets
vault kv put secret/iup-golf-prod/api \
  DATABASE_URL="<database-url>" \
  JWT_ACCESS_SECRET="<jwt-secret>" \
  # ... other secrets

# Read secrets
vault kv get secret/iup-golf-prod/api
```

### Option 3: Kubernetes Secrets

```bash
# Create secret from .env file
kubectl create secret generic iup-golf-api-secrets \
  --from-env-file=.env.production \
  --namespace=production

# Use in deployment
# See kubernetes/deployment.yaml
```

---

## SSL/TLS Certificates

### Option 1: Let's Encrypt (Free)

```bash
# Install certbot
brew install certbot

# Generate certificate
sudo certbot certonly --standalone \
  -d api.iupgolf.com \
  -d www.iupgolf.com

# Auto-renewal
sudo certbot renew --dry-run
```

### Option 2: AWS Certificate Manager

```bash
# Request certificate
aws acm request-certificate \
  --domain-name api.iupgolf.com \
  --subject-alternative-names www.iupgolf.com \
  --validation-method DNS

# Validate via DNS
# Add CNAME records provided by ACM to your DNS
```

### Option 3: Cloudflare (Recommended for CDN)

1. Add domain to Cloudflare
2. Update nameservers
3. Enable "Full (strict)" SSL mode
4. Generate origin certificate for your server

---

## Monitoring Setup

### Sentry (Error Tracking)

```bash
# Install Sentry SDK
pnpm add @sentry/node @sentry/profiling-node

# Get DSN from https://sentry.io
# Add to .env.production
SENTRY_DSN=https://<key>@<org>.ingest.sentry.io/<project>
```

### Prometheus + Grafana

```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'iup-golf-api'
    static_configs:
      - targets: ['api.iupgolf.com:3000']
    metrics_path: '/metrics'
```

### Uptime Monitoring

- **UptimeRobot:** https://uptimerobot.com (Free tier available)
- **Pingdom:** https://www.pingdom.com
- **StatusCake:** https://www.statuscake.com

---

## Deployment Options Summary

| Provider | Cost/Month | Complexity | Scalability | Recommendation |
|----------|-----------|------------|-------------|----------------|
| AWS ECS | $100-300 | Medium | High | Best for enterprise |
| Google Cloud Run | $50-150 | Low | High | Best for serverless |
| DigitalOcean K8s | $50-100 | Medium | Medium | Best for cost |
| Heroku | $75-200 | Very Low | Medium | Best for speed |
| Railway | $20-100 | Very Low | Medium | Best for startups |

---

## Next Steps

1. [ ] Choose cloud provider
2. [ ] Provision infrastructure
3. [ ] Configure databases
4. [ ] Set up secrets management
5. [ ] Configure monitoring
6. [ ] Deploy application
7. [ ] Run smoke tests
8. [ ] Monitor for 24 hours

---

## Support

For questions or issues:
- Check deployment logs
- Review Sentry error dashboard
- Consult team documentation
- Contact DevOps team
