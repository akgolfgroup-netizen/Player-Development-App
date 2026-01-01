# Screenshot Setup Complete! ✅

## 🎬 Everything is Ready for Screenshot Capture

All automation scripts and documentation have been created. You can now capture all 8 demo screenshots in ~15-20 minutes.

---

## 🚀 How to Capture Screenshots

### Option 1: Automated Wizard (Recommended)

Run this single command:

```bash
cd /Users/anderskristiansen/Developer/IUP_Master_V1
bash docs/demo/capture-all-screenshots.sh
```

**What it does:**
- Guides you through each of the 8 screenshots
- Provides clear instructions for each screen
- Gives 10-second countdown before capturing
- Automatically saves files with correct names
- Shows progress and file sizes

**Time:** ~15-20 minutes total

---

### Option 2: Manual Capture

If you prefer manual control, follow the detailed guide:

```bash
open docs/demo/SCREENSHOT_GUIDE.md
```

Then use:
```bash
# Capture current screen
screencapture -x docs/demo/screenshots/FILENAME.png

# Or use macOS shortcuts:
# Cmd + Shift + 4 (select area)
# Cmd + Shift + 3 (full screen)
```

---

## 📋 8 Screenshots to Capture

| # | What to Show | Login As |
|---|--------------|----------|
| 1 | Dashboard (Andreas Holm, stats, graphs) | player@demo.com |
| 2 | Badges grid (24 earned, visible) | player@demo.com |
| 3 | Test progression graphs (upward trends) | player@demo.com |
| 4 | Training plan (week view, color-coded) | player@demo.com |
| 5 | Goals (8 goals with progress bars) | player@demo.com |
| 6 | Coach dashboard (player list) | coach@demo.com |
| 7 | Coach → Andreas Holm details | coach@demo.com |
| 8 | Mobile view (iPhone 14 Pro mockup) | player@demo.com |

---

## ✅ Pre-Flight Checklist

Before capturing, verify:

- [x] **Web app running:** http://localhost:3001 (currently RUNNING ✅)
- [x] **API running:** http://localhost:3000 (currently RUNNING ✅)
- [x] **Demo data seeded:** Andreas Holm with 141 sessions, 24 badges ✅
- [ ] **Browser open:** Navigate to http://localhost:3001
- [ ] **Browser fullscreen:** Cmd + Ctrl + F
- [ ] **Bookmarks hidden:** Cmd + Shift + B
- [ ] **Zoom at 100%:** Cmd + 0

---

## 📁 Output Location

Screenshots will be saved to:

```
/Users/anderskristiansen/Developer/IUP_Master_V1/docs/demo/screenshots/
```

Expected files:
1. `01-player-dashboard-andreas.png`
2. `02-badges-grid.png`
3. `03-test-progression-graph.png`
4. `04-training-plan-week-view.png`
5. `05-goals-milestones.png`
6. `06-coach-dashboard-overview.png`
7. `07-coach-player-detail-andreas.png`
8. `08-mobile-dashboard.png`

---

## 📚 Documentation Created

| File | Purpose |
|------|---------|
| `capture-all-screenshots.sh` | **Main script** - Interactive wizard |
| `README_SCREENSHOTS.md` | Quick reference guide |
| `SCREENSHOT_GUIDE.md` | Detailed step-by-step instructions |
| `capture-screenshot.sh` | Helper script for individual captures |
| `screenshot-automation.js` | Playwright automation (backup) |
| `take-screenshots.sh` | Semi-automated capture script |

---

## 🎯 Next Steps After Capture

1. **Review screenshots:**
   ```bash
   open docs/demo/screenshots/
   ```

2. **Check quality:**
   - All 8 files exist
   - Images are clear and crisp
   - No personal data visible
   - Correct content in each

3. **Optimize if needed:**
   ```bash
   # If files > 5MB, compress them:
   cd docs/demo/screenshots/
   for img in *.png; do
       sips -s format png -s formatOptions 85 "$img" --out "$img"
   done
   ```

4. **Create presentation:**
   - Follow `docs/demo/SLIDES_CHECKLIST.md`
   - Import screenshots into slides
   - Add annotations (arrows, callouts)

---

## 🔧 Troubleshooting

### Web app not accessible
```bash
cd apps/web
PORT=3001 npm start
```

### Screenshots are blank
- Click browser window to focus it
- Don't minimize during capture
- Try again

### Script won't run
```bash
chmod +x docs/demo/capture-all-screenshots.sh
bash docs/demo/capture-all-screenshots.sh
```

---

## ⏱️ Time Estimate

- **Capture (automated):** 15-20 minutes
- **Review & retake:** 5-10 minutes
- **Optimize/compress:** 5 minutes

**Total:** ~25-35 minutes

---

## 🎬 Ready to Start!

Run this command when you're ready:

```bash
cd /Users/anderskristiansen/Developer/IUP_Master_V1
bash docs/demo/capture-all-screenshots.sh
```

**The script will:**
1. Check if web app is running ✓
2. Guide you through each screenshot
3. Give countdown before each capture
4. Save all files automatically
5. Show summary when complete

---

## 📖 Additional Resources

- Live demo script: `docs/demo/demo-script.md`
- Slide checklist: `docs/demo/SLIDES_CHECKLIST.md`
- Test results: `docs/demo/LOCAL_TEST_RESULTS.md`
- Deployment guide: `docs/deployment/RAILWAY.md`

---

**Everything is ready! Start capturing whenever you want. 📸**

**Good luck with your demo presentation! 🎉**
