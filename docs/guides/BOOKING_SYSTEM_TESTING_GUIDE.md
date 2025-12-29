# Booking/Calendar System - Testing Guide

## Overview
This guide provides step-by-step instructions for testing the complete booking and calendar system integration.

## Prerequisites

### Backend Setup
1. **Database Running**
   ```bash
   # Ensure PostgreSQL is running via Docker
   docker ps | grep postgres
   ```

2. **Start Backend Server**
   ```bash
   cd backend-fastify
   npm run dev
   ```

   ✅ Verify: Server should be running at `http://localhost:3000`

   Check health endpoint:
   ```bash
   curl http://localhost:3000/health
   ```

3. **Verify API Documentation**
   - Open browser: `http://localhost:3000/docs`
   - Confirm all endpoints visible:
     - `/api/v1/availability/*`
     - `/api/v1/bookings/*`
     - `/api/v1/calendar/*`

### Frontend Setup
1. **Start Frontend Server**
   ```bash
   cd IUP_Master_Folder_2/frontend
   npm run dev
   ```

   ✅ Verify: Frontend should be running (usually `http://localhost:5173`)

2. **Login**
   - Use test credentials for a player account
   - Navigate to Kalender screen

---

## Test Suite 1: Calendar Display

### Test 1.1: Month View
**Steps:**
1. Navigate to Kalender screen
2. Default view should be "Month"
3. Verify:
   - ✅ Current month displayed with correct name (Norwegian)
   - ✅ Days of week in Norwegian (Søn, Man, Tir, etc.)
   - ✅ Current day highlighted with gold ring
   - ✅ Calendar grid shows all days
   - ✅ Events displayed in calendar cells (if any exist)

**Expected Result:**
- Clean month grid layout
- Events color-coded by type
- Today's date clearly marked

### Test 1.2: Week View
**Steps:**
1. Click "Uke" button in view switcher
2. Verify:
   - ✅ Current week displayed with ISO week number
   - ✅ 7 days shown (Monday-Sunday)
   - ✅ Time grid from 7:00 to 20:00
   - ✅ Events placed in correct time slots
   - ✅ Current day highlighted

**Expected Result:**
- Timeline view with hourly slots
- Events at correct times
- Scrollable if needed

### Test 1.3: Day View
**Steps:**
1. Click "Dag" button
2. Verify:
   - ✅ Single day view with full date in Norwegian
   - ✅ Hourly breakdown (7:00-20:00)
   - ✅ Events listed by time with full details
   - ✅ Empty slots show "Ingen hendelser"

**Expected Result:**
- Detailed day schedule
- All event information visible

### Test 1.4: Navigation
**Steps:**
1. In Month view:
   - Click "←" button → Should go to previous month
   - Click "→" button → Should go to next month
   - Click "I dag" button → Should return to current month

2. In Week view:
   - Click "←" → Previous week
   - Click "→" → Next week
   - Click "I dag" → Current week

3. In Day view:
   - Click "←" → Previous day
   - Click "→" → Next day
   - Click "I dag" → Today

**Expected Result:**
- Smooth navigation without errors
- Header title updates correctly
- Events load for new date range

---

## Test Suite 2: Event Filtering

### Test 2.1: Open Filters
**Steps:**
1. Click filter icon (funnel) in header
2. Verify:
   - ✅ Filter panel expands
   - ✅ Shows "Hendelsestype" dropdown
   - ✅ Shows "Status" dropdown

### Test 2.2: Filter by Event Type
**Steps:**
1. Open filter panel
2. Select "Individuell trening" from Hendelsestype
3. Verify:
   - ✅ Only individual training sessions displayed
   - ✅ Other event types hidden
4. Select "Alle typer"
5. Verify all events return

**Expected Result:**
- Events filter immediately
- Count updates correctly
- No errors in console

### Test 2.3: Filter by Status
**Steps:**
1. Select "Bekreftet" from Status dropdown
2. Verify only confirmed events show
3. Try other statuses (Planlagt, Fullført, Avlyst)
4. Select "Alle statuser" to reset

**Expected Result:**
- Correct filtering
- Calendar updates in real-time

---

