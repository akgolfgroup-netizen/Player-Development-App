# Coach / Admin Screen Responsibility Contract

**Status:** Binding Contract
**Version:** 1.0
**Date:** 2025-12-18
**Dependencies:**
- COACH_ADMIN_AUTHORITY_CONTRACT.md
- COACH_ADMIN_JOURNEYS.md
- IMPLEMENTATION_CONTRACT.md

This document defines the responsibility, scope, and hard constraints of each Coach and Admin screen.

This is NOT UI design. This is NOT layout. This is screen-level authority definition.

All implementations MUST comply with this document.

---

## PART 1 — COACH SCREENS

---

### Screen: COACH_ATHLETE_LIST

**Screen ID:** CAL

**Purpose:** Present coach's assigned athletes without ranking or performance indication.

#### What This Screen MAY Show

| ID | Element | Constraint |
|----|---------|------------|
| CAL-01 | Athlete names | Required |
| CAL-02 | Next scheduled session date | Optional, date only |
| CAL-03 | Last session completion date | Optional, date only |
| CAL-04 | Total assigned athletes count | As header statistic |
| CAL-05 | Search/filter by name | Text search only |
| CAL-06 | Filter: "Has session today" | Binary filter |

#### What This Screen MUST NOT Show

| ID | Forbidden Element | Rationale |
|----|-------------------|-----------|
| CAL-N01 | Performance metrics | Authority Contract CA-N1 |
| CAL-N02 | Performance-based sorting | Authority Contract CA-N1 |
| CAL-N03 | Status indicators (red/yellow/green) | Authority Contract FA-L2 |
| CAL-N04 | "Needs attention" badges | Authority Contract FA-L5 |
| CAL-N05 | Trend arrows | Authority Contract FA-L2 |
| CAL-N06 | Last PROOF result | Would enable implicit ranking |
| CAL-N07 | Comparison to baseline | Would enable implicit ranking |
| CAL-N08 | Any numerical performance data | Authority Contract CA-N1 |

#### Allowed Coach Decisions

| ID | Decision |
|----|----------|
| CAL-D01 | Select athlete to view |
| CAL-D02 | Filter list by name |
| CAL-D03 | Filter by session status |

#### Forbidden Coach Actions

| ID | Forbidden Action |
|----|------------------|
| CAL-F01 | Sort by performance |
| CAL-F02 | Bulk select for comparison |
| CAL-F03 | Export list with performance data |
| CAL-F04 | Create athlete groups by performance |

#### Presentation Rules

- CAL-P01: Default sort MUST be alphabetical by name
- CAL-P02: Sort order MUST NOT be changeable to performance-based
- CAL-P03: All athlete rows MUST have identical visual treatment
- CAL-P04: No row may have visual emphasis over another

---

### Screen: COACH_ATHLETE_DETAIL

**Screen ID:** CAD

**Purpose:** Present individual athlete's training context and data without system interpretation.

#### What This Screen MAY Show

| ID | Element | Constraint |
|----|---------|------------|
| CAD-01 | Athlete name | Required |
| CAD-02 | Current training plan | Structure only |
| CAD-03 | Upcoming sessions | Date and block name |
| CAD-04 | Session completion history | Date + binary status |
| CAD-05 | Effort totals | Hours, session count |
| CAD-06 | Link to PROOF Viewer | Navigation only |
| CAD-07 | Link to TRAJECTORY Viewer | Navigation only |
| CAD-08 | Coach's own previous notes | Clearly labeled |
| CAD-09 | Baseline value | Read-only, raw number |

#### What This Screen MUST NOT Show

| ID | Forbidden Element | Rationale |
|----|-------------------|-----------|
| CAD-N01 | Performance summary | System interpretation forbidden |
| CAD-N02 | Trend indicators | Authority Contract FA-L2 |
| CAD-N03 | "Progress" language | Authority Contract G-L1 |
| CAD-N04 | Comparison to other athletes | Authority Contract FA-R5 |
| CAD-N05 | System recommendations | Authority Contract SYS-N4 |
| CAD-N06 | Performance grades | Authority Contract CA-N3 |
| CAD-N07 | "On track" / "Off track" status | Authority Contract FA-L1 |
| CAD-N08 | Color-coded performance | Authority Contract FA-L2 |
| CAD-N09 | Coach effectiveness metrics | Admin boundary violation |

