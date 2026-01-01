# Screenshot Capture Guide

## Quick Start

Run this script to capture all screenshots interactively:

```bash
cd /Users/anderskristiansen/Developer/IUP_Master_V1
bash docs/demo/capture-all-screenshots.sh
```

## Manual Capture (if script fails)

### Prerequisites
1. Web app running at: http://localhost:3001
2. API running at: http://localhost:3000
3. Browser window maximized (1920x1080 recommended)
4. Hide bookmarks bar: `Cmd + Shift + B`
5. Hide browser toolbars if possible

### Screenshot List

#### 1. Player Dashboard (Andreas Holm)
**Filename:** `01-player-dashboard-andreas.png`

**Steps:**
1. Navigate to: http://localhost:3001
2. Login with: `player@demo.com` / `player123`
3. Should land on dashboard automatically
4. Scroll to top of page
5. Make sure these are visible:
   - Andreas Holm name and profile
   - Handicap: 3.9 with progression graph
   - Training sessions count (~141)
   - Badges earned (24)
   - Active goals
6. Run: `bash docs/demo/capture-screenshot.sh 01-player-dashboard-andreas.png 5`

**What to show:**
- Clean, professional dashboard
- All key stats visible above the fold
- No loading spinners or errors

---

#### 2. Badges Grid
**Filename:** `02-badges-grid.png`

**Steps:**
1. Click on "Badges" or "Merker" in sidebar
2. Should see grid of all badges (85+ total)
3. 24 badges should be highlighted/earned
4. Locked badges shown in gray
5. Run: `bash docs/demo/capture-screenshot.sh 02-badges-grid.png 5`

**What to show:**
- Badge grid layout
- Mix of earned (colored) and locked (gray) badges
- Progress indicators if visible

---

#### 3. Test Progression Graph
**Filename:** `03-test-progression-graph.png`

**Steps:**
1. Click on "Tester" or "Tests" in sidebar
2. Should see list of test results
3. Look for graphs showing progression:
   - Driver distance: 210m → 242m
   - Putting accuracy: 65% → 82%
4. Run: `bash docs/demo/capture-screenshot.sh 03-test-progression-graph.png 5`

**What to show:**
- Line graphs with clear upward trends
- Before/after comparison visible
- Test names and dates

---

#### 4. Training Plan - Week View
**Filename:** `04-training-plan-week-view.png`

**Steps:**
1. Click on "Treningsplan" or "Training Plan" in sidebar
2. Should see calendar/week view
3. Look for color-coded sessions:
   - Blue = Technique
   - Red = Physical
   - Green = Golf shots
4. Run: `bash docs/demo/capture-screenshot.sh 04-training-plan-week-view.png 5`

**What to show:**
- Week layout with sessions
- Color coding visible
- Session details (duration, focus area)

---

#### 5. Goals & Milestones
**Filename:** `05-goals-milestones.png`

**Steps:**
1. Click on "Mål" or "Goals" in sidebar
2. Should see list of 8 goals:
   - 2 completed (green checkmark)
   - 6 in progress (progress bars)
3. Run: `bash docs/demo/capture-screenshot.sh 05-goals-milestones.png 5`

**What to show:**
- Goal names and descriptions
- Progress bars showing 50-90% completion
- Completed goals highlighted
- Target dates visible

---

#### 6. Coach Dashboard - Overview
**Filename:** `06-coach-dashboard-overview.png`

**Steps:**
1. Logout from player account
2. Login with: `coach@demo.com` / `coach123`
3. Should see coach dashboard with player list
4. Andreas Holm should be visible in the list
5. Run: `bash docs/demo/capture-screenshot.sh 06-coach-dashboard-overview.png 5`

**What to show:**
- List of players
- Player stats (handicap, compliance rate)
- Coach navigation/tools

---

#### 7. Coach - Player Detail (Andreas Holm)
**Filename:** `07-coach-player-detail-andreas.png`

**Steps:**
1. (Still logged in as coach)
2. Click on "Andreas Holm" in player list
3. Should open detailed player view
4. Run: `bash docs/demo/capture-screenshot.sh 07-coach-player-detail-andreas.png 5`

**What to show:**
- Andreas Holm detailed profile
- Handicap progression graph
- Training compliance chart
- Badges and test results

---

#### 8. Mobile View (iPhone)
**Filename:** `08-mobile-dashboard.png`

**Steps:**
1. Open browser DevTools: `Cmd + Option + I`
2. Toggle device toolbar: `Cmd + Shift + M`
3. Select "iPhone 14 Pro" from device dropdown
4. Refresh page to load mobile view
5. Login as player@demo.com if needed
6. Run: `bash docs/demo/capture-screenshot.sh 08-mobile-dashboard.png 5`

**What to show:**
- Mobile-responsive design
- Hamburger menu visible
- Stats readable on mobile
- Touch-friendly buttons

---

## Post-Capture Checklist

After capturing all screenshots:

1. **Review Quality**
   ```bash
   ls -lh docs/demo/screenshots/
   ```
   - All 8 files should exist
   - Each should be 500KB - 5MB

2. **Compress if Needed**
   ```bash
   # Using ImageMagick (install with: brew install imagemagick)
   cd docs/demo/screenshots/
   for img in *.png; do
       convert "$img" -quality 85 -resize 1920x1080\> "optimized-$img"
   done
   ```

3. **Verify Screenshots**
   ```bash
   open docs/demo/screenshots/
   ```
   - Check each image opens correctly
   - Verify no personal data visible
   - Confirm image is crisp and clear

4. **Ready for Slides**
   - Import screenshots into Google Slides / Keynote
   - Add annotations if needed (arrows, callouts)
   - Follow slide checklist in `SLIDES_CHECKLIST.md`

---

## Troubleshooting

### Screenshot is blank or black
- Make sure browser window is focused (click on it)
- Don't minimize browser during capture
- Try capturing again

### Text is blurry
- Ensure browser zoom is 100% (Cmd + 0)
- Use higher resolution display if available
- Check "Retina" or "HiDPI" mode in browser DevTools

### Wrong content visible
- Clear cache and refresh page
- Check you're logged in with correct account
- Verify you're on the right page/tab

### screencapture command not found
- This is macOS only
- On Windows, use Snipping Tool or Snip & Sketch
- On Linux, use `gnome-screenshot` or similar

---

## Automated Alternative

If manual capture is tedious, use the semi-automated script:

```bash
bash docs/demo/take-screenshots.sh
```

This script will:
- Guide you through each screenshot
- Give 10-second countdown before each capture
- Provide clear instructions for what to show
- Save all files with correct names

---

**Total time:** ~15-20 minutes for all 8 screenshots

**Next steps:** Review `SLIDES_CHECKLIST.md` to build your presentation.
