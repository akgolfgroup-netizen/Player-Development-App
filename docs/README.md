# Documentation

> IUP Golf Platform - Technical Documentation

[![Documentation](https://img.shields.io/badge/docs-latest-brightgreen.svg)](.)
[![API](https://img.shields.io/badge/API-OpenAPI%203.0-blue.svg)](./api/openapi.yaml)

---

## Quick Links

| I want to... | Go to |
|--------------|-------|
| Understand the system | [Architecture Overview](./architecture/overview.md) |
| Set up development | [Development Guide](./guides/development.md) |
| Use the API | [API Reference](./api/README.md) |
| Deploy the app | [Deployment Guide](./guides/deployment.md) |
| Understand the domain | [Golf Categories](./reference/golf-categories.md) |

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
│   ├── authentication.md   # Auth & security
│   └── openapi.yaml        # OpenAPI spec
│
├── guides/                 # How-to guides
│   ├── development.md      # Local setup
│   ├── deployment.md       # Deploy to production
│   ├── testing.md          # Testing strategy
│   └── contributing.md     # Contribution guide
│
├── design/                 # UI/UX documentation
│   ├── design-system.md    # Design tokens & components
│   └── mockups/            # Visual prototypes
│
├── reference/              # Domain reference
│   ├── golf-categories.md  # A-K category system
│   ├── test-protocols.md   # Test specifications
│   └── badge-system.md     # Gamification
│
└── internal/               # Internal docs (not for external use)
    └── ...
```

---

## Architecture

- [System Overview](./architecture/overview.md) - High-level architecture
- [Data Model](./architecture/data-model.md) - Database design and relationships
- [Security Model](./architecture/security.md) - Authentication, authorization, multi-tenancy

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
- [Authentication](./api/authentication.md) - Auth flows and tokens
- [OpenAPI Spec](./api/openapi.yaml) - Full API specification

### Endpoints by Domain

| Domain | Base Path | Description |
|--------|-----------|-------------|
| Auth | `/api/v1/auth` | Login, register, tokens |
| Players | `/api/v1/players` | Player management |
| Tests | `/api/v1/tests` | Test results and history |
| Training | `/api/v1/training-plan` | Training plans and sessions |
| Dashboard | `/api/v1/dashboard` | Player/coach dashboards |
| Badges | `/api/v1/badges` | Gamification system |

---

## Guides

| Guide | Description |
|-------|-------------|
| [Development](./guides/development.md) | Set up local development environment |
| [Deployment](./guides/deployment.md) | Deploy to staging and production |
| [Testing](./guides/testing.md) | Run tests and add coverage |
| [Contributing](./guides/contributing.md) | Contribute to the project |

---

## Design System

- [Design Tokens](./design/design-system.md) - Colors, typography, spacing
- [Component Library](./design/components.md) - Reusable UI components
- [Mockups](./design/mockups/) - Visual prototypes

### Brand Colors

| Name | Hex | Usage |
|------|-----|-------|
| Primary | `#10456A` | Main brand color |
| Ink | `#02060D` | Text |
| Snow | `#EDF0F2` | Background |
| Gold | `#C9A227` | Accents |

---

## Reference

Domain-specific documentation:

| Document | Description |
|----------|-------------|
| [Golf Categories](./reference/golf-categories.md) | A-K category system (Team Norway) |
| [Test Protocols](./reference/test-protocols.md) | 20+ test specifications |
| [Badge System](./reference/badge-system.md) | 85 badges and gamification |
| [Glossary](./reference/glossary.md) | Domain terminology |

---

## Standards

This documentation follows:

- [Google Developer Documentation Style Guide](https://developers.google.com/style)
- [Diátaxis documentation framework](https://diataxis.fr/)
- English for technical docs, Norwegian for user-facing content

---

*Last updated: December 2024*
