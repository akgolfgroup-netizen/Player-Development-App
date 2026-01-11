# Icon Library - ProSwing Golf App

## Icon Design Guidelines

### Style
- **Stroke Width:** 1.5px
- **Corner Radius:** 1px (rounded caps)
- **Style:** Outlined (ikke filled)
- **Grid:** 24x24px med 2px padding
- **Alignment:** Optisk sentrert

### Størrelser
| Navn | Størrelse | Bruksområde |
|------|-----------|-------------|
| XS | 16px | Inline med tekst, badges |
| SM | 20px | Knapper, inputs, navigasjon |
| MD | 24px | Standard, cards, lister |
| LG | 32px | Feature icons, empty states |
| XL | 48px | Illustrasjoner, onboarding |

---

## Kategori: Navigation

| Ikon | Navn | Unicode/Emoji | Beskrivelse |
|------|------|---------------|-------------|
| 🏠 | home | U+1F3E0 | Dashboard/hjem |
| 📊 | stats | U+1F4CA | Statistikk |
| 🎥 | video | U+1F3A5 | Opptak/video |
| 📚 | lessons | U+1F4DA | Leksjoner/bibliotek |
| 👤 | profile | U+1F464 | Profil/bruker |
| ⚙️ | settings | U+2699 | Innstillinger |
| 🔔 | notifications | U+1F514 | Varsler |
| 💬 | chat | U+1F4AC | Meldinger |
| 📅 | calendar | U+1F4C5 | Kalender/booking |
| 🔍 | search | U+1F50D | Søk |

---

## Kategori: Golf-spesifikke

| Ikon | Navn | Beskrivelse | SVG Path (24x24) |
|------|------|-------------|------------------|
| ⛳ | flag | Flagg/hull | `<path d="M4 21V3h1v2l10-2v8L5 13v8H4z"/>` |
| 🏌️ | golfer | Golfer | Kompleks - bruk font |
| 🎯 | target | Mål/fokus | `<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>` |
| ⚡ | swing | Swing speed | `<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>` |

### Custom Golf Icons (SVG)

#### Golf Ball
```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
  <circle cx="12" cy="12" r="9"/>
  <path d="M9 9.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" fill="currentColor"/>
  <path d="M15 9.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" fill="currentColor"/>
  <path d="M12 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" fill="currentColor"/>
  <path d="M9 17a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" fill="currentColor"/>
  <path d="M15 17a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" fill="currentColor"/>
</svg>
```

#### Golf Club (Driver)
```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
  <path d="M6 3l2 4 10 12-2 2-12-10-4-2z"/>
  <path d="M18 19l3 3"/>
</svg>
```

#### Golf Tee
```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
  <path d="M12 3v14"/>
  <path d="M8 17h8"/>
  <circle cx="12" cy="5" r="2"/>
</svg>
```

#### Fairway
```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
  <path d="M3 21c3-2 6-3 9-3s6 1 9 3"/>
  <path d="M12 3v12"/>
  <path d="M12 3l4-1v4l-4 1"/>
</svg>
```

#### Green/Putting
```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
  <ellipse cx="12" cy="16" rx="9" ry="5"/>
  <circle cx="12" cy="14" r="1.5" fill="currentColor"/>
  <path d="M12 3v8"/>
  <path d="M12 3l3-1v3l-3 1"/>
</svg>
```

---

## Kategori: Actions

| Ikon | Navn | Beskrivelse | SVG Path |
|------|------|-------------|----------|
| ▶️ | play | Spill av | `<polygon points="5,3 19,12 5,21"/>` |
| ⏸️ | pause | Pause | `<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>` |
| ⏹️ | stop | Stopp | `<rect x="4" y="4" width="16" height="16"/>` |
| ◀◀ | rewind | Spol tilbake | `<polygon points="11,19 2,12 11,5"/><polygon points="22,19 13,12 22,5"/>` |
| ▶▶ | forward | Spol fremover | `<polygon points="13,19 22,12 13,5"/><polygon points="2,19 11,12 2,5"/>` |
| 🔄 | refresh | Oppdater/loop | `<path d="M1 4v6h6"/><path d="M23 20v-6h-6"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>` |
| ✏️ | edit | Rediger | `<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>` |
| 🗑️ | delete | Slett | `<polyline points="3,6 5,6 21,6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>` |
| ➕ | add | Legg til | `<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>` |
| ✕ | close | Lukk | `<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>` |
| ✓ | check | Bekreft | `<polyline points="20,6 9,17 4,12"/>` |
| 💾 | save | Lagre | `<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17,21 17,13 7,13 7,21"/><polyline points="7,3 7,8 15,8"/>` |
| 📤 | share | Del | `<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>` |

---

## Kategori: Video/Analysis Tools

