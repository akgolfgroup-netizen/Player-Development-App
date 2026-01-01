# 📚 Documentation Index

> **Comprehensive documentation for AK Golf Academy IUP Platform**
> Last Updated: December 17, 2025

---

## 🚀 Getting Started

**New to the project?** Start here:

1. [Main README](../README.md) - Project overview and quick start
2. [Quick Start Guide](../apps/api/QUICK_START.md) - Get running in 5 minutes
3. [Architecture Overview](./architecture/ARCHITECTURE.md) - System design
4. [Project Structure](./architecture/PROJECT_STRUCTURE.md) - Folder organization

---

## 📖 Core Documentation

### Architecture & Design

Located in: `docs/architecture/`

- **[ARCHITECTURE.md](./architecture/ARCHITECTURE.md)** - System architecture and design decisions
- **[PROJECT_STRUCTURE.md](./architecture/PROJECT_STRUCTURE.md)** - Detailed folder structure
- **[DESIGN_SOURCE_OF_TRUTH.md](./architecture/DESIGN_SOURCE_OF_TRUTH.md)** - Design system guidelines
- **[ENDPOINT_MAPPING.md](./architecture/ENDPOINT_MAPPING.md)** - API endpoint reference

### Developer Guides

Located in: `docs/guides/`

- **[ONBOARDING.md](./guides/ONBOARDING.md)** - Onboarding guide for new developers
- **[DEPLOYMENT_GUIDE.md](./guides/DEPLOYMENT_GUIDE.md)** - How to deploy the application
- **[TESTING_GUIDE.md](./guides/TESTING_GUIDE.md)** - Testing strategies and best practices
- **[CLEANUP_GUIDE.md](./guides/CLEANUP_GUIDE.md)** - Code cleanup and maintenance
- **[DEPLOYMENT_AND_TESTING_GUIDE.md](./guides/DEPLOYMENT_AND_TESTING_GUIDE.md)** - Combined deployment and testing
- **[FRONTEND_ORGANIZATION_PROPOSAL.md](./guides/FRONTEND_ORGANIZATION_PROPOSAL.md)** - Frontend organization patterns
- **[CLAUDE_CODE_IMPLEMENTATION_PACK.md](./guides/CLAUDE_CODE_IMPLEMENTATION_PACK.md)** - AI-assisted development guide
- **[DESIGN_PACKAGE_FOR_CHATGPT.md](./guides/DESIGN_PACKAGE_FOR_CHATGPT.md)** - Design system for AI tools

### Deployment & Operations

Located in: `docs/deployment/`

- **[START_DEMO.md](./deployment/START_DEMO.md)** - Demo setup instructions
- **[README_DEMO.md](./deployment/README_DEMO.md)** - Demo overview
- **start-demo.sh** - Demo startup script

---

## 📝 Project History & Sessions

### Completed Work Sessions

Located in: `docs/completed-sessions/`

All development sessions and completion reports:

- **SESSION_*.md** - Individual work session summaries
- **PHASE*.md** - Major phase completions
- **TASK_*.md** - Specific task completion reports
- **\*_COMPLETE.md** - Feature completion documentation

**Key Completion Documents:**
- [100_PERCENT_COMPLETE.md](./completed-sessions/100_PERCENT_COMPLETE.md) - Full project completion status
- [AUTHENTICATION_COMPLETE.md](./completed-sessions/AUTHENTICATION_COMPLETE.md) - Authentication system
- [INTEGRATION_COMPLETE.md](./completed-sessions/INTEGRATION_COMPLETE.md) - Frontend-backend integration
- [GOALS_API_COMPLETE.md](./completed-sessions/GOALS_API_COMPLETE.md) - Goals API implementation
- [NOTES_API_COMPLETE.md](./completed-sessions/NOTES_API_COMPLETE.md) - Notes API implementation
- [ARCHIVE_API_COMPLETE.md](./completed-sessions/ARCHIVE_API_COMPLETE.md) - Archive API implementation
- [SEASON_ONBOARDING_AI_COMPLETE.md](./completed-sessions/SEASON_ONBOARDING_AI_COMPLETE.md) - Season onboarding
- [SESSION_COMPLETE.md](./completed-sessions/SESSION_COMPLETE.md) - Session booking system
- [DESKTOP_COMPLETE.md](./completed-sessions/DESKTOP_COMPLETE.md) - Desktop screens
- [AUTO_TASKS_COMPLETE.md](./completed-sessions/AUTO_TASKS_COMPLETE.md) - Automated tasks

---

## 🗄️ Archived Documentation

Located in: `docs/archive/`

Historical documentation and old proposals:

- **OPTION_*.md** - Various implementation options explored
- **STATUS_CHECK.md** - Historical status checks
- **FINAL_STATUS.md** - Historical status reports
- **IMPLEMENTATION_STATUS.md** - Old implementation tracking
- **DESKTOP_SCREENS_PROGRESS.md** - Desktop development progress
- **FRONTEND_ORGANIZATION_PROPOSAL.md** - Frontend reorganization proposal
- **complete-mockups.html** - Design mockups
- **iphone-mockups.html** - Mobile mockups
- **sample-data.json** - Sample data for testing

---

## 🔌 API Documentation

### Main API Docs

Located in: `apps/api/docs/` and `apps/api/`

