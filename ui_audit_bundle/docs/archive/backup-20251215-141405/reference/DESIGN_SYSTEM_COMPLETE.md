# Design System v2.1 - Komplett Guide
> Forest Theme | Inter Font | Apple HIG Typography

---

## 📖 Innholdsfortegnelse
1. [Fargepalett](#fargepalett)
2. [Typografi](#typografi)
3. [Implementering](#implementering)
4. [Migreringsguide](#migreringsguide)

---

## 🎨 Fargepalett

### Brand Colors
| Color | Hex | Bruk |
|-------|-----|------|
| **Forest** | `#1A3D2E` | Primary CTA, headers, brand |
| **Forest Light** | `#2D5A45` | Hover states, gradients |
| **Foam** | `#F5F7F6` | Light backgrounds |
| **Ivory** | `#FDFCF8` | Main background |
| **Gold** | `#C9A227` | Accents, achievements |

### Semantic Colors
| Color | Hex | Bruk |
|-------|-----|------|
| **Success** | `#4A7C59` | Positive feedback |
| **Warning** | `#D4A84B` | Cautions, warnings |
| **Error** | `#C45B4E` | Errors, destructive actions |

### Neutrals
| Color | Hex | Bruk |
|-------|-----|------|
| **Charcoal** | `#1C1C1E` | Primary text |
| **Steel** | `#8E8E93` | Secondary text |
| **Mist** | `#E5E5EA` | Borders |
| **Cloud** | `#F2F2F7` | Light backgrounds |
| **White** | `#FFFFFF` | Pure white |
| **Black** | `#000000` | Pure black |

### Session/Training Types
| Type | Color | Hex |
|------|-------|-----|
| **Teknikk** | Purple | `#8B6E9D` |
| **Golfslag** | Teal | `#4A8C7C` |
| **Spill** | Green | `#4A7C59` |
| **Kompetanse** | Red | `#C45B4E` |
| **Fysisk** | Orange | `#D97644` |
| **Funksjonell** | Turquoise | `#5FA696` |
| **Hjemme** | Gray | `#8E8E93` |
| **Test** | Gold | `#C9A227` |

---

## ✍️ Typografi

### Font Family
**Inter** - Open source, cross-platform alternative to SF Pro

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'system-ui', sans-serif;
```

### Type Scale (Apple HIG-inspired)

| Style | Size | Line Height | Weight | Letter Spacing | Bruk |
|-------|------|-------------|--------|----------------|------|
| **Large Title** | 34px | 41px | 700 | -0.4px | Hero headings |
| **Title 1** | 28px | 34px | 700 | 0.36px | Section headers |
| **Title 2** | 22px | 28px | 700 | -0.26px | Card headers |
| **Title 3** | 20px | 25px | 600 | -0.45px | Subsections |
| **Headline** | 17px | 22px | 600 | -0.43px | Important text |
| **Body** | 17px | 22px | 400 | -0.43px | Body text |
| **Callout** | 16px | 21px | 400 | -0.31px | Highlighted text |
| **Subhead** | 15px | 20px | 400 | -0.23px | Secondary text |
| **Footnote** | 13px | 18px | 400 | -0.08px | Captions |
| **Caption 1** | 12px | 16px | 400 | 0px | Small labels |
| **Caption 2** | 11px | 13px | 400 | 0.06px | Tiny labels |

### Special Typography

| Style | Size | Weight | Bruk |
|-------|------|--------|------|
| **Stat Number** | 48px | 700 | Large statistics |
| **Stat Label** | 11px | 500 | Stat labels (uppercase) |

---

## 💻 Implementering

### Metode 1: JavaScript (React)

```javascript
import { tokens } from './design-tokens';

// Bruk i inline styles
<div style={{ 
  backgroundColor: tokens.colors.forest,
  color: tokens.colors.white,
  ...tokens.typography.headline
}}>
  Content
</div>

// Bruk session type colors
<div style={{ 
  backgroundColor: tokens.colors.sessionTypes.teknikk
}}>
  Teknikk økt
</div>
```

### Metode 2: CSS Custom Properties

```css
@import './tokens.css';

.button {
  background-color: var(--color-forest);
  color: var(--color-white);
  font-size: var(--font-size-body);
}
```

### Metode 3: Tailwind CSS

```jsx
<button className="bg-forest text-white rounded-lg px-4 py-2">
  Button
</button>

<div className="bg-forest-50 text-forest-700">
  Light forest background
</div>
```

---

## 🔄 Migreringsguide

### Gamle farger → Nye farger

| Gammel | Ny | Token |
|--------|-----|-------|
| `#10456A` (Blå) | `#1A3D2E` | `tokens.colors.forest` |
| `#1E4B33` (Success) | `#4A7C59` | `tokens.colors.success` |
| `#B8860B` (Warning) | `#D4A84B` | `tokens.colors.warning` |
| `#A03232` (Error) | `#C45B4E` | `tokens.colors.error` |

### Steg-for-steg Migrering

**1. Legg til import**
```javascript
import { tokens } from '../design-tokens';
```

**2. Erstatt hardkodede farger**
```javascript
// ❌ Før
const colors = {
  primary: '#10456A',
  success: '#1E4B33'
};

// ✅ Etter
const colors = {
  primary: tokens.colors.forest,
  success: tokens.colors.success
};
```

**3. Oppdater komponenter**
```javascript
// ❌ Før
<div style={{ background: '#10456A' }}>

// ✅ Etter
<div style={{ background: tokens.colors.forest }}>
```

**4. Bruk session types for treningsøkter**
```javascript
// ❌ Før
const sessionColors = {
  teknikk: '#9b59b6',
  golfslag: '#3498db'
};

// ✅ Etter
const sessionColors = {
  teknikk: tokens.colors.sessionTypes.teknikk,
  golfslag: tokens.colors.sessionTypes.golfslag
};
```

---

## 📦 Filer

| Fil | Beskrivelse |
|-----|-------------|
| `design-tokens.js` | JavaScript/React tokens object |
| `tokens.css` | CSS custom properties |
| `tailwind.config.js` | Tailwind CSS configuration |
| `DESIGN_SYSTEM_GUIDE.md` | Denne filen |

---

## ✅ Migrert Status

**18/18 produksjonsfiler** bruker Design System v2.1:
- Alle 14 hovedskjermer
- Alle 4 støtteskjermer (intake forms, kategori oversikt, benchmark)

**Eksempelfiler** oppdatert med notater/kommentarer

---

## 🎯 Best Practices

1. **Bruk alltid tokens** - Aldri hardkode farger
2. **Konsistent spacing** - Bruk `tokens.spacing`
3. **Typography scale** - Bruk predefinerte størrelser
4. **Session types** - Bruk sessionTypes for treningsøkt-farger
5. **Semantic colors** - Bruk success/warning/error for feedback

---

**Design System Version**: v2.1  
**Status**: ✅ Komplett  
**Sist oppdatert**: 14. desember 2025
