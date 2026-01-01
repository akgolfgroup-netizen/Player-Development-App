# Presentation Guide - IUP Golf Academy

## 🎉 Your Presentation is Ready!

The presentation has been created at:
```
/Users/anderskristiansen/Developer/IUP_Master_V1/docs/demo/presentation.html
```

**It should be open in your browser now!**

---

## 🎮 How to Navigate

### Keyboard Controls

| Key | Action |
|-----|--------|
| **→** or **Space** | Next slide |
| **←** | Previous slide |
| **Home** | First slide |
| **End** | Last slide |
| **F** | Fullscreen mode |
| **S** | Speaker notes (if you add them) |
| **ESC** | Slide overview |
| **?** | Show help |

### Mouse/Touch
- Click right side of screen → Next slide
- Click left side of screen → Previous slide
- Swipe left/right on touch devices

---

## 📊 Slide Structure (15 Slides Total)

1. **Title Slide** - IUP Golf Academy introduction
2. **Problem** - Current challenges in golf coaching
3. **Solution** - IUP Golf Academy reveal
4. **Dashboard** - Player perspective (Andreas Holm)
5. **Training Plan** - Automated planning features
6. **Badges** - Gamification system
7. **Tests & Progress** - Measurable improvement
8. **Coach Dashboard** - Coach perspective
9. **Responsive** - Multi-device support
10. **Tech Architecture** - Technical stack
11. **Status** - Production-ready features
12. **Market** - Market potential & pricing
13. **Competition** - Competitive analysis
14. **Roadmap** - Next steps & timeline
15. **Q&A** - Closing slide

---

## 📸 Adding Screenshots

The presentation currently has placeholders for screenshots. To add them:

### Option 1: Manual Replacement

1. **Capture screenshots** (if not done yet):
   ```bash
   bash docs/demo/capture-all-screenshots.sh
   ```

2. **Edit presentation.html**:
   - Find placeholders like: `[01-player-dashboard-andreas.png vil vises her]`
   - Replace with:
     ```html
     <img src="screenshots/01-player-dashboard-andreas.png" alt="Dashboard">
     ```

### Option 2: Quick Image Insert

Add images to specific slides by editing the HTML:

```html
<!-- Example: Slide 4 - Dashboard -->
<section>
    <h2>Spillerperspektiv: Dashboard</h2>
    <img src="screenshots/01-player-dashboard-andreas.png"
         alt="Andreas Holm Dashboard"
         style="max-height: 500px;">
    <!-- Rest of slide content -->
</section>
```

### Required Screenshots

| Slide # | Screenshot File | Description |
|---------|----------------|-------------|
| 4 | `01-player-dashboard-andreas.png` | Player dashboard |
| 5 | `04-training-plan-week-view.png` | Training plan |
| 6 | `02-badges-grid.png` | Badges grid |
| 7 | `03-test-progression-graph.png` | Test graphs |
| 8 | `06-coach-dashboard-overview.png` | Coach dashboard |
| 9 | `08-mobile-dashboard.png` | Mobile view |

---

## 🎨 Customization

### Brand Colors

The presentation uses IUP Golf brand colors:

```css
--iup-blue: #1E40AF;      /* Primary blue */
--iup-green: #10B981;     /* Accent green */
--iup-dark: #1F2937;      /* Dark text */
--iup-light-blue: #DBEAFE; /* Light blue background */
```

To change colors, edit the `<style>` section in `presentation.html`.

### Fonts

Currently using **Inter** (Google Font fallback). To change:

```html
<head>
    <link href="https://fonts.googleapis.com/css2?family=Your+Font:wght@400;600;700&display=swap" rel="stylesheet">
</head>

<style>
    .reveal {
        font-family: 'Your Font', sans-serif;
    }
</style>
```

### Logo

To add a logo to all slides:

```html
<!-- Add before </div> closing tag -->
<div style="position: fixed; top: 20px; right: 20px; z-index: 10;">
    <img src="path/to/logo.png" style="height: 50px;">
</div>
```

---

## 📤 Export Options

### Option 1: PDF Export (Recommended for Sharing)

1. Open presentation in **Chrome/Edge**
2. Press **E** to enter print mode
3. Print to PDF:
   - **Destination:** Save as PDF
   - **Layout:** Landscape
   - **Margins:** None
   - **Background graphics:** Checked

**File saved as:** `IUP-Golf-Academy-Presentation.pdf`

### Option 2: PowerPoint/Keynote

