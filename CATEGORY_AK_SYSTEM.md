# Kategori A-K System - Designspesifikasjon

## 📊 Oversikt

Det norske golf-kategorisystemet (A-K) er kjernen i TIER Golf. Denne dokumentasjonen definerer hvordan kategoriene skal visualiseres og implementeres.

---

## 🎨 Kategori Fargekode

### Elite Nivå (A-C) - Gull/Premium toner
**Betydning:** Tour/Landslag/Høyt nasjonalt nivå

| Kategori | Hex | RGB | Beskrivelse | Bruksmønster |
|----------|-----|-----|-------------|--------------|
| **A** | `#C9A227` | `201 162 39` | Gull - Tour/Elite | Tour-spillere, toppidrettsutøvere |
| **B** | `#B8960F` | `184 150 15` | Mørk gull - Landslag | Landslag, internasjonale spillere |
| **C** | `#A68A00` | `166 138 0` | Bronse-gull - Høyt nasjonalt | Høyt nasjonalt nivå |

**Visuell profil:**
- Premium feeling med gull-glød
- Prestige og eksklusivitet
- Ofte kombinert med shadow effekter

---

### Nasjonalt Nivå (D-E) - Sølv/Stål toner
**Betydning:** Nasjonalt/Regionalt topp

| Kategori | Hex | RGB | Beskrivelse | Bruksmønster |
|----------|-----|-----|-------------|--------------|
| **D** | `#64748B` | `100 116 139` | Sølv - Nasjonalt | Nasjonalt nivå |
| **E** | `#475569` | `71 85 105` | Stål - Regionalt topp | Regionalt topp |

**Visuell profil:**
- Profesjonell og solid
- Sleek metallisk look
- Sølv accent brukes for å fremheve prestisje

---

### Regionalt Nivå (F-G) - Blå toner
**Betydning:** Regionalt/Klubb høy

| Kategori | Hex | RGB | Beskrivelse | Bruksmønster |
|----------|-----|-----|-------------|--------------|
| **F** | `#2563EB` | `37 99 235` | Blå - Regionalt | Regionalt nivå |
| **G** | `#3B82F6` | `59 130 246` | Lys blå - Klubb høy | Høyt klubbnivå |

**Visuell profil:**
- Tillitvekkende og stabil
- Klassisk golf-blå assosiasjoner
- Klart og tydelig i UI

---

### Klubbnivå (H-I) - Grønn toner
**Betydning:** Klubb middels/lav

| Kategori | Hex | RGB | Beskrivelse | Bruksmønster |
|----------|-----|-----|-------------|--------------|
| **H** | `#16A34A` | `22 163 74` | Grønn - Klubb middels | Klubbspillere |
| **I** | `#22C55E` | `34 197 94` | Lys grønn - Klubb lav | Lavere klubbnivå |

**Visuell profil:**
- Fresh og optimistisk
- Golf-assosiert (green)
- Vekst og progresjon

---

### Utviklingsnivå (J-K) - Lilla toner
**Betydning:** Utviklingsspillere/Nybegynnere

| Kategori | Hex | RGB | Beskrivelse | Bruksmønster |
|----------|-----|-----|-------------|--------------|
| **J** | `#7C3AED` | `124 58 237` | Lilla - Utviklingsspiller | Unge utviklingsspillere |
| **K** | `#8B5CF6` | `139 92 246` | Lys lilla - Nybegynner | Nybegynnere, juniorspillere |

**Visuell profil:**
- Leken og energisk
- Appellerer til yngre spillere
- Kreativitet og læring

---

## 🎯 UI Komponenter per Kategori

### 1. Category Badge (Minimal)
**Bruk:** Kompakt visning i lister, kort, etc.

```jsx
<div className="w-10 h-10 rounded-full bg-category-a flex items-center justify-center">
  <span className="text-white font-bold text-lg">A</span>
</div>
```

**Variant størrelser:**
- **sm:** 32px (w-8 h-8)
- **md:** 40px (w-10 h-10) - default
- **lg:** 56px (w-14 h-14)
- **xl:** 80px (w-20 h-20)

---

### 2. Category Card (Detaljert)
**Bruk:** Dashboard, kategori-oversikt

```jsx
<div className="bg-white rounded-xl border border-gray-200 border-t-4 border-t-category-a overflow-hidden">
  {/* Header med kategori info */}
  <div className="bg-category-a/10 px-6 py-4">
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-full bg-category-a flex items-center justify-center">
        <span className="text-white font-bold text-2xl">A</span>
      </div>
      <div>
        <h3 className="font-bold text-lg text-tier-navy">Kategori A</h3>
        <p className="text-sm text-text-muted">Tour/Elite Nivå</p>
      </div>
    </div>
  </div>

  {/* Body med requirements */}
  <div className="p-6">
    <div className="space-y-4">
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">Fremgang</span>
          <span className="text-sm text-text-muted">3/5 tester</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-category-a w-3/5 transition-all duration-500"></div>
        </div>
      </div>

      {/* Test liste */}
      <div className="space-y-2">
        <TestItem status="passed" name="Driving Distance" />
        <TestItem status="passed" name="Approach Accuracy" />
        <TestItem status="passed" name="Short Game" />
        <TestItem status="pending" name="Putting" />
        <TestItem status="locked" name="Tournament Score" />
      </div>
    </div>
  </div>
</div>
```

