# Coach / Admin Journeys

**Status:** Binding Specification
**Version:** 1.0
**Date:** 2025-12-18
**Dependency:** COACH_ADMIN_AUTHORITY_CONTRACT.md

This document defines the end-to-end journeys for Coach and Admin roles.
All journeys MUST comply with the Authority Contract.

This is NOT UI design. This is journey logic and authority-safe flow definition.

---

## PART 1 — COACH JOURNEYS

---

### Journey 1: First-Time Coach Onboarding

**Purpose:** Establish coach relationship with system and athletes while communicating authority boundaries explicitly.

#### Step 1.1: Account Activation

**Action:** Coach receives invitation and creates account.

**What coach sees:**
- Account creation form
- Role confirmation: "You are joining as Coach"
- Explicit statement of authority boundaries

**What coach does NOT see:**
- Any athlete data
- Any performance metrics
- Any system statistics

**Authority boundary communicated:**
> "As a coach, you will see athlete training data and PROOF outcomes. You may create training plans and add observations. You may NOT rank athletes, label performance as good/bad, or modify historical data. Your observations are always clearly separated from system facts."

---

#### Step 1.2: Authority Acknowledgment

**Action:** Coach must explicitly acknowledge authority boundaries before proceeding.

**Required acknowledgment (cannot skip):**
- [ ] I understand I may view athlete data but not modify historical records
- [ ] I understand my observations are labeled as coach opinions, not system facts
- [ ] I understand I may not rank, compare, or label athletes
- [ ] I understand the athlete retains final authority over interpretation of their data

**What happens if not acknowledged:**
- Access denied
- Cannot proceed to athlete data

---

#### Step 1.3: Athlete Assignment

**Action:** Coach is assigned athletes (by admin or system).

**What coach sees:**
- List of assigned athletes (names only)
- Next scheduled session for each (if any)
- No performance data in list view

**What coach does NOT see:**
- Performance metrics in the list
- Any sorting by performance
- Any status indicators (red/yellow/green)
- Any "needs attention" flags

**List presentation:**
- Alphabetical by name (default, immutable)
- No performance column
- No status column

---

#### Step 1.4: First Athlete View

**Action:** Coach selects an athlete to view.

**What coach sees:**
- Athlete name
- Current training plan (if assigned)
- Upcoming sessions
- Link to PROOF history (read-only)
- Link to TRAJECTORY (read-only)
- Area for coach notes (empty)

**What coach does NOT see:**
- Performance summary
- Trend indicators
- Comparison to other athletes
- System-generated insights
- Alerts or flags

**Explicit absence notice:**
> The system does not provide performance summaries or recommendations. You may view raw data and form your own observations.

---

### Journey 2: Daily Coach Workflow

**Purpose:** Enable coach to support athletes without introducing ranking or judgment mechanics.

#### Step 2.1: Session Start

**Action:** Coach opens system at start of work session.

**What coach sees:**
- List of assigned athletes (alphabetical)
- Today's scheduled sessions (if any)
- Recent session completions (binary: completed/not completed)

**What coach does NOT see:**
- Performance leaderboard
- "Who improved most" summary
- Alerts about declining athletes
- Any performance-sorted view

---

#### Step 2.2: Athlete Selection

**Action:** Coach chooses which athlete to review.

**Selection mechanism:**
- Alphabetical list (no performance sort available)
- Filter by: "Has session today" / "All athletes"
- Search by name

**What is NOT available as selection criteria:**
- Performance level
- Recent change direction
- "Needs attention" status
- Time since last coach review

**Authority protection:**
Coach cannot be nudged toward "problem" athletes by system design.

---

#### Step 2.3: Individual Athlete Review

**Action:** Coach reviews individual athlete data.

**Available data:**
- Training plan and upcoming blocks
- Session completion history (dates only, binary status)
- PROOF history (raw numbers, neutral presentation)
- TRAJECTORY (chronological list, no trends)
- Effort accumulation (total hours, session count)
- Coach's own previous notes

**Unavailable data:**
- System interpretation of performance
- Comparison to baseline shown with judgment
- Trend arrows or direction indicators
- Color-coded results
- Performance grades or scores
- Other athletes' data for comparison

