# Plan: Forklarende Stats & Tester Side

> **Mål:** Bygge en forklarende side under "Stats" menyen som forklarer hva statistikk- og testsystemet er, hvordan det fungerer, og hva appen gjør.

---

## 1. Oversikt

### Hva vi har funnet:

| Kategori | Innhold |
|----------|---------|
| **20 Offisielle Tester** | Distanse, Hastighet, Approach, Fysisk, Kortspill, On-Course |
| **11 Spillerkategorier (A-K)** | Fra Elite (A) til Nybegynner (K) |
| **Strokes Gained Analyse** | OTT, APP, ARG, PUTT komponenter |
| **DataGolf Integrasjon** | Tour-sammenligning (PGA, LPGA, DP World) |
| **Automatisk Treningsplan** | Tester → Fokusområder → Tilpasset plan |

### Eksisterende dokumentasjon:
- `/docs/reference/MATEMATISKE_FORMLER_ALLE_TESTER.md` (786 linjer)
- `/docs/SAMMENHENG_TESTER_OG_PLANER.md` (436 linjer)

---

## 2. Side-struktur: StatsGuidePage

### 2.1 Hero Seksjon
```
┌─────────────────────────────────────────────────────────────┐
│  📊 Statistikk & Testing                                    │
│  ─────────────────────────────────                          │
│  Forstå hvordan vi måler og utvikler ditt golfspill         │
│                                                              │
│  [Se mine tester]  [Gå til statistikk]                      │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Navigasjon/Tabs
1. **Hva er dette?** - Introduksjon til systemet
2. **Testene** - Oversikt over alle 20 tester
3. **Kategorier** - Forklaring av A-K systemet
4. **Strokes Gained** - Hva er SG og hvordan tolke det
5. **Slik fungerer det** - Hvordan tester påvirker treningsplan

---

## 3. Innhold per seksjon

### Seksjon 1: Hva er dette?

**Formål:** Gi brukeren en rask forståelse av hva statistikksystemet er.

**Innhold:**
- **Overskrift:** "Din golfutvikling - målt og analysert"
- **Introduksjon:**
  - "AK Golf bruker Team Norway Golf Testing Protocol for å måle alle aspekter av golfspillet ditt."
  - "Basert på dine testresultater tilpasser vi treningsplanen automatisk til dine styrker og forbedringsområder."

- **3 Hovedpunkter (med ikoner):**
  1. 🎯 **20 Standardiserte Tester** - Dekker alt fra driving til putting
  2. 📈 **Personlig Kategori (A-K)** - Din spillernivå basert på 18-hulls snitt
  3. 🔄 **Automatisk Tilpasning** - Treningsplanen justeres etter testresultater

- **Visuell:** Sirkeldiagram som viser test-kategoriene

---

### Seksjon 2: De 20 Testene

**Formål:** Gi oversikt over alle tester på en forståelig måte.

**Layout:** 6 kategorikort med ekspanderbar liste

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  🏌️ Distanse    │  │  ⚡ Hastighet   │  │  🎯 Approach    │
│  Test 1-4       │  │  Test 5-7       │  │  Test 8-11      │
│  Driver, 3-tre, │  │  Klubb, Ball,   │  │  25m, 50m,      │
│  5-jern, PW     │  │  Smash Factor   │  │  75m, 100m      │
└─────────────────┘  └─────────────────┘  └─────────────────┘

┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  💪 Fysisk      │  │  ⛳ Kortspill   │  │  🏆 On-Course   │
│  Test 12-14     │  │  Test 15-18     │  │  Test 19-20     │
│  Benkpress,     │  │  Putting 3m/6m, │  │  9-hulls sim,   │
│  Markløft, 3km  │  │  Chipping,Bunker│  │  On-Course      │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

**For hver test (ekspanderbar):**
- Navn og nummer
- Kort beskrivelse (1 setning)
- Hvordan den måles (f.eks. "Top 3 av 6 slag")
- Hva et godt resultat er

---

### Seksjon 3: Kategorisystemet (A-K)

**Formål:** Forklare hvordan spillerkategorier fungerer.

**Innhold:**
- **Overskrift:** "Din spillerkategori"
- **Forklaring:** "Basert på ditt 18-hulls gjennomsnittsscore plasseres du i en kategori fra A (Elite) til K (Nybegynner)."

**Visuell tabell:**
```
┌────────────────────────────────────────────────────────┐
│  Kategori    Score (18 hull)    Nivå                   │
├────────────────────────────────────────────────────────┤
│  A           < 70               🏆 Elite / Tour        │
│  B           70-72              ⭐ Scratch              │
│  C           73-75              🎯 Lavt handicap        │
│  D           76-78              📊 Singel handicap      │
│  E           79-81              📈 Middels              │
│  F-G         82-87              🏌️ Hobby               │
│  H-I         88-93              🌱 Nybegynner          │
│  J-K         94+                🆕 Starter             │
└────────────────────────────────────────────────────────┘
```

**Tillegg:**
- "Hver test har egne krav for hver kategori"
- "Se dine personlige krav under 'Mine tester'"
- Link til KategoriKravContainer

---

### Seksjon 4: Strokes Gained Forklaring

**Formål:** Gjøre SG forståelig for alle nivåer.

**Innhold:**

**Enkelt forklart:**
> "Strokes Gained viser hvor mange slag du sparer (eller taper) sammenlignet med tour-gjennomsnittet. +1.0 betyr du er 1 slag bedre per runde."

**De 4 komponentene:**

```
┌──────────────────────────────────────────────────────────┐
│                    STROKES GAINED                         │
├──────────────────────────────────────────────────────────┤
│                                                           │
│   🚀 Off The Tee (OTT)     │   🎯 Approach (APP)         │
│   Driver og utslag          │   Innspill til green       │
│   ────────────────          │   ────────────────          │
│   Distanse + presisjon      │   Presisjon fra fairway    │
│                                                           │
│   ⛳ Around Green (ARG)     │   🏌️ Putting (PUTT)        │
│   Kortspill rundt green     │   Putter på green          │
│   ────────────────          │   ────────────────          │
│   Chipping, pitching        │   Effektivitet på green    │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