#### Allowed Coach Decisions

| ID | Decision |
|----|----------|
| CAD-D01 | Navigate to PROOF Viewer |
| CAD-D02 | Navigate to TRAJECTORY Viewer |
| CAD-D03 | Navigate to Training Plan Editor |
| CAD-D04 | Add coach note |

#### Forbidden Coach Actions

| ID | Forbidden Action |
|----|------------------|
| CAD-F01 | Modify historical session records |
| CAD-F02 | Change baseline value |
| CAD-F03 | Add system-styled content |
| CAD-F04 | Mark athlete with status label |

---

### Screen: COACH_TRAINING_PLAN

**Screen ID:** CTP

**Purpose:** Enable coach to create and modify future training plans without altering history.

#### What This Screen MAY Show

| ID | Element | Constraint |
|----|---------|------------|
| CTP-01 | Training plan structure | Blocks, dates |
| CTP-02 | Future scheduled blocks | Editable |
| CTP-03 | Past completed blocks | Read-only, completion status only |
| CTP-04 | Block details | Name, description, duration |
| CTP-05 | Plan change history | Audit trail |

#### What This Screen MUST NOT Show

| ID | Forbidden Element | Rationale |
|----|-------------------|-----------|
| CTP-N01 | Performance outcomes of past blocks | PROOF is separate |
| CTP-N02 | Recommended block sequences | System interpretation forbidden |
| CTP-N03 | "Effective" block indicators | Would imply judgment |
| CTP-N04 | Comparison to other athletes' plans | Authority Contract FA-R5 |
| CTP-N05 | AI-generated plan suggestions | Authority Contract FA-A6 |

#### Allowed Coach Decisions

| ID | Decision |
|----|----------|
| CTP-D01 | Add block to future date |
| CTP-D02 | Remove unstarted block |
| CTP-D03 | Reorder future blocks |
| CTP-D04 | Edit block content (future only) |
| CTP-D05 | Duplicate block to new date |

#### Forbidden Coach Actions

| ID | Forbidden Action |
|----|------------------|
| CTP-F01 | Modify past block records |
| CTP-F02 | Change past completion status |
| CTP-F03 | Backdate new blocks |
| CTP-F04 | Delete completed blocks from history |
| CTP-F05 | Import "successful" plans from other athletes |

#### Audit Requirements

- CTP-A01: All plan changes MUST be logged
- CTP-A02: Original plan state MUST be preserved
- CTP-A03: Athlete MUST be able to see change history

---

### Screen: COACH_PROOF_VIEWER

**Screen ID:** CPV

**Purpose:** Enable coach to view athlete's PROOF data without modification or annotation.

#### What This Screen MAY Show

| ID | Element | Constraint |
|----|---------|------------|
| CPV-01 | PROOF records | Identical to athlete view |
| CPV-02 | Test name | As in PROOF |
| CPV-03 | Test date | As in PROOF |
| CPV-04 | Current value | Raw number |
| CPV-05 | Baseline value | Raw number |
| CPV-06 | Delta | Raw number with sign |

#### What This Screen MUST NOT Show

| ID | Forbidden Element | Rationale |
|----|-------------------|-----------|
| CPV-N01 | Coach interpretation inline | Authority Contract CB-P4 |
| CPV-N02 | Color-coded results | Authority Contract FA-L2 |
| CPV-N03 | "Good" / "Bad" labels | Authority Contract CB-L1 |
| CPV-N04 | Trend analysis | Authority Contract SYS-N7 |
| CPV-N05 | Comparison to other athletes | Authority Contract FA-R5 |
| CPV-N06 | System insights | Authority Contract FA-A4 |
| CPV-N07 | Coach annotation interface | PROOF is read-only |

#### Allowed Coach Decisions

| ID | Decision |
|----|----------|
| CPV-D01 | Select PROOF record to view |
| CPV-D02 | Navigate between records |
| CPV-D03 | Return to athlete detail |

#### Forbidden Coach Actions

| ID | Forbidden Action |
|----|------------------|
| CPV-F01 | Modify any PROOF data |
| CPV-F02 | Add annotation to PROOF |
| CPV-F03 | Export with coach labels |
| CPV-F04 | Highlight specific records |
| CPV-F05 | Add "coach reviewed" markers |

