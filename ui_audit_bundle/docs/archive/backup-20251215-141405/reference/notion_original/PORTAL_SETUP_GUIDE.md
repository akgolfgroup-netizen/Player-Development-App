# Portal System Setup Guide
## AK Golf Academy × Team Norway Golf - IUP System

**Version**: 1.0
**Date**: December 14, 2025

---

## Overview

This guide explains how to set up the dual-portal system:
- **Player Portal**: Individual player access (view-only + self-logging)
- **Coach Portal**: Full administrative access for coaches

---

## Architecture

```
┌─────────────────────────────────────────────┐
│         NOTION WORKSPACE                     │
│                                              │
│  ┌────────────────────────────────────┐    │
│  │     11 Core Databases              │    │
│  │  1. SPILLERE                       │    │
│  │  2. PERIODISERING                  │    │
│  │  3. TRENINGSØKTER                  │    │
│  │  4. ØVELSER                        │    │
│  │  5. TESTER                         │    │
│  │  6. TURNERINGER                    │    │
│  │  7. BENCHMARKING                   │    │
│  │  8. UKEPLANER_TEMPLATES            │    │
│  │  9. BRUDDPUNKTER                   │    │
│  │ 10. PROGRESJON_LOGG                │    │
│  │ 11. REFERANSER                     │    │
│  └────────────────────────────────────┘    │
│                                              │
│  ┌──────────────┐      ┌──────────────┐    │
│  │ Player Pages │      │ Coach Pages  │    │
│  │ (Filtered)   │      │ (Full Access)│    │
│  └──────────────┘      └──────────────┘    │
└─────────────────────────────────────────────┘
         │                        │
         ▼                        ▼
  ┌─────────────┐         ┌─────────────┐
  │   PLAYER    │         │    COACH    │
  │   PORTAL    │         │   PORTAL    │
  │  (Mobile)   │         │  (Desktop)  │
  └─────────────┘         └─────────────┘
```

---

## Step 1: Notion Workspace Setup

### 1.1 Create Workspace
1. Create new Notion workspace: **"AK Golf Academy IUP"**
2. Set workspace type: **Team**
3. Enable following features:
   - Member permissions
   - Database templates
   - API access (for future app integration)

### 1.2 Create Team Structure
- **Owner**: Anders Knutsen
- **Admin Team**: Coaches (full access)
- **Member Team**: Players (filtered access)

---

## Step 2: Database Creation

### 2.1 Import Database Schemas
Use the provided JSON schema files to create each database:

1. **SPILLERE** (`01_SPILLERE_schema.json`)
2. **PERIODISERING** (`02_PERIODISERING_schema.json`)
3. **TRENINGSØKTER** (`03_TRENINGSOKTER_schema.json`)
4. **ØVELSER** (`04_OVELSER_schema.json`)
5. **TESTER** (`05_TESTER_schema.json`)
6. **TURNERINGER** (`06_TURNERINGER_schema.json`)
7. **BENCHMARKING** (`07_BENCHMARKING_schema.json`)
8. **UKEPLANER_TEMPLATES** (`08_UKEPLANER_TEMPLATES_schema.json`)
9. **BRUDDPUNKTER** (`09_BRUDDPUNKTER_schema.json`)
10. **PROGRESJON_LOGG** (`10_PROGRESJON_LOGG_schema.json`)
11. **REFERANSER** (`11_REFERANSER_schema.json`)

### 2.2 Set Up Relations
Connect databases using Notion's relation property:
- SPILLERE ↔ PERIODISERING
- SPILLERE ↔ TESTER
- PERIODISERING ↔ TRENINGSØKTER
- TRENINGSØKTER ↔ ØVELSER
- etc. (as defined in schemas)

---

## Step 3: Player Portal Setup

### 3.1 Create Player Dashboard Page
**Template**: `/templates/player_dashboard.notion`

