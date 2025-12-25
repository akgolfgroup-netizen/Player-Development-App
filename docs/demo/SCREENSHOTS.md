# Screenshots Liste - IUP Golf Academy Demo

Komplett liste over screenshots som trengs for demo-presentasjonen.

**Format:** PNG (best kvalitet)
**Oppløsning:** 1920x1080 minimum (16:9 for slides)
**Lagring:** `/docs/demo/screenshots/`

---

## Screenshot Tools

### macOS:
```bash
# Full screen
Cmd + Shift + 3

# Selected area
Cmd + Shift + 4

# Window (med shadow removed)
Cmd + Shift + 4, deretter Space, deretter Cmd + klikk
```

### Windows:
```bash
# Snipping Tool (Windows 10/11)
Windows + Shift + S

# Full screen
PrtScn
```

### Browser DevTools (for device mockups):
```bash
# Chrome/Edge
Cmd + Shift + M (macOS)
Ctrl + Shift + M (Windows)

# Velg device: iPhone 14 Pro, iPad Pro, Desktop
# Zoom: 100%
# Capture screenshot: Cmd + Shift + P → "Screenshot" → "Capture full size screenshot"
```

---

## Required Screenshots Checklist

### 1. Spiller Dashboard (Andreas Holm)

**Filnavn:** `01-player-dashboard-magnus.png`

**Hva vise:**
- [ ] Full dashboard view (scrolled til toppen)
- [ ] Profilinfo synlig (Andreas Holm, 16 år, Mørj Golfklubb)
- [ ] Key stats widgets:
  - 120 fullførte økter
  - Handicap: 5.2 (med graf som viser 6.2 → 3.9)
  - 24 badges opptjent
  - Dagens økter
  - Aktive mål (8 mål med progress bars)
- [ ] Sidebar meny synlig
- [ ] No scrollbars (hide eller crop dem ut)

**Browser settings:**
- Window size: 1920x1080
- Zoom: 100%
- Hide scrollbars (Chrome: Cmd + Shift + P → "Hide scrollbars")

---

### 2. Treningsplan - Ukeoversikt

**Filnavn:** `02-training-plan-week-view.png`

**Hva vise:**
- [ ] Full week view (Monday-Sunday)
- [ ] Fargekodet etter treningstype (teknikk=blue, fysisk=red, golfslag=green, etc.)
- [ ] Visuell periodisering (Grunnlagsperiode/Spesialiseringsperiode/Turneringsperiode)
- [ ] Sidebar meny synlig
- [ ] Clean, ingen error-meldinger

**Tips:**
- Zoom out litt hvis det ikke passer i viewport
- Eller ta screenshot av single week i grid-format

---

### 3. Treningsplan - Økt Detaljer

**Filnavn:** `03-training-session-details.png`

**Hva vise:**
- [ ] Modal eller detail view av én treningsøkt
- [ ] Øvelser liste med beskrivelser
- [ ] Estimert varighet (90-120 min)
- [ ] Fokusområde (f.eks. "Driver", "Putting")
- [ ] Læringsfase (L2-L5)
- [ ] Intensitet (1-5 stjerner)
- [ ] Clean UI, god spacing

---

### 4. Badge System - Grid View

**Filnavn:** `04-badges-grid.png`

**Hva vise:**
- [ ] Full badge grid (alle 85+ badges synlige hvis mulig, eller scroll til beste delen)
- [ ] 24 earned badges highlighted (farget, ikke grayed out)
- [ ] Låste badges med progress indicators
- [ ] Mix av kategorier (Putting Master, Driver King, Short Game Wizard, etc.)
- [ ] Hover state på ett badge (hvis mulig) for å vise unlock-kriterier

**Tips:**
- Zoom out litt for å få flere badges synlige
- Eller ta 2 screenshots: earned badges + locked badges

---

### 5. Badge Detail (Close-up)

**Filnavn:** `05-badge-detail-closeup.png`

**Hva vise:**
- [ ] Modal eller tooltip med badge-detaljer
- [ ] Badge ikon (stor, høy oppløsning)
- [ ] Navn: f.eks. "Putting Master - Sølv"
- [ ] Unlock kriterier: "85% accuracy fra 1.5m i 5 økter"
- [ ] Progress bar (hvis ikke unlocked)
- [ ] Earned date (hvis unlocked)

---

### 6. Tester - Historisk Oversikt

**Filnavn:** `06-tests-history.png`

