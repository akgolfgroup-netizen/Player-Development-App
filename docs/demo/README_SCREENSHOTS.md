# Screenshot Capture - Quick Reference

## 🚀 Quick Start (Recommended)

**Run the interactive wizard:**

```bash
cd /Users/anderskristiansen/Developer/IUP_Master_V1
bash docs/demo/capture-all-screenshots.sh
```

This script will:
- ✅ Guide you through each screenshot
- ✅ Provide clear instructions
- ✅ Give 10-second countdown before each capture
- ✅ Save all files with correct names
- ✅ ~15-20 minutes total

---

## 📋 What Screenshots Will Be Captured

| # | Filename | Description | View |
|---|----------|-------------|------|
| 1 | `01-player-dashboard-andreas.png` | Andreas Holm dashboard with stats | Player |
| 2 | `02-badges-grid.png` | Badge grid (24 earned) | Player |
| 3 | `03-test-progression-graph.png` | Test results with graphs | Player |
| 4 | `04-training-plan-week-view.png` | Training calendar | Player |
| 5 | `05-goals-milestones.png` | Goals with progress bars | Player |
| 6 | `06-coach-dashboard-overview.png` | Player list | Coach |
| 7 | `07-coach-player-detail-andreas.png` | Andreas Holm details | Coach |
| 8 | `08-mobile-dashboard.png` | Mobile responsive view | Mobile |

---

## ⚙️ Prerequisites

Before running the script:

1. **Web app running:**
   ```bash
   cd apps/web && npm start
   # Should be at: http://localhost:3001
   ```

2. **API running:**
   ```bash
   cd apps/api && npm run dev
   # Should be at: http://localhost:3000
   ```

3. **Browser setup:**
   - Open http://localhost:3001 in browser
   - Make window fullscreen: `Cmd + Ctrl + F`
   - Hide bookmarks bar: `Cmd + Shift + B`
   - Set zoom to 100%: `Cmd + 0`

4. **Demo data seeded:**
   ```bash
   cd apps/api && npm run seed:demo
   ```

---

## 🎯 Alternative: Manual Capture

If the script doesn't work, capture manually:

```bash
# For each screenshot:
cd /Users/anderskristiansen/Developer/IUP_Master_V1

# 1. Prepare screen (navigate to correct page)
# 2. Run:
screencapture -x docs/demo/screenshots/FILENAME.png

# Or use macOS built-in:
# Cmd + Shift + 4 (select area)
# Cmd + Shift + 3 (full screen)
```

See `SCREENSHOT_GUIDE.md` for detailed steps for each screenshot.

---

## ✅ After Capturing

1. **Review screenshots:**
   ```bash
   open docs/demo/screenshots/
   ```

2. **Check file sizes:**
   ```bash
   ls -lh docs/demo/screenshots/*.png
   ```

3. **Compress if needed** (> 5MB):
   ```bash
   # Install ImageMagick: brew install imagemagick
   cd docs/demo/screenshots/
   for img in *.png; do
       convert "$img" -quality 85 -resize 1920x1080\> "$img"
   done
   ```

4. **Use in presentation:**
   - Import into Google Slides / Keynote
   - Follow `SLIDES_CHECKLIST.md`
   - Add annotations (arrows, callouts)

---

## 🔧 Troubleshooting

### "Web app is not running"
```bash
cd apps/web
PORT=3001 npm start
```

### "Screenshot is blank/black"
- Click on browser window to focus it
- Don't minimize browser during capture
- Try again

### "Wrong content visible"
- Verify you're logged in with correct account
- Check you're on the right page
- Clear cache and refresh

### "Script won't run"
```bash
# Make executable:
chmod +x docs/demo/capture-all-screenshots.sh

# Run again:
bash docs/demo/capture-all-screenshots.sh
```

---

## 📦 Output

All screenshots saved to:
```
/Users/anderskristiansen/Developer/IUP_Master_V1/docs/demo/screenshots/
```

Expected files (8 total):
- 01-player-dashboard-andreas.png
- 02-badges-grid.png
- 03-test-progression-graph.png
- 04-training-plan-week-view.png
- 05-goals-milestones.png
- 06-coach-dashboard-overview.png
- 07-coach-player-detail-andreas.png
- 08-mobile-dashboard.png

---

## ⏱️ Time Estimate

- **Automated script:** 15-20 minutes
- **Manual capture:** 25-30 minutes
- **Review & optimize:** 10 minutes

**Total:** ~30-40 minutes

---

## 📚 Additional Resources

- `SCREENSHOT_GUIDE.md` - Detailed step-by-step guide
- `SLIDES_CHECKLIST.md` - Presentation slide checklist
- `demo-script.md` - Live demo walkthrough
- `LOCAL_TEST_RESULTS.md` - Test verification results

---

**Ready to capture? Run:** `bash docs/demo/capture-all-screenshots.sh`
