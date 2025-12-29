# Tailwind CSS + Catalyst Integration Plan
## IUP Golf Academy Frontend

**Opprettet**: 2025-12-25
**Status**: Plan klar for gjennomføring

---

## Executive Summary

Denne planen beskriver hvordan vi skal integrere **Catalyst UI Kit** (Tailwind CSS) med den eksisterende IUP Golf Academy frontend-applikasjonen. Målet er å:

1. Beholde AK Golf Academy design system (Blue Palette 01)
2. Erstatte custom CSS med Tailwind utility-klasser
3. Bruke Catalyst-komponenter som base for UI
4. Migrere alle 36 features til ny styling

---

## 📊 Nåværende Tilstand

### Frontend Stack
- **Framework**: React 18 (Create React App)
- **Styling**: Custom CSS med CSS variabler (Design System v3.0)
- **Fonts**: Inter, DM Sans
- **Icons**: Lucide React

### Eksisterende Komponent-struktur
```
src/components/
├── branding/        # Logo, brand elements
├── dashboard/       # Dashboard-spesifikke komponenter
├── guards/          # Route guards
├── icons/           # Icon komponenter
├── layout/          # Layout wrappers
├── primitives/      # Base UI primitives
├── proof/           # Proof/verification komponenter
├── season/          # Season-relaterte komponenter
├── trajectory/      # Player trajectory visuals
├── ui/              # Generelle UI komponenter
├── ErrorBoundary.jsx
├── FocusSession.jsx
├── LoadingSpinner.jsx
└── Toast.jsx
```

### 36 Features som må migreres
```
1. achievements          13. coach-dashboard      25. player-overview
2. admin-coach-management 14. coach-intelligence  26. profile
3. admin-escalation       15. coach-notes         27. progress
4. admin-feature-flags    16. coach-proof-viewer  28. school
5. admin-system-overview  17. coach-training-plan 29. sessions
6. admin-tier-management  18. coach-training-plan-editor 30. stats
7. annual-plan            19. coach-trajectory-viewer   31. tests
8. archive                20. coaches             32. tournaments
9. auth                   21. dashboard           33. training
10. badges                22. exercises
11. calendar              23. goals
12. coach                 24. knowledge
                          25. notes
```

### Design System Tokens (Beholdes)
```css
/* Brand Colors */
--ak-ink: #02060D
--ak-primary: #10456A
--ak-primary-light: #2C5F7F
--ak-snow: #EDF0F2
--ak-surface: #EBE5DA
--ak-gold: #C9A227
--ak-white: #FFFFFF

/* Status Colors */
--ak-success: #4A7C59
--ak-warning: #D4A84B
--ak-error: #C45B4E
```

---

## 🎨 Catalyst UI Kit Komponenter

### Tilgjengelige Komponenter (27 stk)

| Komponent | Beskrivelse | Erstatter |
|-----------|-------------|-----------|
| `alert` | Varsler og notifikasjoner | Toast.jsx |
| `auth-layout` | Layout for auth-sider | - |
| `avatar` | Brukerbilder | Custom avatar |
| `badge` | Status-badges | Custom badges |
| `button` | Knapper | ui/Button |
| `checkbox` | Checkboxer | - |
| `combobox` | Søkbare dropdowns | - |
| `description-list` | Beskrivelseslister | - |
| `dialog` | Modaler/dialoger | Custom modals |
| `divider` | Skillelinjer | - |
| `dropdown` | Dropdown-menyer | Custom dropdowns |
| `fieldset` | Form-grupper | - |
| `heading` | Overskrifter | - |
| `input` | Input-felter | ui/Input |
| `link` | Lenker | - |
| `listbox` | Select-lister | - |
| `navbar` | Navigasjonsbar | layout/Navbar |
| `pagination` | Paginering | - |
| `radio` | Radio-knapper | - |
| `select` | Select-felter | ui/Select |
| `sidebar-layout` | Sidebar layout | layout/Sidebar |
| `sidebar` | Sidebar komponent | - |
| `stacked-layout` | Stacked layout | - |
| `switch` | Toggle switches | - |
| `table` | Tabeller | ui/Table |
| `text` | Tekst-styling | - |
| `textarea` | Tekstområder | - |

