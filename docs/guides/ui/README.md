# AK GOLF IUP - UI DESIGN DOKUMENTASJON
**Versjon:** 2.1 (Blue Palette 01)
**Dato:** 17. desember 2025
**Status:** ✅ Komplett og produksjonsklar

---

## 📋 OVERSIKT

Dette er den komplette UI-designdokumentasjonen for TIER Golf IUP-systemet. Designet dekker alle plattformer (mobil, nettbrett, desktop) og er klart for direkte implementering.

---

## 📁 DOKUMENTER

### 1. **UI_DESIGN_SYSTEM_KOMPLETT.md**
**Hva:** Komplett designsystem med alle tokens, komponenter og retningslinjer
**Inneholder:**
- ✅ Design Tokens (farger, spacing, typography, shadows)
- ✅ Typography System (8 nivåer fra Display til Caption)
- ✅ Color Palette (brand, semantic, neutrals)
- ✅ Spacing & Layout Grid (4px base unit)
- ✅ Component Library (buttons, inputs, cards, badges, navigation, modals)
- ✅ Responsive Breakpoints (mobile, tablet, desktop)
- ✅ Accessibility Guidelines
- ✅ Animations & Transitions

**For hvem:** Utviklere og designere som skal implementere komponenter

---

### 2. **UI_SCREENS_MOBILE.md**
**Hva:** Detaljerte skjermskisser for mobiltelefoner (iPhone, Android)
**Inneholder:**
- ✅ Dashboard
- ✅ Profil / Onboarding
- ✅ Kalender
- ✅ Treningsøkt Detaljer
- ✅ Årsplan
- ✅ Testprotokoll
- ✅ Målsetninger
- ✅ Statistikk
- ✅ Gestures & Interactions (swipe, long press, pull-to-refresh)
- ✅ Dark Mode Support

**For hvem:** Mobilutviklere (React Native, iOS, Android)

---

### 3. **UI_SCREENS_TABLET.md**
**Hva:** Detaljerte skjermskisser for nettbrett (iPad, Android tablets)
**Inneholder:**
- ✅ Dashboard (2-3 kolonne layouts)
- ✅ Kalender (med uke-visning)
- ✅ Årsplan (med timeline)
- ✅ Statistikk (utvidede grafer)
- ✅ Split View Layouts (master-detail)
- ✅ Keyboard Shortcuts
- ✅ Apple Pencil Support (valgfritt)
- ✅ Landscape vs Portrait modes

**For hvem:** Nettbrettutviklere og responsive web

---

### 4. **UI_SCREENS_DESKTOP.md**
**Hva:** Detaljerte skjermskisser for desktop (1440px+)
**Inneholder:**
- ✅ Dashboard (full-width layouts)
- ✅ Kalender (med uke-grid)
- ✅ Årsplan (med timeline og milepæler)
- ✅ Testprotokoll (med interaktive grafer)
- ✅ Statistikk (avanserte visualiseringer)
- ✅ Profil & Innstillinger
- ✅ Advanced Features (command palette, keyboard shortcuts, multi-window)
- ✅ Hover & Focus States

**For hvem:** Web-utviklere (desktop-optimalisert)

---

## 🎨 DESIGN TOKENS QUICK REFERENCE

### Farger
```css
/* Brand */
--ak-primary: #10456A       /* Primary */
--ak-primary-light: #2C5F7F /* Hover */
--ak-gold: #C9A227         /* Accent */
--ak-surface: #EBE5DA        /* Surface */
--ak-snow: #EDF0F2         /* Background */

/* Semantic */
--ak-success: #4A7C59
--ak-warning: #D4A84B
--ak-error: #C45B4E

/* Neutrals */
--ak-charcoal: #1C1C1E     /* Text */
--ak-steel: #8E8E93        /* Secondary text */
--ak-mist: #E5E5EA         /* Borders */
--ak-cloud: #F2F2F7        /* Subtle bg */
--ak-white: #FFFFFF
```

### Spacing
```css
--spacing-xs: 4px    /* Tight */
--spacing-sm: 8px    /* Small */
--spacing-md: 16px   /* Default */
--spacing-lg: 24px   /* Section */
--spacing-xl: 32px   /* Large */
--spacing-xxl: 48px  /* Hero */
```

### Typography
```css
Display:  32px / 40px / 700  /* Hero */
Title 1:  26px / 32px / 700  /* Page titles */
Title 2:  21px / 28px / 600  /* Sections */
Title 3:  19px / 26px / 600  /* Cards */
Body:     17px / 24px / 400  /* Paragraphs */
Callout:  15px / 22px / 400  /* Secondary */
Label:    14px / 20px / 500  /* Buttons */
Caption:  12px / 16px / 400  /* Metadata */
```

---

## 📱 RESPONSIVE BREAKPOINTS

```css
/* Mobile */
@media (max-width: 767px) {
  /* Phone: 320px - 767px */
  /* 4-column grid, 16px gap */
  /* Bottom navigation */
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) {
  /* Tablet: 768px - 1023px */
  /* 8-column grid, 24px gap */
  /* Side navigation */
}

/* Desktop */
@media (min-width: 1024px) {
  /* Desktop: 1024px+ */
  /* 12-column grid, 32px gap */
  /* Persistent side nav, max-width 1400px */
}
```

---

## 🚀 IMPLEMENTASJONSGUIDE

