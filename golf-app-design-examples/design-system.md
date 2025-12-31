# Premium Golf Coaching App - Design System

## Brand Identity: "ProSwing Golf"

---

## 1. Fargepalett

### Primærfarger
```
Forest Green (Primary)     #1B4332
Emerald (Primary Light)    #2D6A4F
Deep Teal                  #40916C
```

### Aksent & Premium
```
Championship Gold          #D4AF37
Soft Gold                  #E8D5A3
Bronze Accent              #CD7F32
```

### Dark Mode Bakgrunn
```
Pitch Black                #0A0A0A
Dark Surface               #141414
Card Background            #1E1E1E
Elevated Surface           #2A2A2A
Border/Divider             #3A3A3A
```

### Tekst
```
Primary Text               #FFFFFF
Secondary Text             #B3B3B3
Muted Text                 #737373
Success                    #4ADE80
Warning                    #FBBF24
Error                      #EF4444
```

---

## 2. Typografi

### Font Family
- **Display/Headers:** "SF Pro Display" eller "Inter"
- **Body:** "SF Pro Text" eller "Plus Jakarta Sans"
- **Numbers/Stats:** "JetBrains Mono" (monospace for data)

### Skala
```
Display Large    48px / 56px line-height / -0.5 tracking
Display Medium   36px / 44px line-height / -0.25 tracking
Headline         28px / 36px line-height / 0 tracking
Title Large      22px / 28px line-height / 0 tracking
Title Medium     18px / 24px line-height / 0.1 tracking
Body Large       16px / 24px line-height / 0.5 tracking
Body Medium      14px / 20px line-height / 0.25 tracking
Label            12px / 16px line-height / 0.5 tracking
Caption          11px / 14px line-height / 0.4 tracking
```

---

## 3. Spacing System (8px base)

```
xs     4px
sm     8px
md     16px
lg     24px
xl     32px
2xl    48px
3xl    64px
```

---

## 4. Border Radius

```
Small (buttons, inputs)    8px
Medium (cards)             12px
Large (modals, sheets)     16px
Full (avatars, badges)     9999px
```

---

## 5. Shadows (for elevated elements)

```css
/* Card Shadow */
box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);

/* Elevated Card */
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);

/* Gold Glow (for premium elements) */
box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
```

---

## 6. Ikoner

Stil: Outlined med 1.5px stroke, rounded caps
Størrelse: 24px standard, 20px compact, 32px feature icons
Farge: Matcher tekst-hierarki eller primærfarge for aktive states

---

## 7. Motion & Animasjoner

```
Duration:
- Micro (hover, press)     100ms
- Short (toggles, fades)   200ms
- Medium (modals, cards)   300ms
- Long (page transitions)  400ms

Easing:
- Default: cubic-bezier(0.4, 0, 0.2, 1)
- Enter: cubic-bezier(0, 0, 0.2, 1)
- Exit: cubic-bezier(0.4, 0, 1, 1)
```

---

## 8. Komponenter - Oversikt

### Buttons
- **Primary:** Grønn bakgrunn (#1B4332), hvit tekst
- **Secondary:** Transparent med grønn border
- **Gold/Premium:** Gradient gold bakgrunn
- **Ghost:** Kun tekst, hover-effekt

### Cards
- Bakgrunn: #1E1E1E
- Border: 1px solid #3A3A3A (subtil)
- Hover: Lett glow eller border-color change

### Input Fields
- Bakgrunn: #141414
- Border: #3A3A3A, focus: #2D6A4F
- Placeholder: #737373

### Navigation
- Bottom nav på mobil (5 items maks)
- Sidebar på web/tablet
- Active state: Grønn ikon + tekst
