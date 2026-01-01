# AK GOLF ACADEMY - DESIGN SOURCE OF TRUTH

> **OPPDATERT:** 15. desember 2025
> **VERSJON:** Design System v2.1

---

## PRIMÆR KILDE (OBLIGATORISK)

```
/packages/design-system/figma/ak_golf_complete_figma_kit.svg
```

**Dette er den ENESTE gyldige kilden for:**
- Fargepalett (Brand, Semantic, Neutrals)
- Typografi (Apple HIG Scale med Inter font)
- Icon spesifikasjoner (24×24px, 1.5px stroke, Round caps)
- Spacing og border radius
- Shadows

---

## SEKUNDÆRE KILDER (TOKENS)

Disse filene er **generert fra** Figma-kitet og kan brukes direkte i kode:

| Fil | Format | Bruk |
|-----|--------|------|
| `/packages/design-system/tokens/design-tokens.js` | JavaScript | React/JS komponenter |
| `/packages/design-system/tokens/tokens.css` | CSS Variables | Global CSS |
| `/packages/design-system/tokens/tailwind.config.js` | Tailwind | Tailwind-prosjekter |

---

## FARGEPALETT

### Brand Colors
| Navn | Hex | CSS Variable | Bruk |
|------|-----|--------------|------|
| Blue Primary | `#10456A` | `--ak-primary` | Primary |
| Blue Light | `#2C5F7F` | `--ak-primary-light` | Secondary |
| Foam | `#EDF0F2` | `--ak-snow` | Background |
| Ivory | `#EBE5DA` | `--ak-surface` | Surface |
| Gold | `#C9A227` | `--ak-gold` | Accent |

### Semantic Colors
| Navn | Hex | CSS Variable | Bruk |
|------|-----|--------------|------|
| Success | `#4A7C59` | `--ak-success` | Fullført, Positiv |
| Warning | `#D4A84B` | `--ak-warning` | Advarsel, Pågår |
| Error | `#C45B4E` | `--ak-error` | Feil, Negativ |

### Neutrals
| Navn | Hex | CSS Variable | Bruk |
|------|-----|--------------|------|
| Charcoal | `#1C1C1E` | `--ak-charcoal` | Primary text |
| Steel | `#8E8E93` | `--ak-steel` | Secondary text |
| Mist | `#E5E5EA` | `--ak-mist` | Borders |
| Cloud | `#F2F2F7` | `--ak-cloud` | Light backgrounds |
| White | `#FFFFFF` | - | White |

---

## TYPOGRAFI

**Font:** Inter (Open Source, Cross-Platform)
**Scale:** Apple Human Interface Guidelines

| Stil | Størrelse | Vekt | Line Height | Tracking | Bruksområde |
|------|-----------|------|-------------|----------|--------------|
| Large Title | 34px | 700 | 41px | -0.4px | Splash, hovedtitler |
| Title 1 | 28px | 700 | 34px | 0.36px | Skjermtitler |
| Title 2 | 22px | 700 | 28px | -0.26px | Seksjoner, kort-titler |
| Title 3 | 20px | 600 | 25px | -0.45px | Økt-navn, turneringer |
| Headline | 17px | 600 | 22px | -0.43px | Knapper, liste-titler |
| Body | 17px | 400 | 22px | -0.43px | Brødtekst, input |
| Callout | 16px | 400 | 21px | -0.31px | Metadata, hints |
| Subhead | 15px | 400 | 20px | -0.23px | Labels, timestamps |
| Footnote | 13px | 400 | 18px | -0.08px | Help text |
| Caption | 12px | 400 | 16px | 0 | Small labels, tabs |

### Spesial-typografi
| Stil | Størrelse | Vekt | Tracking | Bruk |
|------|-----------|------|----------|------|
| Stat Number | 48px | 700 | -0.5px | Store tall |
| Stat Label | 11px | 500 | 0.5px | Labels (UPPERCASE) |

---

## IKONER

**Spesifikasjoner:**
| Egenskap | Verdi |
|----------|-------|
| Størrelse | 24×24px |
| Stroke | 1.5px |
| Line Cap | Round |
| Line Join | Round |
| Safe Area | 2px padding |
| Farge | #10456A (Blue Primary) |

**Tilgjengelige ikoner i Figma-kit:**
- Navigasjon: Hjem, Plan, Trening, Statistikk, Profil, Søk, Meny, Innstillinger, Varsel, Mer
- Golf: Ball, Kølle, Hull, Tee, Mål, ...
- (Se komplett liste i SVG-filen)

---

## SPACING & LAYOUT

### Spacing
| Størrelse | Verdi |
|-----------|-------|
| xs | 4px |
| sm | 8px |
| md | 16px |
| lg | 24px |
| xl | 32px |
| xxl | 48px |

### Border Radius
| Størrelse | Verdi |
|-----------|-------|
| sm | 8px |
| md | 12px |
| lg | 16px |
| full | 9999px |

### Shadows
| Navn | Verdi |
|------|-------|
| Card | `0 2px 4px rgba(0, 0, 0, 0.06)` |
| Elevated | `0 4px 12px rgba(0, 0, 0, 0.08)` |

---

## BRUK I PROSJEKTET

### React/JavaScript
```javascript
import { tokens } from '/packages/design-system/tokens/design-tokens.js';

// Bruk farger
<div style={{ backgroundColor: tokens.colors.primary }}>

// Bruk typografi
<h1 style={tokens.typography.title1}>Tittel</h1>
```

### CSS
```css
@import '/packages/design-system/tokens/tokens.css';

.card {
  background-color: var(--ak-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
}
```

### Tailwind
```jsx
// Bruk ak- prefix for farger
<div className="bg-ak-primary text-white">

// Bruk typografi-klasser
<h1 className="text-title-1">Tittel</h1>
```

---

## IKKE BRUK

- Andre design-filer utenfor `/packages/design-system/`
- Hardkodede farger som ikke finnes i paletten
- Andre fonter enn Inter
- Andre typografi-størrelser enn de definerte

---

**Ved spørsmål om design, referer ALLTID til:**
`/packages/design-system/figma/ak_golf_complete_figma_kit.svg`
