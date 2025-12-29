# Coach / Admin Authority Architecture

**Status:** Binding Contract
**Version:** 1.0
**Date:** 2025-12-18

This document defines the authority model for Coach and Admin roles.
It is NOT a feature specification. It is NOT UI design.
It is a **trust and power contract**.

All Coach/Admin implementation MUST comply with this document.
Violations are architectural failures, not bugs.

---

## FOUNDATIONAL PRINCIPLE

The golfer's relationship with their own data is **primary**.
Coach and Admin are **secondary authorities** with constrained power.

The system exists to serve the golfer's autonomy, not to enable external judgment.

---

## PART 1 — ROLE DEFINITIONS

### 1.1 Coach Role

#### What the Coach is ALLOWED TO SEE

| Data Type | Access | Constraint |
|-----------|--------|------------|
| PROOF outcomes | YES | Read-only. Raw numbers only. |
| TRAJECTORY history | YES | Read-only. No derived metrics. |
| Session completion records | YES | Binary: completed / not completed. |
| Reflection inputs | YES | Only if golfer explicitly shares. |
| Baseline values | YES | Read-only. Cannot see selection process. |
| Training plan structure | YES | Can view assigned blocks. |
| Effort accumulation (hours) | YES | Aggregate only. No judgment overlay. |

#### What the Coach is ALLOWED TO INTERPRET

- CA-I1: Coach MAY form private interpretations of PROOF data.
- CA-I2: Coach MAY identify patterns across TRAJECTORY.
- CA-I3: Coach MAY correlate effort with outcomes **privately**.
- CA-I4: Coach MUST NOT record interpretations in the system as facts.
- CA-I5: Coach MUST NOT attach labels to data points (good/bad/concerning).

#### What the Coach is ALLOWED TO CHANGE

- CA-C1: Coach MAY create training plans.
- CA-C2: Coach MAY assign training blocks to golfers.
- CA-C3: Coach MAY modify future training plan content.
- CA-C4: Coach MAY add observational notes (clearly labeled as coach opinion).
- CA-C5: Coach MUST NOT modify historical data.
- CA-C6: Coach MUST NOT modify PROOF records.
- CA-C7: Coach MUST NOT modify BASELINE values.
- CA-C8: Coach MUST NOT modify REFLECTION inputs.

#### What the Coach is EXPLICITLY NOT ALLOWED TO DO

- CA-N1: Coach MUST NOT rank golfers against each other.
- CA-N2: Coach MUST NOT label golfers as "on track" or "off track".
- CA-N3: Coach MUST NOT assign performance grades.
- CA-N4: Coach MUST NOT override PROOF presentation.
- CA-N5: Coach MUST NOT inject motivational language into golfer-facing views.
- CA-N6: Coach MUST NOT hide data from the golfer.
- CA-N7: Coach MUST NOT explain causality as system-endorsed fact.
- CA-N8: Coach MUST NOT access golfer's internal self-evaluation.

#### Coach Communication Constraints

- CA-COM1: Coach MAY communicate **observations** to golfer.
- CA-COM2: Coach MUST NOT communicate **conclusions** as system-endorsed.
- CA-COM3: Any coach interpretation shown to golfer MUST be clearly labeled: "Coach observation" or "Coach note".
- CA-COM4: Coach communication MUST NOT appear in PROOF, BASELINE, or TRAJECTORY screens.
- CA-COM5: Coach communication has a **separate channel** — never mixed with system data.

---

### 1.2 Admin Role

#### What Admin is ALLOWED TO SEE

| Data Type | Access | Constraint |
|-----------|--------|------------|
| User account status | YES | Active/inactive, subscription tier. |
| Aggregate platform metrics | YES | Total users, retention rates. |
| System configuration | YES | Feature flags, tier definitions. |
| Individual PROOF data | NO | Admin has no coaching authority. |
| Individual TRAJECTORY | NO | Admin has no coaching authority. |
| Individual REFLECTION | NO | Privacy boundary. |

#### What Admin is ALLOWED TO CONFIGURE

- AD-CF1: Admin MAY configure subscription tiers.
- AD-CF2: Admin MAY enable/disable features per tier.
- AD-CF3: Admin MAY manage coach accounts.
- AD-CF4: Admin MAY configure system-wide defaults.
- AD-CF5: Admin MAY manage data retention policies.

#### What Admin MUST NEVER INFLUENCE

- AD-N1: Admin MUST NOT access individual performance data.
- AD-N2: Admin MUST NOT modify PROOF presentation logic.
- AD-N3: Admin MUST NOT create athlete rankings.
- AD-N4: Admin MUST NOT influence training content.
- AD-N5: Admin MUST NOT communicate directly with golfers about performance.
- AD-N6: Admin MUST NOT override coach decisions.

#### Admin vs Coach Separation

- AD-S1: Admin role and Coach role are **mutually exclusive** by default.
- AD-S2: A user MAY hold both roles, but authorities do not combine.
- AD-S3: Admin actions are logged separately from Coach actions.
- AD-S4: Admin has **zero coaching authority** when acting as Admin.
- AD-S5: If Admin needs to coach, they MUST switch to Coach role explicitly.