## Test Suite 3: Event Details Modal

### Test 3.1: Open Event Modal
**Steps:**
1. Click any event in the calendar
2. Verify modal opens with:
   - ✅ Event title
   - ✅ Event type badge (colored)
   - ✅ Date and time
   - ✅ Location (if set)
   - ✅ Coach information
   - ✅ Participants list
   - ✅ Status badge

**Expected Result:**
- Modal displays all event details
- Colors match event type
- Information is accurate

### Test 3.2: Close Event Modal
**Steps:**
1. Open event modal
2. Click "X" button → Modal closes
3. Open again
4. Click "Lukk" button → Modal closes
5. Open again
6. Click outside modal → Modal closes

**Expected Result:**
- All close methods work
- Calendar remains functional

---

## Test Suite 4: Booking Flow (Critical Path)

### Test 4.1: Open Booking Modal
**Steps:**
1. As a player, verify "Ny Booking" button is visible
2. Click "Ny Booking"
3. Verify modal opens showing Step 1

**Expected Result:**
- Modal displays with progress indicator
- Step 1/3 highlighted
- Form fields visible

### Test 4.2: Step 1 - Select Coach & Date
**Steps:**
1. **Coach Selection:**
   - Open coach dropdown
   - Verify coaches are listed
   - Select a coach
   - ✅ Coach selected

2. **Date Selection:**
   - Click date picker
   - Verify past dates are disabled
   - Select a future date (e.g., tomorrow)
   - ✅ Date selected

3. **Session Type:**
   - Open session type dropdown
   - Verify all event types listed with Norwegian labels
   - Select "Individuell trening"
   - ✅ Session type selected

4. **Navigation:**
   - Verify "Neste: Velg time" button is enabled
   - Click button
   - ✅ Advances to Step 2

**Expected Result:**
- All dropdowns populate correctly
- Validation prevents proceeding without required fields
- Smooth transition to Step 2

### Test 4.3: Step 2 - Select Time Slot

**Test Case A: Available Slots Exist**

**Steps:**
1. Wait for slots to load (loading spinner should appear)
2. Verify slots are displayed in grid
3. Check each slot shows:
   - ✅ Date with weekday (Norwegian)
   - ✅ Time range (e.g., "09:00 - 10:00")
   - ✅ Remaining capacity
4. Click a slot
5. Verify:
   - ✅ Slot highlights with green checkmark
   - ✅ Border changes to ak-primary color
6. Click "Neste: Legg til detaljer"
7. Watch for conflict checking:
   - ✅ Button shows "Sjekker konflikter..." with spinner
   - ✅ If no conflicts → Advances to Step 3
   - ✅ If conflicts → Shows warning message

**Expected Result:**
- Slots load within 2 seconds
- Selection is clear and responsive
- Conflict checking works correctly

**Test Case B: No Available Slots**

**Steps:**
1. Select a coach with no availability
2. Wait for loading to complete
3. Verify:
   - ✅ Shows calendar icon with message
   - ✅ "Ingen ledige timer funnet for valgt periode"
4. Click "← Tilbake"
5. Change coach or date
6. Verify slots appear

**Expected Result:**
- Clear messaging when no slots available
- Easy to go back and change selection

**Test Case C: Conflict Detection**

**Steps:**
1. Create a booking for a specific time
2. Try to create another booking at the same time
3. After clicking "Neste: Legg til detaljer", verify:
   - ✅ Yellow warning banner appears
   - ✅ Lists conflicts (coach_busy or player_busy)
   - ✅ Cannot proceed to Step 3
4. Go back and select a different slot
5. Verify can proceed without conflicts

**Expected Result:**
- Conflicts detected before booking creation
- Clear error messages
- Prevents double-booking

### Test 4.4: Step 3 - Add Details

**Steps:**
1. Verify Step 3 displays:
   - ✅ Selected slot summary in colored box
   - ✅ Title field (optional, pre-filled with session type)
   - ✅ Location field (optional)
   - ✅ Notes textarea (optional)

2. **Add Details:**
   - Leave title as default (test auto-fill)
   - Enter location: "Driving Range"
   - Enter notes: "Arbeide med driver"