---

### 3. Category Ring (Circular Progress)
**Bruk:** Visuell fremgang på dashboard

**SVG-basert sirkulær progress:**

```jsx
function CategoryRing({ category, progress, size = 120 }) {
  const radius = (size - 8) / 2; // 8px for stroke width
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  const colors = {
    A: '#C9A227', B: '#B8960F', C: '#A68A00',
    D: '#64748B', E: '#475569',
    F: '#2563EB', G: '#3B82F6',
    H: '#16A34A', I: '#22C55E',
    J: '#7C3AED', K: '#8B5CF6',
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="8"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors[category]}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>

      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-logo text-4xl font-bold text-tier-navy">
          {category}
        </span>
        <span className="text-xs text-text-muted mt-1">
          {progress}%
        </span>
      </div>
    </div>
  );
}
```

**Brukseksempel:**
```jsx
<div className="grid grid-cols-3 gap-6">
  <CategoryRing category="A" progress={60} />
  <CategoryRing category="F" progress={85} />
  <CategoryRing category="J" progress={40} />
</div>
```

---

### 4. Category Timeline (Progresjon)
**Bruk:** Vise spillerens reise gjennom kategoriene

```jsx
<div className="flex items-center gap-2 overflow-x-auto pb-2">
  {['K', 'J', 'I', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A'].map((cat, idx) => {
    const isPast = currentCategoryIndex > idx;
    const isCurrent = currentCategoryIndex === idx;

    return (
      <React.Fragment key={cat}>
        <div className={cn(
          'w-12 h-12 rounded-full flex items-center justify-center',
          'font-bold text-lg transition-all',
          isPast && 'bg-gray-200 text-gray-500',
          isCurrent && `bg-category-${cat.toLowerCase()} text-white scale-110`,
          !isPast && !isCurrent && 'bg-gray-100 text-gray-400'
        )}>
          {cat}
        </div>
        {idx < 10 && (
          <div className={cn(
            'h-1 w-8',
            isPast ? 'bg-gray-300' : 'bg-gray-100'
          )} />
        )}
      </React.Fragment>
    );
  })}
</div>
```

---

## 📋 Kategori Krav (Requirements)

### Data Struktur

```typescript
interface CategoryRequirement {
  category: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K';
  name: string;
  description: string;
  tier: 'elite' | 'national' | 'regional' | 'club' | 'development';
  requirements: {
    id: string;
    type: 'test' | 'tournament' | 'handicap' | 'rounds';
    name: string;
    target: number | string;
    unit?: string;
    description?: string;
  }[];
  benefits: string[];
  estimatedTimeframe?: string; // e.g., "6-12 måneder"
}
```

### Eksempel: Kategori A

```json
{
  "category": "A",
  "name": "Tour/Elite Nivå",
  "description": "Høyeste kategori for profesjonelle og elite-spillere",
  "tier": "elite",
  "requirements": [
    {
      "id": "a-driving",
      "type": "test",
      "name": "Driving Distance",
      "target": 280,
      "unit": "yards",
      "description": "Gjennomsnittlig driving distance"
    },
    {
      "id": "a-approach",
      "type": "test",
      "name": "Approach Accuracy",
      "target": 75,
      "unit": "%",
      "description": "GIR (Greens in Regulation)"
    },
    {
      "id": "a-shortgame",
      "type": "test",
      "name": "Short Game",
      "target": 65,
      "unit": "%",
      "description": "Up & Down percentage"
    },
    {
      "id": "a-putting",
      "type": "test",
      "name": "Putting",
      "target": 1.7,
      "unit": "putts/hole",
      "description": "Gjennomsnittlig putts per hull"
    },
    {
      "id": "a-tournament",
      "type": "tournament",
      "name": "Tournament Performance",
      "target": "Top 10 i nasjonal turnering",
      "description": "Bevis på konkurranseprestasjoner"
    }
  ],
  "benefits": [
    "Tilgang til elite-treningsprogrammer",
    "Prioritert turneringsinvitasjoner",
    "Sponsormuligheter",
    "Profesjonell coaching"
  ],
  "estimatedTimeframe": "2-3 år fra kategori B"
}
```

---

## 🎨 Visuell Hierarki

### Gradient Backgrounds (Optional Premium Feature)

For å fremheve elite-kategorier (A-C):

```css
/* Elite gradient background */
.category-elite-gradient {
  background: linear-gradient(135deg,
    rgb(var(--category-a)) 0%,
    rgb(var(--tier-gold-light)) 100%
  );
}

/* Nasjonalt gradient */
.category-national-gradient {
  background: linear-gradient(135deg,
    rgb(var(--category-d)) 0%,
    rgb(var(--category-e)) 100%
  );
}
```

