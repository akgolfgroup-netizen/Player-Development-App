# ProSwing Golf App - Figma Setup Guide

Følg denne guiden for å sette opp designsystemet i Figma.

---

## Steg 1: Opprett nytt Figma-prosjekt

1. Åpne Figma og lag et nytt design-fil
2. Gi filen navnet: `ProSwing Golf App - Design System`
3. Opprett følgende sider (Pages):
   - `Cover`
   - `Design System`
   - `Components`
   - `Mobile Screens`
   - `Web Screens`
   - `Prototypes`

---

## Steg 2: Importer Ikoner

1. Gå til **File > Import** (eller Ctrl/Cmd + Shift + K)
2. Velg filen `icons.svg` fra denne mappen
3. Alle ikoner vil bli importert som grupper
4. Velg alle ikoner og kjør **Plugins > "SVG to Component"** (eller lag manuelt)
5. Organiser i mappestruktur: `Icons/Navigation/home`, etc.

---

## Steg 3: Sett opp Color Styles

### Manuelt oppsett:
Gå til **Design Panel > Local Styles > + (Add)** og legg til disse fargene:

#### Primary Colors
| Navn | Hex |
|------|-----|
| `primary/700` | `#1B4332` |
| `primary/600` | `#2D6A4F` |
| `primary/500` | `#40916C` |
| `primary/400` | `#4ADE80` |

#### Gold Colors
| Navn | Hex |
|------|-----|
| `gold/400` | `#D4AF37` |
| `gold/300` | `#E8D5A3` |
| `gold/500` | `#C9A227` |

#### Surface Colors (Dark Mode)
| Navn | Hex |
|------|-----|
| `surface/black` | `#0A0A0A` |
| `surface/dark` | `#141414` |
| `surface/card` | `#1E1E1E` |
| `surface/elevated` | `#2A2A2A` |
| `surface/border` | `#3A3A3A` |

#### Text Colors
| Navn | Hex |
|------|-----|
| `text/primary` | `#FFFFFF` |
| `text/secondary` | `#B3B3B3` |
| `text/muted` | `#737373` |

#### Semantic Colors
| Navn | Hex |
|------|-----|
| `semantic/success` | `#4ADE80` |
| `semantic/warning` | `#FBBF24` |
| `semantic/error` | `#EF4444` |
| `semantic/info` | `#3B82F6` |

### Via Plugin (raskere):
1. Installer plugin: **"Figma Tokens"** eller **"Tokens Studio"**
2. Importer `figma-variables.json` fra denne mappen
3. Synkroniser tokens til Figma styles

---

## Steg 4: Sett opp Text Styles

Gå til **Text > Styles > +** og opprett disse:

| Style Navn | Font | Size | Weight | Line Height |
|------------|------|------|--------|-------------|
| `display/large` | SF Pro Display | 48 | Bold | 56 |
| `display/medium` | SF Pro Display | 36 | Bold | 44 |
| `headline/h1` | SF Pro Display | 28 | SemiBold | 36 |
| `headline/h2` | SF Pro Display | 22 | SemiBold | 28 |
| `headline/h3` | SF Pro Display | 18 | SemiBold | 24 |
| `body/large` | SF Pro Text | 16 | Regular | 24 |
| `body/medium` | SF Pro Text | 14 | Regular | 20 |
| `body/small` | SF Pro Text | 12 | Regular | 16 |
| `label/large` | SF Pro Text | 14 | Medium | 20 |
| `label/medium` | SF Pro Text | 12 | Medium | 16 |
| `caption` | SF Pro Text | 11 | Regular | 14 |

**OBS:** Hvis du ikke har SF Pro, bruk Inter som erstatning.

---

## Steg 5: Sett opp Effect Styles

Gå til **Effects > Styles > +**:

| Style Navn | Type | Settings |
|------------|------|----------|
| `shadow/card` | Drop Shadow | X:0, Y:4, Blur:24, Color:#000 40% |
| `shadow/elevated` | Drop Shadow | X:0, Y:8, Blur:32, Color:#000 50% |
| `shadow/gold-glow` | Drop Shadow | X:0, Y:0, Blur:20, Color:#D4AF37 30% |
| `shadow/green-glow` | Drop Shadow | X:0, Y:0, Blur:20, Color:#2D6A4F 30% |

---

## Steg 6: Opprett Base Components

