# AK GOLF IUP - KOMPLETT UI DESIGN SYSTEM
**Versjon:** 2.1 (Blue Palette 01)
**Dato:** 17. desember 2025
**Status:** Produksjonsklar - Implementert

---

## INNHOLDSFORTEGNELSE
1. [Design Tokens](#1-design-tokens)
2. [Typography System](#2-typography-system)
3. [Color Palette](#3-color-palette)
4. [Spacing & Layout Grid](#4-spacing--layout-grid)
5. [Component Library](#5-component-library)
6. [Responsive Breakpoints](#6-responsive-breakpoints)
7. [Screen Designs](#7-screen-designs)

---

## 1. DESIGN TOKENS

### Fargepalett

#### Brand Colors
```css
--ak-primary: #10456A         /* Primary brand color - professional blue */
--ak-primary-light: #2C5F7F   /* Lighter blue - hover states */
--ak-snow: #EDF0F2            /* Background - light snow */
--ak-surface: #EBE5DA         /* Cards/surfaces - warm khaki */
--ak-gold: #C9A227            /* Accent - premium gold */
```

#### Semantic Colors
```css
--ak-success: #4A7C59         /* Success states, positive metrics */
--ak-warning: #D4A84B         /* Warning, attention needed */
--ak-error: #C45B4E           /* Error states, critical alerts */
```

#### Neutrals
```css
--ak-charcoal: #1C1C1E        /* Headings, primary text */
--ak-steel: #8E8E93           /* Secondary text, icons */
--ak-mist: #E5E5EA            /* Borders, dividers */
--ak-cloud: #F2F2F7           /* Subtle backgrounds */
--ak-white: #FFFFFF           /* Pure white */
```

### Spacing Scale (4px base unit)
```css
--spacing-xs: 4px      /* Tight spacing (icon padding) */
--spacing-sm: 8px      /* Small gaps (button text padding) */
--spacing-md: 16px     /* Default spacing (card padding) */
--spacing-lg: 24px     /* Section spacing */
--spacing-xl: 32px     /* Large sections */
--spacing-xxl: 48px    /* Hero sections, major separations */
```

### Border Radius
```css
--radius-sm: 8px       /* Small elements (badges, tags) */
--radius-md: 12px      /* Default (buttons, inputs) */
--radius-lg: 16px      /* Cards, modals */
--radius-full: 9999px  /* Pills, circular elements */
```

### Shadows
```css
--shadow-card: 0 2px 4px rgba(0, 0, 0, 0.06)
--shadow-elevated: 0 4px 12px rgba(0, 0, 0, 0.08)
--shadow-float: 0 8px 24px rgba(0, 0, 0, 0.12)
```

---

## 2. TYPOGRAPHY SYSTEM

### Font Family
**Primary:** Inter (Google Fonts)
**Weights:** 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)

### Type Scale (iOS Human Interface Guidelines inspired)

| Style | Size | Line Height | Weight | Use Case |
|-------|------|-------------|--------|----------|
| **Display** | 32px | 40px | 700 | Hero headlines |
| **Title 1** | 26px | 32px | 700 | Page titles |
| **Title 2** | 21px | 28px | 600 | Section headings |
| **Title 3** | 19px | 26px | 600 | Card titles |
| **Body** | 17px | 24px | 400 | Body text, paragraphs |
| **Callout** | 15px | 22px | 400 | Secondary info |
| **Label** | 14px | 20px | 500 | Form labels, buttons |
| **Caption** | 12px | 16px | 400 | Metadata, timestamps |

### CSS Classes
```css
.text-display { font-size: 32px; line-height: 40px; font-weight: 700; }
.text-title-1 { font-size: 26px; line-height: 32px; font-weight: 700; }
.text-title-2 { font-size: 21px; line-height: 28px; font-weight: 600; }
.text-title-3 { font-size: 19px; line-height: 26px; font-weight: 600; }
.text-body { font-size: 17px; line-height: 24px; font-weight: 400; }
.text-callout { font-size: 15px; line-height: 22px; font-weight: 400; }
.text-label { font-size: 14px; line-height: 20px; font-weight: 500; }
.text-caption { font-size: 12px; line-height: 16px; font-weight: 400; }
```

---

## 3. COLOR PALETTE

### Usage Guidelines

#### Primary Actions
- **Background:** `--ak-primary` (#10456A)
- **Text:** `--ak-white` (#FFFFFF)
- **Hover:** `--ak-primary-light` (#2C5F7F)
- **Active/Pressed:** Darken primary by 10%

#### Secondary Actions
- **Background:** `--ak-surface` (#EBE5DA)
- **Border:** `--ak-mist` (#E5E5EA)
- **Text:** `--ak-charcoal` (#1C1C1E)
- **Hover:** `--ak-snow` (#EDF0F2)

#### Accent/Premium Elements
- **Highlights:** `--ak-gold` (#C9A227)
- **Text on dark:** `--ak-gold` with 90% opacity
- **Badges:** Gold background with 10% opacity, gold border

#### Status Colors
```css
/* Success */
.status-success {
  background: rgba(74, 124, 89, 0.1);
  color: #4A7C59;
  border: 1px solid rgba(74, 124, 89, 0.2);
}

/* Warning */
.status-warning {
  background: rgba(212, 168, 75, 0.1);
  color: #D4A84B;
  border: 1px solid rgba(212, 168, 75, 0.2);
}

/* Error */
.status-error {
  background: rgba(196, 91, 78, 0.1);
  color: #C45B4E;
  border: 1px solid rgba(196, 91, 78, 0.2);
}
```

---

## 4. SPACING & LAYOUT GRID

### Responsive Grid System

#### Mobile (320px - 767px)
```css
.container {
  padding: 0 16px;
  max-width: 100%;
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
```

#### Tablet (768px - 1023px)
```css
.container {
  padding: 0 24px;
  max-width: 768px;
  margin: 0 auto;
}

.grid {
  grid-template-columns: repeat(8, 1fr);
  gap: 24px;
}
```

#### Desktop (1024px+)
```css
.container {
  padding: 0 32px;
  max-width: 1200px;
  margin: 0 auto;
}

.grid {
  grid-template-columns: repeat(12, 1fr);
  gap: 32px;
}
```

### Safe Areas & Margins

| Device | Side Margin | Top/Bottom |
|--------|-------------|------------|
| **Mobile** | 16px | 16px |
| **Tablet** | 24px | 24px |
| **Desktop** | 32px | 32px |

---

## 5. COMPONENT LIBRARY

### 5.1 Buttons

#### Primary Button
```jsx
<button className="btn-primary">
  Lagre endringer
</button>
```

**Specifications:**
- **Height:** 48px (mobile), 44px (desktop)
- **Padding:** 16px horizontal, 12px vertical
- **Border radius:** 12px
- **Font:** Label (14px, weight 500)
- **Background:** `--ak-primary`
- **Text color:** `--ak-white`

**States:**
```css
/* Default */
.btn-primary {
  background: #10456A;
  color: #FFFFFF;
  border: none;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

/* Hover */
.btn-primary:hover {
  background: #2C5F7F;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 69, 106, 0.2);
}

/* Active/Pressed */
.btn-primary:active {
  background: #0A2F4D;
  transform: translateY(0);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Disabled */
.btn-primary:disabled {
  background: #E5E5EA;
  color: #8E8E93;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Loading */
.btn-primary.loading {
  position: relative;
  color: transparent;
}
.btn-primary.loading::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #FFFFFF;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
```

#### Secondary Button
```css
.btn-secondary {
  background: #EBE5DA;
  color: #1C1C1E;
  border: 1px solid #E5E5EA;
  /* Same sizing as primary */
}

.btn-secondary:hover {
  background: #EDF0F2;
  border-color: #D4D4D8;
}
```

#### Ghost Button
```css
.btn-ghost {
  background: transparent;
  color: #10456A;
  border: none;
  padding: 8px 12px;
}

.btn-ghost:hover {
  background: rgba(16, 69, 106, 0.05);
}
```

### 5.2 Input Fields

#### Text Input
```jsx
<div className="input-group">
  <label className="input-label">E-post</label>
  <input type="text" className="input-field" placeholder="din@epost.no" />
</div>
```

**Specifications:**
- **Height:** 48px
- **Padding:** 12px 16px
- **Border:** 1px solid `--ak-mist`
- **Border radius:** 12px
- **Font:** Body (17px)

**States:**
```css
/* Default */
.input-field {
  width: 100%;
  height: 48px;
  padding: 12px 16px;
  border: 1px solid #E5E5EA;
  border-radius: 12px;
  font-size: 17px;
  color: #1C1C1E;
  background: #FFFFFF;
  transition: all 0.2s ease;
}

/* Focus */
.input-field:focus {
  outline: none;
  border-color: #10456A;
  box-shadow: 0 0 0 3px rgba(16, 69, 106, 0.1);
}

/* Error */
.input-field.error {
  border-color: #C45B4E;
}
.input-field.error:focus {
  box-shadow: 0 0 0 3px rgba(196, 91, 78, 0.1);
}

/* Disabled */
.input-field:disabled {
  background: #F2F2F7;
  color: #8E8E93;
  cursor: not-allowed;
}

/* With icon */
.input-with-icon {
  position: relative;
}
.input-with-icon input {
  padding-left: 44px;
}
.input-with-icon .icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #8E8E93;
}
```

### 5.3 Cards

#### Basic Card
```jsx
<div className="card">
  <h3 className="card-title">Treningsøkt</h3>
  <p className="card-description">Teknikk - Driver swing</p>
</div>
```

**Specifications:**
- **Background:** `--ak-surface` (#EBE5DA)
- **Border radius:** 16px
- **Padding:** 20px
- **Shadow:** `--shadow-card`

```css
.card {
  background: #EBE5DA;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.card-title {
  font-size: 19px;
  font-weight: 600;
  line-height: 26px;
  color: #1C1C1E;
  margin-bottom: 8px;
}

.card-description {
  font-size: 15px;
  line-height: 22px;
  color: #8E8E93;
}
```

#### Interactive Card
```css
.card-interactive {
  cursor: pointer;
  border: 2px solid transparent;
}

.card-interactive:hover {
  border-color: #10456A;
}

.card-interactive:active {
  transform: scale(0.98);
}
```

### 5.4 Badges & Tags

#### Status Badge
```jsx
<span className="badge badge-success">Fullført</span>
<span className="badge badge-warning">Venter</span>
<span className="badge badge-error">Utsatt</span>
```

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
}

.badge-success {
  background: rgba(74, 124, 89, 0.1);
  color: #4A7C59;
}

.badge-warning {
  background: rgba(212, 168, 75, 0.1);
  color: #D4A84B;
}

.badge-error {
  background: rgba(196, 91, 78, 0.1);
  color: #C45B4E;
}

.badge-gold {
  background: rgba(201, 162, 39, 0.1);
  color: #C9A227;
  border: 1px solid rgba(201, 162, 39, 0.2);
}
```

### 5.5 Navigation Components

#### Bottom Navigation (Mobile)
```jsx
<nav className="bottom-nav">
  <button className="nav-item active">
    <HomeIcon />
    <span>Hjem</span>
  </button>
  <button className="nav-item">
    <CalendarIcon />
    <span>Kalender</span>
  </button>
  <button className="nav-item">
    <ChartIcon />
    <span>Fremgang</span>
  </button>
  <button className="nav-item">
    <UserIcon />
    <span>Profil</span>
  </button>
</nav>
```

**Specifications:**
- **Height:** 64px + safe area inset
- **Background:** `--ak-white` with 95% opacity (blur backdrop)
- **Border top:** 1px solid `--ak-mist`
- **Icon size:** 24px
- **Label:** Caption (12px)

```css
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-top: 1px solid #E5E5EA;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 100;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  border: none;
  background: transparent;
  color: #8E8E93;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-item svg {
  width: 24px;
  height: 24px;
}

.nav-item span {
  font-size: 12px;
  font-weight: 400;
}

.nav-item.active {
  color: #10456A;
}

.nav-item:active {
  transform: scale(0.95);
}
```

#### Top Navigation Bar
```css
.top-nav {
  height: 56px;
  background: #FFFFFF;
  border-bottom: 1px solid #E5E5EA;
  display: flex;
  align-items: center;
  padding: 0 16px;
  position: sticky;
  top: 0;
  z-index: 90;
}

.top-nav-title {
  font-size: 19px;
  font-weight: 600;
  color: #1C1C1E;
  flex: 1;
  text-align: center;
}

.top-nav-action {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: #10456A;
}

.top-nav-action:active {
  background: #F2F2F7;
}
```

### 5.6 Progress Indicators

#### Progress Bar
```jsx
<div className="progress-bar">
  <div className="progress-fill" style={{ width: '75%' }}></div>
</div>
```

```css
.progress-bar {
  width: 100%;
  height: 8px;
  background: #E5E5EA;
  border-radius: 9999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #10456A 0%, #4A7C59 100%);
  border-radius: 9999px;
  transition: width 0.3s ease;
}
```

#### Circular Progress
```jsx
<svg className="progress-circle" viewBox="0 0 120 120">
  <circle cx="60" cy="60" r="54" />
  <circle cx="60" cy="60" r="54"
    strokeDasharray="339.3"
    strokeDashoffset="84.8" />
  <text x="60" y="60" className="progress-text">75%</text>
</svg>
```

```css
.progress-circle {
  width: 120px;
  height: 120px;
  transform: rotate(-90deg);
}

.progress-circle circle {
  fill: none;
  stroke-width: 8;
}

.progress-circle circle:first-child {
  stroke: #E5E5EA;
}

.progress-circle circle:last-child {
  stroke: #10456A;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.3s ease;
}

.progress-text {
  transform: rotate(90deg) translate(0, 0);
  text-anchor: middle;
  dominant-baseline: middle;
  font-size: 24px;
  font-weight: 700;
  fill: #1C1C1E;
}
```

### 5.7 Modals & Overlays

#### Modal
```jsx
<div className="modal-overlay">
  <div className="modal">
    <div className="modal-header">
      <h2 className="modal-title">Bekreft handling</h2>
      <button className="modal-close">×</button>
    </div>
    <div className="modal-body">
      <p>Er du sikker på at du vil slette denne økten?</p>
    </div>
    <div className="modal-footer">
      <button className="btn-secondary">Avbryt</button>
      <button className="btn-primary">Slett</button>
    </div>
  </div>
</div>
```

```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

.modal {
  background: #FFFFFF;
  border-radius: 16px;
  max-width: 480px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  animation: slideUp 0.3s ease;
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #E5E5EA;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title {
  font-size: 21px;
  font-weight: 600;
  color: #1C1C1E;
}

.modal-close {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: transparent;
  font-size: 24px;
  color: #8E8E93;
  cursor: pointer;
}

.modal-body {
  padding: 20px;
  color: #1C1C1E;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid #E5E5EA;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## 6. RESPONSIVE BREAKPOINTS

### Breakpoint System
```css
/* Mobile First Approach */

/* Extra Small: 320px - 374px (iPhone SE) */
@media (min-width: 320px) {
  /* Base mobile styles */
}

/* Small: 375px - 767px (iPhone, standard mobile) */
@media (min-width: 375px) {
  /* Standard mobile */
}

/* Medium: 768px - 1023px (Tablet, iPad) */
@media (min-width: 768px) {
  .container {
    padding: 0 24px;
  }

  .grid {
    grid-template-columns: repeat(8, 1fr);
  }

  /* Show side navigation */
  .side-nav {
    display: block;
  }

  /* Hide bottom navigation */
  .bottom-nav {
    display: none;
  }
}

/* Large: 1024px - 1439px (Desktop, iPad Pro landscape) */
@media (min-width: 1024px) {
  .container {
    padding: 0 32px;
    max-width: 1200px;
  }

  .grid {
    grid-template-columns: repeat(12, 1fr);
  }

  /* Two-column layouts */
  .main-content {
    grid-column: span 8;
  }

  .sidebar {
    grid-column: span 4;
  }
}

/* Extra Large: 1440px+ (Large desktop) */
@media (min-width: 1440px) {
  .container {
    max-width: 1440px;
  }
}
```

### Device-Specific Adjustments

#### Mobile (Phone)
- **Font sizes:** Use full iOS scale (17px body)
- **Touch targets:** Minimum 44x44px
- **Navigation:** Bottom tab bar
- **Cards:** Full width with 16px margin
- **Modals:** Full screen or bottom sheet

#### Tablet
- **Font sizes:** Same as mobile
- **Touch targets:** 44x44px
- **Navigation:** Side navigation + top bar
- **Cards:** 2-column grid
- **Modals:** Centered, max-width 600px

#### Desktop
- **Font sizes:** Can reduce slightly (16px body acceptable)
- **Interactive:** Hover states visible
- **Navigation:** Persistent side nav
- **Cards:** 3-4 column grid
- **Modals:** Centered, max-width 800px

---

## 7. SCREEN DESIGNS

Se separate dokumenter:
- `UI_SCREENS_MOBILE.md` - Mobilskisser (telefon)
- `UI_SCREENS_TABLET.md` - Nettbrettskisser
- `UI_SCREENS_DESKTOP.md` - Desktopskisser

---

## IMPLEMENTASJONSEKSEMPLER

### Full Page Layout (Mobile)
```jsx
<div className="page">
  {/* Top Navigation */}
  <header className="top-nav">
    <button className="top-nav-action">
      <ChevronLeft size={24} />
    </button>
    <h1 className="top-nav-title">Dashboard</h1>
    <button className="top-nav-action">
      <Settings size={24} />
    </button>
  </header>

  {/* Main Content */}
  <main className="page-content">
    <div className="container">
      {/* Hero Card */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h2 className="text-title-2">Velkommen tilbake, Anders</h2>
        <p className="text-callout" style={{ color: 'var(--ak-steel)' }}>
          Du har 3 økter planlagt denne uken
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid" style={{ marginBottom: '24px' }}>
        <div className="card">
          <p className="text-caption" style={{ color: 'var(--ak-steel)' }}>
            UKENS ØKTER
          </p>
          <p className="text-title-1">8/12</p>
          <div className="progress-bar" style={{ marginTop: '12px' }}>
            <div className="progress-fill" style={{ width: '67%' }}></div>
          </div>
        </div>

        <div className="card">
          <p className="text-caption" style={{ color: 'var(--ak-steel)' }}>
            GJENNOMSNITT
          </p>
          <p className="text-title-1">4.5</p>
          <span className="badge badge-success" style={{ marginTop: '12px' }}>
            +0.3
          </span>
        </div>
      </div>

      {/* Session List */}
      <h3 className="text-title-2" style={{ marginBottom: '16px' }}>
        Kommende økter
      </h3>

      <div className="card-interactive" style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <h4 className="text-title-3">Teknikk - Driver</h4>
            <p className="text-callout" style={{ color: 'var(--ak-steel)' }}>
              I dag kl. 15:00 • 60 min
            </p>
          </div>
          <span className="badge badge-gold">Premium</span>
        </div>
      </div>
    </div>
  </main>

  {/* Bottom Navigation */}
  <nav className="bottom-nav">
    <button className="nav-item active">
      <Home size={24} />
      <span>Hjem</span>
    </button>
    <button className="nav-item">
      <Calendar size={24} />
      <span>Kalender</span>
    </button>
    <button className="nav-item">
      <TrendingUp size={24} />
      <span>Fremgang</span>
    </button>
    <button className="nav-item">
      <User size={24} />
      <span>Profil</span>
    </button>
  </nav>
</div>
```

---

## ACCESSIBILITY GUIDELINES

### Touch Targets
- **Minimum size:** 44x44px (iOS), 48x48px (Android)
- **Spacing:** Minimum 8px between targets

### Color Contrast
- **Normal text:** Minimum 4.5:1 ratio
- **Large text:** Minimum 3:1 ratio
- **UI components:** Minimum 3:1 ratio

### Focus States
```css
*:focus-visible {
  outline: 2px solid var(--ak-primary);
  outline-offset: 2px;
}
```

### Screen Reader Support
- Use semantic HTML
- Add `aria-label` for icon-only buttons
- Include `role` attributes where needed

---

## ANIMASJONER & TRANSITIONS

### Standard Transitions
```css
/* Default */
transition: all 0.2s ease;

/* Transform only (better performance) */
transition: transform 0.2s ease;

/* Multiple properties */
transition: transform 0.2s ease, opacity 0.2s ease;
```

### Easing Curves
```css
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

### Animation Best Practices
- Keep animations under 300ms
- Use `transform` and `opacity` for best performance
- Respect `prefers-reduced-motion` media query

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

**Dette designsystemet er produksjonsklart og kan implementeres direkte i kode.**
