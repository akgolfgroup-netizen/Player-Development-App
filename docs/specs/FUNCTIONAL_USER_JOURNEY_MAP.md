# Functional User Journey Map: Golfer

**Context:** AK Golf Academy App
**Primary User:** Competitive golfer (player)
**Goal:** Golfer starts using the app → trains over a period → evaluates whether the app is worth continuing to use

---

## A. LINEAR JOURNEY MAP

### PHASE 1: FIRST CONTACT (Day 0)

#### Step 1.1: App Open / Login
| Attribute | Description |
|-----------|-------------|
| **User Intent** | Access my training system |
| **System Action** | Shows login form (email/password) with demo login options |
| **User Feedback** | Form fields, "Login" button, loading state during auth |
| **Expected Next** | Redirect to main dashboard or onboarding |

**Tags:** None

---

#### Step 1.2: Season Onboarding (First-Time)
| Attribute | Description |
|-----------|-------------|
| **User Intent** | Set up my training baseline so the system knows where I am |
| **System Action** | AI analyzes previous season data. Presents two baseline options: "Season Average" (conservative) or "Last 8 Rounds" (ambitious). Shows comparison with confidence score. |
| **User Feedback** | Visual comparison, recommendation highlight, "Select" buttons, progress indicator |
| **Expected Next** | Baseline saved → redirected to dashboard |

**Tags:**
- **GAP:** No onboarding exists for users without historical data (new to system)
- **GAP:** No explanation of what baseline affects (training intensity, goals) until confirmation screen

---

### PHASE 2: ORIENTATION (Day 0-3)

#### Step 2.1: Dashboard First View
| Attribute | Description |
|-----------|-------------|
| **User Intent** | Understand what I should do today |
| **System Action** | Shows: greeting, player category, countdown widgets (next tournament, next test), today's calendar, upcoming sessions, training stats, tasks, messages, notifications, gamification (XP/level) |
| **User Feedback** | Multiple widgets with data; visual hierarchy unclear on first visit |
| **Expected Next** | Tap a session to see details OR tap calendar OR explore stats |

**Tags:**
- **NOISE:** High information density on dashboard - 8+ distinct widgets compete for attention
- **GAP:** No "getting started" guidance or tour for new users
- **BREAK:** If no sessions are scheduled, dashboard shows empty states with no clear call-to-action

---

#### Step 2.2: View Upcoming Session
| Attribute | Description |
|-----------|-------------|
| **User Intent** | See what training I have scheduled |
| **System Action** | Shows session detail: date, time, location, duration, status. Block-by-block breakdown with exercise name, focus, volume, tags (L-phase, CS level, environment, pressure rating), instructions. |
| **User Feedback** | Expandable blocks, completion status per block, clear structure |
| **Expected Next** | Start session OR return to dashboard |

**Tags:** None - this flow is well-designed

---

### PHASE 3: FIRST TRAINING SESSION (Day 1-7)

#### Step 3.1: Start Active Session
| Attribute | Description |
|-----------|-------------|
| **User Intent** | Begin my training and track it |
| **System Action** | Launches active session view: total session timer (HH:MM:SS), block timer, block progress bar, current block info with instructions, rep counter (+/- buttons, quick add +10/+25), block navigation chips, notes area |
| **User Feedback** | Live timers, visual progress, tactile rep buttons, clear current state |
| **Expected Next** | Complete reps → move to next block OR pause |

**Tags:** None - this is the strongest flow in the app

---

#### Step 3.2: Complete Block (During Session)
| Attribute | Description |
|-----------|-------------|
| **User Intent** | Finish this exercise block and record quality |
| **System Action** | Block Rating Modal appears: Quality slider, Focus slider, Intensity slider, notes field, skip/submit options |
| **User Feedback** | Modal overlay, slider controls, clear submit action |
| **Expected Next** | Submit rating → auto-advance to next block |

**Tags:** None

---

#### Step 3.3: Pause Session (Optional)
| Attribute | Description |
|-----------|-------------|
| **User Intent** | Take a break without losing progress |
| **System Action** | Pause overlay shows total elapsed time + pause duration. Options: Resume or End Session |
| **User Feedback** | Clear pause state, time continues tracking |
| **Expected Next** | Resume → back to active session OR End → reflection |

**Tags:** None

---

#### Step 3.4: End Session / Reflection
| Attribute | Description |
|-----------|-------------|
| **User Intent** | Complete the session and capture learnings |
| **System Action** | Session Reflection Form: overall rating, key learnings, challenges faced, next focus areas |
| **User Feedback** | Form fields, submit button |
| **Expected Next** | Submit → return to dashboard with updated stats |

**Tags:**
- **GAP:** No immediate feedback on how this session contributed to goals or progress
- **GAP:** No comparison to previous sessions of same type

---

### PHASE 4: BUILDING ROUTINE (Week 1-2)

#### Step 4.1: Return to Dashboard (Day 2+)
| Attribute | Description |
|-----------|-------------|
| **User Intent** | See what's next and how I'm doing |
| **System Action** | Dashboard now shows: updated training stats (sessions completed, hours, streak), new notifications (achievements, goal progress), upcoming sessions |
| **User Feedback** | Stats reflect completed work, streak counter shows continuity |
| **Expected Next** | Start next session OR check progress |

