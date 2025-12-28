# Schedule A: Service Description

**IUP Golf Academy Platform**
**Version:** 1.0
**Effective Date:** [TBD]
**Document Status:** Draft for Review

---

## 1. SERVICE OVERVIEW

### 1.1 Platform Description

IUP Golf Academy ("Platform") is a cloud-based software-as-a-service (SaaS) application designed for systematic golf player development. The Platform follows the Team Norway IUP (Individuell UtviklingsPlan) methodology and provides tools for players, coaches, and administrators.

### 1.2 Intended Use

The Platform is designed for:
- Golf academies and clubs
- Golf federations (national/regional)
- Individual golf coaches
- Junior and elite golf development programs

### 1.3 Core Value Proposition

| Stakeholder | Value Delivered |
|-------------|-----------------|
| Players | Systematic development tracking, gamification, ownership of data |
| Coaches | Efficient athlete management without ranking/judgment mechanics |
| Organizations | Scalable talent development, data insights, standardized methodology |

---

## 2. PLATFORM COMPONENTS

### 2.1 Applications

| Component | Description | Access |
|-----------|-------------|--------|
| Web Application | Primary interface for all users | Browser (responsive) |
| Mobile Application | iOS/Android native wrapper | App stores |
| API | RESTful backend services | Authenticated requests |
| Admin Portal | Organization management | Web browser |

### 2.2 User Roles

| Role | Description | Capabilities |
|------|-------------|--------------|
| **Player** | Athlete using the platform | Full access to own data, training, tests, achievements |
| **Coach** | Trainer assigned to players | View player data, edit training plans, add notes |
| **Admin** | Organization administrator | User management, tier configuration, system oversight |
| **Super Admin** | Platform administrator | Multi-tenant management, feature flags |

---

## 3. FUNCTIONAL SPECIFICATIONS

### 3.1 Player Features

#### 3.1.1 Dashboard
- Personalized overview with widgets
- Daily tasks and training schedule
- Recent achievements and streaks
- Messages from coach
- Progress indicators

#### 3.1.2 Training Management
- **Annual Plan**: Periodized training following E/G/S/T phases
  - E (Establish): Building fundamentals
  - G (Grow): Developing consistency
  - S (Strengthen): Refining and optimizing
  - T (Tournament): Competition preparation
- **Daily Training**: Session execution with real-time tracking
- **Exercise Library**: Searchable database of exercises
- **Training Diary**: Personal notes and reflections

#### 3.1.3 Testing System
- 20+ standardized test protocols
- Categories covered:
  - Physical tests (strength, endurance, mobility)
  - Golf-specific tests (speed, distance, accuracy)
  - Mental tests (pressure performance, consistency)
- Benchmark comparison by category (A-K)
- Historical tracking and trend visualization

#### 3.1.4 A-K Category System (Team Norway)

| Category | Name | Description |
|----------|------|-------------|
| A | Driver | Driving distance and accuracy |
| B | Long Game | Fairway woods and long irons |
| C | Approach | Iron play to greens |
| D | Short Game | Pitching and chipping |
| E | Bunker | Sand play |
| F | Putting | Green performance |
| G | Course Management | Strategy and decision making |
| H | Mental Game | Focus and pressure handling |
| I | Physical Fitness | Strength, flexibility, endurance |
| J | Practice Quality | Training effectiveness |
| K | Competition | Tournament performance |

#### 3.1.5 Gamification
- **85 Badges** across categories:
  - Volume badges (hours, sessions, swings)
  - Strength badges (tonnage, PRs)
  - Performance badges (speed, accuracy, scoring)
  - Consistency badges (streaks, compliance)
- **XP System**: Points accumulation with level progression
- **Category Scaling**: Adjusted requirements by player category

#### 3.1.6 Additional Features
- Goal setting and tracking
- Tournament calendar and results
- School schedule integration
- Video/photo evidence upload
- Personal notes
- Calendar view

### 3.2 Coach Features

#### 3.2.1 Athlete Management
- **Athlete List**: Alphabetically sorted, neutral presentation
- **Athlete Detail**: Navigation hub to approved tools
- **Training Plan Editor**: Create and modify training plans
- **Proof Viewer**: Review uploaded videos and photos

#### 3.2.2 Authority Contract Compliance
The Platform enforces strict authority boundaries:

| Coach CAN | Coach CANNOT |
|-----------|--------------|
| View athlete training data | Rank or compare athletes |
| Edit future training plans | Modify historical records |
| Add coach notes (clearly labeled) | Label performance as good/bad |
| View chronological progress | See system-generated recommendations |
| Communicate with athletes | Access athletes' private reflections |

#### 3.2.3 Coach Intelligence
- Automated alerts (opt-in):
  - Missed sessions
  - Milestone achievements
  - Engagement patterns
- All alerts are informational, not prescriptive

#### 3.2.4 Communication
- Messaging system (in-app)
- Notes attached to athlete profiles
- Clear separation from system data

### 3.3 Admin Features

#### 3.3.1 System Overview
- Environment status (Production/Staging)
- Version information
- Uptime metrics
- Active feature flags

#### 3.3.2 User Management
- Create/deactivate coach accounts
- Reset credentials
- View account status
- **No access to individual athlete data**

#### 3.3.3 Tier Management
- Define subscription tiers
- Assign features to tiers
- Configure pricing (if applicable)

#### 3.3.4 Feature Flags
- Enable/disable features globally
- A/B testing configuration
- Gradual rollout controls

#### 3.3.5 Aggregated Metrics Only
Admin view is limited to:
- Total users by tier (counts)
- Platform-wide session counts
- Feature usage rates (not by whom)
- **Minimum aggregation size: 10 users**

---

## 4. VIDEO ANALYSIS PLATFORM