---

## 🗓️ Implementeringsplan

### Fase 1: Oppsett og Grunnlag (Dag 1-2)

#### 1.1 Installer Tailwind CSS v4.0
```bash
cd apps/web
npm install tailwindcss@latest postcss autoprefixer
npm install @headlessui/react motion clsx
npx tailwindcss init -p
```

#### 1.2 Konfigurer Tailwind med AK Golf farger
Opprett `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // AK Golf Brand Colors
        ak: {
          ink: '#02060D',
          primary: '#10456A',
          'primary-light': '#2C5F7F',
          snow: '#EDF0F2',
          surface: '#EBE5DA',
          gold: '#C9A227',
          white: '#FFFFFF',
          // Status
          success: '#4A7C59',
          warning: '#D4A84B',
          error: '#C45B4E',
        },
        // Gray Scale
        gray: {
          50: '#F9FAFB',
          100: '#F2F4F7',
          300: '#D5D7DA',
          500: '#8E8E93',
          600: '#535862',
          700: '#414651',
          900: '#1C1C1E',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        logo: ['DM Sans', 'sans-serif'],
      },
      fontSize: {
        'large-title': ['34px', '41px'],
        'title1': ['28px', '34px'],
        'title2': ['22px', '28px'],
        'title3': ['20px', '24px'],
      }
    },
  },
  plugins: [],
}
```

#### 1.3 Oppdater CSS entry point
Oppdater `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Behold eksisterende CSS variabler for gradvis migrasjon */
:root {
  --ak-ink: #02060D;
  --ak-primary: #10456A;
  /* ... resten av variablene ... */
}
```

#### 1.4 Kopier Catalyst-komponenter
```bash
# Kopier JavaScript-versjoner til prosjektet
cp -r /path/to/catalyst-ui-kit/javascript/* src/components/catalyst/
```

Mappestruktur etter kopiering:
```
src/components/
├── catalyst/           # NYE Catalyst komponenter
│   ├── alert.jsx
│   ├── avatar.jsx
│   ├── badge.jsx
│   ├── button.jsx
│   ├── ... (alle 27)
│   └── index.js       # Eksport-fil
├── ui/                 # Eksisterende (migreres gradvis)
├── layout/             # Eksisterende (migreres gradvis)
└── ...
```

---

### Fase 2: Core UI Komponenter (Dag 3-5)

#### 2.1 Prioriterte komponenter å migrere først

**Høy prioritet (brukes overalt):**
1. ✅ Button
2. ✅ Input
3. ✅ Select
4. ✅ Badge
5. ✅ Avatar
6. ✅ Table

**Medium prioritet:**
7. Dialog/Modal
8. Dropdown
9. Alert/Toast
10. Switch
11. Checkbox
12. Radio

**Lavere prioritet:**
13. Pagination
14. Combobox
15. Listbox
16. Description List

#### 2.2 Migrasjonsstrategi per komponent

For hver komponent:
1. Opprett wrapper i `src/components/catalyst/` som tilpasser til AK Golf
2. Oppdater imports i features gradvis
3. Test at styling er konsistent
4. Fjern gammel komponent når alle referanser er oppdatert

**Eksempel: Button-migrasjon**
```jsx
// src/components/catalyst/button.jsx - Tilpasset versjon
import { Button as CatalystButton } from './catalyst-base/button'
import clsx from 'clsx'

export function Button({ variant = 'primary', ...props }) {
  const variantStyles = {
    primary: 'bg-ak-primary text-white hover:bg-ak-primary-light',
    secondary: 'bg-ak-surface text-ak-ink hover:bg-ak-snow',
    gold: 'bg-ak-gold text-ak-ink hover:opacity-90',
    danger: 'bg-ak-error text-white hover:opacity-90',
  }

  return (
    <CatalystButton
      className={clsx(variantStyles[variant], props.className)}
      {...props}
    />
  )
}
```

