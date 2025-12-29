# Design System Migreringsguide v2.1

**Fra:** Gammel farge-palett (blå-basert)
**Til:** Design System v2.1 (grønn-basert, Blue Primary theme)
**Dato:** 14. desember 2025

---

## 📊 Fargeendringer

### Brand-farger

| Gammel | Ny | Endring |
|--------|-----|---------|
| `#10456A` (primary) | `#1A3D2E` (forest) | Byttet fra blå til mørkegrønn |
| N/A | `#2D5A45` (forestLight) | Ny lysere grønn |
| N/A | `#F5F7F6` (foam) | Ny lys bakgrunn |
| N/A | `#FDFCF8` (ivory) | Ny hovedbakgrunn |
| N/A | `#C9A227` (gold) | Ny aksent-farge |

### Semantiske farger

| Gammel | Ny | Endring |
|--------|-----|---------|
| `#1E4B33` (success) | `#4A7C59` (success) | Lysere, mer harmonisert |
| `#B8860B` (warning) | `#D4A84B` (warning) | Lysere, bedre kontrast |
| `#A03232` (error) | `#C45B4E` (error) | Lysere, mykere |

### Nøytrale farger

| Gammel | Ny | Navn |
|--------|-----|------|
| `#02060D` (ink) | `#1C1C1E` (charcoal) | Primær tekst |
| `#868E96` | `#8E8E93` (steel) | Sekundær tekst |
| `#DEE2E6` | `#E5E5EA` (mist) | Kantlinjer |
| `#F1F3F5` | `#F2F2F7` (cloud) | Badges/bakgrunner |

---

## 🔄 Find & Replace Guide

### I React-komponenter (inline styles)

```javascript
// GAMMEL
const tokens = {
  colors: {
    primary: '#10456A',
    ink: '#02060D',
    success: '#1E4B33',
    warning: '#B8860B',
    error: '#A03232',
  }
};

// NY - erstatt med:
import { tokens } from './design-tokens';
// eller
const tokens = {
  colors: {
    forest: '#1A3D2E',      // Tidligere: primary
    charcoal: '#1C1C1E',    // Tidligere: ink
    success: '#4A7C59',     // Oppdatert
    warning: '#D4A84B',     // Oppdatert
    error: '#C45B4E',       // Oppdatert
  }
};
```

### I Tailwind-klasser

```jsx
// GAMMEL
<button className="bg-[#10456A] text-white">Knapp</button>

// NY
<button className="bg-forest text-white">Knapp</button>
```

### Spesifikke erstatninger

| Finn | Erstatt med | Beskrivelse |
|------|-------------|-------------|
| `#10456A` | `#1A3D2E` eller `tokens.colors.forest` | Primærfarge |
| `#02060D` | `#1C1C1E` eller `tokens.colors.charcoal` | Tekst |
| `#1E4B33` | `#4A7C59` eller `tokens.colors.success` | Suksess |
| `#B8860B` | `#D4A84B` eller `tokens.colors.warning` | Advarsel |
| `#A03232` | `#C45B4E` eller `tokens.colors.error` | Feil |
| `bg-[#F8F9FA]` | `bg-foam` | Lys bakgrunn |
| `bg-white` | `bg-ivory` | Hovedbakgrunn |

---

## 📝 Trinn-for-trinn Migrering

### Steg 1: Oppdater imports

**I hver skjerm-fil:**

```javascript
// FØR
const tokens = {
  colors: {
    primary: '#10456A',
    ink: '#02060D',
    // ... gamle farger
  }
};

// ETTER
import { tokens } from '../design-tokens';
// Tokens er nå tilgjengelig med nye farger
```

### Steg 2: Oppdater komponenter

**Button-komponenten:**

```javascript
// FØR
const variants = {
  primary: 'bg-[#10456A] text-white hover:bg-[#0d3a5a]',
  secondary: 'bg-[#F1F3F5] text-[#343A40] hover:bg-[#E9ECEF]',
};

// ETTER
const variants = {
  primary: 'bg-forest text-white hover:bg-forest-light',
  secondary: 'bg-foam text-charcoal hover:bg-cloud',
};
```

**Badge-komponenten:**

```javascript
// FØR
const variants = {
  primary: 'bg-[#10456A] text-white',
  success: 'bg-[#1E4B33]/10 text-[#1E4B33]',
};

// ETTER
const variants = {
  primary: 'bg-forest text-white',
  success: 'bg-success/10 text-success',
};
```

### Steg 3: Oppdater bakgrunner

```javascript
// FØR
<div className="bg-white min-h-screen">

// ETTER
<div className="bg-ivory min-h-screen">
```