**Structure**:
```
📱 Player Dashboard
├── 👋 Welcome [Player Name]
├── 📊 Current Week Overview
├── 🏋️ This Week's Sessions
├── 📈 My Progress (Last 30 days)
├── 🎯 Latest Test Results
├── 📅 Next Benchmark Week
├── 🏆 Upcoming Tournaments
└── ⚠️ Breaking Points Focus
```

### 3.2 Configure Filters
For each player, create filtered database views:

**Example for "Player A"**:
```
SPILLERE: Filter → Navn = "Player A"
PERIODISERING: Filter → Spiller.Navn = "Player A"
TRENINGSØKTER: Filter → Spiller (via PERIODISERING) = "Player A"
TESTER: Filter → Spiller.Navn = "Player A"
```

### 3.3 Set Permissions
- **View**: All databases (filtered to own data)
- **Edit**: PROGRESJON_LOGG (own entries only)
- **Create**: PROGRESJON_LOGG, Notes
- **Delete**: None

### 3.4 Mobile Optimization
- Enable Notion mobile app
- Create quick-action buttons:
  - "Log Today's Session"
  - "View This Week"
  - "My Test Results"

---

## Step 4: Coach Portal Setup

### 4.1 Create Coach Dashboard Page
**Template**: `/templates/coach_dashboard.notion`

**Structure**:
```
💼 Coach Dashboard
├── 📊 Overview Stats
│   ├── Active Players: [Count]
│   ├── Players per Category: [Chart]
│   ├── This Week Sessions: [Count]
│   └── Upcoming Events: [Count]
├── 👥 All Players Grid
│   └── [Sortable table with quick actions]
├── 🧪 This Week's Benchmarks
├── 🏆 Upcoming Tournaments (4 weeks)
├── ⚡ Player Progress Alerts
├── 📈 Category Distribution Chart
└── 🔧 Quick Actions
    ├── + Add New Player
    ├── + Create Session
    ├── + Schedule Benchmark
    └── + Add Tournament
```

### 4.2 Configure Full Access Views
Create master views for all databases:
- All Players (sortable, filterable)
- All Sessions (by category, period, L-phase)
- All Exercises (by type, setting)
- All Tests (by player, date)
- Analytics Dashboard

### 4.3 Set Permissions
- **View**: All databases (no filters)
- **Edit**: All databases
- **Create**: All databases
- **Delete**: All except SPILLERE master entries

### 4.4 Batch Operation Templates
Create template pages for:
- Bulk session assignment
- Multi-player plan copying
- Mass test result import
- Category progression workflow

---

## Step 5: Automation Setup

### 5.1 Notion Automations
Set up automatic actions:

**When player is created**:
→ Generate 52-week PERIODISERING entries
→ Assign default week template based on category
→ Create first benchmark week reminder

**When benchmark week arrives**:
→ Send notification to coach
→ Send notification to player
→ Generate test checklist

**When test results entered**:
→ Calculate vs. category requirements
→ Auto-detect breaking points
→ Update player dashboard

**When session marked complete**:
→ Update progress log
→ Calculate weekly completion rate
→ Send summary to coach (if < 70% completion)

### 5.2 Notification Rules
**Player notifications**:
- New session assigned
- Benchmark week reminder (3 days before)
- Tournament reminder (1 week before)
- Coach note added

**Coach notifications**:
- Player missed 3+ sessions
- Test results ready for review
- Player ready for category upgrade
- Breaking point identified

---

## Step 6: Mobile App Configuration

### 6.1 Notion Mobile Setup
1. Install Notion mobile app
2. Enable offline access for:
   - Current week sessions
   - Progress log
3. Create home screen widgets:
   - Today's session
   - Weekly progress

### 6.2 Quick Capture Templates
Create mobile-friendly templates:
- **Session Log**: Quick note entry
- **Test Result**: Number input form
- **Coach Note**: Text + photo

---

## Step 7: Security & Privacy

