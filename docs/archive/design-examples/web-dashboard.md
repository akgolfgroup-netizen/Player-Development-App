# Web Application - Coach Dashboard & Player Portal

## Layout 1: Coach Dashboard (Desktop 1440px)

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  ⛳ ProSwing                                      🔔  💬  👤 Coach Mike  ▼     │
├──────────────┬─────────────────────────────────────────────────────────────────┤
│              │                                                                 │
│  📊 Dashboard│   COACH DASHBOARD                              Today: Dec 31   │
│              │                                                                 │
│  👥 Students │   ┌─────────────────────┐ ┌─────────────────────┐ ┌───────────┐│
│              │   │ 📈 Active Students  │ │ 📅 Sessions Today   │ │ ⭐ Rating ││
│  📅 Schedule │   │                     │ │                     │ │           ││
│              │   │      24             │ │        5            │ │   4.9     ││
│  🎥 Videos   │   │   ↑ 3 this month   │ │   Next: 10:30 AM    │ │  128 rev. ││
│              │   └─────────────────────┘ └─────────────────────┘ └───────────┘│
│  💬 Messages │                                                                 │
│              │   TODAY'S SCHEDULE                                              │
│  💰 Earnings │   ┌────────────────────────────────────────────────────────────┐│
│              │   │ TIME      STUDENT          TYPE           STATUS           ││
│  ⚙️ Settings │   │─────────────────────────────────────────────────────────── ││
│              │   │ 10:30    Anders K.        Swing Review    ⏳ In 30 min     ││
│              │   │ 12:00    Maria S.         Full Lesson     📋 Scheduled     ││
│              │   │ 14:00    Erik B.          Video Call      📋 Scheduled     ││
│              │   │ 15:30    Lisa T.          Swing Review    📋 Scheduled     ││
│              │   │ 17:00    Johan P.         Full Lesson     📋 Scheduled     ││
│              │   └────────────────────────────────────────────────────────────┘│
│              │                                                                 │
│              │   ┌───────────────────────────────┐ ┌─────────────────────────┐│
│              │   │ 📹 PENDING REVIEWS (8)        │ │ 💬 UNREAD MESSAGES (3)  ││
│              │   │                               │ │                         ││
│              │   │ • Anders K. - Driver swing    │ │ • Maria S. - 2 min ago  ││
│              │   │   Uploaded 2h ago             │ │   "Thanks for the tips!"││
│              │   │   [Review Now]                │ │                         ││
│              │   │                               │ │ • Erik B. - 1h ago      ││
│              │   │ • Lisa T. - Iron sequence     │ │   "Can we reschedule?"  ││
│              │   │   Uploaded 5h ago             │ │                         ││
│              │   │   [Review Now]                │ │ • Johan P. - 3h ago     ││
│              │   │                               │ │   "Video uploaded"      ││
│              │   │ • Johan P. - Putting stroke   │ │                         ││
│              │   │   Uploaded 1d ago             │ │ [View All Messages →]   ││
│              │   │   [Review Now]                │ │                         ││
│              │   │                               │ │                         ││
│              │   │ [View All Pending →]          │ │                         ││
│              │   └───────────────────────────────┘ └─────────────────────────┘│
│              │                                                                 │
│              │   STUDENT PROGRESS OVERVIEW                                     │
│              │   ┌────────────────────────────────────────────────────────────┐│
│              │   │ STUDENT       HANDICAP   TREND    SESSIONS   LAST ACTIVE   ││
│              │   │──────────────────────────────────────────────────────────  ││
│              │   │ Anders K.     12.4       ↓ 0.3    24         Today         ││
│              │   │ Maria S.      18.2       ↓ 1.1    12         Yesterday     ││
│              │   │ Erik B.       8.7        ↑ 0.2    36         2 days ago    ││
│              │   │ Lisa T.       22.5       ↓ 2.0    8          Today         ││
│              │   │ Johan P.      15.1       ↓ 0.5    18         3 days ago    ││
│              │   └────────────────────────────────────────────────────────────┘│
│              │                                                                 │
└──────────────┴─────────────────────────────────────────────────────────────────┘
```

---

## Layout 2: Video Analysis Workspace (Coach View)

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  ⛳ ProSwing    ← Back to Dashboard                    🔔  💬  👤 Coach Mike   │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│  SWING ANALYSIS: Anders Kristiansen - Driver                    Dec 30, 2024  │
│                                                                                │
│  ┌────────────────────────────────────────────────┐ ┌────────────────────────┐│
│  │                                                │ │  STUDENT INFO          ││
│  │                                                │ │                        ││
│  │                                                │ │  Anders Kristiansen    ││
│  │              [VIDEO PLAYER]                    │ │  Handicap: 12.4        ││
│  │                                                │ │  Goal: Break 80        ││
│  │                 🏌️                            │ │                        ││
│  │                                                │ │  EQUIPMENT             ││
│  │           ← Drawing Tools Active →             │ │  Driver: TM Qi10       ││
│  │                                                │ │                        ││
│  │  ◀◀   ▶/⏸   ▶▶   🔄   1x ▼   📐   ✏️   ↩️   │ │  PREVIOUS SESSIONS     ││
│  │  ●────────────────────○────────────────────●  │ │  • Dec 23 - Irons      ││
│  │  0:00              1:24                  2:48  │ │  • Dec 16 - Driver     ││
│  └────────────────────────────────────────────────┘ │  • Dec 9 - Short game  ││
│                                                     │                        ││
│  FRAME-BY-FRAME                                     │  [View History →]      ││
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐     └────────────────────────┘│
│  │ 🏌️  │ │ 🏌️  │ │ 🏌️  │ │ 🏌️  │ │ 🏌️  │                               │
│  │      │ │      │ │      │ │      │ │      │      ANNOTATION TOOLS         │
│  │Addrs │ │ Back │ │ Top  │ │ Down │ │Impct │     ┌────────────────────────┐│
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘     │ ✏️ Draw Line           ││
│                                                    │ ⭕ Draw Circle          ││
│  ┌─────────────────────────────────────────────┐  │ 📐 Angle Measure        ││
│  │  ANALYSIS METRICS                           │  │ ↗️ Arrow                ││
│  │                                             │  │ 💬 Text Note            ││
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐    │  │ 🎨 Color: [Green ▼]     ││
│  │  │Club Speed│ │Ball Speed│ │ Launch   │    │  └────────────────────────┘│
│  │  │  98 mph  │ │ 142 mph  │ │  12.3°   │    │                             │
│  │  │ ↑ 3 mph  │ │ ↑ 5 mph  │ │ Optimal  │    │  COMPARISON                 │
│  │  └──────────┘ └──────────┘ └──────────┘    │  ┌────────────────────────┐│
│  │                                             │  │ Compare with:          ││
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐    │  │ [Previous Swing ▼]     ││
│  │  │Club Path │ │Face Angle│ │ Spin Rate│    │  │                        ││
│  │  │ +2.1° IO │ │ -0.8°    │ │ 2,450rpm │    │  │ [Load Comparison]      ││
│  │  │ ✓ Good   │ │ Slightly │ │ ✓ Good   │    │  │                        ││
│  │  │          │ │  closed  │ │          │    │  │ [Pro Reference ▼]      ││
│  │  └──────────┘ └──────────┘ └──────────┘    │  └────────────────────────┘│
│  └─────────────────────────────────────────────┘                            │
│                                                                              │
│  COACH FEEDBACK                                                              │
│  ┌──────────────────────────────────────────────────────────────────────────┐│
│  │ Add your feedback for the student:                                       ││
│  │                                                                          ││
│  │ Great improvement on your backswing tempo! I've marked a few areas:      ││
│  │                                                                          ││
│  │ 1. Your hip rotation has improved significantly - up 8° from last week   ││
│  │ 2. Watch the left arm at the top - it's breaking slightly               ││
│  │ 3. Impact position looks solid                                           ││
│  │                                                                          ││
│  │ Drill to focus on: "Pump Drill" - 3 sets of 10 reps before your next    ││
│  │ round.                                                                   ││
│  │                                                                          ││
│  └──────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  [Save as Draft]                    [Send to Student]   [Schedule Follow-up] │
│                                                                              │
└────────────────────────────────────────────────────────────────────────────────┘
```