#### Critical Constraint

**CPV-C01:** This screen MUST render PROOF data identically to athlete view. No additional coach-specific interpretation layer.

---

### Screen: COACH_TRAJECTORY_VIEWER

**Screen ID:** CTV

**Purpose:** Enable coach to view athlete's TRAJECTORY history without modification or analysis overlay.

#### What This Screen MAY Show

| ID | Element | Constraint |
|----|---------|------------|
| CTV-01 | Test history | Chronological list |
| CTV-02 | Test names | As in TRAJECTORY |
| CTV-03 | Test dates | As in TRAJECTORY |
| CTV-04 | Test values | Raw numbers |
| CTV-05 | Category filters | As in TRAJECTORY |

#### What This Screen MUST NOT Show

| ID | Forbidden Element | Rationale |
|----|-------------------|-----------|
| CTV-N01 | Trend lines | Authority Contract SYS-N7 |
| CTV-N02 | Charts or graphs | Visual trends forbidden |
| CTV-N03 | Moving averages | Authority Contract T-50 |
| CTV-N04 | "Best" / "Worst" highlights | Authority Contract FA-L3 |
| CTV-N05 | Predictions | Authority Contract SYS-N3 |
| CTV-N06 | Comparison periods | Would enable judgment |
| CTV-N07 | Coach annotations inline | Read-only view |

#### Allowed Coach Decisions

| ID | Decision |
|----|----------|
| CTV-D01 | Filter by category |
| CTV-D02 | Select record to view detail |
| CTV-D03 | Navigate chronologically |

#### Forbidden Coach Actions

| ID | Forbidden Action |
|----|------------------|
| CTV-F01 | Modify any record |
| CTV-F02 | Add trend annotations |
| CTV-F03 | Create comparison views |
| CTV-F04 | Export with analysis |

#### Critical Constraint

**CTV-C01:** This screen MUST render TRAJECTORY data identically to athlete view. No additional analysis layer.

---

### Screen: COACH_NOTES

**Screen ID:** CNT

**Purpose:** Enable coach to create, view, and manage observations that are clearly separated from system data.

#### What This Screen MAY Show

| ID | Element | Constraint |
|----|---------|------------|
| CNT-01 | Coach's own notes | Chronological list |
| CNT-02 | Note timestamps | Required |
| CNT-03 | Athlete name (context) | Required |
| CNT-04 | Note editor | For new notes |
| CNT-05 | Note history | Previous notes by this coach |

#### What This Screen MUST NOT Show

| ID | Forbidden Element | Rationale |
|----|-------------------|-----------|
| CNT-N01 | Performance data inline | Separation principle |
| CNT-N02 | PROOF data inline | Separation principle |
| CNT-N03 | System-generated summaries | Authority Contract FA-A3 |
| CNT-N04 | Suggested talking points | Authority Contract FA-A6 |
| CNT-N05 | "Athlete read" status | Privacy, no tracking |
| CNT-N06 | Response prompts | No engagement pressure |

#### Allowed Coach Decisions

| ID | Decision |
|----|----------|
| CNT-D01 | Write new note |
| CNT-D02 | Edit own unpublished note |
| CNT-D03 | View own note history |

#### Forbidden Coach Actions

| ID | Forbidden Action |
|----|------------------|
| CNT-F01 | Edit already-delivered notes |
| CNT-F02 | Delete notes from athlete view |
| CNT-F03 | Attach notes to PROOF records |
| CNT-F04 | Style notes as system content |
| CNT-F05 | Track athlete engagement |

#### Note Delivery Constraints

- CNT-DEL01: Notes appear in athlete's "From Your Coach" section ONLY
- CNT-DEL02: Notes NEVER appear in PROOF, TRAJECTORY, or SESSION
- CNT-DEL03: Notes ALWAYS show "Coach Note" label
- CNT-DEL04: Notes NEVER share visual styling with system UI

---

## PART 2 — ADMIN SCREENS

---

### Screen: ADMIN_OVERVIEW

**Screen ID:** ADO

**Purpose:** Present system health and aggregate statistics without individual user data.

#### What This Screen MAY Show

| ID | Element | Constraint |
|----|---------|------------|
| ADO-01 | Total active users | Count only |
| ADO-02 | Users by tier | Counts only |
| ADO-03 | Total coaches | Count only |
| ADO-04 | System health status | Technical metrics |
| ADO-05 | Recent admin actions | Audit log |
| ADO-06 | Feature usage rates | Aggregate percentages |

