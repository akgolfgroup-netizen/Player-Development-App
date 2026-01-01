# Documentation

> IUP Golf Platform - Technical Documentation

[![Documentation](https://img.shields.io/badge/docs-latest-brightgreen.svg)](.)
[![API](https://img.shields.io/badge/API-OpenAPI%203.1-blue.svg)](./api/openapi-spec.yaml)
[![Version](https://img.shields.io/badge/Version-1.1.0-blue)]()

---

## Quick Links

| I want to... | Go to |
|--------------|-------|
| Understand the system | [Architecture Overview](./architecture/overview.md) |
| Set up development | [Development Guide](./guides/development.md) |
| Use the API | [API Reference](./api/README.md) |
| Deploy the app | [Deployment Guide](./guides/deployment.md) |
| Run tests | [Testing Guide](./guides/testing.md) |
| Understand golf categories | [Golf Categories](./reference/golf-categories.md) |

---

## Documentation Map

```
docs/
├── architecture/           # System design & decisions
│   ├── overview.md         # Architecture overview
│   ├── data-model.md       # Database schema
│   └── decisions/          # ADRs (Architecture Decision Records)
│
├── api/                    # API documentation
│   ├── README.md           # API overview
│   ├── openapi-spec.yaml   # OpenAPI 3.1 specification
│   ├── booking.md          # Booking API
│   ├── coach.md            # Coach management API
│   ├── groups.md           # Groups/teams API
│   ├── messaging.md        # Messaging API
│   └── tournaments.md      # Tournaments API
│
├── guides/                 # How-to guides
│   ├── development.md      # Local setup
│   ├── deployment.md       # Deploy to production
│   ├── testing.md          # Testing strategy
│   ├── contributing.md     # Contribution guide
│   └── ui/                 # UI guides
│       ├── HOME_SCREEN.md
│       ├── PROOF_SCREEN.md
│       └── SCREEN_RESPONSIBILITIES.md
│
├── design/                 # UI/UX documentation
│   └── design-system.md    # Design tokens & components
│
├── reference/              # Domain reference
│   ├── golf-categories.md  # A-K category system
│   ├── badge-system.md     # Gamification
│   └── CONFIG_KATEGORI_KRAV.md  # Category requirements
│
├── features/               # Feature documentation
│   ├── datagolf/           # DataGolf integration
│   ├── oauth/              # OAuth implementation
│   └── subscription/       # Subscription system
│
├── operations/             # Operations docs
│   ├── monitoring.md       # Metrics & dashboards
│   ├── deployment.md       # Deployment procedures
│   ├── incident-response.md # Incident handling
│   └── database-migration.md # Migration procedures
│
├── deployment/             # Deployment guides
│   ├── ENV_VARIABLES.md    # Environment variables
│   └── RAILWAY.md          # Railway deployment
│
├── demo/                   # Demo materials
│   ├── demo-script.md      # Demo walkthrough
│   └── FAQ.md              # Frequently asked questions
│
└── archive/                # Historical documentation
```

---

## Architecture

- [System Overview](./architecture/overview.md) - High-level architecture
- [Data Model](./architecture/data-model.md) - Database design and relationships

### Architecture Decision Records (ADRs)

| ADR | Decision | Status |
|-----|----------|--------|
| [001](./architecture/decisions/001-fastify-framework.md) | Use Fastify as HTTP framework | Accepted |
| [002](./architecture/decisions/002-prisma-orm.md) | Use Prisma as ORM | Accepted |
| [003](./architecture/decisions/003-multi-tenant.md) | Multi-tenant via tenant_id column | Accepted |
| [004](./architecture/decisions/004-jwt-auth.md) | JWT-based authentication | Accepted |

---

## API Reference

- [API Overview](./api/README.md) - Getting started with the API
- [OpenAPI Spec](./api/openapi-spec.yaml) - Full API specification
- **Interactive Docs**: http://localhost:3000/docs (when server running)

### Endpoints by Domain

| Domain | Base Path | Description |
|--------|-----------|-------------|
| Auth | `/api/v1/auth` | Login, register, 2FA, password reset |
| Players | `/api/v1/players` | Player management |
| Tests | `/api/v1/tests` | Test results and history |
| Training | `/api/v1/training-plan` | Training plans and sessions |
| Dashboard | `/api/v1/dashboard` | Player/coach dashboards |
| Badges | `/api/v1/badges` | Gamification system |
| Videos | `/api/v1/videos` | Video upload and analysis |
| Booking | `/api/v1/booking` | Session booking |

---

## Guides

| Guide | Description |
|-------|-------------|
| [Development](./guides/development.md) | Set up local development environment |
| [Testing](./guides/testing.md) | Run tests and add coverage |
| [Deployment](./guides/deployment.md) | Deploy to staging and production |
| [Contributing](./guides/contributing.md) | Contribute to the project |

---

## Design System

- [Design Tokens](./design/design-system.md) - Colors, typography, spacing
- [Complete Design System](./AK_GOLF_DESIGN_SYSTEM_COMPLETE.md) - Full UI/UX reference

### Brand Colors

| Name | Hex | Usage |
|------|-----|-------|
| Primary | `#10456A` | Main brand color |
| Ink | `#02060D` | Text |
| Snow | `#EDF0F2` | Background |
| Gold | `#C9A227` | Accents |

---

## Reference

| Document | Description |
|----------|-------------|
| [Golf Categories](./reference/golf-categories.md) | A-K category system (Team Norway) |
| [Badge System](./reference/badge-system.md) | 85 badges and gamification |
| [Category Requirements](./reference/CONFIG_KATEGORI_KRAV.md) | Category configuration |
| [Gamification Metrics](./reference/GAMIFICATION_METRICS_SPEC.md) | Gamification specifications |

---

## Standards

This documentation follows:

- [Google Developer Documentation Style Guide](https://developers.google.com/style)
- [Diátaxis documentation framework](https://diataxis.fr/)
- English for technical docs, Norwegian for user-facing content

---

*Last updated: December 2025*