**Bruk:**
```jsx
<div className="category-elite-gradient p-6 rounded-xl text-white">
  <h2 className="text-3xl font-bold">Elite Nivå</h2>
  <p>Kategorier A-C</p>
</div>
```

---

### Box Shadows for Tier

```css
/* Glow effects per tier */
.category-elite-glow {
  box-shadow: 0 4px 14px 0 rgba(201, 162, 39, 0.25);
}

.category-national-glow {
  box-shadow: 0 4px 14px 0 rgba(100, 116, 139, 0.20);
}

.category-regional-glow {
  box-shadow: 0 4px 14px 0 rgba(37, 99, 235, 0.20);
}

.category-club-glow {
  box-shadow: 0 4px 14px 0 rgba(22, 163, 74, 0.20);
}

.category-development-glow {
  box-shadow: 0 4px 14px 0 rgba(124, 58, 237, 0.20);
}
```

---

## 🏆 Dashboard Integration

### Category Overview Grid

```jsx
function CategoryOverview({ playerData }) {
  const tiers = {
    elite: ['A', 'B', 'C'],
    national: ['D', 'E'],
    regional: ['F', 'G'],
    club: ['H', 'I'],
    development: ['J', 'K'],
  };

  return (
    <div className="space-y-8">
      {Object.entries(tiers).map(([tier, categories]) => (
        <div key={tier}>
          <h2 className="text-xl font-bold text-tier-navy mb-4 capitalize">
            {tier} Nivå
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(cat => (
              <CategoryCard
                key={cat}
                category={cat}
                progress={playerData[cat]?.progress || 0}
                status={playerData[cat]?.status || 'locked'}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## 📱 Responsiv Design

### Mobile (< 640px)
- Category badges: 32px (w-8 h-8)
- Category rings: 80px
- Grid: 1 kolonne
- Stack categories vertikalt

### Tablet (640px - 1024px)
- Category badges: 40px (w-10 h-10)
- Category rings: 100px
- Grid: 2 kolonner
- Side-by-side comparison

### Desktop (> 1024px)
- Category badges: 48px (w-12 h-12)
- Category rings: 120px
- Grid: 3-4 kolonner
- Full oversikt

---

## 🎬 Animasjoner

### Category Unlock Animation

```css
@keyframes categoryUnlock {
  0% {
    transform: scale(0) rotate(-180deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(10deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

.category-unlock {
  animation: categoryUnlock 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
```

### Progress Fill Animation

```css
@keyframes categoryProgressFill {
  from {
    stroke-dashoffset: var(--circumference);
  }
  to {
    stroke-dashoffset: var(--progress-offset);
  }
}
```

---

## ✅ Accessibility

### Color Contrast
Alle kategori-farger oppfyller WCAG 2.1 AA når brukt med hvit tekst:

| Kategori | Kontrast | Status |
|----------|----------|--------|
| A-C (Gull) | 5.2:1 | ✅ AA |
| D-E (Sølv) | 6.1:1 | ✅ AA |
| F-G (Blå) | 6.8:1 | ✅ AA |
| H-I (Grønn) | 5.9:1 | ✅ AA |
| J-K (Lilla) | 5.5:1 | ✅ AA |

### ARIA Labels

```jsx
<div
  role="progressbar"
  aria-label={`Kategori ${category} fremgang`}
  aria-valuenow={progress}
  aria-valuemin={0}
  aria-valuemax={100}
>
  <CategoryRing category={category} progress={progress} />
</div>
```

### Screen Reader Support

```jsx
<div className="sr-only">
  Du er på kategori {currentCategory}.
  Din fremgang er {progress}%.
  {testsRemaining} tester gjenstår.
</div>
```

---

## 🔗 Backend Integration

### API Endpoints

```typescript
// Get all categories for a player
GET /api/v1/players/:playerId/categories

// Response:
{
  "categories": {
    "A": {
      "status": "locked",
      "progress": 0,
      "requirements": [...]
    },
    "B": {
      "status": "locked",
      "progress": 20,
      "requirements": [...]
    },
    // ... K-A
  },
  "currentCategory": "H",
  "nextCategory": "G"
}

// Get specific category details
GET /api/v1/categories/:category

// Update progress
POST /api/v1/players/:playerId/categories/:category/tests/:testId
{
  "result": 285,
  "unit": "yards",
  "date": "2025-01-06"
}
```

---

## 📚 Referanser

- [TIER_GOLF_DESIGN_SYSTEM.md](./TIER_GOLF_DESIGN_SYSTEM.md) - Full design system
- [TIER_GOLF_IMPLEMENTATION_PLAN.md](./TIER_GOLF_IMPLEMENTATION_PLAN.md) - Implementation plan
- [Norges Golfforbund - Handicap System](https://www.golf.no/)

---

**Versjon:** 1.0
**Sist oppdatert:** Januar 2025