**Hva vise:**
- [ ] Liste over alle 18 tester
- [ ] Datoer (siste 6 måneder)
- [ ] Test-navn (Driver Distance, Putting Accuracy, etc.)
- [ ] Resultater (210m → 242m)
- [ ] Trend-ikoner (opp-pil, ned-pil)

---

### 7. Test Progressjon - Graf

**Filnavn:** `07-test-progression-graph.png`

**Hva vise:**
- [ ] Line graph med driver distance progressjon (210m → 242m)
- [ ] X-akse: Tid (siste 6 måneder)
- [ ] Y-akse: Distance (meter)
- [ ] Data points synlige (18 tester)
- [ ] Trend line (lineær eller smooth)
- [ ] Clean, lesbar akser og labels

**Alternative:**
- Ta 2 screenshots hvis du har flere grafer (Driver Distance + Putting Accuracy)

---

### 8. Mål & Milestones

**Filnavn:** `08-goals-milestones.png`

**Hva vise:**
- [ ] Liste over 8 aktive mål
- [ ] 2 completed goals (grønn checkmark)
- [ ] 6 in-progress goals (progress bars: 50-90%)
- [ ] Målbeskrivelser synlige (f.eks. "Nå kategori A - Handicap 4.4 eller bedre")
- [ ] Target dates synlige
- [ ] Clean layout

---

### 9. Coach Dashboard - Oversikt

**Filnavn:** `09-coach-dashboard-overview.png`

**Hva vise:**
- [ ] Coach dashboard view (logged in som coach@demo.com)
- [ ] Spilleroversikt (15+ spillere i liste)
- [ ] Quick stats for hver spiller:
  - Navn
  - Handicap
  - Compliance rate (%)
  - Last session date
- [ ] Search/filter bar (hvis tilgjengelig)
- [ ] "Add new player" button synlig

---

### 10. Coach Dashboard - Magnus Detaljer

**Filnavn:** `10-coach-player-detail-magnus.png`

**Hva vise:**
- [ ] Detaljert fremgang for Andreas Holm
- [ ] Handicap-graf (6.2 → 3.9)
- [ ] Test-resultater liste
- [ ] Compliance chart (95% fullførte økter)
- [ ] Badges earned (24)
- [ ] Mål med fremgang
- [ ] "Send message" button synlig

---

### 11. Video-analyse (Optional - Beta Feature)

**Filnavn:** `11-video-analysis.png`

**Hva vise:**
- [ ] Swing video med trener-kommentarer
- [ ] Drawing tools visible (linjer, sirkler, arrows)
- [ ] Side-by-side comparison (hvis implementert)
- [ ] Playback controls (play, pause, frame-by-frame)
- [ ] Comments/annotations liste

**Note:** Hvis ikke implementert, skip denne

---

### 12. Mobile View - Dashboard (iPhone)

**Filnavn:** `12-mobile-dashboard.png`

**Device:** iPhone 14 Pro (390x844)

**Hva vise:**
- [ ] Dashboard på mobil (responsivt design)
- [ ] Hamburger menu synlig (top-left)
- [ ] Key stats synlige (handicap, økter, badges)
- [ ] Touch-friendly buttons (minst 44x44px)
- [ ] Clean, ingen overflow

**Browser DevTools:**
- Chrome → Cmd+Shift+M → Select "iPhone 14 Pro"
- Zoom: 100%
- Capture full size screenshot

---

### 13. Mobile View - Treningsplan (iPad)

**Filnavn:** `13-mobile-training-plan.png`

**Device:** iPad Pro 12.9" (1024x1366)

**Hva vise:**
- [ ] Treningsplan week view på tablet
- [ ] Grid layout tilpasset tablet bredde
- [ ] Sidebar collapsed eller hamburger menu
- [ ] Lesbare fonter og ikoner

---

### 14. Login Page (Clean State)

**Filnavn:** `14-login-page.png`

**Hva vise:**
- [ ] Login form (email + password felter)
- [ ] "IUP Golf Academy" logo/tittel
- [ ] "Logg inn" button
- [ ] "Glemt passord?" link (hvis implementert)
- [ ] Clean, profesjonell design
- [ ] Ingen error-meldinger synlige

**Tips:**
- Ta screenshot ETTER du har cleared session (ingen cached login)

---

### 15. Problem Illustration (Excel Mock-up)

**Filnavn:** `15-problem-excel-mockup.png`

**Hva lage:**
- [ ] Excel-ark med treningsplan (før IUP Golf Academy)
- [ ] Rader: Dato, Økt, Varighet, Fokus, Notater
- [ ] Ser rotete og manuelt ut (mange farger, dårlig formatering)
- [ ] Eksempel på fragmentert kommunikasjon (screenshot av SMS/WhatsApp)