| Ikon | Navn | Beskrivelse |
|------|------|-------------|
| 📐 | angle | Vinkelmåler |
| ↗️ | arrow | Pil/retning |
| ⭕ | circle | Sirkel-markering |
| ─ | line | Linje |
| 💬 | annotation | Tekstnotat |
| 🎨 | color | Fargevelger |
| ↩️ | undo | Angre |
| ↪️ | redo | Gjør om |
| 🔍+ | zoom-in | Zoom inn |
| 🔍- | zoom-out | Zoom ut |
| ⛶ | fullscreen | Fullskjerm |

### Analysis Tool Icons (SVG)

#### Angle Measure
```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
  <path d="M3 21L12 12L21 21"/>
  <path d="M7.5 16.5a6 6 0 0 1 9 0" stroke-dasharray="2 2"/>
  <circle cx="12" cy="12" r="2"/>
</svg>
```

#### Draw Line
```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
  <line x1="4" y1="20" x2="20" y2="4"/>
  <circle cx="4" cy="20" r="2"/>
  <circle cx="20" cy="4" r="2"/>
</svg>
```

#### Draw Circle
```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
  <circle cx="12" cy="12" r="9"/>
  <line x1="12" y1="12" x2="18" y2="12" stroke-dasharray="2 2"/>
</svg>
```

#### Arrow Tool
```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
  <line x1="5" y1="19" x2="19" y2="5"/>
  <polyline points="12,5 19,5 19,12"/>
</svg>
```

---

## Kategori: Status & Feedback

| Ikon | Navn | Farge | Beskrivelse |
|------|------|-------|-------------|
| ✓ | success | #4ADE80 | Suksess |
| ✕ | error | #EF4444 | Feil |
| ⚠ | warning | #FBBF24 | Advarsel |
| ℹ | info | #3B82F6 | Informasjon |
| ● | online | #4ADE80 | Online-status |
| ○ | offline | #737373 | Offline-status |
| ⏳ | pending | #FBBF24 | Venter |
| 🔒 | locked | #737373 | Låst/premium |

---

## Kategori: Metrics & Data

| Ikon | Navn | Beskrivelse |
|------|------|-------------|
| ↑ | trend-up | Positiv trend |
| ↓ | trend-down | Negativ trend |
| → | trend-flat | Flat trend |
| 📈 | chart-up | Graf opp |
| 📉 | chart-down | Graf ned |
| ★ | star-filled | Fylt stjerne |
| ☆ | star-empty | Tom stjerne |
| ♥ | heart | Favoritt |

### Trend Icons (SVG)

#### Trend Up
```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <polyline points="23,6 13.5,15.5 8.5,10.5 1,18"/>
  <polyline points="17,6 23,6 23,12"/>
</svg>
```

#### Trend Down
```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <polyline points="23,18 13.5,8.5 8.5,13.5 1,6"/>
  <polyline points="17,18 23,18 23,12"/>
</svg>
```

---

## Kategori: Equipment

| Ikon | Navn | Beskrivelse |
|------|------|-------------|
| 🏌️ | driver | Driver |
| 🏌️ | wood | Fairway wood |
| 🏌️ | iron | Iron |
| 🏌️ | wedge | Wedge |
| 🏌️ | putter | Putter |
| 🎒 | bag | Golf bag |
| 🧤 | glove | Hanske |
| 👟 | shoes | Sko |

---

## Kategori: Weather (for bane-forhold)

| Ikon | Navn | Beskrivelse |
|------|------|-------------|
| ☀️ | sunny | Sol |
| ⛅ | partly-cloudy | Delvis skyet |
| ☁️ | cloudy | Overskyet |
| 🌧️ | rain | Regn |
| 💨 | wind | Vind |
| 🌡️ | temperature | Temperatur |

---

## Implementering i Figma

### Icon Component Setup
```
Frame: 24 x 24px
Constraints: Scale
Color: Inherit from parent (for tinting)

Component Properties:
- Size: XS (16) / SM (20) / MD (24) / LG (32) / XL (48)
- State: Default / Hover / Active / Disabled
```

### Icon Naming i Figma
```
icon/[kategori]/[navn]
Eksempler:
- icon/navigation/home
- icon/actions/play
- icon/golf/flag
- icon/status/success
```

### Eksport Settings
```
Format: SVG
ID Attribute: No
Outline Text: Yes
Include "id" Attribute: No
Simplify Stroke: Yes
```

---

## Anbefalte Icon Libraries

For raskere utvikling, kan disse bibliotekene brukes som base:

1. **Lucide Icons** (anbefalt)
   - https://lucide.dev
   - MIT lisens
   - 1.5px stroke, konsistent stil
   - React/Vue/Svelte komponenter

2. **Heroicons**
   - https://heroicons.com
   - MIT lisens
   - Tailwind-vennlig

3. **Phosphor Icons**
   - https://phosphoricons.com
   - MIT lisens
   - Flere vekter tilgjengelig

4. **Feather Icons**
   - https://feathericons.com
   - MIT lisens
   - Minimalistisk stil

### Custom Golf Icons
For golf-spesifikke ikoner som ikke finnes i standard biblioteker, lag custom SVG-er basert på retningslinjene over.