### 7.1 Access Control
```
PLAYER ACCESS MATRIX:
┌─────────────────┬──────┬──────┬────────┬────────┐
│ Database        │ View │ Edit │ Create │ Delete │
├─────────────────┼──────┼──────┼────────┼────────┤
│ Own Profile     │  ✅  │  ❌  │   ❌   │   ❌   │
│ Own Plan        │  ✅  │  ❌  │   ❌   │   ❌   │
│ Own Sessions    │  ✅  │  ❌  │   ❌   │   ❌   │
│ Own Tests       │  ✅  │  ❌  │   ❌   │   ❌   │
│ Progress Log    │  ✅  │  ✅  │   ✅   │   ❌   │
│ Exercise Library│  ✅  │  ❌  │   ❌   │   ❌   │
│ Other Players   │  ❌  │  ❌  │   ❌   │   ❌   │
└─────────────────┴──────┴──────┴────────┴────────┘

COACH ACCESS MATRIX:
┌─────────────────┬──────┬──────┬────────┬────────┐
│ Database        │ View │ Edit │ Create │ Delete │
├─────────────────┼──────┼──────┼────────┼────────┤
│ All Databases   │  ✅  │  ✅  │   ✅   │   ✅   │
└─────────────────┴──────┴──────┴────────┴────────┘
```

### 7.2 Data Privacy
- Players can only see their own data
- No cross-player visibility
- Coach notes marked private stay hidden from players
- Test results shared with player after coach review

---

## Step 8: Testing & Launch

### 8.1 Testing Phase
1. **Create 2-3 test players** (different categories)
2. **Build 12-week plan** for each
3. **Assign sessions** and test filtering
4. **Test mobile access** on player accounts
5. **Verify automation triggers**
6. **Test batch operations** (coach portal)

### 8.2 Launch Checklist
- [ ] All 11 databases created
- [ ] Relations properly connected
- [ ] Player dashboard template ready
- [ ] Coach dashboard functional
- [ ] Permissions configured correctly
- [ ] Automations tested
- [ ] Mobile app configured
- [ ] Initial templates loaded (Week Templates 1-10)
- [ ] Exercise library seeded (Phase 1: 20+ exercises)
- [ ] User training materials prepared

### 8.3 Training
**For Players** (30 min):
- How to view weekly plan
- How to log session completion
- How to view test results
- How to use mobile app

**For Coaches** (2 hours):
- Player management
- Plan building
- Session scheduling
- Test recording
- Analytics review
- Batch operations

---

## Step 9: Ongoing Maintenance

### 9.1 Weekly Tasks
- Review player progress logs
- Update upcoming tournaments
- Prepare benchmark week materials
- Check automation health

### 9.2 Monthly Tasks
- Review analytics
- Update exercise library
- Create new session templates
- Player progress reviews

### 9.3 Quarterly Tasks
- System backup
- Permission audit
- Template library cleanup
- Category progression reviews

---

## Appendix A: Database Import Priority

**Phase 1** (Week 1-2):
1. SPILLERE
2. PERIODISERING
3. TESTER
4. BENCHMARKING
5. TURNERINGER

**Phase 2** (Week 3-4):
6. TRENINGSØKTER (Initial 20)
7. ØVELSER (Initial 100)
8. UKEPLANER_TEMPLATES (Initial 10)

**Phase 3** (Week 5-6):
9. BRUDDPUNKTER
10. PROGRESJON_LOGG
11. REFERANSER
12. Complete TRENINGSØKTER (150 total)
13. Complete ØVELSER (300+ total)
14. Complete UKEPLANER_TEMPLATES (88 total)

---

## Appendix B: Required Notion Features

- **Plan**: Team Plan or Enterprise
- **Features**:
  - Advanced permissions
  - Database relations
  - Formula fields
  - Automations
  - API access
  - Member management

---

## Support & Documentation

**Internal Documentation**: `/Docs/` folder
**Video Tutorials**: Create for each major function
**Quick Reference**: Laminated cards for coaches
**Player Onboarding**: Welcome packet with login instructions

---

**Setup Complete!**
Ready for Phase 1 database population.
