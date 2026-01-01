# AK Golf Academy - Design System Oppdatering v2.1

**Dato:** 14. desember 2025
**Status:** ✅ Konfigurert og klar til bruk
**Kilde:** `Design/ak_golf_design_system_v2.1.svg`

---

## 📋 Hva er gjort

### ✅ Opprettede filer

1. **tailwind.config.js**
   - Komplett Tailwind-konfigurasjon med alle design tokens
   - Farger, typografi, spacing, shadows, border-radius
   - Klar til bruk med `npm install -D tailwindcss`

2. **tokens.css**
   - CSS custom properties (CSS variabler)
   - Kan importeres i enhver CSS-fil
   - Inter font-import fra Google Fonts
   - Utility-klasser for rask styling

3. **design-tokens.js**
   - JavaScript/React tokens-objekt
   - Kan importeres direkte i React-komponenter
   - Helper-funksjoner for typografi og farger med opacity
   - Type-safe tokens for inline styles

4. **DESIGN_SYSTEM_GUIDE.md**
   - Komplett utviklerguide
   - Fargepalett med bruksområder
   - Typografi-skala med eksempler
   - Best practices og DO/DON'T
   - Komponent-eksempler

5. **DESIGN_MIGRATION_GUIDE.md**
   - Trinn-for-trinn migreringsplan
   - Find & Replace-guide
   - Sjekkliste per skjerm
   - Validering og QA

6. **DESIGN_SYSTEM_OPPDATERING.md** (denne filen)
   - Oppsummering av endringer
   - Implementeringsplan
   - Neste steg

---

## 🎨 Nye design-tokens

### Farger

**Brand:**
- Forest: `#1A3D2E` (tidligere primary `#10456A`)
- Forest Light: `#2D5A45` (ny)
- Foam: `#F5F7F6` (ny)
- Ivory: `#FDFCF8` (ny)
- Gold: `#C9A227` (ny)

**Semantisk:**
- Success: `#4A7C59` (tidligere `#1E4B33`)
- Warning: `#D4A84B` (tidligere `#B8860B`)
- Error: `#C45B4E` (tidligere `#A03232`)

**Nøytralt:**
- Charcoal: `#1C1C1E` (tidligere ink `#02060D`)
- Steel: `#8E8E93`
- Mist: `#E5E5EA`
- Cloud: `#F2F2F7`

### Typografi

**Font:** Inter (cross-platform, Open Source)
- Erstatter SF Pro (som kun fungerer på Apple-plattformer)
- Samme optiske prinsipper som SF Pro
- Bedre cross-platform support

**Type Scale:**
- Large Title: 34px/700
- Title 1: 28px/700
- Title 2: 22px/700
- Title 3: 20px/600
- Headline: 17px/600
- Body: 17px/400
- Callout: 16px/400
- Subhead: 15px/400
- Footnote: 13px/400
- Caption 1: 12px/400
- Caption 2: 11px/400
- Stat Number: 48px/700
- Stat Label: 11px/500/UPPERCASE

---

## 🚀 Implementeringsplan

### Fase 1: Setup (✅ Fullført)
- [x] Opprett tailwind.config.js
- [x] Opprett tokens.css
- [x] Opprett design-tokens.js
- [x] Opprett dokumentasjon

### Fase 2: Dependencies (Neste steg)
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init
```

### Fase 3: Konfigurer byggesystem
1. Opprett `postcss.config.js`:
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

2. Importer Tailwind i hovedfilen (`src/index.css` eller `App.css`):
```css
@import './tokens.css';
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Fase 4: Migrer skjermer (14 skjermer totalt)

**Prioritet 1 (Denne uken):**
- [ ] AKGolfDashboard.jsx
- [ ] ak_golf_brukerprofil_onboarding.jsx
- [ ] utviklingsplan_b_nivaa.jsx
- [ ] Kalender.jsx

**Prioritet 2 (Neste uke):**
- [ ] Aarsplan.jsx
- [ ] Treningsstatistikk.jsx
- [ ] Testresultater.jsx
- [ ] Trenerteam.jsx

**Prioritet 3 (Uken etter):**
- [ ] Målsetninger.jsx
- [ ] Testprotokoll.jsx
- [ ] Treningsprotokoll.jsx
- [ ] Øvelser.jsx
- [ ] Notater.jsx
- [ ] Arkiv.jsx

### Fase 5: Testing og validering
- [ ] Visuell gjennomgang av alle skjermer
- [ ] Kontrastsjekk (WCAG AA minimum)
- [ ] Cross-browser testing
- [ ] Responsive testing
- [ ] Performance audit

---

## 📦 Filstruktur

```
IUP_Master_Folder/
├── Design/
│   └── ak_golf_design_system_v2.1.svg  [Kilde]
│
├── Screens/                             [14 skjermer å oppdatere]
│   ├── AKGolfDashboard.jsx
│   ├── ak_golf_brukerprofil_onboarding.jsx
│   └── ... (12 andre)
│
├── tailwind.config.js                   [✅ Ny - Tailwind config]
├── tokens.css                           [✅ Ny - CSS variabler]
├── design-tokens.js                     [✅ Ny - React/JS tokens]
│
├── DESIGN_SYSTEM_GUIDE.md               [✅ Ny - Utviklerguide]
├── DESIGN_MIGRATION_GUIDE.md            [✅ Ny - Migreringsguide]
└── DESIGN_SYSTEM_OPPDATERING.md         [✅ Ny - Denne filen]
```

