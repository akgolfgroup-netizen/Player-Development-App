# Design Package for ChatGPT Analysis

> Complete design specification for AK Golf Academy IUP Platform

---

## 📐 DESIGN FILES

### Primary Source
**Location:** `/packages/design-system/figma/ak_golf_complete_figma_kit.svg`
- Complete Figma design kit exported as SVG
- All components, colors, typography, icons

### Mockups
**Location:** `/packages/design-system/mockups/`
- `AK Golf IUP App - Mockup Oversikt.pdf` (578KB) - Complete app overview
- Interactive HTML demos available

### Logo
**Location:** `/packages/design-system/figma/AK_Icon_Logo.svg`

---

## 🎨 DESIGN SYSTEM v2.1

### Brand Colors
```javascript
{
  primary: '#10456A',      // Primary - Professional blue
  primaryLight: '#2C5F7F', // Secondary - Light blue
  foam: '#EDF0F2',        // Background - Light gray
  ivory: '#EBE5DA',       // Surface - Off-white
  gold: '#C9A227',        // Accent - Gold
}
```

### Semantic Colors
```javascript
{
  success: '#4A7C59',     // Green - Completed, Positive
  warning: '#D4A84B',     // Yellow - Warning, In Progress
  error: '#C45B4E',       // Red - Error, Negative
}
```

### Neutrals
```javascript
{
  charcoal: '#1C1C1E',    // Primary text
  steel: '#8E8E93',       // Secondary text
  mist: '#E5E5EA',        // Borders
  cloud: '#F2F2F7',       // Light backgrounds
  white: '#FFFFFF',       // White
}
```

### Typography (Inter Font - Apple HIG Scale)
| Style | Size | Weight | Line Height | Use Case |
|-------|------|--------|-------------|----------|
| Large Title | 34px | 700 | 41px | Main titles |
| Title 1 | 28px | 700 | 34px | Screen titles |
| Title 2 | 22px | 700 | 28px | Sections, card titles |
| Title 3 | 20px | 600 | 25px | Session names |
| Headline | 17px | 600 | 22px | Buttons, list titles |
| Body | 17px | 400 | 22px | Body text, inputs |
| Callout | 16px | 400 | 21px | Metadata |
| Subhead | 15px | 400 | 20px | Labels |
| Footnote | 13px | 400 | 18px | Help text |
| Caption | 12px | 400 | 16px | Small labels |

### Icons
- **Library:** Lucide React (lucide-react npm package)
- **Size:** 24×24px
- **Stroke:** 1.5px
- **Style:** Round caps, round joins
- **Color:** #10456A (Blue Primary)

### Spacing Scale
```javascript
{
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
}
```

### Border Radius
```javascript
{
  sm: '8px',
  md: '12px',
  lg: '16px',
  full: '9999px',
}
```

### Shadows
```javascript
{
  card: '0 2px 4px rgba(0, 0, 0, 0.06)',
  elevated: '0 4px 12px rgba(0, 0, 0, 0.08)',
}
```

---

## 🗺️ APPLICATION ROUTES & SCREENS

### Route Structure
All routes use React Router with protected authentication.

| Route | Component | Feature Folder | Description |
|-------|-----------|----------------|-------------|
| `/login` | Login.jsx | features/auth/ | Login page (public) |
| `/` | AKGolfDashboard.jsx | features/dashboard/ | Main dashboard |
| `/profil` | ak_golf_brukerprofil_onboarding.jsx | features/profile/ | User profile |
| `/trenerteam` | Trenerteam.jsx | features/coaches/ | Coach team overview |
| `/maalsetninger` | Målsetninger.jsx | features/goals/ | Goals & objectives |
| `/aarsplan` | Aarsplan.jsx | features/annual-plan/ | Annual training plan |
| `/testprotokoll` | Testprotokoll.jsx | features/tests/ | Test protocols |
| `/testresultater` | Testresultater.jsx | features/tests/ | Test results |
| `/treningsprotokoll` | Treningsprotokoll.jsx | features/training/ | Training log |
| `/treningsstatistikk` | Treningsstatistikk.jsx | features/training/ | Training statistics |
| `/oevelser` | Øvelser.jsx | features/exercises/ | Exercise database |
| `/notater` | Notater.jsx | features/notes/ | Notes & journal |
| `/arkiv` | Arkiv.jsx | features/archive/ | Archive |
| `/kalender` | Kalender.jsx | features/calendar/ | Calendar view |

**Total:** 14 screens (1 public, 13 protected)

---

## 📦 COMPONENT LIBRARY