---

### Fase 3: Layout Komponenter (Dag 6-8)

#### 3.1 Hovedlayouts

**Sidebar Layout (Coach/Admin views)**
```jsx
// Bruk Catalyst sidebar-layout med AK Golf styling
<SidebarLayout
  navbar={<AKNavbar />}
  sidebar={<AKSidebar />}
>
  {children}
</SidebarLayout>
```

**Stacked Layout (Player views)**
```jsx
// For enklere player-views uten sidebar
<StackedLayout
  navbar={<AKNavbar />}
>
  {children}
</StackedLayout>
```

#### 3.2 Komponenter å oppdatere
1. `layout/Navbar.jsx` → Bruk Catalyst `navbar`
2. `layout/Sidebar.jsx` → Bruk Catalyst `sidebar`
3. `layout/MainLayout.jsx` → Bruk Catalyst `sidebar-layout`
4. `auth-layout` → Bruk Catalyst `auth-layout` for login/register

---

### Fase 4: Feature-migrasjon (Dag 9-20)

#### 4.1 Prioritert rekkefølge

**Sprint 1: Auth & Core (Dag 9-11)**
- [ ] auth (login, register, forgot-password)
- [ ] dashboard (hoved-dashboard)
- [ ] profile

**Sprint 2: Player Features (Dag 12-14)**
- [ ] player-overview
- [ ] progress
- [ ] achievements
- [ ] badges
- [ ] goals
- [ ] training

**Sprint 3: Coach Features (Dag 15-17)**
- [ ] coach-dashboard
- [ ] coach-athlete-list
- [ ] coach-athlete-detail
- [ ] coach-notes
- [ ] coach-training-plan
- [ ] coach-training-plan-editor

**Sprint 4: Admin & Advanced (Dag 18-20)**
- [ ] admin-* (alle admin-features)
- [ ] calendar
- [ ] tests
- [ ] stats
- [ ] tournaments

**Sprint 5: Remaining (Dag 21-22)**
- [ ] Alle gjenværende features
- [ ] Cleanup av gammel CSS
- [ ] Testing og QA

#### 4.2 Migrasjonsprosess per feature

For hver feature:
```
1. Identifiser alle komponenter i feature-mappen
2. Erstatt imports med Catalyst-komponenter
3. Fjern inline styles, bruk Tailwind-klasser
4. Oppdater CSS → Tailwind utilities
5. Test responsivitet
6. Verifiser dark mode (om relevant)
```

---

### Fase 5: Cleanup og Optimalisering (Dag 23-25)

#### 5.1 Fjern gammel CSS
- [ ] Fjern ubrukte CSS-filer
- [ ] Konsolider gjenværende CSS til Tailwind
- [ ] Optimaliser Tailwind med purge

#### 5.2 Konsistenssjekk
- [ ] Verifiser alle farger matcher design system
- [ ] Sjekk spacing og typografi
- [ ] Test på mobile enheter
- [ ] Verifiser accessibility (a11y)

#### 5.3 Dokumentasjon
- [ ] Oppdater README med ny styling-guide
- [ ] Dokumenter Catalyst-komponenter
- [ ] Lag Storybook stories (valgfritt)

---

## 📁 Filstruktur etter migrasjon