---

## PART 2 — AUTHORITY BOUNDARIES

### 2.1 System Authority in Coach/Admin Views

#### What the System CAN Show as FACT

- SYS-F1: Raw numerical values from PROOF.
- SYS-F2: Dates and timestamps.
- SYS-F3: Completion status (binary).
- SYS-F4: Calculated deltas (Current - Baseline).
- SYS-F5: Effort totals (hours, session counts).

#### What the System MUST NEVER Conclude or Suggest

- SYS-N1: System MUST NOT label results as good/bad/concerning.
- SYS-N2: System MUST NOT suggest causality ("improved because...").
- SYS-N3: System MUST NOT predict future performance.
- SYS-N4: System MUST NOT recommend coach actions.
- SYS-N5: System MUST NOT highlight "underperformers".
- SYS-N6: System MUST NOT generate coach talking points.
- SYS-N7: System MUST NOT create "insights" or "analysis".

#### Anomaly Presentation

- SYS-A1: System MAY present raw data that shows variance.
- SYS-A2: System MUST NOT label variance as "anomaly" or "outlier".
- SYS-A3: System MUST NOT color-code data to imply judgment.
- SYS-A4: If statistical deviation is shown, it MUST be purely mathematical (e.g., "2 standard deviations from mean") with no evaluative framing.

---

### 2.2 Coach Authority Boundaries

#### PROOF Interpretation

- CB-P1: Coach MAY view PROOF data.
- CB-P2: Coach MAY privately interpret PROOF outcomes.
- CB-P3: Coach MUST NOT modify PROOF presentation.
- CB-P4: Coach MUST NOT add annotations to PROOF.
- CB-P5: Coach MUST NOT override PROOF with alternative conclusions.
- CB-P6: Any coach interpretation of PROOF exists **outside** the PROOF screen.

#### Labeling Results

- CB-L1: Coach MUST NOT label results as "good", "bad", "excellent", "poor".
- CB-L2: Coach MUST NOT apply traffic light indicators (red/yellow/green).
- CB-L3: Coach MUST NOT categorize golfers by performance tier.
- CB-L4: Coach MAY use neutral descriptive language in separate notes.

#### Causality Explanation

- CB-C1: Coach MUST NOT state causality as system-endorsed fact.
- CB-C2: Coach MAY offer hypotheses in clearly labeled coach notes.
- CB-C3: Coach hypotheses MUST include language like "I think..." or "My observation is...".
- CB-C4: Coach MUST NOT use language like "The data shows that..." followed by causal claims.

#### Override Authority

- CB-O1: Coach MUST NOT override PROOF.
- CB-O2: Coach MUST NOT override BASELINE.
- CB-O3: Coach MUST NOT override TRAJECTORY.
- CB-O4: Coach MAY adjust future training plans.
- CB-O5: Coach adjustments to plans are logged and visible to golfer.

---

### 2.3 Golfer Retained Authority

The following authorities belong to the golfer and CANNOT be overridden by Coach or Admin:

#### Interpretation Authority

- GR-I1: Golfer ALWAYS retains final authority over meaning of their data.
- GR-I2: No coach interpretation is binding on the golfer.
- GR-I3: Golfer MAY reject coach observations.
- GR-I4: Golfer's self-interpretation is never recorded by the system.

#### Self-Evaluation Authority

- GR-E1: Golfer ALWAYS controls their own self-evaluation.
- GR-E2: System MUST NOT present coach evaluation as golfer's self-assessment.
- GR-E3: Golfer MAY disagree with any coach statement.
- GR-E4: Disagreement is private — system does not track it.

#### Data Sovereignty

- GR-D1: Golfer MAY request their data.
- GR-D2: Golfer MAY revoke coach access (where legally permitted).
- GR-D3: Golfer MAY delete their account and data.
- GR-D4: Golfer's REFLECTION inputs are private by default.
- GR-D5: Golfer explicitly controls what coach can see beyond core metrics.

#### Communication Authority

- GR-C1: Golfer MAY ignore coach communications.
- GR-C2: Golfer MAY disable coach notes visibility.
- GR-C3: Golfer is NEVER required to respond to coach interpretations.

---

## PART 3 — FORBIDDEN ACTIONS (NON-NEGOTIABLE)

The following actions MUST NEVER be possible in Coach/Admin UI, regardless of technical feasibility:

### Ranking and Comparison

| ID | Forbidden Action |
|----|------------------|
| FA-R1 | Ranking athletes by performance |
| FA-R2 | Sorting athlete list by any performance metric |
| FA-R3 | Displaying leaderboards |
| FA-R4 | Showing "top performers" or "bottom performers" |
| FA-R5 | Comparing one athlete's data against another's |
| FA-R6 | Displaying team averages that enable individual comparison |

### Labeling and Judgment