### Layout Components (`components/layout/`)
- **Navigation.jsx**
  - Fixed sidebar navigation (240px wide)
  - Blue Primary background (#10456A)
  - All 13 routes with icons
  - User profile at bottom
  - Logout button

### Guard Components (`components/guards/`)
- **ProtectedRoute.jsx**
  - Route wrapper for authentication
  - Redirects to /login if not authenticated
  - Shows loading state during auth check

### UI Components (`components/ui/`)
Design system examples and reusable components

### Shared Components
- All components use inline styles with design tokens
- No CSS modules or styled-components (uses inline React styles)
- Design tokens imported from `design-tokens.js`

---

## 🎯 SCREEN DESCRIPTIONS

### 1. Dashboard (`/`)
**Purpose:** Main overview screen after login
**Key Elements:**
- Welcome section with user info
- Key metrics cards (tests, training, goals)
- Recent activity
- Quick actions

### 2. User Profile (`/profil`)
**Purpose:** Player profile and onboarding
**Key Elements:**
- Personal information
- Category level (A-K)
- Handicap
- Coach assignment
- Emergency contacts

### 3. Coach Team (`/trenerteam`)
**Purpose:** View assigned coaches
**Key Elements:**
- List of coaches
- Coach contact info
- Specializations
- Schedule/availability

### 4. Goals (`/maalsetninger`)
**Purpose:** Set and track goals
**Key Elements:**
- Short-term goals
- Long-term goals
- Progress tracking
- Goal categories

### 5. Annual Plan (`/aarsplan`)
**Purpose:** View yearly training plan
**Key Elements:**
- Monthly breakdown
- Training phases
- Competition schedule
- Periodization

### 6. Test Protocol (`/testprotokoll`)
**Purpose:** Submit test results
**Key Elements:**
- Test type selection (20 different tests)
- Input form
- Auto-calculation
- Category requirements (A-K)

### 7. Test Results (`/testresultater`)
**Purpose:** View historical test results
**Key Elements:**
- Test history
- Progress charts
- Peer comparison
- Category benchmarks

### 8. Training Log (`/treningsprotokoll`)
**Purpose:** Log training sessions
**Key Elements:**
- Session entry form
- Training type
- Duration, intensity
- Notes

### 9. Training Statistics (`/treningsstatistikk`)
**Purpose:** View training analytics
**Key Elements:**
- Volume charts
- Intensity distribution
- Training balance
- Trends

### 10. Exercises (`/oevelser`)
**Purpose:** Exercise database and library
**Key Elements:**
- Exercise catalog (150+ exercises)
- Categories
- Instructions
- Videos/images

### 11. Notes (`/notater`)
**Purpose:** Player journal and notes
**Key Elements:**
- Note entries
- Date filtering
- Categories/tags
- Rich text

### 12. Archive (`/arkiv`)
**Purpose:** Historical data and archives
**Key Elements:**
- Past records
- Old plans
- Completed goals

### 13. Calendar (`/kalender`)
**Purpose:** Schedule and appointments
**Key Elements:**
- Calendar view
- Training sessions
- Tests
- Competitions

---

## 🎨 VISUAL STYLE

### Overall Aesthetic
- **Style:** Clean, professional, sports-focused
- **Inspiration:** Modern golf/sports apps
- **Tone:** Motivating but calm
- **Target:** Junior golfers (13-23 years)

### Navigation
- **Type:** Fixed left sidebar (240px)
- **Background:** Blue Primary (#10456A)
- **Text:** Ivory (#EBE5DA)
- **Icons:** Lucide React, 24px, white
- **Active state:** Gold accent (#C9A227)

### Content Area
- **Background:** Foam (#EDF0F2)
- **Cards:** Ivory (#EBE5DA) with card shadow
- **Padding:** 24px
- **Margins:** Left 240px (navigation width)

### Buttons
- **Primary:** Blue Primary background, Ivory text
- **Secondary:** Blue Light background
- **Accent:** Gold background
- **Border radius:** 8px
- **Padding:** 12px 24px
- **Font:** Headline (17px, 600 weight)

### Cards
- **Background:** Ivory (#EBE5DA)
- **Border radius:** 12px
- **Shadow:** card (0 2px 4px rgba(0,0,0,0.06))
- **Padding:** 24px

### Forms
- **Input background:** White
- **Border:** Mist (#E5E5EA)
- **Border radius:** 8px
- **Font:** Body (17px)
- **Label:** Subhead (15px)

---

## 📱 RESPONSIVE CONSIDERATIONS

### Desktop First
- Primary target: Desktop/laptop (1280px+)
- Navigation: Fixed sidebar
- Content: Full width with max-width container

### Mobile (Future)
- Navigation: Bottom tab bar
- Content: Full screen
- Gestures: Swipe navigation

---

## 🔗 DESIGN TOKENS ACCESS

### JavaScript/React
```javascript
import { tokens } from './design-tokens.js'

// Usage
style={{
  color: tokens.colors.primary,
  fontSize: tokens.typography.title1.fontSize,
  padding: tokens.spacing.lg,
}}
```

### Direct File Access
- **JavaScript:** `/apps/web/src/design-tokens.js`
- **CSS:** `/packages/design-system/tokens/tokens.css`
- **Tailwind:** `/packages/design-system/tokens/tailwind.config.js`

---

## 📊 CURRENT IMPLEMENTATION STATUS

### Implemented ✅
- All 13 screen components created
- Navigation with all routes
- Authentication flow (Login screen)
- Protected routing
- Design tokens in code
- Lucide React icons integrated

### Needs Work 🚧
- Components show mock/placeholder data
- Need API integration for real data
- Forms need validation
- Loading states needed
- Error boundaries needed
- Real images/media needed

---

## 🎯 DESIGN PRINCIPLES

1. **Clarity:** Clear hierarchy, obvious actions
2. **Consistency:** Same patterns throughout
3. **Feedback:** Clear success/error states
4. **Simplicity:** No unnecessary complexity
5. **Accessibility:** Readable text, clear contrast
6. **Performance:** Fast loading, responsive

---

## 📸 HOW TO ACCESS DESIGN FILES

### Figma Kit (SVG)
```bash
/packages/design-system/figma/ak_golf_complete_figma_kit.svg
```
Open this SVG in any browser or design tool to see all components.

### Mockup PDF
```bash
/packages/design-system/mockups/AK Golf IUP App - Mockup Oversikt.pdf
```
578KB PDF showing all screens and flows.

### Interactive Demos (HTML)
```bash
/packages/design-system/mockups/AK_Golf_Interactive_Demo_v2.1.html
```
Open in browser for interactive prototype.

---

**This design system follows Apple Human Interface Guidelines adapted for web, using modern sports app aesthetics with golf-specific branding.**
