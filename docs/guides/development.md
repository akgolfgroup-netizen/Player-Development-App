# Development Guide

> Set up your local development environment for IUP Golf Platform

## Prerequisites

| Tool | Version | Installation |
|------|---------|--------------|
| Node.js | 20+ | [nodejs.org](https://nodejs.org/) |
| pnpm | 8+ | `npm install -g pnpm` |
| Docker | Latest | [docker.com](https://www.docker.com/products/docker-desktop/) |
| Git | Latest | [git-scm.com](https://git-scm.com/) |

## Quick Start

```bash
# 1. Clone repository
git clone https://github.com/akgolfgroup-netizen/IUP-app.git
cd IUP-app

# 2. Install dependencies
pnpm install

# 3. Start infrastructure (PostgreSQL, Redis)
cd apps/api
docker-compose up -d

# 4. Set up environment
cp .env.example .env
# Edit .env with your settings

# 5. Set up database
npx prisma generate
npx prisma migrate deploy
pnpm run prisma:seed

# 6. Start backend (terminal 1)
pnpm dev
# API runs at http://localhost:3000

# 7. Start frontend (terminal 2)
cd ../web
pnpm dev
# App runs at http://localhost:5173
```

## Project Structure

```
IUP_Master_V1/
├── apps/
│   ├── api/           # Backend (Fastify + Prisma)
│   └── web/           # Frontend (React + Vite)
├── docs/              # Documentation
├── packages/          # Shared packages
└── package.json       # Root package
```

## Environment Variables

### Backend (`apps/api/.env`)

```bash
# Database
DATABASE_URL="postgresql://iup_golf:dev_password@localhost:5432/iup_golf"

# JWT
JWT_SECRET="your-secret-key-min-32-chars"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Redis (optional, for caching)
REDIS_URL="redis://localhost:6379"

# Storage (optional, for file uploads)
S3_BUCKET="iup-golf-dev"
S3_REGION="eu-north-1"
```

### Frontend (`apps/web/.env`)

```bash
VITE_API_URL=http://localhost:3000
```

## Database

### Commands

```bash
# Generate Prisma client
npx prisma generate

# Create migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Reset database
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio
```

### Seed Data

```bash
# Seed demo data
pnpm run prisma:seed
```

Demo users after seeding:

| Email | Password | Role |
|-------|----------|------|
| admin@demo.com | demo123 | Admin |
| coach@demo.com | demo123 | Coach |
| player@demo.com | demo123 | Player |

## Running Tests

```bash
# All tests
pnpm test

# Watch mode
pnpm test -- --watch

# Coverage
pnpm test -- --coverage

# Specific file
pnpm test -- tests/integration/auth.test.ts
```

## Code Style

### Linting

```bash
# Check
pnpm lint

# Fix
pnpm lint --fix
```

### Formatting

```bash
# Check
pnpm format:check

# Fix
pnpm format
```

### Pre-commit Hooks

Husky runs linting and tests before each commit.

## Common Tasks

### Add a New API Endpoint

1. Create route file in `apps/api/src/api/v1/{domain}/`
2. Define schema in `schema.ts`
3. Implement logic in `service.ts`
4. Register routes in `index.ts`
5. Add tests in `apps/api/tests/`

### Add a New React Component

1. Create component in `apps/web/src/components/`
2. Export from `index.js`
3. Add tests in `__tests__/`

### Update Database Schema

1. Edit `apps/api/prisma/schema.prisma`
2. Run `npx prisma migrate dev --name descriptive_name`
3. Update seeds if needed
4. Update affected services

## Debugging

### Backend

```bash
# Run with Node inspector
node --inspect-brk node_modules/.bin/tsx src/server.ts
```

Attach VS Code debugger or open `chrome://inspect`.

### Frontend

React DevTools and browser DevTools work as usual.

### Database

```bash
# Open Prisma Studio
npx prisma studio
```

## Docker

### Build Images

```bash
# Backend
docker build -t iup-api ./apps/api

# Frontend
docker build -t iup-web ./apps/web
```

### Run Full Stack

```bash
docker-compose up
```

## Troubleshooting

### Port Already in Use

```bash
lsof -i :3000
kill -9 <PID>
```

### Prisma Client Out of Sync

```bash
npx prisma generate
```

### Node Modules Issues

```bash
rm -rf node_modules
pnpm install
```

---

See also:
- [Testing Guide](./testing.md)
- [Deployment Guide](./deployment.md)
- [Contributing Guide](./contributing.md)