#### What This Screen MUST NOT Show

| ID | Forbidden Element | Rationale |
|----|-------------------|-----------|
| ADO-N01 | Individual user names | Privacy boundary |
| ADO-N02 | Performance data | Admin has no coaching authority |
| ADO-N03 | Coach effectiveness | Would enable coach ranking |
| ADO-N04 | Athlete rankings | Authority Contract FA-R1 |
| ADO-N05 | "Problem" user lists | Authority Contract FA-L5 |
| ADO-N06 | Engagement scores | Would enable judgment |

#### Allowed Admin Decisions

| ID | Decision |
|----|----------|
| ADO-D01 | Navigate to configuration screens |
| ADO-D02 | View system health details |
| ADO-D03 | Review audit log |

#### Forbidden Admin Actions

| ID | Forbidden Action |
|----|------------------|
| ADO-F01 | Drill down to individual performance |
| ADO-F02 | Export user-level data |
| ADO-F03 | Create performance reports |

#### Aggregation Rule

**ADO-AGG01:** Minimum group size for any breakdown: 10 users. Smaller groups shown as "< 10".

---

### Screen: ADMIN_FEATURE_FLAGS

**Screen ID:** AFF

**Purpose:** Enable admin to configure feature availability without influencing individual experiences.

#### What This Screen MAY Show

| ID | Element | Constraint |
|----|---------|------------|
| AFF-01 | Feature list | All available features |
| AFF-02 | Feature status | Enabled/disabled |
| AFF-03 | Feature tier assignments | Which tiers have access |
| AFF-04 | Rollout percentages | If gradual rollout |
| AFF-05 | Feature change history | Audit trail |

#### What This Screen MUST NOT Show

| ID | Forbidden Element | Rationale |
|----|-------------------|-----------|
| AFF-N01 | Per-user feature status | Admin configures globally only |
| AFF-N02 | Feature performance metrics | Would enable judgment |
| AFF-N03 | "Most used by top performers" | Authority Contract violation |

#### Allowed Admin Decisions

| ID | Decision |
|----|----------|
| AFF-D01 | Enable feature globally |
| AFF-D02 | Disable feature globally |
| AFF-D03 | Assign feature to tier |
| AFF-D04 | Set rollout percentage |

#### Forbidden Admin Actions

| ID | Forbidden Action |
|----|------------------|
| AFF-F01 | Enable feature for specific user |
| AFF-F02 | Create features that rank athletes |
| AFF-F03 | Enable coach recommendation systems |
| AFF-F04 | Enable performance notifications |

#### Compliance Gate

**AFF-CG01:** Every feature definition MUST include Authority Contract compliance flag. Features violating contract CANNOT be enabled.

---

### Screen: ADMIN_TIER_MANAGEMENT

**Screen ID:** ATM

**Purpose:** Enable admin to define and modify subscription tiers without accessing user-level data.

#### What This Screen MAY Show

| ID | Element | Constraint |
|----|---------|------------|
| ATM-01 | Tier definitions | Name, description |
| ATM-02 | Tier feature assignments | Which features per tier |
| ATM-03 | Tier user counts | Aggregate only |
| ATM-04 | Tier change history | Audit trail |

#### What This Screen MUST NOT Show

| ID | Forbidden Element | Rationale |
|----|-------------------|-----------|
| ATM-N01 | Users in each tier (by name) | Privacy boundary |
| ATM-N02 | Performance by tier | Would enable judgment |
| ATM-N03 | "Best performing tier" | Authority Contract violation |
| ATM-N04 | Upgrade recommendations | Would influence individual users |

#### Allowed Admin Decisions

| ID | Decision |
|----|----------|
| ATM-D01 | Create new tier |
| ATM-D02 | Modify tier features |
| ATM-D03 | Rename tier |
| ATM-D04 | Archive tier |

#### Forbidden Admin Actions

| ID | Forbidden Action |
|----|------------------|
| ATM-F01 | Manually move user between tiers |
| ATM-F02 | Create tier with ranking capability |
| ATM-F03 | Access tier user list |
| ATM-F04 | Create performance-gated tiers |

---