**Data presentation rules:**
- PROOF data shown exactly as athlete sees it
- Delta shown as raw number with sign (no color)
- No "better than" / "worse than" language

---

#### Step 2.4: Training Plan Adjustment

**Action:** Coach modifies future training plan.

**What coach can do:**
- Add training blocks to future dates
- Remove unstarted training blocks
- Reorder future blocks
- Add notes to blocks

**What coach cannot do:**
- Modify past sessions
- Change recorded completion status
- Alter PROOF records
- Backdate changes

**Audit trail:**
- All plan changes logged with timestamp
- Athlete can see history of plan modifications
- Original plan preserved in history

---

#### Step 2.5: Note Creation

**Action:** Coach adds observation about athlete.

**Note properties:**
- Clearly labeled: "Coach Note"
- Timestamp and coach name attached
- Stored separately from system data
- Visible to athlete in dedicated section (not in PROOF/TRAJECTORY)

**Note constraints:**
- Cannot be attached to specific PROOF records
- Cannot appear inline with system data
- Cannot use system styling
- Cannot be marked as "system generated"

**Forbidden note content (enforced by policy, not technically blocked):**
- Performance grades
- Comparison to other athletes
- "Good" / "bad" labels
- Predictions

---

### Journey 3: Coach Intervention Moment

**Purpose:** Define what triggers coach action and what information supports the intervention.

#### Step 3.1: Intervention Trigger

**What MAY trigger coach action:**
- Coach's own observation of data patterns
- Direct athlete request for feedback
- Scheduled check-in (calendar-based, not performance-based)
- Training plan milestone reached

**What MUST NOT trigger coach action:**
- System alert about performance decline
- Automated "needs attention" flag
- Performance threshold breach notification
- Comparison-based ranking change

**System prohibition:**
The system MUST NOT generate intervention prompts based on performance data.

---

#### Step 3.2: Information Available at Intervention

**Coach has access to:**
- All PROOF history for this athlete (raw data)
- All TRAJECTORY entries (chronological)
- Training plan and completion status
- Effort totals
- Coach's own previous notes
- Athlete-shared REFLECTION data (if permission granted)

**Coach does NOT have access to:**
- System interpretation of data
- Recommended actions
- Similar athlete patterns
- "What other coaches did"
- Predicted outcomes

---

#### Step 3.3: Intervention Decision

**Coach decides independently:**
- Whether to act
- What action to take
- How to communicate

**System does NOT:**
- Suggest intervention
- Provide talking points
- Recommend plan changes
- Generate athlete summaries

**Coach's options:**
- Modify training plan
- Add coach note
- Initiate communication (external to system)
- Take no action

---

#### Step 3.4: Intervention Documentation

**If coach acts:**
- Action is logged (plan change, note added)
- Timestamp recorded
- Visible to athlete

**What is NOT documented:**
- Coach's reasoning (unless coach chooses to write it)
- System-generated summary of intervention
- Performance context (not attached to intervention record)

---

### Journey 4: Coach Communication Flow

**Purpose:** Define how coach observations reach athlete while maintaining separation from system data.

#### Step 4.1: Communication Creation

**Where coach writes:**
- Dedicated "Coach Notes" area
- Separate from PROOF, TRAJECTORY, SESSION screens
- Clearly labeled interface section

**Communication properties:**
- Free text
- Attached to athlete (not to specific data points)
- Timestamped
- Coach-attributed

---

#### Step 4.2: Communication Storage

**Storage rules:**
- Stored in separate data structure from performance data
- Never merged with PROOF records
- Never appears in TRAJECTORY
- Has own retention policy

**Data separation:**
```
SYSTEM DATA          COACH DATA
─────────────        ─────────────
PROOF records        Coach notes
TRAJECTORY           Coach observations
BASELINE             Plan change history
SESSION logs
```

These are architecturally separate.

---

#### Step 4.3: Communication Delivery to Athlete

**Where athlete sees coach communication:**
- Dedicated "From Your Coach" section
- Never in PROOF screen
- Never in TRAJECTORY screen
- Never inline with performance data

**Presentation requirements:**
- Clear "Coach Note" label
- Coach name visible
- Date visible
- Visually distinct from system UI