**Alternative:**
- Google Sheets hvis du ikke har Excel
- Eller find stock photo av "messy spreadsheet"

---

## Optional Screenshots (Bonus)

### 16. Admin Dashboard (Optional)

**Filnavn:** `16-admin-dashboard.png`

**Hva vise:**
- Tenant management view
- System-wide statistikk
- User management

---

### 17. Architecture Diagram (Create in draw.io)

**Filnavn:** `17-architecture-diagram.png`

**Hva lage:**
- Simple 3-tier architecture drawing
- React App → Fastify API → PostgreSQL/Redis
- Background Jobs (BullMQ) (hvis relevant)
- Clean, professional diagram

**Tool:** draw.io, Lucidchart, eller Figma

---

### 18. Before/After Comparison

**Filnavn:** `18-before-after-comparison.png`

**Hva lage:**
- Side-by-side comparison
- Left: Excel/papir (messy, manual)
- Right: IUP Golf Dashboard (clean, modern)
- Arrow pointing from left to right ("→")

---

## Processing Screenshots

### 1. Resize (hvis nødvendig)

```bash
# macOS (med ImageMagick)
brew install imagemagick

convert input.png -resize 1920x1080 output.png
```

### 2. Compress (anbefalt for slides)

```bash
# Online tool
https://tinypng.com/

# eller CLI
pngquant input.png --output output.png
```

**Target file size:** < 500KB per screenshot (for raskere slide loading)

### 3. Annotate (hvis nødvendig)

**Tools:**
- **macOS Preview:** Markup toolbar (Cmd+Shift+A)
- **Skitch:** (gratis app for annotations)
- **Figma:** Import PNG → add arrows/text/highlights

**Annotations:**
- Red arrows pointing to key features
- Text callouts (yellow boxes med "KEY FEATURE!")
- Numbers (1, 2, 3) for step-by-step guides

---

## Screenshot Capture Checklist

**Pre-capture:**
- [ ] Browser window er 1920x1080 (eller device size for mobile)
- [ ] Zoom er 100%
- [ ] No scrollbars synlige (hide dem)
- [ ] No browser extensions visible (hide toolbar hvis mulig)
- [ ] Clean URL bar (demo URL synlig, ikke "localhost:3001")

**During capture:**
- [ ] Wait for all images/graphs to load
- [ ] Hover states removed (ikke ha mus over elements)
- [ ] No loading spinners synlige
- [ ] Clean state (no error messages, no toasts)

**Post-capture:**
- [ ] Verifiser at screenshot er sharp (ikke blurry)
- [ ] Crop ut browser chrome hvis nødvendig
- [ ] Save med descriptive filnavn (01-player-dashboard.png)
- [ ] Compress til < 500KB

---

## Screenshot Folder Structure

```
/docs/demo/screenshots/
  ├── 01-player-dashboard-magnus.png
  ├── 02-training-plan-week-view.png
  ├── 03-training-session-details.png
  ├── 04-badges-grid.png
  ├── 05-badge-detail-closeup.png
  ├── 06-tests-history.png
  ├── 07-test-progression-graph.png
  ├── 08-goals-milestones.png
  ├── 09-coach-dashboard-overview.png
  ├── 10-coach-player-detail-magnus.png
  ├── 11-video-analysis.png (optional)
  ├── 12-mobile-dashboard.png
  ├── 13-mobile-training-plan.png
  ├── 14-login-page.png
  ├── 15-problem-excel-mockup.png
  ├── 16-admin-dashboard.png (optional)
  ├── 17-architecture-diagram.png
  └── 18-before-after-comparison.png
```

---

## Tips for Best Screenshots

### 1. Clean Browser State:
```bash
# Clear cache
Cmd + Shift + Delete (Chrome)

# Disable extensions
Cmd + Shift + N (Incognito mode)

# Hide bookmarks bar
Cmd + Shift + B
```

### 2. Best Time of Day:
- Mornings (fewer background processes)
- After restarting computer (clean state)

### 3. Lighting (for phone photos of screen):
- Natural light (no glare)
- Or just use screenshot tools (better!)

### 4. Consistency:
- Same browser window size for all desktop screenshots
- Same zoom level (100%)
- Same font rendering (anti-aliasing on)

---

**Estimert tid:** 2-3 timer for alle screenshots + processing

**Priority screenshots (må ha):**
1-10 (Spiller + Coach perspective)

**Optional screenshots (nice to have):**
11-18 (Video, mobile, diagrams)

---

_Lykke til med screenshot-capturene! 📸_