**Tolkning:**
- **+2.0 eller høyere:** Tour-nivå styrke
- **+0.5 til +2.0:** Over gjennomsnittet
- **-0.5 til +0.5:** Gjennomsnittlig
- **-0.5 eller lavere:** Forbedringsområde

---

### Seksjon 5: Slik Fungerer Det

**Formål:** Vise sammenhengen mellom tester og treningsplan.

**Flytdiagram:**

```
┌─────────────────┐
│   DU TAR TEST   │
│   (20 tester)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ RESULTAT LAGRES │
│ og sammenlignes │
│ med kategori-   │
│     krav        │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌───────┐  ┌───────┐
│BESTÅTT│  │IKKE   │
│       │  │BESTÅTT│
└───┬───┘  └───┬───┘
    │          │
    ▼          ▼
┌───────┐  ┌────────────┐
│Styrke │  │Fokusområde │
│       │  │(Breaking   │
│       │  │  Point)    │
└───┬───┘  └─────┬──────┘
    │            │
    └─────┬──────┘
          │
          ▼
┌─────────────────────┐
│  TRENINGSPLAN       │
│  TILPASSES          │
│  ───────────────    │
│  • Mer fokus på     │
│    svake områder    │
│  • Vedlikehold av   │
│    styrker          │
└─────────────────────┘
```

**Nøkkelpunkter:**
1. "Tester avdekker dine styrker og svakheter"
2. "Svake områder blir 'Breaking Points' som får ekstra fokus"
3. "Treningsplanen oppdateres automatisk"
4. "Test regelmessig for å spore fremgang"

---

## 4. Teknisk Implementasjon

### 4.1 Filstruktur
```
apps/web/src/features/stats-guide/
├── index.ts
├── StatsGuidePage.tsx          # Hovedkomponent
├── components/
│   ├── HeroSection.tsx         # Hero med CTA
│   ├── TestOverview.tsx        # 20 tester oversikt
│   ├── CategoryExplainer.tsx   # A-K kategori forklaring
│   ├── StrokesGainedGuide.tsx  # SG forklaring
│   ├── HowItWorks.tsx          # Flytdiagram
│   └── TestCategoryCard.tsx    # Gjenbrukbar kort
└── styles/
    └── stats-guide.css         # (eller Tailwind)
```

### 4.2 Routing
```jsx
// I App.jsx, under /stats
<Route path="/stats/guide" element={<StatsGuidePage />} />
```