| ID | Forbidden Action |
|----|------------------|
| FA-L1 | Labeling athletes as "on track" / "off track" |
| FA-L2 | Assigning status indicators (red/yellow/green) |
| FA-L3 | Categorizing athletes into performance tiers |
| FA-L4 | Auto-generating "concern" flags |
| FA-L5 | Displaying "needs attention" badges |
| FA-L6 | Showing "at risk" labels |

### Automated Judgment

| ID | Forbidden Action |
|----|------------------|
| FA-A1 | Auto-generated coach judgments |
| FA-A2 | System-suggested conclusions about athlete |
| FA-A3 | AI-generated performance summaries |
| FA-A4 | Automated "insight" generation |
| FA-A5 | Predictive alerts about athlete trajectory |
| FA-A6 | System-generated coaching recommendations |

### Data Manipulation

| ID | Forbidden Action |
|----|------------------|
| FA-D1 | Modifying historical PROOF records |
| FA-D2 | Changing BASELINE values |
| FA-D3 | Editing REFLECTION inputs |
| FA-D4 | Hiding data from athlete |
| FA-D5 | Inserting system-generated content into athlete's view |
| FA-D6 | Backdating training records |

### Communication Manipulation

| ID | Forbidden Action |
|----|------------------|
| FA-C1 | Injecting motivational messages into athlete screens |
| FA-C2 | Sending automated encouragement based on performance |
| FA-C3 | Displaying coach judgments in PROOF screen |
| FA-C4 | Mixing coach opinion with system data |
| FA-C5 | Creating the appearance of system endorsement for coach opinions |

---

## PART 4 — FAILURE MODES

### 4.1 Trust Undermining Scenarios

Ways Coach/Admin authority could unintentionally undermine trust:

#### FM-T1: Coach Opinion Presented as Fact

**Scenario:** Coach writes "Good improvement this month" and it appears in a way that looks like system output.

**Risk:** Golfer loses ability to distinguish system facts from coach opinions.

**Mitigation:** All coach content MUST have distinct visual treatment and explicit "Coach note" labeling.

---

#### FM-T2: Implicit Comparison Through Interface

**Scenario:** Coach views multiple athletes in a list sorted by recent activity. Coach unconsciously compares them.

**Risk:** Coach develops ranking mindset even without explicit ranking feature.

**Mitigation:** Default sort is alphabetical or by next scheduled session. Performance metrics never visible in list views.

---

#### FM-T3: Data Asymmetry

**Scenario:** Coach sees athlete data that athlete cannot see, creating power imbalance.

**Risk:** Golfer feels surveilled rather than supported.

**Mitigation:** Golfer ALWAYS has access to same core data coach sees. Coach-only views limited to aggregate planning tools.

---

### 4.2 System Manipulation Scenarios

Ways the system could accidentally become manipulative via Coach/Admin tools:

#### FM-S1: Aggregation Creates Judgment

**Scenario:** System shows "3 of 5 athletes improved this week" — technically factual but implies judgment on the other 2.

**Risk:** Neutral presentation becomes evaluative through framing.

**Mitigation:** Aggregate statistics MUST NOT imply individual judgment. Show only: "5 athletes have PROOF data this week."

---

#### FM-S2: Default Sorting Implies Priority

**Scenario:** Athletes with lowest recent scores appear at top of coach's view.

**Risk:** System architecture creates implicit "concern" prioritization.

**Mitigation:** No performance-based sorting. Default views are neutral (alphabetical, chronological by next session).

---

#### FM-S3: Notification Triggers on Performance

**Scenario:** System alerts coach when athlete's score drops below threshold.

**Risk:** System becomes surveillance tool. Coach interventions feel reactive rather than supportive.

**Mitigation:** No performance-triggered notifications. Notifications only for: session completion, explicit athlete messages, administrative events.

---

## PART 5 — IMPLEMENTATION REQUIREMENTS

### 5.1 Audit Trail

- All coach actions that modify data MUST be logged.
- All admin configuration changes MUST be logged.
- Golfer MUST be able to see history of coach modifications to their training plan.

### 5.2 Role Enforcement

- Role permissions MUST be enforced at API level, not just UI level.
- Attempting forbidden actions MUST return explicit error: `AUTHORITY_VIOLATION`.
- Authority violations MUST be logged for security review.

### 5.3 Visual Distinction

- Coach-generated content MUST be visually distinct from system data.
- Admin views MUST be clearly separated from Coach views.
- Golfer-facing screens MUST NEVER show Coach/Admin UI elements.

---

## COMPLIANCE VERIFICATION

Any Coach/Admin feature MUST be verified against this document before implementation.

Verification checklist:
- [ ] Does not violate any CA-N (Coach Not Allowed) rule
- [ ] Does not violate any AD-N (Admin Not Allowed) rule
- [ ] Does not violate any FA (Forbidden Action) rule
- [ ] Preserves all GR (Golfer Retained) authorities
- [ ] Does not create any FM (Failure Mode) scenario

**Violations of this contract are blocking issues.**

---

## DOCUMENT AUTHORITY

This document has equal authority to `IMPLEMENTATION_CONTRACT.md`.

Changes require explicit versioning and review.

All Coach/Admin code is subject to contract enforcement.