### 4.1 Current Status
Infrastructure complete; UI under development.

### 4.2 Planned Features

| Feature | Description | Status |
|---------|-------------|--------|
| Video Upload | S3 multipart upload, max 5 minutes | Complete |
| Thumbnail Generation | Automatic on upload | Complete |
| Metadata Extraction | Duration, resolution | Complete |
| Custom Player | Slow-motion, frame-by-frame | In Progress |
| Annotation Tools | Line, circle, arrow, angle, freehand | In Progress |
| Voice-over | Audio recording synced to video | Planned |
| Side-by-side Comparison | Synchronized playback | Planned |
| Progress Timeline | Visual swing evolution over time | Planned |

### 4.3 Estimated Completion
8-10 weeks from contract signing.

---

## 5. TECHNICAL SPECIFICATIONS

### 5.1 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    IUP Golf Platform                         │
├─────────────────────────────────────────────────────────────┤
│   Frontend (React 18)  →  API (Fastify/Node.js)             │
│                              ↓                               │
│         PostgreSQL 16  |  Redis 7  |  AWS S3                │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Frontend | React | 18.x |
| Mobile | Capacitor | 6.x |
| Backend | Node.js / Fastify | 20.x / 4.x |
| Database | PostgreSQL | 16.x |
| ORM | Prisma | 5.x |
| Cache | Redis | 7.x |
| File Storage | AWS S3 | - |
| Authentication | JWT + TOTP | - |

### 5.3 Multi-Tenant Architecture

Each organization (tenant) has complete data isolation:
- All database queries scoped by `tenant_id`
- No cross-tenant data access possible
- Separate S3 prefixes per tenant
- Independent feature flag configurations

### 5.4 API Metrics

| Metric | Value |
|--------|-------|
| Total Endpoints | 70+ |
| Test Coverage | 45%+ |
| Test Cases | 240+ |
| Security Rating | A- (Excellent) |

---

## 6. INTEGRATION CAPABILITIES

### 6.1 Current Integrations

| System | Status | Description |
|--------|--------|-------------|
| Email (SMTP) | Implemented | Transactional emails |
| AWS S3 | Implemented | File storage |
| Sentry | Implemented | Error monitoring |

### 6.2 Planned Integrations

| System | Status | Description |
|--------|--------|-------------|
| Trackman | Roadmap | Swing data import |
| GC Quad | Roadmap | Launch monitor data |
| Golf Genius | Roadmap | Tournament data |
| GolfBox | Roadmap | Handicap/member data |

### 6.3 API Access

Third-party integrations via:
- REST API with API key authentication
- Webhook notifications (planned)
- Data export endpoints

---

## 7. PLATFORM AVAILABILITY

### 7.1 Target Service Levels

| Metric | Target |
|--------|--------|
| Uptime | 99.5% |
| Response Time (p95) | < 200ms |
| Error Rate | < 0.1% |

### 7.2 Maintenance Windows

- Scheduled maintenance: Sundays 02:00-06:00 CET
- Advance notice: 48 hours minimum
- Emergency maintenance: As required with immediate notification

### 7.3 Support Channels

| Channel | Response Time |
|---------|---------------|
| Email | 24 hours (business days) |
| In-app support | 48 hours |
| Critical issues | 4 hours |

---

## 8. BROWSER AND DEVICE SUPPORT

### 8.1 Web Application

| Browser | Minimum Version |
|---------|-----------------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

### 8.2 Mobile Application

| Platform | Minimum Version |
|----------|-----------------|
| iOS | 14.0+ |
| Android | 10+ (API 29) |

---

## 9. LOCALIZATION

### 9.1 Current Languages
- Norwegian (Bokmål) - Primary
- English - Secondary

### 9.2 Date/Time
- Timezone: User-configurable, default Europe/Oslo
- Date format: DD.MM.YYYY (Norwegian) / YYYY-MM-DD (ISO)

### 9.3 Measurement Units
- Distance: Meters (configurable to yards)
- Speed: km/h (configurable to mph)
- Weight: Kilograms

---

## 10. UPDATES AND VERSIONING

### 10.1 Release Cycle
- Major releases: Quarterly
- Minor releases: Bi-weekly
- Patches: As needed

### 10.2 Backward Compatibility
- API versioning (v1, v2, etc.)
- Deprecation notice: 6 months minimum
- Migration support provided

### 10.3 Change Notification
- Release notes published for each update
- Breaking changes communicated 30 days in advance

---

## 11. APPENDICES

### Appendix A: Test Protocol Summary

| Test ID | Name | Category | Metric |
|---------|------|----------|--------|
| 1 | Driver Carry | A | Meters |
| 2 | 7-Iron Carry | C | Meters |
| 3 | 7-Iron Accuracy | C | Meters from target |
| 4 | Wedge PEI | D | Precision index |
| 5 | Clubhead Speed | A | km/h |
| 6 | Ball Speed | A | km/h |
| 7 | Smash Factor | A | Ratio |
| 12 | Bench Press | I | 1RM kg |
| 13 | Trap Bar Deadlift | I | 1RM kg |
| 14 | 3000m Run | I | Time (mm:ss) |

### Appendix B: Badge Categories

| Category | Count | Examples |
|----------|-------|----------|
| Volume | 20+ | Hours trained, sessions completed |
| Strength | 15+ | Tonnage lifted, PRs set |
| Performance | 20+ | Speed milestones, accuracy |
| Phase | 10+ | Phase compliance, annual plan completion |
| Consistency | 10+ | Streaks, perfect weeks |

---

**Document Control**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-27 | Generated from codebase | Initial draft |

---

*This document describes the IUP Golf Academy Platform as implemented. Specifications are based on actual codebase analysis and may be updated as the platform evolves.*
