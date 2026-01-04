# Premium UX Konsept Mockups

> Tre inspirerende design-retninger for videre utvikling av AK Golf Academy-appen.
> Disse konseptene bryter bevisst med eksisterende designregler for å utforske nye muligheter.

---

## 1. AURORA - Dark Mode Glassmorphism Experience

**Fil:** `MockupAurora.tsx`

### Konsept
En moderne, futuristisk premium-opplevelse inspirert av Spotify, Discord og gaming-dashboards.

### Nøkkelelementer
- **Mørk bakgrunn** med aurora borealis-inspirerte gradienter
- **Glassmorfisme** (frosted glass) effekter med blur
- **Neon-aktige accent-farger** (grønn, lilla, blå, rosa)
- **Smooth animasjoner** og micro-interactions
- **3D-lignende dybde** med layered cards og glows

### Fargepalett
| Farge | Hex | Bruk |
|-------|-----|------|
| Aurora Green | `#00ff87` | Primær accent, suksess |
| Aurora Purple | `#9b5de5` | Sekundær accent |
| Aurora Blue | `#00bbf9` | Tertiær accent |
| Deep Black | `#0a0a0f` | Bakgrunn |
| Gold | `#ffd700` | Premium, achievements |

### Målgruppe
Gen-Z og unge golfere som vil ha en "gaming"-inspirert, high-tech UI.

### Inspirasjon
- Spotify (dark mode, gradients)
- Discord (glass effects)
- Apple Music (animations)
- Modern dashboard apps

---

## 2. NATURE'S COURSE - Immersive Visual Experience

**Fil:** `MockupNaturesCourse.tsx`

### Konsept
En foto-sentrisk, naturnær opplevelse som reflekterer golfens eleganse og forbindelse til naturen.

### Nøkkelelementer
- **Store hero-bilder** av golfbaner og naturlandskaper
- **Organiske former** og myke kurver (ingen skarpe kanter)
- **Jordfarger** møter elegant serif-typografi
- **Card-basert layout** med "stacked paper" effekt
- **Rolig, meditativ estetikk** som inspirerer til fokus

### Fargepalett
| Farge | Hex | Bruk |
|-------|-----|------|
| Forest Deep | `#1a3a2f` | Primær, overskrifter |
| Sage | `#8fbc8b` | Sekundær, accenter |
| Warm White | `#fdfbf7` | Bakgrunn |
| Golden Hour | `#d4a84b` | Highlights |
| Sunset Orange | `#e8734a` | CTA, viktige elementer |

### Typografi
- **Heading:** Playfair Display (elegant serif)
- **Body:** Source Sans Pro (lesbar sans-serif)
- **Accent:** Cormorant Garamond (italic quotes)

### Målgruppe
Tradisjonelle golfere som setter pris på sportens eleganse og naturlige setting.

### Inspirasjon
- National Geographic (foto-fokus)
- Airbnb Luxe (premium travel)
- Patagonia (nature connection)
- Apple nature wallpapers

---

## 3. CHAMPIONSHIP - Luxury Sports Brand Experience

**Fil:** `MockupChampionship.tsx`

### Konsept
High-end luksus sportsmerke-estetikk som får brukeren til å føle seg som en profesjonell utøver.

### Nøkkelelementer
- **Svart/hvitt base** med gull-accenter
- **Sterk typografi** inspirert av sportssendinger (Bebas Neue)
- **Magazine-style layout** med asymmetri og store tall
- **Premium materiale-følelse** (leather, metal, velvet)
- **Real-time data visualiseringer** og live indicators

### Fargepalett
| Farge | Hex | Bruk |
|-------|-----|------|
| Pure Black | `#0a0a0a` | Bakgrunn |
| Championship Gold | `#c9a227` | Premium accent |
| Champion Red | `#c41e3a` | Live, viktig |
| Victory Green | `#228b22` | Positive trends |
| White | `#ffffff` | Tekst, kontrast |

### Typografi
- **Display:** Bebas Neue (bold headlines)
- **Heading:** Montserrat (clean, modern)
- **Body:** Inter (lesbar)
- **Mono:** JetBrains Mono (data, stats)

### Målgruppe
Ambisiøse spillere som vil ha en "professional athlete" opplevelse med fokus på data og prestasjoner.

### Inspirasjon
- Rolex (luxury, gold)
- Nike Elite (athlete focus)
- Formula 1 (live data, stats)
- ESPN+ / The Athletic (sports media)

---

## Bruk

```tsx
import { MockupAurora, MockupNaturesCourse, MockupChampionship } from './mockups/premium-concepts';

// Render ett av konseptene
<MockupAurora />
<MockupNaturesCourse />
<MockupChampionship />
```

## Videre utvikling

Disse mockups er ment som **inspirasjon** og **startpunkt** for diskusjoner. Vurder:

1. **Hybrid-tilnærming:** Kombiner elementer fra flere konsepter
2. **Brukerpreferanser:** La brukere velge tema (dark/light/nature)
3. **Kontekstuell design:** Ulike stiler for ulike deler av appen
4. **Animasjoner:** Legg til micro-interactions og overganger
5. **Responsive:** Tilpass for mobil og tablet

---

*Laget som inspirasjon for AK Golf Academy - Januar 2026*