---

## Layout 3: Player Web Portal (Desktop)

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  ⛳ ProSwing                        🔍 Search...      🔔  💬  👤 Anders  ▼     │
├──────────────┬─────────────────────────────────────────────────────────────────┤
│              │                                                                 │
│  🏠 Home     │   Welcome back, Anders!                                         │
│              │                                                                 │
│  📊 My Stats │   ┌─────────────────────────────────────────────────────────┐  │
│              │   │                                                         │  │
│  🎥 My Swings│   │   YOUR GOLF JOURNEY                                     │  │
│              │   │                                                         │  │
│  📚 Lessons  │   │   ┌─────────┐    ┌─────────┐    ┌─────────┐            │  │
│              │   │   │ 12.4    │    │ 24      │    │ 87%     │            │  │
│  📅 Sessions │   │   │Handicap │    │Sessions │    │Accuracy │            │  │
│              │   │   │ ↓ 2.1   │    │Completed│    │ ↑ 12%   │            │  │
│  👤 Profile  │   │   └─────────┘    └─────────┘    └─────────┘            │  │
│              │   │                                                         │  │
│  ⚙️ Settings │   │   Progress: ████████████████░░░░░░ 68% to goal         │  │
│              │   │   Goal: Single-digit handicap                           │  │
│              │   │                                                         │  │
│              │   └─────────────────────────────────────────────────────────┘  │
│              │                                                                 │
│              │   ┌──────────────────────────────┐ ┌───────────────────────┐   │
│              │   │ 📹 LATEST SWING FEEDBACK     │ │ 📅 UPCOMING SESSIONS  │   │
│              │   │                              │ │                       │   │
│              │   │ Driver Analysis              │ │ Thu, Jan 2 • 14:00    │   │
│              │   │ From Coach Mike • 2h ago     │ │ Swing Review          │   │
│              │   │                              │ │ Coach Mike            │   │
│              │   │ "Great improvement on your   │ │ [Join Video Call]     │   │
│              │   │  backswing tempo!"           │ │                       │   │
│              │   │                              │ │ Sat, Jan 4 • 10:00    │   │
│              │   │ ▶ Watch Annotated Video     │ │ Full Lesson           │   │
│              │   │                              │ │ Coach Mike            │   │
│              │   │ [View Full Feedback →]       │ │ Oslo Golf Club        │   │
│              │   │                              │ │                       │   │
│              │   └──────────────────────────────┘ │ [Book New Session →]  │   │
│              │                                    └───────────────────────┘   │
│              │                                                                 │
│              │   📚 RECOMMENDED LESSONS                                        │
│              │   ┌────────────────────────────────────────────────────────┐   │
│              │   │                                                        │   │
│              │   │ ┌────────────┐ ┌────────────┐ ┌────────────┐          │   │
│              │   │ │ 🎬         │ │ 🎬         │ │ 🎬         │          │   │
│              │   │ │            │ │            │ │            │          │   │
│              │   │ │ 15:30      │ │ 12:45      │ │ 8:20       │          │   │
│              │   │ └────────────┘ └────────────┘ └────────────┘          │   │
│              │   │  Fix Your      Perfect Your   Master the              │   │
│              │   │  Slice         Impact         Short Game              │   │
│              │   │  ★★★★★         ★★★★★          ★★★★☆                   │   │
│              │   │                                                        │   │
│              │   │ [Browse All Lessons →]                                 │   │
│              │   │                                                        │   │
│              │   └────────────────────────────────────────────────────────┘   │
│              │                                                                 │
│              │   📊 PERFORMANCE TRENDS                                         │
│              │   ┌────────────────────────────────────────────────────────┐   │
│              │   │                                                        │   │
│              │   │   Handicap Over Time                                   │   │
│              │   │                                                        │   │
│              │   │   16 ─┐                                                │   │
│              │   │       └──┐                                             │   │
│              │   │   14     └───┐                                         │   │
│              │   │              └───┐                                     │   │
│              │   │   12             └────────●  12.4                      │   │
│              │   │                                                        │   │
│              │   │   10                                                   │   │
│              │   │   ───────────────────────────────────────              │   │
│              │   │   Jul   Aug   Sep   Oct   Nov   Dec                    │   │
│              │   │                                                        │   │
│              │   └────────────────────────────────────────────────────────┘   │
│              │                                                                 │
└──────────────┴─────────────────────────────────────────────────────────────────┘
```

---

## Layout 4: Booking / Scheduling (Web)

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  ⛳ ProSwing    ← Back                              🔔  💬  👤 Anders  ▼       │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│  BOOK A SESSION                                                                │
│                                                                                │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │  1. SELECT COACH                                                        │  │
│  │                                                                         │  │
│  │  ┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐│  │
│  │  │ ┌────┐             │  │ ┌────┐             │  │ ┌────┐             ││  │
│  │  │ │ 👤 │ Coach Mike  │  │ │ 👤 │ Coach Sara  │  │ │ 👤 │ Coach Erik  ││  │
│  │  │ └────┘             │  │ └────┘             │  │ └────┘             ││  │
│  │  │ ★★★★★ (128)       │  │ ★★★★★ (94)        │  │ ★★★★☆ (67)        ││  │
│  │  │ PGA Pro • 15 yrs   │  │ LPGA Pro • 10 yrs │  │ Teaching Pro • 8yr││  │
│  │  │ Your coach ✓       │  │                   │  │                   ││  │
│  │  │ [Selected]         │  │ [Select]          │  │ [Select]          ││  │
│  │  └────────────────────┘  └────────────────────┘  └────────────────────┘│  │
│  │                                                                         │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │  2. SELECT SESSION TYPE                                                 │  │
│  │                                                                         │  │
│  │  ○ Video Swing Review        30 min    499 kr    Best for quick feedback│  │
│  │  ● Full Coaching Session     60 min    899 kr    Comprehensive lesson   │  │
│  │  ○ Playing Lesson            90 min   1299 kr    On-course coaching    │  │
│  │  ○ Video Call Consultation   45 min    699 kr    Remote session        │  │
│  │                                                                         │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │  3. SELECT DATE & TIME                                                  │  │
│  │                                                                         │  │
│  │       ◀  January 2025  ▶                                               │  │
│  │                                                                         │  │
│  │  Mon   Tue   Wed   Thu   Fri   Sat   Sun                               │  │
│  │        31     1     2     3     4     5                                │  │
│  │               ○     ●     ○     ○     ○                                │  │
│  │   6     7     8     9    10    11    12                                │  │
│  │   ○     ○     ○     ○     ○     ○     ○                                │  │
│  │                                                                         │  │
│  │  AVAILABLE TIMES FOR THU, JAN 2                                         │  │
│  │                                                                         │  │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐               │  │
│  │  │ 09:00  │ │ 10:00  │ │ 11:00  │ │ 14:00  │ │ 15:00  │               │  │
│  │  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘               │  │
│  │                                    [Selected]                          │  │
│  │                                                                         │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │  BOOKING SUMMARY                                                        │  │
│  │                                                                         │  │
│  │  Coach:     Mike Thompson                                               │  │
│  │  Session:   Full Coaching Session (60 min)                             │  │
│  │  Date:      Thursday, January 2, 2025                                  │  │
│  │  Time:      14:00 - 15:00                                              │  │
│  │  Location:  Oslo Golf Club                                             │  │
│  │  ─────────────────────────────────────────────                         │  │
│  │  Total:     899 kr                                                     │  │
│  │                                                                         │  │
│  │                                              [Confirm Booking]          │  │
│  │                                                                         │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                │
└────────────────────────────────────────────────────────────────────────────────┘
```
