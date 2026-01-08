# TIER Golf - Design System v2.1

> **KILDE:** `/packages/design-system/figma/ak_golf_complete_figma_kit.svg`
> **Versjon:** Design System v2.1
> **Dato:** Desember 2025

---

## Innhold

1. [Fargepalett](#fargepalett)
2. [Typografi](#typografi)
3. [Icon Spesifikasjoner](#icon-spesifikasjoner)
4. [Komponenter](#komponenter)
5. [Spacing & Layout](#spacing--layout)
6. [Shadows & Effects](#shadows--effects)

---

## Fargepalett

### Brand Colors

| Navn | Hex | RGB | Bruk |
|------|-----|-----|------|
| Blue Primary | `#10456A` | rgb(26, 61, 46) | Primary - Hovedfarge |
| **Blue Light** | `#2C5F7F` | rgb(45, 90, 69) | Secondary - Sekundærfarge |
| **Foam** | `#EDF0F2` | rgb(245, 247, 246) | Background - Bakgrunn |
| **Ivory** | `#EBE5DA` | rgb(253, 252, 248) | Surface - Overflater |
| **Gold** | `#C9A227` | rgb(201, 162, 39) | Accent - Aksentfarge |

### Semantic Colors

| Navn | Hex | RGB | Bruk |
|------|-----|-----|------|
| **Success** | `#4A7C59` | rgb(74, 124, 89) | Fullført, Positiv |
| **Warning** | `#D4A84B` | rgb(212, 168, 75) | Advarsel, Pågår |
| **Error** | `#C45B4E` | rgb(196, 91, 78) | Feil, Negativ |

### Neutrals

| Navn | Hex | RGB | Bruk |
|------|-----|-----|------|
| **Charcoal** | `#1C1C1E` | rgb(28, 28, 30) | Text primary |
| **Steel** | `#8E8E93` | rgb(142, 142, 147) | Text secondary |
| **Mist** | `#E5E5EA` | rgb(229, 229, 234) | Borders |
| **Cloud** | `#F2F2F7` | rgb(242, 242, 247) | Backgrounds |
| **White** | `#FFFFFF` | rgb(255, 255, 255) | Surface |

### CSS Variables

```css
:root {
  /* Brand */
  --ak-primary: #10456A;
  --ak-primary-light: #2C5F7F;
  --ak-snow: #EDF0F2;
  --ak-surface: #EBE5DA;
  --ak-gold: #C9A227;

  /* Semantic */
  --ak-success: #4A7C59;
  --ak-warning: #D4A84B;
  --ak-error: #C45B4E;

  /* Neutrals */
  --ak-charcoal: #1C1C1E;
  --ak-steel: #8E8E93;
  --ak-mist: #E5E5EA;
  --ak-cloud: #F2F2F7;
  --ak-white: #FFFFFF;
}
```

### Tailwind Config

```javascript
colors: {
  'ak-primary': '#10456A',
  'ak-primary-light': '#2C5F7F',
  'ak-foam': '#EDF0F2',
  'ak-ivory': '#EBE5DA',
  'ak-gold': '#C9A227',
  'ak-success': '#4A7C59',
  'ak-warning': '#D4A84B',
  'ak-error': '#C45B4E',
  'ak-charcoal': '#1C1C1E',
  'ak-steel': '#8E8E93',
  'ak-mist': '#E5E5EA',
  'ak-cloud': '#F2F2F7',
}
```

---

## Typografi

### Font Familie

- **Familie:** Inter (Open Source, Cross-Platform)
- **Import:** `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap`
- **Fallback:** `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`

### Apple HIG Typography Scale

| Stil | Størrelse | Vekt | Line Height | Tracking | Bruk |
|------|-----------|------|-------------|----------|------|
| **Large Title** | 34px | 700 | 41px | -0.4px | Splash, hovedtitler |
| **Title 1** | 28px | 700 | 34px | 0.36px | Skjermtitler |
| **Title 2** | 22px | 700 | 28px | -0.26px | Seksjoner, kort-titler |
| **Title 3** | 20px | 600 | 25px | -0.45px | Økt-navn, turneringer |
| **Headline** | 17px | 600 | 22px | -0.43px | Knapper, liste-titler |
| **Body** | 17px | 400 | 22px | -0.43px | Brødtekst, input |
| **Callout** | 16px | 400 | 21px | -0.31px | Metadata, hints |
| **Subhead** | 15px | 400 | 20px | -0.23px | Labels, timestamps |
| **Footnote** | 13px | 400 | 18px | -0.08px | Help text |
| **Caption** | 12px | 400 | 16px | 0 | Small labels, tabs |
| **Caption 2** | 11px | 500 | 13px | 0.5px | Overline, section headers |

### Tailwind Typography Classes

```javascript
fontSize: {
  'ak-large-title': ['34px', { lineHeight: '41px', letterSpacing: '-0.4px', fontWeight: '700' }],
  'ak-title-1': ['28px', { lineHeight: '34px', letterSpacing: '0.36px', fontWeight: '700' }],
  'ak-title-2': ['22px', { lineHeight: '28px', letterSpacing: '-0.26px', fontWeight: '700' }],
  'ak-title-3': ['20px', { lineHeight: '25px', letterSpacing: '-0.45px', fontWeight: '600' }],
  'ak-headline': ['17px', { lineHeight: '22px', letterSpacing: '-0.43px', fontWeight: '600' }],
  'ak-body': ['17px', { lineHeight: '22px', letterSpacing: '-0.43px', fontWeight: '400' }],
  'ak-callout': ['16px', { lineHeight: '21px', letterSpacing: '-0.31px', fontWeight: '400' }],
  'ak-subhead': ['15px', { lineHeight: '20px', letterSpacing: '-0.23px', fontWeight: '400' }],
  'ak-footnote': ['13px', { lineHeight: '18px', letterSpacing: '-0.08px', fontWeight: '400' }],
  'ak-caption1': ['12px', { lineHeight: '16px', letterSpacing: '0', fontWeight: '400' }],
  'ak-caption2': ['11px', { lineHeight: '13px', letterSpacing: '0.5px', fontWeight: '500' }],
}
```

---

## Icon Spesifikasjoner

### Generelle Regler

| Egenskap | Verdi |
|----------|-------|
| **Størrelse** | 24×24px |
| **Stroke Width** | 1.5px |
| **Line Cap** | Round |
| **Line Join** | Round |
| **Safe Area** | 2px padding |
| **Farge** | #10456A (Blue Primary) |

### Icon Kategorier (58 totalt)

1. **Navigasjon** (10 ikoner)
   - Hjem, Plan, Trening, Statistikk, Profil
   - Søk, Meny, Innstillinger, Varsel, Mer

2. **Golf** (10 ikoner)
   - Ball, Kølle, Hull, Tee, Mål
   - Scorekort, Bag, Driving Range, Green, Bunker

3. **Handlinger** (10 ikoner)
   - Legg til, Rediger, Slett, Lagre, Del
   - Last ned, Last opp, Sync, Refresh, Søk

4. **Status** (8 ikoner)
   - Suksess, Advarsel, Feil, Info
   - Låst, Ulåst, Synlig, Skjult

5. **Øvelser** (10 ikoner)
   - Langspill, Kortspill, Putting, Fysisk, Mental
   - Teori, Video, Teknikk, Spill, Analyse

6. **Kommunikasjon** (10 ikoner)
   - Melding, Chat, Varsel, E-post, Kalender
   - Telefon, Video, Mikrofon, Kamera, Vedlegg

### SVG Template

```svg
<svg width="24" height="24" viewBox="0 0 24 24"
     fill="none"
     stroke="#10456A"
     stroke-width="1.5"
     stroke-linecap="round"
     stroke-linejoin="round">
  <!-- Icon paths here -->
</svg>
```

---

## Komponenter

### Border Radius

| Navn | Verdi | Bruk |
|------|-------|------|
| **sm** | 8px | Små elementer, tags |
| **md** | 12px | Kort, input fields |
| **lg** | 16px | Store kort, modaler |
| **pill** | 9999px | Pills, badges |

### Spacing Scale

```javascript
spacing: {
  'ak-xs': '4px',
  'ak-sm': '8px',
  'ak-md': '12px',
  'ak-lg': '16px',
  'ak-xl': '24px',
  'ak-2xl': '32px',
  'ak-3xl': '48px',
}
```

### Cards

```css
.ak-card {
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
}

.ak-card-elevated {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
```

### Buttons

| Variant | Background | Text | Border |
|---------|------------|------|--------|
| **Primary** | #10456A | #FFFFFF | none |
| **Secondary** | transparent | #10456A | 1px #10456A |
| **Ghost** | transparent | #10456A | none |
| **Destructive** | #C45B4E | #FFFFFF | none |

### Input Fields

```css
.ak-input {
  height: 44px;
  padding: 0 12px;
  border: 1px solid #E5E5EA;
  border-radius: 8px;
  font-size: 17px;
  color: #1C1C1E;
}

.ak-input:focus {
  border-color: #10456A;
  outline: none;
}

.ak-input::placeholder {
  color: #8E8E93;
}
```

---

## Shadows & Effects

### Shadows

| Navn | Verdi | Bruk |
|------|-------|------|
| **Card** | `0 2px 4px rgba(0, 0, 0, 0.06)` | Standard kort |
| **Elevated** | `0 4px 12px rgba(0, 0, 0, 0.08)` | Hevet kort, modaler |
| **Dropdown** | `0 4px 16px rgba(0, 0, 0, 0.12)` | Dropdowns, popovers |

### Transitions

```javascript
transitionDuration: {
  'ak-fast': '150ms',
  'ak-normal': '200ms',
  'ak-slow': '300ms',
}
```

### CSS Filter for Card Shadow

```css
filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.06));
```

---

## Safe Area

### Mobile Safe Areas

```css
.safe-area-top {
  padding-top: env(safe-area-inset-top);
}

.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
```

### Bottom Navigation

```css
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  padding-bottom: env(safe-area-inset-bottom);
  background: #EBE5DA;
  border-top: 1px solid #E5E5EA;
}
```

---

## Filreferanser

- **Figma Kit:** `/Design/figma/ak_golf_complete_figma_kit.svg`
- **Tailwind Config:** `/IUP_Master_Folder_2/frontend/tailwind.config.js`
- **CSS Tokens:** `/IUP_Master_Folder_2/frontend/src/index.css`

---

*Design System v2.1 - TIER Golf - Desember 2025*
