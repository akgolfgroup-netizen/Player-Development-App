# Booking & Calendar System - User Guide

## Introduction

Welcome to the IUP Golf Booking & Calendar System! This guide will help you navigate the calendar interface and create bookings for training sessions.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Calendar Navigation](#calendar-navigation)
3. [Viewing Events](#viewing-events)
4. [Creating Bookings](#creating-bookings)
5. [Managing Bookings](#managing-bookings)
6. [Tips & Best Practices](#tips--best-practices)
7. [FAQ](#faq)

---

## Getting Started

### Accessing the Calendar

1. Log in to your IUP Golf account
2. Navigate to **"Kalender"** in the main menu
3. The calendar will load showing the current month

### User Roles

- **Players:** Can view events and create bookings
- **Coaches:** Can view all events and manage availability

---

## Calendar Navigation

### View Modes

The calendar offers three view modes:

#### 📅 Month View (Måned)
- **What:** Grid view showing entire month
- **Best for:** Overview of scheduled sessions
- **Features:**
  - See multiple weeks at once
  - Color-coded events by type
  - Today highlighted with gold ring
  - Up to 3 events shown per day

**How to use:**
1. Click "Måned" button in header
2. Use arrow buttons to navigate months
3. Click "I dag" to return to current month

#### 📊 Week View (Uke)
- **What:** Timeline view of one week
- **Best for:** Detailed weekly schedule
- **Features:**
  - Shows Monday-Sunday
  - Hourly time slots (7 AM - 8 PM)
  - Current day highlighted
  - ISO week number displayed

**How to use:**
1. Click "Uke" button
2. Use arrows to move between weeks
3. See events placed at correct times

#### 📋 Day View (Dag)
- **What:** Detailed single day schedule
- **Best for:** Daily planning
- **Features:**
  - Hour-by-hour breakdown
  - Full event details visible
  - Easy to spot free time
  - Shows event location and coach

**How to use:**
1. Click "Dag" button
2. Navigate with arrow buttons
3. View complete day schedule

### Navigation Controls

| Button | Action |
|--------|--------|
| ← | Previous (month/week/day) |
| → | Next (month/week/day) |
| I dag | Jump to today |

---

## Viewing Events

### Event Colors

Events are color-coded by type:

| Color | Event Type |
|-------|------------|
| 🟢 Green | Individual Training (Individuell trening) |
| 🔵 Blue | Group Training (Fellestrening) |
| 🟣 Purple | Test Session (Testdag) |
| 🔴 Red | Tournament (Resultat-turnering) |
| 🟡 Yellow | Breaking Point Assessment |
| 🟠 Orange | Calibration Session |

### Viewing Event Details

**To view full event information:**

1. Click any event in the calendar
2. Event detail modal opens showing:
   - Event title and type
   - Date and time
   - Location (if specified)
   - Coach name
   - Participants list
   - Current status

3. Close modal by:
   - Clicking "X" button
   - Clicking "Lukk" button
   - Clicking outside the modal
   - Pressing Escape key

### Filtering Events

**To filter events:**

1. Click filter icon (🔽) in calendar header
2. Filter panel expands
3. Choose filters:
   - **Hendelsestype:** Filter by event type
   - **Status:** Filter by booking status
     - Planlagt (Scheduled)
     - Bekreftet (Confirmed)
     - Fullført (Completed)
     - Avlyst (Cancelled)
4. Calendar updates automatically
5. Select "Alle typer" or "Alle statuser" to reset

---

## Creating Bookings

### Prerequisites

To create a booking, you need:
- ✅ Active player account
- ✅ Available coach slots
- ✅ No scheduling conflicts

### Step-by-Step Booking Process

#### Step 1: Open Booking Modal

1. Click **"Ny Booking"** button (green button in calendar header)
2. Booking modal opens showing progress indicator (Step 1 of 3)

#### Step 2: Select Coach & Date

**Fill out the form:**

1. **Trener (Coach):**
   - Open dropdown
   - Select your preferred coach
   - ✅ Coach selected

2. **Dato (Date):**
   - Click date picker
   - Select a future date (past dates are disabled)
   - ✅ Date selected

3. **Type økt (Session Type):**
   - Choose session type:
     - Individuell trening (Individual Training)
     - Fellestrening (Group Training)
     - Testdag (Test Session)
     - And more...
   - Default: Individuell trening

4. Click **"Neste: Velg time"** to proceed

**Validation:**
- All required fields must be filled
- Button is disabled until form is complete
- "Laster..." appears while loading slots

#### Step 3: Choose Time Slot

**View available slots:**

1. Available slots load automatically
2. Slots are displayed in a grid showing:
   - Day and date (Norwegian format)
   - Time range (e.g., 09:00 - 10:00)
   - Remaining capacity
3. If no slots available:
   - Message displays: "Ingen ledige timer funnet"
   - Click "← Tilbake" to change coach/date

**Select a slot:**

1. Click on your preferred time slot
2. Slot highlights with:
   - Green checkmark ✓
   - Forest green border
   - Light background
3. Click **"Neste: Legg til detaljer"**

**Conflict checking:**
- System checks for scheduling conflicts
- Button shows "Sjekker konflikter..." with spinner
- If conflicts found:
  - ⚠️ Yellow warning banner appears
  - Lists specific conflicts
  - Cannot proceed until resolved
- If no conflicts:
  - ✅ Advances to Step 3

**Common conflicts:**
- Coach is busy at that time
- You have another session scheduled
- Selected slot became unavailable

#### Step 4: Add Details (Optional)

**View slot summary:**
- Colored box shows selected date and time
- Confirm details are correct

**Fill optional fields:**

1. **Tittel (Title):**
   - Leave blank to use default (e.g., "Individuell trening")
   - Or enter custom title (e.g., "Driver Technique Session")

2. **Sted (Location):**
   - Enter location if known
   - Examples: "Bane 1", "Driving Range", "Practice Green"

3. **Notater (Notes):**
   - Add any special requests or focus areas
   - Examples:
     - "Arbeide med driver"
     - "Fokus på kortspill"
     - "Forberede til turnering"

**Submit booking:**

1. Review all information
2. Click **"Opprett Booking"**
3. Button changes to "Oppretter booking..." with spinner
4. Button is disabled during submission
5. Wait for confirmation

**Success:**
- ✅ Modal closes automatically
- ✅ Calendar refreshes
- ✅ New booking appears in calendar
- ✅ Event is color-coded correctly

**If error occurs:**
- ❌ Error message displays in red banner
- Read error message
- Try again or contact support

### Quick Tips for Booking

✅ **DO:**
- Book at least 24 hours in advance
- Add notes about your goals
- Confirm the time zone is correct
- Check for conflicts before submitting

❌ **DON'T:**
- Double-book yourself
- Book during times you're unavailable
- Leave important details out of notes
- Close browser during submission

---

## Managing Bookings

### Viewing Your Bookings

1. Use calendar filters to show only your events
2. Or navigate to specific dates
3. Click events to see booking details

### Booking Status

Your bookings can have these statuses:

| Status | Norwegian | Meaning |
|--------|-----------|---------|
| Pending | Venter | Awaiting coach confirmation |
| Confirmed | Bekreftet | Coach has confirmed |
| Completed | Fullført | Session has occurred |
| Cancelled | Avlyst | Booking was cancelled |

### Canceling a Booking

**Currently unavailable in UI** - Contact your coach directly to cancel

**Note:** Feature coming soon to allow self-service cancellation

---

## Tips & Best Practices

### For Best Results

1. **Book Early:**
   - Popular time slots fill quickly
   - Book 1-2 weeks in advance when possible

2. **Be Specific:**
   - Add detailed notes about your goals
   - Mention equipment you'll bring
   - Note any recent injuries or limitations

3. **Check Conflicts:**
   - Review your schedule before booking
   - Avoid back-to-back sessions if you're new
   - Allow travel time between locations

4. **Communicate:**
   - If you need to change a booking, contact coach ASAP
   - Provide 24-hour notice for cancellations
   - Update your availability preferences

### Using Calendar Effectively

1. **Set a Routine:**
   - Book standing weekly sessions
   - Use same coach for consistency
   - Track your progress over time

2. **Plan Ahead:**
   - Use Month view to see upcoming schedule
   - Book around tournaments and events
   - Leave recovery days between sessions

3. **Stay Organized:**
   - Add location details
   - Note what to bring in booking notes
   - Review day before each session

---

## FAQ

### General Questions

**Q: Can I book sessions with multiple coaches?**
A: Yes! Each booking is with one coach, but you can create multiple bookings with different coaches.

**Q: How far in advance can I book?**
A: Depends on coach availability settings. Typically 1-3 months in advance.

**Q: Can I book recurring sessions?**
A: Not yet through the UI. Contact your coach to set up recurring sessions manually.

**Q: What if my preferred time isn't available?**
A: Try a different day or coach, or ask your coach to add availability.

### Booking Questions

**Q: Why can't I see any available slots?**
A: Possible reasons:
- Coach hasn't set availability for that period
- All slots are booked
- Looking at past dates (disabled)
- Try selecting a different coach or date range

**Q: What does "coach_busy" conflict mean?**
A: The coach has another session at that time. Choose a different slot.

**Q: What does "player_busy" conflict mean?**
A: You have another session scheduled at that time. Choose a different slot or cancel the other session first.

**Q: Can I edit a booking after creating it?**
A: Editing via UI coming soon. For now, contact your coach to modify bookings.

**Q: Will I get a reminder?**
A: Email/SMS reminders feature is planned. For now, check your calendar regularly.

### Technical Questions

**Q: The calendar isn't loading. What should I do?**
A: Try these steps:
1. Refresh the page (F5 or Cmd+R)
2. Clear browser cache
3. Check internet connection
4. Try different browser
5. Contact support if issue persists

**Q: I get an error when creating a booking. What's wrong?**
A: Common causes:
- Network connection lost
- Selected slot became unavailable
- Server is down (rare)
- Read the error message for details
- Try again in a few minutes

**Q: Can I use the calendar on mobile?**
A: Yes! The calendar is responsive and works on phones and tablets.

**Q: What browsers are supported?**
A: Latest versions of:
- Chrome ✅
- Firefox ✅
- Safari ✅
- Edge ✅

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Esc | Close modal |
| Tab | Navigate form fields |
| Enter | Submit/confirm |
| ← → | Navigate calendar (when focused) |

---

## Need Help?

### Getting Support

1. **Technical Issues:**
   - Screenshot the error message
   - Note what you were trying to do
   - Contact: support@akgolfacademy.no

2. **Booking Questions:**
   - Contact your assigned coach directly
   - Or call academy front desk

3. **Feature Requests:**
   - We welcome feedback!
   - Email: feedback@akgolfacademy.no

---

## What's Coming Next

### Planned Features

- ✨ Recurring bookings
- ✨ Self-service cancellation
- ✨ Edit existing bookings
- ✨ Email/SMS reminders
- ✨ Payment integration
- ✨ Waiting list for full slots
- ✨ Group session registration
- ✨ Coach rating/feedback

---

## Glossary

**Booking:** A reserved time slot for a training session

**Availability:** Time periods when a coach is available for bookings

**Event:** A scheduled session (training, test, tournament, etc.)

**Slot:** A specific time block within an availability period

**Conflict:** When two events overlap in time for the same person

**Session Type:** Category of training (individual, group, test, etc.)

**Tenant:** Your organization (IUP Golf)

---

**Last Updated:** 2025-12-15
**Version:** 1.0
**For Questions:** Contact IUP Golf Support

**Happy Booking! ⛳**