**What athlete can do:**
- Read note
- Ignore note
- Disable coach note visibility (if desired)
- Disagree (privately, not tracked)

---

#### Step 4.4: Communication Acknowledgment

**System does NOT:**
- Track whether athlete read the note
- Notify coach of read status
- Prompt athlete to respond
- Create engagement metrics

**Rationale:**
Communication tracking creates pressure. Coach communication is offered, not enforced.

---

## PART 2 — ADMIN JOURNEYS

---

### Journey 5: Admin System Overview

**Purpose:** Provide admin with system health visibility without individual performance access.

#### Step 5.1: Admin Dashboard Entry

**What admin sees by default:**
- Total active users (count)
- Users by subscription tier (counts)
- System health indicators (technical)
- Recent admin actions log

**What admin NEVER sees:**
- Individual athlete names with performance
- Coach-athlete performance data
- PROOF records for any individual
- Ranking of athletes or coaches

---

#### Step 5.2: Aggregate Metrics View

**Available aggregates:**
- Total users by tier
- Total sessions completed (platform-wide count)
- Total coaches active
- Feature usage rates (which features are used, not by whom)

**Unavailable data:**
- Performance distributions
- "Top performers" lists
- "Struggling users" counts
- Any individually identifiable data

**Aggregation rule:**
All admin metrics MUST be aggregate. Minimum group size for any breakdown: 10 users.

---

#### Step 5.3: System Health Review

**Technical visibility:**
- Server status
- Error rates
- API latency
- Database health

**What admin can investigate:**
- Technical errors
- System failures
- Performance bottlenecks (technical, not athletic)

**What admin cannot investigate:**
- Why a specific athlete's score changed
- Whether a coach is "effective"
- Which athletes are improving

---

### Journey 6: Admin Configuration Flow

**Purpose:** Enable admin to configure system without influencing individual athlete experiences.

#### Step 6.1: Feature Flag Management

**Admin can:**
- Enable/disable features globally
- Enable/disable features per tier
- Set feature rollout percentages

**Admin cannot:**
- Enable/disable features for specific users
- Create features that rank athletes
- Enable "coach recommendation" systems
- Configure performance-based notifications

**Feature flag audit:**
All flag changes logged with admin ID and timestamp.

---

#### Step 6.2: Tier Management

**Admin can:**
- Define subscription tiers
- Assign features to tiers
- Set tier pricing (if applicable)
- Modify tier definitions

**Admin cannot:**
- See which specific users are in which tier (only counts)
- Manually move users between tiers (handled by subscription system)
- Create tiers that grant ranking capabilities

**Tier authority constraint:**
No tier may grant abilities that violate Authority Contract.

---

#### Step 6.3: Coach Account Management

**Admin can:**
- Create coach accounts
- Deactivate coach accounts
- Reset coach credentials
- View coach account status (active/inactive)

**Admin cannot:**
- See coach's athlete list
- See coach's notes
- See performance data through coach account
- Evaluate coach "effectiveness"

**Coach management is account-level only, not content-level.**

---

### Journey 7: Admin Escalation Handling

**Purpose:** Define admin response to system issues while maintaining privacy boundaries.

#### Step 7.1: Issue Detection

**How admin learns of issues:**
- System monitoring alerts (technical)
- User support tickets
- Coach-reported problems
- Automated error detection

**What triggers admin involvement:**
- Technical failures
- Account access issues
- Billing problems
- Feature malfunctions

**What does NOT trigger admin involvement:**
- Athlete performance concerns
- Coach-athlete relationship issues
- "Poor" athlete outcomes

---

#### Step 7.2: Issue Investigation

**Admin can inspect:**
- System logs (anonymized where possible)
- Error traces
- API call patterns
- Database queries

**Admin cannot inspect:**
- Specific athlete's PROOF data to debug
- Coach notes content
- Athlete REFLECTION content
- Performance patterns

**If issue requires athlete data inspection:**
- Explicit athlete consent required
- Inspection logged
- Minimum necessary data accessed
- Data not retained after resolution

---

#### Step 7.3: Issue Resolution

**Admin can:**
- Fix technical configuration
- Reset account states
- Restore system functionality
- Communicate system status

