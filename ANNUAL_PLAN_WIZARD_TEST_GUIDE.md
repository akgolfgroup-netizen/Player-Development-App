# Player Annual Plan Wizard - Manual Testing Guide

**Created**: 2026-01-09
**URL**: http://localhost:3000/plan/aarsplan/ny
**Feature**: Self-service annual plan creation for players

---

## 🎯 Test Objectives

1. Verify all 5 wizard steps function correctly
2. Test form validation at each step
3. Verify data persistence between steps
4. Test plan creation and save functionality
5. Verify overview page displays correctly
6. Test export functionality (iCal/PDF)

---

## 🚀 Pre-Testing Setup

### 1. Start Development Server
```bash
cd /Users/anderskristiansen/Developer/IUP_Master_V1/apps/web
npm start
```

### 2. Login as Demo Player
- **URL**: http://localhost:3000
- **Email**: player@demo.com
- **Password**: player123

### 3. Navigate to Wizard
- Click "Plan" in navigation
- Click "Årsplan"
- Click "Opprett årsplan" button (or go directly to http://localhost:3000/plan/aarsplan/ny)

---

## 📋 Testing Checklist

### Step 1: Basic Info (Grunnleggende Informasjon)

**URL**: `/plan/aarsplan/ny` (Step 1 of 5)

#### Elements to Test:
- [ ] **Plan Name Input**
  - Enter: "Min Årsplan 2026"
  - Validation: Required field
  - Error: Alert "Vennligst skriv inn et navn for planen"

- [ ] **Start Date Picker**
  - Select: Today or future date
  - Format: YYYY-MM-DD
  - Validation: Required

- [ ] **End Date Picker**
  - Select: Date after start date
  - Validation: Must be after start date
  - Error: Alert "Sluttdato må være etter startdato"

- [ ] **Player Level Radio Buttons**
  - Options: "Utvikler", "Talent", "Elite"
  - Default: Should have one selected
  - Test: Click each option

- [ ] **Buttons**
  - "Avbryt" → Should show confirm dialog and return to overview
  - "Neste" → Should validate and go to Step 2

#### Expected Behavior:
- Progress bar shows "Steg 1 av 5" and "20% fullført"
- All validations trigger before proceeding
- Data persists when returning from Step 2

---

### Step 2: Period Selection (Velg Perioder)

**Step**: 2 of 5

#### Elements to Test:
- [ ] **Period Type Cards** (4 types: E, G, S, T)
  - **E - Etablering** (Green)
    - Icon: 🌱
    - Description shown
    - Checkbox to select

  - **G - Grunntrening** (Blue)
    - Icon: 💪
    - Description shown
    - Checkbox to select

  - **S - Spesialisering** (Amber)
    - Icon: 🎯
    - Description shown
    - Checkbox to select

  - **T - Turnering** (Red)
    - Icon: 🏆
    - Description shown
    - Checkbox to select

- [ ] **Selection Validation**
  - Try "Neste" with 0 periods selected
  - Should require at least 1 period

- [ ] **Templates Section** (if shown)
  - Quick select templates for different levels
  - Should auto-select periods based on template

- [ ] **Buttons**
  - "Tilbake" → Return to Step 1 (data persists)
  - "Neste" → Validate selection and go to Step 3

#### Expected Behavior:
- Can select multiple period types
- Selection is highlighted/checked
- Progress bar shows "Steg 2 av 5" and "40% fullført"

---

### Step 3: Period Details (Detaljer for Hver Periode)

**Step**: 3 of 5

#### Elements to Test:
For **each selected period type**:

- [ ] **Period Name**
  - Pre-filled with default name
  - Editable
  - Example: "Etablering", "Grunntrening Fase 1"

- [ ] **Description** (optional)
  - Pre-filled with default
  - Editable textarea

- [ ] **Start Date**
  - Date picker
  - Should auto-suggest based on previous period
  - Validation: No overlap with other periods

- [ ] **End Date**
  - Date picker
  - Must be after start date
  - Validation: No overlap with other periods

- [ ] **Weekly Frequency Selector**
  - Buttons: 1, 2, 3, 4, 5, 6, 7 (økter per uke)
  - Default value based on period type
  - Should highlight selected value

- [ ] **Goals List**
  - Pre-filled with default goals for period type
  - Add new goal button
  - Remove goal button
  - Edit existing goals

- [ ] **Period Timeline Visualization**
  - Shows all periods on timeline
  - Color-coded by type
  - Shows duration and overlap warnings

#### Validations to Test:
- [ ] Period end date after start date
- [ ] No overlapping periods (should show error)
- [ ] Weekly frequency between 1-7
- [ ] All periods fit within plan start/end dates

#### Expected Behavior:
- Period cards shown in chronological order
- Timeline updates in real-time as dates change
- Overlap warnings shown clearly
- Progress bar shows "Steg 3 av 5" and "60% fullført"

---

### Step 4: Goals and Focus Areas

**Step**: 4 of 5

#### Elements to Test:
- [ ] **Overall Goals Section**
  - List of goals across all periods
  - Add new overall goal
  - Edit/remove goals
  - Goals tagged by period

- [ ] **Focus Areas**
  - Checkboxes for key focus areas:
    - [ ] Teknikk
    - [ ] Fysisk
    - [ ] Mental
    - [ ] Short Game
    - [ ] Long Game
    - [ ] Turnering
  - Multiple selection allowed

- [ ] **Notes/Comments** (optional)
  - Large textarea for additional notes
  - Max length validation if implemented

- [ ] **Buttons**
  - "Tilbake" → Return to Step 3
  - "Neste" → Go to Step 5 (Review)

#### Expected Behavior:
- Goals from all periods are consolidated
- Focus areas can be multi-selected
- Progress bar shows "Steg 4 av 5" and "80% fullført"

---

### Step 5: Review and Save (Oppsummering og Lagring)

**Step**: 5 of 5

#### Elements to Test:
- [ ] **Plan Summary**
  - Plan name displayed
  - Date range displayed
  - Player level displayed

- [ ] **Period Summary**
  - All periods listed
  - Each period shows:
    - Name and type badge
    - Date range
    - Weekly frequency
    - Total expected sessions
    - Goals list

- [ ] **Timeline Visualization**
  - Full plan timeline
  - All periods shown
  - Color-coded

- [ ] **Statistics**
  - Total periods count
  - Total expected training sessions
  - Average weekly frequency
  - Plan duration in weeks

- [ ] **Action Buttons**
  - "Tilbake" → Return to Step 4
  - "Lagre Plan" → Save and create plan
    - Should show loading state
    - Should disable during save
    - Should show success message
    - Should redirect to overview page

#### Expected Behavior:
- All entered data is correctly displayed
- Statistics are calculated correctly
- Save creates plan in database
- Progress bar shows "Steg 5 av 5" and "100% fullført"

---

## 📊 Overview Page Testing

**URL**: `/plan/aarsplan`

After creating a plan, test the overview page:

### Elements to Test:
- [ ] **Plan Header**
  - Plan name displayed
  - Date range displayed
  - "Kanseller plan" button
  - "Ny plan" button

- [ ] **Summary Statistics Cards**
  - Total periods count
  - Average sessions per week
  - Total expected sessions

- [ ] **Timeline Visualization**
  - Full plan timeline with all periods
  - Color-coded periods
  - Hover shows period details

- [ ] **Period Details List**
  - All periods shown in chronological order
  - Each period card shows:
    - Period number and name
    - Type badge (E/G/S/T)
    - Date range and duration
    - Weekly frequency
    - Total sessions estimate
    - Description
    - Goals list

- [ ] **Export Buttons** (if implemented)
  - Export to iCal
  - Export to PDF (print)

### Functionality to Test:
- [ ] **Cancel Plan**
  - Click "Kanseller plan"
  - Should show confirmation dialog
  - Should mark plan as cancelled
  - Should refresh view

- [ ] **Create New Plan**
  - Click "Ny plan"
  - Should navigate to wizard
  - Should check if active plan exists

---

## 🐛 Common Issues to Check

### Data Persistence
- [ ] Data persists when navigating back/forward through steps
- [ ] Browser refresh doesn't lose wizard state (if implemented)
- [ ] Canceling wizard clears all data

### Validation
- [ ] All required fields validated
- [ ] Date validations work correctly
- [ ] Period overlap detection works
- [ ] Alert messages are in Norwegian

### API Integration
- [ ] Plan saves to backend correctly
- [ ] Error handling for API failures
- [ ] Loading states shown during API calls
- [ ] Success/error messages displayed

### UI/UX
- [ ] Progress bar updates correctly
- [ ] Button states (enabled/disabled/loading)
- [ ] Responsive design on mobile
- [ ] Colors match TIER design system
- [ ] Norwegian language throughout

### Edge Cases
- [ ] Creating plan with only 1 period
- [ ] Creating plan with all 4 period types
- [ ] Very long plan names
- [ ] Plans spanning multiple years
- [ ] Overlapping period dates
- [ ] Invalid date selections

---

## 🔍 Browser Console Checks

Open browser DevTools (F12) and check:

1. **Console Tab**
   - [ ] No JavaScript errors
   - [ ] No React warnings
   - [ ] API calls succeed (200 status)

2. **Network Tab**
   - [ ] GET `/api/v1/players/{playerId}/annual-plan` - 200
   - [ ] POST `/api/v1/players/{playerId}/annual-plan` - 201
   - [ ] GET `/api/v1/players/{playerId}/annual-plan/templates` - 200

3. **React DevTools** (if installed)
   - [ ] Component hierarchy looks correct
   - [ ] State updates properly
   - [ ] No unnecessary re-renders

---

## ✅ Success Criteria

The wizard test is successful if:

1. ✅ All 5 steps navigate correctly
2. ✅ All form validations work
3. ✅ Data persists between steps
4. ✅ Plan saves to database successfully
5. ✅ Overview page displays the created plan
6. ✅ No console errors
7. ✅ All UI elements render correctly
8. ✅ Norwegian language is consistent
9. ✅ TIER design system colors are correct
10. ✅ Mobile responsive (test on narrow viewport)

---

## 📝 Test Results Template

```markdown
## Test Results - [Date]

**Tester**: [Your Name]
**Browser**: Chrome/Safari/Firefox [Version]
**Screen Size**: Desktop/Mobile

### Step 1: Basic Info
- ✅/❌ All elements render
- ✅/❌ Validation works
- ✅/❌ Navigation works
- Issues: [list any issues]

### Step 2: Period Selection
- ✅/❌ Period cards display
- ✅/❌ Selection works
- ✅/❌ Navigation works
- Issues: [list any issues]

### Step 3: Period Details
- ✅/❌ All fields work
- ✅/❌ Timeline shows correctly
- ✅/❌ Overlap detection works
- Issues: [list any issues]

### Step 4: Goals and Focus
- ✅/❌ Goals management works
- ✅/❌ Focus areas selectable
- Issues: [list any issues]

### Step 5: Review
- ✅/❌ Summary accurate
- ✅/❌ Save works
- ✅/❌ Redirect works
- Issues: [list any issues]

### Overview Page
- ✅/❌ Plan displays correctly
- ✅/❌ All data shown
- Issues: [list any issues]

### Overall Assessment
- **Status**: ✅ PASS / ❌ FAIL
- **Critical Issues**: [count]
- **Minor Issues**: [count]
- **Notes**: [additional notes]
```

---

## 🚨 Known Issues to Watch For

Based on the implementation, watch for:

1. **Period Overlap Validation** - Should prevent creating overlapping periods
2. **API Errors** - Backend might not be running on port 3000
3. **Loading States** - Check that loading spinners show during API calls
4. **Norwegian Formatting** - Dates should use nb-NO locale
5. **Color Consistency** - Period colors should match TIER tokens

---

**Happy Testing!** 🎉