### Screen: ADMIN_COACH_MANAGEMENT

**Screen ID:** ACM

**Purpose:** Enable admin to manage coach accounts without accessing coaching content.

#### What This Screen MAY Show

| ID | Element | Constraint |
|----|---------|------------|
| ACM-01 | Coach account list | Name, email, status |
| ACM-02 | Account status | Active/inactive |
| ACM-03 | Account creation date | Timestamp |
| ACM-04 | Last login date | Timestamp only |
| ACM-05 | Assigned athlete count | Number only |

#### What This Screen MUST NOT Show

| ID | Forbidden Element | Rationale |
|----|-------------------|-----------|
| ACM-N01 | Coach's athlete names | Admin boundary |
| ACM-N02 | Coach's notes content | Privacy |
| ACM-N03 | Coach "effectiveness" | Authority Contract violation |
| ACM-N04 | Athlete performance under coach | Admin has no coaching authority |
| ACM-N05 | Coach activity details | Beyond account management |

#### Allowed Admin Decisions

| ID | Decision |
|----|----------|
| ACM-D01 | Create coach account |
| ACM-D02 | Deactivate coach account |
| ACM-D03 | Reset coach credentials |
| ACM-D04 | View account status |

#### Forbidden Admin Actions

| ID | Forbidden Action |
|----|------------------|
| ACM-F01 | View coach's athlete list |
| ACM-F02 | View coach's notes |
| ACM-F03 | Evaluate coach performance |
| ACM-F04 | Compare coaches |
| ACM-F05 | Access coach's view of athlete data |

---

### Screen: ADMIN_ESCALATION

**Screen ID:** AES

**Purpose:** Enable admin to handle support issues without accessing protected data inappropriately.

#### What This Screen MAY Show

| ID | Element | Constraint |
|----|---------|------------|
| AES-01 | Support ticket list | Issue type, status |
| AES-02 | Ticket details | Description, timestamps |
| AES-03 | System error logs | Anonymized |
| AES-04 | Resolution history | Past actions |
| AES-05 | Escalation audit trail | Who accessed what |

#### What This Screen MUST NOT Show

| ID | Forbidden Element | Rationale |
|----|-------------------|-----------|
| AES-N01 | User performance data (default) | Requires consent |
| AES-N02 | Coach notes content (default) | Privacy |
| AES-N03 | PROOF records (default) | Requires consent |

#### Allowed Admin Decisions

| ID | Decision |
|----|----------|
| AES-D01 | View ticket details |
| AES-D02 | Access system logs |
| AES-D03 | Request user consent for data access |
| AES-D04 | Resolve technical issues |

#### Forbidden Admin Actions

| ID | Forbidden Action |
|----|------------------|
| AES-F01 | Access user data without consent |
| AES-F02 | Modify PROOF records to "fix" issues |
| AES-F03 | Change performance data |
| AES-F04 | Access data beyond minimum necessary |

#### Data Access Protocol

- AES-DAP01: User data access requires explicit consent
- AES-DAP02: All data access logged with justification
- AES-DAP03: Minimum necessary principle enforced
- AES-DAP04: Data not retained after ticket closed
- AES-DAP05: Access audit reviewed quarterly

---

## PART 3 — SCREEN-LEVEL AUTHORITY RISKS

---

### COACH_ATHLETE_LIST (CAL)

**Highest Risk:** Implicit ranking through visual hierarchy or sort order.

**Prevention:**
- CAL-RISK01: Sort MUST be alphabetical only. No performance sort option exists.
- CAL-RISK02: All rows MUST be visually identical. No emphasis on any athlete.
- CAL-RISK03: No numerical data visible in list. Names and dates only.
- CAL-RISK04: Export functionality MUST NOT include performance data.

---

### COACH_ATHLETE_DETAIL (CAD)

**Highest Risk:** System interpretation of performance data displayed alongside raw numbers.

**Prevention:**
- CAD-RISK01: No summary section. No "overview" with interpreted data.
- CAD-RISK02: No trend language. No "improving" / "declining".
- CAD-RISK03: No color-coding of any data.
- CAD-RISK04: Links to PROOF/TRAJECTORY, never inline display of interpreted data.

---

### COACH_TRAINING_PLAN (CTP)

**Highest Risk:** Historical data modification that could alter athlete's record.

