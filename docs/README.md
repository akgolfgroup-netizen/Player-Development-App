# AK Golf Academy - Documentation

> Single source of truth for all project documentation

---

## Quick Navigation

| Category | Description |
|----------|-------------|
| [Platform Functions](./PLATFORM_FUNKSJONER.md) | Complete feature list (Norwegian) |
| [Project Overview](#project-overview) | Master documents and status |
| [API Reference](./api/README.md) | All API endpoints |
| [Design System](./DESIGN_SYSTEM.md) | Colors, typography, components |
| [User Guides](./guides/) | UI/UX documentation |
| [Features](./features/) | Feature-specific documentation |

---

## Project Overview

Core project documents (source of truth):

| Document | Description |
|----------|-------------|
| [Master Project](./00_MASTER_PROSJEKTDOKUMENT.md) | Complete project overview |
| [Status Dashboard](./01_STATUS_DASHBOARD.md) | Current implementation status |
| [Development Plan](./02_UTVIKLINGSPLAN_KOMPLETT.md) | Roadmap and milestones |

---

## Documentation Structure

```
docs/
├── README.md                     # This index
├── DESIGN_SYSTEM.md              # Design system (single source)
│
├── api/                          # API Documentation
│   ├── README.md                 # API overview & reference
│   ├── booking.md                # Booking & calendar API
│   ├── coach.md                  # Coach endpoints
│   ├── groups.md                 # Groups/teams API
│   ├── messaging.md              # Messaging API
│   ├── tournaments.md            # Tournaments API
│   └── openapi-spec.yaml         # OpenAPI specification
│
├── guides/                       # User & Developer Guides
│   ├── PLAYER_NAVIGATION_OVERVIEW.md
│   ├── COACH_ADMIN_JOURNEYS.md
│   ├── user-journeys.md
│   └── ui/                       # UI/UX Documentation
│       ├── README.md
│       ├── HOME_SCREEN.md
│       ├── PROOF_SCREEN.md
│       ├── SCREEN_RESPONSIBILITIES.md
│       └── UI_SCREENS_DESKTOP.md
│
├── features/                     # Feature Documentation
│   ├── datagolf/                 # DataGolf integration
│   │   ├── DATAGOLF_QUICKSTART.md
│   │   ├── DATAGOLF_DATA_INVENTORY.md
│   │   ├── DATAGOLF_OPPORTUNITY_ANALYSIS.md
│   │   └── DATAGOLF_STATS_FORSLAG.md
│   ├── oauth/                    # Authentication
│   │   └── OAUTH_IMPLEMENTATION.md
│   └── subscription/             # Subscription system
│       └── SUBSCRIPTION_TIERS_IMPLEMENTATION.md
│
├── mockups/                      # UI Mockups & Prototypes
│   └── *.html
│
└── archive/                      # Historical documents (reference only)
    └── ...
```

---

## API Documentation

Complete API reference at [docs/api/README.md](./api/README.md)

### Quick Links

| API | Endpoints | Description |
|-----|-----------|-------------|
| [Booking](./api/booking.md) | 17 | Availability, bookings, calendar |
| [Coach](./api/coach.md) | 12 | Dashboard, athletes, analytics |
| [Groups](./api/groups.md) | 8 | Team management |
| [Messaging](./api/messaging.md) | 6 | Conversations, notifications |
| [Tournaments](./api/tournaments.md) | 5 | Tournament management |

---

## Design System

**Single source**: [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)

### Quick Reference

| Element | Value |
|---------|-------|
| Primary | `#10456A` |
| Ink | `#02060D` |
| Snow | `#EDF0F2` |
| Gold | `#C9A227` |
| Font | Inter |

---

## Feature Documentation

### DataGolf Integration
- [Quickstart Guide](./features/datagolf/DATAGOLF_QUICKSTART.md) - Get started
- [Data Inventory](./features/datagolf/DATAGOLF_DATA_INVENTORY.md) - Available data
- [Opportunity Analysis](./features/datagolf/DATAGOLF_OPPORTUNITY_ANALYSIS.md) - Strategy

### Authentication
- [OAuth Implementation](./features/oauth/OAUTH_IMPLEMENTATION.md)

### Subscription
- [Tier Implementation](./features/subscription/SUBSCRIPTION_TIERS_IMPLEMENTATION.md)

---

## Specifications

| Spec | Description |
|------|-------------|
| [Badge System](./AK_ICON_BADGE_SYSTEM_SPEC.md) | Icon and badge specifications |
| [Category Requirements](./CONFIG_KATEGORI_KRAV.md) | A-K category definitions |
| [Gamification](./GAMIFICATION_METRICS_SPEC.md) | Metrics and rewards |
| [Annual Plan](./AARSPLAN_MAL_NIVAPRINSIPPET.md) | Training plan structure |

---

## Archive

Historical documents are stored in [docs/archive/](./archive/). These are for reference only and may contain outdated information. Always refer to the main documentation above for current specifications.

---

## Contributing

When adding documentation:

1. **Single source of truth** - Don't duplicate information
2. **Clear ownership** - Each topic has one authoritative document
3. **Link, don't copy** - Reference other docs instead of copying content
4. **Archive old content** - Move outdated docs to archive/

---

**Last updated**: December 2025