**Tags:**
- **GAP:** No personalized summary of yesterday's training impact
- **NOISE:** Gamification (XP, levels, badges) prominent but disconnected from actual golf improvement

---

#### Step 4.2: Check Progress (Treningsstatistikk)
| Attribute | Description |
|-----------|-------------|
| **User Intent** | See if my training is working |
| **System Action** | Progress Dashboard shows: total hours, sessions completed vs target, exercises completed, current streak. Charts: hours by day, hours trend (8 weeks), L-phase progression, area distribution (pie chart). Recent sessions list with ratings. Personal records. |
| **User Feedback** | Multiple data visualizations, trend indicators, percentage changes |
| **Expected Next** | Feel validated → continue training OR feel confused about meaning |

**Tags:**
- **BREAK:** Stats show activity metrics (hours, sessions) not outcome metrics (improvement, scores)
- **GAP:** No connection between training volume and actual performance improvement
- **NOISE:** L-phase progression shown but meaning not explained to user

---

#### Step 4.3: Check Test Results (Testresultater)
| Attribute | Description |
|-----------|-------------|
| **User Intent** | See objective proof of my improvement |
| **System Action** | Test Results view: benchmark timeline (U33-U48), overall stats (tests passed X/20, improved count, avg progress), 7-point radar chart (current vs requirement), expandable test cards with history line charts |
| **User Feedback** | Pass/fail badges, trend indicators (📈/📉), progress bars |
| **Expected Next** | See improvement → motivated OR see gaps → understand focus areas |

**Tags:**
- **GAP:** Tests require manual execution - no guidance on when/how to perform tests
- **BREAK:** User sees test requirements but no connection to which training blocks address which tests
- **GAP:** Radar chart shows performance vs requirement but not vs previous self over time

---

### PHASE 5: EVALUATION POINT (Week 2-4)

#### Step 5.1: Review Archive
| Attribute | Description |
|-----------|-------------|
| **User Intent** | See my full history and trajectory |
| **System Action** | Archive view: year selector, folders (annual plans, test results, tournament results, goals). Shows: benchmark progression (Q1: 9/20 → Q4: 18/20), tournament scores, goal achievement rates. Timeline of recent documents. |
| **User Feedback** | Historical data organized, progression visible year-over-year |
| **Expected Next** | See improvement trend → stay OR see stagnation → question value |

**Tags:**
- **GAP:** Tournament results and test results are separate from training logs - no causal connection shown
- **BREAK:** User cannot answer "did my training cause my improvement?" from available data

---

#### Step 5.2: Evaluate Value (Mental)
| Attribute | Description |
|-----------|-------------|
| **User Intent** | Decide if this app is worth continuing |
| **System Action** | No dedicated evaluation flow - user must synthesize from multiple screens |
| **User Feedback** | None - this is a mental process |
| **Expected Next** | Continue subscription OR churn |

**Tags:**
- **CRITICAL GAP:** No summary view showing "You've improved X since starting"
- **CRITICAL GAP:** No connection between training input → test improvement → tournament performance
- **BREAK:** Value proposition depends on user manually connecting dots across 4+ screens

---

### PHASE 6: ONGOING ENGAGEMENT (Month 2+)

#### Step 6.1: Receive Notification
| Attribute | Description |
|-----------|-------------|
| **User Intent** | Stay informed about my training |
| **System Action** | Toast notifications: goal progress, new sessions assigned, achievements unlocked, coach notes shared |
| **User Feedback** | 3-second toast at bottom of screen, auto-dismiss |
| **Expected Next** | Tap to act OR ignore |

**Tags:**
- **GAP:** No push notifications - engagement only when app is open
- **NOISE:** Achievement notifications (badges, XP) compete with actionable notifications (sessions, coach messages)

---

#### Step 6.2: Communicate with Coach
| Attribute | Description |
|-----------|-------------|
| **User Intent** | Get feedback or ask questions |
| **System Action** | Messages widget shows unread count, recent messages from coaches/team |
| **User Feedback** | Message list with timestamps |
| **Expected Next** | Read message → respond OR act on feedback |

**Tags:**
- **GAP:** Cannot view message context within training - must leave current view
- **GAP:** Coach cannot annotate specific sessions or exercises with feedback

---

## B. LIST OF GAPS