### Button Component
```
Frame: Auto Layout
├── Padding: 12px vertical, 24px horizontal
├── Gap: 8px
├── Fill: primary/700
├── Corner Radius: 8px
└── Content
    ├── Icon (optional): 20px
    └── Label: label/large, white
```

**Variants:**
- Style: Primary, Secondary, Gold, Ghost
- Size: Small, Medium, Large
- State: Default, Hover, Pressed, Disabled
- Icon: None, Left, Right

### Card Component
```
Frame: Auto Layout (Vertical)
├── Padding: 20px
├── Gap: 12px
├── Fill: surface/card
├── Stroke: 1px surface/border
├── Corner Radius: 12px
└── Effect: shadow/card
```

### Input Component
```
Frame: Auto Layout
├── Width: Fill
├── Height: 48px
├── Padding: 12px 16px
├── Fill: surface/dark
├── Stroke: 1px surface/border
├── Corner Radius: 8px
└── Content
    ├── Icon (optional): 20px, text/muted
    └── Text: body/large
```

---

## Steg 7: Sett opp Frames for Screens

### Mobile Frames
- iPhone 14: 375 x 812px
- iPhone 14 Pro Max: 428 x 926px

### Tablet Frames
- iPad Pro 11": 834 x 1194px

### Desktop Frames
- Standard: 1440 x 900px
- Large: 1920 x 1080px

### Layout Grids
- Mobile: 4 columns, 16px margin, 16px gutter
- Tablet: 8 columns, 24px margin, 24px gutter
- Desktop: 12 columns, 64px margin, 24px gutter

---

## Steg 8: Bygg Screens

Bruk wireframes fra `mobile-screens.md` og `web-dashboard.md` som referanse.

### Anbefalte skjermer å starte med:

**Mobile (prioritert rekkefølge):**
1. Home Dashboard
2. Swing Analysis
3. Statistics
4. Lessons Library
5. Profile

**Web:**
1. Coach Dashboard
2. Video Analysis Workspace
3. Player Portal
4. Booking System

---

## Nyttige Figma Plugins

Installer disse for raskere arbeid:

| Plugin | Bruk |
|--------|------|
| **Tokens Studio** | Importer design tokens fra JSON |
| **Iconify** | Tilgang til tusenvis av ikoner |
| **Content Reel** | Placeholder-innhold og avatarer |
| **Unsplash** | Gratis stockbilder |
| **Charts** | Lag grafer og statistikk |
| **Figma to Code** | Eksporter til React/Flutter |

---

## Filstruktur i Figma

```
📁 ProSwing Golf App
│
├── 📄 Cover
│   └── App logo, tittel, versjon
│
├── 📄 Design System
│   ├── 🎨 Colors
│   │   ├── Primary
│   │   ├── Gold
│   │   ├── Surface
│   │   ├── Text
│   │   └── Semantic
│   ├── 📝 Typography
│   │   ├── Display
│   │   ├── Headlines
│   │   ├── Body
│   │   └── Labels
│   ├── 📐 Spacing & Grid
│   └── ✨ Effects
│
├── 📄 Components
│   ├── 🔘 Buttons
│   ├── 📦 Cards
│   ├── 🧭 Navigation
│   ├── 📝 Forms
│   ├── 📊 Data Display
│   ├── 💬 Feedback
│   └── 🖼️ Overlays
│
├── 📄 Mobile Screens
│   ├── Onboarding
│   ├── Home
│   ├── Swing Analysis
│   ├── Statistics
│   ├── Lessons
│   ├── Chat
│   └── Profile
│
├── 📄 Web Screens
│   ├── Coach Dashboard
│   ├── Video Analysis
│   ├── Player Portal
│   └── Booking
│
└── 📄 Prototypes
    ├── Mobile Flow
    └── Web Flow
```

---

## Eksporter til Utvikling

### For React/React Native:
1. Installer **"Figma to Code"** plugin
2. Velg komponenter
3. Eksporter som React + Tailwind CSS

### For Assets:
1. Velg ikoner/bilder
2. Eksporter som SVG (ikoner) eller PNG @2x/@3x (bilder)

### Design Tokens:
Bruk `figma-variables.json` direkte i kodebasen eller eksporter via Tokens Studio.

---

## Trenger du hjelp?

Se de andre filene i denne mappen:
- `figma-specifications.md` - Detaljerte komponent-specs
- `figma-variables.json` - Design tokens for import
- `styles.css` - CSS variabler
- `icons.svg` - Alle ikoner

Lykke til med designet! ⛳
