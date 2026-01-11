# TIER Golf - IUP Platform

> Production-ready Individual Development Plan (IUP) platform for junior golf training academies

[![Status](https://img.shields.io/badge/Status-Production-success)]()
[![Version](https://img.shields.io/badge/Version-1.2.0-blue)]()
[![Node](https://img.shields.io/badge/Node-20+-green)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)]()
[![pnpm](https://img.shields.io/badge/pnpm-8.12+-orange)]()
[![Test Coverage](https://img.shields.io/badge/Coverage-45%25-brightgreen)]()
[![Security](https://img.shields.io/badge/Security-Good-green)]()

---

## 🚀 Latest Updates (January 2026)

### Recently Completed
- ✅ **TIER Design System Migration** (Jan 6) - Complete rebrand with Nordic Minimalism v3.1
- ✅ **OAuth & Stripe Integration** (Jan 7) - Full payment and authentication infrastructure
- ✅ **DataGolf API Integration** (Jan 7) - Live tournament data and player statistics
- ✅ **Project Documentation Overhaul** (Jan 8) - Developer handoff, roadmap, technical highlights

### For New Developers
- 📖 **Start Here:** [Developer Handoff](./DEVELOPER_HANDOFF.md) - Complete onboarding guide
- 🗺️ **Roadmap:** [Development Roadmap](./ROADMAP.md) - Q1 2026 priorities
- 📊 **Status:** [Project Status](./PROJECT_STATUS.md) - Current state overview
- 🏆 **Highlights:** [Technical Highlights](/docs/HIGHLIGHTS.md) - Architecture achievements

### Previous Updates (December 2025)
- **Video Analysis System** - Complete video upload with S3 multipart support, annotations, and comparisons
- **Two-Factor Authentication** - TOTP with backup codes
- **Test Coverage** - 45%+ with 240+ test cases
- **Performance Optimization** - 50+ database indexes, Redis caching strategy
- **Documentation Restructure** - Professional Google-style documentation standards

---

## Overview

Enterprise-grade coaching platform for TIER Golf with production-ready monitoring, security, and DevOps infrastructure.

## Prosjekt på et Øyeblikk

**Domene:** Individuelle Utviklingsplaner (IUP) for junior golfakademier
**Skala:** Multi-tenant SaaS som støtter 50+ spillere per akademi
**Kompleksitet:** 113 Prisma-modeller, 70+ REST-endepunkter, 33 testfiler
**Status:** Produksjonsklart med monitoring, 2FA, videoanalyse, sanntidsoppdateringer

**Kjerneverdier:**
- Digitaliserer Team Norges beviste IUP-metodikk for junior golfutvikling
- Sporer fremgang på tvers av 11 kategorier (A-K) med 20+ standardiserte testprotokoller
- Muliggjør datadrevne coaching-beslutninger gjennom peer comparison og breaking point detection
- Erstatter Excel-basert sporing med produksjonsklart system

**Teknisk Sofistikering:**
- Monorepo med delt design system og databaselag
- Multi-tenant arkitektur med organisasjonsnivå-dataisolering
- Sanntids WebSocket-oppdateringer for coach-spiller-samarbeid
- S3-basert videoanalyse med annotering og sammenligningsfunksjoner
- Omfattende observability (Prometheus, Grafana, Sentry)

### Key Features

- **Individual Development Plans** - Track progress across 11 categories (A-K) following Team Norway methodology
- **20+ Test Protocols** - Comprehensive testing for driver, approach, short game, putting, physical fitness
- **Advanced Analytics** - Peer comparison, breaking point detection, progress tracking
- **Training Plans** - Periodization with E/G/S/T phases and automated scheduling
- **Booking System** - Coach availability and session management with calendar integration
- **Real-time Updates** - WebSocket-based live updates for coaches and players
- **Multi-tenant Architecture** - Secure organization isolation with role-based access control
- **Video Analysis** - Complete video upload with S3 multipart support, annotations, comparisons, progress tracking, and coach review workflows
- **Two-Factor Authentication** - TOTP-based 2FA with backup codes for enhanced security
- **Audit Logging** - Comprehensive activity tracking for compliance and security

### Production Features

- **Monitoring & Observability** - Prometheus metrics, Grafana dashboards, Sentry error tracking
- **Security** - JWT authentication, rate limiting, CORS protection, SQL injection prevention
- **CI/CD Pipeline** - Automated testing, security scanning, deployment to staging/production
- **Documentation** - Comprehensive API docs, runbooks, and operational procedures

---

## Quick Start

### Prerequisites

- Node.js 20+
- Docker Desktop
- pnpm (`npm install -g pnpm`)

### Setup (5 minutes)

```bash
# 1. Start infrastructure
cd apps/api
docker-compose up -d

# 2. Setup database
pnpm install
npx prisma generate
npx prisma migrate deploy
pnpm run prisma:seed

# 3. Start backend
pnpm dev
# http://localhost:3000

# 4. Start frontend (new terminal)
cd ../web
pnpm install
pnpm start
# http://localhost:3001
```

### Demo Login

| Role   | Email            | Password  |
|--------|------------------|-----------|
| Admin  | admin@demo.com   | admin123  |
| Coach  | coach@demo.com   | coach123  |
| Player | player@demo.com  | player123 |

### Vanlige Oppsetsproblemer

**Problem:** Prisma client-feil
```bash
# Løsning: Regenerer Prisma client
cd apps/api
npx prisma generate
```

**Problem:** Port allerede i bruk (3000/3001)
```bash
# Finn og drep prosess
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

**Problem:** Docker-containere starter ikke
```bash
# Reset Docker-tilstand
docker-compose down -v
docker-compose up -d
```

**Første gangs oppsett tar lang tid?**
- Initial seed oppretter testdata for 5 spillere med full historikk
- Forvent 2-3 minutter for seed på første kjøring
- Påfølgende oppstarter: <30 sekunder

---

## Project Structure

```
IUP_Master_V1/
├── apps/
│   ├── api/              # Fastify backend (40+ endpoints)
│   ├── web/              # React frontend
│   └── golfer/           # Mobile app (Ionic/Capacitor)
│
├── packages/
│   ├── database/         # Shared Prisma schema
│   └── design-system/    # UI components & tokens
│
├── docs/                 # Documentation
│   ├── features/         # Feature-specific docs
│   ├── api/              # API documentation
│   ├── mockups/          # UI mockups
│   └── archive/          # Historical docs
│
├── scripts/              # Utility scripts
│   ├── migrations/       # Database migrations
│   └── testing/          # Test scripts
│
├── config/               # Infrastructure config
└── data/                 # Reference data
```

---

## Technology Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 18, React Router 7, Axios   |
| Backend    | Fastify 4, Prisma 5, Zod          |
| Database   | PostgreSQL 16, Redis 7            |
| Storage    | AWS S3, MinIO (local dev)         |
| Auth       | JWT, Argon2, TOTP (Speakeasy)     |
| Security   | 2FA, Password Reset, Helmet.js    |
| Testing    | Jest, Playwright, K6              |
| Design     | Inter font, Blue Palette 01       |
| Build      | pnpm, Turbo, Docker               |

---

## Kodekvalitetsindikatorer

### Testdekning
- **45%+ total dekning** (240+ testtilfeller)
- **33 testfiler** som dekker kritiske veier
- **3 sikkerhetstestsuiter** (XSS, SQL injection, RBAC)
- **Integration tests** for alle major API-moduler
- **Unit tests** for domenelogikk (focus engine, badge evaluator, video services)

### CI/CD Pipeline
- **Automatisert på hver PR:** Lint → Security Audit → Tests → Build
- **Design System Gate:** Blokkerer PRer som bryter design tokens (BLOCKING)
- **Sikkerhetsskanning:** Snyk + pnpm audit
- **Multi-stage deployment:** develop → staging → main → production
- **Test environments:** PostgreSQL 16 + Redis 7 i CI

### Kodestandarder
- **TypeScript strict mode** på backend (100% dekning, 270 filer)
- **ESLint + Prettier** håndhevet i CI
- **Conventional commits** for changelog-generering
- **ADRs for store beslutninger** (Architecture Decision Records)
- **PR reviews required** før merge

### Produksjonsfunksjoner
- **Zero-downtime migrations** via Prisma
- **Prometheus metrics** eksportert på `/metrics`
- **Sentry error tracking** med profiling
- **Rate limiting** per endepunkt
- **CORS-beskyttelse** med whitelist
- **Helmet.js security headers**
- **PII redaction** i logger

---

## Design System

**Design System:** Nordic Minimalism v3.1 | **Status:** Production Ready

| Element | Specification |
|---------|---------------|
| **Primary Color** | Current Blue (#10456A) |
| **Font** | Inter (Apple HIG scale) |
| **Border Radius** | 12px (standard), 8px (small) |
| **Spacing** | 4px grid system |
| **Shadows** | 6-level system with subtle blue tint |

### Design Resources

- **Design Tokens:** `apps/web/src/design-tokens.js`
- **UI Components:** `apps/web/src/ui/` (primitives + composites)
- **Design System Docs:** `docs/AK_GOLF_DESIGN_SYSTEM_COMPLETE.md`

---

## Documentation

| Category | Document | Description |
|----------|----------|-------------|
| **Getting Started** | [Quick Start](#quick-start) | Get up and running in 5 minutes |
| | [Documentation Index](./docs/README.md) | Complete documentation overview |
| | [Development Guide](./docs/guides/development.md) | Local development setup |
| **API** | [OpenAPI Spec](./apps/api/docs/openapi.yaml) | OpenAPI 3.1 specification |
| | [API Overview](./docs/api/README.md) | API documentation |
| | Interactive Docs | http://localhost:3000/docs (Swagger UI) |
| **Architecture** | [Architecture Overview](./docs/architecture/overview.md) | System architecture |
| | [ADRs](./docs/architecture/decisions/) | Architecture Decision Records |
| **Operations** | [Deployment Guide](./docs/guides/deployment.md) | Production deployment |
| | [Testing Guide](./docs/guides/testing.md) | Testing strategy |
| | [Monitoring](./docs/operations/monitoring.md) | Metrics and alerts |

### API Authentication

```bash
# Get access token
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"coach@demo.com","password":"coach123"}'

# Use token in requests
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  http://localhost:3000/api/v1/players
```

---

## Monitoring & Observability

### Health Checks

```bash
# Application health
curl http://localhost:3001/health

# Readiness probe (Kubernetes)
curl http://localhost:3001/ready

# Liveness probe (Kubernetes)
curl http://localhost:3001/live

# Prometheus metrics
curl http://localhost:3001/metrics
```

### Key Metrics

| Metric | Target | Purpose |
|--------|--------|---------|
| Error Rate | < 0.1% | Application stability |
| Response Time (p95) | < 200ms | User experience |
| Uptime | > 99.9% | Service availability |
| Database Query Time (p95) | < 100ms | Database performance |

### Dashboards

- **Grafana:** Metrics visualization and alerting
- **Sentry:** Error tracking and performance monitoring
- **Prometheus:** Time-series metrics collection

See [Monitoring Guide](./docs/operations/monitoring.md) for dashboard setup instructions.

---

## Development

### Running Tests

```bash
# Backend tests
cd apps/api && pnpm test

# Frontend tests
cd apps/web && pnpm test

# E2E tests
pnpm test:e2e
```

### Database Operations

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Open Prisma Studio
npx prisma studio

# Seed database
pnpm run prisma:seed
```

---

## Deployment

### Environments

| Environment | Branch | Auto-Deploy | URL |
|------------|--------|-------------|-----|
| Development | feature/* | No | localhost:3001 |
| Staging | develop | Yes (CI/CD) | staging-api.iup-golf.com |
| Production | main | Manual | api.iup-golf.com |

### CI/CD Pipeline

The GitHub Actions workflow automatically:

1. **Lint & Type Check** - ESLint and TypeScript validation
2. **Security Audit** - pnpm audit and Snyk security scan
3. **Test** - Unit, integration, and E2E tests
4. **Build** - Production build with artifact upload
5. **Deploy** - Automatic deployment to staging (develop) or production (main)

**Pipeline Status:** View in [GitHub Actions](.github/workflows/ci.yml)

### Deployment Process

```bash
# Deploy to staging
git checkout develop
git merge feature/your-feature
git push origin develop
# Auto-deploys via CI/CD

# Deploy to production
git checkout main
git merge develop
git push origin main
# Review and approve deployment via GitHub Actions
```

See [Deployment Guide](./docs/operations/deployment.md) for detailed procedures.

### Quick Deploy Commands

```bash
# Development
pnpm dev

# Build for production
pnpm build

# Run production build
pnpm start

# Database migrations
pnpm --filter iup-golf-backend prisma migrate deploy
```

---

## Security

### Authentication & Authorization

- **JWT Tokens:** Access tokens (15 min) + Refresh tokens (7 days)
- **Password Hashing:** Argon2 with salt
- **Role-Based Access Control:** Admin, Coach, Player roles
- **Multi-tenant Isolation:** Secure organization-level data separation

### Security Features

- **Rate Limiting:** Configurable per endpoint
- **CORS Protection:** Whitelist-based origins
- **Helmet.js:** Security headers (CSP, XSS protection)
- **Input Validation:** Zod schema validation
- **SQL Injection Prevention:** Prisma ORM with parameterized queries
- **PII Redaction:** Automatic redaction in logs and error tracking

### Security Monitoring

- **Sentry:** Real-time error tracking and alerting
- **Security Audits:** Automated vulnerability scanning in CI/CD
- **Log Monitoring:** Structured logging with PII redaction

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Code Standards

- TypeScript for backend
- ESLint + Prettier formatting
- Conventional commits
- PR reviews required

---

## License

Proprietary - TIER Golf
© 2025 All Rights Reserved

---

**Built for Norwegian junior golfers following Team Norway IUP methodology**