**Admin cannot:**
- Modify athlete data to "fix" perceived issues
- Change PROOF records
- Alter training histories
- Adjust performance data

**Resolution audit:**
All admin actions during escalation logged and reviewable.

---

## PART 3 — AUTHORITY STRESS TESTS

For each journey, identify highest-risk point and mitigation.

---

### Journey 1: First-Time Coach Onboarding

**Highest authority risk:**
Step 1.3 (Athlete Assignment) — Coach sees athlete list for first time.

**Risk:** List presentation could imply some athletes need more attention than others through visual hierarchy.

**Mitigation:**
- Alphabetical sort only (no performance indicators)
- No visual differentiation between athletes
- All rows identical in styling
- No "new" badges, no "active" badges, no badges at all

---

### Journey 2: Daily Coach Workflow

**Highest authority risk:**
Step 2.3 (Individual Athlete Review) — Coach views performance data.

**Risk:** Coach could mentally rank athletes as they review each one, building internal hierarchy.

**Mitigation:**
- No comparative language in any view
- No "better than baseline" celebration
- No "worse than baseline" warning
- Delta shown as pure number with sign
- Coach cannot export data for side-by-side comparison

---

### Journey 3: Coach Intervention Moment

**Highest authority risk:**
Step 3.1 (Intervention Trigger) — What causes coach to act.

**Risk:** System could subtly nudge coach toward certain athletes through notification design or view ordering.

**Mitigation:**
- ZERO performance-based notifications
- ZERO performance-based sorting
- Scheduled check-ins only (calendar-based)
- Coach initiates all interventions, system never prompts

---

### Journey 4: Coach Communication Flow

**Highest authority risk:**
Step 4.3 (Communication Delivery to Athlete) — Where note appears.

**Risk:** If coach note appears near PROOF data, athlete might perceive it as system-endorsed interpretation.

**Mitigation:**
- Architectural separation: coach notes in completely separate section
- Never rendered adjacent to PROOF
- Never shares visual styling with system data
- Clear "Coach Note" label always visible

---

### Journey 5: Admin System Overview

**Highest authority risk:**
Step 5.2 (Aggregate Metrics View) — Admin sees platform statistics.

**Risk:** Aggregates could be sliced in ways that reveal individual performance (e.g., "1 user in coach_team tier with declining scores").

**Mitigation:**
- Minimum aggregation size: 10 users
- No performance data in admin view, ever
- Aggregates limited to: count, tier, feature usage
- No performance breakdowns, no trend data

---

### Journey 6: Admin Configuration Flow

**Highest authority risk:**
Step 6.1 (Feature Flag Management) — Admin enables features.

**Risk:** Admin could enable a feature that violates Authority Contract (e.g., if such feature were built despite contract).

**Mitigation:**
- Feature definitions include Authority Contract compliance flag
- Features that would violate contract cannot be built
- Feature enable requires compliance check
- Audit trail for all flag changes

---

### Journey 7: Admin Escalation Handling

**Highest authority risk:**
Step 7.2 (Issue Investigation) — Admin investigates problem.

**Risk:** Admin claims "debugging" but actually inspects athlete performance data.

**Mitigation:**
- Athlete data access requires explicit consent
- All data access logged with justification
- Minimum necessary data principle enforced
- Data not retained after incident closed
- Regular audit of escalation data access

---

## SUMMARY: Authority Checkpoints

| Journey | Risk Point | Protection |
|---------|-----------|------------|
| Coach Onboarding | First athlete list view | Alphabetical only, no indicators |
| Daily Workflow | Individual data review | No comparative language, neutral delta |
| Intervention | What triggers action | Zero performance-based prompts |
| Communication | Where note appears | Separate section, separate styling |
| Admin Overview | Aggregate metrics | Min 10 users, no performance data |
| Admin Config | Feature enablement | Compliance flag required |
| Admin Escalation | Investigation access | Consent + logging + retention limits |

---

## COMPLIANCE

All journey implementations MUST be verified against:
- This document (journey logic)
- COACH_ADMIN_AUTHORITY_CONTRACT.md (authority rules)
- IMPLEMENTATION_CONTRACT.md (golfer experience rules)

Journey implementations that create paths to Authority Contract violations are blocking issues.