### Steg 1: Setup Design System
1. Implementer CSS variables fra `UI_DESIGN_SYSTEM_KOMPLETT.md`
2. Sett opp Tailwind config (hvis brukt) med design tokens
3. Import Inter font fra Google Fonts

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

:root {
  /* Copy all CSS variables from UI_DESIGN_SYSTEM_KOMPLETT.md */
}
```

### Steg 2: Bygg Komponentbibliotek
1. Start med buttons, inputs, cards
2. Implementer alle states (hover, focus, active, disabled)
3. Test accessibility (keyboard nav, screen readers)

### Steg 3: Implementer Skjermer
**Prioritert rekkefølge:**
1. Dashboard (kjernefunksjonalitet)
2. Kalender (høy bruk)
3. Treningsøkt Detaljer (viktig for daglig bruk)
4. Statistikk
5. Årsplan
6. Testprotokoll
7. Målsetninger
8. Profil & Innstillinger

### Steg 4: Responsiv Testing
- Test på iPhone 14/15 (390x844)
- Test på iPad (810x1080)
- Test på Desktop (1440x900, 1920x1080)
- Test landscape og portrait modes
- Test dark mode

---

## ✅ IMPLEMENTASJONS-CHECKLIST

### Design Tokens
- [ ] CSS variables definert
- [ ] Farger implementert
- [ ] Typography scale implementert
- [ ] Spacing system implementert
- [ ] Shadows implementert

### Komponenter
- [ ] Button (primary, secondary, ghost)
- [ ] Input (text, select, textarea)
- [ ] Card (basic, interactive)
- [ ] Badge & Tags
- [ ] Navigation (bottom, side, top)
- [ ] Progress (bar, circular)
- [ ] Modal & Overlay

### Skjermer - Mobil
- [ ] Dashboard
- [ ] Profil/Onboarding
- [ ] Kalender
- [ ] Treningsøkt Detaljer
- [ ] Årsplan
- [ ] Testprotokoll
- [ ] Målsetninger
- [ ] Statistikk

### Skjermer - Tablet
- [ ] Dashboard (2-3 col)
- [ ] Kalender (week view)
- [ ] Split views
- [ ] Landscape layouts

### Skjermer - Desktop
- [ ] Dashboard (full layout)
- [ ] Kalender (week grid)
- [ ] Statistikk (advanced charts)
- [ ] Profil & Innstillinger
- [ ] Keyboard shortcuts

### Interaksjoner
- [ ] Hover states
- [ ] Focus states
- [ ] Loading states
- [ ] Error states
- [ ] Empty states
- [ ] Transitions & animations

### Accessibility
- [ ] Keyboard navigation
- [ ] Screen reader support
- [ ] Touch targets (min 44x44px)
- [ ] Color contrast (WCAG AA)
- [ ] Focus indicators

### Responsivitet
- [ ] Mobile breakpoint (< 768px)
- [ ] Tablet breakpoint (768px - 1023px)
- [ ] Desktop breakpoint (>= 1024px)
- [ ] Portrait & landscape modes

### Testing
- [ ] iPhone 14/15
- [ ] iPad 10.2"
- [ ] Desktop 1440px
- [ ] Desktop 1920px
- [ ] Dark mode
- [ ] Slow 3G network (loading states)

---

## 🎯 DESIGNPRINSIPPER

### 1. **Clarity First**
- Tydelig hierarki
- Enkel navigasjon
- Konsistent språk og ikoner

### 2. **Performance**
- Rask lasting
- Smooth transitions
- Optimized images

### 3. **Accessibility**
- WCAG AA compliant
- Keyboard navigable
- Screen reader friendly

### 4. **Mobile First**
- Design for mobil først
- Progressive enhancement for større skjermer
- Touch-friendly (min 44x44px targets)

### 5. **Consistency**
- Samme design patterns på tvers av plattformer
- Forutsigbar interaksjon
- Gjenbrukbare komponenter

---

## 📚 RESSURSER

### Figma Kit
```
/packages/design-system/figma/ak_golf_complete_figma_kit.svg
```

### Design Tokens (JavaScript)
```javascript
// apps/web/src/design-tokens.js
export const tokens = {
  colors: { /* ... */ },
  typography: { /* ... */ },
  spacing: { /* ... */ },
  // ...
};
```

### CSS Variables
```css
/* apps/web/src/index.css */
:root {
  --ak-primary: #10456A;
  --ak-gold: #C9A227;
  /* ... */
}
```

---

## 🤝 BIDRA

### Foreslå endringer
1. Les gjeldende design i relevante dokumenter
2. Diskuter med team før større endringer
3. Oppdater alle berørte plattformer (mobil, tablet, desktop)
4. Test på faktiske enheter

### Legge til nye komponenter
1. Dokumenter i `UI_DESIGN_SYSTEM_KOMPLETT.md`
2. Inkluder alle states (default, hover, active, disabled)
3. Legg til responsive varianter hvis nødvendig
4. Oppdater implementasjons-checklist

---

## 📞 KONTAKT

**Prosjekt:** TIER Golf × Team Norway Golf - IUP System
**Eier:** Anders Knutsen - TIER Golf
**Design versjon:** 2.1 (Blue Palette 01)
**Dato:** 17. desember 2025

---

**Alt designarbeid er komplett og produksjonsklart. Lykke til med implementeringen! 🎉**