```
apps/web/src/
├── components/
│   ├── catalyst/              # Catalyst UI komponenter (tilpasset)
│   │   ├── alert.jsx
│   │   ├── avatar.jsx
│   │   ├── badge.jsx
│   │   ├── button.jsx
│   │   ├── checkbox.jsx
│   │   ├── combobox.jsx
│   │   ├── description-list.jsx
│   │   ├── dialog.jsx
│   │   ├── divider.jsx
│   │   ├── dropdown.jsx
│   │   ├── fieldset.jsx
│   │   ├── heading.jsx
│   │   ├── input.jsx
│   │   ├── link.jsx
│   │   ├── listbox.jsx
│   │   ├── navbar.jsx
│   │   ├── pagination.jsx
│   │   ├── radio.jsx
│   │   ├── select.jsx
│   │   ├── sidebar-layout.jsx
│   │   ├── sidebar.jsx
│   │   ├── stacked-layout.jsx
│   │   ├── switch.jsx
│   │   ├── table.jsx
│   │   ├── text.jsx
│   │   ├── textarea.jsx
│   │   └── index.js
│   ├── branding/              # Brand-spesifikke komponenter
│   │   └── Logo.jsx
│   ├── icons/                 # Lucide + custom icons
│   └── layout/                # App-spesifikke layouts
│       ├── AppLayout.jsx      # Hovedlayout med sidebar
│       ├── AuthLayout.jsx     # Login/register layout
│       └── PlayerLayout.jsx   # Enkel player layout
├── features/                  # 36 features (alle migrert)
├── styles/
│   └── tailwind.css          # Tailwind entry point
├── index.css                 # Minimal, kun Tailwind imports
└── tailwind.config.js        # Tailwind konfigurasjon
```

---

## 🎯 Mapping: Feature → Catalyst Komponenter

| Feature | Catalyst Komponenter |
|---------|---------------------|
| **auth** | auth-layout, input, button, fieldset, link |
| **dashboard** | heading, text, badge, avatar, table, divider |
| **profile** | avatar, input, fieldset, button, description-list |
| **coach-dashboard** | sidebar-layout, navbar, table, badge, dropdown |
| **coach-athlete-list** | table, avatar, badge, pagination, input |
| **coach-athlete-detail** | description-list, avatar, badge, tabs* |
| **coach-notes** | textarea, button, dialog, alert |
| **tests** | table, badge, button, dialog |
| **calendar** | Custom + button, dialog |
| **stats** | Custom charts + heading, text |
| **admin-*** | sidebar-layout, table, switch, select, dialog |

*tabs finnes ikke i Catalyst, må lages custom

---

## 🚀 Quick Start Commands

```bash
# 1. Installer dependencies
cd apps/web
npm install tailwindcss@latest postcss autoprefixer
npm install @headlessui/react motion clsx

# 2. Initialiser Tailwind
npx tailwindcss init -p

# 3. Kopier Catalyst-komponenter
mkdir -p src/components/catalyst
cp /path/to/catalyst-ui-kit/javascript/*.jsx src/components/catalyst/

# 4. Start dev server
npm start
```

---

## ⚠️ Viktige hensyn

### Backwards Compatibility
- Behold CSS-variabler under migrering
- Migrér én feature av gangen
- Test etter hver endring

### Styling Prioritet
1. Tailwind utilities (foretrukket)
2. Catalyst komponenter
3. Custom CSS (kun når nødvendig)

### Testing
- Test responsivitet på mobile
- Verifiser dark mode fungerer
- Sjekk accessibility med Lighthouse

---

## 📊 Fremdriftsrapport

| Fase | Status | Estimert tid | Faktisk tid |
|------|--------|--------------|-------------|
| Fase 1: Oppsett | ⬜ Ikke startet | 2 dager | - |
| Fase 2: Core UI | ⬜ Ikke startet | 3 dager | - |
| Fase 3: Layouts | ⬜ Ikke startet | 3 dager | - |
| Fase 4: Features | ⬜ Ikke startet | 12 dager | - |
| Fase 5: Cleanup | ⬜ Ikke startet | 3 dager | - |
| **Totalt** | **0%** | **23 dager** | - |

---

## Neste steg

1. ✅ Godkjenn denne planen
2. ⬜ Start med Fase 1: Installer Tailwind
3. ⬜ Kopier Catalyst-komponenter
4. ⬜ Tilpass farger til AK Golf palette
5. ⬜ Begynn migrasjon av core komponenter

---

**Ansvarlig**: Anders Kristiansen
**Sist oppdatert**: 2025-12-25