### Steg 4: Oppdater tekst-farger

```javascript
// FØR
<h1 className="text-[#02060D]">Tittel</h1>
<p className="text-[#495057]">Beskrivelse</p>

// ETTER
<h1 className="text-charcoal">Tittel</h1>
<p className="text-steel">Beskrivelse</p>
```

---

## 🎯 Sjekkliste per skjerm

For hver skjerm, sjekk og oppdater:

- [ ] **Import-statement:** Bruk `import { tokens } from '../design-tokens';`
- [ ] **Primærfarge:** `#10456A` → `#1A3D2E` (forest)
- [ ] **Bakgrunner:** `bg-white` → `bg-ivory` for hovedbakgrunn
- [ ] **Tekstfarger:** `#02060D` → `#1C1C1E` (charcoal)
- [ ] **Semantiske farger:** Success, Warning, Error - oppdaterte hex-verdier
- [ ] **AKLogo-farge:** Bruk `tokens.colors.forest` som default
- [ ] **Button-varianter:** Oppdater alle fargereferanser
- [ ] **Badge-varianter:** Oppdater alle fargereferanser
- [ ] **Border-farger:** Bruk `mist` (#E5E5EA) for kantlinjer

---

## 🔍 Automatisk søk og erstatt

Du kan bruke disse kommandoene i din editor:

### VS Code / Claude Code

1. Åpne "Replace in Files" (Cmd/Ctrl + Shift + H)
2. Søk i: `Screens/**/*.jsx`
3. Kjør disse erstattningene:

```
#10456A → #1A3D2E
#02060D → #1C1C1E
#1E4B33 → #4A7C59
#B8860B → #D4A84B
#A03232 → #C45B4E
bg-white → bg-ivory
```

**MERK:** Sjekk hvert resultat manuelt før du bekrefter!

---

## ✅ Validering

Etter migrering, sjekk:

1. **Visuell konsistens:** Alle skjermer bruker Forest theme (#1A3D2E)
2. **Kontrast:** Tekst er lesbar på alle bakgrunner
3. **Semantiske farger:** Success/Warning/Error vises korrekt
4. **No hardcoded colors:** Ingen hex-verdier i koden (bruk tokens)
5. **Typografi:** Alle bruker Inter font og korrekt type scale

---

## 📦 Filer å oppdatere

### Prioritet 1 (Høy)

- [ ] `Screens/AKGolfDashboard.jsx`
- [ ] `Screens/ak_golf_brukerprofil_onboarding.jsx`
- [ ] `Screens/utviklingsplan_b_nivaa.jsx`
- [ ] `Screens/Kalender.jsx`

### Prioritet 2 (Medium)

- [ ] `Screens/Aarsplan.jsx`
- [ ] `Screens/Treningsstatistikk.jsx`
- [ ] `Screens/Testresultater.jsx`
- [ ] `Screens/Trenerteam.jsx`

### Prioritet 3 (Lav)

- [ ] `Screens/Målsetninger.jsx`
- [ ] `Screens/Testprotokoll.jsx`
- [ ] `Screens/Treningsprotokoll.jsx`
- [ ] `Screens/Øvelser.jsx`
- [ ] `Screens/Notater.jsx`
- [ ] `Screens/Arkiv.jsx`

---

## 🚨 Vanlige feil å unngå

1. **Ikke bland gamle og nye farger** - migrer en skjerm helt før du går videre
2. **Ikke hardkod hex-verdier** - bruk alltid tokens eller Tailwind-klasser
3. **Ikke glem hover-states** - oppdater alle interaktive tilstander
4. **Ikke skip accessibility** - sjekk kontrast med WCAG-verktøy
5. **Ikke glem dark mode** (hvis implementert) - oppdater også dark theme

---

## 💡 Tips

- **Test underveis:** Migrer én skjerm om gangen og test den
- **Bruk komponenter:** Gjenbruk Button, Badge, Card fra et felles komponent-bibliotek
- **Konsistens:** Hvis du finner en bug eller forbedring, oppdater alle skjermer
- **Dokumenter:** Oppdater kommentarer og dokumentasjon med nye fargenavn

---

## 📞 Hjelp

Ved spørsmål eller problemer:
1. Se **DESIGN_SYSTEM_GUIDE.md** for fullstendig referanse
2. Sjekk **design-tokens.js** for alle tilgjengelige tokens
3. Inspiser **Design/ak_golf_design_system_v2.1.svg** for visuell referanse

---

**Suksess!** 🎉
Etter fullført migrering vil alle skjermer følge AK Golf Academy Design System v2.1 med konsistent Forest theme.