Use an online converter:
- [slides.com](https://slides.com) - Import HTML, export to PPT
- [CloudConvert](https://cloudconvert.com) - HTML to PPT conversion

### Option 3: Host Online

1. **Upload to GitHub Pages:**
   ```bash
   # Copy presentation to gh-pages branch
   git checkout -b gh-pages
   cp docs/demo/presentation.html index.html
   cp -r docs/demo/screenshots screenshots/
   git add index.html screenshots/
   git commit -m "Add demo presentation"
   git push origin gh-pages
   ```

2. **Access at:**
   ```
   https://yourusername.github.io/IUP_Master_V1/
   ```

---

## 🎤 Presentation Tips

### Before Presenting

- [x] Test presentation on actual projector/screen
- [ ] Have backup PDF ready
- [ ] Test all navigation keys
- [ ] Practice transitions
- [ ] Time yourself (aim for 15-20 minutes)
- [ ] Prepare answers to common questions

### During Presentation

1. **Start in fullscreen** (press F)
2. **Use keyboard arrows** for smooth navigation
3. **Pause on key slides** (Dashboard, Badges, Market)
4. **Highlight stats** when visible
5. **End with Q&A slide** - leave it up during discussion

### Pacing Guide

| Slides | Time | Section |
|--------|------|---------|
| 1-2 | 2 min | Problem introduction |
| 3 | 1 min | Solution reveal |
| 4-9 | 10 min | Live demo walkthrough |
| 10-11 | 2 min | Technical overview |
| 12-13 | 2 min | Business case |
| 14 | 2 min | Next steps |
| 15 | 3+ min | Q&A |

**Total:** 15-20 minutes + Q&A

---

## 🔧 Troubleshooting

### Slides don't advance
- Check if reveal.js loaded (check browser console)
- Try refreshing page
- Use arrow keys instead of space

### Images don't show
- Verify screenshot files exist in `docs/demo/screenshots/`
- Check file paths in HTML are correct
- Try using absolute paths if relative paths fail

### Styling looks wrong
- Clear browser cache (Cmd + Shift + R)
- Check if reveal.js CSS loaded from CDN
- Verify internet connection (presentation uses CDN)

### Fullscreen doesn't work
- Press F or Cmd+Ctrl+F (macOS)
- Or use browser's fullscreen (View → Enter Full Screen)

---

## 📱 Mobile/Tablet Presentation

The presentation works on mobile devices:

- **Swipe left/right** to navigate
- **Pinch to zoom** on specific content
- **Tap** to advance slides

**Tip:** For best mobile experience, use landscape orientation.

---

## 🚀 Advanced Features

### Add Speaker Notes

```html
<section>
    <h2>Slide Title</h2>
    <p>Slide content</p>

    <aside class="notes">
        These are speaker notes - only visible when you press 'S'
        - Talking point 1
        - Talking point 2
    </aside>
</section>
```

Press **S** during presentation to open speaker view.

### Add Fragments (Reveal Content Progressively)

```html
<ul>
    <li class="fragment">First point</li>
    <li class="fragment">Second point (appears on next click)</li>
    <li class="fragment">Third point</li>
</ul>
```

### Add Videos

```html
<section>
    <h2>Video Demo</h2>
    <video controls width="800">
        <source src="demo-video.mp4" type="video/mp4">
    </video>
</section>
```

---

## 📋 Checklist Before Demo Day

- [ ] Screenshots captured and added to presentation
- [ ] Presentation tested on projector
- [ ] PDF backup created
- [ ] Laptop fully charged
- [ ] Remote clicker batteries checked
- [ ] Internet connection verified (for CDN assets)
- [ ] Demo credentials ready (player@demo.com / player123)
- [ ] FAQ prepared for Q&A
- [ ] Business cards ready
- [ ] Demo URL accessible (iupgolf-demo.up.railway.app)

---

## 📚 Additional Resources

- **Demo Script:** `docs/demo/demo-script.md`
- **Screenshot Guide:** `docs/demo/SCREENSHOT_GUIDE.md`
- **FAQ:** `docs/demo/FAQ.md`
- **Test Results:** `docs/demo/LOCAL_TEST_RESULTS.md`

---

## 🎯 Quick Commands

```bash
# Open presentation
open docs/demo/presentation.html

# Capture screenshots
bash docs/demo/capture-all-screenshots.sh

# Start demo app
cd apps/web && npm start

# Edit presentation
code docs/demo/presentation.html
```

---

**Your presentation is ready! Break a leg! 🎉🏌️**

**Presentation URL (local):**
```
file:///Users/anderskristiansen/Developer/IUP_Master_V1/docs/demo/presentation.html
```

**Keyboard shortcut:** Press **?** during presentation for help
