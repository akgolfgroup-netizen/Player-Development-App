# AK Golf Academy - Design System Guide v2.1

**Sist oppdatert:** 14. desember 2025
**Kilde:** `Design/ak_golf_design_system_v2.1.svg`
**Font:** Inter (Open Source, Cross-Platform)
**Skala:** Apple Human Interface Guidelines

---

## 📋 Innholdsfortegnelse

1. [Farger](#farger)
2. [Typografi](#typografi)
3. [Implementering](#implementering)
4. [Komponenter](#komponenter)
5. [Beste praksis](#beste-praksis)

---

## 🎨 Farger

### Brand-farger

| Navn | Hex | CSS Variable | Tailwind | Bruk |
|------|-----|--------------|----------|------|
| Blue Primary | `#1A3D2E` | `--ak-primary` | `forest` | Primær merkefarge, knapper, headere |
| **Forest Light** | `#2D5A45` | `--ak-primary-light` | `forest-light` | Hover-states, sekundær branding |
| **Foam** | `#F5F7F6` | `--ak-foam` | `foam` | Lys bakgrunn, kort-bakgrunner |
| **Ivory** | `#FDFCF8` | `--ak-ivory` | `ivory` | Hovedbakgrunn, app-bakgrunn |
| **Gold** | `#C9A227` | `--ak-gold` | `gold` | Aksenter, utmerkelser, fremheving |

### Semantiske farger (oppdatert)

| Navn | Hex | CSS Variable | Tailwind | Bruk |
|------|-----|--------------|----------|------|
| **Success** | `#4A7C59` | `--ak-success` | `success` | Suksess-meldinger, fremgang |
| **Warning** | `#D4A84B` | `--ak-warning` | `warning` | Advarsler, påminnelser |
| **Error** | `#C45B4E` | `--ak-error` | `error` | Feilmeldinger, destruktive handlinger |

### Nøytrale farger

| Navn | Hex | CSS Variable | Tailwind | Bruk |
|------|-----|--------------|----------|------|
| **Charcoal** | `#1C1C1E` | `--ak-charcoal` | `charcoal` | Primær tekst |
| **Steel** | `#8E8E93` | `--ak-steel` | `steel` | Sekundær tekst, labels |
| **Mist** | `#E5E5EA` | `--ak-mist` | `mist` | Kantlinjer, separatorer |
| **Cloud** | `#F2F2F7` | `--ak-cloud` | `cloud` | Badges, tertiære bakgrunner |

---

## ✍️ Typografi

### Font

**Primær font:** Inter
**Fallback:** `-apple-system, BlinkMacSystemFont, system-ui, sans-serif`
**Import:** `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');`

### Type Scale

#### Display Styles

| Stil | Størrelse | Vekt | Line Height | Tracking | Bruk |
|------|-----------|------|-------------|----------|------|
| **Large Title** | 34px | 700 | 41px | -0.4px | Splash-skjermer, hovedtitler |
| **Title 1** | 28px | 700 | 34px | 0.36px | Skjermtitler, hovedoverskrifter |
| **Title 2** | 22px | 700 | 28px | -0.26px | Seksjonsoverskrifter |
| **Title 3** | 20px | 600 | 25px | -0.45px | Økt-navn, kort-titler |

#### Text Styles

| Stil | Størrelse | Vekt | Line Height | Tracking | Bruk |
|------|-----------|------|-------------|----------|------|
| **Headline** | 17px | 600 | 22px | -0.43px | Knapper, liste-titler |
| **Body** | 17px | 400 | 22px | -0.43px | Brødtekst, input-felter |
| **Callout** | 16px | 400 | 21px | -0.31px | Metadata, hint-tekster |
| **Subhead** | 15px | 400 | 20px | -0.23px | Labels, tidsstempel |
| **Footnote** | 13px | 400 | 18px | -0.08px | Hjelpetekst, placeholders |
| **Caption 1** | 12px | 400 | 16px | 0 | Small labels, badges |
| **Caption 2** | 11px | 400 | 13px | 0.06px | Tab labels, micro-metadata |

#### Special Typography

| Stil | Størrelse | Vekt | Line Height | Tracking | Bruk |
|------|-----------|------|-------------|----------|------|
| **Stat Number** | 48px | 700 | 1 | -0.5px | Store tall, score-visning |
| **Stat Label** | 11px | 500 | 13px | 0.5px | Labels for statistikk (UPPERCASE) |

---

## 🔧 Implementering

### CSS (Vanilla/React med CSS Modules)

```css
/* Import tokens */
@import './tokens.css';

/* Eksempel */
.heading {
  font: var(--text-title-1);
  letter-spacing: var(--text-title-1-spacing);
  color: var(--ak-primary);
}

.card {
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
}
```

### Tailwind CSS

```jsx
// Installer Tailwind: npm install -D tailwindcss
// Bruk tailwind.config.js fra prosjektroten

// Eksempel
<div className="bg-ivory min-h-screen">
  <h1 className="text-title-1 text-forest">Min Plan</h1>
  <div className="bg-white rounded-ak-lg shadow-ak-card p-4">
    <p className="text-body text-charcoal">Innhold her</p>
  </div>
</div>
```

### React Inline (med tokens-objekt)

```jsx
// Importer tokens
import { tokens } from './design-tokens';

// Eksempel
const Card = ({ children }) => (
  <div style={{
    backgroundColor: tokens.colors.ivory,
    borderRadius: tokens.radius.lg,
    boxShadow: tokens.shadows.card,
    padding: tokens.spacing.md,
  }}>
    {children}
  </div>
);
```

---

## 🧩 Komponenter

### Button

```jsx
// Primary Button
<button className="bg-forest text-white text-headline px-4 py-2.5 rounded-ak-md">
  Fortsett
</button>

// Secondary Button
<button className="bg-foam text-charcoal text-headline px-4 py-2.5 rounded-ak-md">
  Avbryt
</button>

// Ghost Button
<button className="bg-transparent text-steel text-headline px-4 py-2.5">
  Les mer
</button>
```

### Card

```jsx
<div className="bg-white rounded-ak-lg shadow-ak-card p-4">
  <h3 className="text-title-3 text-charcoal mb-2">Dagens økt</h3>
  <p className="text-body text-steel">Teknikk: Jerntreffsikkerhet</p>
</div>
```

### Badge

```jsx
// Success Badge
<span className="bg-success/10 text-success text-caption-1 px-2 py-0.5 rounded-full">
  L3
</span>

// Warning Badge
<span className="bg-warning/10 text-warning text-caption-1 px-2 py-0.5 rounded-full">
  CS80
</span>
```

### Stats Display

```jsx
<div className="text-center">
  <div className="text-stat-label text-steel mb-2">SNITTSCORE</div>
  <div className="text-stat-number text-forest">76.4</div>
  <div className="text-subhead text-steel">siste 10 runder</div>
</div>
```

---

## ✅ Beste praksis

### DO ✓

- **Bruk alltid Inter-font** fra Google Fonts eller system-fallback
- **Følg type scale** nøyaktig - ikke opprett egendefinerte størrelser
- **Bruk semantiske farger** for tilstander (success, warning, error)
- **Respekter letter-spacing** - dette er viktig for lesbarhet
- **Bruk `forest` som primærfarge** for alle knapper og headere
- **Bruk `ivory` som hovedbakgrunn** på alle skjermer
- **Konsistent border-radius:** sm (8px), md (12px), lg (16px)

### DON'T ✗

- **Ikke bruk SF Pro** - det er kun for Apple-plattformer
- **Ikke opprett egne farger** uten godkjenning fra design-teamet
- **Ikke blande gamle tokens** (`#10456A`, etc.) med nye (`#1A3D2E`)
- **Ikke ignorer letter-spacing** - det er en del av designsystemet
- **Ikke bruk hardkodede hex-verdier** - bruk tokens/Tailwind-klasser
- **Ikke lag egne skygger** - bruk `shadow-ak-card` eller `shadow-ak-elevated`

---

## 📦 Filer

| Fil | Formål |
|-----|--------|
| `Design/ak_golf_design_system_v2.1.svg` | Visuell design system-oversikt |
| `tailwind.config.js` | Tailwind-konfigurasjon med tokens |
| `tokens.css` | CSS custom properties (variabler) |
| `design-tokens.js` | React/JS tokens-objekt |
| `DESIGN_SYSTEM_GUIDE.md` | Denne guiden |

---

## 🔄 Oppdateringslogg

### v2.1 (14. desember 2025)
- Byttet fra SF Pro til Inter font (cross-platform)
- Oppdaterte semantiske farger (harmonisert med brand)
- Nye farger: Success (#4A7C59), Warning (#D4A84B), Error (#C45B4E)
- Komplett type scale basert på Apple HIG
- Tailwind-konfigurasjon opprettet
- CSS tokens-fil opprettet

---

## 📞 Support

Ved spørsmål om designsystemet, kontakt design-teamet eller referer til:
- **Kilde:** `Design/ak_golf_design_system_v2.1.svg`
- **Dokumentasjon:** Denne filen
- **Konfigurasjon:** `tailwind.config.js` og `tokens.css`

---

**AK Golf Academy × Team Norway Golf**
*Design System v2.1 • Cross-Platform Ready*