- **[IMPLEMENTATION_SUMMARY.md](../apps/api/IMPLEMENTATION_SUMMARY.md)** - Complete API overview
- **[BOOKING_CALENDAR_API_DOCUMENTATION.md](./BOOKING_CALENDAR_API_DOCUMENTATION.md)** - Booking system API
- **[API Reference](../apps/api/README.md)** - Detailed endpoint documentation

### Database Documentation

- **[Prisma Schema](../apps/api/prisma/schema.prisma)** - Database schema definition
- **[DATABASE_FORMLER_KOMPLETT.md](./DATABASE_FORMLER_KOMPLETT.md)** - Database formulas and calculations

---

## 🎯 Specific Feature Documentation

Located in: `docs/`

- **[01_STATUS_DASHBOARD.md](./01_STATUS_DASHBOARD.md)** - Status dashboard feature
- **[02_UTVIKLINGSPLAN_KOMPLETT.md](./02_UTVIKLINGSPLAN_KOMPLETT.md)** - Development plan details
- **[00_MASTER_PROSJEKTDOKUMENT.md](./00_MASTER_PROSJEKTDOKUMENT.md)** - Master project document
- **[05_DESIGN_SYSTEM_SETUP.md](./05_DESIGN_SYSTEM_SETUP.md)** - Design system setup
- **[OPPSUMMERING_AUTOMATISERING.md](./OPPSUMMERING_AUTOMATISERING.md)** - Automation summary
- **[OPPRYDDINGSPLAN_DOKUMENTASJON.md](./OPPRYDDINGSPLAN_DOKUMENTASJON.md)** - Documentation cleanup plan
- **[AUTOMATISERING_GUIDE.md](./AUTOMATISERING_GUIDE.md)** - Automation guide
- **[BOOKING_SYSTEM_TESTING_GUIDE.md](./BOOKING_SYSTEM_TESTING_GUIDE.md)** - Booking system testing

---

## 🏗️ Application Structure

### Frontend (`apps/web/`)
- React 18.2 single-page application
- 13 main screens
- Complete design system v2.1
- Authentication integration
- Responsive mobile & desktop

### Backend (`apps/api/`)
- Fastify 4.x API server
- Prisma ORM with PostgreSQL
- 40+ REST endpoints
- JWT authentication
- Multi-tenant architecture

### Design System (`packages/design-system/`)
- Figma design kit
- Design tokens (CSS, JS, Tailwind)
- Component library
- Icon set (Lucide)

---

## 📊 Quick Reference

### Key Technologies
- **Frontend**: React, React Router, Axios, Lucide Icons
- **Backend**: Fastify, Prisma, PostgreSQL, Redis
- **Auth**: JWT, Argon2, Role-based access
- **Infrastructure**: Docker, Docker Compose, pnpm

### Important Commands

```bash
# Start development
cd apps/api && npm run dev          # Backend
cd apps/web && npm start            # Frontend

# Database
npx prisma migrate dev              # Create migration
npx prisma studio                   # GUI for database
npm run prisma:seed                 # Seed demo data

# Testing
npm test                            # Run tests
npm run test:coverage               # Coverage report

# Build
npm run build                       # Build for production
```

---

## 🎓 Learning Path

### For New Developers

1. **Week 1: Setup & Overview**
   - Read [README.md](../README.md)
   - Follow [Quick Start Guide](../apps/api/QUICK_START.md)
   - Explore the application with demo credentials
   - Review [Architecture](./architecture/ARCHITECTURE.md)

2. **Week 2: Frontend**
   - Study [Design System](./architecture/DESIGN_SOURCE_OF_TRUTH.md)
   - Review React components in `apps/web/src/components/`
   - Understand [AuthContext](./completed-sessions/AUTHENTICATION_COMPLETE.md)

3. **Week 3: Backend**
   - Study [API Documentation](../apps/api/IMPLEMENTATION_SUMMARY.md)
   - Review Prisma schema
   - Understand endpoint structure
   - Read [Integration Guide](./completed-sessions/INTEGRATION_COMPLETE.md)

4. **Week 4: Advanced Topics**
   - Multi-tenancy implementation
   - Peer comparison algorithms
   - Training plan generation
   - Booking system logic

---

## 🔍 Need Help?

### Common Questions

- **"How do I start the app?"** → [Quick Start Guide](../apps/api/QUICK_START.md)
- **"How does authentication work?"** → [Auth Complete](./completed-sessions/AUTHENTICATION_COMPLETE.md)
- **"What's the API structure?"** → [API Docs](../apps/api/IMPLEMENTATION_SUMMARY.md)
- **"Where are the designs?"** → [Design System](./architecture/DESIGN_SOURCE_OF_TRUTH.md)
- **"How do I test?"** → [Testing Guide](./guides/TESTING_GUIDE.md)
- **"How do I deploy?"** → [Deployment Guide](./guides/DEPLOYMENT_GUIDE.md)

### Still stuck?

1. Check [Completed Sessions](./completed-sessions/) for feature-specific docs
2. Review [Architecture docs](./architecture/) for system design
3. Look in [Archive](./archive/) for historical context

---

## 📅 Documentation Maintenance

**Last Major Update**: December 17, 2025
**Maintained By**: Development Team
**Update Frequency**: As features are completed

### Documentation Standards

- All new features must include documentation
- Session summaries go in `completed-sessions/`
- Architecture changes require updates to `architecture/`
- API changes must update API docs
- Mark outdated docs and move to `archive/`

---

**📚 Happy coding!**