| # | Gap Description | Journey Phase | Impact |
|---|-----------------|---------------|--------|
| G1 | No onboarding for users without historical data | First Contact | New users cannot set meaningful baseline |
| G2 | No explanation of what baseline affects until confirmation | First Contact | User makes uninformed decision |
| G3 | No "getting started" guidance or tour | Orientation | User overwhelmed by dashboard |
| G4 | Empty dashboard states have no call-to-action | Orientation | User stalls if no sessions scheduled |
| G5 | No immediate feedback on session contribution to goals | First Training | Effort feels disconnected from progress |
| G6 | No comparison to previous sessions of same type | First Training | Cannot see micro-improvements |
| G7 | No personalized summary of yesterday's training | Building Routine | Continuity feels weak |
| G8 | No connection between training volume and performance improvement | Building Routine | Effort-outcome link invisible |
| G9 | L-phase progression shown but meaning unexplained | Building Routine | Data without context |
| G10 | No guidance on when/how to perform tests | Building Routine | Tests feel separate from training |
| G11 | No connection between training blocks and test improvements | Building Routine | Cannot optimize training focus |
| G12 | Radar chart shows requirement but not historical self | Building Routine | Missing personal trajectory |
| G13 | No causal connection between training → tests → tournaments | Evaluation | Cannot prove app value |
| G14 | No summary view: "You've improved X since starting" | Evaluation | **CRITICAL** - value proposition invisible |
| G15 | No push notifications | Ongoing | Engagement only when app open |
| G16 | Coach cannot annotate specific sessions | Ongoing | Feedback disconnected from context |

---

## C. LIST OF BREAKS

| # | Break Description | Journey Phase | Severity |
|---|-------------------|---------------|----------|
| B1 | Empty dashboard with no scheduled sessions = dead end | Orientation | Medium |
| B2 | Stats show activity (hours) not outcomes (improvement) | Building Routine | High |
| B3 | Test requirements visible but not linked to training | Building Routine | High |
| B4 | User cannot answer "did training cause improvement?" | Evaluation | **Critical** |
| B5 | Value proposition requires user to manually connect 4+ screens | Evaluation | **Critical** |

---

## D. LIST OF NOISE

| # | Noise Description | Journey Phase | Effect |
|---|-------------------|---------------|--------|
| N1 | 8+ widgets compete for attention on dashboard | Orientation | Cognitive overload |
| N2 | Gamification (XP, levels, badges) disconnected from golf improvement | Building Routine | Distracts from real value |
| N3 | Achievement notifications compete with actionable notifications | Ongoing | Important messages buried |

---

## E. SUMMARY

### What the Product Does Well

1. **Active Session Flow is Excellent**
   - Real-time timer, rep counter, block navigation, pause capability
   - Block rating modal captures quality/focus/intensity data
   - Clear visual progress through session
   - This is the core value delivery moment - well-executed

2. **Session Structure is Professional**
   - Block-by-block breakdown with detailed metadata
   - L-phase, CS level, environment, pressure rating tags
   - Expandable instructions per exercise
   - Reflects real coaching methodology

3. **Test Protocol System is Comprehensive**
   - 20 tests across 5 categories (Golf/Teknikk/Fysisk/Mental/Strategisk)
   - Historical benchmark tracking (U33-U48)
   - Pass/fail with progress-to-requirement visualization
   - Radar chart shows multi-dimensional performance

4. **Archive Preserves History**
   - Year-by-year organization
   - Test results show progression (Q1: 9/20 → Q4: 18/20)
   - Tournament results tracked
   - Goal achievement rates visible

5. **Gamification Exists**
   - XP/level system, streaks, achievements
   - Creates engagement hooks (though disconnected from outcomes)

### Where Value Perception is at Risk

1. **The "So What?" Gap (Critical)**
   - User trains for weeks but cannot see a single view proving: "Your training caused this improvement"
   - Activity metrics (hours, sessions) are tracked but outcome metrics (scores, test results) are siloed
   - The effort-to-result causal chain is invisible

2. **First-Week Dropout Risk**
   - Dashboard overwhelms with 8+ widgets
   - No guided onboarding or tour
   - If no sessions scheduled, user sees empty state with no path forward

3. **Evaluation-Point Failure**
   - At week 2-4, user asks "is this worth it?"
   - System provides no answer - user must manually synthesize data from Progress, Tests, Archive, Calendar
   - This is the moment users churn

4. **Gamification Disconnect**
   - XP and badges reward activity, not improvement
   - "7-day streak" badge ≠ "You hit 10 yards farther"
   - Creates cognitive dissonance: game says I'm winning, but am I actually better at golf?

5. **Coach Communication Gap**
   - Coach feedback exists but is disconnected from specific training moments
   - Cannot annotate "this rep was great" or "focus here next time"
   - Relationship feels administrative, not developmental

### Value Perception Risk Summary

The app excels at **tracking what you do** but fails at **proving it works**.

A golfer using this app can see:
- Hours trained ✓
- Sessions completed ✓
- Exercises performed ✓
- Test scores (isolated) ✓

A golfer using this app cannot see:
- "Your putting improved 15% because of the 12 hours of lag-control drills"
- "You passed 3 more tests this quarter vs last quarter"
- "Your tournament scores dropped 2 strokes since starting structured training"

**The missing link:** Input (training) → Output (improvement) → Outcome (performance)

Without this causal chain visible, the user experiences effort without proof of value. At the evaluation point (week 2-4), they must either:
1. Trust the process on faith
2. Manually connect the dots across 4+ screens
3. Churn

---

*Behavior mapping complete. No feature proposals. No UI redesign. System behaviors documented as observed.*