**Prevention:**
- CTP-RISK01: Past blocks are READ-ONLY. Edit controls not rendered.
- CTP-RISK02: No backdate option for new blocks.
- CTP-RISK03: All changes logged with immutable audit trail.
- CTP-RISK04: Athlete can see all plan changes.

---

### COACH_PROOF_VIEWER (CPV)

**Highest Risk:** Coach annotation appearing as system-endorsed interpretation.

**Prevention:**
- CPV-RISK01: No annotation interface. Read-only view only.
- CPV-RISK02: Renders identically to athlete PROOF screen.
- CPV-RISK03: No additional data fields beyond what athlete sees.
- CPV-RISK04: No "coach reviewed" markers or timestamps.

---

### COACH_TRAJECTORY_VIEWER (CTV)

**Highest Risk:** Trend visualization that enables pattern judgment.

**Prevention:**
- CTV-RISK01: No charts. No graphs. No trend lines.
- CTV-RISK02: Chronological list only, identical to athlete view.
- CTV-RISK03: No "best" / "worst" highlighting.
- CTV-RISK04: No period comparison tools.

---

### COACH_NOTES (CNT)

**Highest Risk:** Note appearing as system content, blurring authority boundary.

**Prevention:**
- CNT-RISK01: Notes ALWAYS labeled "Coach Note".
- CNT-RISK02: Notes use distinct visual style, never system styling.
- CNT-RISK03: Notes appear in separate section, never inline with data.
- CNT-RISK04: No engagement tracking. Coach cannot know if athlete read note.

---

### ADMIN_OVERVIEW (ADO)

**Highest Risk:** Aggregate slicing that reveals individual data.

**Prevention:**
- ADO-RISK01: Minimum 10 users for any breakdown.
- ADO-RISK02: No performance data in any aggregate.
- ADO-RISK03: No drill-down to individual level.
- ADO-RISK04: Counts only, no means or distributions.

---

### ADMIN_FEATURE_FLAGS (AFF)

**Highest Risk:** Enabling feature that violates Authority Contract.

**Prevention:**
- AFF-RISK01: Every feature has compliance flag.
- AFF-RISK02: Non-compliant features cannot be created.
- AFF-RISK03: Enable action checks compliance flag.
- AFF-RISK04: All flag changes audited.

---

### ADMIN_TIER_MANAGEMENT (ATM)

**Highest Risk:** Creating tier that grants ranking or judgment capabilities.

**Prevention:**
- ATM-RISK01: Tier feature assignment validated against Authority Contract.
- ATM-RISK02: No tier can include forbidden features.
- ATM-RISK03: Tier changes audited.
- ATM-RISK04: No performance-based tier definitions.

---

### ADMIN_COACH_MANAGEMENT (ACM)

**Highest Risk:** Admin using account management to evaluate coach effectiveness.

**Prevention:**
- ACM-RISK01: No performance data visible.
- ACM-RISK02: No athlete data under coach visible.
- ACM-RISK03: Account data only: status, dates, counts.
- ACM-RISK04: No comparison tools between coaches.

---

### ADMIN_ESCALATION (AES)

**Highest Risk:** Data access justified as "debugging" but actually surveillance.

**Prevention:**
- AES-RISK01: Explicit consent required for user data.
- AES-RISK02: All access logged with justification.
- AES-RISK03: Minimum necessary principle enforced by design.
- AES-RISK04: Data auto-purged after ticket closure.
- AES-RISK05: Quarterly audit of escalation data access.

---

## COMPLIANCE VERIFICATION

Before implementing any Coach/Admin screen:

- [ ] Screen purpose defined in this document
- [ ] All MAY SHOW elements listed
- [ ] All MUST NOT SHOW elements listed
- [ ] All ALLOWED decisions listed
- [ ] All FORBIDDEN actions listed
- [ ] Authority risk identified
- [ ] Prevention mechanisms defined

**Screens not defined in this document CANNOT be implemented.**

**Violations of this contract are blocking issues.**

---

## DOCUMENT AUTHORITY

This document has equal authority to:
- IMPLEMENTATION_CONTRACT.md
- COACH_ADMIN_AUTHORITY_CONTRACT.md
- COACH_ADMIN_JOURNEYS.md

All Coach/Admin UI decisions MUST reference this document.

Changes require explicit versioning and review.