### 4.3 Meny-integrasjon
Legg til i Stats-menyen:
```
Stats
├── Oversikt          (/stats)
├── 📚 Slik fungerer det  (/stats/guide)  ← NY
├── Mine tester       (/testresultater)
├── Turneringsstatistikk (/stats/turnering)
└── Verktøy           (/stats/verktoy)
```

---

## 5. Innholdstekster (Norsk)

### Hero
**Tittel:** "Statistikk & Testing"
**Undertittel:** "Forstå hvordan vi måler og utvikler ditt golfspill"

### Intro
> AK Golf Academy bruker et vitenskapelig testsystem for å kartlegge alle aspekter av golfspillet ditt. Basert på testresultatene dine lager vi en personlig treningsplan som fokuserer på det som gir deg størst forbedring.

### Test-intro
> Vi måler 20 ulike ferdigheter - fra driver-distanse til putting-presisjon. Hver test har klare krav for hver spillerkategori, så du alltid vet hva du jobber mot.

### Kategori-intro
> Din spillerkategori (A-K) bestemmes av ditt gjennomsnittsscore over 18 hull. Kategorien påvirker kravene i testene og nivået på treningsplanen din.

### SG-intro
> Strokes Gained er en moderne måte å analysere golfspillet på. I stedet for å bare telle slag, viser SG hvor mye verdi du skaper (eller taper) i hver del av spillet.

### Flyt-intro
> Testene dine styrer treningsplanen automatisk. Når du forbedrer deg på en test, justeres fokuset til neste forbedringsområde.

---

## 6. Visuelt Design

### Farger (fra design system)
- **Primær:** `var(--accent)` - For CTA og fremhevinger
- **Kategori A-C:** `var(--success)` - Grønn for elite
- **Kategori D-F:** `var(--warning)` - Gul for middels
- **Kategori G-K:** `var(--text-secondary)` - Grå for nybegynner
- **SG Positiv:** `var(--success)` - Grønn
- **SG Negativ:** `var(--error)` - Rød

### Ikoner (Lucide)
- `Target` - Tester generelt
- `TrendingUp` - Fremgang/SG positiv
- `TrendingDown` - SG negativ
- `Dumbbell` - Fysiske tester
- `Zap` - Hastighet
- `Ruler` - Distanse
- `Circle` - Putting
- `Trophy` - Kategorier/nivåer

### Animasjoner
- Smooth scroll mellom seksjoner
- Fade-in på scroll
- Ekspanderende kort for testdetaljer

---

## 7. Implementasjonsrekkefølge

### Fase 1: Grunnstruktur (2-3 timer)
1. [ ] Opprett StatsGuidePage.tsx med grunnleggende layout
2. [ ] Legg til route i App.jsx
3. [ ] Opprett HeroSection med navigasjon

### Fase 2: Innholdsseksjoner (4-5 timer)
4. [ ] TestOverview med 6 kategorikort
5. [ ] CategoryExplainer med interaktiv tabell
6. [ ] StrokesGainedGuide med 4-komponent diagram
7. [ ] HowItWorks med flytdiagram

### Fase 3: Polish (2-3 timer)
8. [ ] Responsivt design (mobil/tablet/desktop)
9. [ ] Animasjoner og overganger
10. [ ] Lenker til relaterte sider
11. [ ] Testing og finjustering

---

## 8. Suksesskriterier

- [ ] Brukeren forstår hva testene er uten forkunnskaper
- [ ] Brukeren forstår sin kategori (A-K)
- [ ] Brukeren kan tolke Strokes Gained verdier
- [ ] Brukeren forstår hvordan tester påvirker treningsplan
- [ ] Siden er mobilvennlig
- [ ] Alle lenker til relaterte sider fungerer

---

## 9. Relaterte filer å referere til

| Fil | Innhold |
|-----|---------|
| `MATEMATISKE_FORMLER_ALLE_TESTER.md` | Alle formler og krav |
| `SAMMENHENG_TESTER_OG_PLANER.md` | Test → Plan sammenheng |
| `Testprotokoll.jsx` | Eksisterende testprotokoll UI |
| `StatsPage.tsx` | Eksisterende stats dashboard |
| `test-calculator.ts` | Backend beregningslogikk |

---

*Plan opprettet: 2025-01-XX*
*Estimert tid: 8-11 timer*