3. **Submit Booking:**
   - Click "Opprett Booking"
   - Verify:
     - ✅ Button shows "Oppretter booking..." with spinner
     - ✅ Button is disabled during submission
   - Wait for completion

**Expected Result:**
- Form accepts input correctly
- Submission is smooth
- Loading state prevents double-submission

### Test 4.5: Successful Booking

**Steps:**
1. After submission completes, verify:
   - ✅ Modal closes automatically
   - ✅ Calendar view refreshes
   - ✅ New booking appears in calendar
   - ✅ Event is color-coded correctly
   - ✅ No error messages

2. Click the newly created event:
   - ✅ Event modal opens
   - ✅ All details are correct
   - ✅ Status is "Venter" (pending)

**Expected Result:**
- Complete end-to-end booking success
- Event immediately visible
- Data integrity maintained

### Test 4.6: Error Handling

**Test Case A: Network Error**

**Steps:**
1. Stop backend server
2. Try to create a booking
3. Verify:
   - ✅ Error message appears
   - ✅ "Kunne ikke opprette booking"
   - ✅ User can retry or cancel

**Test Case B: Validation Error**

**Steps:**
1. Try to proceed without selecting required fields
2. Verify buttons are disabled
3. Fill required fields
4. Verify buttons become enabled

**Expected Result:**
- Graceful error handling
- Clear user feedback
- No crashes

---

## Test Suite 5: API Endpoint Testing (Using Swagger UI)

### Open Swagger UI
Navigate to: `http://localhost:3000/docs`

### Test 5.1: Availability Endpoints

**GET /api/v1/availability**
```json
Query Parameters:
{
  "coachId": "[coach-uuid]",
  "isActive": true
}
```
✅ Returns list of availability slots

**POST /api/v1/availability** (Requires coach auth)
```json
{
  "coachId": "[coach-uuid]",
  "dayOfWeek": 1,
  "startTime": "09:00",
  "endTime": "17:00",
  "slotDuration": 60,
  "maxBookings": 1,
  "validFrom": "2025-01-01T00:00:00Z"
}
```
✅ Creates new availability slot

**GET /api/v1/availability/slots/available**
```json
{
  "coachId": "[coach-uuid]",
  "startDate": "2025-12-16",
  "endDate": "2025-12-23"
}
```
✅ Returns available booking slots

### Test 5.2: Booking Endpoints

**POST /api/v1/bookings/check-conflicts**
```json
{
  "coachId": "[coach-uuid]",
  "playerId": "[player-uuid]",
  "startTime": "2025-12-16T10:00:00Z",
  "endTime": "2025-12-16T11:00:00Z"
}
```
✅ Returns conflict status

**POST /api/v1/bookings**
```json
{
  "playerId": "[player-uuid]",
  "coachId": "[coach-uuid]",
  "startTime": "2025-12-16T10:00:00Z",
  "endTime": "2025-12-16T11:00:00Z",
  "sessionType": "individual_training",
  "title": "Driver Training",
  "location": "Driving Range",
  "notes": "Focus on accuracy"
}
```
✅ Creates booking with event

**GET /api/v1/bookings**
```json
Query: ?status=pending&page=1&limit=20
```
✅ Returns paginated bookings

**POST /api/v1/bookings/{id}/confirm**
✅ Confirms pending booking

**POST /api/v1/bookings/{id}/cancel**
```json
{
  "reason": "Player unavailable"
}
```
✅ Cancels booking with reason

### Test 5.3: Calendar Endpoints

**GET /api/v1/calendar/month/{year}/{month}**
```
Example: /api/v1/calendar/month/2025/12
```
✅ Returns all events for December 2025

**GET /api/v1/calendar/week/{year}/{week}**
```
Example: /api/v1/calendar/week/2025/50
```
✅ Returns events for ISO week 50

**GET /api/v1/calendar/events**
```json
{
  "startDate": "2025-12-01T00:00:00Z",
  "endDate": "2025-12-31T23:59:59Z",
  "eventTypes": "individual_training",
  "status": "confirmed"
}
```
✅ Returns filtered events

---

## Test Suite 6: Edge Cases & Stress Tests