---

## 💻 Brukseksempler

### Tilnærming 1: Tailwind CSS (anbefalt)

```jsx
import React from 'react';

const Dashboard = () => (
  <div className="bg-ivory min-h-screen p-4">
    <h1 className="text-title-1 text-forest mb-4">Min Plan</h1>
    <div className="bg-white rounded-ak-lg shadow-ak-card p-4">
      <h2 className="text-title-3 text-charcoal mb-2">Dagens økt</h2>
      <p className="text-body text-steel">Teknikk: Jerntreffsikkerhet</p>
      <button className="bg-forest text-white text-headline px-4 py-2.5 rounded-ak-md mt-4">
        Start økt
      </button>
    </div>
  </div>
);
```

### Tilnærming 2: React med tokens

```jsx
import React from 'react';
import { tokens } from '../design-tokens';

const Dashboard = () => (
  <div style={{ backgroundColor: tokens.colors.ivory, minHeight: '100vh', padding: tokens.spacing.md }}>
    <h1 style={{
      ...tokens.typography.title1,
      color: tokens.colors.forest,
      marginBottom: tokens.spacing.md
    }}>
      Min Plan
    </h1>
    <div style={{
      backgroundColor: 'white',
      borderRadius: tokens.radius.lg,
      boxShadow: tokens.shadows.card,
      padding: tokens.spacing.md
    }}>
      <h2 style={{ ...tokens.typography.title3, color: tokens.colors.charcoal }}>
        Dagens økt
      </h2>
    </div>
  </div>
);
```

### Tilnærming 3: CSS Modules med tokens

```css
/* Dashboard.module.css */
@import '../tokens.css';

.container {
  background-color: var(--ak-ivory);
  min-height: 100vh;
  padding: var(--spacing-md);
}

.title {
  font: var(--text-title-1);
  letter-spacing: var(--text-title-1-spacing);
  color: var(--ak-primary);
  margin-bottom: var(--spacing-md);
}

.card {
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  padding: var(--spacing-md);
}
```

---

## ✅ Kvalitetskontroll

### Før lansering, sjekk:

**Visuelt:**
- [ ] Alle skjermer bruker Forest (#1A3D2E) som primærfarge
- [ ] Konsistent bakgrunn (Ivory #FDFCF8)
- [ ] Ingen hardkodede hex-verdier i koden
- [ ] Inter font lastes og brukes overalt

**Teknisk:**
- [ ] Ingen console.warnings om manglende tokens
- [ ] Alle farger hentet fra tokens/Tailwind
- [ ] Konsistent spacing (4px/8px/16px/24px/32px)
- [ ] Border-radius: 8px/12px/16px

**Accessibility:**
- [ ] Kontrast på tekst møter WCAG AA (4.5:1)
- [ ] Kontrast på UI-elementer møter WCAG AA (3:1)
- [ ] Focus-states er tydelige
- [ ] Interaktive elementer er minst 44x44px

**Performance:**
- [ ] Inter font laster optimalt (font-display: swap)
- [ ] Ingen unødvendige re-renders
- [ ] Bilder er optimalisert
- [ ] CSS er minimert for produksjon

---

## 📊 Fremdrift

**Status: 30% fullført**

- ✅ Design system definert
- ✅ Tokens opprettet (CSS, JS, Tailwind)
- ✅ Dokumentasjon skrevet
- ⏳ Dependencies installert (neste steg)
- ⏳ Skjermer migrert (0/14)
- ⏳ Testing og validering
- ⏳ Production deployment

---

## 🔗 Ressurser

**Interne filer:**
- `Design/ak_golf_design_system_v2.1.svg` - Visuell referanse
- `DESIGN_SYSTEM_GUIDE.md` - Komplett guide
- `DESIGN_MIGRATION_GUIDE.md` - Migreringsplan
- `design-tokens.js` - Tokens for React
- `tokens.css` - CSS variabler
- `tailwind.config.js` - Tailwind-konfigurasjon

**Eksterne ressurser:**
- [Inter Font](https://fonts.google.com/specimen/Inter)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Apple HIG Typography](https://developer.apple.com/design/human-interface-guidelines/typography)
- [WCAG Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

## 🎯 Neste steg

1. **Installer dependencies:**
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   ```

2. **Konfigurer byggesystem:**
   - Opprett `postcss.config.js`
   - Importer Tailwind i main CSS

3. **Start migrering:**
   - Begynn med `AKGolfDashboard.jsx`
   - Følg `DESIGN_MIGRATION_GUIDE.md`
   - Test hver skjerm grundig

4. **Dokumenter fremgang:**
   - Kryss av skjermer i denne filen
   - Noter eventuelle issues
   - Del screenshots for review

---

**Suksess!** 🎉

Designsystemet er nå fullt konfigurert og klar til bruk. Alle nødvendige filer er på plass, og dokumentasjonen er komplett.

**Neste:** Installer Tailwind CSS og start migrering av første skjerm.

---

*AK Golf Academy × Team Norway Golf*
*Design System v2.1 • Cross-Platform Ready*