### Test 6.1: Rapid Clicks
**Steps:**
1. Rapidly click navigation buttons
2. Rapidly switch view modes
3. Open/close modals quickly

**Expected Result:**
- No errors
- UI remains responsive
- No race conditions

### Test 6.2: Long Form Data
**Steps:**
1. Create booking with maximum length notes (1000+ characters)
2. Use very long location name
3. Submit

**Expected Result:**
- Form accepts long data
- Displays correctly in event modal

### Test 6.3: Multiple Bookings
**Steps:**
1. Create 5-10 bookings for the same day
2. View in Day view
3. Verify all bookings visible and accessible

**Expected Result:**
- Multiple events display correctly
- No overlap issues
- All events clickable

### Test 6.4: Timezone Handling
**Steps:**
1. Create booking at specific time
2. Verify time displays consistently across:
   - Calendar views
   - Event modal
   - API responses

**Expected Result:**
- Times are consistent
- No timezone conversion errors

---

## Test Suite 7: Responsive Design

### Test 7.1: Mobile View (< 640px)
**Steps:**
1. Resize browser to mobile width
2. Verify:
   - ✅ Calendar grid is readable
   - ✅ Buttons don't overflow
   - ✅ Modal fits screen
   - ✅ Form fields are usable

### Test 7.2: Tablet View (640-1024px)
**Steps:**
1. Resize to tablet width
2. Verify calendar layout adapts
3. Check modal sizing

### Test 7.3: Desktop View (> 1024px)
**Steps:**
1. View at full desktop size
2. Verify optimal layout
3. Check for excessive whitespace

---

## Test Suite 8: Browser Compatibility

Test on:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

Verify:
- All features work
- Styles render correctly
- No console errors

---

## Performance Tests

### Test 8.1: Large Dataset
**Steps:**
1. Create 50+ events in database
2. Load calendar
3. Measure:
   - Initial load time (< 2 seconds)
   - View switching (< 500ms)
   - Filter application (< 300ms)

### Test 8.2: Network Throttling
**Steps:**
1. Enable "Slow 3G" in DevTools
2. Test booking creation
3. Verify loading states appear
4. Ensure no timeout errors

---

## Accessibility Tests

### Test 9.1: Keyboard Navigation
**Steps:**
1. Navigate calendar using Tab key
2. Activate buttons with Enter/Space
3. Close modals with Escape

**Expected Result:**
- All interactive elements reachable
- Focus indicators visible
- Logical tab order

### Test 9.2: Screen Reader
**Steps:**
1. Enable screen reader (VoiceOver/NVDA)
2. Navigate calendar
3. Verify announcements make sense

---

## Regression Tests

After any changes, verify:
- ✅ Existing events still load
- ✅ Other calendar features unchanged
- ✅ No new console errors
- ✅ Database integrity maintained

---

## Bug Report Template

If you find issues, report with:

```markdown
### Bug Title
Brief description

**Steps to Reproduce:**
1. Step one
2. Step two
3. Step three

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Environment:**
- Browser: Chrome 120
- OS: macOS 14
- Frontend: Running on localhost:5173
- Backend: Running on localhost:3000

**Screenshots/Logs:**
[Attach if available]

**Console Errors:**
```
[Paste any console errors]
```

**Severity:**
Critical / High / Medium / Low
```

---

## Success Criteria

The booking/calendar system passes testing if:

✅ All calendar views display correctly
✅ Event filtering works without errors
✅ Event modals show complete information
✅ Booking creation flow completes successfully
✅ Conflict detection prevents double-bookings
✅ API endpoints return correct data
✅ No console errors during normal use
✅ Responsive design works on all screen sizes
✅ Performance meets targets (< 2s initial load)
✅ Error handling is graceful and informative

---

## Next Steps After Testing

1. **Document Findings** - Create issue tickets for any bugs found
2. **User Acceptance Testing** - Have actual users test the flow
3. **Load Testing** - Test with production-level data
4. **Security Review** - Verify authentication/authorization
5. **Production Deployment** - Deploy to staging environment

---

**Last Updated:** 2025-12-15
**Version:** 1.0
**Maintainer:** IUP Golf Academy Development Team
